import React, { Component } from 'react'
import style from './style.scss'

class Button extends Component {
    render() {
        const { type = 'primary', size = 'normal', noWidth = false } = this.props

        return (
            <div className={style.container} onClick={this.props.onClick || ''}>
                <button
                    style={style}
                    className={`${style[type + 'Btn']} ${noWidth ? style['noWidthBtn'] : style[size + 'Btn']}`}
                >
                    {this.props.children}
                </button>
            </div>
        )
    }
}

export default Button