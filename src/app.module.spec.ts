import { MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AppModule } from './app.module';
import { JwtAuthMiddleware } from './middleware/jwt-auth-middleware.middleware';

describe('AppModule middleware wiring', () => {
  const routesProtectedByJwt = () => {
    const forRoutes = jest.fn();
    const apply = jest.fn().mockReturnValue({ forRoutes });
    new AppModule().configure({ apply } as unknown as MiddlewareConsumer);

    expect(apply).toHaveBeenCalledWith(JwtAuthMiddleware);
    return forRoutes.mock.calls.flat();
  };

  it('protects GET /usuarios', () => {
    expect(routesProtectedByJwt()).toContainEqual({
      path: 'usuarios',
      method: RequestMethod.GET,
    });
  });

  it('leaves sign-in and log-in public', () => {
    const routes = routesProtectedByJwt();
    const coversUsuariosPost = routes.some(
      (r) =>
        typeof r === 'object' &&
        r.path?.startsWith('usuarios') &&
        (r.method === RequestMethod.POST || r.method === RequestMethod.ALL),
    );
    expect(coversUsuariosPost).toBe(false);
  });
});
