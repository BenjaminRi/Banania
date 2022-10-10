// Please note that this code is quite old, my first large project in JavaScript
// and therefore the code structure is not very good.

"use strict";
const DEBUG = false;
const AUTHOR = "Benjamin";

// GLOBAL CONSTANTS
const JOYSTICK_SIZE = 0.4;// In terms of the smaller of the two screen dimensions
const IS_TOUCH_DEVICE = true == ("ontouchstart" in window || window.DocumentTouch && document instanceof DocumentTouch);

const UPS = IS_TOUCH_DEVICE ? 15 : 60;// Reduced framerate on mobile
const NUM_RESOURCES = 197;
const IMAGE_DIR = "images/";
const SOUND_DIR = "sound/";
const SCREEN_WIDTH = 537;
const SCREEN_HEIGHT = 408;
const LEV_OFFSET_X = 16;
const LEV_OFFSET_Y = 79;
const LEV_DIMENSION_X = 21;
const LEV_DIMENSION_Y = 13;
const MENU_HEIGHT = 20;
const INTRO_DURATION = DEBUG ? 2 : 6;// In seconds
const LEV_START_DELAY = DEBUG ? 1 : 2;
const LEV_STOP_DELAY = DEBUG ? 1 : 2;
const ANIMATION_DURATION = Math.round(8*UPS/60);// How many times the game has to render before the image changes

const DEFAULT_VOLUME = 0.7;

const DIR_NONE = -1;
const DIR_UP = 0;
const DIR_LEFT = 1;
const DIR_DOWN = 2;
const DIR_RIGHT = 3;

const KEY_CODE_ENTER = 13;
const KEY_CODE_ESC   = 27;
const KEY_CODE_LEFT  = 37;
const KEY_CODE_UP    = 38;
const KEY_CODE_RIGHT = 39;
const KEY_CODE_DOWN  = 40;

const RENDER_FULL = 0;
const RENDER_TOP = 1;
const RENDER_BOTTOM = 2;
const RENDER_BOTTOM_BORDER = 3;

const DBX_CONFIRM = 0;
const DBX_SAVE = 1;
const DBX_LOAD = 2;
const DBX_CHPASS = 3;
const DBX_LOADLVL = 4;
const DBX_CHARTS = 5;

const ERR_SUCCESS = 0;
const ERR_EXISTS = 1;
const ERR_NOSAVE = 2;
const ERR_WRONGPW = 3;
const ERR_NOTFOUND = 4;
const ERR_EMPTYNAME = 5;

// Check storage
const HAS_STORAGE = (function(){try {return 'localStorage' in window && window['localStorage'] !== null && window['localStorage'] !== undefined;} catch (e) {return false;}})();

// Canvas creation
let CANVAS = document.createElement("canvas");
let CTX = CANVAS.getContext("2d");
CANVAS.width = SCREEN_WIDTH;
CANVAS.height = SCREEN_HEIGHT;
CANVAS.true_width = SCREEN_WIDTH;
CANVAS.true_height = SCREEN_HEIGHT;
CANVAS.className = "canv";
document.body.appendChild(CANVAS);

let JOYSTICK;
let JOYCTX;
if(IS_TOUCH_DEVICE){
	// Joystick creation
	JOYSTICK = document.createElement("canvas");
	JOYCTX = JOYSTICK.getContext("2d");
	let mindim = Math.min(window.innerWidth, window.innerHeight);
	JOYSTICK.width = mindim*JOYSTICK_SIZE;
	JOYSTICK.height = mindim*JOYSTICK_SIZE;
	JOYSTICK.className = "joystick";
	document.body.appendChild(JOYSTICK);

	window.onresize = function(event) {// On mobile, make game fullscreen
		let ratio_1 = window.innerWidth/CANVAS.true_width;
		let ratio_2 = window.innerHeight/CANVAS.true_height;
		if(ratio_1 < ratio_2){
			CANVAS.style.height = "";
			CANVAS.style.width = "100%";
		}else{
			CANVAS.style.height = "100%";
			CANVAS.style.width = "";
		}
		
		let rect = CANVAS.getBoundingClientRect();
		let style = window.getComputedStyle(CANVAS);
		CANVAS.true_width = rect.width + parseInt(style.getPropertyValue('border-left-width')) +parseInt(style.getPropertyValue('border-right-width'));
		CANVAS.true_height = rect.height + parseInt(style.getPropertyValue('border-top-width')) +parseInt(style.getPropertyValue('border-bottom-width'));
		
			
		let mindim = Math.min(window.innerWidth, window.innerHeight);
		JOYSTICK.width = mindim*JOYSTICK_SIZE;
		JOYSTICK.height = mindim*JOYSTICK_SIZE;
		
		render_joystick();
		
	};
	window.onresize(null);
}

// GLOBAL VARIABLES

// MD5 digest for passwords
let md5 = new CLASS_md5();

// Game
let game = new CLASS_game();

// Resources
let res = new CLASS_resources();
res.load();

// Input mechanics
let input = new CLASS_input();

// Visual
let vis = new CLASS_visual();
vis.init_menus();

/*//////////////////////////////////////////////////////////////////////////////////////////////////////
// RESOURCES CLASS
// Images, sounds, level. Just resources.
//////////////////////////////////////////////////////////////////////////////////////////////////////*/

const IMG_BACKGROUND              = 0;
const IMG_TITLESCREEN             = 1;
const IMG_BANANA_PEEL             = 2;
const IMG_KEY_1                   = 3;
const IMG_KEY_2                   = 4;
const IMG_KEY_3                   = 5;
const IMG_KEY_4                   = 6;
const IMG_KEY_5                   = 7;
const IMG_KEY_6                   = 8;
const IMG_FOOTSTEPS               = 9;
const IMG_LADDER                  = 10;
const IMG_DIGIT_0                 = 11;
const IMG_DIGIT_1                 = 12;
const IMG_DIGIT_2                 = 13;
const IMG_DIGIT_3                 = 14;
const IMG_DIGIT_4                 = 15;
const IMG_DIGIT_5                 = 16;
const IMG_DIGIT_6                 = 17;
const IMG_DIGIT_7                 = 18;
const IMG_DIGIT_8                 = 19;
const IMG_DIGIT_9                 = 20;
const IMG_DIGIT_EMPTY             = 21;
const IMG_BTN_BERTI_UP            = 22;
const IMG_BTN_PREV_UP             = 23;
const IMG_BTN_NEXT_UP             = 24;
const IMG_BTN_BERTI_DOWN          = 25;
const IMG_BTN_PREV_DOWN           = 26;
const IMG_BTN_NEXT_DOWN           = 27;
const IMG_BTN_BERTI_BLINK_UP      = 28;
const IMG_BTN_PREV_DISABLED       = 29;
const IMG_BTN_NEXT_DISABLED       = 30;
const IMG_BLOCK_PINNED            = 31;
const IMG_BLOCK_LIGHT             = 32;
const IMG_BLOCK_HEAVY             = 33;
const IMG_BLOCK_DOOR_1            = 34; // Unused (duplicate)
const IMG_BLOCK_DOOR_2            = 35; // Unused (duplicate)
const IMG_BLOCK_DOOR_3            = 36; // Unused (duplicate)
const IMG_BLOCK_DOOR_4            = 37; // Unused (duplicate)
const IMG_BLOCK_DOOR_5            = 38; // Unused (duplicate)
const IMG_BLOCK_DOOR_6            = 39; // Unused (duplicate)
const IMG_NONE                    = 40; // Number 40 contains no image due to a miscalculation
const IMG_DOOR_1_CLOSED           = 41;
const IMG_DOOR_1_OPENING          = 42;
const IMG_DOOR_1_FADING           = 43;
const IMG_DOOR_2_CLOSED           = 44;
const IMG_DOOR_2_OPENING          = 45;
const IMG_DOOR_2_FADING           = 46;
const IMG_DOOR_3_CLOSED           = 47;
const IMG_DOOR_3_OPENING          = 48;
const IMG_DOOR_3_FADING           = 49;
const IMG_DOOR_4_CLOSED           = 50;
const IMG_DOOR_4_OPENING          = 51;
const IMG_DOOR_4_FADING           = 52;
const IMG_DOOR_5_CLOSED           = 53;
const IMG_DOOR_5_OPENING          = 54;
const IMG_DOOR_5_FADING           = 55;
const IMG_DOOR_6_CLOSED           = 56;
const IMG_DOOR_6_OPENING          = 57;
const IMG_DOOR_6_FADING           = 58;
const IMG_BERTI_IDLE              = 59;
const IMG_BERTI_BLINKING          = 60; // Unused, but should be used (Berti blinking when idle)
const IMG_BERTI_CELEBRATING       = 61;
const IMG_BERTI_DEAD              = 62;
const IMG_BERTI_WALK_LEFT_0       = 63;
const IMG_BERTI_WALK_LEFT_1       = 64;
const IMG_BERTI_WALK_LEFT_2       = 65;
const IMG_BERTI_WALK_LEFT_3       = 66;
const IMG_BERTI_WALK_RIGHT_0      = 67;
const IMG_BERTI_WALK_RIGHT_1      = 68;
const IMG_BERTI_WALK_RIGHT_2      = 69;
const IMG_BERTI_WALK_RIGHT_3      = 70;
const IMG_BERTI_WALK_UP_0         = 71;
const IMG_BERTI_WALK_UP_1         = 72;
const IMG_BERTI_WALK_UP_2         = 73;
const IMG_BERTI_WALK_UP_3         = 74;
const IMG_BERTI_WALK_DOWN_0       = 75;
const IMG_BERTI_WALK_DOWN_1       = 76;
const IMG_BERTI_WALK_DOWN_2       = 77;
const IMG_BERTI_WALK_DOWN_3       = 78;
const IMG_BERTI_PUSH_LEFT_0       = 79;
const IMG_BERTI_PUSH_LEFT_1       = 80;
const IMG_BERTI_PUSH_LEFT_2       = 81;
const IMG_BERTI_PUSH_LEFT_3       = 82;
const IMG_BERTI_PUSH_RIGHT_0      = 83;
const IMG_BERTI_PUSH_RIGHT_1      = 84;
const IMG_BERTI_PUSH_RIGHT_2      = 85;
const IMG_BERTI_PUSH_RIGHT_3      = 86;
const IMG_BERTI_PUSH_UP_0         = 87;
const IMG_BERTI_PUSH_UP_1         = 88;
const IMG_BERTI_PUSH_UP_2         = 89;
const IMG_BERTI_PUSH_UP_3         = 90;
const IMG_BERTI_PUSH_DOWN_0       = 91;
const IMG_BERTI_PUSH_DOWN_1       = 92;
const IMG_BERTI_PUSH_DOWN_2       = 93;
const IMG_BERTI_PUSH_DOWN_3       = 94;
const IMG_BERTI_WALK_LEFT_U_0     = 95;  // Unused (duplicate)
const IMG_BERTI_WALK_LEFT_U_1     = 96;  // Unused (duplicate)
const IMG_BERTI_WALK_LEFT_U_2     = 97;  // Unused (duplicate)
const IMG_BERTI_WALK_LEFT_U_3     = 98;  // Unused (duplicate)
const IMG_BERTI_WALK_RIGHT_U_0    = 99;  // Unused (duplicate)
const IMG_BERTI_WALK_RIGHT_U_1    = 100; // Unused (duplicate)
const IMG_BERTI_WALK_RIGHT_U_2    = 101; // Unused (duplicate)
const IMG_BERTI_WALK_RIGHT_U_3    = 102; // Unused (duplicate)
const IMG_BERTI_WALK_UP_U_0       = 103; // Unused (duplicate)
const IMG_BERTI_WALK_UP_U_1       = 104; // Unused (duplicate)
const IMG_BERTI_WALK_UP_U_2       = 105; // Unused (duplicate)
const IMG_BERTI_WALK_UP_U_3       = 106; // Unused (duplicate)
const IMG_BERTI_WALK_DOWN_U_0     = 107; // Unused (not a duplicate, minor differences)
const IMG_BERTI_WALK_DOWN_U_1     = 108; // Unused (not a duplicate, minor differences)
const IMG_BERTI_WALK_DOWN_U_2     = 109; // Unused (not a duplicate, minor differences)
const IMG_BERTI_WALK_DOWN_U_3     = 110; // Unused (not a duplicate, minor differences)
const IMG_PURPMON_STUCK_0         = 111;
const IMG_PURPMON_STUCK_1         = 112;
const IMG_PURPMON_STUCK_2         = 113;
const IMG_PURPMON_STUCK_3         = 114;
const IMG_PURPMON_WALK_LEFT_0     = 115;
const IMG_PURPMON_WALK_LEFT_1     = 116;
const IMG_PURPMON_WALK_LEFT_2     = 117;
const IMG_PURPMON_WALK_LEFT_3     = 118;
const IMG_PURPMON_WALK_RIGHT_0    = 119;
const IMG_PURPMON_WALK_RIGHT_1    = 120;
const IMG_PURPMON_WALK_RIGHT_2    = 121;
const IMG_PURPMON_WALK_RIGHT_3    = 122;
const IMG_PURPMON_WALK_UP_0       = 123;
const IMG_PURPMON_WALK_UP_1       = 124;
const IMG_PURPMON_WALK_UP_2       = 125;
const IMG_PURPMON_WALK_UP_3       = 126;
const IMG_PURPMON_WALK_DOWN_0     = 127;
const IMG_PURPMON_WALK_DOWN_1     = 128;
const IMG_PURPMON_WALK_DOWN_2     = 129;
const IMG_PURPMON_WALK_DOWN_3     = 130;
const IMG_PURPMON_PUSH_LEFT_0     = 131;
const IMG_PURPMON_PUSH_LEFT_1     = 132;
const IMG_PURPMON_PUSH_LEFT_2     = 133;
const IMG_PURPMON_PUSH_LEFT_3     = 134;
const IMG_PURPMON_PUSH_RIGHT_0    = 135;
const IMG_PURPMON_PUSH_RIGHT_1    = 136;
const IMG_PURPMON_PUSH_RIGHT_2    = 137;
const IMG_PURPMON_PUSH_RIGHT_3    = 138;
const IMG_PURPMON_PUSH_UP_0       = 139;
const IMG_PURPMON_PUSH_UP_1       = 140;
const IMG_PURPMON_PUSH_UP_2       = 141;
const IMG_PURPMON_PUSH_UP_3       = 142;
const IMG_PURPMON_PUSH_DOWN_0     = 143;
const IMG_PURPMON_PUSH_DOWN_1     = 144;
const IMG_PURPMON_PUSH_DOWN_2     = 145;
const IMG_PURPMON_PUSH_DOWN_3     = 146;
const IMG_GREENMON_STUCK_0        = 147;
const IMG_GREENMON_STUCK_1        = 148;
const IMG_GREENMON_STUCK_2        = 149;
const IMG_GREENMON_STUCK_3        = 150;
const IMG_GREENMON_WALK_LEFT_0    = 151;
const IMG_GREENMON_WALK_LEFT_1    = 152;
const IMG_GREENMON_WALK_LEFT_2    = 153;
const IMG_GREENMON_WALK_LEFT_3    = 154;
const IMG_GREENMON_WALK_RIGHT_0   = 155;
const IMG_GREENMON_WALK_RIGHT_1   = 156;
const IMG_GREENMON_WALK_RIGHT_2   = 157;
const IMG_GREENMON_WALK_RIGHT_3   = 158;
const IMG_GREENMON_WALK_UP_0      = 159;
const IMG_GREENMON_WALK_UP_1      = 160;
const IMG_GREENMON_WALK_UP_2      = 161;
const IMG_GREENMON_WALK_UP_3      = 162;
const IMG_GREENMON_WALK_DOWN_0    = 163;
const IMG_GREENMON_WALK_DOWN_1    = 164;
const IMG_GREENMON_WALK_DOWN_2    = 165;
const IMG_GREENMON_WALK_DOWN_3    = 166;
const IMG_ARGL                    = 167;
const IMG_WOW                     = 168;
const IMG_YEAH                    = 169;
const IMG_ENDSCREEN               = 170;
const IMG_CHECKBOX_CHECKED        = 171;
const IMG_CHECKBOX_UNCHECKED      = 172;
const IMG_DIALOGBOX_CONFIRM       = 173;
const IMG_DIALOGBOX_SAVELOAD      = 174;
const IMG_DIALOGBOX_LOADLVL       = 175;
const IMG_DIALOGBOX_CHARTS        = 176;
const IMG_BTN_CANCEL_UP           = 177;
const IMG_BTN_CANCEL_DOWN         = 178;
const IMG_BTN_NO_UP               = 179;
const IMG_BTN_NO_DOWN             = 180;
const IMG_BTN_OK_UP               = 181;
const IMG_BTN_OK_DOWN             = 182;
const IMG_BTN_YES_UP              = 183;
const IMG_BTN_YES_DOWN            = 184;

const IMG_DIGIT_LOOKUP = [
	IMG_DIGIT_0,
	IMG_DIGIT_1,
	IMG_DIGIT_2,
	IMG_DIGIT_3,
	IMG_DIGIT_4,
	IMG_DIGIT_5,
	IMG_DIGIT_6,
	IMG_DIGIT_7,
	IMG_DIGIT_8,
	IMG_DIGIT_9
];

