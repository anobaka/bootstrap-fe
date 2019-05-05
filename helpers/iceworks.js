export function convertTreeDataResponse(list) {
    var treeData = null;
    if (list) {
        treeData = [];
        list.map(t => {
            var data = {
                value: t.id.toString(),
                label: t.name
            };
            if (t.children) {
                data.children = convertTreeDataResponse(t.children);
            }
            treeData.push(data);
        })
    }
    return treeData;
}

export function convertAttachmentUrlsToFileList(list) {
    var fileList = [];
    // console.log(list)
    if (list) {
        list.map(t => {
            var filename = decodeURI(t.substring(t.lastIndexOf('/')));
            var file = {
                name: filename,
                fileName: filename,
                status: "done",
                downloadURL: t,
                fileURL: t,
                imgURL: "https://img.alicdn.com/tps/TB19O79MVXXXXcZXVXXXXXXXXXX-1024-1024.jpg"
            }
            fileList.push(file)
        })
    }
    // console.log(fileList);
    return fileList;
}