import React from 'react'
import {edit} from './state'

class MenuButton extends React.Component {

    componentDidMount() {
        this.setState(edit)
        edit.subscribe(menu => {
            this.setState(edit)
        })
    }

    render() {
        return (
            <div id="menu-button"
                 onClick={edit.toggleVisible}>
                <span className="glyphicon glyphicon-edit"/>
            </div>
        )
    }
}

module.exports = MenuButton