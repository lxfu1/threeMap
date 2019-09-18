import React, { Component } from 'react'
import style from './style.scss'

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

    componentWillReceiveProps(props) {
        if (props.data !== this.props.data) {
            this.changeOption(props.data[0])
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
        const { change } = this.props

        if (change) {
            change(option)
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
        const { show, currentOption, size } = this.state
        const { data = tmpData } = this.props
        const len = data.length > 5 ? 5 : data.length

        return (
            <div className={style.container} onClick={this.toggle}>
                <div
                    className={`${style.contentContainer} ${show ? style.labeContainer : ''} ${style[size + 'Size']}`}
                >
                    <span>{currentOption.label}</span>
                </div>
                {
                    show ? <ul style={{ height: '30' * len + 'px' }}>
                        {
                            data.map((val, inx) =>
                                <li key={inx} onClick={() => this.changeOption(val)}>{val.label}</li>
                            )
                        }
                    </ul> : ''
                }
            </div>
        )
    }
}

export default Select