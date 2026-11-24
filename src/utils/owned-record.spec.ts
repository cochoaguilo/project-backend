import { NotFoundException } from '@nestjs/common';
import { findOwned, removeOwned, updateOwned } from './owned-record';

const repo = () => ({
  findOneBy: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

describe('owned-record helpers', () => {
  describe('findOwned', () => {
    it('looks the record up by id AND owner', async () => {
      const r = repo();
      r.findOneBy.mockResolvedValue({ id: 5, userId: 1 });

      await expect(findOwned(r as any, 5, 1)).resolves.toEqual({ id: 5, userId: 1 });
      expect(r.findOneBy).toHaveBeenCalledWith({ id: 5, userId: 1 });
    });

    it('throws NotFound when the record belongs to someone else or does not exist', async () => {
      const r = repo();
      r.findOneBy.mockResolvedValue(null);

      await expect(findOwned(r as any, 5, 2)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateOwned', () => {
    it('updates only a record the user owns and returns it', async () => {
      const r = repo();
      r.update.mockResolvedValue({ affected: 1 });
      r.findOneBy.mockResolvedValue({ id: 5, userId: 1, name: 'New' });

      const result = await updateOwned(r as any, 5, 1, { name: 'New' });

      expect(r.update).toHaveBeenCalledWith({ id: 5, userId: 1 }, { name: 'New' });
      expect(result).toEqual({ id: 5, userId: 1, name: 'New' });
    });

    it('never lets the body change the id or the owner', async () => {
      const r = repo();
      r.update.mockResolvedValue({ affected: 1 });
      r.findOneBy.mockResolvedValue({ id: 5, userId: 1 });

      await updateOwned(r as any, 5, 1, { id: 99, userId: 2, name: 'X' } as any);

      expect(r.update).toHaveBeenCalledWith({ id: 5, userId: 1 }, { name: 'X' });
    });

    it('throws NotFound when no owned record was updated', async () => {
      const r = repo();
      r.update.mockResolvedValue({ affected: 0 });

      await expect(updateOwned(r as any, 5, 2, { name: 'X' })).rejects.toThrow(
        NotFoundException,
      );
      expect(r.findOneBy).not.toHaveBeenCalled();
    });

    it('with nothing to change, just returns the owned record', async () => {
      const r = repo();
      r.findOneBy.mockResolvedValue({ id: 5, userId: 1 });

      await expect(updateOwned(r as any, 5, 1, { userId: 2 } as any)).resolves.toEqual({
        id: 5,
        userId: 1,
      });
      expect(r.update).not.toHaveBeenCalled();
    });
  });

  describe('removeOwned', () => {
    it('deletes only a record the user owns', async () => {
      const r = repo();
      r.delete.mockResolvedValue({ affected: 1, raw: [] });

      await expect(removeOwned(r as any, 5, 1)).resolves.toEqual({ affected: 1, raw: [] });
      expect(r.delete).toHaveBeenCalledWith({ id: 5, userId: 1 });
    });

    it('throws NotFound when no owned record was deleted', async () => {
      const r = repo();
      r.delete.mockResolvedValue({ affected: 0, raw: [] });

      await expect(removeOwned(r as any, 5, 2)).rejects.toThrow(NotFoundException);
    });
  });
});
