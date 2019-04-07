const limit = 10

export default class StatsHistory {
    constructor(stats) {
        this.stats          = stats
        this.runningAverage = {}
        this.runningSeconds = 0
        this.averages       = []
    }

    get latestAverage() {
        return this.averages[this.averages.length - 1]
    }

    nthLastAverage(n) {
        return this.averages[this.averages.length - n]
    }

    update(seconds) {
        return // Disabled, for now...
        // this.updateAverage(this.stats, seconds)
    }

    updateAverage(stats, seconds) {
        const add    = (source, target) => {
            for (let key in source) {
                if (source.hasOwnProperty(key)) {
                    if (typeof source[key] === 'object') {
                        add(source[key], target[key] = target[key] || {})
                    } else {
                        target[key] = target[key] || 0
                        target[key] += source[key] * seconds
                    }
                }
            }
        }
        const divide = (source, totalSeconds) => {
            const result = {}
            for (let key in source) {
                if (source.hasOwnProperty(key)) {
                    if (typeof source[key] === 'object') {
                        result[key] = divide(source[key], totalSeconds)
                    } else {
                        result[key] = source[key] / totalSeconds
                    }
                }
            }
            return result
        }

        this.runningSeconds += seconds
        add(stats, this.runningAverage)
        if (this.runningSeconds >= 1) {
            this.averages.push(divide(this.runningAverage, this.runningSeconds))
            this.runningAverage = {}
            this.runningSeconds = 0
        }
        if (this.averages.length > limit) this.averages.splice(0, 1)
    }
}
