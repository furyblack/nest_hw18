import { Module } from '@nestjs/common';
import { BlogsSaController } from './blogs/api/blogs.sa.controller';
import { BlogsRepository } from './blogs/infrastructure/blogs.repository';
import { BlogsService } from './blogs/application/blogs.service';
import { PublicBlogsController } from './blogs/api/blogs.public.controller';
import { BlogsQueryRepository } from './blogs/infrastructure/query/blogs.query-repository';

@Module({
  imports: [],
  controllers: [BlogsSaController, PublicBlogsController],
  providers: [BlogsService, BlogsRepository, BlogsQueryRepository],
  exports: [],
})
export class BloggersPlatformModule {}
