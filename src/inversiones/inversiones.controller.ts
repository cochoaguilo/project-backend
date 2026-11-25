import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { InversionesService } from './inversiones.service';
import { CreateInversionesDto } from './create-inversiones.dto';
import { UserId } from '../utils/userdecorator';

import { buildSuccessResponse } from '../utils/api-response';

@Controller('inversiones')
export class InversionesController {
  constructor(
    private readonly inversionesService: InversionesService
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


  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @UserId() userId: number,
    @Body() updateInversionesDto: CreateInversionesDto,
  ) {
    const result = await this.inversionesService.update(id, userId, updateInversionesDto);
    return buildSuccessResponse(result);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @UserId() userId: number) {
    const result = await this.inversionesService.remove(id, userId);
    return buildSuccessResponse(result);
  }
}
