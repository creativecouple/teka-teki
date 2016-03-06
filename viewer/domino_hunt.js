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
teka.viewer.domino_hunt = {};

/** Some constants. */
teka.viewer.domino_hunt.Defaults = {
    EMPTY: 0,
    LINE: 1,
    CROSS: 2,

    NO_MODE: 0,
    H_EDGE: 1,
    V_EDGE: 2
};

/** Constructor */
teka.viewer.domino_hunt.Domino_huntViewer = function(data)
{
    teka.viewer.PuzzleViewer.call(this,data);

    this.x = 0;
    this.y = 0;
    this.cursor_mode = teka.viewer.domino_hunt.Defaults.H_EDGE;
    this.domino = false;
};
teka.extend(teka.viewer.domino_hunt.Domino_huntViewer,teka.viewer.PuzzleViewer);

//////////////////////////////////////////////////////////////////

/** Initialize this viewer width the PSData object provided. */
teka.viewer.domino_hunt.Domino_huntViewer.prototype.initData = function(data)
{
    this.X = parseInt(data.get('X'),10);
    this.Y = parseInt(data.get('Y'),10);
    this.MIN = parseInt(data.get('min'),10);
    this.MAX = parseInt(data.get('max'),10);
    var digits = data.get('digits');
    digits = digits===false?1:parseInt(data.get('digits'),10);
    this.asciiToData(data.get('puzzle'),digits);
    this.asciiToSolution(data.get('solution'),digits);

    this.fr = teka.new_array([this.X-1,this.Y],0);
    this.fd = teka.new_array([this.X,this.Y-1],0);
    this.cr = teka.new_array([this.X-1,this.Y],0);
    this.cd = teka.new_array([this.X,this.Y-1],0);
    this.f_domino = teka.new_array([this.MAX-this.MIN+1,this.MAX-this.MIN+1],false);
    this.c_domino = teka.new_array([this.MAX-this.MIN+1,this.MAX-this.MIN+1],0);
    this.error = teka.new_array([this.X,this.Y],false);
    this.auto_r = teka.new_array([this.X-1,this.Y],false);
    this.auto_d = teka.new_array([this.X,this.Y-1],false);
};

/** Read puzzle from ascii art. */
teka.viewer.domino_hunt.Domino_huntViewer.prototype.asciiToData = function(ascii,d)
{
    if (ascii===false) {
        return;
    }

    var grid = this.asciiToArray(ascii);

    this.puzzle = teka.new_array([this.X,this.Y],0);
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            this.puzzle[i][j] = grid[(d+1)*i+1][2*j+1]==teka.ord('#')?-1:
                this.getNr(grid,(d+1)*i+1,2*j+1,d);
        }
    }

    this.pr = teka.new_array([this.X-1,this.Y],false);
    for (var i=0;i<this.X-1;i++) {
        for (var j=0;j<this.Y;j++) {
            this.pr[i][j] = grid[(d+1)*i+(d+1)][2*j+1]==teka.ord('|');
        }
    }

    this.pd = teka.new_array([this.X,this.Y-1],false);
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y-1;j++) {
            this.pd[i][j] = grid[(d+1)*i+1][2*j+2]==teka.ord('-');
        }
    }
};

/** Read puzzle from ascii art. */
teka.viewer.domino_hunt.Domino_huntViewer.prototype.asciiToSolution = function(ascii,d)
{
    if (ascii===false) {
        return;
    }

    var grid = this.asciiToArray(ascii);

    this.sr = teka.new_array([this.X-1,this.Y],false);
    for (var i=0;i<this.X-1;i++) {
        for (var j=0;j<this.Y;j++) {
            this.sr[i][j] = grid[(d+1)*i+(d+1)][2*j+1]==teka.ord('|');
        }
    }

    this.sd = teka.new_array([this.X,this.Y-1],false);
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y-1;j++) {
            this.sd[i][j] = grid[(d+1)*i+1][2*j+2]==teka.ord('-');
        }
    }
};

/** Add solution. */
teka.viewer.domino_hunt.Domino_huntViewer.prototype.addSolution = function()
{
    for (var i=0;i<this.X-1;i++) {
        for (var j=0;j<this.Y;j++) {
            this.fr[i][j] = this.sr[i][j]?teka.viewer.domino_hunt.Defaults.LINE:teka.viewer.domino_hunt.Defaults.EMPTY;
        }
    }

    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y-1;j++) {
            this.fd[i][j] = this.sd[i][j]?teka.viewer.domino_hunt.Defaults.LINE:teka.viewer.domino_hunt.Defaults.EMPTY;
        }
    }
};

