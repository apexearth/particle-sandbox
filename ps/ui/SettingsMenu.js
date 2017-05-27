import React from 'react'
import state from './state'
import config from '../config'
import TextButton from './components/TextButton'
import SettingsList from './components/SettingsList'

const {settings} = state
class SettingsMenu extends React.Component {

    componentDidMount() {
        this.setState(settings)
        state.subscribe(state => this.setState(settings))
        settings.subscribe(settings => this.setState(settings))
    }

    render() {
        if (!settings.visible())  return null

        const {ps} = state
        if (!ps) return null

        const currentMode = settings.section

        const SectionButton = ({mode}) => {
            return (
                <TextButton selected={mode === currentMode} onClick={settings.changeSection.bind(this, mode)}>
                    {mode[0].toUpperCase() + mode.substring(1)}
                </TextButton>
            )
        }
        const buttons       = Object.keys(config).map(key => <SectionButton key={key} mode={key}/>)
        return (
            <div id="edit-menu">
                <div id="edit-menu-buttons">
                    {buttons}
                </div>
                <SettingsList id="edit-menu-settings"
                              title={`${currentMode}`}
                              settings={config[currentMode]}/>
            </div>
        )
    }

}

module.exports = SettingsMenu