function CLASS_resources(){
// Private:
	let that = this;
	let resources_loaded = 0;
	let already_loading = false;
	
	function on_loaded(){
		resources_loaded++;
	};
// Public:
	this.images = new Array();
	this.sounds = new Array();
	this.levels = EXTERNAL_LEVELS;// External loading

	this.ready = function(){
		return (resources_loaded == NUM_RESOURCES);
	}
	this.load = function(){
		if(already_loading){
			return;
		}
		already_loading = true;
		////////////////////////////////////////////////////////
		// Images: /////////////////////////////////////////////
		////////////////////////////////////////////////////////
		// Background image
		that.images[0] = new Image();
		that.images[0].onload = on_loaded();
		that.images[0].src = IMAGE_DIR+"background.png";

		// Entry Image
		that.images[1] = new Image();
		that.images[1].onload = on_loaded();
		that.images[1].src = IMAGE_DIR+"entry.png";

		for(let i = 0; i < 9; i++){// From 2 to 10 garbage
			that.images[2+i] = new Image();
			that.images[2+i].onload = on_loaded();
			that.images[2+i].src = IMAGE_DIR+"garbage_"+i+".png";
		}

		for(let i = 0; i < 11; i++){// From 11 to 21 digits
			that.images[11+i] = new Image();
			that.images[11+i].onload = on_loaded();
			that.images[11+i].src = IMAGE_DIR+"digits_"+i+".png";
		}

		for(let i = 0; i < 3; i++){// From 22 to 30 buttons
			for(let j = 0; j < 3; j++){
				that.images[22+3*i+j] = new Image();
				that.images[22+3*i+j].onload = on_loaded();
				that.images[22+3*i+j].src = IMAGE_DIR+"userbutton_"+i+"-"+j+".png";
			}
		}

		for(let i = 0; i < 9; i++){// From 31 to 39 stones
			that.images[31+i] = new Image();
			that.images[31+i].onload = on_loaded();
			that.images[31+i].src = IMAGE_DIR+"stone_"+i+".png";
		}
		
		// Number 40 contains no image due to a miscalculation

		for(let i = 0; i < 6; i++){// From 41 to 58 doors
			for(let j = 0; j < 3; j++){// Reversed order for ease of access
				that.images[41+3*i+j] = new Image();
				that.images[41+3*i+j].onload = on_loaded();
				that.images[41+3*i+j].src = IMAGE_DIR+"doors_"+j+"-"+i+".png";
			}
		}

		for(let i = 0; i < 13; i++){// From 59 to 110 player (berti)
			for(let j = 0; j < 4; j++){// Reversed order for ease of access
				that.images[59+4*i+j] = new Image();
				that.images[59+4*i+j].onload = on_loaded();
				that.images[59+4*i+j].src = IMAGE_DIR+"player_"+j+"-"+i+".png";
			}
		}

		for(let i = 0; i < 9; i++){// From 111 to 146 monster 1 (purple)
			for(let j = 0; j < 4; j++){// Reversed order for ease of access
				that.images[111+4*i+j] = new Image();
				that.images[111+4*i+j].onload = on_loaded();
				that.images[111+4*i+j].src = IMAGE_DIR+"monster1_"+j+"-"+i+".png";
			}
		}

		for(let i = 0; i < 5; i++){// From 147 to 166 monster 2 (green)
			for(let j = 0; j < 4; j++){// Reversed order for ease of access
				that.images[147+4*i+j] = new Image();
				that.images[147+4*i+j].onload = on_loaded();
				that.images[147+4*i+j].src = IMAGE_DIR+"monster2_"+j+"-"+i+".png";
			}
		}

		that.images[167] = new Image();
		that.images[167].onload = on_loaded();
		that.images[167].src = IMAGE_DIR+"argl.png";

		that.images[168] = new Image();
		that.images[168].onload = on_loaded();
		that.images[168].src = IMAGE_DIR+"wow.png";

		that.images[169] = new Image();
		that.images[169].onload = on_loaded();
		that.images[169].src = IMAGE_DIR+"yeah.png";

		that.images[170] = new Image();
		that.images[170].onload = on_loaded();
		that.images[170].src = IMAGE_DIR+"exit.png";
		
		that.images[171] = new Image();
		that.images[171].onload = on_loaded();
		that.images[171].src = IMAGE_DIR+"check_b.png";
		
		that.images[172] = new Image();
		that.images[172].onload = on_loaded();
		that.images[172].src = IMAGE_DIR+"check_w.png";
		
		that.images[173] = new Image();
		that.images[173].onload = on_loaded();
		that.images[173].src = IMAGE_DIR+"dbx_confirm.png";
		
		that.images[174] = new Image();
		that.images[174].onload = on_loaded();
		that.images[174].src = IMAGE_DIR+"dbx_saveload.png";
		
		that.images[175] = new Image();
		that.images[175].onload = on_loaded();
		that.images[175].src = IMAGE_DIR+"dbx_loadlvl.png";
		
		that.images[176] = new Image();
		that.images[176].onload = on_loaded();
		that.images[176].src = IMAGE_DIR+"dbx_charts.png";
		
		that.images[177] = new Image();
		that.images[177].onload = on_loaded();
		that.images[177].src = IMAGE_DIR+"btn_c-up.png";
		
		that.images[178] = new Image();
		that.images[178].onload = on_loaded();
		that.images[178].src = IMAGE_DIR+"btn_c-down.png";
		
		that.images[179] = new Image();
		that.images[179].onload = on_loaded();
		that.images[179].src = IMAGE_DIR+"btn_n-up.png";
		
		that.images[180] = new Image();
		that.images[180].onload = on_loaded();
		that.images[180].src = IMAGE_DIR+"btn_n-down.png";
		
		that.images[181] = new Image();
		that.images[181].onload = on_loaded();
		that.images[181].src = IMAGE_DIR+"btn_o-up.png";

		that.images[182] = new Image();
		that.images[182].onload = on_loaded();
		that.images[182].src = IMAGE_DIR+"btn_o-down.png";
		
		that.images[183] = new Image();
		that.images[183].onload = on_loaded();
		that.images[183].src = IMAGE_DIR+"btn_y-up.png";
		
		that.images[184] = new Image();
		that.images[184].onload = on_loaded();
		that.images[184].src = IMAGE_DIR+"btn_y-down.png";
		
		////////////////////////////////////////////////////////
		// Sounds: /////////////////////////////////////////////
		////////////////////////////////////////////////////////
		
		let soundarray = [
		"about.mp3",
		"argl.mp3",
		"attack1.mp3",
		"attack2.mp3",
		"chart.mp3",
		"click.mp3",
		"gameend.mp3",
		"getpoint.mp3",
		"newplane.mp3",
		"opendoor.mp3",
		"wow.mp3",
		"yeah.mp3"];
		
		for(let i = 0; i < soundarray.length; i++){
			that.sounds[i] = new Audio();
			that.sounds[i].oncanplaythrough = on_loaded();
			that.sounds[i].src = SOUND_DIR+soundarray[i];
		}

		////////////////////////////////////////////////////////
		// Level: //////////////////////////////////////////////
		////////////////////////////////////////////////////////

		// levels is now loaded externally
		if(that.levels !== null){
			on_loaded();
		}
	}
}

/*//////////////////////////////////////////////////////////////////////////////////////////////////////
// INPUT CLASS
// Everything that has to do with keyboard and mouse input goes here
//////////////////////////////////////////////////////////////////////////////////////////////////////*/

function CLASS_input(){
// Private:
	let that = this;
	
	function handle_keydown_global(evt) {
		game.remove_soundrestriction();
		that.keys_down[evt.keyCode] = true;
		if(evt.keyCode == KEY_CODE_LEFT){
			game.last_dir_pressed = DIR_LEFT;
		}else if(evt.keyCode == KEY_CODE_UP){
			game.last_dir_pressed = DIR_UP;
		}else if(evt.keyCode == KEY_CODE_RIGHT){
			game.last_dir_pressed = DIR_RIGHT;
		}else if(evt.keyCode == KEY_CODE_DOWN){
			game.last_dir_pressed = DIR_DOWN;
		}
		
		if(vis.dbx.firstChild){// If a dialog box is open
			if(that.keys_down[KEY_CODE_ENTER]){
				vis.dbx.enterfun();
			}else if(that.keys_down[KEY_CODE_ESC]){
				vis.dbx.cancelfun();
			}
		}
	}

	function handle_keyup_global(evt) {
		delete that.keys_down[evt.keyCode];
	}
	
	function handle_mousemove_global(evt) {
		that.mouse_pos_global =  {x: evt.clientX, y: evt.clientY};
		if(vis !== null && vis.dbx !== null && vis.dbx.style.display != "none"){
			if(vis.dbx.drag){
				let temp_x = (that.mouse_pos_global.x-vis.dbx.drag_pos.x);
				let temp_y = (that.mouse_pos_global.y-vis.dbx.drag_pos.y);
				if(temp_x < 0) temp_x = 0;
				if(temp_y < 0) temp_y = 0;
				
				vis.dbx.style.left = temp_x+"px";
				vis.dbx.style.top = temp_y+"px";
			}
		}
	};
	
	function handle_mousedown_global(evt) {
		game.remove_soundrestriction();
		that.mouse_down = true;
		if(vis !== null && vis.dbx !== null && vis.dbx.style.display != "none"){
			let rel_pos = {x:that.mouse_pos_global.x - parseInt(vis.dbx.style.left), y:that.mouse_pos_global.y - parseInt(vis.dbx.style.top)};
			if(rel_pos.x > 0 && rel_pos.x < parseInt(vis.dbx.style.width) && rel_pos.y > 0 && rel_pos.y < 20){
				evt.preventDefault();// Prevents from selecting the canvas
				vis.dbx.drag = true;
				vis.dbx.drag_pos = rel_pos;
			}
		}
	};
	
	function handle_mouseup_global(evt) {
		that.mouse_down = false;
		if(vis !== null && vis.dbx !== null && vis.dbx.style.display != "none"){
			vis.dbx.drag = false;
		}
	};
		
	function handle_mousemove(evt) {
		let rect = CANVAS.getBoundingClientRect();
		let style = window.getComputedStyle(CANVAS);
		that.mouse_pos =  {
			x: Math.round((evt.clientX - rect.left - parseInt(style.getPropertyValue('border-left-width')))/CANVAS.true_width*CANVAS.width),
			y: Math.round((evt.clientY - rect.top - parseInt(style.getPropertyValue('border-top-width')))/CANVAS.true_height*CANVAS.height)
		};
		
		if(that.lastclick_button == 3){
			game.set_volume((that.mouse_pos.x-vis.vol_bar.offset_x)/vis.vol_bar.width);
		}
		
		if(that.menu_pressed == 0){
			calc_opened(vis.menu1, that.mouse_pos.x, that.mouse_pos.y);
		}
	};

	function handle_mousedown(evt){
		evt.preventDefault();// Prevents from selecting the canvas
		that.mouse_lastclick = {x: that.mouse_pos.x, y: that.mouse_pos.y};
		
		if(that.mouse_pos.y >= 35 && that.mouse_pos.y <= 65){
			if(that.mouse_pos.x >= 219 && that.mouse_pos.x <= 249){
				that.lastclick_button = 0;
			}else if(that.mouse_pos.x >= 253 && that.mouse_pos.x <= 283){
				that.lastclick_button = 1;
			}else if(that.mouse_pos.x >= 287 && that.mouse_pos.x <= 317){
				that.lastclick_button = 2;
			}
		}
		if(that.mouse_pos.x >= vis.vol_bar.offset_x && that.mouse_pos.y >= vis.vol_bar.offset_y &&
		   that.mouse_pos.x <= vis.vol_bar.offset_x + vis.vol_bar.width && that.mouse_pos.y <= vis.vol_bar.offset_y + vis.vol_bar.height){
			game.set_volume((that.mouse_pos.x-vis.vol_bar.offset_x)/vis.vol_bar.width);
			that.lastclick_button = 3;
		}
		
		if(that.mouse_pos.x >= vis.menu1.offset_x && that.mouse_pos.x <= vis.menu1.offset_x + vis.menu1.width &&
		   that.mouse_pos.y >= vis.menu1.offset_y && that.mouse_pos.y <= vis.menu1.offset_y + vis.menu1.height){
			if(that.menu_pressed == -1){
				that.menu_pressed = 0;
				calc_opened(vis.menu1, that.mouse_pos.x, that.mouse_pos.y);
			}else{
				that.menu_pressed = -1;
				vis.menu1.submenu_open = -1;
			}
		}else{
			let menubutton_pressed = false;
			
			if(that.menu_pressed != -1){
				that.lastklick_option = calc_option(vis.menu1, that.mouse_pos.x, that.mouse_pos.y);
				if(that.lastklick_option !== null){
					menubutton_pressed = true;
				}
			}
			
			if(!menubutton_pressed){
				that.menu_pressed = -1;
				vis.menu1.submenu_open = -1;
			}
		}
		
	};

	function handle_mouseup(evt){
		if(that.mouse_pos.y >= 35 && that.mouse_pos.y <= 65){
			if(that.mouse_pos.x >= 219 && that.mouse_pos.x <= 249 && that.lastclick_button == 0 && game.buttons_activated[0]){
				//alert("<<");
				game.prev_level();
			}else if(that.mouse_pos.x >= 253 && that.mouse_pos.x <= 283 && that.lastclick_button == 1 && game.buttons_activated[1]){
				//alert("Berti");
				game.reset_level();
			}else if(that.mouse_pos.x >= 287 && that.mouse_pos.x <= 317 && that.lastclick_button == 2 && game.buttons_activated[2]){
				//alert(">>");
				game.next_level();
			}
		}
		
		if(that.menu_pressed == 0 && that.lastklick_option !== null && !that.lastklick_option.line){
			let up_option = calc_option(vis.menu1, that.mouse_pos.x, that.mouse_pos.y);
			if(up_option === that.lastklick_option && that.lastklick_option.on()){
				switch(that.lastklick_option.effect_id){
					case 0:
						if(game.savegame.progressed){
							vis.open_dbx(DBX_CONFIRM, 0);
						}else{
							game.clear_savegame();
						}
						break;
					case 1:
						if(game.savegame.progressed){
							vis.open_dbx(DBX_CONFIRM, 1);
						}else{
							vis.open_dbx(DBX_LOAD);
						}
						break;
					case 2:
						if(game.savegame.username !== null){
							game.store_savegame();
						}else{
							vis.open_dbx(DBX_SAVE);
						}
						break;
					case 3:
						game.toggle_paused();
						break;
					case 4:
						game.toggle_single_steps();
						break;
					case 5:
						game.toggle_sound();
						break;
					case 6:
						vis.open_dbx(DBX_LOADLVL);
						break;
					case 7:
						vis.open_dbx(DBX_CHPASS);
						break;
					case 8:
						vis.open_dbx(DBX_CHARTS);
						break;
					default:
						break;
				}
				that.menu_pressed = -1;
				vis.menu1.submenu_open = -1;
			}
		}
		
		that.lastclick_button = -1;
		that.lastklick_option = null;
	};

	function handle_mouseout(evt){
		//handle_mouseup(evt);
	};
	
	
	function calc_opened(a_menu, mouse_x, mouse_y){
		if(mouse_y < a_menu.offset_y || mouse_y > a_menu.offset_y + a_menu.height){
			return;
		}
		if(mouse_x < a_menu.offset_x || mouse_x > a_menu.offset_x + a_menu.width){
			return;
		}
		
		let submenu_offset = 0;
		for(let i = 0; i < a_menu.submenu_list.length; i++){
			submenu_offset += a_menu.submenu_list[i].width;
			if(mouse_x < a_menu.offset_x + submenu_offset){
				a_menu.submenu_open = i;
				return;
			}
		}
	}
	
	function calc_option(a_menu, mouse_x, mouse_y){
		if(a_menu.submenu_open != -1){
			let submenu_offset = 0;
			for(let i = 0; i < a_menu.submenu_list.length; i++){
				let sm = a_menu.submenu_list[i];
				if(i == a_menu.submenu_open){
					let option_offset = a_menu.offset_y + a_menu.height + 4;
					for(let j = 0; j < sm.options.length; j++){
						let next_offset;
						if(sm.options[j].line){
							next_offset = option_offset + sm.offset_line;
						}else{
							next_offset = option_offset + sm.offset_text;
						}
					
						if(mouse_x > a_menu.offset_x + submenu_offset && mouse_x < a_menu.offset_x + submenu_offset + sm.dd_width &&
						mouse_y > option_offset && mouse_y < next_offset){
							return sm.options[j];
						}
					
						option_offset = next_offset;
					}
				}
				submenu_offset += sm.width;
			}
		}
		return null;
	}
	
	function handle_touch_global(evt){
		game.remove_soundrestriction();
		//evt.preventDefault();
		let touches = evt.changedTouches;
		let rect = JOYSTICK.getBoundingClientRect();
		let style = window.getComputedStyle(JOYSTICK);
		
		let changed = false;
		
		let mid_x = JOYSTICK.width/2;
		let mid_y = JOYSTICK.height/2;
			
		for (let i=0; i < touches.length; i++) {
			let x = Math.round(touches[i].clientX - rect.left - parseInt(style.getPropertyValue('border-left-width')));
			let y = Math.round(touches[i].clientY - rect.top - parseInt(style.getPropertyValue('border-top-width')));
			
			if(x >= 0 && x <= JOYSTICK.width && y >= 0 && y <= JOYSTICK.height){
				if(x >= y){
					if(-x+JOYSTICK.height >= y){
						that.joystick_dir = DIR_UP;
						changed = true;
					}else{
						that.joystick_dir = DIR_RIGHT;
						changed = true;
					}
				}else{
					if(-x+JOYSTICK.width >= y){
						that.joystick_dir = DIR_LEFT;
						changed = true;
					}else{
						that.joystick_dir = DIR_DOWN;
						changed = true;
					}
				}
				
				let now = Date.now();
				if(now - that.last_joystick_render > 15){
					render_joystick(x, y);
					that.last_joystick_render = now;
				}
			}
		}
		
		if(!changed) {
			render_joystick();
			that.joystick_dir = DIR_NONE;
		}
	}
	
	function handle_touchend_global(evt){
		//evt.preventDefault();
		render_joystick();
		that.joystick_dir = DIR_NONE;
	}
	
// Public:
	this.keys_down = new Array();
	this.mouse_pos = {x: 0, y: 0};
	this.mouse_pos_global = {x: 0, y: 0};
	this.mouse_lastclick = {x: 0, y: 0};
	this.mouse_down = false;
	this.lastclick_button = -1;
	this.menu_pressed = -1;
	this.lastklick_option = null;
	
	if(IS_TOUCH_DEVICE){
		this.joystick_dir = DIR_NONE;
		this.last_joystick_render = Date.now();
	}
	
	this.init = function(){
	
		// Handle keyboard controls (GLOBAL)
		document.addEventListener('keydown', handle_keydown_global, false);

		document.addEventListener('keyup', handle_keyup_global, false);
		
		// Handle mouse controls (GLOBAL)

		document.addEventListener('mousemove', handle_mousemove_global, false);
		
		document.addEventListener('mousedown', handle_mousedown_global, false);
		
		document.addEventListener('mouseup', handle_mouseup_global, false);
		
		// Handle touch events
		
		document.addEventListener("touchstart", handle_touch_global, false);
		
		document.addEventListener("touchmove", handle_touch_global, false);
		
		document.addEventListener("touchend", handle_touchend_global, false);
		
		// Handle mouse controls (CANVAS)
		CANVAS.addEventListener('mousemove', handle_mousemove, false);
			
		CANVAS.addEventListener('mousedown', handle_mousedown, false);

		CANVAS.addEventListener('mouseup', handle_mouseup, false);

		CANVAS.addEventListener('mouseout', handle_mouseout, false);
	}
}

