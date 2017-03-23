var mouseX = 0;
var mouseY = 0;

var charPos = vec3(0,0,0);
var lookDir = [0,0];



function keypress(e)
{
	var currKey=0,e=e||event;
	currKey=e.keyCode||e.which||e.charCode;
	
	switch (currKey)
	{
	case 119://key w 
		
		//verticalMove -= 0.5;
		charPos[0] += Math.sin(lookDir[0]+Math.PI/2);
		charPos[2] += -Math.cos(lookDir[0]+Math.PI/2);
		
		break;
	case 115://key s
		
		charPos[0] -= Math.sin(lookDir[0]+Math.PI/2);
		charPos[2] -= -Math.cos(lookDir[0]+Math.PI/2);
		
		break;
	case 97://key a
		//horizontalMove -= 0.5;
	
		break;
	case 100://key d
		//horizontalMove += 0.5;

		break;
	}
}

function mouseMove(ev) 
{ 
Ev= ev || window.event; 
var mousePos = mouseCoords(ev); 
var myx = mousePos.x; 
var myy = mousePos.y; 

//mouseX = Math.round((myx - canvas.clientWidth/2)/80);
//mouseY = Math.round(-(myy - canvas.clientHeight/2)/80);

 var dx = mouseX - myx;
 var dy = mouseY - myy;
 
 lookDir[0] -= dx*.001;
 lookDir[1] += dy*.001;
 
 mouseX = myx;
 mouseY = myy;
} 

function mouseCoords(ev) 
{ 
if(ev.pageX || ev.pageY)
{ 
return {x:ev.pageX, y:ev.pageY}; 
} 
return{ 
x:ev.clientX + document.body.scrollLeft - document.body.clientLeft, 
y:ev.clientY + document.body.scrollTop - document.body.clientTop 
}; 
}
