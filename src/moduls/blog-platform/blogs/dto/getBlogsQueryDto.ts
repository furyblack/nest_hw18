// export class GetBlogsQueryDto {
//   @IsOptional()
//   @Type(() => String)
//   sortBy: string = 'created_at';
//
//   @IsOptional()
//   @IsIn(['asc', 'desc'])
//   @Type(() => String)
//   sortDirection: 'asc' | 'desc' = 'desc';
//
//   @IsOptional()
//   @Type(() => Number)
//   @IsInt()
//   @Min(1)
//   pageNumber: number = 1;
//
//   @IsOptional()
//   @Type(() => Number)
//   @IsInt()
//   @Min(1)
//   pageSize: number = 10;
//
//   @IsOptional()
//   @Type(() => String)
//   searchNameTerm?: string;
//
//   @IsOptional()
//   @Type(() => String)
//   searchEmailTerm?: string;
// }
export class GetBlogsQueryDto {
  pageNumber?: number;
  pageSize?: number;
  sortBy?: 'name' | 'website_url' | 'created_at';
  sortDirection?: 'asc' | 'desc';
  searchNameTerm?: string;
}
