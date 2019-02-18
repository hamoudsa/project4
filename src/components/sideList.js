import React,{Component} from 'react';
import './sideList.css';

class SideList extends Component{
	render(){
		var savedList = this.props.savedList.map(name =>{
			return(
				<div className="alert alert-info" key={name}>
					<a href="#" className="btn btn-xs btn-primary pull-right">Click for more info</a>
					<strong>{name}</strong>
				</div>
			)
		})

		return (
			<ul>
				<h3>Saved Places</h3>
				{savedList}
			</ul>
		)
	}
}

export default SideList;        