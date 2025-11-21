export interface SocialLoginRequest {
  social_type: 'google' | 'facebook';
  token: string;
}

export interface SocialLoginResponse {
  success: boolean;
  message: string;
  data?: {
    token: string;
    user: {
      id: string;
      name: string;
      email: string;
      picture?: string;
    };
  };
}

export interface GoogleCredentialResponse {
  credential: string;
  clientId: string;
}

export interface FacebookLoginResponse {
  accessToken: string;
  userID: string;
  name?: string;
  email?: string;
  picture?: {
    data: {
      url: string;
    };
  };
}