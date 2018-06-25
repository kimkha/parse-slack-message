import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getUrl } from './utils';
import ListMessage from './ListMessage';

class Main extends Component {
  state = {
    token: '',
    start: '',
    end: '',
  };

  constructor(props) {
    super(props);

    const newStart = this.parseUrl('start', localStorage.getItem('start'));
    const newEnd = this.parseUrl('end', localStorage.getItem('end'));

    this.state = {
      messages: [],
      users: null,
      token: localStorage.getItem('token'),
      ...newStart, ...newEnd,
    };

    this.updateMessages();
  }

  fetchUsers = () => {
    const { users, token } = this.state;
    if (token && (!users || users.length <= 0)) {
      const url = `https://slack.com/api/users.list?token=${token}`;
      return getUrl(url).then(data => {
        console.log(data);
        if (data && data.members) {
          const users = data.members.reduce(function(map, obj) {
            map[obj.id] = obj;
            return map;
          }, {});
          this.setState({ users });
        }
      });
    }
    return null;
  };

  compareMessage = (a, b) => (a.ts - b.ts);

  updateMessages = async () => {
    const { start_channel, start_time, end_time, token } = this.state;
    await this.fetchUsers();
    if (token && start_channel && start_time > 0 && end_time >= start_time) {
      let url = `https://slack.com/api/channels.history?token=${token}&channel=${start_channel}&oldest=${start_time-0.000001}&latest=${end_time+0.000001}`;
      getUrl(url).then(data => {
        console.log(data);
        if (data && data.messages) {
          const messages = data.messages.sort(this.compareMessage);
          this.setState({messages});
        }
      });
    }
  };

  parseUrl = (key, value) => {
    if (value) {
      let map = {[key]: value};

      const re = /archives\/(\w+)\/p(\d+)/i;
      const found = value.match(re);

      if (found && found.length > 2) {
        map[`${key}_channel`] = found[1];
        map[`${key}_time`] = Number(found[2])/1000000;
      }

      return map;
    }
    return {};
  };

  onChange = (newValue) => {
    if (newValue.start) {
      newValue = this.parseUrl('start', newValue.start);
      localStorage.setItem('start', newValue.start);
    } else if (newValue.end) {
      newValue = this.parseUrl('end', newValue.end);
      localStorage.setItem('end', newValue.end);
    }
    this.setState(newValue);
    setTimeout(this.updateMessages, 200);
  };

  onChangeToken = (event) => {
    const token = event.target.value;
    this.setState({token});
    localStorage.setItem('token', token);
  };

  render() {
    const { children } = this.props;
    const { token, start, end, messages, users } = this.state;

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
            <input value={start} onChange={event => this.onChange({start: event.target.value})}/>
          </label>
        </div>
        <div>
          <label>
            Range end (message URL):
            <input value={end} onChange={event => this.onChange({end: event.target.value})}/>
          </label>
        </div>

        {messages && messages.length > 0 && <ListMessage data={messages} users={users} />}
      </div>
    );
  }
}

Main.propTypes = {};

Main.defaultProps = {};

export default Main;
