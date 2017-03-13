/*
* boxes.cpp
* An exercise in positioning simple boxes using projection/modelview
* matrices and standard transforms.
*
* Adapted for WebGL by Alex Clarke, 2016.
*/


//----------------------------------------------------------------------------
// Variable Setup
//----------------------------------------------------------------------------

// This variable will store the WebGL rendering context
var gl;

//Data Buffers
var colors = [];

var points = 
[
	[ 0.5, 0.5, 0.5, 1], //0
	[ 0.5, 0.5,-0.5, 1], //1
	[ 0.5,-0.5, 0.5, 1], //2
	[ 0.5,-0.5,-0.5, 1], //3
	[-0.5, 0.5, 0.5, 1], //4
	[-0.5, 0.5,-0.5, 1], //5
	[-0.5,-0.5, 0.5, 1], //6
	[-0.5,-0.5,-0.5, 1], //7	
];
var elements = [
	0,4,6, //front
	0,6,2,
	1,0,2, //right
	1,2,3, 
	5,1,3, //back
	5,3,7,
	4,5,7, //left
	4,7,6,
	4,0,1, //top
	4,1,5,
	6,7,3, //bottom
	6,3,2,
];


for (var i = 0; i <  36; i++)
{
	points.push(points[elements[i]]);

}

var red = 		 [1.0, 0.0, 0.0, 1.0];
var green = 	 [0.0, 1.0, 0.0, 1.0];
var blue = 		 [0.0, 0.0, 1.0, 1.0];
var lightred =   [1.0, 0.5, 0.5, 1.0];
var lightgreen = [0.5, 1.0, 0.5, 1.0];
var lightblue =  [0.5, 0.5, 1.0, 1.0];
var white = 	 [1.0, 1.0, 1.0, 1.0];

var colors = [

	blue, blue, blue, red, red, red,
	green, green, green, red, red, red,
	red, red, red, red, red, red,
	red, red, red, red, red, red,
	red, red, red, red, red, red,
	red, red, red, red, red, red,

	/*lightblue, lightblue, lightblue, lightblue, lightblue, lightblue,
	lightgreen, lightgreen, lightgreen, lightgreen, lightgreen, lightgreen,
	lightred, lightred, lightred, lightred, lightred, lightred,
	blue, blue, blue, blue, blue, blue,
	red, red, red, red, red, red,
	green, green, green, green, green, green,*/
];

//Variables for Transformation Matrices
var mv = new mat4();
var p  = new mat4();
var mvLoc, projLoc;

var program;
var canvas
var axesBuffer;
var elementBuffer;
//----------------------------------------------------------------------------
// Initialization Event Function
//----------------------------------------------------------------------------
window.onload = function init() {
	// Set up a WebGL Rendering Context in an HTML5 Canvas
	canvas = document.getElementById("gl-canvas");
	gl = WebGLUtils.setupWebGL(canvas);
	if (!gl) {
	alert("WebGL isn't available");
	}

	//  Configure WebGL
	//  eg. - set a clear color
	//      - turn on depth testing
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.enable(gl.DEPTH_TEST);
	//  Load shaders and initialize attribute buffers
	//ALEX: program was declared here
	program = initShaders(gl, "vertex-shader", "fragment-shader");
	gl.useProgram(program);


	// Load the data into GPU data buffers and
	// Associate shader attributes with corresponding data buffers
	//***Vertices***
	var vertexBuffer = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, vertexBuffer );
	gl.bufferData( gl.ARRAY_BUFFER,  flatten(points), gl.STATIC_DRAW );
	program.vPosition = gl.getAttribLocation(program, "vPosition");
	gl.vertexAttribPointer( program.vPosition, 4, gl.FLOAT, gl.FALSE, 0, 0 );
	gl.enableVertexAttribArray( program.vPosition );

	var colorBuffer = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, colorBuffer );
	gl.bufferData( gl.ARRAY_BUFFER,  flatten(colors), gl.STATIC_DRAW );
	program.vColor = gl.getAttribLocation(program, "vColor");
	gl.vertexAttribPointer( program.vColor, 4, gl.FLOAT, gl.FALSE, 0, 0 );
	gl.enableVertexAttribArray( program.vColor );

	//***Elements***
	//Only one elements buffer may be active at once
	//It controls order of access to all array buffers
	//Details are specified at draw time rather than with a pointer call
	elementBuffer = gl.createBuffer();
	gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, elementBuffer );
	gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, Uint16Array.from(elements), gl.STATIC_DRAW );


	// Get addresses of shader uniforms
	projLoc = gl.getUniformLocation(program, "p");
	mvLoc = gl.getUniformLocation(program, "mv");


	//Set up viewport
	canvas.width = canvas.clientWidth;
	canvas.height = canvas.clientHeight;
	gl.viewport(0, 0, canvas.width, canvas.height);

	//Set up projection matrix
	p = perspective(60.0, canvas.clientWidth/canvas.clientHeight, 0.1, 1000.0);
	gl.uniformMatrix4fv(projLoc, gl.FALSE, flatten(p));

	document.onkeypress = keypress;
	requestAnimFrame(render);
	
};



var r = 0;
var verticalMove = 0;
var horizontalMove = 0;




//----------------------------------------------------------------------------
// Rendering Event Function
//----------------------------------------------------------------------------
function render() {
	//Set up viewport
	canvas.width = canvas.clientWidth;
	canvas.height = canvas.clientHeight;
	gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

	//Set up projection matrix
	p = perspective(45.0, canvas.clientWidth/canvas.clientHeight, 0.1, 1000.0);
	gl.uniformMatrix4fv(projLoc, gl.FALSE, flatten(p));

	gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

	//Set initial view
	var eye = vec3(horizontalMove, 0 , verticalMove);
	var at =  vec3(horizontalMove, 0.0, 0.0);
	var up =  vec3(0.0, 1.0, 0.0);
	r += 0.5; 
	mv = lookAt(eye,at,up);
	//mv = mult(mv, rotateX(r));
	//mv = mult(mv, rotateY(r));

	gl.uniformMatrix4fv(mvLoc, gl.FALSE, flatten(mv));	
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elementBuffer);
	gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);


	requestAnimFrame(render);
}

function keypress(e)
{
	var currKey=0,e=e||event;
	currKey=e.keyCode||e.which||e.charCode;
	
	console.log(e.keyCode);
	
	switch (currKey)
	{
	case 119://key w 
		
		verticalMove -= 0.5;
		break;
	case 115://key s
		
		verticalMove += 0.5;
		break;
	case 97://key a
		horizontalMove -= 0.5;
	
		break;
	case 100://key d
		horizontalMove += 0.5;

		break;
	}
}
