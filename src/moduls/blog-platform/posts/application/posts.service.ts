import { Injectable, NotFoundException } from '@nestjs/common';
import { BlogsRepository } from '../../blogs/infrastructure/blogs.repository';
import { PostsRepository } from '../infrastructure/posts.repository';
import { CreatePostDto } from '../dto/create-post.dto';
import { GetPostsQueryDto } from '../dto/get-posts-query.dto';
import { PostViewDto } from '../dto/posts-view.dto';
import { Pagination } from '../dto/pagination.dto';

@Injectable()
export class PostsService {
  constructor(
    private readonly blogsRepo: BlogsRepository,
    private readonly postsRepo: PostsRepository,
  ) {}

  async createPostForBlog(
    blogId: string,
    dto: CreatePostDto,
  ): Promise<PostViewDto> {
    const blog = await this.blogsRepo.findById(blogId);
    if (!blog) throw new NotFoundException();

    const post = await this.postsRepo.create({
      ...dto,
      blogId,
      blogName: blog.name,
    });

    return this.mapToView(post);
  }

  async getPostsByBlog(
    blogId: string,
    query: GetPostsQueryDto,
  ): Promise<Pagination<PostViewDto>> {
    return this.postsRepo.getPostsByBlogId(blogId, query);
  }

  private mapToView(post: any): PostViewDto {
    return {
      id: post.id,
      title: post.title,
      shortDescription: post.short_description,
      content: post.content,
      blogId: post.blog_id,
      blogName: post.blog_name,
      createdAt: post.created_at,
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: 'None',
        newestLikes: [],
      },
    };
  }
}
