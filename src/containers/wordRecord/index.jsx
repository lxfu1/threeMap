/**
 * @author yaowei
 */
import React, { Component } from 'react';
import style from './style.scss';
import searchImg from '../../static/images/search.png';
import Rodal from 'rodal';
import leftTop from './images/left-top.png';
import buttonRight from './images/button-right.png';
import resource from 'resource';
import API from 'api';
import { message } from 'antd';
import { withRouter } from 'react-router';
export default class WordRecord extends Component {
    state = {
        rodalView: false,
        allKeyWords: [], //所有的关键词
        searchKeyWords: '', //查询关键词
        newKeyWord: '', //新增关键词
        lastSearchKeyWords: '', //最后一次搜索的关键词
        themeId: '074fafb11e38dddd58a5290bdc6044b6' // @todo 主题写死 因为目前产品设计的没有主题选择 默认 扶贫主题
    };

    componentDidMount() {
        this.getKeyWords();
    }

    getKeyWords = (keyword = '') => {
        resource.get(API.keyWords.getKeyWords, { keyword }).then(res => {
            if (res.code === 200) {
                this.setState({
                    allKeyWords: res.data.list,
                    lastSearchKeyWords: keyword
                });
            } else {
                message.info(res.message);
            }
        });
    };
    searchKeyWords = () => {
        this.getKeyWords(encodeURI(this.state.searchKeyWords));
    };
    closeRodal = () => {
        this.setState({
            rodalView: false,
            newKeyWord: ''
        });
    };

    openRodal = () => {
        this.setState({
            rodalView: true
        });
    };
    // 添加关键词
    addKeyWords = () => {
        let newParamas = {
            keyword: this.state.newKeyWord,
            themeId: this.state.themeId
        };
        const allKeyWords = this.state.allKeyWords;

        resource.post(API.keyWords.post.addKeyWords, newParamas).then(res => {
            if (res.code === 200) {
                // if (this.state.lastSearchKeyWords === '' || this.state.lastSearchKeyWords.indexOf(this.state.newKeyWord)) {
                //     allKeyWords.push({
                //         id: res.data,
                //         keyword: this.state.newKeyWord,
                //         queryEnable: '0'
                //     });
                //     this.setState(
                //         {
                //             newKeyWord: '',
                //             allKeyWords
                //         },
                //         this.closeRodal
                //     );
                // } else {
                //     this.setState(
                //         {
                //             newKeyWord: ''
                //         },
                //         this.closeRodal
                //     );
                // }
                this.closeRodal();
                message.info('操作成功');
                this.getKeyWords();
            } else {
                message.info(res.message);
            }
        });
    };
    //点击关键词
    keyWordClick = keyWordInfo => {
        if (keyWordInfo.queryEnable === '0') {
            return message.info('该关键词未收录');
        }
        const activeKeyWord = {};

        sessionStorage.setItem('themeID', keyWordInfo.themeId);
        sessionStorage.setItem('themeName', keyWordInfo.theme);
        sessionStorage.setItem('keyword', keyWordInfo.keyword);
        sessionStorage.setItem('keywordId', keyWordInfo.id);
        this.props.history.push('/main');
    };

    render() {
        return (
            <div className={style.container}>
                <div className={style.content}>
                    <div>
                        <div className={style.search}>
                            <input
                                type="text"
                                placeholder="请输入查询内容"
                                value={this.state.searchKeyWords}
                                onChange={e => {
                                    this.setState({
                                        searchKeyWords: e.target.value
                                    });
                                }}
                            />
                            <img src={searchImg} alt="搜索" onClick={() => this.searchKeyWords()} />
                        </div>
                        <div>
                            <WordItem
                                add={this.openRodal}
                                allKeyWords={this.state.allKeyWords}
                                keyWordClick={this.keyWordClick}
                            />
                        </div>
                    </div>
                    <div>
                        <p>
                            本平台为您收录了很多关键词，有关于：实时话题、国家政策等，您可以在此界查找平台所有收录的关键词。若您还未能查找到要搜索的关键词，您可以在首页或“我创建的关键词”中进行创建，平台会尽快将该关键词进行收录，以便您的查阅，平台一个关键词的收录时间一般为2-3个工作日，谢谢您的使用。
                        </p>
                    </div>
                </div>
                <Rodal width={490} height={180} visible={this.state.rodalView} onClose={this.closeRodal} showCloseButton={true}>
                    <div className={style.form}>
                        <div>
                            <input
                                type="text"
                                placeholder="请输入关键词"
                                value={this.state.newKeyWord}
                                onChange={e => {
                                    this.setState({
                                        newKeyWord: e.target.value
                                    });
                                }}
                            />
                        </div>
                        <div onClick={() => this.addKeyWords()}>添加</div>
                    </div>
                    <img className={style.leftTopPic} src={leftTop} />
                    <img className={style.buttonRightPic} src={buttonRight} />
                </Rodal>
            </div>
        );
    }
}

const WordItem = ({ add, allKeyWords, keyWordClick }) => {
    return (
        <ul className={style.words}>
            {allKeyWords.map((item, idx) =>
                <li key={idx}>
                    &lt;.
                    <span onClick={() => keyWordClick(item)} style={{ color: item.queryEnable === '1' ? '' : 'yellow' }}>
                        {item.keyword}
                    </span>
                    .&gt;
                </li>
            )}
            <li key="newWord" className={style.addNewWord}>
                &lt;.
                <span onClick={add}>+添加关键字</span>
                .&gt;
            </li>
        </ul>
    );
};
