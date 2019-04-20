import React from 'react'
import state from '../state'
import UserInput from '../../UserInput'
import TextButton from '../components/TextButton'
import SettingsList from '../components/SettingsList'

const {edit} = state

export default class EditMenu extends React.Component {

    componentDidMount() {
        this.setState(edit)
        state.subscribe(state => this.setState(edit))
        edit.subscribe(edit => this.setState(edit))
    }

    render() {
        if (!edit.visible()) return null

        const {ps} = state
        if (!ps) return null

        const {userInput} = ps
        const currentMode = userInput.mode

        const ToolButton = ({mode}) => {
            return (
                <TextButton selected={mode === currentMode} onClick={edit.changeTool.bind(this, mode)}>
                    {mode[0].toUpperCase() + mode.substring(1)}
                </TextButton>
            )
        }
        const buttons    = Object.keys(UserInput.modes).map(key => {
            return <ToolButton key={key} mode={key}/>
        })
        return (
            <div className="gui-flex-row">
                <div id="menu-buttons" className="events">
                    {buttons}
                </div>
                <SettingsList id="menu-settings"
                              title={`${currentMode}`}
                              settings={UserInput.modes[currentMode].settings}
                              settingsLogic={UserInput.modes[currentMode].settingsLogic}
                />
            </div>
        )
    }

}
