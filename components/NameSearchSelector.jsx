import React, { Component } from "react";
import { Select } from "@alifd/next";
import { convertTreeDataResponse } from "../helpers/iceworks";

export default class NameSearchSelector extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dataSource: []
    };
  }

  componentDidMount() {
    const { searchOnInit, getDefaultDataSource } = this.props;
    if (getDefaultDataSource) {
      getDefaultDataSource().then(data => {
        // console.log(convertTreeDataResponse(data))
        this.setState({
          dataSource: convertTreeDataResponse(data)
        });
      });
    } else {
      if (searchOnInit) {
        this.onSearch();
      }
    }
  }

  //todo: optimize
  componentWillReceiveProps(newProps) {
    const { dataSource } = this.state;
    if (
      !(this.props.value > 0) &&
      newProps.value > 0 &&
      !dataSource.some(t => t.value == newProps.value)
    ) {
      if (newProps.getDefaultDataSource) {
        // console.log(1);
        newProps.getDefaultDataSource().then(data => {
          // console.log(convertTreeDataResponse(data))
          this.setState({
            dataSource: convertTreeDataResponse(data)
          });
        });
      }
    }
  }

  onSearch = name => {
    const pageSize = this.props.pageSize || 10;
    this.props.onSearch(name, pageSize).then(list => {
      // console.log(list);
      this.setState({
        dataSource: convertTreeDataResponse(list)
      });
    });
  };

  render() {
    const { dataSource } = this.state;
    // console.log(this.props);
    const {
      onSearch,
      pageSize,
      searchOnInit,
      showSearch,
      getDefaultDataSource,
      ...props
    } = this.props;
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
