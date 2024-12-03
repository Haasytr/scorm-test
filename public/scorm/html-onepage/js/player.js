var finalizado = false;



function controlaScroll() {


	if ( (document.documentElement.scrollTop  >= 44000) && !finalizado  ) {
		finalizado = true;
		finalizaIntro();

	}
  
}



$(document).ready(function(){
	window.onscroll = function() {controlaScroll()};
	loadPage();
} )

$( window ).unload(function() {
  unloadPage();
});