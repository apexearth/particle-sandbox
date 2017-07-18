require('./IntroductionScreen.less')
import React from 'react'
import state, {actions} from '../state'

class IntroductionScreen extends React.Component {
    componentWillMount() {
        this.setState({
            steps    : IntroductionScreen.steps,
            stepIndex: 0
        })
    }

    static get steps() {
        return [
            <Step>Step 1</Step>,
            <Step>Step 2</Step>,
            <Step>Step 3</Step>,
        ]
    }

    get done() {
        return this.state.steps.length < this.state.stepIndex
    }

    render() {
        if (this.done) return null
        return (
            <div id="introduction-screen-root" onClick={() => this.setState({stepIndex: this.state.stepIndex + 1})}>
                {this.state.steps[this.state.stepIndex]}
            </div>
        )
    }
}

module.exports = IntroductionScreen

function Step({children}) {
    return (
        <div className="introduction-screen-step">
            {children}
            <ClickToContinue />
        </div>
    )
}

function ClickToContinue() {
    return <div className="introduction-screen-ctc"> ({typeof device !== 'undefined' ? 'touch' : 'click'} to continue) </div>
}