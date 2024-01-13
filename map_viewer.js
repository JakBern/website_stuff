// ===== CLASSES =====

function Vec2(x, y) {
    this.x = x;
    this.y = y;
    this.sqrdDist = function(vec2) {
        return ((this.x - vec2.x) * (this.x - vec2.x)) + ((this.y - vec2.y) * (this.y - vec2.y));
    }
}

function Vec3(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.scale = function(a) {
        return new Vec3(this.x * a, this.y * a, this.z * a);
    }
    this.plus = function(vec3) {
        return new Vec3(this.x + vec3.x, this.y + vec3.y, this.z + vec3.z);
    };
    this.minus = function(vec3) {
        return new Vec3(this.x - vec3.x, this.y - vec3.y, this.z - vec3.z);
    };
}

function Multicell(start, end, element, type) {
    this.start = start;
    this.end = end;
    this.cell = element;
    this.type = type;
}

function Tile(char, name = null, bg_color = null, char_color = null, tint = new Tint(null, null), extra_data_arr = null){
    this.char = char;
    if (name === null) {
        this.name = char;
    }
    else {
        this.name = name;
    }
    this.bg_color = bg_color;
    this.char_color = char_color;
    this.tint = tint;
    this.extra_data = [];
    if (extra_data_arr !== null) {
        this.extra_data = extra_data_arr;
    }
}

function clone_tile(tile) {
    return new Tile(tile.char, tile.name, tile.bg_color, tile.char_color, new Tint(tile.tint.bg_color, tile.tint.char_color, tile.extra_data.map((x) => x)));
}

function tiles_equal(tile1, tile2) {
    if (tile1.char != tile2.char) {
        return false;
    }
    if (tile1.bg_color != tile2.bg_color) {
        return false;
    }
    if (tile1.char_color != tile2.char_color) {
        return false;
    }
    if (tile1.tint.bg_color != tile2.tint.bg_color && !(tile1.tint.bg_color === tile2.tint.bg_color)) {
        return false;
    }
    if (tile1.tint.char_color != tile2.tint.char_color && !(tile1.tint.char_color === tile2.tint.char_color)) {
        return false;
    }
    if (tile1.extra_data.length != tile2.extra_data.length) {
        return false;
    }
    for (let i = 0; i < tile1.extra_data.length; i++) {
        if (tile1.extra_data[i] != tile2.extra_data[i]) {
            return false;
        }
    }
    return true;
}

function Tint(bg_color, char_color) {
    this.bg_color = bg_color;
    this.char_color = char_color;
}

function TileAndDisplay(tile, char, bg_color, char_color) {
    this.tile = tile;
    this.char = char;
    this.bg_color = bg_color;
    this.char_color = char_color;
}

function DisplayFragment(char, bg_color, char_color) {
    this.char = char;
    this.bg_color = bg_color;
    this.char_color = char_color;
}

function HistoryFragment(x, y, from, to) {
    this.x = x;
    this.y = y;
    this.from = from;
    this.to = to;
}

// ===== CLASSES =====


// ===== ENUMS =====

const tool = {
    select: 0,
    pencil: 1,
    brush: 2,
    rect: 3,
    circle: 4,
    line: 5,
    curve: 6,
    fill: 7,
    zoom: 8,
    color_dropper: 9,
    char_dropper: 10,
    tile_dropper: 11
};

const using_color_cell = {
    none: 0,
    bg: 1,
    char: 2
};

// ===== ENUMS =====


// ===== OBJECTS =====

const using = {
    color_cell: using_color_cell.none,
    tool: 0,
    char: "a",
    tile: new Tile("a"),
    char_color: "rgb(0, 0, 0)",
    bg_color: "rgb(255, 255, 255)",
    bg_color_cell: document.getElementById("UsedBGColor"),
    char_color_cell: document.getElementById("UsedCharColor"),
    char_cell: document.getElementById("UsedChar")
};

const selected = {
    tile: null,
    char: " ",
    char_color: "rgb(0, 0, 0)",
    bg_color: "rgb(255, 255, 255)",
    bg_color_cell: document.getElementById("SelectedBGColor"),
    char_color_cell: document.getElementById("SelectedCharColor"),
    char_cell: document.getElementById("SelectedChar")
};

// ===== OBJECTS =====


// ===== INIT_OBJECTS =====

using.bg_color_cell.style.backgroundColor = using.bg_color;
using.char_color_cell.style.backgroundColor = using.char_color;
using.char_cell.innerHTML = "a";

selected.bg_color_cell.style.backgroundColor = selected.bg_color;
selected.char_color_cell.style.backgroundColor = selected.char_color;
selected.char_cell.innerHTML = "x";

// ===== INIT_OBJECTS =====


// ===== MAPS =====

const click_tool_function_map = [
    select_tool_click,
    pencil_tool_click,
    brush_tool_click,
    rect_tool_click,
    circle_tool_click,
    line_tool_click,
    curve_tool_click,
    fill_tool_click,
    zoom_tool_click,
    color_dropper_tool_click,
    char_dropper_tool_click,
    tile_dropper_tool_click
];

// ===== MAPS =====


// ===== GLOBALS =====

const frame = document.getElementById("game_frame");
let root = document.querySelector(':root');
const canvas = {
    display_arr: [],
    tile_arr: []
};
let canvas_height = 0;
let canvas_width = 0;
let canvas_cols = 128;
let canvas_rows = 128;
let font_size = 0;
let w_h_ratio = canvas_cols / canvas_rows;
let palette_length = 12;

let color_palette_container = document.getElementById("color_palette_container");
const color_palette_arr = [];
const loaded_tileset = [];

const color_palette_color_labels = ["red", "orange", "yellow", "green", "blue", "purple", "brown", "grey", "custom"];
const current_custom_palette = [];
let current_palette = "custom";

