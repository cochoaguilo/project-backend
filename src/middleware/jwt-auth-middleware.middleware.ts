import { HttpException, Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class JwtAuthMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token no proporcionado');
    }

    const token = authHeader.split(' ')[1];
    
    try {
      const payload = await this.jwtService.verifyAsync(token, { ignoreExpiration: false });
      req['userId'] = payload.sub; // Agrega el userId al request
      next();
    } catch (error: HttpException | any) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token vencido');
      }
      throw new UnauthorizedException('Token inválido');
    }
  }
}