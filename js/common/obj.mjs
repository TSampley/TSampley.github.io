
/**
 * Object interface. Any class that conforms to this interface will override
 * the default implementation of `type`, so it mainly
 * serves as an example and exists for completeness.
 * 
 * As an interface, this definition has no constructor, but is suitable for 
 * use with {@link isA}.
 */
export const Obj = {
  /**
   * Reports the type of the object. Mixins should wrap their "super" type in parenthesis 
   * to indicate which type they extend.
   * 
   * ```js
   * const MixinA = (BaseClass) => class extends BaseClass {
   *   // extended functionality
   *   type() {
   *     if (super.type) return `MixinA(${super.type})`
   *   }
   * }
   * 
   * class CheeseFactory extends Obj {
   *   type() {
   *     return 'CheeseFactory'
   *   }
   * }
   * 
   * const factory = new (MixinA(CheeseFactory))
   * console.log(factory.type()) // log:>MixinA(CheeseFactory)
   * ```
   * 
   */
  type: function() {
    return 'Obj'
  }
}

/**
 * Returns the type of the given `subject` using the first available:
 * 1. If subject is `null`, "null"
 * 2. If subject conforms to Obj interface, the value of type()
 * 3. The value returned by javascript built-in typeof operator.
 * @param {*} subject 
 * @returns A unique, descriptive type string with more detail than JS.
 */
export function typeOf(subject) {
  const type = typeof subject
  switch (type) {
    case 'object':
      if (subject === null) return 'null'
      if (subject.type) return subject.type();
    default:
      return type
  }
}

/**
 * Checks if the given `subject` conforms to the interface
 * indicated by members in the given `intf`.
 * 
 * @param {*} subject The object to check for conformance to some type interface.
 * @param {*} intf The interface to check against for conformance.
 */
export function isA(subject, intf) {
  for (const memberKey in intf) {
    const memberType = typeof intf[memberKey]
    if (!(memberKey in subject) ||
      (memberType != typeof subject[memberKey]))
      return false;
  }
  return true
}
