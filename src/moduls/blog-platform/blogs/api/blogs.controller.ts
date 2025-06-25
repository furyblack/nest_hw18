import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BlogsService } from '../application/blogs.service';
import { CreateBlogDto } from '../dto/create-blog.dto';
import { BlogResponseDto } from '../dto/blog-view.dto';
import { BasicAuthGuard } from '../../../user-accounts/guards/basic/basic-auth.guard';
import { GetBlogsQueryDto } from '../dto/getBlogsQueryDto';
import { BlogsRepository } from '../infrastructure/blogs.repository';

@Controller('sa/blogs')
@UseGuards(BasicAuthGuard)
export class BlogsController {
  constructor(
    private readonly blogService: BlogsService,
    private blogRepo: BlogsRepository,
  ) {}

  @Post()
  @HttpCode(201)
  async createBlog(
    @Body() createBlogDto: CreateBlogDto,
  ): Promise<BlogResponseDto> {
    const result = await this.blogService.createBlog(createBlogDto);
    return result;
  }
  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllBlogs(@Query() query: GetBlogsQueryDto) {
    return this.blogRepo.getAllBlogsWithPagination(query);
  }
}
