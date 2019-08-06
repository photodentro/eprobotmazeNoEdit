const mazeColumns = 7;
const mazeRows = 5;


const NORTH = 1
const WEST = 2
const SOUTH = 4
const EAST = 8
const SET = 16

var g = {maze:[]};

function check(x, y) {
    if (g.maze[getId(x, y)] & SET)
        return 1
    return 0
}

function getId(x, y) {
    return x + y * mazeColumns
}


function isPossible(x, y) {
    var wall = g.maze[getId(x, y)];
    var pos = [];
    wall = wall ^ SET;
    pos[0] = 0;
    if (x === 0) {
        wall = wall ^ WEST;
    }
    if (y === 0) {
        wall = wall ^ NORTH;
    }
    if (x === mazeColumns - 1) {
        wall = wall ^ EAST;
    }
    if (y === mazeRows - 1) {
        wall = wall ^ SOUTH;
    }
    if (wall & EAST) {
        if (check(x + 1, y) === 0) {
            pos[0] = pos[0] + 1;
            pos[pos[0]] = EAST;
        }
    }
    if (wall & SOUTH) {
        if (check(x, y + 1) === 0) {
            pos[0] = pos[0] + 1;
            pos[pos[0]] = SOUTH;
        }
    }
    if (wall & WEST) {
        if (check(x - 1, y) === 0) {
            pos[0] = pos[0] + 1;
            pos[pos[0]] = WEST;
        }
    }
    if (wall & NORTH) {
        if (check(x, y - 1) === 0) {
            pos[0] = pos[0] + 1;
            pos[pos[0]] = NORTH;
        }
    }
    return pos;
}



function drawSquare(squareX,squareY,squareCode){//thanks @alkisg
    var c = document.getElementById("mycanvas");
    var ctx = c.getContext("2d");
    var gWidth = 42.6;//must be the scaling
    var gHeight = 30;
    ctx.lineWidth = 0.2;
    ctx.setLineDash([3]);
    ctx.strokeRect(squareX,squareY,gWidth,gHeight);
    ctx.lineWidth = 3;
    ctx.setLineDash([]);
    ctx.beginPath();
    if (squareCode & 1) {
        ctx.moveTo(squareX,squareY+gHeight);
        ctx.lineTo(squareX+gWidth,squareY+gHeight);
    }
    if (squareCode & 2) {
        ctx.moveTo(squareX,squareY);
        ctx.lineTo(squareX,squareY+gHeight);
    }
    if (squareCode & 4) {
        ctx.moveTo(squareX,squareY);
        ctx.lineTo(squareX+gWidth,squareY);
    }
    if (squareCode & 8) {
        ctx.moveTo(squareX+gWidth,squareY);
        ctx.lineTo(squareX+gWidth,squareY+gHeight);
    }
    ctx.stroke();
    ctx.closePath();
}

function generateMaze(x, y) {
    g.maze[getId(x, y)] = g.maze[getId(x, y)] + SET;
    var po = isPossible(x, y);
    while (po[0] > 0) {
        var ran = po[Math.floor(Math.random() * po[0]) + 1];
        switch (ran) {
        case EAST:
            g.maze[getId(x, y)] = g.maze[getId(x, y)] ^ EAST;
            g.maze[getId(x + 1, y)] = g.maze[getId(x + 1, y)] ^ WEST;
            generateMaze(x + 1, y);
            break
        case SOUTH:
            g.maze[getId(x, y)] = g.maze[getId(x, y)] ^ SOUTH;
            g.maze[getId(x, y + 1)] = g.maze[getId(x, y + 1)] ^ NORTH;
            generateMaze(x, y + 1);
            break
        case WEST:
            g.maze[getId(x, y)] = g.maze[getId(x, y)] ^ WEST;
            g.maze[getId(x - 1, y)] = g.maze[getId(x - 1, y)] ^ EAST;
            generateMaze(x - 1, y);
            break
        case NORTH:
            g.maze[getId(x, y)] = g.maze[getId(x, y)] ^ NORTH;
            g.maze[getId(x, y - 1)] = g.maze[getId(x, y - 1)] ^ SOUTH;
            generateMaze(x, y - 1);
            break
        }
        po = isPossible(x, y);
    }
}


function canvasDraw(){
    c = document.getElementById('mycanvas');
    ctx = c.getContext("2d");
    ctx.clearRect(0,0,c.width,c.height);
    g = null;
    g = {maze: []};
    for (var id = 0; id < mazeColumns * mazeRows; ++id) {
        g.maze[id] = 15;
    }
    
    // Generate g.maze 
    generateMaze(Math.floor(Math.random() * mazeColumns),
             Math.floor(Math.random() * mazeRows));

    // Remove set 
    for (var id = 0; id < mazeColumns * mazeRows; ++id) {
        g.maze[id] = g.maze[id] ^ SET
    }
    for (var i=0; i<mazeColumns; i++)
    {
        for (var j=0; j<mazeRows; j++){
            drawSquare(i*42.6,120-j*30,g.maze[getId(i,j)]);
        }
    }
}