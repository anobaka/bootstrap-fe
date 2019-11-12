import React, { Component } from "react";
import { Upload as IceUpload } from "@alifd/next";
import path from "path";

export default class Upload extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  buildIceValue = url => {
    const questionMarkIndex = url.lastIndexOf("?");
    if (questionMarkIndex > -1) {
      url = url.substring(0, questionMarkIndex);
    }
    const filename = path.basename(url);
    return {
      name: filename,
      fileName: filename,
      state: "done",
      downloadURL: url,
      fileURL: url,
      imgURL: url,
      url
    };
  };

  uploadFormatter = rsp => {
    const formattedRsp = {
      success: rsp.code == 0,
      ...(rsp.code == 0 ? this.buildIceValue(rsp.data) : {})
    };
    return formattedRsp;
  };

  componentWillReceiveProps(props) {
    if (props.value != this.props.value) {
    }
  }

  onChange = fileList => {
    const { onChange, limit } = this.props;
    const validUrls =
      fileList && fileList.filter(t => t.state == "done").map(a => a.url);
    if (onChange) {
      if (validUrls && validUrls.length > 0) {
        if (limit == 1) {
          return onChange(validUrls[0]);
        }
        return onChange(validUrls);
      }
      return onChange();
    }
  };

  render() {
    const {
      limit,
      value,
      onChange,
      action,
      accept,
      IceComponent,
      name,
      listType,
      ...props
    } = this.props;

    const iceValue = (Array.isArray(value)
      ? value
      : (value && [value]) || []
    ).map(url => this.buildIceValue(url));

    const mergedProps = {
      action,
      onChange: this.onChange,
      limit,
      formatter: this.uploadFormatter,
      value: iceValue,
      useDataURL: true,
      listType: listType || "card",
      accept:
        accept || "image/png, image/jpg, image/jpeg, image/gif, image/bmp",
      name: "file",
      ...props
    };

    const RealComponent = IceComponent || IceUpload.Card;

    return (
      <RealComponent {...mergedProps}>
        {this.props.children || "点击上传"}
      </RealComponent>
    );
  }
}
