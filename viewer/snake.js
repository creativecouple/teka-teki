/*
 *  Copyright (C) 2015 Bernhard Seckinger
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of version 3 of the GNU General Public License as
 *  published by the Free Software Foundation.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

/** Add own namespace to avoid conflicts. */
teka.viewer.snake = {};

/** Some constants. */
teka.viewer.snake.Defaults = {
    NONE: 0,
    FULL: 1,
    EMPTY: 2,
    BLOCK: -1
};

/** Constructor */
teka.viewer.snake.SnakeViewer = function(data)
{
    teka.viewer.PuzzleViewer.call(this,data);

    this.x = 1;
    this.y = 1;
};
teka.extend(teka.viewer.snake.SnakeViewer,teka.viewer.PuzzleViewer);

//////////////////////////////////////////////////////////////////

/** Initialize this viewer width the PSData object provided. */
teka.viewer.snake.SnakeViewer.prototype.initData = function(data)
{
    this.X = parseInt(data.get('X'),10);
    this.Y = parseInt(data.get('Y'),10);
    this.MAX = data.get('max');
    if (this.MAX!==false) {
        this.MAX = parseInt(this.MAX,10);
    }
    var digits = data.get('digits');
    digits = digits===false?2:parseInt(data.get('digits'),10);
    this.asciiToData(data.get('puzzle'),digits);
    this.asciiToSolution(data.get('solution'),digits);

    this.f = teka.new_array([this.X,this.Y],0);
    this.c = teka.new_array([this.X,this.Y],0);
    this.error = teka.new_array([this.X,this.Y],false);
    this.error_top = teka.new_array([this.X],false);
    this.error_left = teka.new_array([this.Y],false);
    this.nr = teka.new_array([this.X,this.Y],0);
    this.auto_nr = teka.new_array([this.X,this.Y,0],false);
};

/** Read puzzle from ascii art. */
teka.viewer.snake.SnakeViewer.prototype.asciiToData = function(ascii,d)
{
    if (ascii===false) {
        return;
    }

    var grid = this.asciiToArray(ascii);

    this.puzzle = teka.new_array([this.X,this.Y],0);
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            if (grid[d*(i+1)][j+1]==teka.ord('#')) {
                this.puzzle[i][j] = teka.viewer.snake.Defaults.BLOCK;
            } else {
                this.puzzle[i][j] = this.getNr(grid,d*(i+1),j+1,d);
            }
        }
    }

    this.topdata = teka.new_array([this.X],0);
    for (var i=0;i<this.X;i++) {
        this.topdata[i] = this.getNr(grid,d*(i+1),0,d);
    }

    this.leftdata = teka.new_array([this.Y],0);
    for (var j=0;j<this.Y;j++) {
        this.leftdata[j] = this.getNr(grid,0,j+1,d);
    }
};

/** Read solution from ascii art. */
teka.viewer.snake.SnakeViewer.prototype.asciiToSolution = function(ascii,d)
{
    if (ascii===false) {
        return;
    }

    var grid = this.asciiToArray(ascii);

    this.solution = teka.new_array([this.X,this.Y],0);
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            if (grid[d*i][j]==teka.ord('#')) {
                this.solution[i][j] = teka.viewer.snake.Defaults.BLOCK;
            } else {
                this.solution[i][j] = this.getNr(grid,d*i,j,d);
            }
        }
    }
};

/** Add solution. */
teka.viewer.snake.SnakeViewer.prototype.addSolution = function()
{
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            if (this.solution[i][j]===teka.viewer.snake.Defaults.BLOCK) {
                this.f[i][j] = teka.viewer.snake.Defaults.EMPTY;
            } else if (this.solution[i][j]!==false) {
                this.f[i][j] = teka.viewer.snake.Defaults.FULL;
                this.nr[i][j] = this.solution[i][j];
            } else {
                this.f[i][j] = teka.viewer.snake.Defaults.NONE;
            }
        }
    }
};

//////////////////////////////////////////////////////////////////

