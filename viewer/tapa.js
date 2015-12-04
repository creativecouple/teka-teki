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
teka.viewer.tapa = {};

/** Some constants, used for the dots. */
teka.viewer.tapa.Defaults = {
    NONE: 0,
    BLACK: 1,
    EMPTY: 2
};

/** Constructor */
teka.viewer.tapa.TapaViewer = function(data)
{
    teka.viewer.PuzzleViewer.call(this,data);

    this.x = 0;
    this.y = 0;
};
teka.extend(teka.viewer.tapa.TapaViewer,teka.viewer.PuzzleViewer);

//////////////////////////////////////////////////////////////////

/** Initialize this viewer width the PSData object provided. */
teka.viewer.tapa.TapaViewer.prototype.initData = function(data)
{
    this.X = parseInt(data.get('X'),10);
    this.Y = parseInt(data.get('Y'),10);
    this.asciiToData(data.get('puzzle'));
    this.asciiToSolution(data.get('solution'));

    this.f = teka.new_array([this.X,this.Y],0);
    this.c = teka.new_array([this.X,this.Y],0);
    this.error = teka.new_array([this.X,this.Y],false);
};

/** import_puzzle */
teka.viewer.tapa.TapaViewer.prototype.asciiToData = function(ascii)
{
    if (ascii===false) {
        return;
    }

    var c = this.asciiToArray(ascii);

    this.puzzle = teka.new_array([this.X,this.Y,4],0);
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            if (c[2*i][2*j].charCodeAt(0)>='1'.charCodeAt(0)
                && c[2*i][2*j].charCodeAt(0)<='8'.charCodeAt(0)) {
                this.puzzle[i][j][0] = c[2*i][2*j].charCodeAt(0)-'0'.charCodeAt(0);
                this.puzzle[i][j][1] = c[2*i+1][2*j].charCodeAt(0)==' '.charCodeAt(0)?0:(c[2*i+1][2*j].charCodeAt(0)-'0'.charCodeAt(0));
                this.puzzle[i][j][2] = c[2*i][2*j+1].charCodeAt(0)==' '.charCodeAt(0)?0:(c[2*i][2*j+1].charCodeAt(0)-'0'.charCodeAt(0));
                this.puzzle[i][j][3] = c[2*i+1][2*j+1].charCodeAt(0)==' '.charCodeAt(0)?0:(c[2*i+1][2*j+1].charCodeAt(0)-'0'.charCodeAt(0));
            }
        }
    }

    this.cells = teka.new_array([this.X,this.X],0);
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.X;j++) {
            if (c[2*i][2*j].charCodeAt(0)=='-'.charCodeAt(0)) {
                this.cells[i][j] = teka.viewer.tapa.Defaults.EMPTY;
            }
            if (c[2*i][2*j].charCodeAt(0)=='#'.charCodeAt(0)) {
                this.cells[i][j] = teka.viewer.tapa.Defaults.BLACK;
            }
        }
    }
};

/** Import solution */
teka.viewer.tapa.TapaViewer.prototype.asciiToSolution = function(ascii)
{
    if (ascii===false) {
        return;
    }

    var c = this.asciiToArray(ascii);

    this.solution = teka.new_array([this.X,this.Y],0);
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            this.solution[i][j] = c[i][j].charCodeAt(0)=='#'.charCodeAt(0)?teka.viewer.tapa.Defaults.BLACK:teka.viewer.tapa.Defaults.NONE;
        }
    }
};

/** Add solution. */
teka.viewer.tapa.TapaViewer.prototype.addSolution = function()
{
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            this.f[i][j] = this.solution[i][j];
        }
    }
};

//////////////////////////////////////////////////////////////////

/** Returns a small example. */
teka.viewer.tapa.TapaViewer.prototype.getExample = function()
{
    return '/type (tapa)\n/sol false\n/X 6\n/Y 6\n/puzzle [ (            )'
        +' (            ) (    11  51  ) (    11      ) (            )'
        +' (            ) (    22      ) (    1       ) (        7   )'
        +' (            ) (2           ) (            ) ]\n/solution ['
        +' (## ###) (#    #) (## # #) (#  ###) (###  #) (  ####) ]';

};

