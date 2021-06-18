import React, { Component } from 'react';
import './Horse.css';

class Horse extends Component {
	constructor(props) {
		super(props);
		this.state = {
			horse: props.horse
		};
	}

	render() {
		return (
			<div key={this.props.horse} className="horseWrapper">
				<div className="horseMain" style={{backgroundColor: this.props.horse.mainColor }}>
		          <div className="horseSecondary" style={{backgroundColor: this.props.horse.secondaryColor }}></div>
		        </div>
		        {this.props.horse.name}
	        </div>
		);
	}
}

export default Horse;