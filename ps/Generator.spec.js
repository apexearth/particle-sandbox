const expect    = require('chai').expect
const Generator = require('./Generator')

describe('Generator', function () {
    it('new', function () {
        let spy         = 0
        let parent      = {addParticle: () => spy++}
        const generator = new Generator({parent})
        expect(generator.settings).to.contain.keys([
            'delay',
            'count',
            'radius',
            'speed',
            'minDirection',
            'maxDirection',
            'range',
        ])
        expect(generator.state).to.contain.keys([
            'delay'
        ])
        let expectedDelay = generator.settings.delay
        generator.update(expectedDelay / 2)
        expect(generator.state.delay).to.equal(expectedDelay / 2)
        generator.update(expectedDelay / 2)
        expect(generator.state.delay).to.equal(0)
        expect(spy).to.equal(1)

    })
})