/*//////////////////////////////////////////////////////////////////////////////////////////////////////
// GAME CLASS
// Holds entities and the game itself
//////////////////////////////////////////////////////////////////////////////////////////////////////*/

const ENT_DUMMY          = -1; // Dummy block (invisible), prevents entities from moving to already occupied squares
const ENT_EMPTY          =  0; // Empty and unoccupied space
const ENT_PLAYER_BERTI   =  1; // Berti the garbage man, the entity that is controlled by the player
const ENT_AUTO_BERTI     =  2; // Berti clones that move automatically, as seen in the intro screen
const ENT_PINNED_BLOCK   =  3; // Solid, pinned block that cannot be moved
const ENT_BANANA_PEEL    =  4; // The banana peels which Berti needs to pick up to complete the levels
const ENT_LIGHT_BLOCK    =  5; // Light blue block with four arrows on it, pushable
const ENT_HEAVY_BLOCK    =  6; // Dark blue block with diamond shape <> on it, pushable if nothing is behind it
const ENT_PURPLE_MONSTER =  7; // Purple monster, can push blocks
const ENT_UNUSED_1       =  8; // Unused
const ENT_UNUSED_2       =  9; // Unused
const ENT_GREEN_MONSTER  = 10; // Green monster, cannot push blocks
const ENT_UNUSED_3       = 11; // Unused
const ENT_UNUSED_4       = 12; // Unused
const ENT_KEY_1          = 13; // Key which opens corresponding door
const ENT_KEY_2          = 14; // Key which opens corresponding door
const ENT_KEY_3          = 15; // Key which opens corresponding door
const ENT_KEY_4          = 16; // Key which opens corresponding door
const ENT_KEY_5          = 17; // Key which opens corresponding door
const ENT_KEY_6          = 18; // Key which opens corresponding door
const ENT_DOOR_1         = 19; // Door which is opened by corresponding key
const ENT_DOOR_2         = 20; // Door which is opened by corresponding key
const ENT_DOOR_3         = 21; // Door which is opened by corresponding key
const ENT_DOOR_4         = 22; // Door which is opened by corresponding key
const ENT_DOOR_5         = 23; // Door which is opened by corresponding key
const ENT_DOOR_6         = 24; // Door which is opened by corresponding key

