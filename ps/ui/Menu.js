import React from 'react'
import state from './state'
import UserInput from '../UserInput'

const {menu} = state
class Menu extends React.Component {

    componentDidMount() {
        this.setState(menu)
        menu.subscribe(menu => {
            this.setState(menu)
        })
    }

    render() {
        if (!menu.visible)  return null

        const {ps} = state
        if (!ps) return null

        const {userInput} = ps
        const currentMode = userInput.mode
        const Button      = ({selected, children, onClick}) => {
            return (
                <div className={selected ? "gui-button-selected" : "gui-button"}
                     onClick={onClick}
                >
                    {children}
                </div>
            )
        }
        const ToolButton  = ({mode}) => {
            return (
                <Button key={mode} selected={mode === currentMode} onClick={menu.changeTool.bind(this, mode)}>
                    {mode[0].toUpperCase() + mode.substring(1)}
                </Button>
            )
        }
        const buttons     = Object.keys(UserInput.modes).map(key => <ToolButton mode={UserInput.modes[key]}/>)
        return (
            <div id="menu">
                {buttons}
                {/*<Button>Settings</Button>*/}
            </div>
        )
    }


}

module.exports = Menu