import React from 'react'
import {BrowserRouter, Route} from 'react-router-dom'

import Root from './Root'

module.exports = (
    <BrowserRouter>
        <div>
            <Route path="/" render={({location}) => <Root location={location}/>}/>
        </div>
    </BrowserRouter>
)