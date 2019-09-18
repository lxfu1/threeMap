/*
 *author: yzsexe
 * date: 18/8/8
 * describe: 官网推行-容器
 */
import React, { Component } from 'react';
import styles from './style.scss';

const R = 74;
const LineWidth = 12;
const FontSize = 18;

class Circle extends Component {

    constructor(props){
        super(props);
        this.box = null;
        this.ctx = null;
        this.gradient = null;
    }

    componentDidMount(){
        let box,
            gradient;

        box=document.getElementById(this.props.only);
        this.box = box;
        this.ctx = box.getContext('2d');

        gradient = this.ctx.createLinearGradient(0, 0, 0, 100);
        gradient.addColorStop(0, '#36d1ff');
        gradient.addColorStop(0.5, '#36a6ff');
        gradient.addColorStop(1, '#234e8a');

        this.gradient = gradient;

        this.draw(this.props.number);
    }

    componentWillReceiveProps(nextProps){
        this.draw(nextProps.number);
    }

    draw = number => {
        this.ctx.clearRect(0, 0, this.box.width, this.box.height);

        if(this.props.root){
            this.ctx.beginPath();
            this.ctx.arc(this.box.width / 2,this.box.height / 2, R / 2, 0, Math.PI*2);
            this.ctx.strokeStyle= this.gradient || '#3698ff';
            this.ctx.lineWidth= LineWidth;
            this.ctx.stroke();

            this.ctx.beginPath();
            this.ctx.font=`14px 微软雅黑`;
            this.ctx.fillStyle = '#fff';
            this.ctx.fillText(number,this.box.width / 2 - (number + '').length * 14 / 2, this.box.height / 2 + 14 / 2);
        }else{
            if(number > 0){
                this.ctx.beginPath();
                this.ctx.arc(this.box.width / 2,this.box.height / 2, R / 2, 1.5 * Math.PI, (2 * number / 100 - 0.5) * Math.PI);
                this.ctx.strokeStyle= this.gradient || '#3698ff';
                this.ctx.lineWidth= LineWidth;
                this.ctx.stroke();
            }

            this.ctx.beginPath();
            this.ctx.arc(this.box.width / 2,this.box.height / 2, R / 2 - LineWidth / 2, 0, Math.PI*2);
            this.ctx.strokeStyle= '#fff';
            this.ctx.lineWidth= 1;
            this.ctx.stroke();

            this.ctx.beginPath();
            this.ctx.font=`${FontSize}px 微软雅黑`;
            this.ctx.fillStyle = '#fff';
            // 0.53为计算属性
            this.ctx.fillText(number,this.box.width / 2 - (number + '').length * FontSize * 0.53 / 2, this.box.height / 2 + FontSize / 2);
        }
    }

    render() {
        return <canvas id={this.props.only} width="115" height="90" />;
    }
}
export default Circle;
