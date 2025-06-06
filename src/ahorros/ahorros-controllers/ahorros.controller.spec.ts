import { Test, TestingModule } from '@nestjs/testing';
import { AhorrosController } from './ahorros.controller';

describe('AhorrosController', () => {
  let controller: AhorrosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AhorrosController],
    }).compile();

    controller = module.get<AhorrosController>(AhorrosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
