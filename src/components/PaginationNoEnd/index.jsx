// 上帝保佑,永无bug

import React, { Component } from "react"
import style from './style.scss'

export default class Pagination extends Component {

    static propTypes = {
        total: React.PropTypes.number.isRequired
    }

    constructor(props) {
        super(props);
        this.start = props.start === 0 ? 0 : (props.start ? props.start : 0);
        this.state = {
            current: props.current ? props.current : this.start
        };
        this.balance = this.start === 0 ? 1 : 0;
    }

    onKeyPress = (e) => {
        if (!e.target.value && e.target.value !== 0) {
            return;
        }
        if (e.charCode === 13) {
            this.toPage(parseInt(e.target.value) - this.balance);
        }
    }

    goto = () => {
        var page = this.refs.topage.value;
        if (page) {
            this.toPage(parseInt(page) - this.balance);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if ((this.props.current || this.props.current === 0) && (prevProps.current || prevProps.current === 0) && prevProps.current != this.props.current) {
            var state = { ...this.state };
            state.current = this.props.current;
            this.setState(state);
        }
        if (prevState.current != this.state.current && this.change) {
            if (this.props.onChange) {
                this.props.onChange(this.state.current, this.props.size ? this.props.size : 10);
            }
            this.change = false;
        }
    }

    toPage = (e) => {
        var page = 0;
        var pages = Math.ceil(this.props.total / (this.props.size ? this.props.size : 10));
        if (e.target) {
            page = e.target.getAttribute('value');
        } else {
            if (e || e === 0) {
                if (parseInt(e) >= 0 && parseInt(e) <= pages) {
                    page = e;
                } else {
                    return;
                }
            } else {
                return;
            }
        }
        this.change = true;
        var state = { ...this.state };
        state.current = parseInt(page);
        this.setState(state);
    }

    openPrev = () => {
        this.change = true;
        var state = { ...this.state };
        state.current = state.current - 5 >= this.props.start ? state.current - 5 : this.props.start;
        this.setState(state);
    }

    openNext = () => {
        this.change = true;
        var page = Math.ceil(this.props.total / (this.props.size ? this.props.size : 10));
        var state = { ...this.state };
        state.current = state.current + 5 <= page ? state.current + 5 : page;
        this.setState(state);
    }

    initPage = () => {
        var page = Math.ceil(this.props.total / (this.props.size ? this.props.size : 10));
        var pages = [];
        if (page > 4) {
            if (this.state.current - this.start <= 2) {
                for (let i = this.start; i <= 3 - this.balance; i++) {
                    pages.push(
                        <li key={Math.random()} value={i} className={this.state.current === i ? 'active' : ''} onClick={this.toPage}>
                            <span value={i}>{i + this.balance}</span>
                        </li>
                    );
                }

                pages.push(
                    <li key={Math.random()} title="open">
                        <span>{'...'}</span>
                    </li>
                );

                if (page - this.state.current - this.balance > 50) {
                    pages.push(
                        <li key={Math.random()} value={this.state.current + 50} onClick={this.toPage}>
                            <span value={this.state.current + 50}>{this.state.current + this.balance + 50}</span>
                        </li>
                    );
                } else {
                    pages.push(
                        <li key={Math.random()} value={page - this.balance} onClick={this.toPage}>
                            <span value={page - this.balance}>{page}</span>
                        </li>
                    );
                }
            } else if (page - this.balance - this.state.current <= 2) {
                pages.push(
                    <li key={Math.random()} value={this.start} onClick={this.toPage}>
                        <span value={this.start}>{1}</span>
                    </li>
                );

                pages.push(
                    <li key={Math.random()} title="open">
                        <span>{'...'}</span>
                    </li>
                );

                for (let i = page - this.balance - 2; i <= page - this.balance; i++) {
                    pages.push(
                        <li key={Math.random()} value={i} className={this.state.current === i ? 'active' : ''} onClick={this.toPage}>
                            <span value={i}>{i + this.balance}</span>
                        </li>
                    );
                }
            } else {
                if (this.state.current + this.balance > 50) {
                    pages.push(
                        <li key={Math.random()} value={this.state.current - 49} onClick={this.toPage}>
                            <span value={this.state.current - 49}>{this.state.current + this.balance - 49}</span>
                        </li>
                    );
                } else {
                    pages.push(
                        <li key={Math.random()} value={this.start} onClick={this.toPage}>
                            <span value={this.start}>{1}</span>
                        </li>
                    );
                }

                pages.push(
                    <li key={Math.random()} title="open">
                        <span>{'...'}</span>
                    </li>
                );

                pages.push(
                    <li key={Math.random()} value={this.state.current} className={'active'} onClick={this.toPage}>
                        <span value={this.state.current}>{this.state.current + this.balance}</span>
                    </li>
                );

                pages.push(
                    <li key={Math.random()} title="open">
                        <span>{'...'}</span>
                    </li>
                );

                if (page - (this.state.current + this.balance) >= 50) {
                    pages.push(
                        <li key={Math.random()} value={this.state.current + 50} onClick={this.toPage}>
                            <span value={this.state.current + 50}>{this.state.current + this.balance + 50}</span>
                        </li>
                    );
                } else {
                    pages.push(
                        <li key={Math.random()} value={page - this.balance} onClick={this.toPage}>
                            <span value={page - this.balance}>{page}</span>
                        </li>
                    );
                }
            }

            return pages;
        }
        for (let i = this.props.start; i <= page - this.balance; i++) {
            pages.push(
                <li key={i} value={i} className={this.state.current === i ? 'active' : ''} onClick={this.toPage}>
                    <span value={i}>{i + this.balance}</span>
                </li>
            );
        }
        return pages;
    }

    prev = () => {
        this.change = true;
        var page = Math.ceil(this.props.total / (this.props.size ? this.props.size : 10));
        var state = { ...this.state };
        if (--state.current < this.start) {
            return;
        }
        this.setState(state);
    }

    next = () => {
        this.change = true;
        var page = Math.ceil(this.props.total / (this.props.size ? this.props.size : 10));
        var state = { ...this.state };
        if (++state.current + this.balance > page) {
            return;
        }
        this.setState(state);
    }

    first = () => {
        this.change = true;
        var state = { ...this.state };
        state.current = this.props.start;
        this.setState(state);
    }

    last = () => {
        this.change = true;
        var state = { ...this.state };
        state.current = Math.ceil(this.props.total / (this.props.size ? this.props.size : 10)) - this.balance;
        this.setState(state);
    }

    render() {
        return (
            <ul className={style.container} style={this.props.style ? this.props.style : {}}>
                <li onClick={this.prev} title="prev">
                    <img src={require('./images/prev.png')} />
                </li>
                {this.initPage()}
                <li onClick={this.next} title="next">
                    <img src={require('./images/next.png')} />
                </li>
                {
                    this.props.showQuickJump ? <div className={style.input}>
                        <label>跳转</label>
                        <div>
                            <input type="text" onKeyPress={this.onKeyPress} ref="topage" />
                            <span>页</span>
                        </div>
                    </div> : ''
                }
                {
                    this.props.showQuickJump ? <li title="to" onClick={this.goto}>
                        <img src={require('./images/to.png')} />
                    </li> : ''
                }
            </ul>
        )
    }
}
