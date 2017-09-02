const {expect} = require('chai')

const StatsHistory = require('./StatsHistory')

describe('StatsHistory', function () {
    it.skip('basic functionality', function () {
        const stats = {
            stat1: 0,
            other: {
                stat2: 2,
                stat3: 2,
                more : {
                    stat4: 6
                }
            }
        }
        const sh    = new StatsHistory(stats)
        expect(sh.runningAverage).to.deep.equal({})
        sh.update(.25)
        expect(sh.runningAverage.stat1).to.equal(stats.stat1 * .25)
        expect(sh.runningAverage.other.stat2).to.equal(stats.other.stat2 * .25)
        expect(sh.runningAverage.other.stat3).to.equal(stats.other.stat3 * .25)
        expect(sh.runningAverage.other.more.stat4).to.equal(stats.other.more.stat4 * .25)
        sh.update(.25)
        expect(sh.runningAverage.stat1).to.equal(stats.stat1 * .5)
        expect(sh.runningAverage.other.stat2).to.equal(stats.other.stat2 * .5)
        expect(sh.runningAverage.other.stat3).to.equal(stats.other.stat3 * .5)
        expect(sh.runningAverage.other.more.stat4).to.equal(stats.other.more.stat4 * .5)
        sh.update(.25)
        sh.update(.25)
        expect(sh.runningAverage).to.deep.equal({})
        expect(sh.averages.length).to.equal(1)
        expect(sh.averages[0].stat1).to.equal(stats.stat1)
        expect(sh.averages[0].other.stat2).to.equal(stats.other.stat2)
        expect(sh.averages[0].other.stat3).to.equal(stats.other.stat3)
        expect(sh.averages[0].other.more.stat4).to.equal(stats.other.more.stat4)

        sh.update(.25)
        stats.other.stat3++
        sh.update(.75)
        expect(sh.averages[1].other.stat3).to.equal((stats.other.stat3 - 1) * .25 + stats.other.stat3 * .75)
        stats.other.stat3++
        sh.update(.75)
        sh.update(.75)
        expect(sh.averages[2].other.stat3).to.equal(((stats.other.stat3) * .75 + stats.other.stat3 * .75) / 1.5)

        expect(sh.nthLastAverage(2).other.stat3).to.equal((stats.other.stat3 - 2) * .25 + (stats.other.stat3 - 1) * .75)
        expect(sh.latestAverage.other.stat3).to.equal(((stats.other.stat3) * .75 + stats.other.stat3 * .75) / 1.5)

    })
})