/*
 *author: yzsexe
 * date: 18/8/17
 * describe: 指数中心-公用列表
 */
import React, { Component } from 'react';
import Pagination from 'rc-pagination';
import styles from './style.scss';

class MiniTable extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { columns, dataSource, onRowClick, warpStyle = {} } = this.props;

        return (
            <div className={styles.miniTable} style={warpStyle}>
                <table>
                    <thead>
                        <tr>
                            {
                                columns.map((ite, index) => {
                                    let text = ite.label;
                                    let style = ite.style || {};

                                    if (ite.align) {
                                        Object.assign(style, {textAlign: ite.align || 'left'})
                                    }
                                    return (
                                        <th key={text + index} style={style}>{text}</th>
                                    )
                                })
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {
                            dataSource.map((ite, index) => {
                                return (
                                    <tr key={index} onClick={() => {
                                        if (onRowClick) {
                                            onRowClick(ite)
                                        }
                                    }}>
                                        {
                                            columns.map((ele, idx) => {
                                                let text = ite[ele.key];
                                                let style = ele.style || {};

                                                if (ele.align) {
                                                    Object.assign(style, {textAlign: ite.align || 'left'})
                                                }
                                                if (ele.filter) {
                                                    text = ele.filter(ite[ele.key], ite, index)
                                                }
                                                if (ele.limit) {
                                                    const val = ite[ele.key];

                                                    if (val && val.length > ele.limit) {
                                                        text =
                                                            <span title={val}>{val.substr(0, ele.limit) + '...'}</span>

                                                    }
                                                }
                                                return (
                                                    <td key={idx} style={style}>{ text || '--' }</td>
                                                )
                                            })
                                        }
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        )
    }
}

export default MiniTable;
