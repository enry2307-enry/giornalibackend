import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../errors/AppError';
import { UserBaseService } from '../services/userBase';

const userBaseService = new UserBaseService();

export const UserBaseList = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    res.send('NOT IMPLEMENTED: UserBase list');
  } catch (error) {
    next(error);
  }
}

export const UserBaseGetById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // TODO: After auth implementation, get from JWT token
    // const userId = req.user.id;

    if(!req.params.userId) {
      throw new ValidationError("UserId required");  // remove this when JWT implemented
    }

    const user = await userBaseService.getById(req.params.userId);  // change parameter when JWT implemented

    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
}

export const UserBaseGetByEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if(!req.body.email) {
      throw new ValidationError("Email required");
    }

    const user = await userBaseService.getById(req.body.email);

    res.status(200).json({ user })
  } catch (error) {
    next(error);
  }
}

export const UserBaseRegister = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if(!req.body.email) {
      throw new ValidationError("Email required");
    }
    if(!req.body.password) {
      throw new ValidationError("Password required");
    }
    if(!req.body.passwordConfirmation ) {
      throw new ValidationError("Password Confirmation required");
    }
    if(req.body.password !== req.body.passwordConfirmation ) {
      throw new ValidationError("Passwords don't match");
    }

    const user = await userBaseService.create(
      req.body.email, 
      req.body.password
    );

    res.status(201).json({ user });

  } catch (error) {
    next(error);
  }
}

export const UserBaseUpdatePassword = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // TODO: After auth implementation, get from JWT token
    // const userId = req.user.id;

    if(!req.params.userId) {
      throw new ValidationError("UserId required"); // remove this when JWT implemented
    }
    if(!req.body.oldPassword) {
      throw new ValidationError("Old Password required");
    }
    if(!req.body.newPassword) {
      throw new ValidationError("New Password required");
    }
    if(!req.body.newPasswordConfirmation) {
      throw new ValidationError("New Password Confirmation required");
    }
    if(req.body.newPassword !== req.body.newPasswordConfirmation) {
      throw new ValidationError("Passwords don't match");
    }

    const user = await userBaseService.updatePassword(
      req.params.userId, // change this to userId when JWT implemented
      req.body.oldPassword,
      req.body.newPassword
    );

    res.status(200).json({ user });

  } catch (error) {
    next(error);
  }
}

export const UserBaseSoftDelete = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // TODO: After auth implementation, get from JWT token
    // const userId = req.user.id;

    if(!req.params.userId) {
      throw new ValidationError("UserId required"); // remove this when JWT implemented
    }
    if(!req.body.password) {
      throw new ValidationError("Password required");
    }

    const user = await userBaseService.softDelete(
      req.params.userId,  // change this to userId when JWT implemented
      req.body.password
    );

    res.status(200).json({ user });

  } catch (error) {
    next(error);
  }
}
