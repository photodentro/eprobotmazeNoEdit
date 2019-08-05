var endX;
var endY;
var startX;
var startY;
var maze = [];
var mazeColumns = 7;
var mazeRows = 5;


var NORTH = 1
var WEST = 2
var SOUTH = 4
var EAST = 8
var SET = 16

draw = {};
draw[ 0] = "..."
draw[ 1] = ".-.";
draw[ 2] = "|..";
draw[ 4] = "._.";
draw[ 8] = "..|";
draw[ 3] = "|-.";
draw[ 5] = ".*."
draw[ 9] = ".-|";
draw[ 6] = "|_.";
draw[10] = "|.|";
draw[11] = "|-|";
draw[12] = "._|";
draw[ 7] = "|*.";
draw[13] = ".*|";
draw[14] = "|_|";
draw[15] = "|*|";

function check(x, y) {
    if (maze[getId(x, y)] & SET)
        return 1
    return 0
}

function getId(x, y) {
    return x + y * mazeColumns
}


function isPossible(x, y) {
    var wall = maze[getId(x, y)]
    var pos = []
    wall = wall ^ SET
    pos[0] = 0
    if (x === 0) {
        wall = wall ^ WEST
    }
    if (y === 0) {
        wall = wall ^ NORTH
    }
    if (x === mazeColumns - 1) {
        wall = wall ^ EAST
    }
    if (y === mazeRows - 1) {
        wall = wall ^ SOUTH
    }
    if (wall & EAST) {
        if (check(x + 1, y) === 0) {
            pos[0] = pos[0] + 1
            pos[pos[0]] = EAST
        }
    }
    if (wall & SOUTH) {
        if (check(x, y + 1) === 0) {
            pos[0] = pos[0] + 1
            pos[pos[0]] = SOUTH
        }
    }
    if (wall & WEST) {
        if (check(x - 1, y) === 0) {
            pos[0] = pos[0] + 1
            pos[pos[0]] = WEST
        }
    }
    if (wall & NORTH) {
        if (check(x, y - 1) === 0) {
            pos[0] = pos[0] + 1
            pos[pos[0]] = NORTH
        }
    }
    return pos
}

function generateMaze(x, y) {
    maze[getId(x, y)] = maze[getId(x, y)] + SET;
    var po = isPossible(x, y);
    while (po[0] > 0) {
        var ran = po[Math.floor(Math.random() * po[0]) + 1]
        switch (ran) {
        case EAST:
            maze[getId(x, y)] = maze[getId(x, y)] ^ EAST
            maze[getId(x + 1, y)] = maze[getId(x + 1, y)] ^ WEST
            generateMaze(x + 1, y)
            break
        case SOUTH:
            maze[getId(x, y)] = maze[getId(x, y)] ^ SOUTH
            maze[getId(x, y + 1)] = maze[getId(x, y + 1)] ^ NORTH
            generateMaze(x, y + 1)
            break
        case WEST:
            maze[getId(x, y)] = maze[getId(x, y)] ^ WEST
            maze[getId(x - 1, y)] = maze[getId(x - 1, y)] ^ EAST
            generateMaze(x - 1, y)
            break
        case NORTH:
            maze[getId(x, y)] = maze[getId(x, y)] ^ NORTH
            maze[getId(x, y - 1)] = maze[getId(x, y - 1)] ^ SOUTH
            generateMaze(x, y - 1)
            break
        }
        po = isPossible(x, y)
    }
}



/* Build maze */
maze = []
for (var id = 0; id < mazeColumns * mazeRows; ++id) {
    maze[id] = 15
}

/* Generate maze */
generateMaze(Math.floor(Math.random() * mazeColumns),
             Math.floor(Math.random() * mazeRows))

    /* Remove set */
for (id = 0; id < mazeColumns * mazeRows; ++id) {
    maze[id] = maze[id] ^ SET
}


startX = 0;
startY = Math.floor(Math.random() * mazeRows); 

//that's the door x,y in the original
endX = mazeColumns - 1;
endY = Math.floor(Math.random() * mazeRows);

for (var i=0; i<mazeRows; i++){
    aLine = '';
    for (var j=0; j<mazeColumns; j++){
        if ((j == endX) && (i == endY)){
            aLine += " % ";
        }
        else{
            if ((j == startX) && (i == startY)){
                aLine += " % ";
            }
            else{
                aLine += draw[maze[getId(j,i)]];
            }
        }
        
    }
    console.log(aLine);
}



