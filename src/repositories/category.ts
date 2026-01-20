// repositories/categoryRepository.ts
import { Category } from '../types/models';
import { BaseRepository } from './baseRepository';

export class CategoryRepository extends BaseRepository<Category, Category> {
  protected tableName = 'category';
  protected defaultSelect = 'id,created_at';
}