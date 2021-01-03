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

## Known bugs
	1. Allows you to put yourself/ leave yourself in check

## TODO
	1. Change piece weights to real value (i.e. 100 = pawn, etc.)
	2. Alpha-beta prune
*/


class Board {
	constructor(array=null, prev_move=null, turn=null, castle=null) {
		/**
		Construct the board.

		If all nulls, we initialize the board to the start of the game.

		:param array: array (64,) - array of the chess board. Change name to "board".
		:param prev_move: array (2,) - tuple of [previous start, previous finish].
		:param turn: int - tells which player's turn it is (+1 or -1).
		:param castle: array (4,) - tells which castles are legal.
		*/

		if (array == null) {
			this.board = [ -50, -30, -31, -90, -1000, -31, -30, -50, 
						   -10, -10, -10, -10,   -10, -10, -10, -10, 
							 0,   0,   0,   0,     0,   0,   0,   0, 
							 0,   0,   0,   0,     0,   0,   0,   0, 
							 0,   0,   0,   0,     0,   0,   0,   0, 
							 0,   0,   0,   0,     0,   0,   0,   0,
							10,  10,  10,  10,    10,  10,  10,  10,
							50,  30,  31,  90,  1000,  31,  30,  50,];
		}
		else {this.board = Array.from(array);}

		if (prev_move == null) {this.prev_move = [null, null];} 
		else {this.prev_move = Array.from(prev_move);}
		
		if (turn == null) {this.turn = 1;}
		else {this.turn = turn;}

		if (castle == null) {this.castle = [true, true, true, true];}	// [black left castle, black right castle, white left castle, white right castle], from white's perspective
		else {this.castle = Array.from(castle);}
	}

	// ============================== FRONT-END GET MOVES ============================== //
	get_move(i, j) {
		/**
		Steps:
			1. Check if there's a piece at i
			2. Check if legal move (check if en passant, check pawn promotion)
			3. Update castle
			4. Update previous move
			5. Update board
			6. Check for check/ check mate etc.

		:param i: move from here
		:param j: move to here
		:return: bool - whether legal move or not
		*/
		'use strict';

		// Check whose turn
		if (Math.sign(this.board[i]) == this.turn) {
			// Allow
		} else {return false;}

		// 1. Check if there is a piece at i
		if (this.board[i] == 0) {return false;}
		// 2. Check if legal move
		let legal = this.#legal_moves(i, true);
		if (!legal.includes(j)) {return false;}
		
		// Pawn promotion
		let promotion = null;
		if ((this.board[i] == 10 && 0 <= j && j <= 7) || (this.board[i] == -10 && 56 <= j && j <= 63)) {
			// Pawn promotion
			while (true){
				let temp = prompt("Promote to Queen (Q/q), Rook (R/r), Bishop (B/b), or Knight (N/n)?", "Q").toLowerCase();
				let dict = {queen: 90, rook: 50, bishop: 31, knight: 30, q: 90, r: 50, b: 31, n: 30, k: 30}
				if (["queen", "rook", "bishop", "knight", 'q', 'r', 'b', 'n', 'k'].includes(temp)) {
					promotion = dict[temp] * Math.sign(this.board[i]);
					break;
				}
			}
		}
		this.#move(i, j, promotion);
		return true;
	}

	#raw_move(i, j) {
		/**
		Move a piece from i to j without any checks.

		:param i: move from here
		:param j: move to here

		:return: none
		*/

		'use strict';

