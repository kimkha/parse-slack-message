import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class ListMessage extends PureComponent {
  render() {
    const { data, users } = this.props;

    return (
      <div>
        {data.map(item => (
          <div key={item.ts}>{users[item.user].name}: {item.text}</div>
        ))}
      </div>
    );
  }
}

ListMessage.propTypes = {
  data: PropTypes.array.required,
  users: PropTypes.any.required,
};

ListMessage.defaultProps = {};

export default ListMessage;
