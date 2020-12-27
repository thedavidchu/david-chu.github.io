/**
# Print Board

## Functionality

Print the board.
*/



function stringify_board(board, N=8, M=8) {
	/**
	Stringify the board of dimensions N x M. Note, board is a 1D array of length NxM.

	:param board: 1D array of board
	:param N: number of rows
	:param M: number of columns

	*/
	let str_board = "";
	for (let i = 0; i < N; i++) {
		for (let j = 0; j < M; j++) {
			str_board += " "
		}
	}
	return str_board;
}


function print_board(board, id="chess_board") {

}