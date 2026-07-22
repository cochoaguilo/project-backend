import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CriptoService } from './cripto.service';
import { Cripto } from './entities/cripto.entity';

type MockRepository<T = any> = Partial<Record<keyof any, jest.Mock>>;

const mockRepository = (): MockRepository => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

describe('CriptoService', () => {
  let service: CriptoService;
  let repository: MockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CriptoService,
        { provide: getRepositoryToken(Cripto), useValue: mockRepository() },
      ],
    }).compile();

    service = module.get<CriptoService>(CriptoService);
    repository = module.get(getRepositoryToken(Cripto));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create() should create and save a cripto', async () => {
    const dto = { symbol: 'BTC', amount: 1, userId: 1 } as any;
    const created = { id: 1, ...dto };
    repository.create.mockReturnValue(created);
    repository.save.mockResolvedValue(created);

    const result = await service.create(dto);
    expect(repository.create).toHaveBeenCalledWith(dto);
    expect(repository.save).toHaveBeenCalledWith(created);
    expect(result).toEqual(created);
  });

  it('findAll() should return cryptos for a user', async () => {
    const rows = [{ id: 1, symbol: 'ETH', userId: 2 }];
    repository.find.mockResolvedValue(rows);

    const result = await service.findAll(2);
    expect(repository.find).toHaveBeenCalledWith({ where: { userId: 2 } });
    expect(result).toEqual(rows);
  });

  it('update() should call repository.update', async () => {
    repository.update.mockResolvedValue(undefined);

    await service.update(5, { symbol: 'XRP' } as any);
    expect(repository.update).toHaveBeenCalledWith(5, { symbol: 'XRP' });
  });

  it('remove() should call repository.delete', async () => {
    repository.delete.mockResolvedValue({ affected: 1 });

    const result = await service.remove(6);
    expect(repository.delete).toHaveBeenCalledWith(6);
    expect(result).toEqual({ affected: 1 });
  });
});
