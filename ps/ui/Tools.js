import React from 'react'
import state from './state'

class SelectionInfo extends React.Component {
    render() {
        const {ps}        = state
        if (!ps) return null;

        const mode = ps.userInput.mode
        return (
            <div id="tools">
                <div className={mode === 'selection' ? "gui-button-selected" : "gui-button"}
                     onClick={this.changeTool.bind(this, 'selection')}>Select
                </div>
                <div className={mode === 'create' ? "gui-button-selected" : "gui-button"}
                     onClick={this.changeTool.bind(this, 'create')}>Create
                </div>
            </div>
        )
    }

    changeTool(value) {
        const {ps}        = state
        ps.userInput.mode = value
        this.forceUpdate()
    }
}

module.exports = SelectionInfo