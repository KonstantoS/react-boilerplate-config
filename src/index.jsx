import React from 'react';
import { hot } from 'react-hot-loader';
import { render } from 'react-dom';

const rootElement = document.getElementById('root');

const application = hot(<h1>Hi there!</h1>);

render(application, rootElement);
