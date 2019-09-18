// 上帝保佑,永无bug
import React, {Component} from "react";
import style from './selection.scss';

export default class Selection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: null,
            allowControl: JSON.parse(sessionStorage.getItem('manager'))
        };
    }

    componentDidMount() {

    }

    componentDidUpdate (){

    }


    handelSelectionClick = ( e ) => {
        if( this.state.choosing ){
            this.closePanel();
        }else{
            this.openPanel();
        }
    }

    handelItemClick = ( e, item ) => {
        this.setState({
            selected: item.name
        }, ()=>{
            this.closePanel();
        });

        if( this.props.onChange ){
            this.props.onChange(this.props.name, item );
        }
    }

    openPanel = () =>{
        this.setState({
            choosing: true,
        });

        let this_ = this;
        document.addEventListener("click", this_.closePanel );
    }

    setValue = ( item ) => {
        this.setState({
            selected: item.name
        });
    }

    closePanel = () => {
        this.setState({
            choosing: false,
        });

        let this_ = this;
        document.removeEventListener("click", this_.closePanel );
    }

    render() {
        return (
            <div className={style.selection} style={{width:this.props.width}}>
                <div className={ this.state.choosing ? style.contain + ' ' +style.panelShow : style.contain + ' ' +style.panelHide } onClick={ (e)=> {this.handelSelectionClick( e ) } }>
                    <div className={style.optionsRepresent}>
                        <div className={style.input}>
                            <span className={style.optionText} title={ this.state.selected }>{ this.state.selected || this.props.tipData }</span>
                            <span className={style.middle}></span>
                        </div>
                        <div className={style.icon} ></div>
                    </div>
                    <div className={style.optionsPanel} style={{width: this.props.width}}>
                        <ul>
                            {
                                this.props.data && this.props.data.map((el, index )=> {
                                    return (
                                        <li key={index}
                                            onClick={(e) =>{ this.handelItemClick( e, el )}}>{ el.name }</li>
                                    )
                                })
                            }
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}
