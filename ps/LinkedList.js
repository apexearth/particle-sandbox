class LinkedList {
    constructor() {
        this._first   = null;
        this._last    = null;
        this._current = null;
        this._count   = 0;
    }

    get first() {
        return this._first
    }

    get last() {
        return this._last
    }

    get current() {
        return this._current || this.first
    }

    get next() {
        return this._current = this._current ? this._current.next : this.current
    }

    set current(val) {
        this._current = val;
    }

    get count() {
        return this._count
    }

    add(node) {
        node._removed = false
        if (!this._first) {
            this._first = node
        }
        if (this._last) {
            node._prev       = this._last
            this._last._next = node
        }
        node._next = null
        this._last = node
        this._count++;
        return node;
    }

    remove(node) {
        if (this.current === node) {
            this._current = node.prev
        }
        if (this.first === node) {
            this._first = node.next
        }
        if (this.last === node) {
            this._last = node.prev
        }
        node.remove()
        this._count--
    }
}

module.exports = LinkedList