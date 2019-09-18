import React, { Component } from 'react';
import styles from './style.scss';
import './index.css'
import service from 'service/PolicyGraph'
import Img_1 from './imgs/level_1.png'
import Img_2 from './imgs/level_2.png'
import Img_3 from './imgs/level_3.png'
import _ from 'lodash'
import { Tag } from 'antd'
const d4 = require('./d3.min.js') // d3.js 版本和 package.json 冲突，单独引入

const svgWidth = window.innerWidth - 180,  // svg初始高宽
    svgHeight = window.innerHeight - 170

// 简易版政策级别判断
const parseImage = str => {
    if (str.includes('市')) return Img_1
    if (str.includes('省')) return Img_2
    return Img_3
}

const sliceStr = (str, num) => {
    return str.length > num ? str.slice(0, num) + '...' : str
}

const parseD = data => {
    return data.map(val => {
        return { id: val.policyUniqueId, bbdId: val.bbdXgxxId, name: val.title, image: parseImage(val.title) }
    })
}

class PolicyGraph extends Component {
    constructor(props) {
        super(props)
        this.state = {
            nodesPool: [],  // 节点池
            P2C: [],        // 上级对下级
            C2P: [],        // 下级对上级
            currentNodes: [], // 节点
            currentLinks: [],  // 边
        }
    }

    componentWillMount() {
        if (this.props.location.state) {
            const { id } = this.props.location.state
            // const test = 'cc2940c495e7309d118b1cbd28c5246d'

            service.init(id).then(d => {
                this.setState({
                    nodesPool: [d.policyUniqueId],
                    currentNodes: [{
                        id: d.policyUniqueId, bbdId: d.bbdXgxxId,
                        name: d.title, image: parseImage(d.title)
                    }]
                })
            })
            return
        }
        this.props.history.goBack()
    }

    componentDidUpdate(p, d) {
        if (!_.isEqual(this.state, d)) {
            this.initGraph()
        }
    }

    componentDidMount() {
        this.initGraph()
    }

    updateNodes = ids => {
        this.getParentNodes(ids)
        this.getChildrenNodes(ids)
    }

    getParentNodes = (ids) => {
        service.getParent(ids).then(d => {
            console.log('Get Parent: ', d)
            if (!_.isEmpty(d)) {
                this.calcNodes(ids[0], parseD(d), false)
            }
        })
    }

    getChildrenNodes = (ids) => {
        service.getChildren(ids).then(d => {
            console.log('Get Children: ', d)
            if (!_.isEmpty(d)) {
                this.calcNodes(ids[0], parseD(d), true)
            }
        })
    }

    changeModal = (flag = false, name = '', position = [0, 0]) => {
        this.setState({
            showModal: flag, fileName: name, position
        })
    }

    // 节点去重
    calcNodes = (id, nodes, flag) => {
        const { nodesPool, P2C, C2P, currentNodes, currentLinks } = this.state

        const newNodes = nodes.filter(val => !nodesPool.includes(val.id))
        let newP2C = [], newC2P = [], newLinks = [];

        if (flag) {
            newP2C = nodes.map(val => id + '**' + val.id).filter(val => !P2C.includes(val))
            newLinks = newP2C.map(val => {
                let v = val.split('**')

                return { source: v[0], target: v[1] }
            })
        } else {
            newC2P = nodes.map(val => id + '**' + val.id).filter(val => !C2P.includes(val))
            newLinks = newC2P.map(val => {
                let v = val.split('**')

                return { source: v[0], target: v[1] }
            })
        }

        this.setState({
            nodesPool: nodesPool.concat(newNodes.map(val => val.id)),
            P2C: P2C.concat(newP2C),
            C2P: C2P.concat(newC2P),
            currentNodes: currentNodes.concat(newNodes),
            currentLinks: currentLinks.concat(newLinks)
        })
    }

