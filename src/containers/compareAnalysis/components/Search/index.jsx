import React, { Component } from 'react'
import style from './style.scss'

class Search extends Component{
    constructor(props){
        super(props)
        this.state = {
            inputValue: this.props.value || '',
            placeholder: this.props.placeholder || '请输入检索内容'
        }
    }

    handleEnter = e => {
        if( e.key === 'Enter' ){
            this.handleSearch()
        }
    }

    handleChange = e => {
        const { change, name } = this.props

        if (change) {
            let o = {}

            o[name] = e.target.value
            change(o, name)
        }
        this.setState({
            inputValue: e.target.value
        })
    }

    handleSearch = () => {
        const { search } = this.props

        if(search){
            search()
        }
        console.log('Click Search: ', this.state.inputValue)
    }

    render() {
        const { inputValue, placeholder } = this.state

        return (
            <div className={style.container}>
                <div className={style.contentContainer}>
                    <input
                        placeholder={placeholder}
                        type="text" value={inputValue}
                        onChange={this.handleChange}
                        onKeyPress={this.handleEnter}
                    />
                    <img onClick={this.handleSearch} src={require('../../image/search.png')} alt="Search" width='22px'/>
                </div>
            </div>
        )
    }
}

export default Search