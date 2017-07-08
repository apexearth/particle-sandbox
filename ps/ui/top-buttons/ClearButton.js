import React from 'react'
import state from '../state'

class ClearButton extends React.Component {
    componentWillMount() {
        this.setState({count: 0})
    }

    render() {
        let {ps}      = state
        let className = this.state.count === 1 ? "square-button square-button-warning" : "square-button"
        return (
            <div className={className}
                 onClick={() => {
                     if (this.state.count === 1) {
                         ps.removeAll()
                         clearTimeout(this.state.timeoutId)
                         this.setState({count: 0, timeout: null})
                     } else {
                         this.setState({
                             count    : 1,
                             timeoutId: setTimeout(() => this.setState({count: 0}), 1000)
                         })

                     }
                 }}>
                <span className="glyphicon glyphicon-remove"/>
            </div>
        )
    }
}

module.exports = ClearButton
