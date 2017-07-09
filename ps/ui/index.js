require('./index.less')

import ReactDOM from 'react-dom'
import React from 'react'
import {BrowserRouter, Route} from 'react-router-dom'
import Root from './Root'

module.exports = {
    initialize: ps => {
        require('./state').initialize(ps)
        if (typeof document !== 'undefined') {
            let root = document.createElement('div')
            document.body.appendChild(root)
            ReactDOM.render((
                    <BrowserRouter>
                        <Route path="/" render={({location}) => <Root location={location} instance={ps}/>}/>
                    </BrowserRouter>
                ),
                root
            )
        }
    }
}

