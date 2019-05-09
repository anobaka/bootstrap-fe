import React, { Component } from 'react';
import { Dialog, Tree } from '@alifd/next';
import IceContainer from '@icedesign/container';
import _ from 'lodash';

export default class MultilevelTree extends Component {
  static displayName = 'MultilevelTree';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);

    this.state = {
      deleteConfirmDialogVisible: false,
      datalist: [],
      expandedKeys: ['0']
    };
  }

  onTreeExpand = (expandedKeys) => {
    // console.log(expandedKeys, extra);
    this.setState({
      expandedKeys
    })
  }

  onTreeEditFinish = (key, label, node) => {
    // console.log(key, label, node);
    const { data, parent } = node.props;
    const { datalist } = this.state;
    if (key.startsWith('new-')) {
      if (!label) {
        data.label = '双击添加';
        this.setState({
          datalist
        })
      } else {
        this.props.create({
          model: {
            parentId: parent.key > 0 ? parent.key : null,
            name: label
          }
        }).invoke(t => {
          if (!t.code) {
            const newData = {
              key: t.data.id.toString(),
              label: t.data.name,
              parent
            };
            this.populateChildren(newData);
            const { expandedKeys } = this.state;
            parent.children.splice(-1, 0, newData);
            console.log(node);
            this.setState({
              datalist,
              expandedKeys: _.union(expandedKeys, [newData.key])
            });
          }
        });
      }
    } else {
      if (key == '0') {
        data.label = this.props.resourceDisplayName;
        this.setState({
          datalist
        })
      } else {
        if (label) {
          this.props.update({
            id: key,
            model: {
              name: label
            }
          }).invoke(t => {
            if (!t.code) {
              data.label = label;
              this.setState({
                datalist
              })
            }
          })
        } else {
          this.openDeleteConfirmDialog(node);
        }
      }
    }
  }

  getNextLevelDataList = (node) => {
    // console.log(node);
    const { data } = node.props;
    return this.props.getNextLevelDataList({
      id: data.key
    }).invoke(t => {
      this.populateChildren(data, t.data);
      const { datalist, expandedKeys } = this.state;
      this.setState({
        datalist,
        expandedKeys: _.union(expandedKeys, [data.key])
      })
    });
  }

  populateChildren = (parent, datalist) => {
    datalist = datalist || [];
    const data = datalist.map(a => {
      const r = {
        key: a.id.toString(),
        label: a.name,
        parent
      };
      r.data = r;
      return r;
    });
    data.push({
      key: `new-${parent.key}`,
      label: '双击添加',
      isLeaf: true,
      parent
    });
    parent.children = data;
    if (!parent.data) {
      parent.data = parent;
    }
    return parent;
  }

  componentDidMount() {
    this.props.getRootDataList().invoke(t => {
      const root = {
        label: this.props.resourceDisplayName,
        key: '0'
      };
      this.populateChildren(root, t.data);
      this.setState({
        datalist: [
          root
        ]
      })
    });
  }

  delete = () => {
    const { node } = this.state;
    if (node) {
      const { data } = node.props;
      this.props.delete({ id: data.key }).invoke(t => {
        if (!t.code) {
          const { datalist } = this.state;
          const { parent } = node.props;
          console.log(node.props);
          parent.children = parent.children.filter(t => t.key != data.key);
          this.setState({
            datalist
          })
          this.closeDeleteConfirmDialog();
        }
      });
    }
  }

  openDeleteConfirmDialog = (node) => {
    this.setState({
      deleteConfirmDialogVisible: true,
      node
    });
  };

  closeDeleteConfirmDialog = () => {
    this.setState({
      deleteConfirmDialogVisible: false,
      node: null
    });
  };

  render() {
    const { datalist, expandedKeys, deleteConfirmDialogVisible, node } = this.state;
    const { resourceDisplayName } = this.props;
    return (
      <div className="filter-table">
        <IceContainer title={`${resourceDisplayName}管理`}>
          <Tree
            dataSource={datalist}
            loadData={this.getNextLevelDataList}
            showLine
            editable
            expandedKeys={expandedKeys}
            onExpand={this.onTreeExpand}
            onEditFinish={this.onTreeEditFinish}
          />
        </IceContainer>
        {
          node ? <Dialog
            visible={deleteConfirmDialogVisible}
            onOk={this.delete}
            closeable="esc,mask,close"
            onCancel={this.closeDeleteConfirmDialog}
            onClose={this.closeDeleteConfirmDialog}
            title={`正在删除${node.props.label}`}
          >
            一旦删除不可恢复，子级数据也会被一起删除，确认删除{node.props.label}吗？
        </Dialog> : null
        }
      </div>
    );
  }
}