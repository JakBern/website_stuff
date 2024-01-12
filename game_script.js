// ===== CLASSES =====

function Vec2(x, y) {
    this.x = x;
    this.y = y;
}

function Multicell(start, end, element, type) {
    this.start = start;
    this.end = end;
    this.cell = element;
    this.type = type;
}

// ===== CLASSES =====

// ===== INIT_GLOBALS =====

const frame = document.getElementById("game_frame");
let root = document.querySelector(':root');
const display_arr = [];
const multicell_map = new Map();
let frame_height = 0;
let frame_width = 0;
let frame_cols = 48;
let frame_rows = 32;
let font_size = 0;
let w_h_ratio = frame_cols / frame_rows;
let selected_temp = null;

// ===== INIT_GLOBALS =====

// == Compass ==
let compass_art = 
`=====
=   +   =
=    │    =
=       =
=====`;

// == Compass ==


// ===== INIT_SCREEN_EMPTY =====

for (let i = 0; i < frame_rows; i++) {
    let cur_row = document.createElement("tr");
    frame.appendChild(cur_row);
    let arr_row = [];
    for (let j = 0; j < frame_cols; j++) {
        let cur_cell = document.createElement("td");
        cur_cell.className = "game_display_cell";
        cur_cell.innerHTML = " ";
        cur_row.appendChild(cur_cell);
        arr_row.push(cur_cell);
    }
    display_arr.push(arr_row);
}

// ===== INIT_SCREEN_EMPTY =====


// ===== WINDOW_FUNCTIONS =====

function set_frame_size() {
    let win_height = window.innerHeight;
    let win_width = window.innerWidth;
    if (win_width / w_h_ratio >= win_height) {
        frame_height = win_height;
        frame_width = frame_height * w_h_ratio;

        frame_width -= frame_width * 0.1;
        frame_height -= frame_height * 0.1;
    }
    else {
        frame_width = win_width;
        frame_height = frame_width / w_h_ratio;

        frame_width -= frame_width * 0.1;
        frame_height -= frame_height * 0.1;
    }
    font_size = (frame_width / frame_cols);
    frame.style.fontSize = font_size * 0.8 + "px";
    root.style.setProperty('--cell_size', font_size * 0.99 + "px");
}

// ===== WINDOW_FUNCTIONS =====


// ===== DRAWING_FUNCTIONS =====

function tile_draw_char(x, y, char) {
    display_arr[y][x].innerHTML = char;
}

function tile_draw_box_vec(start, end, vert = "+", hori_edge = "=", vert_edge_left = "|", vert_edge_right = "|") {
    tile_draw_char(start.x, start.y, vert);
    tile_draw_char(start.x, end.y, vert);
    tile_draw_char(end.x, start.y, vert);
    tile_draw_char(end.x, end.y, vert);
    for (let i = start.x + 1; i < end.x; i++) {
        tile_draw_char(i, start.y, hori_edge);
        tile_draw_char(i, end.y, hori_edge);
    }
    for (let i = start.y + 1; i < end.y; i++) {
        tile_draw_char(start.x, i, vert_edge_left);
        tile_draw_char(end.x, i, vert_edge_right);
    }
}

function tile_draw_text_hori_vec(pos, text) {
    for (let i = 0; i < text.length; i++) {
        tile_draw_char(pos.x + i, pos.y, text[i]);
    }
}

function tile_fill_box_vec(start, end, fill_char) {
    for (let i = start.x; i <= end.x; i++) {
        for (let j = start.y; j <= end.y; j++) {
            tile_draw_char(i, j, fill_char);
        }
    }
}

function tile_change_bg_color(x, y, color) {
    display_arr[y][x].style.backgroundColor = color;
}

