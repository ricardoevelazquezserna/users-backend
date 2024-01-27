import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserStatusEnum } from '../enums';

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(45)
  @MinLength(1)
  readonly name: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(45)
  @MinLength(1)
  readonly middleName?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(45)
  @MinLength(1)
  readonly lastName: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(65)
  readonly email: string;

  @IsDateString()
  readonly birthDate: string;

  @IsEnum(UserStatusEnum)
  readonly status: string;
}
