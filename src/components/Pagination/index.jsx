// 上帝保佑,永无bug

import React, { Component } from 'react';
import style from './style.scss';

export default class Pagination extends Component {
    constructor(props) {
        super(props);
        this.state = {
            current: props.current ? props.current : props.start
        };
        this.balance = props.start === 0 ? 1 : 0;
        this.start = props.start ? props.start : 0;
    }

    componentDidUpdate(prevProps, prevState) {
        if (
            (this.props.current || this.props.current === 0) &&
            (prevProps.current || prevProps.current === 0) &&
            prevProps.current !== this.props.current
        ) {
            var state = { ...this.state };

            state.current = this.props.current;
            this.setState(state);
        }
        if (prevState.current !== this.state.current && this.change) {
            if (this.props.onChange) {
                this.props.onChange(this.state.current, this.props.size ? this.props.size : 10);
            }
            this.change = false;
        }
        if (!this.props.start) {
            this.start = 0;
        } else {
            this.start = this.props.start;
        }
    }

    toPage = e => {
        this.change = true;
        var state = { ...this.state };

        state.current = parseInt(e.target.getAttribute('value'));
        this.setState(state);
    };

    openPrev = () => {
        this.change = true;
        var state = { ...this.state };

        state.current = state.current - 5 >= this.start ? state.current - 5 : this.start;
        this.setState(state);
    };

    openNext = () => {
        this.change = true;
        var page = Math.ceil(this.props.total / (this.props.size ? this.props.size : 10));
        var state = { ...this.state };

        state.current = state.current + 5 <= page ? state.current + 5 : page;
        this.setState(state);
    };

