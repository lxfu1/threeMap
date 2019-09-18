/*
 *author: 姚伟
 * date: 18/8/8
 * describe: 政策溯源
 */
import React, { Component } from 'react';
import style from './style.scss';

class Items extends Component {
    constructor(props){
        super(props);
    }
    render() {
        const {title, policyUniqueId, type, spread} = this.props;
        let classType = style.purple;

        if(type === 1){
            classType = style.orange;
        }
        if(type === 2){
            classType = style.blue;
        }
        const noDataTitle = '没有更多上级政策了';

        return (
            <div className={style.container + ' ' + classType} >
                <div className={style.common}>
                    <div className={style.title}>
                        <h5>{title}</h5>
                    </div>
                    {
                        title !== noDataTitle ? <div className={style.btns}>
                            <span className={style.compare} onClick={()=>{this.props.click(policyUniqueId, '对比',title)}}>对比</span>
                            <span className={style.scan} onClick={()=>{this.props.click(policyUniqueId, '预览', title)}}>预览</span>
                        </div> : null
                    }
                </div>
                {
                    title !== noDataTitle ? <span className={style.arrow + ' ' + `${spread ? style.spread : style.retracting}`}
                    onClick={()=>{this.props.click(policyUniqueId, '折叠')}}></span> : null
                }
            </div>
        );
    }
}
export default Items;
