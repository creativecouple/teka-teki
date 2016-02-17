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
teka.viewer.starry_sky = {};

/** Some constants. */
teka.viewer.starry_sky.Defaults = {
    EMPTY: 0,
    STAR: 1,
    NONE: 2,
    R: 8,
    L: 4,
    O: 6,
    U: 2,
    OR: 7,
    UR: 1,
    OL: 5,
    UL: 3
};

/** Constructor */
teka.viewer.starry_sky.Starry_skyViewer = function(data)
{
    teka.viewer.PuzzleViewer.call(this,data);

    this.x = 0;
    this.y = 0;
};
teka.extend(teka.viewer.starry_sky.Starry_skyViewer,teka.viewer.PuzzleViewer);

//////////////////////////////////////////////////////////////////

/** Initialize this viewer width the PSData object provided. */
teka.viewer.starry_sky.Starry_skyViewer.prototype.initData = function(data)
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
    this.error_top = teka.new_array([this.X],false);
    this.error_left = teka.new_array([this.Y],false);
};

/** Read puzzle from ascii art. */
teka.viewer.starry_sky.Starry_skyViewer.prototype.asciiToData = function(ascii, d)
{
    if (ascii===false) {
        return;
    }

    var grid = this.asciiToArray(ascii);

    this.puzzle = teka.new_array([this.X,this.Y],0);
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            switch (grid[d*i+d+d-1][j+1]) {
              case teka.ord('q'): this.puzzle[i][j] = teka.viewer.starry_sky.Defaults.OL; break;
              case teka.ord('w'): this.puzzle[i][j] = teka.viewer.starry_sky.Defaults.O; break;
              case teka.ord('e'): this.puzzle[i][j] = teka.viewer.starry_sky.Defaults.OR; break;
              case teka.ord('d'): this.puzzle[i][j] = teka.viewer.starry_sky.Defaults.R; break;
              case teka.ord('c'): this.puzzle[i][j] = teka.viewer.starry_sky.Defaults.UR; break;
              case teka.ord('x'): this.puzzle[i][j] = teka.viewer.starry_sky.Defaults.U; break;
              case teka.ord('y'): this.puzzle[i][j] = teka.viewer.starry_sky.Defaults.UL; break;
              case teka.ord('a'): this.puzzle[i][j] = teka.viewer.starry_sky.Defaults.L; break;
              case teka.ord('*'): this.puzzle[i][j] = -teka.viewer.starry_sky.Defaults.STAR; break;
              case teka.ord('-'): this.puzzle[i][j] = -teka.viewer.starry_sky.Defaults.NONE; break;
              default: this.puzzle[i][j] = 0; break;
            }
        }
    }

    this.topdata = teka.new_array([this.X],false);
    for (var i=0;i<this.X;i++) {
        this.topdata[i] = this.getNr(grid,d*i+d,0,d);
    }

    this.leftdata = teka.new_array([this.Y],false);
    for (var j=0;j<this.Y;j++) {
        this.leftdata[j] = this.getNr(grid,0,j+1,d);
    }
};

/** Read solution from ascii art. */
teka.viewer.starry_sky.Starry_skyViewer.prototype.asciiToSolution = function(ascii)
{
    if (ascii===false) {
        return;
    }

    var grid = this.asciiToArray(ascii);

    this.solution = teka.new_array([this.X,this.Y],teka.viewer.starry_sky.Defaults.NONE);
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            if (grid[i][j]==teka.ord('*')) {
                this.solution[i][j] = teka.viewer.starry_sky.Defaults.STAR;
            }
        }
    }
};

/** Add solution. */
teka.viewer.starry_sky.Starry_skyViewer.prototype.addSolution = function()
{
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            this.f[i][j] = this.solution[i][j];
        }
    }
};

//////////////////////////////////////////////////////////////////

/** Returns a small example. */
teka.viewer.starry_sky.Starry_skyViewer.prototype.getExample = function()
{
    return '/format 1\n/type (starry_sky)\n/sol false\n/X 5\n/Y 5\n/digits 2\n'
        +'/puzzle [ (   1 1 3 2 2) (         a y) (            ) (            ) '
        +'( 1       e a) ( 2     d    ) ]\n/solution [ (***  ) (   * ) (  * *) '
        +'(  *  ) (   **) ]';
};

/** Returns a list of automatically generated properties. */
teka.viewer.starry_sky.Starry_skyViewer.prototype.getProperties = function()
{
    return [teka.translate('generic_size',[this.X+'x'+this.Y])];
};

//////////////////////////////////////////////////////////////////

/** Reset the whole diagram. */
teka.viewer.starry_sky.Starry_skyViewer.prototype.reset = function()
{
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            this.f[i][j]=0;
            this.c[i][j]=0;
        }
    }
};

