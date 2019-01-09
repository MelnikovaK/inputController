
var target = document.getElementById('object');

var actions = {
	"left": { // название активности
		keys: [37,65], // список кодов кнопок соответствующих активности
		enabled: true // отключенная активность по умолчанию
	},
	"right": {
		keys: [100,68],
		enabled: true
	}
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
	// console.log("gamestep");

	if( inputController.actions["left"].active ){
		var style = getComputedStyle(target);
		var left = parseInt(style.getPropertyValue("left")) - 2;
		target.style.left = left + 'px';

	} else if( inputController.actions["right"].active ){
		var style = getComputedStyle(target);
		var left = parseInt(style.getPropertyValue("left")) + 2;
		target.style.left = left + 'px';
	}

	requestAnimationFrame(gamestep);
}

gamestep();


























//
var buttons_e = document.getElementById("buttons");

function addButton( name, foo ){
	var e = document.createElement('button');
	buttons_e.appendChild(e);
	e.innerText = name;
	e.addEventListener('click', foo );
}

//
addButton('Attach', function() {
	inputController.attach( target );
});

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
});