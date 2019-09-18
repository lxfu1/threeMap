import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'mobx-react';
import * as stores from './store';

import 'static/scss/app.scss';
import 'rodal/lib/rodal.css';
import 'react-datetime/css/react-datetime.css';
import 'react-select/dist/react-select.css';
import './util/requestNextAnimationFrame';
import './util/global'
import Routes from './routes';

render(
    <Provider {...stores}>
        <Routes />
    </Provider>,
    document.getElementById('root')
);
