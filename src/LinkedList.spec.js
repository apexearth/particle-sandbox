const expect = require('chai').expect
import LinkedList from './LinkedList'
import LinkedListNode from './LinkedListNode'

describe('LinkedList', () => {
    it('basics', () => {
        let ll = new LinkedList()
        let n1 = ll.add(new LinkedListNode())
        let n2 = ll.add(new LinkedListNode())
        let n3 = ll.add(new LinkedListNode())
        let n4 = ll.add(new LinkedListNode())

        expect(ll.first).to.equal(n1)
        expect(ll.last).to.equal(n4)

        expect(ll.current).to.equal(n1)
        expect(ll.next).to.equal(n1)

        expect(ll.next).to.equal(n2)
        expect(ll.current).to.equal(n2)

        expect(ll.next).to.equal(n3)
        expect(ll.current).to.equal(n3)

        ll.remove(n3)
        expect(ll.current).to.equal(n2)
        expect(ll.last).to.equal(n4)
        ll.add(n3)
        expect(n3.next).to.equal(null)

        ll.remove(n2)
        expect(ll.current).to.equal(n1)
        expect(n1.next).to.equal(n4)
        expect(n4.prev).to.equal(n1)

        ll.remove(n1)
        expect(ll.first).to.equal(n4)
        expect(ll.current).to.equal(n4)
        expect(ll.next).to.equal(n4)

        expect(ll.next).to.equal(n3)
        ll.remove(n3)
        expect(ll.current).to.equal(n4)
        expect(ll.last).to.equal(n4)
        expect(ll.first).to.equal(n4)
        ll.remove(n4)

        ll.add(n1)
        ll.add(n2)
        ll.add(n3)
        ll.add(n4)
        ll.current = n1

        ll.remove(n1)
        expect(ll.first).to.equal(n2)
    })
})
