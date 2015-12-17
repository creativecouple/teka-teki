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
teka.viewer.hashi = {};

/** Some constants. */
teka.viewer.hashi.Defaults = {
    HORIZONTAL_1: 1,
    HORIZONTAL_2: 2,
    VERTICAL_1: 3,
    VERTICAL_2: 4,

    UNKNOWN: -1
};

/** Constructor */
teka.viewer.hashi.HashiViewer = function(data)
{
    teka.viewer.PuzzleViewer.call(this,data);

    this.x = 0;
    this.y = 0;
};
teka.extend(teka.viewer.hashi.HashiViewer,teka.viewer.PuzzleViewer);

//////////////////////////////////////////////////////////////////

/** Initialize this viewer width the PSData object provided. */
teka.viewer.hashi.HashiViewer.prototype.initData = function(data)
{
    this.X = parseInt(data.get('X'),10);
    this.Y = parseInt(data.get('Y'),10);
    this.asciiToData(data.get('puzzle'));
    this.asciiToSolution(data.get('solution'));

    this.f = teka.new_array([this.X,this.Y],0);
    this.c = teka.new_array([this.X,this.Y],0);
    this.error = teka.new_array([this.X,this.Y],false);
};

/** Read puzzle from ascii art. */
teka.viewer.hashi.HashiViewer.prototype.asciiToData = function(ascii)
{
    if (ascii===false) {
        return;
    }

    var grid = this.asciiToArray(ascii);

    this.puzzle = teka.new_array([this.X,this.Y],0);
    this.bridges = teka.new_array([this.X,this.Y],0);
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            if (grid[i][j]>=teka.ord('1') &&
                grid[i][j]<=teka.ord('8')) {
                this.puzzle[i][j] = grid[i][j]-teka.ord('0');
            }
            if (grid[i][j]==teka.ord('?')) {
                this.puzzle[i][j] = teka.viewer.hashi.Defaults.UNKNOWN;
            }
            if (grid[i][j]==teka.ord('-')) {
                this.bridges[i][j] = teka.viewer.hashi.Defaults.HORIZONTAL_1;
            }
            if (grid[i][j]==teka.ord('=')) {
                this.bridges[i][j] = teka.viewer.hashi.Defaults.HORIZONTAL_2;
            }
            if (grid[i][j]==teka.ord('|')) {
                this.bridges[i][j] = teka.viewer.hashi.Defaults.VERTICAL_1;
            }
            if (grid[i][j]==teka.ord('H')) {
                this.bridges[i][j] = teka.viewer.hashi.Defaults.VERTICAL_2;
            }
        }
    }
};

/** Read solution from ascii art. */
teka.viewer.hashi.HashiViewer.prototype.asciiToSolution = function(ascii)
{
    if (ascii===false) {
        return;
    }

    var grid = this.asciiToArray(ascii);

    this.solution = teka.new_array([this.X,this.Y],0);
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            if (grid[i][j]==teka.ord('-')) {
                this.solution[i][j] = teka.viewer.hashi.Defaults.HORIZONTAL_1;
            }
            if (grid[i][j]==teka.ord('=')) {
                this.solution[i][j] = teka.viewer.hashi.Defaults.HORIZONTAL_2;
            }
            if (grid[i][j]==teka.ord('|')) {
                this.solution[i][j] = teka.viewer.hashi.Defaults.VERTICAL_1;
            }
            if (grid[i][j]==teka.ord('H')) {
                this.solution[i][j] = teka.viewer.hashi.Defaults.VERTICAL_2;
            }
        }
    }
};

/** Add solution. */
teka.viewer.hashi.HashiViewer.prototype.addSolution = function()
{
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            this.f[i][j] = this.solution[i][j];
        }
    }
};

//////////////////////////////////////////////////////////////////

/** Returns a small example. */
teka.viewer.hashi.HashiViewer.prototype.getExample = function()
{
    return '/type (hashi)\n/sol false\n/X 6\n/Y 6\n/puzzle [ (1 1   ) '
        +'(   2 2) (4 4   ) (   2 4) (      ) (4 5  3) ]\n/solution [ '
        +'(1 1   ) (| |2-2) (4-4| |) (H H2-4) (H H  H) (4=5--3) ]';
};

