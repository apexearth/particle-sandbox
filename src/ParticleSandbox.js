import './window'
import app from 'apex-app'
import Generator from './Generator'
import Particle from './Particle'
import ParticlePair from './ParticlePair'
import ParticlePairLinkedList from './ParticlePairLinkedList'
import StatsHistory from './StatsHistory'
import PopulationManager from './PopulationManager'
import stats from './stats'
import inputs from './inputs'
import UserInput from './UserInput'
import config from './config'


const {
          PIXI,
          App,
          createRenderer
      } = app
const {
          view,
          simulation,
          performance
      } = config


export default class ParticleSandbox extends App {
    constructor(options) {
        super(Object.assign({view}, options))

        this.renderer   = {clear: () => undefined} // Mock, replaced in ./index.js
        this.particles  = []
        this.pairs      = [
            new ParticlePairLinkedList(),
            new ParticlePairLinkedList(),
            new ParticlePairLinkedList(),
        ]
        this.collisions = []
        this.generators = []
        this.centerView()

        this._userInput = new UserInput({parent: this})
        this.modes      = {
            followSelection: true,
        }

        this.statsHistory      = new StatsHistory(stats)
        this.populationManager = new PopulationManager(this, stats, this.statsHistory)
        this.initializeFade()

        if (typeof window !== 'undefined') {
            let {renderer, uirenderer} = createRenderer(this, {
                rendererOptions            : {
                    preserveDrawingBuffer: true,
                    clearBeforeRender    : false,
                    backgroundColor      : view.fadeToColor.value,
                },
                destroyAccessibilityPlugins: true
            })
            this.renderer              = renderer
            this.uirenderer            = uirenderer

            inputs.initialize(this.uirenderer.view)
        }
    }

    get stats() {
        return stats
    }

    get userInput() {
        return this._userInput
    }

    centerView() {
        this.container.position.x = this.screenWidth / 2
        this.container.position.y = this.screenHeight / 2
    }

    clearRenderer() {
        this.renderer.backgroundColor = view.fadeToColor.value
        this.renderer.clear()
    }

    update(seconds) {
        super.update(seconds)
        this._userInput.update(seconds)

        this.updateZoom(seconds)

        if (this.paused) return

        this.updateFade(seconds)

        this.updatePairs(this.pairs[0], seconds, this.pairs[0].count * performance.updateFrequency1.value)
        this.updatePairs(this.pairs[1], seconds, this.pairs[1].count * performance.updateFrequency2.value)
        this.updatePairs(this.pairs[2], seconds, this.pairs[2].count * performance.updateFrequency3.value)

        this.objects.forEach(object => object.update(seconds))

        if (simulation.collide.value) {
            this.collisions.forEach(collision => {
                if (collision.particle1.mass <= 0) return
                if (collision.particle2.mass <= 0) return

                if (simulation.exchangeMass.value) {
                    Particle.exchangeMass(collision)
                }
                if (collision.particle1.mass <= 0) return
                if (collision.particle2.mass <= 0) return

                if (simulation.bounce.value && !collision.pair.previouslyCollided) {
                    Particle.bounce(collision)
                    Particle.uncollide(collision)
                }
                collision.pair.previouslyCollided = true
            })
            this.particles.forEach(particle => {
                if (particle.mass <= 0) {
                    this.remove(particle)
                }
            })
            this.collisions = []
        }

        stats.update(seconds, this)
        this.statsHistory.update(seconds)
        this.populationManager.update(seconds)

        if (this.modes.followSelection && this.selectedObjects.length) {
            let position = {
                x: 0,
                y: 0
            }
            this.selectedObjects.forEach(p => {
                position.x += p.position.x
                position.y += p.position.y
            })
            position.x /= this.selectedObjects.length
            position.y /= this.selectedObjects.length
            this.position.x = ((this.screenWidth / 2) - position.x * this.scale.x)
            this.position.y = ((this.screenHeight / 2) - position.y * this.scale.y)
        }
        if (typeof window !== 'undefined') {
            this.container.addChild(this.fxcontainer)
        }
    }

    updatePairs(root, seconds, count) {
        let pair
        // Run calculations on interactions by pairs.
        while (count-- > 0 && (pair = (root.next || (root.current = root.first)))) {

            pair.age += seconds
            if (pair.age >= pair.ageUntilUpdate) {
                if (
                    pair.particle1.mass <= 0 ||
                    pair.particle2.mass <= 0 ||
                    pair.particle1.removed ||
                    pair.particle2.removed
                ) {
                    root.remove(pair)
                } else {
                    this.updatePairLocation(pair, root)
                    pair.update()

                    if (pair.checkCollision) {
                        pair.particle1.updateCollisions(pair)
                    }
                    if (!pair.collided) {
                        pair.previouslyCollided = false
                        pair.particle1.updateAttract(pair)
                    }
                    if (!simulation.collide.value) {
                        // We don't want to updateAttract if they're too close.
                        // So lets let the above code run and *then* set collided to false.
                        pair.collided = false
                    }
                    pair.age = 0
                }
            }
        }
    }

