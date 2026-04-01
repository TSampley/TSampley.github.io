/*
 * Copyright (c) 2026 Taush Sampley
 * This software is released under the GPL-3.0 License.
 * See LICENSE file in the project root for full license information.
 * 
 * geom.mjs - geometric primitives
 */

/**
 * A pair of numbers representing a width and height.
 */
export class Size {
  constructor(width,height) {
    this.width = width
    this.height = height
  }
}

/**
 * A pair of numbers representing a point in 2D space, x, y.
 */
export class Point {
  constructor(x=0,y=0) {
    this.x = x
    this.y = y
  }
}