//////////////////////////////////////////////////////////////////

/** Returns a small example. */
teka.viewer.domino_hunt.Domino_huntViewer.prototype.getExample = function()
{
    return '/format 1\n/type (domino_hunt)\n/sol false\n/X 4\n/Y 3\n/min 0\n/max 2\n'
        +'/puzzle [ (+-+-+-+-+) (|1 2 2 1|) (+ + + + +) (|0 2 0 1|) (+ + + + +) (|0 2 1 0|) (+-+-+-+-+) ]\n'
        +'/solution [ (+-+-+-+-+) (|1 2|2|1|) (+-+-+ + +) (|0|2|0|1|) (+ + +-+-+) (|0|2|1 0|) (+-+-+-+-+) ]';
};

/** Returns a list of automatically generated properties. */
teka.viewer.domino_hunt.Domino_huntViewer.prototype.getProperties = function()
{
    return [teka.translate('generic_size',[this.X+'x'+this.Y])];
};

//////////////////////////////////////////////////////////////////

/** Reset the whole diagram. */
teka.viewer.domino_hunt.Domino_huntViewer.prototype.reset = function()
{
    for (var i=0;i<this.X-1;i++) {
        for (var j=0;j<this.Y;j++) {
            this.fr[i][j] = teka.viewer.domino_hunt.Defaults.EMPTY;
            this.cr[i][j] = 0;
        }
    }
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y-1;j++) {
            this.fd[i][j] = teka.viewer.domino_hunt.Defaults.EMPTY;
            this.cd[i][j] = 0;
        }
    }
    for (var i=0;i<this.MAX-this.MIN+1;i++) {
        for (var j=0;j<this.MAX-this.MIN+1;j++) {
            this.f_domino[i][j] = false;
        }
    }
    this.addSomeStrokes();
};

/** Reset the error marks. */
teka.viewer.domino_hunt.Domino_huntViewer.prototype.clearError = function()
{
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            this.error[i][j] = false;
        }
    }
};

/** Copy digits colored with this.color to color. */
teka.viewer.domino_hunt.Domino_huntViewer.prototype.copyColor = function(color)
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
            if (this.cd[i][j]==this.color) {
                this.cd[i][j] = color;
            }
        }
    }
    for (var i=0;i<this.MAX-this.MIN+1;i++) {
        for (var j=0;j<this.MAX-this.MIN+1;j++) {
            if (this.c_domino[i][j]==this.color) {
                this.c_domino[i][j] = color;
            }
        }
    }
    this.addSomeStrokes();
};

/** Delete all digits with color. */
teka.viewer.domino_hunt.Domino_huntViewer.prototype.clearColor = function(color)
{
    for (var i=0;i<this.X-1;i++) {
        for (var j=0;j<this.Y;j++) {
            if (this.cr[i][j]==color) {
                this.fr[i][j] = teka.viewer.domino_hunt.Defaults.EMPTY;
            }
        }
    }
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y-1;j++) {
            if (this.cd[i][j]==color) {
                this.fd[i][j] = teka.viewer.domino_hunt.Defaults.EMPTY;
            }
        }
    }
    for (var i=0;i<this.MAX-this.MIN+1;i++) {
        for (var j=0;j<this.MAX-this.MIN+1;j++) {
            if (this.c_domino[i][j]==color) {
                this.f_domino[i][j] = false;
            }
        }
    }
    this.addSomeStrokes();
};