function multicell_group_vec(start, end, id, type) {
    let multicell = display_arr[start.y][start.x];
    multicell.colSpan = end.x - start.x + 1;
    multicell.rowSpan = end.y - start.y + 1;
    multicell.classList.toggle("game_multicell");
    multicell.classList.toggle("game_multicell_" + type);
    for (let i = start.x; i <= end.x; i++) {
        for (let j = start.y; j <= end.y; j++) {
            if (i === start.x && j === start.y ) {
                continue;
            }
            display_arr[j][i].classList.toggle("game_display_cell_hidden");
        }
    }
    multicell_map.set(id, new Multicell(start, end, multicell, type));
}

function multicell_ungroup(id) {
    let mc = multicell_map.get(id);
    mc.cell.colSpan = 1;
    mc.cell.rowSpan = 1;
    mc.cell.classList.toggle("game_multicell");
    mc.cell.classList.toggle("game_multicell_" + mc.type);
    for (let i = mc.start.x ; i <= mc.end.x; i++) {
        for (let j = mc.start.y; j <= mc.end.y; j++) {
            if (i === mc.start.x && j === mc.start.y ) {
                continue;
            }
            display_arr[j][i].classList.toggle("game_display_cell_hidden");
        }
    }
    multicell_map.delete(id);
}

function multicell_write(id, string) {
    multicell_map.get(id).cell.innerHTML = string;
}

// ===== DRAWING_FUNCTIONS =====


// ===== DRAW_IN_GAME_UI =====

set_frame_size();

// Drawing top left box
tile_draw_box_vec(new Vec2(0, 0), new Vec2(10, 10), "+", "~");

// Drawing bottom left box
tile_draw_box_vec(new Vec2(0, 11), new Vec2(10, 31));

// Drawing top right box
tile_draw_box_vec(new Vec2(37, 0), new Vec2(47, 10), "+", "~");

// Drawing bottom right box
tile_draw_box_vec(new Vec2(37, 11), new Vec2(47, 31), "+", "=");

// Drawing top center box
tile_draw_box_vec(new Vec2(11, 0), new Vec2(36, 5), "*", "-");

// Drawing center bottom box 
tile_draw_box_vec(new Vec2(11, 6), new Vec2(36, 31));

// ==+ Making multicell areas

// Compass
multicell_group_vec(new Vec2(38,4), new Vec2(46, 8), "compass", "art");

// Compass text
multicell_group_vec(new Vec2(38,9), new Vec2(46, 9), "compass_text", "text");
multicell_write("compass_text", "Facing: North")
multicell_write("compass", compass_art);



// Settings for testing UI
tile_draw_text_hori_vec(new Vec2(12,1), "     ~Title Text II~");
tile_fill_box_vec(new Vec2(12, 7), new Vec2(35, 30), ".");
tile_draw_char(23, 18, "@");
tile_change_bg_color(23, 18, "rgb(140, 140, 230)");

// multicell_group_vec(new Vec2(1,2), new Vec2(9, 2), "test");

// multicell_write("test", "Does thiiiiiiiiiiiiiiis shit work?");

// multicell_ungroup("compass");






// ===== DRAW_IN_GAME_UI =====


// ===== EVENT_LISTENERS =====

window.addEventListener("resize", set_frame_size);

// == UI test functions ==
for (let i = 0; i < display_arr.length; i++) {
    let row = display_arr[i];
    for (let j = 0; j < row.length; j++) {
        row[j].addEventListener("click", 
            function() {
                display_arr[i][j].style.color = "red";
                display_arr[i][j].style.fontSize = (font_size / 4) + "px";
                display_arr[i][j].innerHTML = String(j) + ", " + String(i);
            });
            row[j].addEventListener("dblclick",
                function() {
                    selected_temp = display_arr[i][j];
                });
    }
}

window.addEventListener("keypress", 
                        (e) => {
                            if (selected_temp === null) {
                                return;
                            }
                            else {
                                selected_temp.innerHTML = String(e.key);
                                selected_temp.style.color = "black";
                                selected_temp.style.fontSize = font_size * 0.8 + "px";
                            }});

// == UI test functions ==


// ===== EVENT_LISTENERS =====