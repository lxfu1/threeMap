import React, { Component } from 'react'
import style from './style.scss'

class Button extends Component{
    render() {
        const { type='primary', size='normal' } = this.props

        return (
            <div className={style.container} onClick={this.props.onClick || ''}>
                <button className={`${style[type+'Btn']} ${style[size+'Btn']}`}>{this.props.children}</button>
            </div>
        )
    }
}

export default Button