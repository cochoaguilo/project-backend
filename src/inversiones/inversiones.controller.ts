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

import { buildSuccessResponse } from 'src/utils/api-response';

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
