import React, { Component } from 'react';
import { convertTreeDataResponse } from '../helpers/iceworks';

export default class Uploader extends Component {

  constructor(props) {
    super(props);

    this.state = {
      dataSource: []
    }
  }

  componentDidMount() {

  }

  render() {
    const { dataSource } = this.state;
    const { iceComponent, ...props } = this.props;
    return (
      <Select
        showSearch
        {...props}
        dataSource={dataSource}
        onSearch={this.onSearch}
      />
    );
  }
}
