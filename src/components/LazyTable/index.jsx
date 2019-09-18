import React, {Component} from 'react';
import style from './style.scss';
import PropTypes from 'prop-types';
import {deepCopy} from 'utils';

const propTypes = {
    columns: PropTypes.array.isRequired,
    dataSource: PropTypes.array.isRequired,
    // onChange: PropTypes.func,
    loading: PropTypes.bool
};

const defaultProps = {
    columns: [],
    dataSource: []
};

class LazyTable extends Component{

    state = {
        openKey: '',
        columns: [],
        dataSource: [],
        content: '',
        selected: {},
        selector: ''
    }

    setContent = (key, content) => {
        this.setState({
            openKey: this.state.openKey === key ? '' : key,
            content: this.state.openKey === key ? '' : content
        });
    }

    selector = (key) => {
        this.setState({
            selector: this.state.selector === key ? '' : key
        });
    }

    selected = (key, value, field, e) => {
        let {selected} = this.state;
        if(selected.select === value && selected.key === key && selected.field === field)
        {
            if(this.props.onSelected)
            {
                this.props.onSelected(false);
            }
            return;
        }
        selected.select = value;
        selected.key = key;
        selected.field = field;
        this.setState({
            selected: selected
        },() => {
            if(this.props.onSelected)
            {
                this.props.onSelected({
                    [field]: value
                });
            }
        });
    }

    clearSelector = () => {
        this.setState({
            selector: '',
            selected: {}
        });
    }

    onScroll = (e) => {
        var target = e.target;
        if(target.scrollHeight - (target.scrollTop + target.clientHeight) === 0)
        {
            var state = {...this.state};
            var more = this.props.dataSource.slice(this.state.dataSource.length,this.state.dataSource.length + this.props.lazyNum);
            state.dataSource = state.dataSource.concat(more);
            this.setState({
                loading: true
            });
            this.timeouter = setTimeout(() => {
                state.loading = false;
                this.setState(state);
            }, 1000);

        }
    }

    componentDidMount () {
        var data = deepCopy(this.props.dataSource);
        if(this.props.lazyNum && this.props.lazyNum < data.length)
        {
            data.length = this.props.lazyNum;
        }
        this.setState({
            dataSource: data
        });
        if(!this.props.lazyNum)
        {
            return;
        }
        this.refs.scroll.addEventListener('scroll',this.onScroll);
    }

    componentDidUpdate (prevProps, prevState) {
        if(JSON.stringify(this.props.dataSource) != JSON.stringify(prevProps.dataSource))
        {
            var data = deepCopy(this.props.dataSource);
            if(this.props.lazyNum && this.props.lazyNum < data.length)
            {
                data.length = this.props.lazyNum;
            }
            this.setContent();
            this.setState({
                dataSource: data
            });
        }
    }

    componentWillUnmount () {
        if(this.timeouter)
        {
            clearTimeout(this.timeouter);
        }
    }

    render(){

        let {openKey, content, selected, selector, dataSource, loading: lazyLoading} = this.state;
        let {columns, className, loading, lazyNum, dataSource: propsSource} = this.props;

        return (
            <div className={style.containers + (className ? (' ' + className) : '')} ref='container' style={this.props.style ? this.props.style : {}}>
                <div className={style.scroll} ref='scroll'>
                    {
                        loading && (
                            <div className={style.loading}>
                                <img src={require('./images/loading.svg')}/>
                            </div>
                        )
                    }
                    <table style={!loading && dataSource.length === 0 ? {height: '100%'} : {}}>
                        <thead>
                            <tr>
                                {
                                    columns.map((item, index) => {
                                        if(item.selector && item.selector instanceof Array)
                                        {
                                            return (
                                                <th key={index} onClickCapture={this.selector.bind(this,index)}>
                                                    <span>{item.label}</span>
                                                    <i className={'iconfont ' + (selected.key === index ? 'icon-less' : 'icon-moreunfold')}></i>
                                                    {
                                                        selector === index && (
                                                            <ul className={style.selector}>
                                                                {
                                                                    item.selector.map((d, i) => {
                                                                        return (
                                                                            <li onClickCapture={this.selected.bind(this,index,d,item.key)} className={(selected.select === d && selected.key === index) && style.active} key={i}>{d}</li>
                                                                        );
                                                                    })
                                                                }
                                                            </ul>
                                                        )
                                                    }
                                                </th>
                                            );
                                        }
                                        return (
                                            <th key={index}>{item.label}</th>
                                        );
                                    })
                                }
                            </tr>
                        </thead>
                        {
                            dataSource.map((item, index) => {
                                return (
                                    <tbody className={index === openKey && style.detail || ''} key={index}>
                                        <tr>
                                            {
                                                columns.map((d, i) => {

                                                    let text = item[d.key];

                                                    if(d.index)
                                                    {
                                                        let number = index + 1;
                                                        return (
                                                            <td style={{textAlign: d.align ? d.align : 'center'}} key={i}>
                                                                {number}
                                                            </td>
                                                        )
                                                    }

                                                    if(d.filter)
                                                    {
                                                        text = d.filter(d.key ? item[d.key] : item,index,openKey,this.setContent.bind(this,index),item) || '';
                                                    }

                                                    if(d.limit)
                                                    {
                                                        text = text.length > d.limit ? text.substr(0,d.limit) + '...' : text;
                                                    }

                                                    if(d.template)
                                                    {
                                                        text = React.cloneElement(d.template,{data: item});
                                                    }

                                                    return (
                                                        <td key={i} style={{whiteSpace: d.noWrap ? 'nowrap' : '', textAlign: d.align ? d.align : 'center'}}>
                                                            {text}
                                                        </td>
                                                    );
                                                })
                                            }
                                        </tr>
                                        {
                                            index === openKey && (
                                                <tr style={{height: 'auto'}}>
                                                    <td colSpan={columns.length}>
                                                        {
                                                            content
                                                        }
                                                    </td>
                                                </tr>
                                            )
                                        }
                                    </tbody>
                                );
                            })
                        }
                        {
                            lazyNum && !loading && dataSource.length != 0 && dataSource.length != propsSource.length && (
                                <tbody>
                                    <tr style={{lineHeight: '50px'}}>
                                        <td colSpan={columns.length} style={{textAlign: 'center', fontSize: '14px'}}>{lazyLoading ? '加载中...' : '上拉加载'}</td>
                                    </tr>
                                </tbody>
                            )
                        }
                        {
                            !loading && dataSource.length === 0 && (
                                <tbody className='noData'>
                                    <tr>
                                        <td colSpan={columns.length} style={{textAlign: 'center', fontSize: '14px'}}>暂无数据</td>
                                    </tr>
                                </tbody>
                            )
                        }
                    </table>
                </div>
            </div>
        )
    }
}

LazyTable.propTypes = propTypes;
LazyTable.defaultProps = defaultProps;

export default LazyTable;
