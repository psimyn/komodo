import React from 'react';
import ReactDOM from 'react-dom';
import {Dashboard} from './Dashboard.jsx';
import WidgetBox from './WidgetBox.jsx';

// Bootstrap function for browser
export default function bootstrap(config) {
  const element = React.createElement(Dashboard, config);
  ReactDOM.render(element, document.getElementById('page-content'));
}

// Expose to other modules
export {WidgetBox as WidgetBox, React as React};
