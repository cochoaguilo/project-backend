import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { InversionesService } from './inversiones.service';
import { Inversiones } from './inversiones.entity';

describe('InversionesService', () => {
  let service: InversionesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InversionesService,
        {
          provide: getRepositoryToken(Inversiones),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<InversionesService>(InversionesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
