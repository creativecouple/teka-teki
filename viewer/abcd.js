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
teka.viewer.abcd = {};

/** Some constants. */
teka.viewer.abcd.Defaults = {
    NONE: -1
};

/** Constructor */
teka.viewer.abcd.AbcdViewer = function(data)
{
    teka.viewer.PuzzleViewer.call(this,data);

    this.x = 0;
    this.y = 0;
    this.xm = 0;
    this.ym = 0;
    this.exp = false;
};
teka.extend(teka.viewer.abcd.AbcdViewer,teka.viewer.PuzzleViewer);

//////////////////////////////////////////////////////////////////

/** Initialize this viewer width the PSData object provided. */
teka.viewer.abcd.AbcdViewer.prototype.initData = function(data)
{
    this.X = parseInt(data.get('X'),10);
    this.Y = parseInt(data.get('Y'),10);
    this.MAX = parseInt(data.get('max'),10);
    var digits = data.get('digits');
    digits = digits===false?1:parseInt(data.get('digits'),10);
    this.asciiToData(data.get('puzzle'),digits);
    this.asciiToSolution(data.get('solution'));

    this.f = teka.new_array([this.X,this.Y],0);
    this.top_f = teka.new_array([this.X,this.MAX],false);
    this.left_f = teka.new_array([this.MAX,this.Y],false);
    this.c = teka.new_array([this.X,this.Y],0);
    this.top_c = teka.new_array([this.X,this.MAX],0);
    this.left_c = teka.new_array([this.MAX,this.Y],0);
    this.error = teka.new_array([this.X,this.Y],false);
    this.top_error = teka.new_array([this.X,this.MAX],false);
    this.left_error = teka.new_array([this.MAX,this.Y],false);
};

/** Read puzzle from ascii art. */
teka.viewer.abcd.AbcdViewer.prototype.asciiToData = function(ascii,d)
{
    if (ascii===false) {
        return;
    }

    var grid = this.asciiToArray(ascii);

    this.puzzle = teka.new_array([this.X,this.Y],teka.viewer.abcd.Defaults.NONE);
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            this.puzzle[i][j] = grid[d*this.MAX+1+i][d*this.MAX+1+j]==teka.ord(' ')
                ?0:(grid[d*this.MAX+1+i][d*this.MAX+1+j]-teka.ord('A')+1);
        }
    }

    this.topdata = teka.new_array([this.X,this.MAX],teka.viewer.abcd.Defaults.NONE);
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.MAX;j++) {
            var h = this.getVNr(grid,d*this.MAX+1+i,d*j,d);
            if (h!==false) {
                this.topdata[i][j] = h;
            }
        }
    }

    this.leftdata = teka.new_array([this.MAX,this.Y],teka.viewer.abcd.Defaults.NONE);
    for (var i=0;i<this.MAX;i++) {
        for (var j=0;j<this.Y;j++) {
            var h = this.getNr(grid,d*i,d*this.MAX+1+j,d);
            if (h!==false) {
                this.leftdata[i][j] = h;
            }
        }
    }
};

/** Read solution from ascii art. */
teka.viewer.abcd.AbcdViewer.prototype.asciiToSolution = function(ascii)
{
    if (ascii===false) {
        return;
    }

    var grid = this.asciiToArray(ascii);

    this.solution = teka.new_array([this.X,this.Y],0);
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            this.solution[i][j] = grid[i][j]-'A'+1;
        }
    }
};

/** Add solution. */
teka.viewer.abcd.AbcdViewer.prototype.addSolution = function()
{
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            this.f[i][j] = this.solution[i][j];
        }
    }
};

//////////////////////////////////////////////////////////////////

/** Returns a small example. */
teka.viewer.abcd.AbcdViewer.prototype.getExample = function()
{
    return '/format 1\n/type (abcd)\n/sol false\n/X 3\n/Y 3\n/max 4\n'
        +'/puzzle [ (        ) (        ) (     1 1) (      0 )'
        +'(    +---) (00  |   ) (2   | C ) (    |   ) ]\n'
        +'/solution [ (ABA) (DCD) (BDB) ]';
};

