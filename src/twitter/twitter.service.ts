import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import * as OAuth from 'oauth';
import { lastValueFrom } from 'rxjs';
import { TwitterApi } from 'twitter-api-v2';
import { AccessTokenDto, PostTweetDto, RequestTokenDto, UserInfoDto } from './dto/twitter.dto'

@Injectable()
export class TwitterService {
  private oauth: OAuth.OAuth;
  private readonly bearerToken: string;
  private twitterClient: TwitterApi;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.twitterClient = new TwitterApi({
      appKey: 'yQz0Y0KcwUKX5MFuwicuYgg29',
      appSecret: 'FWiso9rm3g3vkijwdknr8sdFZCngXYntFjFLxfaaUWi9E4tHtU',
    });
    this.bearerToken = this.configService.get<string>('TWITTER_BEARER_TOKEN');
    this.oauth = new OAuth.OAuth(
      'https://api.twitter.com/oauth/request_token',
      'https://api.twitter.com/oauth/access_token',
      this.configService.get('TWITTER_CONSUMER_KEY'),
      this.configService.get('TWITTER_CONSUMER_SECRET'),
      '1.0A',
      null,
      'HMAC-SHA1',
    );
  }

  async getRequestToken(callbackUrl: string, retryCount = 3): Promise<RequestTokenDto> {
    return new Promise((resolve, reject) => {
      const attemptRequest = (retriesLeft: number) => {
        this.oauth.getOAuthRequestToken(
          // { oauth_callback: callbackUrl },
          (error, oauthToken, oauthTokenSecret) => {
            if (error) {
              console.error('Error getting request token:', error);
              if (retriesLeft > 0 && error.code === 'ECONNRESET') {
                console.log(`Retrying... (${retriesLeft} attempts left)`);
                return setTimeout(() => attemptRequest(retriesLeft - 1), 1000);
              }
              return reject(error);
            }

            const result: RequestTokenDto = { oauthToken, oauthTokenSecret };
            resolve(result);
          },
        );
      };

      attemptRequest(retryCount);
    });
  }

  async getAccessToken(
    oauthToken: string,
    oauthTokenSecret: string,
    oauthVerifier: string,
  ): Promise<AccessTokenDto> {
    return new Promise((resolve, reject) => {
      this.oauth.getOAuthAccessToken(
        oauthToken,
        oauthTokenSecret,
        oauthVerifier,
        (error, oauthAccessToken, oauthAccessTokenSecret) => {
          if (error) {
            return reject(error);
          }
          const result: AccessTokenDto = { oauthAccessToken, oauthAccessTokenSecret };
          resolve(result);
        },
      );
    });
  }

  async postTweet(oauthAccessToken: string, oauthAccessTokenSecret: string, tweetDto: PostTweetDto): Promise<any> {
    try {
      const client = new TwitterApi({
        appKey: 'yQz0Y0KcwUKX5MFuwicuYgg29',
        appSecret: 'FWiso9rm3g3vkijwdknr8sdFZCngXYntFjFLxfaaUWi9E4tHtU',
        accessToken: oauthAccessToken,
        accessSecret: oauthAccessTokenSecret,
      });

      const tweetResponse = await client.v1.tweet(tweetDto.tweet);
      return tweetResponse;
    } catch (error) {
      throw error;
    }
  }

  async getUserInfo(oauthAccessToken: string, oauthAccessTokenSecret: string): Promise<UserInfoDto> {
    try {
      const userClient = new TwitterApi({
        appKey: 'yQz0Y0KcwUKX5MFuwicuYgg29',
        appSecret: 'FWiso9rm3g3vkijwdknr8sdFZCngXYntFjFLxfaaUWi9E4tHtU',
        accessToken: oauthAccessToken,
        accessSecret: oauthAccessTokenSecret,
      });

      const user = await userClient.v2.me();
      const userInfo: UserInfoDto = {
        id: user.data.id,
        name: user.data.name,
        username: user.data.username,
        followers_count: user.data.public_metrics.followers_count,
        following_count: user.data.public_metrics.following_count,
        tweet_count: user.data.public_metrics.tweet_count,
      };
      return userInfo;
    } catch (error) {
      console.error('Error fetching user info:', error);
      throw error;
    }
  }
}
