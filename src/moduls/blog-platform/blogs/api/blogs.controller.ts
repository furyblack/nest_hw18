import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BlogsService } from '../application/blogs.service';
import { CreateBlogDto, UpdateBlogDto } from '../dto/create-blog.dto';
import { BlogResponseDto } from '../dto/blog-view.dto';
import { BasicAuthGuard } from '../../../user-accounts/guards/basic/basic-auth.guard';
import { GetBlogsQueryDto } from '../dto/getBlogsQueryDto';
import { BlogsRepository } from '../infrastructure/blogs.repository';

@Controller('sa/blogs')
@UseGuards(BasicAuthGuard)
export class BlogsController {
  constructor(
    private readonly blogsService: BlogsService,
    private blogRepo: BlogsRepository,
  ) {}

  @Post()
  @HttpCode(201)
  async createBlog(
    @Body() createBlogDto: CreateBlogDto,
  ): Promise<BlogResponseDto> {
    const result = await this.blogsService.createBlog(createBlogDto);
    return result;
  }
  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllBlogs(@Query() query: GetBlogsQueryDto) {
    return this.blogRepo.getAllBlogsWithPagination(query);
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateBlog(
    @Param('id') id: string,
    @Body() dto: UpdateBlogDto,
  ): Promise<void> {
    const isUpdated = await this.blogsService.updateBlog(id, dto);
    if (!isUpdated) {
      throw new NotFoundException('Blog not found');
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteBlog(@Param('id') id: string): Promise<void> {
    const isDeleted = await this.blogsService.deleteBlog(id);
    if (!isDeleted) {
      throw new NotFoundException('Blog not found');
    }
  }
}
