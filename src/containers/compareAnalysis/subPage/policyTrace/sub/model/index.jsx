import React, { Component } from "react"
import {Modal,Button} from 'antd';

class Model extends Component {

    constructor (props) {
        super(props);
    }

    handleCancel = () => {
        this.props.click()
    };

    render() {

        return (
            <Modal
                visible={this.props.show}
                onCancel={this.handleCancel}
                width={this.props.width}
                footer={null}
                style={{background:'#120F24'}}
            >
                {this.props.children}
            </Modal>
        )
    }
}

export default Model
