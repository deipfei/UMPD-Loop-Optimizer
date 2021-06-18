import './Loop.css';
import { HORSES } from './Horses.js';
import React, { Component } from 'react';
import Horse from './Horse.js';

class Loop extends Component {
	constructor(props) {
		super(props);
		this.state = { loop: [] };
	}

	componentDidMount() {
		this.getBreedingLoop(this.props.horses, this.props.disabledHorses);
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevProps !== this.props) {
			this.getBreedingLoop(this.props.horses, this.props.disabledHorses);
		}
	}

	render() {

		let loopDiv = undefined;

		if (this.state.loop.length === 0) {
			loopDiv = (
				<p>Loading</p>
			);
			///
		} else {
			let loop = this.state.loop.map((currHorse) => {
				return ( 
					<Horse key={currHorse.id} horse={currHorse}></Horse>
				);
			});
			loopDiv = (
				<div>
					<h1>Optimal Loop</h1>
					<div className="loopWrapper">
						{loop}
					</div>
				</div>
			);
			///
		}

		return (
			<div>
				{loopDiv}
			</div>
		);
		///
	}

	findCompatibilityIndexInList(compatibilities, horseToFind) {
		return compatibilities.findIndex((horseCompatibility) => {
			return horseCompatibility === horseToFind.id;
		});
	}

	getCompatibilityPair(horse1, horse2, multiplier = 1) {
		let baseComp1 = horse1.compatibilities;
		let baseComp2 = horse2.compatibilities;

		return Math.pow((this.findCompatibilityIndexInList(baseComp1, horse2) + this.findCompatibilityIndexInList(baseComp2, horse1)), 1.5) * multiplier;
	}

	getCompatibilityList(horse) {
		let baseComp = horse.compatibilities;
		let compPairs = [];
		for (let i = 0; i < baseComp.length; i++) {
			let currHorse = baseComp[i];
			compPairs[currHorse.id] = this.getCompatibilityPair(horse, currHorse);
		}

		return compPairs;
	}

	orderCompatibilityListByPairs(horse) {
		let baseComp = horse.compatibilities;
		let compList = this.getCompatibilityList(horse);
		let orderedComp = [];

		orderedComp[horse.id] = -1;

		for (let i = 0; i < baseComp.length; i++) {
			orderedComp[baseComp[i].id] = compList[i].id != null ? compList[i].id : 10000;
		}

		return orderedComp;
	}

	sumCompatibilities(compatibilities) {
		let sum = 0;
		for (let i = 0; i < compatibilities.length; i++) {
			sum += compatibilities[i];
		}
		return sum;
	}

	getCompatibilitiesSumArray(horses) {
		let compatibilities = [this.getCompatibilityPair(horses[0], horses[1])];

		if (horses.length >= 3) {
			compatibilities.push(this.getCompatibilityPair(horses[0], horses[2], 2));
			compatibilities.push(this.getCompatibilityPair(horses[1], horses[2]));
		}

		if (horses.length === 4) {
			compatibilities.push(this.getCompatibilityPair(horses[0], horses[3], 3));
			compatibilities.push(this.getCompatibilityPair(horses[1], horses[3], 2));
			compatibilities.push(this.getCompatibilityPair(horses[2], horses[3]));
		}

		return this.sumCompatibilities(compatibilities);
	}

	getCompatibilitiesSum(horse1, horse2, horse3 = null, horse4 = null) {
		let compatibilities = [this.getCompatibilityPair(horse1, horse2)];

		if (horse3 != null) {
			compatibilities.push(this.getCompatibilityPair(horse1, horse3, 2));
			compatibilities.push(this.getCompatibilityPair(horse2, horse3));
		}

		if (horse4 != null) {
			compatibilities.push(this.getCompatibilityPair(horse1, horse4, 3));
			compatibilities.push(this.getCompatibilityPair(horse2, horse4, 2));
			compatibilities.push(this.getCompatibilityPair(horse3, horse4));
		}

		return this.sumCompatibilities(compatibilities);
	}

	permutator(inputArr) {
	  let result = [];

	  const permute = (arr, m = []) => {
	    if (arr.length === 0) {
	      result.push(m)
	    } else {
	      for (let i = 0; i < arr.length; i++) {
	        let curr = arr.slice();
	        let next = curr.splice(i, 1);
	        permute(curr.slice(), m.concat(next))
	     }
	   }
	 }

	 permute(inputArr)

	 return result;
	}

	findBestCompatiblityPermutation(permutations) {
		let sum = -1;
		let order = [];
		for (let i = 0; i < permutations.length; i++) {
			let tempSum = this.getCompatibilitiesSumArray(permutations[i]);
			if (i === 0 || tempSum < sum) {
				sum = tempSum;
				order = permutations[i];
			}
		}

		return { order: order, sum: sum };
	}

	getBestCompatibilitiesSum(horse1, horse2, horse3 = null, horse4 = null) {
		let sumCompatibilities = this.getCompatibilitiesSum(horse1, horse2);
		let order = [horse1, horse2];

		if (horse3 == null && horse4 == null) {
			return { order: order, sum: sumCompatibilities };
		}

		let bestPermutation = null;

		if (horse4 == null) { //3 horses passed in
			bestPermutation = this.findBestCompatiblityPermutation(this.permutator([horse1, horse2, horse3]));
		} else {
			bestPermutation = this.findBestCompatiblityPermutation(this.permutator([horse1, horse2, horse3, horse4]));
		}

		return bestPermutation == null ? null : { order: bestPermutation.order, sum: bestPermutation.sum };
	}

	getBreedingLoop(horses, disallowed = []) {
		let tempLoop = [];
		for (let i = 0; i < horses.length; i++) {
			tempLoop.push(horses[i]);
		}

		let loop = [];
		let loopLength = 10000;
		let baseComp = tempLoop[0].compatibilities;
		if (tempLoop.length === 0) {
			return [];
		}

		if (tempLoop.length === 4) {
			let best = this.getBestCompatibilitiesSum(tempLoop[0], tempLoop[1], tempLoop[2], tempLoop[3]);
			this.setState((state, props) => {
				return {
					loop: best.order
				};
			});

			return best.order;
		}

		for (let i = 0; i < baseComp.length; i++) {
			if (horses[1] != null) {
				i = baseComp.length - 1;
				tempLoop = [horses[0], horses[1]];
			} else {
				let horse2 = HORSES.find((tempHorse) => {
					return tempHorse.id === baseComp[i];
				});


				if (this.findCompatibilityIndexInList(tempLoop, horse2) !== -1 || disallowed.includes(horse2) || this.getCompatibilitiesSum(tempLoop[0], horse2) > loopLength) continue;
				tempLoop = [tempLoop[0], horse2];
			}

			let baseComp2 = tempLoop[1].compatibilities;

			for (let j = 0; j < baseComp2.length; j++) {
				if (horses[2] != null) {
					j = baseComp2.length - 1;
					tempLoop = [horses[0], horses[1], horses[2]];
				} else {
					let horse3 = HORSES.find((tempHorse) => {
						return tempHorse.id === baseComp2[j];
					});

					if (this.findCompatibilityIndexInList(tempLoop, horse3) !== -1 || disallowed.includes(horse3) || this.getCompatibilitiesSum(tempLoop[0], tempLoop[1], horse3) > loopLength) continue;
					tempLoop = [tempLoop[0], tempLoop[1], horse3];
				}
				

				let baseComp3 = tempLoop[2].compatibilities;

				for (let k = 0; k < baseComp3.length; k++) {
					let horse4 = HORSES.find((tempHorse) => {
						return tempHorse.id === baseComp3[k];
					});

					if (this.findCompatibilityIndexInList(tempLoop, horse4) !== -1 || disallowed.includes(horse4)) continue;

					let orderOfHorses = this.getBestCompatibilitiesSum(tempLoop[0], tempLoop[1], tempLoop[2], horse4);

					if (orderOfHorses == null) {
						console.log('something went wrong');
					}

					if (orderOfHorses.sum < loopLength) {
						loopLength = orderOfHorses.sum;
						loop = orderOfHorses.order;
					}
				}
			}
		}

		this.setState((state, props) => {
			return {loop: loop};
		});

		return loop;
	}
}

export default Loop;