/** Returns a small example. */
teka.viewer.snake.SnakeViewer.prototype.getExample = function()
{
    return '/format 1\n/type (snake)\n/sol false\n/X 5\n/Y 5\n/max 12'
        +'\n/puzzle [ (   3 2 4 2 1) ( 3         1) ( 3 6        ) ( 1          )'
        +' ( 3          ) ( 2      12  ) ]'
        +'\n/solution [ (     3 2 1) ( 6 5 4    ) ( 7        ) ( 8 910    ) (    1112  ) ]';
};

/** Returns a list of automatically generated properties. */
teka.viewer.snake.SnakeViewer.prototype.getProperties = function()
{
    return [teka.translate('generic_size',[this.X+'x'+this.Y])];
};

//////////////////////////////////////////////////////////////////

/** Reset the whole diagram. */
teka.viewer.snake.SnakeViewer.prototype.reset = function()
{
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            this.f[i][j]=0;
            this.nr[i][j]=0;
        }
    }
    this.calculateNumbers();
};

/** Reset the error marks. */
teka.viewer.snake.SnakeViewer.prototype.clearError = function()
{
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            this.error[i][j] = false;
        }
    }
    for (var i=0;i<this.X;i++) {
        this.error_top[i] = false;
    }
    for (var j=0;j<this.Y;j++) {
        this.error_left[j] = false;
    }
};

/** Copy digits colored with this.color to color. */
teka.viewer.snake.SnakeViewer.prototype.copyColor = function(color)
{
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            if (this.c[i][j]==this.color) {
                this.c[i][j] = color;
            }
        }
    }
};

/** Delete all digits with color. */
teka.viewer.snake.SnakeViewer.prototype.clearColor = function(color)
{
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            if (this.c[i][j]==color) {
                this.f[i][j] = 0;
                this.nr[i][j] = 0;
            }
        }
    }
    this.calculateNumbers();
};

/** Save current state. */
teka.viewer.snake.SnakeViewer.prototype.saveState = function()
{
    var f = teka.new_array([this.X,this.Y],0);
    var c = teka.new_array([this.X,this.Y],0);
    var nr = teka.new_array([this.X,this.Y],0);
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            f[i][j] = this.f[i][j];
            c[i][j] = this.c[i][j];
            nr[i][j] = this.nr[i][j];
        }
    }

    return { f:f, c:c, nr:nr };
};

/** Load state. */
teka.viewer.snake.SnakeViewer.prototype.loadState = function(state)
{
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            this.f[i][j] = state.f[i][j];
            this.c[i][j] = state.c[i][j];
            this.nr[i][j] = state.nr[i][j];
        }
    }
    this.calculateNumbers();
};

//////////////////////////////////////////////////////////////////