    initGraph() {
        const { currentNodes, currentLinks } = this.state
        const tmpData = { nodes: currentNodes, links: currentLinks }

        const svg = d4.select(this.refs.d3Target),
            imgWidth = 63,
            imgHeight = 63;

        svg.selectAll('*').remove();

        // svg.call(d4.zoom()
        d4.select(this.refs.theCanvas)
            .call(d4.zoom()
                .scaleExtent([1 / 4, 16])
                .on('zoom', zoomed));

        function zoomed() {
            g.attr('transform', d4.event.transform);
        }

        const simulation = d4.forceSimulation()
            .force('link', d4.forceLink().id(function (d) {
                return d.id;
            }).distance(180))
            .force('charge', d4.forceManyBody())
            .force('center', d4.forceCenter(svgWidth / 2, svgHeight / 2))
            .force('collide', d4.forceCollide(80))

        let g = svg.append('g');

        const svgDefs = svg.append('defs'); // 定义渐变色
        const mainGradient = svgDefs
            .append('linearGradient')
            .attr('id', 'mainGradient');

        mainGradient.append('stop')
            .attr('class', 'stop-left')
            .attr('offset', '0');
        mainGradient.append('stop')
            .attr('class', 'stop-right')
            .attr('offset', '1');

        const graph = JSON.parse(JSON.stringify(tmpData))

        // 悬浮提示文本容器
        let div = svg.append('div')
            .attr('class', 'tooltip')
            .style('opacity', 0);

        // 边
        const link = g
            .selectAll('line')
            .data(graph.links)
            .enter().append('line')
            .style('stroke', 'url(#mainGradient)')
            .style('stroke-width', 3);

        //边上的文字          
        const edgesText = g
            .selectAll('.linetext')
            .data(graph.links)
            .enter()
            .append('text')
            .attr('class', 'linetext')
            .text(function (d) {
                return d.relation;
            });

        // 图片
        const nodesImg = g
            .selectAll('.image')
            .data(graph.nodes)
            .enter()
            .append('image')
            .attr('width', imgWidth)
            .attr('height', imgHeight)
            .attr('xlink:href', function (d) {
                return d.image
            })
            .on('dblclick', (d, i) => {
                console.log('DDD: ', d)
                this.updateNodes([d.id, d.bbdId])
            })
            .call(d4.drag()
                .on('start', dragstarted)
                .on('drag', dragged)
                .on('end', dragended)
            );

        // 每个节点的说明文字
        const textDx = -60;
        const textDy = 17;

        const nodesText = g
            .selectAll('.nodetext')
            .data(graph.nodes)
            .enter()
            .append('text')
            .attr('class', 'nodetext')
            .attr('dx', function (d) {
                return -sliceStr(d.name, 13).length * 5
            })
            .attr('dy', textDy)
            .text(function (d) {
                return sliceStr(d.name, 13);
            })
            .on('mouseover', function (d) {
                this.innerHTML = d.name
            })
            .on('mouseout', function (d) {
                this.innerHTML = sliceStr(d.name, 13)
            });

        simulation
            .nodes(graph.nodes)
            .on('tick', ticked);

        simulation.force('link')
            .links(graph.links);

        function ticked() {
            link
                .attr('x1', function (d) {
                    return d.source.x;
                })
                .attr('y1', function (d) {
                    return d.source.y;
                })
                .attr('x2', function (d) {
                    return d.target.x;
                })
                .attr('y2', function (d) {
                    return d.target.y;
                });

            edgesText
                .attr('x', function (d) {
                    return (d.source.x + d.target.x) / 2;
                })
                .attr('y', function (d) {
                    return (d.source.y + d.target.y) / 2;
                });

            //更新结点图片和文字
            nodesImg
                .attr('x', function (d) {
                    return d.x - imgWidth / 2;
                })
                .attr('y', function (d) {
                    return d.y - imgHeight / 2;
                });

            nodesText
                .attr('x', function (d) {
                    return d.x
                })
                .attr('y', function (d) {
                    return d.y + imgWidth / 2;
                });
        }

        function dragstarted(d) {
            if (!d4.event.active) {
                simulation.alphaTarget(0.3).restart();
            }
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(d) {
            d.fx = d4.event.x;
            d.fy = d4.event.y;
        }

        function dragended(d) {
            if (!d4.event.active) {
                simulation.alphaTarget(0);
            }
            d.fx = null;
            d.fy = null;
        }

    }

    render() {
        return <div className={styles.container}>
            <svg width={svgWidth} height={svgHeight} ref="theCanvas">
                <g id="firstG" ref="d3Target" />
            </svg>
            <div className={styles.imgSample}>
                <div className={styles.imgItem}>
                    <img src={Img_1} alt="市级政策" />
                    <div>市级政策</div>
                </div>

                <div className={styles.imgItem}>
                    <img src={Img_2} alt="省级政策" />
                    <div>省级政策</div>
                </div>

                <div className={styles.imgItem}>
                    <img src={Img_3} alt="中央政策" />
                    <div>中央政策</div>
                </div>
            </div>
        </div>;
    }
}
export default PolicyGraph;
