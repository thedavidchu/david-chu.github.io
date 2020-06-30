function blink_title(){
	var title_adventure = "Is this your idea of adventure?";
	var title_main = "David Chu - Main page"	

	switch(document.title){
		case title_adventure:
			document.title = title_main;
			break;
		case title_main:
			document.title = title_adventure;
			break;
		default:
			document.title = title_main;
			break;
	}
}