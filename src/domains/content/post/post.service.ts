// src/domains/content/post/post.service.ts
import { BaseContentService } from "../content.service";
import { postRepository } from "./post.repository";
import { Post, PostInsert, PostUpdate } from "./post.types";

export class PostService extends BaseContentService<Post, PostInsert, PostUpdate> {
  protected repository = postRepository;
  protected storagePrefix = "posts";

  // Metodo specifico per mantenere la firma richiesta dal controller
  async createPost(dto: PostInsert, files?: Express.Multer.File[]) {
    return await { post: this.create(dto, files)  };
  }

  async updatePost(id: string, dto: PostUpdate) {
    return await { post: this.update(id, dto) };
  }

  async deletePost(id: string) {
    await this.delete(id)
  }
}

export const postService = new PostService();