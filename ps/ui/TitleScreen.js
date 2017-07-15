import React from 'react'

class TitleScreen extends React.Component {
    render() {
        let {location} = this.props
        return (
            <div id="root">
                Particle Sandbox
            </div>
        )
    }
}

module.exports = TitleScreen
