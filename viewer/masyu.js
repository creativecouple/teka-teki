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
teka.viewer.masyu = {};

/** Some constants. */
teka.viewer.masyu.Defaults = {
    NONE: 0,
    EMPTY: 1,
    FULL: 2,
    BLACK: 3,

    CELL: 0,
    H_EDGE: 1,
    V_EDGE: 2
};

/** Constructor */
teka.viewer.masyu.MasyuViewer = function(data)
{
    teka.viewer.PuzzleViewer.call(this,data);

    this.x = 0;
    this.y = 0;
    this.cursor_mode = teka.viewer.masyu.Defaults.CELL;
};
teka.extend(teka.viewer.masyu.MasyuViewer,teka.viewer.PuzzleViewer);

//////////////////////////////////////////////////////////////////

/** Initialize this viewer width the PSData object provided. */
teka.viewer.masyu.MasyuViewer.prototype.initData = function(data)
{
    this.X = parseInt(data.get('X'),10);
    this.Y = parseInt(data.get('Y'),10);
    this.asciiToData(data.get('puzzle'));
    this.asciiToSolution(data.get('solution'));

    this.f = teka.new_array([this.X,this.Y],false);
    this.c = teka.new_array([this.X,this.Y],0);
    this.fr = teka.new_array([this.X-1,this.Y],0);
    this.fd = teka.new_array([this.X,this.Y-1],0);
    this.cr = teka.new_array([this.X-1,this.Y],0);
    this.cd = teka.new_array([this.X,this.Y-1],0);
    this.error = teka.new_array([this.X,this.Y],false);
};

/** Read puzzle from ascii art. */
teka.viewer.masyu.MasyuViewer.prototype.asciiToData = function(ascii)
{
    if (ascii===false) {
        return;
    }

    var grid = this.asciiToArray(ascii);

    this.puzzle = teka.new_array([this.X,this.Y],0);
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            switch (grid[2*i+1][2*j+1]) {
              case teka.ord('O'):
                this.puzzle[i][j] = teka.viewer.masyu.Defaults.EMPTY;
                break;
              case teka.ord('*'):
                this.puzzle[i][j] = teka.viewer.masyu.Defaults.FULL;
                break;
              case teka.ord('#'):
                this.puzzle[i][j] = teka.viewer.masyu.Defaults.BLACK;
                break;
              default:
                this.puzzle[i][j] = teka.viewer.masyu.Defaults.NONE;
                break;
            }
        }
    }

    this.pr = teka.new_array([this.X-1,this.Y],0);
    for (var i=0;i<this.X-1;i++) {
        for (var j=0;j<this.Y;j++) {
            if (grid[2*i+2][2*j+1]==teka.ord('-')) {
                this.pr[i][j]=1;
            }
        }
    }

    this.pd = teka.new_array([this.X,this.Y-1],0);
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y-1;j++) {
            if (grid[2*i+1][2*j+2]==teka.ord('|')) {
                this.pd[i][j]=1;
            }
        }
    }
};

/** Read solution from ascii art. */
teka.viewer.masyu.MasyuViewer.prototype.asciiToSolution = function(ascii)
{
    if (ascii===false) {
        return;
    }

    var grid = this.asciiToArray(ascii);

    this.sr = teka.new_array([this.X-1,this.Y],0);
    for (var i=0;i<this.X-1;i++) {
        for (var j=0;j<this.Y;j++) {
            this.sr[i][j] = grid[2*i+2][2*j+1]==teka.ord('-')?1:0;
        }
    }

    this.sd = teka.new_array([this.X,this.Y-1],0);
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y-1;j++) {
            this.sd[i][j] = grid[2*i+1][2*j+2]==teka.ord('|')?1:0;
        }
    }
};

/** Add solution. */
teka.viewer.masyu.MasyuViewer.prototype.addSolution = function()
{
    for (var i=0;i<this.X-1;i++) {
        for (var j=0;j<this.Y;j++) {
            this.fr[i][j] = this.sr[i][j];
        }
    }
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y-1;j++) {
            this.fd[i][j] = this.sd[i][j];
        }
    }
};

