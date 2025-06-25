import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import { BlogsService } from '../application/blogs.service';
import { BlogsRepository } from '../infrastructure/blogs.repository';
import { GetBlogsQueryDto } from '../dto/getBlogsQueryDto';
import { BlogsQueryRepository } from '../infrastructure/query/blogs.query-repository';
import { BlogsViewDto } from '../dto/blog-view.dto';

@Controller('blogs')
export class PublicBlogsController {
  constructor(
    private readonly blogsService: BlogsService,
    private blogRepo: BlogsRepository,
    private readonly blogsQueryRepo: BlogsQueryRepository,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllBlogs(@Query() query: GetBlogsQueryDto) {
    return this.blogRepo.getAllBlogsWithPagination(query);
  }

  @Get(':id')
  async getBlogById(@Param('id') id: string): Promise<BlogsViewDto> {
    return this.blogsQueryRepo.getByIdOrNotFoundFail(id);
  }
}
