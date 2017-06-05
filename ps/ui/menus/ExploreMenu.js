import React from 'react'
import state from '../state'

const {explore} = state
class ExploreMenu extends React.Component {

    componentDidMount() {
        this.setState(explore)
        explore.subscribe(settings => this.setState(settings))
    }

    render() {
        if (!explore.visible())  return null

        const {ps} = state
        if (!ps) return null

        return (
            <div className="gui-list">

            </div>
        )
    }

}

module.exports = ExploreMenu