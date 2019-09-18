import React, { Component } from 'react';
import style from './style.scss';
import { Modal, Button } from 'antd';
import resource from 'util/resource';

export default class KeyWordextraction extends Component {
    constructor(props) {
        super(props);
        this.state = {
            handleIdA:this.props.handleIdA,
            handleIdB:this.props.handleIdB,
            handleImportA:this.props.handleImportA,
            handleImportB:this.props.handleImportB,
            dataa:[],
            keywordsa:[{words:'',importants:''}],
            backgrounds: [],
            texta:{'text': '代码珠海市永航运输有限公司所属“永航 8 三四”船，代码于三思 2010  二○一二年八月二十八日芝麻，芝麻'},
            textb:{'text': '代码珠海市永航运输有限公司所属“永航 8 三四”船，代码于三思 2010  二○一二年八月二十八日芝麻，芝麻'}
        };
    }
    handleCancel = e => {
        if (this.props.handleCancel) {
            this.props.handleCancel();
        }
    };

    componentWillMount() {
        this.getDataA();
        this.getDataB();
    }

    getDataA= () => {
        let state=this.state;

        state.texta.text = state.handleIdA.text ? state.handleIdA.text : state.handleImportA;
        resource.post('/nasc/keywords?appkey=5g2pni99rd2gu4ipj8d0w6wqm5hqxylj',this.state.texta).then(res => {
            this.setState({
                dataa:res.keywords
            })
        });
    };

    getDataB = () => {
        let state=this.state;

        state.textb.text=state.handleIdB.text?state.handleIdB.text:state.handleImportB;
        resource.post('/nasc/keywords?appkey=5g2pni99rd2gu4ipj8d0w6wqm5hqxylj',this.state.textb).then(res => {
            this.setState({
                datab:res.keywords
            })
        });
    };


    render() {
        let lst1 = [];

        for(let index in this.state.dataa){
            let map = {};

            map['words'] = this.state.dataa[index][0];
            map['importents'] = this.state.dataa[index][1];
            lst1[index]=map;
        }

        let lst2 = [];

        for(let index in this.state.datab){
            let map = {};

            map['words'] = this.state.datab[index][0];
            map['importents'] = this.state.datab[index][1];
            lst2[index]=map;
        }
        console.log(lst1)
        console.log(lst2)
        console.log(JSON.stringify(lst2))

        return (
            <Modal
                visible={true}
                width={'52%'}
                style={{ marginTop: '4%' }}
                onCancel={this.handleCancel}
                className={style.keyword}
                footer={null}
            >
                <img src={require('../images/lt.png')} className={style.lt} />
                <div className={style.title}>关键词提取结果</div>
                <div className={style.mymodal}>
                    <div className={style.leftbox}>
                        <div className={style.textA}>文本A</div>
                        <table>
                            <thead>
                                <tr>
                                    <td>关键词</td>
                                    <td>重要程度</td>
                                </tr>
                            </thead>
                            {
                                lst1.length > 0 ? <tbody>
                                    {lst1 && lst1.map((item, index) => {
                                        return (
                                            <tr key={index} className={style.tr}>
                                                <td>
                                                <span
                                                    style={{
                                                        background:
                                                            JSON.stringify(lst2).indexOf('"words"'+':'+ '"'+item.words+'"') ===
                                                            -1 ?
                                                                '' :
                                                                '#3697FF'
                                                    }}
                                                >
                                                    {item.words}
                                                </span>
                                                </td>
                                                <td>
                                                    <span>{item.importents}</span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    </tbody>:
                                    <div className={style.nodata}>暂无数据</div>
                            }
                        </table>
                    </div>
                    <div className={style.rightbox}>
                        <div className={style.textB}>文本B</div>
                        <table>
                            <thead>
                                <tr>
                                    <td>关键词</td>
                                    <td>重要程度</td>
                                </tr>
                            </thead>
                            {
                                lst2.length > 0 ? <tbody>
                                    {lst2 && lst2.map((item, index) => {
                                        return (
                                            <tr key={index} className={style.tr}>
                                                <td>
                                                <span
                                                    style={{
                                                        background:
                                                            JSON.stringify(lst1).indexOf('"words"'+':'+ '"'+item.words+'"') ===
                                                            -1 ?
                                                                '' :
                                                                '#3697FF'
                                                    }}
                                                >
                                                    {item.words}
                                                </span>
                                                </td>
                                                <td>
                                                    <span>{item.importents}</span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    </tbody>:
                                    <div className={style.nodata}>暂无数据</div>
                            }
                        </table>
                    </div>
                </div>
                <img src={require('../images/rb.png')} className={style.rb} />
            </Modal>
        );
    }
}
