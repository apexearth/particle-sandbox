import React from 'react'
import {edit} from '../state'

class EditButton extends React.Component {

    componentDidMount() {
        this.setState(edit)
        edit.subscribe(edit => {
            this.setState(edit)
        })
    }

    render() {
        return (
            <div className="square-button"
                 onClick={edit.toggleVisible}>
                <span className="glyphicon glyphicon-edit"/>
            </div>
        )
    }
}

module.exports = EditButton