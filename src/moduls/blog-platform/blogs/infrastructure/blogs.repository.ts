import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateBlogDto, UpdateBlogDto } from '../dto/create-blog.dto';
import { GetBlogsQueryDto } from '../dto/getBlogsQueryDto';

@Injectable()
export class BlogsRepository {
  constructor(private dataSource: DataSource) {}
  async createBlog(createBlogDto: CreateBlogDto) {
    const result = await this.dataSource.query(
      `
      INSERT INTO blogs(name, description, website_url, deletion_status) 
      VALUES ($1, $2, $3, 'active')
      RETURNING id, name, description, website_url as "websiteUrl", created_at as "createdAt", is_membership as "isMembership"
      `,
      [createBlogDto.name, createBlogDto.description, createBlogDto.websiteUrl],
    );
    return result[0];
  }
  async findBlogById(id: number): Promise<any> {
    const result = await this.dataSource.query(
      `SELECT * FROM blogs WHERE id = $1`,
      [id],
    );
  }
  async getAllBlogsWithPagination(query: GetBlogsQueryDto) {
    const page = query.pageNumber || 1;
    const pageSize = query.pageSize || 10;
    const skip = (page - 1) * pageSize;

    const sortBy = ['name', 'website_url', 'created_at'].includes(query.sortBy)
      ? query.sortBy
      : 'created_at';

    const sortDirection =
      query.sortDirection?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const params: any[] = [];
    let whereClause = "WHERE deletion_status = 'active'";
    const searchConditions: string[] = [];

    if (query.searchNameTerm) {
      params.push(`%${query.searchNameTerm.toLowerCase()}%`);
      searchConditions.push(`LOWER(name) LIKE $${params.length}`);
    }

    if (searchConditions.length > 0) {
      whereClause += ` AND (${searchConditions.join(' OR ')})`;
    }

    // Получаем блоги
    const sql = `
    SELECT id, name, description, website_url, created_at, is_membership
    FROM blogs
      ${whereClause}
    ORDER BY ${sortBy} ${sortDirection}
    LIMIT $${params.length + 1}
    OFFSET $${params.length + 2}
  `;
    params.push(pageSize, skip);

    const blogs = await this.dataSource.query(sql, params);

    // Общее количество
    const countSql = `
    SELECT COUNT(*)
    FROM blogs
      ${whereClause}
  `;
    const countResult = await this.dataSource.query(
      countSql,
      params.slice(0, params.length - 2),
    );
    const totalCount = parseInt(countResult[0].count, 10);
    const pagesCount = Math.ceil(totalCount / pageSize);

    return {
      pagesCount,
      page,
      pageSize,
      totalCount,
      items: blogs.map((b: any) => ({
        id: b.id,
        name: b.name,
        description: b.description,
        websiteUrl: b.website_url,
        createdAt: b.created_at,
        isMembership: b.is_membership,
      })),
    };
  }

  async findById(id: string): Promise<any | null> {
    const result = await this.dataSource.query(
      `
      SELECT * FROM blogs
      WHERE id = $1 AND deletion_status = 'active'
      `,
      [id],
    );
    return result[0] || null;
  }

  async findOrNotFoundFail(id: string): Promise<any> {
    const blog = await this.findById(id);
    if (!blog) throw new NotFoundException('Blog not found');
    return blog;
  }

  async update(id: string, dto: UpdateBlogDto): Promise<void> {
    const result = await this.dataSource.query(
      `
      UPDATE blogs
      SET name = $1, description = $2, website_url = $3
      WHERE id = $4 AND deletion_status = 'active'
      `,
      [dto.name, dto.description, dto.websiteUrl, id],
    );
    if (result.rowCount === 0) throw new NotFoundException('Blog not found');
  }

  async softDelete(id: string): Promise<void> {
    const result = await this.dataSource.query(
      `
      UPDATE blogs
      SET deletion_status = 'deleted'
      WHERE id = $1 AND deletion_status = 'active'
      `,
      [id],
    );
    if (result.rowCount === 0) throw new NotFoundException('Blog not found');
  }
}
