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
    const {options, data} = this.props;

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
      height: 340,
      showPoint: false,
      showArea: true,
      fullWidth: true,
      chartPadding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      },
    };

    return (
      <WidgetBox className={styles.container} color={options.backgroundColor || '#2c3e50'}>
        <div className={styles.text}>
          <div className={styles.title}>{options.title}</div>
          <div className={styles.value}>{data.value}</div>
        </div>
        <ChartistGraph className="ct-octave" data={data} options={chartConfig} type="Line" />
      </WidgetBox>
    );
  }
}

Graph.propTypes = {
  data: PropTypes.shape({
    labels: PropTypes.array,
    series: PropTypes.array.isRequired,
  }),
  options: PropTypes.shape({
    title: PropTypes.string,
    backgroundColor: PropTypes.string,
  }),
};
