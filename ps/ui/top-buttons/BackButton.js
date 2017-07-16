import React from 'react'
import {actions} from '../state'

class BackButton extends React.Component {
    render() {
        return (
            <div className="square-button"
                 onClick={() => actions.gotoTitleScreen()}>
                <span className="glyphicon glyphicon-arrow-left"/>
            </div>
        )
    }
}

module.exports = BackButton
