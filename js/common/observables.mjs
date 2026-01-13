
const UNSET = {}

/**
 * @template {*} Type
 */
export class Observable {

  #value
  /**
   * 
   * @param {Type} initialValue
   */
  constructor(initialValue=UNSET) {
    this.#value = initialValue
    /**
     * @type {Array<(Type)=>void>}
     */
    this.subscribers = []
  }

  /**
   * TODO: consider equivalence handling
   * Updates the observable value and notifies any subscribers
   * @param {Type} newValue
   */
  set value(newValue) {
    // Do nothing on repeated values
    if (this.#value === newValue) return;
    // Do nothing on equal values
    if (this.#value == newValue) return;
    this.#value = newValue

    this.subscribers.forEach((subscriber)=> {
      subscriber(newValue)
    })
  }

  /**
   * Subscribe to the values of this observable.
   * 
   * @param {(Type)=>void} subscriber The callback to deliver new values to.
   */
  subscribe(subscriber) {
    if (this.subscribers.find(subscriber)) throw "Illegal State - Subscriber already exists";

    this.subscribers.push(subscriber)
    if (this.value !== UNSET) {
      subscriber(this.value)
    }
  }

  /**
   * Removes all instances of the given `subscriber`.
   * @param {(Type)=>void} subscriber The callback to remove from subscription.
   */
  drop(subscriber) {
    this.subscribers = this.subscribers.filter((value)=>{
      value !== subscriber
    })
  }
}

/**
 * Represents a single observable value.
 * 
 * The value can be changed by any client and all subscribers will be 
 * notified of the new the value in the order of subscription.
 * 
 * @template Type
 * @param {Type} value
 * @returns {Observable<Type>}
 */
export function single(value) {
  const observable = new Observable(value)
  return observable
}