function CLASS_game(){
// Private:
	let that = this;
	
	
	//////////////////////////////////////////////////////////////////////////////
	// Savegame section:
	//////////////////////////////////////////////////////////////////////////////
	function CLASS_savegame(){
		this.usernumber = -1;
	
		this.username = null;
		this.password = null;
		this.reached_level = 1;
		
		this.progressed = false;
	
		this.arr_steps = new Array();
		for(let i = 1; i <= 50; i++){
			this.arr_steps[i] = 0;
		}
	}
	
	this.savegame = new CLASS_savegame();
	
	this.clear_savegame = function(){
		this.savegame = new CLASS_savegame();
		that.level_unlocked = 1;
		that.load_level(that.level_unlocked);
	}
	
	this.update_savegame = function(lev, steps){
		if(that.savegame.reached_level <= lev){
			that.savegame.reached_level = lev+1;
			that.savegame.progressed = true;
		}
		if(that.savegame.arr_steps[lev] == 0 || that.savegame.arr_steps[lev] > steps){
			that.savegame.arr_steps[lev] = steps;
			that.savegame.progressed = true;
		}
	}
	
	this.store_savegame = function(){
		if(localStorage.getItem("user_count") === null){
			localStorage.setItem("user_count", 1);
			that.savegame.usernumber = 0;
		}else if(that.savegame.usernumber == -1){
			that.savegame.usernumber = parseInt(localStorage.getItem("user_count"));
			localStorage.setItem("user_count", that.savegame.usernumber+1);
		}
		
		let prefix = "player"+that.savegame.usernumber+"_";
		
		localStorage.setItem(prefix+"username", that.savegame.username);
		localStorage.setItem(prefix+"password", that.savegame.password);
		localStorage.setItem(prefix+"reached_level", that.savegame.reached_level);
		
		for(let i = 1; i <= 50; i++){
			localStorage.setItem(prefix+"steps_lv"+i, that.savegame.arr_steps[i]);
		}
		
		that.savegame.progressed = false;
		
		return ERR_SUCCESS;// Success!
	}
	
	this.retrieve_savegame = function(uname, pass){
		let user_count = localStorage.getItem("user_count");
		if(user_count === null){
			return ERR_NOSAVE;// There are no save games
		}
		user_count = parseInt(user_count);
		pass = md5.digest(pass);
		
		for(let i = 0; i < user_count; i++){
			let prefix = "player"+i+"_";
			if(localStorage.getItem(prefix+"username") == uname){
				if(localStorage.getItem(prefix+"password") == pass){
					that.savegame = new CLASS_savegame();
					that.savegame.usernumber = i;
					that.savegame.username = uname;
					that.savegame.password = pass;
					that.savegame.reached_level = parseInt(localStorage.getItem(prefix+"reached_level"));
					for(let i = 1; i <= 50; i++){
						that.savegame.arr_steps[i] = parseInt(localStorage.getItem(prefix+"steps_lv"+i));
					}
					that.savegame.progressed = false;
					
					that.level_unlocked = that.savegame.reached_level;
					if(that.level_unlocked >= 50){
						that.load_level(50);
					}else{
						that.load_level(that.level_unlocked);
					}
					
					return ERR_SUCCESS;// Success!
				}else{
					return ERR_WRONGPW;// Wrong password!
				}
			}
		}
		return ERR_NOTFOUND;// There's no such name
	}
	
	this.name_savegame = function(uname, pass){
		let user_count = localStorage.getItem("user_count");
		if(user_count !== null){
			user_count = parseInt(user_count);
			for(let i = 0; i < user_count; i++){
				let prefix = "player"+i+"_";
				if(localStorage.getItem(prefix+"username") == uname){
					return ERR_EXISTS;// Failed already exists
				}
			}	
		}
		that.savegame.username = uname;
		that.savegame.password = md5.digest(pass)
		return ERR_SUCCESS;// Worked
	}
	
	this.change_password = function(pass, newpass){
		pass = md5.digest(pass);
		if(that.savegame.password === pass){
			that.savegame.password = md5.digest(newpass);
			localStorage.setItem("player"+that.savegame.usernumber+"_password", that.savegame.password);
			return ERR_SUCCESS;// Worked
		}
		return ERR_WRONGPW;// Wrong pass
	}
	
	// Those calls are on a higher abstraction levels and can be safely used by dialog boxes:
	this.dbxcall_save = function(uname, pass){
		let result;
		if(uname === null || uname == "") {
			vis.error_dbx(ERR_EMPTYNAME);
			return false;
		}
		
		if(that.savegame.username === null){
			result = that.name_savegame(uname, pass);
			if(result != ERR_SUCCESS){
				vis.error_dbx(result);
				return false;
			}
		}
		
		result = that.store_savegame();
		if(result != ERR_SUCCESS){
			vis.error_dbx(result);
			return false;
		}
		
		return true;
	}
	
	this.dbxcall_load = function(uname, pass){
		if(uname === null || uname == "") {
			vis.error_dbx(ERR_EMPTYNAME);
			return false;
		}
		
		let result = that.retrieve_savegame(uname, pass);
		if(result != ERR_SUCCESS){
			vis.error_dbx(result);
			return false;
		}
		
		return true;
	}
	
	this.dbxcall_chpass = function(pass, newpass){
		let result = that.change_password(pass, newpass);
		if(result != ERR_SUCCESS){
			vis.error_dbx(result);
			return false;
		}
		
		return true;
	}
	
	/*//////////////////////////////////////////////////////////////////////////////////////////////////////
	// ENTITY CLASS
	// Players, blocks, opponents. Even dummy block, everything of that is in the entity class.
	//////////////////////////////////////////////////////////////////////////////////////////////////////*/
	
	function CLASS_entity(){
	}
	CLASS_entity.prototype.init = function(a_id){
	// Public:
		this.id = a_id
		this.moving = false;
		this.moving_offset = {x: 0, y: 0};
		this.pushing = false;
		this.face_dir = DIR_DOWN;
		this.berti_id = -1;// Multiple bertis are possible, this makes the game engine much more flexible
		this.sees_berti = false;
		this.time_since_noise = 100;
		this.just_moved = false;
		this.gets_removed_in = -1;// Removal timer for doors
		
		if(this.id == ENT_PLAYER_BERTI || this.id == ENT_AUTO_BERTI || this.id == ENT_LIGHT_BLOCK || this.id == ENT_PURPLE_MONSTER){
			this.can_push = true;
		}else{
			this.can_push = false;
		}
		
		if(this.id == ENT_LIGHT_BLOCK || this.id == ENT_HEAVY_BLOCK){
			this.pushable = true;
		}else{
			this.pushable = false;
		}
		
		if(this.id == ENT_BANANA_PEEL || this.id == ENT_KEY_1 || this.id == ENT_KEY_2 || this.id == ENT_KEY_3 || this.id == ENT_KEY_4 || this.id == ENT_KEY_5 || this.id == ENT_KEY_6){
			this.consumable = true;
		}else{
			this.consumable = false;
		}
		
		if(this.id == ENT_PLAYER_BERTI || this.id == ENT_AUTO_BERTI || this.id == ENT_PURPLE_MONSTER || this.id == ENT_GREEN_MONSTER){
			// This is a technical attribute.
			// Small entities can follow into occupied, moving entities from all directions.
			// Monsters can see through small entities.
			this.is_small = true;
		}else{
			this.is_small = false;
		}
		
		// Purely visual aspects here. No impact on gameplay logic
		this.animation_frame = -1;
		this.animation_delay = 0;
		
		this.fine_offset_x = 0;
		this.fine_offset_y = 0;
		// end visual
	}
	CLASS_entity.prototype.move_randomly = function(curr_x, curr_y){
		if(!this.moving){
			let tried_forward = false;
			let back_dir = game.opposite_dir(this.face_dir);
			let possibilities = new Array(DIR_UP, DIR_DOWN, DIR_LEFT, DIR_RIGHT);
			for(let i = 0; i < possibilities.length; i++){
				if(possibilities[i] == this.face_dir || possibilities[i] == back_dir){
					possibilities.splice(i, 1);
					i--;
				}
			}
			
			if(Math.random() < 0.80){
				if(game.walkable(curr_x, curr_y, this.face_dir)){
					game.start_move(curr_x, curr_y, this.face_dir);
					return;
				}
				tried_forward = true;
			}
			
			while(possibilities.length > 0){
				let selection = Math.floor(Math.random()*possibilities.length);
				if(game.walkable(curr_x, curr_y, possibilities[selection])){
					game.start_move(curr_x, curr_y, possibilities[selection]);
					return;
				}else{
					possibilities.splice(selection, 1);
				}
			}
			
			if(!tried_forward){
				if(game.walkable(curr_x, curr_y, this.face_dir)){
					game.start_move(curr_x, curr_y, this.face_dir);
					return;
				}
			}
			
			if(game.walkable(curr_x, curr_y, back_dir)){
				game.start_move(curr_x, curr_y, back_dir);
				return;
			}
			// Here's the code if that dude can't go anywhere: (none)
		}
	}
	CLASS_entity.prototype.chase_berti = function(curr_x, curr_y){
		if(!this.moving){
			this.time_since_noise++;
			
			let closest_dist = LEV_DIMENSION_X + LEV_DIMENSION_Y + 1;
			let closest_berti = -1;
			
			for(let i = 0; i < game.berti_positions.length; i++){
				let face_right_direction = 
				(this.face_dir == DIR_DOWN && game.berti_positions[i].y >= curr_y) || 
				(this.face_dir == DIR_UP && game.berti_positions[i].y <= curr_y) || 
				(this.face_dir == DIR_LEFT && game.berti_positions[i].x <= curr_x) || 
				(this.face_dir == DIR_RIGHT && game.berti_positions[i].x >= curr_x);
				
				if(face_right_direction && game.can_see_tile(curr_x, curr_y, game.berti_positions[i].x, game.berti_positions[i].y)){
					let distance = Math.abs(game.berti_positions[i].x - curr_x) + Math.abs(game.berti_positions[i].y - curr_y);// Manhattan distance
					if(distance < closest_dist || (distance == closest_dist && Math.random() < 0.50)){
						closest_dist = distance;
						closest_berti = i;
					}
				}
			}
			
			if(closest_berti == -1 || Math.random() < 0.02){// Can't see berti OR he randomly gets distracted THEN Random search
				this.sees_berti = false;
				this.move_randomly(curr_x, curr_y);
			}else{// Chasing code here.
				if(!this.sees_berti){
					this.sees_berti = true;
					
					if(this.time_since_noise > Math.ceil(Math.random()*10)+3){
						this.time_since_noise = 0;
						if(this.id == ENT_PURPLE_MONSTER){
							game.play_sound(2);
						}else if(this.id == ENT_GREEN_MONSTER){
							game.play_sound(3);
						}
					}
				}
				
				let diff_x = game.berti_positions[closest_berti].x - curr_x;
				let diff_y = game.berti_positions[closest_berti].y - curr_y;
				
				// THIS IS AN OPTIONAL FIX THAT MAKES THE GAME MUCH HARDER!
				/*let closest_berti_obj = game.level_array[game.berti_positions[closest_berti].x][game.berti_positions[closest_berti].y];
				
				if(closest_berti_obj.moving){
					let next_pos = game.dir_to_coords(game.berti_positions[closest_berti].x, game.berti_positions[closest_berti].y, closest_berti_obj.face_dir);
					if(Math.abs(curr_x - next_pos.x) + Math.abs(curr_y - next_pos.y) == 1){
						if(Math.abs(closest_berti_obj.moving_offset.x) + Math.abs(closest_berti_obj.moving_offset.x) >= 15)
						return;
					}
				}*/// END OF OPTIONAL FIX
				
				let dir1;
				let dir2;
				
				if(diff_x == 0){
					if(diff_y == 0){// This should NEVER happen.
						alert("001: Something went mighty wrong! Blame the programmer!");
						this.move_randomly(curr_x, curr_y);
						return;
					}else if(diff_y > 0){
						dir1 = dir2 = DIR_DOWN;
					}else{// diff_y < 0
						dir1 = dir2 = DIR_UP;
					}
				}else if(diff_x > 0){
					if(diff_y == 0){
						dir1 = dir2 = DIR_RIGHT;
					}else if(diff_y > 0){
						dir1 = DIR_RIGHT;
						dir2 = DIR_DOWN;
					}else{// diff_y < 0
						dir1 = DIR_RIGHT
						dir2 = DIR_UP;
					}
				}else{// diff_x < 0
					if(diff_y == 0){
						dir1 = dir2 = DIR_LEFT;
					}else if(diff_y > 0){
						dir1 = DIR_LEFT;
						dir2 = DIR_DOWN;
					}else{// diff_y < 0
						dir1 = DIR_LEFT
						dir2 = DIR_UP;
					}
				}
				
				if(dir1 != dir2){
					let total_distance = Math.abs(diff_x) + Math.abs(diff_y);
					let percentage_x = Math.abs(diff_x / total_distance);
					
					if(Math.random() >= percentage_x){
						let swapper = dir1;
						dir1 = dir2;
						dir2 = swapper;
					}
					if(game.walkable(curr_x, curr_y, dir1)){
						game.start_move(curr_x, curr_y, dir1);
					}else if(game.walkable(curr_x, curr_y, dir2)){
						game.start_move(curr_x, curr_y, dir2);
					}else{
						this.move_randomly(curr_x, curr_y);
					}
				}else{
					if(game.walkable(curr_x, curr_y, dir1)){
						game.start_move(curr_x, curr_y, dir1);
					}else{
						this.move_randomly(curr_x, curr_y);
					}
				}
				
			}
		}
	}
	
	CLASS_entity.prototype.update_entity = function(curr_x, curr_y){
		this.animation_delay++;// This is an important link between the game logic and animation timing.
		
		if(this.moving){
			switch (this.face_dir) {
				case DIR_UP:
					this.moving_offset.y -= game.move_speed;
					break;
				case DIR_DOWN:
					this.moving_offset.y += game.move_speed;
					break;
				case DIR_LEFT:
					this.moving_offset.x -= game.move_speed;
					break;
				case DIR_RIGHT:
					this.moving_offset.x += game.move_speed;
					break;
				default:
					alert("002: Something went mighty wrong! Blame the programmer!");// This should never be executed
					break;
			}
			if(this.moving_offset.x <= -24 || this.moving_offset.x >= 24 || this.moving_offset.y <= -24 || this.moving_offset.y >= 24){
				game.move(curr_x, curr_y, this.face_dir);
				this.just_moved = true;
			}
		}
		
		if(this.gets_removed_in == 0){
			if(this.moving){
				let dst = game.dir_to_coords(curr_x, curr_y, this.face_dir);
				game.level_array[dst.x][dst.y].init(ENT_EMPTY);
			}
			game.level_array[curr_x][curr_y].init(ENT_EMPTY);
		}else if(this.gets_removed_in > 0){
			this.gets_removed_in -= 1;
			vis.update_animation(curr_x, curr_y);
		}
	}
	
	CLASS_entity.prototype.register_input = function(curr_x, curr_y, just_prime){
		if(!this.moving){
			for(let i = 0; i < 3; i++){
				let dir_1 = DIR_NONE;
				let dir_2 = DIR_NONE;
				if(i == 0){
					// Keyboard control
					if(input.keys_down[KEY_CODE_LEFT] && !input.keys_down[KEY_CODE_RIGHT]){
						dir_1 = DIR_LEFT;
					}else if(!input.keys_down[KEY_CODE_LEFT] && input.keys_down[KEY_CODE_RIGHT]){
						dir_1 = DIR_RIGHT;
					}
					
					if(input.keys_down[KEY_CODE_UP] && !input.keys_down[KEY_CODE_DOWN]){
						dir_2 = DIR_UP;
					}else if(!input.keys_down[KEY_CODE_UP] && input.keys_down[KEY_CODE_DOWN]){
						dir_2 = DIR_DOWN;
					}
					
					if(game.last_dir_pressed == DIR_UP || game.last_dir_pressed == DIR_DOWN){
						// Make sure that the preferred direction is what we last pressed
						let swap_helper = dir_1;
						dir_1 = dir_2;
						dir_2 = swap_helper;
					}
					
				}else if(i == 1){
					// Touch control
					if(IS_TOUCH_DEVICE){
						dir_1 = input.joystick_dir;
					}
				}else if(i == 2){
					// Auto walk control
					if(!game.single_steps){
						dir_1 = game.last_dir_pressed;
					}
				}
				
				for(let j = 0; j < 2; j++){
					let dir = DIR_NONE;
					if(j == 0){
						dir = dir_1;
					}else if(j == 1){
						dir = dir_2;
					}
					if(!just_prime && game.walkable(curr_x, curr_y, dir)){
						game.start_move(curr_x, curr_y, dir);
						return;
					}
				}
			}
		}
	}
	// After each update, this function gets called for (every) Berti to see if he was caught!
	CLASS_entity.prototype.check_enemy_proximity = function(curr_x, curr_y){
		
		if(this.moving_offset.x != 0 || this.moving_offset.y != 0) return;
		
		let adj_array = game.get_adjacent_tiles(curr_x, curr_y);
		for(let i = 0; i < adj_array.length; i++){
			if(game.level_array[adj_array[i].x][adj_array[i].y].id == ENT_PURPLE_MONSTER || game.level_array[adj_array[i].x][adj_array[i].y].id == ENT_GREEN_MONSTER){// If there's an opponent on this adjacent tile
				let enemy_moving_offset_x = game.level_array[adj_array[i].x][adj_array[i].y].moving_offset.x;
				let enemy_moving_offset_y = game.level_array[adj_array[i].x][adj_array[i].y].moving_offset.y;
				if(enemy_moving_offset_x != 0 || enemy_moving_offset_y != 0) continue;
				
				if(Math.abs(curr_x - adj_array[i].x) == 1 && Math.abs(curr_y - adj_array[i].y) == 1){// If the opponent is diagonally AND
					// there's an obstacle in the way
					if((game.level_array[adj_array[i].x][curr_y].id != ENT_DUMMY && game.level_array[adj_array[i].x][curr_y].id != ENT_EMPTY) ||
						(game.level_array[curr_x][adj_array[i].y].id != ENT_DUMMY && game.level_array[curr_x][adj_array[i].y].id != ENT_EMPTY)){
						continue;// Don't perform a proximity check for this particular foe.
					}
				}
			
				// Got caught!
				game.play_sound(1);
				game.wait_timer = LEV_STOP_DELAY*UPS;
				game.level_ended = 2;
				vis.update_all_animations();
				return;
			}
		}
	}

	/*//////////////////////////////////////////////////////////////////////////////////////////////////////
	// END OF ENTITY CLASS
	// GAME CLASS
	// Core engine, entity class, game ending criteria and much more
	//////////////////////////////////////////////////////////////////////////////////////////////////////*/
	this.move_speed = Math.round(1*60/UPS);
	this.door_removal_delay = Math.round(8*UPS/60);
	
	this.fpsInterval = 1000 / UPS;
	this.then = Date.now();
	
	this.initialized = false;
	this.wait_timer = INTRO_DURATION*UPS;
	this.paused = false;
	
	this.update_drawn = false;
	this.mode = 0;// 0 is entry, 1 is menu and play
	this.level_number = 0;
	this.level_array = new Array();
	this.level_unlocked = 0;
	this.level_ended = 0;// 0 is not ended. 1 is won. 2 is died.
	this.wow = true;// true is WOW!, false is Yeah!
	
	this.berti_positions;
	
	this.single_steps = true;
	this.last_dir_pressed = DIR_NONE;
	
	this.steps_taken = 0;
	this.num_bananas = 0;
	
	this.last_updated = Date.now();
	this.delta_updated = 0;
	
	this.buttons_activated = new Array();
	this.buttons_activated[0] = this.buttons_activated[2] = false;
	this.buttons_activated[1] = true;
	
	this.sound = !DEBUG;
	this.soundrestriction_removed = false;
	
	this.update_tick = 0;
	
	this.load_level = function(lev_number){
		that.mode = 1;
		that.update_tick = 0;
	
		that.steps_taken = 0;
		that.num_bananas = 0;
		that.level_ended = 0;
		that.level_array = new Array();
		that.level_number = lev_number;
		that.wait_timer = LEV_START_DELAY*UPS;
		that.last_dir_pressed = DIR_NONE;
		
		if(that.level_unlocked < lev_number){
			that.level_unlocked = lev_number;
		}
		
		if(lev_number < that.level_unlocked && lev_number != 0){
			that.buttons_activated[2] = true;
		}else{
			that.buttons_activated[2] = false;
		}
		
		if(lev_number > 1){
			that.buttons_activated[0] = true;
		}else{
			that.buttons_activated[0] = false;
		}
		
		for(let i = 0; i < LEV_DIMENSION_X; i++){
			that.level_array[i] = new Array()
		}
		
		let berti_counter = 0;
		that.berti_positions = new Array();
		
		for(let y = 0; y < LEV_DIMENSION_Y; y++){
			for(let x = 0; x < LEV_DIMENSION_X; x++){
				that.level_array[x][y] = new CLASS_entity();
				that.level_array[x][y].init(res.levels[lev_number][x][y]);
				
				if(res.levels[lev_number][x][y] == 4){
					that.num_bananas++;
				}else if(res.levels[lev_number][x][y] == 1){
					that.level_array[x][y].berti_id = berti_counter;
					that.berti_positions[berti_counter] = {x: x, y: y};
					berti_counter++;
				}
			}
		}
		
		vis.init_animation();
		
		if(berti_counter > 0){
			that.play_sound(8);
		}
	}
	
	this.remove_door = function(id){
		that.play_sound(9);
		for(let y = 0; y < LEV_DIMENSION_Y; y++){
			for(let x = 0; x < LEV_DIMENSION_X; x++){
				if(that.level_array[x][y].id == id){
					that.level_array[x][y].gets_removed_in = that.door_removal_delay;
				}					
			}
		}
	}
	// Whether you can walk from a tile in a certain direction, boolean
	this.walkable = function(curr_x, curr_y, dir){
		
		let dst = that.dir_to_coords(curr_x, curr_y, dir);
		
		if(!this.is_in_bounds(dst.x, dst.y)){// Can't go out of boundaries
			return false;
		}
		
		if(that.level_array[dst.x][dst.y].id == ENT_EMPTY){
			// Blank space is always walkable
			return true;
		}else if(!that.level_array[dst.x][dst.y].moving){
			if((that.level_array[curr_x][curr_y].id == ENT_PLAYER_BERTI || that.level_array[curr_x][curr_y].id == ENT_AUTO_BERTI) && that.level_array[dst.x][dst.y].consumable){
				// Can pick up items.
				return true;
			}else{
				if(that.level_array[curr_x][curr_y].can_push == 1 && that.level_array[dst.x][dst.y].pushable == 1){
					return that.walkable(dst.x, dst.y, dir);
				}else{
					return false;
				}
			}
		}else if( // (the entity at the destination is moving)
			that.level_array[dst.x][dst.y].face_dir == dir || // If the entity is already moving away in the right direction or...
			that.level_array[curr_x][curr_y].is_small && that.level_array[dst.x][dst.y].is_small){ // ...the tile is about to be freed by a small entity
			
			let adj_array = that.get_adjacent_tiles_primary(dst.x, dst.y);
			for(let i = 0; i < adj_array.length; i++){
				if(that.level_array[adj_array[i].x][adj_array[i].y].moving){
					let dst2 = that.dir_to_coords(adj_array[i].x, adj_array[i].y, that.level_array[adj_array[i].x][adj_array[i].y].face_dir)
					if(dst.x == dst2.x && dst.y == dst2.y){ // Someone is already moving into the tile we want to move to
						return false;
					}
				}
			}
			return true;
		}else{
			return false;
		}
	}
	
	this.start_move = function(src_x, src_y, dir){
	
		let dst = that.dir_to_coords(src_x, src_y, dir);
		that.level_array[src_x][src_y].moving = true;
		that.level_array[src_x][src_y].face_dir = dir;
		
		if(that.level_array[src_x][src_y].id == ENT_PLAYER_BERTI){
			if(that.steps_taken < 99999){
				that.steps_taken++;
			}
		}
		
		if((that.level_array[src_x][src_y].id == ENT_PLAYER_BERTI || that.level_array[src_x][src_y].id == ENT_AUTO_BERTI) && that.level_array[dst.x][dst.y].consumable){
			// Om nom nom start
		}else if(that.level_array[dst.x][dst.y].moving){
			// It's moving out of place by itself, don't do anything
		}else if(that.level_array[dst.x][dst.y].id != ENT_EMPTY){
			that.level_array[src_x][src_y].pushing = true;
			that.start_move(dst.x, dst.y, dir);
		}else{
			that.level_array[dst.x][dst.y].init(ENT_DUMMY); // Reserve square with dummy block
		}
		
		vis.update_animation(src_x,src_y);
	}
	
	this.move = function(src_x, src_y, dir){
	
		let dst = that.dir_to_coords(src_x, src_y, dir);
		that.level_array[src_x][src_y].moving = false;
		that.level_array[src_x][src_y].moving_offset = {x: 0, y: 0};
		that.level_array[src_x][src_y].pushing = false;
		
		if((that.level_array[src_x][src_y].id == ENT_PLAYER_BERTI || that.level_array[src_x][src_y].id == ENT_AUTO_BERTI) && that.level_array[dst.x][dst.y].consumable){
			switch (that.level_array[dst.x][dst.y].id) {// Done Om nom nom
				case ENT_BANANA_PEEL:
					that.num_bananas--;
					if(that.num_bananas <= 0){
						that.wait_timer = LEV_STOP_DELAY*UPS;
						that.level_ended = 1;
						if(Math.random() < 0.50){
							game.wow = true;
							that.play_sound(10);// wow
						}else{
							game.wow = false;
							that.play_sound(11);// yeah
						}
						vis.update_all_animations();
					}else{
						that.play_sound(7);// Om nom nom
					}
					break;
				case ENT_KEY_1:
					that.remove_door(ENT_DOOR_1);
					break;
				case ENT_KEY_2:
					that.remove_door(ENT_DOOR_2);
					break;
				case ENT_KEY_3:
					that.remove_door(ENT_DOOR_3);
					break;
				case ENT_KEY_4:
					that.remove_door(ENT_DOOR_4);
					break;
				case ENT_KEY_5:
					that.remove_door(ENT_DOOR_5);
					break;
				case ENT_KEY_6:
					that.remove_door(ENT_DOOR_6);
					break;
				default:
					alert("003: Something went mighty wrong! Blame the programmer!");
					break;
			 }
		}else if(that.level_array[dst.x][dst.y].id != ENT_DUMMY && that.level_array[dst.x][dst.y].id != ENT_EMPTY){
			that.move(dst.x, dst.y, dir);
		}else if(that.sound){// we need another logic to determine this correctly...DEBUG!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
			let dst2 = that.dir_to_coords(dst.x, dst.y, dir);
			if(	(that.level_array[src_x][src_y].id == ENT_LIGHT_BLOCK || that.level_array[src_x][src_y].id == ENT_HEAVY_BLOCK) &&
				(!that.is_in_bounds(dst2.x, dst2.y) || that.level_array[dst2.x][dst2.y].id == ENT_PINNED_BLOCK)){
				that.play_sound(5);
			}
		}
		let swapper = that.level_array[dst.x][dst.y];
		that.level_array[dst.x][dst.y] = that.level_array[src_x][src_y];
		that.level_array[src_x][src_y] = swapper;
		
		let back_dir = that.opposite_dir(dir);
		let before_src = that.dir_to_coords(src_x, src_y, back_dir);
		
		let possibilities = new Array(DIR_UP, DIR_DOWN, DIR_LEFT, DIR_RIGHT);
		for(let i = 0; i < possibilities.length; i++){
			if(possibilities[i] == dir || possibilities[i] == back_dir){
				possibilities.splice(i, 1);
				i--;
			}
		}
		let before_src2 = that.dir_to_coords(src_x, src_y, possibilities[0]);
		let before_src3 = that.dir_to_coords(src_x, src_y, possibilities[1]);
		
		if(
		(that.is_in_bounds(before_src.x, before_src.y) && (that.level_array[before_src.x][before_src.y].moving && that.level_array[before_src.x][before_src.y].face_dir == dir)) ||
		that.level_array[dst.x][dst.y].is_small && ((that.is_in_bounds(before_src2.x, before_src2.y) && (that.level_array[before_src2.x][before_src2.y].is_small &&  that.level_array[before_src2.x][before_src2.y].moving && that.level_array[before_src2.x][before_src2.y].face_dir == possibilities[1])) ||
		(that.is_in_bounds(before_src3.x, before_src3.y) && (that.level_array[before_src3.x][before_src3.y].is_small &&  that.level_array[before_src3.x][before_src3.y].moving && that.level_array[before_src3.x][before_src3.y].face_dir == possibilities[0])))
		){
			that.level_array[src_x][src_y].init(ENT_DUMMY);
		}else{		
			that.level_array[src_x][src_y].init(ENT_EMPTY);
		}
		
		if(that.level_array[dst.x][dst.y].id == ENT_PLAYER_BERTI){// Rectify the position of Berti
			that.berti_positions[that.level_array[dst.x][dst.y].berti_id] = dst;
		}
	}
	
	this.dir_to_coords = function(curr_x, curr_y, dir){
		let new_x = curr_x;
		let new_y = curr_y;
		
		switch (dir) {
			case DIR_UP:
				new_y--;
				break;
			case DIR_DOWN:
				new_y++;
				break;
			case DIR_LEFT:
				new_x--;
				break;
			case DIR_RIGHT:
				new_x++;
				break;
			default:
				break;
		}
		return {x: new_x, y: new_y};
	}
	
	this.opposite_dir = function(dir){
		switch (dir) {
			case DIR_UP:
				return DIR_DOWN;
				break;
			case DIR_DOWN:
				return DIR_UP;
				break;
			case DIR_LEFT:
				return DIR_RIGHT;
				break;
			case DIR_RIGHT:
				return DIR_LEFT;
				break;
			default:
				return DIR_NONE
				break;
		}
	}
	
	this.get_adjacent_tiles = function(tile_x, tile_y){// Potential for optimization
		//let result; = new Array();

		//if(tile_x-1 >= 0 && tile_y-1 >= 0 && tile_x+1 < LEV_DIMENSION_X && tile_y+1 < LEV_DIMENSION_Y){
		//	return new Array({x:tile_x-1, y:tile_y-1}, {x:tile_x-1, y:tile_y}, {x:tile_x-1, y:tile_y+1}, {x:tile_x, y:tile_y-1}, {x:tile_x, y:tile_y+1}, {x:tile_x+1, y:tile_y-1}, {x:tile_x+1, y:tile_y}, {x:tile_x+1, y:tile_y+1});
		//}else{
			let result = new Array();
			for(let i = -1; i <= 1; i++){
				for(let j = -1; j <= 1; j++){
					if(i != 0 || j != 0){
						if(that.is_in_bounds(tile_x+i, tile_y+j)){
							result.push({x:(tile_x+i), y:(tile_y+j)});
						}
					}
				}
			}
			return result;
		//}
		
	}
	
	this.get_adjacent_tiles_primary = function(tile_x, tile_y){ // Primary neighborhood (up, down, left, right but no diagonals)
		let result = new Array();
		if(that.is_in_bounds(tile_x, tile_y-1)){
			result.push({x:(tile_x), y:(tile_y-1)});
		}
		if(that.is_in_bounds(tile_x, tile_y+1)){
			result.push({x:(tile_x), y:(tile_y+1)});
		}
		if(that.is_in_bounds(tile_x-1, tile_y)){
			result.push({x:(tile_x-1), y:(tile_y)});
		}
		if(that.is_in_bounds(tile_x+1, tile_y)){
			result.push({x:(tile_x+1), y:(tile_y)});
		}
		return result;
	}
	
	this.is_in_bounds = function(tile_x, tile_y){
		return (tile_x >= 0 && tile_y >= 0 && tile_x < LEV_DIMENSION_X && tile_y < LEV_DIMENSION_Y);
	}
	
	this.can_see_tile = function(eye_x, eye_y, tile_x, tile_y){
		let diff_x = tile_x - eye_x;
		let diff_y = tile_y - eye_y;
		
		let walk1_x;
		let walk1_y;
		let walk2_x;
		let walk2_y;
		
		if (diff_x==0){
			if(diff_y==0){
				return true;
			}else if(diff_y > 0){
				walk1_x = 0;
				walk1_y = 1;
				walk2_x = 0;
				walk2_y = 1;
			}else{// diff_y < 0
				walk1_x = 0;
				walk1_y = -1;
				walk2_x = 0;
				walk2_y = -1;
			}
		}else if(diff_x > 0){
			if(diff_y==0){
				walk1_x = 1;
				walk1_y = 0;
				walk2_x = 1;
				walk2_y = 0;
			}else if(diff_y > 0){
				if(diff_y > diff_x){
					walk1_x = 0;
					walk1_y = 1;
					walk2_x = 1;
					walk2_y = 1;
				}else if(diff_y == diff_x){
					walk1_x = 1;
					walk1_y = 1;
					walk2_x = 1;
					walk2_y = 1;
				}else{// diff_y < diff_x
					walk1_x = 1;
					walk1_y = 0;
					walk2_x = 1;
					walk2_y = 1;
				}
			}else{// diff_y < 0
				if(diff_y*(-1) > diff_x){
					walk1_x = 0;
					walk1_y = -1;
					walk2_x = 1;
					walk2_y = -1;
				}else if(diff_y*(-1) == diff_x){
					walk1_x = 1;
					walk1_y = -1;
					walk2_x = 1;
					walk2_y = -1;
				}else{// diff_y < diff_x
					walk1_x = 1;
					walk1_y = 0;
					walk2_x = 1;
					walk2_y = -1;
				}
			}
		}else{// diff_x < 0
			if(diff_y==0){
				walk1_x = -1;
				walk1_y = 0;
				walk2_x = -1;
				walk2_y = 0;
			}else if(diff_y > 0){
				if(diff_y > diff_x*(-1)){
					walk1_x = 0;
					walk1_y = 1;
					walk2_x = -1;
					walk2_y = 1;
				}else if(diff_y == diff_x*(-1)){
					walk1_x = -1;
					walk1_y = 1;
					walk2_x = -1;
					walk2_y = 1;
				}else{// diff_y < diff_x
					walk1_x = -1;
					walk1_y = 0;
					walk2_x = -1;
					walk2_y = 1;
				}
			}else{// diff_y < 0
				if(diff_y > diff_x){
					walk1_x = -1;
					walk1_y = 0;
					walk2_x = -1;
					walk2_y = -1;
				}else if(diff_y == diff_x){
					walk1_x = -1;
					walk1_y = -1;
					walk2_x = -1;
					walk2_y = -1;
				}else{// diff_y < diff_x
					walk1_x = 0;
					walk1_y = -1;
					walk2_x = -1;
					walk2_y = -1;
				}
			}
		}
		
		
		let x_offset = 0;
		let y_offset = 0;
		let x_ratio1;
		let y_ratio1;
		let x_ratio2;
		let y_ratio2;
		let diff1;
		let diff2;
		
		while(true){
			if(diff_x != 0){
				x_ratio1 = (x_offset+walk1_x)/diff_x;
				x_ratio2 = (x_offset+walk2_x)/diff_x;
			}else{
				x_ratio1 = 1;
				x_ratio2 = 1;
			}
			if(diff_y != 0){
				y_ratio1 = (y_offset+walk1_y)/diff_y;
				y_ratio2 = (y_offset+walk2_y)/diff_y;
			}else{
				y_ratio1 = 1;
				y_ratio2 = 1;
			}
			
			diff1 = Math.abs(x_ratio1-y_ratio1);
			diff2 = Math.abs(x_ratio2-y_ratio2);
			
			if (diff1 <= diff2){
				x_offset += walk1_x;
				y_offset += walk1_y;
			}else{
				x_offset += walk2_x;
				y_offset += walk2_y;
			}
			
			if(x_offset == diff_x && y_offset == diff_y){
				return true;
			}
			if(game.level_array[eye_x + x_offset][eye_y + y_offset].id != ENT_EMPTY && game.level_array[eye_x + x_offset][eye_y + y_offset].id != ENT_DUMMY && !game.level_array[eye_x + x_offset][eye_y + y_offset].is_small){
				return false;
			}
		}
		// Code here is unreachable
	}
	
	this.prev_level = function(){
		if(that.level_number >= 1){
			that.load_level(that.level_number-1);
		}
	}
	
	this.next_level = function(){
		if(that.level_number >= 50 || that.level_number < 0){
			game.mode = 2;
			game.steps_taken = 0;
			game.play_sound(6);
			that.buttons_activated[0] = false;
			that.buttons_activated[2] = false;
			return;
		}
		that.load_level(that.level_number+1);// Prevent overflow here
		if(that.level_number > that.level_unlocked){
			that.level_unlocked = that.level_number;
		}
	}
	
	this.reset_level = function(){
		if(that.mode == 0){
			that.load_level(0);
		}else if(that.mode == 1){
			if(that.level_number == 0){
				that.load_level(1);
			}else{
				that.load_level(that.level_number);
			}
		}
	}
	
	this.play_sound = function(id){
		if(!that.sound) return;
		if(res.sounds[id].currentTime!=0) res.sounds[id].currentTime=0;
		res.sounds[id].play();
		// Useful commands
		//audioElement.pause();
		//audioElement.volume=0;
		//audioElement.src;
		//audioElement.duration;
		//myAudio.addEventListener('ended', function() {}, false);
	}
	
	this.set_volume = function(vol){
		if(vol > 1){
			vol = 1;
		}else if(vol < 0){
			vol = 0;
		}
		vis.vol_bar.volume = vol;
		vol = Math.pow(vol, 3);// LOGARITHMIC!
	
		for(let i = 0; i < res.sounds.length; i++){
			res.sounds[i].volume = vol;
		}
	}
	
	this.toggle_sound = function(){
		if(that.sound){
			that.sound = false;
			for(let i = 0; i < res.sounds.length; i++){
				res.sounds[i].pause();
				res.sounds[i].currentTime=0
			}
		}else{
			that.sound = true;
		}
	}
	
	// This is necessary because of mobile browsers. These browsers block sound playback
	// unless it is triggered by a user input event. Play all sounds at the first input,
	// then the restriction is lifted for further playbacks.
	this.remove_soundrestriction = function(){
		if(that.soundrestriction_removed) return;
		for(let i = 0; i < res.sounds.length; i++){
			if(res.sounds[i].paused) {
				res.sounds[i].play();
				res.sounds[i].pause();
				res.sounds[i].currentTime=0
			}
		}
		that.soundrestriction_removed = true;
	}
	
	this.toggle_single_steps = function(){
		if(that.single_steps){
			that.last_dir_pressed = DIR_NONE;
			that.single_steps = false;
		}else{
			that.single_steps = true;
		}
	}
	
	this.toggle_paused = function(){
		if(that.paused){
			that.paused = false;
		}else{
			that.paused = true;
		}
	}
}

