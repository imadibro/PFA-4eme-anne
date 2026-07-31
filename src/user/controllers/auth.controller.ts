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
import express from 'express';
import { JwtAuthGuard } from 'src/common';
import { CurrentUser, Public } from 'src/common/decorators';
import type { AccessTokenType, JWTPayloadType } from 'src/common/type/type';
import { LoginDto } from '../dto/login.dto';
import { CreateUserPayload } from '../payload';
import { AuthService } from '../services/auth.service';

@Controller('user/auth')
export class AuthController {
  logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  // add registre methode to create new user
  @Post('register')
  @Public()
  @HttpCode(HttpStatus.OK)
  async register(@Body() registerPayload: CreateUserPayload): Promise<AccessTokenType> {
    return this.authService.register(registerPayload);
  }

  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: express.Response) {
    const { accessToken, refreshToken } = await this.authService.login(loginDto);
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
  async refresh(@Req() req: express.Request) {
    const refreshToken = req.cookies['refresh_token'];
    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token provided');
    }

    return this.authService.refreshAccessToken(refreshToken);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@CurrentUser() user: JWTPayloadType, @Res({ passthrough: true }) res: express.Response) {
    await this.authService.logout(user.id);
    res.clearCookie('refresh_token');
    return { message: 'Logged out successfully' };
  }
}
