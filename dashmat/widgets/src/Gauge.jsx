import React, {Component, PropTypes} from 'react';
import {WidgetBox} from 'Dashmat';
import ChartistGraph from 'react-chartist';
import Chartist from 'chartist';
import styles from './Gauge.css';

export class Gauge extends Component {
  render() {
    const {options, data} = this.props

    const max = options.max || 100
    const value = data

    const lastUpdated = this.props.lastUpdated ? new Date(this.props.lastUpdated) : null

    const chartConfig = {
      labelInterpolationFnc: function(value) {
        return value
      },
      fullWidth: true,
      donut: true,
      donutWidth: 30,
      startAngle: 225,
      total: max * 1.33,
      showLabel: false
    }

    const val = Math.min(value, max)
    const dataset = {
      series: [val, max - val]
    }

    const backgroundColor = value < options.threshold ? '#1d8147' : '#e74c3c'

    return (
      <WidgetBox className={styles.container} color={backgroundColor}>
        <h1 className={styles.heading}>{options.title}</h1>
        <ChartistGraph className="ct-octave" data={dataset} options={chartConfig} type="Pie" />
        <span className={styles.value}>{options.prefix}{value}{options.suffix}</span>
        { lastUpdated
          ? <small className={styles.last_updated}>Last updated {lastUpdated.toLocaleTimeString()}</small>
          : null
        }
      </WidgetBox>
    );
  }
}

Gauge.propTypes = {
  data: PropTypes.number,
  lastUpdated: PropTypes.string,
  options: PropTypes.shape({
    title: PropTypes.string,
    threshold: PropTypes.number,
    max: PropTypes.number,
  }),
};

Gauge.defaultProps = {
  data: 0,
  options: {
    max: 100,
    threshold: 50
  },
};