var solved = false;

visited = [];
for (var id = 0; id < mazeColumns * mazeRows; ++id) {
    visited[id] = false;
}

correctPath = [];
for (var id = 0; id < mazeColumns * mazeRows; ++id) {
    correctPath[id] = false;
}


function printV(){
    var aLine;
    for (var x = 0; x < mazeRows; x++){
        aLine ='';
        for (var y = 0; y<mazeColumns; y++){
            aLine += visited[getId(x,y)]?"+":"-";
        }
        console.log(aLine);
    }
    console.log("");
    console.log("");
    console.log("");
    console.log("");
}

var path = [];
function addToPath(cx,cy){
    path.unshift({x:cx,y:cy});
}
function recursiveSolve(x, y) {
    if ((x == endX) && (y == endY)){
        correctPath[getId(x,y)] = "***";
        addToPath(x,y);
        return(true); // If you reached the end
    } 
    if (visited[getId(x,y)]){
        return(false);
    }
    visited[getId(x,y)] = true;
    if ((x != 0) && ((maze[getId(x,y)] & WEST) == 0)){ // Checks if i can go left
        if (recursiveSolve(x-1, y)) { // Recalls method one to the left
            correctPath[getId(x,y)] = "<<<"; // Sets that path value to true;
            addToPath(x,y);
            return(true);
        }
    }
    if ((x != mazeColumns - 1) && ((maze[getId(x,y)] & EAST) == 0)){ // Checks if i can go right
        if (recursiveSolve(x+1, y)) { // Recalls method one to the right
            correctPath[getId(x,y)] = ">>>";
            addToPath(x,y);
            return(true);
        }
    }
    if ((y != 0) && ((maze[getId(x,y)] & NORTH) ==0)) { // Checks if i can go up
        if (recursiveSolve(x, y-1)) { // Recalls method one up
            correctPath[getId(x,y)] = "^^^";
            addToPath(x,y);
            return(true);
        }
    }
    if ((y != mazeRows - 1) && ((maze[getId(x,y)] & SOUTH)==0)){ // Checks if i can go down
        if (recursiveSolve(x, y+1)) { // Recalls method one down
            correctPath[getId(x,y)] = "|||";
            addToPath(x,y);
            return(true);
        }
    }
    return false;
}

recursiveSolve(startX,startY);

for (var i=0; i<mazeRows; i++){
    aLine = '';
    for (var j=0; j<mazeColumns; j++){
        aLine += correctPath[getId(j,i)]?correctPath[getId(j,i)]:"   ";
    }
    console.log(aLine);
}

console.log(path);

