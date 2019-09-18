import { convertQueryString } from 'utils';

const SERVER = '/govacademy-server';

const API = {
    getCode: '/offweb/getAreaCodeNew', // 获取省市code
    getActive: '/offweb/getActiveIndex', // 活跃度
    getClassify: '/offweb/getClassifyIndex', // 获取活跃度分项指标
    getCount: '/offweb/getCountArticleOnTime', // 获取实时数据统计、发文频数统计
    getNews: '/offweb/getNewestNews', // 获取最新发文
    getRatio: '/offweb/changeRatio' // 官网推行活跃度表针
};

export const GetAPI = (key, params) => {
    let url = `${SERVER}${API[key]}${convertQueryString(params)}`;

    return url;
};
