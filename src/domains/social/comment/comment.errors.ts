import { AppError } from "../../../errors/AppError";

export class CommentNotFound extends AppError {
  constructor() {
    super(
      'Comment not found. If this comment exists, you are not the author.',
      404,
      'COMMENT_NOT_FOUND'
    )
  }
}

export class InvalidEdit extends AppError {
  constructor() {
    super(
      'New comment content must be different from the current content',
      400,
      'INVALID_COMMENT_EDIT'
    )
  }
}