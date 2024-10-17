import { Controller, Get, Query } from '@nestjs/common';
import { HubspotService } from './hubspot.service';
import { ApiTags, ApiResponse, ApiQuery } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class HubspotController {
  constructor(private authService: HubspotService) {}

  @Get('url')
  @ApiResponse({ status: 200, description: 'Returns the authorization URL.' })
  getAuthUrl() {
    return { url: this.authService.getAuthUrl() };
  }

  @Get('callback')
  @ApiResponse({ status: 200, description: 'Handles the OAuth callback and returns tokens.' })
  @ApiQuery({ name: 'code', required: true, description: 'The authorization code from the OAuth callback.' })
  async handleCallback(@Query('code') code: string) {
    const tokens = await this.authService.handleCallback(code);
    return tokens; 
  }

  @Get('contacts')
  @ApiResponse({ status: 200, description: 'Fetches contacts using the provided access token.' })
  @ApiQuery({ name: 'accessToken', required: true, description: 'The access token for the HubSpot API.' })
  async getContacts(@Query('accessToken') accessToken: string) {
    return this.authService.fetchContacts(accessToken);
  }
}
