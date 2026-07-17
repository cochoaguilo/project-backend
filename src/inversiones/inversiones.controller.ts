import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { InversionesService } from './inversiones.service';
import { CreateInversionesDto } from './create-inversiones.dto';
import { UserId } from 'src/utils/userdecorator';
import { HttpService } from '@nestjs/axios';
import { buildSuccessResponse } from 'src/utils/api-response';

@Controller('inversiones')
export class InversionesController {
  constructor(
    private readonly inversionesService: InversionesService,
    private httpService: HttpService
  ) {}

  @Post()
  async create(
    @Body() createInversionesDto: CreateInversionesDto,
    @UserId() userId: number,
  ) {
    const result = await this.inversionesService.create({ ...createInversionesDto, userId });
    return buildSuccessResponse(result);
  }

  @Get()
  async findAll(@UserId() userId: number) {
    const result = await this.inversionesService.findAll(userId);
    return buildSuccessResponse(result);
  }

  @Get('rava')
  async getRava() {
    const response = await this.httpService.axiosRef.get(
    'https://mercado.rava.com/api/prices/arg'
  );
  return buildSuccessResponse(response.data?.datos);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateInversionesDto: CreateInversionesDto,
  ) {
    const result = await this.inversionesService.update(+id, updateInversionesDto);
    return buildSuccessResponse(result);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await this.inversionesService.remove(+id);
    return buildSuccessResponse(result);
  }
}
