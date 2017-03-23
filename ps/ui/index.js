import React from 'react';
import ReactDOM from 'react-dom';
import Root from './Root'

if (typeof document !== 'undefined') {
    let root = document.createElement('div');
    document.body.appendChild(root);
    ReactDOM.render(
        <Root />,
        root
    );
}