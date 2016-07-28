(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', 'react', 'material-ui/styles/colors', 'material-ui/LinearProgress'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('react'), require('material-ui/styles/colors'), require('material-ui/LinearProgress'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.react, global.colors, global.LinearProgress);
    global.index = mod.exports;
  }
})(this, function (exports, _react, _colors, _LinearProgress) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _react2 = _interopRequireDefault(_react);

  var _LinearProgress2 = _interopRequireDefault(_LinearProgress);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  var ConnectionStatus = function (_React$Component) {
    _inherits(ConnectionStatus, _React$Component);

    function ConnectionStatus(props) {
      _classCallCheck(this, ConnectionStatus);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ConnectionStatus).call(this, props));

      _this.state = {
        isConnected: true,
        isOffline: false,
        isConnecting: false,
        retryTime: 0,
        retryInterval: 0
      };
      return _this;
    }

    _createClass(ConnectionStatus, [{
      key: 'getStyles',
      value: function getStyles() {
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
            transition: 'transform 400ms cubic-bezier(0.23, 1, 0.32, 1), visibility 1000ms cubic-bezier(0.23, 1, 0.32, 1)'
          },
          status: {
            height: '48px',
            lineHeight: '44px',
            borderRadius: '2px',
            margin: 'auto',
            textAlign: 'center',
            minWidth: this.props.fullWidth ? '100%' : '288px',
            backgroundColor: '#D32F2F',
            transition: 'background-color 400ms linear'
          },
          statusText: {
            fontSize: '14px',
            color: '#fff'
          }
        };
      }
    }, {
      key: 'componentDidMount',
      value: function componentDidMount() {
        var _this2 = this;

        var retryHandle = null;

        clearRetryInterval = function clearRetryInterval() {
          clearInterval(retryHandle);
          retryHandle = null;
        };

        trackStatus = function trackStatus() {
          if (Meteor.status().status === 'waiting') {
            retryHandle = retryHandle || setInterval(function () {
              var timeDiff = Math.round((Meteor.status().retryTime - new Date().getTime()) / 1000);
              var _retryTime = timeDiff > 0 && timeDiff || 0;
              var _retryInterval = Math.max(_this2.state.retryInterval, timeDiff);

              _this2.setState({
                retryTime: _retryTime,
                retryInterval: _retryInterval
              });
            }, 500);

            _this2.setState({
              isConnected: false,
              isConnecting: false,
              retryHandle: retryHandle
            });
          } else {
            clearRetryInterval();
          }

          if (Meteor.status().status === 'offline') {
            _this2.setState({
              isOffline: true,
              isConnected: false,
              isConnecting: false
            });
          }

          if (Meteor.status().status === 'connecting') {
            _this2.setState({
              isConnecting: true,
              retryInterval: 0
            });
          }

          if (Meteor.status().connected) {
            _this2.setState({
              isConnected: true,
              isOffline: false,
              isConnecting: false
            });
          }
          console.log(_this2.state);
        };

        Meteor.autorun(trackStatus);
      }
    }, {
      key: 'componentWillMount',
      value: function componentWillMount() {
        clearInterval(this.state.retryHandle);
      }
    }, {
      key: 'render',
      value: function render() {
        var styles = this.getStyles();
        var text = '';
        var node = _react2.default.createElement('div', null);

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

        return _react2.default.createElement(
          'div',
          { style: styles.statusContainer },
          _react2.default.createElement(
            'div',
            { style: styles.status },
            _react2.default.createElement(_LinearProgress2.default, {
              color: styles.status.backgroundColor,
              mode: this.state.retryInterval !== 0 ? 'determinate' : 'indeterminate' //not working really, seems not to be triggering an update
              ,
              value: this.state.retryTime / this.state.retryInterval * 100
            }),
            _react2.default.createElement(
              'div',
              { style: styles.statusText },
              text
            )
          )
        );
      }
    }]);

    return ConnectionStatus;
  }(_react2.default.Component);

  exports.default = ConnectionStatus;
});