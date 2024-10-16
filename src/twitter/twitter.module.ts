import { Module } from '@nestjs/common';
import { TwitterService } from './twitter.service';
import { TwitterController } from './twitter.controller';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ConfigModule.forRoot(), 
    HttpModule,  
  ],
  providers: [TwitterService],
  controllers: [TwitterController]
})
export class TwitterModule {}
