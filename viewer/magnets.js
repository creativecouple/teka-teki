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
teka.viewer.magnets = {};

/** Some constants. */
teka.viewer.magnets.Defaults = {
    NONE: 0,
    PLUS: 1,
    MINUS: 2,
    NEUTRAL: 3,
    MAGNET: 4,

    TOP: 1,
    LEFT: 2,
    BOTTOM: 3,
    RIGHT: 4
};

/** Constructor */
teka.viewer.magnets.MagnetsViewer = function(data)
{
    teka.viewer.PuzzleViewer.call(this,data);

    this.x = 0;
    this.y = 0;
};
teka.extend(teka.viewer.magnets.MagnetsViewer,teka.viewer.PuzzleViewer);

//////////////////////////////////////////////////////////////////

/** Initialize this viewer width the PSData object provided. */
teka.viewer.magnets.MagnetsViewer.prototype.initData = function(data)
{
    this.X = parseInt(data.get('X'),10);
    this.Y = parseInt(data.get('Y'),10);
    var digits = data.get('digits');
    digits = digits===false?1:parseInt(data.get('digits'),10);
    this.asciiToData(data.get('puzzle'),digits);
    this.solution = this.asciiToSolution(data.get('solution'));

    this.f = teka.new_array([this.X,this.Y],0);
    this.c = teka.new_array([this.X,this.Y],0);
    this.error = teka.new_array([this.X,this.Y],false);
    this.error_left = teka.new_array([2,this.Y],false);
    this.error_top = teka.new_array([this.X,2],false);
};

/** Read puzzle from ascii art. */
teka.viewer.magnets.MagnetsViewer.prototype.asciiToData = function(ascii,d)
{
    if (ascii===false) {
        return;
    }

    var grid = this.asciiToArray(ascii);

    this.puzzle = teka.new_array([this.X,this.Y],0);
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            switch (grid[2*i+2*d+1][2*j+2*d+1]) {
              case teka.ord('+'): this.puzzle[i][j] = teka.viewer.magnets.Defaults.PLUS; break;
              case teka.ord('-'): this.puzzle[i][j] = teka.viewer.magnets.Defaults.MINUS; break;
              case teka.ord('#'): this.puzzle[i][j] = teka.viewer.magnets.Defaults.NEUTRAL; break;
              default: this.puzzle[i][j] = teka.viewer.magnets.Defaults.NONE;
            }
        }
    }

    this.magnets = teka.new_array([this.X,this.Y],0);
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            if (grid[2*i+2*d+2][2*j+2*d+1]==teka.ord(' ')) {
                this.magnets[i][j] = teka.viewer.magnets.Defaults.LEFT;
                this.magnets[i+1][j] = teka.viewer.magnets.Defaults.RIGHT;
            } else if (grid[2*i+2*d+1][2*j+2*d+2]==teka.ord(' ')) {
                this.magnets[i][j] = teka.viewer.magnets.Defaults.TOP;
                this.magnets[i][j+1] = teka.viewer.magnets.Defaults.BOTTOM;
            }
        }
    }

    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            if (this.magnets[i][j]===0) {
                this.puzzle[i][j] = teka.viewer.magnets.Defaults.NEUTRAL;
            }
        }
    }

    this.leftdata = teka.new_array([2,this.Y],-1);
    for (var i=0;i<2;i++) {
        for (var j=0;j<this.Y;j++) {
            var nr = this.getNr(grid,i*d,2*j+2*d+1,d);
            if (nr!==false) {
                this.leftdata[i][j] = nr;
            }
        }
    }

    this.topdata = teka.new_array([this.X,2],-1);
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<2;j++) {
            var nr = this.getVNr(grid,2*i+2*d+1,j*d,d);
            if (nr!==false) {
                this.topdata[i][j] = nr;
            }
        }
    }
};

