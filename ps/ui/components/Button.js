import React from 'react'
const Button = ({selected, children, onClick}) => {
    return (
        <div className={selected ? "gui-button-selected" : "gui-button"}
             onClick={onClick}
        >
            {children}
        </div>
    )
}

export default Button
