import { Request, Response } from "express";
import { followService } from "./follow.service";
import { toResponse } from "../../../core/utils/objects.utils";

export const followController = {
  toggle: async (req: Request, res: Response) => {
    const follow = await followService.toggle(req.user.id, req.body);

    res.status(200).json(
      toResponse({
        data: follow
      })
    );
  }
}