import React from 'react'
import state from '../state'

class ClearButton extends React.Component {
    render() {
        let {ps}      = state
        let className = "square-button"
        return (
            <div className={className}
                 onClick={() => ps.removeAll()}>
                <span className="glyphicon glyphicon-remove"/>
            </div>
        )
    }
}

module.exports = ClearButton
