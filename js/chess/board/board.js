/**

board indices = 
	[ 0,  1,  2,  3,  4,  5,  6,  7],
    [ 8,  9, 10, 11, 12, 13, 14, 15],
    [16, 17, 18, 19, 20, 21, 22, 23],
    [24, 25, 26, 27, 28, 29, 30, 31],
    [32, 33, 34, 35, 36, 37, 38, 39],
    [40, 41, 42, 43, 44, 45, 46, 47],
    [48, 49, 50, 51, 52, 53, 54, 55],
    [56, 57, 58, 59, 60, 61, 62, 63]])
*/


class Board {
	constructor(array=null) {
		this.board = [];
		this.prev_move = null;
		this.castle = [true, true, true, true];

		if (array == null) {
			this.board = [ -50, -30, -31, -90, -1000, -31, -30, -50, 
						   -10, -10, -10, -10,   -10, -10, -10, -10, 
							 0,   0,   0,   0,     0,   0,   0,   0, 
							 0,   0,   0,   0,     0,   0,   0,   0, 
							 0,   0,   0,   0,     0,   0,   0,   0, 
							 0,   0,   0,   0,     0,   0,   0,   0,
							10,  10,  10,  10,    10,  10,  10,  10,
							50,  30,  31,  90,  1000,  31,  30,  50,]
		}else{
			this.board = array;
		}
		// return this;
	}

