/**
 * @author yaowei
 */
import React, { Component } from 'react';
import style from './style.scss';
import Title from 'components/Title';
import { withRouter } from 'react-router';
import API from 'api';
import resource from 'resource';
import { message } from 'antd';
import { observer, inject } from 'mobx-react';
import { articleStore } from 'store';
import { Link } from 'react-router-dom';
import PolicyDetailTitle from './policyDetailTitle';
import NewDetailTitle from './newDetailTitle';

@inject('articleStore')
@observer
class InformationDetial extends Component {
    state = {
        info: [],
        id: ''
    };
    componentDidMount() {
        this.getInfo();
    }

    getInfo = () => {
        resource.get(API.policy.info + '/' + this.props.match.params.id).then(res => {
            if (res.code === 200) {
                this.setState({
                    info: res.data
                });
            } else {
                message.info(res.message);
            }
        });
    };
    render() {
        return (
            <div className={style.container}>
                {this.state.info.type === '政策' ?
                    <PolicyDetailTitle data={this.state.info} /> :
                    <NewDetailTitle data={this.state.info} />
                }
                <div className={style.title}>{this.state.info.title}</div>
                <p className={style.issued}>{this.state.info.issued}</p>
                <p className={style.text}>{this.state.info.text}</p>
            </div>
        );
    }
}
export default withRouter(InformationDetial);
