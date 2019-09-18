import React, { Component } from 'react';
import style from './style.scss';
import Keywd from './keywordextraction'; //关键词提取
import PolAn from './policy'; //政策分类
import SimAna from './similarity'; //相似分析
import TextA from './superiorpolicy/texta';//上级政策A
import TextB from './superiorpolicy/textb';//上级政策B
import similarityService from 'service/Similarity'
import { Icon } from 'antd';

const Loading = () => {
    return <div className={style.LoadingContainer}>
        <div className={style.blurDiv} />
        <Icon type="loading" style={{ fontSize: 45 }} spin />
    </div>
}

class Similarity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data1: '',
            data2: '',
            text1: '',
            text2: '',
            title1: '',
            title2: '',
            cmpText1: '',
            cmpText2: '',
            showCompareText: false,
            indexs: '',
            loading: false
        };
    }

    componentWillMount() {
        const { params: ids = [] } = this.props.location

        ids.forEach((id, idx) => {
            this.getTextDetail({ id, idx: idx + 1 })
        })
    }

    getTextDetail = ({ id, idx }) => {
        similarityService.detail(id).then(data => {
            let o = {}

            o['data' + idx] = data
            o['text' + idx] = data.text
            this.setState({
                ...o
            })
        })
    }

    handleOk = () => {
        this.handleCancel();
    };

    // 文本对比
    showTextCompare = (index) => {
        this.setState({ loading: true }, () => {
            Promise.all([this.compareText(0), this.compareText()]).then(res => {
                this.setState({
                    cmpText1: res[0],
                    cmpText2: res[1],
                    showCompareText: !this.state.showCompareText,
                    indexs: index,
                    loading: false
                })
            })
        })
    }

    compareText = (flag = 1) => {
        const { text1, text2 } = this.state
        let t1 = flag ? text1 : text2, t2 = flag ? text2 : text1;
        const textLen = 2000

        return new Promise((res, rej) => {
            let tail2 = t2.slice(textLen)
            let diff = JsDiff.diffChars(t1.slice(0, textLen), t2.slice(0, textLen))

            let fragment = document.createDocumentFragment(),
                color = '', span = null;

            diff.forEach(function (part) {
                color = part.added ? '#46E1FB' :
                    part.removed ? 'red' : 'white';
                if (!part.removed) {
                    span = document.createElement('span');
                    span.style.color = color;
                    span.appendChild(document
                        .createTextNode(part.value));
                    fragment.appendChild(span);
                }
            });

            var tmp = document.createElement('div');

            tmp.appendChild(fragment);

            res(tmp.innerHTML + tail2)
            rej('Failed')
        })
    }

    // 导入Txt文本
    uploadTxtFile = (e, flag = true) => {
        const input = e.target, reader = new FileReader();
        let { text1, text2, data1, data2, title1, title2 } = this.state

        reader.onload = () => {
            const text = reader.result;

            if (flag) {
                data1 = ''
                text1 = text
                title1 = input.files[0].name
            } else {
                data2 = ''
                text2 = text
                title2 = input.files[0].name
            }
            this.setState({ text1, text2, data1, data2, title1, title2 })
        };
        reader.readAsText(input.files[0], 'utf-8');
    }

    handleCancel = e => {
        let state = this.state;

        state.showAlert = '';
        this.setState(state);
    };

    //关键字提取
    handleTo = (index) => {
        let state = this.state;

        state.showAlert =
            <Keywd
                handleCancel={this.handleCancel}
                handleOk={this.handleOk}
                handleIdA={this.state.data1}
                handleIdB={this.state.data2}
                handleImportA={state.text1}
                handleImportB={state.text2}
            />
        state.indexs = index
        this.setState(state);


    };

    //政策分类
    handleTopP = (index) => {

        let object1 = this.state.data1
        let regObj1 = new RegExp('([A-Z]+)', 'g');

        for (let i in object1) {
            if (object1.hasOwnProperty(i)) {
                let temp = object1[i];

                if (regObj1.test(i.toString())) {
                    temp = object1[i.replace(regObj1, function (result) {
                        return '_' + result.toLowerCase();
                    })] = object1[i];
                    delete object1[i];
                }
            }
        }

        let object2 = this.state.data2
        let regObj2 = new RegExp('([A-Z]+)', 'g');

        for (let j in object2) {
            if (object2.hasOwnProperty(j)) {
                let temp = object2[j];

                if (regObj2.test(j.toString())) {
                    temp = object2[j.replace(regObj2, function (result) {
                        return '_' + result.toLowerCase();
                    })] = object2[j];
                    delete object2[j];
                }
            }
        }

        let state = this.state;

        state.showAlert =
            <PolAn
                handleCancel={this.handleCancel}
                handleOk={this.handleOk}
                handleIdA={object1}
                handleIdB={object2}
                handleImportA={this.state.text1}
                handleImportB={this.state.text2}
                title1={this.state.title1}
                title2={this.state.title2}
            />

        state.indexs = index;
        this.setState(state);


    };

    handleGoBack = () => {
        this.props.history.goBack()
    }

    // 相似分析
    handleToS = index => {
        let state = this.state;

        state.showAlert =
            <SimAna
                handleCancel={this.handleCancel}
                handleOk={this.handleOk}
                handleIdA={state.data1}
                handleIdB={state.data2}
                handleImportA={state.text1}
                handleImportB={state.text2}
            />
        state.indexs = index;
        this.setState(state);

    };

    //上级政策
    handleText = (index) => {
        this.setState({
            indexs: index,
            alertTexta: <TextA
                handImportA={this.state.text1}
                handleIdA={this.state.data1}
                noData='有数据'
            />,
            alertTextb: <TextB
                handImportB={this.state.text2}
                handleIdB={this.state.data2}
                noData='有数据'
            />
        });
    };

    render() {
        const { text1, text2, cmpText1, cmpText2, showCompareText, loading } = this.state

        return (
            <div className={style.container}>
                <div>
                    <button className={style.back} onClick={this.handleGoBack}>返回</button>
                </div>
                <div className={style.text}>
                    <div className={style.leftcon}>
                        <div className={style.imports}>
                            <div>文本A</div>
                            <div className={style.imgUploadContainer}>
                                <a className={style.file}>导入TXT文本
                                    <input type="file" accept='text/plain' onChange={(e) => this.uploadTxtFile(e)} />
                                </a>
                            </div>
                        </div>
                        <div className={style.leftcons}>
                            <img src={require('./images/lt.png')} className={style.llt} />
                            <pre dangerouslySetInnerHTML={{ __html: showCompareText ? cmpText1 : text1 }} ></pre>
                            <div className={style.texta} style={{ display: this.state.indexs === 5 ? 'block' : 'none' }}>
                                <div> {this.state.alertTexta} </div>
                            </div>
                            <img src={require('./images/rb.png')} className={style.lrb} />
                        </div>
                    </div>
                    <div className={style.contentcon}>
                        <button onClick={() => this.showTextCompare(1)}
                            style={{
                                color: this.state.indexs === 1 ? '#000' : '',
                                background: this.state.indexs === 1 ? '#3CB0FD' : ''
                            }}>文本对比</button>
                        <button onClick={() => this.handleTo(2)}
                            style={{
                                color: this.state.indexs === 2 ? '#000' : '',
                                background: this.state.indexs === 2 ? '#3CB0FD' : ''
                            }}>关键字提取</button>
                        <button onClick={() => this.handleTopP(3)}
                            style={{
                                color: this.state.indexs === 3 ? '#000' : '',
                                background: this.state.indexs === 3 ? '#3CB0FD' : ''
                            }}>政策分类</button>
                        <button onClick={() => this.handleToS(4)}
                            style={{
                                color: this.state.indexs === 4 ? '#000' : '',
                                background: this.state.indexs === 4 ? '#3CB0FD' : ''
                            }}>相似度分析</button>
                        <button onClick={() => this.handleText(5)}
                            style={{
                                color: this.state.indexs === 5 ? '#000' : '',
                                background: this.state.indexs === 5 ? '#3CB0FD' : ''
                            }}>上级政策</button>
                    </div>
                    <div className={style.rightcon}>
                        <div className={style.imports}>
                            <div>文本B</div>
                            <div className={style.imgUploadContainer}>
                                <a className={style.file}>导入TXT文本
                                    <input type="file" accept='text/plain' onChange={(e) => this.uploadTxtFile(e, false)} />
                                </a>
                            </div>
                        </div>
                        <div className={style.leftcons} >
                            <img src={require('./images/lt.png')} className={style.rlt} />
                            <pre dangerouslySetInnerHTML={{ __html: showCompareText ? cmpText2 : text2 }} ></pre>
                            <div className={style.textb} style={{ display: this.state.indexs === 5 ? 'block' : 'none' }}>
                                <div> {this.state.alertTextb} </div>
                            </div>
                            <img src={require('./images/rb.png')} className={style.rrb} />
                        </div>
                    </div>
                </div>
                {this.state.showAlert}
                {
                    loading ? <Loading /> : ''
                }
            </div>
        );
    }
}
export default Similarity;
