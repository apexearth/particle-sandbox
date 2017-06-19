import React from 'react'
import state from './state'

module.exports = () => {
    const {ps} = state
    return (
        <div id="link-original">
            <a href="http://particlesandbox.com/v1" target="_blank">
                Original Version
            </a>
        </div>
    )
}