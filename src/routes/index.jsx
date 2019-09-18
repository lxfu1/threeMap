import React from 'react';
import { Route, Redirect, Switch, HashRouter as Router } from 'react-router-dom';
import Login from 'containers/login';
import WordRecord from 'containers/wordRecord';
import App from 'containers/app';

import Home from 'containers/Home'; // 指数中心
import OffWeb from 'containers/Home/OffWeb'; // 指数中心-官网推行
import National from 'containers/Home/OffWeb/National'; // 指数中心-官网推行-全国地图
import Province from 'containers/Home/OffWeb/Province'; // 指数中心-官网推行-省级地图
import City from 'containers/Home/OffWeb/City'; // 指数中心-官网推行-市级地图
import RankingProvince from 'containers/Home/OffWeb/RankingProvince'; //省活跃度排行榜
import RankingCity from 'containers/Home/OffWeb/RankingCity'; //省活跃度排行榜
//import TextImport from 'containers/Home/OffWeb/TextImport'; //文本导入
import TrendResearch from 'containers/Home/TrendResearch'; // 指数中心-趋势研究
import Monitor from 'containers/Home/monitor'; // 指数中心-流量监控
import Education from 'containers/Home/Education'; // 指数中心-教育扶贫
import EducationNational from 'containers/Home/Education/National'; // 指数中心-教育扶贫-全国地图
import EducationProvince from 'containers/Home/Education/Province'; // 指数中心-教育扶贫-省级地图

import PersonalCenter from 'containers/personalCenter'; // 个人中心
import InformationBase from 'containers/informationBase'; // 信息库
import InformationDetail from 'containers/informationBase/subPages/detail'; // 信息库详情

import Compare from 'containers/compareAnalysis'; // 对比分析
import Thematic from 'containers/compareAnalysis/subPage/Thematic'; // 对比分析-专题分析
import Similarity from 'containers/compareAnalysis/subPage/Similarity'; // 对比分析-相似分析
import Imports from 'containers/compareAnalysis/subPage/Similarity/imports'; // 对比分析-相似分析
import PolicyTrace from 'containers/compareAnalysis/subPage/policyTrace'; // 对比分析-政策溯源
import PolicyTraceDetail from 'containers/compareAnalysis/subPage/policyTrace/sub/detail'; // 对比分析-政策溯源-详情
import PolicyGraph from 'containers/compareAnalysis/subPage/PolicyGraph'; // 对比分析-政策图谱

const routes = () =>
    <Router>
        <Switch>
            <Route exact path="/" render={() => <Redirect to="/login" />} />
            {/* 登录 */}
            <Route path="/login" component={Login} />

            {/* 首页 */}
            <Route
                path="/main"
                component={props =>
                    <App {...props}>
                        <Switch>
                            <Route path="/main" exact={true} render={() => <Redirect to="/main/home" />} />
                            {/* 指数中心 */}
                            <Route
                                path="/main/home"
                                component={props =>
                                    <Home {...props}>
                                        <Switch>
                                            {/* 官网推行 */}
                                            <Route
                                                path="/main/home/offweb"
                                                component={props =>
                                                    <OffWeb {...props}>
                                                        <Switch>
                                                            <Route
                                                                path="/main/home/offweb"
                                                                exact={true}
                                                                render={() => <Redirect to="/main/home/offweb/state" />}
                                                            />
                                                            {/* 官网推行-全国地图 */}
                                                            <Route
                                                                path="/main/home/offweb/state"
                                                                component={National}
                                                            />
                                                            {/* 官网推行-省级地图 */}
                                                            <Route path="/main/home/offweb/prov/:name/:year?" component={Province} />
                                                            {/* 官网推行-市级地图 */}
                                                            <Route path="/main/home/offweb/city/:prov/:code/:name/:year?" component={City} />
                                                            {/*省活跃度排行榜*/}
                                                            <Route
                                                                path="/main/home/offweb/rankingpro/:year"
                                                                component={RankingProvince}
                                                            />
                                                            {/*市活跃度*/}
                                                            <Route
                                                                path="/main/home/offweb/rankingcity/:year/:code"
                                                                component={RankingCity}
                                                            />
                                                        </Switch>
                                                    </OffWeb>
                                                }
                                            />
                                            {/* 趋势研究 */}
                                            <Route path="/main/home/trendResearch" component={TrendResearch} />
                                            {/* 流量监控 */}
                                            <Route path="/main/home/monitor" component={Monitor} />
                                            {/* 教育扶贫 */}
                                            <Route
                                                path="/main/home/education"
                                                component={props =>
                                                    <Education {...props}>
                                                        <Switch>
                                                            <Route
                                                                path="/main/home/education"
                                                                exact={true}
                                                                render={() => <Redirect to="/main/home/education/state" />}
                                                            />
                                                            {/* 官网推行-全国地图 */}
                                                            <Route
                                                                path="/main/home/education/state"
                                                                component={EducationNational}
                                                            />
                                                            {/* 官网推行-省级地图 */}
                                                            <Route path="/main/home/education/prov/:name" component={EducationProvince} />
                                                        </Switch>
                                                    </Education>
                                                }
                                            />
                                        </Switch>
                                    </Home>
                                }
                            />

                            {/* 对比分析 */}
                            <Route
                                path="/main/compare"
                                component={props =>
                                    <Compare {...props}>
                                        <Switch>
                                            <Route
                                                path="/main/compare"
                                                exact={true}
                                                render={() => <Redirect to="/main/compare/thematic" />}
                                            />
                                            {/* 对比分析-专题分析 */}
                                            <Route path="/main/compare/thematic" component={Thematic} />
                                            {/*文本对比-弹窗*/}
                                            <Route path="/main/compare/similarity/imports" component={Imports} />
                                            {/* 对比分析-相似分析 */}
                                            <Route path="/main/compare/similarity" component={Similarity} />
                                            {/* 对比分析-政策溯源-政策图谱 */}
                                            <Route path="/main/compare/trace/policyGraph" component={PolicyGraph} />
                                            {/* 对比分析-政策溯源 */}
                                            <Route path="/main/compare/trace" exact={true} component={PolicyTrace} />
                                            {/* 对比分析-政策溯源-详情 */}
                                            <Route path="/main/compare/trace/:id" component={PolicyTraceDetail} />
                                        </Switch>
                                    </Compare>
                                }
                            />

                            {/* 个人中心 */}
                            <Route path="/main/personal" component={PersonalCenter} />
                            {/* 信息库 */}
                            <Route exact path="/main/info" component={InformationBase} />
                            {/* 信息库详情 */}
                            <Route path="/main/info/detail/:id" component={InformationDetail} />
                            {/* 首页热词收录 */}
                            <Route path="/main/wordRecord" exact component={WordRecord} />
                        </Switch>
                    </App>
                }
            />
        </Switch>
    </Router>

export default routes;
