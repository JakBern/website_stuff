const nodes = new Array(8);
for (let i = 0;i < nodes.length;i++) {
    nodes[i] = null;
}
let lightning_on = false;
let nodes_used = 0;
let selected = null;
let canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let ctx = canvas.getContext('2d');
ctx.fillStyle = 'black';
ctx.fillRect(0, 0, canvas.width, canvas.height);
let buffer =  document.createElement("canvas");
buffer.width = canvas.width;
buffer.height = canvas.height;

class vec2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

function addVec(vecA, vecB) {
    return new vec2(vecA.x + vecB.x, vecA.y + vecB.y);
}

function scaleVec(num, vec) {
    return new vec2(num * vec.x, num * vec.y); 
}

function unitVecFromAngle(angle) {
    return new vec2(Math.cos(angle), Math.sin(angle))
}

function angleFromVec(vec) {
    return Math.atan2(vec.y, vec.x);
}

function randomVec(angle, angle_bound, min_len, max_len) {
    let vec = unitVecFromAngle(
                        ((Math.random() - 0.5) * angle_bound) + angle);
    let len = max_len - min_len;
    len *= Math.random();
    scaleVec(len + min_len, vec);
    return vec;
}

function magSqrd(vec) {
    return vec.x * vec.x + vec.y * vec.y;
}

function handleDoubleClick(e) {
    let cur_pos_vec = new vec2(e.clientX,  e.clientY);
    for (let i = 0; i < nodes.length; i++) {
        if (nodes[i] !== null) {
            let negated = scaleVec(-1, nodes[i]);
            let dist_vec = addVec(negated, cur_pos_vec);
            if (magSqrd(dist_vec) <= 400) {
                nodes[i] = null;
                nodes_used--;
                nodes.sort();
                return;
            }
        }
    }
    if (nodes_used < nodes.length) {
        for (let i = 0; i < nodes.length; i++) {
            if (nodes[i] === null) {
                nodes[i] = cur_pos_vec;
                nodes_used++;
                return;
            }
        }
    }
}

function handleMouseMove(e) {
    if (selected === null) {
        return;
    }
    nodes[selected] = new vec2(e.x, e.y);
}

function handleMouseLeave() {
    selected = null;
}

function handleMouseDown(e) {
    let cur_pos_vec = new vec2(e.clientX,  e.clientY);
    let closest = null;
    let closest_dist = null;
    for (let i = 0; i < nodes.length; i++) {
        if (nodes[i] === null) {
            continue;
        }
        let negated = scaleVec(-1, nodes[i]);
        let dist_vec = addVec(negated, cur_pos_vec);
        let dist = magSqrd(dist_vec);
        if (dist <= 400) {
            if (closest === null) {
                closest_dist = dist;
                closest = i;
            }
            else if (dist < closest_dist) {
                closest_dist = dist;
                closest = i;
            }
        }
    }
    if (closest !== null) {
        selected = closest;
    }
}

function handleMouseUp() {
    selected = null;
}

function connectByLightning(first_ind, second_ind) {
    let first = nodes[first_ind];
    let second = nodes[second_ind];
    let buffer_ctx = buffer.getContext("2d");
    buffer_ctx.strokeStyle = "white";
    buffer_ctx.lineWidth = 4.0;
    buffer_ctx.lineCap = "round";
    buffer_ctx.lineJoin = "miter";
    buffer_ctx.beginPath();
    buffer_ctx.moveTo(first.x, first.y);
    let cur = first;
    let cur_dist = addVec(second, scaleVec(-1, first));
    while(magSqrd(cur_dist) >=  256) {
        let angle = angleFromVec(cur_dist);
        let next = addVec(cur, randomVec(angle, 1.6, 3, 16));
        buffer_ctx.lineTo(next.x, next.y);
        cur = next;
        cur_dist = addVec(second, scaleVec(-1, cur));
    }
    buffer_ctx.lineTo(second.x, second.y);
    buffer_ctx.stroke();
}

function doLightningAnim() {
    if (nodes_used === 0) {
        return;
    }
    for (let i = 0; i < nodes.length; i++) {
        if (nodes[i] === null) {
            continue;
        }
        for (let j = i + 1; j < nodes.length; j++) {
            if (nodes[j] === null) {
                continue;
            }
            connectByLightning(i, j);
        }
    }
}

function renderNode(node) {
    if (node === null) {
        return;
    }
    let buffer_ctx = buffer.getContext("2d");
    let node_gradient = buffer_ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, 20);
    node_gradient.addColorStop(0, "gray");
    node_gradient.addColorStop(0.7, "rgb(50, 50, 50)");
    node_gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
    buffer_ctx.fillStyle = node_gradient;
    buffer_ctx.fillRect(node.x - 20, node.y - 20, 40, 40);
}

function handleRegularDrawing() {
    let buffer_ctx = buffer.getContext("2d");
    buffer_ctx.fillStyle = 'black';
    buffer_ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (nodes_used === 0) {
        ctx.drawImage(buffer, 0, 0);
        return;
    }
    else {
        nodes.forEach(renderNode);
    }
    if (lightning_on) {
        doLightningAnim();
    }
    ctx.drawImage(buffer, 0, 0);
    return;
}

setInterval(function() {handleRegularDrawing();}, 50);

canvas.addEventListener("dblclick", 
                        (e) => {
                            handleDoubleClick(e);
                        }, false);
canvas.addEventListener("mousedown",
                        (e) => {
                            handleMouseDown(e);
                        }, false);
canvas.addEventListener("mouseup",
                        function() {
                            handleMouseUp();
                        }, false);
canvas.addEventListener("mousemove",
                        (e) => {
                            handleMouseMove(e);
                        },
                        false);
canvas.addEventListener("mouseleave",
                        function() {
                            handleMouseLeave();
                        },
                        false)
window.addEventListener("resize", 
    (e) => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    buffer.width = canvas.width;
    buffer.height = canvas.height;
    });
window.addEventListener("keydown", 
                        (e) => {
                            if (e.key === "z") {
                                lightning_on = !lightning_on;
                            }
                        });