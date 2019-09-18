import React, { Component } from 'react';
import style from './style.scss';
import DateTime from 'react-datetime';

class DatePicker extends Component {
    constructor(props) {
        super(props);
        this.id = String(new Date().getTime()) + parseInt(Math.random() * 10000);
    }

    state = {
        viewMode: 'days'
    };

    onClick = e => {
        if (this.props.onChange) {
            this.props.onChange('');
        }
    };

    onViewModeChange = type => {
        this.setState(
            {
                viewMode: type
            },
            () => {
                const dom = document.querySelector(`#id_${this.id} .rdtPicker table button`);

                if (!dom) {
                    this.appendClearButton();
                }
            }
        );
    };

    appendClearButton = () => {
        let dom = document.querySelector(`#id_${this.id} .rdtPicker table tfoot`);

        if (!dom) {
            dom = document.querySelector(`#id_${this.id} .rdtPicker table tbody`);
        }
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        const button = document.createElement('button');

        button.innerText = '清空';
        button.onclick = this.onClick;
        tr.className = style.tr;
        td.appendChild(button);
        td.setAttribute('colspan', '7');
        tr.appendChild(td);
        dom.appendChild(tr);
    };

    componentDidMount() {
        this.appendClearButton();
    }

    render() {
        const { className, style: propsStyle } = this.props;
        const { viewMode } = this.state;

        return (
            <div
                className={style.container + (className ? ' ' + className : '')}
                style={propsStyle || {}}
                id={'id_' + this.id}
            >
                <DateTime
                    inputProps={{ readOnly: true }}
                    viewMode={viewMode}
                    closeOnSelect={true}
                    onViewModeChange={this.onViewModeChange}
                    {...this.props}
                    ref="date"
                />
            </div>
        );
    }
}

export default DatePicker;