/** Save current state. */
teka.viewer.domino_hunt.Domino_huntViewer.prototype.saveState = function()
{
    var fr = teka.new_array([this.X-1,this.Y],0);
    var fd = teka.new_array([this.X,this.Y-1],0);
    var cr = teka.new_array([this.X-1,this.Y],0);
    var cd = teka.new_array([this.X,this.Y-1],0);
    for (var i=0;i<this.X-1;i++) {
        for (var j=0;j<this.Y;j++) {
            fr[i][j] = this.fr[i][j];
            cr[i][j] = this.cr[i][j];
        }
    }
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y-1;j++) {
            fd[i][j] = this.fd[i][j];
            cd[i][j] = this.cd[i][j];
        }
    }

    var f_domino = teka.new_array([this.MAX-this.MIN+1,this.MAX-this.MIN+1],false);
    var c_domino = teka.new_array([this.MAX-this.MIN+1,this.MAX-this.MIN+1],0);
    for (var i=0;i<this.MAX-this.MIN+1;i++) {
        for (var j=0;j<this.MAX-this.MIN+1;j++) {
            f_domino[i][j] = this.f_domino[i][j];
            c_domino[i][j] = this.c_domino[i][j];
        }
    }

    return { fr:fr, fd:fd, cr:cr, cd:cd, f_domino:f_domino, c_domino:c_domino };
};

/** Load state. */
teka.viewer.domino_hunt.Domino_huntViewer.prototype.loadState = function(state)
{
    for (var i=0;i<this.X-1;i++) {
        for (var j=0;j<this.Y;j++) {
            this.fr[i][j] = state.fr[i][j];
            this.cr[i][j] = state.cr[i][j];
        }
    }
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y-1;j++) {
            this.fd[i][j] = state.fd[i][j];
            this.cd[i][j] = state.cd[i][j];
        }
    }
    for (var i=0;i<this.MAX-this.MIN+1;i++) {
        for (var j=0;j<this.MAX-this.MIN+1;j++) {
            this.f_domino[i][j] = state.f_domino[i][j];
            this.c_domino[i][j] = state.c_domino[i][j];
        }
    }
    this.addSomeStrokes();
};

//////////////////////////////////////////////////////////////////

/** Check, if the solution is correct. */
teka.viewer.domino_hunt.Domino_huntViewer.prototype.check = function()
{
    var X = this.X;
    var Y = this.Y;

    var check_r = teka.new_array([this.X-1,this.Y],false);
    for (var i=0;i<this.X-1;i++) {
        for (var j=0;j<this.Y;j++) {
            if (this.pr[i][j]===true) {
                check_r[i][j] = teka.viewer.domino_hunt.Defaults.LINE;
                continue;
            }
            check_r[i][j] = this.fr[i][j];
            if (check_r[i][j]==teka.viewer.domino_hunt.Defaults.EMPTY && this.auto_r[i][j]) {
                check_r[i][j] = teka.viewer.domino_hunt.Defaults.LINE;
            }
        }
    }

    var check_d = teka.new_array([this.X,this.Y-1],false);
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y-1;j++) {
            if (this.pd[i][j]===true) {
                check_d[i][j] = teka.viewer.domino_hunt.Defaults.LINE;
                continue;
            }
            check_d[i][j] = this.fd[i][j];
            if (check_d[i][j]==teka.viewer.domino_hunt.Defaults.EMPTY && this.auto_d[i][j]) {
                check_d[i][j] = teka.viewer.domino_hunt.Defaults.LINE;
            }
        }
    }

    var mark = teka.new_array([X,Y],0);
    var c = 0;
    for (var i=0;i<X;i++) {
        for (var j=0;j<Y;j++) {
            if (mark[i][j]===0) {
                if (this.puzzle[i][j]==-1) {
                    mark[i][j] = ++c;
                    continue;
                }

                if (this.fill(mark,i,j,++c,check_r,check_d)!=2) {
                    for (var ii=0;ii<X;ii++) {
                        for (var jj=0;jj<Y;jj++) {
                            if (mark[ii][jj]==c) {
                                this.error[ii][jj] = true;
                            }
                        }
                    }
                    return 'domino_hunt_no_domino';
                }
            }
        }
    }

    var used = teka.new_array([this.MAX-this.MIN+1,this.MAX-this.MIN+1],0);
    for (var i=0;i<X;i++) {
        for (var j=0;j<Y;j++) {
            if (this.puzzle[i][j]==-1) {
                continue;
            }

            var a = this.puzzle[i][j]-this.MIN;
            var b = -1;

            if (i<X-1 && mark[i+1][j]==mark[i][j]) {
                b = this.puzzle[i+1][j];
            }
            if (j<Y-1 && mark[i][j+1]==mark[i][j]) {
                b = this.puzzle[i][j+1];
            }
            if (b==-1) {
                continue;
            }

            b -= this.MIN;
            if (a>b) {
                var h = a; a = b; b = h;
            }

            if (used[a][b]!=0) {
                for (var ii=0;ii<X;ii++) {
                    for (var jj=0;jj<Y;jj++) {
                        if (mark[ii][jj]==used[a][b] || mark[ii][jj]==mark[i][j]) {
                            this.error[ii][jj] = true;
                        }
                    }
                }
                return 'domino_hunt_double';
            }
            used[a][b] = mark[i][j];
        }
    }

    return true;
};

