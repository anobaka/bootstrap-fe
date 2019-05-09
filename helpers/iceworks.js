export function convertTreeDataResponse(list) {
  let treeData = null;
  if (list) {
    treeData = [];
    list.map(t => {
      const data = {
        value: t.id.toString(),
        label: t.name,
        isLeaf: t.isLeaf
      };
      if (t.children) {
        data.children = convertTreeDataResponse(t.children);
      }
      treeData.push(data);
    });
  }
  return treeData;
}

export function convertAttachmentUrlsToFileList(list) {
  const fileList = [];
  // console.log(list)
  if (list) {
    list.map(t => {
      const filename = decodeURI(t.substring(t.lastIndexOf('/')));
      const file = {
        name: filename,
        fileName: filename,
        status: 'done',
        downloadURL: t,
        fileURL: t,
        imgURL: 'https://img.alicdn.com/tps/TB19O79MVXXXXcZXVXXXXXXXXXX-1024-1024.jpg'
      };
      fileList.push(file);
    });
  }
  // console.log(fileList);
  return fileList;
}

export function findItemByPos(dataSource, pos) {
  return pos.split('-').slice(1).reduce((ret, num) => ret.children[num], { children: dataSource });
}

export function findParentItemByPos(dataSource, pos) {
  return _.dropRight(pos.split('-').slice(1), 1).reduce((ret, num) => ret.children[num], { children: dataSource });
}
