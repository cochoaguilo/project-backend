import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuariosService } from './usuarios.service';
import { Usuarios } from './usuarios.entity';
import { CreateUsuarioDto, LoginUsuarioDto } from './usuarios.dto';
import { describe } from 'node:test';

describe('UsuariosService', () => {
  let service: UsuariosService;
  let repository: {
    create: jest.Mock;
    save: jest.Mock;
    findOneBy: jest.Mock;
    find: jest.Mock;
  };
  let jwt: { signAsync: jest.Mock };

  beforeEach(async () => {
    repository = {
      create: jest.fn(),
      save: jest.fn(),
      findOneBy: jest.fn(),
      find: jest.fn(),
    };

    jwt = {
      signAsync: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsuariosService,
        {
          provide: getRepositoryToken(Usuarios),
          useValue: repository,
        },
        {
          provide: JwtService,
          useValue: jwt,
        },
      ],
    }).compile();

    service = module.get<UsuariosService>(UsuariosService);
  });

  it('debería existir', () => {
    expect(service).toBeDefined();
  });

  it('registra un usuario y lo persiste', async () => {
    const datos: CreateUsuarioDto = {
      name: 'María',
      mail: 'maria@mail.com',
      password: 'clave123',
    };
    const usuarioCreado = { id: 7, ...datos } as Usuarios;

    repository.create.mockReturnValue(usuarioCreado);
    repository.save.mockResolvedValue(usuarioCreado);

    const resultado = await service.signIn(datos);

    expect(repository.create).toHaveBeenCalledWith(datos);
    expect(repository.save).toHaveBeenCalledWith(usuarioCreado);
    expect(resultado).toEqual(usuarioCreado);
  });

  it('genera un token cuando las credenciales son válidas', async () => {
    const credenciales: LoginUsuarioDto = {
      name: 'María',
      mail: 'maria@mail.com',
      password: 'clave123',
    };
    const usuarioEnBD = {
      id: 7,
      name: 'María',
      mail: 'maria@mail.com',
      password: 'clave123',
    } as Usuarios;

    repository.findOneBy.mockResolvedValue(usuarioEnBD);
    jwt.signAsync.mockResolvedValue('token-falso');

    const resultado = await service.logIn(credenciales);

    expect(repository.findOneBy).toHaveBeenCalledWith({
      mail: credenciales.mail,
      password: credenciales.password,
    });
    expect(jwt.signAsync).toHaveBeenCalledWith(
      { sub: usuarioEnBD.id, username: usuarioEnBD.name },
      { expiresIn: 60000 },
    );
    expect(resultado).toEqual({
      user: { ...credenciales, id: usuarioEnBD.id },
      access_token: 'token-falso',
      expires_in: 60000,
    });
  });

  it('lanza un error si no encuentra un usuario con esas credenciales', async () => {
    const credenciales: LoginUsuarioDto = {
      name: 'María',
      mail: 'desconocida@mail.com',
      password: 'incorrecta',
    };

    repository.findOneBy.mockResolvedValue(null);

    await expect(service.logIn(credenciales)).rejects.toThrow(NotFoundException);
    await expect(service.logIn(credenciales)).rejects.toThrow('Mail o contraseña incorrectos');
  });

  it('devuelve todos los usuarios almacenados', async () => {
    const listado = [
      { id: 1, name: 'María', mail: 'maria@mail.com', password: 'clave123' },
      { id: 2, name: 'Luis', mail: 'luis@mail.com', password: 'abc123' },
    ] as Usuarios[];

    repository.find.mockResolvedValue(listado);

    const resultado = await service.findAll();

    expect(repository.find).toHaveBeenCalled();
    expect(resultado).toEqual(listado);
  });
});
