import React, { Component } from 'react';
import style from './style.scss';
import Title from 'components/Title';
export default class newDetailTitle extends Component {
    state = {
        info: []
    };
    componentDidMount() {
        this.setState({
            info: this.props.data
        });
    }
    componentWillReceiveProps(newProps) {
        this.setState({
            info: newProps.data
        });
    }
    render() {
        return (
            <div className={style.container}>
                <h3>高级检索</h3>
                <ul>
                    <li>
                        发布日期：
                        <span>{this.state.info.time || '-----'}</span>
                    </li>
                    <li>
                        来源单位：
                        <span>{this.state.info.sourceUnit || '-----'}</span>
                    </li>
                    <li>
                        发布人：
                        <span>{this.state.info.issuer || '-----'}</span>
                    </li>
                </ul>
            </div>
        );
    }
}
