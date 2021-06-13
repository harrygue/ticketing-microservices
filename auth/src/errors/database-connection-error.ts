import { CustomError } from "./custom-error";

export class DatabaseConnectionError extends CustomError {
  reason = 'Database Connection Error';
  statusCode = 500;
  
  constructor(){
    super('Database Connection Error');

    // Only because we are extending a built in class
    Object.setPrototypeOf(this,DatabaseConnectionError.prototype);
  }

  serializedErrors(){
    return [
      { message: this.reason}
    ]
  }
}