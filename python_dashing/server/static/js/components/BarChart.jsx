import React, {Component, PropTypes} from 'react';
import {findDOMNode} from 'react-dom';
import styles from './Number.css';
import WidgetBox from './WidgetBox.jsx';
import {BarChart as Bar} from 'react-d3';

export default class BarChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 0,
      height: 0,
    };
  }

  componentDidMount() {
    const container = findDOMNode(this);
    this.setState({
      containerWidth: container.clientWidth,
      containerHeight: container.clientHeight,
    });
  }

  render() {
    let {data, title} = this.props;
data = [
  {
    name: "series1",
    values: [ { x: 0, y: 20 }, { x: 24, y: 10 } ],
    strokeWidth: 3,
    strokeDashArray: "5,5",
  },
  {
    name: "series2",
    values: [ { x: 70, y: 82 },{ x: 76, y: 82 } ]
  }
];
    return (
      <WidgetBox color="#3498db" className={styles.container}>
        <h1 className={styles.heading}>{title}</h1>
        <Bar className={styles.chart} data={data} width={this.state.containerWidth} height={this.state.containerHeight} />
      </WidgetBox>
    );
  }
};


BarChart.propTypes = {
  data: PropTypes.arrayOf({
    name: PropTypes.string,
    values: PropTypes.arrayOf({
      x: PropTypes.number,
      y: PropTypes.number,
    }),
  }),
  title: PropTypes.string,
};

