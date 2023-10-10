// we are using class for error handling
// same object for multiple time so we use oops

class ErrorHandler extends Error{

    statusCode:Number

    constructor(message:any,statusCode:Number){
        super(message);
        this.statusCode = statusCode;

        Error.captureStackTrace(this,this.constructor)
    }
}

module.exports = ErrorHandler;










// super () method is used to call the constructor of the parent class (error in this case) . it passes the message argument to the erro class constructor which sets the error message for the instancd