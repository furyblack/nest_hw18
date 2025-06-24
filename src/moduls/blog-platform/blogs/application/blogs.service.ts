import { Injectable } from '@nestjs/common';
import { BlogsRepository } from '../infrastructure/blogs.repository';
import { CreateBlogDto } from '../dto/create-blog.dto';

@Injectable()
export class BlogsService {
  constructor(private blogsRepo: BlogsRepository) {}
  async createBlog(createBlogDto: CreateBlogDto) {
    const blog = await this.blogsRepo.createBlog(createBlogDto);
    return blog;
  }
}
