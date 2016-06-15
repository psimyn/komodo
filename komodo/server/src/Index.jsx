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
  render() {
    const list = this.props.dashboards.map((dashboard) => {
      const href = '/' + dashboard.slug;
      return (<IndexItem key={dashboard.slug} desc={dashboard.description} href={href} />);
    });
    const title = this.props.title || "Dashboards";
    return (
      <div className={styles.container}>
        <h1 className={styles.heading}>{title}</h1>
          {list}
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
};
