"use strict";

var canvas;
var gl;
var program;

var projectionMatrix;
var modelViewMatrix;
var instanceMatrix;
var modelViewMatrixLoc;

var pointsArray = [];
var normalsArray = [];

var boolWalkF = false;
var boolWalkF2 = false;

var boolWalkB = false;
var boolWalkB2 = false;



var boolWag = false;
var boolWag2 = false;

var boolJump = false;
var boolJump2 = false;

var Walk = 0;
var Walk2 = 0;
var step = 0;
var step2 = 0;


var Jump = 0;
var Jump2 = 0;

var Wag = 0;
var Wag2 = 0;

var a = 0.01;
var a2 = 0.02;
var a3 = 0.02;
var b = 0.4;
var b2 = 0.5;
var c = 0.02;
var c2 = 1;
var check = false;
var check2 = false;
var check3 = false;
var check4 = false;

var vertices = [
    vec4(-0.5, -0.5,  0.5, 1.0 ),
    vec4(-0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.5, -0.5,  0.5, 1.0 ),
    vec4(-0.5, -0.5, -0.5, 1.0 ),
    vec4(-0.5,  0.5, -0.5, 1.0 ),
    vec4( 0.5,  0.5, -0.5, 1.0 ),
    vec4( 0.5, -0.5, -0.5, 1.0 )
];

// Initialize light and material variables

//



var lightPosition = vec4(-1.0, 4.0, 2.0, 0.0 );
var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

var materialAmbient = vec4( 1.0, 0.0, 1.0, 1.0 );
var materialDiffuse = vec4( 1.0, 0.8, 0.2, 1.0);
var materialSpecular = vec4( 1.0, 0.8, 0.0, 1.0 );
var materialShininess = 100.0;


var torsoId = 0;
var torsoId2 = 12;
var headId  = 1;
var head1Id = 1;
var head2Id = 10;
//
var leftUpperArmId = 2;
var leftLowerArmId = 3;
var rightUpperArmId = 4;
var rightLowerArmId = 5;
var leftUpperLegId = 6;
var leftLowerLegId = 7;
var rightUpperLegId = 8;
var rightLowerLegId = 9;
var tailId = 11;
var tailId2 = 13;
var leftUpperArmId2 = 14;
var rightUpperArmId2 = 15;
var leftUpperLegId2 = 16;
var rightUpperLegId2 = 17

var leftLowerArmId2 = 18;
var rightLowerArmId2 = 19;
var leftLowerLegId2 = 20;
var rightLowerLegId2 = 21;

var headId2  = 22;
var head1Id2 = 22;
var head2Id2 = 23;

var torsoHeight2 = 2.5;
var torsoWidth2 = 5.0;
var torsoDepth2 = 10;
//////////////
var torsoHeight = 7;
var torsoWidth = 7;
var torsoDepth = 7;
//
var tailHeight = 2.5;
var tailWidth = 1.0;
//////////////
var tailHeight2 = 2.25;
var tailWidth2 = 4.0;
var taildepth2 = 3.0;
//
var upperArmHeight = 3.0;
var lowerArmHeight = 1.5;
//
var upperArmWidth  = 1.5;
var lowerArmWidth  = 1.0;
//
var upperLegWidth  = 1.5;
var lowerLegWidth  = 1.0;
//
var lowerLegHeight = 4.0;
var upperLegHeight = 5.0;
var headHeight = 2.0;
var headWidth = 2.0;
var headLength = 3.0;
//////////////////
var headHeight2 = 1.0;
var headWidth2 = 4.0;
var headLength2 = 3.0;

var numNodes = 23;
var numAngles = 24;
var theta = [90, 0, 0, 0, 0, 0, 180, 0, 180, 0, 0, 0, 270, 0, 0/*180*/, 0/*180*/, 0, 0,0,0,0,0,0,0];
var stack = [];
var figure = [];

for( var i=0; i<numNodes; i++) figure[i] = createNode(null, null, null, null);

// Add buffer and array for normals
//
var vBuffer;

