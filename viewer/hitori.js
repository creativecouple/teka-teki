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
teka.viewer.hitori = {};

/** Some constants. */
teka.viewer.hitori.Defaults = {
    NONE: 0,
    BLACK: 1,
    WHITE: 2,

    FILLED: -1,
    EMPTY: -2
};

/** Constructor */
teka.viewer.hitori.HitoriViewer = function(data)
{
    teka.viewer.PuzzleViewer.call(this,data);

    this.x = 0;
    this.y = 0;
};
teka.extend(teka.viewer.hitori.HitoriViewer,teka.viewer.PuzzleViewer);

//////////////////////////////////////////////////////////////////

/** Initialize this viewer width the PSData object provided. */
teka.viewer.hitori.HitoriViewer.prototype.initData = function(data)
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
teka.viewer.hitori.HitoriViewer.prototype.asciiToData = function(ascii,d)
{
    if (ascii===false) {
        return;
    }

    var grid = this.asciiToArray(ascii);

    this.puzzle = teka.new_array([this.X,this.Y],0);
    this.MAX = 0;
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            if (grid[i*d+d-1][j]=='#'.charCodeAt(0)) {
                this.puzzle[i][j] = teka.viewer.hitori.Defaults.FILLED;
                continue;
            }
            if (grid[i*d+d-1][j]==' '.charCodeAt(0)) {
                this.puzzle[i][j] = teka.viewer.hitori.Defaults.EMPTY;
                continue;
            }
            this.puzzle[i][j] = this.getNr(grid,i*d,j,d);
            if (this.puzzle[i][j]>this.MAX) {
                this.MAX = this.puzzle[i][j];
            }
        }
    }
};

/** Read solution from ascii art. */
teka.viewer.hitori.HitoriViewer.prototype.asciiToSolution = function(ascii)
{
    if (ascii===false) {
        return;
    }

    var grid = this.asciiToArray(ascii);

    this.solution = teka.new_array([this.X,this.Y],0);
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            this.solution[i][j] = grid[i][j]=='#'.charCodeAt(0)?
                teka.viewer.hitori.Defaults.BLACK:
                teka.viewer.hitori.Defaults.NONE;
        }
    }
};

/** Add solution. */
teka.viewer.hitori.HitoriViewer.prototype.addSolution = function()
{
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            this.f[i][j] = this.solution[i][j];
        }
    }
};

//////////////////////////////////////////////////////////////////

/** Returns a small example. */
teka.viewer.hitori.HitoriViewer.prototype.getExample = function()
{
    return '/format 1\n/type (hitori)\n/sol false\n/X 4\n/Y 4\n'
        +'/puzzle [ (144 ) (1 1 ) (  2 ) (332#) ]\n'
        +'/solution [ (..#.) (#...) (..#.) (#..#) ]';
};

/** Returns a list of automatically generated properties. */
teka.viewer.hitori.HitoriViewer.prototype.getProperties = function()
{
    return [teka.translate('generic_size',[this.X+'x'+this.Y])];
};

//////////////////////////////////////////////////////////////////

/** Reset the whole diagram. */
teka.viewer.hitori.HitoriViewer.prototype.reset = function()
{
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            this.f[i][j]=0;
            this.c[i][j]=0;
        }
    }
};

/** Reset the error marks. */
teka.viewer.hitori.HitoriViewer.prototype.clearError = function()
{
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            this.error[i][j] = false;
        }
    }
};

/** Copy digits colored with this.color to color. */
teka.viewer.hitori.HitoriViewer.prototype.copyColor = function(color)
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
teka.viewer.hitori.HitoriViewer.prototype.clearColor = function(color)
{
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            if (this.c[i][j]==color) {
                this.f[i][j] = 0;
            }
        }
    }
};

