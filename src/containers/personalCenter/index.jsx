/**
 * @author yaowei
 */
import React, { Component } from 'react';
import style from './style.scss';
import searchImg from '../../static/images/search.png';
import Modal from 'components/Modal';
import resource from 'resource';
import API from 'api';
import { message, Spin } from 'antd';

export default class PersonalCenter extends Component {
    state = {
        rodalView: false,
        navOpt: '0',
        showDelModal: false,
        showAddModal: false,
        newKeyWord: '',
        myKeyWords: [],
        delKeyWordIndex: '', //删除的关键词id
        searchKeyWord: '',
        repassword: '',
        newpassword: '',
        oldpassword: '',
        isLoading: false,
        themeId: '074fafb11e38dddd58a5290bdc6044b6' // @todo 主题写死 因为目前产品设计的没有主题选择 默认 扶贫主题
    };
    componentDidMount() {
        this.getKeyWords();
    }
    delKeyWords = () => {
        const id = this.state.myKeyWords[this.state.delKeyWordIndex].id;
        const myKeyWords = this.state.myKeyWords;

        resource.get(API.keyWords.deleteKeyword, { id }).then(res => {
            if (res.code === 200) {
                myKeyWords.splice(this.state.delKeyWordIndex, 1);
                this.setState({
                    myKeyWords
                });
                this.onChange('showDelModal', false);
                message.info('操作成功');
            } else {
                message.info(res.message);
            }
        });
    };
    showDelModal = index => {
        this.setState({
            showDelModal: true,
            delKeyWordIndex: index
        });
    };
    swicthNav = obj => {
        this.setState({ ...obj });
    };
    getKeyWords = (keyword = '') => {
        this.setState({ isLoading: true });
        resource.get(API.keyWords.getMyKeyWords, { keyword }).then(res => {
            if (res.code === 200) {
                this.setState({
                    myKeyWords: res.data,
                    isLoading: false
                });
            } else {
                message.info(res.message);
            }
        });
    };
    // 添加关键词
    addKeyWords = () => {
        let newParamas = {
            keyword: this.state.newKeyWord,
            themeId: this.state.themeId
        };
        const myKeyWords = this.state.myKeyWords;

        resource.post(API.keyWords.post.addKeyWords, newParamas).then(res => {
            if (res.code === 200) {
                // 不需要用该方法实现
                //     myKeyWords.push({
                //         id: res.data,
                //         keyword: this.state.newKeyWord,
                //         queryEnable: false
                //     });
                //     this.setState(
                //         {
                //             newKeyWord: '',
                //             myKeyWords
                //         },
                //         this.onChange('showAddModal', false)
                //     );
                //     message.info('操作成功');
                this.setState({ newKeyWord: null });
                this.onChange('showAddModal', false);
                message.info('操作成功');
                this.getKeyWords();
            } else {
                message.info(res.message);
            }
        });
    };
    onChange = (field, value) => {
        this.setState({
            [field]: value
        });
    };
    //重置密码
    resetPasswd = () => {
        if (!this.state.oldpassword) {
            return message.info('请输入旧密码');
        }
        if (!this.state.newpassword) {
            return message.info('请输入新密码');
        }
        if (!this.state.repassword) {
            return message.info('请输确认新密码');
        }
        const newParamas = {
            oldpassword: this.state.oldpassword,
            newpassword: this.state.newpassword,
            repassword: this.state.repassword
        };

        resource.post(API.userSetting.post.resetPasswd, newParamas).then(res => {
            if (res.code === 200) {
                message.info('操作成功');
            } else {
                message.info(res.message);
            }
        });
    };
    render() {
        const { navOpt } = this.state;

        return (
            <div className={style.container}>
                <div className={style.nav}>
                    <span className={navOpt !== '16.5rem' ? style.active : ''} onClick={() => this.swicthNav({ navOpt: '0' })}>
                        我创建的关键字
                    </span>
                    <span className={navOpt !== '0' ? style.active : ''} onClick={() => this.swicthNav({ navOpt: '16.5rem' })}>
                        修改密码
                    </span>
                    <i style={{ left: navOpt }} />
                </div>
                {navOpt !== '16.5rem' ?
                    <div className={style.content}>
                        <div className={style.searchBox}>
                            <div>
                                <input
                                    type="text"
                                    placeholder="请输入一个查找关键词"
                                    value={this.state.searchKeyWord}
                                    onChange={e => this.onChange('searchKeyWord', e.target.value)}
                                />
                                <img
                                    src={searchImg}
                                    alt="搜索"
                                    onClick={() => this.getKeyWords(encodeURI(this.state.searchKeyWord))}
                                />
                            </div>
                            <div onClick={() => this.onChange('showAddModal', true)}>
                                <span>+ 添加关键词</span>
                            </div>
                        </div>
                        <div className={style.words}>
                            {this.state.myKeyWords.length > 0 ?
                                <ul>
                                    {this.state.myKeyWords.map((item, idx) => {
                                        return (
                                            <li key={idx}>
                                                <div
                                                    className="text-overflow"
                                                    style={{ color: item.queryEnable === '1' ? '' : 'yellow' }}
                                                >
                                                    {item.keyword}
                                                </div>
                                                <span onClick={() => this.showDelModal(idx)}>×</span>
                                            </li>
                                        );
                                    })}
                                </ul> :
                                <span>暂无关键字，请点击添加按钮进行添加</span>
                            }
                        </div>
                        <p>您最多可以收录50个关键词组</p>
                        <div>
                            <p>
                                本平台为您收录了很多关键词，有关于：实时话题、国家政策等，您可以在此界查找平台所有收录的关键词。若您还未能查找到要搜索的关键词，您可以在首页或“我创建的关键词”中进行创建，平台会尽快将该关键词进行收录，以便您的查阅，平台一个关键词的收录时间一般为2-3个工作日，谢谢您的使用。
                            </p>
                        </div>
                    </div> :
                    <div className={style.form}>
                        <ul>
                            <li>
                                当前密码
                                <input
                                    type="password"
                                    value={this.state.oldpassword}
                                    onChange={e => this.onChange('oldpassword', e.target.value)}
                                />
                            </li>
                            <li>
                                修改密码
                                <input
                                    type="password"
                                    value={this.state.newpassword}
                                    onChange={e => this.onChange('newpassword', e.target.value)}
                                />
                            </li>
                            <li>
                                再次确认
                                <input
                                    type="password"
                                    value={this.state.repassword}
                                    onChange={e => this.onChange('repassword', e.target.value)}
                                />
                            </li>
                            <li>
                                <span onClick={() => this.resetPasswd()}>确认修改</span>
                            </li>
                        </ul>
                    </div>
                }
                {this.state.showDelModal ?
                    <Modal
                        message="确认删除此关键词？"
                        confirm={this.delKeyWords}
                        cancel={() => this.onChange('showDelModal', false)}
                        cancelText="取消"
                        okText="确认"
                        maskClosable={false}
                    /> :
                    ''
                }
                {this.state.showAddModal ?
                    <Modal
                        confirm={this.addKeyWords}
                        cancel={() => this.onChange('showAddModal', false)}
                        okText="添加"
                        maskClosable={true}
                    >
                        <div className={style.addInput}>
                            <input
                                placeholder="请输入关键词"
                                value={this.state.newKeyWord}
                                onChange={e => this.onChange('newKeyWord', e.target.value)}
                            />
                        </div>
                    </Modal> :
                    ''
                }
                <div className={style.loading} style={{ display: this.state.isLoading ? 'flex' : 'none' }}>
                    <Spin spinning={this.state.isLoading} size="large" />
                </div>
            </div>
        );
    }
}
