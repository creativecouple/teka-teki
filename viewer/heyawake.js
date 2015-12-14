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
teka.viewer.heyawake = {};

/** Some constants. */
teka.viewer.heyawake.Defaults = {
    NONE: 0,
    FULL: 1,
    EMPTY: 2
};

/** Constructor */
teka.viewer.heyawake.HeyawakeViewer = function(data)
{
    teka.viewer.PuzzleViewer.call(this,data);

    this.x = 0;
    this.y = 0;
};
teka.extend(teka.viewer.heyawake.HeyawakeViewer,teka.viewer.PuzzleViewer);

//////////////////////////////////////////////////////////////////

/** Initialize this viewer width the PSData object provided. */
teka.viewer.heyawake.HeyawakeViewer.prototype.initData = function(data)
{
    this.X = parseInt(data.get('X'),10);
    this.Y = parseInt(data.get('Y'),10);
    var digits = data.get('digits');
    digits = digits===false?1:parseInt(data.get('digits'),10);
    this.asciiToData(data.get('puzzle'),digits);
    this.asciiToSolution(data.get('solution'));

    this.f = teka.new_array([this.X,this.Y],0);
    this.c = teka.new_array([this.X,this.Y],0);
    this.error = teka.new_array([this.X,this.Y],false);
};

/** Read puzzle from ascii art. */
teka.viewer.heyawake.HeyawakeViewer.prototype.asciiToData = function(ascii, d)
{
    if (ascii===false) {
        return;
    }

    var grid = this.asciiToArray(ascii);

    this.puzzle = teka.new_array([this.X,this.Y],0);
    var co = 0;
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            if (this.puzzle[i][j]===0) {
                this.fillArea(grid,i,j,++co,d);
            }
        }
    }

    this.givens = teka.new_array([this.X,this.Y],0);
    this.numbers = teka.new_array([this.X,this.Y],-1);
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            if (grid[(d+1)*i+d][2*j+1]==teka.ord('#')) {
                this.givens[i][j] = teka.viewer.heyawake.Defaults.FULL;
            } else if (grid[(d+1)*i+d][2*j+1]==teka.ord('-')) {
                this.givens[i][j] = teka.viewer.heyawake.Defaults.EMPTY;
            } else {
                var nr = this.getNr(grid,(d+1)*i+1,2*j+1,d);
                if (nr!==false) {
                    this.numbers[i][j] = nr;
                }
            }
        }
    }
};

/** Floodfill the areas starting with x,y. */
teka.viewer.heyawake.HeyawakeViewer.prototype.fillArea = function(c, x, y, w, d)
{
    if (x<0 || y<0 || x>=this.X || y>=this.Y) {
        return;
    }
    if (this.puzzle[x][y]!=0) {
        return;
    }

    this.puzzle[x][y] = w;

    if (c[(d+1)*x+d+1][2*y+1]!=teka.ord('|')) {
        this.fillArea(c,x+1,y,w,d);
    }
    if (c[(d+1)*x][2*y+1]!=teka.ord('|')) {
        this.fillArea(c,x-1,y,w,d);
    }
    if (c[(d+1)*x+d][2*y+2]!=teka.ord('-')) {
        this.fillArea(c,x,y+1,w,d);
    }
    if (c[(d+1)*x+d][2*y]!=teka.ord('-')) {
        this.fillArea(c,x,y-1,w,d);
    }
};

/** Read solution from ascii art. */
teka.viewer.heyawake.HeyawakeViewer.prototype.asciiToSolution = function(ascii)
{
    if (ascii===false) {
        return;
    }

    var grid = this.asciiToArray(ascii);

    this.solution = teka.new_array([this.X,this.Y],0);
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            this.solution[i][j] = grid[i][j]==teka.ord(' ')
                ?teka.viewer.heyawake.Defaults.NONE
                :teka.viewer.heyawake.Defaults.FULL;
        }
    }
};

/** Add solution. */
teka.viewer.heyawake.HeyawakeViewer.prototype.addSolution = function()
{
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            this.f[i][j] = this.solution[i][j];
        }
    }
};

//////////////////////////////////////////////////////////////////

