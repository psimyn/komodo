import React from 'react';
import ReactDOM from 'react-dom';
import {Dashboard} from './Dashboard.jsx';
import {Index} from './Index.jsx';
import WidgetBox from './components/WidgetBox.jsx';

// Bootstrap function for browser
export function dashboard(props) {
  const element = React.createElement(Dashboard, props);
  ReactDOM.render(element, document.getElementById('page-content'));
}

export function index(props) {
  const element = React.createElement(Index, props);
  ReactDOM.render(element, document.getElementById('page-content'));
}

// Expose to other modules
export {WidgetBox as WidgetBox, React as React, ReactDOM as ReactDOM};