//////////////////////////////////////////////////////////////////

/** Reset the whole diagram. */
teka.viewer.tapa.TapaViewer.prototype.reset = function()
{
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            this.f[i][j] = 0;
            this.c[i][j] = 0;
        }
    }
};

/** Reset the error marks. */
teka.viewer.tapa.TapaViewer.prototype.clearError = function()
{
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            this.error[i][j] = false;
        }
    }
};

/** Copy digits colored with this.color to color. */
teka.viewer.tapa.TapaViewer.prototype.copyColor = function(color)
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
teka.viewer.tapa.TapaViewer.prototype.clearColor = function(color)
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
teka.viewer.tapa.TapaViewer.prototype.saveState = function()
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
teka.viewer.tapa.TapaViewer.prototype.loadState = function(state)
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
teka.viewer.tapa.TapaViewer.prototype.check = function()
{
    var X = this.X;
    var Y = this.Y;

    // Copy to array check, setting places with given numbers to 0
    var check = teka.new_array([this.X,this.Y],0);
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            check[i][j] = this.f[i][j];
            if (this.puzzle[i][j][0]!=0) {
                check[i][j] = teka.viewer.tapa.Defaults.NONE;
            }
            if (this.cells[i][j]==teka.viewer.tapa.Defaults.EMPTY) {
                check[i][j] = teka.viewer.tapa.Defaults.EMPTY;
            }
            if (this.cells[i][j]==teka.viewer.tapa.Defaults.BLACK) {
                check[i][j] = teka.viewer.tapa.Defaults.BLACK;
            }
        }
    }

    // Check for 2x2-squares
    for (var i=0;i<this.X-1;i++) {
        for (var j=0;j<this.Y-1;j++) {
            if (check[i][j]==teka.viewer.tapa.Defaults.BLACK
                && check[i+1][j]==teka.viewer.tapa.Defaults.BLACK
                && check[i][j+1]==teka.viewer.tapa.Defaults.BLACK
                && check[i+1][j+1]==teka.viewer.tapa.Defaults.BLACK) {
                this.error[i][j] = true;
                this.error[i+1][j] = true;
                this.error[i][j+1] = true;
                this.error[i+1][j+1] = true;
                return 'tapa_2x2';
            }
        }
    }


    // The possible sets of values given
    var tab1 = ['0','1','2','3','4','5','6','7','8',
                '11','21','22','31','32','33','41','42','51',
                '111','211','221','311',
                '1111'];

    // An index into tab1 for all 256 possible black/white shapes.
    var tab2 = [0,1,1,2,1,9,2,3,1,9,9,10,2,10,3,4,1,9,9,10,9,18,10,12,2,10,10,11,3,12,4,
        5,1,9,9,10,9,18,10,12,9,18,18,19,10,19,12,15,2,10,10,11,10,19,11,13,3,12,
        12,13,4,15,5,6,1,9,9,10,9,18,10,12,9,18,18,19,10,19,12,15,9,18,18,19,18,
        22,19,21,10,19,19,20,12,21,15,17,2,10,10,11,10,19,11,13,10,19,19,20,11,20,
        13,16,3,12,12,13,12,21,13,14,4,15,15,16,5,17,6,7,1,2,9,3,9,10,10,4,9,10,
        18,12,10,11,12,5,9,10,18,12,18,19,19,15,10,11,19,13,12,13,15,6,9,10,18,12,
        18,19,19,15,18,19,22,21,19,20,21,17,10,11,19,13,19,20,20,16,12,13,21,14,
        15,16,17,7,2,3,10,4,10,12,11,5,10,12,19,15,11,13,13,6,10,12,19,15,19,21,
        20,17,11,13,20,16,13,14,16,7,3,4,12,5,12,15,13,6,12,15,21,17,13,16,14,7,
        4,5,15,6,15,17,16,7,5,6,17,7,6,7,7,8];

    // Checking if the numbers are correct
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            if (this.puzzle[i][j][0]!=0) {
                // calculate a value from the 8 touching cells,
                // starting at the top and proceeding clockwise.
                var h = 0;
                if (j>0 && check[i][j-1]==teka.viewer.tapa.Defaults.BLACK) {
                    h+=1;
                }
                if (i<this.X-1 && j>0 && check[i+1][j-1]==teka.viewer.tapa.Defaults.BLACK) {
                    h+=2;
                }
                if (i<this.X-1 && check[i+1][j]==teka.viewer.tapa.Defaults.BLACK) {
                    h+=4;
                }
                if (i<this.X-1 && j<this.Y-1 && check[i+1][j+1]==teka.viewer.tapa.Defaults.BLACK) {
                    h+=8;
                }
                if (j<this.Y-1 && check[i][j+1]==teka.viewer.tapa.Defaults.BLACK) {
                    h+=16;
                }
                if (i>0 && j<this.Y-1 && check[i-1][j+1]==teka.viewer.tapa.Defaults.BLACK) {
                    h+=32;
                }
                if (i>0 && check[i-1][j]==teka.viewer.tapa.Defaults.BLACK) {
                    h+=64;
                }
                if (i>0 && j>0 && check[i-1][j-1]==teka.viewer.tapa.Defaults.BLACK) {
                    h+=128;
                }
                var h2 = '';
                for (var k=0;k<4;k++) {
                    if (this.puzzle[i][j][k]!=0) {
                        h2+=this.puzzle[i][j][k];
                    }
                }
                if (tab1[tab2[h]]!==h2) {
                    this.error[i][j] = true;
                    return 'tapa_wrong_numbers';
                }
            }
        }
    }

    // Find a blackend cell
    var xc = -1;
    var yc = -1;
    outer: for (var i=0;i<this.X;i++)
    for (var j=0;j<this.Y;j++) {
        if (check[i][j]==teka.viewer.tapa.Defaults.BLACK) {
            xc = i;
            yc = j;
            break outer;
        }
    }

    // If non is present, we do have an empty puzzle, which is correct.
    if (xc==-1) {
        return true;
    }

    var mark = teka.new_array([this.X,this.Y],false);
    this.fill(mark,xc,yc,check);

    var ok = true;
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            if (check[i][j]==teka.viewer.tapa.Defaults.BLACK && !mark[i][j]) {
                this.error[i][j] = true;
                ok = false;
            }
        }
    }

    if (!ok) {
        return 'tapa_not_connected';
    }

    return true;
};

