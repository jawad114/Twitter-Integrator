import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class GoogleController {
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {
    // Guard redirects to Google Login page
  }

  @Get('/profile')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req) {
    console.log('google redirect', req.user);
    return {
      message: 'User information from Google',
      user: req.user,
    };
  }
}
