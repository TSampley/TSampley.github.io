

/**
 * 
 * Uses k-nearest neighbor search to find similar vectors in a high-dimensional
 * space.
 * 
 * https://arxiv.org/abs/1603.09320
 * 
 * RAG: https://arxiv.org/abs/2005.11401
 */
export default class VectorDatabase {
  constructor() {
    /**
     * @type {Vector[]}
     */
    this.vectors = [];
  }

  push(value,components) {
    this.vectors.push(new Vector(value,components));
  }
}

/**
 * 
 */
export class Vector {
  constructor(value,components) {
    this.value = value;
    this.components = components;
  }
}

/**
 * {index, start, end, subspaces}
 * {index, start, end, vectors}
 */
export class Subspace {
  /**
   * 
   * @param {number} index The spatial dimension this subspace orders.
   * @param {number} start The lowest value of this subspace.
   * @param {number} end The highest value of this subspace.
   * @param {Vector[]} vectors 
   */
  constructor(index,start,end,vectors) {
    this.index = index;
    this.start = start;
    this.end = end;

    // vectors OR subspaces
    this.vectors = vectors;
    /**
     * 
     */
    this.subspaces = null;
  }

  /**
   * Divides the given vector list along the given dimension at the
   * given partition. If {partition} is undefined, it will be
   * calculated from the mean.
   * @param {Vector[]} vectors The input vectors to divide.
   * @param {number} dimension The index or spatial dimension to split along.
   * @param {number?} partition An optional value to split along.
   * @returns {Subspace[]}
   */
  static divide(vectors,dimension,partition=undefined) {
    const finalPartition = partition ?? mean(vectors,dimension)
    return [
      new Subspace(dimension, this.start, finalPartition, 
        vectors.filter(v=>v.components[dimension] < finalPartition)
      ),
      new Subspace(dimension, finalPartition, this.end,
        vectors.filter(v=>v.components[dimension] >= finalPartition)
      )
    ];
  }

  /**
   * Subdivides this subspace's vectors into two additional subspaces.
   * @param {number} dimension The spatial dimension to divide along.
   * @returns {Subspace[]} New subspaces partitioned along the given dimension
   */
  divide(dimension,partition=undefined) {
    this.subspaces = Subspace.divide(this.vectors,dimension,partition)
    this.vectors = null
  }

  /**
   * 
   * @param {Float32Array} queryVector An array of components describing the 
   * center of the search.
   * @param {number} distance The distance around the query vector to 
   * search.
   */
  search(queryVector,distance) {
    if (this.vectors) { // Leaf: Search Vectors

    } else if (this.subspaces) { // Branch: Search Eligible Candidates
      this.subspaces.forEach((subspace)=>{

      });
    }
  }
}

/**
 * 
 * @param {Vector[]} vectors List of Vector elements.
 * @param {number} dimension The index or spatial dimension to sum along.
 * @returns {number} The mean of the vectors along the given dimension.
 */
function mean(elements,dimension) {
  let sum = 0;

  for (const element of elements) {
    sum += element.vector[dimension];
  }
  return sum / this.elements.length;
}
