import { Injectable} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import * as OAuth from 'oauth';
import { lastValueFrom } from 'rxjs';
import { TwitterApi } from 'twitter-api-v2'; 
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

  async getRequestToken(callbackUrl: string, retryCount = 3): Promise<any> {
    return new Promise((resolve, reject) => {
      const attemptRequest = (retriesLeft: number) => {
        this.oauth.getOAuthRequestToken(
          { oauth_callback: callbackUrl },
          (error, oauthToken, oauthTokenSecret, results) => {
            if (error) {
              console.error('Error getting request token:', error);
              if (retriesLeft > 0 && error.code === 'ECONNRESET') {
                console.log(`Retrying... (${retriesLeft} attempts left)`);
                return setTimeout(() => attemptRequest(retriesLeft - 1), 1000);
              }
              return reject(error);
            }
  
            resolve({ oauthToken, oauthTokenSecret });
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
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      this.oauth.getOAuthAccessToken(
        oauthToken,
        oauthTokenSecret,
        oauthVerifier,
        (error, oauthAccessToken, oauthAccessTokenSecret, results) => {
          if (error) {
            return reject(error);
          }
          resolve({ oauthAccessToken, oauthAccessTokenSecret });
        },
      );
    });
  }



  async postTweet(oauthAccessToken: string, oauthAccessTokenSecret: string, tweet: string): Promise<any> {
    try {
      const client = new TwitterApi({
        appKey: 'yQz0Y0KcwUKX5MFuwicuYgg29',
        appSecret: 'FWiso9rm3g3vkijwdknr8sdFZCngXYntFjFLxfaaUWi9E4tHtU',
        accessToken: oauthAccessToken,
        accessSecret: oauthAccessTokenSecret,
      });

      const tweetResponse = await client.v1.tweet(tweet); 
      return tweetResponse;
    } catch (error) {
      throw error; 
    }
  }

  async getUserInfo(oauthAccessToken: string, oauthAccessTokenSecret: string): Promise<any> {
    try {
      
      const userClient = new TwitterApi({
        appKey: 'yQz0Y0KcwUKX5MFuwicuYgg29',
        appSecret: 'FWiso9rm3g3vkijwdknr8sdFZCngXYntFjFLxfaaUWi9E4tHtU',
        accessToken: oauthAccessToken,
        accessSecret: oauthAccessTokenSecret,
      });

    
      const user = await userClient.v2.me();
      return user;
    } catch (error) {
      console.error('Error fetching user info:', error);
      throw error; 
    }
  }
}




// async getFollowers(userId: string): Promise<any> {
//     const url = `https://api.twitter.com/2/users/${userId}/followers`;

//     try {
//       const response = await lastValueFrom(
//         this.httpService.get(url, {
//           headers: {
//             Authorization: `Bearer ${this.bearerToken}`,
//           },
//         }),
//       );
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching followers:', error);
//       throw error;
//     }
//   }

//   // Method to post a tweet using API v2
//   async postTweet(tweet: string): Promise<any> {
//     const url = 'https://api.twitter.com/2/tweets';

//     try {
//       const response = await lastValueFrom(
//         this.httpService.post(
//           url,
//           { text: tweet }, // API v2 uses "text" instead of "status"
//           {
//             headers: {
//               Authorization: `Bearer ${this.bearerToken}`,
//               'Content-Type': 'application/json',
//             },
//           },
//         ),
//       );
//       return response.data;
//     } catch (error) {
//       console.error('Error posting tweet:', error);
//       throw error;
//     }
//   }

// }