const custom_palette_user_set_swatches = [];
let custom_palette_selected_swatch = null;
let text_file_download_url = null;
const swatch_pairs = [];

const undo_stack = [];
const redo_stack = [];
const temp_draw_buff = [];
const stroke_buff = [];
let performing_stroke = false;
let left_canvas_while_performing_stroke = false;

// ===== GLOBALS =====


// ===== MATH_FUNCS ======

const clamp = (num, min, max) => Math.min(Math.max(num, min), max)

// ===== MATH_FUNCS ======


// ===== FILE_IO_FUNCTIONS =====

function read_file_text(file, callback) {

    let reader = new FileReader();
  
    reader.readAsText(file);
  
    reader.onload = function() {
        callback(reader.result);
    };
  
    reader.onerror = function() {
        alert("Error reading uploaded file");
        callback(null);
    };
};

function set_text_file_url(text) {
    var data = new Blob([text], {type: 'text/plain'});

    if (text_file_download_url !== null) {
      window.URL.revokeObjectURL(textFile);
    }

    text_file_download_url = window.URL.createObjectURL(data);

    return;
};


// ===== FILE_IO_FUNCTIONS =====


// ===== KEYDOWN_FUNCTIONS =====

function handle_global_keydown(e) {
    if (e.target.matches("input")) {
        return;
    }

    if (e.ctrlKey) {
        if (e.key == "z") {
            perform_undo();
            return;
        }
        if (e.key == "y") {
            perform_redo();
            return;
        }

    }
    
    else {
        switch (e.key) {
            case "s":
                set_using_tool(tool.select);
                break;
            case "p":
                set_using_tool(tool.pencil);
                break;
            case "b":
                set_using_tool(tool.brush);
                break;
            case "r":
                set_using_tool(tool.rect);
                break;
            case "c":
                set_using_tool(tool.circle);
                break;
            case "l":
                set_using_tool(tool.line);
                break;
            case "v":
                set_using_tool(tool.curve);
                break;
            case "f":
                set_using_tool(tool.fill);
                break;
            case "z":
                set_using_tool(tool.zoom);
                break;
            case "q":
                set_using_tool(tool.color_dropper);
                break;
            case "w":
                set_using_tool(tool.char_dropper);
                break;
            case "e":
                set_using_tool(tool.tile_dropper);
                break;
            case "a":
                toggle_using_bg_color_cell();
                break;
            case "d":
                toggle_using_char_color_cell();
                break;
        }
    }
}


// ===== KEYDOWN_FUNCTIONS =====


// ===== WINDOW_AND_CANVAS_FUNCTIONS =====

function set_frame_size() {
    let win_width = window.innerWidth;
    let win_height = window.innerHeight;
    if (win_width * 0.5 >= win_height) {
        canvas_width = canvas_height = win_height;
    }
    else {
        canvas_width = canvas_height = win_width * 0.5;
    }
    font_size = (canvas_width / canvas_cols);
    frame.style.fontSize = font_size * 0.8 + "px";
    root.style.setProperty('--cell_size', font_size * 0.99 + "px");
}

function get_tile_coords_closest_to_point(x, y) {
    let point = new Vec2(x, y);
    let top_left = canvas.display_arr[0][0].getBoundingClientRect();
    top_left = new Vec2(top_left.x, top_left.y);
    let bottom_right = canvas.display_arr[canvas_rows - 1][canvas_cols - 1].getBoundingClientRect();
    bottom_right = new Vec2(bottom_right.right, bottom_right.bottom);
    point.x = clamp(point.x, top_left.x, bottom_right.x);
    point.y = clamp(point.y, top_left.y, bottom_right.y);
    let span_x = bottom_right.x - top_left.x;
    let span_y = bottom_right.y - top_left.y;
    let cursor_span_x = point.x - top_left.x;
    let cursor_span_y = point.y - top_left.y;
    let closest_x = Math.ceil((cursor_span_x / span_x) * canvas_rows) - 1;
    let closest_y = Math.ceil((cursor_span_y / span_y) * canvas_cols) - 1;
    let closest_vec = new Vec2(closest_x, closest_y);
    return closest_vec;
}

// ===== WINDOW_AND_CANVAS_FUNCTIONS =====


// ===== UNDO_REDO_FUNCTIONS =====

function redo_action(action) {
    for (let i = 0; i < action.length; i++) {
        canvas_draw_display(action[i].x, action[i].y, action[i].to.char, action[i].to.bg_color, action[i].to.char_color);
        canvas_draw_tile(action[i].x, action[i].y, action[i].to.tile);
    }
}

function undo_action(action) {
    for (let i = action.length - 1; i >=0; i--) {
        canvas_draw_display(action[i].x, action[i].y, action[i].from.char, action[i].from.bg_color, action[i].from.char_color);
        canvas_draw_tile(action[i].x, action[i].y, action[i].from.tile);
    }
}

function perform_undo() {
    if (undo_stack.length == 0) {
        return;
    }
    let action = undo_stack.pop();
    undo_action(action);
    redo_stack.push(action);
}

function perform_redo() {
    if (redo_stack.length == 0) {
        return;
    }
    let action = redo_stack.pop();
    redo_action(action);
    undo_stack.push(action);
}

// ===== UNDO_REDO_FUNCTIONS =====


// ===== BASIC_DRAWING_FUNCTIONS =====

function canvas_draw_temp(x, y, char, bg_color, char_color) {
    let from = new DisplayFragment(canvas.display_arr[y][x].innerHTML,
            canvas.display_arr[y][x].backgroundColor,
            canvas.display_arr[y][x].color );
    let to = new DisplayFragment(char, bg_color, char_color);
    let action = new HistoryFragment(x, y, from, to);
    canvas.display_arr[y][x].innerHTML = char;
    canvas.display_arr[y][x].style.color = char_color;
    canvas.display_arr[y][x].style.backgroundColor = bg_color;
    temp_draw_buff.push(action);
}

