import { AppError } from "../../errors/AppError";

export class StorageUploadError extends AppError {
  constructor(message: string) {
    super(message, 500, 'FILE_UPLOAD_ERROR');
  }
}