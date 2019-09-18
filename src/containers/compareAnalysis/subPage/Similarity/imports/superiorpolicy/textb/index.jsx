import React, { Component } from 'react';
import style from './PopupB/style.scss';
import Super from './PopupB';
import resource from 'util/resource';
import {Modal} from 'antd';

export default class TextB extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible:false,
            visibleNo:false,
            ku:this.props.handleIdB.text,
            data:[],
            datat:'',
            details:{},
            title:'',
            texts:{
                text: this.props.handleIdB.text ? this.props.handleIdB.text : this.props.handImportB
            }
        };
    }

    componentWillMount() {
        this.getData();
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            texts:{
                text: nextProps.text ? nextProps.text : nextProps.handImportB
            },
            ku:nextProps.handleIdB.text
        },
            this.getData(this.state.texts.text = nextProps.text ? nextProps.text : nextProps.handImportB)
        )
    }

    // 获取上级政策
    getData = (data) => {
        if(data){
            this.state.texts.text = data
        }
        resource.post('/nasc/source?appkey=5g2pni99rd2gu4ipj8d0w6wqm5hqxylj',this.state.texts).then(res => {
            this.setState({
                data:res.file_source
            })
        });
    };

    //获取弹窗
    handleData = (data) => {
        if(this.state.ku){
            resource.get(`/govacademy-server/policy/detail?title=${data}`).then(res => {
                if(res.code === 200 && res.data && res.data.text){
                    let state = this.state;

                    state.showAlert = <Super
                        handleCancel = {this.handleCancel}
                        handleOk = {this.handleOk}
                        datat = {data}
                        details = {this.state.details}
                    />
                    this.setState(state);
                }else{
                    let state = this.state;

                    state.showAlert='';
                    state.visibleNo = true
                    this.setState(state);
                }
            });
        }else{
            this.setState({visible:true})
        }
    };

    handleOk = () => {
        this.handleCancel();
    };

    handleCancel = (e) => {
        let state = this.state;

        state.showAlert = '';
        this.setState(state);
    };

    handleCancelImport=()=>{
        this.setState({
            visible:false,
            visibleNo:false
        })
    }
    render() {
        const { showAlert, data, visibleNo} = this.state;

        return (
            <div>
                <div className={style.title} >上级政策</div>
                        <div>
                            {
                                data && data.length > 0 ?
                                    <div className={style.overflows}>
                                        {
                                            data && data.map((item, index) => {
                                                return (
                                                            <div
                                                                onClick={
                                                                    () => this.handleData(item.high_title)
                                                                }
                                                                className={style.titles}
                                                                style={{color: item.high_title ? '#3ab0ff' : '#ffffff'}}
                                                                key={index}>
                                                                { item.high_title}
                                                            </div>
                                                )
                                            })
                                        }
                                    </div>:
                            <div>暂未找到相应的上级政策</div>
                            }
                        </div>
                        <Modal visible={visibleNo}
                               onCancel={this.handleCancelImport}
                               onOk={this.handleCancelImport}
                               className={style.importMod}
                               style={{marginTop: '25vh' }}
                               width={400}
                               footer={null}>
                            <div className={style.zhengce}>
                                <div>
                                    该政策未找到与之对应的正文文本
                                </div>
                                <button onClick={this.handleCancelImport} className={style.btn}>确定</button>
                            </div>
                        </Modal>

                        <Modal visible={this.state.visible}
                               onCancel={this.handleCancelImport}
                               onOk={this.handleCancelImport}
                               className={style.importMod}
                               style={{marginTop: '25vh' }}
                               width={400}
                               footer={null}>
                            <div className={style.zhengce}>
                                <div>
                                    该政策未找到与之对应的正文文本
                                </div>
                                <button onClick={this.handleCancelImport} className={style.btn}>确定</button>
                            </div>
                        </Modal>
                {showAlert}
            </div>
        );
    }
}


