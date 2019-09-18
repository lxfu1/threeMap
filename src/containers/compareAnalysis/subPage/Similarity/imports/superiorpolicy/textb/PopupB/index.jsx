import React, { Component } from 'react';
import style from './style.scss';
import {Modal, Button, message} from 'antd';
import resource from 'util/resource';
import { articleStore } from 'store';


export default class PopupB extends Component {
    constructor(props) {
        super(props);

        this.state = {
            add: '+添加至对比',
            data:[{'high_title':''}],
            datadetail:this.props.datat,
            details:this.props.details,
            displaysup:'none',
            texts:{
                'text':this.props.details.text
            }
        };
    }

    componentWillMount() {
        this.handleDetails(this.state.datadetail)
    }


    handleCancel = e => {
        if (this.props.handleCancel) {
            this.props.handleCancel();
        }
    };

    getData = () => {
        resource.post('/nasc/source?appkey=5g2pni99rd2gu4ipj8d0w6wqm5hqxylj',this.state.texts).then(res => {
            this.setState({
                data:res.file_source,
                displaysup:'block'
            })
        });
    };

    //点击获取对应上级政策详情
    handleDetails=(data)=>{
        let state=this.state

        state.datadetail=data
        resource.get(`/govacademy-server/policy/detail?title=${data}`).then(res => {
            if(res.code === 200){

                this.setState({
                    data:state.data
                })
                state.texts.text = res.data ? res.data.text :'';
                if(!res.data){
                    return
                }
                state.details = res.data
                this.setState(state)
            }
        });
    }

    //添加至对比
    addBettleItem = () => {
        resource.post(`/govacademy-server/policy/cart/${this.state.details.bbdXgxxId}`).then(res => {
            if(res.code===200){
                this.setState({
                    add:'√已添加'
                })
            }else{
                message.info(res.message);
            }
        });

    }

    render() {
        let {add,addcolor,addbackground,data,displaysup,details} = this.state


        return (
            <Modal
                visible={true}
                onCancel={this.handleCancel}
                className={style.modals}
                width={700}
                footer={null}
            >
                <img src={require('../../../images/lt.png')} className={style.lt}/>
                <div className={style.detail}>
                    <div><h1>{details ? details.title : ''}</h1><pre dangerouslySetInnerHTML={{ __html: details ? details.text : '' }}></pre> </div>
                </div>
                <div className={style.twobtn}>
                    <button onClick={this.getData}>上级政策</button>
                    {
                        <span className={this.state.add==='+添加至对比'?style.willAdd:style.normal} onClick={this.addBettleItem}>{this.state.add}</span>
                    }
                </div>
                {
                    data.length > 0 ? <div style={{display:displaysup}}>
                        <div className={style.suptitle}>上级政策</div>
                        {
                            data && data.map((item,index)=>{
                                return(
                                    <div
                                        onClick={()=>this.handleDetails(item.high_title)}
                                        className={style.hightitle}
                                        style={{color : index === 0 ? '#3ab0ff' : item.high_title ? '' :'#ffffff' }}
                                        key={index}>
                                        {item.high_title ? item.high_title :'暂未找到相应的上级政策' }
                                    </div>
                                )
                            })
                        }
                    </div>:'暂未找到相应的上级政策'
                }
                <img src={require('../../../images/rb.png')} className={style.rb}/>
            </Modal>
        );
    }
}


