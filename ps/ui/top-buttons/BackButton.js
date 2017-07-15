import React from 'react'
import {actions} from '../state'

class BackButton extends React.Component {
    componentWillMount() {
        this.setState({count: 0})
    }

    render() {
        return (
            <div className="square-button"
                 onClick={() => actions.changeScreen('TitleScreen')}>
                <span className="glyphicon glyphicon-arrow-left"/>
            </div>
        )
    }
}

module.exports = BackButton
