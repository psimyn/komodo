import React, {Component, PropTypes} from 'react';
import styles from './StatusList.css';
import {WidgetBox} from 'Dashing';


export class StatusList extends Component {

  color(entry) {
    if (entry.status) {
      return '#2ecc71';
    }
    return '#e74c3c';
  }

  render() {
    const lst = this.props.data || [];
    const statuses = lst.map((entry) => {
      const style = {
        backgroundColor: this.color(entry)
      };
      return (
        <div key={entry.title} className={styles.status_item} style={style}>
          <h2 className={styles.status_title}>{entry.title}</h2>
          <span className={styles.value}>{entry.value}</span>
        </div>
      );
    });
    return (
      <WidgetBox className={styles.container}>
        {statuses}
      </WidgetBox>
    )
  }
}

StatusList.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      status: PropTypes.bool,
    }).isRequired
  ),
  options: PropTypes.shape({
    threshold: PropTypes.number,
    title: PropTypes.string,
    suffix: PropTypes.string,
    isTime: PropTypes.bool,
  }),
};