//////////////////////////////////////////////////////////////////

/** Returns a small example. */
teka.viewer.masyu.MasyuViewer.prototype.getExample = function()
{
    return '/format 1\n/type (masyu)\n/sol false\n/X 5\n/Y 5\n'
        +'/puzzle [ (+-+-+-+-+-+) (|  *   O  |) (+ + + + + +) (|       - |) '
        +'(+ + + + + +) (|      #  |) (+ + + + + +) (|O        |) (+ + + +|+ +) '
        +'(|         |) (+-+-+-+-+-+) ]\n/solution [ (+-+-+-+-+-+) (|  *- -O- |) '
        +'(+ +|+ + +|+) (|     - - |) (+ +|+|+ + +) (| -    #  |) (+|+ +|+ + +) '
        +'(|O    -   |) (+|+ + +|+ +) (| - - -   |) (+-+-+-+-+-+) ]';
};

/** Returns a list of automatically generated properties. */
teka.viewer.masyu.MasyuViewer.prototype.getProperties = function()
{
    return [teka.translate('generic_size',[this.X+'x'+this.Y])];
};

//////////////////////////////////////////////////////////////////

/** Reset the whole diagram. */
teka.viewer.masyu.MasyuViewer.prototype.reset = function()
{
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            this.f[i][j] = false;
            this.c[i][j] = 0;
        }
    }
    for (var i=0;i<this.X-1;i++) {
        for (var j=0;j<this.Y;j++) {
            this.fr[i][j]=0;
            this.cr[i][j]=0;
        }
    }
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y-1;j++) {
            this.fd[i][j]=0;
            this.cd[i][j]=0;
        }
    }
};

/** Reset the error marks. */
teka.viewer.masyu.MasyuViewer.prototype.clearError = function()
{
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            this.error[i][j] = false;
        }
    }
};

/** Copy digits colored with this.color to color. */
teka.viewer.masyu.MasyuViewer.prototype.copyColor = function(color)
{
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            if (this.c[i][j]==this.color) {
                this.c[i][j] = color;
            }
        }
    }
    for (var i=0;i<this.X-1;i++) {
        for (var j=0;j<this.Y;j++) {
            if (this.cr[i][j]==this.color) {
                this.cr[i][j] = color;
            }
        }
    }
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y-1;j++) {
            if (this.cd[i][j]==this.color) {
                this.cd[i][j] = color;
            }
        }
    }
};

/** Delete all digits with color. */
teka.viewer.masyu.MasyuViewer.prototype.clearColor = function(color)
{
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            if (this.c[i][j]==color) {
                this.f[i][j] = false;
            }
        }
    }
    for (var i=0;i<this.X-1;i++) {
        for (var j=0;j<this.Y;j++) {
            if (this.cr[i][j]==color) {
                this.fr[i][j] = 0;
            }
        }
    }
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y-1;j++) {
            if (this.cd[i][j]==color) {
                this.fd[i][j] = 0;
            }
        }
    }
};

/** Save current state. */
teka.viewer.masyu.MasyuViewer.prototype.saveState = function()
{
    var f = teka.new_array([this.X,this.Y],false);
    var c = teka.new_array([this.X,this.Y],0);
    var fr = teka.new_array([this.X-1,this.Y],0);
    var fu = teka.new_array([this.X,this.Y-1],0);
    var cr = teka.new_array([this.X-1,this.Y],0);
    var cu = teka.new_array([this.X,this.Y-1],0);
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            f[i][j] = this.f[i][j];
            c[i][j] = this.c[i][j];
        }
    }
    for (var i=0;i<this.X-1;i++) {
        for (var j=0;j<this.Y;j++) {
            fr[i][j] = this.fr[i][j];
            cr[i][j] = this.cr[i][j];
        }
    }
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y-1;j++) {
            fu[i][j] = this.fd[i][j];
            cu[i][j] = this.cd[i][j];
        }
    }

    return { f:f, c:c, fr:fr, fu:fu, cr:cr, cu:cu };
};