/** Returns a list of automatically generated properties. */
teka.viewer.hashi.HashiViewer.prototype.getProperties = function()
{
    return [teka.translate('generic_size',[this.X+'x'+this.Y])];
};

//////////////////////////////////////////////////////////////////

/** Reset the whole diagram. */
teka.viewer.hashi.HashiViewer.prototype.reset = function()
{
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            this.f[i][j] = 0;
            this.c[i][j] = 0;
        }
    }

    this.addBridges();
};

/** Reset the error marks. */
teka.viewer.hashi.HashiViewer.prototype.clearError = function()
{
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            this.error[i][j] = false;
        }
    }
};

/** Copy digits colored with this.color to color. */
teka.viewer.hashi.HashiViewer.prototype.copyColor = function(color)
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
teka.viewer.hashi.HashiViewer.prototype.clearColor = function(color)
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
teka.viewer.hashi.HashiViewer.prototype.saveState = function()
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
teka.viewer.hashi.HashiViewer.prototype.loadState = function(state)
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
teka.viewer.hashi.HashiViewer.prototype.check = function()
{
    var X = this.X;
    var Y = this.Y;

    this.addBridges();

    // Check number of bridges leaving an island
    // While doing this, collect one bridge
    var sx = -1;
    var sy = -1;
    for (var i=0;i<X;i++) {
        for (var j=0;j<Y;j++) {
            if (this.puzzle[i][j]>0) {
                if (this.countConnections(i,j)!=this.puzzle[i][j]) {
                    this.error[i][j]=true;
                    return 'hashi_wrong_bridges';
                }
                if (sx==-1) {
                    sx = i;
                    sy = j;
                }
            }
        }
    }

    // No islands there? Then we are done.
    if (sx==-1) {
        return true;
    }

    // Check if all islands are connected.
    for (var i=0;i<X;i++) {
        for (var j=0;j<Y;j++) {
            if (this.puzzle[i][j]!==0) {
                this.error[i][j] = true;
            }
        }
    }
    this.fill(sx,sy);

    for (var i=0;i<X;i++) {
        for (var j=0;j<Y;j++) {
            if (this.error[i][j]) {
                return 'hashi_not_connected';
            }
        }
    }

    return true;
};

/** Count the bridges, that leave the island at x,y. */
teka.viewer.hashi.HashiViewer.prototype.countConnections = function(x, y)
{
    var az = 0;
    if (x>0) {
        if (this.f[x-1][y]==teka.viewer.hashi.Defaults.HORIZONTAL_1) {
            az++;
        } else if (this.f[x-1][y]==teka.viewer.hashi.Defaults.HORIZONTAL_2) {
            az+=2;
        }
    }

    if (x<this.X-1) {
        if (this.f[x+1][y]==teka.viewer.hashi.Defaults.HORIZONTAL_1) {
            az++;
        } else if (this.f[x+1][y]==teka.viewer.hashi.Defaults.HORIZONTAL_2) {
            az+=2;
        }
    }

    if (y>0) {
        if (this.f[x][y-1]==teka.viewer.hashi.Defaults.VERTICAL_1) {
            az++;
        } else if (this.f[x][y-1]==teka.viewer.hashi.Defaults.VERTICAL_2) {
            az+=2;
        }
    }

    if (y<this.Y-1) {
        if (this.f[x][y+1]==teka.viewer.hashi.Defaults.VERTICAL_1) {
            az++;
        } else if (this.f[x][y+1]==teka.viewer.hashi.Defaults.VERTICAL_2) {
            az+=2;
        }
    }

    return az;
};

