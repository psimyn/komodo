import React, {Component, PropTypes} from 'react';
import styles from "./Dashboard.css";
import {OfflineIndicator} from './components/OfflineIndicator.jsx';
import {UnknownWidget} from './components/UnknownWidget.jsx';
import {digattr} from './utils.js';


export class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data || {},
      lastUpdated: new Date(),
      error: false,
    };
  }
  refresh() {
    fetch('/data.json')
      .then(data => data.json())
      .then(data => {
        this.setState({
          data: data,
          error: false,
          lastUpdated: new Date(),
        });
      })
      .catch(error => {
        this.setState({error: true});
      });
  }
  componentDidMount() {
    setInterval(this.refresh.bind(this), 2000);
  }

  loadWidget(name) {
    const attrName = 'widget_' + name;
    if (!(attrName in window) || !(name in window[attrName])) {
      return null;
    }
    return window[attrName][name];
  }

  lastUpdatedKey(dataKey) {
    const parts = dataKey.split('.', 2);
    return `${parts[0]}._${parts[1]}_time`;
  }

  render() {
    const widgets = this.props.widgets.map((widget, idx) => {
      const Widget = this.loadWidget(widget.type);
      if (!Widget) {
        return (<UnknownWidget key={idx} type={widget.type}/>);
      }
      let data = null, lastUpdated = null;
      if (widget.data) {
        data = digattr(this.state.data, widget.data);
        lastUpdated = digattr(this.state.data, this.lastUpdatedKey(widget.data));
      }
      return (
        <Widget
          key={idx}
          data={data}
          lastUpdated={lastUpdated}
          {...widget.options || {}}
          />
      );
    });
    return (
      <div className={styles.dashboard}>
        <OfflineIndicator lastUpdated={this.state.lastUpdated} error={this.state.error} />
        {widgets}
      </div>
    )
  };
}

Dashboard.propTypes = {
  widgets: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      data: PropTypes.string,
      options: PropTypes.object,
    })
  ).isRequired,
  data: PropTypes.object,
};