/*//////////////////////////////////////////////////////////////////////////////////////////////////////
// VISUAL CLASS
// Everything in here is related to graphical output. Also, menus and dialog boxes
//////////////////////////////////////////////////////////////////////////////////////////////////////*/

function CLASS_visual(){
	let that = this;

	this.berti_blink_time = 0;
	this.last_rendered = 0;
	this.last_fps_update = 0;
	this.static_ups = 0;
	this.static_fps = 0;
	
	this.buttons_pressed = new Array();
	this.buttons_pressed[0] = this.buttons_pressed[1] = this.buttons_pressed[2] = false;
	
	// Animations:
	this.offset_key_x = 3;
	this.offset_key_y = 4;
	this.offset_banana_x = 4;
	this.offset_banana_y = 4;
	
	this.offset_wow_x = -20;
	this.offset_wow_y = -44;
	
	this.offset_yeah_x = -20;
	this.offset_yeah_y = -44;
	
	this.offset_argl_x = -20;
	this.offset_argl_y = -44;
	
	this.init_animation = function(){
		for(let y = 0; y < LEV_DIMENSION_Y; y++){
			for(let x = 0; x < LEV_DIMENSION_X; x++){
				let block = game.level_array[x][y];
				switch (block.id) {
					case ENT_DUMMY:
						break;
					case ENT_PLAYER_BERTI:
					case ENT_AUTO_BERTI:
						block.animation_frame = IMG_BERTI_IDLE;
						break;
					case ENT_PINNED_BLOCK:
						block.animation_frame = IMG_BLOCK_PINNED;
						break;
					case ENT_BANANA_PEEL:
						block.animation_frame = IMG_BANANA_PEEL;
						block.fine_offset_x = that.offset_banana_x;
						block.fine_offset_y = that.offset_banana_y;
						break;
					case ENT_LIGHT_BLOCK:
						block.animation_frame = IMG_BLOCK_LIGHT;
						break;
					case ENT_HEAVY_BLOCK:
						block.animation_frame = IMG_BLOCK_HEAVY;
						break;
					case ENT_PURPLE_MONSTER:
						block.animation_frame = IMG_PURPMON_STUCK_0;
						break;
					case ENT_GREEN_MONSTER:
						block.animation_frame = IMG_GREENMON_STUCK_0;
						break;
					case ENT_KEY_1:
						block.animation_frame = IMG_KEY_1;
						block.fine_offset_x = that.offset_key_x;
						block.fine_offset_y = that.offset_key_y;
						break;
					case ENT_KEY_2:
						block.animation_frame = IMG_KEY_2;
						block.fine_offset_x = that.offset_key_x;
						block.fine_offset_y = that.offset_key_y;
						break;
					case ENT_KEY_3:
						block.animation_frame = IMG_KEY_3;
						block.fine_offset_x = that.offset_key_x;
						block.fine_offset_y = that.offset_key_y;
						break;
					case ENT_KEY_4:
						block.animation_frame = IMG_KEY_4;
						block.fine_offset_x = that.offset_key_x;
						block.fine_offset_y = that.offset_key_y;
						break;
					case ENT_KEY_5:
						block.animation_frame = IMG_KEY_5;
						block.fine_offset_x = that.offset_key_x;
						block.fine_offset_y = that.offset_key_y;
						break;
					case ENT_KEY_6:
						block.animation_frame = IMG_KEY_6;
						block.fine_offset_x = that.offset_key_x;
						block.fine_offset_y = that.offset_key_y;
						break;
					case ENT_DOOR_1:
						block.animation_frame = IMG_DOOR_1_CLOSED;
						break;
					case ENT_DOOR_2:
						block.animation_frame = IMG_DOOR_2_CLOSED;
						break;
					case ENT_DOOR_3:
						block.animation_frame = IMG_DOOR_3_CLOSED;
						break;
					case ENT_DOOR_4:
						block.animation_frame = IMG_DOOR_4_CLOSED;
						break;
					case ENT_DOOR_5:
						block.animation_frame = IMG_DOOR_5_CLOSED;
						break;
					case ENT_DOOR_6:
						block.animation_frame = IMG_DOOR_6_CLOSED;
						break;
				
					default:
						// Uh oh, this part should never be executed
						break;
				}
			}
		}
	}
	
	this.update_animation = function(x, y){
		let block = game.level_array[x][y];
		switch (block.id) {
			case ENT_PLAYER_BERTI:
			case ENT_AUTO_BERTI:
				block.fine_offset_x = 0;
				if(game.level_ended == 0){
					if(block.moving){
						block.fine_offset_x = -1;
						if(block.pushing){
							switch (block.face_dir) {
								case DIR_UP:
									if(block.animation_frame < IMG_BERTI_PUSH_UP_0 || block.animation_frame > IMG_BERTI_PUSH_UP_3){
										block.animation_frame = IMG_BERTI_PUSH_UP_0;
									}
									break;
								case DIR_DOWN:
									if(block.animation_frame < IMG_BERTI_PUSH_DOWN_0 || block.animation_frame > IMG_BERTI_PUSH_DOWN_3){
										block.animation_frame = IMG_BERTI_PUSH_DOWN_0;
									}
									break;
								case DIR_LEFT:
									if(block.animation_frame < IMG_BERTI_PUSH_LEFT_0 || block.animation_frame > IMG_BERTI_PUSH_LEFT_3){
										block.animation_frame = IMG_BERTI_PUSH_LEFT_0;
									}
									break;
								case DIR_RIGHT:
									if(block.animation_frame < IMG_BERTI_PUSH_RIGHT_0 || block.animation_frame > IMG_BERTI_PUSH_RIGHT_3){
										block.animation_frame = IMG_BERTI_PUSH_RIGHT_0;
									}
									break;
								default:
									// This should never be executed
									break;
							}
						}else{
							switch (block.face_dir) {
								case DIR_UP:
									if(block.animation_frame < IMG_BERTI_WALK_UP_0 || block.animation_frame > IMG_BERTI_WALK_UP_3){
										block.animation_frame = IMG_BERTI_WALK_UP_0;
									}
									break;
								case DIR_DOWN:
									if(block.animation_frame < IMG_BERTI_WALK_DOWN_0 || block.animation_frame > IMG_BERTI_WALK_DOWN_3){
										block.animation_frame = IMG_BERTI_WALK_DOWN_0;
									}
									break;
								case DIR_LEFT:
									if(block.animation_frame < IMG_BERTI_WALK_LEFT_0 || block.animation_frame > IMG_BERTI_WALK_LEFT_3){
										block.animation_frame = IMG_BERTI_WALK_LEFT_0;
									}
									break;
								case DIR_RIGHT:
									if(block.animation_frame < IMG_BERTI_WALK_RIGHT_0 || block.animation_frame > IMG_BERTI_WALK_RIGHT_3){
										block.animation_frame = IMG_BERTI_WALK_RIGHT_0;
									}
									break;
								default:
									// This should never be executed
									break;
							}
						}
					}else{
						block.animation_frame = IMG_BERTI_IDLE;
					}
				}else if(game.level_ended == 1){
					block.animation_frame = IMG_BERTI_CELEBRATING;
				}else if(game.level_ended == 2){
					block.animation_frame = IMG_BERTI_DEAD;
				}
				break;
			case ENT_PURPLE_MONSTER:
				block.fine_offset_x = 0;
				if(game.level_ended == 0){
					if(block.moving){
						block.fine_offset_x = -1;
						if(block.pushing){
							switch (block.face_dir) {
								case DIR_UP:
									if(block.animation_frame < IMG_PURPMON_PUSH_UP_0 || block.animation_frame > IMG_PURPMON_PUSH_UP_3){
										block.animation_frame = IMG_PURPMON_PUSH_UP_0;
									}
									break;
								case DIR_DOWN:
									if(block.animation_frame < IMG_PURPMON_PUSH_DOWN_0 || block.animation_frame > IMG_PURPMON_PUSH_DOWN_3){
										block.animation_frame = IMG_PURPMON_PUSH_DOWN_0;
									}
									break;
								case DIR_LEFT:
									if(block.animation_frame < IMG_PURPMON_PUSH_LEFT_0 || block.animation_frame > IMG_PURPMON_PUSH_LEFT_3){
										block.animation_frame = IMG_PURPMON_PUSH_LEFT_0;
									}
									break;
								case DIR_RIGHT:
									if(block.animation_frame < IMG_PURPMON_PUSH_RIGHT_0 || block.animation_frame > IMG_PURPMON_PUSH_RIGHT_3){
										block.animation_frame = IMG_PURPMON_PUSH_RIGHT_0;
									}
									break;
								default:
									// This should never be executed
									break;
							}
						}else{
							switch (block.face_dir) {
								case DIR_UP:
									if(block.animation_frame < IMG_PURPMON_WALK_UP_0 || block.animation_frame > IMG_PURPMON_WALK_UP_3){
										block.animation_frame = IMG_PURPMON_WALK_UP_0;
									}
									break;
								case DIR_DOWN:
									if(block.animation_frame < IMG_PURPMON_WALK_DOWN_0 || block.animation_frame > IMG_PURPMON_WALK_DOWN_3){
										block.animation_frame = IMG_PURPMON_WALK_DOWN_0;
									}
									break;
								case DIR_LEFT:
									if(block.animation_frame < IMG_PURPMON_WALK_LEFT_0 || block.animation_frame > IMG_PURPMON_WALK_LEFT_3){
										block.animation_frame = IMG_PURPMON_WALK_LEFT_0;
									}
									break;
								case DIR_RIGHT:
									if(block.animation_frame < IMG_PURPMON_WALK_RIGHT_0 || block.animation_frame > IMG_PURPMON_WALK_RIGHT_3){
										block.animation_frame = IMG_PURPMON_WALK_RIGHT_0;
									}
									break;
								default:
									// This should never be executed
									break;
							}
						}
					}else{
						block.animation_frame = IMG_PURPMON_STUCK_0;
					}
				}else{
					block.animation_frame = IMG_PURPMON_STUCK_0;
				}
				break;
			case ENT_GREEN_MONSTER:
				block.fine_offset_x = 0;
				if(game.level_ended == 0){
					if(block.moving){
						block.fine_offset_x = -1;
						switch (block.face_dir) {
							case DIR_UP:
								if(block.animation_frame < IMG_GREENMON_WALK_UP_0 || block.animation_frame > IMG_GREENMON_WALK_UP_3){
									block.animation_frame = IMG_GREENMON_WALK_UP_0;
								}
								break;
							case DIR_DOWN:
								if(block.animation_frame < IMG_GREENMON_WALK_DOWN_0 || block.animation_frame > IMG_GREENMON_WALK_DOWN_3){
									block.animation_frame = IMG_GREENMON_WALK_DOWN_0;
								}
								break;
							case DIR_LEFT:
								if(block.animation_frame < IMG_GREENMON_WALK_LEFT_0 || block.animation_frame > IMG_GREENMON_WALK_LEFT_3){
									block.animation_frame = IMG_GREENMON_WALK_LEFT_0;
								}
								break;
							case DIR_RIGHT:
								if(block.animation_frame < IMG_GREENMON_WALK_RIGHT_0 || block.animation_frame > IMG_GREENMON_WALK_RIGHT_3){
									block.animation_frame = IMG_GREENMON_WALK_RIGHT_0;
								}
								break;
							default:
								// This should never be executed
								break;
						}
					}else{
						block.animation_frame = IMG_GREENMON_STUCK_0;
					}
				}else{
					block.animation_frame = IMG_GREENMON_STUCK_0;
				}
				break;
			case ENT_DOOR_1:
				if(block.gets_removed_in >= 0){
					block.animation_frame = IMG_DOOR_1_FADING-Math.floor(block.gets_removed_in/game.door_removal_delay*2);
				}
				break;
			case ENT_DOOR_2:
				if(block.gets_removed_in >= 0){
					block.animation_frame = IMG_DOOR_2_FADING-Math.floor(block.gets_removed_in/game.door_removal_delay*2);
				}
				break;
			case ENT_DOOR_3:
				if(block.gets_removed_in >= 0){
					block.animation_frame = IMG_DOOR_3_FADING-Math.floor(block.gets_removed_in/game.door_removal_delay*2);
				}
				break;
			case ENT_DOOR_4:
				if(block.gets_removed_in >= 0){
					block.animation_frame = IMG_DOOR_4_FADING-Math.floor(block.gets_removed_in/game.door_removal_delay*2);
				}
				break;
			case ENT_DOOR_5:
				if(block.gets_removed_in >= 0){
					block.animation_frame = IMG_DOOR_5_FADING-Math.floor(block.gets_removed_in/game.door_removal_delay*2);
				}
				break;
			case ENT_DOOR_6:
				if(block.gets_removed_in >= 0){
					block.animation_frame = IMG_DOOR_6_FADING-Math.floor(block.gets_removed_in/game.door_removal_delay*2);
				}
				break;
			default:
			break;
		}
	}
	
	this.update_all_animations = function(){
		for(let y = 0; y < LEV_DIMENSION_Y; y++){
			for(let x = 0; x < LEV_DIMENSION_X; x++){
				that.update_animation(x, y);
			}
		}
	}
	
	// Volume bar:
	this.vol_bar = new CLASS_vol_bar();
	
	function CLASS_vol_bar(){
		this.offset_x = 400;
		this.offset_y = 2;
		this.height = 17;
		this.width = 100;
		this.volume = DEFAULT_VOLUME;
		
		this.colour_1 = {r:0, g:255, b: 0};// Low volume colour: Green
		this.colour_2 = {r:255, g:0, b: 0};// High volume colour: Red
		this.colour_3 = {r:255, g:255, b: 255};// Rest of the volume bar: White
		this.colour_4 = {r:0, g:0, b: 0};// Inbetween bars: Black
		
		this.colour_5 = {r:50, g:50, b:50};// "off" colour, some grey...
	}
	
	
	// Menu stuff:
	this.black = {r:0, g:0, b: 0};
	this.dark_grey = {r:64, g:64, b:64};
	this.med_grey = {r:128, g:128, b:128};
	this.light_grey = {r:212, g:208, b:200};
	this.white = {r:255, g:255, b: 255};
	this.blue = {r:10, g:36, b:106};
	
	function CLASS_menu(a_offset_x, a_offset_y, a_height, a_submenu_list){
		this.offset_x = a_offset_x;
		this.offset_y = a_offset_y;
		this.height = a_height;
		this.width = 0;
		this.submenu_open = -1;
		
		for(let i = 0; i < a_submenu_list.length; i++){
			this.width += a_submenu_list[i].width
		}
		
		this.submenu_list = a_submenu_list;
	}
	
	function CLASS_submenu(a_width, a_dd_width, a_name, a_arr_options){
		this.width = a_width;
		this.offset_line = 9;
		this.offset_text = 17;
		
		this.dd_width = a_dd_width;
		this.dd_height = 6;
		for(let i = 0; i < a_arr_options.length; i++){
			if(a_arr_options[i].line){
				this.dd_height += this.offset_line;
			}else{
				this.dd_height += this.offset_text;
			}
		}
		
		this.name = a_name;
		this.options = a_arr_options;
	}
	
	this.menu1;

	this.init_menus = function(){
		let tautology = function(){return true;};
	
		let arr_options1 = [
		{line:false, check:0, name:"New", hotkey:"F2", effect_id:0, on:tautology},
		{line:false, check:0, name:"Load Game...", hotkey:"", effect_id:1, on:function(){return HAS_STORAGE;}},
		{line:false, check:0, name:"Save", hotkey:"", effect_id:2, on:function(){return (game.savegame.progressed && HAS_STORAGE);}},
		{line:false, check:1, name:"Pause", hotkey:"", effect_id:3, on:tautology}
		];
		
		let arr_options2 = [
		{line:false, check:1, name:"Single steps", hotkey:"F5", effect_id:4, on:tautology},
		{line:false, check:1, name:"Sound", hotkey:"", effect_id:5, on:tautology},
		{line:true, check:0, name:"", hotkey:"", effect_id:-1, on:tautology},
		{line:false, check:0, name:"Load Level", hotkey:"", effect_id:6, on:function(){return HAS_STORAGE;}},
		{line:false, check:0, name:"Change Password", hotkey:"", effect_id:7, on:function(){return (game.savegame.username !== null && HAS_STORAGE);}},
		{line:true, check:0, name:"", hotkey:"", effect_id:-1, on:tautology},
		{line:false, check:0, name:"Charts", hotkey:"", effect_id:8, on:function(){return HAS_STORAGE;}}
		];
		
		let sub_m1 = new CLASS_submenu(43, 100, "Game", arr_options1);
		let sub_m2 = new CLASS_submenu(55, 150, "Options", arr_options2);
		
		that.menu1 = new CLASS_menu(1, 2, 17, [sub_m1, sub_m2]);
	}
	
	// Dialog box stuff:
	
	function add_button(img_up, img_down, pos_x, pos_y, click_effect){
		let btn = document.createElement("img");
		btn.src = res.images[img_up].src;
		btn.style.position = "absolute";
		btn.style.width = res.images[img_up].width+"px";
		btn.style.height = res.images[img_up].height+"px";
		btn.style.left = pos_x+"px";
		btn.style.top = pos_y+"px";
		
		btn.pressed = false;
		btn.onmousedown = function(evt){btn.src = res.images[img_down].src; btn.pressed = true; evt.preventDefault();};
		btn.onmouseup = function(evt){btn.src = res.images[img_up].src; btn.pressed = false;};
		btn.onmouseout = function(evt){btn.src = res.images[img_up].src;};
		btn.onmouseover = function(evt){if(btn.pressed && input.mouse_down) btn.src = res.images[img_down].src;};
		btn.onclick = click_effect;
		
		that.dbx.appendChild(btn);
		that.dbx.arr_btn[that.dbx.arr_btn.length] = btn;
	}
	
	function add_text(text, pos_x, pos_y){
		let txt = document.createElement("p");
		txt.innerHTML = text;
		txt.style.position = "absolute";
		txt.style.left = pos_x+"px";
		txt.style.top = pos_y+"px";
		txt.style.fontFamily = "Tahoma";
		txt.style.fontSize = "12px";
		that.dbx.appendChild(txt);
	}
	
	function add_number(a_num, pos_x, pos_y, width, height){
		let num = document.createElement("p");
		num.innerHTML = a_num;
		num.style.position = "absolute";
		num.style.left = pos_x+"px";
		num.style.top = pos_y+"px";
		num.style.width = width+"px";
		num.style.height = height+"px";
		num.style.fontFamily = "Tahoma";
		num.style.fontSize = "12px";
		num.style.textAlign = "right";
		that.dbx.appendChild(num);
	}
	
	function add_title(text){
		let txt = document.createElement("p");
		txt.innerHTML = text;
		txt.style.position = "absolute";
		txt.style.left = "5px";
		txt.style.top = "-13px";
		txt.style.fontFamily = "Tahoma";
		txt.style.fontSize = "14px";
		txt.style.color = "white";
		txt.style.fontWeight = "bold";
		that.dbx.appendChild(txt);
	}
	
	function add_input(pos_x, pos_y, width, height, type){
		let txt = document.createElement("input");
		//txt.innerHTML = text;
		txt.type = type;
		txt.style.position = "absolute";
		txt.style.left = pos_x+"px";
		pos_y += 10;// Because of padding
		txt.style.top = pos_y+"px";
		txt.style.width = width+"px";
		txt.style.height = height+"px";
		txt.style.fontFamily = "Tahoma";
		txt.style.fontSize = "12px";
		
		that.dbx.appendChild(txt);
		that.dbx.arr_input[that.dbx.arr_input.length] = txt;
		
		//window.setTimeout( function() {txt.focus();}, 10);
	}
	
	function add_lvlselect(pos_x, pos_y, width, height){
		let select = document.createElement("select");
		select.size = 2;
		
		select.innerHTML = "";
		for(let i = 1; i < game.savegame.reached_level; i++){
			select.innerHTML += "<option value=\""+i+"\">\n"+i+", "+game.savegame.arr_steps[i]+"</option>";
		}
		if(game.savegame.reached_level <= 50){
			select.innerHTML += "<option value=\""+game.savegame.reached_level+"\">\n"+game.savegame.reached_level+", -</option>";
		}
		
		
		select.style.position = "absolute";
		select.style.left = pos_x+"px";
		select.style.top = pos_y+"px";
		select.style.width = width+"px";
		select.style.height = height+"px";
		select.style.fontFamily = "Tahoma";
		select.style.fontSize = "12px";
		
		that.dbx.appendChild(select);
		that.dbx.lvlselect = select;
	}
	
	function add_errfield(pos_x, pos_y){
		let ef = document.createElement("p");
		ef.innerHTML = "";
		ef.style.position = "absolute";
		ef.style.left = pos_x+"px";
		ef.style.top = pos_y+"px";
		ef.style.fontFamily = "Tahoma";
		ef.style.fontSize = "12px";
		ef.style.color = "#FF0000";
		that.dbx.appendChild(ef);
		
		that.dbx.errfield = ef;
	}
	
	this.dbx = document.createElement("div");
	this.dbx.style.position = "fixed";
	this.dbx.style.zIndex = 100;
	this.dbx.style.display = "none";
	document.body.appendChild(this.dbx);
	
	this.dbx.drag_pos = {x:0, y:0};
	this.dbx.drag = false;
	this.dbx.arr_btn = new Array();
	this.dbx.arr_input = new Array();
	this.dbx.lvlselect = null;
	this.dbx.errfield = null;
	
	this.dbx.enterfun = null;
	this.dbx.cancelfun = null;
	
	this.error_dbx = function(errno){
		if(that.dbx.errfield === null) return;
		let err_string = "";
		switch(errno){
			case ERR_EXISTS:
				err_string = "Error - the account already exists.";
				break;
			case ERR_NOSAVE:
				err_string = "Error - there are no savegames to load!";
				break;
			case ERR_WRONGPW:
				err_string = "Error - you used the wrong password.";
				break;
			case ERR_NOTFOUND:
				err_string = "Error - this username couldn't be found.";
				break;
			case ERR_EMPTYNAME:
				err_string = "Error - please fill in your name.";
				break;
			default:
				err_string = "Unknown error";
				break;
		}
		that.dbx.errfield.innerHTML = err_string;
	}
	
	this.open_dbx = function(dbx_id, opt){
		that.close_dbx();
		opt = (typeof opt !== 'undefined') ? opt : 0;
	
		switch(dbx_id){
			case DBX_CONFIRM:
			{
				add_title("Confirm");
			
				that.dbx.style.width = "256px";
				that.dbx.style.height = "154px";
				that.dbx.style.left = Math.max(Math.floor(window.innerWidth-256)/2, 0)+"px";
				that.dbx.style.top = Math.max(Math.floor(window.innerHeight-154)/2, 0)+"px";
				that.dbx.style.background = 'url('+res.images[IMG_DIALOGBOX_CONFIRM].src+')';
				
				let f_y;
				let f_n;
				let f_c = function(){that.close_dbx();};
				
				if(opt == 0){// "New Game"
					f_y = function(){that.open_dbx(DBX_SAVE, 1);};
					f_n = function(){game.clear_savegame();that.close_dbx();};
				}else if(opt == 1){// "Load Game" 
					f_y = function(){that.open_dbx(DBX_SAVE, 2);};
					f_n = function(){that.open_dbx(DBX_LOAD);};
				}
				
				that.dbx.enterfun = f_y;
				that.dbx.cancelfun = f_c;
				
				add_button(IMG_BTN_YES_UP, IMG_BTN_YES_DOWN, 20, 100, f_y);
				add_button(IMG_BTN_NO_UP, IMG_BTN_NO_DOWN, 100, 100, f_n);
				add_button(IMG_BTN_CANCEL_UP, IMG_BTN_CANCEL_DOWN, 180, 100, f_c);
				
				add_text("Do you want to save the game?", 40, 35);
				break;
			}
			case DBX_SAVE:
			{
				add_title("Save game");
			
				that.dbx.style.width = "256px";
				that.dbx.style.height = "213px";
				that.dbx.style.left = Math.max(Math.floor(window.innerWidth-256)/2, 0)+"px";
				that.dbx.style.top = Math.max(Math.floor(window.innerHeight-213)/2, 0)+"px";
				that.dbx.style.background = 'url('+res.images[IMG_DIALOGBOX_SAVELOAD].src+')';
				
				add_text("Player name:", 20, 35);
				add_input(100, 35, 120, 15, "text");
				add_text("Password:", 20, 60);
				add_input(100, 60, 120, 15, "password");
				
				let f_o;
				let f_c;
				
				if(opt == 0){// "Save game"
					f_o = function(){if(game.dbxcall_save(that.dbx.arr_input[0].value, that.dbx.arr_input[1].value)){that.close_dbx();}};
					f_c = function(){that.close_dbx();};
				}else if(opt == 1){// "New Game" -> yes, save 
					f_o = function(){if(game.dbxcall_save(that.dbx.arr_input[0].value, that.dbx.arr_input[1].value)){game.clear_savegame();that.close_dbx();}};
					f_c = function(){game.clear_savegame();that.close_dbx();};
				}else if(opt == 2){// "Load Game" -> yes, save
					f_o = function(){if(game.dbxcall_save(that.dbx.arr_input[0].value, that.dbx.arr_input[1].value)){that.open_dbx(DBX_LOAD);}};
					f_c = function(){that.open_dbx(DBX_LOAD);};
				}
				
				that.dbx.enterfun = f_o;
				that.dbx.cancelfun = f_c;
				
				add_button(IMG_BTN_OK_UP, IMG_BTN_OK_DOWN, 40, 160, f_o);
				add_button(IMG_BTN_CANCEL_UP, IMG_BTN_CANCEL_DOWN, 160, 160, f_c);
				
				add_errfield(20, 85);
				break;
			}
			case DBX_LOAD:
			{
				add_title("Load game");
			
				that.dbx.style.width = "256px";
				that.dbx.style.height = "213px";
				that.dbx.style.left = Math.max(Math.floor(window.innerWidth-256)/2, 0)+"px";
				that.dbx.style.top = Math.max(Math.floor(window.innerHeight-213)/2, 0)+"px";
				that.dbx.style.background = 'url('+res.images[IMG_DIALOGBOX_SAVELOAD].src+')';
				
				add_text("Player name:", 20, 35);
				add_input(100, 35, 120, 15, "text");
				add_text("Password:", 20, 60);
				add_input(100, 60, 120, 15, "password");
				
				let f_o = function(){if(game.dbxcall_load(that.dbx.arr_input[0].value, that.dbx.arr_input[1].value)){that.close_dbx();}};
				let f_c = function(){that.close_dbx();};
				
				that.dbx.enterfun = f_o;
				that.dbx.cancelfun = f_c;
				
				add_button(IMG_BTN_OK_UP, IMG_BTN_OK_DOWN, 40, 160, f_o);
				add_button(IMG_BTN_CANCEL_UP, IMG_BTN_CANCEL_DOWN, 160, 160, f_c);
				
				add_errfield(20, 85);
				break;
			}
			case DBX_CHPASS:
			{
				add_title("Change password");
			
				that.dbx.style.width = "256px";
				that.dbx.style.height = "213px";
				that.dbx.style.left = Math.max(Math.floor(window.innerWidth-256)/2, 0)+"px";
				that.dbx.style.top = Math.max(Math.floor(window.innerHeight-213)/2, 0)+"px";
				that.dbx.style.background = 'url('+res.images[IMG_DIALOGBOX_SAVELOAD].src+')';
				
				add_text("Old password:", 20, 35);
				add_input(100, 35, 120, 15, "password");
				add_text("New password:", 20, 60);
				add_input(100, 60, 120, 15, "password");
				
				let f_o = function(){if(game.dbxcall_chpass(that.dbx.arr_input[0].value, that.dbx.arr_input[1].value)){that.close_dbx();}};
				let f_c = function(){that.close_dbx();};
				
				that.dbx.enterfun = f_o;
				that.dbx.cancelfun = f_c;
				
				add_button(IMG_BTN_OK_UP, IMG_BTN_OK_DOWN, 40, 160, f_o);
				add_button(IMG_BTN_CANCEL_UP, IMG_BTN_CANCEL_DOWN, 160, 160, f_c);
				
				add_errfield(20, 85);
				break;
			}
			case DBX_LOADLVL:
			{
				add_title("Load level");
			
				that.dbx.style.width = "197px";
				that.dbx.style.height = "273px";
				that.dbx.style.left = Math.max(Math.floor(window.innerWidth-197)/2, 0)+"px";
				that.dbx.style.top = Math.max(Math.floor(window.innerHeight-273)/2, 0)+"px";
				that.dbx.style.background = 'url('+res.images[IMG_DIALOGBOX_LOADLVL].src+')';
				
				add_lvlselect(20, 80, 158, 109);
				
				let f_o = function(){if(parseInt(that.dbx.lvlselect.value) > 0) {game.load_level(parseInt(that.dbx.lvlselect.value)); that.close_dbx();}};
				let f_c = function(){that.close_dbx();};
				
				that.dbx.enterfun = f_o;
				that.dbx.cancelfun = f_c;
				
				add_button(IMG_BTN_OK_UP, IMG_BTN_OK_DOWN, 25, 220, f_o);
				add_button(IMG_BTN_CANCEL_UP, IMG_BTN_CANCEL_DOWN, 105, 220, f_c);
				
				add_text("Player name:", 20, 30);
				if(game.savegame.username === null){
					add_text("- none -", 100, 30);
				}else{
					add_text(game.savegame.username, 100, 30);
				}
				
				add_text("Level, steps:", 20, 50);
				
				break;
			}
			case DBX_CHARTS:
			{
				game.play_sound(4);
				
				add_title("Charts");
				
				that.dbx.style.width = "322px";
				that.dbx.style.height = "346px";
				that.dbx.style.left = Math.max(Math.floor(window.innerWidth-322)/2, 0)+"px";
				that.dbx.style.top = Math.max(Math.floor(window.innerHeight-346)/2, 0)+"px";
				that.dbx.style.background = 'url('+res.images[IMG_DIALOGBOX_CHARTS].src+')';
				
				let uc = localStorage.getItem("user_count");
				let user_arr = new Array();
				
				for(let i = 0; i < uc; i++){
					let prefix = "player"+i+"_";
					let rl = parseInt(localStorage.getItem(prefix+"reached_level"));
					let st = 0;
					for(let j = 1; j < rl; j++){
						st += parseInt(localStorage.getItem(prefix+"steps_lv"+j));
					}
					user_arr[i] = {name: localStorage.getItem(prefix+"username"), reached: rl, steps: st}
				}
				
				user_arr.sort(function(a,b){return (b.reached-a.reached == 0)?(a.steps - b.steps):(b.reached-a.reached);});
				
				add_text("rank", 21, 37);
				add_text("level", 57, 37);
				add_text("steps", 100, 37);
				add_text("name", 150, 37);
				
				for(let i = 0; i < uc && i < 10; i++){
					add_number((i+1), 20, 65+18*i, 20, 20);
					add_number(user_arr[i].reached, 50, 65+18*i, 30, 20);
					add_number(user_arr[i].steps, 95, 65+18*i, 40, 20);
					add_text(user_arr[i].name, 155, 65+18*i);
				}
				
				let f_o = function(){that.close_dbx();};
				
				that.dbx.enterfun = f_o;
				that.dbx.cancelfun = f_o;
				
				add_button(IMG_BTN_OK_UP, IMG_BTN_OK_DOWN, 125, 300, f_o);
				break;
			}
			default:
				break;
		}
		that.dbx.style.display = "inline";
		
		if(that.dbx.arr_input[0]){
			that.dbx.arr_input[0].focus();
		}
	}
	
	this.close_dbx = function(){
		that.dbx.style.display = "none";
		
		// IMPORTANT MEMORY LEAK PREVENTION
		for(let i = that.dbx.arr_btn.length-1; i >= 0; i--){
			that.dbx.arr_btn[i].pressed = null;
			that.dbx.arr_btn[i].onmousedown = null;
			that.dbx.arr_btn[i].onmouseup = null;
			that.dbx.arr_btn[i].onmouseout = null;
			that.dbx.arr_btn[i].onmouseover = null;
			that.dbx.arr_btn[i].onclick = null;
			that.dbx.arr_btn[i] = null;
		}
		that.dbx.arr_btn = new Array();
		
		for(let i = that.dbx.arr_input.length-1; i >= 0; i--){
			that.dbx.arr_input[i] = null;
		}
		that.dbx.arr_input = new Array();
		
		that.dbx.lvlselect = null;
		that.dbx.errfield = null;
		
		that.dbx.enterfun = null;
		that.dbx.cancelfun = null;
		
		while (that.dbx.firstChild) {
			that.dbx.removeChild(that.dbx.firstChild);
		}
	}
	
}