/** Floodfill all islands, that are connected to x,y. */
teka.viewer.hashi.HashiViewer.prototype.fill = function(x, y)
{
    if (!this.error[x][y]) {
        return;
    }
    this.error[x][y] = false;

    if (x>0 && (this.f[x-1][y]==teka.viewer.hashi.Defaults.HORIZONTAL_1
                || this.f[x-1][y]==teka.viewer.hashi.Defaults.HORIZONTAL_2)) {
        var xc = x-1;
        while (this.puzzle[xc][y]===0) {
            xc--;
        }
        this.fill(xc,y);
    }

    if (x<this.X-1 && (this.f[x+1][y]==teka.viewer.hashi.Defaults.HORIZONTAL_1
                       || this.f[x+1][y]==teka.viewer.hashi.Defaults.HORIZONTAL_2)) {
        var xc = x+1;
        while (this.puzzle[xc][y]===0) {
            xc++;
        }
        this.fill(xc,y);
    }

    if (y>0 && (this.f[x][y-1]==teka.viewer.hashi.Defaults.VERTICAL_1
                || this.f[x][y-1]==teka.viewer.hashi.Defaults.VERTICAL_2)) {
        var yc = y-1;
        while (this.puzzle[x][yc]===0) {
            yc--;
        }
        this.fill(x,yc);
    }

    if (y<this.Y-1 && (this.f[x][y+1]==teka.viewer.hashi.Defaults.VERTICAL_1
                       || this.f[x][y+1]==teka.viewer.hashi.Defaults.VERTICAL_2)) {
        var yc = y+1;
        while (this.puzzle[x][yc]===0) {
            yc++;
        }
        this.fill(x,yc);
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
teka.viewer.hashi.HashiViewer.prototype.setMetrics = function(g)
{
    this.scale = Math.floor(Math.min((this.width-1)/this.X,
                                     (this.height-1)/this.Y));
    var realwidth = this.X*this.scale+1;
    var realheight = this.Y*this.scale+1;

    this.deltaX = Math.floor((this.width-realwidth)/2)+0.5;
    this.deltaY = Math.floor((this.height-realheight)/2)+0.5;

    this.font = teka.getFontData(Math.round(this.scale/2)+'px sans-serif',this.scale);

    if (realwidth>this.width || realheight>this.height) {
        this.scale=false;
    }
    return {width:realwidth,height:realheight,scale:this.scale};
};

/** Paints the diagram. */
teka.viewer.hashi.HashiViewer.prototype.paint = function(g)
{
    var X = this.X;
    var Y = this.Y;
    var S = this.scale;

    g.save();
    g.translate(this.deltaX+1,this.deltaY+1);

    // paint the bridges - bridges stick out at either side, to assure overlapping
    g.lineWidth = 3;
    for (var i=0;i<X;i++) {
        for (var j=0;j<Y;j++) {
            if (this.puzzle[i][j]===0) {
                g.strokeStyle = this.bridges[i][j]!==0?'#000':this.getColorString(this.c[i][j]);
                switch (this.bridges[i][j]!==0?this.bridges[i][j]:this.f[i][j]) {
                  case teka.viewer.hashi.Defaults.HORIZONTAL_1:
                    teka.drawLine(g,
                                  i*S-1,Math.floor(j*S+S/2),
                                  (i+1)*S+1,Math.floor(j*S+S/2));
                    break;
                  case teka.viewer.hashi.Defaults.HORIZONTAL_2:
                    teka.drawLine(g,
                                  i*S-1,Math.floor(j*S+S/2+3),
                                  (i+1)*S+1,Math.floor(j*S+S/2+3));
                    teka.drawLine(g,
                                  i*S-1,Math.floor(j*S+S/2-3),
                                  (i+1)*S+1,Math.floor(j*S+S/2-3));
                    break;
                  case teka.viewer.hashi.Defaults.VERTICAL_1:
                    teka.drawLine(g,
                                  Math.floor(i*S+S/2),j*S-1,
                                  Math.floor(i*S+S/2),(j+1)*S+1);
                    break;
                  case teka.viewer.hashi.Defaults.VERTICAL_2:
                    teka.drawLine(g,
                                  Math.floor(i*S+S/2+3),j*S-1,
                                  Math.floor(i*S+S/2+3),(j+1)*S+1);
                    teka.drawLine(g,
                                  Math.floor(i*S+S/2-3),j*S-1,
                                  Math.floor(i*S+S/2-3),(j+1)*S+1);
                    break;
                }
            }
        }
    }
    g.lineWidth = 1;

    // paint the islands
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    for (var i=0;i<X;i++) {
        for (var j=0;j<Y;j++) {
            if (this.puzzle[i][j]!==0) {
                g.fillStyle = this.isBlinking()?
                    this.getBlinkColor(i,j,X,this.f[i][j]):
                    (this.error[i][j]?'#f00':'#fff');

                teka.fillOval(g,i*S+S/2,j*S+S/2,S/2);
                g.strokeStyle = '#000';
                teka.strokeOval(g,i*S+S/2,j*S+S/2,S/2);

                if (this.puzzle[i][j]>0) {
                    g.fillStyle='#000';
                    g.font = this.font.font;
                    g.fillText(this.puzzle[i][j],i*S+S/2,j*S+S/2+this.font.delta);
                }

                if (this.f[i][j]==1) {
                    g.strokeStyle = this.getColorString(this.c[i][j]);
                    g.lineWidth = 2;
                    teka.drawLine(g,i*S+S/4,j*S+S/4,(i+1)*S-S/4,(j+1)*S-S/4);
                    teka.drawLine(g,(i+1)*S-S/4,j*S+S/4,i*S+S/4,(j+1)*S-S/4);
                    g.lineWidth = 1;
                }
            }
        }
    }

    // paint the cursor
    if (this.mode==teka.viewer.Defaults.NORMAL) {
        if (this.x>=0 && this.x<=X && this.y>=0 && this.y<=Y) {
            g.strokeStyle = '#f00';
            g.lineWidth = 2;
            g.strokeRect(S*this.x+3.5,S*this.y+3.5,S-7,S-7);
        }
    }

    g.restore();
};

//////////////////////////////////////////////////////////////////

/** Handles mousemove event. */
teka.viewer.hashi.HashiViewer.prototype.processMousemoveEvent = function(xc, yc, pressed)
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
    if (this.y>=this.Y) {
        this.y=this.Y-1;
    }

    return this.x!=oldx || this.y!=oldy;
};

/** Handles mousedown event. */
teka.viewer.hashi.HashiViewer.prototype.processMousedownEvent = function(xc, yc)
{
    var erg = this.processMousemoveEvent(xc,yc,false);

    if (this.x<0 || this.y<0 || this.x>=this.X || this.y>=this.Y) {
        return erg;
    }

    if (this.puzzle[this.x][this.y]!==0) {
        this.set(this.x,this.y,1-this.f[this.x][this.y]);
        return true;
    }

    var h = this.f[this.x][this.y];
    if (!this.removeBridge(this.x,this.y)) {
        return erg;
    }

    while (true) {
        h = (h+1)%5;
        if (this.setBridge(this.x,this.y,h)) {
            break;
        }
    }

    return true;
};

/** Handles keydown event. */
teka.viewer.hashi.HashiViewer.prototype.processKeydownEvent = function(e)
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

    if (this.puzzle[this.x][this.y]!==0) {
        if (e.key==teka.KEY_SPACE) {
            this.set(this.x,this.y,0);
        } else if (e.key==teka.KEY_HASH || e.key==teka.KEY_Q) {
            this.set(this.x,this.y,1);
        }
        return true;
    }

    if (e.key==teka.KEY_SPACE) {
        this.removeBridge(this.x,this.y);
        return true;
    }

    if (e.key==teka.KEY_W || e.key==teka.KEY_E) {
        var tmp = this.f[this.x][this.y];

        var lines = e.key==teka.KEY_W?
            teka.viewer.hashi.Defaults.HORIZONTAL_1:
            teka.viewer.hashi.Defaults.HORIZONTAL_2;
        if (tmp==lines) {
            lines = lines==teka.viewer.hashi.Defaults.HORIZONTAL_1?
                teka.viewer.hashi.Defaults.HORIZONTAL_2:
                teka.viewer.hashi.Defaults.HORIZONTAL_1;
        }

        if (!this.removeBridge(this.x,this.y)) {
            return false;
        }
        if (!this.setBridge(this.x,this.y,lines)) {
            this.setBridge(this.x,this.y,tmp);
            return false;
        }

        return true;
    }

    if (e.key==teka.KEY_S || e.key==teka.KEY_D) {
        var tmp = this.f[this.x][this.y];

        var lines = e.key==teka.KEY_S?
            teka.viewer.hashi.Defaults.VERTICAL_1:
            teka.viewer.hashi.Defaults.VERTICAL_2;
        if (tmp==lines) {
            lines = lines==teka.viewer.hashi.Defaults.VERTICAL_1?
                teka.viewer.hashi.Defaults.VERTICAL_2:
                teka.viewer.hashi.Defaults.VERTICAL_1;
        }

        if (!this.removeBridge(this.x,this.y)) {
            return false;
        }
        if (!this.setBridge(this.x,this.y,lines)) {
            this.setBridge(this.x,this.y,tmp);
            return false;
        }

        return true;
    }

    return false;
};

