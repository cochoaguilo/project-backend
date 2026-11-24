import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuarios } from './usuarios.entity';
import { CreateUsuarioDto, LoginUsuarioDto } from './usuarios.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

export type UsuarioPublico = Omit<Usuarios, 'password'>;

const toPublic = ({ id, name, mail }: Usuarios): UsuarioPublico => ({ id, name, mail });

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuarios)
    private usuariosRepository: Repository<Usuarios>,
    private jwtService: JwtService
  ) {}

  async signIn(createUsuarioDto: CreateUsuarioDto): Promise<UsuarioPublico> {
    const password = await bcrypt.hash(createUsuarioDto.password, SALT_ROUNDS);
    const usuario = this.usuariosRepository.create({ ...createUsuarioDto, password });
    return toPublic(await this.usuariosRepository.save(usuario));
  }

  async logIn(loginUsuarioDto: LoginUsuarioDto): Promise<{ user: UsuarioPublico, access_token: string, expires_in: number }> {
    const usuario = await this.usuariosRepository.findOneBy({
      mail: loginUsuarioDto.mail,
    });

    const passwordOk =
      !!usuario && (await bcrypt.compare(loginUsuarioDto.password, usuario.password));
    if (!usuario || !passwordOk) {
      throw new NotFoundException('Mail o contraseña incorrectos');
    }
    const expiresIn = 60000; // segundos, igual que tu configuración en JwtModule
    const payload = { sub: usuario?.id, username: usuario?.name };
    return {
      user: toPublic(usuario),
      access_token: await this.jwtService.signAsync(payload, { expiresIn }),
      expires_in: expiresIn
    };
  }

  async findAll(): Promise<UsuarioPublico[]> {
    const usuarios = await this.usuariosRepository.find();
    return usuarios.map(toPublic);
  }
}