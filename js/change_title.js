function change_title(source){
	switch(source){
		case "Home":
			document.title = "David Chu - Main page";
			break;
		case "Intro":
			document.title = "David Chu - Intro";
			break;
		case "About":
			document.title = "David Chu - About";
			break;
		case "Portfolio":
			document.title = "David Chu - Portfolio";
			break;
		case "Contact":
			document.title = "David Chu - Contact";
			break;
		default:
			if(document.title == "Is this your idea of adventure?"){
				change_title("Home");
			}else{
				document.title = "Is this your idea of adventure?";
			}
			break;
	}
}