//////////////////////////////////////////////////////////////////

/**
 * Try to remove bridge. This fails, ifthe color of the bridge is
 * not the actual color.
 */
teka.viewer.hashi.HashiViewer.prototype.removeBridge = function(x, y)
{
    this.addBridges();
    if (this.f[x][y]===0) {
        return true;
    }

    if (this.c[x][y]!=this.color) {
        return false;
    }

    if (this.f[x][y]==teka.viewer.hashi.Defaults.HORIZONTAL_1
        || this.f[x][y]==teka.viewer.hashi.Defaults.HORIZONTAL_2) {
        this.removeHorizontal(x,y);
    } else {
        this.removeVertical(x,y);
    }

    return true;
};

/** Remove a horizontal bridge */
teka.viewer.hashi.HashiViewer.prototype.removeHorizontal = function(x, y)
{
    // find left end of the bridge
    while (x>0 && this.puzzle[x-1][y]===0) {
        x--;
    }

    // remove, till we reach the right end
    while (x<this.X && this.puzzle[x][y]===0) {
        this.f[x++][y] = 0;
    }
};

/** Remove a vertical bridge */
teka.viewer.hashi.HashiViewer.prototype.removeVertical = function(x, y)
{
    // find top end of the bridge
    while (y>0 && this.puzzle[x][y-1]===0) {
        y--;
    }

    // remove, till we reach the bottom end
    while (y<this.Y && this.puzzle[x][y]===0) {
        this.f[x][y++] = 0;
    }
};

