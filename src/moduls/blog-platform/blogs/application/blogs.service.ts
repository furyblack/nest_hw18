import { Injectable, NotFoundException } from '@nestjs/common';
import { BlogsRepository } from '../infrastructure/blogs.repository';
import { CreateBlogDto } from '../dto/create-blog.dto';

@Injectable()
export class BlogsService {
  constructor(private blogsRepo: BlogsRepository) {}
  async createBlog(createBlogDto: CreateBlogDto) {
    const blog = await this.blogsRepo.createBlog(createBlogDto);
    return blog;
  }

  async getBlogById(id: number) {
    const blog = await this.blogsRepo.findBlogById(id);
    if (!blog) throw new NotFoundException(`Blog with id ${id} not found`);
    return blog;
  }
}
