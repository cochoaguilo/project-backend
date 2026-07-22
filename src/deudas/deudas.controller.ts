import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Put } from '@nestjs/common';
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
    async findOne(@Param('id') id: string): Promise<HttpResponse> {
        const result = await this.deudasService.findOne(+id);
        return buildSuccessResponse(result);
    }

    

    @Put(':id')
    async update(@Param('id') id: string, @Body() updateDeudaDto: Partial<CreateDeudaDto>): Promise<HttpResponse> {
        const result = await this.deudasService.update(+id, updateDeudaDto);
        return buildSuccessResponse(result);
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<HttpResponse> {
        const result = await this.deudasService.remove(+id);
        return buildSuccessResponse(result);
    }
}
