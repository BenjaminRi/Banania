"use strict";
var DEBUG = true;
var AUTHOR = "Benjamin";

//GLOBAL CONSTANTS
var UPS = 30;
var NUM_RESOURCES = 197;
var IMAGE_DIR = "images/";
var SOUND_DIR = "sound/";
var SCREEN_WIDTH = 537;
var SCREEN_HEIGHT = 408;
var LEV_OFFSET_X = 16;
var LEV_OFFSET_Y = 79;
var LEV_DIMENSION_X = 21;
var LEV_DIMENSION_Y = 13;
var MENU_HEIGHT = 20;
var INTRO_DURATION = 6;//In seconds
if(DEBUG) INTRO_DURATION = 2;
var LEV_START_DELAY = 2;
if(DEBUG) LEV_START_DELAY = 1;
var LEV_STOP_DELAY = 2;
if(DEBUG) LEV_STOP_DELAY = 1;
var ANIMATION_DURATION = 4;//How many times the game has to render before the image changes

var DEFAULT_VOLUME = 0.7;

var DIR_NONE = -1;
var DIR_UP = 0;
var DIR_LEFT = 1;
var DIR_DOWN = 2;
var DIR_RIGHT = 3;

var RENDER_FULL = 0;
var RENDER_TOP = 1;
var RENDER_BOTTOM = 2;

var DBX_CONFIRM = 0;
var DBX_SAVE = 1;
var DBX_LOAD = 2;
var DBX_CHPASS = 3;
var DBX_LOADLVL = 4;
var DBX_CHARTS = 5;

var ERR_SUCCESS = 0;
var ERR_EXISTS = 1;
var ERR_NOSAVE = 2;
var ERR_WRONGPW = 3;
var ERR_NOTFOUND = 4;
var ERR_EMPTYNAME = 5;

//Check storage
var HAS_STORAGE = (function(){try {return 'localStorage' in window && window['localStorage'] !== null && window['localStorage'] !== undefined;} catch (e) {return false;}})();

//Canvas creation
var CANVAS = document.createElement("canvas");
var CTX = CANVAS.getContext("2d");
CANVAS.width = SCREEN_WIDTH;
CANVAS.height = SCREEN_HEIGHT;
CANVAS.className = "canv";
document.body.appendChild(CANVAS);

//GLOBAL VARIABLES

//MD5 digest for passwords
var md5 = new CLASS_md5();

//Game
var game = new CLASS_game();

//Resources
var res = new CLASS_resources();
res.load();

//Input mechanics
var input = new CLASS_input();

//Visual
var vis = new CLASS_visual();
vis.init_menus();

/*//////////////////////////////////////////////////////////////////////////////////////////////////////
//RESOURCES CLASS
//Images, sounds, level. Just resources.
//////////////////////////////////////////////////////////////////////////////////////////////////////*/

