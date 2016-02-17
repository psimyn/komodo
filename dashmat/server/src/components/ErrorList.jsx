import React, {Component, PropTypes} from 'react';
import styles from './ErrorList.css';

export class ErrorList extends Component {

  render() {
    const errors = this.props.errors || [];
    const messages = Object.keys(errors).map((key) => {
      const error = errors[key];
      return (
        <div key={key} className={styles.item}>
          <strong>{key}</strong> {error}
        </div>
      );
    });
    return (
      <div className={styles.container}>
        {messages}
      </div>
    );
  }
}

ErrorList.propTypes = {
  errors: PropTypes.objectOf(PropTypes.string),
};
