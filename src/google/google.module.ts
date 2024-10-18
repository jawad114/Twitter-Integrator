import { Module } from '@nestjs/common';
import { GoogleController } from './google.controller';
import { GoogleService } from './google.service';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { GoogleStrategy } from './strategy/google.strategy';
@Module({
  imports: [PassportModule.register({ defaultStrategy: 'google' }),ConfigModule],
  exports: [],
  controllers: [GoogleController],
  providers: [GoogleService,GoogleStrategy]
})
export class GoogleModule {}