/** Check, if the solution is correct. */
teka.viewer.snake.SnakeViewer.prototype.check = function()
{
    var X = this.X;
    var Y = this.Y;

    // copy givens
    var check = teka.new_array([X,Y],false);
    for (var i=0;i<X;i++) {
        for (var j=0;j<Y;j++) {
            if (this.puzzle[i][j]==teka.viewer.snake.Defaults.BLOCK) {
                check[i][j] = false;
            } else if (this.puzzle[i][j]>0) {
                check[i][j] = true;
            } else {
                check[i][j] = this.f[i][j]==teka.viewer.snake.Defaults.FULL;
            }
        }
    }

    // check if the snake touches itself
    for (var i=0;i<X-1;i++) {
        for (var j=0;j<Y-1;j++) {
            if (check[i][j] && check[i+1][j+1] && !check[i+1][j] && !check[i][j+1]) {
                this.error[i][j] = true;
                this.error[i+1][j+1] = true;
                return 'snake_touch';
            }
            if (check[i][j+1] && check[i+1][j] && !check[i+1][j+1] && !check[i][j]) {
                this.error[i][j+1] = true;
                this.error[i+1][j] = true;
                return 'snake_touch';
            }
            if (check[i][j] && check[i+1][j] && check[i][j+1] && check[i+1][j+1]) {
                this.error[i][j] = true;
                this.error[i+1][j] = true;
                this.error[i][j+1] = true;
                this.error[i+1][j+1] = true;
                return 'snake_touch';
            }
        }
    }

    // check if snake has anomalies like several heads or crossings
    var head = [];
    var single = [];
    for (var i=0;i<X;i++) {
        for (var j=0;j<Y;j++) {
            if (check[i][j]) {
                var az = 0;
                if (i>0 && check[i-1][j]) {
                    az++;
                }
                if (i<X-1 && check[i+1][j]) {
                    az++;
                }
                if (j>0 && check[i][j-1]) {
                    az++;
                }
                if (j<Y-1 && check[i][j+1]) {
                    az++;
                }

                if (az==1) {
                    head.push({x:i,y:j});
                } else if (az===0) {
                    single.push({x:i,y:j});
                } else if (az!=2) {
                    this.error[i][j] = true;
                    return 'snake_branch';
                }
            }
        }
    }

    if (single.length!=1 || head.length!=0) {
        if (head.length+2*single.length>2) {
            for (var k=0;k<head.length;k++) {
                this.error[head[k].x][head[k].y] = true;
            }
            for (var k=0;k<single.length;k++) {
                this.error[single[k].x][single[k].y] = true;
            }
            return 'snake_too_much_heads';
        }
        if (head.length===0) {
            return 'snake_no_head';
        }
    }

    // check numbers at the left
    for (var j=0;j<Y;j++) {
        if (this.leftdata[j]===false) {
            continue;
        }

        var c = 0;
        for (var i=0;i<X;i++) {
            if (check[i][j]) {
                c++;
            }
        }

        if (c!=this.leftdata[j]) {
            this.error_left[j] = true;
            for (var i=0;i<X;i++) {
                if (check[i][j]) {
                    this.error[i][j] = true;
                }
            }
            return 'snake_row_count';
        }
    }

    // check numbers at the top
    for (var i=0;i<X;i++) {
        if (this.topdata[i]===false) {
            continue;
        }

        var c = 0;
        for (var j=0;j<Y;j++) {
            if (check[i][j]) {
                c++;
            }
        }

        if (c!=this.topdata[i]) {
            this.error_top[i] = true;
            for (var j=0;j<Y;j++) {
                if (check[i][j]) {
                    this.error[i][j] = true;
                }
            }
            return 'snake_column_count';
        }
    }

    // check if the length of the snake fits
    if (this.MAX!==false) {
        var az = 0;
        for (var i=0;i<X;i++) {
            for (var j=0;j<Y;j++) {
                if (check[i][j]) {
                    az++;
                }
            }
        }

        if (az!=this.MAX) {
            for (var i=0;i<X;i++) {
                for (var j=0;j<Y;j++) {
                    if (check[i][j]) {
                        this.error[i][j] = true;
                    }
                }
            }
            return {text:'snake_length_wrong',param:[az,this.MAX]};
        }
    }

    // Snake of length 1.
    if (single.length==1) {
        if (this.puzzle[single[0].x][single[0].y]>0) {
            this.error[single[0].x][single[0].y] = true;
            return 'snake_numbers_wrong';
        }
        return true;
    }

    var s1 = this.fillSnake(check,head[0].x,head[0].y);
    var s2 = this.fillSnake(check,head[1].x,head[1].y);

    var ok1 = true;
    var ok2 = true;
    for (var i=0;i<X;i++) {
        for (var j=0;j<Y;j++) {
            if (this.puzzle[i][j]>0 && this.puzzle[i][j]!=s1[i][j]) {
                ok1 = false;
            }
            if (this.puzzle[i][j]>0 && this.puzzle[i][j]!=s2[i][j]) {
                ok2 = false;
            }
        }
    }

    if (!ok1 && !ok2) {
        for (var i=0;i<X;i++) {
            for (var j=0;j<Y;j++) {
                if (this.puzzle[i][j]>0 && this.puzzle[i][j]!=s1[i][j]) {
                    this.error[i][j] = true;
                }
            }
        }
        return 'snake_numbers_wrong';
    }

    return true;
};

