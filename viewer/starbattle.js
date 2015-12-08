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
teka.viewer.starbattle = {};

/** Some constants. */
teka.viewer.starbattle.Defaults = {
    NONE: 0,
    STAR: 1,
    EMPTY: 2
};

/** Constructor */
teka.viewer.starbattle.StarbattleViewer = function(data)
{
    teka.viewer.PuzzleViewer.call(this,data);

    this.x = 0;
    this.y = 0;
};
teka.extend(teka.viewer.starbattle.StarbattleViewer,teka.viewer.PuzzleViewer);

//////////////////////////////////////////////////////////////////

/** Initialize this viewer width the PSData object provided. */
teka.viewer.starbattle.StarbattleViewer.prototype.initData = function(data)
{
    this.X = parseInt(data.get('size'),10);
    this.STARS = data.get('stars');
    this.STARS = this.STARS===false?2:parseInt(data.get('stars'),10);
    this.asciiToData(data.get('puzzle'));
    this.asciiToSolution(data.get('solution'));

    this.f = teka.new_array([this.X,this.X],0);
    this.c = teka.new_array([this.X,this.X],0);
    this.error = teka.new_array([this.X,this.X],false);
};

/** Read puzzle from ascii art. */
teka.viewer.starbattle.StarbattleViewer.prototype.asciiToData = function(ascii)
{
    if (ascii===false) {
        return;
    }

    var grid = this.asciiToArray(ascii);

    this.puzzle = teka.new_array([this.X,this.X],0);
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.X;j++) {
            if (grid[2*i+1][2*j+1]==teka.ord('#')) {
                this.puzzle[i][j] = -1;
            }
        }
    }

    var nr=0;
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.X;j++) {
            if (this.puzzle[i][j]==0) {
                this.fillArea(grid,i,j,++nr);
            }
        }
    }

    this.cells = teka.new_array([this.X,this.X],0);
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.X;j++) {
            if (grid[2*i+1][2*j+1]==teka.ord('-')) {
                this.cells[i][j] = teka.viewer.starbattle.Defaults.EMPTY;
            }
            if (grid[2*i+1][2*j+1]==teka.ord('*')) {
                this.cells[i][j] = teka.viewer.starbattle.Defaults.STAR;
            }
        }
    }

    this.black = teka.new_array([this.X,this.X],false);
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.X;j++) {
            this.black[i][j] = grid[2*i+1][2*j+1]==teka.ord('#');
        }
    }
};

/** Read solution from ascii art. */
teka.viewer.starbattle.StarbattleViewer.prototype.asciiToSolution = function(ascii)
{
    if (ascii===false) {
        return;
    }

    var grid = this.asciiToArray(ascii);

    this.solution = teka.new_array([this.X,this.X],0);
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.X;j++) {
            this.solution[i][j] = grid[i][j]==teka.ord('*')?
                teka.viewer.starbattle.Defaults.STAR:
                teka.viewer.starbattle.Defaults.NONE;
        }
    }
};

/** Determine an area recursively. */
teka.viewer.starbattle.StarbattleViewer.prototype.fillArea = function(grid, x, y, nr)
{
    if (x<0 || y<0 || x>=this.X || y>=this.X) {
        return;
    }
    if (this.puzzle[x][y]!=0) {
        return;
    }
    this.puzzle[x][y] = nr;

    if (grid[2*x+2][2*y+1]==teka.ord(' ')) {
        this.fillArea(grid,x+1,y,nr);
    }
    if (grid[2*x][2*y+1]==teka.ord(' ')) {
        this.fillArea(grid,x-1,y,nr);
    }
    if (grid[2*x+1][2*y+2]==teka.ord(' ')) {
        this.fillArea(grid,x,y+1,nr);
    }
    if (grid[2*x+1][2*y]==teka.ord(' ')) {
        this.fillArea(grid,x,y-1,nr);
    }
};

/** Add solution. */
teka.viewer.starbattle.StarbattleViewer.prototype.addSolution = function()
{
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.X;j++) {
            this.f[i][j] = this.solution[i][j];
        }
    }
};

