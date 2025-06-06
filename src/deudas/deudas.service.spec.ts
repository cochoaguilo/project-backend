import { Test, TestingModule } from '@nestjs/testing';
import { DeudasService } from './deudas.service';

describe('DeudasService', () => {
  let service: DeudasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeudasService],
    }).compile();

    service = module.get<DeudasService>(DeudasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
