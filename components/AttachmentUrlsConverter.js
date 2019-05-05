function ConvertAttachmentUrlsToFileList(list) {
    var fileList = [];
    // console.log(list)
    if (list) {
        list.map(t => {
            var filename = decodeURI(t.substring(t.lastIndexOf('/')));
            var file = {
                name: filename,
                fileName: filename,
                status: "done",
                // size: 1000,
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

export default ConvertAttachmentUrlsToFileList;