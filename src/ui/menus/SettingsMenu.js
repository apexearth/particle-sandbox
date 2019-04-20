import React from 'react'
import state from '../state'
import TextButton from '../components/TextButton'
import SettingsList from '../components/SettingsList'

import config from '../../config'

const {settings} = state

export default class SettingsMenu extends React.Component {

    componentDidMount() {
        this.setState(settings)
        state.subscribe(state => this.setState(settings))
        settings.subscribe(settings => this.setState(settings))
    }

    render() {
        if (!settings.visible()) return null

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
        const buttons       = Object.keys(config)
            .filter(key => !key.endsWith('Meta'))
            .map(key => <SectionButton key={key} mode={key}/>)
        return (
            <div className="gui-flex-row">
                <div id="menu-buttons" className="events">
                    {buttons}
                </div>
                <SettingsList id="menu-settings"
                              title={`${currentMode}`}
                              settings={config[currentMode]}
                />
            </div>
        )
    }

}
