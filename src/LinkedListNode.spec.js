const expect         = require('chai').expect
import LinkedListNode from './LinkedListNode'

describe('LinkedListNode', () => {
    it('basics', () => {
        let n1 = new LinkedListNode()
        let n2 = new LinkedListNode()
        let n3 = new LinkedListNode()
        n1.addAfter(n2)
        n2.addAfter(n3)
        expect(n1.next).to.equal(n2)
        expect(n1.prev).to.equal(null)
        expect(n2.next).to.equal(n3)
        expect(n2.prev).to.equal(n1)
        expect(n3.next).to.equal(null)
        expect(n3.prev).to.equal(n2)
        n2.remove()

        expect(n1.next).to.equal(n3)
        expect(n3.prev).to.equal(n1)

        n3.insert(n2)
        expect(n1.next).to.equal(n2)
        expect(n1.prev).to.equal(null)
        expect(n2.next).to.equal(n3)
        expect(n2.prev).to.equal(n1)
        expect(n3.next).to.equal(null)
        expect(n3.prev).to.equal(n2)
    })
})
