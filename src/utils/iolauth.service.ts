import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  '.issued': string;
  '.expires': string;
  '.refreshexpires': string;
}

@Injectable()
export class IolAuthService {

  private readonly logger = new Logger(IolAuthService.name);

  private readonly TOKEN_URL = 'https://api.invertironline.com/token';

  private accessToken?: string;
  private refreshToken?: string;

  private accessExpiresAt = 0;
  private refreshExpiresAt = 0;

  // Evita múltiples refresh/login simultáneos
  private authPromise?: Promise<void>;

  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {}

  /**
   * Método público que usa el resto de la aplicación.
   */
  async getAccessToken(): Promise<string> {

    // Token todavía válido
    if (this.isAccessTokenValid()) {
      return this.accessToken!;
    }

    // Ya hay otro request renovando el token
    if (this.authPromise) {
      await this.authPromise;
      return this.accessToken!;
    }

    // Sólo un request entra acá
    this.authPromise = this.authenticate();

    try {
      await this.authPromise;
    } finally {
      this.authPromise = undefined;
    }

    return this.accessToken!;
  }

  /**
   * Decide automáticamente entre refresh o login.
   */
  private async authenticate(): Promise<void> {

    if (this.canRefresh()) {

      try {

        this.logger.log('Renovando access token...');

        await this.refresh();

        return;

      } catch (error) {

        this.logger.warn('Falló refresh. Se realizará login nuevamente.');

      }

    }

    this.logger.log('Obteniendo nuevo token...');

    await this.login();

  }

  /**
   * Login con usuario y contraseña.
   */
  private async login(): Promise<void> {

    const response = await this.http.axiosRef.post<TokenResponse>(
      this.TOKEN_URL,
      {
        username: this.config.get<string>('IOL_USERNAME'),
        password: this.config.get<string>('IOL_PASSWORD'),
        grant_type: 'password',
      },
    );

    this.saveTokens(response.data);

  }

  /**
   * Refresh usando refresh_token.
   */
  private async refresh(): Promise<void> {

    const response = await this.http.axiosRef.post<TokenResponse>(
      this.TOKEN_URL,
      {
        refresh_token: this.refreshToken,
        grant_type: 'refresh_token',
      },
    );

    this.saveTokens(response.data);

  }

  /**
   * Guarda toda la información del token.
   */
  private saveTokens(token: TokenResponse): void {

    this.accessToken = token.access_token;

    this.refreshToken = token.refresh_token;

    // Renueva 1 minuto antes por seguridad
    this.accessExpiresAt =
      new Date(token['.expires']).getTime() - 60_000;

    this.refreshExpiresAt =
      new Date(token['.refreshexpires']).getTime();

    this.logger.log(
      `Token válido hasta ${new Date(this.accessExpiresAt).toLocaleTimeString()}`,
    );

  }

  /**
   * ¿Todavía sirve el access token?
   */
  private isAccessTokenValid(): boolean {

    return !!this.accessToken &&
      Date.now() < this.accessExpiresAt;

  }

  /**
   * ¿Todavía puedo usar el refresh token?
   */
  private canRefresh(): boolean {

    return !!this.refreshToken &&
      Date.now() < this.refreshExpiresAt;

  }

}