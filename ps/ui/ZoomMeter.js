import React from 'react'
import state from './state'


module.exports = () => {
    const {ps}     = state
    return (
        <div id="zoom-meter">
            <div onClick={() => ps.zoomOut()} className="zoom-meter-button">
                <span className="glyphicon glyphicon-minus"/>
            </div>
            <div className="zoom-meter-bar"></div>
            <div onClick={() => ps.zoomIn()} className="zoom-meter-button">
                <span className="glyphicon glyphicon-plus"/>
            </div>
        </div>
    )
}