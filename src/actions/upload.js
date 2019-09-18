import resource from '../util/resource';

const uploadImageURL = '/woodpecker-public/uploadfile/img';

/**
 * 获取File对象的base64数据
 * @param {File} file
 * @returns
 */
function getPreviewImageData(file) {
    return new Promise((resolve, reject) => {
        if (window.FileReader) {
            const reader = new FileReader();

            reader.onload = function(e) {
                const url = e.target.result;

                resolve(url);
            };
            reader.readAsDataURL(file);
        } else {
            resolve(null);
        }
    });
}

/**
 * 上传图片
 * @param {File} file
 * @param {string} [filename="file"]
 * @returns {Promise}
 */
function uploadImage(file, filename = 'file') {
    const payload = new FormData();

    if (!file) {
        throw new Error('no file');
    }
    payload.append('file', file);

    const upload = Promise.all([resource.post(uploadImageURL, payload), getPreviewImageData(file)])
        .then(([res, previewData]) => {
            const resolveData = {
                ...res,
                previewData: previewData ? previewData : res.data
            };

            return resolveData;
        })
        .catch(err => {
            if (err.response) {
                throw new Error(err.response.data.message);
            } else {
                throw new Error('上传图片失败');
            }
        });

    return upload;
}

export { uploadImage, getPreviewImageData };