teka.viewer.snake.SnakeViewer.prototype.fillSnake = function(check, x, y)
{
    var result = teka.new_array([this.X,this.Y],0);

    var nr = 0;
    while (true) {
        result[x][y] = ++nr;
        if (x>0 && check[x-1][y] && result[x-1][y]===0) {
            x--;
            continue;
        }
        if (x<this.X-1 && check[x+1][y] && result[x+1][y]===0) {
            x++;
            continue;
        }
        if (y>0 && check[x][y-1] && result[x][y-1]===0) {
            y--;
            continue;
        }
        if (y<this.Y-1 && check[x][y+1] && result[x][y+1]===0) {
            y++;
            continue;
        }
        break;
    }

    return result;
};

//////////////////////////////////////////////////////////////////

/**
 * Calculate the maximum scale, that can be used with the current
 * extent. This is used by the layout managers to decide which way
 * the puzzle is displayed - and if it's possible at all.
 *
 * Also calculates some items, that are needed in the print function,
 * and do not need to be calculated again everytime. That is the
 * translation of the text at the bottom, the delta for the fonts
 * to place the digits vertically centered. And the deltas to move the
 * puzzle in the center of the provided space.
 *
 * Return value is an object with width and height of the used space,
 * and, most important, the scale.
 */
teka.viewer.snake.SnakeViewer.prototype.setMetrics = function(g)
{
    this.scale = Math.floor(Math.min((this.width-2)/(this.X+1),
                                     (this.height-2-(this.textHeight+2))/(this.Y+1)));
    var realwidth = (this.X+1)*this.scale+2;
    var realheight = (this.Y+1)*this.scale+2+this.textHeight+2;

    this.bottomText = this.MAX===false
        ?teka.translate('snake_length_unknown')
        :teka.translate('snake_length',[this.MAX]);
    g.font = 'bold '+this.textHeight+'px sans-serif';
    var textwidth = g.measureText(this.bottomText).width+1;
    realwidth = Math.max(realwidth,textwidth+this.scale);

    this.deltaX = Math.floor((this.width-realwidth)/2)+0.5;
    this.deltaY = Math.floor((this.height-realheight)/2)+0.5;
    this.borderX = this.scale;
    this.borderY = this.scale;

    this.font = teka.getFontData(Math.round(this.scale/2)+'px sans-serif',this.scale);
    this.boldfont = teka.getFontData('bold '+Math.round(this.scale/2)+'px sans-serif',this.scale);
    this.smallfont = teka.getFontData(Math.round(this.scale/3)+'px sans-serif',this.scale);

    if (realwidth>this.width || realheight>this.height) {
        this.scale=false;
    }
    return {width:realwidth,height:realheight,scale:this.scale};
};

