/*
 *author: 姚伟
 * date: 18/8/8
 * describe: 政策溯源
 */
import React, { Component } from 'react';
import {message} from 'antd';
import {Drag, guid} from 'utils';
import Model from '../model';
import resource from 'resource';
import Items from '../items';
import d3 from 'd3';
import styles from './style.scss';

const Width = 440;
const Height = 205;
const R = 16; // 箭头半径
const Horizontal = Width + 150; // 容器宽度
const Vertical = Height + 60; // 垂直高度

class PolicyTrace extends Component {
    state = {
        showScan: false,
        showCompare: false,
        showTips: false,
        scanData: '',
        controlId: '',
        status: [],
        data: [Object.assign(JSON.parse(sessionStorage.getItem('policyDetail')), {column: 0, row: 0,type: 1})]
    }

    componentDidMount(){
        Drag(document.querySelector('#drag'));
        this.svg = d3.select('#svg');
        this.getAllStatus();
    }

    // 判断是否添加到对比
    getAllStatus = () => {
        resource.get('/govacademy-server/policy/mineCart?page=1&size=100').then(res => {
            if(res.code === 200){
                this.setState({
                    status: res.data.list
                })
            }
        })
    }

    getData = (id) => {
        return new Promise((resolve, reject)=>{
            resource.get('/govacademy-server/policy/trace/'+id).then(res => {
                if(res.code === 200){
                    resolve(res.data);
                }else{
                    reject('请求出现错误');
                }
            })
        })
    }

    ClickItems = (id, type, title) => {
        let {data} = this.state;

        if (type === '折叠') {
            let index = data.findIndex(item => item.policyUniqueId === id);

            if(!data[index].spread){
                data[index].spread = true;
                let _data,
                    findColumn,
                    rowNumber;

                _data = data.find(item => item.policyUniqueId === id);
                findColumn = data.filter(item => item.column === _data.column + 1);
                rowNumber = findColumn ? findColumn.length : 0;

                _data.target = [];
                // 模拟数据请求
                this.getData(id).then(res => {
                    if(!res.length){
                        // 创建随机ID
                        res = [
                            {
                                "type": 2,
                                "id": 'random' + guid(),
                                "policyUniqueId": 'policy' + guid(),
                                "title": "没有更多上级政策了"
                            }
                        ]
                    }

                    res.map((item, _i) => {
                        item.column = _data.column + 1;
                        item.row = rowNumber + _i;
                        _data.target.push(item.policyUniqueId);
                    })
                    data = data.concat(res);
                    data.splice(index, 1, _data);

                    this.setState({data},()=>{
                        let max,
                            svgWidth,
                            svgHeight,
                            eleSvg,
                            eleBox,
                            currentHeight,
                            currentWidth;

                        max = this.getSvgHeight();
                        svgWidth = max.maxColumn * Horizontal;
                        svgHeight = max.maxRow * Vertical + 50;
                        eleSvg = document.querySelector('#svg');
                        eleBox = document.querySelector('#item_box');
                        currentWidth = eleSvg.clientWidth;
                        currentHeight = eleSvg.clientHeight;

                        eleSvg.style.width = Math.max(svgWidth, currentWidth) + 'px';
                        eleSvg.style.height = Math.max(svgHeight, currentHeight) + 'px';
                        eleBox.style.width = Math.max(svgWidth, currentWidth) + 'px';
                        eleBox.style.height = Math.max(svgHeight, currentHeight) + 'px';
                        this.drawLine(id);
                    })
                });
            }else{
                // 递归删除对应节点
                data[index].spread = false;
                this.deleteItems(id, data);
                this.setState(data);
            }
        }else if(type === '对比'){
            this.setState({
                showCompare: true,
                title: title,
                controlId: id
            })
        }else{
            // 预览
            this.setState({
                showScan: true,
                title: title,
                controlId: id
            })
            this.getDetails(title);
        }
    }

    getDetails = title => {
        resource.get(`/govacademy-server/policy/detail?title=${title}`).then(res => {
            if(res.code === 200){
                this.setState({
                    scanData: res.data.text
                })
            }
        });
    }

    clickModal = () =>{
        this.setState({
            showScan: false,
            showCompare: false,
            showTips: false
        })
    }

    clickSure = (flag) => {
        let {controlId, data} = this.state,
            bbdXgxxId;

        bbdXgxxId = data.find(item => item.policyUniqueId === controlId).bbdXgxxId;
        resource.post(`/govacademy-server/policy/cart/${bbdXgxxId}`).then(res => {
            if(res.code === 200){
                if(flag !== 'noRouter'){
                    this.props.history.push('/main/compare/similarity')
                }else{
                    this.getAllStatus();
                    this.setState({
                        showScan: false,
                        showTips: true
                    })
                }
            }else{
                message.warning(res.message)
            }
        });
    }

