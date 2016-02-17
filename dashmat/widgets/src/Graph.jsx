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
    const {area, backgroundColor, suffix, title, min, max, stack, summaryMethod} = this.props;
    let data = this.props.data;

    const chartConfig = {
      axisX: {
        showGrid: false,
        showLabel: false,
        offset: 0,
      },
      axisY: {
        showGrid: false,
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

    let chartClass = 'ct-octave';
    if (stack) {
      const zipped = data.series[0].data.map((series, i) => {
        return data.series.map(array => array.data[i])
      });

      const series = data.series.map((series, seriesNumber) => {
        return {
          name: series.name,
          data: series.data.map((val, i) => {
                  return zipped[i].slice(0, seriesNumber + 1).reduce((a, b) => a + b, 0)
                })
        };
      }).reverse();
      // Update chart data
      data = Object.assign({}, data, {series: series});

      if (chartConfig.high == undefined) {
        chartConfig.high = Math.max(...data.series.map(series => Math.max(series.data)));
      }
      chartClass += ' ' + styles.stacked
    }

    let displayedValue = data.value;
    if (!displayedValue && summaryMethod) {
      if (summaryMethod == 'maxLast') {
        displayedValue = Math.max(
          ...data.series.map((s) => {
            return s.data[s.data.length - 1];
          })
        );
      }
    }

    return (
      <WidgetBox className={styles.container} color={backgroundColor}>
        <div className={styles.text}>
          <div className={styles.title}>{title}</div>
          <div className={styles.value}>{displayedValue}{suffix}</div>
        </div>

        <ChartistGraph className={chartClass} data={data} options={chartConfig} type="Line" />
      </WidgetBox>
    );
  }
}

Graph.propTypes = {
  data: PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    labels: PropTypes.array,
    series: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        data: PropTypes.array.isRequired,
      }).isRequired
    ).isRequired,
  }),
  title: PropTypes.string,
  backgroundColor: PropTypes.string,
  suffix: PropTypes.string,
  area: PropTypes.bool,
  stack: PropTypes.bool,
  min: PropTypes.number,
  max: PropTypes.number,
  summaryMethod: PropTypes.string,
};

Graph.defaultProps = {
  area: true,
  suffix: '',
  title: '',
  backgroundColor: '#2c3e50',
  min: 0,
};
