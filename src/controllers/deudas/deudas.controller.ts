import { Controller, Get, Req } from '@nestjs/common';

@Controller('deudas')
export class DeudasController {
    @Get()
  findAll(@Req() request: Request): string {
    return 'This action returns all cats';
  }
}
