import { Controller, Get, Query } from '@nestjs/common';
import { HubspotService } from './hubspot.service';

@Controller('auth')
export class HubspotController {
  constructor(private authService: HubspotService) {}

  @Get('url')
  getAuthUrl() {
    return { url: this.authService.getAuthUrl() };
  }

  @Get('callback')
  async handleCallback(@Query('code') code: string) {
    const tokens = await this.authService.handleCallback(code);
    return tokens; // You might want to store tokens in a database
  }
}
