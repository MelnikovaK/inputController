// INIT
var actions = {
	
	"left": { // название активности
		keys: [37,65], // список кодов кнопок соответствующих активности
		enabled: true // отключенная активность по умолчанию
	},
	"right": {
		keys: [100,68],
	},
	"up": {
		keys: [87],
	},
	"down": {
		keys: [83],
	},

	"move-left": { // название активности
		gesture: ['swipe-left'],
	},
	"move-right": {
		gesture: ['swipe-right'],
	},
	"move-up": {
		gesture: ['swipe-up'],
	},
	"move-down": {
		gesture: ['swipe-down'],
	},

}

var target = document.getElementById('container');
// let inputController = new InputController( actions, target );
let inputController = new InputController( actions );




// TESTING

var moving_object = document.getElementById('object');

// EVENT BASED BEHAVIOR
target.addEventListener( inputController.ACTION_ACTIVATED, function (e) {
  console.log("ACTION_ACTIVATED: ", e.detail );
  if( e.detail == 'jump' ){
  	moving_object.style.borderColor = "#f00";
  }
}, false);

target.addEventListener( inputController.ACTION_DEACTIVATED, function (e) {
  console.log("ACTION_DEACTIVATED: ", e );
  if( e.detail == 'jump' ){
  	moving_object.style.borderColor = "#000";
  }
}, false);

target.addEventListener( inputController.ACTION_TRIGGERED, function (e) {
  console.log("ACTION_TRIGGERED: ", e );
  var xs, ys;
  switch( e.detail ){
  	case "move-left": xs = -20; break;
  	case "move-right": xs = 20; break;
  	case "move-up": ys = -20; break;
  	case "move-down": ys = 20; break;
  }
  
  moveObject(xs,ys);

}, false);


// ITERATION BASED BEHAVIOR
function gamestep(){

	var xs, ys;

	if( inputController.isActionActive("left") ){
		xs = -2;
	} else if( inputController.isActionActive("right") ){
		xs = 2;
	}

	

	if( inputController.isActionActive("up") ){
		ys = -2;
	} else if( inputController.isActionActive("down") ){
		ys = 2;
	}

	moveObject(xs,ys);

	// if( inputController.isKeyPressed(32) ){
	// 	console.log("JUMP!");
	// }

	requestAnimationFrame(gamestep);
}


function moveObject(xs,ys){
	
	var style = getComputedStyle(moving_object);

	if( xs ) {
		var left = parseInt(style.getPropertyValue("left"));
		moving_object.style.left = (left + xs) +'px';
	}
	
	if( ys ) {
		var top = parseInt(style.getPropertyValue("top"));
		moving_object.style.top = (top + ys) +'px';
	}
}

gamestep();


























//
var buttons_e = document.getElementById("buttons");

function addButton( name, foo, execute_on_creation ){
	var e = document.createElement('button');
	buttons_e.appendChild(e);
	e.innerText = name;
	e.addEventListener('click', foo );
	if( execute_on_creation ) foo();
}

//
addButton('Attach', function() {
	inputController.attach( target );
}, true);

addButton('Detach', function() {
	inputController.detach();
});

addButton('Enable', function() {
	inputController.enabled = true;
});

addButton('Disable', function() {
	inputController.enabled = false;
});

addButton('Jump', function() {
	actions = {
		"jump": {
			keys: [32], 
			enabled: true 
		}
	}
	inputController.bindActions(actions);
}, true );