import { ValidationError } from "express-validator";
import { CustomError } from "./custom-error";

export class RequestValidationError extends CustomError {
  statusCode = 400
  constructor(public errors: ValidationError[]){
    super('Invalid request parameters');

    // Only because we are extending a built in class
    Object.setPrototypeOf(this,RequestValidationError.prototype);
  }

  serializedErrors(){
    return this.errors.map(err => {
      console.log('INSIDE request-validation-error.ts:')
      console.log(err.msg, err.param)
      return { message: err.msg, field: err.param }
    })
  }
}
