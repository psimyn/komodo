import React, {Component, PropTypes} from 'react';
import styles from './Graph.css';
import {WidgetBox} from 'Dashmat';
import ChartistGraph from 'react-chartist';
import Chartist from 'chartist';

// Put the chartist CSS into the page. Magic!
require('style-loader!raw!chartist/dist/chartist.min.css');


export class Graph extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {area, backgroundColor, suffix, title, min, max, data, stack} = this.props;

    const chartConfig = {
      axisX: {
        showGrid: false,
        showLabel: false,
        offset: 0,
      },
      axisY: {
        showGrid: true,
        showLabel: false,
        offset: 0,
      },
      low: min,
      high: max,
      height: 340,
      showPoint: false,
      showArea: area,
      fullWidth: true,
      chartPadding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      },
    };

    if (!data) {
      // Show "No data"
      return (
        <WidgetBox className={styles.container} color={backgroundColor}>
          <div className={styles.text}>
            <div className={styles.title}>{title}</div>
            <div className={styles.value}>No data</div>
          </div>
        </WidgetBox>
      );
    }

    if (stack) {
      const zipped = data.series[0].map((series, i) => {
        return data.series.map(array => array[i])
      });

      data.series = data.series.map(series => series.map((val, i) => {
        return zipped[i].filter((a, idx) => idx < i).reduce((a, b) => a + b, val)
      }))

      chartConfig.high = Math.max(...data.series.map(series => Math.max(series)))
    }

    return (
      <WidgetBox className={styles.container} color={backgroundColor}>
        <div className={styles.text}>
          <div className={styles.title}>{title}</div>
          <div className={styles.value}>{data.value}{suffix}</div>
        </div>
        <ChartistGraph className="ct-octave" data={data} options={chartConfig} type="Line" />
      </WidgetBox>
    );
  }
}

Graph.propTypes = {
  data: PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    labels: PropTypes.array,
    series: PropTypes.array.isRequired,
  }),
  title: PropTypes.string,
  backgroundColor: PropTypes.string,
  suffix: PropTypes.string,
  area: PropTypes.bool,
  stack: PropTypes.bool,
  min: PropTypes.number,
  max: PropTypes.number,
};

Graph.defaultProps = {
  area: true,
  suffix: '',
  title: '',
  backgroundColor: '#2c3e50',
}
