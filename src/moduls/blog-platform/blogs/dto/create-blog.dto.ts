import { IsString, IsUrl, Length } from 'class-validator';

export class CreateBlogDto {
  @IsString()
  @Length(1, 100)
  name: string;

  @IsString()
  @Length(1, 500)
  description: string;

  @IsUrl()
  websiteUrl: string;
}
export class UpdateBlogDto {
  @IsString()
  @Length(1, 100)
  name: string;

  @IsString()
  @Length(1, 500)
  description: string;

  @IsUrl()
  websiteUrl: string;
}
