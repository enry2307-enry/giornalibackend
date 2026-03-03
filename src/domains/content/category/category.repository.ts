// src/domains/category/category.repository.ts
import { BaseRepository } from "../../../core/database/baseRepository";
import { Category } from "./category.types";

class CategoryRepository extends BaseRepository<Category, Category> {
  protected tableName: string = 'category';
  protected defaultSelect = 'id,name,parent_category_id,created_at';

  /**
   * Helper privato per mappare la gerarchia in memoria.
   * Complessità O(n).
   */
  private buildTree(flatCategories: Category[]): Category[] {
    const categoryMap = new Map<string, Category & { sub: Category[] }>();
    const roots: Array<Category & { sub: Category[] }> = [];

    // Inizializzazione mappa
    flatCategories.forEach(cat => {
      categoryMap.set(cat.id, { ...cat, sub: [] });
    });

    // Costruzione relazioni
    flatCategories.forEach(cat => {
      const current = categoryMap.get(cat.id)!;
      const parentId = cat.parent_category_id;

      if (parentId && categoryMap.has(parentId)) {
        categoryMap.get(parentId)!.sub.push(current);
      } else if (!parentId) {
        roots.push(current);
      }
    });

    return roots;
  }

  /**
   * Recupera l'intero albero delle categorie.
   */
  async getAll(): Promise<Category[]> {
    try {
      const all = await this.findAll();
      return this.buildTree(all);
    } catch (error) {
      this.handleError(error, 'getAll');
    }
  }

  /**
   * Recupera una categoria specifica e tutta la sua discendenza.
   */
  async getByIdWithSubs(id: string): Promise<Category | null> {
    try {
      const all = await this.findAll();
      
      // Costruiamo l'albero completo per avere i riferimenti corretti
      const fullTree = this.buildTree(all);
      
      // Funzione ricorsiva per trovare il nodo nell'albero costruito
      const findNode = (nodes: Category[], targetId: string): Category | null => {
        for (const node of nodes) {
          if (node.id === targetId) return node;
          if (node.sub && node.sub.length > 0) {
            const found = findNode(node.sub, targetId);
            if (found) return found;
          }
        }
        return null;
      };

      return findNode(fullTree, id);
    } catch (error) {
      this.handleError(error, 'getByIdWithSubs');
    }
  }
}

export const categoryRepository = new CategoryRepository();