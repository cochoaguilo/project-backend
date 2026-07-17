import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuarios } from './usuarios.entity';
import { CreateUsuarioDto, LoginUsuarioDto } from './usuarios.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuarios)
    private usuariosRepository: Repository<Usuarios>,
    private jwtService: JwtService
  ) {}

  async signIn(createUsuarioDto: CreateUsuarioDto): Promise<Usuarios> {
    const usuario = this.usuariosRepository.create(createUsuarioDto);
    return this.usuariosRepository.save(usuario);
  }

  async logIn(loginUsuarioDto: LoginUsuarioDto): Promise<{ user: { id: number } & LoginUsuarioDto, access_token: string, expires_in: number }> {
    const usuario = await this.usuariosRepository.findOneBy({
      mail: loginUsuarioDto.mail,
      password: loginUsuarioDto.password,
    });

    if (!usuario) {
      throw new NotFoundException('Mail o contraseña incorrectos');
    }
    const expiresIn = 60000; // segundos, igual que tu configuración en JwtModule
    const payload = { sub: usuario?.id, username: usuario?.name };
    return {
      user: { ...loginUsuarioDto, id: usuario?.id },
      access_token: await this.jwtService.signAsync(payload, { expiresIn }),
      expires_in: expiresIn
    };
  }

  findAll(): Promise<Usuarios[]> {
    return this.usuariosRepository.find();
  }
}