/** Reset the error marks. */
teka.viewer.starry_sky.Starry_skyViewer.prototype.clearError = function()
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
teka.viewer.starry_sky.Starry_skyViewer.prototype.copyColor = function(color)
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
teka.viewer.starry_sky.Starry_skyViewer.prototype.clearColor = function(color)
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
teka.viewer.starry_sky.Starry_skyViewer.prototype.saveState = function()
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
teka.viewer.starry_sky.Starry_skyViewer.prototype.loadState = function(state)
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
teka.viewer.starry_sky.Starry_skyViewer.prototype.check = function()
{
    var X = this.X;
    var Y = this.Y;

    // copy givens
    for (var i=0;i<X;i++) {
        for (var j=0;j<Y;j++) {
            if (this.puzzle[i][j]<0) {
                this.f[i][j] = -this.puzzle[i][j];
            } else if (this.puzzle[i][j]>0) {
                this.f[i][j] = 0;
            }
        }
    }

    // count stars in column
    for (var j=0;j<Y;j++) {
        if (this.leftdata[j]!==false) {
            var c = 0;
            for (var i=0;i<X;i++) {
                if (this.f[i][j]==teka.viewer.starry_sky.Defaults.STAR) {
                    c++;
                }
            }
            if (c!=this.leftdata[j]) {
                this.error_left[j] = true;
                for (var i=0;i<X;i++) {
                    if (this.f[i][j]==teka.viewer.starry_sky.Defaults.STAR) {
                        this.error[i][j] = true;
                    }
                }
                return 'starry_sky_row';
            }
        }
    }

    // count stars in row
    for (var i=0;i<X;i++) {
        if (this.topdata[i]!==false) {
            var c = 0;
            for (var j=0;j<Y;j++) {
                if (this.f[i][j]==teka.viewer.starry_sky.Defaults.STAR) {
                    c++;
                }
            }
            if (c!=this.topdata[i]) {
                this.error_top[i] = true;
                for (var j=0;j<Y;j++) {
                    if (this.f[i][j]==teka.viewer.starry_sky.Defaults.STAR) {
                        this.error[i][j] = true;
                    }
                }
                return 'starry_sky_col';
            }
        }
    }

    // follow all arrows
    var t = teka.new_array([X,Y],false);

    var dx = 0;
    var dy = 0;
    for (var i=0;i<X;i++) {
        for (var j=0;j<Y;j++) {
            if (this.puzzle[i][j]>0) {
                switch (this.puzzle[i][j]) {
                  case teka.viewer.starry_sky.Defaults.O:  dx =  0; dy = -1; break;
                  case teka.viewer.starry_sky.Defaults.U:  dx =  0; dy =  1; break;
                  case teka.viewer.starry_sky.Defaults.L:  dx = -1; dy =  0; break;
                  case teka.viewer.starry_sky.Defaults.R:  dx =  1; dy =  0; break;
                  case teka.viewer.starry_sky.Defaults.UR: dx =  1; dy =  1; break;
                  case teka.viewer.starry_sky.Defaults.UL: dx = -1; dy =  1; break;
                  case teka.viewer.starry_sky.Defaults.OR: dx =  1; dy = -1; break;
                  case teka.viewer.starry_sky.Defaults.OL: dx = -1; dy = -1; break;
                }

                var x = i;
                var y = j;
                var ok = false;
                while (x>=0 && y>=0 && x<X && y<Y) {
                    t[x][y] = true;
                    if (this.f[x][y]==teka.viewer.starry_sky.Defaults.STAR) {
                        ok = true;
                    }
                    x+=dx;
                    y+=dy;
                }
                if (!ok) {
                    this.error[i][j] = true;
                    return 'starry_sky_zero_pointer';
                }
            }
        }
    }

    // are there stars left?
    for (var i=0;i<X;i++) {
        for (var j=0;j<Y;j++) {
            if (this.f[i][j]==teka.viewer.starry_sky.Defaults.STAR && !t[i][j]) {
                this.error[i][j] = true;
                return 'starry_sky_no_pointer';
            }
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
teka.viewer.starry_sky.Starry_skyViewer.prototype.setMetrics = function(g)
{
    this.scale = Math.floor(Math.min((this.width-1)/(this.X+1),
                                     (this.height-1)/(this.Y+1)));
    var realwidth = (this.X+1)*this.scale+1;
    var realheight = (this.Y+1)*this.scale+1;

    this.deltaX = Math.floor((this.width-realwidth)/2)+0.5;
    this.deltaY = Math.floor((this.height-realheight)/2)+0.5;

    this.font = teka.getFontData(Math.round(this.scale/2)+'px sans-serif',this.scale);

    if (realwidth>this.width || realheight>this.height) {
        this.scale=false;
    }
    return {width:realwidth,height:realheight,scale:this.scale};
};

/** Paints the diagram. */
teka.viewer.starry_sky.Starry_skyViewer.prototype.paint = function(g)
{
    var X = this.X;
    var Y = this.Y;
    var S = this.scale;

    g.save();
    g.translate(this.deltaX,this.deltaY);

    g.fillStyle = '#fff';
    g.fillRect(S,S,X*S,Y*S);

    for (var i=0;i<X;i++) {
        for (var j=0;j<Y;j++) {
            g.fillStyle = this.isBlinking()?
                this.getBlinkColor(i,j,X,this.f[i][j]):
                (this.error[i][j]?'#f00':'#fff');
            g.fillRect((i+1)*S,(j+1)*S,S,S);
        }
    }

    g.strokeStyle = '#000';
    for (var i=1;i<=X+1;i++) {
        teka.drawLine(g,i*S,S,i*S,(Y+1)*S);
    }
    for (var j=1;j<=Y+1;j++) {
        teka.drawLine(g,S,j*S,(X+1)*S,j*S);
    }

    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.font = this.font.font;
    for (var i=0;i<X;i++) {
        if (this.error_top[i]) {
            g.fillStyle = '#f00';
            teka.fillOval(g,(i+1)*S+S/2,S/2,S/2);
            g.strokeStyle = '#000';
            teka.strokeOval(g,(i+1)*S+S/2,S/2,S/2);
        }
        g.fillStyle = '#000';
        if (this.topdata[i]!==false) {
            g.fillText(this.topdata[i],(i+1)*S+S/2,S/2+this.font.delta);
        }
    }

    for (var j=0;j<Y;j++) {
        if (this.error_left[j]) {
            g.fillStyle = '#f00';
            teka.fillOval(g,S/2,(j+1)*S+S/2,S/2);
            g.strokeStyle = '#000';
            teka.strokeOval(g,S/2,(j+1)*S+S/2,S/2);
        }
        g.fillStyle = '#000';
        if (this.leftdata[j]!==false) {
            g.fillText(this.leftdata[j],S/2,(j+1)*S+S/2+this.font.delta);
        }
    }

    for (var i=0;i<X;i++) {
        for (var j=0;j<Y;j++) {
            if (this.puzzle[i][j]>0) {
                g.fillStyle = '#000';
                g.strokeStyle = '#000';
                this.drawArrow(g,(i+1)*S+S/2,(j+1)*S+S/2,this.puzzle[i][j]);
                if (this.f[i][j]==1) {
                    g.strokeStyle = this.getColorString(this.c[i][j]);
                    teka.drawLine(g,S+i*S+S/2-S/4,S+j*S+S/2-S/4,S+i*S+S/2+S/4,S+j*S+S/2+S/4);
                    teka.drawLine(g,S+i*S+S/2+S/4,S+j*S+S/2-S/4,S+i*S+S/2-S/4,S+j*S+S/2+S/4);
                }
                continue;
            }
            if (this.puzzle[i][j]==-teka.viewer.starry_sky.Defaults.STAR) {
                g.fillStyle = '#000';
                this.fillStar(g,(i+1)*S+S/2,(j+1)*S+S/2);
                continue;
            }
            if (this.puzzle[i][j]==-teka.viewer.starry_sky.Defaults.NONE) {
                g.strokeStyle = '#000';
                g.lineWidth = 2;
                teka.drawLine(g,(i+1)*S+S/4,Math.floor((j+1)*S+S/2)+0.5,(i+2)*S-S/4,Math.floor((j+1)*S+S/2)+0.5);
                g.lineWidth = 1;
                continue;
            }

            g.strokeStyle = this.getColorString(this.c[i][j]);
            g.fillStyle = this.getColorString(this.c[i][j]);
            if (this.f[i][j]==teka.viewer.starry_sky.Defaults.STAR) {
                this.fillStar(g,(i+1)*S+S/2,(j+1)*S+S/2+S/15);
            } else if (this.f[i][j]==teka.viewer.starry_sky.Defaults.NONE) {
                teka.drawLine(g,(i+1)*S+S/4,(j+1)*S+S/2,(i+2)*S-S/4,(j+1)*S+S/2);
            }
        }
    }

    // paint cursor
    if (this.mode==teka.viewer.Defaults.NORMAL) {
        g.strokeStyle = '#f00';
        g.lineWidth = 2;
        g.strokeRect(S*(this.x+1)+3.5,S*(this.y+1)+3.5,S-7,S-7);
    }

    g.restore();
};

//////////////////////////////////////////////////////////////////

/** Handles mousemove event. */
teka.viewer.starry_sky.Starry_skyViewer.prototype.processMousemoveEvent = function(xc, yc, pressed)
{
    xc -= this.deltaX;
    yc -= this.deltaY;

    var oldx = this.x;
    var oldy = this.y;

    this.x = Math.floor(xc/this.scale)-1;
    this.y = Math.floor(yc/this.scale)-1;

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
teka.viewer.starry_sky.Starry_skyViewer.prototype.processMousedownEvent = function(xc, yc)
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
teka.viewer.starry_sky.Starry_skyViewer.prototype.processMouseupEvent = function(xc, yc)
{
    this.processMousemoveEvent(xc,yc,false);

    if (!this.moved) {
        if (this.puzzle[this.x][this.y]>0) {
            this.set(this.x,this.y,(this.f[this.x][this.y]+1)%2);
        } else {
            this.set(this.x,this.y,(this.f[this.x][this.y]+1)%3);
        }
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
teka.viewer.starry_sky.Starry_skyViewer.prototype.processMousedraggedEvent = function(xc, yc)
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
                if (this.puzzle[i][this.y]===0) {
                    this.set(i,this.y,teka.viewer.starry_sky.Defaults.STAR);
                }
            }
        } else {
            for (var i=lastx;i<=this.x;i++) {
                if (this.puzzle[i][this.y]===0) {
                    this.set(i,this.y,teka.viewer.starry_sky.Defaults.STAR);
                }
            }
        }
        return;
    }

    if (this.x==lastx) {
        if (this.y<lasty) {
            for (var j=this.y;j<=lasty;j++) {
                if (this.puzzle[this.x][j]===0) {
                    this.set(this.x,j,teka.viewer.starry_sky.Defaults.STAR);
                }
            }
        } else {
            for (var j=lasty;j<=this.y;j++) {
                if (this.puzzle[this.x][j]===0) {
                    this.set(this.x,j,teka.viewer.starry_sky.Defaults.STAR);
                }
            }
        }
        return;
    }

    while (lastx!=this.x && lasty!=this.y)
        {
            if (this.puzzle[lastx][lasty]===0) {
                this.set(lastx,lasty,teka.viewer.starry_sky.Defaults.STAR);
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
    if (this.puzzle[this.x][this.y]===0) {
        this.set(this.x,this.y,teka.viewer.starry_sky.Defaults.STAR);
    }
};

/** Handles keydown event. */
teka.viewer.starry_sky.Starry_skyViewer.prototype.processKeydownEvent = function(e)
{
    if (e.key==teka.KEY_DOWN) {
        if (this.y<this.Y-1) {
            this.y++;
            if (e.shift && this.puzzle[this.x][this.y]===0) {
                this.set(this.x,this.y,teka.viewer.starry_sky.Defaults.STAR);
            }
        }
        return true;
    }
    if (e.key==teka.KEY_UP) {
        if (this.y>0) {
            this.y--;
            if (e.shift && this.puzzle[this.x][this.y]===0) {
                this.set(this.x,this.y,teka.viewer.starry_sky.Defaults.STAR);
            }
        }
        return true;
    }
    if (e.key==teka.KEY_RIGHT) {
        if (this.x<this.X-1) {
            this.x++;
            if (e.shift && this.puzzle[this.x][this.y]===0) {
                this.set(this.x,this.y,teka.viewer.starry_sky.Defaults.STAR);
            }
        }
        return true;
    }
    if (e.key==teka.KEY_LEFT) {
        if (this.x>0) {
            this.x--;
            if (e.shift && this.puzzle[this.x][this.y]===0) {
                this.set(this.x,this.y,teka.viewer.starry_sky.Defaults.STAR);
            }
        }
        return true;
    }

    if (this.x<0 || this.x>=this.X || this.y<0 || this.y>=this.Y) {
        return false;
    }

    if (this.puzzle[this.x][this.y]>0) {
        if (e.key==teka.KEY_HASH || e.key==teka.KEY_Q || e.key==teka.KEY_STAR) {
            this.set(this.x,this.y,1);
        } else if (e.key==teka.KEY_SPACE) {
            this.set(this.x,this.y,0);
        }
        return true;
    }

    if (e.key==teka.KEY_HASH || e.key==teka.KEY_Q || e.key==teka.KEY_STAR) {
        this.set(this.x,this.y,teka.viewer.starry_sky.Defaults.STAR);
        return true;
    }

    if (e.key==teka.KEY_MINUS || e.key==teka.KEY_W) {
        this.set(this.x,this.y,teka.viewer.starry_sky.Defaults.NONE);
        return true;
    }

    if (e.key==teka.KEY_SPACE) {
        this.set(this.x,this.y,teka.viewer.starry_sky.Defaults.EMPTY);
        return true;
    }

    return false;
};

//////////////////////////////////////////////////////////////////

/** Sets the value of a cell, if the color fits. */
teka.viewer.starry_sky.Starry_skyViewer.prototype.set = function(x, y, value)
{
    if (this.f[x][y]!=0 && this.c[x][y]!=this.color) {
        return;
    }

    this.f[x][y] = value;
    this.c[x][y] = this.color;
};
