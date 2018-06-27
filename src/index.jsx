import React from 'react';
import { hot } from 'react-hot-loader';
import { render } from 'react-dom';

const rootElement = document.getElementById('root');

const App = hot(module)(() => <h1>Hi there!</h1>);

render(<App />, rootElement);
