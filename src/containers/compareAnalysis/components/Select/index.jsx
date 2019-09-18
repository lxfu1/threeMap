import React, { Component } from 'react'
import style from './style.scss'
import { Tag } from 'antd'
import _ from 'lodash'

const tmpData = [
    { label: '林宥嘉', value: 'Lin' },
    { label: '功夫胖', value: 'Kong' },
    { label: '王以太', value: 'Wong' }
]

class Select extends Component {
    constructor(props) {
        super(props)
        this.state = {
            show: false,
            currentOption: { label: '不限', value: '' },
            size: this.props.size || 'normal'
        }
    }

    componentWillMount() {
        this.initSelected()
    }

    initSelected = () => {
        const { newDefault } = this.props

        this.setState({
            currentOption: newDefault ? { label: newDefault, value: '' } : { label: '不限', value: '' }
        })
    }

    componentWillReceiveProps(next) {
        if (!_.isEqual(this.props.data, next.data)) {
            this.initSelected()
        }
    }

    toggle = () => {
        this.setState({
            show: !this.state.show
        }, () => {
            if (this.state.show) {
                this.addEventListener();
            } else {
                this.removeEventListener();
            }
        })
    }

    changeOption = option => {
        const { change, name } = this.props

        if (change) {
            if (name) {
                change({[name]: option.value}, name)
            } else {
                change(option)
            }
        }

        this.setState({
            currentOption: option
        }, () => {
            this.removeEventListener()
        })
    }

    addEventListener = () => {
        document.addEventListener('click', this.toggle);
    }

    removeEventListener = () => {
        document.removeEventListener('click', this.toggle);
    }

    render() {
        let { show, currentOption, size } = this.state
        const { data = tmpData } = this.props
        const len = data.length > 5 ? 5 : data.length

        return (
            <div className={style.container} onClick={this.toggle} >
                <div
                    className={`${style.contentContainer} ${show ? style.labeContainer : ''} ${style[size + 'Size']}`}
                >
                    <span>{currentOption.label}</span>
                </div>
                {
                    show ? <ul style={{ height: '32' * len + 'px' }} >
                        {
                            data.map((val, inx) =>
                                <li key={inx} onClick={() => this.changeOption(val)}>
                                    {val.label}
                                    {val.special ? <Tag color="blue">省</Tag> : ''}
                                </li>
                            )
                        }
                    </ul> : ''
                }
            </div>
        )
    }
}

export default Select