/** Try to set a bridge. Returns true if it was successful. */
teka.viewer.hashi.HashiViewer.prototype.setBridge = function(x, y, type)
{
    this.addBridges();
    if (type===0) {
        return true;
    }

    return type==teka.viewer.hashi.Defaults.HORIZONTAL_1
        || type==teka.viewer.hashi.Defaults.HORIZONTAL_2?
        this.setHorizontal(x,y,type):
        this.setVertical(x,y,type);
};

/** Set a horizontal bridge */
teka.viewer.hashi.HashiViewer.prototype.setHorizontal = function(x, y, type)
{
    // find left end of the bridge
    while (x>0 && this.puzzle[x-1][y]===0) {
        x--;
    }

    // if there is no left end, we are done
    if (x===0) {
        return false;
    }

    var sx = x;
    while (x<this.X && this.puzzle[x][y]===0) {

        // if there is a crossing bridge, we are done
        if (this.f[x][y]!==0) {
            return false;
        }
        x++;
    }

    // if there is no right end, we are done
    if (x==this.X) {
        return false;
    }

    // draw the bridge
    for (var i=sx;i<x;i++) {
        this.f[i][y] = type;
        this.c[i][y] = this.color;
    }

    return true;
};

/** Set a vertical bridge */
teka.viewer.hashi.HashiViewer.prototype.setVertical = function(x, y, type)
{
    // find top end of the bridge
    while (y>0 && this.puzzle[x][y-1]===0) {
        y--;
    }

    // if there is no top end, we are done
    if (y===0) {
        return false;
    }

    var sy = y;
    while (y<this.Y && this.puzzle[x][y]===0) {

        // if there is a crossing bridge, we are done
        if (this.f[x][y]!==0) {
            return false;
        }
        y++;
    }

    // if there is no bottom end, we are done
    if (y==this.Y) {
        return false;
    }

    // draw the bridge
    for (var j=sy;j<y;j++) {
        this.f[x][j] = type;
        this.c[x][j] = this.color;
    }

    return true;
};

/** Add all given bridges to f. */
teka.viewer.hashi.HashiViewer.prototype.addBridges = function()
{
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            if (this.bridges[i][j]!==0) {
                this.f[i][j] = this.bridges[i][j];
                this.c[i][j] = 0;
            }
        }
    }
};

/** Sets the value of a cell, if the color fits. */
teka.viewer.hashi.HashiViewer.prototype.set = function(x, y, value)
{
    if (this.f[x][y]!=0 && this.c[x][y]!=this.color) {
        return;
    }
    this.f[x][y] = value;
    this.c[x][y] = this.color;
};
