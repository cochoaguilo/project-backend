import { PartialType } from '@nestjs/mapped-types';
import { CreateInversionesDto } from './create-inversiones.dto';

export class UpdateInversionesDto extends PartialType(CreateInversionesDto) {}
