import ClientError from "../exceptions/client-error.js";

class BookmarkError extends ClientError {
  constructor(message) {
    super(message, 409);
    this.name = "BookmarkError";
  }
}

export default BookmarkError;
