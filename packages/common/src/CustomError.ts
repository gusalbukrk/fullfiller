type libraryName =
  | 'generate-words-freqmap'
  | 'get-wikipedia-article'
  | 'stopwords-utils'
  | 'tokenize-words'
  | 'weighted-randomness'
  | 'fullfiller';

class CustomError extends Error {
  readonly library: libraryName;

  /**
   * Create a `CustomError` (same as `Error` but with an extra property called `library`).
   * @param message Argument to be passed to base constructor (`Error()`).
   * @param library Name of the library in which error will be thrown.
   */
  constructor(message: string, library: libraryName) {
    super(message);
    this.library = library;
  }

  toString(): string {
    return `Error in \`${this.library}\` library:\n\t${this.message}`;
  }
}

export default CustomError;
