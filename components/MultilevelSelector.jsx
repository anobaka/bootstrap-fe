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
    this.getInitDataSource(this.props.value);
  }

  getInitDataSource = (value) => {
    this.props.getInitDataSource(value).then(list => {
      this.setState({
        dataSource: convertTreeDataResponse(list)
      });
    });
  }

  getNextLevelDataList = (data) => {
    return new Promise(resolve => {
      const { dataSource } = this.state;
      const item = findItemByPos(dataSource, data.pos);
      if (!item.children) {
        this.props.getNextLevelDataList(data.value).then(list => {
          item.children = convertTreeDataResponse(list);
          this.setState({
            dataSource
          }, resolve);
        });
      } else {
        resolve();
      }
    });
  }

  componentWillReceiveProps(props) {
    // console.log('new props: ', props, 'old props: ', this.props);
    if (!this.props.value && props.value) {
      this.getInitDataSource(props.value);
    }
  }

  render() {
    const { dataSource } = this.state;
    const { getInitDataSource, getNextLevelDataList, value, ...props } = this.props;
    let v = value;
    if (v) {
      v = v.toString();
    }
    // console.log('rerender:', v);
    return (
      <CascaderSelect
        {...props}
        value={v}
        dataSource={dataSource}
        loadData={this.getNextLevelDataList}
      />
    );
  }
}