/*//////////////////////////////////////////////////////////////////////////////////////////////////////
// UPDATING PROCESS
// Here, the behaviour of the game is calculated, once per UPS (update per second)
//////////////////////////////////////////////////////////////////////////////////////////////////////*/
let update = function () {
	if(res.ready()){// All resources loaded
		if(!game.initialized){
			game.set_volume(DEFAULT_VOLUME);
			input.init();// Only init inputs after everything is loaded.
			game.play_sound(0);
			game.initialized = true;
		}
		
		if(!game.paused){
			if(game.mode == 0){
				game.wait_timer--;
				if(game.wait_timer <= 0){
					game.load_level(0);
				}
			}else if(game.mode == 1){
				if(game.wait_timer <= 0){
					if(game.level_ended == 0){
						game.update_tick++;
						update_entities();
					}else if(game.level_ended == 1){
						game.update_savegame(game.level_number, game.steps_taken);
						game.next_level();
					}else if(game.level_ended == 2){
						game.reset_level();
					}
				}else{
					game.wait_timer--;
				}
			}
		}
	}
	
	let now = Date.now();
	game.delta_updated = now - game.last_updated;
	game.last_updated = now;
	
	game.update_drawn = false;
};

let update_entities = function(){
	let tick = (game.update_tick*60/UPS);
	let synced_move = tick % (12/game.move_speed) == 0;
	
	// The player moves first at all times to ensure the best response time and remove directional quirks.
	for(let i = 0; i < game.berti_positions.length; i++){
		game.level_array[game.berti_positions[i].x][game.berti_positions[i].y].register_input(game.berti_positions[i].x, game.berti_positions[i].y, !synced_move);
	}
	
	if(synced_move){
		// NPC logic and stop walking logic.
		for(let y = 0; y < LEV_DIMENSION_Y; y++){
			for(let x = 0; x < LEV_DIMENSION_X; x++){
				if(game.level_array[x][y].id == ENT_AUTO_BERTI){
					game.level_array[x][y].move_randomly(x,y);
				}else if(game.level_array[x][y].id == ENT_PURPLE_MONSTER || game.level_array[x][y].id == ENT_GREEN_MONSTER){
					game.level_array[x][y].chase_berti(x,y);
				}
				
				if(game.level_array[x][y].just_moved){
					game.level_array[x][y].just_moved = false;
					vis.update_animation(x,y);
				}
			}
		}
	}

	// After calculating who moves where, the entities actually get updated.
	for(let y = 0; y < LEV_DIMENSION_Y; y++){
		for(let x = 0; x < LEV_DIMENSION_X; x++){
			game.level_array[x][y].update_entity(x,y);
		}
	}
	
	// Gameover condition check.
	for(let i = 0; i < game.berti_positions.length; i++){
		game.level_array[game.berti_positions[i].x][game.berti_positions[i].y].check_enemy_proximity(game.berti_positions[i].x, game.berti_positions[i].y);
	}
}

