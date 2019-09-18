import React, { Component } from 'react'
import style from './style.scss'

class CheckBox extends Component{
    constructor(props){
        super(props)
        this.state = {
            checked: false
        }
    }

    toggle = () => {
        const { change } = this.props

        if(change){
            change(!this.props.checked)
        }
        this.setState({
            checked: !this.props.checked
        })
    }

    render() {
        const { checked = this.state.checked } = this.props
        const clsName = checked ? 'checked' : 'unChecked'

        return (
            <div className={`${style.container} ${style[clsName + 'Btn']}`} onClick={this.toggle}></div>
        )
    }
}

export default CheckBox