    initPage = () => {
        var page = Math.ceil(this.props.total / (this.props.size ? this.props.size : 10));
        var pages = [];

        if (page > 9) {
            if (page - this.state.current - this.balance > 3 && this.state.current + this.balance - 1 < 3) {
                for (let i = this.start; i <= 5 - this.balance; i++) {
                    pages.push(
                        <li
                            key={i}
                            value={i}
                            className={this.state.current === i ? 'active' : ''}
                            onClick={this.toPage}
                        >
                            <span value={i}>{i + this.balance}</span>
                        </li>
                    );
                }
                pages.push(
                    <li key={Math.random(5)} title="open" onClick={this.openNext}>
                        {'･･･'}
                    </li>
                );
                pages.push(
                    <li key={Math.random(5)} value={page - this.balance} onClick={this.toPage}>
                        <span value={page - this.balance}>{page}</span>
                    </li>
                );
            } else if (page - this.state.current - this.balance > 3 && this.state.current + this.balance - 1 === 3) {
                for (let i = this.start; i <= 6 - this.balance; i++) {
                    pages.push(
                        <li
                            key={i}
                            value={i}
                            className={this.state.current === i ? 'active' : ''}
                            onClick={this.toPage}
                        >
                            <span value={i}>{i + this.balance}</span>
                        </li>
                    );
                }
                pages.push(
                    <li key={Math.random(5)} title="open" onClick={this.openNext}>
                        {'･･･'}
                    </li>
                );
                pages.push(
                    <li key={Math.random(5)} value={page - this.balance} onClick={this.toPage}>
                        <span value={page - this.balance}>{page}</span>
                    </li>
                );
            } else if (page - this.state.current - this.balance > 3 && this.state.current + this.balance - 1 > 3) {
                pages.push(
                    <li
                        key={Math.random(5)}
                        value={this.start}
                        className={this.state.current - this.balance === this.start ? 'active' : ''}
                        onClick={this.toPage}
                    >
                        <span value={this.start}>{this.start + this.balance}</span>
                    </li>
                );
                pages.push(
                    <li key={Math.random(5)} title="open" onClick={this.openPrev}>
                        {'･･･'}
                    </li>
                );
                for (let i = this.state.current - 2; i <= this.state.current + 2; i++) {
                    pages.push(
                        <li
                            key={i}
                            value={i}
                            className={this.state.current === i ? 'active' : ''}
                            onClick={this.toPage}
                        >
                            <span value={i}>{i + this.balance}</span>
                        </li>
                    );
                }
                pages.push(
                    <li key={Math.random(5)} title="open" onClick={this.openNext}>
                        {'･･･'}
                    </li>
                );
                pages.push(
                    <li key={Math.random(5)} value={page - this.balance} onClick={this.toPage}>
                        <span value={page - this.balance}>{page}</span>
                    </li>
                );
            } else if (page - this.state.current - this.balance < 3 && this.state.current + this.balance - 1 > 3) {
                pages.push(
                    <li
                        key={Math.random(5)}
                        value={this.start}
                        className={this.state.current - this.balance === this.start ? 'active' : ''}
                        onClick={this.toPage}
                    >
                        <span value={this.start}>{this.start + this.balance}</span>
                    </li>
                );
                pages.push(
                    <li key={Math.random(5)} title="open" onClick={this.openPrev}>
                        {'･･･'}
                    </li>
                );
                for (let i = page - 4 - this.balance; i <= page - this.balance; i++) {
                    pages.push(
                        <li
                            key={i}
                            value={i}
                            className={this.state.current === i ? 'active' : ''}
                            onClick={this.toPage}
                        >
                            <span value={i}>{i + this.balance}</span>
                        </li>
                    );
                }
            } else if (page - this.state.current - this.balance === 3 && this.state.current - this.balance - 1 > 3) {
                pages.push(
                    <li
                        key={Math.random(5)}
                        value={this.start}
                        className={this.state.current - this.balance === this.start ? 'active' : ''}
                        onClick={this.toPage}
                    >
                        <span value={this.start}>{this.start + this.balance}</span>
                    </li>
                );
                pages.push(
                    <li key={Math.random(5)} title="open" onClick={this.openPrev}>
                        {'･･･'}
                    </li>
                );
                for (let i = this.state.current - 2; i <= page - this.balance; i++) {
                    pages.push(
                        <li
                            key={i}
                            value={i}
                            className={this.state.current === i ? 'active' : ''}
                            onClick={this.toPage}
                        >
                            <span value={i}>{i + this.balance}</span>
                        </li>
                    );
                }
            }

            return pages;
        }
        for (let i = this.start; i <= page - this.balance; i++) {
            pages.push(
                <li key={i} value={i} className={this.state.current === i ? 'active' : ''} onClick={this.toPage}>
                    <span value={i}>{i + this.balance}</span>
                </li>
            );
        }
        return pages;
    };

    prev = () => {
        this.change = true;
        var page = Math.ceil(this.props.total / (this.props.size ? this.props.size : 10));
        var state = { ...this.state };

        if (--state.current < this.start) {
            return;
        }
        this.setState(state);
    };

    next = () => {
        this.change = true;
        var page = Math.ceil(this.props.total / (this.props.size ? this.props.size : 10));
        var state = { ...this.state };

        if (++state.current + this.balance > page) {
            return;
        }
        this.setState(state);
    };

    first = () => {
        this.change = true;
        var state = { ...this.state };

        state.current = this.start;
        this.setState(state);
    };

    last = () => {
        this.change = true;
        var state = { ...this.state };

        state.current = Math.ceil(this.props.total / (this.props.size ? this.props.size : 10)) - this.balance;
        this.setState(state);
    };

    render() {
        const { blueTheme = false } = this.props

        return (
            <ul className={`${style.container} ${blueTheme ? style.blueTheme : ''}`} style={this.props.style ? this.props.style : {}}>
                <li onClick={this.first} title="first">
                    <span>第一页</span>
                </li>
                <li onClick={this.prev} title="prev">
                    <span>上一页</span>
                </li>
                {this.initPage()}
                <li onClick={this.next} title="next">
                    <span>下一页</span>
                </li>
                <li onClick={this.last} title="last">
                    <span>最后一页</span>
                </li>
            </ul>
        );
    }
}
