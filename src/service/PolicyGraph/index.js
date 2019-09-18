import resource from 'resource';
import API from 'api';
import {
    message
} from 'antd';

class PolicyGraph {
    getChildren = id => {
        // 接口变化，注释不同版本避免频繁切换
        // return resource.get(API.policyGraph.getChildren + '/' + id[0] + '/' + id[1]).then(res => {
        return resource.get(API.policyGraph.getChildren + '/' + id[0]).then(res => {
            if (res.code === 200) {
                return res.data
            }
            message.info(res.message)
            return null
        })
    }

    getParent = id => {
        // return resource.get(API.policyGraph.getParent + '/' + id[0] + '/' + id[1]).then(res => {
        return resource.get(API.policyGraph.getParent + '/' + id[0]).then(res => {
            if (res.code === 200) {
                return res.data
            }
            message.info(res.message)
            return null
        })
    }

    init = id => {
        return resource.get(API.policyGraph.init + '/' + id).then(res => {
            if (res.code === 200) {
                return res.data
            }
            message.info(res.message)
            return null
        })
    }
}

export default new PolicyGraph()
