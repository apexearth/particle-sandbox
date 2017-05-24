require('./index.less')

import React from 'react'
import ReactDOM from 'react-dom'
import Root from './Root'

module.exports = {
    initialize: ps => {
        require('./state').initialize(ps)
        if (typeof document !== 'undefined') {
            let root = document.createElement('div')
            document.body.appendChild(root)
            ReactDOM.render(
                <Root instance={ps}/>,
                root
            )
        }
    }
}

