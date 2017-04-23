import React from 'react'
const TextButton = ({selected, children, onClick}) => {
    return (
        <div className={selected ? "gui-text-button-selected" : "gui-text-button"}
             onClick={onClick}
        >
            {children}
        </div>
    )
}

export default TextButton
