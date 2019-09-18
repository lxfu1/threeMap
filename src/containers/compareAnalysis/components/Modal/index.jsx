import React, { Component } from 'react'
import style from './style.scss'
import Box from 'components/Box'

class Modal extends Component{
    constructor(props){
        super(props)
        this.state = {
            title: this.props.title || '提示标题',
            message: this.props.message || '提示内容'
        }
    }

    componentDidMount(){
        this.addEventListener()
    }

    handleConfirm = () => {
        const { confirm } = this.props

        if(confirm){
            confirm()
        }
        console.log('Handle Ok')
    }

    handleCancel = () => {
        const { cancel } = this.props

        if(cancel){
            cancel()
        }
        console.log('Handle Cancel')
        this.removeEventListener()
    }

    addEventListener = () => {
        document.addEventListener('click', this.handleCancel);
    }

    removeEventListener = () => {
        document.removeEventListener('click', this.handleCancel);
    }

    render() {
        const { title, message } = this.state

        return (
            <div className={style.container}>
                <div className={style.blurDiv} />
                <Box width='360px' height='200px'>
                    <div className={style.modalContainer}>
                        <i onClick={this.handleCancel}>×</i>
                        <p>{message}</p>
                        <div onClick={this.handleConfirm}>确定</div>
                    </div>
                </Box>
            </div>
        )
    }
}

export default Modal