/** Paints the diagram. */
teka.viewer.snake.SnakeViewer.prototype.paint = function(g)
{
    var X = this.X;
    var Y = this.Y;
    var S = this.scale;

    g.save();
    g.translate(this.deltaX,this.deltaY);

    g.fillStyle = '#fff';
    g.fillRect(S,S,X*S,Y*S);

    // paint background of the cells
    for (var i=0;i<X;i++) {
        for (var j=0;j<Y;j++) {
            g.fillStyle = this.isBlinking()?
                this.getBlinkColor(i,j,X,this.f[i][j]):
                (this.error[i][j]?'#f00':'#fff');
            g.fillRect((i+1)*S,(j+1)*S,S,S);
            if (this.isBlinking() &&
                (this.puzzle[i][j]!==false ||
                this.f[i][j]==teka.viewer.snake.Defaults.FULL)) {
                g.fillStyle = this.getBlinkColor(j,i,X,this.f[i][j]);
                teka.fillOval(g,(i+1)*S+S/2,(j+1)*S+S/2,S/2-2);
            }
        }
    }

    g.fillStyle = '#000';
    g.lineWidth = 3;
    g.strokeRect(S,S,X*S,Y*S);
    g.lineWidth = 1;

    for (var i=1;i<=X+1;i++) {
        teka.drawLine(g,i*S,S,i*S,(Y+1)*S);
    }
    for (var j=1;j<=Y+1;j++) {
        teka.drawLine(g,S,j*S,(X+1)*S,j*S);
    }

    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.font = this.font.font;

    // paint the numbers at the left
    for (var j=0;j<Y;j++) {
        if (this.leftdata[j]===false) {
            continue;
        }
        if (this.error_left[j]) {
            g.fillStyle = '#f00';
            teka.fillOval(g,S/2,(j+1)*S+S/2,S/4);
            g.strokeStyle = '#000';
            teka.strokeOval(g,S/2,(j+1)*S+S/2,S/4);
        }
        g.fillStyle = '#000';
        g.fillText(this.leftdata[j],S/2,(j+1)*S+S/2+this.font.delta);
    }

    // paint the numbers at the top
    for (var i=0;i<X;i++) {
        if (this.topdata[i]===false) {
            continue;
        }
        if (this.error_top[i]) {
            g.fillStyle = '#f00';
            teka.fillOval(g,(i+1)*S+S/2,S/2,S/4);
            g.strokeStyle = '#000';
            teka.strokeOval(g,(i+1)*S+S/2,S/2,S/4);
        }
        g.fillStyle = '#000';
        g.fillText(this.topdata[i],(i+1)*S+S/2,S/2+this.font.delta);
    }

    for (var i=0;i<X;i++) {
        for (var j=0;j<Y;j++) {
            if (this.puzzle[i][j]==teka.viewer.snake.Defaults.BLOCK) {
                g.strokeStyle = '#000';
                g.lineWidth = 2;
                teka.drawLine(g,(i+1)*S+S/4,(j+1)*S+S/2,(i+2)*S-S/4,(j+1)*S+S/2);
                g.lineWidth = 1;
                continue;
            }

            if (this.puzzle[i][j]!==false) {
                g.strokeStyle = '#000';
                teka.strokeOval(g,(i+1)*S+S/2,(j+1)*S+S/2,S/2-2);
                g.fillStyle = '#000';
                g.font = this.boldfont.font;
                g.fillText(this.puzzle[i][j],(i+1)*S+S/2,(j+1)*S+S/2+this.boldfont.delta);
                continue;
            }

            if (this.f[i][j]==teka.viewer.snake.Defaults.FULL) {
                g.strokeStyle = this.getColorString(this.c[i][j]);
                teka.strokeOval(g,(i+1)*S+S/2,(j+1)*S+S/2,S/2-2);
                if (this.nr[i][j]>0) {
                    g.fillStyle = '#000';
                    g.font = this.font.font;
                    g.fillText(this.nr[i][j],(i+1)*S+S/2,(j+1)*S+S/2+this.font.delta);
                    continue;
                }
                if (this.auto_nr[i][j].length==1) {
                    g.fillStyle = '#888';
                    g.font = this.font.font;
                    g.fillText(this.auto_nr[i][j][0],(i+1)*S+S/2,(j+1)*S+S/2+this.font.delta);
                    continue;
                }
                if (this.auto_nr[i][j].length==2) {
                    var a = this.auto_nr[i][j][0];
                    var b = this.auto_nr[i][j][1];
                    if (b<a) {
                        a = this.auto_nr[i][j][1];
                        b = this.auto_nr[i][j][0];
                    }
                    g.fillStyle = '#888';
                    g.font = this.smallfont.font;
                    g.fillText(a,(i+1)*S+S/2,(j+1)*S+S/4+this.smallfont.delta);
                    g.fillText(b,(i+1)*S+S/2,(j+2)*S-S/4+this.smallfont.delta);
                    g.strokeStyle = '#888';
                    teka.drawLine(g,(i+1)*S+2,(j+1)*S+S/2,(i+2)*S-2,(j+1)*S+S/2);
                    continue;
                }
                continue;
            }

            if (this.f[i][j]==teka.viewer.snake.Defaults.EMPTY) {
                g.strokeStyle = this.getColorString(this.c[i][j]);
                teka.drawLine(g,(i+1)*S+S/4,(j+1)*S+S/2,(i+2)*S-S/4,(j+1)*S+S/2);
            }
        }
    }

    // paint text below the grid
    g.textAlign = 'left';
    g.textBaseline = 'top';
    g.fillStyle = this.textcolor;
    g.font = 'bold '+this.textHeight+'px sans-serif';
    g.fillText(this.bottomText,S,(Y+1)*S+4);

    // paint cursor
    if (this.mode==teka.viewer.Defaults.NORMAL) {
        g.strokeStyle='#f00';
        g.lineWidth = 2;
        g.strokeRect(S*(this.x+1)+3.5,S*(this.y+1)+3.5,S-7,S-7);
    }

    g.restore();
};

