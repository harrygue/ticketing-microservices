import {Request,Response,NextFunction} from 'express'
import { CustomError } from '../errors/custom-error'

export const errorHandler = (
  err:Error,
  req:Request,
  res:Response,
  next:NextFunction
) => {
  if (err instanceof CustomError){
    return res.status(err.statusCode).send({ errors: err.serializedErrors() })
  }

  res.status(400).send({
    errors: [{message: 'Oh no ERROR, and I have no glue why ?!?'}]
  })
}