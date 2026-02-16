/*
 * Copyright (c) 2026 Taush Sampley
 * This software is released under the GPL-3.0 License.
 * See LICENSE file in the project root for full license information.
 */

/**
 * The Complex class is a container for two real numbers representing the real
 *  and imaginary parts of a complex number. The class also provides basic
 *  arithmetic operations
 *  (addition, subtraction, multiplication, division), as well as methods for
 *  calculating the magnitude (absolute value), conjugate, and exponential of a
 *  complex number.
 */
export default class ComplexNumber {
  constructor(re, im) {
    this.re = re;
    this.im = im;
  }

  /**
   * 
   * @param {ComplexNumber} other The second addend.
   * @returns A new Complex instance
   */
  add(other) {
    return new ComplexNumber(this.re + other.re, this.im + other.im);
  }

  /**
   * 
   * @param {ComplexNumber} other The subtrahend.
   * @returns The difference of the first and second Complex numbers.
   */
  sub(other) {
    return new ComplexNumber(this.re - other.re, this.im - other.im);
  }

  /**
   * 
   * @param {ComplexNumber} other The second factor.
   * @returns The complex product of the two ComplexNumbers.
   */
  mul(other) {
    return new ComplexNumber(
      this.re * other.re - this.im * other.im,
      this.re * other.im + this.im * other.re
    );
  }

  /**
   * Division may not be immediately intuitive, but it can be derived from the 
   * definition of complex multiplication and the concept of multiplying by 
   * the conjugate to eliminate the imaginary part from the denominator.
   * @param {ComplexNumber} other The divisor.
   * @returns The complex quotient of the first and second ComplexNumbers.
   */
  div(other) {
    const denominator = other.re ** 2 + other.im ** 2;
    return new ComplexNumber(
      (this.re * other.re + this.im * other.im) / denominator,
      (this.im * other.re - this.re * other.im) / denominator
    );
  }

  abs() {
    return Math.sqrt(this.re ** 2 + this.im ** 2);
  }

  conj() {
    return new ComplexNumber(this.re, -this.im);
  }

  exp() {
    const expRe = Math.exp(this.re);
    return new ComplexNumber(
      expRe * Math.cos(this.im),
      expRe * Math.sin(this.im)
    );
  }
}
