import React, {Component, PropTypes} from 'react';
import styles from './Number.css';
import {WidgetBox} from 'Dashing';

export class Number extends Component {
  render() {
    const {options, title, data} = this.props;
    const lastUpdated = new Date(this.props.lastUpdated);
    return (
      <WidgetBox className={styles.container} color={options.backgroundColor}>
        <h1 className={styles.heading}>{options.title}</h1>
        <span className={styles.value}>{options.prefix}{data}{options.suffix}</span>
        <small className={styles.last_updated}>Last updated {lastUpdated.toLocaleTimeString()}</small>
      </WidgetBox>
    );
  }
}

Number.propTypes = {
  data: PropTypes.number,
  lastUpdated: PropTypes.string,
  options: PropTypes.shape({
    title: PropTypes.string,
    suffix: PropTypes.string,
    prefix: PropTypes.string,
    backgroundColor: PropTypes.string,
  }),
};

Number.defaultProps = {
  options: {
    prefix: '',
    suffix: '',
  },
};
