import React, { Component } from 'react';
import { CascaderSelect } from '@alifd/next';
import { convertTreeDataResponse, findItemByPos } from '../helpers/iceworks';

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
    return new Promise(resolve => {
      this.props.getNextLevelDataList(data.value).then(list => {
        const { dataSource } = this.state;
        const item = findItemByPos(dataSource, data.pos);
        item.children = convertTreeDataResponse(list);
        this.setState({
          dataSource
        }, resolve);
      });
    });
  }

  render() {
    const { dataSource } = this.state;
    const { getRootDataList, getNextLevelDataList, ...props } = this.props;
    return (
      <CascaderSelect
        {...props}
        dataSource={dataSource}
        loadData={this.getNextLevelDataList}
      />
    );
  }
}