function remove_temp_drawing() {
    for (let i = 0; i < temp_draw_buff.length; i++) {
        canvas_draw_display(temp_draw_buff[i].x, 
            temp_draw_buff[i].y, 
            temp_draw_buff[i].from.char, 
            temp_draw_buff[i].from.bg_color, 
            temp_draw_buff[i].from.char_color);
    }
    temp_draw_buff.length = 0;
}

function canvas_draw_display(x, y, char, bg_color, char_color) {
    canvas.display_arr[y][x].innerHTML = char;
    canvas.display_arr[y][x].style.color = char_color;
    canvas.display_arr[y][x].style.backgroundColor = bg_color;
}

function canvas_draw_tile(x, y, tile) {
    canvas.tile_arr[y][x] = tile;
}

function begin_stroke() {
    performing_stroke = true;
    stroke_buff.length = 0;
    redo_stack.length = 0;
}

function add_to_stroke(x, y) {
    let from = new TileAndDisplay(canvas.tile_arr[y][x], 
        canvas.display_arr[y][x].innerHTML,
        canvas.display_arr[y][x].style.backgroundColor,
        canvas.display_arr[y][x].style.color);
    let to = new TileAndDisplay(using.tile, using.char, using.bg_color, using.char_color);
    canvas_draw_display(x, y, using.char, using.bg_color, using.char_color);
    canvas_draw_tile(x, y, using.tile);
    let action = new HistoryFragment(x, y, from, to);
    stroke_buff.push(action);
}

function stroke_from_arr(arr){
    for (let i = 0; i < arr.length; i++) {
        add_to_stroke(arr[i].x, arr[i].y);
    }
}

function end_stroke() {
    performing_stroke = false;
    let stroke_buff_copy = stroke_buff.map((x) => x);
    if (undo_stack.length <= 48) {
        undo_stack.push(stroke_buff_copy);
    }
    else {
        undo_stack.shift();
        undo_stack.push(stroke_buff_copy);
    }
    stroke_buff.length = 0;
}

// ===== BASIC_DRAWING_FUNCTIONS =====


// ===== LINE_AND_SHAPE_FUNCTIONS =====

function make_line_from_points(x0, y0, x1, y1) {
    let line_points = [];

    let dx = Math.abs(x1 - x0);
    let sx = x0 < x1 ? 1 : -1;
    let dy = -Math.abs(y1 - y0);
    let sy = y0 < y1 ? 1 : -1;
    let error = dx + dy;
    
    while (true) {
        line_points.push(new Vec2(x0, y0));
        if (x0 == x1 && y0 == y1) break;
        let e2 = 2 * error;
        if (e2 >= dy) {
            if (x0 == x1) break;
            error = error + dy;
            x0 = x0 + sx;
        }
        if (e2 <= dx) {
            if (y0 == y1) break;
            error = error + dx;
            y0 = y0 + sy;
        }
    }

    return line_points;
}

function span_fill_is_inside(x, y, base_tile) {
    if (!in_canvas_bounds(x, y)) {
        return false;
    }
    return tiles_equal(canvas.tile_arr[y][x], base_tile);
}

function span_fill(x, y, base_tile) {
    if (base_tile == using.tile) {
        return;
    }
    begin_stroke();
    const seed_stack = [];
    if (!span_fill_is_inside(x, y, base_tile)) return;
    seed_stack.push([x, x, y, 1]);
    seed_stack.push([x, x, y - 1, -1]);
    while (seed_stack.length > 0) {
        let cur = seed_stack.pop();
        let x1 = cur[0];
        let x2 = cur[1];
        let y = cur[2];
        let dy = cur[3];
        let x = x1;
        if (span_fill_is_inside(x, y, base_tile)) {
            while (span_fill_is_inside(x - 1, y, base_tile)) {
                add_to_stroke(x, y);
                x = x - 1;
            }
            if (x < x1) {
                add_to_stroke(x, y);
                seed_stack.push([x, x1 - 1, y - dy, -dy]);
            }
        }
        while (x1 <= x2) {
            while (span_fill_is_inside(x1, y, base_tile)) {
                add_to_stroke(x1, y);
                x1 = x1 + 1;
            }
            if (x1 > x) {
                seed_stack.push([x, x1 - 1, y + dy, dy]);
            }
            if (x1 - 1 >  x2) {
                seed_stack.push([x2 + 1, x1 - 1, y - dy, -dy]);
            }
            x1 = x1 + 1;
            while (x1 < x2 && !span_fill_is_inside(x1, y, base_tile)) {
                x1 = x1 + 1;
            }
            x = x1;
        }
    }
}

// ===== LINE_AND_SHAPE_FUNCTIONS =====


// ===== GEOMETRY_FUNCTIONS =====

function is_connected(x0, y0, x1, y1) {
    return (Math.abs(x1 - x0) <= 1 && Math.abs(y1 - y0) <= 1);
}

// ===== GEOMETRY_FUNCTIONS =====


// ===== TOOL_SETTING_FUNCTIONS =====

function toggle_using_bg_color_cell() {
    if (using.color_cell !== using_color_cell.bg) {
        using.char_color_cell.classList.remove("selected_cell");
        using.bg_color_cell.classList.add("selected_cell");
        using.color_cell = using_color_cell.bg;
    }
    else {
        using.color_cell = using_color_cell.none;
        using.bg_color_cell.classList.remove("selected_cell");
    }
}

function toggle_using_char_color_cell() {
    if (using.color_cell !== using_color_cell.char) {
        using.bg_color_cell.classList.remove("selected_cell");
        using.char_color_cell.classList.add("selected_cell");
        using.color_cell = using_color_cell.char;
    }
    else {
        using.color_cell = using_color_cell.none;
        using.char_color_cell.classList.remove("selected_cell");
    }
}

