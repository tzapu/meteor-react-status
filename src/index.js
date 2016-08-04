import React, { Component, PropTypes } from 'react';

import LinearProgress from 'material-ui/LinearProgress';

class ConnectionStatus extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isConnected: true,
      isConnecting: false,
      retryTime: 0,
      retryInterval: 0,
    };
  }

  getStyles() {
    return {
      statusContainer: {
        zIndex: 3000,
        textAlign: 'center',
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        display: 'flex',
        visibility: this.state.isConnected ? 'hidden' : 'visible',
        transform: !this.state.isConnected ? 'translate3d(0, 0, 0)' : 'translate3d(0, 48px, 0)',
        transition: 'transform 400ms cubic-bezier(0.23, 1, 0.32, 1), visibility 1000ms cubic-bezier(0.23, 1, 0.32, 1)',
        //transition: `${transitions.easeOut('400ms', 'transform')}, ${
        //transitions.easeOut('400ms', 'visibility')}`,
      },
      status: {
        height: '48px',
        lineHeight: '44px',
        borderRadius: '2px',
        margin: 'auto',
        textAlign: 'center',
        minWidth: this.props.fullWidth ? '100%' : '288px',
        backgroundColor: '#D32F2F',
        transition: 'background-color 400ms linear',
      },
      statusText: {
        fontSize: '14px',
        color: '#fff',
      },
    };
  }

  componentDidMount() {
    let retryHandle = null;

    clearRetryInterval = () => {
      clearInterval(retryHandle)
      retryHandle = null
    }

    trackStatus = () => {
      if (Meteor.status().status === 'waiting') {
        retryHandle = retryHandle || setInterval(() => {
          let timeDiff   = Math.round((Meteor.status().retryTime - (new Date).getTime()) / 1000);
          let _retryTime = timeDiff > 0 && timeDiff || 0;
          let _retryInterval = Math.max(this.state.retryInterval, timeDiff);

          this.setState({
            retryTime: _retryTime,
            retryInterval: _retryInterval,
          });
        }, 500);

        this.setState({
          isConnected: false,
          isConnecting: false,
          retryHandle,
        })
      } else {
        clearRetryInterval();
      }

      if (Meteor.status().status === 'offline') {
        this.setState({
          isConnected: false,
          isConnecting: false,
        })
      }

      if (Meteor.status().status === 'connecting') {
        this.setState({
          isConnecting: true,
          retryInterval: 0,
        })
      }

      if (Meteor.status().connected) {
        this.setState({
          isConnected: true,
          isConnecting: false,
        })
      }
      console.log(this.state);
    }

    Meteor.autorun(trackStatus);
  }

  componentWillMount() {
    clearInterval(this.state.retryHandle);
  }

  render() {
    const styles = this.getStyles();
    let text = '';
    let node = <div></div>

    if (!this.state.isConnected) {
      if (this.state.isConnecting) {
        text = 'connecting';
        styles.status.backgroundColor = '#81D4FA';
      } else {
        text = 'waiting to retry connection';
        styles.status.backgroundColor = '#D32F2F';
      }
    } else {
      text = 'connected';
      styles.status.backgroundColor = '#4CAF50';
    }

    return (
      <div style={styles.statusContainer}>
        <div style={styles.status}>
          <LinearProgress
            color={styles.status.backgroundColor}
            mode={
              this.state.retryInterval !== 0
              ? 'determinate'
              : 'indeterminate' //not working really, seems not to be triggering an update
            }
            value={this.state.retryTime / this.state.retryInterval * 100}
          />
          <div style={styles.statusText}>
            {text}
          </div>
        </div>
      </div>
    );
  }
}

export default (ConnectionStatus);
