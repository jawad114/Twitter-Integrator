import { Controller, Get, Query, Req, Res } from '@nestjs/common';
import { TwitterService } from './twitter.service';
import { Response } from 'express';

@Controller('twitter')
export class TwitterController {
  constructor(private readonly twitterService: TwitterService) {}


  @Get('request-token')
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
  async accessToken(
    @Query('oauth_token') oauthToken: string,
    @Query('oauth_verifier') oauthVerifier: string,
    @Query('oauth_token_secret') oauthTokenSecret: string,
    @Res() res: Response,
  ) {

    console.log('Received oauthToken:', oauthToken);
    console.log('Received oauthVerifier:', oauthVerifier);
    console.log('Received oauthTokenSecret:', oauthTokenSecret);
    
    try {
      const tokenData = await this.twitterService.getAccessToken(
        oauthToken,
        oauthTokenSecret,
        oauthVerifier,
      );
      

      return res.json({
        oauthAccessToken: tokenData.oauthAccessToken,
        oauthAccessTokenSecret: tokenData.oauthAccessTokenSecret,
      });
    } catch (error) {
      console.error('Error getting access token', error);
      return res.status(500).json({ message: 'Error getting access token' });
    }
  }

//   @Get('followers')
//   async getFollowers(
//     @Query('oauthAccessToken') oauthAccessToken: string,
//     @Query('oauthAccessTokenSecret') oauthAccessTokenSecret: string,
//     @Res() res: Response,
//   ) {
//     try {
//       const followers = await this.twitterService.getFollowers(oauthAccessToken, oauthAccessTokenSecret);
//       return res.json(followers);
//     } catch (error) {
//       console.error('Error fetching followers:', error);

//       if (error.code === 'ECONNRESET') {
//         return res.status(500).json({ message: 'Connection reset by Twitter API. Please retry.' });
//       }
  
//       return res.status(500).json({ message: 'Error fetching followers', details: error.message });
//     }
//   }
  


//   @Get('tweet')
//   async postTweet(
//     @Query('oauthAccessToken') oauthAccessToken: string,
//     @Query('oauthAccessTokenSecret') oauthAccessTokenSecret: string,
//     @Query('tweet') tweet: string,
//     @Res() res: Response,
//   ) {

//     console.log('Received tweet:', tweet);

//     try {
//       const tweetResponse = await this.twitterService.postTweet(oauthAccessToken, oauthAccessTokenSecret, tweet);
//       return res.json(tweetResponse);
//     } catch (error) {
//       console.error('Error posting tweet', error);
//       return res.status(500).json({ message: 'Error posting tweet' });
//     }
//   }
// }




@Get('followers')
async getFollowers(
  @Query('userId') userId: string,  // We need userId for API v2
  @Res() res: Response,
) {
  try {
    // Only pass the userId as parameter for the Twitter API v2 version
    const followers = await this.twitterService.getFollowers(userId);
    return res.json(followers);
  } catch (error) {
    console.error('Error fetching followers:', error);

    if (error.code === 'ECONNRESET') {
      return res.status(500).json({ message: 'Connection reset by Twitter API. Please retry.' });
    }

    return res.status(500).json({ message: 'Error fetching followers', details: error.message });
  }
}

@Get('tweet')
async postTweet(
  @Query('tweet') tweet: string,  // No need for oauth tokens, only tweet content
  @Res() res: Response,
) {
  console.log('Received tweet:', tweet);

  try {
    // Only pass the tweet content for API v2
    const tweetResponse = await this.twitterService.postTweet(tweet);
    return res.json(tweetResponse);
  } catch (error) {
    console.error('Error posting tweet', error);
    return res.status(500).json({ message: 'Error posting tweet' });
  }
}
}