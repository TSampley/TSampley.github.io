
export class UnimplementedError {
    constructor(subject,method) {
        this.subject = subject
        this.method = method
    }

    toString() {
        return `${typeof this.subject} does not implemented ${this.method}`
    }
}