/** Read solution from ascii art. */
teka.viewer.magnets.MagnetsViewer.prototype.asciiToSolution = function(ascii)
{
    if (ascii===false) {
        return null;
    }

    var grid = this.asciiToArray(ascii);

    var h = teka.new_array([this.X,this.Y],0);
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            switch (grid[i][j]) {
              case teka.ord('+'): h[i][j] = teka.viewer.magnets.Defaults.PLUS; break;
              case teka.ord('-'): h[i][j] = teka.viewer.magnets.Defaults.MINUS; break;
              case teka.ord('#'): h[i][j] = teka.viewer.magnets.Defaults.NEUTRAL; break;
              default: h[i][j] = teka.viewer.magnets.Defaults.NONE;
            }
        }
    }

    return h;
};

/** Add solution. */
teka.viewer.magnets.MagnetsViewer.prototype.addSolution = function()
{
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            this.f[i][j] = this.solution[i][j];
        }
    }
};

//////////////////////////////////////////////////////////////////

/** Returns a small example. */
teka.viewer.magnets.MagnetsViewer.prototype.getExample = function()
{
    return '/format 1\n/type (magnets)\n/sol false\n/X 4\n/Y 4\n'
        +'/puzzle [ (+ |1 1 1 1 ) ( -|1 0 2 1 ) (--+-+-+-+-+) (11| | | |+|) '
        +'(  + + + + +) (11| | | |-|) (  +-+-+-+-+) (10| |   | |) (  + +-+-+ +) '
        +'(12| |   | |) (  +-+-+-+-+) ]\n'
        +'/solution [ (##-+) (##+-) (+###) (-+-#) ]';
};

/** Returns a list of automatically generated properties. */
teka.viewer.magnets.MagnetsViewer.prototype.getProperties = function()
{
    return [teka.translate('generic_size',[this.X+'x'+this.Y])];
};

//////////////////////////////////////////////////////////////////

/** Reset the whole diagram. */
teka.viewer.magnets.MagnetsViewer.prototype.reset = function()
{
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            this.f[i][j]=0;
            this.c[i][j]=0;
        }
    }
};

/** Reset the error marks. */
teka.viewer.magnets.MagnetsViewer.prototype.clearError = function()
{
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            this.error[i][j] = false;
        }
    }
    for (var j=0;j<this.Y;j++) {
        this.error_left[0][j] = this.error_left[1][j] = false;
    }
    for (var i=0;i<this.X;i++) {
        this.error_top[i][0] = this.error_top[i][1] = false;
    }
};

