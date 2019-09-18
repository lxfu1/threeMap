import resource from 'resource';
import API from 'api';
import {
    message
} from 'antd';

class CommonApi {
    getProvinces = () => {
        return resource.get(API.commonApi.getProvinces).then(res => {
            if (res.code === 200) {
                return res.data
            }
            message.info(res.message)
            return null
        })
    }

    getCitys = params => {
        return resource.get(API.commonApi.getCitys, params).then(res => {
            if (res.code === 200) {
                return res.data
            }
            message.info(res.message)
            return null
        })
    }

    getAllKeywords = params => {
        return resource.get(API.commonApi.getAllKeywords, params).then(res => {
            if (res.code === 200) {
                return res.data
            }
            message.info(res.message)
            return null
        })
    }

}

export default new CommonApi()
