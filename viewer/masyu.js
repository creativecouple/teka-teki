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
    FULL: 2
};

/** Constructor */
teka.viewer.masyu.MasyuViewer = function(data)
{
    teka.viewer.PuzzleViewer.call(this,data);

    this.x = 0;
    this.y = 0;
};
teka.extend(teka.viewer.masyu.MasyuViewer,teka.viewer.PuzzleViewer);

//////////////////////////////////////////////////////////////////

/** Initialize this viewer width the PSData object provided. */
teka.viewer.masyu.MasyuViewer.prototype.initData = function(data)
{
    this.X = parseInt(data.get('X'),10);
    this.Y = parseInt(data.get('Y'),10);
    this.asciiToData(data.get('puzzle'));
    
    this.fr = teka.new_array([this.X-1,this.Y],0);
    this.fu = teka.new_array([this.X,this.Y-1],0);
    this.cr = teka.new_array([this.X-1,this.Y],0);
    this.cu = teka.new_array([this.X,this.Y-1],0);
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
              default:
                this.puzzle[i][j] = teka.viewer.masyu.Defaults.NONE;
                break;
            }
        }
    }
    
    sr = teka.new_array([this.X-1,this.Y],0);
    for (var i=0;i<this.X-1;i++) {
        for (var j=0;j<this.Y;j++) {
            sr[i][j] = grid[2*i+2][2*j+1]==teka.ord('-')?1:0;
        }
    }
    
    su = teka.new_array([this.X,this.Y-1],0);
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y-1;j++) {
            su[i][j] = grid[2*i+1][2*j+2]==teka.ord('|')?1:0;
        }
    }
};

/** Add solution. */
teka.viewer.masyu.MasyuViewer.prototype.addSolution = function()
{
    for (var i=0;i<this.X-1;i++) {
        for (var j=0;j<this.Y;j++) {
            this.fr[i][j] = sr[i][j];
        }
    }
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y-1;j++) {
            this.fu[i][j] = su[i][j];
        }
    }
};

//////////////////////////////////////////////////////////////////

/** Returns a small example. */
teka.viewer.masyu.MasyuViewer.prototype.getExample = function()
{
    return '/format 1\n/type (masyu)\n/sol false\n/X 5\n/Y 5'
        +'\n/puzzle [ (+-+-+-+-+-+) (|   - -*  |) (+ +|+ +|+ +) (| -       |)'
        +' (+|+ + +|+ +) (|O  - -*  |) (+|+|+ + + +) (|   - -O- |) (+|+ + + +|+)'
        +' (| - - - - |) (+-+-+-+-+-+) ]';
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
    for (var i=0;i<this.X-1;i++) {
        for (var j=0;j<this.Y;j++) {
            this.fr[i][j]=0;
            this.cr[i][j]=0;
        }
    }
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y-1;j++) {
            this.fu[i][j]=0;
            this.cu[i][j]=0;
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
    for (var i=0;i<this.X-1;i++) {
        for (var j=0;j<this.Y;j++) {
            if (this.cr[i][j]==this.color) {
                this.cr[i][j] = color;
            }
        }
    }
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y-1;j++) {
            if (this.cu[i][j]==this.color) {
                this.cu[i][j] = color;
            }
        }
    }
};

/** Delete all digits with color. */
teka.viewer.masyu.MasyuViewer.prototype.clearColor = function(color)
{
    for (var i=0;i<this.X-1;i++) {
        for (var j=0;j<this.Y;j++) {
            if (this.cr[i][j]==color) {
                this.fr[i][j] = 0;
            }
        }
    }
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y-1;j++) {
            if (this.cu[i][j]==color) {
                this.fu[i][j] = 0;
            }
        }
    }
};

/** Save current state. */
teka.viewer.masyu.MasyuViewer.prototype.saveState = function()
{
    var fr = teka.new_array([this.X-1,this.Y],0);
    var fu = teka.new_array([this.X,this.Y-1],0);
    var cr = teka.new_array([this.X-1,this.Y],0);
    var cu = teka.new_array([this.X,this.Y-1],0);
    for (var i=0;i<this.X-1;i++) {
        for (var j=0;j<this.Y;j++) {
            fr[i][j] = this.fr[i][j];
            cr[i][j] = this.cr[i][j];
        }
    }
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y-1;j++) {
            fu[i][j] = this.fu[i][j];
            cu[i][j] = this.cu[i][j];
        }
    }

    return { fr:fr, fu:fu, cr:cr, cu:cu };
};

