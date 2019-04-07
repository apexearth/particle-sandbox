import React from 'react'

export default ({onClick}) => (
    <div className="gui-popup">
        <div className="gui-notification">
            <p>Did you know there is an Android version available on the Play Store?</p>
            <div className="gui-text-button">
                <a href="https://play.google.com/store/apps/details?id=com.particlesandbox">View</a>
            </div>
            <div className="gui-text-button-neutral">
                <button onClick={onClick}>Skip</button>
            </div>
        </div>
    </div>
)