/** Returns a small example. */
teka.viewer.heyawake.HeyawakeViewer.prototype.getExample = function()
{
    return '/format 1\n/type (heyawake)\n/sol true\n/X 4\n/Y 4\n/puzzle ['
        +' (+-+-+-+-+) (|2    | |) (+-+-+-+-+) (|     | |) (+-+-+-+ +)'
        +' (|1| |0| |) (+ + + + +) (| | | | |) (+-+-+-+-+) ]\n'
        +'/solution [ (# # ) (    ) ( #  ) (#  #) ]';
};

/** Returns a list of automatically generated properties. */
teka.viewer.heyawake.HeyawakeViewer.prototype.getProperties = function()
{
    return [teka.translate('generic_size',[this.X+'x'+this.Y])];
};

//////////////////////////////////////////////////////////////////

/** Reset the whole diagram. */
teka.viewer.heyawake.HeyawakeViewer.prototype.reset = function()
{
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            this.f[i][j]=teka.viewer.heyawake.Defaults.NONE;
            this.c[i][j]=0;
        }
    }
};

/** Reset the error marks. */
teka.viewer.heyawake.HeyawakeViewer.prototype.clearError = function()
{
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            this.error[i][j] = false;
        }
    }
};

/** Copy digits colored with this.color to color. */
teka.viewer.heyawake.HeyawakeViewer.prototype.copyColor = function(color)
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
teka.viewer.heyawake.HeyawakeViewer.prototype.clearColor = function(color)
{
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            if (this.c[i][j]==color) {
                this.f[i][j] = teka.viewer.heyawake.Defaults.NONE;
            }
        }
    }
};

/** Save current state. */
teka.viewer.heyawake.HeyawakeViewer.prototype.saveState = function()
{
    var f = teka.new_array([this.X,this.Y],0);
    var c = teka.new_array([this.X,this.Y],0);
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            f[i][j] = this.f[i][j];
            c[i][j] = this.c[i][j];
        }
    }

    return { f:f, c:c };
};

/** Load state. */
teka.viewer.heyawake.HeyawakeViewer.prototype.loadState = function(state)
{
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            this.f[i][j] = state.f[i][j];
            this.c[i][j] = state.c[i][j];
        }
    }
};

//////////////////////////////////////////////////////////////////

/** Check, if the solution is correct. */
teka.viewer.heyawake.HeyawakeViewer.prototype.check = function()
{
    var X = this.X;
    var Y = this.Y;

    // fill givens into the solution
    for (var i=0;i<X;i++) {
        for (var j=0;j<Y;j++) {
            if (this.givens[i][j]>0) {
                this.f[i][j] = this.givens[i][j];
            }
        }
    }

    // check for neighbouring blackened cells
    for (var i=0;i<X-1;i++) {
        for (var j=0;j<Y;j++) {
            if (this.f[i][j]==teka.viewer.heyawake.Defaults.FULL && this.f[i+1][j]==teka.viewer.heyawake.Defaults.FULL) {
                this.error[i][j] = true;
                this.error[i+1][j] = true;
                return 'heyawake_neighbours';
            }
        }
    }

    for (var i=0;i<X;i++) {
        for (var j=0;j<Y-1;j++) {
            if (this.f[i][j]==teka.viewer.heyawake.Defaults.FULL && this.f[i][j+1]==teka.viewer.heyawake.Defaults.FULL) {
                this.error[i][j] = true;
                this.error[i][j+1] = true;
                return 'heyawake_neighbours';
            }
        }
    }

    // check numbers in areas
    for (var i=0;i<X;i++) {
        for (var j=0;j<Y;j++) {
            if (this.numbers[i][j]>=0) {
                if (!this.checkNumber(this.numbers[i][j],this.puzzle[i][j])) {
                    return 'heyawake_number_wrong';
                }
            }
        }
    }

    // check for sequences of white cells
    for (var i=0;i<Y;i++) {
        if (!this.checkSeq(0,i,1,0)) {
            return 'heyawake_sequence_too_long';
        }
    }

    for (var i=0;i<X;i++) {
        if (!this.checkSeq(i,0,0,1)) {
            return 'heyawake_sequence_too_long';
        }
    }

    // check if white cells are connected
    var mark = teka.new_array([X,Y],false);
    this.fill(this.f[0][0]==teka.viewer.heyawake.Defaults.FULL?1:0,0,mark);

    var wrong = false;
    for (var i=0;i<X;i++) {
        for (var j=0;j<Y;j++) {
            if (this.f[i][j]!=teka.viewer.heyawake.Defaults.FULL && !mark[i][j]) {
                this.error[i][j] = true;
                wrong = true;
            }
        }
    }
    if (wrong) {
        return 'heyawake_not_connected';
    }

    return true;
};

