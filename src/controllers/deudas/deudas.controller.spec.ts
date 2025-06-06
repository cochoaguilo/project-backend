import { Test, TestingModule } from '@nestjs/testing';
import { DeudasController } from './deudas.controller';

describe('DeudasController', () => {
  let controller: DeudasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeudasController],
    }).compile();

    controller = module.get<DeudasController>(DeudasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