/** Load state. */
teka.viewer.masyu.MasyuViewer.prototype.loadState = function(state)
{
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            this.f[i][j] = state.f[i][j];
            this.c[i][j] = state.c[i][j];
        }
    }
    for (var i=0;i<this.X-1;i++) {
        for (var j=0;j<this.Y;j++) {
            this.fr[i][j] = state.fr[i][j];
            this.cr[i][j] = state.cr[i][j];
        }
    }
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y-1;j++) {
            this.fd[i][j] = state.fu[i][j];
            this.cd[i][j] = state.cu[i][j];
        }
    }
};

//////////////////////////////////////////////////////////////////

/** Check, if the solution is correct. */
teka.viewer.masyu.MasyuViewer.prototype.check = function()
{
    var X = this.X;
    var Y = this.Y;

    // create a clean solution from user input and givens
    var checkr = teka.new_array([this.X-1,this.Y],0);
    for (var i=0;i<this.X-1;i++) {
        for (var j=0;j<this.Y;j++) {
            checkr[i][j] = this.fr[i][j]==1?1:0;
            if (this.pr[i][j]===1) {
                checkr[i][j] = 1;
            }
            if (this.puzzle[i][j]==teka.viewer.masyu.Defaults.BLACK ||
                this.puzzle[i+1][j]==teka.viewer.masyu.Defaults.BLACK) {
                checkr[i][j] = 0;
            }
        }
    }

    var checkd = teka.new_array([this.X,this.Y-1],0);
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y-1;j++) {
            checkd[i][j] = this.fd[i][j]==1?1:0;
            if (this.pd[i][j]===1) {
                checkd[i][j] = 1;
            }
            if (this.puzzle[i][j]==teka.viewer.masyu.Defaults.BLACK ||
                this.puzzle[i][j+1]==teka.viewer.masyu.Defaults.BLACK) {
                checkd[i][j] = 0;
            }
        }
    }

    for (var i=0;i<X;i++) {
        for (var j=0;j<Y;j++) {
            var h = this.countLines(i,j,checkr,checkd);
            if (h!=0 && h!=2) {
                this.error[i][j] = true;
                switch (h) {
                  case 1: return 'masyu_deadend';
                  case 3: return 'masyu_junction';
                  case 4: return 'masyu_crossing';
                }
                return '???'; // should never happen...
            }
            if ((this.puzzle[i][j]==teka.viewer.masyu.Defaults.EMPTY
                || this.puzzle[i][j]==teka.viewer.masyu.Defaults.FULL)
                && h===0) {
                this.error[i][j] = true;
                return 'masyu_circle_missing';
            }
        }
    }

    // check for circle conditions
    for (var i=0;i<X;i++) {
        for (var j=0;j<Y;j++) {
            if (this.puzzle[i][j]==teka.viewer.masyu.Defaults.EMPTY
                && !this.checkEmptyCircle(i,j,checkr,checkd)) {
                this.error[i][j] = true;
                return 'masyu_white_circle';
            }
            if (this.puzzle[i][j]==teka.viewer.masyu.Defaults.FULL
                && !this.checkFullCircle(i,j,checkr,checkd)) {
                this.error[i][j] = true;
                return 'masyu_black_circle';
            }
        }
    }

    // check if all the line segments are connected
    var sx = -1;
    var sy = -1;
    outer: for (var i=0;i<X-1;i++) {
        for (var j=0;j<Y;j++) {
            if (checkr[i][j]==1) {
                sx = i;
                sy = j;
                break outer;
            }
        }
    }

    if (sx==-1 || sy==-1) {
        return 'masyu_no_line_found';
    }

    var mark = teka.new_array([X,Y],false);
    this.fill(mark,sx,sy,checkr,checkd);

    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            if (!mark[i][j] &&
                this.countLines(i,j,checkr,checkd)>0) {

                for (var ii=0;ii<this.X;ii++) {
                    for (var jj=0;jj<this.Y;jj++) {
                        if (mark[ii][jj]) {
                            this.error[ii][jj] = true;
                        }
                    }
                }

                return 'masyu_not_connected';
            }
        }
    }

    return true;
};