//////////////////////////////////////////////////////////////////

/** Returns a small example. */
teka.viewer.starbattle.StarbattleViewer.prototype.getExample = function()
{
    return '/type (starbattle)\n/sol false\n/size 5\n/stars 1\n/puzzle ['
        +' (+-+-+-+-+-+) (| |       |) (+ +-+-+-+ +) (|   |   | |) (+-+ +-+ +-+)'
        +' (| |   |   |) (+ +-+-+-+ +) (| |     | |) (+ +-+-+ +-+) (|     |   |)'
        +' (+-+-+-+-+-+) ]\n/solution [ (   * ) ( *   ) (    *) (  *  ) (*    ) ]';
};

/** Returns a list of automatically generated properties. */
teka.viewer.starbattle.StarbattleViewer.prototype.getProperties = function()
{
    return [teka.translate('generic_size',[this.X+'x'+this.Y]),
            teka.translate('starbattle_stars',[this.STARS])];
};

//////////////////////////////////////////////////////////////////

/** Reset the whole diagram. */
teka.viewer.starbattle.StarbattleViewer.prototype.reset = function()
{
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.X;j++) {
            this.f[i][j] = 0;
            this.c[i][j] = 0;
        }
    }
};

/** Reset the error marks. */
teka.viewer.starbattle.StarbattleViewer.prototype.clearError = function()
{
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.X;j++) {
            this.error[i][j] = false;
        }
    }
};

/** Copy digits colored with this.color to color. */
teka.viewer.starbattle.StarbattleViewer.prototype.copyColor = function(color)
{
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.X;j++) {
            if (this.c[i][j]==this.color) {
                this.c[i][j] = color;
            }
        }
    }
};

/** Delete all digits with color. */
teka.viewer.starbattle.StarbattleViewer.prototype.clearColor = function(color)
{
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.X;j++) {
            if (this.c[i][j]==color) {
                this.f[i][j] = 0;
            }
        }
    }
};

/** Save current state. */
teka.viewer.starbattle.StarbattleViewer.prototype.saveState = function()
{
    var f = teka.new_array([this.X,this.X],0);
    var c = teka.new_array([this.X,this.X],0);
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.X;j++) {
            f[i][j] = this.f[i][j];
            c[i][j] = this.c[i][j];
        }
    }

    return { f:f, c:c };
};

/** Load state. */
teka.viewer.starbattle.StarbattleViewer.prototype.loadState = function(state)
{
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.X;j++) {
            this.f[i][j] = state.f[i][j];
            this.c[i][j] = state.c[i][j];
        }
    }
};

//////////////////////////////////////////////////////////////////

