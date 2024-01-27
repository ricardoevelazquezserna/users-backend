import { IsOptional, IsString } from 'class-validator';

export class FindOneParams {
  @IsOptional()
  @IsString()
  readonly _id?: string;

  @IsOptional()
  @IsString()
  readonly email?: string;
}
