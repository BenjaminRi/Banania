//GLOBAL CONSTANTS
var UPS = 15;
var NUM_RESOURCES = 195;
var IMAGE_DIR = "images/";
var SOUND_DIR = "sound/";
var SCREEN_WIDTH = 537;
var SCREEN_HEIGHT = 408;
var LEV_OFFSET_X = 16;
var LEV_OFFSET_Y = 79;
var LEV_DIMENSION_X = 21;
var LEV_DIMENSION_Y = 13;
var MENU_HEIGHT = 20;
var INTRO_DURATION = 2;//6;//In seconds
var LEV_START_DELAY = 1;//2;
var LEV_STOP_DELAY = 1//2;

var DIR_NONE = -1;
var DIR_UP = 0;
var DIR_LEFT = 1;
var DIR_DOWN = 2;
var DIR_RIGHT = 3;

//Canvas creation
var CANVAS = document.createElement("canvas");
var CTX = CANVAS.getContext("2d");
CANVAS.width = SCREEN_WIDTH;
CANVAS.height = SCREEN_HEIGHT;
CANVAS.className = "canv";
document.body.appendChild(CANVAS);

//GLOBAL VARIABLES

//Game
var game = new CLASS_game();

//Resources
var res = new CLASS_resources();
res.load();

//Input mechanics
var input = new CLASS_input();
input.init();

//Visual
var vis = new CLASS_visual();

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

		for(var i = 0; i < 9; i++){//From 31 to 40 stones
			that.images[31+i] = new Image();
			that.images[31+i].onload = on_loaded();
			that.images[31+i].src = IMAGE_DIR+"stone_"+i+".png";
		}

		for(var i = 0; i < 3; i++){//From 41 to 58 doors
			for(var j = 0; j < 6; j++){
				that.images[41+6*i+j] = new Image();
				that.images[41+6*i+j].onload = on_loaded();
				that.images[41+6*i+j].src = IMAGE_DIR+"doors_"+i+"-"+j+".png";
			}
		}

		for(var i = 0; i < 4; i++){//From 59 to 110 player
			for(var j = 0; j < 13; j++){
				that.images[59+13*i+j] = new Image();
				that.images[59+13*i+j].onload = on_loaded();
				that.images[59+13*i+j].src = IMAGE_DIR+"player_"+i+"-"+j+".png";
			}
		}

		for(var i = 0; i < 4; i++){//From 111 to 146 monster 1(purple)
			for(var j = 0; j < 9; j++){
				that.images[111+9*i+j] = new Image();
				that.images[111+9*i+j].onload = on_loaded();
				that.images[111+9*i+j].src = IMAGE_DIR+"monster1_"+i+"-"+j+".png";
			}
		}

		for(var i = 0; i < 4; i++){//From 147 to 166 monster 2(green)
			for(var j = 0; j < 5; j++){
				that.images[147+5*i+j] = new Image();
				that.images[147+5*i+j].onload = on_loaded();
				that.images[147+5*i+j].src = IMAGE_DIR+"monster2_"+i+"-"+j+".png";
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

		for(var i = 0; i < 6; i++){//From 171 to 176 v button
			that.images[171+i] = new Image();
			that.images[171+i].onload = on_loaded();
			that.images[171+i].src = IMAGE_DIR+"v"+(i+1)+".png";
		}

		for(var i = 0; i < 6; i++){//From 177 to 182 x button
			that.images[177+i] = new Image();
			that.images[177+i].onload = on_loaded();
			that.images[177+i].src = IMAGE_DIR+"x"+(i+1)+".png";
		}
		////////////////////////////////////////////////////////
		// Sounds: /////////////////////////////////////////////
		////////////////////////////////////////////////////////

		that.sounds[0] = new Audio(SOUND_DIR+"about.wav");
		that.sounds[0].onloadeddata = on_loaded();

		that.sounds[1] = new Audio(SOUND_DIR+"argl.wav");
		that.sounds[1].onloadeddata = on_loaded();

		that.sounds[2] = new Audio(SOUND_DIR+"attack1.wav");
		that.sounds[2].onloadeddata = on_loaded();

		that.sounds[3] = new Audio(SOUND_DIR+"attack2.wav");
		that.sounds[3].onloadeddata = on_loaded();

		that.sounds[4] = new Audio(SOUND_DIR+"chart.wav");
		that.sounds[4].onloadeddata = on_loaded();

		that.sounds[5] = new Audio(SOUND_DIR+"click.wav");
		that.sounds[5].onloadeddata = on_loaded();

		that.sounds[6] = new Audio(SOUND_DIR+"gameend.wav");
		that.sounds[6].onloadeddata = on_loaded();

		that.sounds[7] = new Audio(SOUND_DIR+"getpoint.wav");
		that.sounds[7].onloadeddata = on_loaded();

		that.sounds[8] = new Audio(SOUND_DIR+"newplane.wav");
		that.sounds[8].onloadeddata = on_loaded();

		that.sounds[9] = new Audio(SOUND_DIR+"opendoor.wav");
		that.sounds[9].onloadeddata = on_loaded();

		that.sounds[10] = new Audio(SOUND_DIR+"wow.wav");
		that.sounds[10].onloadeddata = on_loaded();

		that.sounds[11] = new Audio(SOUND_DIR+"yeah.wav");
		that.sounds[11].onloadeddata = on_loaded();

		////////////////////////////////////////////////////////
		// Level: //////////////////////////////////////////////
		////////////////////////////////////////////////////////

		//levels is now loaded externally
		if(that.levels !== null){
			on_loaded();
		}
	}
}