/** Load state. */
teka.viewer.masyu.MasyuViewer.prototype.loadState = function(state)
{
    for (var i=0;i<this.X-1;i++) {
        for (var j=0;j<this.Y;j++) {
            this.fr[i][j] = state.fr[i][j];
            this.cr[i][j] = state.cr[i][j];
        }
    }
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y-1;j++) {
            this.fu[i][j] = state.fu[i][j];
            this.cu[i][j] = state.cu[i][j];
        }
    }
};

//////////////////////////////////////////////////////////////////

/** Check, if the solution is correct. */
teka.viewer.masyu.MasyuViewer.prototype.check = function()
{
    var X = this.X;
    var Y = this.Y;
    for (var i=0;i<X;i++) {
        for (var j=0;j<Y;j++) {
            var h = countLines(i,j);
            if (h!=0 && h!=2) {
                this.error[i][j] = true;
                switch (h) {
                  case 1: return 'Im markierten Feld befindet sich eine Sackgasse';
                  case 3: return 'Im markierten Feld stoßen drei Linien zusammen';
                  case 4: return 'Im markierten Feld befindet sich eine Kreuzung.';
                }
            }
            if (this.puzzle[i][j]!=0 && h==0) {
                this.error[i][j] = true;
                return 'Der Weg geht nicht durch das markierte Feld mit Kreis.';
            }
        }
    }
    for (var i=0;i<X;i++) {
        for (var j=0;j<Y;j++) {
            if (this.puzzle[i][j]==1 && !correctWeiss(i,j)) {
                this.error[i][j] = true;
                return 'Im markierten Feld darf der Weg nicht abbiegen, muss aber in einem der beiden Nachbarfelder abbiegen.';
            }
            if (this.puzzle[i][j]==2 && !correctSchwarz(i,j)) {
                this.error[i][j] = true;
                return 'Im markierten Feld muss der Weg abbiegen, und in beiden Richtungen danach geradeaus weiter gehen.';
            }
        }
    }
    
    var mark = teka.new_array([X,Y],false);
    for (var i=X-1;i>=0;i--) {
        for (var j=Y-1;j>=0;j--) {
            if (this.puzzle[i][j]!=0) {
                mark(mark,i,j);
                if (unmarked(mark)) {
                    colorMarked(mark);
                    return 'Der markierte Rundweg hängt nicht mit dem Rest des Weges zusammen.';
                }
                return true;
            }
        }
    }
    return true;
};

/** countLines */
teka.viewer.masyu.MasyuViewer.prototype.countLines = function(x, y)
{
    var az = 0;
    if (x>0 && this.fr[x-1][y]==1) {
        az++;
    }
    if (x<this.X-1 && this.fr[x][y]==1) {
        az++;
    }
    if (y>0 && this.fu[x][y-1]==1) {
        az++;
    }
    if (y<this.Y-1 && this.fu[x][y]==1) {
        az++;
    }
    return az;
};

/** mark */
teka.viewer.masyu.MasyuViewer.prototype.mark = function(mark, x, y)
{
    if (x<0 || x>=this.X || y<0 || y>=this.Y) {
        return;
    }
    if (mark[x][y]) {
        return;
    }
    mark[x][y]=true;
    var h = getNachbar(x,y);
    if (h[0]==1) {
        mark(mark,x-1,y);
    }
    if (h[1]==1) {
        mark(mark,x+1,y);
    }
    if (h[2]==1) {
        mark(mark,x,y-1);
    }
    if (h[3]==1) {
        mark(mark,x,y+1);
    }
};

/** unmarked */
teka.viewer.masyu.MasyuViewer.prototype.unmarked = function(mark)
{
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            if (!mark[i][j] && countLines(i,j)>0) {
                return true;
            }
        }
    }
    return false;
};

/** colorMarked */
teka.viewer.masyu.MasyuViewer.prototype.colorMarked = function(mark)
{
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            if (mark[i][j]) {
                this.error[i][j] = true;
            }
        }
    }
};

/** correctWeiss */
teka.viewer.masyu.MasyuViewer.prototype.correctWeiss = function(x, y)
{
    if (knick(x,y)) {
        return false;
    }
    var h = getNachbar(x,y);
    var ok = false;
    if (h[0]==1 && knick(x-1,y)) {
        ok = true;
    }
    if (h[1]==1 && knick(x+1,y)) {
        ok = true;
    }
    if (h[2]==1 && knick(x,y-1)) {
        ok = true;
    }
    if (h[3]==1 && knick(x,y+1)) {
        ok = true;
    }
    return ok;
};