/** Count the lines, that start at position x,y. */
teka.viewer.masyu.MasyuViewer.prototype.countLines = function(x, y, checkr, checkd)
{
    var az = 0;
    if (x>0 && checkr[x-1][y]==1) {
        az++;
    }
    if (x<this.X-1 && checkr[x][y]==1) {
        az++;
    }
    if (y>0 && checkd[x][y-1]==1) {
        az++;
    }
    if (y<this.Y-1 && checkd[x][y]==1) {
        az++;
    }
    return az;
};

/** Check, if all conditions of an empty circle are met. */
teka.viewer.masyu.MasyuViewer.prototype.checkEmptyCircle = function(x, y, checkr, checkd)
{
    if (this.isBending(x,y,checkr,checkd)) {
        return false;
    }

    var nb = this.getNeighbours(x,y,checkr,checkd);

    var ok = false;
    if (nb[0]==1 && this.isBending(x-1,y,checkr,checkd)) {
        ok = true;
    }
    if (nb[1]==1 && this.isBending(x+1,y,checkr,checkd)) {
        ok = true;
    }
    if (nb[2]==1 && this.isBending(x,y-1,checkr,checkd)) {
        ok = true;
    }
    if (nb[3]==1 && this.isBending(x,y+1,checkr,checkd)) {
        ok = true;
    }

    return ok;
};

/** Check, if all conditions of an full circle are met. */
teka.viewer.masyu.MasyuViewer.prototype.checkFullCircle = function(x, y, checkr, checkd)
{
    if (!this.isBending(x,y,checkr,checkd)) {
        return false;
    }

    var nb = this.getNeighbours(x,y,checkr,checkd);

    if (nb[0]==1 && this.isBending(x-1,y,checkr,checkd)) {
        return false;
    }
    if (nb[1]==1 && this.isBending(x+1,y,checkr,checkd)) {
        return false;
    }
    if (nb[2]==1 && this.isBending(x,y-1,checkr,checkd)) {
        return false;
    }
    if (nb[3]==1 && this.isBending(x,y+1,checkr,checkd)) {
        return false;
    }

    return true;
};

/** Check, if the path bends at x,y. Assumes, that the path passes though x,y. */
teka.viewer.masyu.MasyuViewer.prototype.isBending = function(x, y, checkr, checkd)
{
    var nb = this.getNeighbours(x,y,checkr,checkd);

    return (nb[0]==1 || nb[1]==1) && (nb[2]==1 || nb[3]==1);
};

/** Get neighbour segments of cell x,y */
teka.viewer.masyu.MasyuViewer.prototype.getNeighbours = function(x, y, checkr, checkd)
{
    var result = teka.new_array([4],0);
    if (x>0) {
        result[0] = checkr[x-1][y];
    }
    if (x<this.X-1) {
        result[1] = checkr[x][y];
    }
    if (y>0) {
        result[2] = checkd[x][y-1];
    }
    if (y<this.Y-1) {
        result[3] = checkd[x][y];
    }
    return result;
};

