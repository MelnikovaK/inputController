class InputController {

  constructor( actions_to_bind, target ) {
    
    this.ACTION_ACTIVATED = "input-controller:action-activated";
    this.ACTION_DEACTIVATED  = "input-controller:action-deactivated";

    //
    this.enabled = true;
    this.someKeyIsPressed = false;

    //
    this.actions = {};
    this.actions_by_keycode = {};
    
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

  _setActionActive( action, activate ){
  	if ( !( this.enabled && action && action.enabled ) ) return;
  	if( action.active == activate ) return;
  	action.active = activate;
  	var event = new CustomEvent( activate ? this.ACTION_ACTIVATED : this.ACTION_DEACTIVATED, { 'detail': action.name });
  	this.target.dispatchEvent(event);
  }



  // KEYBOARD
  attachKeyboard( target ){

  	if( !this.onKeyDown ){
		  this.onKeyDown = function(event){
		  	var key_code = event.keyCode;
		  	var action = this.actions_by_keycode[key_code];
		  	this._setActionActive(action,true);
		  }.bind(this);

		  this.onKeyUp = function(event){
		  	var key_code = event.keyCode;
		  	var action = this.actions_by_keycode[key_code];
		  	this._setActionActive(action,false);
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
  	this.onkeyPressed = function(event) {
  		if ( event.keyCode == keyCode ) {
  			this.someKeyIsPressed = true;
  		}
  	}.bind(this)

  	this.onkeyUnPressed = function(event) {
  			this.someKeyIsPressed = false;
  	}.bind(this)

    window.addEventListener( 'keydown', this.onkeyPressed );
    window.addEventListener( 'keyup', this.onkeyUnPressed );

  	return this.someKeyIsPressed;
  }

}