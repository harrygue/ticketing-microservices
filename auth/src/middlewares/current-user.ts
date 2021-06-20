import  { Request,Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { isExpressionWithTypeArguments } from 'typescript';

interface UserPayload {
  id: string;
  email: string
}

// by this we can reach into an existing type definition and modify it
// add the optional property currentUser
declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

// Middleware to extract the JWT payload and set it on ‘req.currentUser’
export const currentUser = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session?.jwt){
    return next();
  }

  try {
    // process.env.jwt already checked and defined in index.ts start function!
    // ? after req.session - necessary in my case, not in SG's case !!!
    const payload = jwt.verify(req.session?.jwt,process.env.jwt!) as UserPayload;
    req.currentUser = payload;

  } catch(err){
    // whether or not there is a payload we want to proceed
  }
  next();
}