import React from 'react'

export default class ReloadButton extends React.Component {
    componentWillMount() {
        this.setState({count: 0})
    }

    render() {
        let className = this.state.count === 1 ? "square-button square-button-warning" : "square-button"
        return (
            <div className={className}
                 onClick={() => {
                     if (this.state.count === 1) {
                         window.location.reload()
                     } else {
                         this.setState({
                             count    : 1,
                             timeoutId: setTimeout(() => this.setState({count: 0}), 1000)
                         })

                     }
                 }}>
                <span className="glyphicon glyphicon-refresh"/>
            </div>
        )
    }
}