/** Floodfill white area starting bei x,y */
teka.viewer.heyawake.HeyawakeViewer.prototype.fill = function(x, y, mark)
{
    if (x<0 || y<0 || x>=this.X || y>=this.Y) {
        return;
    }
    if (mark[x][y]) {
        return;
    }
    if (this.f[x][y]==teka.viewer.heyawake.Defaults.FULL) {
        return;
    }
    mark[x][y] = true;
    this.fill(x+1,y,mark);
    this.fill(x-1,y,mark);
    this.fill(x,y+1,mark);
    this.fill(x,y-1,mark);
};

/** If an area has a number, check, if the number of black cells is correct. */
teka.viewer.heyawake.HeyawakeViewer.prototype.checkNumber = function(az, nr)
{
    var c = 0;
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            if (this.puzzle[i][j]==nr) {
                if (this.f[i][j]==teka.viewer.heyawake.Defaults.FULL) {
                    c++;
                }
            }
        }
    }
    if (c==az) {
        return true;
    }
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            if (this.puzzle[i][j]==nr) {
                this.error[i][j] = true;
            }
        }
    }
    return false;
};

/** Check for white celled sequences over more than two areas. */
teka.viewer.heyawake.HeyawakeViewer.prototype.checkSeq = function(x, y, dx, dy)
{
    var a = -1;
    var b = -1;
    while (x<this.X && y<this.Y) {
        if (this.f[x][y]==teka.viewer.heyawake.Defaults.FULL) {
            a = -1;
            b = -1;
        } else {
            if (a==-1 || a==this.puzzle[x][y]) {
                a = this.puzzle[x][y];
            } else if (b==-1 || b==this.puzzle[x][y]) {
                b = this.puzzle[x][y];
            } else {
                while (x>=0 && y>=0) {
                    if (this.f[x][y]==teka.viewer.heyawake.Defaults.FULL) {
                        break;
                    }
                    this.error[x][y] = true;
                    x-=dx;
                    y-=dy;
                }
                return false;
            }
        }
        x+=dx;
        y+=dy;
    }
    return true;
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
teka.viewer.heyawake.HeyawakeViewer.prototype.setMetrics = function(g)
{
    this.scale = Math.floor(Math.min((this.width-3)/this.X,
                                     (this.height-3)/this.Y));
    var realwidth = this.X*this.scale+3;
    var realheight = this.Y*this.scale+3;

    this.deltaX = Math.floor((this.width-realwidth)/2)+0.5;
    this.deltaY = Math.floor((this.height-realheight)/2)+0.5;
    this.borderX = 1;
    this.borderY = 1;

    this.font = teka.getFontData(Math.round(this.scale/2)+'px sans-serif',this.scale);

    if (realwidth>this.width || realheight>this.height) {
        this.scale=false;
    }
    return {width:realwidth,height:realheight,scale:this.scale};
};

/** Paints the diagram. */
teka.viewer.heyawake.HeyawakeViewer.prototype.paint = function(g)
{
    var X = this.X;
    var Y = this.Y;
    var S = this.scale;

    g.save();
    g.translate(this.deltaX+this.borderX,this.deltaY+this.borderY);

    g.fillStyle = '#fff';
    g.fillRect(0,0,S*X,S*Y);

    // paint background of the cells
    for (var i=0;i<X;i++) {
        for (var j=0;j<Y;j++) {
            g.fillStyle = this.isBlinking()?
                this.getBlinkColor(i,j,X,this.f[i][j]):
                (this.error[i][j]?'#f00':'#fff');
            g.fillRect(i*S,j*S,S,S);
        }
    }

    g.lineWidth=3;
    // paint cell content
    for (var i=0;i<X;i++) {
        for (var j=0;j<Y;j++) {
            if (this.givens[i][j]>0) {
                this.f[i][j] = this.givens[i][j];
                this.c[i][j] = 0;
            }
            if (this.f[i][j]==teka.viewer.heyawake.Defaults.EMPTY) {
                g.strokeStyle = this.getColorString(this.c[i][j]);
                teka.drawLine(g,i*S+S/4,j*S+S/4,(i+1)*S-S/4,(j+1)*S-S/4);
                teka.drawLine(g,(i+1)*S-S/4,j*S+S/4,i*S+S/4,(j+1)*S-S/4);
            } else if (this.f[i][j]==teka.viewer.heyawake.Defaults.FULL) {
                if (this.error[i][j]===false) {
                    g.fillStyle = this.getColorString(this.c[i][j],true);
                    g.fillRect(i*S,j*S,S,S);
                }
            }
        }
    }
    g.lineWidth=1;

    // paint grid
    g.strokeStyle = '#000';
    for (var i=0;i<=X;i++) {
        teka.drawLine(g,i*S,0,i*S,Y*S);
    }
    for (var i=0;i<=Y;i++) {
        teka.drawLine(g,0,i*S,X*S,i*S);
    }

    g.lineWidth = 3;
    g.lineCap = 'square';
    g.strokeRect(0,0,X*S,Y*S);

    // paint borders of areas
    for (var i=0;i<X-1;i++) {
        for (var j=0;j<Y;j++) {
            if (this.puzzle[i][j]!=this.puzzle[i+1][j]) {
                teka.drawLine(g,(i+1)*S,j*S,(i+1)*S,(j+1)*S);
            }
        }
    }

    for (var i=0;i<X;i++) {
        for (var j=0;j<Y-1;j++) {
            if (this.puzzle[i][j]!=this.puzzle[i][j+1]) {
                teka.drawLine(g,i*S,(j+1)*S,(i+1)*S,(j+1)*S);
            }
        }
    }

    g.lineCap = 'butt';
    g.lineWidth = 1;

    // paint given numbers
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillStyle = '#000';
    g.font = this.font.font;
    for (var i=0;i<X;i++) {
        for (var j=0;j<Y;j++) {
            if (this.numbers[i][j]>=0) {
                g.fillText(this.numbers[i][j],i*S+S/2,j*S+S/2+this.font.delta);
            }
        }
    }

    // paint cursor
    if (this.mode==teka.viewer.Defaults.NORMAL) {
        g.strokeStyle = '#f00';
        g.lineWidth = 2;
        g.strokeRect(this.x*S+3.5,this.y*S+3.5,S-7,S-7);
    }

    g.restore();
};

//////////////////////////////////////////////////////////////////

/** Handles mousemove event. */
teka.viewer.heyawake.HeyawakeViewer.prototype.processMousemoveEvent = function(xc, yc, pressed)
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

    return this.x!=oldx || this.y!=oldy;
};

