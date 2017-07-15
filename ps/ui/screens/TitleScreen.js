require('./TitleScreen.less')
import React from 'react'

import state, {actions} from '../state'

class TitleScreen extends React.Component {
    render() {
        let {location} = this.props
        let resume     = null
        if (state.ps) {
            resume = (
                <div onClick={() => actions.changeScreen('GameScreen')}>
                    Resume
                </div>
            )
        }
        return (
            <div id="title-screen-root">
                <div id="title-screen-title">
                    Particle Sandbox
                </div>
                <div id="title-screen-buttons">
                    {resume}
                    <div onClick={actions.startSandbox}>
                        Sandbox
                    </div>
                </div>
                <div id="title-screen-ad">
                    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"/>
                    <ins className="adsbygoogle"
                         style={{display: "block"}}
                         data-ad-client="ca-pub-6051654262613505"
                         data-ad-slot="4946546409"
                         data-ad-format="auto"/>
                    <script>
                        (adsbygoogle = window.adsbygoogle || []).push({});
                    </script>
                </div>
            </div>
        )
    }
}

module.exports = TitleScreen
