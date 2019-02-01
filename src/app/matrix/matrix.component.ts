import { Component, OnInit, Input } from '@angular/core';
import { interval } from 'rxjs';


@Component({
	selector: 'app-matrix',
	templateUrl: './matrix.component.html',
	styleUrls: ['./matrix.component.scss']
})
export class MatrixComponent implements OnInit {


	@Input() rows: number;
	@Input() noOfColorBoxes: number;
	@Input() dificulty: number;
	@Input() totalBoxes: number;

	public poll;
	public colorList: Array<string> = ['#0000ff', '#3230d2', '#de5bd4', '#845180', '#5c0c8e', '#9c27b0', '#e91e63', '#607d8b', '#009688', '#8bc34a', '#ffeb3b', '#ffc107', '#1a0d4a', '#3ec9d0', '#b3d03e']
	public colorBoxes: Array<string>;

	constructor() { }

	ngOnInit() {

		this.initilizeGame();

	}

	initilizeGame() {
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

		setTimeout(() => {
			let box = document.getElementById('box');
			box.appendChild(table);

			this.setDefaultColorBoxes();

			this.polling();
		})
	}


	setDefaultColorBoxes() {
		let arr = [];
		while (arr.length < this.noOfColorBoxes) {
			let r = Math.floor(Math.random() * this.totalBoxes) + 1;
			let str = 'A' + r;
			if (arr.indexOf(str) === -1) arr.push(str);
		}
		this.colorBoxes = arr;

		for (let i of this.colorBoxes) {
			document.getElementById(i).style.backgroundColor = this.getRandommColor();
		}
	}


	changeColor(evt) {

		let box = evt.target;

		if ((box.style.backgroundColor && box.style.backgroundColor != '#FFFFFF' && box.style.backgroundColor != 'rgb(255, 255, 255)') || evt.target.nodeName.toLowerCase() != 'td') return;

		document.getElementById(box.id).style.backgroundColor = this.getRandommColor();
		this.colorBoxes.push(box.id);


		if (this.colorBoxes.length === this.totalBoxes) {
			setTimeout(() => {
				this.gameWon();
				this.poll.unsubscribe();
			})
		}
	}


	polling() {
		this.poll = interval(this.dificulty).subscribe(
			() => {

				if (this.colorBoxes.length) {

					let colorArr = this.colorBoxes;
					let randomNo = this.getRandomNoFromArray(colorArr);

					document.getElementById(randomNo).style.backgroundColor = '#FFFFFF';
					this.colorBoxes.splice(this.colorBoxes.indexOf(randomNo), 1);

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
