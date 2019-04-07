import React from 'react'
import state, {actions} from '../state'
import './IntroductionScreen.scss'

export default class IntroductionScreen extends React.Component {
    componentWillMount() {
        this.setState({
            steps    : IntroductionScreen.steps,
            stepIndex: 0
        })
    }

    static get steps() {
        let Action    = state.mobile ? 'Tap' : 'Click'
        let Actioning = state.mobile ? 'Tapping' : 'Clicking'
        let action    = state.mobile ? 'tap' : 'click'
        let actioning = state.mobile ? 'tapping' : 'clicking'
        return [].concat.apply([], [
            <Step>
                Welcome to Particle Sandbox
                <ClickToContinue/>
            </Step>,
            (state.mobile
                ? <Step>Use two fingers to move around and zoom in or out.</Step>
                : [
                <Step>Use right click or arrow keys to move around.</Step>,
                <Step>Use the mouse wheel or +- keys to zoom in and out.</Step>,
            ]),
            <Step>{Actioning} any menu button will toggle its visibility.</Step>,
            <Step>The <span className="glyphicon glyphicon-edit"/> menu contains a tool-set for creating
                particles.</Step>,
            <Step>Select a tool and then {action} to use it.</Step>,
            <Step>The <span className="glyphicon glyphicon-list"/> menu shows all existing objects.</Step>,
            <Step>The <span className="glyphicon glyphicon-cog"/> menu allows you to change the behavior of the
                simulation.</Step>,
            <Step>
                <div style={{textAlign: 'left'}}>
                    Play/pause: <span className="glyphicon glyphicon-play"/>
                    <span className="glyphicon glyphicon-pause"/><br/>

                    Zoom: <span className="glyphicon glyphicon-plus"/>
                    <span className="glyphicon glyphicon-minus"/><br/>

                    Erase All: <span className="glyphicon glyphicon-remove"/>
                    <span style={{fontSize: '.5em'}}>(double-{action})</span><br/>

                    Reload: <span className="glyphicon glyphicon-refresh"/>
                    <span style={{fontSize: '.5em'}}>(double-{action})</span>
                </div>
            </Step>,
        ])
    }

    get done() {
        return this.state.steps.length <= this.state.stepIndex || localStorage.getItem('skip-introduction')
    }

    render() {
        if (this.done) return null
        return (
            <div id="introduction-screen-root">
                <div className="introduction-screen-box">
                    <div className="introduction-screen-step"
                         onClick={() => this.setState({stepIndex: this.state.stepIndex + 1})}>
                        {this.state.steps[this.state.stepIndex]}
                    </div>
                    <div className="introduction-screen-buttons">
                        <div onClick={() => this.setState({stepIndex: this.state.steps.length})}>
                            skip
                        </div>
                        <div onClick={() => {
                            this.setState({stepIndex: this.state.steps.length})
                            localStorage.setItem('skip-introduction', true)
                        }}>
                            always skip
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

function Step({children}) {
    return (
        <div>
            {children}
        </div>
    )
}

function ClickToContinue() {
    let action = state.mobile ? 'tap' : 'click'
    return <div className="introduction-screen-ctc"> ({action} to
        continue) </div>
}