/** Returns a list of automatically generated properties. */
teka.viewer.abcd.AbcdViewer.prototype.getProperties = function()
{
    return [teka.translate('generic_size',[this.X+'x'+this.Y]),
            teka.translate('abcd_letters',[teka.chr(teka.ord('A')+this.MAX-1)])];
};

//////////////////////////////////////////////////////////////////

/** Reset the whole diagram. */
teka.viewer.abcd.AbcdViewer.prototype.reset = function()
{
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            this.f[i][j] = 0;
            this.c[i][j] = 0;
        }
    }
    for (var i=0;i<this.MAX;i++) {
        for (var j=0;j<this.Y;j++) {
            this.left_f[i][j] = false;
            this.left_c[i][j] = 0;
        }
    }
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.MAX;j++) {
            this.top_f[i][j] = false;
            this.top_c[i][j] = 0;
        }
    }
};

/** Reset the error marks. */
teka.viewer.abcd.AbcdViewer.prototype.clearError = function()
{
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            this.error[i][j] = false;
        }
    }
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.MAX;j++) {
            this.top_error[i][j] = false;
        }
    }
    for (var i=0;i<this.MAX;i++) {
        for (var j=0;j<this.Y;j++) {
            this.left_error[i][j] = false;
        }
    }
};

/** Copy digits colored with this.color to color. */
teka.viewer.abcd.AbcdViewer.prototype.copyColor = function(color)
{
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            if (this.c[i][j]==this.color) {
                this.c[i][j] = color;
            }
        }
    }
    for (var i=0;i<this.MAX;i++) {
        for (var j=0;j<this.Y;j++) {
            if (this.left_c[i][j]==this.color) {
                this.left_c[i][j] = color;
            }
        }
    }
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.MAX;j++) {
            if (this.top_c[i][j]==this.color) {
                this.top_c[i][j] = color;
            }
        }
    }
};

/** Delete all digits with color. */
teka.viewer.abcd.AbcdViewer.prototype.clearColor = function(color)
{
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            if (this.c[i][j]==color) {
                this.f[i][j] = 0;
            }
        }
    }
    for (var i=0;i<this.MAX;i++) {
        for (var j=0;j<this.Y;j++) {
            if (this.left_c[i][j]==color) {
                this.left_f[i][j] = false;
            }
        }
    }
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.MAX;j++) {
            if (this.top_c[i][j]==color) {
                this.top_f[i][j] = false;
            }
        }
    }
};

/** Save current state. */
teka.viewer.abcd.AbcdViewer.prototype.saveState = function()
{
    var f = teka.new_array([this.X,this.Y],0);
    var c = teka.new_array([this.X,this.Y],0);
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            f[i][j] = this.f[i][j];
            c[i][j] = this.c[i][j];
        }
    }

    var left_f = teka.new_array([this.MAX,this.Y],0);
    var left_c = teka.new_array([this.MAX,this.Y],0);
    for (var i=0;i<this.MAX;i++) {
        for (var j=0;j<this.Y;j++) {
            left_f[i][j] = this.left_f[i][j];
            left_c[i][j] = this.left_c[i][j];
        }
    }

    var top_f = teka.new_array([this.X,this.MAX],0);
    var top_c = teka.new_array([this.X,this.MAX],0);
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.MAX;j++) {
            top_c[i][j] = this.top_c[i][j];
            top_f[i][j] = this.top_f[i][j];
        }
    }

    return { f:f, c:c, left_f:left_f, left_c:left_c, top_f:top_f, top_c:top_c };
};

