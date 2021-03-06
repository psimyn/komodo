import React, {Component, PropTypes} from 'react';
import styles from './Index.css';


class IndexItem extends Component {
  render() {
    return (
      <p>
        <a href={this.props.href} className={styles.link}>{this.props.desc}</a>
      </p>
    );
  }
}

IndexItem.propTypes = {
  desc: PropTypes.string,
  href: PropTypes.string,
};


export class Index extends Component {
  setCookie (evt) {
    if (evt.target.checked) {
      localStorage.setItem('tvMode', true);
    } else {
      localStorage.removeItem('tvMode');
    }
  }

  render() {
    const list = this.props.dashboards.map((dashboard) => {
      const href = '/' + dashboard.slug;
      return (<IndexItem key={dashboard.slug} desc={dashboard.description} href={href} />);
    });
    const title = this.props.title || "Dashboards";
    const checked = this.props.tvMode;
    return (
      <div className={styles.container}>
        <h1 className={styles.heading}>{title}</h1>
        {list}
        <input name="tvMode"
          type="checkbox"
          defaultChecked={checked}
          {...checked}
          onChange={this.setCookie} />
        <label for="tvMode">TV Mode (fixed-width)</label>
      </div>
    );
  }
}

Index.propTypes = {
  dashboards: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
    })
  ).isRequired,
  title: PropTypes.string,
  tvMode: PropTypes.bool,
};
