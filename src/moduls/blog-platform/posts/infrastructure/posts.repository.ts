import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { GetPostsQueryDto } from '../dto/get-posts-query.dto';
import { LikeStatus } from '../likes/like.enum';

@Injectable()
export class PostsRepository {
  constructor(private readonly dataSource: DataSource) {}

  async create(post: {
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
  }) {
    const { title, shortDescription, content, blogId, blogName } = post;

    const sql = `
      INSERT INTO posts (title, short_description, content, blog_id, blog_name)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const values = [title, shortDescription, content, blogId, blogName];

    const result = await this.dataSource.query(sql, values);
    return result[0];
  }

  async getPostsByBlogId(blogId: string, query: GetPostsQueryDto) {
    const page = query.pageNumber || 1;
    const pageSize = query.pageSize || 10;
    const skip = (page - 1) * pageSize;
    const sortBy = query.sortBy || 'created_at';
    const sortDirection =
      query.sortDirection?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const sql = `
      SELECT * FROM posts
      WHERE blog_id = $1 AND deletion_status = 'active'
      ORDER BY ${sortBy} ${sortDirection}
      LIMIT $2 OFFSET $3
    `;
    const posts = await this.dataSource.query(sql, [blogId, pageSize, skip]);

    const countSql = `
      SELECT COUNT(*) FROM posts
      WHERE blog_id = $1 AND deletion_status = 'active'
    `;
    const countResult = await this.dataSource.query(countSql, [blogId]);
    const totalCount = parseInt(countResult[0].count, 10);
    const pagesCount = Math.ceil(totalCount / pageSize);

    return {
      pagesCount,
      page,
      pageSize,
      totalCount,
      items: posts.map((p: any) => ({
        id: p.id,
        title: p.title,
        shortDescription: p.short_description,
        content: p.content,
        blogId: p.blog_id,
        blogName: p.blog_name,
        createdAt: p.created_at,
        extendedLikesInfo: {
          likesCount: 0,
          dislikesCount: 0,
          myStatus: 'None',
          newestLikes: [],
        },
      })),
    };
  }

  async getAllPostsWithPagination(query: GetPostsQueryDto) {
    const page = query.pageNumber || 1;
    const pageSize = query.pageSize || 10;
    const skip = (page - 1) * pageSize;

    const sortBy = ['title', 'created_at', 'short_description'].includes(
      query.sortBy,
    )
      ? query.sortBy
      : 'created_at';

    const sortDirection =
      query.sortDirection?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const posts = await this.dataSource.query(
      `
    SELECT p.*, b.name as blogName
    FROM posts p
    LEFT JOIN blogs b ON p.blog_id = b.id
    ORDER BY ${sortBy} ${sortDirection}
    LIMIT $1 OFFSET $2
    `,
      [pageSize, skip],
    );

    const count = await this.dataSource.query(`SELECT COUNT(*) FROM posts`);
    const totalCount = parseInt(count[0].count, 10);
    const pagesCount = Math.ceil(totalCount / pageSize);

    return {
      pagesCount,
      page,
      pageSize,
      totalCount,
      items: posts.map((p) => ({
        id: p.id,
        title: p.title,
        shortDescription: p.short_description,
        content: p.content,
        blogId: p.blog_id,
        blogName: p.blogname,
        createdAt: p.created_at,
        extendedLikesInfo: {
          likesCount: 0,
          dislikesCount: 0,
          myStatus: 'None',
          newestLikes: [],
        },
      })),
    };
  }

  async findPostById(id: string) {
    const result = await this.dataSource.query(
      `
    SELECT p.*, b.name as blogName
    FROM posts p
    LEFT JOIN blogs b ON p.blog_id = b.id
    WHERE p.id = $1
    `,
      [id],
    );
    const post = result[0];
    if (!post) return null;

    return {
      id: post.id,
      title: post.title,
      shortDescription: post.short_description,
      content: post.content,
      blogId: post.blog_id,
      blogName: post.blogname,
      createdAt: post.created_at,
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: LikeStatus.None,
        newestLikes: [],
      },
    };
  }
}
