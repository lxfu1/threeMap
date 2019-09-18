import { mergyApi } from 'utils';

const HOST = '';

const CLOUDMONITORUSER = '/govacademy-user';
const CLOUDMONITORSERVER = '/govacademy-server';

//登陆
const login = mergyApi(
    {
        loginImgcode:'/anonymous/loginImgcode',
        post: '/anonymous/login'
    },
    CLOUDMONITORUSER
);

//档案管理
const documentMgmtAPI = mergyApi(
    {
        list: '/archives/queryArchivesList',
        detail: '/archives/queryArchivesDetails',
        create: '/archives/addArchives',

        modify: {
            //修改
            basicInfo: '/archives/modifyBasicInfo',
            familyIncome: '/archives/modifyFamilyIncome',
            escuageInfo: '/archives/modifyCommissioned',
            escuagePlacement: '/archives/modifyPlacementCase',
            helpInfo: '/archives/modifyHelpCase',
            contactInfo: '/archives/modifyLinkmanInfo',
            familyPeople: '/archives/modifyFamilyPeople',
            badRecord: '/archives/modifyBadRecordSign'
        }
    },
    '/xacare-server'
);
//数据采集总量
const dataAcquisitionInfo = mergyApi(
    {
        getData: '/queryDataGathering'//查询采集数据
    },
    '/govacademy-server'
)
//关键词
const keyWords = mergyApi(
    {
        getMyKeyWords: '/keyword/queryKeyword',//获取我创建的关键词
        deleteKeyword: '/keyword/deleteKeyword',//删除关键词
        getKeyWords: '/keyword/findAllKeyword',//获取所有的关键词
        keywordStatistics:'/keyword/countStatistics',//关键词首页统计
        post: {
            addKeyWords: '/keyword/addKeyword'//添加关键词
        }

    },
    '/govacademy-server'
)
//用户设置相关
const userSetting = mergyApi(
    {
        post: {
            resetPasswd: '/password/change'
        }
    },
    CLOUDMONITORUSER
)

// 指数中心-趋势研究
const trendResearch = mergyApi(
    {
        latestPolicy:'/latestpolicy',
        indexTrend:'/indexstatistics',
        activityTrend:'/activitystatistics'
    },
    CLOUDMONITORSERVER + '/trendresearch'
)

// 相似分析
const similarity = mergyApi(
    {
        searchPolicy:'/searchPolicy',  // 对比分析-政策检索
        detail:'/detail',  // 对比分析-政策检索
        myList:'/mineCart',  // 对比分析-我的对比
        change:'/cart',  // 对比分析-添加/删除 对比
    },
    CLOUDMONITORSERVER + '/policy'
)

// 政策图谱
const policyGraph = mergyApi(
    {
        getChildren:'/dive',  // 获取下级政策
        getParent:'/trace',  // 获取上级政策
        init:'/detail'  // 初始化第一个点
    },
    CLOUDMONITORSERVER + '/policy'
)

// 专题分析
const thematic = mergyApi(
    {
        byKeyword:'/analyzeByKeyword',  // 按关键词
        byArea:'/analyzeByRegion'  // 按地域
    },
    CLOUDMONITORSERVER + '/analyze'
)

// 通用接口
const commonApi = mergyApi(
    {
        getProvinces: '/area/getProvinces',  // 获取省级行政列表
        getCitys: '/area/getRegions',  // 通过省级代码查询市级列表
        getAllKeywords: '/keyword/queryAllKeyword'  // 获取所有关键词
    },
    CLOUDMONITORSERVER
)

//新闻政策
const policy = mergyApi(
    {
        search: '/policy/search',
        info:'/policy/detail'
    },
    '/govacademy-server'
)

const API = mergyApi(
    {
        login,
        documentMgmtAPI,
        dataAcquisitionInfo,
        keyWords,
        userSetting,
        trendResearch,
        commonApi,
        policy,
        similarity,
        thematic,
        policyGraph
    },
    HOST
);

export default API;
