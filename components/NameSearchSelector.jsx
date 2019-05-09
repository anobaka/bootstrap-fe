import React, { Component } from 'react';
import { Select } from '@alifd/next';
import { convertTreeDataResponse } from '../helpers/iceworks';

export default class NameSearchSelector extends Component {

  constructor(props) {
    super(props);

    this.state = {
      dataSource: []
    }
  }

  componentDidMount() {
    if (this.props.searchOnInit) {
      this.onSearch();
    }
  }

  onSearch = (name) => {
    const pageSize = this.props.pageSize || 10;
    this.props.onSearch(name, pageSize).then(list => {
      console.log(list); 
      this.setState({
        dataSource: convertTreeDataResponse(list)
      })
    })
  }

  render() {
    const { dataSource } = this.state;
    return (
      <Select
        showSearch
        {...this.props}
        dataSource={dataSource}
        onSearch={this.onSearch}
      />
    );
  }
}
