import React, {Component, PropTypes} from 'react';
import styles from './WidgetBox.css';

export default class WidgetBox extends Component {
  render() {
    const style = {
      backgroundColor: this.props.color,
    };
    let className = styles.widget;
    if (this.props.className) {
      className += ' ' + this.props.className;
    }
    return <div className={className} style={style}>{this.props.children}</div>;
  }
}

WidgetBox.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.element,
  ]),
  color: PropTypes.string,
  className: PropTypes.string,
};
