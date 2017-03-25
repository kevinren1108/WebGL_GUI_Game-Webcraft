// This variable will store the WebGL rendering context
var gl;

//Define points for
var cubeVerts = 
[
	[ 0.5, 0.5, 0.5, 1], //0 b t r
	[ 0.5, 0.5,-0.5, 1], //1 f t r
	[ 0.5,-0.5, 0.5, 1], //2 b b r
	[ 0.5,-0.5,-0.5, 1], //3 f b r
	[-0.5, 0.5, 0.5, 1], //4 b t l
	[-0.5, 0.5,-0.5, 1], //5 f t l
	[-0.5,-0.5, 0.5, 1], //6 b b l
	[-0.5,-0.5,-0.5, 1], //7 f b l
];

var solidCubeStart = 0;
var solidCubeVertices = 36;

var cubeLookups = 
[
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

var points = [];
for (var i =0; i < cubeLookups.length; i++)
{
	points.push(cubeVerts[cubeLookups[i]]);
}

var left =  vec3(-1,0,0);
var right = vec3(1,0,0);
var down =  vec3(0,-1,0);
var up =    vec3(0,1,0);
var front = vec3(0,0,1);
var back =  vec3(0,0,-1);
var normals = [
               front, front, front, front, front, front,
               right, right, right, right, right, right,
               back, back, back, back, back, back,
               left, left, left, left, left, left,
               up, up, up, up, up, up,
               down, down, down, down, down, down
               ];

var texCoords =
[
    //Texture Coordinates for Solid Cube
    //Note that each face is the same.
    1, 1,	0, 1,	0, 0, // triangle 1
    1, 1,	0, 0,	1, 0, // triangle 2
    
    1, 1,	0, 1,	0, 0, // triangle 1
    1, 1,	0, 0,	1, 0, // triangle 2
    
    1, 1,	0, 1,	0, 0, // triangle 1
    1, 1,	0, 0,	1, 0, // triangle 2
    
    1, 1,	0, 1,	0, 0, // triangle 1
    1, 1,	0, 0,	1, 0, // triangle 2
    
    1, 1,	0, 1,	0, 0, // triangle 1
    1, 1,	0, 0,	1, 0, // triangle 2
    
    1, 1,	0, 1,	0, 0, // triangle 1
    1, 1,	0, 0,	1, 0, // triangle 2
];

var red = 		 [1.0, 0.0, 0.0, 1.0];
var green = 	 [0.0, 1.0, 0.0, 1.0];
var blue = 		 [0.0, 0.0, 1.0, 1.0];
var lightred =   [1.0, 0.5, 0.5, 1.0];
var lightgreen = [0.5, 1.0, 0.5, 1.0];
var lightblue =  [0.5, 0.5, 1.0, 1.0];
var white = 	 [1.0, 1.0, 1.0, 1.0];
var black =      [0.0, 0.0, 0.0, 1.0];
var dark = 		 [0.2, 0.2, 0.2, 1.0];



//Variables for Transformation Matrices
var mv = new mat4();
var p  = new mat4();
var mvLoc, projLoc;

//Variables for Lighting
var light;
var material;
var lighting;
var uColor;

var program;

var textures = [];
//----------------------------------------------------------------------------
// Texture Setup Function
//----------------------------------------------------------------------------
function setUpTextures()
{
    //Flip all textures - make sure pictures are right side up
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

    // Create Texture Name and Bind it as current
    textures[0] = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, textures[0]);
    
    //Set Texture Parameters
    // scale linearly when image bigger than texture    
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    // scale linearly when image smaller than texture
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    
    // Get image
    var image = document.getElementById("pic1");
    
    // Load image into texture object
    gl.texImage2D(gl.TEXTURE_2D,     // 2D texture
                 0,                 // level of detail 0 (full or no mipmap)
                 gl.RGB,	        // internal format - how GL will store tex.
                 gl.RGB,            // format of image data in memory
                 gl.UNSIGNED_BYTE,  // data type of image data in memory
                 image              // image itself - size is determined automatically
                 );

    //Connect texture units to samplers inside the shader
    gl.uniform1i(gl.getUniformLocation(program, "tex"), 0);
        
}