	// ============================== AI PLAY ============================== //
	evaluate(player=1) {
		/**
		Evaluate the value of pieces on the board.

		Note: Bishop is worth 301 centipawns, while knight is worth 300.
		*/
		let white=0;
		let black=0;

		// White
		let K = [-30,-40,-40,-50,-50,-40,-40,-30,
				-30,-40,-40,-50,-50,-40,-40,-30,
				-30,-40,-40,-50,-50,-40,-40,-30,
				-30,-40,-40,-50,-50,-40,-40,-30,
				-20,-30,-30,-40,-40,-30,-30,-20,
				-10,-20,-20,-20,-20,-20,-20,-10,
				 20, 20,  0,  0,  0,  0, 20, 20,
				 20, 30, 10,  0,  0, 10, 30, 20]
		let Q = [-20,-10,-10, -5, -5,-10,-10,-20,
				-10,  0,  0,  0,  0,  0,  0,-10,
				-10,  0,  5,  5,  5,  5,  0,-10,
				-5,  0,  5,  5,  5,  5,  0, -5,
				-5,  0,  5,  5,  5,  5,  0,  0,
				-10,  0,  5,  5,  5,  5,  5,-10,
				-10,  0,  0,  0,  0,  5,  0,-10,
				-20,-10,-10, -5, -5,-10,-10,-20]
		let R = [  0,  0,  0,  0,  0,  0,  0,  0,
				5, 10, 10, 10, 10, 10, 10,  5,
			   -5,  0,  0,  0,  0,  0,  0, -5,
			   -5,  0,  0,  0,  0,  0,  0, -5,
			   -5,  0,  0,  0,  0,  0,  0, -5,
			   -5,  0,  0,  0,  0,  0,  0, -5,
			   -5,  0,  0,  0,  0,  0,  0, -5,
				0,  0,  0,  5,  5,  0,  0,  0]
		let B = [-20,-10,-10,-10,-10,-10,-10,-20,
				-10,  0,  0,  0,  0,  0,  0,-10,
				-10,  0,  5, 10, 10,  5,  0,-10,
				-10,  5,  5, 10, 10,  5,  5,-10,
				-10,  0, 10, 10, 10, 10,  0,-10,
				-10, 10, 10, 10, 10, 10, 10,-10,
				-10,  5,  0,  0,  0,  0,  5,-10,
				-20,-10,-10,-10,-10,-10,-10,-20]
		let N = [-50,-40,-30,-30,-30,-30,-40,-50,
				-40,-20,  0,  0,  0,  0,-20,-40,
				-30,  0, 10, 15, 15, 10,  0,-30,
				-30,  5, 15, 20, 20, 15,  5,-30,
				-30,  0, 15, 20, 20, 15,  0,-30,
				-30,  5, 10, 15, 15, 10,  5,-30,
				-40,-20,  0,  5,  5,  0,-20,-40,
				-50,-40,-30,-30,-30,-30,-40,-50]
		let P = [  0,  0,  0,  0,  0,  0,  0,  0,
				  5,  5,  5,  5,  5,  5,  5,  5,
				 10, 10, 20, 30, 30, 20, 10, 10,
				  5,  5, 10, 25, 25, 10,  5,  5,
				  0,  0,  0, 20, 20,  0,  0,  0,
				  5, -5,-10,  0,  0,-10, -5,  5,
				  5, 10, 10,-20,-20, 10, 10,  5,
				  0,  0,  0,  0,  0,  0,  0,  0]

		// Black
		let k = [ 20, 30, 10,  0,  0, 10, 30, 20,
				 20, 20,  0,  0,  0,  0, 20, 20,
				-10,-20,-20,-20,-20,-20,-20,-10,
				-20,-30,-30,-40,-40,-30,-30,-20,
				-30,-40,-40,-50,-50,-40,-40,-30,
				-30,-40,-40,-50,-50,-40,-40,-30,
				-30,-40,-40,-50,-50,-40,-40,-30,
				-30,-40,-40,-50,-50,-40,-40,-30]
		let q = [-20,-10,-10, -5, -5,-10,-10,-20,
				-10,  0,  0,  0,  0,  5,  0,-10,
				-10,  0,  5,  5,  5,  5,  5,-10,
				 -5,  0,  5,  5,  5,  5,  0,  0,
				 -5,  0,  5,  5,  5,  5,  0, -5,
				-10,  0,  5,  5,  5,  5,  0,-10,
				-10,  0,  0,  0,  0,  0,  0,-10,
				-20,-10,-10, -5, -5,-10,-10,-20]
		let r = [  0,  0,  0,  5,  5,  0,  0,  0,
				 -5,  0,  0,  0,  0,  0,  0, -5,
				 -5,  0,  0,  0,  0,  0,  0, -5,
				 -5,  0,  0,  0,  0,  0,  0, -5,
				 -5,  0,  0,  0,  0,  0,  0, -5,
				 -5,  0,  0,  0,  0,  0,  0, -5,
				  5, 10, 10, 10, 10, 10, 10,  5,
				  0,  0,  0,  0,  0,  0,  0,  0]
		let b = [-20,-10,-10,-10,-10,-10,-10,-20,
				-10,  5,  0,  0,  0,  0,  5,-10,
				-10, 10, 10, 10, 10, 10, 10,-10,
				-10,  0, 10, 10, 10, 10,  0,-10,
				-10,  5,  5, 10, 10,  5,  5,-10,
				-10,  0,  5, 10, 10,  5,  0,-10,
				-10,  0,  0,  0,  0,  0,  0,-10,
				-20,-10,-10,-10,-10,-10,-10,-20]
		let n = [-50,-40,-30,-30,-30,-30,-40,-50,
				-40,-20,  0,  5,  5,  0,-20,-40,
				-30,  5, 10, 15, 15, 10,  5,-30,
				-30,  0, 15, 20, 20, 15,  0,-30,
				-30,  5, 15, 20, 20, 15,  5,-30,
				-30,  0, 10, 15, 15, 10,  0,-30,
				-40,-20,  0,  0,  0,  0,-20,-40,
				-50,-40,-30,-30,-30,-30,-40,-50]
		let P = [  0,  0,  0,  0,  0,  0,  0,  0,
				  5, 10, 10,-20,-20, 10, 10,  5,
				  5, -5,-10,  0,  0,-10, -5,  5,
				  0,  0,  0, 20, 20,  0,  0,  0,
				  5,  5, 10, 25, 25, 10,  5,  5,
				 10, 10, 20, 30, 30, 20, 10, 10,
				  5,  5,  5,  5,  5,  5,  5,  5,
				  0,  0,  0,  0,  0,  0,  0,  0]

		// Value of pieces defined here
		for (let i in this.board) {
			switch(this.board[i]) {
				case 0:
					break;

				// White
				case 10:
					white += 100 + P[i];
					break;
				case 30:
					white += 300 + N[i];
					break;
				case 31:
					white += 301 + B[i];
					break;
				case 50:
					white += 500 + R[i];
					break;
				case 90:
					white += 900 + Q[i];
					break;
				case 1000:
					white += 10000 + K[i];
					break;

				// Black
				case -10:
					black += 100 + p[i];
					break;
				case -30:
					black += 300 + n[i];
					break;
				case -31:
					black += 301 + b[i];
					break;
				case -50:
					black += 500 + r[i];
					break;
				case -90:
					black += 900 + q[i];
					break;
				case -1000:
					black += 10000 + k[i];
					break;
			}
		}

		let tally = white - black;
		return tally * player;
	}

	// ============================== LEGALITY ============================== //
	#on_board(i, move) {
		/**
		Checks if on board given current position and next move.

		Tests:
			- i < 8: top row
			- i < 16: top two rows

			- i % 8 == 0: left column
			- i % 8 < 2: left two columns

			- i > 47: bottom two rows
			- i > 55: top row

			- i % 8 == 7: right column
			- i % 8 > 5: right two columns

		:param i: current position
		:param move: proposed move
		*/

