import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';
import { UserId } from './userdecorator';

// Extracts the factory behind a param decorator so it can be called directly.
const getFactory = (decorator: () => ParameterDecorator) => {
  class Probe {
    handler(@decorator() _value: unknown) {}
  }
  const args = Reflect.getMetadata(ROUTE_ARGS_METADATA, Probe, 'handler');
  return args[Object.keys(args)[0]].factory;
};

const contextFor = (request: Record<string, unknown>) =>
  ({
    switchToHttp: () => ({ getRequest: () => request }),
  }) as unknown as ExecutionContext;

describe('UserId decorator', () => {
  const factory = getFactory(UserId);

  it('returns the userId set by the JWT middleware', () => {
    expect(factory(undefined, contextFor({ userId: 1, query: {} }))).toBe(1);
  });

  it('ignores a userId sent in the query string', () => {
    const request = { userId: 1, query: { userId: '2' } };
    expect(factory(undefined, contextFor(request))).toBe(1);
  });

  it('throws Unauthorized when the request has no authenticated user', () => {
    const request = { query: { userId: '2' } };
    expect(() => factory(undefined, contextFor(request))).toThrow(
      UnauthorizedException,
    );
  });
});
