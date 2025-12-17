export interface TokenRequest {
  client_id: string;
  client_secret: string;
  audience: string;
  grant_type: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}