    updatePairLocation(pair, root) {
        const combinedRadii = pair.particle1.radius + pair.particle2.radius
        if (pair.distance > (combinedRadii * performance.distanceThreshold3.value)) {
            if (root !== this.pairs[2]) {
                if (root) {
                    // console.log('removing pair 2 - relocation ' + pair.particle1.id + ' ' + pair.particle2.id)
                    root.remove(pair)
                }
                this.pairs[2].add(pair)
            }
        } else if (pair.distance > (combinedRadii * performance.distanceThreshold2.value)) {
            if (root !== this.pairs[1]) {
                if (root) {
                    // console.log('removing pair 1 - relocation ' + pair.particle1.id + ' ' + pair.particle2.id)
                    root.remove(pair)
                }
                this.pairs[1].add(pair)
            }
        } else {
            if (root !== this.pairs[0]) {
                if (root) {
                    // console.log('removing pair 0 - relocation ' + pair.particle1.id + ' ' + pair.particle2.id)
                    root.remove(pair)
                }
                this.pairs[0].add(pair)
            }
        }
    }

    previewParticle(options) {
        options      = options || {position: {x: Math.random() * 100, y: Math.random() * 100}}
        let particle = new Particle(Object.assign({
            app: this,
            parent: this
        }, options))
        this.container.addChild(particle.container)
        return particle
    }

    addParticle(particle, options) {
        if (!particle || particle.constructor !== Particle) {
            options  = particle || {position: {x: Math.random() * 100, y: Math.random() * 100}}
            particle = new Particle(Object.assign({
                app: this,
                parent: this
            }, options))
        }
        this.particles.forEach(other => {
            this.updatePairLocation(new ParticlePair(particle, other))
        })
        this.particles.push(particle)
        this.add(particle)
        stats.simulation.particleCount++
        return particle
    }

    addParticles(count, distance = 100000) {
        for (let i = 0; i < count; i++) {
            let angle = Math.random() * Math.PI * 2
            let d     = distance * Math.random() * Math.random() * Math.random()
            this.addParticle({
                radius  : 1 + Math.random(),
                position: {
                    x: Math.cos(angle) * d,
                    y: Math.sin(angle) * d,
                },
                momentum: {
                    x: 0,//(Math.random() - .5) * 500 / Math.sqrt(d),
                    y: 0,//(Math.random() - .5) * 500 / Math.sqrt(d),
                }
            })
        }
    }

    _removeParticle(particle) {
        let index = this.particles.indexOf(particle)
        if (index >= 0) {
            this.particles.splice(index, 1)
        }
        stats.simulation.particleCount--
    }

    addGenerator(generator, options) {
        if (!generator || generator.constructor !== Generator) {
            options   = generator || {position: {x: Math.random() * 100, y: Math.random() * 100}}
            generator = new Generator(Object.assign({
                app: this,
                parent: this
            }, options))
        }

        this.generators.push(generator)
        this.add(generator)
        this.addFx(generator)
        stats.simulation.generatorCount++
        return generator
    }

    removeGenerator(generator) {
        let index = this.generators.indexOf(generator)
        if (index >= 0) {
            this.generators.splice(index, 1)
        }
        this.removeFx(generator)
        stats.simulation.generatorCount--
    }

    remove(object) {
        super.remove(object)
        if (object.type === 'particle') {
            this._removeParticle(object)
        } else if (object.type === 'generator') {
            this.removeGenerator(object)
        }
    }

    removeAll() {
        let i = this.objects.length
        while (i-- > 0) {
            this.remove(this.objects[i])
        }
        this.clearRenderer()
    }

    kill() {
        this.removeAll()
        super.kill()
    }

    initializeFade() {
        if (typeof window === 'undefined') return
        this.fadeState              = {
            count         : 0,
            lastClearScale: 1
        }
        this.fadeGraphics           = new PIXI.Graphics()
        this.fadeGraphics.blendMode = PIXI.BLEND_MODES.NORMAL
        this.root.addChildAt(this.fadeGraphics, 0)
        this.on('zoom', () => {
            let difference = Math.abs(this.fadeState.lastClearScale / this.scale.x)
            if (difference > 1.001 || difference < .999) {
                this.clearRenderer()
                this.fadeState.lastClearScale = this.scale.x
            }
        })
    }

    updateFade(seconds) {
        if (typeof window === 'undefined') return
        this.fadeState.count += seconds
        if (this.fadeState.count >= view.fadeDelay.value) {
            this.fadeState.count      = 0
            this.fadeGraphics.visible = true
            this.fadeGraphics.clear()
            this.fadeGraphics.beginFill(view.fadeToColor.value, view.fadeStrength.value)
            this.fadeGraphics.drawRect(0, 0, this.screenWidth, this.screenHeight)
            this.fadeGraphics.endFill()
        } else {
            this.fadeGraphics.visible = false
        }
    }

    select(x1, y1, x2, y2, additive = false) {
        super.select(x1, y1, x2, y2, additive)
        this.clearRenderer()
    }

    selectAll() {
        super.selectAll()
        this.clearRenderer()
    }

    deselectAll() {
        super.deselectAll()
        this.clearRenderer()
    }
}
