import React, {Component, PropTypes} from 'react';
import styles from './Number.css';
import {WidgetBox} from 'Dashmat';


export class Number extends Component {
  render() {
    const {title, suffix, prefix, threshold, data} = this.props;
    let backgroundColor = this.props.backgroundColor;
    const lastUpdated = new Date(this.props.lastUpdated);
    let value = null, last = null;
    if (typeof data == 'object') {
      value = data.value;
      if (data.last) {
        const percent = Math.round(Math.abs((data.last - data.value) / data.last) * 100, 2);
        const arrow = data.value > data.last ? '↑' : '↓';
        last = (
          <span className={styles.last}>{arrow} {percent}%</span>
        );
      }
    } else {
      value = data;
    }

    if (typeof threshold != 'undefined') {
      backgroundColor = value < threshold ? '#1d8147' : '#e74c3c';
    }
    return (
      <WidgetBox className={styles.container} color={backgroundColor}>
        <h1 className={styles.heading}>{title}</h1>
        <span className={styles.value}>{prefix}{value}{suffix}</span>
        {last}
        <small className={styles.last_updated}>Last updated {lastUpdated.toLocaleTimeString()}</small>
      </WidgetBox>
    );
  }
}

Number.propTypes = {
  data: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.shape({
      value: PropTypes.number.isRequired,
      last: PropTypes.number,
    }),
  ]),
  lastUpdated: PropTypes.string,
  title: PropTypes.string,
  suffix: PropTypes.string,
  prefix: PropTypes.string,
  backgroundColor: PropTypes.string,
  threshold: PropTypes.number,
};

Number.defaultProps = {
  prefix: '',
  suffix: '',
};