function CLASS_input(){
//Private:
	var that = this;
	
	function handle_keydown(evt) {
		that.keys_down[evt.keyCode] = true;
		if(input.keys_down[37]){
			game.walk_dir = DIR_LEFT;
		}else if(input.keys_down[38]){
			game.walk_dir = DIR_UP;
		}else if(input.keys_down[39]){
			game.walk_dir = DIR_RIGHT;
		}else if(input.keys_down[40]){
			game.walk_dir = DIR_DOWN;
		}
	}

	function handle_keyup(evt) {
		delete that.keys_down[evt.keyCode];
	}
		
	function handle_mousemove(evt) {
		var rect = CANVAS.getBoundingClientRect();
		var style = window.getComputedStyle(CANVAS);
		that.mouse_pos =  {
			x: Math.round(evt.clientX - rect.left - parseInt(style.getPropertyValue('border-left-width'))),
			y: Math.round(evt.clientY - rect.top - parseInt(style.getPropertyValue('border-top-width')))
		};
	};

	function handle_mousedown(evt){
		evt.preventDefault();//Prevents from selecting the canvas
		that.mouse_down = true;
		that.mouse_lastclick = {x: that.mouse_pos.x, y: that.mouse_pos.y};
		
		if(that.mouse_lastclick.y >= 35 && that.mouse_lastclick.y <= 65){
			if(that.mouse_lastclick.x >= 219 && that.mouse_lastclick.x <= 249){
				input.lastclick_button = 0;
			}else if(that.mouse_lastclick.x >= 253 && that.mouse_lastclick.x <= 283){
				input.lastclick_button = 1;
			}else if(that.mouse_lastclick.x >= 287 && that.mouse_lastclick.x <= 317){
				input.lastclick_button = 2;
			}
		}
	};

	function handle_mouseup(evt){
		if(that.mouse_pos.y >= 35 && that.mouse_pos.y <= 65){
			if(that.mouse_pos.x >= 219 && that.mouse_pos.x <= 249 && input.lastclick_button == 0 && game.buttons_activated[0]){
				//alert("<<");
				game.prev_level();
			}else if(that.mouse_pos.x >= 253 && that.mouse_pos.x <= 283 && input.lastclick_button == 1 && game.buttons_activated[1]){
				//alert("Berti");
				game.reset_level();
			}else if(that.mouse_pos.x >= 287 && that.mouse_pos.x <= 317 && input.lastclick_button == 2 && game.buttons_activated[2]){
				//alert(">>");
				game.next_level();
			}
		}
		input.lastclick_button = -1;
		that.mouse_down = false;
	};

	function handle_mouseout(evt){
		//handle_mouseup(evt);
	};
	
//Public:
	this.keys_down = new Array();
	this.mouse_pos = {x: 0, y: 0};
	this.mouse_lastclick = {x: 0, y: 0};
	this.mouse_down = false;
	this.lastclick_button = -1;
	
	this.init = function(){
		// Handle keyboard controls
		document.addEventListener('keydown', function (evt) {
			handle_keydown(evt);
		}, false);

		document.addEventListener('keyup', function (evt) {
			handle_keyup(evt);
		}, false);

		//Handle mouse controls
		CANVAS.addEventListener('mousemove', function(evt) {
			handle_mousemove(evt);
		}, false);
			
		CANVAS.addEventListener('mousedown', function(evt) {
			handle_mousedown(evt);
		}, false);

		CANVAS.addEventListener('mouseup', function(evt) {
			handle_mouseup(evt);
		}, false);

		CANVAS.addEventListener('mouseout', function(evt) {
			handle_mouseout(evt);
		}, false);
	}
}

