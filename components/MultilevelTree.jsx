import React, { Component } from "react";
import { Dialog, Tree, Button, Grid } from "@alifd/next";
import {
  FormBinderWrapper as IceFormBinderWrapper,
  FormBinder as IceFormBinder,
  FormError as IceFormError
} from "@icedesign/form-binder";
import IceContainer from "@icedesign/container";
import _ from "lodash";

import { findItemByPos, findParentItemByPos } from "../helpers/iceworks";

const { Row, Col } = Grid;

export default class MultilevelTree extends Component {
  static displayName = "MultilevelTree";

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);

    this.state = {
      deleteConfirmDialogVisible: false,
      datalist: [],
      expandedKeys: ["0"],
      // current item
      data: {}
    };
  }

  onTreeExpand = (expandedKeys, extra) => {
    // console.log(expandedKeys, extra);
    // todo: Sometimes extra.node is not a TreeNode!!!
    const node = extra.node.node || extra.node;
    const { pos } = node.props;
    const { datalist } = this.state;
    const data = findItemByPos(datalist, pos);
    const keys = this.getAllLoadedDataKeys(data.children);
    expandedKeys = _.difference(expandedKeys, keys);
    // console.log(data, keys, expandedKeys);
    this.setState({
      expandedKeys
    });
  };

  getDefaultLabel = () => {
    return this.props.defaultLabel || "双击添加";
  };

  renderLabel = data => {
    return (
      (this.props.renderLabel && this.props.renderLabel(data)) || data.name
    );
  };

  getMode = () => {
    return this.props.editable
      ? "editable"
      : this.props.selectable
      ? "selectable"
      : undefined;
  };

  onTreeEditFinish = (key, label, node) => {
    // console.log(key, label, node);
    const { pos } = node.props;
    const { datalist } = this.state;
    const data = findItemByPos(datalist, pos);
    const parent = findParentItemByPos(datalist, pos);
    if (key.startsWith("new-")) {
      if (!label) {
        data.label = this.getDefaultLabel();
        this.setState({
          datalist
        });
      } else {
        if (label != this.getDefaultLabel()) {
          this.props
            .create({
              model: {
                parentId: parent.key > 0 ? parent.key : null,
                name: label
              }
            })
            .invoke(t => {
              if (!t.code) {
                const newData = {
                  key: t.data.id.toString(),
                  label: this.renderLabel(t.data)
                };
                this.populateChildren(newData);
                const { expandedKeys } = this.state;
                parent.children.splice(-1, 0, newData);
                this.setState({
                  datalist,
                  expandedKeys: _.union(expandedKeys, [newData.key])
                });
              }
            });
        }
      }
    } else if (key == "0") {
      data.label = this.props.resourceDisplayName;
      this.setState({
        datalist
      });
    } else if (label) {
      this.props
        .update({
          id: key,
          model: {
            name: label
          }
        })
        .invoke(t => {
          if (!t.code) {
            data.data.name = label;
            data.label = this.renderLabel(data.data);
            this.setState({
              datalist
            });
          }
        });
    } else {
      this.openDeleteConfirmDialog(node);
    }
  };

  getNextLevelDataList = node => {
    // todo: Sometimes node is not a TreeNode!!!
    node = node.node || node;
    // console.log(node);
    const { pos } = node.props;
    const { datalist } = this.state;
    const data = findItemByPos(datalist, pos);
    return new Promise((resolve, reject) => {
      if (!data.isLeaf && (!data.children || data.children.length < 2)) {
        this.props
          .getNextLevelDataList({
            id: data.key
          })
          .invoke(t => {
            resolve();
            this.populateChildren(data, t.data);
            const { expandedKeys } = this.state;
            this.setState({
              datalist,
              expandedKeys: _.union(expandedKeys, [data.key])
            });
          });
      } else {
        resolve();
      }
    });
  };

  populateChildren = (parent, datalist) => {
    datalist = datalist || [];
    const data = datalist.map(a => {
      var d = {
        key: a.id.toString(),
        label: this.renderLabel(a),
        isLeaf: a.isLeaf,
        data: a
      };
      this.populateChildren(d, a.children);
      return d;
    });
    data.push({
      key: `new-${parent.key}`,
      label: this.getDefaultLabel(),
      isLeaf: true
    });
    parent.children = data;
    return parent;
  };

  componentDidMount() {
    this.props.getRootDataList().invoke(t => {
      const root = {
        label: this.props.resourceDisplayName,
        key: "0"
      };
      this.populateChildren(root, t.data);
      let { expandedKeys } = this.state;
      const keys = this.getAllLoadedDataKeys([root]);
      expandedKeys = _.union(expandedKeys, keys);
      // console.log(keys, expandedKeys);
      this.setState({
        datalist: [root],
        expandedKeys
      });
    });
  }

  getAllLoadedDataKeys = (list, keys) => {
    list = list || [];
    keys = _.union(
      keys || [],
      list.filter(t => t.children && t.children.length > 1).map(t => t.key)
    );
    // console.log(keys, list);
    list.forEach(t => {
      if (t.children && t.children.length) {
        keys = _.union(keys, this.getAllLoadedDataKeys(t.children, keys));
      }
    });
    return keys;
  };

  delete = () => {
    const { node, datalist } = this.state;
    if (node) {
      const { pos } = node.props;
      const data = findItemByPos(datalist, pos);
      this.props.delete({ id: data.key }).invoke(t => {
        if (!t.code) {
          const parent = findParentItemByPos(datalist, pos);
          parent.children = parent.children.filter(a => a.key != data.key);
          this.setState({
            datalist
          });
          this.closeDeleteConfirmDialog();
        }
      });
    }
  };

  openDeleteConfirmDialog = node => {
    this.setState({
      deleteConfirmDialogVisible: true,
      node
    });
  };

  closeDeleteConfirmDialog = () => {
    this.dialog && this.dialog.hide();
    this.setState({
      deleteConfirmDialogVisible: false,
      node: null
    });
  };

  dialog;

  onSelect = (selectedKeys, extra) => {
    const { node } = extra;
    const { pos } = node.props;
    const { datalist } = this.state;
    const n = findItemByPos(datalist, pos);
    this.setState(
      {
        data: n.data
      },
      () => {
        // console.log(n);
        this.dialog = Dialog.show({
          title: `${this.props.resourceDisplayName}详情`,
          content: (
            <IceFormBinderWrapper value={this.state.data}>
              <div>
                {this.props.formFields.map(t => (
                  <Row style={styles.formItem}>
                    <Col span="4" style={styles.label}>
                      {t.label}：
                    </Col>
                    <Col span="16">
                      <IceFormBinder
                        name={t.name}
                        {...(t.formBinderProps || {})}
                      >
                        <t.Component
                          style={{ width: "100%" }}
                          {...t.componentProps}
                        />
                      </IceFormBinder>
                    </Col>
                  </Row>
                ))}
              </div>
            </IceFormBinderWrapper>
          ),
          style: {
            minWidth: 800
          },
          closeable: true,
          footer: (
            <div>
              <Button type="primary" onClick={() => this.submitForm(node)}>
                确定
              </Button>
              <Button
                type="primary"
                style={{ marginLeft: 5 }}
                warning
                onClick={() => this.openDeleteConfirmDialog(node)}
              >
                删除
              </Button>
            </div>
          )
        });
        // console.log(this.dialog)
      }
    );
  };

  formCoreSubmit;

  submitForm = node => {
    const { pos } = node.props;
    const { datalist, data } = this.state;
    const n = findItemByPos(datalist, pos);
    const parent = findParentItemByPos(datalist, pos);
    const { key } = n;
    if (key.startsWith("new-")) {
      this.props
        .create({
          model: {
            ...data,
            parentId: parent.key > 0 ? parent.key : null
          }
        })
        .invoke(t => {
          this.dialog.hide();
          if (!t.code) {
            const newData = {
              key: t.data.id.toString(),
              label: this.renderLabel(t.data),
              data: t.data
            };
            this.populateChildren(newData);
            const { expandedKeys } = this.state;
            parent.children.splice(-1, 0, newData);
            this.setState({
              datalist,
              expandedKeys: _.union(expandedKeys, [newData.key])
            });
          }
        });
    } else {
      this.props
        .update({
          id: data.id,
          model: data
        })
        .invoke(t => {
          this.dialog.hide();
          if (!t.code) {
            n.label = this.renderLabel(data);
            this.setState({
              datalist
            });
          }
        });
    }
  };

  render() {
    const {
      datalist,
      expandedKeys,
      deleteConfirmDialogVisible,
      node
    } = this.state;
    const {
      resourceDisplayName,
      getRootDataList,
      getNextLevelDataList,
      update,
      create,
      getInitDataSource,
      renderLabel,
      defaultLabel,
      defaultExpandAll,
      ...props
    } = this.props;
    delete props.delete;

    // compatible with previous versions.
    const editable = this.props.editable == false ? false : true;
    const selectable = editable ? false : this.props.selectable;
    const onSelect = selectable ? this.onSelect : undefined;
    const multiple = !selectable;

    // console.log(this.state)

    return (
      <div className="filter-table">
        <IceContainer title={`${resourceDisplayName}管理`}>
          <Tree
            dataSource={datalist}
            loadData={this.getNextLevelDataList}
            showLine
            editable={editable}
            expandedKeys={expandedKeys}
            onExpand={this.onTreeExpand}
            onEditFinish={this.onTreeEditFinish}
            onSelect={onSelect}
            multiple={multiple}
            selectable={selectable}
            {...props}
          />
        </IceContainer>
        {node ? (
          <Dialog
            visible={deleteConfirmDialogVisible}
            onOk={this.delete}
            closeable="esc,mask,close"
            onCancel={this.closeDeleteConfirmDialog}
            onClose={this.closeDeleteConfirmDialog}
            title={`正在删除${node.props.label}`}
          >
            一旦删除不可恢复，子级数据也会被一起删除，确认删除{node.props.label}
            吗？
          </Dialog>
        ) : null}
      </div>
    );
  }
}

const styles = {
  label: {
    textAlign: "right",
    marginRight: "10px"
  },
  formItem: {
    alignItems: "center",
    marginBottom: 25
  }
};
