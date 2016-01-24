import React, {Component, PropTypes} from 'react';
import WidgetBox from './WidgetBox.jsx';
import styles from "./UnknownWidget.css";


export class UnknownWidget extends Component {
  render() {
    return (
      <WidgetBox className={styles.unknown} color="#C0392B">
        Unknown widget&nbsp;{this.props.type}
      </WidgetBox>
    );
  }
}

UnknownWidget.propTypes = {
  type: PropTypes.string.isRequired,
};