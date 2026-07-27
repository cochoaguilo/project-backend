import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeudasService } from './deudas.service';
import { Deudas } from './deudas.entity';

type MockRepository = {
  create: jest.Mock;
  save: jest.Mock;
  find: jest.Mock;
  findOneBy: jest.Mock;
  update: jest.Mock;
  sum: jest.Mock;
  delete: jest.Mock;
};

const mockRepository = (): MockRepository => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOneBy: jest.fn(),
  update: jest.fn(),
  sum: jest.fn(),
  delete: jest.fn(),
});

describe('DeudasService', () => {
  let service: DeudasService;
  let repository: MockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeudasService,
        { provide: getRepositoryToken(Deudas), useValue: mockRepository() },
      ],
    }).compile();

    service = module.get<DeudasService>(DeudasService);
    repository = module.get(getRepositoryToken(Deudas));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create() should create and save a deuda', async () => {
    const dto = { amount: 100, description: 'test', userId: 1 } as any;
    const created = { id: 1, ...dto };
    repository.create.mockReturnValue(created);
    repository.save.mockResolvedValue(created);

    const result = await service.create(dto);
    expect(repository.create).toHaveBeenCalledWith(dto);
    expect(repository.save).toHaveBeenCalledWith(created);
    expect(result).toEqual(created);
  });

  it('findAll() should return deudas for a user', async () => {
    const rows = [{ id: 1, amount: 50, userId: 1 }];
    repository.find.mockResolvedValue(rows);

    const result = await service.findAll(1);
    expect(repository.find).toHaveBeenCalledWith({ where: { userId: 1 } });
    expect(result).toEqual(rows);
  });

  it('findOne() should return a single deuda', async () => {
    const row = { id: 2, amount: 75 };
    repository.findOneBy.mockResolvedValue(row);

    const result = await service.findOne(2);
    expect(repository.findOneBy).toHaveBeenCalledWith({ id: 2 });
    expect(result).toEqual(row);
  });

  it('update() should return raw result from update', async () => {
    const raw = { affected: 1 };
    repository.update.mockResolvedValue({ raw });

    const result = await service.update(3, { amount: 200 });
    expect(repository.update).toHaveBeenCalledWith(3, { amount: 200 });
    expect(result).toEqual(raw);
  });

  it('getDeudasTotales() should return sum of amounts', async () => {
    repository.sum.mockResolvedValue(500);

    const result = await service.getDeudasTotales(1);
    expect(repository.sum).toHaveBeenCalledWith('amount', { userId: 1 });
    expect(result).toBe(500);
  });

  it('remove() should call delete on repository', async () => {
    repository.delete.mockResolvedValue({ affected: 1 });

    const result = await service.remove(4);
    expect(repository.delete).toHaveBeenCalledWith(4);
    expect(result).toEqual({ affected: 1 });
  });
});
