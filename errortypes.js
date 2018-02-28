/**
 * Types of Errors
 */

// Create a new object, that prototypally inherits from the Error constructor.
var UnauthorisedError = function(message) {
  this.name = 'Unauthorised';
  this.message = message || 'User is not authorised for action';
  this.status = 401;
  this.feastError=true;
}

UnauthorisedError.prototype = Object.create(Error.prototype);
UnauthorisedError.prototype.constructor = UnauthorisedError;

module.exports.UnauthorisedError = UnauthorisedError;

// Create a new object, that prototypally inherits from the Error constructor.
var NotFoundError = function(message) {
  this.name = 'NotFound';
  this.message = message || 'Not Found';
  this.status = 404;
  this.feastError=true;
}

NotFoundError.prototype = Object.create(Error.prototype);
NotFoundError.prototype.constructor = NotFoundError;

module.exports.NotFoundError = NotFoundError;

/// Create a new object, that prototypally inherits from the Error constructor.
var AlreadyExistsError = function(message) {
  this.name = 'AlreadyExists';
  this.message = message || 'Already Exists';
  this.status = 409;
  this.feastError=true;
}

AlreadyExistsError.prototype = Object.create(Error.prototype);
AlreadyExistsError.prototype.constructor = AlreadyExistsError;

module.exports.AlreadyExistsError = AlreadyExistsError;


/// Create a new object, that prototypally inherits from the Error constructor.
var DoesNotExistError = function(message) {
  this.name = 'DoesNotExist';
  this.message = message || 'Does Not Exist';
  this.status = 400;
  this.feastError=true;
}

DoesNotExistError.prototype = Object.create(Error.prototype);
DoesNotExistError.prototype.constructor = DoesNotExistError;

module.exports.DoesNotExistError = DoesNotExistError;

/// Create a new object, that prototypally inherits from the Error constructor.
var BadRequest = function(message) {
  this.name = 'Bad request';
  this.message = message || 'Bad request';
  this.status = 400;
  this.feastError=true;
};

BadRequest.prototype = Object.create(Error.prototype);
BadRequest.prototype.constructor = BadRequest;

module.exports.BadRequest = BadRequest;


/// Create a new object, that prototypally inherits from the Error constructor.
var GenericError = function(message) {
  this.name = 'Unknown';
  this.message = message || 'Unknown';
  this.status = 500;
  this.feastError=true;
};

GenericError.prototype = Object.create(Error.prototype);
GenericError.prototype.constructor = GenericError;

module.exports.GenericError = GenericError;
