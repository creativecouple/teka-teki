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
teka.viewer.easy_as_abc = {};

/** Some constants. */
teka.viewer.easy_as_abc.Defaults = {
    NONE: 0,
    EMPTY: -1,
    LETTER: -2
};

/** Constructor */
teka.viewer.easy_as_abc.Easy_as_abcViewer = function(data)
{
    teka.viewer.PuzzleViewer.call(this,data);

    this.x = 1;
    this.y = 1;
    this.xm = 0;
    this.ym = 0;
    this.exp = false;
};
teka.extend(teka.viewer.easy_as_abc.Easy_as_abcViewer,teka.viewer.PuzzleViewer);

//////////////////////////////////////////////////////////////////

/** Initialize this viewer width the PSData object provided. */
teka.viewer.easy_as_abc.Easy_as_abcViewer.prototype.initData = function(data)
{
    this.X = parseInt(data.get('size'),10);
    this.MAX = parseInt(data.get('max'),10);
    this.asciiToData(data.get('puzzle'));
    this.asciiToSolution(data.get('solution'));

    this.f = teka.new_array([this.X,this.X],0);
    this.c = teka.new_array([this.X,this.X],0);
    this.error = teka.new_array([this.X,this.X],false);
};

/** Read puzzle from ascii art. */
teka.viewer.easy_as_abc.Easy_as_abcViewer.prototype.asciiToData = function(ascii)
{
    if (ascii===false) {
        return;
    }

    var grid = this.asciiToArray(ascii);

    this.puzzle = teka.new_array([this.X,this.X],teka.viewer.easy_as_abc.Defaults.NONE);
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.X;j++) {
            if (grid[i+1][j+1]==teka.ord('-')) {
                this.puzzle[i][j] = teka.viewer.easy_as_abc.Defaults.EMPTY;
            } else if (grid[i+1][j+1]>=teka.ord('A')
                       && grid[i+1][j+1]<=teka.ord('A')+this.MAX-1) {
                this.puzzle[i][j] = grid[i+1][j+1]-teka.ord('A')+1;
            }
        }
    }

    this.topdata = teka.new_array([this.X],teka.viewer.easy_as_abc.Defaults.NONE);
    this.bottomdata = teka.new_array([this.X],teka.viewer.easy_as_abc.Defaults.NONE);
    this.leftdata = teka.new_array([this.X],teka.viewer.easy_as_abc.Defaults.NONE);
    this.rightdata = teka.new_array([this.X],teka.viewer.easy_as_abc.Defaults.NONE);
    for (var i=0;i<this.X;i++) {
        if (grid[i+1][0]>=teka.ord('A')
            && grid[i+1][0]<=teka.ord('A')+this.MAX-1) {
            this.topdata[i] = grid[i+1][0]-teka.ord('A')+1;
        }
        if (grid[i+1][this.X+1]>=teka.ord('A')
            && grid[i+1][this.X+1]<=teka.ord('A')+this.MAX-1) {
            this.bottomdata[i] = grid[i+1][this.X+1]-teka.ord('A')+1;
        }
        if (grid[0][i+1]>=teka.ord('A')
            && grid[0][i+1]<=teka.ord('A')+this.MAX-1) {
            this.leftdata[i] = grid[0][i+1]-teka.ord('A')+1;
        }
        if (grid[this.X+1][i+1]>=teka.ord('A')
            && grid[this.X+1][i+1]<=teka.ord('A')+this.MAX-1) {
            this.rightdata[i] = grid[this.X+1][i+1]-teka.ord('A')+1;
        }
    }
};

/** Read solution from ascii art. */
teka.viewer.easy_as_abc.Easy_as_abcViewer.prototype.asciiToSolution = function(ascii)
{
    if (ascii===false) {
        return;
    }

    var grid = this.asciiToArray(ascii);

    this.solution = teka.new_array([this.X,this.X],teka.viewer.easy_as_abc.Defaults.NONE);
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.X;j++) {
            if (grid[i][j]==teka.ord('-')) {
                this.solution[i][j] = teka.viewer.easy_as_abc.Defaults.EMPTY;
            } else if (grid[i][j]>=teka.ord('A')
                       && grid[i][j]<=teka.ord('A')+this.MAX-1) {
                this.solution[i][j] = grid[i][j]-teka.ord('A')+1;
            }
        }
    }
};

/** Add solution. */
teka.viewer.easy_as_abc.Easy_as_abcViewer.prototype.addSolution = function()
{
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.X;j++) {
            this.f[i][j] = this.solution[i][j];
        }
    }
};

