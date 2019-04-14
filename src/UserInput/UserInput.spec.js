const expect = require('chai').expect
const inputs = require('../inputs')
import "jest-canvas-mock"
import UserInput from './UserInput'
import ParticleSandbox from '../ParticleSandbox'

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
        input.mode = 'select'
        expect(input.state.mode).to.equal('create')

        input.update(.01)
        expect(input.state.mode).to.equal('select')

        inputs('mouseX', 1)
        inputs('mouseY', 2)
        inputs('mouse0', 1)
        input.update(.01)
        expect(input.state.mode).to.equal('select')
        expect(input.state.stage).to.equal(1)
        expect(input.state.start).to.deep.equal({x: 1, y: 2})
        expect(input.state.finish).to.deep.equal({x: 1, y: 2})

        inputs('mouseX', 11)
        inputs('mouseY', 12)
        input.update(.01)
        expect(input.state.mode).to.equal('select')
        expect(input.state.stage).to.equal(1)
        expect(input.state.start).to.deep.equal({x: 1, y: 2})
        expect(input.state.finish).to.deep.equal({x: 11, y: 12})

        inputs('mouse0', 0)
        inputs('mouseX', 1000)
        inputs('mouseY', 1000)
        input.update(.01)
        expect(input.ps.selectedObjects.length).to.equal(1)
    })
    it('create', () => {
        input.mode = 'create'
        expect(input.mode).to.equal('create')
        expect(input.state.mode).to.deep.equal('create')

        input.update(.01)
        expect(input.state.mode).to.deep.equal('create')


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
    it('rapidCreate', () => {
        input.mode = 'rapidCreate'
        expect(input.mode).to.equal('rapidCreate')
        expect(input.state.mode).to.deep.equal('create')

        input.update(.01)
        expect(input.state.mode).to.deep.equal('rapidCreate')


        inputs('mouseX', 1)
        inputs('mouseY', 2)
        inputs('mouse0', 1)
        input.update(.005)
        expect(input.state.secondsSinceLastAdd).to.equal(.005)
        input.update(.005)
        expect(input.state.secondsSinceLastAdd).to.equal(0)
        expect(input.state.stage).to.equal(1)
    })
    it('generator', () => {
        input.mode = 'generator'

        inputs('mouseX', 1)
        inputs('mouseY', 2)
        inputs('mouse0', 1)

        expect(input.ps.generators.length).to.equal(0)
        input.update(.01)
        expect(input.ps.generators.length).to.equal(0)
        inputs('mouse0', 0)
        input.update(.01)
        const {x, y} = input.ps.generators[0].position
        expect({x, y}).to.deep.equal(input.ps.translatePosition({x: 1, y: 2}))
        input.update(.01)
        expect(input.ps.generators.length).to.equal(1)
    })
})
