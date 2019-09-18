/*
 * author: yzsexe
 * date: 18/8/16
 * describe: 右中echarts图
 */
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Box from 'components/Box';
import Title from 'components/Title';
import Table from 'components/MiniTable';
import resource from 'resource';
import styles from './style.scss';

@withRouter
class RBBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        }
        this.columns = [
            {
                label: '', key: 'title',
                align: 'left', style: { width: '50%' },
                limit: 11
            },
            {
                // label: '', key: 'source',
                label: '', key: 'province',
                align: 'left', style: { width: '30%' },
                limit: 10,
                filter: (val) => {
                    return `${val.replace(/省|市/, '')}发布`
                }
            },
            {
                label: '', key: 'time',
                align: 'left', style: { width: '20%' }
            }
        ];
    }

    render() {
        const { data } = this.props;

        return (
            <Box
                classNames={styles.container}
                config={{ height: 'calc(100% / 3)' }}
                warpStyle={{ padding: '0 1rem .5rem' }}
            >
                <Title text={'最新发文'} />
                <Table
                    onRowClick={(ite) => {
                        console.log(ite);
                        this.props.history.push(`/main/info/detail/${ite.article_id}`)
                    }}
                    warpStyle={{ height: 'calc(100% - 2.75rem)', marginTop: '.3rem' }}
                    columns={this.columns}
                    dataSource={data}
                />
            </Box>
        );
    }
}
export default RBBox;
