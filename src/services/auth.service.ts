import config from '../config/config';
import logger from '../utils/logger';
import { TokenResponse } from '../types';

class AuthService {
  /**
   * Get access token from Auth0
   */
  async getAccessToken(): Promise<TokenResponse> {
    try {
      const tokenUrl = `https://${config.auth0.domain}/oauth/token`;

      const requestData = {
        client_id: config.auth0.clientId,
        client_secret: config.auth0.clientSecret,
        audience: config.auth0.audience,
        grant_type: 'client_credentials',
      };

      logger.debug('Requesting access token from Auth0');

      const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData: any = await response.json();
        throw new Error(errorData.error_description || errorData.error || 'Failed to get access token');
      }

      const data: any = await response.json();

      logger.info('Access token obtained successfully');

      return {
        access_token: data.access_token,
        token_type: data.token_type || 'Bearer',
        expires_in: data.expires_in,
      };
    } catch (error: any) {
      logger.error('Error getting access token from Auth0', error.message);
      throw new Error(error.message || 'Failed to get access token from Auth0');
    }
  }
}

export default new AuthService();
