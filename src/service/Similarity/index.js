import resource from 'resource';
import API from 'api';
import {
    message
} from 'antd';

class Similarity {
    searchPolicy = params => {
        return resource.get(API.similarity.searchPolicy, params).then(res => {
            if (res.code === 200) {
                return res.data
            }
            message.info(res.message)
            return null
        })
    }

    detail = id => {
        return resource.get(API.similarity.detail + '/' + id).then(res => {
            if (res.code === 200) {
                return res.data
            }
            message.info(res.message)
            return null
        })
    }

    myList = params => {
        return resource.get(API.similarity.myList, params).then(res => {
            if (res.code === 200) {
                return res.data
            }
            message.info(res.message)
            return null
        })
    }

    addPolicy = id => {
        return resource.post(API.similarity.change + '/' + id).then(res => {
            if (res.code === 200) {
                message.success('添加成功！')
                return res.data
            }
            message.info(res.message)
            return null
        })
    }

    delPolicy = id => {
        return resource.delete(API.similarity.change + '/' + id).then(res => {
            if (res.code === 200) {
                message.success('移除成功！')
                return res.data
            }
            message.info(res.message)
            return null
        })
    }

}

export default new Similarity()
