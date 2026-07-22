import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { buildSuccessResponse } from 'src/utils/api-response';
import { HttpResponse } from 'src/utils/httpresponse.interface';
import { IolAuthService } from 'src/utils/iolauth.service';

@Controller('externals')
export class ExternalsController {
    constructor(
        private httpService: HttpService,
        private iolAuthService: IolAuthService
    ) {}
    @Get('iol')
      async getIol(@Query('symbol') symbol: string): Promise<HttpResponse> {
        const token = await this.iolAuthService.getAccessToken();
        const response = await this.httpService.axiosRef.get(
        `https://api.invertironline.com/api/v2/bcBA/Titulos/${symbol}/Cotizacion`,
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
      );
      return buildSuccessResponse(response.data);
      }

      // obtener precios de criptomonedas
    @Get('cripto_currency')
    async getCriptosAPI(@Query('symbols') symbols: string): Promise<HttpResponse> {
        const symbolList = symbols?.split(',').map((s) => s.trim()).filter(Boolean);

        if (!symbolList?.length) {
            throw new BadRequestException('El query param "symbols" es requerido y debe contener al menos un símbolo.');
        }

        const response = await this.httpService.axiosRef.get(
            `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&symbols=${symbolList.join(',')}&order=market_cap_desc&page=1`
        );

        return buildSuccessResponse(response.data);
    }

    // obtener cotizaciones del dolar
    @Get('dolar_exchange') 
    async getMonedaAPI(): Promise<HttpResponse> {
        const response = await this.httpService.axiosRef.get(
            'https://monedapi.ar/api/v2/usd',
            {
                headers: {
                    'Authorization': process.env.TOKENMonedaApiMarcos
                }
            }
        )
        return buildSuccessResponse(response.data);
    }
}