var pointsArray = [];

//-------------------------------------------
function scale4(a, b, c) {
   var result = mat4();
   result[0][0] = a;
   result[1][1] = b;
   result[2][2] = c;
   return result;
}

//--------------------------------------------
function createNode(transform, render, sibling, child){
    var node = {
    transform: transform,
    render: render,
    sibling: sibling,
    child: child,
    }
    return node;
}

function initNodes(Id) {

    var m = mat4();

    switch(Id) {
    case torsoId:
		m = rotate(theta[torsoId], 0, 1, 0 );
		figure[torsoId] = createNode( m, torso, null/*torsoId2*/, leftUpperLegId );
	break;
	 case torsoId2:
		m = rotate(theta[torsoId2], 0, 1, 0 );
		figure[torsoId2] = createNode( m, torso2, null, tailId2 );
    break;
    case headId:
    case head1Id:
    case head2Id:
		m = translate(0.0, torsoHeight/2+0.5*headHeight, -0.85);
		m = mult(m, rotate(theta[head1Id], 1, 0, 0))
		m = mult(m, rotate(theta[head2Id], 0, 1, 0));
		m = mult(m, translate(0.0, -0.5*headHeight, 0.0));
		figure[headId] = createNode( m, head, null, null);
    break;
	
	
	case headId2:
    case head1Id2:
    case head2Id2:
		m = translate(0.0, torsoHeight2+0.5*headHeight, 0.0);
		m = mult(m, rotate(theta[head1Id2], 1, 0, 0))
		m = mult(m, rotate(theta[head2Id2], 0, 1, 0));
		m = mult(m, translate(0.0, -0.5*headHeight, 0.0));
		figure[headId2] = createNode( m, head2, null, null);
    break;
	
	
	
	
    case leftUpperArmId:
		m = translate(0, lowerLegHeight, 0);
		m = mult(m, rotate(theta[leftUpperArmId], 1, 0, 0));
		figure[leftUpperArmId] = createNode( m, leftUpperArm, null, leftLowerArmId );
    break;
    case rightUpperArmId:
		m = translate(0, lowerLegHeight, 0);
		m = mult(m, rotate(theta[rightUpperArmId], 1, 0, 0));
		figure[rightUpperArmId] = createNode( m, rightUpperArm, null, rightLowerArmId );
    break;
    case leftUpperLegId:
		m = translate(-(torsoWidth+upperLegWidth), 0.1*upperLegHeight, 4.25);
		m = mult(m , rotate(theta[leftUpperLegId], 1, 0, 0));
		figure[leftUpperLegId] = createNode( m, leftUpperLeg, rightUpperLegId, leftLowerLegId );
    break;
    case rightUpperLegId:
		m = translate(torsoWidth+upperLegWidth, 0.1*upperLegHeight, 4.25);
		m = mult(m, rotate(theta[rightUpperLegId], 1, 0, 0));
		figure[rightUpperLegId] = createNode( m, rightUpperLeg, headId/*tailId*//*null*/, rightLowerLegId );
    break;
	
	
	
	case leftUpperArmId2:
		m = translate(-(torsoWidth-upperArmWidth-0.75), torsoHeight2 - 0.3, -1.75);
		m = mult(m, rotate(theta[leftUpperArmId2], 1, 0, 0));
		figure[leftUpperArmId2] = createNode( m, leftUpperArm2, rightUpperArmId2, leftLowerArmId2 );
    break;
    case rightUpperArmId2:
		m = translate(torsoWidth-upperArmWidth-0.75, torsoHeight2 - 0.3, 1.75);
		m = mult(m, rotate(theta[rightUpperArmId2], 1, 0, 0));
		figure[rightUpperArmId2] = createNode( m, rightUpperArm2, headId2, rightLowerArmId2 );
    break;
	////////////
    case leftUpperLegId2:
		m = translate(0, lowerLegHeight, 0);
		m = mult(m , rotate(theta[leftUpperLegId2], 1, 0, 0));
		figure[leftUpperLegId2] = createNode( m, leftUpperLeg2, null, leftLowerLegId2 );
    break;
    case rightUpperLegId2:
		m = translate(0, lowerLegHeight, 0);
		m = mult(m, rotate(theta[rightUpperLegId2], 1, 0, 0));
		figure[rightUpperLegId2] = createNode( m, rightUpperLeg2, /*headId2*//*tailId*/null, rightLowerLegId2 );
    break;
	////////////

	
	
	case tailId:
		m = translate(0.0, torsoHeight+ .25, -4.5);
		m = mult(m, rotate(theta[tailId], 0, 0, 1));
		figure[tailId] = createNode( m, tail, leftUpperArmId, null );
    break;
	case tailId2:
		m = translate(0.0, torsoHeight2+ .25, -5.0);
		m = mult(m, rotate(theta[tailId2], 0, 0, 1));
		figure[tailId2] = createNode( m, tail2, leftUpperArmId2, null );
    break;
    case leftLowerArmId:
		m = translate(0.0, upperArmHeight, 0.0);
		m = mult(m, rotate(theta[leftLowerArmId], 1, 0, 0));
		figure[leftLowerArmId] = createNode( m, leftLowerArm, null, null );
    break;
    case rightLowerArmId:
		m = translate(0.0, upperArmHeight, 0.0);
		m = mult(m, rotate(theta[rightLowerArmId], 1, 0, 0));
		figure[rightLowerArmId] = createNode( m, rightLowerArm, null, null );
    break;
    case leftLowerLegId:
		m = translate(0.0, upperLegHeight, 0.0);
		m = mult(m, rotate(theta[leftLowerLegId], 1, 0, 0));
		figure[leftLowerLegId] = createNode( m, leftLowerLeg, null, leftUpperLegId2 );
    break;
    case rightLowerLegId:
		m = translate(0.0, upperLegHeight, 0.0);
		m = mult(m, rotate(theta[rightLowerLegId], 1, 0, 0));
		figure[rightLowerLegId] = createNode( m, rightLowerLeg, null, rightUpperLegId2 );
    break;
    
	
	
	case leftLowerArmId2:
		m = translate(0.0, upperArmHeight, 0.0);
		m = mult(m, rotate(theta[leftLowerArmId2], 1, 0, 0));
		figure[leftLowerArmId2] = createNode( m, leftLowerArm2, null, null );
    break;
    case rightLowerArmId2:
		m = translate(0.0, upperArmHeight, 0.0);
		m = mult(m, rotate(theta[rightLowerArmId2], 1, 0, 0));
		figure[rightLowerArmId2] = createNode( m, rightLowerArm2, null, null );
    break;
    case leftLowerLegId2:
		m = translate(0.0, upperLegHeight, 0.0);
		m = mult(m, rotate(theta[leftLowerLegId2], 1, 0, 0));
		figure[leftLowerLegId2] = createNode( m, leftLowerLeg2, null, leftUpperArmId );
    break;
    case rightLowerLegId2:
		m = translate(0.0, upperLegHeight, 0.0);
		m = mult(m, rotate(theta[rightLowerLegId2], 1, 0, 0));
		figure[rightLowerLegId2] = createNode( m, rightLowerLeg2, null, rightUpperArmId );
    break;
    }
	
}

