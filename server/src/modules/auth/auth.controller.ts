import { Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-in')
  async signIn() {
    return this.authService.signIn();
  }

  @Post('/sign-up')
  async signUp() {
    return this.authService.signUp();
  }
}
