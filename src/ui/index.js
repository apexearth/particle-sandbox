import ReactDOM from 'react-dom'
import React from 'react'
import Router from './Router'
import './index.scss'

require('./state')

if (typeof document !== 'undefined') {
    let root = document.createElement('div')
    document.body.appendChild(root)
    ReactDOM.render(Router, root)
}
