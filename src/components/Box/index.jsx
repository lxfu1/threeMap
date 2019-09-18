/**
 * @author yaowei
 * @desc 带有边框图片的盒子
 * @prop width
 * @prop height
 * @prop background
 */

import React, { Component } from 'react';
import cls from 'classnames';
import * as R from 'ramda';
import style from './style.scss';

export default class BgBox extends Component {
    render() {
        const { classNames, width, height, background, config = {}, warpStyle = {} } = this.props;

        return (
            <div
                className={cls(style.box, classNames)}
                style={
                    R.isEmpty(config) ?
                        { width: width || '', height: height || '', background: background || '' } :
                        config
                }
            >
                <div style={warpStyle}>{this.props.children}</div>
            </div>
        );
    }
}
