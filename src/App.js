import React, { Component } from 'react';
import './App.css'
import Search from './components/search'
import Result from './components/result'
import SideList from './components/sideList'
import Axios from 'axios';

class App extends Component {

	constructor(props){
		super(props);
		this.state = {
			results:{},
			savedList:[]
		  }
	}
	

	updateState(newPlaces){
		this.setState({
			results:newPlaces			
		});
	}

	updateSavedList(nameOfPlace){
		const place = this.state.savedList.concat([nameOfPlace]);
		this.setState({
			savedList:place
		});
	}

  	render() {
    	return (
      		<div className="container">
				<div className="row">
					<div className="col-md-8">
						<Search callUpdate = {this.updateState.bind(this)}/>
						<Result resultPlaces = {this.state.results}						
								updateSavedList = {this.updateSavedList.bind(this)}/>
					</div>
					<div className="col-md-4">
						<SideList savedList = {this.state.savedList}/>
					</div>
				</div>  
      		</div>      
	);
  }
}

export default App;