function CLASS_game(){
//Private:
	var that = this;
	
	function CLASS_entity(a_id){
	//Private:
		var that = this;
	//Public:
		this.id = a_id
		this.moving = false;
		this.moving_offset = {x: 0, y: 0};
		this.pushing = false;
		this.face_dir = DIR_DOWN;
		this.animation_frame = 0;
		this.berti_id = -1;//Multiple bertis are possible, this makes the game engine much more flexible
		this.sees_berti = false;
		
		this.can_push = 0;
		if(this.id == 1 || this.id == 2 || this.id == 5 || this.id == 7){//Those are the guys who can push blocks, Berti, MENU Berti, light block, purple monster
			this.can_push = 1;
		}
		this.pushable = 0;
		if(this.id == 5 || this.id == 6){//Those are the guys who can be pushed, namely light block and heavy block
			this.pushable = 1;
		}
		this.consumable = 0;
		if(this.id == 4 || (this.id >= 13 && this.id <= 18)){//Those are the guys who are consumable, namely banana and the 6 keys
			this.consumable = 1;
		}
		this.is_small = 0;
		if(this.id == 1 || this.id == 2 || this.id == 7 || this.id == 10){//Those are small entities, Berti, MENU Berti, purple monster, green monster
			this.is_small = 1;//This is a technical attribute. Small entities can go into occupied, moving places from all directions.
		}
		
		this.move_randomly = function(curr_x, curr_y){
			if(that.moving == false){
			
				var tried_forward = false;
				var back_dir = game.opposite_dir(that.face_dir);
				var possibilities = new Array(DIR_UP, DIR_DOWN, DIR_LEFT, DIR_RIGHT);
				for(var i = 0; i < possibilities.length; i++){
					if(possibilities[i] == that.face_dir || possibilities[i] == back_dir){
						possibilities.splice(i, 1);
						i--;
					}
				}
				
				if(Math.random() < 0.80){
					if(game.walkable(curr_x, curr_y, that.face_dir)){
						game.start_move(curr_x, curr_y, that.face_dir);
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
					if(game.walkable(curr_x, curr_y, that.face_dir)){
						game.start_move(curr_x, curr_y, that.face_dir);
						return;
					}
				}
				
				if(game.walkable(curr_x, curr_y, back_dir)){
					game.start_move(curr_x, curr_y, back_dir);
					return;
				}
				
				//Here's the code if that dude can't go anywhere
			}
		}
		
		this.chase_berti = function(curr_x, curr_y){
			if(that.moving == false){
				var closest_dist = LEV_DIMENSION_X + LEV_DIMENSION_Y + 1;
				var closest_berti = -1;
				
				for(var i = 0; i < game.berti_positions.length; i++){
					var face_right_direction = 
					(that.face_dir == DIR_DOWN && game.berti_positions[i].y >= curr_y) || 
					(that.face_dir == DIR_UP && game.berti_positions[i].y <= curr_y) || 
					(that.face_dir == DIR_LEFT && game.berti_positions[i].x <= curr_x) || 
					(that.face_dir == DIR_RIGHT && game.berti_positions[i].x >= curr_x);
					
					if(face_right_direction && game.can_see_tile(curr_x, curr_y, game.berti_positions[i].x, game.berti_positions[i].y)){
						var distance = Math.abs(game.berti_positions[i].x - curr_x) + Math.abs(game.berti_positions[i].y - curr_y);//Manhattan distance
						if(distance < closest_dist || (distance == closest_dist && Math.random() < 0.50)){
							closest_dist = distance;
							closest_berti = i;
						}
					}
				}
				
				if(closest_berti == -1){//Can't see berti; Random search
					that.sees_berti = false;
					that.move_randomly(curr_x, curr_y);
				}else{//Chasing code here.
					if(!that.sees_berti){
						that.sees_berti = true;
						if(that.id == 7){
							game.play_sound(2);
						}else if(that.id == 10){
							game.play_sound(3);
						}
					}
					var diff_x = game.berti_positions[closest_berti].x - curr_x;
					var diff_y = game.berti_positions[closest_berti].y - curr_y;
					
					/*if(Math.abs(diff_x)+Math.abs(diff_y) <= 1){
						if(Math.abs(game.level_array[game.berti_positions[closest_berti].x][game.berti_positions[closest_berti].y].moving_offset.x)+
						Math.abs(game.level_array[game.berti_positions[closest_berti].x][game.berti_positions[closest_berti].y].moving_offset.x) == 0){
							game.play_sound(1);
							game.wait_timer = LEV_STOP_DELAY*UPS;
							game.level_ended = 2;
							return;
						}
					}*/
					
					var dir1;
					var dir2;
					
					if(diff_x == 0){
						if(diff_y == 0){//This should NEVER happen.
							that.move_randomly(curr_x, curr_y);
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
							that.move_randomly(curr_x, curr_y);
						}
					}else{
						if(game.walkable(curr_x, curr_y, dir1)){
							game.start_move(curr_x, curr_y, dir1);
						}else{
							that.move_randomly(curr_x, curr_y);
						}
					}
					
				}
			}
		}
		
		this.update_entity = function(curr_x, curr_y){
			if(that.moving){
				switch (that.face_dir) {
					case DIR_UP:
						that.moving_offset.y -= game.move_speed;
						break;
					case DIR_DOWN:
						that.moving_offset.y += game.move_speed;
						break;
					case DIR_LEFT:
						that.moving_offset.x -= game.move_speed;
						break;
					case DIR_RIGHT:
						that.moving_offset.x += game.move_speed;
						break;
					default:
						//This should never be executed
						break;
				}
				//if(Math.abs(that.moving_offset.x) + Math.abs(that.moving_offset.y) >= 24){
				if(that.moving_offset.x <= -24 || that.moving_offset.x >= 24 || that.moving_offset.y <= -24 || that.moving_offset.y >= 24){
					game.move(curr_x, curr_y, that.face_dir);
					//alert(game.can_see_tile(curr_x, curr_y, 0,0));
				}
			}
		}
		
		this.register_input = function(curr_x, curr_y){
			if(!that.moving){
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
		
		this.check_enemy_proximity = function(curr_x, curr_y){
			var fine_x = curr_x*24 + game.level_array[curr_x][curr_y].moving_offset.x;
			var fine_y = curr_y*24 + game.level_array[curr_x][curr_y].moving_offset.y;
			
			var adj_array = game.get_adjacent_tiles(curr_x, curr_y);
			for(var i = 0; i < adj_array.length; i++){
				if(game.level_array[adj_array[i].x][adj_array[i].y].id == 7 || game.level_array[adj_array[i].x][adj_array[i].y].id == 10){
					var enemy_fine_x = adj_array[i].x*24 + game.level_array[adj_array[i].x][adj_array[i].y].moving_offset.x;
					var enemy_fine_y = adj_array[i].y*24 + game.level_array[adj_array[i].x][adj_array[i].y].moving_offset.y;
					
					var dist = Math.sqrt(Math.pow(fine_x-enemy_fine_x, 2) + Math.pow(fine_y-enemy_fine_y, 2));//Pythagoras

					if(dist <= 24+1){
						game.play_sound(1);
						game.wait_timer = LEV_STOP_DELAY*UPS;
						game.level_ended = 2;
						return;
					}
				}
			}
		}

	}
///////////////////////////////////END ENTITY
//Public:

	this.move_speed = 4;
	
	this.intro_played = false;
	this.wait_timer = INTRO_DURATION*UPS;
	
	this.mode = 0;//0 is entry, 1 is menu and play
	this.level_number = 0;
	this.level_array = new Array();
	this.level_unlocked = 50;//DEBUG!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	this.level_ended = 0;//0 is not ended. 1 is won. 2 is died.
	
	this.berti_positions;
	
	this.single_steps = true;
	this.walk_dir = DIR_NONE;
	
	this.steps_taken = 0;
	this.num_bananas = 0;
	
	this.last_updated = Date.now();
	this.delta_updated = Date.now();
	
	this.buttons_pressed = new Array();
	this.buttons_pressed[0] = this.buttons_pressed[1] = this.buttons_pressed[2] = false;
	this.buttons_activated = new Array();
	this.buttons_activated[0] = this.buttons_activated[2] = false;
	this.buttons_activated[1] = true;
	
	this.sound = true;
	
	this.load_level = function(lev_number){
		that.steps_taken = 0;
		that.num_bananas = 0;
		that.level_ended = 0;
		that.level_array = new Array();
		that.level_number = lev_number;
		that.wait_timer = LEV_START_DELAY*UPS;
		
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
		if(berti_counter > 0){
			that.play_sound(8);
		}
	}
	
	this.remove_door = function(id){
		that.play_sound(9);
		for(var y = 0; y < LEV_DIMENSION_Y; y++){
			for(var x = 0; x < LEV_DIMENSION_X; x++){
				if(that.level_array[x][y].id == id){
					that.level_array[x][y] = new CLASS_entity(0);
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
		}else if(that.level_array[dst.x][dst.y].moving == false){
			if((that.level_array[curr_x][curr_y].id == 1 || that.level_array[curr_x][curr_y].id == 2) && that.level_array[dst.x][dst.y].consumable == 1){//Berti and MENU Berti can pick up items.
				return true;
			}else{
				if(that.level_array[curr_x][curr_y].can_push == 1 && that.level_array[dst.x][dst.y].pushable == 1){
					return that.walkable(dst.x, dst.y, dir);
				}else{
					return false;
				}
			}
		}else if(that.level_array[dst.x][dst.y].face_dir == dir){//If the block is already moving away in the right direction
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
			that.steps_taken++;
		}
		
		if((that.level_array[src_x][src_y].id == 1 || that.level_array[src_x][src_y].id == 2) && that.level_array[dst.x][dst.y].consumable == 1){
			//Om nom nom start
		}else if(that.level_array[dst.x][dst.y].moving == true){
			//It's moving out of place by itself, don't do anything
		}else if(that.level_array[dst.x][dst.y].id != 0){
			that.level_array[src_x][src_y].pushing = true;
			that.start_move(dst.x, dst.y, dir);
		}else{
			that.level_array[dst.x][dst.y] = new CLASS_entity(-1);//DUMMYBLOCK, invisible and blocks everything.
		}
	}
	
	this.move = function(src_x, src_y, dir){
	
		var dst = that.dir_to_coords(src_x, src_y, dir);
		that.level_array[src_x][src_y].moving = false;
		that.level_array[src_x][src_y].moving_offset = {x: 0, y: 0};
		that.level_array[src_x][src_y].pushing = false;
		
		if((that.level_array[src_x][src_y].id == 1 || that.level_array[src_x][src_y].id == 2) && that.level_array[dst.x][dst.y].consumable == 1){
			switch (that.level_array[dst.x][dst.y].id) {//Done Om nom nom
				case 4:
					that.play_sound(7);
					that.num_bananas--;
					if(that.num_bananas <= 0){
						//game.level_number++;//DEBUG!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
						//game.load_level(game.level_number);
						that.wait_timer = LEV_STOP_DELAY*UPS;
						that.level_ended = 1;
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
					break;
			 }
		}else if(that.level_array[dst.x][dst.y].id != -1 && that.level_array[dst.x][dst.y].id != 0){
			that.move(dst.x, dst.y, dir);
		}else if(that.sound){
			var dst2 = that.dir_to_coords(dst.x, dst.y, dir);
			if(	(that.level_array[src_x][src_y].id == 5 || that.level_array[src_x][src_y].id == 6) &&
				(!that.is_in_bounds(dst2.x, dst2.y) || that.level_array[dst2.x][dst2.y].id == 3)){
				that.play_sound(5);
			}
		}
		that.level_array[dst.x][dst.y] = that.level_array[src_x][src_y];
		
		before_src = that.dir_to_coords(src_x, src_y, that.opposite_dir(dir));
		
		if(that.is_in_bounds(before_src.x, before_src.y) && (that.level_array[before_src.x][before_src.y].moving == true && that.level_array[before_src.x][before_src.y].face_dir == dir)){
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
	
	this.get_adjacent_tiles = function(tile_x, tile_y){
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
			if(game.level_array[eye_x + x_offset][eye_y + y_offset].id != 0 && game.level_array[eye_x + x_offset][eye_y + y_offset].id != -1){
				return false;
			}
			//game.level_array[eye_x + x_offset][eye_y + y_offset].id = 4;//Debug
		}
		//Code here is unreachable
	}
	
	this.prev_level = function(){
		if(that.level_number >= 1){
			that.load_level(that.level_number-1);
		}
	}
	
	this.next_level = function(){//DEBUG!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		that.load_level(that.level_number+1);//Prevent overflow here
		if(that.level_number > that.level_unlocked){
			that.level_unlocked = that.level_number;
		}
	}
	
	this.reset_level = function(){
		if(that.mode == 0){
			that.mode = 1;
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
		if(!res.sounds[id].currentTime==0) res.sounds[id].currentTime=0;
		res.sounds[id].play();
		//Useful commands
		//audioElement.pause();
		//audioElement.volume=0;
		//audioElement.src;
		//audioElement.duration;
		//myAudio.addEventListener('ended', function() {}, false);
	}
}

function CLASS_visual(){
	this.berti_blink_time = 0;
	this.last_rendered = 0;
	this.fps_delay = 0;
	this.static_ups = 0;
	this.static_fps = 0;
}


/*//////////////////////////////////////////////////////////////////////////////////////////////////////
//UPDATING PROCESS
//Here, the behaviour of the game is calculated, once per UPS (update per second)
//////////////////////////////////////////////////////////////////////////////////////////////////////*/

var update = function () {
	if(res.ready()){
		if(game.mode == 0){
			if(!game.intro_played){
				game.play_sound(0);
				game.intro_played = true;
			}
			game.wait_timer--;
			if(game.wait_timer <= 0){
				game.load_level(0);
				game.mode = 1;
			}
		}else if(game.mode == 1){
			if(game.wait_timer <= 0){
				if(game.level_ended == 0){
					update_entities();
				}else if(game.level_ended == 1){
					game.next_level();
				}else if(game.level_ended == 2){
					game.reset_level();
				}
			}else{
				game.wait_timer--;
			}
		}
	}
	var now = Date.now();
	game.delta_updated = now - game.last_updated;
	game.last_updated = now;
};

var update_entities = function(){
	
	for(var y = 0; y < LEV_DIMENSION_Y; y++){
		for(var x = 0; x < LEV_DIMENSION_X; x++){
			if(game.level_array[x][y].id == 1){//Berti
				game.level_array[x][y].register_input(x,y);
				game.level_array[x][y].check_enemy_proximity(x,y);
			}else if(game.level_array[x][y].id == 2){//MENU Berti
				game.level_array[x][y].move_randomly(x,y);
			}else if(game.level_array[x][y].id == 7 || game.level_array[x][y].id == 10){//Purple and green monster
				game.level_array[x][y].chase_berti(x,y);
			}
		}
	}
	for(var y = 0; y < LEV_DIMENSION_Y; y++){
		for(var x = 0; x < LEV_DIMENSION_X; x++){
			game.level_array[x][y].update_entity(x,y);
		}
	}
}

/*//////////////////////////////////////////////////////////////////////////////////////////////////////
//RENDERING PROCESS
//All visual things get handled here. Visual variables go into the object "vis".
//Runs with 60 FPS on average (depending on bowser).
//////////////////////////////////////////////////////////////////////////////////////////////////////*/

//Render scene
var render = function () {
	//CTX.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);//This is unnecessary since we paint over the whole screen.
	if (res.ready()) {
		CTX.drawImage(res.images[0], 0, MENU_HEIGHT);//Background
		CTX.drawImage(res.images[9], 22, 41);//Steps
		CTX.drawImage(res.images[10], 427, 41);//Ladder
		render_displays();
		render_buttons();
		if(game.mode == 0){
			CTX.drawImage(res.images[1], LEV_OFFSET_X+4, LEV_OFFSET_Y+4);
		}else if(game.mode == 1){
			render_field();
			CTX.drawImage(res.images[0], 0, 371, 537, 4, 0, LEV_OFFSET_Y+24*LEV_DIMENSION_Y, 537, 4);//Bottom border covering blocks
			CTX.drawImage(res.images[0], 520, LEV_OFFSET_Y-MENU_HEIGHT, 4, 388-LEV_OFFSET_Y, LEV_OFFSET_X+24*LEV_DIMENSION_X, LEV_OFFSET_Y, 4, 388-LEV_OFFSET_Y);//Right border covering blocks
		}
	}else{
		CTX.fillStyle = "rgb(0, 0, 0)";
		CTX.font = "36px Helvetica";
		CTX.textAlign = "center";
		CTX.textBaseline = "middle";
		CTX.fillText("Loading...", SCREEN_WIDTH/2,SCREEN_HEIGHT/2);
	}
	
	render_fps();
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
function render_field(){
	//for(var x_n_y = 0; x_n_y < LEV_DIMENSION_X+LEV_DIMENSION_Y; x_n_y++){
		//for(var y = 0; y < Math.min(LEV_DIMENSION_Y, x_n_y); y++){
			//var x = x_n_y - y;

	for(var y = 0; y < LEV_DIMENSION_Y; y++){
		for(var x = 0; x < LEV_DIMENSION_X; x++){
			if(game.level_array[x][y].id == 0){
				//Empty space, do nothing as of now
			}else{
				var offset_x = game.level_array[x][y].moving_offset.x;
				var offset_y = game.level_array[x][y].moving_offset.y;
				switch (game.level_array[x][y].id) {
					case -1:
						//CTX.drawImage(res.images[3], LEV_OFFSET_X+3+24*x+offset_x, LEV_OFFSET_Y+4+24*y+offset_y);
							//DUMMY BLOCK (invisible). Prevents entities from moving to already occupied spaces.
						break;
					case 1:
						CTX.drawImage(res.images[59], LEV_OFFSET_X+24*x+offset_x, LEV_OFFSET_Y+24*y+offset_y);//Berti (entry point)
						break;
					case 2:
						CTX.drawImage(res.images[59], LEV_OFFSET_X+24*x+offset_x, LEV_OFFSET_Y+24*y+offset_y);//AUTO Menu Berti
						break;
					case 3:
						CTX.drawImage(res.images[31], LEV_OFFSET_X+24*x+offset_x, LEV_OFFSET_Y+24*y+offset_y);//Solid block
						break;
					case 4:
						CTX.drawImage(res.images[2], LEV_OFFSET_X+4+24*x+offset_x, LEV_OFFSET_Y+4+24*y+offset_y);//Banana
						break;
					case 5:
						CTX.drawImage(res.images[32], LEV_OFFSET_X+24*x+offset_x, LEV_OFFSET_Y+24*y+offset_y);//Light block
						break;
					case 6:
						CTX.drawImage(res.images[33], LEV_OFFSET_X+24*x+offset_x, LEV_OFFSET_Y+24*y+offset_y);//Heavy block
						break;
					case 7:
						CTX.drawImage(res.images[111], LEV_OFFSET_X+24*x+offset_x, LEV_OFFSET_Y+24*y+offset_y);//Purple monster (Monster 2)
						break;
					case 8:
						//NOTHING
						break;
					case 9:
						//NOTHING
						break;
					case 10:
						CTX.drawImage(res.images[147], LEV_OFFSET_X+24*x+offset_x, LEV_OFFSET_Y+24*y+offset_y);//Green monster (Monster 2)
						break;
					case 11:
						//NOTHING
						break;
					case 12:
						//NOTHING
						break;
					case 13:
						CTX.drawImage(res.images[3], LEV_OFFSET_X+3+24*x+offset_x, LEV_OFFSET_Y+4+24*y+offset_y);//Key 1
						break;
					case 14:
						CTX.drawImage(res.images[4], LEV_OFFSET_X+3+24*x+offset_x, LEV_OFFSET_Y+4+24*y+offset_y);//Key 2
						break;
					case 15:
						CTX.drawImage(res.images[5], LEV_OFFSET_X+3+24*x+offset_x, LEV_OFFSET_Y+4+24*y+offset_y);//Key 3
						break;
					case 16:
						CTX.drawImage(res.images[6], LEV_OFFSET_X+3+24*x+offset_x, LEV_OFFSET_Y+4+24*y+offset_y);//Key 4
						break;
					case 17:
						CTX.drawImage(res.images[7], LEV_OFFSET_X+3+24*x+offset_x, LEV_OFFSET_Y+4+24*y+offset_y);//Key 5
						break;
					case 18:
						CTX.drawImage(res.images[8], LEV_OFFSET_X+3+24*x+offset_x, LEV_OFFSET_Y+4+24*y+offset_y);//Key 6
						break;
					case 19:
						CTX.drawImage(res.images[34], LEV_OFFSET_X+24*x+offset_x, LEV_OFFSET_Y+24*y+offset_y);//Door 1
						break;
					case 20:
						CTX.drawImage(res.images[35], LEV_OFFSET_X+24*x+offset_x, LEV_OFFSET_Y+24*y+offset_y);//Door 2
						break;
					case 21:
						CTX.drawImage(res.images[36], LEV_OFFSET_X+24*x+offset_x, LEV_OFFSET_Y+24*y+offset_y);//Door 3
						break;
					case 22:
						CTX.drawImage(res.images[37], LEV_OFFSET_X+24*x+offset_x, LEV_OFFSET_Y+24*y+offset_y);//Door 4
						break;
					case 23:
						CTX.drawImage(res.images[38], LEV_OFFSET_X+24*x+offset_x, LEV_OFFSET_Y+24*y+offset_y);//Door 5
						break;
					case 24:
						CTX.drawImage(res.images[39], LEV_OFFSET_X+24*x+offset_x, LEV_OFFSET_Y+24*y+offset_y);//Door 6
						break;
				
					default:
					//Uh oh, this part should never be executed
					break;
				}
			}
		}
	}
}

function render_buttons(){
	var over_button = false;
	if(input.mouse_down){
		if(input.mouse_pos.y >= 35 && input.mouse_pos.y <= 65){
			if(input.mouse_pos.x >= 219 && input.mouse_pos.x <= 249 && input.lastclick_button == 0){
				game.buttons_pressed[0] = true;
				over_button = true;
			}else if(input.mouse_pos.x >= 253 && input.mouse_pos.x <= 283 && input.lastclick_button == 1){
				game.buttons_pressed[1] = true;
				over_button = true;
			}else if(input.mouse_pos.x >= 287 && input.mouse_pos.x <= 317 && input.lastclick_button == 2){
				game.buttons_pressed[2] = true;
				over_button = true;
			}
		}
	}
	if(!over_button){
		game.buttons_pressed[0] = game.buttons_pressed[1] = game.buttons_pressed[2] = false;
	}
	
	if(game.buttons_activated[0]){
		if(game.buttons_pressed[0]){
			CTX.drawImage(res.images[26], 219, 35);//<< pressed
		}else{
			CTX.drawImage(res.images[23], 219, 35);//<< up
		}
	}else{
		CTX.drawImage(res.images[29], 219, 35);//<< disabled
	}
	
	if(game.buttons_pressed[1]){
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
		if(game.buttons_pressed[2]){
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

setInterval(function() {
  update();
}, 1000/UPS);
window.requestAnimationFrame(render);
//render();