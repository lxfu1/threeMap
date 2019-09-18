import { convertQueryString, convertSlashString } from 'utils';

const SERVER = '/govacademy-server';

const API = {
    getCode: '/offweb/getAreaCodeNew', // 获取省市code
    getActive: '/education/executionRank', // 活跃度
    getClassify: '/education/indexRank', // 获取活跃度分项指标
    getCount: '/education/dataStat', // 获取实时数据统计、发文频数统计
    getNews: '/education/latestEdu', // 获取最新发文
    getRatio: '/education/activeScore', // 官网推行活跃度环比
    getTrendType: '/education/trendType', // 类别趋势分析
    getTrendQuota: '/education/trendName' // 指标趋势分析
};

export const GetEdAPI = (key, params, map) => {
    let url = `${SERVER}${API[key]}${convertSlashString(params)}${convertQueryString(map)}`;

    return url;
};
