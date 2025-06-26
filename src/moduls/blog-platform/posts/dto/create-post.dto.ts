import { IsString, Length } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @Length(1, 255)
  title: string;

  @IsString()
  @Length(1, 500)
  shortDescription: string;

  @IsString()
  content: string;
}
