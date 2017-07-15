require('./index.less')

import ReactDOM from 'react-dom'
import React from 'react'
import Router from './Router'

require('./state').initialize(ps)
if (typeof document !== 'undefined') {
    let root = document.createElement('div')
    document.body.appendChild(root)
    ReactDOM.render((
            Router
        ),
        root
    )
}

