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
teka.viewer.kropki = {};

/** Some constants. */
teka.viewer.kropki.Defaults = {
    NONE: 0,
    EMPTY: 1,
    FULL: 2
};

/** Constructor */
teka.viewer.kropki.KropkiViewer = function(data)
{
    teka.viewer.PuzzleViewer.call(this,data);

    this.x = 0;
    this.y = 0;
    this.xm = 0;
    this.ym = 0;
    this.exp = false;
};
teka.extend(teka.viewer.kropki.KropkiViewer,teka.viewer.PuzzleViewer);

//////////////////////////////////////////////////////////////////

/** Initialize this viewer width the PSData object provided. */
teka.viewer.kropki.KropkiViewer.prototype.initData = function(data)
{
    this.X = parseInt(data.get('size'),10);
    var digits = data.get('digits');
    digits = digits===false?1:parseInt(data.get('digits'),10);
    this.asciiToData(data.get('puzzle'),digits);
    this.asciiToSolution(data.get('solution'),digits);

    this.f = teka.new_array([this.X,this.X],0);
    this.c = teka.new_array([this.X,this.X],0);
    this.error = teka.new_array([this.X,this.X],false);
};

/** Read puzzle from ascii art. */
teka.viewer.kropki.KropkiViewer.prototype.asciiToData = function(ascii,d)
{
    if (ascii===false) {
        return;
    }

    var grid = this.asciiToArray(ascii);

    this.puzzle = teka.new_array([this.X,this.X],0);
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.X;j++) {
            var nr = this.getNr(grid,(d+1)*i+1,2*j+1,d);
            if (nr!==false) {
                this.puzzle[i][j] = nr;
            }
        }
    }

    this.lrdots = teka.new_array([this.X-1,this.X],teka.viewer.kropki.Defaults.NONE);
    for (var i=0;i<this.X-1;i++) {
        for (var j=0;j<this.X;j++) {
            if (grid[(d+1)*(i+1)][2*j+1]==teka.ord('O')) {
                this.lrdots[i][j] = teka.viewer.kropki.Defaults.EMPTY;
            } else if (grid[(d+1)*(i+1)][2*j+1]==teka.ord('*')) {
                this.lrdots[i][j] = teka.viewer.kropki.Defaults.FULL;
            }
        }
    }

    this.uddots = teka.new_array([this.X,this.X-1],teka.viewer.kropki.Defaults.NONE);
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.X-1;j++) {
            if (grid[(d+1)*i+Math.ceil((d+1)/2)][2*j+2]==teka.ord('O')) {
                this.uddots[i][j] = teka.viewer.kropki.Defaults.EMPTY;
            } else if (grid[(d+1)*i+Math.ceil((d+1)/2)][2*j+2]==teka.ord('*')) {
                this.uddots[i][j] = teka.viewer.kropki.Defaults.FULL;
            }
        }
    }
};

/** Read solution from ascii art. */
teka.viewer.kropki.KropkiViewer.prototype.asciiToSolution = function(ascii,d)
{
    if (ascii===false) {
        return;
    }

    var grid = this.asciiToArray(ascii);

    this.solution = teka.new_array([this.X,this.X],0);
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.X;j++) {
            this.solution[i][j] = this.getNr(grid,d*i,j,d);
        }
    }
};

/** Add solution. */
teka.viewer.kropki.KropkiViewer.prototype.addSolution = function()
{
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.X;j++) {
            this.f[i][j] = this.solution[i][j];
        }
    }
};

//////////////////////////////////////////////////////////////////

/** Returns a small example. */
teka.viewer.kropki.KropkiViewer.prototype.getExample = function()
{
    return '/format 1\n/type (kropki)\n/sol false\n/size 4\n'
        +'/puzzle [ (+-+-+-+-+) (| * * O |) (+ +O+ +O+) (| O   O |) (+O+ +*+*+)'
        +' (|   O * |) (+O+ +O+ +) (| * O   |) (+-+-+-+-+) ]\n'
        +'/solution [ (1243) (4312) (3124) (2431) ]';
};

/** Returns a list of automatically generated properties. */
teka.viewer.kropki.KropkiViewer.prototype.getProperties = function()
{
    return [teka.translate('generic_size',[this.X+'x'+this.X])];
};

