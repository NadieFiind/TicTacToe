let board;
let placer = "O";
function setup() {
	let w = window.innerWidth;
	let h = window.innerHeight;
	let parent = document.querySelector("#canvas-container");
	
	if (w > h) {
		createCanvas(h, h).parent(parent);
	} else {
		createCanvas(w, w).parent(parent);;
	}
	
	ellipseMode(CORNER);
	board = new Board(5);
}
function draw() {
	board.render();
}
function mousePressed() {
	if (board.playing) {
		board.place();
		board.checkSpots();
	} else {
		board.replay();
	}
}
class Board {
	constructor(size) {
		this.size = size;
		this.board = Array(this.size);
		this.playing = true;
		
		// create the 2D array board
		for (let i = 0; i < this.size; i++) {
			this.board[i] = Array(this.size);
		}
		
		// initialize the cells
		for (let i = 0; i < this.size; i++) {
			for (let j = 0; j < this.size; j++) {
				let w = width / this.size;
				let h = height / this.size;
				this.board[i][j] = new Cell(i, j, w, h);
			}
		}
	}
	place() {
		for (let i = 0; i < board.size; i++) {
			for (let j = 0; j < board.size; j++) {
				let cell = this.board[i][j];
				if (mouseX > cell.x && mouseX < cell.x + cell.w) {
					if (mouseY > cell.y && mouseY < cell.y + cell.h) {
						cell.place(placer);
					}
				}
			}
		}
	}
	render() {
		for (let i = 0; i < this.size; i++) {
			for (let j = 0; j < this.size; j++) {
				this.board[i][j].render();
			}
		}
	}
	decideWinner(spot) {
		if (spot === "O") {
			alert("Circle won!");
			this.playing = false;
		} else if (spot === "X") {
			alert("Cross won!");
			this.playing = false;
		} else if (spot === "-") {
			alert("It's a tie!");
			this.playing = false;
		}
	}
	replay() {
		if (mouseX > 0 && mouseX < width) {
			if (mouseY > 0 && mouseY < height) {
				background(255);
				placer = "O";
				this.playing = true;
				for (let i = 0; i < board.size; i++) {
					for (let j = 0; j < board.size; j++) {
						this.board[i][j].spot = "";
					}
				}
			}
		}
	}
	check() {
		let currSpot = "";
		
		// check vertical
		for (let i = 0; i < this.size; i++) {
			for (let j = 0; j < this.size; j++) {
				if (this.board[i][0].spot === "") {
					break;
				}
				if (currSpot === "") {
					currSpot = this.board[i][j].spot;
				} else if (currSpot !== this.board[i][j].spot) {
					currSpot = "";
					break;
				}
			}
			this.decideWinner(currSpot);
		}
		
		// check horizontal
		for (let j = 0; j < this.size; j++) {
			for (let i = 0; i < this.size; i++) {
				if (this.board[j][0].spot === "") {
					break;
				}
				if (currSpot === "") {
					currSpot = this.board[i][j].spot;
				} else if (currSpot !== this.board[i][j].spot) {
					currSpot = "";
					break;
				}
			}
			this.decideWinner(currSpot);
		}
		
		// check backward diagonal
		for (let i = 0; i < this.size; i++) {
			if (this.board[0][0].spot === "") {
				break;
			}
			if (currSpot === "") {
				currSpot = this.board[i][i].spot;
			} else if (currSpot !== this.board[i][i].spot) {
				currSpot = "";
				break;
			}
		}
		this.decideWinner(currSpot);
		
		// check forward diagonal
		let lastIndex = this.size - 1;
		for (let i = lastIndex; i >= 0; i--) {
			if (this.board[lastIndex][0].spot === "") {
				break;
			}
			if (currSpot === "") {
				currSpot = this.board[i][lastIndex - i].spot;
			} else if (currSpot !== this.board[i][lastIndex - i].spot) {
				currSpot = "";
				break;
			}
		}
		if (board.playing) {
			this.decideWinner(currSpot);
		}
	}
	checkSpots() {
		for (let i = 0; i < this.size; i++) {
			for (let j = 0; j < this.size; j++) {
				if (this.board[i][j].spot === "") {
					return;
				}
			}
		}
		this.decideWinner("-");
	}
}
class Cell {
	constructor(i, j, w, h) {
		this.i = i;
		this.j = j;
		this.w = w;
		this.h = h;
		this.x = w * i;
		this.y = h * j;
		this.spot = "";
	}
	place(spot) {
		if (this.spot === "") {
			this.spot = spot;
			board.check();
		}
		if (this.spot === "O") {
			placer = "X";
		} else {
			placer = "O";
		}
	}
	render() {
		noFill();
		stroke(0);
		rect(this.x, this.y, this.w, this.h);
		if (this.spot === "O") {
			circle(this.x, this.y, this.w);
		} else if (this.spot === "X") {
			line(this.x, this.y, this.x + this.w, this.y + this.h);
			line(this.x + this.w, this.y, this.x, this.y + this.h);
		}
	}
}