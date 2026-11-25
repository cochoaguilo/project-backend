import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { CriptoService } from './cripto.service';
import { CreateCriptoDto } from './dto/create-cripto.dto';
import { UpdateCriptoDto } from './dto/update-cripto.dto';
import { UserId } from 'src/utils/userdecorator';
import { buildSuccessResponse } from 'src/utils/api-response';
import { HttpResponse } from 'src/utils/httpresponse.interface';

@Controller('cripto')
export class CriptoController {
  constructor(private readonly criptoService: CriptoService) {}

  @Post()
  async create(@Body() createCriptoDto: CreateCriptoDto, @UserId() userId: number): Promise<HttpResponse> {
    const result = await this.criptoService.create({...createCriptoDto, userId});
    return buildSuccessResponse(result);
  }

  @Get()
  async findAll(@UserId() userId: number): Promise<HttpResponse> {
    const result = await this.criptoService.findAll(userId);
    return buildSuccessResponse(result);
  }

  /* @Get(':id')
  findOne(@Param('id') id: string) {
    return this.criptoService.findOne(+id);
  } */

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @UserId() userId: number, @Body() updateCriptoDto: CreateCriptoDto): Promise<HttpResponse> {
    const result = await this.criptoService.update(id, userId, updateCriptoDto);
    return buildSuccessResponse(result);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @UserId() userId: number): Promise<HttpResponse> {
    const result = await this.criptoService.remove(id, userId);
    return buildSuccessResponse(result);
  }
}