/** Floodfill all cells, that are connected by segments, starting from x,y */
teka.viewer.masyu.MasyuViewer.prototype.fill = function(mark, x, y, checkr, checkd)
{
    if (x<0 || x>=this.X || y<0 || y>=this.Y) {
        return;
    }

    if (mark[x][y]) {
        return;
    }

    mark[x][y]=true;

    var nb = this.getNeighbours(x,y,checkr,checkd);
    if (nb[0]==1) {
        this.fill(mark,x-1,y,checkr,checkd);
    }
    if (nb[1]==1) {
        this.fill(mark,x+1,y,checkr,checkd);
    }
    if (nb[2]==1) {
        this.fill(mark,x,y-1,checkr,checkd);
    }
    if (nb[3]==1) {
        this.fill(mark,x,y+1,checkr,checkd);
    }
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
teka.viewer.masyu.MasyuViewer.prototype.setMetrics = function(g)
{
    this.scale = Math.floor(Math.min((this.width-3)/this.X,
                                     (this.height-3)/this.Y));

    var realwidth = this.X*this.scale+3;
    var realheight = this.Y*this.scale+3;

    this.deltaX = Math.floor((this.width-realwidth)/2)+0.5;
    this.deltaY = Math.floor((this.height-realheight)/2)+0.5;
    this.borderX = 1;
    this.borderY = 1;

    if (realwidth>this.width || realheight>this.height) {
        this.scale=false;
    }
    return {width:realwidth,height:realheight,scale:this.scale};
};

/** Paints the diagram. */
teka.viewer.masyu.MasyuViewer.prototype.paint = function(g)
{
    var X = this.X;
    var Y = this.Y;
    var S = this.scale;

    g.save();
    g.translate(this.deltaX+this.borderX,this.deltaY+this.borderY);

    g.fillStyle = '#fff';
    g.fillRect(0,0,S*X,S*Y);

    // paint background of cells
    for (var i=0;i<X;i++) {
        for (var j=0;j<Y;j++) {
            g.fillStyle = this.isBlinking()?
                this.getBlinkColor(i,j,X,this.puzzle[i][j]):
                (this.error[i][j]?'#f00':'#fff');

            g.fillRect(i*S,j*S,S,S);
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

    // paint content of cells
    for (var i=0;i<X;i++) {
        for (var j=0;j<Y;j++) {
            if (this.puzzle[i][j]==teka.viewer.masyu.Defaults.BLACK) {
                g.fillStyle = '#000';
                g.fillRect(i*S,j*S,S,S);
            } else if (this.puzzle[i][j]==teka.viewer.masyu.Defaults.EMPTY) {
                g.fillStyle = '#fff';
                teka.fillOval(g,i*S+S/2,j*S+S/2,S/2-S/8);
                g.strokeStyle = '#000';
                teka.strokeOval(g,i*S+S/2,j*S+S/2,S/2-S/8);
            } else if (this.puzzle[i][j]==teka.viewer.masyu.Defaults.FULL) {
                g.fillStyle = '#000';
                teka.fillOval(g,i*S+S/2,j*S+S/2,S/2-S/8);
            } else if (this.f[i][j]==1) {
                g.strokeStyle = this.getColorString(this.c[i][j]);
                teka.drawLine(g,i*S+S/8,j*S+S/8,(i+1)*S-S/8,(j+1)*S-S/8);
                teka.drawLine(g,i*S+S/8,(j+1)*S-S/8,(i+1)*S-S/8,j*S+S/8);
            }
        }
    }

    // paint symbols on vertical edges
    g.lineCap = 'square';
    for (var i=0;i<X-1;i++) {
        for (var j=0;j<Y;j++) {
            if (this.pr[i][j]==1) {
                g.strokeStyle = '#000';
                g.lineWidth = 5;
                teka.drawLine(g,i*S+Math.floor(S/2),j*S+Math.floor(S/2),
                              (i+1)*S+Math.floor(S/2),j*S+Math.floor(S/2));
                g.lineWidth = 1;
                continue;
            }
            if (this.puzzle[i][j]==teka.viewer.masyu.Defaults.BLACK ||
                this.puzzle[i+1][j]==teka.viewer.masyu.Defaults.BLACK) {
                continue;
            }
            g.strokeStyle = this.getColorString(this.cr[i][j]);
            switch (this.fr[i][j]) {
              case 1:
                g.lineWidth = 5;
                teka.drawLine(g,i*S+Math.floor(S/2),j*S+Math.floor(S/2),
                              (i+1)*S+Math.floor(S/2),j*S+Math.floor(S/2));
                g.lineWidth = 1;
                break;
              case 2:
                g.lineWidth = 3;
                teka.drawLine(g,(i+1)*S-S/10,j*S+S/2-S/10,(i+1)*S+S/10,j*S+S/2+S/10);
                teka.drawLine(g,(i+1)*S-S/10,j*S+S/2+S/10,(i+1)*S+S/10,j*S+S/2-S/10);
                g.lineWidth = 1;
                break;
            }
        }
    }

    // paint symbols on horizontal edges
    for (var i=0;i<X;i++) {
        for (var j=0;j<Y-1;j++) {
            if (this.pd[i][j]==1) {
                g.strokeStyle = '#000';
                g.lineWidth = 5;
                teka.drawLine(g,i*S+Math.floor(S/2),j*S+Math.floor(S/2),
                              i*S+Math.floor(S/2),(j+1)*S+Math.floor(S/2));
                g.lineWidth = 1;
                continue;
            }
            if (this.puzzle[i][j]==teka.viewer.masyu.Defaults.BLACK ||
                this.puzzle[i][j+1]==teka.viewer.masyu.Defaults.BLACK) {
                continue;
            }
            g.strokeStyle = this.getColorString(this.cd[i][j]);
            switch (this.fd[i][j]) {
              case 1:
                g.lineWidth = 5;
                teka.drawLine(g,i*S+Math.floor(S/2),j*S+Math.floor(S/2),
                              i*S+Math.floor(S/2),(j+1)*S+Math.floor(S/2));
                g.lineWidth = 1;
                break;
              case 2:
                g.lineWidth = 3;
                teka.drawLine(g,i*S+S/2-S/10,(j+1)*S-S/10,i*S+S/2+S/10,(j+1)*S+S/10);
                teka.drawLine(g,i*S+S/2-S/10,(j+1)*S+S/10,i*S+S/2+S/10,(j+1)*S-S/10);
                g.lineWidth = 1;
                break;
            }
        }
    }
    g.lineCap = 'butt';

    // paint cursor
    if (this.mode==teka.viewer.Defaults.NORMAL) {
        if (this.cursor_mode==teka.viewer.masyu.Defaults.CELL) {
            g.fillStyle = '#f00';
            g.fillRect(Math.floor(this.x*S+S/2)-3.5,Math.floor(this.y*S+S/2)-3.5,7,7);
        } else if (this.cursor_mode==teka.viewer.masyu.Defaults.V_EDGE) {
            g.strokeStyle = '#f00';
            g.lineWidth = 3;
            teka.drawLine(g,(this.x+1)*S-S/10,this.y*S+S/2-S/10,(this.x+1)*S+S/10,this.y*S+S/2+S/10);
            teka.drawLine(g,(this.x+1)*S-S/10,this.y*S+S/2+S/10,(this.x+1)*S+S/10,this.y*S+S/2-S/10);
        } else {
            g.strokeStyle = '#f00';
            g.lineWidth = 3;
            teka.drawLine(g,this.x*S+S/2-S/10,(this.y+1)*S-S/10,this.x*S+S/2+S/10,(this.y+1)*S+S/10);
            teka.drawLine(g,this.x*S+S/2-S/10,(this.y+1)*S+S/10,this.x*S+S/2+S/10,(this.y+1)*S-S/10);
        }
    }

    g.restore();
};

//////////////////////////////////////////////////////////////////

/** Handles mousemove event. */
teka.viewer.masyu.MasyuViewer.prototype.processMousemoveEvent = function(xc, yc, pressed)
{
    this.coord = this.normalizeCoordinates(xc,yc);

    var oldx = this.x;
    var oldy = this.y;
    var old_cursor = this.cursor_mode;

    if (this.start===undefined ||
        this.start.x!=this.coord.x ||
        this.start.y!=this.coord.y) {
        this.moved = true;
    }

    if (this.coord.x<0 || this.coord.x>=this.X ||
        this.coord.y<0 || this.coord.y>=this.Y) {
        return false;
    }

    this.x = this.coord.x;
    this.y = this.coord.y;

    if (pressed
        && this.cursor_mode==teka.viewer.masyu.Defaults.CELL) {
        this.processMousedraggedEvent(xc,yc);
        return true;
    }

    this.checkCloseToEdge(this.coord);

    return this.x!=oldx || this.y!=oldy || this.cursor_mode!=old_cursor;
};

/** Handles mousedown event. */
teka.viewer.masyu.MasyuViewer.prototype.processMousedownEvent = function(xc, yc)
{
    this.processMousemoveEvent(xc,yc,false);

    this.startx = xc;
    this.starty = yc;
    this.start = this.coord;
    this.moved = false;

    return true;
};

/** Handles mouseup event. */
teka.viewer.masyu.MasyuViewer.prototype.processMouseupEvent = function(xc, yc)
{
    this.processMousemoveEvent(xc,yc,false);

    if (!this.moved)
        {
            if (this.start.top==this.coord.top &&
                this.start.bottom==this.coord.bottom &&
                this.cursor_mode==teka.viewer.masyu.Defaults.H_EDGE) {
                this.setEdge(this.x,this.y,this.get(this.x,this.y,false)==2?0:2,false);
            }
            if (this.start.left==this.coord.left &&
                this.start.right==this.coord.right &&
                this.cursor_mode==teka.viewer.masyu.Defaults.V_EDGE) {
                this.setEdge(this.x,this.y,this.get(this.x,this.y,true)==2?0:2,true);
            }
            if (this.cursor_mode==teka.viewer.masyu.Defaults.CELL) {
                this.set(this.x,this.y,!this.f[this.x][this.y]);
            }
        }

    this.startx = false;
    this.starty = false;

    return true;
};

/**
 * Handles pseudo event 'mousedragged'
 * Horizontal and vertical lines are treated separately, as
 * much faster algorithms can be applied and they should make up the
 * majority of use cases.
 */
teka.viewer.masyu.MasyuViewer.prototype.processMousedraggedEvent = function(xc, yc)
{
    if (this.startx===false || this.starty===false) {
        this.startx = xc;
        this.starty = yc;
        this.start = this.coord;
        this.moved = false;
        return;
    }

    var lastx = this.startx;
    var lasty = this.starty;
    this.startx = xc;
    this.starty = yc;

    var from = this.normalizeCoordinates(lastx,lasty);
    var to = this.normalizeCoordinates(this.startx,this.starty);

    if (from.x==to.x && from.y==to.y) {
        return;
    }

    // horizontal line
    if (from.y==to.y) {
        if (to.x>from.x) {
            for (var x=from.x;x<to.x;x++) {
                this.setEdge(x,from.y,(this.get(x,from.y,true)+1)%2,true);
            }
        }
        else {
            for (var x=from.x;x>to.x;x--) {
                this.setEdge(x-1,from.y,(this.get(x-1,from.y,true)+1)%2,true);
            }
        }
        return;
    }

    // vertical line
    if (from.x==to.x) {
        if (to.y>from.y) {
            for (var y=from.y;y<to.y;y++) {
                this.setEdge(from.x,y,(this.get(from.x,y,false)+1)%2,false);
            }
        }
        else {
            for (var y=from.y;y>to.y;y--) {
                this.setEdge(from.x,y-1,(this.get(from.x,y-1,false)+1)%2,false);
            }
        }
        return;
    }

    // draw line from from to to
    while (from.x!=to.x || from.y!=to.y) {
        if (Math.abs(to.x-from.x)>=Math.abs(to.y-from.y)) {
            if (to.x>from.x) {
                this.setEdge(from.x,from.y,(this.get(from.x,from.y,true)+1)%2,true);
                from.x++;
            } else {
                this.setEdge(from.x-1,from.y,(this.get(from.x-1,from.y,true)+1)%2,true);
                from.x--;
            }
        } else {
            if (to.y>from.y) {
                this.setEdge(from.x,from.y,(this.get(from.x,from.y,false)+1)%2,false);
                from.y++;
            } else {
                this.setEdge(from.x,from.y-1,(this.get(from.x,from.y-1,false)+1)%2,false);
                from.y--;
            }
        }
    }
};

/** Handles keydown event. */
teka.viewer.masyu.MasyuViewer.prototype.processKeydownEvent = function(e)
{
    if (e.key==teka.KEY_DOWN) {
        if (this.y<this.Y-1) {
            if (e.shift) {
                this.setEdge(this.x,this.y,(this.get(this.x,this.y,false)+1)%2,false);
            }
            this.y++;
        }
        return true;
    }
    if (e.key==teka.KEY_UP) {
        if (this.y>0) {
            if (e.shift) {
                this.setEdge(this.x,this.y-1,(this.get(this.x,this.y-1,false)+1)%2,false);
            }
            this.y--;
        }
        return true;
    }
    if (e.key==teka.KEY_RIGHT) {
        if (this.x<this.X-1) {
            if (e.shift) {
                this.setEdge(this.x,this.y,(this.get(this.x,this.y,true)+1)%2,true);
            }
            this.x++;
        }
        return true;
    }
    if (e.key==teka.KEY_LEFT) {
        if (this.x>0) {
            if (e.shift) {
                this.setEdge(this.x-1,this.y,(this.get(this.x-1,this.y,true)+1)%2,true);
            }
            this.x--;
        }
        return true;
    }

    if (e.key==teka.KEY_SHIFT) {
        return true;
    }

    if (e.key==teka.KEY_SPACE) {
        this.set(this.x,this.y,0);
        return true;
    }

    if (e.key==teka.KEY_HASH || e.key==teka.KEY_X) {
        this.set(this.x,this.y,1);
        return true;
    }

    return false;
};

/** Handles keyup event. */
teka.viewer.masyu.MasyuViewer.prototype.processKeyupEvent = function(e)
{
    return false;
};

//////////////////////////////////////////////////////////////////

/**
 * If mouse is close to an edge, replace the normal cursor by an
 * edge cursor.
 */
teka.viewer.masyu.MasyuViewer.prototype.checkCloseToEdge = function(coord)
{
    if (coord.center) {
        this.cursor_mode = teka.viewer.masyu.Defaults.CELL;
        return;
    }

    if (coord.left && coord.x>0) {
        this.cursor_mode = teka.viewer.masyu.Defaults.V_EDGE;
        this.x--;
        return;
    }

    if (coord.right && coord.x<this.X-1) {
        this.cursor_mode = teka.viewer.masyu.Defaults.V_EDGE;
        return;
    }

    if (coord.top && coord.y>0) {
        this.cursor_mode = teka.viewer.masyu.Defaults.H_EDGE;
        this.y--;
        return;
    }

    if (coord.bottom && coord.y<this.Y-1) {
        this.cursor_mode = teka.viewer.masyu.Defaults.H_EDGE;
        return;
    }

    this.cursor_mode = teka.viewer.masyu.Defaults.CELL;
};

//////////////////////////////////////////////////////////////////

/** Sets the value of an edge, if the color fits. */
teka.viewer.masyu.MasyuViewer.prototype.setEdge = function(x, y, value, vertical)
{
    if (vertical) {
        this.setVertical(x,y,value);
    } else {
        this.setHorizontal(x,y,value);
    }
};

/** Sets the value of a vertical edge. */
teka.viewer.masyu.MasyuViewer.prototype.setVertical = function(x, y, value)
{
    if (x<0 || x>=this.X-1 || y<0 || y>=this.Y) {
        return;
    }

    if (this.fr[x][y]!=0 && this.cr[x][y]!=this.color) {
        return;
    }

    this.fr[x][y] = value;
    this.cr[x][y] = this.color;
};

/** Sets the value of a horizontal edge. */
teka.viewer.masyu.MasyuViewer.prototype.setHorizontal = function(x, y, value)
{
    if (x<0 || x>=this.X || y<0 || y>=this.Y-1) {
        return;
    }

    if (this.fd[x][y]!=0 && this.cd[x][y]!=this.color) {
        return;
    }

    this.fd[x][y] = value;
    this.cd[x][y] = this.color;
};

/** Gets the value of an edge. */
teka.viewer.masyu.MasyuViewer.prototype.get = function(x, y, vertical)
{
    if (vertical) {
        if (x<0 || x>=this.X-1 || y<0 || y>=this.Y) {
            return 0;
        }

        return this.fr[x][y];
    }

    if (x<0 || x>=this.X || y<0 || y>=this.Y-1) {
        return 0;
    }

    return this.fd[x][y];
};

/** Sets the value of a cell, if the color fits. */
teka.viewer.masyu.MasyuViewer.prototype.set = function(x,y,value)
{
    if (this.f[x][y]!=0 && this.c[x][y]!=this.color) {
        return;
    }

    this.f[x][y] = value;
    this.c[x][y] = this.color;
};
