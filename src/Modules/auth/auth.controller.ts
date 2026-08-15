import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { Public } from '../../common/guards/public-route.decorator.js';
import type { JWTPayloadType } from '../../common/type/type.js';
import { AuthService } from './auth.service.js';
import { LoginPayload, RegisterPayload } from './payload/register-payload.js';

@Controller('auth')
export class AuthController {
  logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Public()
  @HttpCode(HttpStatus.OK)
  async register(@Body() registerPayload: RegisterPayload): Promise<{ accessToken: string }> {
    return this.authService.register(registerPayload);
  }

  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginPayload: LoginPayload, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken } = await this.authService.login(loginPayload);
    //  Cookie HttpOnly
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: true, //  true in production
      sameSite: 'lax', // 'lax' or 'strict' in production
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours comme JWT_REFRESH_EXPIRES_IN
      path: '/'
    });
    return { accessToken };
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refresh(@Req() req: Request) {
    const refreshToken = req.cookies['refresh_token'];
    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token provided');
    }

    return this.authService.refreshAccessToken(refreshToken);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@CurrentUser() user: JWTPayloadType, @Res({ passthrough: true }) res: Response) {
    await this.authService.logout(user.id);
    res.clearCookie('refresh_token');
    return { message: 'Logged out successfully' };
  }
}
