import React from 'react'
import state, {actions} from '../state'
import './AdOverlay.scss'

export default class AdOverlay extends React.Component {
    componentWillMount() {
        this.setState({visible: false})
    }

    componentDidMount() {
        state.on('pendingAdvertisement', () => this.setState({visible: true}))
        state.on('showAdvertisement', () => this.setState({visible: false}))
        state.on('dismissAdvertisement', () => this.setState({visible: false}))
        state.on('cancelAdvertisement', () => this.setState({visible: false}))
    }

    render() {
        if (!this.state.visible) return null
        return (
            <div id="ad-overlay-root">
                <div>
                    An advertisement will display in 5 seconds.
                </div>
            </div>
        )
    }
}
