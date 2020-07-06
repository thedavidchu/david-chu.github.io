/*
var x = document.createElement('script');
x.src = 'http://example.com/test.js';
document.getElementsByTagName("head")[0].appendChild(x);
*/

function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev){
 	ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev){
	ev.preventDefault();								// Allow drop
	var data = ev.dataTransfer.getData("text");
	ev.target.appendChild(document.getElementById(data));
}

function setup_empty_chess_board(){
	var div;
	var br;
	var colour = false;
	var chess_board = document.getElementById("chess_board");

	for(i=0;i<8;i++){
		for(j=0;j<8;j++){
			// Create board
			div = document.createElement("div");

			div.innerHTML = populate_chess_pieces(i*8 + j); //"<img src='static/images/white-pawn.PNG'>"//
			//console.log(populate_chess_pieces(i*8 + j));
			div.id = "chess_" + (i*8 +j);
			div.ondrop=drop(event);
			div.ondragover=allowDrop(event);

			if(colour){
				div.style="background-color: black";
				colour = !colour;
			}else{
				div.style="background-color: white";
				colour = !colour;
			}

			chess_board.appendChild(div);
		}
		colour = !colour;
		// Insert line break
		br = document.createElement("br");
		chess_board.appendChild(br);
		br = document.createElement("br");
		chess_board.appendChild(br);
		br = document.createElement("br");
		chess_board.appendChild(br);
		br = document.createElement("br");
		chess_board.appendChild(br);
	}
	
}


function populate_chess_pieces(position){
	/* Generate Chess Pieces
		White : {Pawn: 10, Knight: 11, Bishop: 12, Rook: 13, Queen: 14, King: 15}
		Black : {Pawn: 20, Knight: 21, Bishop: 22, Rook: 23, Queen: 24, King: 25}
	*/
	var board = [
		23, 21, 22, 24, 25, 22, 21, 23,								// Row 8
		20, 20, 20, 20, 20, 20, 20, 20,								// Row 7
		 0,  0,  0,  0,  0,  0,  0,  0,								// Row 6
		 0,  0,  0,  0,  0,  0,  0,  0,								// Row 5
		 0,  0,  0,  0,  0,  0,  0,  0,								// Row 4
		 0,  0,  0,  0,  0,  0,  0,  0,								// Row 3
		10, 10, 10, 10, 10, 10, 10, 10,								// Row 2
		13, 11, 12, 14, 15, 12, 11, 13								// Row 1
	];

	var piece = board[position];
	var img;
	switch(piece){
		case 10:
			/*
			img = document.createElement("img");
			img.src = setAttribute("src", 'static/images/white-pawn.PNG');*/
			//img.src="static/images/white-pawn.PNG";								// Does not take ../../static/images/white-pawn.PNG
			return "<img src='static/images/white-pawn.PNG'>";
			return "P";
			break;		
		case 11:
			return "N";
			break;
		case 12:
			return "B";
			break;
		case 13:
			return "R";
			break;
		case 14:
			return "Q";
			break;
		case 15:
			return "K";
			break;

		case 20:
			return "p";
			break;
		case 21:
			return "n";
			break;
		case 22:
			return "b";
			break;
		case 23:
			return "r";
			break;
		case 24:
			return "q";
			break;
		case 25:
			return "k";
			break;
		default:
			return "";
	}

	return img;
}


function chess_main(){
	setup_empty_chess_board();
	populate_chess_pieces();
}