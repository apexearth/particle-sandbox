import React from 'react'
import state from './state'
import UserInput from '../UserInput'
import TextButton from './components/TextButton'

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

        const ToolButton = ({mode}) => {
            return (
                <TextButton selected={mode === currentMode} onClick={menu.changeTool.bind(this, mode)}>
                    {mode[0].toUpperCase() + mode.substring(1)}
                </TextButton>
            )
        }
        const buttons    = Object.keys(UserInput.modes).map(key => <ToolButton key={key} mode={key}/>)
        return (
            <div id="menu">
                {buttons}
                {/*<Button>Settings</Button>*/}
            </div>
        )
    }

}

module.exports = Menu