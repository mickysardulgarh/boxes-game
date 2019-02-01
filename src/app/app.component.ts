import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { interval } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

	number: any;


	title = 'game-boxes';
	rows: number;
	noOfColorBoxes: number;
	dificulty: number;

	colorList: Array<string> = ['#0000ff', '#3230d2', '#de5bd4', '#845180', '#5c0c8e', '#9c27b0', '#e91e63', '#607d8b', '#009688', '#8bc34a', '#ffeb3b', '#ffc107', '#1a0d4a', '#3ec9d0', '#b3d03e']
	colorBoxes: Array<string>;
	uncoloredBoxes: Array<number>;
	boxes: any;
	poll;
	totalBoxes: number;
	isFormSubmitted = false;
	form: FormGroup;

	constructor(
		private formBuilder: FormBuilder
	) {

	}

	ngOnInit() {

		this.buildForm();
	}

	buildForm() {
		this.form = this.formBuilder.group({
			noOfBoxes: ['', [Validators.required, Validators.min(0), Validators.max(2000), Validators.pattern("^[0-9]*$")]],
			noOfColorBoxes: ['', [Validators.required, Validators.min(0), Validators.max(4000000), Validators.pattern("^[0-9]*$")]],
			dificultyLevel: ['', [Validators.required, Validators.min(0), Validators.max(5), Validators.pattern("^[0-9]*$")]],
		});
	}

	onSubmit() {

		let formValues = this.form.controls;

		if (this.form.invalid) {
			return;
		}

		this.rows = +formValues.noOfBoxes.value;
		this.noOfColorBoxes = +formValues.noOfColorBoxes.value;
		this.dificulty = +formValues.dificultyLevel.value * 1000;
		this.totalBoxes = this.rows * this.rows;

		console.log(this.noOfColorBoxes);


		//this.number = Array(this.rows).fill(0)

		if (this.noOfColorBoxes >= this.totalBoxes) {
			this.gameWon();
			return;
		}
		this.isFormSubmitted = true;

		let i = 0;
		var table = document.createElement("table");
		while (i < this.rows) {
			let j = 0;
			let tr = document.createElement("tr");
			while (j < this.rows) {
				let td = document.createElement("td");
				td.className = "td-bg";
				td.id = 'A' + ((i * this.rows + 1) + j);
				tr.appendChild(td);
				j++;
			}
			table.appendChild(tr);
			i++;
		}



		//console.log(this.number);


		console.time('timeStart');


		setTimeout(() => {
			let box = document.getElementById('box');
			box.appendChild(table);
			
			this.setDefaultColorBoxes();

			this.polling();
		})


		/*		
	
			this.setDefaultUncoloredBoxes();
	
			this.initilizeGame();
	
			*/

	}


	setDefaultColorBoxes() {
		let arr = [];
		while (arr.length < this.noOfColorBoxes) {
			let r = Math.floor(Math.random() * this.totalBoxes) + 1;
			if (arr.indexOf(r) === -1) arr.push('A' + r);
		}
		this.colorBoxes = arr;

		console.log(this.colorBoxes);


		for (let i of this.colorBoxes) {
			console.log(i);
			document.getElementById(i).style.backgroundColor = this.getRandommColor();
		}
	}


	// setDefaultUncoloredBoxes() {
	// 	let arr = [];
	// 	for (let i = 1; i <= this.totalBoxes; i++) {
	// 		if (this.colorBoxes.indexOf(i) === -1) {
	// 			arr.push(i);
	// 		}
	// 	}
	// 	this.uncoloredBoxes = arr;
	// }

	// checkInColorBoxes(boxId) {
	// 	if (this.colorBoxes.indexOf(boxId) > -1) {
	// 		return this.getRandommColor();
	// 	}
	// 	return '';
	// }


	// initilizeGame() {
	// 	let items = [];

	// 	for (let i = 0; i < this.rows; i++) {
	// 		let innerArr = [];

	// 		for (let j = 0; j < this.rows; j++) {
	// 			let boxId = ((i * this.rows) + 1) + j;
	// 			innerArr.push({
	// 				id: boxId,
	// 				color: this.checkInColorBoxes(boxId)
	// 			})
	// 		}
	// 		items.push(innerArr);
	// 	}
	// 	this.boxes = items;
	// 	console.timeEnd('timeStart');
	// }

	changeColor(evt) {
		
		let box = evt.target;
		console.log(box);
		
		if (box.style.backgroundColor && box.style.backgroundColor !== '#FFFFFF') return;

		//this.uncoloredBoxes.splice(this.uncoloredBoxes.indexOf(box_id), 1);
		box.style.backgroundColor = this.getRandommColor();
		this.colorBoxes.push(box.id);

		//this.updateBox(box_id, 1)

		if (this.colorBoxes.length === this.totalBoxes) {
			setTimeout(() => {
				this.gameWon();
				this.poll.unsubscribe();
			})
		}
	}

	// updateBox(box_id, type) {

	// 	let ind_1 = this.firstIndex(box_id);
	// 	let ind_2 = ((box_id % this.rows) ? (box_id % this.rows) : this.rows) - 1;

	// 	if (type === 1) {
	// 		this.boxes[ind_1][ind_2].color = this.getRandommColor();
	// 	} else if (type === 2) {
	// 		this.boxes[ind_1][ind_2].color = '';
	// 	}

	// }

	polling() {
		this.poll = interval(this.dificulty).subscribe(
			() => {

				if (this.colorBoxes.length) {

					let colorArr = this.colorBoxes;
					let randomNo = this.getRandomNoFromArray(colorArr);

					//this.uncoloredBoxes.push(randomNo);
					this.colorBoxes.splice(this.colorBoxes.indexOf(randomNo), 1);
					document.getElementById(randomNo).style.backgroundColor = '#FFFFFF';
					//this.updateBox(randomNo, 2);

					if (!this.colorBoxes.length) {
						this.poll.unsubscribe();
						setTimeout(() => {
							this.gameLoss();
						})
					}

				}
			},
			(error: any) => {
				console.log('error');
			}
		);
	}


	firstIndex(box_id) {
		let d = box_id / this.rows;
		if (d % 1 === 0) {
			return d - 1
		}
		return Math.floor(d);
	}


	getRandommColor() {
		let colors = this.colorList;
		return colors[(Math.random() * colors.length) | 0];
	}

	getRandomNoFromArray(items) {

		let num = Math.floor(Math.random() * items.length);
		return items[num];
	}

	gameWon() {
		alert('Congratulation, you won the game !!');
		window.location.reload();
	}

	gameLoss() {
		alert('You loss the game !!');
		window.location.reload();
	}
}
