import { FollowToggleDTO } from "./follow.dto";
import { followRepository } from "./follow.repository";
import { Follow } from "./follow.types";

class FollowService {
  async toggle(userId: string, dto: FollowToggleDTO): Promise<Follow> {
    const follow = await followRepository.findOneWhere({
      follower_id: userId,
      target_id: dto.target_id
    });

    // upsert
    if(!follow) {
      return await followRepository.create({
        follower_id: userId,
        target_id: dto.target_id
      });
    }

    return await followRepository.update(follow.id, {
      is_active: !follow.is_active
    });
  }
}

export const followService = new FollowService();