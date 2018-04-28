import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Main extends Component {
  state = {
    token: '',
    start: '',
    end: '',
  };

  updateMessages = () => {
    const { start_channel, start_time, end_time } = this.state;
    if (start_channel && start_time > 0 && end_time >= start_time) {
      console.log('OK');
    }
  };

  parseUrl = (key, value) => {
    if (value) {
      let map = {[key]: value};

      const re = /archives\/(\w+)\/p(\d+)/i;
      const found = value.match(re);

      if (found.length > 2) {
        map[`${key}_channel`] = found[1];
        map[`${key}_time`] = Number(found[2]);
      }

      return map;
    }
    return {};
  };

  onChange = (newValue) => {
    if (newValue.start) {
      newValue = this.parseUrl('start', newValue.start);
    } else if (newValue.end) {
      newValue = this.parseUrl('end', newValue.end);
    }
    this.setState(newValue);
    this.updateMessages();
  };

  onChangeToken = (event) => {
    this.setState({token: event.target.value});
  };

  render() {
    const { children } = this.props;
    const { token } = this.state;

    return (
      <div>
        <div>
          <label>
            Token:
            <input value={token} onChange={this.onChangeToken}/>
          </label>
        </div>
        <div>
          <label>
            Range start (message URL):
            <input onChange={event => this.onChange({start: event.target.value})}/>
          </label>
        </div>
        <div>
          <label>
            Range end (message URL):
            <input onChange={event => this.onChange({end: event.target.value})}/>
          </label>
        </div>
      </div>
    );
  }
}

Main.propTypes = {};

Main.defaultProps = {};

export default Main;
