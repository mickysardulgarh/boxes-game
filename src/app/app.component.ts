import { Component, OnInit } from '@angular/core';
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


		if (this.noOfColorBoxes >= this.totalBoxes) {
			this.gameWon();
			return;
		}
		this.isFormSubmitted = true;

	}

	gameWon() {
		alert('Congratulation, you won the game !!');
		window.location.reload();
	}
}
