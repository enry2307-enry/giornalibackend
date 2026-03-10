import { AppError } from "../../errors/AppError";

export class DuplicateProfileError extends AppError {
  constructor() {
    super(
      'A profile already exists for this account.',
      409,
      'PROFILE_ALREADY_EXIST'
    );
  }
}

export class PublisherNotFoundError extends AppError {
  constructor() {
    super(
      'Publisher profile not found.',
      404,
      'PUBLISHER_NOT_FOUND'
    );
  }
}

export class ViewerNotFoundError extends AppError {
  constructor() {
    super(
      'Viewer profile not found.',
      404,
      'VIEWER_NOT_FOUND'
    );
  }
}
