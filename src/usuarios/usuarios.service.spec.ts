import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuariosService } from './usuarios.service';
import { Usuarios } from './usuarios.entity';
import { CreateUsuarioDto, LoginUsuarioDto } from './usuarios.dto';
import * as bcrypt from 'bcryptjs';

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

  it('registra un usuario guardando la contraseña hasheada', async () => {
    const datos: CreateUsuarioDto = {
      name: 'María',
      mail: 'maria@mail.com',
      password: 'clave123',
    };
    repository.create.mockImplementation((u) => ({ id: 7, ...u }));
    repository.save.mockImplementation(async (u) => u);

    const resultado = await service.signIn(datos);

    const creado = repository.create.mock.calls[0][0];
    expect(creado.name).toBe(datos.name);
    expect(creado.mail).toBe(datos.mail);
    expect(creado.password).not.toBe(datos.password);
    expect(await bcrypt.compare(datos.password, creado.password)).toBe(true);
    expect(repository.save).toHaveBeenCalledWith({ id: 7, ...creado });
    expect(resultado).toEqual({ id: 7, name: datos.name, mail: datos.mail });
    expect(resultado).not.toHaveProperty('password');
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
      password: await bcrypt.hash('clave123', 4),
    } as Usuarios;

    repository.findOneBy.mockResolvedValue(usuarioEnBD);
    jwt.signAsync.mockResolvedValue('token-falso');

    const resultado = await service.logIn(credenciales);

    expect(repository.findOneBy).toHaveBeenCalledWith({
      mail: credenciales.mail,
    });
    expect(jwt.signAsync).toHaveBeenCalledWith(
      { sub: usuarioEnBD.id, username: usuarioEnBD.name },
      { expiresIn: 60000 },
    );
    expect(resultado).toEqual({
      user: { id: usuarioEnBD.id, name: usuarioEnBD.name, mail: usuarioEnBD.mail },
      access_token: 'token-falso',
      expires_in: 60000,
    });
    expect(resultado.user).not.toHaveProperty('password');
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

  it('lanza un error si la contraseña no coincide con el hash', async () => {
    const credenciales: LoginUsuarioDto = {
      name: 'María',
      mail: 'maria@mail.com',
      password: 'incorrecta',
    };
    repository.findOneBy.mockResolvedValue({
      id: 7,
      name: 'María',
      mail: 'maria@mail.com',
      password: await bcrypt.hash('clave123', 4),
    } as Usuarios);

    await expect(service.logIn(credenciales)).rejects.toThrow(NotFoundException);
    expect(jwt.signAsync).not.toHaveBeenCalled();
  });

  it('devuelve todos los usuarios almacenados', async () => {
    const listado = [
      { id: 1, name: 'María', mail: 'maria@mail.com', password: 'clave123' },
      { id: 2, name: 'Luis', mail: 'luis@mail.com', password: 'abc123' },
    ] as Usuarios[];

    repository.find.mockResolvedValue(listado);

    const resultado = await service.findAll();

    expect(repository.find).toHaveBeenCalled();
    expect(resultado).toEqual([
      { id: 1, name: 'María', mail: 'maria@mail.com' },
      { id: 2, name: 'Luis', mail: 'luis@mail.com' },
    ]);
    resultado.forEach((u) => expect(u).not.toHaveProperty('password'));
  });
});
