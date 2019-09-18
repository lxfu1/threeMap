import resource from 'resource';
import API from 'api';
import { message } from 'antd';

class Thematic {
    byKeyword = (params) => {
        return resource.get(API.thematic.byKeyword, params).then(res => {
            if (res.code === 200) {
                return res.data
            }
            message.info(res.message)
            return null
        })
    }

    byArea = (params) => {
        return resource.get(API.thematic.byArea, params).then(res => {
            if (res.code === 200) {
                return res.data
            }
            message.info(res.message)
            return null
        })
    }
}

export default new Thematic()
