import { Controller, Get, Req } from '@nestjs/common';

@Controller('inversiones')
export class InversionesController {
    @Get()
  findAll(@Req() request: Request): string {
    return 'This action returns all cats';
  }
}
