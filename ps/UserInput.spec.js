const expect                  = require('chai').expect
const UserInput               = require('./UserInput')
const inputs                  = require('./inputs')
inputs.mapping.requireUpdates = true; // For testing, don't auto update input values.

describe('UserInput', () => {
    it('selection', () => {
        let input = new UserInput({parent: {}})
        expect(input.mode).to.equal('selection')
        expect(input.state).to.deep.equal({})

        input.update(.01)
        expect(input.state).to.deep.equal({
            mode     : 'selection',
            selecting: false,
            start    : {x: 0, y: 0},
            finish   : {x: 0, y: 0}
        })

        inputs('mouseX', 1)
        inputs('mouseY', 2)
        inputs('mouse0', 1)
        input.update(.01)
        expect(input.state).to.deep.equal({
            mode     : 'selection',
            selecting: true,
            start    : {x: 1, y: 2},
            finish   : {x: 1, y: 2}
        })

        inputs('mouseX', 11)
        inputs('mouseY', 12)
        input.update(.01)
        expect(input.state).to.deep.equal({
            mode     : 'selection',
            selecting: true,
            start    : {x: 1, y: 2},
            finish   : {x: 11, y: 12}
        })

    })
})