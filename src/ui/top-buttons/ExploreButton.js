import React from 'react'
import state from '../state'

const {explore} = state

export default class ExploreButton extends React.Component {

    componentDidMount() {
        this.setState(explore)
        explore.subscribe(explore => this.setState(explore))
    }

    render() {
        let className = "square-button"
        if (explore.visible()) {
            className += " square-button-active"
        }
        return (
            <div className={className}
                 onClick={explore.toggleVisible}>
                <span className="glyphicon glyphicon-list"/>
            </div>
        )
    }
}