/** Check, if the solution is correct. */
teka.viewer.starbattle.StarbattleViewer.prototype.check = function()
{
    var X = this.X;

    // Do some cleanup
    for (var i=0;i<X;i++) {
        for (var j=0;j<X;j++) {
            if (this.black[i][j]) {
                this.f[i][j] = teka.viewer.starbattle.Defaults.NONE;
            }
            if (this.cells[i][j]==teka.viewer.starbattle.Defaults.EMPTY) {
                this.f[i][j] = teka.viewer.starbattle.Defaults.EMPTY;
            }
            if (this.cells[i][j]==teka.viewer.starbattle.Defaults.STAR) {
                this.f[i][j] = teka.viewer.starbattle.Defaults.STAR;
            }
        }
    }

    // Do stars touch?
    for (var i=0;i<X;i++) {
        for (var j=0;j<X;j++) {
            if (this.f[i][j]==teka.viewer.starbattle.Defaults.STAR) {
                for (var ii=-1;ii<=1;ii++) {
                    for (var jj=-1;jj<=1;jj++) {
                        if (ii!=0 || jj!=0) {
                            if (i+ii<0 || i+ii>=X || j+jj<0 || j+jj>=X) {
                                continue;
                            }
                            if (this.f[i+ii][j+jj]==teka.viewer.starbattle.Defaults.STAR) {
                                this.error[i+ii][j+jj] = true;
                                this.error[i][j] = true;
                                return 'starbattle_touch';
                            }
                        }
                    }
                }
            }
        }
    }

    // Check number of stars in a row.
    for (var j=0;j<X;j++) {
        var az = 0;
        for (var i=0;i<X;i++) {
            if (this.f[i][j]==teka.viewer.starbattle.Defaults.STAR) {
                az++;
            }
        }
        if (az!=this.STARS) {
            for (var i=0;i<X;i++) {
                this.error[i][j] = true;
            }
            return 'starbattle_row';
        }
    }

    // Check number of stars in a column.
    for (var i=0;i<X;i++) {
        var az = 0;
        for (var j=0;j<X;j++) {
            if (this.f[i][j]==teka.viewer.starbattle.Defaults.STAR) {
                az++;
            }
        }
        if (az!=this.STARS) {
            for (var j=0;j<X;j++) {
                this.error[i][j] = true;
            }
            return 'starbattle_column';
        }
    }

    // Check number of stars in an area.
    for (var k=1;k<=X;k++) {
        var az = 0;
        for (var i=0;i<X;i++) {
            for (var j=0;j<X;j++) {
                if (this.puzzle[i][j]==k
                    && this.f[i][j]==teka.viewer.starbattle.Defaults.STAR) {
                    az++;
                }
            }
        }
        if (az!=this.STARS) {
            for (var i=0;i<X;i++) {
                for (var j=0;j<X;j++) {
                    if (this.puzzle[i][j]==k) {
                        this.error[i][j] = true;
                    }
                }
            }
            return 'starbattle_area';
        }
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
teka.viewer.starbattle.StarbattleViewer.prototype.setMetrics = function(g)
{
    this.scale = Math.floor(Math.min((this.width-3)/this.X,
                                     (this.height-3-(this.textHeight+2))/this.X));
    var realwidth = this.X * this.scale + 3;
    var realheight = this.X * this.scale + 3 + this.textHeight+2;

    this.bottomText = teka.translate('starbattle_stars',[this.STARS]);
    g.font = 'bold '+this.textHeight+'px sans-serif';
    var textwidth = g.measureText(this.bottomText).width+1;
    realwidth = Math.max(realwidth,textwidth);

    this.deltaX = Math.floor((this.width-realwidth)/2)+0.5;
    this.deltaY = Math.floor((this.height-realheight)/2)+0.5;

    if (realwidth>this.width || realheight>this.height) this.scale=false;
    return {width:realwidth,height:realheight,scale:this.scale};
};

/** Paints the diagram. */
teka.viewer.starbattle.StarbattleViewer.prototype.paint = function(g)
{
    var X = this.X;
    var S = this.scale;

    g.save();
    g.translate(this.deltaX+1,this.deltaY+1);

    g.fillStyle = '#fff';
    g.fillRect(0,0,X*S,X*S);

    // paint background of the cells
    for (var i=0;i<X;i++) {
        for (var j=0;j<X;j++) {
            g.fillStyle = this.isBlinking()?
                this.getBlinkColor(i,j,X,this.f[i][j]):
                (this.error[i][j]?'#f00':'#fff');
            g.fillRect(i*S,j*S,S,S);
        }
    }

    // paint grid
    g.strokeStyle = '#000';
    for (var i=0;i<=X;i++) {
        teka.drawLine(g,0,i*S,X*S,i*S);
        teka.drawLine(g,i*S,0,i*S,X*S);
    }

    // paint given black cells
    g.fillStyle = '#000';
    for (var i=0;i<X;i++) {
        for (var j=0;j<X;j++) {
            if (this.black[i][j]) {
                g.fillRect(i*S,j*S,S,S);
            }
        }
    }

    // paint areas
    g.lineWidth = 3;
    g.strokeRect(0,0,X*S,X*S);

    g.lineCap = 'square';
    for (var i=0;i<X-1;i++) {
        for (var j=0;j<X;j++) {
            if (this.puzzle[i][j]!=this.puzzle[i+1][j]) {
                teka.drawLine(g,(i+1)*S,j*S,(i+1)*S,(j+1)*S);
            }
        }
    }

    for (var i=0;i<X;i++) {
        for (var j=0;j<X-1;j++) {
            if (this.puzzle[i][j]!=this.puzzle[i][j+1]) {
                teka.drawLine(g,i*S,(j+1)*S,(i+1)*S,(j+1)*S);
            }
        }
    }
    g.lineCap = 'butt';
    g.lineWidth = 1;

    // paint content of the cells
    for (var i=0;i<X;i++) {
        for (var j=0;j<X;j++) {
            if (this.cells[i][j]==teka.viewer.starbattle.Defaults.STAR) {
                g.fillStyle = '#000';
                this.drawStar(g,i*S+S/2,j*S+S/2+S/15);
                continue;
            }

            if (this.cells[i][j]==teka.viewer.starbattle.Defaults.EMPTY) {
                g.strokeStyle = '#000';
                g.lineWidth = 2;
                teka.drawLine(g,Math.floor(i*S+S/4)+0.5,Math.floor(j*S+S/2)+0.5,
                              Math.ceil((i+1)*S-S/4)-0.5,Math.floor(j*S+S/2)+0.5);
                g.lineWidth = 1;
                continue;
            }

            if (this.f[i][j]==teka.viewer.starbattle.Defaults.STAR) {
                g.fillStyle = this.getColorString(this.c[i][j]);
                this.drawStar(g,i*S+S/2,j*S+S/2+S/15);
                continue;
            }

            if (this.f[i][j]==teka.viewer.starbattle.Defaults.EMPTY) {
                g.strokeStyle = this.getColorString(this.c[i][j]);
                g.lineWidth = 2;
                teka.drawLine(g,Math.floor(i*S+S/4)+0.5,Math.floor(j*S+S/2)+0.5,
                              Math.ceil((i+1)*S-S/4)-0.5,Math.floor(j*S+S/2)+0.5);
                g.lineWidth = 1;
            }
        }
    }

    // paint text below the grid
    g.textAlign = 'left';
    g.textBaseline = 'top';
    g.fillStyle = this.textcolor;
    g.font = 'bold '+this.textHeight+'px sans-serif';
    g.fillText(this.bottomText,0,X*S+4);

    // paint cursor
    if (this.mode==teka.viewer.Defaults.NORMAL) {
        g.strokeStyle = '#f00';
        g.lineWidth = 2;
        g.strokeRect(S*this.x+3.5,S*this.y+3.5,S-7,S-7);
    }

    g.restore();
};

//////////////////////////////////////////////////////////////////

/** Handles mousemove event. */
teka.viewer.starbattle.StarbattleViewer.prototype.processMouseMovedEvent = function(xc, yc)
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
    if (this.x>this.X-1) {
        this.x=this.X-1;
    }
    if (this.y>this.X-1) {
        this.y=this.X-1;
    }

    return this.x!=oldx || this.y!=oldy;
};

/** Handles mousedown event. */
teka.viewer.starbattle.StarbattleViewer.prototype.processMousePressedEvent = function(xc, yc)
{
    var erg = this.processMouseMovedEvent(xc,yc);

    if (xc<0 || yc<0 || xc>=this.X*this.scale || yc>=this.X*this.scale) {
        return erg;
    }

    this.set(this.x,this.y,(this.f[this.x][this.y]+1)%3);

    return true;
};

/** Handles keydown event. */
teka.viewer.starbattle.StarbattleViewer.prototype.processKeyEvent = function(e)
{
    if (e.key==teka.KEY_DOWN) {
        if (this.y<this.X-1) {
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

    if (this.x<0 || this.x>=this.X || this.y<0 && this.y>=this.X) {
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

//////////////////////////////////////////////////////////////////

/** Sets the value of a cell, if the color fits. */
teka.viewer.starbattle.StarbattleViewer.prototype.set = function(x, y, value)
{
    if (this.f[x][y]!=0 && this.c[x][y]!=this.color) {
        return;
    }
    this.f[x][y] = value;
    this.c[x][y] = this.color;
};
