import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  signToken(userId: number | string) {
    const payload = { id: userId };
    return this.jwtService.sign(payload);
  }
}
