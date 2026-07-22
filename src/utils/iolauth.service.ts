import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";

interface IToken {
    refresh_token?: string,
    username?: string,
    password?: string | undefined,
    grant_type: string
}

@Injectable()
export class IolAuthService {

  private accessToken!: string;
  private refreshToken!: string;
  private expiresAt!: number;

  constructor(private httpService: HttpService){}

  async getAccessToken(): Promise<string> {

    if (this.accessToken && Date.now() < this.expiresAt) {
      return this.accessToken;
    }

    await this.getToken();

    return this.accessToken;
  }

  private async getToken() {
    
    let bodyHeaders: IToken;

    if (!this.accessToken) {
        bodyHeaders = {
            username: "marcosaguilo@gmail.com",
            password: process.env.passwordIOLToken,
            grant_type: "password"
        }
    } else {
        bodyHeaders = {
            refresh_token: this.refreshToken,
            grant_type: "refres_token"
        }
    }

    const response = await this.httpService.axiosRef.post(
        'https://api.invertironline.com/token', bodyHeaders
      );

    this.accessToken = response.data.access_token;
    this.refreshToken = response.data.refresh_token;

    // Resto algunos segundos por seguridad
    this.expiresAt = Date.now() + (response.data.expires_in - 30) * 1000;
  }

}