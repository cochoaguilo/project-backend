import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CreateAhorroDto } from '../create-ahorro.dto';
import { Ahorro } from '../ahorro.interface';
import { AhorrosService } from '../ahorros.service';
import { Ahorros } from '../ahorros.entity';
import { UserId } from '../../utils/userdecorator';
import { buildSuccessResponse } from '../../utils/api-response';
import { HttpResponse } from '../../utils/httpresponse.interface';

@Controller('ahorros')
export class AhorrosController {
  constructor(private readonly ahorrosService: AhorrosService) {}
  @Post()
  async create(@Body() ahorrosDto: CreateAhorroDto, @UserId() userId: number): Promise<HttpResponse> {
    const result = await this.ahorrosService.create({ ...ahorrosDto, userId });
    return buildSuccessResponse(result);
  }
  @Get()
  async findAll(@UserId() userId: number): Promise<HttpResponse> {
    const result = await this.ahorrosService.findAll(userId);
    return buildSuccessResponse(result);
  }

  @Get('totales')
  async getAhorrosTotales(@UserId() userId: number): Promise<HttpResponse> {
    const result = await this.ahorrosService.getAhorrosTotales(userId);
    return buildSuccessResponse(result);
  }


  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @UserId() userId: number, @Body() updateAhorroDto: Partial<CreateAhorroDto>): Promise<HttpResponse> {
    const result = await this.ahorrosService.update(id, userId, updateAhorroDto);
    return buildSuccessResponse(result);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @UserId() userId: number): Promise<HttpResponse> {
    const result = await this.ahorrosService.remove(id, userId);
    return buildSuccessResponse(result);
  }
}
