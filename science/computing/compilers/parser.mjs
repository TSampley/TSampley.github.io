import { UnimplementedError } from "../../../../js/common/errors.mjs";

/**
 * 
 */
export class Parser {
  /**
   * Parse the given input string and returns some interpretted data.
   * @param {string} input
   * @returns {any}
   */
  parse() {
    throw new UnimplementedError('Parser','parse')
  }
}