		switch (move) {
			// Knight
			case -17:
				if (i < 16) {return false;} else if (i % 8 == 0) {return false;} else {return true;}
			case -15:
				if (i < 16) {return false;} else if (i % 8 == 7) {return false;} else {return true;}
			case -10:
				if (i < 8) {return false;} else if (i % 8 < 2) {return false;} else {return true;}
			case -6:
				if (i < 8) {return false;} else if (i % 8 > 5) {return false;} else {return true;}
			case 6:
				if (i > 47) {return false;} else if (i % 8 < 3) {return false;} else {return true;}
			case 10:
				if (i > 47) {return false;} else if (i % 8 > 5) {return false;} else {return true;}
			case 15:
				if (i > 55) {return false;} else if (i % 8 == 0) {return false;} else {return true;}
			case 17:
				if (i > 55) {return false;} else if (i % 8 == 7) {return false;} else {return true;}

			// Bishop
			case -9:
				if (i < 8) {return false;} else if (i % 8 == 0) {return false;} else {return true;}
			case -7:
				if (i < 8) {return false;} else if (i % 8 == 7) {return false;} else {return true;}
			case 7:
				if (i > 55) {return false;} else if (i % 8 == 0) {return false;} else {return true;}
			case 9:
				if (i > 55) {return false;} else if (i % 8 == 7) {return false;} else {return true;}

			//Rook
			case -8:
				if (i < 8) {return false;} else if (false) {return false;} else {return true;}
			case -1:
				if (false) {return false;} else if (i % 8 == 0) {return false;} else {return true;}
			case 1:
				if (false) {return false;} else if (i % 8 == 7) {return false;} else {return true;}
			case 8:
				if (i < 8) {return false;} else if (false) {return false;} else {return true;}

			default:
				// ERROR!
				return false;
		}
	}

	#on_board_quick(i, move) {
		/**
		Quicker implementation of on_board
		*/

		let j = i + move;

		// Check it is on the board vertically
		if (j < 0) {return false} else if (j > 63) {return false}

		// Check it is on the board horizontally
		switch (move) {

		}
	}

	#straight_line_moves(i) {
		/**
		Private class. Help with straight line pieces.
		:param i: current position index
		*/

		// Error Check
		if (i < 0) {
			return false;
		} else if (i > this.board.length) {
			return false;
		}

		// Get legal moves
		let legal = [];
		let moves = [];
		let max = 0;
		let j = 0; 							// Temporary tracking variable
		let piece = this.board[i];
		let player = Math.sign(piece);

		switch (piece) {
			// Bishop
			case 31:
			case -31:
				moves = [-9, -7, +7, +9];
				max = 8;
				break;
			// Rook
			case 50:
			case -50:
				moves = [-8, -1, +1, +8];
				max = 8;
				break;
			// Queen
			case 90:
			case -90:
				max = 8;
				moves = [-9, -8, -7, -1, +1, +7, +8, +9];
				break;
			
			// King
			case 10000:
			case -10000:
				max = 1;
				moves = [-9, -8, -7, -1, +1, +7, +8, +9];
				break;

			// Knight
			case 30:
			case -30:
				max = 1;
				moves = [-17, -15, -10, -6, 6, 10, 15, 17];

			default:
				// ERROR!
				max = 0;
				moves = [];
		}

		for (move of moves) {
			j = i;
			// While on board AND not capturing a friendly player
			while (this.#on_board(j, move) && player != Math.sign(this.board[j + move])) {
				legal.push(j + move);

				// If capture enemy, break
				if (this.board[i] != 0) {
					break;
				// if can only move 1, break
				} else if (max == 1) {
					break;
				}
			}
		}


		return legal;
	}

	legal_move(i) {
		/**
		Get legal moves for the piece on square i.

		Board moves:
			-9, -8, -7,
			-1,	 0, +1,
			+7, +8, +9


		:param i: index of piece
		*/

		let piece = this.board[i];
		let player = Math.sign(piece);
		let legal = [];
		let move = null;

		switch (piece) {
			case 0:
				break;
			case 10:
				move = i - 8;
				if (i > 7){
					//
				}else{
					// Should have promoted
					return [];
				}
				if (this.board[i-8] == 0) {
					legal += 
				}
			case 30:
				if 
			case 31:

		}
	}

	// ============================== DISPLAY ============================== //
	// Deprecate. Make it sub-class
	stringify() {
		/**
		Stringify this.board into HTML table.
		*/
		let string = "";
		for (let i = 0; i < 8; i++) {
			string += "<tr>"
			for (let j = 0; j < 8; j++) {
				string += "<td>" + this.board[8*i+j] + "</td>";
			}
			string +=  "</tr>";
		}
		console.log(string);
		return string;
	}

	print(id) {
		let element = document.getElementById(id);
		let string = this.stringify();
		console.log(string);
		element.innerHTML = string;
	}
}