//////////////////////////////////////////////////////////////////

/** Reset the whole diagram. */
teka.viewer.kropki.KropkiViewer.prototype.reset = function()
{
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.X;j++) {
            this.f[i][j] = 0;
            this.c[i][j] = 0;
        }
    }
};

/** Reset the error marks. */
teka.viewer.kropki.KropkiViewer.prototype.clearError = function()
{
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.X;j++) {
            this.error[i][j] = false;
        }
    }
};

/** Copy digits colored with this.color to color. */
teka.viewer.kropki.KropkiViewer.prototype.copyColor = function(color)
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
teka.viewer.kropki.KropkiViewer.prototype.clearColor = function(color)
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
teka.viewer.kropki.KropkiViewer.prototype.saveState = function()
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
teka.viewer.kropki.KropkiViewer.prototype.loadState = function(state)
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
teka.viewer.kropki.KropkiViewer.prototype.check = function()
{
    var X = this.X;

    // Overwrite digits, that are allready given.
    for (var i=0;i<X;i++) {
        for (var j=0;j<X;j++) {
            if (this.puzzle[i][j]!=0) {
                this.f[i][j] = this.puzzle[i][j];
            }
        }
    }

    // Copy to array check, removing expert mode symbols.
    var check = teka.new_array([this.X,this.X],0);
    for (var i=0;i<X;i++) {
        for (var j=0;j<X;j++) {
            if (this.f[i][j]>=1000) {
                check[i][j] = this.getExpert(this.f[i][j]);
                if (check[i][j]===teka.viewer.kropki.Defaults.NONE) {
                    this.error[i][j] = true;
                    return 'kropki_unique_symbol';
                }
            } else {
                check[i][j] = this.f[i][j];
            }

            if (check[i][j]===teka.viewer.kropki.Defaults.NONE) {
                this.error[i][j] = true;
                return 'kropki_empty';
            }
        }
    }

    // Check duplicates in row
    for (var j=0;j<X;j++) {
        var da = teka.new_array([X],false);
        for (var i=0;i<X;i++) {
            if (da[check[i][j]-1]===true) {
                for (var ii=0;ii<X;ii++) {
                    if (check[ii][j]==check[i][j]) {
                        this.error[ii][j] = true;
                    }
                }
                return 'kropki_row_duplicate';
            } else {
                da[check[i][j]-1] = true;
            }
        }
    }

    // Check duplicates in column
    for (var i=0;i<X;i++) {
        var da = teka.new_array([X],false);
        for (var j=0;j<X;j++) {
            if (da[check[i][j]-1]===true) {
                for (var jj=0;jj<X;jj++) {
                    if (check[i][jj]==check[i][j]) {
                        this.error[i][jj] = true;
                    }
                }
                return 'kropki_column_duplicate';
            } else {
                da[check[i][j]-1] = true;
            }
        }
    }

    // Check dots and no dots on vertical line
    for (var i=0;i<X-1;i++) {
        for (var j=0;j<X;j++) {
            switch (this.lrdots[i][j]) {
              case teka.viewer.kropki.Defaults.NONE:
                if (check[i][j]==2*check[i+1][j]
                    || check[i+1][j]==2*check[i][j]) {
                    this.error[i][j] = true;
                    this.error[i+1][j] = true;
                    return 'kropki_twice';
                }
                if (check[i][j]==check[i+1][j]+1
                    || check[i+1][j]==check[i][j]+1) {
                    this.error[i][j] = true;
                    this.error[i+1][j] = true;
                    return 'kropki_neighbours';
                }
                break;
              case teka.viewer.kropki.Defaults.EMPTY:
                if (check[i][j]!=check[i+1][j]+1
                    && check[i+1][j]!=check[i][j]+1) {
                    this.error[i][j] = true;
                    this.error[i+1][j] = true;
                    return 'kropki_no_neighbours';
                }
                break;
              case teka.viewer.kropki.Defaults.FULL:
                if (check[i][j]!=2*check[i+1][j]
                    && check[i+1][j]!=2*check[i][j]) {
                    this.error[i][j] = true;
                    this.error[i+1][j] = true;
                    return 'kropki_not_twice';
                }
                break;
            }
        }
    }

    // Check dots and no dots on horizontal line
    for (var i=0;i<X;i++) {
        for (var j=0;j<X-1;j++) {
            switch (this.uddots[i][j]) {
              case teka.viewer.kropki.Defaults.NONE:
                if (check[i][j]==2*check[i][j+1]
                    || check[i][j+1]==2*check[i][j]) {
                    this.error[i][j] = true;
                    this.error[i][j+1] = true;
                    return 'kropki_twice';
                }
                if (check[i][j]==check[i][j+1]+1
                    || check[i][j+1]==check[i][j]+1) {
                    this.error[i][j] = true;
                    this.error[i][j+1] = true;
                    return 'kropki_neighbours';
                }
                break;
              case teka.viewer.kropki.Defaults.EMPTY:
                if (check[i][j]!=check[i][j+1]+1
                    && check[i][j+1]!=check[i][j]+1) {
                    this.error[i][j] = true;
                    this.error[i][j+1] = true;
                    return 'kropki_no_neightbours';
                }
                break;
              case teka.viewer.kropki.Defaults.FULL:
                if (check[i][j]!=2*check[i][j+1]
                    && check[i][j+1]!=2*check[i][j]) {
                    this.error[i][j] = true;
                    this.error[i][j+1] = true;
                    return 'kropki_not_twice';
                }
                break;
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
teka.viewer.kropki.KropkiViewer.prototype.setMetrics = function(g)
{
    this.scale = Math.floor(Math.min((this.width-3)/this.X,
                                     (this.height-3-(this.textHeight+2))/this.X));
    var realwidth = this.X * this.scale + 3;
    var realheight = this.X * this.scale + 3 + this.textHeight+2;

    this.bottomText = teka.translate('kropki_digits',[this.X]);
    g.font = 'bold '+this.textHeight+'px sans-serif';
    var textwidth = g.measureText(this.bottomText).width+1;
    realwidth = Math.max(realwidth,textwidth);

    this.deltaX = Math.floor((this.width-realwidth)/2)+0.5;
    this.deltaY = Math.floor((this.height-realheight)/2)+0.5;

    this.font = teka.getFontData(Math.round(this.scale/2)+'px sans-serif',this.scale);
    this.boldfont = teka.getFontData('bold '+Math.round(this.scale/2)+'px sans-serif',this.scale);
    this.smallfont = teka.getFontData(Math.round((this.scale-6)/4)+'px sans-serif',this.scale);

    if (realwidth>this.width || realheight>this.height) this.scale=false;
    return {width:realwidth,height:realheight,scale:this.scale};
};

/** Paints the diagram. */
teka.viewer.kropki.KropkiViewer.prototype.paint = function(g)
{
    var X = this.X;
    var S = this.scale;

    g.save();
    g.translate(this.deltaX+1,this.deltaY+1);

    g.fillStyle = '#fff';
    g.fillRect(0,0,X*S+1,X*S+1);

    // paint the background of the cells
    for (var i=0;i<X;i++) {
        for (var j=0;j<X;j++) {
            g.fillStyle = this.isBlinking()?
                this.getBlinkColor(i,j,X,this.f[i][j]):
                (this.error[i][j]?'#f00':'#fff');
            g.fillRect(i*S,j*S,S,S);
        }
    }

    // paint the grid
    g.strokeStyle = '#000';
    g.lineWidth = 3;
    g.strokeRect(0,0,X*S,X*S);
    g.lineWidth = 1;

    for (var i=1;i<X;i++) {
        teka.drawLine(g,0,i*S,X*S,i*S);
        teka.drawLine(g,i*S,0,i*S,X*S);
    }

    // paint the dots on vertical lines
    g.strokeStyle='#000';
    for (var i=0;i<X-1;i++) {
        for (var j=0;j<X;j++) {
            if (this.lrdots[i][j]==teka.viewer.kropki.Defaults.EMPTY) {
                g.fillStyle='#fff';
                teka.fillOval(g,(i+1)*S,j*S+S/2,S/8);
                teka.strokeOval(g,(i+1)*S,j*S+S/2,S/8);
            } else if (this.lrdots[i][j]==teka.viewer.kropki.Defaults.FULL) {
                g.fillStyle='#000';
                teka.fillOval(g,(i+1)*S,j*S+S/2,S/8);
            }
        }
    }

    // paint the dots on horizontal lines
    for (var i=0;i<X;i++) {
        for (var j=0;j<X-1;j++) {
            if (this.uddots[i][j]==teka.viewer.kropki.Defaults.EMPTY) {
                g.fillStyle='#fff';
                teka.fillOval(g,i*S+S/2,(j+1)*S,S/8);
                teka.strokeOval(g,i*S+S/2,(j+1)*S,S/8);
            } else if (this.uddots[i][j]==teka.viewer.kropki.Defaults.FULL) {
                g.fillStyle='#000';
                teka.fillOval(g,i*S+S/2,(j+1)*S,S/8);
            }
        }
    }

    // paint the content of the cells
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    for (var i=0;i<X;i++) {
        for (var j=0;j<X;j++) {
            // given numbers
            if (this.puzzle[i][j]!==0) {
                g.fillStyle = '#000';
                g.font = this.boldfont.font;
                g.fillText(this.puzzle[i][j],i*S+S/2,j*S+S/2+this.boldfont.delta);
                continue;
            }

            // empty?
            if (this.f[i][j]==teka.viewer.kropki.Defaults.NONE) {
                continue;
            }

            // normal numbers
            g.fillStyle = this.getColorString(this.c[i][j]);
            if (this.f[i][j]<1000) {
                g.font = this.font.font;
                g.fillText(this.f[i][j],i*S+S/2,j*S+S/2+this.font.delta);
                continue;
            }

            // numbers in expert mode
            g.font = this.smallfont.font;
            for (var k=1;k<=9;k++) {
                if (((this.f[i][j]-1000)&(1<<k))!=0) {
                    g.fillText(k,
                               S*i+((k-1)%3+1)*S/4,
                               S*j+Math.floor((k-1)/3+1)*S/4+this.smallfont.delta);
                }
            }

            // expert grid
            g.strokeStyle = '#000';
            teka.drawLine(g,S*i+3*S/8,S*j+S/8,S*i+3*S/8,S*(j+1)-S/8);
            teka.drawLine(g,S*(i+1)-3*S/8,S*j+S/8,S*(i+1)-3*S/8,S*(j+1)-S/8);
            teka.drawLine(g,S*i+S/8,S*j+3*S/8,S*(i+1)-S/8,S*j+3*S/8);
            teka.drawLine(g,S*i+S/8,S*(j+1)-3*S/8,S*(i+1)-S/8,S*(j+1)-3*S/8);

            // little x
            teka.drawLine(g,(i+1)*S-S/8-2,(j+1)*S-S/8-2,(i+1)*S-2,(j+1)*S-2);
            teka.drawLine(g,(i+1)*S-S/8-2,(j+1)*S-2,(i+1)*S-2,(j+1)*S-S/8-2);
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
        g.strokeStyle='#f00';
        if (this.exp) {
            teka.drawLine(g,
                          (this.x+1)*S-S/8-2,(this.y+1)*S-S/8-2,
                          (this.x+1)*S-2,(this.y+1)*S-2);
            teka.drawLine(g,
                          (this.x+1)*S-S/8-2,(this.y+1)*S-2,
                          (this.x+1)*S-2,(this.y+1)*S-S/8-2);
        } else {
            g.lineWidth = 2;
            g.strokeRect(S*this.x+3.5,S*this.y+3.5,S-7,S-7);
        }
    }

    g.restore();
};

//////////////////////////////////////////////////////////////////

/** Handles mousemove event. */
teka.viewer.kropki.KropkiViewer.prototype.processMouseMovedEvent = function(xc,yc)
{
    xc = xc-this.deltaX-1;
    yc = yc-this.deltaY-1;

    var oldx = this.x;
    var oldy = this.y;

    this.x = Math.floor(xc/this.scale);
    this.y = Math.floor(yc/this.scale);

    this.xm = xc-this.scale*this.x;
    this.ym = yc-this.scale*this.y;

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

    var oldexp = this.exp;
    this.exp = this.X<=9 &&
        this.xm>this.scale-this.scale/8 && this.ym>this.scale-this.scale/8;

    return this.x!=oldx || this.y!=oldy || this.exp!=oldexp;
};

/** Handles mousedown event. */
teka.viewer.kropki.KropkiViewer.prototype.processMousePressedEvent = function(xc,yc)
{
    var erg = this.processMouseMovedEvent(xc,yc);

    if (this.x<0 || this.y<0 || this.x>=this.X || this.y>=this.X) {
        return erg;
    }

    if (this.X<=9) {
        if (this.xm>this.scale-this.scale/8 && this.ym>this.scale-this.scale/8) {
            if (this.f[this.x][this.y]<1000) {
                this.set(this.x,this.y,this.setExpert(this.f[this.x][this.y]));
            } else {
                this.set(this.x,this.y,this.getExpert(this.f[this.x][this.y]));
            }
            return true;
        }
    }

    if (this.f[this.x][this.y]>=1000) {
        var nr = ((this.xm<3*this.scale/8)?0:(this.xm>this.scale-3*this.scale/8)?2:1)+
            3*((this.ym<3*this.scale/8)?0:(this.ym>this.scale-3*this.scale/8)?2:1)+1;
        if (nr<1 || nr>this.X) {
            return erg;
        }

        this.set(this.x,this.y,((this.f[this.x][this.y]-1000)^(1<<nr))+1000);
        return true;
    }

    this.set(this.x,this.y,(this.f[this.x][this.y]+1) % (this.X+1));

    return true;
};

/** Handles keydown event. */
teka.viewer.kropki.KropkiViewer.prototype.processKeyEvent = function(e)
{
    this.exp = false;

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

    if (this.x<0 || this.x>=this.X || this.y<0 || this.y>=this.X) {
        return false;
    }

    if (e.key==teka.KEY_SPACE) {
        this.set(this.x,this.y,0);
        return true;
    }

    if (e.key>=teka.KEY_0 && e.key<=teka.KEY_9) {

        var val = e.key-teka.KEY_0;

        if (val>this.X) {
            return false;
        }

        if (this.f[this.x][this.y]<1000) {
            if (this.f[this.x][this.y]>0 &&
                this.f[this.x][this.y]*10+(e.key-teka.KEY_0)<=this.X) {
                this.set(this.x,this.y,this.f[this.x][this.y]*10+val);
            } else if (e.key>=teka.KEY_1) {
                this.set(this.x,this.y,val);
            }
        } else {
            this.set(this.x,this.y,((this.f[this.x][this.y]-1000)^(1<<val))+1000);
        }
        return true;
    }

    if (e.key==teka.KEY_HASH || e.key==teka.KEY_COMMA) {
        if (this.X<=9) {
            if (this.f[this.x][this.y]<1000) {
                this.set(this.x,this.y,this.setExpert(this.f[this.x][this.y]));
            } else {
                this.set(this.x,this.y,this.getExpert(this.f[this.x][this.y]));
            }
        }
        return true;
    }

    return false;
};

//////////////////////////////////////////////////////////////////

/** Sets the value of a cell, if the color fits. */
teka.viewer.kropki.KropkiViewer.prototype.set = function(x,y,value)
{
    if (this.f[x][y]!=0 && this.c[x][y]!=this.color) {
        return;
    }
    this.f[x][y] = value;
    this.c[x][y] = this.color;
};

/** Converts from normal mode to expert mode. */
teka.viewer.kropki.KropkiViewer.prototype.setExpert = function(h)
{
    return 1000+(h===0?0:(1<<h));
};

/** Converts back from expert mode to normal mode. */
teka.viewer.kropki.KropkiViewer.prototype.getExpert = function(h)
{
    if (h<1000) {
        return h;
    }

    var min = 10;
    var max = 0;
    h -= 1000;

    for (var i=1;i<=9;i++) {
        if ((h&(1<<i))!=0) {
            if (i<min) {
                min = i;
            }
            if (i>max) {
                max = i;
            }
        }
    }

    if (min==max) {
        return min;
    }

    return 0;
};