/** knick */
teka.viewer.masyu.MasyuViewer.prototype.knick = function(x, y)
{
    var h = getNachbar(x,y);
    if ((h[0]==1 || h[1]==1) && (h[2]==1 || h[3]==1)) {
        return true;
    }
    return false;
};

/** correctSchwarz */
teka.viewer.masyu.MasyuViewer.prototype.correctSchwarz = function(x, y)
{
    if (!knick(x,y)) {
        return false;
    }
    var h = getNachbar(x,y);
    if (h[0]==1 && knick(x-1,y)) {
        return false;
    }
    if (h[1]==1 && knick(x+1,y)) {
        return false;
    }
    if (h[2]==1 && knick(x,y-1)) {
        return false;
    }
    if (h[3]==1 && knick(x,y+1)) {
        return false;
    }
    return true;
};

/** getNachbar */
teka.viewer.masyu.MasyuViewer.prototype.getNachbar = function(x, y)
{
    var h = teka.new_array([4],0);
    if (x>0) {
        h[0] = this.fr[x-1][y];
    }
    if (x<this.X-1) {
        h[1] = this.fr[x][y];
    }
    if (y>0) {
        h[2] = this.fu[x][y-1];
    }
    if (y<this.Y-1) {
        h[3] = this.fu[x][y];
    }
    return h;
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
    g.translate(this.deltaX+1,this.deltaY+1);

    g.fillStyle = '#fff';
    g.fillRect(0,0,S*X,S*Y);
    
    g.fillStyle = '#0f0';
    g.fillRect(-10,-10,this.width+20,this.height+20);
    g.fillStyle = '#f00';
    var realwidth = this.X*this.scale+3;
    var realheight = this.Y*this.scale+3;
    g.fillRect(-1,-1,realwidth,realheight);
    
    for (var i=0;i<X;i++) {
        for (var j=0;j<Y;j++) {
            g.fillStyle = this.isBlinking()?
                this.getBlinkColor(i,j,X,this.f[i][j]):
                (this.error[i][j]?'#f00':'#fff');
            
            g.fillRect(i*S,j*S,S,S);
        }
    }
    
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

    for (var i=0;i<X;i++) {
        for (var j=0;j<Y;j++) {
            if (this.puzzle[i][j]==teka.viewer.masyu.Defaults.EMPTY) {
                g.fillStyle = '#fff';
                teka.fillOval(g,i*S+S/2,j*S+S/2,S/2-S/8);
                g.fillStyle = '#000';
                teka.strokeOval(g,i*S+S/2,j*S+S/2,S/2-S/8);
            } else if (this.puzzle[i][j]==teka.viewer.masyu.Defaults.FULL) {
                g.fillStyle = '#000';
                teka.fillOval(g,i*S+S/2,j*S+S/2,S/2-S/8);
            }
        }
    }
    
    g.lineCap = 'square';
    for (var i=0;i<X-1;i++) {
        for (var j=0;j<Y;j++) {
            g.strokeStyle = this.getColorString(this.cr[i][j]);
            switch (this.fr[i][j]) {
              case 1:
                g.lineWidth = 5;
                teka.drawLine(g,i*S+S/2,j*S+S/2,(i+1)*S+S/2,j*S+S/2);
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
    
    for (var i=0;i<X;i++) {
        for (var j=0;j<Y-1;j++) {
            g.strokeStyle = this.getColorString(this.cu[i][j]);
            switch (this.fu[i][j]) {
              case 1:
                g.lineWidth = 5;
                teka.drawLine(g,i*S+S/2,j*S+S/2,i*S+S/2,(j+1)*S+S/2);
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
        if (this.state===teka.viewer.Defaults.NOTHING) {
            g.strokeStyle = '#f00';
            g.lineWidth = 2;
            g.strokeRect(this.x*S+3.5,this.y*S+3.5,S-7,S-7);
        } else {
            g.fillStyle = '#f00';
            g.fillRect(Math.floor(this.x*S+S/2)-3.5,Math.floor(this.y*S+S/2)-3.5,7,7);
        }
    }
    
    g.restore();
};

//////////////////////////////////////////////////////////////////

/** Handles mousemove event. */
teka.viewer.masyu.MasyuViewer.prototype.processMouseMovedEvent = function(xc, yc)
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
teka.viewer.masyu.MasyuViewer.prototype.processMousePressedEvent = function(xc, yc)
{
    this.processMouseMovedEvent(xc,yc);
    
    this.startx = this.x;
    this.starty = this.y;
    this.state = teka.viewer.Defaults.PRESSED;
    
    return true;
};

/** processMouseReleasedEvent */
teka.viewer.masyu.MasyuViewer.prototype.processMouseReleasedEvent = function(xc, yc)
{
    this.processMouseMovedEvent(xc,yc);
    
    this.state = teka.viewer.Defaults.NOTHING;
    return true;
};

/** processMouseDraggedEvent */
teka.viewer.masyu.MasyuViewer.prototype.processMouseDraggedEvent = function(xc, yc)
{
    if (this.state==teka.viewer.Defaults.NOTHING) {
        return false;
    }

    var erg = this.processMouseMovedEvent(xc,yc);
    
    var sx = this.startx;
    var sy = this.starty;
    this.startx = this.x;
    this.starty = this.y;
    
    
    if (this.x==sx && this.y==sy) {
        return erg;
    }
    
    if (this.x==sx) {
        var delta = sy<this.y?1:-1;
        for (var j=sy;j!=this.y;j+=delta) {
            this.set(this.x,delta==1?j:j-1,(this.get(this.x,delta==1?j:j-1,false)+1)%3,false);
        }
        return true;
    }
    
    if (this.y==sy) {
        var delta = sx<this.x?1:-1;
        for (var i=sx;i!=this.x;i+=delta) {
            this.set(delta==1?i:i-1,this.y,(this.get(delta==1?i:i-1,this.y,true)+1)%3,true);
        }
        return true;
    }
    
    return erg;
};

/** Handles keydown event. */
teka.viewer.masyu.MasyuViewer.prototype.processKeyEvent = function(e)
{
    this.state = e.shift?teka.viewer.Defaults.PRESSED:
        teka.viewer.Defaults.NOTHING;
    
    if (e.key==teka.KEY_DOWN) {
        if (this.y<this.Y-1) {
            if (e.shift) {
                this.set(this.x,this.y,(this.get(this.x,this.y,false)+1)%3,false);
            }
            this.y++;
        }
        return true;
    }
    if (e.key==teka.KEY_UP) {
        if (this.y>0) {
            if (e.shift) {
                this.set(this.x,this.y-1,(this.get(this.x,this.y-1,false)+1)%3,false);
            }
            this.y--;
        }
        return true;
    }
    if (e.key==teka.KEY_RIGHT) {
        if (this.x<this.X-1) {
            if (e.shift) {
                this.set(this.x,this.y,(this.get(this.x,this.y,true)+1)%3,true);
            }
            this.x++;
        }
        return true;
    }
    if (e.key==teka.KEY_LEFT) {
        if (this.x>0) {
            if (e.shift) {
                this.set(this.x-1,this.y,(this.get(this.x-1,this.y,true)+1)%3,true);
            }
            this.x--;
        }
        return true;
    }

    if (e.key==teka.KEY_SHIFT) {
        return true;
    }
    
    return false;
};

/** Handles keyup event. */
teka.viewer.masyu.MasyuViewer.prototype.processKeyUpEvent = function(e)
{
    if (e.key==teka.KEY_SHIFT) {
        this.state = teka.viewer.Defaults.NOTHING;
        return true;
    }

    return false;
};

//////////////////////////////////////////////////////////////////

/** Sets the value of a cell, if the color fits. */
teka.viewer.masyu.MasyuViewer.prototype.set = function(x, y, value, horizontal)
{
    if (horizontal) {
        this.setr(x,y,value);
    } else {
        this.setu(x,y,value);
    }
};

/** setr */
teka.viewer.masyu.MasyuViewer.prototype.setr = function(x, y, value)
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

/** setu */
teka.viewer.masyu.MasyuViewer.prototype.setu = function(x, y, value)
{
    if (x<0 || x>=this.X || y<0 || y>=this.Y-1) {
        return;
    }
    
    if (this.fu[x][y]!=0 && this.cu[x][y]!=this.color) {
        return;
    }
    
    this.fu[x][y] = value;
    this.cu[x][y] = this.color;
};

/** get */
teka.viewer.masyu.MasyuViewer.prototype.get = function(x, y, horizontal)
{
    if (horizontal) {
        if (x<0 || x>=this.X-1 || y<0 || y>=this.Y) {
            return 0;
        }
        
        return this.fr[x][y];
    } 
    
    if (x<0 || x>=this.X || y<0 || y>=this.Y-1) {
        return 0;
    }
    
    return this.fu[x][y];
};

