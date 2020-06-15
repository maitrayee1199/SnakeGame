let snake = [];
let scene,camera,rederer,food;
var gridSize=500;
var unitsize=10,color=0xffffff;
var current=null,next=null,head=null,n=0,keys={
	back:38,forward:40,left:37,right:39,pause:32,pause_flag:false,
	back_flag:false,forward_flag:false,left_flag:false,right_flag:false};//these flags are to stop diagonal movement
var enable={forward:true,left:true,right:true,back:false};
var temp_key={back_flag:false,forward_flag:false,left_flag:false,right_flag:false};
	var temp_enable={forward:true,left:true,right:true,back:false};
var pos={x:0,z:0,y:0};
var score=1;
//console.log("in begin",temp_key,keys,temp_enable,enable); 
function win() {
	if(snake.length==1600){
		return(true);
	}
	return(false);
}
function pause(a) {
	if(a==="end"){
		console.log("end");
	}
	else if(keys.pause_flag==false){
		keys.pause_flag=true;
		temp_key.back_flag=keys.back_flag;
		temp_key.forward_flag=keys.forward_flag;
		temp_key.left_flag=keys.left_flag;
		temp_key.right_flag=keys.right_flag;
		temp_enable={forward:enable.forward,left:enable.left,right:enable.right,back:enable.back};
		//false the movement
		keys.back_flag=false;
		keys.forward_flag=false;
		keys.left_flag=false;
		keys.right_flag=false;
		enable.forward=false;
		enable.back=false;
		enable.left=false;
		enable.right=false;

	}
	else if(keys.pause_flag==true){
		keys.pause_flag=false;
		keys.back_flag=temp_key.back_flag;
		keys.forward_flag=temp_key.forward_flag;
		keys.left_flag=temp_key.left_flag;
		keys.right_flag=temp_key.right_flag;
		enable.forward=temp_enable.forward;
		enable.left=temp_enable.left;
		enable.right=temp_enable.right;
		enable.back=temp_enable.back;
		moveForward();
		moveLeft();
		moveRight();
		moveBack();
	}
	console.log("in pause end",temp_key,keys,temp_enable,enable);

}


function create(){
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(60,window.innerWidth/window.innerHeight,0.1,1000); 
    camera.position.set(0,1000,0);
    camera.lookAt(new THREE.Vector3());
	renderer = new THREE.WebGLRenderer({antialias:true});
	renderer.setSize(window.innerWidth-80,window.innerHeight);
	document.body.appendChild(renderer.domElement);
	init();
	renderer.render(scene,camera);
}
function eat() {
	if((snake[0].position.x==pos.x)&&(snake[0].position.z==pos.z))
	{
		scene.remove(food);
		if(win()){
			console.log("win true");
			pause(true);
		}
		generateFood();
		addCube();
		document.getElementById('board').innerText="Score: "+score;
		score++;
		return(true);
	}
	return(false);
}
//check food into body collision
function collide(x,z) {
	for(var i=3;i<snake.length;i++){
		if((snake[0].position.x==x)&&(snake[0].position.z==z))
		{
			return(true);
		}
	}
	return(false);
}
function wall() {
	var c=false ;
	 if((snake[0].position.x==400)||(snake[0].position.z==-400)||(snake[0].position.x==-400)||(snake[0].position.z==400))
		{
			c=true;
		}
	if(c){
		pause("end");
	}
}

 function generateFood(argument) {
 	
 	pos.x = Math.floor(Math.random() * 25) * 10;
 	pos.z=Math.floor(Math.random() * 25) * 10;
  // selecting food that doesn't collide with the snake
  while (collide(pos.x,pos.z)) {
    pos.x = Math.floor(Math.random() * 25) * 10;
    pos.z = Math.floor(Math.random() * 25) * 10;
  }
 	var box = new THREE.BoxGeometry(10.0,10.0,10.0);
    var boxmaterial = new THREE.MeshBasicMaterial({color:0xffaaff});
    food = new THREE.Mesh(box,boxmaterial);
    food.position.set(pos.x,pos.y,pos.z);
 	scene.add(food);
 }

