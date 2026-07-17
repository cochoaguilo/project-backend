import { Controller, Post, Body, Get, UnauthorizedException } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto, LoginUsuarioDto } from './usuarios.dto';
import { buildSuccessResponse } from 'src/utils/api-response';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post('sign-in')
  async signIn(@Body() createUsuarioDto: CreateUsuarioDto) {
    const result = await this.usuariosService.signIn(createUsuarioDto);
    return buildSuccessResponse(result);
  }

  @Post('log-in')
  async logIn(@Body() loginUsuarioDto: LoginUsuarioDto) {
    const usuario = await this.usuariosService.logIn(loginUsuarioDto);
    if (!usuario) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }
    return buildSuccessResponse(usuario);
  }

  @Get()
  async findAll() {
    const result = await this.usuariosService.findAll();
    return buildSuccessResponse(result);
  }
}