function tool_switch(tool_code) {
    switch(tool_code) {

        case tool.select:
            document.getElementById("tool_button_select").classList.toggle("tool_button_left_selected");
            using.tool = tool.select;
            break;

        case tool.pencil:
            document.getElementById("tool_button_pencil").classList.toggle("tool_button_left_selected");
            using.tool = tool.pencil;
            break;

        case tool.brush:
            document.getElementById("tool_button_brush").classList.toggle("tool_button_left_selected");
            using.tool = tool.brush;
            break;

        case tool.rect:
            document.getElementById("tool_button_rect").classList.toggle("tool_button_left_selected");
            using.tool = tool.rect;
            break;

        case tool.circle:
            document.getElementById("tool_button_circle").classList.toggle("tool_button_left_selected");
            using.tool = tool.circle;
            break;

        case tool.line:
            document.getElementById("tool_button_line").classList.toggle("tool_button_left_selected");
            using.tool = tool.line;
            break;

        case tool.curve:
            document.getElementById("tool_button_curve").classList.toggle("tool_button_left_selected");
            using.tool = tool.curve;
            break;

        case tool.fill:
            document.getElementById("tool_button_fill").classList.toggle("tool_button_left_selected");
            using.tool = tool.fill;
            break;

        case tool.zoom:
            document.getElementById("tool_button_zoom").classList.toggle("tool_button_left_selected");
            using.tool = tool.zoom;
            break;

        case tool.color_dropper:
            document.getElementById("tool_button_color_dropper").classList.toggle("tool_button_left_selected");
            using.tool = tool.color_dropper;
            break;

        case tool.char_dropper:
            document.getElementById("tool_button_char_dropper").classList.toggle("tool_button_left_selected");
            using.tool = tool.char_dropper;
            break;

        case tool.tile_dropper:
            document.getElementById("tool_button_tile_dropper").classList.toggle("tool_button_left_selected");
            using.tool = tool.tile_dropper;
            break;
    }
}

function set_using_tool(tool_code) {
    if (tool_code == using.tool) {
        return;
    }
    else {
        tool_switch(using.tool);
        tool_switch(tool_code);
    }
}

// ===== TOOL_SETTING_FUNCTIONS =====

// ===== TOOL_CLICK_FUNCTIONS =====

    function select_tool_click(i, j, e) {
        if (e.type != "mousedown") {
            return;
        }
        set_selected_tile_info(canvas.tile_arr[i][j], canvas.display_arr[i][j]);
    }

    function pencil_tool_click(i, j, e) {
        if (e.type == "mousedown" && !performing_stroke) {
            begin_stroke();
            add_to_stroke(j, i);
        }
        if (e.type == "mouseover" && performing_stroke) {
            if (stroke_buff.length != 0 && !is_connected(j, i, stroke_buff[stroke_buff.length -1].x, stroke_buff[stroke_buff.length -1].y));
            {
                stroke_from_arr(make_line_from_points(j, i, stroke_buff[stroke_buff.length -1].x, stroke_buff[stroke_buff.length -1].y));
            }
            add_to_stroke(j, i);
        }
    }

    function brush_tool_click(i, j, e) {
        
    }

    function rect_tool_click(i, j, e) {
        
    }

    function circle_tool_click(i, j, e) {
        
    }

    function line_tool_click(i, j, e) {
        
    }

    function curve_tool_click(i, j, e) {
        
    }

    function fill_tool_click(i, j, e) {
        if (e.type == "mousedown") {
            span_fill(j, i, get_canvas_tile(j, i));
            end_stroke();
        }
    }

    function zoom_tool_click(i, j, e) {
        
    }

    function color_dropper_tool_click(i, j, e) {
        
    }

    function char_dropper_tool_click(i, j, e) {
        
    }

    function tile_dropper_tool_click(i, j, e) {
        
    }

// ===== TOOL_CLICK_FUNCTIONS =====


// ===== RGB_HEX_FUNCTIONS =====

// just stolen from stack overflow because it's boring

function component_to_hex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgb_to_hex(rgb) {
    rgb = rgb.replace("rgb", "").replace(/[()]/g, "");
    rgb = rgb.split(", ")
    let r = Number(rgb[0]);
    let g = Number(rgb[1]);
    let b = Number(rgb[2]);
    return "#" + component_to_hex(r) + component_to_hex(g) + component_to_hex(b);
}

// end stolen stuff

function arr_to_rgb(arr) {
    return "rgb(" + clamp(arr[0], 0, 255) + "," + clamp(arr[1], 0, 255) +"," + clamp(arr[2], 0, 255) +")";
}

function vec3_to_rgb(vec3) {
    return "rgb(" + clamp(vec3.x, 0, 255) + "," + clamp(vec3.y, 0, 255) + "," + clamp(vec3.z, 0, 255) + ")";
}

function rgb_to_vec3(rgb) {
    rgb = rgb.replace("rgb", "").replace(/[()]/g, "");
    rgb = rgb.split(", ")
    let r = Number(rgb[0]);
    let g = Number(rgb[1]);
    let b = Number(rgb[2]);
    return new Vec3(r, g, b);
}


// ===== RGB_HEX_FUNCTIONS =====


// ===== SELECTED_TILE_BAR_FUNCTIONS =====

