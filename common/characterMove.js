var mouseX = 0;
var mouseY = 0;

var charPos = vec3(-3,3,3);
var lookDir = [-0.75,-0.75];


//----------------------------------------------------------------------------
// Keyboard Event Functions
//----------------------------------------------------------------------------

//This array will hold the pressed or unpressed state of every key
var currentlyPressedKeys = [];

//Store current state of shift key
var shift;

document.onkeydown = function handleKeyDown(event) {
   currentlyPressedKeys[event.keyCode] = true;
   shift = event.shiftKey;

   //Get unshifted key character
   var c = event.keyCode;
   var key = String.fromCharCode(c);

	//Place key down detection code here
}

document.onkeyup = function handleKeyUp(event) {
   currentlyPressedKeys[event.keyCode] = false;
   shift = event.shiftKey;
   
   //Get unshifted key character
   var c = event.keyCode;
   var key = String.fromCharCode(c);

	//Place key up detection code here
}

//isPressed(c)
//Utility function to lookup whether a key is pressed
//Only works with unshifted key symbol
// ie: use "E" not "e"
//     use "5" not "%"
function isPressed(c)
{
   var code = c.charCodeAt(0);
   return currentlyPressedKeys[code];
}

//Continuously called from animate to cause model updates based on
//any keys currently being held down
function handleKeys(timePassed) 
{
   //Place continuous key actions here - anything that should continue while a key is
   //held

   //Calculate how much to move based on time since last update
   var s = 60.0; //degrees per second
   var d = s*timePassed; //degrees to rotate
   
   if(document.pointerLockElement)
   {
   if (isPressed("S")) 
   {
	   charPos[0] -= Math.sin(lookDir[0]+Math.PI/2) * 0.04 * d;
	   charPos[2] -= -Math.cos(lookDir[0]+Math.PI/2) * 0.04* d;
		
		//charPos[0] -= 0.04* d;
   }
   if (isPressed("W")) 
   {
	   charPos[0] += Math.sin(lookDir[0]+Math.PI/2) * 0.04 * d;
		charPos[2] += -Math.cos(lookDir[0]+Math.PI/2) * 0.04 * d;
		
		//charPos[0] += 0.04* d;
   }
   if (isPressed("A")) 
   {
		charPos[0] -= Math.cos(lookDir[0]+Math.PI/2) * 0.04 * d;
		charPos[2] -= Math.sin(lookDir[0]+Math.PI/2) * 0.04 * d;
		
		
   }
   if (isPressed("D")) 
   {
		charPos[0] += Math.cos(lookDir[0]+Math.PI/2) * 0.04 * d;
		charPos[2] += Math.sin(lookDir[0]+Math.PI/2) * 0.04 * d;
   }
   if (isPressed("E")) 
   {
		charPos[1] -= 0.04* d;
   }
   if (isPressed("Q")) 
   {
		charPos[1] += 0.04* d;
   }
   }
   
}


//----------------------------------------------------------------------------
// Mouse Event Functions
//----------------------------------------------------------------------------
function MouseMovement(canvas)
{
	canvas.addEventListener('mousedown', function(e) 
	{
        canvas.requestPointerLock();
    }, false);
	
	canvas.addEventListener("mousemove", function(event) {

        if(document.pointerLockElement) {

             lookDir[0] += (event.movementX / 200);
             lookDir[1] += (-event.movementY / 200);
        }

        if(lookDir[1] >= Math.PI/2) {
            lookDir[1] = Math.PI/2;
        } else if(lookDir[1] <= -Math.PI/2) {
            lookDir[1] = -Math.PI/2;
        }
    }, false);
}