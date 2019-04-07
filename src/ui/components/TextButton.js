import React from 'react'

const TextButton = ({selected, children, onClick, enabled = true}) => {
    let className = "gui-text-button"
    if(selected) {
        className = "gui-text-button-selected"
    }
    if(!enabled) {
        className = "gui-text-button-disabled"
    }
    return (
        <div className={className}
             onClick={enabled ? onClick : null}
        >
            {children}
        </div>
    )
}

export default TextButton
