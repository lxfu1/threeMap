/*
 *author: yzsexe
 * date: 18/8/8
 * describe: 官网推行-容器
 */
import React, { Component } from 'react';
import {NavLink, withRouter} from 'react-router-dom'
import styles from './style.scss';

const Headers = [
    {
        name: '活跃度总分',
        src: require('../../images/p1.png')
    },
    {
        name: '新闻频数指标',
        src: require('../../images/p2.png')
    },
    {
        name: '政策频数指标',
        src: require('../../images/p3.png')
    },
    {
        name: '发文间隔指标',
        src: require('../../images/p4.png')
    },
    {
        name: '及时性指标',
        src: require('../../images/p5.png')
    },
    {
        name: '持续性指标',
        src: require('../../images/p6.png')
    }
];

@withRouter
class Compare extends Component {

    changeRouter = item => {
        if(item.region.indexOf('省') !== -1){
            this.props.history.push(`/main/home/offweb/prov/${item.region.replace('省', '')}/${this.props.year}`);
        }else{
            let {province} = this.props,
                sheng = '';

            sheng = province.find(v => v.regionCode === item.parentCode*1).region.replace('省', '');
            this.props.history.push(`/main/home/offweb/city/${sheng}/${item.parentCode}/${item.region.replace('市', '')}/${this.props.year}`);
        }
    }

    render() {
        let {data} = this.props;

        return <div className={styles.container}>
            {
                data.length ? <div>
                    <div className={styles.header}>
                        {
                            Headers.map(item => {
                                return <div className={styles.items} key={item.name}>
                                    <img src={item.src} alt=""/>
                                    <p>{item.name}</p>
                                </div>
                            })
                        }
                    </div>
                    {
                        data.map(item => {
                            return <div className={styles.list} key={item.regionCode}>
                                <span className={styles.special} onClick={()=>{this.changeRouter(item)}}>{item.region}</span>
                                <div className={styles.points}>
                                    <span>{item.finalScore || '-'}</span>
                                    <span>{item.feature_2 || '-'}</span>
                                    <span>{item.feature_3 || '-'}</span>
                                    <span>{item.feature_4 || '-'}</span>
                                    <span>{item.feature_1 || '-'}</span>
                                    <span>{item.feature_5 || '-'}</span>
                                </div>
                                <span className={styles.close} onClick={()=>{this.props.click(item.regionCode)}}>x</span>
                            </div>
                        })
                    }
                </div> : <p>暂未添加对比城市，请双击城市进行添加</p>
            }
        </div>;
    }
}
export default Compare;
