import resource from 'resource';
import API from 'api';
import { message } from 'antd';

class TrendResearch {
    trendResearch = id => {
        return resource.get(API.trendResearch.latestPolicy + '/' + id).then(res => {
            if( res.code === 200 ){
                return res.data
            }
            message.info(res.message)
            return null
        })
    }

    indexTrend = params => {
        return resource.get(API.trendResearch.indexTrend, params).then(res => {
            if( res.code === 200 ){
                return res.data
            }
            message.info(res.message)
            return null
        })
    }

    activityTrend = params => {
        return resource.get(API.trendResearch.activityTrend, params).then(res => {
            if( res.code === 200 ){
                return res.data
            }
            message.info(res.message)
            return null
        })
    }
}

export default new TrendResearch()