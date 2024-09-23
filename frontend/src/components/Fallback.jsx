import React, { Component } from 'react';
import styles from '../styles/Fallback.module.css';
import { FallBackText } from '../helpers/enums';

class Fallback extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('Error caught by Error Boundary:', error, info);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.fallbackUI}>
          <h2>{FallBackText.UNAVAILABLE_MSG}</h2>
          <p>{FallBackText.UNAVAILABLE_SUB_MSG}</p>
          <button onClick={this.handleReload}>{FallBackText.RELOAD}</button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default Fallback;
