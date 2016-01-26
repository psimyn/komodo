import React, {Component, PropTypes} from 'react';
import styles from './Number.css';
import {WidgetBox} from 'Dashmat';
//import Rickshaw from 'rickshaw';
import ChartistGraph from 'react-chartist';
import Chartist from 'chartist';

require('style-loader!raw!chartist/dist/chartist.min.css');


export class Graph extends Component {
  constructor(props) {
    super(props);
    //this.state = {graph: null, width: 0, height: 0};
  }

  //componentDidMount() {
  //  const colors = ['steelblue', 'lightblue'];
  //  const series = this.props.data.map((series, idx) => {
  //    if (!series.color) {
  //      series.color = colors[idx];
  //    }
  //    return series;
  //  });
  //  const graph = new Rickshaw.Graph({
  //    element: this.refs.chart,
  //    renderer: 'area',
  //    stroke: true,
  //    series: series,
  //  });
  //  graph.render();
  //  this.setState({graph: graph});
  //}

  render() {
    const {options} = this.props;
    const data = {
      //series: [[
      //  {x: 1, y: 100},
      //  {x: 2, y: 50},
      //  {x: 3, y: 25},
      //  {x: 5, y: 12.5},
      //  {x: 8, y: 6.25}
      //]],
      high: 100,
      low: 0,
      labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      series: [
        [12, 9, 7, 8, 5],
        [2, 1, 3.5, 7, 3],
        [1, 3, 4, 5, 6],
      ]
    };

    const chartConfig = {
      axisX: {
        type: Chartist.AutoScaleAxis,
        onlyInteger: true,
        high: 100,
        low: 0,
      },
      height: 300,
    };

    return (
      <WidgetBox className={styles.container} color={options.backgroundColor}>
        <ChartistGraph data={data} options={chartConfig} type="Line" />
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
    colors: PropTypes.arrayOf(PropTypes.string),
  }),
};

Graph.defaultProps = {
  options: {
    colors: ['steelblue', 'lightblue']
  },
};
