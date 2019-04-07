export default class LinkedListNode {
    constructor() {
        this._next    = null
        this._prev    = null
        this._removed = false
    }

    get next() {
        return this._next
    }

    get prev() {
        return this._prev
    }

    addAfter(node) {
        this._removed = false
        if (this._next) {
            this._next._prev = node
            node._next       = this._next
        } else {
            node._next = null
        }
        this._next = node
        node._prev = this
    }

    insert(node) {
        this._removed = false
        if (this._prev) {
            node._prev       = this._prev
            this._prev._next = node
        } else {
            node._prev = null
        }
        this._prev = node
        node._next = this
    }

    remove() {
        if (this._removed)
            throw new Error("Already removed.")
        if (this._prev) {
            this._prev._next = this._next
        }
        if (this._next) {
            this._next._prev = this._prev
        }
        this._next = null
        this._prev = null
        this._removed = true
    }
}
