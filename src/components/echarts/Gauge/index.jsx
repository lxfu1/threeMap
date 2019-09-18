/*
 *author: yzsexe
 * date: 18/8/27
 * describe: gauge表盘
 */
import React, { Component } from 'react';
import cls from 'classnames';
import * as d3 from 'd3';
import NeedleSVG from './images/needle.png';
import styles from './style.scss';

const width = 600,
    height = 700,
    innerRadius = 250,
    outerRadius = 300,
    arcMin = -Math.PI / 2,
    arcMax = Math.PI / 2;

class Gauge extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.draw(this.props.data, this.props.name);
    }

    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(this.props.data) !== JSON.stringify(nextProps.data)) {
            this.draw(nextProps.data, nextProps.name);
        }
    }

    draw = (score = 0, name) => {
        let self = this;
        let arc = d3.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius).startAngle(arcMin);
        let svg = d3.select(this.gauge).attr('preserveAspectRatio', 'xMidYMid meet').attr('viewBox', '0 0 600 450');

        svg.selectAll('g').remove();
        let g = svg.append('g').attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

        let innerText = '网络活跃度';

        if (score < .6) {
            innerText = innerText + '差'
        } else if (score < .8) {
            innerText = innerText + '良好'
        } else {
            innerText = innerText + '优秀'
        }

        // 表盘标题
        g.append('text')
            .attr('class', 'gauge-title')
            .style('alignment-baseline', 'central')
            .style('text-anchor', 'middle')
            .style('fill', '#fff')
            .style('font-size', '42px')
            .attr('y', 50).text(innerText);

        //表盘数值
        let valueLabel = g.append('text').attr('class', 'gauge-value')
            .style('alignment-baseline', 'central') //相对父元素对齐方式
            .style('text-anchor', 'middle') //文本锚点，居中
            .style('fill', '#fff')
            .style('font-size', '10rem')
            .attr('y', -80)    //到中心的距离
            .text(score ? (score * 100).toFixed(2) : 0);

        //添加背景圆弧
        let background = g.append('path')
            .datum({endAngle: arcMax})  //传递endAngle参数到arc方法
            // .style('fill', '#fff')
            .style('fill', '#37a1ff')
            .attr('d', arc);

        //计算圆弧的结束角度
        let currentAngle = score * (arcMax - arcMin) + arcMin;

        //添加另一层圆弧，用于表示百分比
        let foreground = g.append('path')
            .datum({endAngle: currentAngle})
            .style('fill', 'transparent')
            .attr('d', arc);

        let tick = score ? g.append('image')
            .attr('class', 'gauge-tick')
            .attr('x', 0)
            .attr('y', -(innerRadius + 130))
            .attr('xlink:href', function (d) {
                return NeedleSVG;
            })
            .attr('width', function () {
                return '40px';
            })
            .attr('height', function () {
                return '200px';
            })
            .attr('transform', 'rotate(' + this.angleToDegree(currentAngle) + ')') : null;

        //更新圆弧末端的指针标记，并且设置渐变动效
        if (score) {
            tick.transition()
            .duration(1000)
            .ease('easeElastic')   //设置来回弹动的效果
            .attrTween('transform', function (d) { //设置“transform”属性的渐变
                let i = d3.interpolate(self.angleToDegree(arcMin), self.angleToDegree(currentAngle));    //取插值

                return function(t) {
                    return 'rotate('+ i(t) +')'
                };
            })
        }
    }

    angleToDegree = (angle) => {
        return angle * 180 / Math.PI;
    }

    render() {
        const { data, classNames, style = {} } = this.props;

        return (
            <svg className={cls(styles.gaugeSvg, classNames)} style={style} ref={ele => this.gauge = ele} />
        )
    }
}

export default Gauge;
