import { categoryRepository } from "./category.repository";

class CategoryService {
  async getAll() {
    return await categoryRepository.getAll();
  }

  async getById(categoryId: string, includeSubCategories = true) {
    if(includeSubCategories) return await categoryRepository.getByIdWithSubs(categoryId);
    else return await categoryRepository.findById(categoryId);
  }
}

export const categoryService = new CategoryService();