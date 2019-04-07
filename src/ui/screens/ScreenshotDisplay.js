import React from 'react'
import state from '../state'
import TextButton from '../components/TextButton'
import './ScreenshotDisplay.scss'

export default class ScreenshotDisplay extends React.Component {
    constructor(...args) {
        super(...args)
        state.on('screenshot', () => this.forceUpdate())
    }

    render() {
        let style = {}
        if (!state.screenshot.visible) {
            style.display = 'none'
        }
        return (
            <div className="gui-overlay" style={style}>
                <div className="screenshot-display">
                    <div className="image-container">
                        <img src={state.screenshot.dataURL} alt="screenshot-capture" onClick={() => state.screenshot.hide()}/>
                    </div>
                </div>
                <div className="screenshot-buttons">
                    <TextButton onClick={() => state.screenshot.download()}>
                        Download
                    </TextButton>
                    <TextButton onClick={() => state.screenshot.shareToFacebook()} enabled={state.screenshot.enableShareToFacebook}>
                        Share on Facebook
                    </TextButton>
                    <TextButton onClick={() => state.screenshot.hide()}>
                        Close
                    </TextButton>
                </div>
            </div>
        )
    }
}