function traverse(Id) {
   if(Id == null) return;
   stack.push(modelViewMatrix);
   //modelViewMatrix = mult(modelViewMatrix, translate(0 ,-10,0));
   modelViewMatrix = mult(modelViewMatrix, figure[Id].transform);
   figure[Id].render();
   if(figure[Id].child != null) traverse(figure[Id].child);
    modelViewMatrix = stack.pop();
   if(figure[Id].sibling != null) traverse(figure[Id].sibling);
}

function traverse3(Id) {
   if(Id == null) return;
   stack.push(modelViewMatrix);
   //modelViewMatrix = mult(modelViewMatrix, translate(0 ,0/*-11.25*/,0));
   modelViewMatrix = mult(modelViewMatrix, translate(Walk ,Jump  - 16.25/*- 16.25*/,0));
   modelViewMatrix = mult(modelViewMatrix, figure[Id].transform);
   figure[Id].render();
   if(figure[Id].child != null) traverse(figure[Id].child);
    modelViewMatrix = stack.pop();
   if(figure[Id].sibling != null) traverse(figure[Id].sibling);
}

function traverse2(Id) {
   if(Id == null) return;
   stack.push(modelViewMatrix);
   modelViewMatrix = mult(modelViewMatrix, translate(20 + Walk2 ,Jump2 - 11.25,0));
   modelViewMatrix = mult(modelViewMatrix, figure[Id].transform);
   figure[Id].render();
   if(figure[Id].child != null) traverse(figure[Id].child);
    modelViewMatrix = stack.pop();
   if(figure[Id].sibling != null) traverse(figure[Id].sibling);
}

