import React, {Component, PropTypes} from 'react';
import styles from './Gauge.css';
import {WidgetBox} from 'Dashmat';
import ChartistGraph from 'react-chartist';
import Chartist from 'chartist';

export class Gauge extends Component {
  render() {
    const {options, value} = this.props
    const max = options.max || 100
    const lastUpdated = new Date(this.props.lastUpdated)

    const chartConfig = {
      labelInterpolationFnc: function(value) {
        return value
      },
      donut: true,
      donutWidth: 30,
      startAngle: 225,
      total: max * 1.33,
      showLabel: false,
      width: 400,
    }

    const data = {
      series: [value, max - value]
    }

    return (
      <WidgetBox className={styles.container} color={options.backgroundColor}>
        <h1 className={styles.heading}>{options.title}</h1>
        <ChartistGraph className="ct-octave" data={data} options={chartConfig} type="Pie" />
        <span className={styles.value}>{options.prefix}{value}{options.suffix}</span>
        <small className={styles.last_updated}>Last updated {lastUpdated.toLocaleTimeString()}</small>
      </WidgetBox>
    );
  }
}

Gauge.propTypes = {
  value: PropTypes.number,
  lastUpdated: PropTypes.string,
  options: PropTypes.shape({
    title: PropTypes.string,
    backgroundColor: PropTypes.string,
    max: PropTypes.number,
  }),
};

Gauge.defaultProps = {
  value: 0,
  options: {
    max: 100,
  },
};
