import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateBlogDto } from '../dto/create-blog.dto';

@Injectable()
export class BlogsRepository {
  constructor(private dataSource: DataSource) {}
  async createBlog(createBlogDto: CreateBlogDto) {
    const result = await this.dataSource.query(
      `
      INSERT INTO blogs(name, description, website_url, is_membership) 
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, description, website_url as "websiteUrl", created_at as "createdAt", is_membership as "isMembership"
      `,
      [
        createBlogDto.name,
        createBlogDto.description,
        createBlogDto.websiteUrl,
        true,
      ],
    );
    return result[0];
  }
}
