import React, {Component} from 'react'
import style from './style.scss'
import Box from 'components/Box'

class Modal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: this.props.message
        }
    }

    componentDidMount() {
    }

    componentWillUnmount() {
        //组件销毁时
        const {remove} = this.props;

        if (remove) {
            remove();
        }
    }

    handleConfirm = () => {
        const {confirm} = this.props;

        if (confirm) {
            confirm()
        }
        console.log('Handle Ok')
    };

    handleCancel = () => {
        const {cancel} = this.props

        if (cancel) {
            cancel()
        }
    };
    //点击蒙板关闭对话框
    maskClick = () => {
        if(this.props.maskClosable){
            this.handleCancel();
        }
    };

    render() {
        const {message} = this.state

        return (
            <div className={style.container}>
                <div className={style.blurDiv} onClick={this.maskClick}/>
                <Box width='360px' height='200px'>
                    <div className={style.modalContainer}>
                        <i onClick={this.handleCancel}>×</i>
                        <p>{message}</p>
                        <div>{this.props.children}</div>
                        {
                            this.props.cancelText ?
                                <div>
                                    <div className={style.twoButton} onClick={this.handleConfirm}>确定</div>
                                    <div className={style.twoButton} onClick={this.handleCancel}>{this.props.cancelText}</div>
                                </div> :
                                <div>
                                    <div className={style.oneButton} onClick={this.handleConfirm}>确定</div>
                                </div>
                        }
                    </div>
                </Box>
            </div>
        )
    }
}

export default Modal