//////////////////////////////////////////////////////////////////

/** Handles mousemove event. */
teka.viewer.snake.SnakeViewer.prototype.processMousemoveEvent = function(xc, yc, pressed)
{
    xc -= this.deltaX+this.borderX;
    yc -= this.deltaY+this.borderY;

    var oldx = this.x;
    var oldy = this.y;

    this.x = Math.floor(xc/this.scale);
    this.y = Math.floor(yc/this.scale);

    if (this.x<0) {
        this.x=0;
    }
    if (this.y<0) {
        this.y=0;
    }
    if (this.x>=this.X) {
        this.x=this.X-1;
    }
    if (this.y>=this.Y) {
        this.y=this.Y-1;
    }

    if (this.startx!=this.x || this.starty!=this.y) {
        this.moved = true;
    }

    if (pressed) {
        this.processMousedraggedEvent(xc,yc);
        return true;
    }

    return this.x!=oldx || this.y!=oldy;
};

/** Handles mousedown event. */
teka.viewer.snake.SnakeViewer.prototype.processMousedownEvent = function(xc, yc)
{
    var erg = this.processMousemoveEvent(xc,yc);

    if (this.x<0 || this.y<0 || this.x>=this.X || this.y>=this.Y) {
        return erg;
    }

    this.startx = this.x;
    this.starty = this.y;
    this.moved = false;

    return true;
};

/** Handles mouseup event. */
teka.viewer.snake.SnakeViewer.prototype.processMouseupEvent = function(xc, yc)
{
    this.processMousemoveEvent(xc,yc,false);

    if (!this.moved) {
        this.set(this.x,this.y,(this.f[this.x][this.y]+1)%3);
    }

    this.startx = false;
    this.starty = false;
    this.moved = false;

    return true;
};

/**
 * Handles pseudo event 'mousedragged'
 * Horizontal and vertical lines are treated separately, as
 * much faster algorithms can be applied and they should make up the
 * majority of use cases.
 */
teka.viewer.snake.SnakeViewer.prototype.processMousedraggedEvent = function(xc, yc)
{
    if (this.startx===false || this.starty===false) {
        this.startx = this.x;
        this.starty = this.y;
        this.moved = false;
        return;
    }

    var lastx = this.startx;
    var lasty = this.starty;
    this.startx = this.x;
    this.starty = this.y;

    if (this.x==lastx && this.y==lasty) {
        return;
    }

    if (this.y==lasty) {
        if (this.x<lastx) {
            for (var i=this.x;i<=lastx;i++) {
                if (this.puzzle[i][this.y]===false) {
                    this.set(i,this.y,teka.viewer.snake.Defaults.FULL);
                }
            }
        } else {
            for (var i=lastx;i<=this.x;i++) {
                if (this.puzzle[i][this.y]===false) {
                    this.set(i,this.y,teka.viewer.snake.Defaults.FULL);
                }
            }
        }
        return;
    }

    if (this.x==lastx) {
        if (this.y<lasty) {
            for (var j=this.y;j<=lasty;j++) {
                if (this.puzzle[this.x][j]===false) {
                    this.set(this.x,j,teka.viewer.snake.Defaults.FULL);
                }
            }
        } else {
            for (var j=lasty;j<=this.y;j++) {
                if (this.puzzle[this.x][j]===false) {
                    this.set(this.x,j,teka.viewer.snake.Defaults.FULL);
                }
            }
        }
        return;
    }

    while (lastx!=this.x && lasty!=this.y)
        {
            if (this.puzzle[lastx][lasty]===false) {
                this.set(lastx,lasty,teka.viewer.snake.Defaults.FULL);
            }
            if (Math.abs(this.x-lastx)>Math.abs(this.y-lasty)) {
                if (this.x>lastx) {
                    lastx++;
                } else {
                    lastx--;
                }
            } else {
                if (this.y>lasty) {
                    lasty++;
                } else {
                    lasty--;
                }
            }
        }

    if (this.puzzle[this.x][this.y]===false) {
        this.set(this.x,this.y,teka.viewer.snake.Defaults.FULL);
    }
};