/*//////////////////////////////////////////////////////////////////////////////////////////////////////
// RENDERING PROCESS
// All visual things get handled here. Visual variables go into the object "vis".
// Runs with 60 FPS on average (depending on browser).
//////////////////////////////////////////////////////////////////////////////////////////////////////*/

// Render scene
let render = function () {
	let now = Date.now();
    let elapsed = now - game.then;
	
	// Fudge factor: Tolerate timing inaccuracies without skipping update step
	// Reason: Deliberate reduction in timing accuracy due to browser security
	const fudge_factor = 2;
	if (elapsed + fudge_factor > game.fpsInterval) {
		if (elapsed > game.fpsInterval) {
			game.then = now - (elapsed % game.fpsInterval);
		}else{
			game.then = now;
		}
		update();
	}
	
	//CTX.fillStyle="red";
	//CTX.fillRect(0, 0, SCREEN_WIDTH, MENU_HEIGHT);
	//CTX.clearRect(0, MENU_HEIGHT, SCREEN_WIDTH, SCREEN_HEIGHT-MENU_HEIGHT);
	
	if (game.update_drawn) {// This prevents the game from rendering the same thing twice
		window.requestAnimationFrame(render);
		return;
	}
	game.update_drawn = true;

	if (res.ready()) {
		CTX.drawImage(res.images[IMG_BACKGROUND], 0, 0);
		CTX.drawImage(res.images[IMG_FOOTSTEPS], 22, 41);
		CTX.drawImage(res.images[IMG_LADDER], 427, 41);
		render_displays();
		render_buttons();
		if(game.mode == 0){// Title image
			CTX.drawImage(res.images[IMG_TITLESCREEN], LEV_OFFSET_X+4, LEV_OFFSET_Y+4);
			
			CTX.fillStyle = "rgb(0, 0, 0)";
			CTX.font = "bold 12px Helvetica";
			CTX.textAlign = "left";
			CTX.textBaseline = "bottom";
			CTX.fillText("JavaScript remake by " + AUTHOR, 140, 234);
		}else if(game.mode == 1){
			render_field();
		}else if(game.mode == 2){// Won!
			CTX.drawImage(res.images[IMG_ENDSCREEN], LEV_OFFSET_X+4, LEV_OFFSET_Y+4);
		}
		render_vol_bar();
		render_menu();
	}else{
		CTX.fillStyle = "rgb("+vis.light_grey.r+", "+vis.light_grey.g+", "+vis.light_grey.b+")";
		CTX.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);// Options box
		CTX.fillStyle = "rgb(0, 0, 0)";
		CTX.font = "36px Helvetica";
		CTX.textAlign = "center";
		CTX.textBaseline = "middle";
		CTX.fillText("Loading...", SCREEN_WIDTH/2,SCREEN_HEIGHT/2);
	}
	if(DEBUG) render_fps();
	
	window.requestAnimationFrame(render);
};

function render_fps(){
	let now = Date.now();
	
	if(now - vis.last_fps_update >= 250){
		let delta_rendered = now - vis.last_rendered;
		vis.static_ups = ((1000/game.delta_updated).toFixed(2));
		vis.static_fps = ((1000/delta_rendered).toFixed(2));
		
		vis.last_fps_update = now;
	}
	
	CTX.fillStyle = "rgb(255, 0, 0)";
	CTX.font = "12px Helvetica";
	CTX.textAlign = "right";
	CTX.textBaseline = "bottom";
	CTX.fillText("UPS: " + vis.static_ups +" FPS:" + vis.static_fps + " ", SCREEN_WIDTH,SCREEN_HEIGHT);

	vis.last_rendered = now;
};

function render_menu(){
	let submenu_offset = 0;
	// The font is the same for the whole menu... Segoe UI is also nice
	CTX.font = "11px Tahoma";
	CTX.textAlign = "left";
	CTX.textBaseline = "top";
	
	for(let i = 0; i < vis.menu1.submenu_list.length; i++){
		let sm = vis.menu1.submenu_list[i];
		if(i == vis.menu1.submenu_open){
			CTX.fillStyle = "rgb("+vis.light_grey.r+", "+vis.light_grey.g+", "+vis.light_grey.b+")";
			CTX.fillRect(vis.menu1.offset_x + submenu_offset, vis.menu1.offset_y + vis.menu1.height + 1, sm.dd_width, sm.dd_height);// Options box
		
			CTX.fillStyle = "rgb("+vis.med_grey.r+", "+vis.med_grey.g+", "+vis.med_grey.b+")";
			CTX.fillRect(vis.menu1.offset_x + submenu_offset, vis.menu1.offset_y, sm.width, 1);
			CTX.fillRect(vis.menu1.offset_x + submenu_offset, vis.menu1.offset_y, 1, vis.menu1.height);
			CTX.fillRect(vis.menu1.offset_x + submenu_offset + sm.dd_width - 2, vis.menu1.offset_y + vis.menu1.height + 2, 1, sm.dd_height - 2);// Options box
			CTX.fillRect(vis.menu1.offset_x + submenu_offset + 1, vis.menu1.offset_y + vis.menu1.height + sm.dd_height - 1, sm.dd_width - 2, 1);// Options box
			
			CTX.fillStyle = "rgb("+vis.white.r+", "+vis.white.g+", "+vis.white.b+")";
			CTX.fillRect(vis.menu1.offset_x + submenu_offset, vis.menu1.offset_y + vis.menu1.height, sm.width, 1);
			CTX.fillRect(vis.menu1.offset_x + submenu_offset + sm.width - 1, vis.menu1.offset_y, 1, vis.menu1.height);
			CTX.fillRect(vis.menu1.offset_x + submenu_offset + 1, vis.menu1.offset_y + vis.menu1.height + 2, 1, sm.dd_height - 3);// Options box
			CTX.fillRect(vis.menu1.offset_x + submenu_offset + 1, vis.menu1.offset_y + vis.menu1.height + 2, sm.dd_width - 3, 1);// Options box
			
			CTX.fillStyle = "rgb("+vis.dark_grey.r+", "+vis.dark_grey.g+", "+vis.dark_grey.b+")";
			CTX.fillRect(vis.menu1.offset_x + submenu_offset + sm.dd_width - 1, vis.menu1.offset_y + vis.menu1.height + 1, 1, sm.dd_height);// Options box
			CTX.fillRect(vis.menu1.offset_x + submenu_offset, vis.menu1.offset_y + vis.menu1.height + sm.dd_height, sm.dd_width - 1, 1);// Options box
			
			//input.mouse_pos.x
			let option_offset = vis.menu1.offset_y + vis.menu1.height + 4;
			CTX.fillStyle = "rgb("+vis.black.r+", "+vis.black.g+", "+vis.black.b+")";
			
			for(let j = 0; j < sm.options.length; j++){
				let next_offset;
				let check_image = IMG_CHECKBOX_CHECKED;
				
				if(sm.options[j].line){
					next_offset = option_offset + sm.offset_line;
					
					CTX.fillStyle = "rgb("+vis.med_grey.r+", "+vis.med_grey.g+", "+vis.med_grey.b+")";
					CTX.fillRect(vis.menu1.offset_x + submenu_offset + 3 , option_offset + 3, sm.dd_width - 6, 1);// Separator line
					CTX.fillStyle = "rgb("+vis.white.r+", "+vis.white.g+", "+vis.white.b+")";
					CTX.fillRect(vis.menu1.offset_x + submenu_offset + 3 , option_offset + 4, sm.dd_width - 6, 1);// Separator line
					
				}else{
					next_offset = option_offset + sm.offset_text;
				}
				
				if(!sm.options[j].line && input.mouse_pos.x > vis.menu1.offset_x + submenu_offset && input.mouse_pos.x < vis.menu1.offset_x + submenu_offset + sm.dd_width &&
				input.mouse_pos.y > option_offset && input.mouse_pos.y < next_offset){
					CTX.fillStyle = "rgb("+vis.blue.r+", "+vis.blue.g+", "+vis.blue.b+")";
					CTX.fillRect(vis.menu1.offset_x + submenu_offset + 3 , option_offset, sm.dd_width - 6, sm.offset_text);// Options box
					CTX.fillStyle = "rgb("+vis.white.r+", "+vis.white.g+", "+vis.white.b+")";
					
					check_image = IMG_CHECKBOX_UNCHECKED;
				}else if(!sm.options[j].on()){
					CTX.fillStyle = "rgb("+vis.white.r+", "+vis.white.g+", "+vis.white.b+")";
					CTX.fillText(sm.options[j].name, vis.menu1.offset_x + submenu_offset + 21, option_offset + 2);
				}else{
					CTX.fillStyle = "rgb("+vis.black.r+", "+vis.black.g+", "+vis.black.b+")";
				}
				
				if(sm.options[j].on()){
					CTX.fillText(sm.options[j].name, vis.menu1.offset_x + submenu_offset + 20, option_offset + 1);
				}else{
					CTX.fillStyle = "rgb("+vis.med_grey.r+", "+vis.med_grey.g+", "+vis.med_grey.b+")";
					CTX.fillText(sm.options[j].name, vis.menu1.offset_x + submenu_offset + 20, option_offset + 1);
				}
				
				if(sm.options[j].check != 0){
					if((sm.options[j].effect_id == 3 && game.paused) || (sm.options[j].effect_id == 4 && game.single_steps) || (sm.options[j].effect_id == 5 && game.sound)){
						CTX.drawImage(res.images[check_image], vis.menu1.offset_x + submenu_offset + 6, option_offset + 6);// Background
					}
				}
				
				option_offset = next_offset;
			}
			
		}
		CTX.fillStyle = "rgb("+vis.black.r+", "+vis.black.g+", "+vis.black.b+")";
		CTX.fillText(sm.name, vis.menu1.offset_x + submenu_offset + 6, vis.menu1.offset_y + 3);
		submenu_offset += sm.width;
	}
}

function render_vol_bar(){
	let vb = vis.vol_bar;
	let switcher = false;
	let line_height = 0;
	
	for(let i = 0; i < vb.width; i+= 1){
		if(switcher){
			switcher = false;
			CTX.fillStyle = "rgb("+vb.colour_4.r+", "+vb.colour_4.g+", "+vb.colour_4.b+")";
		}else{
			switcher = true;
			let ratio2 = i/vb.width;
			line_height = Math.round(vb.height*ratio2);
		
			if(i < Math.ceil(vb.volume*vb.width)){
				if(game.sound){
					let ratio1 = 1-ratio2;
					CTX.fillStyle = "rgb("+Math.round(vb.colour_1.r*ratio1+vb.colour_2.r*ratio2)+", "+Math.round(vb.colour_1.g*ratio1+vb.colour_2.g*ratio2)+", "+Math.round(vb.colour_1.b*ratio1+vb.colour_2.b*ratio2)+")";
				}else{
					CTX.fillStyle = "rgb("+vb.colour_5.r+", "+vb.colour_5.g+", "+vb.colour_5.b+")";
				}
			}else{
				CTX.fillStyle = "rgb("+vb.colour_3.r+", "+vb.colour_3.g+", "+vb.colour_3.b+")";
			}
		}
		CTX.fillRect(vb.offset_x+i, vb.offset_y+vb.height-line_height, 1, line_height);
	}

};