function torso() {
    instanceMatrix = mult(modelViewMatrix, translate(Walk, 0.5*torsoHeight + Jump, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4( torsoWidth, torsoHeight, torsoDepth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function torso2() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5*torsoHeight2, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4( torsoWidth2, torsoHeight2, torsoDepth2));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function head() {
    instanceMatrix = mult(modelViewMatrix, translate(Walk, 0.5 * headHeight + Jump, 5.75 ));
	instanceMatrix = mult(instanceMatrix, scale4(headWidth, headHeight, headLength) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function head2() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * headHeight2, 5.25 ));
	instanceMatrix = mult(instanceMatrix, scale4(headWidth2, headHeight2, headLength2) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function tail() {
    instanceMatrix = mult(modelViewMatrix, translate(Walk, 0.5 * headHeight + Jump, 0.0 ));
	instanceMatrix = mult(instanceMatrix, scale4(tailWidth, tailHeight, tailWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function tail2() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * headHeight2 + 0.35, 0.0 ));
	instanceMatrix = mult(instanceMatrix, scale4(tailWidth2, tailHeight2, taildepth2) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function leftUpperArm() {
    instanceMatrix = mult(modelViewMatrix, translate(4.75 + Walk, 0.5 * upperArmHeight + 0.25 - Jump, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(upperArmWidth, upperArmHeight, upperArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function leftLowerArm() {
    instanceMatrix = mult(modelViewMatrix, translate(4.75 + Walk, 0.5 * lowerArmHeight + 0.25 - Jump, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(lowerArmWidth, lowerArmHeight, lowerArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function rightUpperArm() {
    instanceMatrix = mult(modelViewMatrix, translate(-4.75 + Walk, 0.5 * upperArmHeight + 0.25 - Jump, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(upperArmWidth, upperArmHeight, upperArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function rightLowerArm() {
    instanceMatrix = mult(modelViewMatrix, translate(-4.75 + Walk, 0.5 * lowerArmHeight + 0.25 - Jump, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(lowerArmWidth, lowerArmHeight, lowerArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function leftUpperLeg() {
    instanceMatrix = mult(modelViewMatrix, translate(4.75 + Walk, 0.5 * upperLegHeight + 0.25 - Jump, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(upperLegWidth, upperLegHeight, upperLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function leftLowerLeg() {
    instanceMatrix = mult(modelViewMatrix, translate( 4.75 + Walk, 0.5 * lowerLegHeight + 0.25 - Jump, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(lowerLegWidth, lowerLegHeight, lowerLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function rightUpperLeg() {
    instanceMatrix = mult(modelViewMatrix, translate(-4.75 + Walk, 0.5 * upperLegHeight+ 0.25 - Jump, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(upperLegWidth, upperLegHeight, upperLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function rightLowerLeg() {
    instanceMatrix = mult(modelViewMatrix, translate(-4.75 + Walk, 0.5 * lowerLegHeight+ 0.25 - Jump, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(lowerLegWidth, lowerLegHeight, lowerLegWidth) )
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}





function leftUpperArm2() {
    instanceMatrix = mult(modelViewMatrix, translate(4.75, 0.5 * upperArmHeight/2 + 0.25, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(upperArmWidth/3, upperArmHeight/2, upperArmWidth/3) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function leftLowerArm2() {
    instanceMatrix = mult(modelViewMatrix, translate(4.75, 0.5 * lowerArmHeight + 0.25, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(headWidth2, lowerArmHeight*3, lowerArmWidth/2) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function rightUpperArm2() {
    instanceMatrix = mult(modelViewMatrix, translate(-4.75, 0.5 * upperArmHeight/2 + 0.25, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(upperArmWidth/3, upperArmHeight/2, upperArmWidth/3) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function rightLowerArm2() {
    instanceMatrix = mult(modelViewMatrix, translate(-4.75, 0.5 * lowerArmHeight + 0.25, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(headWidth2, lowerArmHeight*3, lowerArmWidth/2) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function leftUpperLeg2() {
    instanceMatrix = mult(modelViewMatrix, translate(4.75, 0.5 * upperLegHeight + 0.25 - Jump, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(upperLegWidth, upperLegHeight, upperLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function leftLowerLeg2() {
    instanceMatrix = mult(modelViewMatrix, translate( 4.75, 0.5 * lowerLegHeight + 0.25 - Jump, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(lowerLegWidth, lowerLegHeight, lowerLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function rightUpperLeg2() {
    instanceMatrix = mult(modelViewMatrix, translate(-4.75, 0.5 * upperLegHeight+ 0.25 - Jump, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(upperLegWidth, upperLegHeight, upperLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function rightLowerLeg2() {
    instanceMatrix = mult(modelViewMatrix, translate(-4.75, 0.5 * lowerLegHeight+ 0.25 - Jump, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(lowerLegWidth, lowerLegHeight, lowerLegWidth) )
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function quad(a, b, c, d) {
	// Add code for normals
     var t1 = subtract(vertices[b], vertices[a]);
     var t2 = subtract(vertices[c], vertices[b]);
     var normal = cross(t1, t2);
     var normal = vec3(normal);


     pointsArray.push(vertices[a]);
     normalsArray.push(normal);
     pointsArray.push(vertices[b]);
     normalsArray.push(normal);
     pointsArray.push(vertices[c]);
     normalsArray.push(normal);
     pointsArray.push(vertices[d]);
     normalsArray.push(normal);
}

function cube(){
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
}

window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width *.5, canvas.height );
    gl.clearColor( 0.0, 0.6, 1.0, 1.0 );

	// Enable the depth test
    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader");
    gl.useProgram( program);

    instanceMatrix = mat4();

    projectionMatrix = ortho(-10.0,10.0,-10.0, 10.0,-10.0,10.0);
    modelViewMatrix = mat4();
	
	var ambientProduct = mult(lightAmbient, materialAmbient);
    var diffuseProduct = mult(lightDiffuse, materialDiffuse);
    var specularProduct = mult(lightSpecular, materialSpecular);
	
	modelViewMatrix = mult(modelViewMatrix, translate(-5 + Walk,Jump,0));
	modelViewMatrix = mult(modelViewMatrix, scalem(.50, 1, 1));
	
	gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
       flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
       flatten(diffuseProduct) );
    gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"),
       flatten(specularProduct) );
    gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"),
       flatten(lightPosition) );

    gl.uniform1f(gl.getUniformLocation(program,
       "shininess"),materialShininess);

    gl.uniformMatrix4fv(gl.getUniformLocation( program, "modelViewMatrix"), false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv( gl.getUniformLocation( program, "projectionMatrix"), false, flatten(projectionMatrix) );
	
	//////
	
	
	//////
	

    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");

    cube();

	// Create and bind buffer for normals
	
	var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW );

    var vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal );
	
    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
	
	// Add ambient, diffuse, and specular products
	document.getElementById("Button0").onclick = function(){
		boolWalkF = !boolWalkF;
		
		boolJump = false;
		check = false;
	};
	document.getElementById("Button1").onclick = function(){
		boolWalkB = !boolWalkB;
		
	};
	document.getElementById("Button2").onclick = function(){
		boolWag = !boolWag;
	};
	document.getElementById("Button3").onclick = function(){
		boolJump = !boolJump;
		boolWalkF = false;
	};

	document.getElementById("Button8").onclick = function(){
		
		location.reload(true);
	};

    document.getElementById("slider0").onchange = function(event) {
		
        theta[torsoId ] = event.target.value;
        initNodes(torsoId);
    };
    document.getElementById("slider1").onchange = function(event) {
        theta[torsoId2 ] = event.target.value;
        initNodes(torsoId2)
    };
   

	
	// Send uniform locations for lighting and material properties

    for(i=0; i<=numNodes; i++) initNodes(i);

    render();
}

var render = function() {

    gl.clear( gl.COLOR_BUFFER_BIT );
	
	if(boolWalkF == true){
		Jump = Jump + a2;
		if(Jump > 2.6){
			check = true;
		}
		if(check == true){
			if((Jump > 3) || (Jump < 2)){
				a2 = -1 * a2;
			}
		}
		Jump2 = Jump2 + a;
		if((Jump2 > 0.5) || (Jump2 < 0)){
			a = -1 * a;
		}
	}
	
	if(boolWalkB == true){
		theta[leftUpperLegId] =  180 + Wag;
        initNodes(leftUpperLegId);
		theta[rightUpperLegId] =  180 + Wag;
        initNodes(rightUpperLegId);
		
		theta[leftLowerLegId] =  Wag2;
        initNodes(leftLowerLegId);
		theta[rightLowerLegId] =  -Wag2;
        initNodes(rightLowerLegId);
		
		theta[leftUpperLegId2] =  Wag2;
        initNodes(leftUpperLegId2);
		theta[rightUpperLegId2] =  -Wag2;
        initNodes(rightUpperLegId2);
		
		theta[leftLowerLegId2] =  Wag2;
        initNodes(leftLowerLegId2);
		theta[rightLowerLegId2] =  -Wag2;
        initNodes(rightLowerLegId2);
		
		theta[leftUpperArmId] =  -Wag2 ;
        initNodes(leftUpperArmId);
		theta[rightUpperArmId] =  Wag2 ;
        initNodes(rightUpperArmId);
		
		theta[torsoId2] =  270 - Wag2 ;
        initNodes(torsoId2);
		
		theta[torsoId] =  90 - Wag2/5 ;
        initNodes(torsoId);
		
		Wag = Wag - b;
		if (Wag < -90){
			check2 = true;
		}
		if(check2 == true){
			if((Wag < -115) || (Wag > -90)){
				b = -1 * b;
			}
		}
		Wag2 = Wag2 + b2;
		if((Wag2 > 25) || (Wag2 < -25)){
			b2 = -1 * b2;
		}
	}
	
	if(boolWag == true){
		leftUpperArmId2
		theta[leftUpperArmId2] =  -step2 * 1.25;
        initNodes(leftUpperArmId2);
		theta[rightUpperArmId2] =  step2 * 2;
        initNodes(rightUpperArmId2);
		
		if((step2 < 25) && (step2 > -25)){
			step2 = step2 + c2
		}
	}
	
	if(boolJump == true){
		
		Jump = Jump - a3 ;
		if(Jump < -5.6){
			check3 = true;
		}
		if(check3 == true){
			if((Jump > -6) || (Jump < -5)){
				a3 = -1 * a3;
			}
		}
		
		Jump2 = Jump2 - c ;
		if(Jump2 < -7.6){
			check4 = true;
		}
		if(check4 == true){
			if((Jump2 < -8) || (Jump2 > -7)){
				c = -1 * c;
			}
		}
		
	}
	
	
	
    traverse3(torsoId);
	traverse2(torsoId2);
	//traverse(torsoId);
	//traverse(torsoId2);
    requestAnimFrame(render);
}
