import React from 'react'
import state from '../state'

class ScreenshotButton extends React.Component {

    static get className() {
        return "square-button"
    }

    render() {
        return (
            <div className={ScreenshotButton.className}
                 onClick={state.screenshot.capture}>
                <span className="glyphicon glyphicon-picture"/>
            </div>
        )
    }
}

module.exports = ScreenshotButton

