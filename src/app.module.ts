import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TwitterModule } from './twitter/twitter.module';
import { HubspotModule } from './hubspot/hubspot.module';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { GoogleModule } from './google/google.module';
@Module({
  imports: [ ConfigModule.forRoot({
    isGlobal: true,
  }),
  TwitterModule,
  HubspotModule,
PassportModule,
GoogleModule],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
