import React, {Component, PropTypes} from 'react';
import styles from './Number.css';
import {WidgetBox} from 'komodo';
import moment from 'moment';


export class TimeSince extends Component {
  render() {
    const {title, threshold_mins, threshold_days, data} = this.props;
    let backgroundColor = this.props.backgroundColor;
    const lastUpdated = new Date(this.props.lastUpdated);

    if (!data) {
      return (
        <WidgetBox className={styles.container} color={backgroundColor}>
          <h1 className={styles.heading}>{title}</h1>
          <span className={styles.value}>No Data</span>
        </WidgetBox>
      );
    }

    const timestamp = moment(data);

    let value = timestamp.fromNow(true);

    if (typeof threshold_mins != 'undefined') {
      backgroundColor = timestamp > moment().subtract(threshold_mins, 'minutes') ? '#1d8147' : '#e74c3c';
    } else if (typeof threshold_days != 'undefined') {
      backgroundColor = timestamp > moment().subtract(threshold_days, 'days') ? '#1d8147' : '#e74c3c';
    }

    return (
      <WidgetBox className={styles.container} color={backgroundColor}>
        <h1 className={styles.heading}>{title}</h1>
        <span className={styles.value}>{value}</span>
        <small className={styles.last_updated}>Last updated {lastUpdated.toLocaleTimeString()}</small>
      </WidgetBox>
    );
  }
}

TimeSince.propTypes = {
  data: PropTypes.string,
  lastUpdated: PropTypes.string,
  title: PropTypes.string,
  backgroundColor: PropTypes.string,
  threshold_mins: PropTypes.number,
  threshold_days: PropTypes.number,
};