//////////////////////////////////////////////////////////////////

/** Returns a small example. */
teka.viewer.easy_as_abc.Easy_as_abcViewer.prototype.getExample = function()
{
    return '/format 1\n/type (easy_as_abc)\n/sol false\n/size 5\n/max 3'
        +'\n/puzzle [ (   A A ) (C      ) (C     A) (      A) (       ) (B      ) (   B   ) ]'
        +'\n/solution [ (CBA  ) (  CBA) ( CBA ) (A  CB) (BA  C) ]';
};

/** Returns a list of automatically generated properties. */
teka.viewer.easy_as_abc.Easy_as_abcViewer.prototype.getProperties = function()
{
    return [teka.translate('generic_size',[this.X+'x'+this.X]),
            teka.translate('easy_as_abc_letters',[teka.chr(teka.ord('A')+this.MAX-1)])];
};

//////////////////////////////////////////////////////////////////

/** Reset the whole diagram. */
teka.viewer.easy_as_abc.Easy_as_abcViewer.prototype.reset = function()
{
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.X;j++) {
            this.f[i][j] = teka.viewer.easy_as_abc.Defaults.NONE;
            this.c[i][j] = 0;
        }
    }
};

/** Reset the error marks. */
teka.viewer.easy_as_abc.Easy_as_abcViewer.prototype.clearError = function()
{
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.X;j++) {
            this.error[i][j] = false;
        }
    }
};

/** Copy digits colored with this.color to color. */
teka.viewer.easy_as_abc.Easy_as_abcViewer.prototype.copyColor = function(color)
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
teka.viewer.easy_as_abc.Easy_as_abcViewer.prototype.clearColor = function(color)
{
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.X;j++) {
            if (this.c[i][j]==color) {
                this.f[i][j] = teka.viewer.easy_as_abc.Defaults.NONE;
            }
        }
    }
};

/** Save current state. */
teka.viewer.easy_as_abc.Easy_as_abcViewer.prototype.saveState = function()
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
teka.viewer.easy_as_abc.Easy_as_abcViewer.prototype.loadState = function(state)
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
teka.viewer.easy_as_abc.Easy_as_abcViewer.prototype.check = function()
{
    var X = this.X;

    // copy to check, adding givens, removing expert mode
    var check = teka.new_array([X,X],0);
    for (var i=0;i<X;i++) {
        for (var j=0;j<X;j++) {
            check[i][j] = this.f[i][j];

            if (this.puzzle[i][j]!=teka.viewer.easy_as_abc.Defaults.NONE) {
                check[i][j] = this.puzzle[i][j];
                continue;
            }

            if (this.f[i][j]>=1000) {
                check[i][j] = this.getExpert(this.f[i][j]);
                if (check[i][j]==teka.viewer.easy_as_abc.Defaults.NONE && this.f[i][j]!=1000) {
                    this.error[i][j] = true;
                    return 'easy_as_abc_not_unique';
                }
                continue;
            }

            if (this.f[i][j]==teka.viewer.easy_as_abc.Defaults.LETTER) {
                this.error[i][j] = true;
                return 'easy_as_abc_not_unique';
            }
        }
    }

    // check rows
    for (var j=0;j<X;j++) {
        var da = teka.new_array([this.MAX+1],0);
        for (var i=0;i<X;i++) {
            if (check[i][j]>0 && check[i][j]<=this.MAX) {
                da[check[i][j]]++;
            }
        }

        for (var i=1;i<=this.MAX;i++) {
            if (da[i]>1) {
                for (var k=0;k<X;k++) {
                    if (check[k][j]==i) {
                        this.error[k][j] = true;
                    }
                }
                return 'easy_as_abc_row_duplicate';
            }
            if (da[i]===0) {
                for (var k=0;k<X;k++) {
                    this.error[k][j] = true;
                }
                return {text:'easy_as_abc_row_missing',param:[teka.chr(teka.ord('A')+i-1)]};
            }
        }
    }

    // check columns
    for (var i=0;i<X;i++) {
        var da = teka.new_array([this.MAX+1],0);
        for (var j=0;j<X;j++) {
            if (check[i][j]>0 && check[i][j]<=this.MAX) {
                da[check[i][j]]++;
            }
        }

        for (var j=1;j<=this.MAX;j++) {
            if (da[j]>1) {
                for (var k=0;k<X;k++) {
                    if (check[i][k]==j) {
                        this.error[i][k] = true;
                    }
                }
                return 'easy_as_abc_column_duplicate';
            }
            if (da[j]===0) {
                for (var k=0;k<X;k++) {
                    this.error[i][k] = true;
                }
                return {text:'easy_as_abc_column_missing',param:[teka.chr(teka.ord('A')+j-1)]};
            }
        }
    }

    // check letters at the border
    for (var i=0;i<X;i++) {
        if (this.topdata[i]>0) {
            var first = this.findFirst(check,i,0,0,1);
            if (first.val!=this.topdata[i]) {
                this.error[first.x][first.y] = true;
                return 'easy_as_abc_top_wrong';
            }
        }
        if (this.bottomdata[i]>0) {
            var first = this.findFirst(check,i,X-1,0,-1);
            if (first.val!=this.bottomdata[i]) {
                this.error[first.x][first.y] = true;
                return 'easy_as_abc_bottom_wrong';
            }
        }
        if (this.leftdata[i]>0) {
            var first = this.findFirst(check,0,i,1,0);
            if (first.val!=this.leftdata[i]) {
                this.error[first.x][first.y] = true;
                return 'easy_as_abc_left_wrong';
            }
        }
        if (this.rightdata[i]>0) {
            var first = this.findFirst(check,X-1,i,-1,0);
            if (first.val!=this.rightdata[i]) {
                this.error[first.x][first.y] = true;
                return 'easy_as_abc_right_wrong';
            }
        }
    }

    return true;
};

