import {PIXI} from 'apex-app'
import inputs from '../inputs'
import modes from './modes'

export default class UserInput {
    constructor({parent}) {
        if (!parent) throw new Error('No parent received.')
        this.ps = parent
        if (typeof window !== 'undefined') {
            this.container = new PIXI.Container()
            this.graphics  = new PIXI.Graphics()
            this.container.addChild(this.graphics)
            this.ps.uiroot.addChild(this.container)
        }
        this.mode       = "create"
        this.state      = {mode: this.mode}
        this.touchState = this.processTouchState(inputs.inputs)

        this.lastMouseX = inputs('mouseX')
        this.lastMouseY = inputs('mouseY')
    }

    static get modes() {
        return modes
    }

    update(seconds) {
        const {ps}        = this
        const {container} = ps

        if (this.mode !== this.state.mode) {
            // Initialize the state for the current mode.
            this.state = {mode: this.mode}
        }
        const touchState = this.state.touchState = this.processTouchState(inputs.inputs, this.state.touchState)

        modes[this.mode].update(seconds, this.state, ps)

        // Scrolling
        if (touchState.previous.count === 2 && touchState.current.count === 2) {
            container.position.x -= touchState.difference.midpointX
            container.position.y -= touchState.difference.midpointY
            ps.clearRenderer()
            ps.zoom *= (1 - (touchState.difference.distance / ((ps.screenWidth + ps.screenHeight) / 2) * 3))
        }

        if (inputs('mouse2')) {
            container.position.x += inputs('mouseX') - this.lastMouseX
            container.position.y += inputs('mouseY') - this.lastMouseY
            ps.clearRenderer() //TODO: Too many clearRender(), can we do better?
        }


        if (inputs('control')) {
            if (inputs('A')) {
                ps.selectAll()
            }
        } else {
            let scrollSpeed = 6
            if (inputs('up')) {
                container.position.y += scrollSpeed
                ps.clearRenderer()
            }
            if (inputs('down')) {
                container.position.y -= scrollSpeed
                ps.clearRenderer()
            }
            if (inputs('left')) {
                container.position.x += scrollSpeed
                ps.clearRenderer()
            }
            if (inputs('right')) {
                container.position.x -= scrollSpeed
                ps.clearRenderer()
            }
            if (inputs('zoomOut')) {
                ps.zoom /= 1.01
            }
            if (inputs('zoomIn')) {
                ps.zoom *= 1.01
            }
            if (inputs('delete')) {
                ps.removeSelected()
            }
            if (inputs('deselect')) {
                ps.deselectAll()
            }
        }

        this.draw()

        this.lastMouseX = inputs('mouseX')
        this.lastMouseY = inputs('mouseY')
    }

    processTouchState({touches, changedTouches}, previousState = {}) {
        let state = {
            current   : {
                count    : touches.length,
                midpointX: 0,
                midpointY: 0,
                minX     : Number.MAX_VALUE,
                maxX     : Number.MIN_VALUE,
                minY     : Number.MAX_VALUE,
                maxY     : Number.MIN_VALUE,
                distanceX: 0,
                distanceY: 0,
                distance : 0,
            },
            previous  : previousState.current || null,
            difference: {
                count    : 0,
                midpointX: 0,
                midpointY: 0,
                minX     : 0,
                maxX     : 0,
                minY     : 0,
                maxY     : 0,
                distanceX: 0,
                distanceY: 0,
                distance : 0,
            }
        }
        if (state.current.count) {
            for (let i = 0; i < state.current.count; i++) {
                state.current.midpointX += touches[i].pageX
                state.current.midpointY += touches[i].pageY
                state.current.minX = Math.min(state.current.minX, touches[i].pageX)
                state.current.minY = Math.min(state.current.minY, touches[i].pageY)
                state.current.maxX = Math.max(state.current.maxX, touches[i].pageX)
                state.current.maxY = Math.max(state.current.maxY, touches[i].pageY)
            }
            state.current.midpointX /= state.current.count
            state.current.midpointY /= state.current.count
            state.current.distanceX = state.current.maxX - state.current.minX
            state.current.distanceY = state.current.maxY - state.current.minY
            state.current.distance  = Math.sqrt(state.current.distanceX * state.current.distanceX + state.current.distanceY * state.current.distanceY)

            state.previous = state.previous || state.current
            // Fill state.difference
            for (let key in state.current) {
                if (state.current.hasOwnProperty(key))
                    state.difference[key] = state.previous[key] - state.current[key]
            }
        } else {
            state.current  = state.difference
            state.previous = state.previous || state.current
        }

        return state
    }

    draw() {
        if (typeof window === 'undefined') return
        this.graphics.clear()
        UserInput.modes[this.mode].draw(this.state, this.graphics)
    }
}
