import { Controller, Get, Query, Body, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { TwitterService } from './twitter.service';
import { AccessTokenDto, PostTweetDto, RequestTokenDto } from './dto/twitter.dto';
import { Response } from 'express';

@ApiTags('Twitter')
@Controller('twitter')
export class TwitterController {
  constructor(private readonly twitterService: TwitterService) {}

  @Get('request-token')
  @ApiOperation({ summary: 'Get a request token for Twitter OAuth' })
  @ApiResponse({ status: 200, description: 'Request token successfully retrieved' })
  @ApiResponse({ status: 500, description: 'Error getting request token' })
  async requestToken(@Query('callback') callbackUrl: string, @Res() res: Response) {
    try {
      const tokenData = await this.twitterService.getRequestToken(callbackUrl);
      const authUrl = `https://api.twitter.com/oauth/authorize?oauth_token=${tokenData.oauthToken}`;
      return res.json({
        oauthToken: tokenData.oauthToken,
        oauthTokenSecret: tokenData.oauthTokenSecret,
        authUrl,
      });
    } catch (error) {
      console.error('Error getting request token', error);
      return res.status(500).json({ message: 'Error getting request token' });
    }
  }

  @Get('access-token')
  @ApiOperation({ summary: 'Get access token after OAuth' })
  async accessToken(
    @Query() dto: AccessTokenDto,
    @Query('oauth_verifier') oauthVerifier: string,
    @Res() res: Response,
  ) {
    try {
      const tokenData = await this.twitterService.getAccessToken(
        dto.oauthAccessToken,
        dto.oauthAccessTokenSecret,
        oauthVerifier,
      );

      return res.json(tokenData);
    } catch (error) {
      console.error('Error getting access token', error);
      return res.status(500).json({ message: 'Error getting access token' });
    }
  }

  @Get('tweet')
  @ApiOperation({ summary: 'Post a tweet' })
  async postTweet(
    @Query() dto: AccessTokenDto,
    @Body() postTweetDto: PostTweetDto,
    @Res() res: Response,
  ) {
    try {
      const tweetResponse = await this.twitterService.postTweet(
        dto.oauthAccessToken,
        dto.oauthAccessTokenSecret,
        postTweetDto,
      );
      return res.json(tweetResponse);
    } catch (error) {
      console.error('Error posting tweet', error);
      return res.status(500).json({ message: 'Error posting tweet', details: error.message });
    }
  }

  @Get('me')
  @ApiOperation({ summary: 'Get authenticated user info' })
  async getAuthenticatedUserInfo(
    @Query() dto: AccessTokenDto,
    @Res() res: Response,
  ) {
    try {
      const userInfo = await this.twitterService.getUserInfo(dto.oauthAccessToken, dto.oauthAccessTokenSecret);
      return res.json(userInfo);
    } catch (error) {
      console.error('Error fetching user info:', error);
      return res.status(500).json({ message: 'Error fetching user info', details: error.message });
    }
  }
}
