import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
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
import { CreatePostDto } from '../../posts/dto/create-post.dto';
import { PostsService } from '../../posts/application/posts.service';
import { GetPostsQueryDto } from '../../posts/dto/get-posts-query.dto';
import { PostViewDto } from '../../posts/dto/posts-view.dto';
import { Pagination } from '../../posts/dto/pagination.dto';

@Controller('sa/blogs')
@UseGuards(BasicAuthGuard)
export class BlogsSaController {
  constructor(
    private readonly blogsService: BlogsService,
    private blogRepo: BlogsRepository,
    private postsService: PostsService,
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
  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateBlog(
    @Param('id') id: string,
    @Body() dto: UpdateBlogDto,
  ): Promise<void> {
    await this.blogsService.updateBlog(id, dto);
  }

  @Delete(':id')
  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteBlog(@Param('id') id: string): Promise<void> {
    await this.blogsService.deleteBlog(id);
  }

  @Post(':id/posts')
  @HttpCode(HttpStatus.CREATED)
  async createPostForBlog(
    @Param('id') blogId: string,
    @Body() dto: CreatePostDto,
  ): Promise<PostViewDto> {
    return this.postsService.createPostForBlog(blogId, dto);
  }

  @Get(':id/posts')
  @HttpCode(HttpStatus.OK)
  async getPostsForBlog(
    @Param('id') blogId: string,
    @Query() query: GetPostsQueryDto,
  ): Promise<Pagination<PostViewDto>> {
    return this.postsService.getPostsByBlog(blogId, query);
  }
}
