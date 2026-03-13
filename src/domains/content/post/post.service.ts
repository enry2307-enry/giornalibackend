// src/domains/content/post/post.service.ts
import { BaseContentService } from "../content.service";
import { postRepository } from "./post.repository";
import { Post, PostInsert, PostUpdate } from "./post.types";

export class PostService extends BaseContentService<Post, PostInsert, PostUpdate> {
  protected repository = postRepository;
  protected storagePrefix = "posts";
}

export const postService = new PostService();