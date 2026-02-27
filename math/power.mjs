/*
 * Copyright (c) 2026 Taush Sampley
 * This software is released under the GPL-3.0 License.
 * See LICENSE file in the project root for full license information.
 */

/**
 * Container class for power-related functions.
 */
export default class Power {

  /**
   * For general use, see {@link greatestPowerLessThan}.
   * 
   * @param {number} value The input value.
   * @returns {number} greatest power of two less than or equal to value.
   */
  static greatestPowerOfTwoLessThan(value) {
    let power = 1;
    while (power < value) power <<= 1;
    return power;
  }

  /**
   * 
   * @param {number} base Must be greater than 1.
   * @param {number} value Must be greater than {base}.
   * @returns {number} greatest power of base less than value.
   */
  static greatestPowerLessThan(base, value) {
    let power = 1;
    while (power < value) power *= base;
    return power;
  }
}
