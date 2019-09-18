/*
 *author: yzsexe
 * date: 18/8/8
 * describe: 教育扶贫-省地图
 */
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import cls from 'classnames';
import moment from 'moment';
import { EducationStore } from 'store';
import Map from 'components/echarts/Map';
import TL from './TL';
import TR from './TR';
import BC from './BC';
import styles from './style.scss';

const SJS = ['北京', '上海', '重庆', '天津'];

@observer
class Province extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.init();
    }

    init = () => {
        const { name } = this.props.match.params;

        EducationStore.changeProvince(name);
    }

    back = () => {
        this.props.history.push('/main/home/education/state');
    }

    monthChange = date => {
        let years = date;

        OffWebStore.changeYears(years, 'province');
    }

    componentWillUnmount() {
        EducationStore.clearProv();
    }

    render() {
        const { name } = this.props.match.params;
        let boxName = SJS.indexOf(name) !== -1 ? `${name}市` : `${name}省`;

        return (
            <div className={styles.provinceContainer}>
                <div className={styles.t_box}>
                    <TL boxName={boxName} data={EducationStore.provTLData} boxClassName={styles.tl_box} />
                    <div className={styles.m_box}>
                        <img className={styles.back}
                            src={require('../../image/back.png')}
                            onClick={this.back}
                        />
                        <Map mapName={name} data={EducationStore.provMapData} />
                    </div>
                    <TR boxName={boxName} year={EducationStore.years} data={EducationStore.provTRData} boxClassName={styles.tr_box} />
                </div>
                <BC boxClassName={styles.b_box} data={EducationStore.provBTypeData} />
            </div>
        );
    }
}
export default Province;
