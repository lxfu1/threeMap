import React, {Component} from 'react';
import styles from './style.scss';

export default class Select extends Component {

	constructor(props) {
		super(props);
		this.state = {
			status: true
		}
	}

	render() {
		return (
			<section className={styles.s_con} style={{width:this.props.width}}>
				<div className={styles.select}>

				</div>
				{
					this.state.status ? <i className={"iconfont" + " "+ styles.icon}>&#xe792;</i> :
						<i className={"iconfont" + " "+ styles.icon}>&#xe791;</i>
				}
			</section>
		)
	}
}