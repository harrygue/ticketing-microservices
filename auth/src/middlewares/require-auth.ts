import { Request, Response, NextFunction } from 'express'
import { NotAuthorizedError } from '../errors/not-authorized-error'

// this middleware runs after currentUser property
// if req.currentUser is not defined then reject request
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.currentUser){
    // use custom error file to handle response
    throw new NotAuthorizedError();
  }

  next();
}