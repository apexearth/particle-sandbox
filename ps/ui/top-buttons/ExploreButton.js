import React from 'react'
import {explore} from '../state'

class EditButton extends React.Component {

    componentDidMount() {
        this.setState(explore)
        explore.subscribe(explore => {
            this.setState(explore)
        })
    }

    render() {
        return (
            <div className="square-button"
                 onClick={explore.toggleVisible}>
                <span className="glyphicon glyphicon-list"/>
            </div>
        )
    }
}

module.exports = EditButton