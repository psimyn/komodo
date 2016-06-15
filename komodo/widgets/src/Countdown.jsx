import React, {Component, PropTypes} from 'react';
import styles from './Number.css';
import {WidgetBox} from 'komodo';
import moment from 'moment';


export class Countdown extends Component {
  constructor(props) {
    super(props);
    this.state = {display: this.getEta()};
  }

  componentDidMount() {
    this.timer = setInterval(this.refresh.bind(this), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  refresh() {
    this.setState({
      display: this.getEta()
    });
  }

  getEta() {
    if (this.props.data) {
      const eta = new Date(this.props.data);
      const now = new Date();
      if (eta <= now) {
        return this.props.endingText;
      } else {
        const diff = (eta - now) / 1000;
        const minutes = Math.floor(diff / 60) % 60;
        let seconds = Math.floor(diff % 60);
        if (seconds < 10) {
          seconds = '0' + seconds;
        }
        return minutes + ':' + seconds;
      }
    }
    return null;
  }

  render() {
    const {title} = this.props;
    let backgroundColor = this.props.backgroundColor;
    const lastUpdated = new Date(this.props.lastUpdated);

    if (!this.state.display) {
      return (
        <WidgetBox className={styles.container} color={backgroundColor}>
          <h1 className={styles.heading}>{title}</h1>
          <span className={styles.value}>No Data</span>
        </WidgetBox>
      );
    }

    return (
      <WidgetBox className={styles.container} color={backgroundColor}>
        <h1 className={styles.heading}>{title}</h1>
        <span className={styles.value}>{this.state.display}</span>
        <small className={styles.last_updated}>Last updated {lastUpdated.toLocaleTimeString()}</small>
      </WidgetBox>
    );
  }
}

Countdown.propTypes = {
  data: PropTypes.string,
  lastUpdated: PropTypes.string,
  title: PropTypes.string,
  backgroundColor: PropTypes.string,
  endingText: PropTypes.string,
};

Countdown.defaultProps = {
  endingText: 'NOW'
};
