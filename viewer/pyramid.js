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
teka.viewer.pyramid = {};

/** Some constants. */
teka.viewer.pyramid.Defaults = {
    EVEN: 10,
    ODD: 11
};

/** Constructor */
teka.viewer.pyramid.PyramidViewer = function(data)
{
    teka.viewer.PuzzleViewer.call(this,data);

    this.x = 0;
    this.y = 0;
    this.xm = 0;
    this.ym = 0;
    this.exp = false;
};
teka.extend(teka.viewer.pyramid.PyramidViewer,teka.viewer.PuzzleViewer);

//////////////////////////////////////////////////////////////////

/** Initialize this viewer width the PSData object provided. */
teka.viewer.pyramid.PyramidViewer.prototype.initData = function(data)
{
    this.X = parseInt(data.get('size'),10);
    this.asciiToData(data.get('puzzle'));
    this.asciiToSolution(data.get('solution'));

    this.f = teka.new_array([this.X,this.X],0);
    this.c = teka.new_array([this.X,this.X],0);
    this.error = teka.new_array([this.X,this.X],false);
};

/** Read puzzle from ascii art. */
teka.viewer.pyramid.PyramidViewer.prototype.asciiToData = function(ascii)
{
    if (ascii===false) {
        return;
    }

    var grid = this.asciiToArray(ascii);

    this.puzzle = teka.new_array([this.X,this.X],0);
    for (var j=0;j<this.X;j++) {
        for (var i=0;i<=j;i++) {
            this.puzzle[i][j] = grid[2*i+(this.X-j-1)+1][j]==teka.ord(' ') ||
                grid[2*i+(this.X-j-1)+1][j]==teka.ord('.l')?0:
                (grid[2*i+(this.X-j-1)+1][j]-teka.ord('0'));
        }
    }

    this.unique = teka.new_array([this.X],false);
    for (var j=0;j<this.X;j++) {
        this.unique[j] = grid[0][j]==teka.ord('#');
    }
};

/** Read solution from ascii art. */
teka.viewer.pyramid.PyramidViewer.prototype.asciiToSolution = function(ascii)
{
    if (ascii===false) {
        return;
    }

    var grid = this.asciiToArray(ascii);

    this.solution = teka.new_array([this.X,this.X],0);
    for (var j=0;j<this.X;j++) {
        for (var i=0;i<=j;i++) {
            this.solution[i][j] = grid[2*i+(this.X-j-1)][j]-teka.ord('0');
        }
    }
};

/** Add solution. */
teka.viewer.pyramid.PyramidViewer.prototype.addSolution = function()
{
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.X;j++) {
            this.f[i][j] = this.solution[i][j];
        }
    }
};

//////////////////////////////////////////////////////////////////

/** Returns a small example. */
teka.viewer.pyramid.PyramidViewer.prototype.getExample = function()
{
    return '/format 1\n/type (pyramid)\n/sol false\n/size 4'
        +'\n/puzzle [ (#       ) (#  9    ) (=       ) (#7 6   3) ]'
        +'\n/solution [ (   2   ) (  9 7  ) ( 1 8 1 ) (7 6 2 3) ]';
};

/** Returns a list of automatically generated properties. */
teka.viewer.pyramid.PyramidViewer.prototype.getProperties = function()
{
    return [teka.translate('generic_size',[this.X])];
};

//////////////////////////////////////////////////////////////////

/** Reset the whole diagram. */
teka.viewer.pyramid.PyramidViewer.prototype.reset = function()
{
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.X;j++) {
            this.f[i][j] = 0;
        }
    }
};

/** Reset the error marks. */
teka.viewer.pyramid.PyramidViewer.prototype.clearError = function()
{
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.X;j++) {
            this.error[i][j] = false;
        }
    }
};