function init() {
	//create head
	current={x:0,y:0,z:0};next={x:0,y:0,z:0}
	snake=[];
	createGrid();
	var box = new THREE.BoxGeometry(10.0,10.0,10.0);
    var boxmaterial = new THREE.MeshBasicMaterial({color:0xffffff});
    /*var boxmaterial1 = new THREE.MeshBasicMaterial({color:0x00ff00});
    var boxmaterial2 = new THREE.MeshBasicMaterial({color:0x0000ff});
    var boxmaterial3 = new THREE.MeshBasicMaterial({color:0xff0000});
    var boxmaterial4 = new THREE.MeshBasicMaterial({color:0xffffff});*/
    var cube = createCube(box,boxmaterial,current.x,current.y,current.z);
    scene.add(cube);
    current=next;
  next.z=next.z - unitsize;
  addCube();
  addCube();
  addCube();
  addCube();
  generateFood();
}
  

function addCube(){
  var box = new THREE.BoxGeometry(10.0,10.0,10.0);
  var boxmaterial = new THREE.MeshBasicMaterial({color:0xff0000});
  var cube = createCube(box,boxmaterial,current.x,current.y,current.z);
  head=cube;
  current=next;
  next.z=next.z - unitsize;
  scene.add(cube);
}

function createCube(box,boxmaterial,x,y,z){
  var cube = new THREE.Mesh(box,boxmaterial);
  cube.name=n;
  snake.push(cube);
  cube.position.set(x,y,z);
  n++;
  return(cube);

}

window.addEventListener('keyup',checkKey);
function checkKey(e) {
	if(e.keyCode==keys.back)
	{
		keys.back_flag=true;
		keys.forward_flag=false;
		keys.left_flag=false;
	 	keys.right_flag=false;
		moveBack();
	}
	else if(e.keyCode==keys.forward)
	{
		keys.forward_flag=true;	
		keys.back_flag=false;
	 	keys.left_flag=false;
	 	keys.right_flag=false;
		moveForward();
	}
	else if(e.keyCode==keys.left)
	{
		keys.left_flag=true;
		keys.back_flag=false;
	    keys.forward_flag=false;
	    keys.right_flag=false;
		moveLeft();
	}
	else if(e.keyCode==keys.right)
	{
		keys.right_flag=true;
		keys.back_flag=false;
	    keys.left_flag=false;
	    keys.forward_flag=false;
		moveRight();
	}
	else if(e.keyCode==keys.pause)
	{
		pause(keys.pause_flag);
	}
}

function moveForward() {
	var animate=function () {
	if((snake[0].position.z<(400))&&(keys.forward_flag==true))
	{
     keys.back_flag=false;
	 keys.left_flag=false;
	 keys.right_flag=false;
	 //ENABLE MOVEMENTS IN DIRECTION
	 if(!enable.forward){
	 	return;
	 }
	 enable.back=false;
	 enable.right=true;
	 enable.left=true;
	 eat();
	setTimeout(animate,500);
	//requestAnimationFrame( animate );
	var next={x:snake[0].position.x,y:snake[0].position.y,z:snake[0].position.z};
    snake[0].position.z+=10;
    if(hit()==true){
    	document.body.removeChild(renderer.domElement);
    	create();
    }
    for (var i = 1; i <snake.length; i++) {
    var temp={x:snake[i].position.x,y:snake[i].position.y,z:snake[i].position.z};
    snake[i].position.z=next.z;
    snake[i].position.y=next.y;
    snake[i].position.x=next.x;
    next.x=temp.x;
    next.y=temp.y;
    next.z=temp.z;
    }
     wall();
    renderer.render( scene, camera );
    }
    else{
    	return;
    }
}
animate();
}