    // 递归删除节点
    deleteItems = (id, data) => {
        let _data,
            _index;

        _data = data.find(item => item.policyUniqueId === id);
        _index = data.findIndex(item => item.policyUniqueId === id);
        if(_data){
            _data = _data.target || [];
            for(let i = 0; i < _data.length; i++){
                let index = data.findIndex(item => item.policyUniqueId === _data[i]);
                let innerData = data.find(item => item.policyUniqueId === _data[i]);

                if(innerData && innerData.target){
                    this.deleteItems(innerData.policyUniqueId, data);
                }
                data.splice(index, 1);
                d3.select('.g_' + id).remove();
            }
            data[_index].target = [];
        }

    }

    // 绘制线条
    drawLine = (id) => {
        let {data} = this.state;

        let _data = data.find(item => item.policyUniqueId === id);
        let path,
            circle,
            gTime,
            startX,
            startY,
            endX,
            endY,
            target = _data.target || [];

        startX = _data.column * Horizontal + Width - 5; //减5表示right: 5px
        startY = _data.row * Vertical + Height / 2;
        gTime = this.svg.append('g').attr('class', 'g_'+id);
        for(let i = 0 ; i < target.length; i++){
            let currentData = data.find(item => item.policyUniqueId === target[i]);

            endX = currentData.column * Horizontal; //减5表示right: 5px
            endY = currentData.row * Vertical + Height / 2;
            gTime.append('path').attr(
                {
                    d: `M${startX} ${startY} L${(startX + endX) / 2} ${startY} L${(startX + endX) / 2} ${endY} L${endX} ${endY}`,
                    stroke: '#36caf6',
                    strokeWidth: 1,
                    fill: 'none'
                }
            );
            gTime.append('circle').attr(
                {
                    cx: endX,
                    cy: endY,
                    r: 5,
                    fill: '#36caf6'
                }
            );
        }
        gTime = null;
    }

    getSvgHeight = () => {
        let {data} = this.state;

        let maxColumn = 0,
            maxRow = 0,
            length;

        data.map(item => {
            if(item.column > maxColumn){
                maxColumn = item.column;
            }
        });

        for(let i = 0 ; i <= maxColumn; i++){
            length = data.filter(item => {
                return item.column === i;
            }).length;
            if(length > maxRow){
                maxRow = length;
            }
        }

        maxColumn++;

        return {maxRow, maxColumn};
    }

    render() {
        const {data, showScan, showCompare, showTips, status, controlId} = this.state;

        return (
            <div className={styles.container}>
                <button className={styles.back} onClick={()=>{window.history.back()}}>返回</button>
                <Model show= {showScan} click={this.clickModal} width={650}>
                    <div className={styles.contentBox}>
                        <h5 className={styles.title}>{this.state.title}</h5>
                        <div className={styles.content} dangerouslySetInnerHTML={{__html: this.state.scanData}}></div>
                        {
                            JSON.stringify(status).indexOf(controlId) === -1 ?
                                <button className={styles.addBtn} onClick={()=>{this.clickSure('noRouter')}}>+添加至对比</button> :
                                <button className={styles.addBtn}>已添加</button>
                        }
                    </div>
                </Model>
                <Model show={showCompare} click={this.clickModal} width={500}>
                    <div className={styles.contentCompare}>
                        <p className={styles.content}>
                            尊敬的客户，请确认是否将文件"{this.state.title}"添加至文本对比中， 点击“确认”前往文本对比界面
                        </p>
                        <div className={styles.btn}>
                            <button className={styles.cancelBtn} onClick={this.clickModal}>取消</button>
                            <button className={styles.sureBtn} onClick={this.clickSure}>确认</button>
                        </div>
                    </div>
                </Model>
                <Model show= {showTips} click={this.clickModal} width={400}>
                    <div className={styles.contentCompare}>
                        <p className={styles.title}>添加成功</p>
                        <div className={styles.btn}>
                            <button className={styles.sureBtn} onClick={this.clickModal}>确认</button>
                        </div>
                    </div>
                </Model>
                <div className={styles.dragbox}>
                    <div className={styles.drag} draggable="false" id="drag">
                        <div className={styles.inner}>
                            <svg className={styles.svg} id="svg"></svg>
                            <div className={styles.item_box} id="item_box">
                                <div className={styles.relative}>
                                    {
                                        data.map(item => {
                                            return <div className={styles.location}
                                                        key={item.policyUniqueId}
                                                        style={{left: item.column * Horizontal + 'px',top: item.row * Vertical + 'px'}}>
                                                <Items {...item} click={this.ClickItems} />
                                            </div>
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default PolicyTrace;