		this.board[j] = this.board[i];
		this.board[i] = 0;
	}

	#move(i, j, promotion) {
		/**
		Assume move is legal. Make this private.

		:param i: move from here
		:param j: move to here
		:param promotion: what to promot pawn to - NOTE: sign must be correct!

		:return: none
		*/

		'use strict';
		let piece = this.board[i];
		this.prev_move = [i, j];
		this.turn *= -1;

		switch (piece) {
			// Check if castle
			case 1000:
				if (i == 60) {		// Range = [R, 57, 58, 59, K, 61, 62, R]
					if (j == 58 && this.castle[2]) {this.#raw_move(56, 59);}
					else if (j == 62 && this.castle[3]) {this.#raw_move(63, 61);}
				}
				this.castle[2] = false;
				this.castle[3] = false;
				break;
			case -1000:
				if(i == 4) {		// Range = [24, 25, 26, 27, 28, 29, 30, 31]
					if (j == 2 && this.castle[0]) {this.#raw_move(0, 3); this.castle[0] = false; this.castle[1] = false;}
					else if (j == 6 && this.castle[1]) {this.#raw_move(7, 5); this.castle[0] = false; this.castle[1] = false;}
				}
				this.castle[0] = false;
				this.castle[1] = false;
				break;

			// Check en passant and promotion
			case 10:
				// En passant
				if (24 <= i && i <= 31 && this.board[j] == 0) { 		
					if (j - i == -9) {this.board[i-1] = 0;}
					else if (j - i == -7) {this.board[i+1] = 0;}
				// Pawn promotion
				} else if (0 <= j && j <= 7) {
					this.#raw_move(i, j);
					// Promote pawn -- give option
					if (promotion == null) {console.log('White promoted! Assumed queen'); this.board[j] = 90;}
					else {this.board[j] = promotion;}
					return;
				}
				break;
			case -10:
				// En passant
				if (32 <= i  && i <= 39 && this.board[j] == 0) {				// Range = [32, 33, 34, 35, 36, 37, 38, 39]
					if (j - i == 7) {this.board[i-1] = 0;}
					else if (j - i == 9) {this.board[i+1] = 0;}
				// Pawn promotion
				} else if (56 <= j  && j <= 63) {
					this.#raw_move(i, j);
					// Promote pawn -- give option
					if (promotion == null) {console.log('Black promoted! Assumed queen'); this.board[j] = -90;}
					else {this.board[j] = promotion;}
					return;
				}
				break;

			// Turn castle to false
			case 50:
				if (i == 56) {this.castle[2] = false;}
				else if (i == 63) {this.castle[3] = false;}
				break;
			case -50:
				if (i == 0) {this.castle[0] = false;}
				else if (i == 7) {this.castle[1] = false;}
				break;
			
			default:
				break;
		}

		// Move piece
		this.#raw_move(i, j);
	}

	// ============================== CHECK, MATE, AND THREATENING ============================== //
	#position_threatened(position, player) {
		/**
		Returns whether a position is under enemy attack.
		:param position: position id of interest.
		:param player: the player who is wondering whether they are being attacked.
		:return: bool - whether they are under attack.
		*/
		'use strict';

		let all_legal_obj = this.#all_legal_moves(-player, false);
		let all_legal = [];

		for (let move in all_legal_obj) {all_legal.push(all_legal_obj[move])};
		all_legal = all_legal.flat();

		if (Array.isArray(position)) {
			for (let i in position) {
				if (all_legal.includes(position[i])) {return true;}
			}
			return false;
		} else {
			return all_legal.includes(position);
		}
	}

	#check(player) {
		/**
		Check if the player is in check.
		:param player: player of interest
			- null: check both players
		:return: return if the player is in check.
		*/

		'use strict';
		if (player == null) {
			// Return true if either player is in check
			return this.#check(1) || this.#check(-1);
		} else if (player == 1 || player == -1) {
			let king_id = this.board.indexOf(player * 1000);
			return this.#position_threatened(king_id, player)
			
			return all_legal.includes(kind_id);
		} else {
			// ERROR!
			return false;
		}
	}

	#stale_mate(player) {
		/**
		Check if there are any legal moves left.

		NOT IMPLEMENTED
		*/
		'use strict';
		
		return false;
	}

	#check_mate(player) {
		/**
		Check if there is a check mate.
		Steps:
			1. Check if check
			2. Check if legal moves to get out of check

		NOT IMPLEMENTED
		*/
		// let check = this.#check(player=player);
		// let stale = this.#stale_mate(player=player);
		// return check && stale;

		'use strict';

		if (player == null) {return false;}
		else if (player == 1 || player == -1) {
			let king_id = this.board.indexOf(player * 1000);
			if (king_id == -1) {return true;} else {return false;}
		} else {return false;}		// ERROR!
	}

	check_win() {
		/**
		Halt play once a king has been captured.

		:return:
			- True if win
			- False if no win
		*/
		'use strict';
		let white = false, black = false;
		for (let i = 0; i < this.board.length; i++) {
			if (this.board[i] == 1000) {white = true;}
			else if (this.board[i] == -1000) {black = true;}
		}

		if (white && black) {return false;}
		else {
			let winner = null;
			this.init_print(); 
			if (white) {winner = "WHITE";}
			else if (black) {winner = "BLACK"} 
			alert(winner + " HAS WON!"); 
			return true;
		}
	}

	// ============================== LEGAL MOVES ============================== //
	// Not check if castle through/ move into check. Will have to do this separately

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

		'use strict';

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
				if (i > 55) {return false;} else if (i % 8 < 3) {return false;} else {return true;}
			case 10:
				if (i > 55) {return false;} else if (i % 8 > 5) {return false;} else {return true;}
			case 15:
				if (i > 47) {return false;} else if (i % 8 == 0) {return false;} else {return true;}
			case 17:
				if (i > 47) {return false;} else if (i % 8 == 7) {return false;} else {return true;}

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

	#legal_move_help(i, check_castle) {
		/**
		Private class. Help with non-pawn pieces. Also, does not check if a position will end up in check or checkmate.
		N.B. Does not check for castling yet!

		:param i: current position index
		*/

		'use strict';

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
				if (this.castle[2] && !this.board[57] && !this.board[58] && !this.board[59]) {
					if (check_castle) {
						if (!this.#position_threatened([60, 59, 58], 1)) {legal.push(58);}
					} else {legal.push(58);}
				}

				if (this.castle[3] && !this.board[61] && !this.board[62]) {
					if (check_castle) {
						if (!this.#position_threatened([60, 61, 62], 1)) {legal.push(62);}
					} else {legal.push(62);}
				}
				break;
			case -1000:
				max = 1;
				moves = [-9, -8, -7, -1, +1, +7, +8, +9];

				// Check black castle - valid on [ r,  1,  2,  3,  k,  5,  6,  r]
				if (this.castle[0] && !this.board[1] && !this.board[2] && !this.board[3]) {
					if (check_castle) {
						if (!this.#position_threatened([4, 3, 2], -1)) {legal.push(2);}
					} else {legal.push(2);}
				}
				if (this.castle[1] && !this.board[5] && !this.board[6]) {
					if (check_castle) {
						if (!this.#position_threatened([4, 5, 6], -1)) {legal.push(6);}
					} else {legal.push(6);}
				}
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
				if (this.board[j+move] != 0) {break;}			// BREAK if capture enemy
				else if (max == 1) {break;}					// BREAK if can only move 1
				j += move;									// Search from new position
			}
		}
		return legal;
	}

	get_legal_moves(i) {
		/**
		Get legal moves from the player.

		NOTE: Do not allow castling through check!

		:param i: position of interest.
		:return: array - legal moves.
		*/

		'use strict';

		if (Math.sign(this.board[i]) == this.turn) {
			return this.#legal_moves(i, true);
		} else {
			return [];
		}
	}

	#legal_moves(i, check_castle) {
		/**
		Get legal moves for the piece on square i, regardless of check.

		Board moves:
			-9, -8, -7,
			-1,	 0, +1,
			+7, +8, +9


		:param i: index of piece
		:return: array - legal moves.
		*/

		'use strict';

		let piece = this.board[i];
		let player = Math.sign(piece);
		let legal = [];
		let move = null;

		switch (piece) {
			case 0:
				return [];
			case 10:
				// Error check if on last row
				if (i < 8) {return [];}
				// Add forward move if empty
				if (this.board[i-8] == 0) {
					legal.push(i-8);
					// Check if you can jump two - valid on squares [48, 49, 50, 51, 52, 53, 54, 55]
					if (48 <= i && i <= 55 && this.board[i-16] == 0) {legal.push(i-16);}
				}
				// Add capture diagonal
				if (i % 8 != 0 && this.board[i-9] < 0) {legal.push(i-9);}
				if (i % 8 != 7 && this.board[i-7] < 0) {legal.push(i-7);}
				// Add en passant - valid on squares [24, 25, 26, 27, 28, 29, 30, 31]
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
					if (8 <= i && i <= 15 && this.board[i+16] == 0) {legal.push(i+16);}
				}
				// Capture diagonal
				if (i % 8 != 0 && this.board[i+7] > 0) {legal.push(i+7);}
				if (i % 8 != 7 && this.board[i+9] > 0) {legal.push(i+9);}
				// En passant - valid on [32, 33, 34, 35, 36, 37, 38, 39]
				if (32 <= i && i <= 39) {
					let a = this.prev_move[0], b = this.prev_move[1];
					if (a == i + 15 && b == i - 1) {legal.push(i + 7);}
					else if (a == i + 17 && b == i + 1) {legal.push(i + 9);}
				}
				return legal;

			default:
				// Add castle
				return this.#legal_move_help(i, check_castle);
		}
	}

	#all_legal_moves(player, check_castle) {
		/**
		Add all legal moves for a given player.

		:param player: which player to check
		:param check_castle: whether to check for castling ability.
		*/

		'use strict';

		let all_legal = {};

		if (player == 1 || player == -1) {
			// For all pieces on board, add to object {position: [legal moves]}
			for (let i = 0; i < this.board.length; i++) {
				if (player == Math.sign(this.board[i])) {
					all_legal[i] = this.#legal_moves(i, check_castle);
				}
			}
			return all_legal;

		} else if (player == null) {
			return [this.#all_legal_moves(1, check_castle), this.#all_legal_moves(-1, check_castle)]
		} else {
			return {};
		}
	}


	// ============================== FRONT-END DISPLAY ============================== //
	// Deprecate. Make it sub-class
	#init_stringify() {
		/**
		Stringify this.board into HTML table.
		*/

		'use strict';

		let string = "";
		let letter = {0: '&nbsp;', 10: 'P', 30: 'N', 31: 'B', 50: 'R', 90: 'Q', 1000: 'K', "-10": '<b>p</b>', "-30": '<b>n</b>', "-31": '<b>b</b>', "-50": '<b>r</b>', "-90": '<b>q</b>', "-1000": '<b>k</b>'};
		let k = null;
		for (let i = 0; i < 8; i++) {
			string += "<tr>"
			for (let j = 0; j < 8; j++) {
				k = 8*i + j;
				if ((i % 2 == 0 && j % 2 == 0) || (i % 2 == 1 && j % 2 == 1)) {
					// Colour dark - style='background-color: black;'
					string += "<td id='"+ k + "-chess' class='table-secondary'>" + letter[this.board[k]] + "</td>";
				} else {
					// Colour light
					string += "<td id='"+ k + "-chess'>" + letter[this.board[k]] + "</td>";
				}
			}
			string +=  "</tr>";
		}
		return string;
	}

	init_print(id="chess_board") {
		/**
		Set up initial chess board.
		*/
		let element = document.getElementById(id);
		let string = this.#init_stringify();
		element.innerHTML = string;
	}

	print(id="chess_board") {
		/**
		Update chess board.
		*/
		let element = null;
		let letter = {0: '&nbsp;', 10: 'P', 30: 'N', 31: 'B', 50: 'R', 90: 'Q', 1000: 'K', "-10": '<b>p</b>', "-30": '<b>n</b>', "-31": '<b>b</b>', "-50": '<b>r</b>', "-90": '<b>q</b>', "-1000": '<b>k</b>'};
		for (let i = 0; i < this.board.length; i++) {
			element = document.getElementById(i + "-chess");
			element.innerHTML = letter[this.board[i]];
		}
	}
	
	// ============================== AI PLAY ============================== //
	#evaluate() {
		/**
		Evaluate the value of pieces on the board.

		Note: Bishop is worth 301 centipawns, while knight is worth 300.

		:return: int - value of board with respect to the player (i.e. higher is better for that player).
		*/
		'use strict';

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
		return tally;
	}

	#simulate(player, layers) {
		/**
		Simulate 1 layer for now.
		
		Ideal format:
			- {[a, b, c]: [evaluation, [{}, {}, ..., {}] ], [a2, b2, c2]: [evaluation2, [{}, {}, ..., {}] ]}
		Practical format:
			- [[[a, b, c], evaluation, [all possible moves]], [...], ...]

		** N.B. Due to minmax tree, we only need to evaluate the leaves.
		** If player has won, do not search further

		:param player: int - player (+1 or -1).
		:param layers: int - number of layers to iterate through.
		*/
		'use strict';

		let possible = [];
		let sim = null;
		let promotion_pieces = [90, 50, 31, 30];
		let turn = null;
		
		// Check player
		if (player != null) {turn = player;}
		else {turn = this.turn;}

		let all_legal = this.#all_legal_moves(turn, true);

		// While there are more layers to search
		if (layers > 0) {
			// Check each piece
			for (let a in all_legal) {
				a = parseInt(a);
				// Check each legal move for that piece
				for (let b of all_legal[a]) {
					if (this.board[a] == 10 && 0 <= b && b <= 7) {
						// Check all white pawn promotion
						for (let c of promotion_pieces) {
							sim = new Board(this.board, this.prev_move, this.turn, this.castle);
							sim.#move(a, b, c);
							possible.push([[a, b, c], sim.#evaluate(), sim.#simulate(-turn, layers-1)]);
						}
					} else if (this.board[a] == -10 && 56 <= b && b <= 63) {
						// Check all black pawn promotion
						for (let c of promotion_pieces) {
							sim = new Board(this.board, this.prev_move, this.turn, this.castle);
							sim.#move(a, b, -c);
							possible.push([[a, b, c], sim.#evaluate(), sim.#simulate(-turn, layers-1)]);
						}
					} else {
						// Moves
						sim = new Board(this.board, this.prev_move, this.turn, this.castle);
						sim.#move(a, b);
						possible.push([[a, b, null], sim.#evaluate(), sim.#simulate(-turn, layers-1)]);
					}
					
				}
			}
		}
		return possible;
	}

	#naive_best_move_help(player, possible) {
		/**
		:param player:
		:param possible:
			- [[[a, b, c], evaluation, [all possible moves]], [...], ...]
		*/
		'use strict';

		if (possible.length == 0) {
			return;
		} else {
			if (player == 1) {
				// White, find max
				let max = [null, -Infinity];
				let temp = null;

				for (let i in possible) {
					temp = this.#naive_best_move_help(-player, possible[i][2]);
					if (temp == undefined) {
						temp = [possible[i][0], possible[i][1]];
					}

					if (temp[1] > max[1]) {
						max = [possible[i][0], temp[1]];
					}
				}
				return max;

			} else if (player == -1) {
				// Black, find min
				let min = [null, Infinity];
				let temp = null;
				for (let i in possible) {
					temp = this.#naive_best_move_help(-player, possible[i][2]);
					if (temp == undefined) {
						temp = [possible[i][0], possible[i][1]];
					}
					if (temp[1] < min[1]) {
						min = [possible[i][0], temp[1]];
					}
				}
				return min;
			}
		}
	}

	#naive_best_move(player, layers){
		'use strict';
		let turn = null;
		
		// Check player
		if (player != null) {turn = player;}
		else {turn = this.turn;}

		let possible = this.#simulate(turn, layers);
		let best_move = this.#naive_best_move_help(turn, possible);

		console.log(best_move);
		return best_move;
	}

	naive_play_game(layers) {
		'use strict';
		let best_move = null;
		let i = null, j = null, k = null;

		// {Take a turn
		if (!this.check_win()) {
			best_move = this.#naive_best_move(this.turn, layers);
			i = best_move[0][0];
			j = best_move[0][1];
			k = best_move[0][2];

			this.#move(i, j, k);
			this.print();

			$("td").removeClass("table-info");

			$("#"+i+"-chess").addClass("table-info");
			$("#"+j+"-chess").addClass("table-info");
		}
	}

	#legal_triple() {
		/**
		Convert legal moves to [hence, hither, promotion].
		:return: [[a, b, c], ...]
		*/
		'use strict';

		let all_legal_obj = this.#all_legal_moves(this.turn, true);
		let promotion_pieces = [90, 50, 31, 30];
		let triple = [];
		for (let a in all_legal_obj) {
			a = parseInt(a);
			for (let b of all_legal_obj[a]) {
				// Check all white pawn promotion
				if (this.board[a] == 10 && 0 <= b && b <= 7) {
					for (let c of promotion_pieces) {triple.push([a, b, c]);}
				// Check all black pawn promotion
				} else if (this.board[a] == -10 && 56 <= b && b <= 63) {
					for (let c of promotion_pieces) {triple.push([a, b, -c]);}
				// No promotion
				} else {triple.push([a, b, null]);}
			}
		}
		return triple;
	}

	#alpha_beta(layers, alpha, beta, player) {
		/**
		Call alpha-beta pruned tree.

		Initial call: alpha_beta(origin, depth, -Infinity, +Infinity, 1)

		:param board: board that we want
		:param layers:
		:param alpha:
		:param beta:
		:param player:
		*/

		'use strict';
		let legal = this.#legal_triple();

		if (layers <= 0 || legal.length == 0) {
			return [null, this.#evaluate()];
		} else if (player == 1) {
			let value = [null, -Infinity];
			for (let i = 0; i < legal.length; i++) {
				let child = new Board(this.board, this.prev_move, this.turn, this.castle);
				child.#move(...legal[i]);
				// Find max
				let prune = child.#alpha_beta(layers-1, alpha, beta, -1);
				if (prune[1] > value[1]) {
					value = prune;
				}
				// Find alpha
				alpha = Math.max(alpha, value[1]);
				if (alpha >= beta) {break;}
			}
			return value;
		} else if (player == -1) {
			let value = [null, +Infinity];
			for (let i = 0; i < legal.length; i++) {
				let child = new Board(this.board, this.prev_move, this.turn, this.castle);
				child.#move(...legal[i]);
				// Find min
				let prune = child.#alpha_beta(layers-1, alpha, beta, +1);
				if (prune[1] < value[1]) {
					value = prune;
				}
				// Find beta
				beta = Math.min(beta, value[1]);
				if (beta <= alpha) {break;}
			}
			return value;
		}
	}

	play_game(layers) {
		/**
		Play game using alpha-beta pruning.
		*/
		'use strict';
		let best_move = this.#alpha_beta(layers, -Infinity, +Infinity, this.turn);
		let i = null, j = null, k = null;

		// {Take a turn
		if (!this.check_win()) {
			best_move = this.#naive_best_move(this.turn, layers);
			i = best_move[0][0];
			j = best_move[0][1];
			k = best_move[0][2];

			this.#move(i, j, k);
			this.print();

			$("td").removeClass("table-info");

			$("#"+i+"-chess").addClass("table-info");
			$("#"+j+"-chess").addClass("table-info");
		}
	}
}
/*

*/