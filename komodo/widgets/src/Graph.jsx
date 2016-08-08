import React, {Component, PropTypes} from 'react';
import {findDOMNode} from 'react-dom';
import styles from './Graph.css';
import {WidgetBox} from 'komodo';
import ChartistGraph from 'react-chartist';
import Chartist from 'chartist';

// Put the chartist CSS into the page. Magic!
require('style-loader!raw!chartist/dist/chartist.min.css');
require('chartist-plugin-legend');

const colors = {
  blue: '#3298DB',
  yellow: '#F39C12',
  purple: '#8E44AD',
  green: '#27AE60',
  orange: '#E74C3C',
  navy: '#3A5A7A',
}

export class Graph extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {graphType, backgroundColor, suffix, title, min, max, stack, summaryMethod, legend} = this.props;
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
      height: legend ? 310 : 340,
      showPoint: false,
      showArea: graphType === 'area',
      stackBars: stack,
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

    if (legend) {
      chartConfig.plugins = [
        Chartist.plugins.legend({
          className: styles.legend,
          clickable: false,
        })
      ];
    }


    // Show/hide the area under the line charts
    let chartClass = 'ct-octave ';
    if (graphType === 'area') {
      chartClass += ' ' + styles.area
    }

    if (stack) {
      chartClass += ' ' + styles.stack
    }

    // Manually stack the data points for the Line and Area charts.
    if (graphType !== 'bar') {
      const zipped = data.series[0].data.map((series, i) => {
        return data.series.map(array => array.data[i])
      });

      chartClass += ' ct-line'

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
    }

    // The number to display. Either data.value or summaryMethod.
    let displayedValue = data.value;
    if (!displayedValue && summaryMethod) {
      if (summaryMethod == 'maxLast') {
        displayedValue = Math.max(
          ...data.series.map((s) => {
            return s.data[s.data.length - 1];
          })
        );
      }
      if (summaryMethod == 'sumLast') {
        displayedValue = data.series.map((s) => {
          return s.data[s.data.length - 1];
        }).reduce((a, b)=> a + b, 0);
      }
    }

    let seriesLength = data.series.length - 1

    // Set size of the bars
    let listener = {
      draw: (data) => {
        let fill
        if (data.type === 'bar') {
          let numPoints = data.series.data.length * (stack ? 1 : this.props.data.series.length);
          const width = Math.round(100.0 / numPoints)
          const index = data.seriesIndex
          const colorName = Object.keys(colors)[index]
          fill = colors[colorName]
          data.element.attr({
            style: `stroke-width: ${width}%; stroke: ${fill}`,
          })
        } else {
          const index = seriesLength - data.seriesIndex
          const colorName = Object.keys(colors)[index]
          fill = colors[colorName]

          const area = data.group.querySelector('.ct-area')
          if (area) {
            area.attr({
              style: `fill: ${fill}`,
            })
          }

          if (graphType !== 'area') {
            const line = data.group.querySelector('.ct-line:only-child')
            line && line.attr({
              style: `stroke: ${fill}`,
            })
          }
        }

        const li = findDOMNode(this.refs.widget).querySelector(`.ct-legend li:nth-child(${data.seriesIndex + 1})`)
        if (li) {
          const swatch = li.querySelector('span') || document.createElement('span')
          swatch.style.cssText = `
            background: ${fill};
            width: 1em;
            height: 1em;
            vertical-align: middle;
            margin-right: 0.5em;
            display: inline-block;
          `
          if (!li.querySelector('span')) {
            li.insertBefore(swatch, li.childNodes[0])
          }
        }
      }
    }

    return (
      <WidgetBox ref="widget" className={styles.container} color={backgroundColor} width={this.props.width}>
        <div className={styles.text}>
          <div className={styles.title}>{title}</div>
          <div className={styles.value}>{displayedValue}{suffix}</div>
        </div>

        <ChartistGraph
          className={chartClass}
          data={data}
          options={chartConfig}
          listener={listener}
          type={graphType === 'bar' ? 'Bar' : 'Line'}
        />
      </WidgetBox>
    )
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
  graphType: PropTypes.oneOf(['line', 'area', 'bar']),
  stack: PropTypes.bool,
  min: PropTypes.number,
  max: PropTypes.number,
  summaryMethod: PropTypes.string,
  legend: PropTypes.bool,
};

Graph.defaultProps = {
  legend: false,
  suffix: '',
  title: '',
  graphType: 'line',
  backgroundColor: '#2c3e50',
  min: 0,
  summaryMethod: 'maxLast',
};
