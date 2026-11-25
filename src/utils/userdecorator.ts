import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

/**
 * Id of the authenticated user, taken from the verified JWT by JwtAuthMiddleware.
 * Never read it from the query or body: clients could impersonate other users.
 */
export const UserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): number => {
    const request = ctx.switchToHttp().getRequest();
    const userId = Number(request.userId);
    if (!Number.isInteger(userId)) {
      throw new UnauthorizedException('Usuario no autenticado');
    }
    return userId;
  },
);
