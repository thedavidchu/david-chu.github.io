/**
The class for a chess game.

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
		this.prev_move = [null, null];
		this.castle = [true, true, true, true];		// [black left castle, black right castle, white left castle, white right castle], from white's perspective

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

	// ============================== PLAY ============================== //
	get_move(i, j) {
		/**
		Steps:
			1. Check if there's a piece at i
			2. Check if legal move (check if en pasant, check pawn promotion)
			3. Update castle
			4. Update previous move
			5. Update board
			6. Check for check/ check mate etc.

		:param i: move from here
		:param j: move to here
		:return: bool - whether legal move or not
		*/

		return true;
	}

	// ============================== LEGALITY ============================== //
	#check(player=null, legal=null) {
		/**
		Check if the player is in check.
		*/
		if (player == null) {
			// Return true if either player is in check
			return this.#check(player=1) || this.#check(player=-1);
		} else if (player == 1) {
			let all_legal = this.all_legal_moves(player=-player);
			
			return null;
		} else if (player == -1) {
			return null;
		} else {
			// ERROR!
			return false;
		}
	}

	#stale_mate(player=null) {
		/**
		Check if there are any legal moves left.
		*/
		return false;
	}

	#check_mate(player=null) {
		/**
		Check if there is a check mate.
		Steps:
			1. Check if check
			2. Check if legal moves to get out of check
		*/
		let check = this.#check(player=player);
		let stale = this.#stale_mate(player=player);
		return check && stale;
	}

	#on_board(i, move) {
		/**
		Checks if the next move will keep the piece on the board.

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
				if (i > 55) {return false;} else if (false) {return false;} else {return true;}

			default:
				// ERROR!
				return false;
		}
	}

	#legal_move_help(i) {
		/**
		Private class. Help with non-pawn pieces. Also, does not check if a position will end up in check or checkmate.
		N.B. Does not check for castling yet!

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
				max = 8;
				moves = [-9, -7, +7, +9];
				break;
			// Rook
			case 50:
			case -50:
				max = 8;
				moves = [-8, -1, +1, +8];
				break;
			// Queen
			case 90:
			case -90:
				max = 8;
				moves = [-9, -8, -7, -1, +1, +7, +8, +9];
				break;
			
			// King
			case 1000:
				max = 1;
				moves = [-9, -8, -7, -1, +1, +7, +8, +9];
				// Check white castle - valid on [R, 57, 58, 59, K, 61, 62, R]
				if (this.castle[2] && !this.board[57] && !this.board[58] && !this.board[59]) {legal.push(58);}
				if (this.castle[3] && !this.board[61] && !this.board[62]) {legal.push(62);}
				break;
			case -1000:
				max = 1;
				moves = [-9, -8, -7, -1, +1, +7, +8, +9];

				// Check black castle - valid on [ r,  1,  2,  3,  k,  5,  6,  r]
				if (this.castle[0] && !this.board[1] && !this.board[2] && !this.board[3]) {legal.push(2);}
				if (this.castle[1] && !this.board[5] && !this.board[6]) {legal.push(6);}
				break;

			// Knight
			case 30:
			case -30:
				max = 1;
				moves = [-17, -15, -10, -6, 6, 10, 15, 17];
				break;

			default:
				// ERROR!
				max = 0;
				moves = [];
				break;
		}

		for (let move of moves) {
			j = i;
			// While on board AND not capturing a friendly player
			while (this.#on_board(j, move) && player != Math.sign(this.board[j + move])) {
				legal.push(j + move);						// Add legal move
				if (this.board[i] != 0) {break;}			// BREAK if capture enemy
				else if (max == 1) {break;}					// BREAK if can only move 1
				j += move;									// Search from new position
			}
		}
		return legal;
	}

	legal_moves(i) {
		/**
		Get legal moves for the piece on square i, regardless of check.

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
				// Error check if on last row
				if (i < 8) {return [];}
				// Add forward move if empty
				if (this.board[i-8] == 0) {
					legal.push(i-8);
					// Check if you can jump two - valid on squares [48, 49, 50, 51, 52, 53, 54, 55]
					if (48 <= i <= 55 && this.board[i-16] == 0) {legal.push(i-16);}
				}
				// Add capture diagonal
				if (i % 8 != 0 && this.board[i-9] < 0) {legal.push(i-9);}
				if (i % 8 != 7 && this.board[i-7] < 0) {legal.push(i-7);}
				// Add en pasant - valid on squares [24, 25, 26, 27, 28, 29, 30, 31]
				if (24 <= i <= 31) {
					let a = this.prev_move[0], b = this.prev_move[1];
					if (a == i - 17 && b == i - 1) {legal.push(i - 9);}
					else if (a == i - 15 && b == i + 1) {legal.push(i - 7);}
				}
				return legal;

			case -10:
				// Error check if on last row
				if (i > 55) {return [];}
				// Move straight if empty
				if (this.board[i+8] == 0) {
					legal.push(i + 8);
					// Check double jump - valid on [ 8,  9, 10, 11, 12, 13, 14, 15]
					if (8 <= i <= 15 && this.board[i+16] == 0) {legal.push(i+16);}
				}
				// Capture diagonal
				if (i % 8 != 0 && this.board[i+7] < 0) {legal.push(i+7);}
				if (i % 8 != 7 && this.board[i+9] < 0) {legal.push(i+9);}
				// En pasant - valid on [32, 33, 34, 35, 36, 37, 38, 39]
				if (32 <= i <= 39) {
					let a = this.prev_move[0], b = this.prev_move[1];
					if (a == i + 15 && b == i - 1) {legal.push(i + 7);}
					else if (a == i + 17 && b == i + 1) {legal.push(i + 9);}
				}
				return legal;

			default:
				// Add castle
				return this.#legal_move_help(i);
		}
	}

	all_legal_moves(player=null) {
		/**
		Add all legal moves for a given player.
		*/
		let all_legal = {};

		if (player == 1) {
			// For all white pieces on board, add to object {position: [legal moves]}
			for (let i = 0; i < this.board.length; i++) {
				if (this.board[i] > 0) {
					all_legal[i] = this.legal_moves(i);
				}
			}
			return all_legal;

		} else if (player == -1) {
			for (let i = 0; i < this.board.length; i++) {
				if (this.board[i] < 0) {
					console.log(typeof(i))
					all_legal[i] = this.legal_moves(i);
				}
			}
			return all_legal;

		} else if (player == null) {
			return [this.all_legal_moves(player=1), this.all_legal_moves(player=-1)]
		} else {
			return {}
		}
	}


	// ============================== DISPLAY ============================== //
	// Deprecate. Make it sub-class
	stringify() {
		/**
		Stringify this.board into HTML table.
		*/
		let string = "";
		let letter = {0: '&nbsp', 10: 'P', 30: 'N', 31: 'B', 50: 'R', 90: 'Q', 1000: 'K', "-10": 'p', "-30": 'n', "-31": 'b', "-50": 'r', "-90": 'q', "-1000": 'k'}
		for (let i = 0; i < 8; i++) {
			string += "<tr>"
			for (let j = 0; j < 8; j++) {
				string += "<td>" + letter[this.board[8*i+j]] + "</td>";
			}
			string +=  "</tr>";
		}
		return string;
	}

	print(id) {
		let element = document.getElementById(id);
		let string = this.stringify();
		element.innerHTML = string;
	}
// }


// class ChessPlayer extends Board {

	
	
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
		let p = [  0,  0,  0,  0,  0,  0,  0,  0,
				  5, 10, 10,-20,-20, 10, 10,  5,
				  5, -5,-10,  0,  0,-10, -5,  5,
				  0,  0,  0, 20, 20,  0,  0,  0,
				  5,  5, 10, 25, 25, 10,  5,  5,
				 10, 10, 20, 30, 30, 20, 10, 10,
				  5,  5,  5,  5,  5,  5,  5,  5,
				  0,  0,  0,  0,  0,  0,  0,  0]

		// Value of pieces defined here
		for (let i = 0; i < this.board.length; i++) {
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
}