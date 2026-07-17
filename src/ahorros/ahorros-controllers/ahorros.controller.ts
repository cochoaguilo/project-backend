import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateAhorroDto } from 'src/ahorros/create-ahorro.dto';
import { Ahorro } from 'src/ahorros/ahorro.interface';
import { AhorrosService } from 'src/ahorros/ahorros.service';
import { Ahorros } from '../ahorros.entity';
import { UserId } from 'src/utils/userdecorator';
import { buildSuccessResponse } from 'src/utils/api-response';
import { HttpResponse } from 'src/utils/httpresponse.interface';

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
  async update(@Param('id') id: string, @Body() updateAhorroDto: Partial<CreateAhorroDto>): Promise<HttpResponse> {
    const result = await this.ahorrosService.update(+id, updateAhorroDto);
    return buildSuccessResponse(result);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<HttpResponse> {
    const result = await this.ahorrosService.remove(+id);
    return buildSuccessResponse(result);
  }
}
