import React, { Component } from "react";
import { CascaderSelect } from "@alifd/next";
import { convertTreeDataResponse, findItemByPos } from "../helpers/iceworks";

export default class MultilevelSelector extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dataSource: [],
      value: this.getValue(),
    };
  }

  componentDidMount() {
    const v = this.getValue();
    if ((Array.isArray(v) && v.length > 0) || v) {
      this.getInitDataSource(this.props.value);
    }
  }

  convertTreeDataResponse = v => (this.props.convertTreeDataResponse || convertTreeDataResponse)(v);

  getInitDataSource = (value) => {
    this.initialized = true;
    this.props.getInitDataSource(value).then((list) => {
      this.setState({
        dataSource: this.convertTreeDataResponse(list),
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
    // console.log('name: ', props.name, ', new props: ', props.value, ', old props: ', this.props.value, ', initialized: ', this.initialized);
    if (!this.props.value && props.value && !this.initialized) {
      this.getInitDataSource(props.value);
      this.setState({ value: this.getValue() });
    }
  }

  onVisibleChange = (visible) => {
    if (visible && !this.initialized) {
      this.getInitDataSource(this.props.value);
    }
    this.props.onVisibleChange && this.props.onVisibleChange(visible);
  };

  getValue = () => {
    const { value } = this.props;
    let v = value;
    if (v != undefined) {
      if (this.props.multiple) {
        v = v.map(v => v.toString());
      } else {
        v = v.toString();
      }
    }
    return v;
  };

  render() {
    const { dataSource } = this.state;
    const {
      getInitDataSource,
      getNextLevelDataList,
      value,
      convertTreeDataResponse,
      onChange,
      onVisibleChange,
      ...props
    } = this.props;

    console.log(this.state.value);

    // const v = this.getValue();

    return (
      <CascaderSelect
        {...props}
        value={this.state.value}
        dataSource={dataSource}
        loadData={this.getNextLevelDataList}
        onChange={this.handleChange}
        onVisibleChange={this.onVisibleChange}
      />
    );
  }
}
