import React, { Component } from 'react';
import { Icon } from 'antd';
import cls from 'classnames';
import moment from 'moment';
import styles from './style.scss';

class YearPicker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShow: false,
            selectedyear: props.defaultValue,
            years: []
        };
    }

    // componentWillMount() {
    //     let { defaultValue } = this.props;

    //     this.setState({ selectedyear: defaultValue });
    // }
    componentDidMount() {
        let _this = this;

        // let { defaultValue } = this.props;

        // this.setState({ selectedyear: defaultValue });

        document.addEventListener(
      'click',
      function(e) {
          const { isShow } = _this.state;
          let clsName = e.target.className;

          if (
          clsName.indexOf('calendar') === -1 &&
          e.target.tagName !== 'BUTTON' &&
          isShow
        ) {
              _this.hide();
          }
      },
      false
    );
    }
  //初始化数据处理
    initData = (operand, defaultValue) => {
        operand = operand ? operand : 12;
        let year = defaultValue - 1970;
        let curr = year % operand;
        let start = defaultValue - curr;
        let end = defaultValue + operand - 1 - curr;

        this.getYearsArr(start, end);
    };
  //   获取年份范围数组
    getYearsArr = (start, end) => {
        let arr = [];

        for (let i = start; i <= end; i++) {
            arr.push(Number(i));
        }
        this.setState({
            years: arr
        });
    };
  // 显示日历年组件
    show = () => {
        const { selectedyear } = this.state;
        let { operand } = this.props;

        operand = operand ? operand : 12;
        this.initData(operand, selectedyear);
        this.setState({ isShow: true });
    };
  // 隐藏日期年组件
    hide = () => {
        this.setState({ isShow: false });
    };
  // 向前的年份
    prev = () => {
        const { years } = this.state;

        if (years[0] <= 1970) {
            return;
        }
        this.getNewYearRangestartAndEnd('prev');
    };
  // 向后的年份
    next = () => {
        this.getNewYearRangestartAndEnd('next');
    };

  //   获取新的年份
    getNewYearRangestartAndEnd = type => {
        const { selectedyear, years } = this.state;
        let operand = Number(this.props.operand);

        operand = operand ? operand : 12;
        let start = Number(years[0]);
        let end = Number(years[years.length - 1]);
        let newstart;
        let newend;

        if (type === 'prev') {
            newstart = parseInt(start - operand);
            newend = parseInt(end - operand);
        }
        if (type === 'next') {
            newstart = parseInt(start + operand);
            newend = parseInt(end + operand);
        }
        this.getYearsArr(newstart, newend);
    };

  // 选中某一年
    selects = e => {
        let val = Number(e.target.value);

        this.hide();
        this.setState({ selectedyear: val });
        if (this.props.callback) {
            this.props.callback(val);
        }
    };

    render() {
        const { isShow, years, selectedyear } = this.state;
        const { classNames } = this.props;

        return (
            <div className={cls(styles['calendar-wrap'], classNames)}>
                <div className={styles['calendar-input']}>
                    <input
                        className={styles['calendar-value']}
                        placeholder="请选择年份"
                        onFocus={this.show}
                        value={selectedyear}
                        readOnly
                    />
                    <Icon type="calendar" className={styles['calendar-icon']} />
                </div>
                {isShow ?
                <List
                    data={years}
                    value={selectedyear}
                    prev={this.prev}
                    next={this.next}
                    cback={this.selects}
                /> :
                ''
                }
            </div>
        );
    }
}
const List = props => {
    const { data, value, prev, next, cback } = props;

    return (
        <div className={styles['calendar-container']}>
            <div className={styles['calendar-head-year']}>
                <span
                    className={styles['calendar-btn'] + ' ' + styles['prev-btn']}
                    onClick={prev}
                >
                    上一页
                </span>
                <span className={styles['calendar-year-range']}>{value}</span>
                <span
                    className={styles['calendar-btn'] + ' ' + styles['next-btn']}
                    onClick={next}
                >
                    下一页
                </span>
            </div>
            <div className={styles['calendar-body-year']}>
                <ul className={styles['calendar-year-ul']}>
                    {data.map((item, index) =>
                        <li
                        key={index}
                        title={item}
                                        className={
                                styles['calendar-year-li'] + ' ' +
                            styles[item === value ?
                            'calendar-year-selected' :
                            '']
                        }
                        >
                        <button onClick={cback} value={item}>
                            {item}
                        </button>
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default YearPicker;
