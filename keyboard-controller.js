class InputController {

  constructor( actions_to_bind, target ) {
    
    this.ACTION_ACTIVATED = "input-controller:action-activated";
    this.ACTION_DEACTIVATED  = "input-controller:action-deactivated";

    //
    this.enabled = true;

    //
    this.actions = {};
    this.actions_by_keycode = {};
    this.keys = {};
    
    //
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
  		action.name = action_name;
  		action.active = false;
  		this.actions[ action_name ] = action;

  		//
  		action.keys.forEach(function(keycode){
  			this.actions_by_keycode[keycode] = action;
  			var key = {
  				is_pressed: false
  			};
		  	this.keys[keycode] = key;
  		}.bind(this));
  	}
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
  	var action = this.actions[action_name];
  	if( !action ) return;
		return action.active;
  }

  _setActionActive( action, activate ){
  	if ( !( this.enabled && action && action.enabled ) ) return;
  	if( action.active == activate ) return;
  	action.active = activate;
  	var event = new CustomEvent( activate ? this.ACTION_ACTIVATED : this.ACTION_DEACTIVATED, { 'detail': action.name });
  	this.target.dispatchEvent(event);
  }

  _changeKeyPress(key_code, activate) {
  	if ( !this.enabled ) return;
  	var key = this.keys[key_code];
  	if( !key ) return;
  	key.is_pressed = activate;
  }

  // KEYBOARD
  attachKeyboard( target, keyCode ){

  	if( !this.onKeyDown ){
		  this.onKeyDown = function(event){
		  	var key_code = event.keyCode;
		  	var action = this.actions_by_keycode[key_code];
		  	this._setActionActive(action, true);
		  	this._changeKeyPress(key_code, true);
  			console.log( key_code );
		  }.bind(this);

		  this.onKeyUp = function(event){
		  	var key_code = event.keyCode;
		  	var action = this.actions_by_keycode[key_code];
		  	this._setActionActive(action, false);
		  	this._changeKeyPress(key_code, false);
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
  	if ( this.keys[keyCode] ) return this.keys[keyCode].is_pressed;
	}
}