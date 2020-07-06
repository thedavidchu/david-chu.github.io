// Drag and drop icons

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