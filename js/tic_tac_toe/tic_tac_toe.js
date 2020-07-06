// tic tac toe


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


function end_game(){
	for(i=0;i<9;i++){
		document.getElementById("ttt_"+i).disabled = true;
	}
}


function ttt_reset_game(){
	var temp;
	for(i=0;i<9;i++){
		temp = document.getElementById("ttt_"+i);
		temp.value = 0;
		temp.innerHTML = "";
		temp.disabled = false;
	}

	document.getElementById("ttt_msg").innerHTML = "Click to play Tic Tac Toe!"
}


function get_board(){
	/* Populates the board directly with the values. */
	var board = [0,0,0, 0,0,0, 0,0,0];
	for(i=0;i<9;i++){
		board[i] = parseInt(document.getElementById("ttt_"+i).value);			// Does this case i to string?
	}
	return board;
}


function get_player(board){
	var X = 0;
	var O = 0;

	for(i=0;i<board.length;i++){
		switch(board[i]){
			case 0:
				break;
			case 1: //"X":
				X++;
				break;
			case 2: //"O":
				O++;
				break;
			default:
				console.log("Invalid player in get_player()");
		}
	}

	if(X <= O){
		return 1;//"X";
	}else if(O <= X){
		return 2;//"O";
	}else{
		return 0;//" ";
	}
}

function get_move(pushed_button, player){
	var char;
	switch(player){
		case 1:
			char = "X";
			break;
		case 2:
			char = "O";
			break;
		default:
			char = "?";
			break;
	}
	document.getElementById(pushed_button).innerHTML = char;
	document.getElementById(pushed_button).value = player;
	document.getElementById(pushed_button).disabled = true;

}

function ttt_main_buttons(pushed_button){
	var board = get_board();
	var state;
	var player = get_player(board);

	get_move(pushed_button, player);
	
	board = get_board();
	state = analyze_board(board);

	if(state == 1 || state == 2){
		document.getElementById("ttt_msg").innerHTML = "Player "+state+" won!";
		end_game();

	}else if(state == "3"){
		document.getElementById("ttt_msg").innerHTML = "Cat's Game!";
		end_game();
	}
}