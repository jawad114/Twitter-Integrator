import { Module } from '@nestjs/common';
import { HubspotController } from './hubspot.controller';
import { HubspotService } from './hubspot.service';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports:[PassportModule, ConfigModule],
  controllers: [HubspotController,],
  providers: [HubspotService,]
})
export class HubspotModule {}
