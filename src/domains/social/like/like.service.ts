import { likeOnPostRepository, likeOnScrollVideoRepository, LikeRepository } from "./like.repository";
import { Like } from "./like.types";

class LikeService {

  protected repository: LikeRepository;

  constructor(repository: LikeRepository) {
    this.repository = repository;
  }
  
  async toggleLike(
    userId: string, 
    entity_id: string
  ): Promise<Like> {

    // già siamo certi dell'ownership del like con questa query
    const like = await this.repository.findOneWhere({user_id: userId, entity_id});
    if(!like) {
      return await this.repository.create({
        user_id: userId,
        entity_id: entity_id
      });
    } 

    return await this.repository.update(like.id, {
      is_active: !like.is_active
    });
  }
}

export const likePostService = new LikeService(likeOnPostRepository);
export const likeScrollVideoService = new LikeService(likeOnScrollVideoRepository); 