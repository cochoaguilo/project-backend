import { Controller, Post, Body, Get, UnauthorizedException } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto, LoginUsuarioDto } from './usuarios.dto';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post('sign-in')
  signIn(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuariosService.signIn(createUsuarioDto);
  }

  @Post('log-in')
  async logIn(@Body() loginUsuarioDto: LoginUsuarioDto) {
    const usuario = await this.usuariosService.logIn(loginUsuarioDto);
    if (!usuario) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }
    return usuario;
  }

  @Get()
  findAll() {
    return this.usuariosService.findAll();
  }
}