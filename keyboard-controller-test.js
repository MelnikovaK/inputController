
var target = document.getElementById('object');

var actions = {
	"left": { // название активности
		keys: [37,65], // список кодов кнопок соответствующих активности
		gesture: ['swipe-left'],
		enabled: true // отключенная активность по умолчанию
	},
	"right": {
		keys: [100,68],
		gesture: ['swipe-right'],
	},
	"up": {
		keys: [87],
		gesture: ['swipe-up'],
	},
	"down": {
		keys: [83],
		gesture: ['swipe-down'],
	},
}

// let inputController = new InputController( actions, target );

let inputController = new InputController( actions );



// EVENT BASED BEHAVIOR
target.addEventListener( inputController.ACTION_ACTIVATED, function (e) {
  console.log("ACTION_ACTIVATED: ", e.detail );
  if( e.detail == 'jump' ){
  	target.style.borderColor = "#f00";
  }
}, false);

target.addEventListener( inputController.ACTION_DEACTIVATED, function (e) {
  console.log("ACTION_DEACTIVATED: ", e );
  if( e.detail == 'jump' ){
  	target.style.borderColor = "#000";
  }
}, false);



// ITERATION BASED BEHAVIOR
function gamestep(){

	var style = getComputedStyle(target);

	var xs, ys;

	if( inputController.isActionActive("left") ){
		xs = -2;
	} else if( inputController.isActionActive("right") ){
		xs = 2;
	}

	if( xs ) {
		var left = parseInt(style.getPropertyValue("left"));
		target.style.left = (left + xs) +'px';
	}

	if( inputController.isActionActive("up") ){
		ys = -2;
	} else if( inputController.isActionActive("down") ){
		ys = 2;
	}

	if( ys ) {
		var top = parseInt(style.getPropertyValue("top"));
		target.style.top = (top + ys) +'px';
	}

	// if( inputController.isKeyPressed(32) ){
	// 	console.log("JUMP!");
	// }

	requestAnimationFrame(gamestep);
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