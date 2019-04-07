import React from 'react'
import state from '../state'
const {edit} = state

export default class EditButton extends React.Component {

    componentDidMount() {
        this.setState(edit)
        edit.subscribe(edit => this.setState(edit))
    }

    render() {
        let className = "square-button"
        if (edit.visible()) {
            className += " square-button-active"
        }
        return (
            <div className={className}
                 onClick={edit.toggleVisible}>
                <span className="glyphicon glyphicon-edit"/>
            </div>
        )
    }
}
