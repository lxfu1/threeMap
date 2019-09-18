import React, { Component } from 'react';
import style from './style.scss';
import { Modal, Button } from 'antd';
import resource from 'util/resource';


export default class Policy extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataa: [],
            datab: [],
            handleIdA: this.props.handleIdA,
            handleIdB: this.props.handleIdB,
            keywordsa: [{words: '', importants: ''}],
            texta:this.props.handleIdA,
            textb:this.props.handleIdB,
            importA: {
                title: this.props.title1,
                text:this.props.handleImportA
            },
            importB: {
                title: this.props.title2,
                text:this.props.handleImportB
            }
        }
    }

    componentWillMount(){
        if(this.state.texta){
            this.getDataA();
        }else{
            this.getDataimportA();
        }

        if(this.state.textb){
            this.getDataB();
        }else{
            this.getDataimportB();
        }
    }


    handleCancel = e => {
        if (this.props.handleCancel) {
            this.props.handleCancel();
        }
    };

    getDataimportA = () => {
        resource.post('/nasc/category?appkey=ipt5x5kzv5zbg7nx9hwf3xquea7hp1yf',this.state.importA).then(res => {
            this.setState({
                dataa:res
            })
        });
    };

    getDataimportB = () => {
        resource.post('/nasc/category?appkey=ipt5x5kzv5zbg7nx9hwf3xquea7hp1yf',this.state.importB).then(res => {
            this.setState({
                datab:res
            })
        });
    };

    getDataA = () => {
        resource.post('/nasc/parse?appkey=5g2pni99rd2gu4ipj8d0w6wqm5hqxylj',this.state.texta).then(res => {
            this.setState({
                dataa:res
            })
        });
    };

    getDataB = () => {
        resource.post('/nasc/parse?appkey=5g2pni99rd2gu4ipj8d0w6wqm5hqxylj',this.state.textb).then(res => {
            this.setState({
                datab:res
            })
        });
    };


    render() {
        let {dataa,datab}=this.state
        let lsta = [],
            lstb=[]

        for(let index in dataa.category){
            let map = {name:'',value:[]};
            let douhaoa=[];

            douhaoa.push(dataa.category[index].join(','));
            map.name = index;
            map.value = douhaoa
            lsta.push(map)
        }
        for(let ind in datab.category){
            let map = {name:'',value:[]};
            let douhaob=[];

            douhaob.push(datab.category[ind].join(','));
            map.name = ind;
            map.value = douhaob;
            lstb.push(map)
        }
        return (
            <Modal
                visible={true}
                onCancel={this.handleCancel}
                className={style.keyword}
                width={'50%'}
                footer={null}
                style={{ marginTop: '172px' }}
            >
                <img src={require('../images/lt.png')} className={style.lt} />
                <div className={style.title}>政策分类结果</div>
                <div className={style.mymodal}>
                    <div className={style.leftbox}>
                        <div className={style.textA}>文本A</div>
                        <table>
                            <thead>
                                <tr>
                                    <td width="50%">一级分类</td>
                                    <td width="50%">二级分类</td>
                                </tr>
                            </thead>
                            {
                                lsta .length>0 ? <tbody>
                                    {lsta && lsta.map((item, index) => {
                                        return (
                                            <tr key={index} className={style.tr}>
                                                <td width="50%">
                                                <span
                                                    className={style.cicle}
                                                    style={{
                                                        background:
                                                            JSON.stringify(lstb).indexOf('"'+item.name+'"') ===
                                                            -1 ?
                                                                '' :
                                                                '#3697FF'
                                                    }}
                                                >
                                                    {
                                                        item.name || '--'
                                                    }
                                                </span>
                                                </td>
                                                <td width="50%">
                                                <span
                                                    className={style.cicle}
                                                    style={{
                                                        background:
                                                            JSON.stringify(lstb).indexOf(JSON.stringify('"'+item.value+'"')) === -1 ?
                                                                '' :
                                                                '#3697FF'
                                                    }}
                                                >
                                                    {
                                                        item.value || '--'
                                                    }
                                                </span>
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
                                    <td width="50%">一级分类</td>
                                    <td width="50%">二级分类</td>
                                </tr>
                            </thead>
                            {
                                lstb.length>0?
                                    <tbody>
                                    {lstb && lstb.map((item, index) => {
                                        return (
                                            <tr key={index} className={style.tr}>
                                                <td width="50%">
                                                <span
                                                    className={style.cicle}
                                                    style={{
                                                        background:
                                                            JSON.stringify(lsta).indexOf('"'+item.name+'"') ===
                                                            -1 ?
                                                                '' :
                                                                '#3697FF'
                                                    }}
                                                >
                                                    {
                                                        item.name || '--'
                                                    }
                                                </span>
                                                </td>
                                                <td width="50%">
                                                <span
                                                    className={style.cicle}
                                                    style={{
                                                        background:
                                                            JSON.stringify(lsta).indexOf(JSON.stringify('"'+item.value+'"')) === -1 ?
                                                                '' :
                                                                '#3697FF'
                                                    }}
                                                >
                                                    {
                                                        item.value || '--'
                                                    }
                                                </span>
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
