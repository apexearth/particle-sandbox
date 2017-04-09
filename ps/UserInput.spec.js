const expect                  = require('chai').expect
const UserInput               = require('./UserInput')
const inputs                  = require('./inputs')
inputs.mapping.requireUpdates = true // For testing, don't auto update input values.

describe('UserInput', () => {
    beforeEach(() => {
        inputs('mouseX', 0)
        inputs('mouseY', 0)
        inputs('mouse0', 0)
    })
    it('select', () => {
        let input = new UserInput({parent: {}})
        expect(input.mode).to.equal('select')
        expect(input.state).to.deep.equal({})

        input.update(.01)
        expect(input.state).to.deep.equal({
            mode  : 'select',
            stage : 0,
            start : {x: 0, y: 0},
            finish: {x: 0, y: 0}
        })

        inputs('mouseX', 1)
        inputs('mouseY', 2)
        inputs('mouse0', 1)
        input.update(.01)
        expect(input.state).to.deep.equal({
            mode  : 'select',
            stage : 1,
            start : {x: 1, y: 2},
            finish: {x: 1, y: 2}
        })

        inputs('mouseX', 11)
        inputs('mouseY', 12)
        input.update(.01)
        expect(input.state).to.deep.equal({
            mode  : 'select',
            stage : 1,
            start : {x: 1, y: 2},
            finish: {x: 11, y: 12}
        })

    })
    it('create', () => {

        let input  = new UserInput({parent: {}})
        input.mode = 'create'
        expect(input.mode).to.equal('create')
        expect(input.state).to.deep.equal({})

        input.update(.01)
        expect(input.state).to.deep.equal({
            mode  : 'create',
            stage : 0,
            start : {x: 0, y: 0},
            finish: {x: 0, y: 0}
        })

        inputs('mouseX', 1)
        inputs('mouseY', 2)
        inputs('mouse0', 1)
        input.update(.01)
        expect(input.state).to.deep.equal({
            mode  : 'create',
            stage : 1,
            start : {x: 1, y: 2},
            finish: {x: 1, y: 2}
        })

        inputs('mouseX', 11)
        inputs('mouseY', 12)
        input.update(.01)
        expect(input.state).to.deep.equal({
            mode  : 'create',
            stage : 1,
            start : {x: 1, y: 2},
            finish: {x: 11, y: 12}
        })

    })
})