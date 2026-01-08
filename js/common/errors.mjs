
export class UnimplementedError {
    /**
     * 
     * @param {string|Object} receiver The type-name of the receiver or the receiver itself.
     * @param {string} method The name of the method.
     */
    constructor(receiver,method) {
        this.receiver = receiver
        this.method = method
    }

    toString() {
        const jsType = typeof this.receiver
        const type = jsType == 'string' ? this.receiver : this.receiver.type || jsType
        return `${type} does not implement ${this.method}`
    }
}