/** Handles keydown event. */
teka.viewer.snake.SnakeViewer.prototype.processKeydownEvent = function(e)
{
    if (e.key==teka.KEY_DOWN) {
        if (this.y<this.Y-1) {
            this.y++;
            if (e.shift && this.puzzle[this.x][this.y]===false) {
                this.set(this.x,this.y,teka.viewer.snake.Defaults.FULL);
            }
        }
        return true;
    }
    if (e.key==teka.KEY_UP) {
        if (this.y>0) {
            this.y--;
            if (e.shift && this.puzzle[this.x][this.y]===false) {
                this.set(this.x,this.y,teka.viewer.snake.Defaults.FULL);
            }
        }
        return true;
    }
    if (e.key==teka.KEY_RIGHT) {
        if (this.x<this.X-1) {
            this.x++;
            if (e.shift && this.puzzle[this.x][this.y]===false) {
                this.set(this.x,this.y,teka.viewer.snake.Defaults.FULL);
            }
        }
        return true;
    }
    if (e.key==teka.KEY_LEFT) {
        if (this.x>0) {
            this.x--;
            if (e.shift && this.puzzle[this.x][this.y]===false) {
                this.set(this.x,this.y,teka.viewer.snake.Defaults.FULL);
            }
        }
        return true;
    }

    if (this.x<0 || this.x>=this.X || this.y<0 || this.y>=this.Y) {
        return false;
    }

    if (e.key==teka.KEY_HASH || e.key==teka.KEY_Q || e.key==teka.KEY_STAR) {
        this.set(this.x,this.y,teka.viewer.snake.Defaults.FULL);
        return true;
    }

    if (e.key==teka.KEY_MINUS || e.key==teka.KEY_W || e.key==teka.KEY_SLASH) {
        this.set(this.x,this.y,teka.viewer.snake.Defaults.EMPTY);
        return true;
    }

    if (e.key==teka.KEY_SPACE) {
        this.set(this.x,this.y,teka.viewer.snake.Defaults.NONE);
        return true;
    }

    if (this.f[this.x][this.y]!=teka.viewer.snake.Defaults.FULL && e.key>=teka.KEY_1 && e.key<=teka.KEY_9) {
        this.set(this.x,this.y,teka.viewer.snake.Defaults.FULL);
        this.setNr(this.x,this.y,e.key-teka.KEY_0);
        return true;
    }

    if (this.f[this.x][this.y]==teka.viewer.snake.Defaults.FULL && e.key>=teka.KEY_0 && e.key<=teka.KEY_9) {
        var val = e.key-teka.KEY_0;
        if (this.nr[this.x][this.y]===0) {
            this.setNr(this.x,this.y,val);
        } else {
            this.setNr(this.x,this.y,this.nr[this.x][this.y]*10+val);
            if (this.nr[this.x][this.y]>100) {
                this.setNr(this.x,this.y,val);
            }
        }
        return true;
    }

    return false;
};

//////////////////////////////////////////////////////////////////

/** Sets the value of a cell, if the color fits. */
teka.viewer.snake.SnakeViewer.prototype.set = function(x, y, value)
{
    if (this.f[x][y]!=0 && this.c[x][y]!=this.color) {
        return;
    }
    this.f[x][y] = value;
    this.nr[x][y] = 0;
    this.c[x][y] = this.color;
    this.calculateNumbers();
};

/** Sets the number of a cell, if the color fits. */
teka.viewer.snake.SnakeViewer.prototype.setNr = function(x, y, value)
{
    if (this.f[x][y]!=teka.viewer.snake.Defaults.FULL || this.c[x][y]!=this.color) {
        return;
    }
    this.nr[x][y] = value;
    this.calculateNumbers();
};

