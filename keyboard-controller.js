class InputController {

  constructor( actions_to_bind, target ) {
    
    this.enabled = true;
    this.actions = {};
    this.actions_by_keycode = {};
    if( actions_to_bind ) this.bindActions( actions_to_bind );
    if( target ) this.attach( target );
  }

  //
  attach( target, dont_enable ) {
  	this.detach();
  	this.target = target;
  	target.focus();
  	if( dont_enable ) this.enabled = false;
  	this.attachKeyboard( target );
  
  }

  detach() {
  	if( !this.target ) return;
  	target.blur();
  	this.detachKeyboard();
  	this.target = null;
  }

  // ACTIONS

  bindActions( actions_to_bind ) {

  	for( var action_name in actions_to_bind ){
  		
  		var action = actions_to_bind[ action_name ];
  		
  		if( action.enabled == undefined ) action.enabled = true;
  		action.active = false;
  		this.actions[ action_name ] = action;

  		//
  		action.keys.forEach(function(keycode){
  			this.actions_by_keycode[keycode] = action;
  		}.bind(this));

  	}
  	console.log('actions_by_keycode: ', this.actions_by_keycode);
  }

  enableAction( action_name ) {
  	this.actions[action_name].enabled = true;
  }

  disableAction( action_name ) {
  	var action = this.actions[action_name];
	 	action.enabled = false;
	 	action.active = false;
  }

  isActionActive(action_name) {
		return this.actions[action_name].active;
  }

  // KEYBOARD
  attachKeyboard( target ){
  	if( !this.onKeyDown ){
		  this.onKeyDown = function(event){
		  	var key_code = event.keyCode;
		  	var action = this.actions_by_keycode[key_code];
		  	if ( action && action.enabled == true && this.enabled){
		  		action.active = true;
		  	}
		  }.bind(this);

		  this.onKeyUp = function(event){
		  	var key_code = event.keyCode;
		  	var action = this.actions_by_keycode[key_code];
		  	if ( action ) {
			  	action.active = false;
		 	 }
		  }.bind(this);
  	}
			window.addEventListener('keydown', this.onKeyDown );
			window.addEventListener('keyup', this.onKeyUp );
  }

  detachKeyboard(){
  	if( !this.target ) return;
  	window.removeEventListener('keydown', this.onKeyDown );
  	window.removeEventListener('keyup', this.onKeyUp );
  }

  //
  isKeyPressed(keyCode) {
  	/*
  	return window.onkeypress = function(event) {
  		if (event.keyCode == keyCode) {
  			return true; 
  		} else {
  			return false;
  		}
  	}
  	*/
  }

}