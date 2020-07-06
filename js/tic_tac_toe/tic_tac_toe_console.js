// tic tac toe console. Not sure if it works still.

function init_board(){

	return [0,0,0, 0,0,0, 0,0,0];
}

function print_board(game_board){
	var board = [0,0,0, 0,0,0, 0,0,0];
	for(i=0;i<game_board.length;i++){
		switch(game_board[i]){
			case 0:
				board[i] = i;
				break;
			case 1:
				board[i] = "X";
				break;
			case 2:
				board[i] = "O";
				break;
			default:
				break;
		}
	}
	console.log(' %s | %s | %s \n-----------\n %s | %s | %s \n-----------\n %s | %s | %s ',board[0],board[1],board[2],board[3],board[4],board[5],board[6],board[7],board[8]);
}


function check_move(move,board){
	/* Check if move is valid. Return false if not AND true if valid. */
	console.log(board.length);
	var move = parseInt(move);							// Would this change the passed in variable?
	if(typeof(move) != "number"){						// Check if a number (must also be int)
		console.log('Type of move:', typeof(move));
		return false;
	}else if(move < 0 || move > board.length - 1){		// Check if in bounds
		console.log('Exceeds bounds');
		return false;
	}else if(board[move]!=0){							// Check move is onto empty square
		console.log('Occupied space');
		return false;
	}else{
		return true;									// Return true if all filters are clear
	}
}


function get_move(player, board){
	/* Retrieve the move from the player and place the move on the board. */
	var move = parseInt(window.prompt("Enter move:"));
	console.log('board:', board);
	console.log('Move:', move);
	valid = check_move(move, board);                    // Check if valid move
	// If valid move, input into database
	if(valid){
		board[move] = player;
		return board;
	}else{
		console.log('Invalid move!');
		return 0;//get_move(player, board);
	}
}


function toggle_player(player){
	if(player==1){
		player = 2;										// Does this change the player outside of the function?
	}else if(player==2){
		player = 1;
	}else{
		console.log('Invalid player!');
		player = player;
	}
	return player;
}
function analyze_board(board){
	/* Check board conditions. It will return 0 if the game is still in play OR the player number that won OR 3 if the game is a draw */
	var draw=true;
	// 012
	// 345
	// 678
	// Check win conditions. (012,345,678; 036,147,258; 048,246)
	/*  */if(board[0]==board[1] && board[0]==board[2] && board[0]!=0){
		return board[0];
	}else if(board[3]==board[4] && board[3]==board[5] && board[3]!=0){
		return board[3];
	}else if(board[6]==board[7] && board[6]==board[8] && board[6]!=0){
		return board[6];
	}else if(board[0]==board[3] && board[0]==board[6] && board[0]!=0){
		return board[0];
	}else if(board[1]==board[4] && board[1]==board[7] && board[1]!=0){
		return board[1];
	}else if(board[2]==board[5] && board[2]==board[8] && board[2]!=0){
		return board[2];
	}else if(board[0]==board[4] && board[0]==board[8] && board[0]!=0){
		return board[0];
	}else if(board[2]==board[4] && board[2]==board[6] && board[2]!=0){
		return board[2];
	}

	for(i=0;i<board.length;i++){
		draw=true;
		if(board[i]==0){
			draw=false;
			break;
		}
	}
	if(draw==true){
		// Draw. Return 3.
		return 3;
	}else{
		// Game in play
		return 0;
	}
}


function ttt_main_console(){
	var board = init_board();
	var player = 1;
	var state = 0;
	print_board(board);

	for(i=0;i<board.length;i++){
		console.log(board);
		get_move(player, board);
		print_board(board);
		state = analyze_board(board);
		if(state==0){
			player = toggle_player(player);
		}else{
			console.log("State is", state);
			break;
		}
	}
	return state;
}