/** Load state. */
teka.viewer.abcd.AbcdViewer.prototype.loadState = function(state)
{
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            this.f[i][j] = state.f[i][j];
            this.c[i][j] = state.c[i][j];
        }
    }

    for (var i=0;i<this.MAX;i++) {
        for (var j=0;j<this.Y;j++) {
            this.left_f[i][j] = state.left_f[i][j];
            this.left_c[i][j] = state.left_c[i][j];
        }
    }

    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.MAX;j++) {
            this.top_c[i][j] = state.top_c[i][j];
            this.top_f[i][j] = state.top_f[i][j];
        }
    }
};

//////////////////////////////////////////////////////////////////

/** Check, if the solution is correct. */
teka.viewer.abcd.AbcdViewer.prototype.check = function()
{
    var X = this.X;
    var Y = this.Y;

    var check = teka.new_array([X,Y],0);
    for (var i=0;i<X;i++) {
        for (var j=0;j<Y;j++) {
            check[i][j] = this.f[i][j];

            if (this.puzzle[i][j]!==0) {
                check[i][j] = this.puzzle[i][j];
                continue;
            }

            if (this.f[i][j]>=1000) {
                check[i][j] = this.getExpert(this.f[i][j]);
                if (check[i][j]===0 && this.f[i][j]!=1000) {
                    this.error[i][j] = true;
                    return 'abcd_not_unique';
                }
                continue;
            }
        }
    }

    for (var i=0;i<X;i++) {
        for (var j=0;j<Y;j++) {
            if (check[i][j]===0) {
                this.error[i][j] = true;
                return 'abcd_empty';
            }
        }
    }

    for (var i=0;i<X-1;i++) {
        for (var j=0;j<Y;j++) {
            if (check[i][j]==check[i+1][j]) {
                this.error[i][j] = this.error[i+1][j] = true;
                return 'abcd_same_letters';
            }
        }
    }

    for (var i=0;i<X;i++) {
        for (var j=0;j<Y-1;j++) {
            if (check[i][j]==check[i][j+1]) {
                this.error[i][j] = this.error[i][j+1] = true;
                return 'abcd_same_letters';
            }
        }
    }

    for (var j=0;j<Y;j++) {
        var az = teka.new_array([this.MAX],0);
        for (var i=0;i<X;i++) {
            az[check[i][j]-1]++;
        }
        for (var i=0;i<this.MAX;i++) {
            if (this.leftdata[this.MAX-i-1][j]!=-1 && this.leftdata[this.MAX-i-1][j]!=az[i]) {
                this.left_error[this.MAX-i-1][j] = true;
                for (var ii=0;ii<X;ii++) {
                    if (check[ii][j]==i+1) {
                        this.error[ii][j] = true;
                    }
                }
                return 'abcd_wrong_letters_row';
            }
        }
    }

    for (var i=0;i<X;i++) {
        var az = teka.new_array([this.MAX],0);
        for (var j=0;j<Y;j++) {
            az[check[i][j]-1]++;
        }
        for (var j=0;j<this.MAX;j++) {
            if (this.topdata[i][this.MAX-j-1]!=-1 && this.topdata[i][this.MAX-j-1]!=az[j]) {
                this.top_error[i][this.MAX-j-1] = true;
                for (var jj=0;jj<Y;jj++) {
                    if (check[i][jj]==j+1) {
                        this.error[i][jj] = true;
                    }
                }
                return 'abcd_wrong_letters_column';
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
teka.viewer.abcd.AbcdViewer.prototype.setMetrics = function(g)
{
    this.scale = Math.floor(Math.min((this.width-3)/(this.X+this.MAX),
                                     (this.height-3-(this.textHeight+2))/(this.Y+this.MAX)));
    var realwidth = (this.X+this.MAX)*this.scale+3;
    var realheight = (this.Y+this.MAX)*this.scale+3+this.textHeight+2;

    this.deltaX = Math.floor((this.width-realwidth)/2)+0.5;
    this.deltaY = Math.floor((this.height-realheight)/2)+0.5;
    this.borderX = 1;
    this.borderY = 1;

    this.font = teka.getFontData(Math.round(this.scale/2)+'px sans-serif',this.scale);
    this.mediumfont = teka.getFontData(Math.round(this.scale/3)+'px sans-serif',this.scale);
    this.smallfont = teka.getFontData(Math.round((this.scale-6)/4)+'px sans-serif',this.scale);

    if (realwidth>this.width || realheight>this.height) {
        this.scale=false;
    }
    return {width:realwidth,height:realheight,scale:this.scale};
};

/** Paints the diagram. */
teka.viewer.abcd.AbcdViewer.prototype.paint = function(g)
{
    var X = this.X;
    var Y = this.Y;
    var S = this.scale;
    var L = this.MAX;

    g.save();
    g.translate(this.deltaX+this.borderX,this.deltaY+this.borderY);

    g.fillStyle = '#fff';
    g.fillRect(L*S,0,X*S,(L+Y)*S);
    g.fillRect(0,L*S,(L+X)*S,Y*S);

    // paint background of cells
    for (var i=0;i<X;i++) {
        for (var j=0;j<Y;j++) {
            g.fillStyle = this.isBlinking()?
                this.getBlinkColor(i,j,X,this.f[i][j]):
                (this.error[i][j]?'#f00':'#fff');
            g.fillRect((i+L)*S,(j+L)*S,S,S);
        }
    }

    // paint background of top
    g.fillStyle = '#f00';
    for (var i=0;i<X;i++) {
        for (var j=0;j<L;j++) {
            if (this.top_error[i][j]) {
                g.fillRect((L+i)*S,j*S,S,S);
            }
        }
    }

    // paint background of left
    for (var i=0;i<L;i++) {
        for (var j=0;j<Y;j++) {
            if (this.left_error[i][j]) {
                g.fillRect(i*S,(L+j)*S,S,S);
            }
        }
    }

    // paint grid
    g.strokeStyle = '#000';
    for (var i=0;i<=X;i++) {
        teka.drawLine(g,(i+L)*S,0,(i+L)*S,(Y+L)*S);
    }
    for (var i=0;i<=L;i++) {
        teka.drawLine(g,i*S,L*S,i*S,(L+Y)*S);
    }
    for (var j=0;j<=Y;j++) {
        teka.drawLine(g,0,(L+j)*S,(X+L)*S,(L+j)*S);
    }
    for (var j=0;j<=L;j++) {
        teka.drawLine(g,L*S,j*S,(L+X)*S,j*S);
    }

    g.lineWidth = 3;
    g.strokeRect(0,S*L,S*(L+X),S*Y);
    g.strokeRect(S*L,0,S*X,S*(L+Y));
    g.lineWidth = 1;

    // paint letters in the top left
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillStyle = '#000';
    g.font = this.font.font;
    g.fillText('A',(L-1)*S+S/2,(L-1)*S+S/2+this.font.delta);
    for (var i=1;i<L;i++) {
        g.fillText(teka.chr(teka.ord('A')+i),(L-i-1)*S+S/2,(L-1)*S+S/2+this.font.delta);
        g.fillText(teka.chr(teka.ord('A')+i),(L-1)*S+S/2,(L-i-1)*S+S/2+this.font.delta);
    }

    // paint top
    for (var i=0;i<X;i++) {
        for (var j=0;j<L;j++) {
            if (this.topdata[i][j]!=-1) {
                g.fillStyle = '#000';
                g.fillText(this.topdata[i][j],(L+i)*S+S/2,j*S+S/2+this.font.delta);
            }
            if (this.top_f[i][j]) {
                g.strokeStyle = this.getColorString(this.top_c[i][j]);
                teka.drawLine(g,(i+L)*S+S/4,j*S+S/4,(i+1+L)*S-S/4,(j+1)*S-S/4);
                teka.drawLine(g,(i+1+L)*S-S/4,j*S+S/4,(i+L)*S+S/4,(j+1)*S-S/4);
            }
        }
    }

    // paint left
    for (var i=0;i<L;i++) {
        for (var j=0;j<Y;j++) {
            if (this.leftdata[i][j]!=-1) {
                g.fillStyle = '#000';
                g.fillText(this.leftdata[i][j],i*S+S/2,(j+L)*S+S/2+this.font.delta);
            }
            if (this.left_f[i][j]) {
                g.strokeStyle = this.getColorString(this.left_c[i][j]);
                teka.drawLine(g,(i)*S+S/4,(j+L)*S+S/4,(i+1)*S-S/4,(j+L+1)*S-S/4);
                teka.drawLine(g,(i+1)*S-S/4,(j+L)*S+S/4,(i)*S+S/4,(j+L+1)*S-S/4);
            }
        }
    }

    // paint center
    for (var i=0;i<X;i++) {
        for (var j=0;j<Y;j++) {
            if (this.puzzle[i][j]>0) {
                g.fillStyle = '#000';
                g.font = this.font.font;
                g.fillText(teka.chr(teka.ord('A')+this.puzzle[i][j]-1),
                           (L+i)*S+S/2,(j+L)*S+S/2+this.font.delta);
                continue;
            }

            if (this.f[i][j]>0 && this.f[i][j]<1000) {
                g.fillStyle = this.getColorString(this.c[i][j]);
                g.font = this.font.font;
                g.fillText(teka.chr(teka.ord('A')+this.f[i][j]-1),
                           (i+L)*S+S/2,(j+L)*S+S/2+this.font.delta);
                continue;
            }

            if (this.f[i][j]>=1000 && L<=4) {
                g.fillStyle = this.getColorString(this.c[i][j]);
                g.font = this.mediumfont.font;
                for (var k=0;k<4;k++) {
                    if (((this.f[i][j]-1000)&(1<<(k+1)))!=0) {
                        g.fillText(teka.chr(teka.ord('A')+k),
                                   S*(i+L)+k%2*S/2+S/4,S*(j+L)+Math.floor(k/2)*S/2+S/4+this.mediumfont.delta);
                    }
                }
                g.fillStyle = '#888';
                teka.drawLine(g,S*(i+L)+3,S*(j+L)+S/2,S*(i+L)+S-3,S*(j+L)+S/2);
                teka.drawLine(g,S*(i+L)+S/2,S*(j+L)+3,S*(i+L)+S/2,S*(j+L)+S-3);
                teka.drawLine(g,(L+i+1)*S-S/8-2,(L+j+1)*S-S/8-2,(L+i+1)*S-2,(L+j+1)*S-2);
                teka.drawLine(g,(L+i+1)*S-S/8-2,(L+j+1)*S-2,(L+i+1)*S-2,(L+j+1)*S-S/8-2);
                continue;
            }

            if (this.f[i][j]>=1000) {
                g.fillStyle = this.getColorString(this.c[i][j]);
                g.font = this.smallfont.font;
                for (var k=0;k<9;k++) {
                    if (((this.f[i][j]-1000)&(1<<(k+1)))!=0) {
                        g.fillText(teka.chr(teka.ord('A')+k),
                                   S*(i+L)+k%3*S/3+S/6,S*(j+L)+Math.floor(k/3)*S/3+S/6+this.smallfont.delta);
                    }
                }
                g.fillStyle = '#888';
                teka.drawLine(g,S*(i+L)+3,S*(j+L)+S/3,S*(i+L)+S-3,S*(j+L)+S/3);
                teka.drawLine(g,S*(i+L)+3,S*(j+L)+2*S/3,S*(i+L)+S-3,S*(j+L)+2*S/3);
                teka.drawLine(g,S*(i+L)+S/3,S*(j+L)+3,S*(i+L)+S/3,S*(j+L)+S-3);
                teka.drawLine(g,S*(i+L)+2*S/3,S*(j+L)+3,S*(i+L)+2*S/3,S*(j+L)+S-3);
                teka.drawLine(g,(L+i+1)*S-S/8-2,(L+j+1)*S-S/8-2,(L+i+1)*S-2,(L+j+1)*S-2);
                teka.drawLine(g,(L+i+1)*S-S/8-2,(L+j+1)*S-2,(L+i+1)*S-2,(L+j+1)*S-S/8-2);
            }
        }
    }

    // paint cursor
    if (this.mode==teka.viewer.Defaults.NORMAL) {
        g.strokeStyle = '#f00';
        if (this.exp) {
            teka.drawLine(g,(L+this.x+1)*S-S/8-2,(L+this.y+1)*S-S/8-2,(L+this.x+1)*S-2,(L+this.y+1)*S-2);
            teka.drawLine(g,(L+this.x+1)*S-S/8-2,(L+this.y+1)*S-2,(L+this.x+1)*S-2,(L+this.y+1)*S-S/8-2);
        } else {
            g.lineWidth = 2;
            g.strokeRect(S*(this.x+L)+3.5,S*(this.y+L)+3.5,S-7,S-7);
        }
    }

    g.restore();
};

//////////////////////////////////////////////////////////////////

/** Handles mousemove event. */
teka.viewer.abcd.AbcdViewer.prototype.processMousemoveEvent = function(xc, yc, pressed)
{
    xc -= this.deltaX+this.borderX;
    yc -= this.deltaY+this.borderY;

    var oldx = this.x;
    var oldy = this.y;

    this.x = Math.floor(xc/this.scale)-this.MAX;
    this.y = Math.floor(yc/this.scale)-this.MAX;

    this.xm = xc-this.scale*(this.x+this.MAX);
    this.ym = yc-this.scale*(this.y+this.MAX);

    if (this.x<-this.MAX) {
        this.x=-this.MAX;
    }
    if (this.y<-this.MAX) {
        this.y=-this.MAX;
    }
    if (this.x>=this.X) {
        this.x=this.X-1;
    }
    if (this.y>=this.Y) {
        this.y=this.Y-1;
    }
    if (this.x<0 && this.y<0) {
        this.x = oldx; this.y = oldy;
    }

    var oldexp = this.exp;
    this.exp = this.xm>this.scale-this.scale/8 && this.ym>this.scale-this.scale/8;

    return this.x!=oldx || this.y!=oldy || this.exp!=oldexp;
};

/** Handles mousedown event. */
teka.viewer.abcd.AbcdViewer.prototype.processMousedownEvent = function(xc, yc)
{
    var erg = this.processMousemoveEvent(xc,yc);

    if (this.x<0 && this.y>=0 && this.y<this.Y) {
        this.set_left(this.x+this.MAX,this.y,!this.left_f[this.x+this.MAX][this.y]);
        return true;
    }
    if (this.y<0 && this.x>=0 && this.x<this.X) {
        this.set_top(this.x,this.y+this.MAX,!this.top_f[this.x][this.y+this.MAX]);
        return true;
    }
    if (this.x<0 || this.y<0 || this.x>=this.X || this.y>=this.Y) {
        return erg;
    }
    if (this.puzzle[this.x][this.y]>0) {
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
        if (this.MAX<=4) {
            var nr = ((this.xm<this.scale/2)?0:1)+2*((this.ym<this.scale/2)?0:1)+1;
            if (nr<1 || nr>this.MAX) {
                return erg;
            }
            this.set(this.x,this.y,((this.f[this.x][this.y]-1000)^(1<<nr))+1000);
            return true;
        } else {
            var nr = ((this.xm<3*this.scale/8)?0:(this.xm>this.scale-3*this.scale/8)?2:1)+
            3*((this.ym<3*this.scale/8)?0:(this.ym>this.scale-3*this.scale/8)?2:1)+1;
            if (nr<1 || nr>this.MAX) {
                return erg;
            }
            this.set(this.x,this.y,((this.f[this.x][this.y]-1000)^(1<<nr))+1000);
            return true;
        }
    }

    this.set(this.x,this.y,(this.f[this.x][this.y]+1)%(this.MAX+1));
    return true;
};

/** Handles keydown event. */
teka.viewer.abcd.AbcdViewer.prototype.processKeydownEvent = function(e)
{
    this.exp = false;

    if (e.key==teka.KEY_DOWN) {
        if (this.y<this.Y-1) {
            this.y++;
        }
        return true;
    }
    if (e.key==teka.KEY_UP) {
        if (this.y>0 || (this.x>=0 && this.y>-this.MAX)) {
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
        if (this.x>0 || (this.y>=0 && this.x>-this.MAX)) {
            this.x--;
        }
        return true;
    }

    if (this.x<0) {
        if (e.key==teka.KEY_SPACE) {
            this.set_left(this.x+this.MAX,this.y,false);
        } else if (e.key==teka.KEY_HASH || e.key==teka.KEY_Q) {
            this.set_left(this.x+this.MAX,this.y,true);
        }
        return true;
    }

    if (this.y<0) {
        if (e.key==teka.KEY_SPACE) {
            this.set_top(this.x,this.y+this.MAX,false);
        } else if (e.key==teka.KEY_HASH || e.key==teka.KEY_Q) {
            this.set_top(this.x,this.y+this.MAX,true);
        }
        return true;
    }

    if (this.x<0 || this.y<0 || this.x>=this.X || this.y>=this.Y) {
        return false;
    }

    if (e.key==teka.KEY_SPACE) {
        this.set(this.x,this.y,0);
        return true;
    }

    if (e.key>=teka.KEY_A && e.key<=teka.KEY_A+this.MAX-1) {
        if (this.f[this.x][this.y]>=1000) {
            this.set(this.x,this.y,((this.f[this.x][this.y]-1000)^(1<<(e.key-teka.KEY_A+1)))+1000);
        } else {
            this.set(this.x,this.y,e.key-teka.KEY_A+1);
        }
        return true;
    }

    if (e.key==teka.KEY_HASH || e.key==teka.KEY_COMMA) {
        if (this.f[this.x][this.y]<1000) {
            this.set(this.x,this.y,this.setExpert(this.f[this.x][this.y]));
        } else {
            this.set(this.x,this.y,this.getExpert(this.f[this.x][this.y]));
        }
        return true;
    }

    return false;
};

//////////////////////////////////////////////////////////////////

/** Sets the value of a cell, if the color fits. */
teka.viewer.abcd.AbcdViewer.prototype.set = function(x, y, value)
{
    if (this.f[x][y]!=0 && this.f[x][y]!=1000 && this.c[x][y]!=this.color) {
        return;
    }
    this.f[x][y] = value;
    this.c[x][y] = this.color;
};

/** set_left */
teka.viewer.abcd.AbcdViewer.prototype.set_left = function(x, y, value)
{
    if (this.left_f[x][y] && this.left_c[x][y]!=this.color) {
        return;
    }
    this.left_f[x][y] = value;
    this.left_c[x][y] = this.color;
};

/** set_top */
teka.viewer.abcd.AbcdViewer.prototype.set_top = function(x, y, value)
{
    if (this.top_f[x][y] && this.top_c[x][y]!=this.color) {
        return;
    }
    this.top_f[x][y] = value;
    this.top_c[x][y] = this.color;
};

/** Converts from normal mode to expert mode. */
teka.viewer.abcd.AbcdViewer.prototype.setExpert = function(h)
{
    if (h==0) {
        return 1000;
    }
    return 1000+(1<<h);
};

/** Converts back from expert mode to normal mode. */
teka.viewer.abcd.AbcdViewer.prototype.getExpert = function(h)
{
    var min = 10;
    var max = 0;
    h = h-1000;
    for (var i=1;i<=this.MAX;i++) {
        if ((h&(1<<i))!=0) {
            if (i<min) {
                min=i;
            }
            if (i>max) {
                max=i;
            }
        }
    }
    if (min===10 && max===0) {
        return 0;
    }
    if (min===max) {
        return min;
    }
    return 0;
};
