import { Module } from '@nestjs/common';
import { ExternalsController } from './externals.controller';
import { HttpModule } from '@nestjs/axios';
import { IolAuthService } from 'src/utils/iolauth.service';

@Module({
  imports: [HttpModule],
  providers: [IolAuthService],
  controllers: [ExternalsController]
})
export class ExternalsModule {}
