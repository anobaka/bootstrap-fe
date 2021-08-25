import React, { Component } from "react";
import { CascaderSelect } from "@alifd/next";
import { convertTreeDataResponse, findItemByPos } from "../helpers/iceworks";

export default class MultilevelSelector extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dataSource: [],
      value: props.value,
    };
  }

  componentDidMount() {
    const { value } = this.state;
    if ((Array.isArray(value) && value.length > 0) || value > 0) {
      this.getInitDataSource(value);
    }
  }

  convertTreeDataResponse = v => (this.props.convertTreeDataResponse || convertTreeDataResponse)(v);

  getInitDataSource = (value) => {
    this.initialized = true;
    console.log('Initializing multilevel selector data source');
    this.props.getInitDataSource(value).then((list) => {
      const ds = this.convertTreeDataResponse(list);
      console.log('Multilevel selector data source initialized: ', ds);
      this.setState({
        dataSource: ds,
        value,
      });
    });
  };

  getNextLevelDataList = (data) => {
    return new Promise((resolve) => {
      const { dataSource } = this.state;
      const item = findItemByPos(dataSource, data.pos);
      if (!item.isLeaf && (!item.children || item.children.length == 0)) {
        this.props.getNextLevelDataList(data.value).then((list) => {
          item.children = this.convertTreeDataResponse(list);
          this.setState(
            {
              dataSource,
            },
            resolve
          );
        });
      } else {
        resolve();
      }
    });
  };

  handleChange = (value, data, extra) => {
    // console.log(value);
    this.setState({
      value,
    }, () => {
      this.props.onChange(value);
    });
  };

  componentWillReceiveProps(props) {
    console.log('name: ', props.name, ', new props: ', props.value, ', old props: ', this.props.value, ', initialized: ', this.initialized);
    if (props.value != this.state.value) {
      if (this.initialized) {
        this.setState({ value: props.value });
      } else {
        this.getInitDataSource(props.value);
      }
    }
  }

  onVisibleChange = (visible) => {
    if (visible && !this.initialized) {
      this.getInitDataSource(this.state.value);
    }
    this.props.onVisibleChange && this.props.onVisibleChange(visible);
  };

  render() {
    const { dataSource } = this.state;
    const {
      getInitDataSource,
      getNextLevelDataList,
      convertTreeDataResponse,
      onChange,
      onVisibleChange,
      value,
      ...otherProps
    } = this.props;

    console.log(this.state.value);

    return (
      <CascaderSelect
        {...otherProps}
        value={this.state.value}
        dataSource={dataSource}
        loadData={this.getNextLevelDataList}
        onChange={this.handleChange}
        onVisibleChange={this.onVisibleChange}
      />
    );
  }
}
