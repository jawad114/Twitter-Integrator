import { ApiProperty } from '@nestjs/swagger';

export class AccessTokenDto {
  @ApiProperty({
    description: 'OAuth Access Token for authenticating API requests',
    example: 'your-oauth-access-token',
  })
  oauthAccessToken: string;

  @ApiProperty({
    description: 'OAuth Access Token Secret',
    example: 'your-oauth-access-token-secret',
  })
  oauthAccessTokenSecret: string;
}

export class PostTweetDto {
  @ApiProperty({
    description: 'Content of the tweet to be posted',
    example: 'This is a sample tweet!',
  })
  tweet: string;
}

export class RequestTokenDto {
  @ApiProperty({
    description: 'OAuth token returned from the request token endpoint',
    example: 'your-oauth-token',
  })
  oauthToken: string;

  @ApiProperty({
    description: 'OAuth token secret associated with the request token',
    example: 'your-oauth-token-secret',
  })
  oauthTokenSecret: string;
}

export class UserInfoDto {
  @ApiProperty({
    description: 'User ID from Twitter',
    example: '1234567890',
  })
  id: string;

  @ApiProperty({
    description: 'Name of the Twitter user',
    example: 'John Doe',
  })
  name: string;

  @ApiProperty({
    description: 'Username of the Twitter user',
    example: 'johndoe',
  })
  username: string;

  @ApiProperty({
    description: 'Number of followers the user has',
    example: 100,
  })
  followers_count: number;

  @ApiProperty({
    description: 'Number of accounts the user is following',
    example: 200,
  })
  following_count: number;

  @ApiProperty({
    description: 'Total number of tweets by the user',
    example: 50,
  })
  tweet_count: number;
}
