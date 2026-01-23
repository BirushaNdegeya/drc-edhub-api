import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import type { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Start Google OAuth2 authentication flow' })
  @ApiResponse({ status: 302, description: 'Redirects to Google login page' })
  async googleAuth() {
    // initiates the Google OAuth2 login flow
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({
    summary: 'Google OAuth2 callback - redirects to frontend with JWT token',
  })
  @ApiResponse({
    status: 302,
    description: 'Redirects to frontend with access token in query parameter',
  })
  @ApiResponse({
    status: 401,
    description: 'Google authentication failed',
  })
  async googleAuthRedirect(@Req() req: any, @Res() res: Response) {
    const profile = req.user;
    const user = await this.usersService.createFromGoogle(profile);
    const token = this.authService.signToken(user.id);

    const frontendBase = process.env.FRONTEND_URL || 'http://localhost:4200';
    const redirectUrl = `${frontendBase.replace(/\/$/, '')}/auth/google/callback?access_token=${encodeURIComponent(
      token,
    )}`;

    return res.redirect(redirectUrl);
  }

  @Post('change-role')
  @ApiOperation({
    summary:
      'Change user role using a secret key (for exceptional/admin scripting use only)',
  })
  @ApiResponse({ status: 200, description: 'Role updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid payload' })
  @ApiResponse({ status: 401, description: 'Invalid secret' })
  async changeRole(
    @Body('email') email: string,
    @Body('role')
    role:
      | 'student'
      | 'instructor'
      | 'admin'
      | 'inspector'
      | 'school-admin',
    @Body('secret') secret: string,
  ) {
    if (!email || !role || !secret) {
      throw new BadRequestException('email, role and secret are required');
    }

    const expectedSecret = this.configService.get<string>('ROLE_SECRET');

    if (!expectedSecret) {
      throw new UnauthorizedException('Server ROLE_SECRET is not configured');
    }

    if (secret !== expectedSecret) {
      throw new UnauthorizedException('Invalid secret');
    }

    const allowedRoles = [
      'student',
      'instructor',
      'admin',
      'inspector',
      'school-admin',
    ] as const;
    if (!allowedRoles.includes(role)) {
      throw new BadRequestException('Invalid role value');
    }

    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    await user.update({ role } as any);

    return { message: 'role updated successfully', email, role };
  }
}
