import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { BlogsService } from '../application/blogs.service';
import { CreateBlogDto } from '../dto/create-blog.dto';
import { BlogResponseDto } from '../dto/blog-view.dto';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogService: BlogsService) {}

  @Post()
  @HttpCode(201)
  async createBlog(
    @Body() createBlogDto: CreateBlogDto,
  ): Promise<BlogResponseDto> {
    const result = await this.blogService.createBlog(createBlogDto);
    return result;
  }
}