/** Floodfill mark from position x,y */
teka.viewer.tapa.TapaViewer.prototype.fill = function(mark, x, y, check)
{
    if (x<0 || y<0 || x>=this.X || y>=this.Y) {
        return;
    }
    if (mark[x][y]) {
        return;
    }
    if (check[x][y]!=teka.viewer.tapa.Defaults.BLACK) {
        return;
    }

    mark[x][y] = true;
    this.fill(mark,x+1,y,check);
    this.fill(mark,x-1,y,check);
    this.fill(mark,x,y+1,check);
    this.fill(mark,x,y-1,check);
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
teka.viewer.tapa.TapaViewer.prototype.setMetrics = function(g)
{
    this.scale = Math.floor(Math.min((this.width-5)/this.X,(this.height-5)/this.Y));
    var realwidth = this.X*this.scale+5;
    var realheight = this.Y*this.scale+5;

    this.deltaX = Math.round((this.width-realwidth)/2)+0.5;
    this.deltaY = Math.round((this.height-realheight)/2)+0.5;

    this.font = teka.getFontData(Math.round(this.scale/2)+'px sans-serif',this.scale);
    this.smallfont = teka.getFontData(Math.round(2*this.scale/5)+'px sans-serif',this.scale);

    if (realwidth>this.width || realheight>this.height) this.scale=false;
    return {width:realwidth,height:realheight,scale:this.scale};
};

/** Paints the diagram. */
teka.viewer.tapa.TapaViewer.prototype.paint = function(g)
{
    var X = this.X;
    var Y = this.Y;
    var S = this.scale;

    g.save();
    g.translate(this.deltaX,this.deltaY);

    g.fillStyle = '#fff';
    g.fillRect(2,2,S*X,S*Y);

    for (var i=0;i<X;i++) {
        for (var j=0;j<Y;j++) {
            if (this.mode>=teka.viewer.Defaults.BLINK_START
                && this.mode<=teka.viewer.Defaults.BLINK_END) {
                g.fillStyle = this.getBlinkColor(i,j,X,this.f[i][j]);
            } else if (this.error[i][j]) {
                g.fillStyle = '#f00';
            } else {
                g.fillStyle = '#fff';
            }
            g.fillRect(i*S+2,j*S+2,S,S);
        }
    }

    g.textAlign = 'center';
    g.textBaseline = 'middle';
    for (var i=0;i<X;i++) {
        for (var j=0;j<Y;j++) {
            if (this.cells[i][j]==teka.viewer.tapa.Defaults.BLACK) {
                g.fillStyle = '#000';
                g.fillRect(i*S+2,j*S+2,S,S);
                continue;
            }
            if (this.cells[i][j]==teka.viewer.tapa.Defaults.EMPTY) {
                g.strokeStyle = '#000';
                teka.drawLine(g,i*S+S/4+2,j*S+S/4+2,(i+1)*S-S/4+2,(j+1)*S-S/4+2);
                teka.drawLine(g,(i+1)*S-S/4+2,j*S+S/4+2,i*S+S/4+2,(j+1)*S-S/4+2);
                continue;
            }
            if (this.puzzle[i][j][0]==0) {
                if (this.f[i][j]==teka.viewer.tapa.Defaults.NONE) {
                    continue;
                }
                if (this.f[i][j]==teka.viewer.tapa.Defaults.EMPTY) {
                    g.strokeStyle = this.getColorString(this.c[i][j]);
                    teka.drawLine(g,i*S+S/4+2,j*S+S/4+2,(i+1)*S-S/4+2,(j+1)*S-S/4+2);
                    teka.drawLine(g,(i+1)*S-S/4+2,j*S+S/4+2,i*S+S/4+2,(j+1)*S-S/4+2);
                    continue;
                }
                if (!this.error[i][j]) {
                    g.fillStyle = this.getColorString(this.c[i][j]);
                    g.fillRect(i*S+2,j*S+2,S,S);
                }
                continue;
            }

            g.fillStyle = '#000';
            g.strokeStyle = '#000';
            if (this.puzzle[i][j][1]==0) {
                g.font = this.font.font;
                g.fillText(this.puzzle[i][j][0],i*S+2+S/2,j*S+2+S/2+this.font.delta);
                continue;
            }
            if (this.puzzle[i][j][2]==0) {
                teka.drawLine(g,i*S+S+2,j*S+2,i*S+2,j*S+S+2);
                g.font = this.smallfont.font;
                g.fillText(this.puzzle[i][j][0],i*S+2+S/2-S/4,j*S+2+S/2-S/4+this.font.delta);
                g.fillText(this.puzzle[i][j][1],i*S+2+S/2+S/4,j*S+2+S/2+S/4+this.font.delta);
                continue;
            }
            if (this.puzzle[i][j][3]==0) {
                teka.drawLine(g,i*S+2,j*S+2,i*S+S/2+2,j*S+S/2+2);
                teka.drawLine(g,i*S+S+2,j*S+2,i*S+S/2+2,j*S+S/2+2);
                teka.drawLine(g,i*S+S/2+2,j*S+S+2,i*S+S/2+2,j*S+S/2+2);
                g.font = this.smallfont.font;
                g.fillText(this.puzzle[i][j][0],i*S+2+S/2,j*S+2+S/2-S/4-S/16+this.font.delta);
                g.fillText(this.puzzle[i][j][1],i*S+2+S/2-S/4,j*S+2+S/2+S/4-S/8+this.font.delta);
                g.fillText(this.puzzle[i][j][2],i*S+2+S/2+S/4,j*S+2+S/2+S/4-S/8+this.font.delta);
                continue;
            }
            teka.drawLine(g,i*S+S+2,j*S+2,i*S+2,j*S+S+2);
            teka.drawLine(g,i*S+2,j*S+2,i*S+S+2,j*S+S+2);
            g.font = this.smallfont.font;
            g.fillText(this.puzzle[i][j][0],i*S+2+S/2-S/4-S/16,j*S+2+S/2+this.font.delta);
            g.fillText(this.puzzle[i][j][1],i*S+2+S/2,j*S+2+S/2-S/4-S/16+this.font.delta);
            g.fillText(this.puzzle[i][j][2],i*S+2+S/2+S/4+S/16,j*S+2+S/2+this.font.delta);
            g.fillText(this.puzzle[i][j][3],i*S+2+S/2,j*S+2+S/2+S/4+S/16+this.font.delta);
        }
    }

    g.save();
    g.lineWidth = 3;
    for (var i=0;i<X;i++) {
        for (var j=0;j<Y;j++) {
            if (this.puzzle[i][j][0]!=0 && this.f[i][j]==1) {
                g.strokeStyle = this.getColorString(this.c[i][j]);
                teka.drawLine(g,2+i*S+S/2-S/4,2+j*S+S/2-S/4,2+i*S+S/2+S/4,2+j*S+S/2+S/4);
                teka.drawLine(g,2+i*S+S/2+S/4,2+j*S+S/2-S/4,2+i*S+S/2-S/4,2+j*S+S/2+S/4);
            }
        }
    }
    g.restore();

    g.fillStyle = '#000';
    for (var i=0;i<=X;i++) {
        teka.drawLine(g,i*S+2,2,i*S+2,Y*S+2);
    }
    for (var i=0;i<=Y;i++) {
        teka.drawLine(g,2,i*S+2,X*S+2,i*S+2);
    }

    g.strokeRect(0,0,X*S+4,Y*S+4);
    g.strokeRect(1,1,X*S+2,Y*S+2);

    g.strokeStyle = '#f00';
    if (this.mode==teka.viewer.Defaults.NORMAL) {
        g.strokeRect(this.x*S+5,this.y*S+5,S-6,S-6);
        g.strokeRect(this.x*S+6,this.y*S+6,S-8,S-8);
    }

    g.restore();
};

//////////////////////////////////////////////////////////////////

/** Handles mousemove event. */
teka.viewer.tapa.TapaViewer.prototype.processMouseMovedEvent = function(xc, yc)
{
    xc = xc-this.deltaX-3;
    yc = yc-this.deltaY-3;

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
teka.viewer.tapa.TapaViewer.prototype.processMousePressedEvent = function(xc, yc)
{
    var erg = this.processMouseMovedEvent(xc,yc);

    if (this.x<0 || this.y<0 || this.x>=this.X || this.y>=this.Y) {
        return erg;
    }

    if (this.puzzle[this.x][this.y][0]!=0) {
        this.set(this.x,this.y,1-this.f[this.x][this.y]);
        return true;
    }

    this.set(this.x,this.y,(this.f[this.x][this.y]+1)%3);

    return true;
};

/** Handles keydown event. */
teka.viewer.tapa.TapaViewer.prototype.processKeyEvent = function(e)
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

    if (this.puzzle[this.x][this.y][0]!=0) {
        if (e.key==teka.KEY_HASH || e.key==teka.KEY_Q) {
            this.set(this.x,this.y,1);
            return true;
        }
        if (e.key==teka.KEY_SPACE) {
            this.set(this.x,this.y,0);
            return true;
        }
        return false;
    }

    if (e.key==teka.KEY_SPACE) {
        this.set(this.x,this.y,teka.viewer.tapa.Defaults.NONE);
        return true;
    }

    if (e.key==teka.KEY_HASH || e.key==teka.KEY_Q) {
        this.set(this.x,this.y,teka.viewer.tapa.Defaults.BLACK);
        return true;
    }

    if (e.key==teka.KEY_MINUS || e.key==teka.KEY_W) {
        this.set(this.x,this.y,teka.viewer.tapa.Defaults.EMPTY);
        return true;
    }

    return false;
};

//////////////////////////////////////////////////////////////////

/** Sets the value of a cell, if the color fits. */
teka.viewer.tapa.TapaViewer.prototype.set = function(x, y, value)
{
    if (this.f[x][y]!=0 && this.c[x][y]!=this.color) {
        return;
    }
    this.f[x][y] = value;
    this.c[x][y] = this.color;
};
