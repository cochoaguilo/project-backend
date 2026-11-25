import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Put, ParseIntPipe } from '@nestjs/common';
import { DeudasService } from './deudas.service';
import { CreateDeudaDto } from './deudas.dto';
import { UserId } from 'src/utils/userdecorator';
import { buildSuccessResponse } from 'src/utils/api-response';
import { HttpResponse } from 'src/utils/httpresponse.interface';


@Controller('deudas')
export class DeudasController {
     constructor(private readonly deudasService: DeudasService) {}

    @Post()
    async create(@Body() createDeudaDto: CreateDeudaDto, @UserId() userId: number): Promise<HttpResponse> {
        const result = await this.deudasService.create({...createDeudaDto, userId});
        return buildSuccessResponse(result);
    }

    @Get()
    async findAll(@UserId() userId: number): Promise<HttpResponse> {
        const result = await this.deudasService.findAll(userId);
        return buildSuccessResponse(result);
    }

    @Get('totales')
    async getDeudasTotales(@UserId() userId: string): Promise<HttpResponse> {        
        const result = await this.deudasService.getDeudasTotales(+userId);
        return buildSuccessResponse(result);
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number, @UserId() userId: number): Promise<HttpResponse> {
        const result = await this.deudasService.findOne(id, userId);
        return buildSuccessResponse(result);
    }

    

    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @UserId() userId: number, @Body() updateDeudaDto: Partial<CreateDeudaDto>): Promise<HttpResponse> {
        const result = await this.deudasService.update(id, userId, updateDeudaDto);
        return buildSuccessResponse(result);
    }

    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number, @UserId() userId: number): Promise<HttpResponse> {
        const result = await this.deudasService.remove(id, userId);
        return buildSuccessResponse(result);
    }
}