/** Checks, if the first letter in the row or column is the one at the edge. */
teka.viewer.easy_as_abc.Easy_as_abcViewer.prototype.findFirst = function(check, x, y, dx, dy)
{
    while (check[x][y]<=0) {
        x+=dx;
        y+=dy;
    }
    return {val:check[x][y],x:x,y:y};
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
teka.viewer.easy_as_abc.Easy_as_abcViewer.prototype.setMetrics = function(g)
{
    this.scale = Math.floor(Math.min((this.width-1)/(this.X+2),
                                     (this.height-1-(this.textHeight+2))/(this.X+2)));
    var realwidth = (this.X+2)*this.scale+1;
    var realheight = (this.X+2)*this.scale+1+this.textHeight+2;

    this.bottomText = teka.translate('easy_as_abc_letters',[teka.chr(teka.ord('A')+this.MAX-1)]);
    g.font = 'bold '+this.textHeight+'px sans-serif';
    var textwidth = g.measureText(this.bottomText).width+1;
    realwidth = Math.max(realwidth,textwidth+this.scale);

    this.deltaX = Math.floor((this.width-realwidth)/2)+0.5;
    this.deltaY = Math.floor((this.height-realheight)/2)+0.5;
    this.borderX = this.scale;
    this.borderY = this.scale;

    this.font = teka.getFontData(Math.round(this.scale/2)+'px sans-serif',this.scale);
    this.smallfont = teka.getFontData(Math.round((this.scale-6)/(this.MAX>3?3:2))+'px sans-serif',this.scale);

    if (realwidth>this.width || realheight>this.height) {
        this.scale=false;
    }
    return {width:realwidth,height:realheight,scale:this.scale};
};

/** Paints the diagram. */
teka.viewer.easy_as_abc.Easy_as_abcViewer.prototype.paint = function(g)
{
    var X = this.X;
    var S = this.scale;

    g.save();
    g.translate(this.deltaX,this.deltaY);

    g.fillStyle = '#fff';
    g.fillRect(S,S,X*S,X*S);

    // paint background
    for (var i=0;i<X;i++) {
        for (var j=0;j<X;j++) {
            g.fillStyle = this.isBlinking()?
                this.getBlinkColor(i,j,X,this.f[i][j]):
                (this.error[i][j]?'#f00':'#fff');
            g.fillRect((i+1)*S,(j+1)*S,S,S);
        }
    }

    // paint grid
    g.strokeStyle = '#000';
    for (var i=1;i<=X+1;i++) {
        teka.drawLine(g,i*S,S,i*S,(X+1)*S);
    }
    for (var j=1;j<=X+1;j++) {
        teka.drawLine(g,S,j*S,(X+1)*S,j*S);
    }

    g.lineWidth = 3;
    g.strokeRect(S,S,X*S,X*S);
    g.lineWidth = 1;

    // paint borders
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillStyle = '#000';
    g.font = this.font.font;
    for (var i=0;i<X;i++) {
        if (this.topdata[i]!==teka.viewer.easy_as_abc.Defaults.NONE) {
            g.fillText(teka.chr(teka.ord('A')+this.topdata[i]-1),
                       (i+1)*S+S/2,S/2+this.font.delta);
        }
        if (this.bottomdata[i]!==teka.viewer.easy_as_abc.Defaults.NONE) {
            g.fillText(teka.chr(teka.ord('A')+this.bottomdata[i]-1),
                       (i+1)*S+S/2,(this.X+1)*S+S/2+this.font.delta);
        }
        if (this.leftdata[i]!==teka.viewer.easy_as_abc.Defaults.NONE) {
            g.fillText(teka.chr(teka.ord('A')+this.leftdata[i]-1),
                       S/2,(i+1)*S+S/2+this.font.delta);
        }
        if (this.rightdata[i]!==teka.viewer.easy_as_abc.Defaults.NONE) {
            g.fillText(teka.chr(teka.ord('A')+this.rightdata[i]-1),
                       (X+1)*S+S/2,(i+1)*S+S/2+this.font.delta);
        }
    }

    // paint content of the cells
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    for (var i=0;i<X;i++) {
        for (var j=0;j<X;j++) {
            if (this.puzzle[i][j]!=teka.viewer.easy_as_abc.Defaults.NONE) {
                g.fillStyle = '#000';
                if (this.puzzle[i][j]==teka.viewer.easy_as_abc.Defaults.EMPTY) {
                    g.lineWidth = 2;
                    teka.drawLine(g,S*(i+1)+S/3,S*(j+1)+Math.floor(S/2)+0.5,
                                  S*(i+1)+2*S/3,S*(j+1)+Math.floor(S/2)+0.5);
                    g.lineWidth = 1;
                } else {
                    g.font = this.font.font;
                    g.fillText(teka.chr(teka.ord('A')+this.puzzle[i][j]-1),
                               (i+1)*S+S/2,(j+1)*S+S/2+this.font.delta);
                }
                continue;
            }

            if (this.f[i][j]==teka.viewer.easy_as_abc.Defaults.EMPTY) {
                g.strokeStyle = this.getColorString(this.c[i][j]);
                g.lineWidth = 2;
                teka.drawLine(g,S*(i+1)+S/3,S*(j+1)+Math.floor(S/2)+0.5,
                              S*(i+1)+2*S/3,S*(j+1)+Math.floor(S/2)+0.5);
                g.lineWidth = 1;
                continue;
            }

            if (this.f[i][j]>0 && this.f[i][j]<=this.MAX) {
                g.fillStyle = this.getColorString(this.c[i][j]);
                g.font = this.font.font;
                g.fillText(teka.chr(teka.ord('A')+this.f[i][j]-1),
                           (i+1)*S+S/2,(j+1)*S+S/2+this.font.delta);
                continue;
            }

            if (this.f[i][j]==teka.viewer.easy_as_abc.Defaults.LETTER) {
                g.strokeStyle = this.getColorString(this.c[i][j]);
                teka.strokeOval(g,(i+1)*S+S/2,(j+1)*S+S/2,S/2);
                continue;
            }

            if (this.f[i][j]>=1000 && this.MAX<=3) {
                g.fillStyle = this.getColorString(this.c[i][j]);
                for (var k=0;k<=4;k++) {
                    if (((this.f[i][j]-1000)&(1<<k))!=0) {
                        g.font = this.smallfont.font;
                        g.fillText(k===0?'-':teka.chr(k+teka.ord('A')-1),
                                   S*(i+1)+(k%2)*(S/2)+S/4,
                                   S*(j+1)+Math.floor(k/2)*(S/2)+S/4+this.smallfont.delta);
                    }
                }
                g.strokeStyle = '#888';
                teka.drawLine(g,S*(i+1)+3,S*(j+1)+S/2,S*(i+1)+S-3,S*(j+1)+S/2);
                teka.drawLine(g,S*(i+1)+S/2,S*(j+1)+3,S*(i+1)+S/2,S*(j+1)+S-3);
                teka.drawLine(g,
                              (i+2)*S-S/8-2,(j+2)*S-S/8-2,
                              (i+2)*S-2,(j+2)*S-2);
                teka.drawLine(g,
                              (i+2)*S-S/8-2,(j+2)*S-2,
                              (i+2)*S-2,(j+2)*S-S/8-2);
                continue;
            }

            if (this.f[i][j]>=1000) {
                g.fillStyle = this.getColorString(this.c[i][j]);
                for (var k=0;k<=8;k++) {
                    if (((this.f[i][j]-1000)&(1<<k))!=0) {
                        g.font = this.smallfont.font;
                        g.fillText(k===0?'-':teka.chr(k+teka.ord('A')-1),
                                   S*(i+1)+(k%3)*(S/3)+S/6,
                                   S*(j+1)+Math.floor(k/3)*(S/3)+S/6+this.smallfont.delta);
                    }
                }
                g.fillStyle = '#888';
                teka.drawLine(g,S*(i+1)+3,S*(j+1)+S/3,S*(i+1)+S-3,S*(j+1)+S/3);
                teka.drawLine(g,S*(i+1)+3,S*(j+1)+2*S/3,S*(i+1)+S-3,S*(j+1)+2*S/3);
                teka.drawLine(g,S*(i+1)+S/3,S*(j+1)+3,S*(i+1)+S/3,S*(j+1)+S-3);
                teka.drawLine(g,S*(i+1)+2*S/3,S*(j+1)+3,S*(i+1)+2*S/3,S*(j+1)+S-3);
                teka.drawLine(g,
                              (i+2)*S-S/8-2,(j+2)*S-S/8-2,
                              (i+2)*S-2,(j+2)*S-2);
                teka.drawLine(g,
                              (i+2)*S-S/8-2,(j+2)*S-2,
                              (i+2)*S-2,(j+2)*S-S/8-2);
            }
        }
    }

    // paint text below the grid
    g.textAlign = 'left';
    g.textBaseline = 'top';
    g.fillStyle = this.textcolor;
    g.font = 'bold '+this.textHeight+'px sans-serif';
    g.fillText(this.bottomText,S,(X+2)*S+4);

    // paint cursor
    if (this.mode==teka.viewer.Defaults.NORMAL) {
        g.strokeStyle='#f00';
        if (this.exp) {
            teka.drawLine(g,
                          (this.x+2)*S-S/8-2,(this.y+2)*S-S/8-2,
                          (this.x+2)*S-2,(this.y+2)*S-2);
            teka.drawLine(g,
                          (this.x+2)*S-S/8-2,(this.y+2)*S-2,
                          (this.x+2)*S-2,(this.y+2)*S-S/8-2);
        } else {
            g.lineWidth = 2;
            g.strokeRect(S*(this.x+1)+3.5,S*(this.y+1)+3.5,S-7,S-7);
        }
    }

    g.restore();
};

//////////////////////////////////////////////////////////////////

/** Handles mousemove event. */
teka.viewer.easy_as_abc.Easy_as_abcViewer.prototype.processMousemoveEvent = function(xc, yc, pressed)
{
    xc -= this.deltaX+this.borderX;
    yc -= this.deltaY+this.borderY;

    var oldx = this.x;
    var oldy = this.y;

    this.x = Math.floor(xc/this.scale);
    this.y = Math.floor(yc/this.scale);

    this.xm = xc-this.scale*this.x;
    this.ym = yc-this.scale*this.y;

    if (this.x<1) {
        this.x=0;
    }
    if (this.y<1) {
        this.y=0;
    }
    if (this.x>=this.X) {
        this.x=this.X-1;
    }
    if (this.y>=this.X) {
        this.y=this.X-1;
    }

    var oldexp = this.exp;
    this.exp = this.xm>this.scale-this.scale/8 && this.ym>this.scale-this.scale/8;

    return this.x!=oldx || this.y!=oldy || this.exp!=oldexp;
};

/** Handles mousedown event. */
teka.viewer.easy_as_abc.Easy_as_abcViewer.prototype.processMousedownEvent = function(xc, yc)
{
    var erg = this.processMousemoveEvent(xc,yc,false);

    if (this.x<0 || this.y<0 || this.x>=this.X || this.y>=this.X) {
        return erg;
    }

    if (this.xm>this.scale-this.scale/8 && this.ym>this.scale-this.scale/8) {
        if (this.f[this.x][this.y]<1000) {
            this.set(this.x,this.y,this.setExpert(this.f[this.x][this.y]));
        } else {
            this.set(this.x,this.y,this.getExpert(this.f[this.x][this.y]));
        }
        return true;
    }

    if (this.f[this.x][this.y]>=1000) {
        if (this.MAX<=3) {
            var nr = ((this.xm<this.scale/2)?0:1)+2*((this.ym<this.scale/2)?0:1);
            if (nr>this.MAX) {
                return erg;
            }
            this.set(this.x,this.y,((this.f[this.x][this.y]-1000)^(1<<nr))+1000);
            return true;
        } else {
            var nr = ((this.xm<3*this.scale/8)?0:(this.xm>this.scale-3*this.scale/8)?2:1)+
            3*((this.ym<3*this.scale/8)?0:(this.ym>this.scale-3*this.scale/8)?2:1);
            if (nr>this.MAX) {
                return erg;
            }
            this.set(this.x,this.y,((this.f[this.x][this.y]-1000)^(1<<nr))+1000);
            return true;
        }
    }

    if (this.f[this.x][this.y]==teka.viewer.easy_as_abc.Defaults.NONE) {
        this.set(this.x,this.y,1);
    } else if (this.f[this.x][this.y]==this.MAX) {
        this.set(this.x,this.y,teka.viewer.easy_as_abc.Defaults.EMPTY);
    } else if (this.f[this.x][this.y]==teka.viewer.easy_as_abc.Defaults.EMPTY) {
        this.set(this.x,this.y,teka.viewer.easy_as_abc.Defaults.LETTER);
    } else if (this.f[this.x][this.y]==teka.viewer.easy_as_abc.Defaults.LETTER) {
        this.set(this.x,this.y,teka.viewer.easy_as_abc.Defaults.NONE);
    } else {
        this.set(this.x,this.y,this.f[this.x][this.y]+1);
    }

    return true;
};

/** Handles keydown event. */
teka.viewer.easy_as_abc.Easy_as_abcViewer.prototype.processKeydownEvent = function(e)
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
        this.set(this.x,this.y,teka.viewer.easy_as_abc.Defaults.NONE);
        return true;
    }

    if (e.key==teka.KEY_MINUS) {
        if (this.f[this.x][this.y]>=1000) {
            this.set(this.x,this.y,((this.f[this.x][this.y]-1000)^(1<<0))+1000);
        } else {
            this.set(this.x,this.y,teka.viewer.easy_as_abc.Defaults.EMPTY);
        }
        return true;
    }

    if (e.key==teka.KEY_DOT) {
        this.set(this.x,this.y,teka.viewer.easy_as_abc.Defaults.LETTER);
        return true;
    }

    if (e.key>=teka.KEY_A && e.key<=teka.KEY_Z) {
        var val = e.key-teka.KEY_A+1;

        if (val>this.MAX) {
            return false;
        }

        if (this.f[this.x][this.y]<1000) {
            if (this.f[this.x][this.y]>0 &&
                this.f[this.x][this.y]*10+val<=this.MAX) {
                this.set(this.x,this.y,this.f[this.x][this.y]*10+val);
            } else {
                this.set(this.x,this.y,val);
            }
        } else {
            this.set(this.x,this.y,((this.f[this.x][this.y]-1000)^(1<<val))+1000);
        }
        return true;
    }

    if (e.key==teka.KEY_HASH || e.key==teka.KEY_COMMA) {
        if (this.MAX<=9) {
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
teka.viewer.easy_as_abc.Easy_as_abcViewer.prototype.set = function(x, y, value)
{
    if (this.f[x][y]!=teka.viewer.easy_as_abc.Defaults.NONE
        && this.f[x][y]!=1000
        && this.c[x][y]!=this.color) {
        return;
    }

    this.f[x][y] = value;
    this.c[x][y] = this.color;
};

/** Converts from normal mode to expert mode. */
teka.viewer.easy_as_abc.Easy_as_abcViewer.prototype.setExpert = function(h)
{
    if (h==teka.viewer.easy_as_abc.Defaults.NONE) {
        return 1000;
    }

    if (h==teka.viewer.easy_as_abc.Defaults.EMPTY) {
        return 1001;
    }

    if (h==teka.viewer.easy_as_abc.Defaults.LETTER) {
        return 1000+(1<<(this.MAX+1))-2;
    }

    return 1000+(1<<h);
};

/** Converts back from expert mode to normal mode. */
teka.viewer.easy_as_abc.Easy_as_abcViewer.prototype.getExpert = function(h)
{
    if (h<1000) {
        return h;
    }
    if (h==1001) {
        return teka.viewer.easy_as_abc.Defaults.EMPTY;
    }

    var min = 10;
    var max = 0;
    h -= 1000;

    for (var i=0;i<=9;i++) {
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

    if (min==1 && max==this.MAX) {
        return teka.viewer.easy_as_abc.Defaults.LETTER;
    }

    return teka.viewer.easy_as_abc.Defaults.NONE;
};