/** floodfill starting at x,y and count the number of cells. */
teka.viewer.domino_hunt.Domino_huntViewer.prototype.fill = function(mark, x, y, value, check_r, check_d)
{
    if (x<0 || y<0 || x>=this.X || y>=this.Y) {
        return 0;
    }

    if (mark[x][y]!=0) {
        return 0;
    }

    if (this.puzzle[x][y]==-1) {
        return 0;
    }

    mark[x][y]=value;

    var az = 1;
    if (x<this.X-1 && check_r[x][y]!=teka.viewer.domino_hunt.Defaults.LINE) {
        az += this.fill(mark,x+1,y,value,check_r,check_d);
    }
    if (y<this.Y-1 && check_d[x][y]!=teka.viewer.domino_hunt.Defaults.LINE) {
        az += this.fill(mark,x,y+1,value,check_r,check_d);
    }
    if (x>0 && check_r[x-1][y]!=teka.viewer.domino_hunt.Defaults.LINE) {
        az += this.fill(mark,x-1,y,value,check_r,check_d);
    }
    if (y>0 && check_d[x][y-1]!=teka.viewer.domino_hunt.Defaults.LINE) {
        az += this.fill(mark,x,y-1,value,check_r,check_d);
    }

    return az;
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
teka.viewer.domino_hunt.Domino_huntViewer.prototype.setMetrics = function(g)
{
    var h = this.MAX-this.MIN+1;
    this.scale = Math.floor(Math.min(Math.min((this.width-6)/this.X,
                                              (this.width-6)/h),
                                     3*(this.height-6-(this.textHeight+2)-6)/(3*this.Y+h)));
    var realwidth = Math.max(this.X*this.scale+6,h*this.scale+6);
    var realheight = this.Y*this.scale+6+this.textHeight+2+5+h*this.scale/3;

    this.bottomText = teka.translate('domino_hunt_range',[this.MIN,this.MIN,this.MAX,this.MAX]);
    g.font = 'bold '+this.textHeight+'px sans-serif';
    var textwidth = g.measureText(this.bottomText).width+1;
    realwidth = Math.max(realwidth,textwidth+this.scale);

    this.deltaX = Math.floor((this.width-realwidth)/2)+0.5;
    this.deltaY = Math.floor((this.height-realheight)/2)+0.5;
    this.borderX = 2;
    this.borderY = 2;

    this.font = teka.getFontData(Math.round(this.scale/2)+'px sans-serif',this.scale);
    this.smallfont = teka.getFontData(Math.round((this.scale-6)/4)+'px sans-serif',this.scale);

    if (realwidth>this.width || realheight>this.height) {
        this.scale=false;
    }
    return {width:realwidth,height:realheight,scale:this.scale};
};

/** Paints the diagram. */
teka.viewer.domino_hunt.Domino_huntViewer.prototype.paint = function(g)
{
    var X = this.X;
    var Y = this.Y;
    var S = this.scale;

    g.save();
    g.translate(this.deltaX+this.borderX,this.deltaY+this.borderY);

    g.fillStyle = '#fff';
    g.fillRect(0,0,X*S,Y*S);

    for (var i=0;i<X;i++) {
        for (var j=0;j<Y;j++) {
            g.fillStyle = this.isBlinking()?
                this.getBlinkColor(i,j,X,this.fr[i%(X-1)][j]):
                (this.error[i][j]?'#f00':'#fff');
            g.fillRect(i*S,j*S,S,S);
        }
    }

    g.strokeStyle = '#000';
    for (var i=1;i<X;i++) {
        teka.drawLine(g,i*S,0,i*S,Y*S);
    }

    for (var j=1;j<Y;j++) {
        teka.drawLine(g,0,j*S,X*S,j*S);
    }

    g.fillStyle = '#000';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.font = this.font.font;
    for (var i=0;i<X;i++) {
        for (var j=0;j<Y;j++) {
            if (this.puzzle[i][j]!=-1) {
                g.fillText(this.puzzle[i][j],i*S+S/2,j*S+S/2+this.font.delta);
            } else {
                g.fillRect(i*S,j*S,S,S);
            }
        }
    }

    g.lineCap = 'square';
    for (var i=0;i<X-1;i++) {
        for (var j=0;j<Y;j++) {
            if (this.pr[i][j]===true) {
                g.strokeStyle = '#000';
                g.lineWidth=5;
                teka.drawLine(g,(i+1)*S,j*S,(i+1)*S,(j+1)*S);
                g.lineWidth=1;
                continue;
            }
            g.strokeStyle = this.getColorString(this.cr[i][j]);
            if (this.fr[i][j]==teka.viewer.domino_hunt.Defaults.LINE) {
                g.lineWidth=5;
                teka.drawLine(g,(i+1)*S,j*S,(i+1)*S,(j+1)*S);
                g.lineWidth=1;
                continue;
            }
            if (this.fr[i][j]==teka.viewer.domino_hunt.Defaults.CROSS) {
                g.lineWidth=2;
                teka.drawLine(g,(i+1)*S-S/10,j*S+S/2-S/10,(i+1)*S+S/10,j*S+S/2+S/10);
                teka.drawLine(g,(i+1)*S-S/10,j*S+S/2+S/10,(i+1)*S+S/10,j*S+S/2-S/10);
                g.lineWidth=1;
                continue;
            }
            if (this.auto_r[i][j]) {
                g.strokeStyle = '#888';
                g.lineWidth=5;
                teka.drawLine(g,(i+1)*S,j*S,(i+1)*S,(j+1)*S);
                g.lineWidth=1;
                continue;
            }
        }
    }

    for (var i=0;i<X;i++) {
        for (var j=0;j<Y-1;j++) {
            if (this.pd[i][j]===true) {
                g.strokeStyle = '#000';
                g.lineWidth=5;
                teka.drawLine(g,i*S,(j+1)*S,(i+1)*S,(j+1)*S);
                g.lineWidth=1;
                continue;
            }
            g.strokeStyle = this.getColorString(this.cd[i][j]);
            if (this.fd[i][j]==teka.viewer.domino_hunt.Defaults.LINE) {
                g.lineWidth=5;
                teka.drawLine(g,i*S,(j+1)*S,(i+1)*S,(j+1)*S);
                g.lineWidth=1;
                continue;
            }
            if (this.fd[i][j]==teka.viewer.domino_hunt.Defaults.CROSS) {
                g.lineWidth=2;
                teka.drawLine(g,i*S+S/2-S/10,(j+1)*S-S/10,i*S+S/2+S/10,(j+1)*S+S/10);
                teka.drawLine(g,i*S+S/2-S/10,(j+1)*S+S/10,i*S+S/2+S/10,(j+1)*S-S/10);
                g.lineWidth=1;
                continue;
            }
            if (this.auto_d[i][j]) {
                g.strokeStyle = '#888';
                g.lineWidth=5;
                teka.drawLine(g,i*S,(j+1)*S,(i+1)*S,(j+1)*S);
                g.lineWidth=1;
                continue;
            }
        }
    }
    g.lineCap = 'butt';

    g.strokeStyle = '#000';
    g.lineWidth = 5;
    g.strokeRect(0,0,X*S,Y*S);
    g.lineWidth = 1;

    // paint text below the grid
    g.textAlign = 'left';
    g.textBaseline = 'top';
    g.fillStyle = this.textcolor;
    g.font = 'bold '+this.textHeight+'px sans-serif';
    g.fillText(this.bottomText,0,Y*S+4);

    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.font = this.smallfont.font;
    for (var i=this.MIN;i<=this.MAX;i++) {
        for (var j=i;j<=this.MAX;j++) {
            g.fillStyle = '#fff';
            g.fillRect(2+(i-this.MIN)*S+Math.floor(S/6)+2,
                       Y*S+9+this.textHeight+2+(j-this.MIN)*Math.ceil(S/3)+1,
                       2*Math.ceil(S/3)-4,Math.ceil(S/3)-2);
            g.strokeStyle = '#000';
            g.strokeRect(2+(i-this.MIN)*S+Math.floor(S/6)+2,
                       Y*S+9+this.textHeight+2+(j-this.MIN)*Math.ceil(S/3)+1,
                       2*Math.ceil(S/3)-4,Math.ceil(S/3)-2);
            teka.drawLine(g,2+(i-this.MIN)*S+Math.floor(S/2),
                          Y*S+9+this.textHeight+2+(j-this.MIN)*Math.ceil(S/3)+3,
                          2+(i-this.MIN)*S+Math.floor(S/2),
                          Y*S+9+this.textHeight+2+(j-this.MIN)*Math.ceil(S/3)+1+Math.ceil(S/3)-4);
            g.fillStyle = '#000';
            g.fillText(i,2+(i-this.MIN)*S+Math.floor(S/3),
                       Y*S+9+this.textHeight+2+(j-this.MIN)*Math.ceil(S/3)+S/6+this.smallfont.delta);
            g.fillText(j,2+(i-this.MIN)*S+2*Math.floor(S/3),
                       Y*S+9+this.textHeight+2+(j-this.MIN)*Math.ceil(S/3)+S/6+this.smallfont.delta);

            if (this.f_domino[i-this.MIN][j-this.MIN]) {
                g.strokeStyle = this.getColorString(this.c_domino[i-this.MIN][j-this.MIN]);
                teka.drawLine(g,2+(i-this.MIN)*S+Math.floor(S/6)+2,
                              Y*S+9+this.textHeight+2+(j-this.MIN)*Math.ceil(S/3)+1,
                              2+(i-this.MIN)*S+Math.floor(S/6)+2+2*(S/3-2),
                              Y*S+9+this.textHeight+2+(j-this.MIN)*Math.ceil(S/3)+1+S/3-2);
                teka.drawLine(g,2+(i-this.MIN)*S+Math.floor(S/6)+2,
                              Y*S+9+this.textHeight+2+(j-this.MIN)*Math.ceil(S/3)+1+S/3-2,
                              2+(i-this.MIN)*S+Math.floor(S/6)+2+2*(S/3-2),
                              Y*S+9+this.textHeight+2+(j-this.MIN)*Math.ceil(S/3)+1);
            }
        }
    }

    // paint cursor
    if (this.mode==teka.viewer.Defaults.NORMAL) {
        g.strokeStyle = '#f00';
        g.lineWidth = 3;
        if (this.domino) {
            g.strokeRect(this.x*S+Math.floor(S/6)+6,
                       Y*S+this.textHeight+this.y*Math.ceil(S/3)+14,
                       2*Math.ceil(S/3)-8,Math.ceil(S/3)-6);
        } else if (this.cursor_mode==teka.viewer.domino_hunt.Defaults.V_EDGE) {
            teka.drawLine(g,(this.x+1)*S,this.y*S,(this.x+1)*S,(this.y+1)*S);
        } else if (this.cursor_mode==teka.viewer.domino_hunt.Defaults.H_EDGE) {
            teka.drawLine(g,this.x*S,(this.y+1)*S,(this.x+1)*S,(this.y+1)*S);
        }
    }

    g.restore();
};

//////////////////////////////////////////////////////////////////

/** Handles mousemove event. */
teka.viewer.domino_hunt.Domino_huntViewer.prototype.processMousemoveEvent = function(xc, yc, pressed)
{
    var oldx = this.x;
    var oldy = this.y;
    var olddomino = this.domino;
    var oldmode = this.cursor_mode;

    if (yc>this.Y*this.scale+this.textHeight+6+this.deltaY+this.borderY) {
        xc -= this.deltaX+this.borderX;
        yc -= this.deltaY+this.borderY;

        yc -= this.Y*this.scale+this.textHeight+11;

        this.x = Math.floor(xc/this.scale);
        this.y = Math.floor(yc/Math.ceil(this.scale/3));

        if (this.x<0) {
            this.x=0;
        }
        if (this.x>this.MAX-this.MIN) {
            this.x=this.MAX-this.MIN;
        }
        if (this.y<this.x) {
            this.y=this.x;
        }
        if (this.y>this.MAX-this.MIN) {
            this.y=this.MAX-this.MIN;
        }

        this.domino = true;
    } else {
        var coord = this.normalizeCoordinates(xc,yc);

        if (coord.left) {
            this.cursor_mode = teka.viewer.domino_hunt.Defaults.V_EDGE;
            this.x = coord.x-1;
            this.y = coord.y;
        }

        if (coord.right) {
            this.cursor_mode = teka.viewer.domino_hunt.Defaults.V_EDGE;
            this.x = coord.x;
            this.y = coord.y;
        }

        if (coord.top) {
            this.cursor_mode = teka.viewer.domino_hunt.Defaults.H_EDGE;
            this.x = coord.x;
            this.y = coord.y-1;
        }

        if (coord.bottom) {
            this.cursor_mode = teka.viewer.domino_hunt.Defaults.H_EDGE;
            this.x = coord.x;
            this.y = coord.y;
        }

        if (this.x<0 || this.y<0 || this.x>=this.X || this.y>=this.Y ||
            (this.x==this.X-1 && this.cursor_mode==teka.viewer.domino_hunt.Defaults.V_EDGE) ||
            (this.y==this.Y-1 && this.cursor_mode==teka.viewer.domino_hunt.Defaults.H_EDGE)) {
            this.cursor_mode = teka.viewer.domino_hunt.Defaults.NO_MODE;
        }
        this.domino = false;
    }

    return this.x!=oldx || this.y!=oldy || this.cursor_mode!=oldmode || this.domino!=olddomino;
};

/** Handles mousedown event. */
teka.viewer.domino_hunt.Domino_huntViewer.prototype.processMousedownEvent = function(xc, yc)
{
    var erg = this.processMousemoveEvent(xc,yc);

    if (this.domino) {
        this.setDomino(this.x,this.y,!this.f_domino[this.x][this.y]);
        return true;
    }

    if (this.cursor_mode==teka.viewer.domino_hunt.Defaults.NO_MODE) {
        return erg;
    }

    this.setEdge(this.x,this.y,this.cursor_mode==teka.viewer.domino_hunt.Defaults.H_EDGE,
                 ((this.cursor_mode==teka.viewer.domino_hunt.Defaults.H_EDGE?this.fd[this.x][this.y]:this.fr[this.x][this.y])+1)%3);

    return true;
};

/** Handles keydown event. */
teka.viewer.domino_hunt.Domino_huntViewer.prototype.processKeydownEvent = function(e)
{
    if (this.domino) {
        if (e.key==teka.KEY_LEFT) {
            if (this.x>0) {
                this.x--;
            }
            return true;
        }

        if (e.key==teka.KEY_RIGHT) {
            if (this.x<this.y) {
                this.x++;
            }
            return true;
        }

        if (e.key==teka.KEY_DOWN) {
            if (this.y<this.MAX-this.MIN) {
                this.y++;
            }
            return true;
        }

        if (e.key==teka.KEY_UP) {
            if (this.y==this.x && this.x<this.X) {
                this.cursor_mode=teka.viewer.domino_hunt.Defaults.H_EDGE;
                this.domino = false;
                this.y = this.Y-2;
                return true;
            }
            if (this.y>this.x) {
                this.y--;
            }
            return true;
        }

        if (e.key==teka.KEY_SPACE) {
            this.setDomino(this.x,this.y,false);
            return true;
        }

        if (e.key==teka.KEY_HASH || e.key==teka.KEY_STAR || e.key==teka.KEY_Q) {
            this.setDomino(this.x,this.y,true);
            return true;
        }

        return false;
    }

    if (e.key==teka.KEY_ESCAPE) {
        if (this.cursor_mode==teka.viewer.domino_hunt.Defaults.V_EDGE) {
            this.cursor_mode=teka.viewer.domino_hunt.Defaults.H_EDGE;
            if (this.y==this.Y-1) {
                this.y--;
            }
        } else {
            this.cursor_mode=teka.viewer.domino_hunt.Defaults.V_EDGE;
            if (this.x==this.X-1) {
                this.x--;
            }
        }
        return true;
    }

    if (e.key==teka.KEY_DOWN) {
        if ((this.cursor_mode==teka.viewer.domino_hunt.Defaults.V_EDGE && this.y==this.Y-1)
            || (this.cursor_mode==teka.viewer.domino_hunt.Defaults.H_EDGE && this.y==this.Y-2)) {
                if (this.x<=this.MAX-this.MIN) {
                    this.y = this.x;
                    this.domino = true;
                    return true;
                }
        }

        if (this.y<this.Y-1 &&
           (this.cursor_mode==teka.viewer.domino_hunt.Defaults.V_EDGE || this.y<this.Y-2)) {
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
        if (this.x<this.X-1 &&
            (this.cursor_mode==teka.viewer.domino_hunt.Defaults.H_EDGE || this.x<this.X-2)) {
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

    if (e.key==teka.KEY_SPACE) {
        this.setEdge(this.x,this.y,
                     this.cursor_mode==teka.viewer.domino_hunt.Defaults.H_EDGE,
                     teka.viewer.domino_hunt.Defaults.EMPTY);
        return true;
    }

    if (e.key==teka.KEY_HASH || e.key==teka.KEY_STAR || e.key==teka.KEY_Q) {
        this.setEdge(this.x,this.y,
                     this.cursor_mode==teka.viewer.domino_hunt.Defaults.H_EDGE,
                     teka.viewer.domino_hunt.Defaults.LINE);
        return true;
    }

    if (e.key==teka.KEY_MINUS || e.key==teka.KEY_SLASH || e.key==teka.KEY_W
        || e.key==teka.KEY_D || e.key==teka.KEY_X) {
        this.setEdge(this.x,this.y,
                     this.cursor_mode==teka.viewer.domino_hunt.Defaults.H_EDGE,
                     teka.viewer.domino_hunt.Defaults.CROSS);
        return true;
    }

    return false;
};

//////////////////////////////////////////////////////////////////

/** Sets the value of a domino, if the color fits. */
teka.viewer.domino_hunt.Domino_huntViewer.prototype.setDomino = function(x, y, value)
{
    if (this.f_domino[x][y] && this.c_domino[x][y]!=this.color) {
        return;
    }
    this.f_domino[x][y] = value;
    this.c_domino[x][y] = this.color;
};

/** Sets the value of an edge, if the color fits. */
teka.viewer.domino_hunt.Domino_huntViewer.prototype.setEdge = function(x, y, horiz, value)
{
    if (horiz) {
        if (this.fd[x][y]!=teka.viewer.domino_hunt.Defaults.EMPTY &&
            this.cd[x][y]!=this.color) {
            return;
        }

        this.fd[x][y]=value;
        this.cd[x][y]=this.color;
        this.addSomeStrokes();
        return;
    }

    if (this.fr[x][y]!=teka.viewer.domino_hunt.Defaults.EMPTY &&
        this.cr[x][y]!=this.color) {
        return;
    }

    this.fr[x][y]=value;
    this.cr[x][y]=this.color;
    this.addSomeStrokes();
};

/** Add strokes around crosses. */
teka.viewer.domino_hunt.Domino_huntViewer.prototype.addSomeStrokes = function()
{
    for (var i=0;i<this.X-1;i++) {
        for (var j=0;j<this.Y;j++) {
            this.auto_r[i][j] = false;
        }
    }
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y-1;j++) {
            this.auto_d[i][j] = false;
        }
    }

    for (var i=0;i<this.X-1;i++) {
        for (var j=0;j<this.Y;j++) {
            if (this.fr[i][j]==teka.viewer.domino_hunt.Defaults.CROSS) {
                if (i>0) {
                    this.auto_r[i-1][j] = true;
                }
                if (i<this.X-2) {
                    this.auto_r[i+1][j] = true;
                }
                if (j>0) {
                    this.auto_d[i][j-1] = true;
                    this.auto_d[i+1][j-1] = true;
                }
                if (j<this.Y-1) {
                    this.auto_d[i][j] = true;
                    this.auto_d[i+1][j] = true;
                }
            }
        }
    }

    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y-1;j++) {
            if (this.fd[i][j]==teka.viewer.domino_hunt.Defaults.CROSS) {
                if (j>0) {
                    this.auto_d[i][j-1] = true;
                }
                if (j<this.Y-2) {
                    this.auto_d[i][j+1] = true;
                }
                if (i>0) {
                    this.auto_r[i-1][j] = true;
                    this.auto_r[i-1][j+1] = true;
                }
                if (i<this.X-1) {
                    this.auto_r[i][j] = true;
                    this.auto_r[i][j+1] = true;
                }
            }
        }
    }
};