/** Copy digits colored with this.color to color. */
teka.viewer.magnets.MagnetsViewer.prototype.copyColor = function(color)
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
teka.viewer.magnets.MagnetsViewer.prototype.clearColor = function(color)
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
teka.viewer.magnets.MagnetsViewer.prototype.saveState = function()
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
teka.viewer.magnets.MagnetsViewer.prototype.loadState = function(state)
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
teka.viewer.magnets.MagnetsViewer.prototype.check = function()
{
    var X = this.X;
    var Y = this.Y;

    var check = this.flood();

    // Check if there are empty or non-unique symbols
    for (var i=0;i<X;i++) {
        for (var j=0;j<Y;j++) {
            if (check[i][j]===teka.viewer.magnets.Defaults.NONE) {
                this.setError(i,j);
                return 'magnets_empty';
            } else if (check[i][j]==teka.viewer.magnets.Defaults.MAGNET) {
                this.setError(i,j);
                return 'magnets_unique_symbol';
            }
        }
    }

    // Check if same poles touch horizontally
    for (var i=0;i<X-1;i++) {
        for (var j=0;j<Y;j++) {
            if ((check[i][j]==teka.viewer.magnets.Defaults.PLUS &&
                 check[i+1][j]==teka.viewer.magnets.Defaults.PLUS) ||
                (check[i][j]==teka.viewer.magnets.Defaults.MINUS &&
                 check[i+1][j]==teka.viewer.magnets.Defaults.MINUS)) {
                this.error[i][j] = true;
                this.error[i+1][j] = true;
                return 'magnets_equal_poles';
            }
        }
    }

    // Check if same poles touch vertically
    for (var i=0;i<X;i++) {
        for (var j=0;j<Y-1;j++) {
            if ((check[i][j]==teka.viewer.magnets.Defaults.PLUS &&
                 check[i][j+1]==teka.viewer.magnets.Defaults.PLUS) ||
                (check[i][j]==teka.viewer.magnets.Defaults.MINUS &&
                 check[i][j+1]==teka.viewer.magnets.Defaults.MINUS)) {
                this.error[i][j] = true;
                this.error[i][j+1] = true;
                return 'magnets_equal_poles';
            }
        }
    }

    // Check number of plus/minus in row
    for (var j=0;j<Y;j++) {
        var p = 0;
        var m = 0;
        for (var i=0;i<X;i++) {
            if (check[i][j]==teka.viewer.magnets.Defaults.PLUS) {
                p++;
            }
            if (check[i][j]==teka.viewer.magnets.Defaults.MINUS) {
                m++;
            }
        }

        if (p!=this.leftdata[0][j] && this.leftdata[0][j]!=-1) {
            this.error_left[0][j] = true;
            for (var i=0;i<X;i++) {
                if (check[i][j]==teka.viewer.magnets.Defaults.PLUS) {
                    this.error[i][j] = true;
                }
            }
            return 'magnets_row_plus';
        }

        if (m!=this.leftdata[1][j] && this.leftdata[1][j]!=-1) {
            this.error_left[1][j] = true;
            for (var i=0;i<X;i++) {
                if (check[i][j]==teka.viewer.magnets.Defaults.MINUS) {
                    this.error[i][j] = true;
                }
            }
            return 'magnets_row_minus';
        }
    }

    // Check number of plus/minus in column
    for (var i=0;i<X;i++) {
        var p = 0;
        var m = 0;
        for (var j=0;j<Y;j++) {
            if (check[i][j]==teka.viewer.magnets.Defaults.PLUS) {
                p++;
            }
            if (check[i][j]==teka.viewer.magnets.Defaults.MINUS) {
                m++;
            }
        }

        if (p!=this.topdata[i][0] && this.topdata[i][0]!=-1) {
            this.error_top[i][0] = true;
            for (var j=0;j<Y;j++) {
                if (check[i][j]==teka.viewer.magnets.Defaults.PLUS) {
                    this.error[i][j] = true;
                }
            }
            return 'magnets_column_plus';
        }

        if (m!=this.topdata[i][1] && this.topdata[i][1]!=-1) {
            this.error_top[i][1] = true;
            for (var j=0;j<Y;j++) {
                if (check[i][j]==teka.viewer.magnets.Defaults.MINUS) {
                    this.error[i][j] = true;
                }
            }
            return 'magnets_column_minus';
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
teka.viewer.magnets.MagnetsViewer.prototype.setMetrics = function(g)
{
    this.scale = Math.floor(Math.min((this.width-3)/(this.X+2),
                                     (this.height-3)/(this.Y+2)));
    var realwidth = (this.X+2) * this.scale + 3;
    var realheight = (this.Y+2) * this.scale + 3;

    this.deltaX = Math.floor((this.width-realwidth)/2)+0.5;
    this.deltaY = Math.floor((this.height-realheight)/2)+0.5;

    this.font = teka.getFontData(Math.round(this.scale/2)+'px sans-serif',this.scale);

    if (realwidth>this.width || realheight>this.height) this.scale=false;
    return {width:realwidth,height:realheight,scale:this.scale};
};

/** Paints the diagram. */
teka.viewer.magnets.MagnetsViewer.prototype.paint = function(g)
{
    var X = this.X;
    var Y = this.Y;
    var S = this.scale;

    g.save();
    g.translate(this.deltaX+1,this.deltaY+1);

    g.fillStyle = '#fff';
    g.fillRect(0,0,(X+2)*S,(Y+2)*S);

    // fill background of top
    for (var i=0;i<X;i++) {
        for (var j=0;j<2;j++) {
            g.fillStyle = this.error_top[i][j]?'#f00':'#fff';
            g.fillRect((2+i)*S,j*S,S,S);
        }
    }

    // fill background of left
    for (var i=0;i<2;i++) {
        for (var j=0;j<Y;j++) {
            g.fillStyle = this.error_left[i][j]?'#f00':'#fff';
            g.fillRect(i*S,(2+j)*S,S,S);
        }
    }

    // fill background of center
    for (var i=0;i<X;i++) {
        for (var j=0;j<Y;j++) {
            g.fillStyle = this.isBlinking()?
                this.getBlinkColor(i,j,X,this.f[i][j]):
                '#fff';

            if (this.magnets[i][j]==teka.viewer.magnets.Defaults.LEFT) {
                g.fillRect((2+i)*S,(2+j)*S,2*S,S);
            } else if (this.magnets[i][j]==teka.viewer.magnets.Defaults.TOP) {
                g.fillRect((2+i)*S,(2+j)*S,S,2*S);
            }
        }
    }

    // paint top numbers
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillStyle = '#000';
    g.font = this.font.font;
    for (var i=0;i<X;i++) {
        if (this.topdata[i][0]!=-1) {
            g.fillText(this.topdata[i][0],(2+i)*S+S/2,S/2+this.font.delta);
        }
        if (this.topdata[i][1]!=-1) {
            g.fillText(this.topdata[i][1],(2+i)*S+S/2,S+S/2+this.font.delta);
        }
    }

    // paint left numbers
    for (var j=0;j<Y;j++) {
        if (this.leftdata[0][j]!=-1) {
            g.fillText(this.leftdata[0][j],S/2,(2+j)*S+S/2+this.font.delta);
        }
        if (this.leftdata[1][j]!=-1) {
            g.fillText(this.leftdata[1][j],S+S/2,(2+j)*S+S/2+this.font.delta);
        }
    }

    // paint center
    var ff = this.flood();
    for (var i=0;i<X;i++) {
        for (var j=0;j<Y;j++) {
            if (this.error[i][j]) {
                g.fillStyle = '#f00';
                g.fillRect((2+i)*S-0.5,(2+j)*S-0.5,S+1,S+1);
            }

            if (this.puzzle[i][j]>0) {
                g.strokeStyle = '#000';
                g.fillStyle = '#000';
            } else {
                g.strokeStyle = this.getColorString(this.c[i][j]);
                g.fillStyle = this.getColorString(this.c[i][j]);
            }

            switch (this.puzzle[i][j]>0?this.puzzle[i][j]:ff[i][j]) {
              case teka.viewer.magnets.Defaults.PLUS:
                this.drawPlus(g,(2+i)*S,(2+j)*S);
                break;
              case teka.viewer.magnets.Defaults.MINUS:
                this.drawMinus(g,(2+i)*S,(2+j)*S);
                break;
              case teka.viewer.magnets.Defaults.NEUTRAL:
                if (!this.error[i][j]) {
                    g.fillRect((2+i)*S-0.5,(2+j)*S-0.5,S+1,S+1);
                }
                break;
              case teka.viewer.magnets.Defaults.MAGNET:
                this.drawPlusMinus(g,(2+i)*S,(2+j)*S);
                break;
            }
        }
    }

    g.strokeStyle = '#000';
    this.drawPlus(g,0,0);
    this.drawMinus(g,S,S);

    // paint grid
    g.strokeStyle = '#000';
    g.lineWidth = 3;
    g.strokeRect(0,0,(X+2)*S,(Y+2)*S);
    teka.drawLine(g,0,2*S,(X+2)*S,2*S);
    teka.drawLine(g,2*S,0,2*S,(Y+2)*S);

    g.lineWidth = 1;
    teka.drawLine(g,S,S,(X+2)*S,S);
    teka.drawLine(g,S,S,S,(Y+2)*S);

    for (var i=1;i<X;i++) {
        teka.drawLine(g,(i+2)*S,0,(i+2)*S,2*S);
    }
    for (var i=1;i<Y;i++) {
        teka.drawLine(g,0,(i+2)*S,2*S,(i+2)*S);
    }

    g.strokeStyle = '#000';
    for (var i=0;i<X;i++) {
        for (var j=0;j<Y;j++) {
            if (this.magnets[i][j]==teka.viewer.magnets.Defaults.LEFT) {
                g.strokeRect((2+i)*S,(2+j)*S,2*S,S);
            }
            if (this.magnets[i][j]==teka.viewer.magnets.Defaults.TOP) {
                g.strokeRect((2+i)*S,(2+j)*S,S,2*S);
            }
            if (this.magnets[i][j]===0) {
                g.strokeRect((2+i)*S,(2+j)*S,S,S);
            }
        }
    }

    // paint cursor
    if (this.mode==teka.viewer.Defaults.NORMAL) {
        if (this.x>=0 && this.x<X && this.y>=0 && this.y<Y) {
            g.strokeStyle = '#f00';
            g.lineWidth = 2;
            g.strokeRect(S*(this.x+2)+3.5,S*(this.y+2)+3.5,S-7,S-7);
        }
    }

    g.restore();
};

/** Paints a plus symbol in the cell x,y */
teka.viewer.magnets.MagnetsViewer.prototype.drawPlus = function(g, x, y)
{
    g.save();
    g.translate(Math.floor(this.scale/2)+0.5,Math.floor(this.scale/2)+0.5);
    g.lineWidth = 2;
    teka.drawLine(g,x-this.scale/4,y,x+this.scale/4,y);
    teka.drawLine(g,x,y-this.scale/4,x,y+this.scale/4);
    g.restore();
};

/** Paints a minus symbol in the cell x,y */
teka.viewer.magnets.MagnetsViewer.prototype.drawMinus = function(g, x, y)
{
    g.save();
    g.translate(Math.floor(this.scale/2)+0.5,Math.floor(this.scale/2)+0.5);
    g.lineWidth = 2;
    teka.drawLine(g,x-this.scale/4,y,x+this.scale/4,y);
    g.restore();
};

/** Paints a plus-minus symbol in the cell x,y */
teka.viewer.magnets.MagnetsViewer.prototype.drawPlusMinus = function(g, x, y)
{
    this.drawPlus(g,x,y-Math.floor(this.scale/8));
    this.drawMinus(g,x,y+Math.floor(this.scale/4));
};

//////////////////////////////////////////////////////////////////

/** Handles mousemove event. */
teka.viewer.magnets.MagnetsViewer.prototype.processMouseMovedEvent = function(xc, yc)
{
    xc = xc-this.deltaX-1;
    yc = yc-this.deltaY-1;

    var oldx = this.x;
    var oldy = this.y;

    this.x = Math.floor(xc/this.scale)-2;
    this.y = Math.floor(yc/this.scale)-2;

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
teka.viewer.magnets.MagnetsViewer.prototype.processMousePressedEvent = function(xc, yc)
{
    var erg = this.processMouseMovedEvent(xc,yc);

    if (this.x<0 || this.y<0 || this.x>=this.X || this.y>=this.Y) {
        return erg;
    }

    this.set(this.x,this.y,(this.f[this.x][this.y]+1)%5);

    return true;
};

/** Handles keydown event. */
teka.viewer.magnets.MagnetsViewer.prototype.processKeyEvent = function(e)
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

    if (this.x<0 || this.x>=this.X || this.y<0 || this.y>=this.Y) {
        return false;
    }

    if (e.key==teka.KEY_SPACE) {
        this.set(this.x,this.y,teka.viewer.magnets.Defaults.NONE);
        return true;
    }

    if (e.key==teka.KEY_PLUS || e.key==teka.KEY_Q) {
        this.set(this.x,this.y,teka.viewer.magnets.Defaults.PLUS);
        return true;
    }

    if (e.key==teka.KEY_MINUS || e.key==teka.KEY_W) {
        this.set(this.x,this.y,teka.viewer.magnets.Defaults.MINUS);
        return true;
    }

    if (e.key==teka.KEY_DOT || e.key==teka.KEY_HASH || e.key==teka.KEY_S) {
        this.set(this.x,this.y,teka.viewer.magnets.Defaults.MAGNET);
        return true;
    }

    if (e.key==teka.KEY_N || e.key==teka.KEY_SLASH || e.key==teka.KEY_A) {
        this.set(this.x,this.y,teka.viewer.magnets.Defaults.NEUTRAL);
        return true;
    }

    return false;
};

//////////////////////////////////////////////////////////////////

/** Sets the value of a cell, if the color fits. */
teka.viewer.magnets.MagnetsViewer.prototype.set = function(x, y, value)
{
    if (this.f[x][y]!=0 && this.c[x][y]!=this.color) {
        return;
    }

    this.f[x][y] = value;
    this.c[x][y] = this.color;

    if (value==teka.viewer.magnets.Defaults.PLUS) {
        value = teka.viewer.magnets.Defaults.MINUS;
    } else if (value==teka.viewer.magnets.Defaults.MINUS) {
        value = teka.viewer.magnets.Defaults.PLUS;
    }

    if (this.magnets[x][y]==teka.viewer.magnets.Defaults.LEFT) {
        this.f[x+1][y] = value;
        this.c[x+1][y] = this.color;
        return;
    }

    if (this.magnets[x][y]==teka.viewer.magnets.Defaults.TOP) {
        this.f[x][y+1] = value;
        this.c[x][y+1] = this.color;
        return;
    }

    if (x>0 && this.magnets[x-1][y]==teka.viewer.magnets.Defaults.LEFT) {
        this.f[x-1][y] = value;
        this.c[x-1][y] = this.color;
        return;
    }

    if (y>0 && this.magnets[x][y-1]==teka.viewer.magnets.Defaults.TOP) {
        this.f[x][y-1] = value;
        this.c[x][y-1] = this.color;
        return;
    }
};

/** When a magnet plate is set for error, color the whole plate. */
teka.viewer.magnets.MagnetsViewer.prototype.setError = function(x, y)
{
    this.error[x][y] = true;

    if (this.magnets[x][y]==teka.viewer.magnets.Defaults.LEFT) {
        this.error[x+1][y] = true;
    }

    if (this.magnets[x][y]==teka.viewer.magnets.Defaults.TOP) {
        this.error[x][y+1] = true;
    }

    if (x>0 && this.magnets[x-1][y]==teka.viewer.magnets.Defaults.LEFT) {
        this.error[x-1][y] = true;
    }

    if (y>0 && this.magnets[x][y-1]==teka.viewer.magnets.Defaults.TOP) {
        this.error[x][y-1] = true;
    }
};

//////////////////////////////////////////////////////////////////

/** Replace unknown magnets by plus and minus, if this can be deduced. */
teka.viewer.magnets.MagnetsViewer.prototype.flood = function()
{
    var result = teka.new_array([this.X,this.Y],0);
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            result[i][j] = this.puzzle[i][j]>0?this.puzzle[i][j]:this.f[i][j];
        }
    }

    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            if (result[i][j]==teka.viewer.magnets.Defaults.PLUS ||
                result[i][j]==teka.viewer.magnets.Defaults.MINUS) {
                this.fill(result,i-1,j,3-result[i][j]);
                this.fill(result,i+1,j,3-result[i][j]);
                this.fill(result,i,j-1,3-result[i][j]);
                this.fill(result,i,j+1,3-result[i][j]);
            }
        }
    }

    return result;
};

/** Recursive help for this.flood */
teka.viewer.magnets.MagnetsViewer.prototype.fill = function(f, x, y, value)
{
    if (x<0 || x>=this.X || y<0 || y>=this.Y) {
        return;
    }

    if (f[x][y]!=teka.viewer.magnets.Defaults.MAGNET) {
        return;
    }

    f[x][y] = value;

    this.fill(f,x-1,y,3-value);
    this.fill(f,x+1,y,3-value);
    this.fill(f,x,y-1,3-value);
    this.fill(f,x,y+1,3-value);
};
