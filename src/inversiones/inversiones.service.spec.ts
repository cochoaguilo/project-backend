import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { InversionesService } from './inversiones.service';
import { Inversiones } from './inversiones.entity';

type MockRepository<T = any> = Partial<Record<keyof any, jest.Mock>>;

const mockRepository = (): MockRepository => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

describe('InversionesService', () => {
  let service: InversionesService;
  let repository: MockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InversionesService,
        { provide: getRepositoryToken(Inversiones), useValue: mockRepository() },
      ],
    }).compile();

    service = module.get<InversionesService>(InversionesService);
    repository = module.get(getRepositoryToken(Inversiones));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create() should create and save an inversion', async () => {
    const dto = { name: 'Test', amount: 1000, userId: 1 } as any;
    const created = { id: 1, ...dto };
    repository.create.mockReturnValue(created);
    repository.save.mockResolvedValue(created);

    const result = await service.create(dto);
    expect(repository.create).toHaveBeenCalledWith(dto);
    expect(repository.save).toHaveBeenCalledWith(created);
    expect(result).toEqual(created);
  });

  it('findAll() should return inversiones for a user', async () => {
    const rows = [{ id: 1, name: 'A', userId: 3 }];
    repository.find.mockResolvedValue(rows);

    const result = await service.findAll(3);
    expect(repository.find).toHaveBeenCalledWith({ where: { userId: 3 } });
    expect(result).toEqual(rows);
  });

  it('update() should call repository.update', async () => {
    repository.update.mockResolvedValue(undefined);

    await service.update(7, { amount: 2000 } as any);
    expect(repository.update).toHaveBeenCalledWith(7, { amount: 2000 });
  });

  it('remove() should call repository.delete', async () => {
    repository.delete.mockResolvedValue({ affected: 1 });

    const result = await service.remove(8);
    expect(repository.delete).toHaveBeenCalledWith(8);
    expect(result).toEqual({ affected: 1 });
  });
});
