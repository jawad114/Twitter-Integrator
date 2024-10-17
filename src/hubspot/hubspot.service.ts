import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class HubspotService {
  constructor(private configService: ConfigService) {}

  getAuthUrl() {
    const clientId = this.configService.get<string>('HUBSPOT_CLIENT_ID');
    const redirectUri = this.configService.get<string>('HUBSPOT_REDIRECT_URI');
    console.log(clientId, redirectUri);
    const scopes = [
      'crm.objects.contacts.read' 
    ].join(',');
    return `https://app.hubspot.com/oauth/authorize?client_id=${clientId}&scope=${scopes}&redirect_uri=${redirectUri}`;
  }

  async handleCallback(code: string) {
    const clientId = this.configService.get<string>('HUBSPOT_CLIENT_ID');
    const clientSecret = this.configService.get<string>('HUBSPOT_CLIENT_SECRET');
    console.log(clientId, clientSecret);
    const response = await axios.post('https://api.hubapi.com/oauth/v1/token', null, {
      params: {
        grant_type: 'authorization_code',
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: this.configService.get<string>('HUBSPOT_REDIRECT_URI'),
        code,
      },
    });

    return response.data;
  }

  async fetchContacts(accessToken: string) {
    const response = await axios.get('https://api.hubapi.com/crm/v3/objects/contacts', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data; // Return the contacts data
  }

}
