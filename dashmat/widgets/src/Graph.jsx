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
    const chartData = {
      series: data,
    };

    const chartConfig = {
      axisX: {
        type: Chartist.AutoScaleAxis,
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
        <div>{options.title}</div>
        <ChartistGraph data={chartData} options={chartConfig} type="Line" />
      </WidgetBox>
    );
  }
}

Graph.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      data: PropTypes.array.isRequired,
    })
  ),
  options: PropTypes.shape({
    title: PropTypes.string,
    backgroundColor: PropTypes.string,
  }),
};