function render_field(){
	render_field_subset(true);// Consumables in the background
	render_field_subset(false);// The rest in the foreground
	
	CTX.drawImage(res.images[IMG_BACKGROUND], 0, 391, 537, 4, 0, LEV_OFFSET_Y+24*LEV_DIMENSION_Y, 537, 4);// Bottom border covering blocks
	CTX.drawImage(res.images[IMG_BACKGROUND], 520, LEV_OFFSET_Y, 4, 391-LEV_OFFSET_Y, LEV_OFFSET_X+24*LEV_DIMENSION_X, LEV_OFFSET_Y, 4, 391-LEV_OFFSET_Y);// Right border covering blocks
	
	if(game.level_ended == 1){// Berti cheering, wow or yeah
		for(let i = 0; i < game.berti_positions.length; i++){
			if(game.wow){
				CTX.drawImage(res.images[IMG_WOW],
				LEV_OFFSET_X+24*game.berti_positions[i].x+game.level_array[game.berti_positions[i].x][game.berti_positions[i].y].moving_offset.x+vis.offset_wow_x,
				LEV_OFFSET_Y+24*game.berti_positions[i].y+game.level_array[game.berti_positions[i].x][game.berti_positions[i].y].moving_offset.y+vis.offset_wow_y);
			}else{
				CTX.drawImage(res.images[IMG_YEAH],
				LEV_OFFSET_X+24*game.berti_positions[i].x+game.level_array[game.berti_positions[i].x][game.berti_positions[i].y].moving_offset.x+vis.offset_yeah_x,
				LEV_OFFSET_Y+24*game.berti_positions[i].y+game.level_array[game.berti_positions[i].x][game.berti_positions[i].y].moving_offset.y+vis.offset_yeah_y);
			}
		}
	}else if(game.level_ended == 2){// Berti dies in a pool of blood
		for(let i = 0; i < game.berti_positions.length; i++){
			CTX.drawImage(res.images[IMG_ARGL],
			LEV_OFFSET_X+24*game.berti_positions[i].x+game.level_array[game.berti_positions[i].x][game.berti_positions[i].y].moving_offset.x+vis.offset_argl_x,
			LEV_OFFSET_Y+24*game.berti_positions[i].y+game.level_array[game.berti_positions[i].x][game.berti_positions[i].y].moving_offset.y+vis.offset_argl_y);
		}
	}
}
function render_field_subset(consumable){
	for(let y = 0; y < LEV_DIMENSION_Y; y++){
		for(let x = 0; x < LEV_DIMENSION_X; x++){
			let block = game.level_array[x][y];
			if(y > 0 && game.level_array[x][y-1].moving && game.level_array[x][y-1].face_dir == DIR_DOWN && game.level_array[x][y-1].consumable == consumable){
				render_block(x, y-1, RENDER_BOTTOM);
			}
			
			if(y > 0 && (!game.level_array[x][y-1].moving) && game.level_array[x][y-1].consumable == consumable){
				if(x > 0 && game.level_array[x-1][y].face_dir != DIR_RIGHT){
					render_block(x, y-1, RENDER_BOTTOM_BORDER);
				}
			}
		
			if(block.consumable == consumable){
				if(!block.moving || block.face_dir == DIR_LEFT || block.face_dir == DIR_RIGHT){
					render_block(x, y, RENDER_FULL);
				}else if(block.face_dir == DIR_DOWN){
					render_block(x, y, RENDER_TOP);
				}else if(block.face_dir == DIR_UP){
					render_block(x, y, RENDER_BOTTOM);
				}
			}
			
			if(y+1 < LEV_DIMENSION_Y && game.level_array[x][y+1].moving && game.level_array[x][y+1].face_dir == DIR_UP && game.level_array[x][y+1].consumable == consumable){
				render_block(x, y+1, RENDER_TOP);
			}
		}
	}
}
function render_block(x, y, render_option){
	let block = game.level_array[x][y];

	let offset_x = block.moving_offset.x;
	let offset_y = block.moving_offset.y;
	
	let needs_update = false;
	while(block.animation_delay >= ANIMATION_DURATION && !block.just_moved){
		block.animation_delay -= ANIMATION_DURATION;
		needs_update = true;
	}
	
	if(game.level_array[x][y].id == ENT_EMPTY || game.level_array[x][y].id == ENT_DUMMY){
		// Optimization (empty and dummy block can't be drawn)
		return;
	}
	
	if(needs_update)
	switch (game.level_array[x][y].id) {
		case ENT_PLAYER_BERTI:
		case ENT_AUTO_BERTI:
			if(block.animation_frame >= IMG_BERTI_WALK_LEFT_0 && block.animation_frame < IMG_BERTI_WALK_LEFT_3){
				block.animation_frame += 1;
			}else if(block.animation_frame == IMG_BERTI_WALK_LEFT_3){
				block.animation_frame = IMG_BERTI_WALK_LEFT_0;
			}else if(block.animation_frame >= IMG_BERTI_WALK_RIGHT_0 && block.animation_frame < IMG_BERTI_WALK_RIGHT_3){
				block.animation_frame += 1;
			}else if(block.animation_frame == IMG_BERTI_WALK_RIGHT_3){
				block.animation_frame = IMG_BERTI_WALK_RIGHT_0;
			}else if(block.animation_frame >= IMG_BERTI_WALK_UP_0 && block.animation_frame < IMG_BERTI_WALK_UP_3){
				block.animation_frame += 1;
			}else if(block.animation_frame == IMG_BERTI_WALK_UP_3){
				block.animation_frame = IMG_BERTI_WALK_UP_0;
			}else if(block.animation_frame >= IMG_BERTI_WALK_DOWN_0 && block.animation_frame < IMG_BERTI_WALK_DOWN_3){
				block.animation_frame += 1;
			}else if(block.animation_frame == IMG_BERTI_WALK_DOWN_3){
				block.animation_frame = IMG_BERTI_WALK_DOWN_0;
			}else if(block.animation_frame >= IMG_BERTI_PUSH_LEFT_0 && block.animation_frame < IMG_BERTI_PUSH_LEFT_3){
				block.animation_frame += 1;
			}else if(block.animation_frame == IMG_BERTI_PUSH_LEFT_3){
				block.animation_frame = IMG_BERTI_PUSH_LEFT_0;
			}else if(block.animation_frame >= IMG_BERTI_PUSH_RIGHT_0 && block.animation_frame < IMG_BERTI_PUSH_RIGHT_3){
				block.animation_frame += 1;
			}else if(block.animation_frame == IMG_BERTI_PUSH_RIGHT_3){
				block.animation_frame = IMG_BERTI_PUSH_RIGHT_0;
			}else if(block.animation_frame >= IMG_BERTI_PUSH_UP_0 && block.animation_frame < IMG_BERTI_PUSH_UP_3){
				block.animation_frame += 1;
			}else if(block.animation_frame == IMG_BERTI_PUSH_UP_3){
				block.animation_frame = IMG_BERTI_PUSH_UP_0;
			}else if(block.animation_frame >= IMG_BERTI_PUSH_DOWN_0 && block.animation_frame < IMG_BERTI_PUSH_DOWN_3){
				block.animation_frame += 1;
			}else if(block.animation_frame == IMG_BERTI_PUSH_DOWN_3){
				block.animation_frame = IMG_BERTI_PUSH_DOWN_0;
			}
			break;
		case ENT_PURPLE_MONSTER:
			if(block.animation_frame >= IMG_PURPMON_STUCK_0 && block.animation_frame < IMG_PURPMON_STUCK_3){
				block.animation_frame += 1;
			}else if(block.animation_frame == IMG_PURPMON_STUCK_3){
				block.animation_frame = IMG_PURPMON_STUCK_0;
			}else if(block.animation_frame >= IMG_PURPMON_WALK_LEFT_0 && block.animation_frame < IMG_PURPMON_WALK_LEFT_3){
				block.animation_frame += 1;
			}else if(block.animation_frame == IMG_PURPMON_WALK_LEFT_3){
				block.animation_frame = IMG_PURPMON_WALK_LEFT_0;
			}else if(block.animation_frame >= IMG_PURPMON_WALK_RIGHT_0 && block.animation_frame < IMG_PURPMON_WALK_RIGHT_3){
				block.animation_frame += 1;
			}else if(block.animation_frame == IMG_PURPMON_WALK_RIGHT_3){
				block.animation_frame = IMG_PURPMON_WALK_RIGHT_0;
			}else if(block.animation_frame >= IMG_PURPMON_WALK_UP_0 && block.animation_frame < IMG_PURPMON_WALK_UP_3){
				block.animation_frame += 1;
			}else if(block.animation_frame == IMG_PURPMON_WALK_UP_3){
				block.animation_frame = IMG_PURPMON_WALK_UP_0;
			}else if(block.animation_frame >= IMG_PURPMON_WALK_DOWN_0 && block.animation_frame < IMG_PURPMON_WALK_DOWN_3){
				block.animation_frame += 1;
			}else if(block.animation_frame == IMG_PURPMON_WALK_DOWN_3){
				block.animation_frame = IMG_PURPMON_WALK_DOWN_0;
			}else if(block.animation_frame >= IMG_PURPMON_PUSH_LEFT_0 && block.animation_frame < IMG_PURPMON_PUSH_LEFT_3){
				block.animation_frame += 1;
			}else if(block.animation_frame == IMG_PURPMON_PUSH_LEFT_3){
				block.animation_frame = IMG_PURPMON_PUSH_LEFT_0;
			}else if(block.animation_frame >= IMG_PURPMON_PUSH_RIGHT_0 && block.animation_frame < IMG_PURPMON_PUSH_RIGHT_3){
				block.animation_frame += 1;
			}else if(block.animation_frame == IMG_PURPMON_PUSH_RIGHT_3){
				block.animation_frame = IMG_PURPMON_PUSH_RIGHT_0;
			}else if(block.animation_frame >= IMG_PURPMON_PUSH_UP_0 && block.animation_frame < IMG_PURPMON_PUSH_UP_3){
				block.animation_frame += 1;
			}else if(block.animation_frame == IMG_PURPMON_PUSH_UP_3){
				block.animation_frame = IMG_PURPMON_PUSH_UP_0;
			}else if(block.animation_frame >= IMG_PURPMON_PUSH_DOWN_0 && block.animation_frame < IMG_PURPMON_PUSH_DOWN_3){
				block.animation_frame += 1;
			}else if(block.animation_frame == IMG_PURPMON_PUSH_DOWN_3){
				block.animation_frame = IMG_PURPMON_PUSH_DOWN_0;
			}
			break;
		case ENT_GREEN_MONSTER:
			if(block.animation_frame >= IMG_GREENMON_STUCK_0 && block.animation_frame < IMG_GREENMON_STUCK_3){
				block.animation_frame += 1;
			}else if(block.animation_frame == IMG_GREENMON_STUCK_3){
				block.animation_frame = IMG_GREENMON_STUCK_0;
			}else if(block.animation_frame >= IMG_GREENMON_WALK_LEFT_0 && block.animation_frame < IMG_GREENMON_WALK_LEFT_3){
				block.animation_frame += 1;
			}else if(block.animation_frame == IMG_GREENMON_WALK_LEFT_3){
				block.animation_frame = IMG_GREENMON_WALK_LEFT_0;
			}else if(block.animation_frame >= IMG_GREENMON_WALK_RIGHT_0 && block.animation_frame < IMG_GREENMON_WALK_RIGHT_3){
				block.animation_frame += 1;
			}else if(block.animation_frame == IMG_GREENMON_WALK_RIGHT_3){
				block.animation_frame = IMG_GREENMON_WALK_RIGHT_0;
			}else if(block.animation_frame >= IMG_GREENMON_WALK_UP_0 && block.animation_frame < IMG_GREENMON_WALK_UP_3){
				block.animation_frame += 1;
			}else if(block.animation_frame == IMG_GREENMON_WALK_UP_3){
				block.animation_frame = IMG_GREENMON_WALK_UP_0;
			}else if(block.animation_frame >= IMG_GREENMON_WALK_DOWN_0 && block.animation_frame < IMG_GREENMON_WALK_DOWN_3){
				block.animation_frame += 1;
			}else if(block.animation_frame == IMG_GREENMON_WALK_DOWN_3){
				block.animation_frame = IMG_GREENMON_WALK_DOWN_0;
			}
			break;
		default:
		break;
	}
	
	//drawImage reference: context.drawImage(img,sx,sy,swidth,sheight,x,y,width,height);
	if(block.animation_frame >= 0){
		if(render_option == RENDER_FULL){// Render the full block
			CTX.drawImage(res.images[block.animation_frame], LEV_OFFSET_X+24*x+offset_x+block.fine_offset_x, LEV_OFFSET_Y+24*y+offset_y+block.fine_offset_y);
		}else if(render_option == RENDER_TOP){// Render top
			if(block.face_dir == DIR_DOWN){
				CTX.drawImage(res.images[block.animation_frame], 0, 0, res.images[block.animation_frame].width, res.images[block.animation_frame].height-offset_y, LEV_OFFSET_X+24*x+offset_x+block.fine_offset_x, LEV_OFFSET_Y+24*y+offset_y+block.fine_offset_y, res.images[block.animation_frame].width, res.images[block.animation_frame].height-offset_y);
			}else if(block.face_dir == DIR_UP){
				CTX.drawImage(res.images[block.animation_frame], 0, 0, res.images[block.animation_frame].width, res.images[block.animation_frame].height-offset_y-24, LEV_OFFSET_X+24*x+offset_x+block.fine_offset_x, LEV_OFFSET_Y+24*y+offset_y+block.fine_offset_y, res.images[block.animation_frame].width, res.images[block.animation_frame].height-offset_y-24);
			}
		}else if(render_option == RENDER_BOTTOM){// Render bottom
			let imgsize_offset = res.images[block.animation_frame].height - 24;
		
			if(block.face_dir == DIR_DOWN){
				CTX.drawImage(res.images[block.animation_frame], 0, res.images[block.animation_frame].height-offset_y-imgsize_offset, res.images[block.animation_frame].width, offset_y+imgsize_offset, LEV_OFFSET_X+24*x+offset_x+block.fine_offset_x, LEV_OFFSET_Y+24*y+24+block.fine_offset_y, res.images[block.animation_frame].width, offset_y+imgsize_offset);
			}else if(block.face_dir == DIR_UP){
				CTX.drawImage(res.images[block.animation_frame], 0, -offset_y, res.images[block.animation_frame].width, res.images[block.animation_frame].height+offset_y, LEV_OFFSET_X+24*x+offset_x+block.fine_offset_x, LEV_OFFSET_Y+24*y+block.fine_offset_y, res.images[block.animation_frame].width, res.images[block.animation_frame].height+offset_y);
			}
		}else if(render_option == RENDER_BOTTOM_BORDER){// Render the bottom 4 pixels
			CTX.drawImage(res.images[block.animation_frame], 0, 24, res.images[block.animation_frame].width-4, 4, LEV_OFFSET_X+24*x+offset_x+block.fine_offset_x, LEV_OFFSET_Y+24*y+offset_y+block.fine_offset_y+24, res.images[block.animation_frame].width-4, 4);
		}
	}
}

function render_buttons(){
	let over_button = false;
	if(input.mouse_down){
		if(input.mouse_pos.y >= 35 && input.mouse_pos.y <= 65){
			if(input.mouse_pos.x >= 219 && input.mouse_pos.x <= 249 && input.lastclick_button == 0){
				vis.buttons_pressed[0] = true;
				over_button = true;
			}else if(input.mouse_pos.x >= 253 && input.mouse_pos.x <= 283 && input.lastclick_button == 1){
				vis.buttons_pressed[1] = true;
				over_button = true;
			}else if(input.mouse_pos.x >= 287 && input.mouse_pos.x <= 317 && input.lastclick_button == 2){
				vis.buttons_pressed[2] = true;
				over_button = true;
			}
		}
	}
	if(!over_button){
		vis.buttons_pressed[0] = vis.buttons_pressed[1] = vis.buttons_pressed[2] = false;
	}
	
	if(game.buttons_activated[0]){
		if(vis.buttons_pressed[0]){
			CTX.drawImage(res.images[IMG_BTN_PREV_DOWN], 219, 35);// << pressed
		}else{
			CTX.drawImage(res.images[IMG_BTN_PREV_UP], 219, 35);// << up
		}
	}else{
		CTX.drawImage(res.images[IMG_BTN_PREV_DISABLED], 219, 35);// << disabled
	}
	
	if(vis.buttons_pressed[1]){
		CTX.drawImage(res.images[IMG_BTN_BERTI_DOWN], 253, 35);// Berti pressed
	}else{
		if(vis.berti_blink_time < 100){
			CTX.drawImage(res.images[IMG_BTN_BERTI_UP], 253, 35);// Berti up
			if(vis.berti_blink_time == 0){
				vis.berti_blink_time = 103;//Math.floor(100+(Math.random()*100)+1);
			}else{
				vis.berti_blink_time--;
			}
		}else{
			CTX.drawImage(res.images[IMG_BTN_BERTI_BLINK_UP], 253, 35);// Berti up blink
			if(vis.berti_blink_time == 100){
				vis.berti_blink_time = Math.floor((Math.random()*95)+5);
			}else{
				vis.berti_blink_time--;
			}
		}
	}
	
	if(game.buttons_activated[2]){
		if(vis.buttons_pressed[2]){
			CTX.drawImage(res.images[IMG_BTN_NEXT_DOWN], 287, 35);// >> pressed
		}else{
			CTX.drawImage(res.images[IMG_BTN_NEXT_UP], 287, 35);// >> up
		}
	}else{
		CTX.drawImage(res.images[IMG_BTN_NEXT_DISABLED], 287, 35);// >> disabled
	}

}

function render_displays(){
	let steps_string = game.steps_taken.toString();
	let steps_length = Math.min(steps_string.length-1, 4);

	for(let i = steps_length; i >= 0; i--){
		var img = IMG_DIGIT_LOOKUP[parseInt(steps_string.charAt(i))];
		CTX.drawImage(res.images[img], 101-(steps_length-i)*13, 41);
	}
	for(let i = steps_length+1; i < 5; i++){
		CTX.drawImage(res.images[IMG_DIGIT_EMPTY], 101-i*13, 41);
	}

	let level_string = game.level_number.toString();
	let level_length = Math.min(level_string.length-1, 4);

	for(let i = level_length; i >= 0; i--){
		var img = IMG_DIGIT_LOOKUP[parseInt(level_string.charAt(i))];
		CTX.drawImage(res.images[img], 506-(level_length-i)*13, 41);
	}
	for(let i = level_length+1; i < 5; i++){
		CTX.drawImage(res.images[IMG_DIGIT_EMPTY], 506-i*13, 41);
	}
}

function render_joystick(x, y){
	let mid_x = JOYSTICK.width/2;
	let mid_y = JOYSTICK.height/2;
	
	JOYCTX.clearRect ( 0 , 0 , JOYSTICK.width, JOYSTICK.height );
	JOYCTX.globalAlpha = 0.5;// Set joystick half-opaque (1 = opaque, 0 = fully transparent)
	JOYCTX.beginPath();
	JOYCTX.arc(mid_x,mid_y,JOYSTICK.width/4+10,0,2*Math.PI);
	JOYCTX.stroke();
	
	if(typeof x !== 'undefined' && typeof y !== 'undefined'){
		let dist = Math.sqrt(Math.pow(x-mid_x,2)+Math.pow(y-mid_y,2));
		if(dist > JOYSTICK.width/4){
			x = mid_x + (x-mid_x)/dist*JOYSTICK.width/4;
			y = mid_y + (y-mid_y)/dist*JOYSTICK.width/4;
		}
		JOYCTX.beginPath();
		JOYCTX.arc(x, y, 10, 0,2*Math.PI, false);// a circle at the start
		JOYCTX.fillStyle = "red";
		JOYCTX.fill();
	}
}

// Use window.requestAnimationFrame, get rid of browser differences.
(function() {
    let lastTime = 0;
    let vendors = ['ms', 'moz', 'webkit', 'o'];
    for(let x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            let currTime = new Date().getTime();
            let timeToCall = Math.max(0, 16 - (currTime - lastTime));
            let id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

render();// Render thread
