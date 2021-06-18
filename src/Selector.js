import React, { Component } from 'react';
import Horse from './Horse.js';
import './Selector.css';

class Selector extends Component {

	handleMouse(e, horse) {
		e.preventDefault();
		if (e.nativeEvent.which === 1) {
			this.props.updateSelection(horse, e.ctrlKey);
		} else if (e.nativeEvent.which === 3) {
			this.props.updateDisabled(horse);
		}
	}

	render() {
		let horseDivs = this.props.horses.map((horse) => {
			let classes = [
				this.props.selectedHorses.includes(horse) ? 'selected' : '',
				this.props.disabledHorses.includes(horse) ? 'disabled' : ''
			];

			let classNames = '';
			for (let i = 0; i < classes.length; i++) {
				if (classes[i] !== '') {
					classNames += ' ' + classes[i];
				}
			}

			classNames = classNames.trim();

			return (
				<div key={horse.id} 
					 className={classNames}
					 onClick={(e) => { this.handleMouse(e, horse) }}
					 onContextMenu={(e) => { this.handleMouse(e, horse) }}>
					<Horse horse={horse}></Horse>
				</div>
			);
		});

		return (
			<div className="selector">
				{horseDivs}
			</div>
		);

	}
}

export default Selector;