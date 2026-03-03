import multer from 'multer';
import { AppError } from '../errors/AppError';
import { Request } from 'express';

// Utilizziamo MemoryStorage perché carichiamo direttamente su R2 tramite Buffer
const storage = multer.memoryStorage();

const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {

  const allowedMimeTypes = [
    'image/jpeg', 
    'image/png', 
    'image/webp', 
    'video/mp4', 
    'video/quicktime', 
    'application/pdf'
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError(`File type ${file.mimetype} is not supported`, 400));
  }
};

export const uploadMiddleware = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50Mb
    files: 10
  }
});