//----------------------------------------------------------------------------
// Initialization Event Function
//----------------------------------------------------------------------------
window.onload = function init()
{
	var canvas = document.getElementById("gl-canvas");	
	gl = WebGLUtils.setupWebGL(canvas);
	if (!gl)
	{
	alert("WebGL isn't available");
	}
	
	MouseMovement(canvas);
	
	//  Configure WebGL
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.enable(gl.DEPTH_TEST);
	
	//  Load shaders and initialize attribute buffers
	program = initShaders(gl, "vertex-shader", "fragment-shader");
	gl.useProgram(program);


	// Load the data into GPU data buffers and
	// Associate shader attributes with corresponding data buffers
	//***Vertices***
	vertexBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vertexBuffer );
    gl.bufferData( gl.ARRAY_BUFFER,  flatten(points), gl.STATIC_DRAW );
    program.vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer( program.vPosition, 4, gl.FLOAT, gl.FALSE, 0, 0 );
    gl.enableVertexAttribArray( program.vPosition );
    
	//***Normals***
    normalBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, normalBuffer );
    gl.bufferData( gl.ARRAY_BUFFER,  flatten(normals), gl.STATIC_DRAW );
    program.vNormal = gl.getAttribLocation(program, "vNormal");
    gl.vertexAttribPointer( program.vNormal, 3, gl.FLOAT, gl.FALSE, 0, 0 );
    gl.enableVertexAttribArray( program.vNormal );
	
	//***Texture Coordinates***
    texCoordBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, texCoordBuffer );
    gl.bufferData( gl.ARRAY_BUFFER,  flatten(texCoords), gl.STATIC_DRAW );
    program.vTexCoords = gl.getAttribLocation(program, "vTexCoord");
    gl.vertexAttribPointer( program.vTexCoords, 2, gl.FLOAT, gl.FALSE, 0, 0 );
    gl.enableVertexAttribArray( program.vTexCoords );
	
	// Get addresses of transformation uniforms
	projLoc = gl.getUniformLocation(program, "p");
	mvLoc = gl.getUniformLocation(program, "mv");


    //Set up viewport
	canvas.width = canvas.clientWidth;
	canvas.height = canvas.clientHeight;
	gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
	
	//Set up projection matrix
	p = perspective(45.0, canvas.clientWidth/canvas.clientHeight, 0.1, 1000.0);
	//p = ortho(-4,4,-4,4,2,13)	
	gl.uniformMatrix4fv(projLoc, gl.FALSE, flatten(p));

	// Get and set light uniforms
    light = [];   // array of light property locations (defined globally)
    var n = 1;    // number of lights - adjust to match shader
    for (var i = 0; i < n; i++)
    {
        light[i] = {};   // initialize this light object
        light[i].diffuse = gl.getUniformLocation(program,"light["+i+"].diffuse");
        light[i].ambient = gl.getUniformLocation(program,"light["+i+"].ambient");
        light[i].position = gl.getUniformLocation(program,"light["+i+"].position");
        light[i].specular = gl.getUniformLocation(program,"light["+i+"].specular");
        
        //initialize light 0 to default of white light coming from viewer
        if (i == 0)
        {
            gl.uniform4fv(light[i].diffuse, white);
            gl.uniform4fv(light[i].ambient, vec4(0.2, 0.2, 0.2, 1.0));
            gl.uniform4fv(light[i].position,vec4(0.0, 0.0, 1.0, 0.0));
            gl.uniform4fv(light[i].specular,white);
        }
        else //disable all other lights
        {
            gl.uniform4fv(light[i].diffuse, black);
            gl.uniform4fv(light[i].ambient, black);
            gl.uniform4fv(light[i].position,black);
        }
    }
    
    // Get and set material uniforms
    material = {};
    material.diffuse = gl.getUniformLocation(program, "material.diffuse");
    material.ambient = gl.getUniformLocation(program, "material.ambient");
    material.specular = gl.getUniformLocation(program, "material.specular");
    material.shininess = gl.getUniformLocation(program, "material.shininess");
    gl.uniform4fv(material.diffuse, vec4(0.8, 0.8, 0.8, 1.0));
    gl.uniform4fv(material.ambient, vec4(0.8, 0.8, 0.8, 1.0));
    gl.uniform4fv(material.specular, vec4(0.3, 0.3, 0.3, 1.0));
    gl.uniform1f(material.shininess, 15);
    
    // Get and set other lighting state
    lighting = gl.getUniformLocation(program, "lighting");
    uColor = gl.getUniformLocation(program, "uColor");
    gl.uniform1i(lighting, 1);
    gl.uniform4fv(uColor, white);
	
	setUpTextures();
	requestAnimFrame(animate);
};

var prevTime = 0;
function animate()
{
    requestAnimFrame(animate);
    //Do time corrected animation
    var curTime = new Date().getTime();
    if (prevTime != 0)
    {
       //Calculate elapsed time in seconds
       var timePassed = (curTime - prevTime)/1000.0;
       //Update any active animations 
       handleKeys(timePassed);
    }
    prevTime = curTime;
	
    //Draw
    render();
}

var sunAngle = 0;
function render() 
{
	gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

	var eye = vec3(charPos[0], charPos[1] , charPos[2]);
	var at =  vec3(0,0,0);
	var up =  vec3(0.0, 1.0, 0.0);
	at[0] = Math.sin(lookDir[0]+Math.PI/2)+charPos[0];
	at[1] = charPos[1] + lookDir[1];
	at[2] = -Math.cos(lookDir[0]+Math.PI/2)+charPos[2];
	mv = lookAt(eye,at,up);
	
	var skyBox = mult(mv, scale(42,42,42));
	gl.uniformMatrix4fv(mvLoc, gl.FALSE, flatten(skyBox));
	gl.drawArrays(gl.TRIANGLES, 0, 36);

    //gl.activeTexture(gl.TEXTURE0);
    //gl.bindTexture(gl.TEXTURE_2D, textures[0]);
	
	var cube = mult(mv, translate(0,0,0));
	gl.uniformMatrix4fv(mvLoc, gl.FALSE, flatten(cube));	
	gl.drawArrays(gl.TRIANGLES, 0, 36);

	var sun = mult(mv, rotateZ(sunAngle));
	sun =  mult(sun, translate(0,50,0));
	gl.uniformMatrix4fv(mvLoc, gl.FALSE, flatten(sun));	
	gl.uniform4fv(light[0].position, mult(transpose(sun),vec4(0,0,0,1)));
	gl.drawArrays(gl.TRIANGLES, 0, 36);
	
	sunAngle += 1;
	
	sunAngle = sunAngle % 360;
	if(sunAngle > 90 && sunAngle<270)
	{
		gl.uniform4fv(light[0].diffuse, dark);
        gl.uniform4fv(light[0].ambient, dark);
		gl.uniform4fv(light[0].specular,dark);	
	}
	else
	{
		gl.uniform4fv(light[0].diffuse, white);
        gl.uniform4fv(light[0].ambient, vec4(0.2, 0.2, 0.2, 1.0));
        gl.uniform4fv(light[0].specular,white);
	}	
}