function drawSquare(squareX,squareY,squareCode){
    /*
    draw[ 0] = "..."
    draw[ 1] = ".-.";
    draw[ 2] = "|..";
    draw[ 4] = "._.";
    draw[ 8] = "..|";
    draw[ 3] = "|-.";
    draw[ 5] = ".*."
    draw[ 9] = ".-|";
    draw[ 6] = "|_.";
    draw[10] = "|.|";
    draw[11] = "|-|";
    draw[12] = "._|";
    draw[ 7] = "|*.";
    draw[13] = ".*|";
    draw[14] = "|_|";
    draw[15] = "|*|";
*/
    var c = document.getElementById("mycanvas");
    var ctx = c.getContext("2d");
    var gWidth = 42.6;//must be the scaling
    var gHeight = 30;
    ctx.lineWidth = 0.2;
    ctx.setLineDash([3]);
    ctx.strokeRect(squareX,squareY,gWidth,gHeight);
    ctx.lineWidth = 3;
    switch(squareCode){
        case 1: ctx.setLineDash([]); 
                ctx.beginPath(); 
                ctx.moveTo(squareX,squareY+gHeight);
                ctx.lineTo(squareX+gWidth,squareY+gHeight);
                ctx.stroke();
                break;
        case 2: ctx.setLineDash([]);
                ctx.beginPath();
                ctx.moveTo(squareX,squareY);
                ctx.lineTo(squareX,squareY+gHeight);
                ctx.stroke();
                break;
        case 3: ctx.setLineDash([]);
                ctx.moveTo(squareX,squareY);
                ctx.lineTo(squareX,squareY+gHeight);
                ctx.lineTo(squareX+gWidth,squareY+gHeight);
                ctx.stroke();
                break;
        case 4: ctx.setLineDash([]);
                ctx.moveTo(squareX,squareY);
                ctx.lineTo(squareX+gWidth,squareY);
                ctx.stroke();
                break;
        case 5: ctx.setLineDash([]);
                ctx.moveTo(squareX,squareY);
                ctx.lineTo(squareX+gWidth,squareY);
                ctx.moveTo(squareX,squareY+gHeight);
                ctx.lineTo(squareX+gWidth,squareY+gHeight);
                ctx.stroke();
                break;
        case 6: ctx.setLineDash([]);
                ctx.moveTo(squareX,squareY);
                ctx.lineTo(squareX+gWidth,squareY);
                ctx.moveTo(squareX,squareY);
                ctx.lineTo(squareX,squareY+gHeight);
                ctx.stroke();
                break;
        case 7: ctx.setLineDash([]);
                ctx.moveTo(squareX,squareY);
                ctx.lineTo(squareX+gWidth,squareY);
                ctx.moveTo(squareX,squareY);
                ctx.lineTo(squareX,squareY+gHeight);
                ctx.moveTo(squareX,squareY+gHeight);
                ctx.lineTo(squareX+gWidth,squareY+gHeight);
                ctx.stroke();
                break;
        case 8: ctx.setLineDash([]);
                ctx.moveTo(squareX+gWidth,squareY);
                ctx.lineTo(squareX+gWidth,squareY+gHeight);
                ctx.stroke();
                break;
        case 9: ctx.setLineDash([]);
                ctx.moveTo(squareX+gWidth,squareY);
                ctx.lineTo(squareX+gWidth,squareY+gHeight);
                ctx.moveTo(squareX,squareY+gHeight);
                ctx.lineTo(squareX+gWidth,squareY+gHeight);
                ctx.stroke();
                break;
        case 10:ctx.setLineDash([]);
                ctx.moveTo(squareX+gWidth,squareY);
                ctx.lineTo(squareX+gWidth,squareY+gHeight);
                ctx.moveTo(squareX,squareY);
                ctx.lineTo(squareX,squareY+gHeight);
                ctx.stroke();
                break;
        case 11:ctx.setLineDash([]);
                ctx.moveTo(squareX+gWidth,squareY);
                ctx.lineTo(squareX+gWidth,squareY+gHeight);
                ctx.moveTo(squareX,squareY);
                ctx.lineTo(squareX,squareY+gHeight);
                ctx.lineTo(squareX+gWidth,squareY+gHeight);
                ctx.stroke();
                break;
        case 12:ctx.setLineDash([]);
                ctx.moveTo(squareX+gWidth,squareY);
                ctx.lineTo(squareX+gWidth,squareY+gHeight);
                ctx.moveTo(squareX,squareY);
                ctx.lineTo(squareX+gWidth,squareY);
                ctx.stroke();
                break;
        case 13:ctx.setLineDash([]);
                ctx.moveTo(squareX+gWidth,squareY);
                ctx.lineTo(squareX+gWidth,squareY+gHeight);
                ctx.moveTo(squareX,squareY);
                ctx.lineTo(squareX+gWidth,squareY);
                ctx.moveTo(squareX,squareY+gHeight);
                ctx.lineTo(squareX+gWidth,squareY+gHeight);
                ctx.stroke();
                break;
        case 14:ctx.setLineDash([]);
                ctx.moveTo(squareX+gWidth,squareY);
                ctx.lineTo(squareX+gWidth,squareY+gHeight);
                ctx.moveTo(squareX,squareY);
                ctx.lineTo(squareX+gWidth,squareY);
                ctx.moveTo(squareX,squareY);
                ctx.lineTo(squareX,squareY+gHeight);
                ctx.stroke();
                break;
        case 15:ctx.setLineDash([]);
                ctx.rect(squareX,squareY,gWidth,gHeight);
                ctx.stroke();
                break;

    }
    ctx.stroke();
}


function canvasDraw(){
    c = document.getElementById('mycanvas');
    ctx = c.getContext("2d");
    ctx.clearRect(0,0,c.width,c.height);


    for (var i=0; i<mazeColumns; i++)
    {
        for (var j=0; j<mazeRows; j++){
            drawSquare(i*42.6,120-j*30,maze[getId(i,j)]);
        }
    }
    }