/** Save current state. */
teka.viewer.hitori.HitoriViewer.prototype.saveState = function()
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
teka.viewer.hitori.HitoriViewer.prototype.loadState = function(state)
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
teka.viewer.hitori.HitoriViewer.prototype.check = function()
{
    var X = this.X;
    var Y = this.Y;

    for (var i=0;i<X-1;i++) {
        for (var j=0;j<Y;j++) {
            if (this.puzzle[i][j]==teka.viewer.hitori.Defaults.FILLED) {
                this.f[i][j] = teka.viewer.hitori.Defaults.BLACK;
            }
        }
    }

    for (var i=0;i<X-1;i++) {
        for (var j=0;j<Y;j++) {
            if (this.f[i][j]==teka.viewer.hitori.Defaults.BLACK &&
                this.f[i+1][j]==teka.viewer.hitori.Defaults.BLACK) {
                this.error[i][j] = true;
                this.error[i+1][j] = true;
                return 'hitori_neighbours';
            }
        }
    }

    for (var i=0;i<X;i++) {
        for (var j=0;j<Y-1;j++) {
            if (this.f[i][j]==teka.viewer.hitori.Defaults.BLACK &&
                this.f[i][j+1]==teka.viewer.hitori.Defaults.BLACK) {
                this.error[i][j] = true;
                this.error[i][j+1] = true;
                return 'hitori_neighbours';
            }
        }
    }

    for (var i=0;i<X;i++) {
        if (!this.checkDouble(i,0,0,1)) {
            return 'hitori_same_numbers';
        }
    }

    for (var j=0;j<Y;j++) {
        if (!this.checkDouble(0,j,1,0)) {
            return 'hitori_same_numbers';
        }
    }

    var mark = teka.new_array([X,Y],false);
    this.fill(this.f[0][0]==teka.viewer.hitori.Defaults.BLACK?1:0,0,mark);

    var wrong = false;
    for (var i=0;i<X;i++) {
        for (var j=0;j<Y;j++) {
            if (this.f[i][j]!=teka.viewer.hitori.Defaults.BLACK && !mark[i][j]) {
                this.error[i][j] = true;
                wrong = true;
            }
        }
    }
    if (wrong) {
        return 'hitori_not_connected';
    }

    return true;
};

/** Check, if there are doubles in a row or column */
teka.viewer.hitori.HitoriViewer.prototype.checkDouble = function(x, y, dx, dy)
{
    var used = teka.new_array([this.MAX+1],false);

    while (x<this.X && y<this.Y) {
        if (this.f[x][y]!=teka.viewer.hitori.Defaults.BLACK) {
            if (this.puzzle[x][y]<0) {
                x+=dx;
                y+=dy;
                continue;
            }
            if (used[this.puzzle[x][y]]) {
                var h = this.puzzle[x][y];
                while(x>=0 && y>=0) {
                    if (this.puzzle[x][y]==h && this.f[x][y]!=teka.viewer.hitori.Defaults.BLACK) {
                        this.error[x][y] = true;
                    }
                    x-=dx;
                    y-=dy;
                }
                return false;
            }

            used[this.puzzle[x][y]] = true;
        }
        x+=dx;
        y+=dy;
    }

    return true;
};