function CLASS_resources(){
//Private:
	var that = this;
	var resources_loaded = 0;
	var already_loading = false;
	
	function on_loaded(){
		resources_loaded++;
	};
//Public:
	this.images = new Array();
	this.sounds = new Array();
	this.levels = EXTERNAL_LEVELS;//External loading

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

		for(var i = 0; i < 9; i++){//From 2 to 10 garbage
			that.images[2+i] = new Image();
			that.images[2+i].onload = on_loaded();
			that.images[2+i].src = IMAGE_DIR+"garbage_"+i+".png";
		}

		for(var i = 0; i < 11; i++){//From 11 to 21 digits
			that.images[11+i] = new Image();
			that.images[11+i].onload = on_loaded();
			that.images[11+i].src = IMAGE_DIR+"digits_"+i+".png";
		}

		for(var i = 0; i < 3; i++){//From 22 to 30 buttons
			for(var j = 0; j < 3; j++){
				that.images[22+3*i+j] = new Image();
				that.images[22+3*i+j].onload = on_loaded();
				that.images[22+3*i+j].src = IMAGE_DIR+"userbutton_"+i+"-"+j+".png";
			}
		}

		for(var i = 0; i < 9; i++){//From 31 to 39 stones
			that.images[31+i] = new Image();
			that.images[31+i].onload = on_loaded();
			that.images[31+i].src = IMAGE_DIR+"stone_"+i+".png";
		}
		
		//Number 40 is missing because I'm a retard. Hihihi.

		for(var i = 0; i < 6; i++){//From 41 to 58 doors
			for(var j = 0; j < 3; j++){//Reversed order for ease of access
				that.images[41+3*i+j] = new Image();
				that.images[41+3*i+j].onload = on_loaded();
				that.images[41+3*i+j].src = IMAGE_DIR+"doors_"+j+"-"+i+".png";
			}
		}

		for(var i = 0; i < 13; i++){//From 59 to 110 player (berti)
			for(var j = 0; j < 4; j++){//Reversed order for ease of access
				that.images[59+4*i+j] = new Image();
				that.images[59+4*i+j].onload = on_loaded();
				that.images[59+4*i+j].src = IMAGE_DIR+"player_"+j+"-"+i+".png";
			}
		}

		for(var i = 0; i < 9; i++){//From 111 to 146 monster 1(purple)
			for(var j = 0; j < 4; j++){//Reversed order for ease of access
				that.images[111+4*i+j] = new Image();
				that.images[111+4*i+j].onload = on_loaded();
				that.images[111+4*i+j].src = IMAGE_DIR+"monster1_"+j+"-"+i+".png";
			}
		}

		for(var i = 0; i < 5; i++){//From 147 to 166 monster 2(green)
			for(var j = 0; j < 4; j++){//Reversed order for ease of access
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
		
		var soundarray = [
		"about.wav",
		"argl.wav",
		"attack1.wav",
		"attack2.wav",
		"chart.wav",
		"click.wav",
		"gameend.wav",
		"getpoint.wav",
		"newplane.wav",
		"opendoor.wav",
		"wow.wav",
		"yeah.wav"];
		
		for(var i = 0; i < soundarray.length; i++){
			that.sounds[i] = new Audio();
			that.sounds[i].onloadeddata = on_loaded();
			that.sounds[i].src = SOUND_DIR+soundarray[i];
		}

		////////////////////////////////////////////////////////
		// Level: //////////////////////////////////////////////
		////////////////////////////////////////////////////////

		//levels is now loaded externally
		if(that.levels !== null){
			on_loaded();
		}
	}
}

/*//////////////////////////////////////////////////////////////////////////////////////////////////////
//INPUT CLASS
//Everything that has to do with keyboard and mouse input goes here
//////////////////////////////////////////////////////////////////////////////////////////////////////*/

function CLASS_input(){
//Private:
	var that = this;
	
	function handle_keydown_global(evt) {
		that.keys_down[evt.keyCode] = true;
		if(that.keys_down[37]){
			game.walk_dir = DIR_LEFT;
		}else if(that.keys_down[38]){
			game.walk_dir = DIR_UP;
		}else if(that.keys_down[39]){
			game.walk_dir = DIR_RIGHT;
		}else if(that.keys_down[40]){
			game.walk_dir = DIR_DOWN;
		}
		
		if(vis.dbx.firstChild){//If a dialog box is open
			if(that.keys_down[13]){//Enter
				vis.dbx.enterfun();
			}else if(that.keys_down[27]){//Esc
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
				var temp_x = (that.mouse_pos_global.x-vis.dbx.drag_pos.x);
				var temp_y = (that.mouse_pos_global.y-vis.dbx.drag_pos.y);
				if(temp_x < 0) temp_x = 0;
				if(temp_y < 0) temp_y = 0;
				
				vis.dbx.style.left = temp_x+"px";
				vis.dbx.style.top = temp_y+"px";
			}
		}
	};
	
	function handle_mousedown_global(evt) {
		that.mouse_down = true;
		if(vis !== null && vis.dbx !== null && vis.dbx.style.display != "none"){
			var rel_pos = {x:that.mouse_pos_global.x - parseInt(vis.dbx.style.left), y:that.mouse_pos_global.y - parseInt(vis.dbx.style.top)};
			if(rel_pos.x > 0 && rel_pos.x < parseInt(vis.dbx.style.width) && rel_pos.y > 0 && rel_pos.y < 20){
				evt.preventDefault();//Prevents from selecting the canvas
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
		var rect = CANVAS.getBoundingClientRect();
		var style = window.getComputedStyle(CANVAS);
		that.mouse_pos =  {
			x: Math.round(evt.clientX - rect.left - parseInt(style.getPropertyValue('border-left-width'))),
			y: Math.round(evt.clientY - rect.top - parseInt(style.getPropertyValue('border-top-width')))
		};
		
		if(that.lastclick_button == 3){
			game.set_volume((that.mouse_pos.x-vis.vol_bar.offset_x)/vis.vol_bar.width);
		}
		
		if(that.menu_pressed == 0){
			calc_opened(vis.menu1, that.mouse_pos.x, that.mouse_pos.y);
		}
	};

	function handle_mousedown(evt){
		evt.preventDefault();//Prevents from selecting the canvas
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
			var menubutton_pressed = false;
			
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
			var up_option = calc_option(vis.menu1, that.mouse_pos.x, that.mouse_pos.y);
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
		
		var submenu_offset = 0;
		for(var i = 0; i < a_menu.submenu_list.length; i++){
			submenu_offset += a_menu.submenu_list[i].width;
			if(mouse_x < a_menu.offset_x + submenu_offset){
				a_menu.submenu_open = i;
				return;
			}
		}
	}
	
	function calc_option(a_menu, mouse_x, mouse_y){
		if(a_menu.submenu_open != -1){
			var submenu_offset = 0;
			for(var i = 0; i < a_menu.submenu_list.length; i++){
				var sm = a_menu.submenu_list[i];
				if(i == a_menu.submenu_open){
					var option_offset = a_menu.offset_y + a_menu.height + 4;
					for(var j = 0; j < sm.options.length; j++){
						var next_offset;
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
	
//Public:
	this.keys_down = new Array();
	this.mouse_pos = {x: 0, y: 0};
	this.mouse_pos_global = {x: 0, y: 0};
	this.mouse_lastclick = {x: 0, y: 0};
	this.mouse_down = false;
	this.lastclick_button = -1;
	this.menu_pressed = -1;
	this.lastklick_option = null;
	
	this.init = function(){
	
		// Handle keyboard controls (GLOBAL)
		document.addEventListener('keydown', handle_keydown_global, false);

		document.addEventListener('keyup', handle_keyup_global, false);
		
		//Handle mouse controls (GLOBAL)

		document.addEventListener('mousemove', handle_mousemove_global, false);
		
		document.addEventListener('mousedown', handle_mousedown_global, false);
		
		document.addEventListener('mouseup', handle_mouseup_global, false);
		
		//Handle mouse controls (CANVAS)
		CANVAS.addEventListener('mousemove', handle_mousemove, false);
			
		CANVAS.addEventListener('mousedown', handle_mousedown, false);

		CANVAS.addEventListener('mouseup', handle_mouseup, false);

		CANVAS.addEventListener('mouseout', handle_mouseout, false);
	}
}

/*//////////////////////////////////////////////////////////////////////////////////////////////////////
//GAME CLASS
//Holds entities and the game itself
//////////////////////////////////////////////////////////////////////////////////////////////////////*/

function CLASS_game(){
	//Private:
	var that = this;
	
	
	//////////////////////////////////////////////////////////////////////////////
	//Savegame section:
	//////////////////////////////////////////////////////////////////////////////
	function CLASS_savegame(){
		this.usernumber = -1;
	
		this.username = null;
		this.password = null;
		this.reached_level = 1;
		
		this.progressed = false;
	
		this.arr_steps = new Array();
		for(var i = 1; i <= 50; i++){
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
		
		var prefix = "player"+that.savegame.usernumber+"_";
		
		localStorage.setItem(prefix+"username", that.savegame.username);
		localStorage.setItem(prefix+"password", that.savegame.password);
		localStorage.setItem(prefix+"reached_level", that.savegame.reached_level);
		
		for(var i = 1; i <= 50; i++){
			localStorage.setItem(prefix+"steps_lv"+i, that.savegame.arr_steps[i]);
		}
		
		that.savegame.progressed = false;
		
		return ERR_SUCCESS;//Success!
	}
	
	this.retrieve_savegame = function(uname, pass){
		var user_count = localStorage.getItem("user_count");
		if(user_count === null){
			return ERR_NOSAVE;//There are no save games
		}
		user_count = parseInt(user_count);
		pass = md5.digest(pass);
		
		for(var i = 0; i < user_count; i++){
			var prefix = "player"+i+"_";
			if(localStorage.getItem(prefix+"username") == uname){
				if(localStorage.getItem(prefix+"password") == pass){
					that.savegame = new CLASS_savegame();
					that.savegame.usernumber = i;
					that.savegame.username = uname;
					that.savegame.password = pass;
					that.savegame.reached_level = parseInt(localStorage.getItem(prefix+"reached_level"));
					for(var i = 1; i <= 50; i++){
						that.savegame.arr_steps[i] = parseInt(localStorage.getItem(prefix+"steps_lv"+i));
					}
					that.savegame.progressed = false;
					
					that.level_unlocked = that.savegame.reached_level;
					if(that.level_unlocked >= 50){
						that.load_level(50);
					}else{
						that.load_level(that.level_unlocked);
					}
					
					return ERR_SUCCESS;//Success!
				}else{
					return ERR_WRONGPW;//Wrong password!
				}
			}
		}
		return ERR_NOTFOUND;//There's no such name
	}
	
	this.name_savegame = function(uname, pass){
		var user_count = localStorage.getItem("user_count");
		if(user_count !== null){
			user_count = parseInt(user_count);
			for(var i = 0; i < user_count; i++){
				var prefix = "player"+i+"_";
				if(localStorage.getItem(prefix+"username") == uname){
					return ERR_EXISTS;//Failed already exists
				}
			}	
		}
		that.savegame.username = uname;
		that.savegame.password = md5.digest(pass)
		return ERR_SUCCESS;//Worked
	}
	
	this.change_password = function(pass, newpass){
		pass = md5.digest(pass);
		if(that.savegame.password === pass){
			that.savegame.password = md5.digest(newpass);
			localStorage.setItem("player"+that.savegame.usernumber+"_password", that.savegame.password);
			return ERR_SUCCESS;//Worked
		}
		return ERR_WRONGPW;//Wrong pass
	}
	
	//Those calls are on a higher abstraction levels and can be safely used by dialog boxes:
	this.dbxcall_save = function(uname, pass){
		var result;
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
		
		var result = that.retrieve_savegame(uname, pass);
		if(result != ERR_SUCCESS){
			vis.error_dbx(result);
			return false;
		}
		
		return true;
	}
	
	this.dbxcall_chpass = function(pass, newpass){
		var result = that.change_password(pass, newpass);
		if(result != ERR_SUCCESS){
			vis.error_dbx(result);
			return false;
		}
		
		return true;
	}
	
	/*//////////////////////////////////////////////////////////////////////////////////////////////////////
	//ENTITY CLASS
	//Players, blocks, opponents. Even dummy block, everything of that is in the entity class.
	//////////////////////////////////////////////////////////////////////////////////////////////////////*/
	
	function CLASS_entity(a_id){
		//Public:
		this.id = a_id
		this.moving = false;
		this.moving_offset = {x: 0, y: 0};
		this.pushing = false;
		this.face_dir = DIR_DOWN;
		this.berti_id = -1;//Multiple bertis are possible, this makes the game engine much more flexible
		this.sees_berti = false;
		this.time_since_noise = 100;
		this.just_moved = false;
		this.gets_removed_in = -1;//Removal timer for doors
		
		this.can_push = false;
		if(this.id == 1 || this.id == 2 || this.id == 5 || this.id == 7){//Those are the guys who can push blocks, Berti, MENU Berti, light block, purple monster
			this.can_push = true;
		}
		this.pushable = false;
		if(this.id == 5 || this.id == 6){//Those are the guys who can be pushed, namely light block and heavy block
			this.pushable = true;
		}
		this.consumable = false;
		if(this.id == 4 || (this.id >= 13 && this.id <= 18)){//Those are the guys who are consumable, namely banana and the 6 keys
			this.consumable = true;
		}
		this.is_small = false;
		if(this.id == 1 || this.id == 2 || this.id == 7 || this.id == 10){//Those are small entities, Berti, MENU Berti, purple monster, green monster
			this.is_small = true;//This is a technical attribute. Small entities can go into occupied, moving places from all directions. Monsters can see through small entities
		}
		
		//Purely visual aspects here. No impact on gameplay logic
		this.animation_frame = -1;
		this.animation_delay = 0;
		
		this.fine_offset_x = 0;
		this.fine_offset_y = 0;
		//end visual
	}
	CLASS_entity.prototype.move_randomly = function(curr_x, curr_y){
		if(!this.moving){
			var tried_forward = false;
			var back_dir = game.opposite_dir(this.face_dir);
			var possibilities = new Array(DIR_UP, DIR_DOWN, DIR_LEFT, DIR_RIGHT);
			for(var i = 0; i < possibilities.length; i++){
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
				var selection = Math.floor(Math.random()*possibilities.length);
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
			//Here's the code if that dude can't go anywhere: (none)
		}
	}
	CLASS_entity.prototype.chase_berti = function(curr_x, curr_y){
		if(!this.moving){
			this.time_since_noise++;
			
			var closest_dist = LEV_DIMENSION_X + LEV_DIMENSION_Y + 1;
			var closest_berti = -1;
			
			for(var i = 0; i < game.berti_positions.length; i++){
				var face_right_direction = 
				(this.face_dir == DIR_DOWN && game.berti_positions[i].y >= curr_y) || 
				(this.face_dir == DIR_UP && game.berti_positions[i].y <= curr_y) || 
				(this.face_dir == DIR_LEFT && game.berti_positions[i].x <= curr_x) || 
				(this.face_dir == DIR_RIGHT && game.berti_positions[i].x >= curr_x);
				
				if(face_right_direction && game.can_see_tile(curr_x, curr_y, game.berti_positions[i].x, game.berti_positions[i].y)){
					var distance = Math.abs(game.berti_positions[i].x - curr_x) + Math.abs(game.berti_positions[i].y - curr_y);//Manhattan distance
					if(distance < closest_dist || (distance == closest_dist && Math.random() < 0.50)){
						closest_dist = distance;
						closest_berti = i;
					}
				}
			}
			
			if(closest_berti == -1 || Math.random() < 0.02){//Can't see berti OR he randomly gets distracted THEN Random search
				this.sees_berti = false;
				this.move_randomly(curr_x, curr_y);
			}else{//Chasing code here.
				if(!this.sees_berti){
					this.sees_berti = true;
					
					if(this.time_since_noise > Math.ceil(Math.random()*10)+3){
						this.time_since_noise = 0;
						if(this.id == 7){
							game.play_sound(2);
						}else if(this.id == 10){
							game.play_sound(3);
						}
					}
				}
				
				var diff_x = game.berti_positions[closest_berti].x - curr_x;
				var diff_y = game.berti_positions[closest_berti].y - curr_y;
				
				//THIS IS AN OPTIONAL FIX THAT MAKES THE GAME MUCH HARDER!
				var closest_berti_obj = game.level_array[game.berti_positions[closest_berti].x][game.berti_positions[closest_berti].y];
				
				if(closest_berti_obj.moving){
					var next_pos = game.dir_to_coords(game.berti_positions[closest_berti].x, game.berti_positions[closest_berti].y, closest_berti_obj.face_dir);
					if(Math.abs(curr_x - next_pos.x) + Math.abs(curr_y - next_pos.y) == 1){
						if(Math.abs(closest_berti_obj.moving_offset.x) + Math.abs(closest_berti_obj.moving_offset.x) >= 15)
						return;
					}
				}//END OF OPTIONAL FIX
				
				var dir1;
				var dir2;
				
				if(diff_x == 0){
					if(diff_y == 0){//This should NEVER happen.
						alert("001: Something went mighty wrong! Blame the programmer!");
						this.move_randomly(curr_x, curr_y);
						return;
					}else if(diff_y > 0){
						dir1 = dir2 = DIR_DOWN;
					}else{//diff_y < 0
						dir1 = dir2 = DIR_UP;
					}
				}else if(diff_x > 0){
					if(diff_y == 0){
						dir1 = dir2 = DIR_RIGHT;
					}else if(diff_y > 0){
						dir1 = DIR_RIGHT;
						dir2 = DIR_DOWN;
					}else{//diff_y < 0
						dir1 = DIR_RIGHT
						dir2 = DIR_UP;
					}
				}else{//diff_x < 0
					if(diff_y == 0){
						dir1 = dir2 = DIR_LEFT;
					}else if(diff_y > 0){
						dir1 = DIR_LEFT;
						dir2 = DIR_DOWN;
					}else{//diff_y < 0
						dir1 = DIR_LEFT
						dir2 = DIR_UP;
					}
				}
				
				if(dir1 != dir2){
					var total_distance = Math.abs(diff_x) + Math.abs(diff_y);
					var percentage_x = Math.abs(diff_x / total_distance);
					
					if(Math.random() >= percentage_x){
						var swapper = dir1;
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
		this.animation_delay++;//This is an important link between the game logic and animation timing.
		
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
					alert("002: Something went mighty wrong! Blame the programmer!");//This should never be executed
					break;
			}
			if(this.moving_offset.x <= -24 || this.moving_offset.x >= 24 || this.moving_offset.y <= -24 || this.moving_offset.y >= 24){
				game.move(curr_x, curr_y, this.face_dir);
				this.just_moved = true;
			}
		}
		
		if(this.gets_removed_in == 0){
			if(this.moving){
				var dst = game.dir_to_coords(curr_x, curr_y, this.face_dir);
				game.level_array[dst.x][dst.y] = new CLASS_entity(0);
			}
			game.level_array[curr_x][curr_y] = new CLASS_entity(0);
		}else if(this.gets_removed_in > 0){
			this.gets_removed_in -= 1;
			vis.update_animation(curr_x, curr_y);
		}
	}
	
	CLASS_entity.prototype.register_input = function(curr_x, curr_y){
		if(!this.moving){
			if(input.keys_down[37] || (!game.single_steps && game.walk_dir == DIR_LEFT)){
				if(game.walkable(curr_x, curr_y, DIR_LEFT)){
					game.start_move(curr_x, curr_y, DIR_LEFT);
				}
			}else if(input.keys_down[38] || (!game.single_steps && game.walk_dir == DIR_UP)){
				if(game.walkable(curr_x, curr_y, DIR_UP)){
					game.start_move(curr_x, curr_y, DIR_UP);
				}
			}else if(input.keys_down[39] || (!game.single_steps && game.walk_dir == DIR_RIGHT)){
				if(game.walkable(curr_x, curr_y, DIR_RIGHT)){
					game.start_move(curr_x, curr_y, DIR_RIGHT);
				}
			}else if(input.keys_down[40] || (!game.single_steps && game.walk_dir == DIR_DOWN)){
				if(game.walkable(curr_x, curr_y, DIR_DOWN)){
					game.start_move(curr_x, curr_y, DIR_DOWN);
				}
			}
		}
	}
	//After each update, this function gets called for (every) Berti to see if he was caught!
	CLASS_entity.prototype.check_enemy_proximity = function(curr_x, curr_y){
		var fine_x = curr_x*24 + this.moving_offset.x;
		var fine_y = curr_y*24 + this.moving_offset.y;
		
		var next_pos;
		if(this.moving){
			next_pos = game.dir_to_coords(curr_x, curr_y, this.face_dir);
		}else{
			next_pos = {x:-1,y:-1};
		}
		
		var adj_array = game.get_adjacent_tiles(curr_x, curr_y);
		for(var i = 0; i < adj_array.length; i++){
			if(game.level_array[adj_array[i].x][adj_array[i].y].id == 7 || game.level_array[adj_array[i].x][adj_array[i].y].id == 10){//If there's an opponent on this adjacent tile
			
				if(game.level_array[adj_array[i].x][adj_array[i].y].moving){//If the opponent is moving
					var enemy_np = game.dir_to_coords(adj_array[i].x, adj_array[i].y, game.level_array[adj_array[i].x][adj_array[i].y].face_dir);
					
					if(Math.abs(curr_x - enemy_np.x) == 1 && Math.abs(curr_y - enemy_np.y) == 1){//If the opponent's destination is diagonally AND
						if((game.level_array[enemy_np.x][curr_y].id != -1 && game.level_array[enemy_np.x][curr_y].id != 0 && (enemy_np.x != next_pos.x || curr_y != next_pos.y)) ||
							(game.level_array[curr_x][enemy_np.y].id != -1 && game.level_array[curr_x][enemy_np.y].id != 0 && (curr_x != next_pos.x || enemy_np.y != next_pos.y))){
							break;//Don't perform a proximity check for this particular foe.
						}
					}
				}
			
				if(Math.abs(curr_x - adj_array[i].x) == 1 && Math.abs(curr_y - adj_array[i].y) == 1){//If the opponent is diagonally AND
					if((game.level_array[adj_array[i].x][curr_y].id != -1 && game.level_array[adj_array[i].x][curr_y].id != 0 && (adj_array[i].x != next_pos.x || curr_y != next_pos.y)) ||
						(game.level_array[curr_x][adj_array[i].y].id != -1 && game.level_array[curr_x][adj_array[i].y].id != 0 && (curr_x != next_pos.x || adj_array[i].y != next_pos.y))){
						break;//Don't perform a proximity check for this particular foe.
					}
				}else if(this.moving){
					if((Math.abs(next_pos.x - adj_array[i].x) == 1 && Math.abs(next_pos.y - adj_array[i].y) == 1) &&
					((game.level_array[adj_array[i].x][next_pos.y].id != -1 && game.level_array[adj_array[i].x][next_pos.y].id != 0 && (adj_array[i].x != curr_x || next_pos.y != curr_y)) ||
					 (game.level_array[next_pos.x][adj_array[i].y].id != -1 && game.level_array[next_pos.x][adj_array[i].y].id != 0 && (next_pos.x != curr_x || adj_array[i].y != curr_y)))){
						break;//Don't perform a proximity check for this particular foe.
					}
				}
			
				var enemy_fine_x = adj_array[i].x*24 + game.level_array[adj_array[i].x][adj_array[i].y].moving_offset.x;
				var enemy_fine_y = adj_array[i].y*24 + game.level_array[adj_array[i].x][adj_array[i].y].moving_offset.y;
				
				//var dist = Math.sqrt(Math.pow(fine_x-enemy_fine_x, 2) + Math.pow(fine_y-enemy_fine_y, 2));//Pythagoras
				//dist <= 24+1//Not so good for this game
				
				if(Math.abs(fine_x-enemy_fine_x) <= 24 && Math.abs(fine_y-enemy_fine_y) <= 24){//Rectangular hit test.
					game.play_sound(1);
					game.wait_timer = LEV_STOP_DELAY*UPS;
					game.level_ended = 2;
					vis.update_all_animations();
					return;
				}
			}
		}
	}

	/*//////////////////////////////////////////////////////////////////////////////////////////////////////
	//END OF ENTITY CLASS
	//GAME CLASS
	//Core engine, entity class, game ending criteria and much more
	//////////////////////////////////////////////////////////////////////////////////////////////////////*/
	this.move_speed = 2;
	this.door_removal_delay = 4;
	
	this.initialized = false;
	this.wait_timer = INTRO_DURATION*UPS;
	this.paused = false;
	
	this.update_drawn = false;
	this.mode = 0;//0 is entry, 1 is menu and play
	this.level_number = 0;
	this.level_array = new Array();
	this.level_unlocked = 0;
	this.level_ended = 0;//0 is not ended. 1 is won. 2 is died.
	this.wow = true;//true is WOW!, false is Yeah!
	
	this.berti_positions;
	
	this.single_steps = true;
	this.walk_dir = DIR_NONE;
	
	this.steps_taken = 0;
	this.num_bananas = 0;
	
	this.last_updated = Date.now();
	this.delta_updated = Date.now();
	
	this.buttons_activated = new Array();
	this.buttons_activated[0] = this.buttons_activated[2] = false;
	this.buttons_activated[1] = true;
	
	this.sound = !DEBUG;
	
	this.load_level = function(lev_number){
		that.mode = 1;
	
		that.steps_taken = 0;
		that.num_bananas = 0;
		that.level_ended = 0;
		that.level_array = new Array();
		that.level_number = lev_number;
		that.wait_timer = LEV_START_DELAY*UPS;
		that.walk_dir = DIR_NONE;
		
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
		
		for(var i = 0; i < LEV_DIMENSION_X; i++){
			that.level_array[i] = new Array()
		}
		
		var berti_counter = 0;
		that.berti_positions = new Array();
		
		for(var y = 0; y < LEV_DIMENSION_Y; y++){
			for(var x = 0; x < LEV_DIMENSION_X; x++){
				that.level_array[x][y] = new CLASS_entity(res.levels[lev_number][x][y]);
				
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
		for(var y = 0; y < LEV_DIMENSION_Y; y++){
			for(var x = 0; x < LEV_DIMENSION_X; x++){
				if(that.level_array[x][y].id == id){
					that.level_array[x][y].gets_removed_in = that.door_removal_delay;
				}					
			}
		}
	}
	//Whether you can walk from a tile in a certain direction, boolean
	this.walkable = function(curr_x, curr_y, dir){
		
		var dst = that.dir_to_coords(curr_x, curr_y, dir);
		
		if(!this.is_in_bounds(dst.x, dst.y)){//Can't go out of boundaries
			return false;
		}
		
		if(that.level_array[dst.x][dst.y].id == 0){//Blank space is always walkable
			return true;
		}else if(!that.level_array[dst.x][dst.y].moving){
			if((that.level_array[curr_x][curr_y].id == 1 || that.level_array[curr_x][curr_y].id == 2) && that.level_array[dst.x][dst.y].consumable){//Berti and MENU Berti can pick up items.
				return true;
			}else{
				if(that.level_array[curr_x][curr_y].can_push == 1 && that.level_array[dst.x][dst.y].pushable == 1){
					return that.walkable(dst.x, dst.y, dir);
				}else{
					return false;
				}
			}
		}else if(that.level_array[dst.x][dst.y].face_dir == dir || (that.level_array[curr_x][curr_y].is_small && that.level_array[dst.x][dst.y].is_small)){//If the block is already moving away in the right direction
			return true;
		}else{
			return false;
		}
	}
	
	this.start_move = function(src_x, src_y, dir){
	
		var dst = that.dir_to_coords(src_x, src_y, dir);
		that.level_array[src_x][src_y].moving = true;
		that.level_array[src_x][src_y].face_dir = dir;
		
		if(that.level_array[src_x][src_y].id == 1){
			if(that.steps_taken < 99999){
				that.steps_taken++;
			}
		}
		
		if((that.level_array[src_x][src_y].id == 1 || that.level_array[src_x][src_y].id == 2) && that.level_array[dst.x][dst.y].consumable){
			//Om nom nom start
		}else if(that.level_array[dst.x][dst.y].moving){
			//It's moving out of place by itself, don't do anything
		}else if(that.level_array[dst.x][dst.y].id != 0){
			that.level_array[src_x][src_y].pushing = true;
			that.start_move(dst.x, dst.y, dir);
		}else{
			that.level_array[dst.x][dst.y] = new CLASS_entity(-1);//DUMMYBLOCK, invisible and blocks everything.
		}
		
		vis.update_animation(src_x,src_y);
	}
	
	this.move = function(src_x, src_y, dir){
	
		var dst = that.dir_to_coords(src_x, src_y, dir);
		that.level_array[src_x][src_y].moving = false;
		that.level_array[src_x][src_y].moving_offset = {x: 0, y: 0};
		that.level_array[src_x][src_y].pushing = false;
		
		if((that.level_array[src_x][src_y].id == 1 || that.level_array[src_x][src_y].id == 2) && that.level_array[dst.x][dst.y].consumable){
			switch (that.level_array[dst.x][dst.y].id) {//Done Om nom nom
				case 4:
					that.num_bananas--;
					if(that.num_bananas <= 0){
						that.wait_timer = LEV_STOP_DELAY*UPS;
						that.level_ended = 1;
						if(Math.random() < 0.50){
							game.wow = true;
							that.play_sound(10);//wow
						}else{
							game.wow = false;
							that.play_sound(11);//yeah
						}
						vis.update_all_animations();
					}else{
						that.play_sound(7);//Om nom nom
					}
					break;
				case 13:
					that.remove_door(19);
					break;
				case 14:
					that.remove_door(20);
					break;
				case 15:
					that.remove_door(21);
					break;
				case 16:
					that.remove_door(22);
					break;
				case 17:
					that.remove_door(23);
					break;
				case 18:
					that.remove_door(24);
					break;
				default:
					alert("003: Something went mighty wrong! Blame the programmer!");
					break;
			 }
		}else if(that.level_array[dst.x][dst.y].id != -1 && that.level_array[dst.x][dst.y].id != 0){
			that.move(dst.x, dst.y, dir);
		}else if(that.sound){//we need another logic to determine this correctly...DEBUG!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
			var dst2 = that.dir_to_coords(dst.x, dst.y, dir);
			if(	(that.level_array[src_x][src_y].id == 5 || that.level_array[src_x][src_y].id == 6) &&
				(!that.is_in_bounds(dst2.x, dst2.y) || that.level_array[dst2.x][dst2.y].id == 3)){
				that.play_sound(5);
			}
		}
		that.level_array[dst.x][dst.y] = that.level_array[src_x][src_y];
		
		var back_dir = that.opposite_dir(dir);
		var before_src = that.dir_to_coords(src_x, src_y, back_dir);
		
		var possibilities = new Array(DIR_UP, DIR_DOWN, DIR_LEFT, DIR_RIGHT);
		for(var i = 0; i < possibilities.length; i++){
			if(possibilities[i] == dir || possibilities[i] == back_dir){
				possibilities.splice(i, 1);
				i--;
			}
		}
		var before_src2 = that.dir_to_coords(src_x, src_y, possibilities[0]);
		var before_src3 = that.dir_to_coords(src_x, src_y, possibilities[1]);
		
		if(
		(that.is_in_bounds(before_src.x, before_src.y) && (that.level_array[before_src.x][before_src.y].moving && that.level_array[before_src.x][before_src.y].face_dir == dir)) ||
		that.level_array[dst.x][dst.y].is_small && ((that.is_in_bounds(before_src2.x, before_src2.y) && (that.level_array[before_src2.x][before_src2.y].is_small &&  that.level_array[before_src2.x][before_src2.y].moving && that.level_array[before_src2.x][before_src2.y].face_dir == possibilities[1])) ||
		(that.is_in_bounds(before_src3.x, before_src3.y) && (that.level_array[before_src3.x][before_src3.y].is_small &&  that.level_array[before_src3.x][before_src3.y].moving && that.level_array[before_src3.x][before_src3.y].face_dir == possibilities[0])))
		){
			that.level_array[src_x][src_y] = new CLASS_entity(-1);
		}else{		
			that.level_array[src_x][src_y] = new CLASS_entity(0);
		}
		
		if(that.level_array[dst.x][dst.y].id == 1){//Rectify the position of berti
			that.berti_positions[that.level_array[dst.x][dst.y].berti_id] = dst;
		}
	}
	
	this.dir_to_coords = function(curr_x, curr_y, dir){
		var new_x = curr_x;
		var new_y = curr_y;
		
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
	
	this.get_adjacent_tiles = function(tile_x, tile_y){//Potential for optimization
		//var result; = new Array();

		//if(tile_x-1 >= 0 && tile_y-1 >= 0 && tile_x+1 < LEV_DIMENSION_X && tile_y+1 < LEV_DIMENSION_Y){
		//	return new Array({x:tile_x-1, y:tile_y-1}, {x:tile_x-1, y:tile_y}, {x:tile_x-1, y:tile_y+1}, {x:tile_x, y:tile_y-1}, {x:tile_x, y:tile_y+1}, {x:tile_x+1, y:tile_y-1}, {x:tile_x+1, y:tile_y}, {x:tile_x+1, y:tile_y+1});
		//}else{
			var result = new Array();
			for(var i = -1; i <= 1; i++){
				for(var j = -1; j <= 1; j++){
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
	
	this.is_in_bounds = function(tile_x, tile_y){
		return (tile_x >= 0 && tile_y >= 0 && tile_x < LEV_DIMENSION_X && tile_y < LEV_DIMENSION_Y);
	}
	
	this.can_see_tile = function(eye_x, eye_y, tile_x, tile_y){
		var diff_x = tile_x - eye_x;
		var diff_y = tile_y - eye_y;
		
		var walk1_x;
		var walk1_y;
		var walk2_x;
		var walk2_y;
		
		if (diff_x==0){
			if(diff_y==0){
				return true;
			}else if(diff_y > 0){
				walk1_x = 0;
				walk1_y = 1;
				walk2_x = 0;
				walk2_y = 1;
			}else{//diff_y < 0
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
				}else{//diff_y < diff_x
					walk1_x = 1;
					walk1_y = 0;
					walk2_x = 1;
					walk2_y = 1;
				}
			}else{//diff_y < 0
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
				}else{//diff_y < diff_x
					walk1_x = 1;
					walk1_y = 0;
					walk2_x = 1;
					walk2_y = -1;
				}
			}
		}else{//diff_x < 0
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
				}else{//diff_y < diff_x
					walk1_x = -1;
					walk1_y = 0;
					walk2_x = -1;
					walk2_y = 1;
				}
			}else{//diff_y < 0
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
				}else{//diff_y < diff_x
					walk1_x = 0;
					walk1_y = -1;
					walk2_x = -1;
					walk2_y = -1;
				}
			}
		}
		
		
		var x_offset = 0;
		var y_offset = 0;
		var x_ratio1;
		var y_ratio1;
		var x_ratio2;
		var y_ratio2;
		var diff1;
		var diff2;
		
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
			if(game.level_array[eye_x + x_offset][eye_y + y_offset].id != 0 && game.level_array[eye_x + x_offset][eye_y + y_offset].id != -1 && !game.level_array[eye_x + x_offset][eye_y + y_offset].is_small){
				return false;
			}
		}
		//Code here is unreachable
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
		that.load_level(that.level_number+1);//Prevent overflow here
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
		if(!res.sounds[id].currentTime==0) res.sounds[id].currentTime=0;//Something is sometimes wrong here... DEBUG!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		res.sounds[id].play();
		//Useful commands
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
		vol = Math.pow(vol, 3);//LOGARITHMIC!
	
		for(var i = 0; i < res.sounds.length; i++){
			res.sounds[i].volume = vol;
		}
	}
	
	this.toggle_sound = function(){
		if(that.sound){
			that.sound = false;
		}else{
			that.sound = true;
		}
	}
	
	this.toggle_single_steps = function(){
		if(that.single_steps){
			that.walk_dir = DIR_NONE;
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
//VISUAL CLASS
//Everything in here is related to graphical output. Also, menus and dialog boxes
//////////////////////////////////////////////////////////////////////////////////////////////////////*/

function CLASS_visual(){
	var that = this;

	this.berti_blink_time = 0;
	this.last_rendered = 0;
	this.fps_delay = 0;
	this.static_ups = 0;
	this.static_fps = 0;
	
	this.buttons_pressed = new Array();
	this.buttons_pressed[0] = this.buttons_pressed[1] = this.buttons_pressed[2] = false;
	
	//Animations:
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
		for(var y = 0; y < LEV_DIMENSION_Y; y++){
			for(var x = 0; x < LEV_DIMENSION_X; x++){
				var block = game.level_array[x][y];
				switch (block.id) {
					case -1://DUMMY BLOCK (invisible). Prevents entities from moving to already occupied spaces.
						break;
					case 1://1: Berti (entry point)
					case 2://2: AUTO Menu Berti
						block.animation_frame = 59;
						break;
					case 3://Solid block
						block.animation_frame = 31;
						break;
					case 4://Banana
						block.animation_frame = 2;
						block.fine_offset_x = that.offset_banana_x;
						block.fine_offset_y = that.offset_banana_y;
						break;
					case 5://Light block
						block.animation_frame = 32;
						break;
					case 6://Heavy block
						block.animation_frame = 33;
						break;
					case 7://Purple monster (Monster 2)
						block.animation_frame = 111;
						break;
					case 8:
						//NOTHING
						break;
					case 9:
						//NOTHING
						break;
					case 10://Green monster (Monster 2)
						block.animation_frame = 147;
						break;
					case 11:
						//NOTHING
						break;
					case 12:
						//NOTHING
						break;
					case 13://Key 1
						block.animation_frame = 3;
						block.fine_offset_x = that.offset_key_x;
						block.fine_offset_y = that.offset_key_y;
						break;
					case 14://Key 2
						block.animation_frame = 4;
						block.fine_offset_x = that.offset_key_x;
						block.fine_offset_y = that.offset_key_y;
						break;
					case 15://Key 3
						block.animation_frame = 5;
						block.fine_offset_x = that.offset_key_x;
						block.fine_offset_y = that.offset_key_y;
						break;
					case 16://Key 4
						block.animation_frame = 6;
						block.fine_offset_x = that.offset_key_x;
						block.fine_offset_y = that.offset_key_y;
						break;
					case 17://Key 5
						block.animation_frame = 7;
						block.fine_offset_x = that.offset_key_x;
						block.fine_offset_y = that.offset_key_y;
						break;
					case 18://Key 6
						block.animation_frame = 8;
						block.fine_offset_x = that.offset_key_x;
						block.fine_offset_y = that.offset_key_y;
						break;
					case 19://Door 1
						block.animation_frame = 41;
						break;
					case 20://Door 2
						block.animation_frame = 44;
						break;
					case 21://Door 3
						block.animation_frame = 47;
						break;
					case 22://Door 4
						block.animation_frame = 50;
						break;
					case 23://Door 5
						block.animation_frame = 53;
						break;
					case 24://Door 6
						block.animation_frame = 56;
						break;
				
					default:
					//Uh oh, this part should never be executed
					break;
				}
			}
		}
	}
	
	this.update_animation = function(x, y){
		var block = game.level_array[x][y];
		switch (block.id) {
			case 1:
			case 2:
				block.fine_offset_x = 0;
				if(game.level_ended == 0){
					if(block.moving){
						block.fine_offset_x = -1;
						if(block.pushing){
							switch (block.face_dir) {
								case DIR_UP:
									if(block.animation_frame < 87 || block.animation_frame > 90){
										block.animation_frame = 87;
									}
									break;
								case DIR_DOWN:
									if(block.animation_frame < 91 || block.animation_frame > 94){
										block.animation_frame = 91;
									}
									break;
								case DIR_LEFT:
									if(block.animation_frame < 79 || block.animation_frame > 82){
										block.animation_frame = 79;
									}
									break;
								case DIR_RIGHT:
									if(block.animation_frame < 83 || block.animation_frame > 86){
										block.animation_frame = 83;
									}
									break;
								default:
									//This should never be executed
									break;
							}
						}else{
							switch (block.face_dir) {
								case DIR_UP:
									if(block.animation_frame < 71 || block.animation_frame > 74){
										block.animation_frame = 71;
									}
									break;
								case DIR_DOWN:
									if(block.animation_frame < 75 || block.animation_frame > 78){
										block.animation_frame = 75;
									}
									break;
								case DIR_LEFT:
									if(block.animation_frame < 63 || block.animation_frame > 66){
										block.animation_frame = 63;
									}
									break;
								case DIR_RIGHT:
									if(block.animation_frame < 67 || block.animation_frame > 70){
										block.animation_frame = 67;
									}
									break;
								default:
									//This should never be executed
									break;
							}
						}
					}else{
						block.animation_frame = 59;
					}
				}else if(game.level_ended == 1){
					block.animation_frame = 61;
				}else if(game.level_ended == 2){
					block.animation_frame = 62;
				}
				break;
			case 7://Purple monster (Monster 2)
				block.fine_offset_x = 0;
				if(game.level_ended == 0){
					if(block.moving){
						block.fine_offset_x = -1;
						if(block.pushing){
							switch (block.face_dir) {
								case DIR_UP:
									if(block.animation_frame < 139 || block.animation_frame > 142){
										block.animation_frame = 139;
									}
									break;
								case DIR_DOWN:
									if(block.animation_frame < 143 || block.animation_frame > 146){
										block.animation_frame = 143;
									}
									break;
								case DIR_LEFT:
									if(block.animation_frame < 131 || block.animation_frame > 134){
										block.animation_frame = 131;
									}
									break;
								case DIR_RIGHT:
									if(block.animation_frame < 135 || block.animation_frame > 138){
										block.animation_frame = 135;
									}
									break;
								default:
									//This should never be executed
									break;
							}
						}else{
							switch (block.face_dir) {
								case DIR_UP:
									if(block.animation_frame < 123 || block.animation_frame > 126){
										block.animation_frame = 123;
									}
									break;
								case DIR_DOWN:
									if(block.animation_frame < 127 || block.animation_frame > 130){
										block.animation_frame = 127;
									}
									break;
								case DIR_LEFT:
									if(block.animation_frame < 115 || block.animation_frame > 118){
										block.animation_frame = 115;
									}
									break;
								case DIR_RIGHT:
									if(block.animation_frame < 119 || block.animation_frame > 122){
										block.animation_frame = 119;
									}
									break;
								default:
									//This should never be executed
									break;
							}
						}
					}else{
						block.animation_frame = 111;
					}
				}else{
					block.animation_frame = 111;
				}
				break;
			case 10://Green monster (Monster 2)
				block.fine_offset_x = 0;
				if(game.level_ended == 0){
					if(block.moving){
						block.fine_offset_x = -1;
						switch (block.face_dir) {
							case DIR_UP:
								if(block.animation_frame < 159 || block.animation_frame > 162){
									block.animation_frame = 159;
								}
								break;
							case DIR_DOWN:
								if(block.animation_frame < 163 || block.animation_frame > 166){
									block.animation_frame = 163;
								}
								break;
							case DIR_LEFT:
								if(block.animation_frame < 151 || block.animation_frame > 154){
									block.animation_frame = 151;
								}
								break;
							case DIR_RIGHT:
								if(block.animation_frame < 155 || block.animation_frame > 158){
									block.animation_frame = 155;
								}
								break;
							default:
								//This should never be executed
								break;
						}
					}else{
						block.animation_frame = 147;
					}
				}else{
					block.animation_frame = 147;
				}
				break;
			case 19://Door 1
				if(block.gets_removed_in >= 0){
					block.animation_frame = 43-Math.floor(block.gets_removed_in/game.door_removal_delay*2);
				}
				break;
			case 20://Door 2
				if(block.gets_removed_in >= 0){
					block.animation_frame = 46-Math.floor(block.gets_removed_in/game.door_removal_delay*2);
				}
				break;
			case 21://Door 3
				if(block.gets_removed_in >= 0){
					block.animation_frame = 49-Math.floor(block.gets_removed_in/game.door_removal_delay*2);
				}
				break;
			case 22://Door 4
				if(block.gets_removed_in >= 0){
					block.animation_frame = 52-Math.floor(block.gets_removed_in/game.door_removal_delay*2);
				}
				break;
			case 23://Door 5
				if(block.gets_removed_in >= 0){
					block.animation_frame = 55-Math.floor(block.gets_removed_in/game.door_removal_delay*2);
				}
				break;
			case 24://Door 6
				if(block.gets_removed_in >= 0){
					block.animation_frame = 58-Math.floor(block.gets_removed_in/game.door_removal_delay*2);
				}
				break;
			default:
			break;
		}
	}
	
	this.update_all_animations = function(){
		for(var y = 0; y < LEV_DIMENSION_Y; y++){
			for(var x = 0; x < LEV_DIMENSION_X; x++){
				that.update_animation(x, y);
			}
		}
	}
	
	//Volume bar:
	this.vol_bar = new CLASS_vol_bar();
	
	function CLASS_vol_bar(){
		this.offset_x = 400;
		this.offset_y = 2;
		this.height = 17;
		this.width = 100;
		this.volume = DEFAULT_VOLUME;
		
		this.colour_1 = {r:0, g:255, b: 0};//Low volume colour: Green
		this.colour_2 = {r:255, g:0, b: 0};//High volume colour: Red
		this.colour_3 = {r:255, g:255, b: 255};//Rest of the volume bar: White
		this.colour_4 = {r:0, g:0, b: 0};//Inbetween bars: Black
		
		this.colour_5 = {r:50, g:50, b:50};//"off" colour, some grey...
	}
	
	
	//Menu stuff:
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
		
		for(var i = 0; i < a_submenu_list.length; i++){
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
		for(var i = 0; i < a_arr_options.length; i++){
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
		var tautology = function(){return true;};
	
		var arr_options1 = [
		{line:false, check:0, name:"New", hotkey:"F2", effect_id:0, on:tautology},
		{line:false, check:0, name:"Load Game...", hotkey:"", effect_id:1, on:function(){return HAS_STORAGE;}},
		{line:false, check:0, name:"Save", hotkey:"", effect_id:2, on:function(){return (game.savegame.progressed && HAS_STORAGE);}},
		{line:false, check:1, name:"Pause", hotkey:"", effect_id:3, on:tautology}
		];
		
		var arr_options2 = [
		{line:false, check:1, name:"Single steps", hotkey:"F5", effect_id:4, on:tautology},
		{line:false, check:1, name:"Sound", hotkey:"", effect_id:5, on:tautology},
		{line:true, check:0, name:"", hotkey:"", effect_id:-1, on:tautology},
		{line:false, check:0, name:"Load Level", hotkey:"", effect_id:6, on:function(){return HAS_STORAGE;}},
		{line:false, check:0, name:"Change Password", hotkey:"", effect_id:7, on:function(){return (game.savegame.username !== null && HAS_STORAGE);}},
		{line:true, check:0, name:"", hotkey:"", effect_id:-1, on:tautology},
		{line:false, check:0, name:"Charts", hotkey:"", effect_id:8, on:function(){return HAS_STORAGE;}}
		];
		
		var sub_m1 = new CLASS_submenu(43, 100, "Game", arr_options1);
		var sub_m2 = new CLASS_submenu(55, 150, "Options", arr_options2);
		
		that.menu1 = new CLASS_menu(1, 2, 17, [sub_m1, sub_m2]);
	}
	
	//Dialog box stuff:
	
	function add_button(img, pos_x, pos_y, click_effect){
		var btn = document.createElement("img");
		btn.src = res.images[img].src;
		btn.style.position = "absolute";
		btn.style.width = res.images[img].width+"px";
		btn.style.height = res.images[img].height+"px";
		btn.style.left = pos_x+"px";
		btn.style.top = pos_y+"px";
		
		btn.pressed = false;
		btn.onmousedown = function(evt){btn.src = res.images[img+1].src; btn.pressed = true; evt.preventDefault();};
		btn.onmouseup = function(evt){btn.src = res.images[img].src; btn.pressed = false;};
		btn.onmouseout = function(evt){btn.src = res.images[img].src;};
		btn.onmouseover = function(evt){if(btn.pressed && input.mouse_down) btn.src = res.images[img+1].src;};
		btn.onclick = click_effect;
		
		that.dbx.appendChild(btn);
		that.dbx.arr_btn[that.dbx.arr_btn.length] = btn;
	}
	
	function add_text(text, pos_x, pos_y){
		var txt = document.createElement("p");
		txt.innerHTML = text;
		txt.style.position = "absolute";
		txt.style.left = pos_x+"px";
		txt.style.top = pos_y+"px";
		txt.style.fontFamily = "Tahoma";
		txt.style.fontSize = "12px";
		that.dbx.appendChild(txt);
	}
	
	function add_number(a_num, pos_x, pos_y, width, height){
		var num = document.createElement("p");
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
		var txt = document.createElement("p");
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
		var txt = document.createElement("input");
		//txt.innerHTML = text;
		txt.type = type;
		txt.style.position = "absolute";
		txt.style.left = pos_x+"px";
		pos_y += 10;//Because of padding
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
		var select = document.createElement("select");
		select.size = 2;
		
		select.innerHTML = "";
		for(var i = 1; i < game.savegame.reached_level; i++){
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
		var ef = document.createElement("p");
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
		var err_string = "";
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
				add_title("Confirm");
			
				that.dbx.style.width = "256px";
				that.dbx.style.height = "154px";
				that.dbx.style.left = "50px";
				that.dbx.style.top = "70px";
				that.dbx.style.background = 'url('+res.images[173].src+')';
				
				var f_y;
				var f_n;
				var f_c = function(){that.close_dbx();};
				
				if(opt == 0){//"New Game"
					f_y = function(){that.open_dbx(DBX_SAVE, 1);};
					f_n = function(){game.clear_savegame();that.close_dbx();};
				}else if(opt == 1){//"Load Game" 
					f_y = function(){that.open_dbx(DBX_SAVE, 2);};
					f_n = function(){that.open_dbx(DBX_LOAD);};
				}
				
				that.dbx.enterfun = f_y;
				that.dbx.cancelfun = f_c;
				
				add_button(183, 20, 100, f_y);//yes
				add_button(179, 100, 100, f_n);//no
				add_button(177, 180, 100, f_c);//cancel
				
				add_text("Do you want to save the game?", 40, 35);
				break;
			case DBX_SAVE:
				add_title("Save game");
			
				that.dbx.style.width = "256px";
				that.dbx.style.height = "213px";
				that.dbx.style.left = "50px";
				that.dbx.style.top = "70px";
				that.dbx.style.background = 'url('+res.images[174].src+')';
				
				add_text("Player name:", 20, 35);
				add_input(100, 35, 120, 15, "text");
				add_text("Password:", 20, 60);
				add_input(100, 60, 120, 15, "password");
				
				var f_o;
				var f_c;
				
				if(opt == 0){//"Save game"
					f_o = function(){if(game.dbxcall_save(that.dbx.arr_input[0].value, that.dbx.arr_input[1].value)){that.close_dbx();}};
					f_c = function(){that.close_dbx();};
				}else if(opt == 1){//"New Game" -> yes, save 
					f_o = function(){if(game.dbxcall_save(that.dbx.arr_input[0].value, that.dbx.arr_input[1].value)){game.clear_savegame();that.close_dbx();}};
					f_c = function(){game.clear_savegame();that.close_dbx();};
				}else if(opt == 2){//"Load Game" -> yes, save
					f_o = function(){if(game.dbxcall_save(that.dbx.arr_input[0].value, that.dbx.arr_input[1].value)){that.open_dbx(DBX_LOAD);}};
					f_c = function(){that.open_dbx(DBX_LOAD);};
				}
				
				that.dbx.enterfun = f_o;
				that.dbx.cancelfun = f_c;
				
				add_button(181, 40, 160, f_o);//ok
				add_button(177, 160, 160, f_c);//cancel
				
				add_errfield(20, 85);
				break;
			case DBX_LOAD:
				add_title("Load game");
			
				that.dbx.style.width = "256px";
				that.dbx.style.height = "213px";
				that.dbx.style.left = "50px";
				that.dbx.style.top = "70px";
				that.dbx.style.background = 'url('+res.images[174].src+')';
				
				add_text("Player name:", 20, 35);
				add_input(100, 35, 120, 15, "text");
				add_text("Password:", 20, 60);
				add_input(100, 60, 120, 15, "password");
				
				var f_o = function(){if(game.dbxcall_load(that.dbx.arr_input[0].value, that.dbx.arr_input[1].value)){that.close_dbx();}};
				var f_c = function(){that.close_dbx();};
				
				that.dbx.enterfun = f_o;
				that.dbx.cancelfun = f_c;
				
				add_button(181, 40, 160, f_o);//ok
				add_button(177, 160, 160, f_c);//cancel
				
				add_errfield(20, 85);
				break;
			case DBX_CHPASS:
				add_title("Change password");
			
				that.dbx.style.width = "256px";
				that.dbx.style.height = "213px";
				that.dbx.style.left = "50px";
				that.dbx.style.top = "70px";
				that.dbx.style.background = 'url('+res.images[174].src+')';
				
				add_text("Old password:", 20, 35);
				add_input(100, 35, 120, 15, "password");
				add_text("New password:", 20, 60);
				add_input(100, 60, 120, 15, "password");
				
				var f_o = function(){if(game.dbxcall_chpass(that.dbx.arr_input[0].value, that.dbx.arr_input[1].value)){that.close_dbx();}};
				var f_c = function(){that.close_dbx();};
				
				that.dbx.enterfun = f_o;
				that.dbx.cancelfun = f_c;
				
				add_button(181, 40, 160, f_o);//ok
				add_button(177, 160, 160, f_c);//cancel
				
				add_errfield(20, 85);
				break;
			case DBX_LOADLVL:
				add_title("Load level");
			
				that.dbx.style.width = "197px";
				that.dbx.style.height = "273px";
				that.dbx.style.left = "50px";
				that.dbx.style.top = "70px";
				that.dbx.style.background = 'url('+res.images[175].src+')';
				
				add_lvlselect(20, 80, 158, 109);
				
				var f_o = function(){game.load_level(parseInt(that.dbx.lvlselect.value));that.close_dbx();};
				var f_c = function(){that.close_dbx();};
				
				that.dbx.enterfun = f_o;
				that.dbx.cancelfun = f_c;
				
				add_button(181, 25, 220, f_o);//ok
				add_button(177, 105, 220, f_c);//cancel
				
				add_text("Player name:", 20, 30);
				if(game.savegame.username === null){
					add_text("- none -", 100, 30);
				}else{
					add_text(game.savegame.username, 100, 30);
				}
				
				add_text("Level, steps:", 20, 50);
				
				
				break;
			case DBX_CHARTS:
				game.play_sound(4);
				
				add_title("Charts");
				
				that.dbx.style.width = "322px";
				that.dbx.style.height = "346px";
				that.dbx.style.left = "50px";
				that.dbx.style.top = "70px";
				that.dbx.style.background = 'url('+res.images[176].src+')';
				
				var uc = localStorage.getItem("user_count");
				var user_arr = new Array();
				
				for(var i = 0; i < uc; i++){
					var prefix = "player"+i+"_";
					var rl = parseInt(localStorage.getItem(prefix+"reached_level"));
					var st = 0;
					for(var j = 1; j < rl; j++){
						st += parseInt(localStorage.getItem(prefix+"steps_lv"+j));
					}
					user_arr[i] = {name: localStorage.getItem(prefix+"username"), reached: rl, steps: st}
				}
				
				user_arr.sort(function(a,b){return (b.reached-a.reached == 0)?(a.steps - b.steps):(b.reached-a.reached);});
				
				add_text("rank", 21, 37);
				add_text("level", 57, 37);
				add_text("steps", 100, 37);
				add_text("name", 150, 37);
				
				for(var i = 0; i < uc && i < 10; i++){
					add_number((i+1), 20, 65+18*i, 20, 20);
					add_number(user_arr[i].reached, 50, 65+18*i, 30, 20);
					add_number(user_arr[i].steps, 95, 65+18*i, 40, 20);
					add_text(user_arr[i].name, 155, 65+18*i);
				}
				
				var f_o = function(){that.close_dbx();};
				
				that.dbx.enterfun = f_o;
				that.dbx.cancelfun = f_o;
				
				add_button(181, 125, 300, f_o);//okay
				break;
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
		
		//IMPORTANT MEMORY LEAK PREVENTION
		for(var i = that.dbx.arr_btn.length-1; i >= 0; i--){
			that.dbx.arr_btn[i].pressed = null;
			that.dbx.arr_btn[i].onmousedown = null;
			that.dbx.arr_btn[i].onmouseup = null;
			that.dbx.arr_btn[i].onmouseout = null;
			that.dbx.arr_btn[i].onmouseover = null;
			that.dbx.arr_btn[i].onclick = null;
			that.dbx.arr_btn[i] = null;
		}
		that.dbx.arr_btn = new Array();
		
		for(var i = that.dbx.arr_input.length-1; i >= 0; i--){
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
//UPDATING PROCESS
//Here, the behaviour of the game is calculated, once per UPS (update per second)
//////////////////////////////////////////////////////////////////////////////////////////////////////*/
var update = function () {
	if(res.ready()){//All resources loaded
		if(!game.initialized){
			game.set_volume(DEFAULT_VOLUME);
			input.init();//Only init inputs after everything is loaded.
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
	
	var now = Date.now();
	game.delta_updated = now - game.last_updated;
	game.last_updated = now;
	
	game.update_drawn = false;
};

var update_entities = function(){

	//The player moves first at all times to ensure the best response time and remove directional quirks.
	for(var i = 0; i < game.berti_positions.length; i++){
		game.level_array[game.berti_positions[i].x][game.berti_positions[i].y].register_input(game.berti_positions[i].x, game.berti_positions[i].y);
	}

	//NPC logic and stop walking logic.
	for(var y = 0; y < LEV_DIMENSION_Y; y++){
		for(var x = 0; x < LEV_DIMENSION_X; x++){
			if(game.level_array[x][y].id == 2){//MENU Berti
				game.level_array[x][y].move_randomly(x,y);
			}else if(game.level_array[x][y].id == 7 || game.level_array[x][y].id == 10){//Purple and green monster
				game.level_array[x][y].chase_berti(x,y);
			}
			
			if(game.level_array[x][y].just_moved){
				game.level_array[x][y].just_moved = false;
				vis.update_animation(x,y);
			}
		}
	}

	//After calculating who moves where, the entities actually get updated.
	for(var y = 0; y < LEV_DIMENSION_Y; y++){
		for(var x = 0; x < LEV_DIMENSION_X; x++){
			game.level_array[x][y].update_entity(x,y);
		}
	}
	
	//Gameover condition check.
	for(var i = 0; i < game.berti_positions.length; i++){
		game.level_array[game.berti_positions[i].x][game.berti_positions[i].y].check_enemy_proximity(game.berti_positions[i].x, game.berti_positions[i].y);
	}
}

/*//////////////////////////////////////////////////////////////////////////////////////////////////////
//RENDERING PROCESS
//All visual things get handled here. Visual variables go into the object "vis".
//Runs with 60 FPS on average (depending on bowser).
//////////////////////////////////////////////////////////////////////////////////////////////////////*/

//Render scene
var render = function () {
	update();
	
	//CTX.fillStyle="red";
	//CTX.fillRect(0, 0, SCREEN_WIDTH, MENU_HEIGHT);
	//CTX.clearRect(0, MENU_HEIGHT, SCREEN_WIDTH, SCREEN_HEIGHT-MENU_HEIGHT);
	
	if (game.update_drawn) {//This prevents the game from rendering the same thing twice.
		window.requestAnimationFrame(render);
		return;
	}
	game.update_drawn = true;

	if (res.ready()) {
		CTX.drawImage(res.images[0], 0, 0);//Background
		CTX.drawImage(res.images[9], 22, 41);//Steps
		CTX.drawImage(res.images[10], 427, 41);//Ladder
		render_displays();
		render_buttons();
		if(game.mode == 0){//Title image
			CTX.drawImage(res.images[1], LEV_OFFSET_X+4, LEV_OFFSET_Y+4);
			
			CTX.fillStyle = "rgb(0, 0, 0)";
			CTX.font = "bold 12px Helvetica";
			CTX.textAlign = "left";
			CTX.textBaseline = "bottom";
			CTX.fillText("JavaScript remake by " + AUTHOR, 140, 234);
		}else if(game.mode == 1){
			render_field();
		}else if(game.mode == 2){//Won!
			CTX.drawImage(res.images[170], LEV_OFFSET_X+4, LEV_OFFSET_Y+4);
		}
		render_vol_bar();
		render_menu();
	}else{
		CTX.fillStyle = "rgb("+vis.light_grey.r+", "+vis.light_grey.g+", "+vis.light_grey.b+")";
		CTX.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);//Options box
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
	var now = Date.now();
	
	if(now - vis.fps_delay >= 250){
		var delta_rendered = now - vis.last_rendered;
		vis.static_ups = ((1000/game.delta_updated).toFixed(2));
		vis.static_fps = ((1000/delta_rendered).toFixed(2));
		
		vis.fps_delay = now;
	}
	
	CTX.fillStyle = "rgb(255, 0, 0)";
	CTX.font = "12px Helvetica";
	CTX.textAlign = "right";
	CTX.textBaseline = "bottom";
	CTX.fillText("UPS: " + vis.static_ups +" FPS:" + vis.static_fps + " ", SCREEN_WIDTH,SCREEN_HEIGHT);

	vis.last_rendered = now;
};

function render_menu(){
	var submenu_offset = 0;
	//The font is the same for the whole menu... Segoe UI is also nice
	CTX.font = "11px Tahoma";
	CTX.textAlign = "left";
	CTX.textBaseline = "top";
	
	for(var i = 0; i < vis.menu1.submenu_list.length; i++){
		var sm = vis.menu1.submenu_list[i];
		if(i == vis.menu1.submenu_open){
			CTX.fillStyle = "rgb("+vis.light_grey.r+", "+vis.light_grey.g+", "+vis.light_grey.b+")";
			CTX.fillRect(vis.menu1.offset_x + submenu_offset, vis.menu1.offset_y + vis.menu1.height + 1, sm.dd_width, sm.dd_height);//Options box
		
			CTX.fillStyle = "rgb("+vis.med_grey.r+", "+vis.med_grey.g+", "+vis.med_grey.b+")";
			CTX.fillRect(vis.menu1.offset_x + submenu_offset, vis.menu1.offset_y, sm.width, 1);
			CTX.fillRect(vis.menu1.offset_x + submenu_offset, vis.menu1.offset_y, 1, vis.menu1.height);
			CTX.fillRect(vis.menu1.offset_x + submenu_offset + sm.dd_width - 2, vis.menu1.offset_y + vis.menu1.height + 2, 1, sm.dd_height - 2);//Options box
			CTX.fillRect(vis.menu1.offset_x + submenu_offset + 1, vis.menu1.offset_y + vis.menu1.height + sm.dd_height - 1, sm.dd_width - 2, 1);//Options box
			
			CTX.fillStyle = "rgb("+vis.white.r+", "+vis.white.g+", "+vis.white.b+")";
			CTX.fillRect(vis.menu1.offset_x + submenu_offset, vis.menu1.offset_y + vis.menu1.height, sm.width, 1);
			CTX.fillRect(vis.menu1.offset_x + submenu_offset + sm.width - 1, vis.menu1.offset_y, 1, vis.menu1.height);
			CTX.fillRect(vis.menu1.offset_x + submenu_offset + 1, vis.menu1.offset_y + vis.menu1.height + 2, 1, sm.dd_height - 3);//Options box
			CTX.fillRect(vis.menu1.offset_x + submenu_offset + 1, vis.menu1.offset_y + vis.menu1.height + 2, sm.dd_width - 3, 1);//Options box
			
			CTX.fillStyle = "rgb("+vis.dark_grey.r+", "+vis.dark_grey.g+", "+vis.dark_grey.b+")";
			CTX.fillRect(vis.menu1.offset_x + submenu_offset + sm.dd_width - 1, vis.menu1.offset_y + vis.menu1.height + 1, 1, sm.dd_height);//Options box
			CTX.fillRect(vis.menu1.offset_x + submenu_offset, vis.menu1.offset_y + vis.menu1.height + sm.dd_height, sm.dd_width - 1, 1);//Options box
			
			//input.mouse_pos.x
			var option_offset = vis.menu1.offset_y + vis.menu1.height + 4;
			CTX.fillStyle = "rgb("+vis.black.r+", "+vis.black.g+", "+vis.black.b+")";
			
			for(var j = 0; j < sm.options.length; j++){
				var next_offset;
				var check_image = 171;
				
				if(sm.options[j].line){
					next_offset = option_offset + sm.offset_line;
					
					CTX.fillStyle = "rgb("+vis.med_grey.r+", "+vis.med_grey.g+", "+vis.med_grey.b+")";
					CTX.fillRect(vis.menu1.offset_x + submenu_offset + 3 , option_offset + 3, sm.dd_width - 6, 1);//Separator line
					CTX.fillStyle = "rgb("+vis.white.r+", "+vis.white.g+", "+vis.white.b+")";
					CTX.fillRect(vis.menu1.offset_x + submenu_offset + 3 , option_offset + 4, sm.dd_width - 6, 1);//Separator line
					
				}else{
					next_offset = option_offset + sm.offset_text;
				}
				
				if(!sm.options[j].line && input.mouse_pos.x > vis.menu1.offset_x + submenu_offset && input.mouse_pos.x < vis.menu1.offset_x + submenu_offset + sm.dd_width &&
				input.mouse_pos.y > option_offset && input.mouse_pos.y < next_offset){
					CTX.fillStyle = "rgb("+vis.blue.r+", "+vis.blue.g+", "+vis.blue.b+")";
					CTX.fillRect(vis.menu1.offset_x + submenu_offset + 3 , option_offset, sm.dd_width - 6, sm.offset_text);//Options box
					CTX.fillStyle = "rgb("+vis.white.r+", "+vis.white.g+", "+vis.white.b+")";
					
					check_image = 172;
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
						CTX.drawImage(res.images[check_image], vis.menu1.offset_x + submenu_offset + 6, option_offset + 6);//Background
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
	var vb = vis.vol_bar;
	var switcher = false;
	
	
	for(var i = 0; i < vb.width; i+= 1){
		if(switcher){
			switcher = false;
			CTX.fillStyle = "rgb("+vb.colour_4.r+", "+vb.colour_4.g+", "+vb.colour_4.b+")";
		}else{
			switcher = true;
			var ratio2 = i/vb.width;
			var line_height = Math.round(vb.height*ratio2);
		
			if(i < Math.ceil(vb.volume*vb.width)){
				if(game.sound){
					var ratio1 = 1-ratio2;
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
	render_field_subset(true);//Consumables in the background
	render_field_subset(false);//The rest in the foreground
	
	CTX.drawImage(res.images[0], 0, 391, 537, 4, 0, LEV_OFFSET_Y+24*LEV_DIMENSION_Y, 537, 4);//Bottom border covering blocks
	CTX.drawImage(res.images[0], 520, LEV_OFFSET_Y, 4, 391-LEV_OFFSET_Y, LEV_OFFSET_X+24*LEV_DIMENSION_X, LEV_OFFSET_Y, 4, 391-LEV_OFFSET_Y);//Right border covering blocks
	
	if(game.level_ended == 1){//Berti cheering, wow or yeah
		for(var i = 0; i < game.berti_positions.length; i++){
			if(game.wow){
				CTX.drawImage(res.images[168],
				LEV_OFFSET_X+24*game.berti_positions[i].x+game.level_array[game.berti_positions[i].x][game.berti_positions[i].y].moving_offset.x+vis.offset_wow_x,
				LEV_OFFSET_Y+24*game.berti_positions[i].y+game.level_array[game.berti_positions[i].x][game.berti_positions[i].y].moving_offset.y+vis.offset_wow_y);
			}else{
				CTX.drawImage(res.images[169],
				LEV_OFFSET_X+24*game.berti_positions[i].x+game.level_array[game.berti_positions[i].x][game.berti_positions[i].y].moving_offset.x+vis.offset_yeah_x,
				LEV_OFFSET_Y+24*game.berti_positions[i].y+game.level_array[game.berti_positions[i].x][game.berti_positions[i].y].moving_offset.y+vis.offset_yeah_y);
			}
		}
	}else if(game.level_ended == 2){//Berti dies in a pool of blood
		for(var i = 0; i < game.berti_positions.length; i++){
			CTX.drawImage(res.images[167],
			LEV_OFFSET_X+24*game.berti_positions[i].x+game.level_array[game.berti_positions[i].x][game.berti_positions[i].y].moving_offset.x+vis.offset_argl_x,
			LEV_OFFSET_Y+24*game.berti_positions[i].y+game.level_array[game.berti_positions[i].x][game.berti_positions[i].y].moving_offset.y+vis.offset_argl_y);
		}
	}
}
function render_field_subset(consumable){
	for(var y = 0; y < LEV_DIMENSION_Y; y++){
		for(var x = 0; x < LEV_DIMENSION_X; x++){
			var block = game.level_array[x][y];
			if(block.id != 0){//Empty space doesn't need to be rendered
				if(y > 0 && game.level_array[x][y-1].moving && game.level_array[x][y-1].face_dir == DIR_DOWN && game.level_array[x][y-1].consumable == consumable){
					render_block(x, y-1, RENDER_BOTTOM);
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
}
function render_block(x, y, render_option){
	var block = game.level_array[x][y];

	var offset_x = block.moving_offset.x;
	var offset_y = block.moving_offset.y;
	
	var needs_update = false;
	while(block.animation_delay >= ANIMATION_DURATION && !block.just_moved){
		block.animation_delay -= ANIMATION_DURATION;
		needs_update = true;
	}
	
	if(needs_update)
	switch (game.level_array[x][y].id) {
		/*case -1://DUMMY BLOCK (invisible). Prevents entities from moving to already occupied spaces.
			break;*/
		case 1://1: Berti
		case 2://2: AUTO Menu Berti
			if(block.animation_frame >= 63 && block.animation_frame < 66){
				block.animation_frame += 1;
			}else if(block.animation_frame == 66){
				block.animation_frame = 63;
			}else if(block.animation_frame >= 67 && block.animation_frame < 70){
				block.animation_frame += 1;
			}else if(block.animation_frame == 70){
				block.animation_frame = 67;
			}else if(block.animation_frame >= 71 && block.animation_frame < 74){
				block.animation_frame += 1;
			}else if(block.animation_frame == 74){
				block.animation_frame = 71;
			}else if(block.animation_frame >= 75 && block.animation_frame < 78){
				block.animation_frame += 1;
			}else if(block.animation_frame == 78){
				block.animation_frame = 75;
			}else if(block.animation_frame >= 79 && block.animation_frame < 82){
				block.animation_frame += 1;
			}else if(block.animation_frame == 82){
				block.animation_frame = 79;
			}else if(block.animation_frame >= 83 && block.animation_frame < 86){
				block.animation_frame += 1;
			}else if(block.animation_frame == 86){
				block.animation_frame = 83;
			}else if(block.animation_frame >= 87 && block.animation_frame < 90){
				block.animation_frame += 1;
			}else if(block.animation_frame == 90){
				block.animation_frame = 87;
			}else if(block.animation_frame >= 91 && block.animation_frame < 94){
				block.animation_frame += 1;
			}else if(block.animation_frame == 94){
				block.animation_frame = 91;
			}
			break;
		case 7://Purple monster (Monster 2)
			if(block.animation_frame >= 111 && block.animation_frame < 114){
				block.animation_frame += 1;
			}else if(block.animation_frame == 114){
				block.animation_frame = 111;
			}else if(block.animation_frame >= 115 && block.animation_frame < 118){
				block.animation_frame += 1;
			}else if(block.animation_frame == 118){
				block.animation_frame = 115;
			}else if(block.animation_frame >= 119 && block.animation_frame < 122){
				block.animation_frame += 1;
			}else if(block.animation_frame == 122){
				block.animation_frame = 119;
			}else if(block.animation_frame >= 123 && block.animation_frame < 126){
				block.animation_frame += 1;
			}else if(block.animation_frame == 126){
				block.animation_frame = 123;
			}else if(block.animation_frame >= 127 && block.animation_frame < 130){
				block.animation_frame += 1;
			}else if(block.animation_frame == 130){
				block.animation_frame = 127;
			}else if(block.animation_frame >= 131 && block.animation_frame < 134){
				block.animation_frame += 1;
			}else if(block.animation_frame == 134){
				block.animation_frame = 131;
			}else if(block.animation_frame >= 135 && block.animation_frame < 138){
				block.animation_frame += 1;
			}else if(block.animation_frame == 138){
				block.animation_frame = 135;
			}else if(block.animation_frame >= 139 && block.animation_frame < 142){
				block.animation_frame += 1;
			}else if(block.animation_frame == 142){
				block.animation_frame = 139;
			}else if(block.animation_frame >= 143 && block.animation_frame < 146){
				block.animation_frame += 1;
			}else if(block.animation_frame == 146){
				block.animation_frame = 143;
			}
			break;
		case 10://Green monster (Monster 2)
			if(block.animation_frame >= 147 && block.animation_frame < 150){
				block.animation_frame += 1;
			}else if(block.animation_frame == 150){
				block.animation_frame = 147;
			}else if(block.animation_frame >= 151 && block.animation_frame < 154){
				block.animation_frame += 1;
			}else if(block.animation_frame == 154){
				block.animation_frame = 151;
			}else if(block.animation_frame >= 155 && block.animation_frame < 158){
				block.animation_frame += 1;
			}else if(block.animation_frame == 158){
				block.animation_frame = 155;
			}else if(block.animation_frame >= 159 && block.animation_frame < 162){
				block.animation_frame += 1;
			}else if(block.animation_frame == 162){
				block.animation_frame = 159;
			}else if(block.animation_frame >= 163 && block.animation_frame < 166){
				block.animation_frame += 1;
			}else if(block.animation_frame == 166){
				block.animation_frame = 163;
			}
			break;
		default:
		break;
	}
	
	//drawImage reference: context.drawImage(img,sx,sy,swidth,sheight,x,y,width,height);
	if(block.animation_frame >= 0){
		if(render_option == RENDER_FULL){//Render the full block
			CTX.drawImage(res.images[block.animation_frame], LEV_OFFSET_X+24*x+offset_x+block.fine_offset_x, LEV_OFFSET_Y+24*y+offset_y+block.fine_offset_y);
		}else if(render_option == RENDER_TOP){//Render top
			if(block.face_dir == DIR_DOWN){
				CTX.drawImage(res.images[block.animation_frame], 0, 0, res.images[block.animation_frame].width, res.images[block.animation_frame].height-offset_y, LEV_OFFSET_X+24*x+offset_x+block.fine_offset_x, LEV_OFFSET_Y+24*y+offset_y+block.fine_offset_y, res.images[block.animation_frame].width, res.images[block.animation_frame].height-offset_y);
			}else if(block.face_dir == DIR_UP){
				CTX.drawImage(res.images[block.animation_frame], 0, 0, res.images[block.animation_frame].width, res.images[block.animation_frame].height-offset_y-24, LEV_OFFSET_X+24*x+offset_x+block.fine_offset_x, LEV_OFFSET_Y+24*y+offset_y+block.fine_offset_y, res.images[block.animation_frame].width, res.images[block.animation_frame].height-offset_y-24);
			}
		}else if(render_option == RENDER_BOTTOM){//Render bottom
			var imgsize_offset = res.images[block.animation_frame].height - 24;
		
			if(block.face_dir == DIR_DOWN){
				CTX.drawImage(res.images[block.animation_frame], 0, res.images[block.animation_frame].height-offset_y-imgsize_offset, res.images[block.animation_frame].width, offset_y+imgsize_offset, LEV_OFFSET_X+24*x+offset_x+block.fine_offset_x, LEV_OFFSET_Y+24*y+24+block.fine_offset_y, res.images[block.animation_frame].width, offset_y+imgsize_offset);
			}else if(block.face_dir == DIR_UP){
				CTX.drawImage(res.images[block.animation_frame], 0, -offset_y, res.images[block.animation_frame].width, res.images[block.animation_frame].height+offset_y, LEV_OFFSET_X+24*x+offset_x+block.fine_offset_x, LEV_OFFSET_Y+24*y+block.fine_offset_y, res.images[block.animation_frame].width, res.images[block.animation_frame].height+offset_y);
			}
		}
	}
}

function render_buttons(){
	var over_button = false;
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
			CTX.drawImage(res.images[26], 219, 35);//<< pressed
		}else{
			CTX.drawImage(res.images[23], 219, 35);//<< up
		}
	}else{
		CTX.drawImage(res.images[29], 219, 35);//<< disabled
	}
	
	if(vis.buttons_pressed[1]){
		CTX.drawImage(res.images[25], 253, 35);//Berti pressed
	}else{
		if(vis.berti_blink_time < 100){
			CTX.drawImage(res.images[22], 253, 35);//Berti up
			if(vis.berti_blink_time == 0){
				vis.berti_blink_time = 103;//Math.floor(100+(Math.random()*100)+1);
			}else{
				vis.berti_blink_time--;
			}
		}else{
			CTX.drawImage(res.images[28], 253, 35);//Berti up blink
			if(vis.berti_blink_time == 100){
				vis.berti_blink_time = Math.floor((Math.random()*95)+5);
			}else{
				vis.berti_blink_time--;
			}
		}
	}
	
	if(game.buttons_activated[2]){
		if(vis.buttons_pressed[2]){
			CTX.drawImage(res.images[27], 287, 35);//>> pressed
		}else{
			CTX.drawImage(res.images[24], 287, 35);//>> up
		}
	}else{
		CTX.drawImage(res.images[30], 287, 35);//>> disabled
	}

}

function render_displays(){
	var steps_string = game.steps_taken.toString();
	var steps_length = Math.min(steps_string.length-1, 4);

	for(var i = steps_length; i >= 0; i--){
		CTX.drawImage(res.images[11+parseInt(steps_string.charAt(i))], 101-(steps_length-i)*13, 41);
	}
	for(var i = steps_length+1; i < 5; i++){
		CTX.drawImage(res.images[21], 101-i*13, 41);
	}

	var level_string = game.level_number.toString();
	var level_length = Math.min(level_string.length-1, 4);

	for(var i = level_length; i >= 0; i--){
		CTX.drawImage(res.images[11+parseInt(level_string.charAt(i))], 506-(level_length-i)*13, 41);
	}
	for(var i = level_length+1; i < 5; i++){
		CTX.drawImage(res.images[21], 506-i*13, 41);
	}
}

//Use window.requestAnimationFrame, get rid of browser differences.
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

//setInterval(update, 1000/UPS);//Update thread

render();//Render thread