/** Tries to add automatic calculated numbers. */
teka.viewer.snake.SnakeViewer.prototype.calculateNumbers = function()
{
    this.auto_nr = teka.new_array([this.X,this.Y,0],false);

    var check = teka.new_array([this.X,this.Y],false);
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            if (this.puzzle[i][j]==teka.viewer.snake.Defaults.BLOCK) {
                check[i][j] = false;
            } else if (this.puzzle[i][j]>0) {
                check[i][j] = true;
            } else {
                check[i][j] = this.f[i][j]==teka.viewer.snake.Defaults.FULL;
            }
        }
    }

    var count = teka.new_array([this.X,this.Y],0);
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            if (check[i][j]) {
                if (i>0 && check[i-1][j]) {
                    count[i][j]++;
                }
                if (i<this.X-1 && check[i+1][j]) {
                    count[i][j]++;
                }
                if (j>0 && check[i][j-1]) {
                    count[i][j]++;
                }
                if (j<this.Y-1 && check[i][j+1]) {
                    count[i][j]++;
                }
            }
        }
    }

    var mark = teka.new_array([this.X,this.Y],false);
    var c = 0;
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            if (check[i][j] && mark[i][j]===false) {
                var erg = this.fill(check,mark,count,i,j,++c);
                if (erg[0]>0 || erg[3]>0 || erg[4]>0 || erg[1]!=2) {
                    continue;
                }

                this.addSnake(check,mark,erg[5][0].x,erg[5][0].y,c);
                this.addSnake(check,mark,erg[5][1].x,erg[5][1].y,c);
            }
        }
    }
};

teka.viewer.snake.SnakeViewer.prototype.fill = function(check, mark, count, x, y, value)
{
    if (x<0 || x>=this.X || y<0 || y>=this.Y) {
        return [0,0,0,0,0,[]];
    }
    if (!check[x][y]) {
        return [0,0,0,0,0,[]];
    }
    if (mark[x][y]!==false) {
        return [0,0,0,0,0,[]];
    }

    mark[x][y] = value;

    var e1 = this.fill(check,mark,count,x-1,y,value);
    var e2 = this.fill(check,mark,count,x+1,y,value);
    var e3 = this.fill(check,mark,count,x,y-1,value);
    var e4 = this.fill(check,mark,count,x,y+1,value);

    var erg = [0,0,0,0,0,[]];

    erg[count[x][y]]++;
    if (count[x][y]==1) {
        erg[5].push({x:x,y:y});
    }

    for (var k=0;k<5;k++) {
        erg[k]+=e1[k];
        erg[k]+=e2[k];
        erg[k]+=e3[k];
        erg[k]+=e4[k];
    }

    erg[5] = erg[5].concat(e1[5]);
    erg[5] = erg[5].concat(e2[5]);
    erg[5] = erg[5].concat(e3[5]);
    erg[5] = erg[5].concat(e4[5]);

    return erg;
};

teka.viewer.snake.SnakeViewer.prototype.addSnake = function(check, mark, x, y, value)
{
    var s = this.fillSnake(check,x,y);

    var delta = [];
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            if (mark[i][j]==value) {
                if (this.puzzle[i][j]>0) {
                    delta.push(this.puzzle[i][j]-s[i][j]);
                } else if (this.nr[i][j]>0) {
                    delta.push(this.nr[i][j]-s[i][j]);
                }
            }
        }
    }

    if (delta.length===0) {
        return;
    }

    var tmp = delta[0];
    for (var k=1;k<delta.length;k++) {
        if (delta[k]!=tmp) {
            return;
        }
    }

    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            if (mark[i][j]==value) {
                s[i][j]+=tmp;
                if (s[i][j]<1 || (this.MAX!==false && s[i][j]>this.MAX)) {
                    return;
                }
            }
        }
    }

    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            if (mark[i][j]==value) {
                this.auto_nr[i][j].push(s[i][j]);
            }
        }
    }
};
