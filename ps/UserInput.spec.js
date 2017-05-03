const expect          = require('chai').expect
const UserInput       = require('./UserInput')
const inputs          = require('./inputs')
const ParticleSandbox = require('./ParticleSandbox')

inputs.mapping.requireUpdates = true // For testing, don't auto update input values.

describe('UserInput', () => {
    let input
    beforeEach(() => {
        input = new ParticleSandbox().userInput
        inputs('mouseX', 0)
        inputs('mouseY', 0)
        inputs('mouse0', 0)
    })
    it('select', () => {
        input.ps.addParticle({position: {x: 0, y: 0}})

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

        inputs('mouse0', 0)
        inputs('mouseX', 1000)
        inputs('mouseY', 1000)
        input.update(.01)
        expect(input.ps.selectedParticles.length).to.equal(1)
    })
    it('create', () => {
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
        expect({
            mode    : input.state.mode,
            stage   : input.state.stage,
            start   : input.state.start,
            finish  : input.state.finish,
            timeHeld: input.state.timeHeld,
        }).to.deep.equal({
            mode    : 'create',
            stage   : 1,
            start   : {x: 1, y: 2},
            finish  : {x: 1, y: 2},
            timeHeld: .01
        })

        inputs('mouseX', 11)
        inputs('mouseY', 12)
        input.update(.01)
        expect({
            mode    : input.state.mode,
            stage   : input.state.stage,
            start   : input.state.start,
            finish  : input.state.finish,
            timeHeld: input.state.timeHeld,
        }).to.deep.equal({
            mode    : 'create',
            stage   : 1,
            start   : {x: 1, y: 2},
            finish  : {x: 11, y: 12},
            timeHeld: .02
        })

        expect(input.ps.particles.length).to.equal(0)
        inputs('mouse0', 0)
        input.update(.01)
        expect({
            mode    : input.state.mode,
            stage   : input.state.stage,
            start   : input.state.start,
            finish  : input.state.finish,
            timeHeld: input.state.timeHeld,
        }).to.deep.equal({
            mode    : 'create',
            stage   : 0,
            start   : {x: 1, y: 2},
            finish  : {x: 11, y: 12},
            timeHeld: .02
        })
        expect(input.ps.particles.length).to.equal(1)
    })
})