function set_selected_tile_info(tile, canvas_cell) {
    selected.tile = tile;
    selected.bg_color = getComputedStyle(canvas_cell).backgroundColor;
    selected.bg_color_cell.style.backgroundColor = selected.bg_color;
    selected.bg_color_cell.querySelector(".used_value_cell_color_text").innerHTML = rgb_to_hex(selected.bg_color);
    selected.char_color = getComputedStyle(canvas_cell).color;
    selected.char_color_cell.style.backgroundColor = selected.char_color;
    selected.char_color_cell.querySelector(".used_value_cell_color_text").innerHTML = rgb_to_hex(selected.char_color);
    selected.char = tile.char;
    selected.char_cell.innerHTML = selected.char;
}

// ===== SELECTED_TILE_BAR_FUNCTIONS =====


// ===== CANVAS_FUNCTIONS =====

function handle_canvas_click(i, j, e) {
    click_tool_function_map[using.tool](i, j, e);
}

function get_canvas_tile(x, y) {
    return canvas.tile_arr[y][x];
}

function get_canvas_element(x, y) {
    return canvas.display_arr[y][x];
}

function in_canvas_bounds(x, y) {
    return x >= 0 && x < canvas_cols && y >= 0 && y < canvas_rows;
}

// ===== CANVAS_FUNCTIONS =====


// ===== PALETTE_FUNCTIONS =====

function set_using_color_cell(color) {
    switch (using.color_cell) {
        case (using_color_cell.none):
            return;
        case (using_color_cell.bg):
            using.bg_color = color;
            using.bg_color_cell.style.backgroundColor = using.bg_color;
            using.tile = clone_tile(using.tile);
            using.tile.tint.bg_color = color;
            using.bg_color_cell.querySelector(".used_value_cell_color_text").innerHTML = using.bg_color;
            return;
        case (using_color_cell.char):
            using.char_color = color;
            using.char_color_cell.style.backgroundColor = using.char_color;
            using.tile = clone_tile(using.tile);
            using.tile.tint.char_color = color;
            using.char_color_cell.querySelector(".used_value_cell_color_text").innerHTML = using.char_color; 
            return;   
    }
}

function add_to_user_set_custom_swatches(i, j){
    let id = i * palette_length + j;
    if (custom_palette_user_set_swatches.length == 0) {
        custom_palette_user_set_swatches.push(id);
        return true;
    }
    else /* if (custom_palette_user_set_swatches.length <= 3) */ {
        for (let x = 0; x < custom_palette_user_set_swatches.length; x++) {
            let cur_val = custom_palette_user_set_swatches[x];
            if (cur_val == id) {
                return false;
            }
            else if (cur_val > id) {
                custom_palette_user_set_swatches.splice(x, 0, id);
                return true;
            }
            else if (cur_val < id && x == custom_palette_user_set_swatches.length - 1) {
                custom_palette_user_set_swatches.push(id);
                return true;
            }
        }
    }
}


function update_swatch_pairs(id) {
    if (swatch_pairs.length == 0) {
        swatch_pairs.push(id);
        return;
    }
    else {
        swatch_pairs.length = 0;
        for (let i = 0; i < custom_palette_user_set_swatches.length - 1; i++) {
            let cur = custom_palette_user_set_swatches[i];
            let next = custom_palette_user_set_swatches[i + 1];
            swatch_pairs.push([cur, next]);
        } 
    }

}

function palette_id_to_coords(id) {
    return [Math.floor(id / palette_length), id % palette_length];
}

function palette_lerp(first_id, second_id){
    let first_coord = palette_id_to_coords(first_id);
    let second_coord = palette_id_to_coords(second_id);
    let first_color = color_palette_arr[first_coord[0]][first_coord[1]].style.backgroundColor;
    let second_color = color_palette_arr[second_coord[0]][second_coord[1]].style.backgroundColor;
    first_color = rgb_to_vec3(first_color);
    second_color = rgb_to_vec3(second_color);
    let increment = second_color.minus(first_color);
    if ((second_id - first_id) != 0) {
        increment = increment.scale(1 / (second_id - first_id));
    }
    else {
        increment = new Vec3(0, 0, 0);
    }
    for (let i = first_id + 1; i < second_id; i++) {
        first_color = first_color.plus(increment);
        let cur_coords = palette_id_to_coords(i);
        current_custom_palette[cur_coords[0]][cur_coords[1]] = vec3_to_rgb(first_color);
        color_palette_arr[cur_coords[0]][cur_coords[1]].style.backgroundColor = vec3_to_rgb(first_color);
    }
}


function update_user_set_custom_swatches(i, j, added) {
    let id = i * palette_length + j;
    if (added) {
        update_swatch_pairs(id);
    }
    if (swatch_pairs[0] == id) {
        return;
    }
    for (let x = 0; x < swatch_pairs.length; x++) {
        if (swatch_pairs[x][1] - swatch_pairs[x][0] == 1) {
            continue;
        }
        else {
            palette_lerp(swatch_pairs[x][0], swatch_pairs[x][1]);
        }

    }
}

function handle_palette_click(i, j, e) {
    set_using_color_cell(rgb_to_hex(getComputedStyle(color_palette_arr[i][j]).backgroundColor));
    if (e.ctrlKey && current_palette == "custom") {
        if (custom_palette_selected_swatch !== null) {
            let last_selected = color_palette_arr[custom_palette_selected_swatch[0]][custom_palette_selected_swatch[1]];
            last_selected.classList.remove("custom_palette_selected");
            let last_i = custom_palette_selected_swatch[0];
            let last_j = custom_palette_selected_swatch[1];
            if (last_i == i && last_j == j ) {
                custom_palette_selected_swatch = null;
                return;
            }
        }
        color_palette_arr[i][j].classList.add("custom_palette_selected");
        custom_palette_selected_swatch = [i, j];
    }
};

function construct_palette_arr_plane(v_basis, h_basis) {
    for (let i = 0; i < color_palette_arr.length; i++) {
        let cur_row = color_palette_arr[i];
        for (let j = 0; j < cur_row.length; j++) {
            let swatch_color = v_basis.scale(color_palette_arr.length - 1 - i);
            swatch_color = swatch_color.plus(h_basis.scale(j));
            cur_row[j].style.backgroundColor = vec3_to_rgb(swatch_color);
        }
    }
};