/** Copy digits colored with this.color to color. */
teka.viewer.pyramid.PyramidViewer.prototype.copyColor = function(color)
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
teka.viewer.pyramid.PyramidViewer.prototype.clearColor = function(color)
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
teka.viewer.pyramid.PyramidViewer.prototype.saveState = function()
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
teka.viewer.pyramid.PyramidViewer.prototype.loadState = function(state)
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
teka.viewer.pyramid.PyramidViewer.prototype.check = function()
{
    var X = this.X;

    for (var i=0;i<X;i++) {
        for (var j=0;j<X;j++) {
            if (this.puzzle[i][j]!=0) {
                this.f[i][j] = this.puzzle[i][j];
            }
        }
    }

    var check = teka.new_array([X,X],0);
    for (var j=0;j<X;j++) {
        for (var i=0;i<=j;i++) {
            if (this.f[i][j]>=1000) {
                check[i][j] = this.getExpert(this.f[i][j]);
                if (check[i][j]===0) {
                    this.error[i][j] = true;
                    if (this.f[i][j]==1000) {
                        return 'pyramid_empty';
                    }
                    return 'pyramid_not_unique';
                }
            } else {
                check[i][j] = this.f[i][j];
            }
            if (check[i][j]===0) {
                this.error[i][j] = true;
                return 'pyramid_empty';
            }
        }
    }

    for (var j=0;j<X-1;j++) {
        for (var i=0;i<=j;i++) {
            if (check[i][j]!=check[i][j+1]+check[i+1][j+1]
                && check[i][j]!=Math.abs(check[i][j+1]-check[i+1][j+1])) {
                this.error[i][j] = true;
                this.error[i][j+1] = true;
                this.error[i+1][j+1] = true;
                return 'pyramid_wrong_calculation';
            }
        }
    }

    for (var j=0;j<X;j++) {
        var da = teka.new_array([10],0);
        var double_value = false;
        for (var i=0;i<=j;i++) {
            if (da[check[i][j]]>0) {
                da[check[i][j]]++;
                double_value = true;
                break;
            }
            da[check[i][j]]++;
        }
        if (double_value && this.unique[j]) {
            for (var i=0;i<=j;i++) {
                if (da[check[i][j]]>1) {
                    this.error[i][j] = true;
                }
            }
            return 'pyramid_row_duplicate';
        }
        if (!double_value && !this.unique[j]) {
            for (var i=0;i<=j;i++) {
                this.error[i][j] = true;
            }
            return 'pyramid_row_not_duplicate';
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
teka.viewer.pyramid.PyramidViewer.prototype.setMetrics = function(g)
{
    this.scale = Math.floor(Math.min((this.width-1)/this.X,
                                     (this.height-1)/this.X));
    var realwidth = this.X*this.scale+1;
    var realheight = this.X*this.scale+1;

    this.deltaX = Math.floor((this.width-realwidth)/2)+0.5;
    this.deltaY = Math.floor((this.height-realheight)/2)+0.5;

    this.font = teka.getFontData(Math.round(this.scale/2)+'px sans-serif',this.scale);
    this.boldfont = teka.getFontData('bold '+Math.round(this.scale/2)+'px sans-serif',this.scale);
    this.smallfont = teka.getFontData(Math.round((this.scale-6)/4)+'px sans-serif',this.scale);

    if (realwidth>this.width || realheight>this.height) {
        this.scale=false;
    }
    return {width:realwidth,height:realheight,scale:this.scale};
};

/** Paints the diagram. */
teka.viewer.pyramid.PyramidViewer.prototype.paint = function(g)
{
    var X = this.X;
    var S = this.scale;

    g.save();
    g.translate(this.deltaX,this.deltaY);

    // paint the background of the cells
    for (var j=0;j<X;j++) {
        for (var i=0;i<=j;i++) {
            g.fillStyle = this.isBlinking()?
                this.getBlinkColor(i,j,X,this.f[i][j]):
                (this.error[i][j]?(this.unique[j]?'#c00':'#f00'):
                    (this.unique[j]?'#888':'#fff'));
            g.fillRect((X-j)*S/2-S/2+i*S,j*S,S,S);
        }
    }

    g.strokeStyle = '#000';
    for (var i=0;i<X;i++) {
        for (var j=0;j<=i;j++) {
            g.strokeRect(Math.floor((X-i)*S/2-S/2+j*S),i*S,S,S);
        }
    }

    g.textAlign = 'center';
    g.textBaseline = 'middle';
    for (var j=0;j<X;j++) {
        for (var i=0;i<=j;i++) {
            if (this.puzzle[i][j]>0) {
                g.fillStyle = '#000';
                g.font = this.boldfont.font;
                g.fillText(this.puzzle[i][j],(X-j-1)*S/2+i*S+S/2,j*S+S/2+this.boldfont.delta);
                continue;
            }

            if (this.f[i][j]===0) {
                continue;
            }

            g.fillStyle = this.getColorString(this.c[i][j]);
            if (this.f[i][j]==teka.viewer.pyramid.Defaults.EVEN) {
                g.font = this.smallfont.font;
                g.fillText('2',S*i+S/2+Math.floor(S*(X-j)/2-S/2),S*j+S/2-S/4+this.smallfont.delta);
                g.fillText('4',S*i+S/2-S/4+Math.floor(S*(X-j)/2-S/2),S*j+S/2+this.smallfont.delta);
                g.fillText('6',S*i+S/2+S/4+Math.floor(S*(X-j)/2-S/2),S*j+S/2+this.smallfont.delta);
                g.fillText('8',S*i+S/2+Math.floor(S*(X-j)/2-S/2),S*j+S/2+S/4+this.smallfont.delta);
                continue;
            }
            if (this.f[i][j]==teka.viewer.pyramid.Defaults.ODD) {
                g.font = this.smallfont.font;
                g.fillText('1',S*i+S/2-S/4+Math.floor(S*(X-j)/2-S/2),S*j+S/2-S/4+this.smallfont.delta);
                g.fillText('3',S*i+S/2+S/4+Math.floor(S*(X-j)/2-S/2),S*j+S/2-S/4+this.smallfont.delta);
                g.fillText('5',S*i+S/2+Math.floor(S*(X-j)/2-S/2),S*j+S/2+this.smallfont.delta);
                g.fillText('7',S*i+S/2-S/4+Math.floor(S*(X-j)/2-S/2),S*j+S/2+S/4+this.smallfont.delta);
                g.fillText('9',S*i+S/2+S/4+Math.floor(S*(X-j)/2-S/2),S*j+S/2+S/4+this.smallfont.delta);
                continue;
            }
            if (this.f[i][j]<1000) {
                g.font = this.font.font;
                g.fillText(this.f[i][j],(X-j-1)*S/2+i*S+S/2,j*S+S/2+this.font.delta);
                continue;
            }

            // numbers in expert mode
            g.fillStyle = this.getColorString(this.c[i][j]);
            g.font = this.smallfont.font;
            for (var k=1;k<=9;k++) {
                if (((this.f[i][j]-1000)&(1<<k))!=0) {
                    g.fillText(k,
                               S*i+((k-1)%3+1)*S/4+Math.floor(S*(X-j)/2-S/2),
                               S*j+Math.floor((k-1)/3+1)*S/4+this.smallfont.delta);
                }
            }

            // expert grid
            g.strokeStyle = this.unique[j]?'#000':'#888';
            teka.drawLine(g,S*i+3*S/8+Math.floor(S*(X-j)/2-S/2),S*j+S/8,
                          S*i+3*S/8+Math.floor(S*(X-j)/2-S/2),S*(j+1)-S/8);
            teka.drawLine(g,S*(i+1)-3*S/8+Math.floor(S*(X-j)/2-S/2),S*j+S/8,
                          S*(i+1)-3*S/8+Math.floor(S*(X-j)/2-S/2),S*(j+1)-S/8);
            teka.drawLine(g,S*i+S/8+Math.floor(S*(X-j)/2-S/2),S*j+3*S/8,
                          S*(i+1)-S/8+Math.floor(S*(X-j)/2-S/2),S*j+3*S/8);
            teka.drawLine(g,S*i+S/8+Math.floor(S*(X-j)/2-S/2),S*(j+1)-3*S/8,
                          S*(i+1)-S/8+Math.floor(S*(X-j)/2-S/2),S*(j+1)-3*S/8);

            // little x
            teka.drawLine(g,(i+1)*S-S/8-2+Math.floor(S*(X-j)/2-S/2),(j+1)*S-S/8-2,
                          (i+1)*S-2+Math.floor(S*(X-j)/2-S/2),(j+1)*S-2);
            teka.drawLine(g,(i+1)*S-S/8-2+Math.floor(S*(X-j)/2-S/2),(j+1)*S-2,
                          (i+1)*S-2+Math.floor(S*(X-j)/2-S/2),(j+1)*S-S/8-2);
        }
    }

    // Cursor
    if (this.mode==teka.viewer.Defaults.NORMAL) {
        g.strokeStyle='#f00';
        if (this.exp) {
            teka.drawLine(g,
                          (this.x+1)*S+Math.floor(S*(X-this.y)/2-S/2)-S/8-2,(this.y+1)*S-S/8-2,
                          (this.x+1)*S+Math.floor(S*(X-this.y)/2-S/2)-2,(this.y+1)*S-2);
            teka.drawLine(g,
                          (this.x+1)*S+Math.floor(S*(X-this.y)/2-S/2)-S/8-2,(this.y+1)*S-2,
                          (this.x+1)*S+Math.floor(S*(X-this.y)/2-S/2)-2,(this.y+1)*S-S/8-2);
        } else {
            g.lineWidth = 2;
            g.strokeRect(S*this.x+Math.floor(S*(X-this.y)/2-S/2)+3.5,S*this.y+3.5,S-7,S-7);
        }
    }

    g.restore();
};

//////////////////////////////////////////////////////////////////

/** Handles mousemove event. */
teka.viewer.pyramid.PyramidViewer.prototype.processMousemoveEvent = function(xc, yc, pressed)
{
    xc -= this.deltaX;
    yc -= this.deltaY;

    var oldx = this.x;
    var oldy = this.y;
    var oldexp = this.exp;

    this.y = Math.floor(yc/this.scale);
    this.ym = yc-this.scale*this.y;
    this.x = Math.floor((xc-(this.X-this.y-1)*this.scale/2)/this.scale);
    this.xm = xc-this.scale*this.x-(this.X-this.y-1)*this.scale/2;

    this.exp = this.xm>this.scale-this.scale/8 && this.ym>this.scale-this.scale/8;

    if (this.x<0) {
        this.x=0;
        this.exp = false;
    }
    if (this.y<0) {
        this.y=0;
        this.exp = false;
    }
    if (this.x>this.y) {
        this.x=this.y;
        this.exp = false;
    }
    if (this.y>this.X-1) {
        this.y=this.X-1;
        this.exp = false;
    }

    return this.x!=oldx || this.y!=oldy || this.exp!=oldexp;
};

/** Handles mousedown event. */
teka.viewer.pyramid.PyramidViewer.prototype.processMousedownEvent = function(xc, yc)
{
    var erg = this.processMousemoveEvent(xc,yc);

    if (this.exp) {
        if (this.f[this.x][this.y]<1000) {
            this.set(this.x,this.y,this.setExpert(this.f[this.x][this.y]));
        } else {
            this.set(this.x,this.y,this.getExpert(this.f[this.x][this.y]));
        }
        return true;
    }

    if (this.f[this.x][this.y]>=1000) {
        var nr = ((this.xm<3*this.scale/8)?0:(this.xm>this.scale-3*this.scale/8)?2:1)+
            3*((this.ym<3*this.scale/8)?0:(this.ym>this.scale-3*this.scale/8)?2:1)+1;
        if (nr<1 || nr>9) {
            return erg;
        }
        this.set(this.x,this.y,((this.f[this.x][this.y]-1000)^(1<<nr))+1000);
        return true;
    }

    this.set(this.x,this.y,(this.f[this.x][this.y]+1)%12);

    return true;
};

/** Handles keydown event. */
teka.viewer.pyramid.PyramidViewer.prototype.processKeydownEvent = function(e)
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
            if (this.x>this.y) {
                this.x--;
            }
        }
        return true;
    }
    if (e.key==teka.KEY_RIGHT) {
        if (this.x<this.y) {
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

    if (this.x<0 || this.x>this.y || this.y<0 || this.y>=this.X) {
        return false;
    }

    if (e.key==teka.KEY_SPACE) {
        this.set(this.x,this.y,0);
        return true;
    }

    if (e.key==teka.KEY_MINUS) {
        this.set(this.x,this.y,teka.viewer.pyramid.Defaults.EVEN);
        return true;
    }

    if (e.key==teka.KEY_PLUS) {
        this.set(this.x,this.y,teka.viewer.pyramid.Defaults.ODD);
        return true;
    }

    if (e.key>=teka.KEY_1 && e.key<=teka.KEY_9) {

        var val = e.key-teka.KEY_0;

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
teka.viewer.pyramid.PyramidViewer.prototype.set = function(x, y, value)
{
    if (this.f[x][y]!=0 && this.f[x][y]!=1000 && this.c[x][y]!=this.color) {
        return;
    }
    this.f[x][y] = value;
    this.c[x][y] = this.color;
};

/** Converts from normal mode to expert mode. */
teka.viewer.pyramid.PyramidViewer.prototype.setExpert = function(h)
{
    if (h===0) {
        return 1000;
    }
    if (h<10) {
        return 1000+(1<<h);
    }
    if (h==teka.viewer.pyramid.Defaults.EVEN) {
        return 1340;
    }
    if (h==teka.viewer.pyramid.Defaults.ODD) {
        return 1682;
    }
    return h;
};

/** Converts back from expert mode to normal mode. */
teka.viewer.pyramid.PyramidViewer.prototype.getExpert = function(h)
{
    if (h==1340) {
        return teka.viewer.pyramid.Defaults.EVEN;
    }
    if (h==1682) {
        return teka.viewer.pyramid.Defaults.ODD;
    }
    var min = 10;
    var max = -1;
    h = h-1000;
    for (var i=0;i<=9;i++) {
        if ((h&(1<<i))!=0) {
            if (i<min) {
                min=i;
            }
            if (i>max) {
                max=i;
            }
        }
    }
    if (min==max) {
        return min;
    }
    return 0;
};
