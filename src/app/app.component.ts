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
	title = 'game-boxes';

	rows: number;
	noOfColorBoxes: number;
	dificulty: number;

	colorList: Array<string> = ['#0000ff', '#9c27b0', '#e91e63', '#607d8b', '#009688', '#8bc34a', '#ffeb3b', '#ffc107']
	colorBoxes: Array<number>;
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

	buildForm() {
		this.form = this.formBuilder.group({
			noOfBoxes: ['', [Validators.required, Validators.min(0), Validators.max(2000), Validators.pattern("^[0-9]*$")]],
			noOfColorBoxes: ['', [Validators.required, Validators.min(0), Validators.max(4000000), Validators.pattern("^[0-9]*$")]],
			dificultyLevel: ['', [Validators.required, Validators.min(0), Validators.max(5), Validators.pattern("^[0-9]*$")]],
		});
	}

	onSubmit() {

		console.log(this.form.controls);
		let formValues = this.form.controls;

		// stop here if form is invalid
		if (this.form.invalid) {
			return;
		}

		this.rows = formValues.noOfBoxes.value;
		this.noOfColorBoxes = formValues.noOfColorBoxes.value;
		this.dificulty = formValues.dificultyLevel.value * 1000;
		this.totalBoxes = this.rows * this.rows;

		if (this.noOfColorBoxes >= this.totalBoxes) {
			this.gameWon();
			return;
		}

		this.isFormSubmitted = true;

		this.setDefaultColorBoxes();

		this.setDefaultUncoloredBoxes();

		this.initilizeGame();

		this.polling();

	}

	ngOnInit() {

		this.buildForm();
	}


	setDefaultColorBoxes() {
		let arr = [];
		while (arr.length < this.noOfColorBoxes) {
			let r = Math.floor(Math.random() * this.totalBoxes) + 1;
			if (arr.indexOf(r) === -1) arr.push(r);
		}
		this.colorBoxes = arr;
	}


	setDefaultUncoloredBoxes() {
		let arr = [];
		for (let i = 1; i <= this.totalBoxes; i++) {
			if (this.colorBoxes.indexOf(i) === -1) {
				arr.push(i);
			}
		}
		this.uncoloredBoxes = arr;
	}

	checkInColorBoxes(boxId) {
		if (this.colorBoxes.indexOf(boxId) > -1) {
			return this.getRandommColor();
		}
		return '';
	}


	initilizeGame() {
		let items = [];

		for (let i = 0; i < this.rows; i++) {
			let innerArr = [];

			for (let j = 0; j < this.rows; j++) {
				let boxId = ((i * this.rows) + 1) + j;
				innerArr.push({
					id: boxId,
					color: this.checkInColorBoxes(boxId)
				})
			}
			items.push(innerArr);
		}
		this.boxes = items;

	}

	changeColor(boxId) {
		let box_id = parseInt(boxId)

		if (this.uncoloredBoxes.indexOf(box_id) === -1) return;

		this.uncoloredBoxes.splice(this.uncoloredBoxes.indexOf(box_id), 1);
		this.colorBoxes.push(box_id);

		this.updateBox(box_id, 1)

		if (!this.uncoloredBoxes.length) {
			setTimeout(() => {
				this.gameWon();
				this.poll.unsubscribe();

			})
		}
	}

	updateBox(box_id, type) {

		let ind_1 = this.firstIndex(box_id);
		let ind_2 = ((box_id % this.rows) ? (box_id % this.rows) : this.rows) - 1;

		if (type === 1) {
			this.boxes[ind_1][ind_2].color = this.getRandommColor();
		} else if (type === 2) {
			this.boxes[ind_1][ind_2].color = '';
		}

	}

	polling() {
		this.poll = interval(this.dificulty).subscribe(
			() => {

				if (this.colorBoxes.length) {

					let colorArr = this.colorBoxes;
					let randomNo = this.getRandomNoFromArray(colorArr);

					this.uncoloredBoxes.push(randomNo);
					this.colorBoxes.splice(this.colorBoxes.indexOf(randomNo), 1);

					this.updateBox(randomNo, 2);

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
			},
			() => {
				console.log('observable completed !');
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
		return parseInt(items[num]);
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