/** Floodfill the white cells, starting at x,y */
teka.viewer.hitori.HitoriViewer.prototype.fill = function(x, y, mark)
{
    if (x<0 || y<0 || x>=this.X || y>=this.Y) {
        return;
    }

    if (mark[x][y]) {
        return;
    }

    if (this.f[x][y]==teka.viewer.hitori.Defaults.BLACK) {
        return;
    }

    mark[x][y] = true;

    this.fill(x+1,y,mark);
    this.fill(x-1,y,mark);
    this.fill(x,y+1,mark);
    this.fill(x,y-1,mark);
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
teka.viewer.hitori.HitoriViewer.prototype.setMetrics = function(g)
{
    this.scale = Math.floor(Math.min((this.width-3)/this.X,
                                     (this.height-3)/this.Y));
    var realwidth = this.X*this.scale+3;
    var realheight = this.Y*this.scale+3;

    this.deltaX = Math.floor((this.width-realwidth)/2)+0.5;
    this.deltaY = Math.floor((this.height-realheight)/2)+0.5;

    this.font = teka.getFontData(Math.round(this.scale/2)+'px sans-serif',this.scale);

    if (realwidth>this.width || realheight>this.height) this.scale=false;
    return {width:realwidth,height:realheight,scale:this.scale};
};

/** Paints the diagram. */
teka.viewer.hitori.HitoriViewer.prototype.paint = function(g)
{
    var X = this.X;
    var Y = this.Y;
    var S = this.scale;

    g.save();
    g.translate(this.deltaX+1,this.deltaY+1);

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

    // paint content of the cells
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    for (var i=0;i<X;i++) {
        for (var j=0;j<Y;j++) {
            if (!this.error[i][j]
                && this.puzzle[i][j]==teka.viewer.hitori.Defaults.FILLED) {
                g.fillStyle = '#000';
                g.fillRect(i*S,j*S,S,S);
            }

            if (this.puzzle[i][j]>=0) {
                g.fillStyle = '#000';
                g.font = this.font.font;
                g.fillText(this.puzzle[i][j],i*S+S/2,j*S+S/2+this.font.delta);
            }

            g.fillStyle = this.getColorString(this.c[i][j]);
            if (this.f[i][j]==teka.viewer.hitori.Defaults.WHITE) {
                teka.strokeOval(g,i*S+S/2,j*S+S/2,S/2);
            } else if (this.f[i][j]==teka.viewer.hitori.Defaults.BLACK && !this.error[i][j]) {
                g.fillRect(i*S,j*S,S,S);
            }
        }
    }

    // paint grid
    g.strokeStyle = '#000';
    for (var i=0;i<=X;i++) {
        teka.drawLine(g,i*S,0,i*S,Y*S);
    }
    for (var i=0;i<=Y;i++) {
        teka.drawLine(g,0,i*S,X*S,i*S);
    }

    g.lineWidth = 3;
    g.strokeRect(0,0,X*S,Y*S);
    g.lineWidth = 1;

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
teka.viewer.hitori.HitoriViewer.prototype.processMouseMovedEvent = function(xc, yc)
{
    xc = xc-this.deltaX-1;
    yc = yc-this.deltaY-1;

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
    if (this.y>=this.Y-1) {
        this.y=this.Y-1;
    }

    return this.x!=oldx || this.y!=oldy;
};

/** Handles mousedown event. */
teka.viewer.hitori.HitoriViewer.prototype.processMousePressedEvent = function(xc, yc)
{
    var erg = this.processMouseMovedEvent(xc,yc);

    if (this.x<0 || this.y<0 || this.x>=this.X || this.y>=this.Y) {
        return erg;
    }

    this.set(this.x,this.y,(this.f[this.x][this.y]+1)%3);

    return true;
};

/** Handles keydown event. */
teka.viewer.hitori.HitoriViewer.prototype.processKeyEvent = function(e)
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

    if (this.x<0 || this.x>=this.X || this.y<0 || this.y>=this.X) {
        return false;
    }

    if (e.key==teka.KEY_SPACE) {
        this.set(this.x,this.y,teka.viewer.hitori.Defaults.NONE);
        return true;
    }

    if (e.key==teka.KEY_MINUS || e.key==teka.KEY_W) {
        this.set(this.x,this.y,teka.viewer.hitori.Defaults.WHITE);
        return true;
    }

    if (e.key==teka.KEY_HASH || e.key==teka.KEY_Q) {
        this.set(this.x,this.y,teka.viewer.hitori.Defaults.BLACK);
        return true;
    }

    return false;
};

/** Sets the value of a cell, if the color fits. */
teka.viewer.hitori.HitoriViewer.prototype.set = function(x, y, value)
{
    if (this.f[x][y]!=0 && this.c[x][y]!=this.color) {
        return;
    }
    this.f[x][y] = value;
    this.c[x][y] = this.color;
};
