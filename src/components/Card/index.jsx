import React, { Component } from 'react';
import style from './style.scss';

export default class Card extends Component {
    constructor() {
        super();
    }

    open = e => {
        if (this.props.handleOpen) {
            this.props.handleOpen(this.props);
        }
    };

    close = e => {
        if (this.props.handleClose) {
            this.props.handleClose(this.props);
        }
    };

    render() {
        return (
            <div className={style.container} style={this.props.margin ? { padding: 0 } : {}}>
                <div className={style.head} style={this.props.margin ? { marginTop: '0.6rem' } : {}}>
                    <div className={style.title}>
                        <i className={style.line} />
                        {this.props.title}
                    </div>
                    <div className={style.subTitle}>{this.props.subTitle}</div>
                    {this.props.tool ?
                        this.props.open ?
                            <div className={style.tool}>
                                <img src={require('./images/close.png')} onClick={this.close} />
                            </div> :
                            <div className={style.tool}>
                                <img src={require('./images/open.png')} onClick={this.open} />
                            </div> :
                        ''
                    }
                </div>
                <div
                    className={style.content}
                    style={this.props.margin ? { marginBottom: '0.6rem', paddingBottom: '0' } : {}}
                >
                    {this.props.children}
                </div>
                <div className={style.footer}>{this.props.footer}</div>
            </div>
        );
    }
}