/** Handles mousedown event. */
teka.viewer.heyawake.HeyawakeViewer.prototype.processMousedownEvent = function(xc, yc)
{
    var erg = this.processMousemoveEvent(xc,yc,false);

    if (this.x<0 || this.y<0 || this.x>=this.X || this.y>=this.Y) {
        return erg;
    }

    this.set(this.x,this.y,(this.f[this.x][this.y]+1)%3);

    return true;
};

/** Handles keydown event. */
teka.viewer.heyawake.HeyawakeViewer.prototype.processKeydownEvent = function(e)
{
    if (e.key==teka.KEY_DOWN) {
        if (this.y<this.Y-1) {
            this.y++;
        }
        return true;
    }
    if (e.key==teka.KEY_UP) {
        if (this.y>0) {
            this.y--;
        }
        return true;
    }
    if (e.key==teka.KEY_RIGHT) {
        if (this.x<this.X-1) {
            this.x++;
        }
        return true;
    }
    if (e.key==teka.KEY_LEFT) {
        if (this.x>0) {
            this.x--;
        }
        return true;
    }

    if (this.x<0 || this.x>=this.X || this.y<0 && this.y>=this.Y) {
        return false;
    }

    if (e.key==teka.KEY_HASH || e.key==teka.KEY_Q) {
        this.set(this.x,this.y,1);
        return true;
    }

    if (e.key==teka.KEY_MINUS || e.key==teka.KEY_W) {
        this.set(this.x,this.y,2);
        return true;
    }

    if (e.key==teka.KEY_SPACE) {
        this.set(this.x,this.y,0);
        return true;
    }

    return false;
};

/** Sets the value of a cell, if the color fits. */
teka.viewer.heyawake.HeyawakeViewer.prototype.set = function(x, y, value)
{
    if (this.f[x][y]!=teka.viewer.heyawake.Defaults.NONE && this.c[x][y]!=this.color) {
        return;
    }
    this.f[x][y] = value;
    this.c[x][y] = this.color;
};
