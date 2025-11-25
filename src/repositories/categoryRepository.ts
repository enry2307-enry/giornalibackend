// repositories/categoryRepository.ts
import { Category } from '../types/models';
import { BaseRepository } from './baseRepository';

export class CategoryRepository extends BaseRepository<Category> {
  protected tableName = 'category';
}