function construct_grey_palette() {
    let basis = (new Vec3(255, 255, 255)).scale( 1 / ((palette_length * palette_length) - 1));
    let swatch_color = new Vec3(0, 0, 0);
    for (let i = 0; i < color_palette_arr.length; i++) {
        let cur_row = color_palette_arr[i];
        for (let j = 0; j < cur_row.length; j++) {
            cur_row[j].style.backgroundColor = vec3_to_rgb(swatch_color);
            swatch_color = swatch_color.plus(basis);
        }
    }
}

function construct_custom_palette() {
    for (let i = 0; i < color_palette_arr.length; i++) {
        let cur_row = color_palette_arr[i];
        for (let j = 0; j < cur_row.length; j++) {
            cur_row[j].style.backgroundColor = current_custom_palette[i][j];
        }
    }
}

function set_custom_palette_from_file_callback(read_file) {

    custom_palette_user_set_swatches.length = 0;
    swatch_pairs.length = 0;

    if (read_file === null) {
        return;
    }

    if (read_file.length > (24 * palette_length * palette_length)) {
        alert("File too long.");
        return;
    }

    read_file = read_file.split("\n");
    if (read_file.length != palette_length) {
        alert("Could not read file.");
        return;
    }

    let split_file = [];
    for (let i = 0; i < palette_length; i++) {
        split_file.push(read_file[i].split("\t"));
    }

    for (let i = 0; i < color_palette_arr.length; i++) {
        let cur_row = color_palette_arr[i];
        for (let j = 0; j < cur_row.length; j++) {
            current_custom_palette[i][j] = split_file[i][j];
            cur_row[j].style.backgroundColor = current_custom_palette[i][j]
        }
    }

}

function set_custom_palette_from_file(file) {
    read_file_text(file, set_custom_palette_from_file_callback);
}

function set_palette(color) {
    let v_basis = null;
    let h_basis = null;
    current_palette = color;
    if (color !== "custom") {
        document.getElementById("palette_load_save_button_container").classList.add("hidden");
        if (custom_palette_selected_swatch !== null) {
            color_palette_arr[custom_palette_selected_swatch[0]][custom_palette_selected_swatch[1]].classList.remove("custom_palette_selected")
            custom_palette_selected_swatch = null;
        }
    }
    else {
        document.getElementById("palette_load_save_button_container").classList.remove("hidden");
        construct_custom_palette();
        return;
    }
    switch (color) {
        case "red":
            v_basis = (new Vec3(255, 0, 0)).scale(1 / (palette_length - 1));
            h_basis = (new Vec3(0, 255, 255)).scale(1 / (palette_length - 1));
            break;
        case "orange":
            v_basis = (new Vec3(255, 165, 0)).scale(1 / (palette_length - 1));
            h_basis = (new Vec3(0, 165, 255)).scale(1 / (palette_length - 1));
            break;
        case "yellow":
            v_basis = (new Vec3(255, 255, 0)).scale(1 / (palette_length - 1));
            h_basis = (new Vec3(0, 0, 255)).scale(1 / (palette_length - 1));
            break;
        case "green":
            v_basis = (new Vec3(0, 255, 0)).scale(1 / (palette_length - 1));
            h_basis = (new Vec3(255, 0, 255)).scale(1 / (palette_length - 1));
            break;
        case "blue":
            v_basis = (new Vec3(0, 155, 155)).scale(1 / (palette_length - 1));
            h_basis = (new Vec3(200, 100, 100)).scale(1 / (palette_length - 1));
            break;
        case "purple":
            v_basis = (new Vec3(128, 0, 128)).scale(1 / (palette_length - 1));
            h_basis = (new Vec3(127, 255, 127)).scale(1 / (palette_length - 1));
            break;
        case "brown":
            v_basis = (new Vec3(102, 51, 0)).scale(1 / (palette_length - 1));
            h_basis = (new Vec3(253, 204, 255)).scale(1 / (palette_length - 1));
            break;
        case "grey":
            construct_grey_palette();
            return;
    }
    construct_palette_arr_plane(v_basis, h_basis);
};

function download_current_palette() {
    let text = "";
    for (let i = 0; i < palette_length; i++) {
        for (let j = 0; j < palette_length; j++) {
            text += color_palette_arr[i][j].style.backgroundColor;
            if (j !== palette_length - 1) {
                text += "\t";
            }
        }
        if (i !== palette_length - 1) {
            text += "\n";
        }
    }
    set_text_file_url(text);
    let download = document.createElement("a");
    download.href = text_file_download_url;
    download.target = "_blank";
    download.download = "palette.tsv";
    download.click();
}

// ===== PALETTE_FUNCTIONS =====


// ===== TILESET_FUNCTIONS =====

