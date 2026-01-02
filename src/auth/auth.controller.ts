import { Controller, Get, Req, UseGuards, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { TokenDto } from './dto/token.dto';
import type { Response } from 'express';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private usersService: UsersService, private authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Start Google OAuth2 flow' })
  async googleAuth() {
    // initiates the Google OAuth2 login flow
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Google OAuth2 callback - redirects to frontend with JWT token' })
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
}