function moveLeft() {
	var animate=function () {
    if((snake[0].position.x>-400)&&(keys.left_flag==true))
	{
	 keys.forward_flag=false;
	 keys.back_flag=false;
	 keys.right_flag=false;
	  //ENABLE MOVEMENTS IN DIRECTION
	  if(!enable.left){
	 	return;
	 }
	 enable.back=true;
	 enable.right=false;
	 enable.forward=true;
	 eat();
	 setTimeout(animate,500);
	//requestAnimationFrame( animate );
    var next={x:snake[0].position.x,y:snake[0].position.y,z:snake[0].position.z};
    snake[0].position.x-=10
    if(hit()==true){
    	document.body.removeChild(renderer.domElement);
    	create();
    }
    for (var i = 1; i <snake.length; i++) {
    var temp={x:snake[i].position.x,y:snake[i].position.y,z:snake[i].position.z};
    snake[i].position.z=next.z;
    snake[i].position.y=next.y;
    snake[i].position.x=next.x;
    next.x=temp.x;
    next.y=temp.y;
    next.z=temp.z;
    }
    wall();
    renderer.render( scene, camera );
    }
    else{
    	return;
    }
}
animate();
}

function moveRight() {
	var animate=function () {
	if((snake[0].position.x<400)&&(keys.right_flag==true))
	{
	 keys.forward_flag=false;
	 keys.left_flag=false;
	 keys.back_flag=false;
	 //////////
	  if(!enable.right){
	 	return;
	 }
	 enable.back=true;
	 enable.forward=true;
	 enable.left=false;
	 eat();
	 setTimeout(animate,500);
	//requestAnimationFrame( animate );
    var next={x:snake[0].position.x,y:snake[0].position.y,z:snake[0].position.z};
    snake[0].position.x+=10
    if(hit()==true){
    	document.body.removeChild(renderer.domElement);
    	create();
    }
    for (var i = 1; i <snake.length; i++) {
    var temp={x:snake[i].position.x,y:snake[i].position.y,z:snake[i].position.z};
    snake[i].position.z=next.z;
    snake[i].position.y=next.y;
    snake[i].position.x=next.x;
    next.x=temp.x;
    next.y=temp.y;
    next.z=temp.z;
    }
     wall();
    renderer.render( scene, camera );
    }
    else{
    	return;
    }
}
//setInterval(animate,1000);
animate();
}

function moveBack() {
	var animate=function () {
	if((snake[0].position.z>-400)&&(keys.back_flag==true))
	{
	 keys.forward_flag=false;
	 keys.left_flag=false;
	 keys.right_flag=false;
	 ////////////
	 if(!enable.back){
	 	return;
	 }
	 enable.forward=false;
	 enable.right=true;
	 enable.left=true;
	 eat();
	 setTimeout(animate,500);
	//requestAnimationFrame( animate );
    var next={x:snake[0].position.x,y:snake[0].position.y,z:snake[0].position.z};
    snake[0].position.z-=10; 
     if(hit()==true){
    	document.body.removeChild(renderer.domElement);
    	create();
    }
    for (var i = 1; i <snake.length; i++) {
    var temp={x:snake[i].position.x,y:snake[i].position.y,z:snake[i].position.z};
    snake[i].position.z=next.z;
    snake[i].position.y=next.y;
    snake[i].position.x=next.x;
    next.x=temp.x;
    next.y=temp.y;
    next.z=temp.z;
    }
    wall();
    renderer.render( scene, camera );
    }
    else{
    	return;
    }
}
animate();
}

function hit() {
	for(var i=3;i<snake.length;i++){
		if((snake[0].position.x==snake[i].position.x)&&(snake[0].position.z==snake[i].position.z))
		{
			return(true);
		}
	}
	return(false);
}


function createGrid(){
	var material= new THREE.LineBasicMaterial({ color: 0xffaaff, opacity: 0.2, transparent: false });
	var points=[];
for(var i=0;i<=50;i+=5){
	points.push(new THREE.Vector3(-410,i,410));
	points.push(new THREE.Vector3(-400,i,-410));
	points.push(new THREE.Vector3(410,i,-410));
	points.push(new THREE.Vector3(410,i,410));
	points.push(new THREE.Vector3(-410,i,410));
}
  var lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
  var line = new THREE.Line(lineGeometry,material);
  scene.add(line);
}


create();