function handle_tileset_swatch_click(tile) {
    using.char_cell.innerHTML = using.char = tile.char;
    using.char = tile.char;
    using.tile = tile;

    if (tile.bg_color !== null) {
        if (tile.tint.bg_color === null) {
            using.bg_color = tile.bg_color;
            using.bg_color_cell.style.backgroundColor = tile.bg_color;
            using.bg_color_cell.querySelector(".used_value_cell_color_text").innerHTML = rgb_to_hex(using.bg_color);
        }
        else {
            using.bg_color = tile.tint.bg_color;
            using.bg_color_cell.style.backgroundColor = tile.tint.bg_color;
            using.bg_color_cell.querySelector(".used_value_cell_color_text").innerHTML = rgb_to_hex(using.bg_color);
        }
    }
    if (tile.tint.bg_color === null) {
        using.tile = clone_tile(using.tile);
        using.tile.tint.bg_color = using.bg_color;
    } 
    else {
        using.bg_color = using.tile.tint.bg_color
        using.bg_color_cell.style.backgroundColor = tile.tint.bg_color;
        using.bg_color_cell.querySelector(".used_value_cell_color_text").innerHTML = rgb_to_hex(using.bg_color);
    }

    if (tile.char_color !== null) {
        if (tile.tint.char_color === null) {
            using.char_color = tile.char_color;
            using.char_color_cell.style.backgroundColor = tile.char_color;
            using.char_color_cell.querySelector(".used_value_cell_color_text").innerHTML = rgb_to_hex(using.char_color);
        }
        else {
            using.char_color = tile.tint.char_color;
            using.char_color_cell.style.backgroundColor = tile.tint.char_color;
            using.char_color_cell.querySelector(".used_value_cell_color_text").innerHTML = rgb_to_hex(using.char_color);
        }
    }
    if (tile.tint.char_color === null) {
        using.tile = clone_tile(using.tile);
        using.tile.tint.char_color = using.char_color;
    } 
    else {
        using.char_color = using.tile.tint.char_color
        using.char_color_cell.style.backgroundColor = tile.tint.char_color;
        using.char_color_cell.querySelector(".used_value_cell_color_text").innerHTML = rgb_to_hex(using.char_color);
    }
}

function create_tile_swatch(tile) {
    let swatch = document.createElement("div");
    swatch.classList.add("tileset_swatch");
    if (tile.bg_color !== null) {
        swatch.backgroundColor = tile.bg_color;
    }
    if (tile.char_color !== null) {
        swatch.color = tile.char_color;
    }
    let character = document.createElement("div");
    character.classList.add("tileset_swatch_tile_character")
    character.innerHTML = tile.char;
    swatch.appendChild(character);
    let info = document.createElement("div");
    info.classList.add("tileset_swatch_tile_info");
    let bg_color = (tile.bg_color === null) ? "None" : rgb_to_hex(tile.bg_color);
    let char_color = (tile.char_color === null) ? "None" : rgb_to_hex(tile.char_color);
    let extra_data = (tile.extra_data.length == 0) ? "None" : "Yes";
    info.innerHTML = "Name:<br>" + tile.name + "<br>BG color:<br>" + bg_color + "<br>Char color:<br>" + char_color + "<br>Extra data:<br>" + extra_data;
    swatch.appendChild(info);
    swatch.addEventListener("click",
            function() {
                handle_tileset_swatch_click(tile);
            });
    return swatch;

}

function load_tileset_callback(read_file) {
    let parsed = {};
    try {
        parsed = JSON.parse(read_file);
    }
    catch {
        alert("Could not parse tileset file");
        return;
    }
    loaded_tileset.length = 0;
    let swatch_container = document.getElementById("tileset_container_id");
    for (let i = 0; i < parsed.char_only.length; i++) {
        let tile = new Tile(parsed.char_only[i]);
        let swatch = create_tile_swatch(tile);
        loaded_tileset.push({swatch: swatch, tile: tile});
        swatch_container.appendChild(swatch);
    }
    for (let i = 0; i < parsed.tiles.length; i++) {
        let swatch = create_tile_swatch(parsed.tiles[i]);
        loaded_tileset.push({swatch: swatch, tile: parsed.tiles[i]});
        swatch_container.appendChild(swatch);
    }   
}

function load_tileset(file) {
    read_file_text(file, load_tileset_callback);
}

function tileset_search(query) {
    query = query.toUpperCase();
    for (let i = 0; i < loaded_tileset.length; i++) {
        if (loaded_tileset[i].tile.name.toUpperCase().indexOf(query) > -1) {
            loaded_tileset[i].swatch.style.display = "";
        }
        else {
            loaded_tileset[i].swatch.style.display = "none";
        }
    }
}

// ===== TILESET_FUNCTIONS =====


// ===== DRAW_UI =====

set_frame_size();

// ===== DRAW_UI =====


// ===== INIT_ARRAYS =====

for (let i = 0; i < canvas_rows; i++) {
    let base_tile = new Tile(" ", "Space");
    let cur_row = document.createElement("tr");
    frame.appendChild(cur_row);
    let display_arr_row = [];
    let tile_arr_row = [];
    for (let j = 0; j < canvas_cols; j++) {
        let cur_cell = document.createElement("td");
        cur_cell.className = "game_display_cell";
        cur_cell.innerHTML = base_tile.char;
        cur_cell.backgroundColor = base_tile.bg_color;
        cur_cell.color = base_tile.char_color;
        cur_cell.addEventListener("mousedown", 
            (e) => {
                handle_canvas_click(i, j, e);
        });
        cur_cell.addEventListener("mouseup", 
            (e) => {
                handle_canvas_click(i, j, e);
        });
        cur_cell.addEventListener("mouseover", 
            (e) => {
                handle_canvas_click(i, j, e);
        });
        cur_row.appendChild(cur_cell);
        display_arr_row.push(cur_cell);
        tile_arr_row.push(base_tile);
    }
    canvas.display_arr.push(display_arr_row);
    canvas.tile_arr.push(tile_arr_row);
}

for (let i = 0; i < palette_length; i++) {
    let cur_row = document.createElement("div");
    let cur_arr_row = [];
    let cur_custom_palette_row = [];
    cur_row.className = "color_palette_swatch_row";
    color_palette_container.appendChild(cur_row);
    for (let j = 0; j < palette_length; j++) {
        let curr_swatch = document.createElement("div");
        curr_swatch.className = "color_palette_swatch";
        let color = "rgb(" + String(i * palette_length) +"," + String(j * palette_length) +"," + "130)";
        cur_custom_palette_row.push(color);
        curr_swatch.style.backgroundColor = color;
        curr_swatch.addEventListener("mousedown",
            (e) => {
                handle_palette_click(i, j, e);
            });
        cur_row.appendChild(curr_swatch);
        cur_arr_row.push(curr_swatch);
    }
    color_palette_arr.push(cur_arr_row);
    current_custom_palette.push(cur_custom_palette_row);
}

