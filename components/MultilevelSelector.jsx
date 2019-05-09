import React, { Component } from 'react';
import { CascaderSelect } from '@alifd/next';
import { convertTreeDataResponse } from '../helpers/iceworks';

export default class MultilevelSelector extends Component {

  constructor(props) {
    super(props);

    this.state = {
      dataSource: []
    };
  }

  componentDidMount() {
    this.props.getRootDataList().then(list => {
      this.setState({
        dataSource: convertTreeDataResponse(list)
      });
    });
  }

  getNextLevelDataList = (data) => {
    this.props.getNextLevelDataList(data.value).then(list => {
      const { dataSource } = this.state;
      data._source.children = convertTreeDataResponse(list);
      console.log(data, list);
      this.setState({
        dataSource
      });
    });
  }

  render() {
    const { dataSource } = this.state;
    return (
      <CascaderSelect
        {...this.props}
        dataSource={dataSource}
        loadData={this.getNextLevelDataList}
      />
    );
  }
}
