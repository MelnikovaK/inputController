class InputController {

  constructor( actions_to_bind, target ) {
    
    this.ACTION_ACTIVATED = "input-controller:action-activated";
    this.ACTION_DEACTIVATED  = "input-controller:action-deactivated";
    this.ACTION_TRIGGERED = "input-controller:action-triggered";

    //
    this.enabled = true;

    //
    this.actions = {};
    this.actions_by_keycode = {};
    this.keys = {};
    this.actions_by_gesture = {};
    this.active_mouse_actions = [];

    
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
  	this.attachMouse( target );
  
  }

  detach() {
  	if( !this.target ) return;
  	target.blur();
  	this.detachKeyboard();
  	this.target = null;
  }

  // >>> ACTIONS >>>  

  bindActions( actions_to_bind ) {

  	for( var action_name in actions_to_bind ){
  		
  		var action = actions_to_bind[ action_name ];
  		
  		if( action.enabled == undefined ) action.enabled = true;
  		action.name = action_name;
  		action.active = false;
  		this.actions[ action_name ] = action;

  		// keyboard
  		if( action.keys ){
	  		action.keys.forEach(function(keycode){
	  			this.actions_by_keycode[keycode] = action;
	  			var key = {
	  				is_pressed: false
	  			};
			  	this.keys[keycode] = key;
	  		}.bind(this));
	  	}

	  	// mouse
	  	if( action.gesture ){
	  		action.gesture.forEach(function(gesture_name){
	  			this.actions_by_gesture[gesture_name] = action;
	  		}.bind(this));
	  	}
	  	
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
  	if ( !( this.enabled && action && action.enabled ) ) return false;
  	if( action.active == activate ) return false;
  	action.active = activate;
  	console.log('ACTION NAME: ', action)
  	var event = new CustomEvent( activate ? this.ACTION_ACTIVATED : this.ACTION_DEACTIVATED, { 'detail': action.name });
  	this.target.dispatchEvent(event);
  }

  emitActionEvent( action ){
  	if ( !( this.enabled && action && action.enabled ) ) return false;
  	var event = new CustomEvent( this.ACTION_TRIGGERED, { 'detail': action.name });
  	this.target.dispatchEvent(event);
  }
	// <<< ACTIONS <<<  




  // >>> KEYBOARD >>>
  _changeKeyPress(key_code, activate) {
  	if ( !this.enabled ) return;
  	var key = this.keys[key_code];
  	if( !key ) return;
  	key.is_pressed = activate;
  }

  attachKeyboard( target ){

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

  isKeyPressed(keyCode) {
  	if ( this.keys[keyCode] ) return this.keys[keyCode].is_pressed;
	}

	// <<< KEYBOARD <<<







	// >>> MOUSE >>>
	attachMouse( target ){

		if( !this.onMouseDown ){
			
			var start_X, start_Y;

		  this.onMouseDown = function(event){
		  	if (event.which != 1) return;
		  	start_X = event.clientX;
		  	start_Y = event.clientY;
		  	// console.log('onMouseDown: ', start_X, start_Y, event );
		  	// window.addEventListener('mousemove', this.onMouseMove)
		  }.bind(this);

		  // this.onMouseMove = function(event){
		  // 	finish_X = event.clientX;
		  // 	finish_Y = event.clientY;
		  // 	this.active_mouse_actions.push(this.computeGestureName(start_X, start_Y, finish_X, finish_Y));
		  // 	this._changeActionsActive(true);
		  // }.bind(this);

		  this.onMouseUp = function(event){
		  	// console.log('onMouseUp: ', start_X, start_Y, event );
		  	// window.removeEventListener('mousemove', this.onMouseMove);
		  	// this._changeActionsActive(false);
		  	// this.active_mouse_actions = [];
		  	var gesture_name = this.computeGestureName( start_X, start_Y, event.clientX, event.clientY );
		  	if( gesture_name ){
		  		this.emitActionEvent(this.actions_by_gesture[gesture_name]);
		  	}

		  }.bind(this);
  	}

		target.addEventListener('mousedown', this.onMouseDown );
		window.addEventListener('mouseup', this.onMouseUp );
	}

	detachMouse(){
  	if( !this.target ) return;
  	target.removeEventListener('mousedown', this.onMouseDown );
  	window.removeEventListener( 'mouseup', this.onMouseUp );
  }

  //
  computeGestureName(start_X, start_Y, finish_X, finish_Y) {
		
		var gesture_name = '';
		var horizontal_difference = start_X - finish_X;
		var vertical_difference = start_Y - finish_Y;

		if ( Math.abs(horizontal_difference) > Math.abs(vertical_difference)) {
			if ( horizontal_difference < 0 ) gesture_name = 'swipe-right';
			else gesture_name = 'swipe-left';
		} else {
			if ( vertical_difference < 0 ) gesture_name = 'swipe-down';
			else gesture_name = 'swipe-up';
		}

		return gesture_name;
	}

	/*
	_changeActionsActive(active) {
		var actions = this.active_mouse_actions;
  	for ( var i = 0; i < actions.length; i++ ) {
  		this._setActionActive(this.actions_by_gesture[actions[i]], active);
  	}
	}
	*/
	// <<< MOUSE <<<
}