// ===== INIT_ARRAYS =====


// ===== EVENT_LISTENERS =====

window.addEventListener("resize", set_frame_size);

using.bg_color_cell.addEventListener("click",
                    function() {
                        toggle_using_bg_color_cell();
                    });
using.char_color_cell.addEventListener("click",
                    function() {
                        toggle_using_char_color_cell();
                    });

document.getElementById("set_color_button").addEventListener("click",
                    function() {
                        let text_input = document.getElementById("set_color_text_input").value;
                        let color = null;
                        if (text_input.length != 6 || isNaN(parseInt(text_input, 16))) {
                            color = document.getElementById("color_picker").value;
                        }
                        else {
                            color = "#" + text_input;
                        }
                        set_using_color_cell(color);
                        if (custom_palette_selected_swatch !== null) {
                            color_palette_arr[custom_palette_selected_swatch[0]][custom_palette_selected_swatch[1]].style.backgroundColor = color;
                            current_custom_palette[custom_palette_selected_swatch[0]][custom_palette_selected_swatch[1]] = color;
                            let added = add_to_user_set_custom_swatches(custom_palette_selected_swatch[0], custom_palette_selected_swatch[1]);
                            update_user_set_custom_swatches(custom_palette_selected_swatch[0], custom_palette_selected_swatch[1], added);
                        }
                    });

for (let i = 0; i < color_palette_color_labels.length; i++) {
    let color = color_palette_color_labels[i];
    document.getElementById(("color_palette_button_" + color)).addEventListener("click",
                    function() {
                        set_palette(color);
                    });
}

document.getElementById("load_palette_button").addEventListener("click",
                    function() {
                        document.getElementById("load_palette_button_internal").click();
                    });

document.getElementById("load_palette_button_internal").addEventListener("change",
                    function() {
                        set_custom_palette_from_file(document.getElementById("load_palette_button_internal").files[0]);
                    });

document.getElementById("save_palette_button").addEventListener("click",
                    function() {
                        download_current_palette();
                    });

document.getElementById("load_tileset_button").addEventListener("click",
                    function() {
                        document.getElementById("load_tileset_internal").click();
                    });

document.getElementById("load_tileset_internal").addEventListener("change",
                    function() {
                        load_tileset(document.getElementById("load_tileset_internal").files[0]);
                    });

document.getElementById("tileset_search_bar").addEventListener("keyup",
                    function() {
                        let value = document.getElementById("tileset_search_bar").value;
                        tileset_search(value);
                    });

document.getElementById("tool_button_select").addEventListener("click",
                    function() {
                        set_using_tool(tool.select);
                    });
document.getElementById("tool_button_pencil").addEventListener("click",
                    function() {
                        set_using_tool(tool.pencil);
                    });
document.getElementById("tool_button_brush").addEventListener("click",
                    function() {
                        set_using_tool(tool.brush);
                    });
document.getElementById("tool_button_rect").addEventListener("click",
                    function() {
                        set_using_tool(tool.rect);
                    });
document.getElementById("tool_button_circle").addEventListener("click",
                    function() {
                        set_using_tool(tool.circle);
                    });
document.getElementById("tool_button_line").addEventListener("click",
                    function() {
                        set_using_tool(tool.line);
                    });
document.getElementById("tool_button_curve").addEventListener("click",
                    function() {
                        set_using_tool(tool.curve);
                    });
document.getElementById("tool_button_fill").addEventListener("click",
                    function() {
                        set_using_tool(tool.fill);
                    });
document.getElementById("tool_button_zoom").addEventListener("click",
                    function() {
                        set_using_tool(tool.zoom);
                    });
document.getElementById("tool_button_color_dropper").addEventListener("click",
                    function() {
                        set_using_tool(tool.color_dropper);
                    });
document.getElementById("tool_button_char_dropper").addEventListener("click",
                    function() {
                        set_using_tool(tool.char_dropper);
                    });
document.getElementById("tool_button_tile_dropper").addEventListener("click",
                    function() {
                        set_using_tool(tool.tile_dropper);
                    });

document.addEventListener("keydown",
                    (e) => {
                        handle_global_keydown(e);
                    });

document.getElementById("game_frame").addEventListener("mouseenter",
                    (e) => {
                        if (left_canvas_while_performing_stroke && (using.tool == tool.pencil || using.tool == tool.brush)) {
                            left_canvas_while_performing_stroke = false;
                            let vec = get_tile_coords_closest_to_point(e.clientX, e.clientY);
                            begin_stroke();
                            add_to_stroke(vec.x, vec.y);
                        }
                    });

document.getElementById("game_frame").addEventListener("mouseleave",
                    (e) => {
                        if (performing_stroke && (using.tool == tool.pencil || using.tool == tool.brush)) {
                            let vec = get_tile_coords_closest_to_point(e.clientX, e.clientY);
                            let last_stroke = stroke_buff[stroke_buff.length - 1];
                            let line_arr = make_line_from_points(last_stroke.x, last_stroke.y, vec.x, vec.y);
                            stroke_from_arr(line_arr);
                            left_canvas_while_performing_stroke = true;
                            end_stroke();
                        }
                    });

document.addEventListener("mouseup", 
                    function() {
                        left_canvas_while_performing_stroke = false;
                        if (performing_stroke && (using.tool == tool.pencil || using.tool == tool.brush)) {
                            end_stroke();
                        }
                    });

// ===== EVENT_LISTENERS =====
