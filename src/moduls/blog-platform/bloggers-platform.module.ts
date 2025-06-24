import { Module } from '@nestjs/common';
import { BlogsController } from './blogs/api/blogs.controller';
import { BlogsRepository } from './blogs/infrastructure/blogs.repository';
import { BlogsService } from './blogs/application/blogs.service';

@Module({
  imports: [],
  controllers: [BlogsController],
  providers: [BlogsService, BlogsRepository],
  exports: [],
})
export class BloggersPlatformModule {}
