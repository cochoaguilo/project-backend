import { NotFoundException } from '@nestjs/common';
import { DeleteResult, FindOptionsWhere, Repository } from 'typeorm';

/**
 * Data-access helpers that scope every by-id operation to the record's owner.
 * A record owned by someone else is indistinguishable from a missing one (404),
 * so callers cannot probe which ids exist.
 */
type Owned = { id: number; userId: number };

const NOT_FOUND = 'Registro no encontrado';

const ownedBy = <T extends Owned>(id: number, userId: number) =>
  ({ id, userId }) as FindOptionsWhere<T>;

export async function findOwned<T extends Owned>(
  repository: Repository<T>,
  id: number,
  userId: number,
): Promise<T> {
  const record = await repository.findOneBy(ownedBy<T>(id, userId));
  if (!record) {
    throw new NotFoundException(NOT_FOUND);
  }
  return record;
}

export async function updateOwned<T extends Owned>(
  repository: Repository<T>,
  id: number,
  userId: number,
  changes: object,
): Promise<T> {
  // The body must never move a record to another id or owner.
  const { id: _id, userId: _userId, ...safeChanges } = changes as Partial<Owned>;

  if (Object.keys(safeChanges).length > 0) {
    const result = await repository.update(ownedBy<T>(id, userId), safeChanges as any);
    if (!result.affected) {
      throw new NotFoundException(NOT_FOUND);
    }
  }
  return findOwned(repository, id, userId);
}

export async function removeOwned<T extends Owned>(
  repository: Repository<T>,
  id: number,
  userId: number,
): Promise<DeleteResult> {
  const result = await repository.delete(ownedBy<T>(id, userId));
  if (!result.affected) {
    throw new NotFoundException(NOT_FOUND);
  }
  return result;
}
