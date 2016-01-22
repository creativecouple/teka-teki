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
teka.viewer.arukone = {};

/** Some constants. */
teka.viewer.arukone.Defaults = {
    BLACK: -1,

    CELL: 0,
    H_EDGE: 1,
    V_EDGE: 2
};

/** Constructor */
teka.viewer.arukone.ArukoneViewer = function(data)
{
    teka.viewer.PuzzleViewer.call(this,data);

    this.x = 0;
    this.y = 0;
    this.cursor_mode = teka.viewer.arukone.Defaults.CELL;
};
teka.extend(teka.viewer.arukone.ArukoneViewer,teka.viewer.PuzzleViewer);

//////////////////////////////////////////////////////////////////

/** Initialize this viewer width the PSData object provided. */
teka.viewer.arukone.ArukoneViewer.prototype.initData = function(data)
{
    this.X = parseInt(data.get('X'),10);
    this.Y = parseInt(data.get('Y'),10);
    var digits = data.get('digits');
    this.letters = digits===false;
    digits = digits===false?1:parseInt(data.get('digits'),10);
    this.asciiToData(data.get('puzzle'),digits);
    this.asciiToSolution(data.get('solution'),digits);

    this.f = teka.new_array([this.X,this.Y],false);
    this.c = teka.new_array([this.X,this.Y],0);
    this.fr = teka.new_array([this.X-1,this.Y],0);
    this.fd = teka.new_array([this.X,this.Y-1],0);
    this.cr = teka.new_array([this.X-1,this.Y],0);
    this.cd = teka.new_array([this.X,this.Y-1],0);
    this.error = teka.new_array([this.X,this.Y],false);
    this.end = teka.new_array([this.X,this.Y],0);
};

/** Read puzzle from ascii art. */
teka.viewer.arukone.ArukoneViewer.prototype.asciiToData = function(ascii, d)
{
    if (ascii===false) {
        return;
    }

    var grid = this.asciiToArray(ascii);

    this.puzzle = teka.new_array([this.X,this.Y],0);
    this.MAX = 0;
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            if (this.letters===true
                && grid[2*i+1][2*j+1]>=teka.ord('A')
                && grid[2*i+1][2*j+1]<=teka.ord('Z')) {
                this.puzzle[i][j] = grid[2*i+1][2*j+1]-teka.ord('A')+1;
                this.MAX = Math.max(this.MAX,this.puzzle[i][j]);
            } else if (grid[(d+1)*i+1][2*j+1]==teka.ord('#')) {
                this.puzzle[i][j] = teka.viewer.arukone.Defaults.BLACK;
            } else if (this.letters===false) {
                this.puzzle[i][j] = this.getNr(grid,(d+1)*i+1,2*j+1,d);
                if (this.puzzle[i][j]===false) {
                    this.puzzle[i][j] = 0;
                }
                this.MAX = Math.max(this.MAX,this.puzzle[i][j]);
            }
        }
    }

    this.pr = teka.new_array([this.X-1,this.Y],0);
    for (var i=0;i<this.X-1;i++) {
        for (var j=0;j<this.Y;j++) {
            if (grid[(d+1)*i+(d+1)][2*j+1]==teka.ord('-')) {
                this.pr[i][j]=1;
            }
        }
    }

    this.pd = teka.new_array([this.X,this.Y-1],0);
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y-1;j++) {
            if (grid[(d+1)*i+Math.floor((d+2)/2)][2*j+2]==teka.ord('|')) {
                this.pd[i][j]=1;
            }
        }
    }
};

/** Read solution from ascii art. */
teka.viewer.arukone.ArukoneViewer.prototype.asciiToSolution = function(ascii, d)
{
    if (ascii===false) {
        return;
    }

    var grid = this.asciiToArray(ascii);

    this.sr = teka.new_array([this.X-1,this.Y],0);
    for (var i=0;i<this.X-1;i++) {
        for (var j=0;j<this.Y;j++) {
            this.sr[i][j] = grid[(d+1)*i+(d+1)][2*j+1]==teka.ord('-')?1:0;
        }
    }

    this.sd = teka.new_array([this.X,this.Y-1],0);
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y-1;j++) {
            this.sd[i][j] = grid[(d+1)*i+Math.floor((d+2)/2)][2*j+2]==teka.ord('|')?1:0;
        }
    }
};

/** Add solution. */
teka.viewer.arukone.ArukoneViewer.prototype.addSolution = function()
{
    for (var i=0;i<this.X-1;i++) {
        for (var j=0;j<this.Y;j++) {
            this.fr[i][j] = this.sr[i][j];
        }
    }
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y-1;j++) {
            this.fd[i][j] = this.sd[i][j];
        }
    }
};

//////////////////////////////////////////////////////////////////

/** Returns a small example. */
teka.viewer.arukone.ArukoneViewer.prototype.getExample = function()
{
    return '/type (arukone)\n/sol false\n/X 4\n/Y 4\n/puzzle [ '
        +'(+-+-+-+-+) (|C     C|) (+ + + + +) (|       |) (+ + + + +) '
        +'(|  B   A|) (+ + + + +) (|  A B  |) (+-+-+-+-+) ]\n/solution [ '
        +'(+-+-+-+-+) (|C- - -C|) (+ + + + +) (| - - - |) (+|+ + +|+) '
        +'(|  B-  A|) (+|+ +|+ +) (| -A B  |) (+-+-+-+-+) ]';
};

/** Returns a list of automatically generated properties. */
teka.viewer.arukone.ArukoneViewer.prototype.getProperties = function()
{
    return [teka.translate('generic_size',[this.X+'x'+this.Y]),
            teka.translate('arukone_letters',[teka.chr(teka.ord('A')+this.MAX-1)])];
};

//////////////////////////////////////////////////////////////////

/** Reset the whole diagram. */
teka.viewer.arukone.ArukoneViewer.prototype.reset = function()
{
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            this.f[i][j] = false;
            this.c[i][j] = 0;
        }
    }
    for (var i=0;i<this.X-1;i++) {
        for (var j=0;j<this.Y;j++) {
            this.fr[i][j]=0;
            this.cr[i][j]=0;
        }
    }
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y-1;j++) {
            this.fd[i][j]=0;
            this.cd[i][j]=0;
        }
    }
    this.updateEnds();
};

/** Reset the error marks. */
teka.viewer.arukone.ArukoneViewer.prototype.clearError = function()
{
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            this.error[i][j] = false;
        }
    }
};

/** Copy digits colored with this.color to color. */
teka.viewer.arukone.ArukoneViewer.prototype.copyColor = function(color)
{
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            if (this.c[i][j]==this.color) {
                this.c[i][j] = color;
            }
        }
    }
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
};

/** Delete all digits with color. */
teka.viewer.arukone.ArukoneViewer.prototype.clearColor = function(color)
{
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            if (this.c[i][j]==color) {
                this.f[i][j] = false;
            }
        }
    }
    for (var i=0;i<this.X-1;i++) {
        for (var j=0;j<this.Y;j++) {
            if (this.cr[i][j]==color) {
                this.fr[i][j] = 0;
            }
        }
    }
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y-1;j++) {
            if (this.cd[i][j]==color) {
                this.fd[i][j] = 0;
            }
        }
    }
    this.updateEnds();
};

/** Save current state. */
teka.viewer.arukone.ArukoneViewer.prototype.saveState = function()
{
    var f = teka.new_array([this.X,this.Y],false);
    var c = teka.new_array([this.X,this.Y],0);
    var fr = teka.new_array([this.X-1,this.Y],0);
    var fd = teka.new_array([this.X,this.Y-1],0);
    var cr = teka.new_array([this.X-1,this.Y],0);
    var cd = teka.new_array([this.X,this.Y-1],0);
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            f[i][j] = this.f[i][j];
            c[i][j] = this.c[i][j];
        }
    }
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

    return { f:f, c:c, fr:fr, fd:fd, cr:cr, cd:cd };
};

/** Load state. */
teka.viewer.arukone.ArukoneViewer.prototype.loadState = function(state)
{
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            this.f[i][j] = state.f[i][j];
            this.c[i][j] = state.c[i][j];
        }
    }
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
    this.updateEnds();
};

//////////////////////////////////////////////////////////////////

/** Check, if the solution is correct. */
teka.viewer.arukone.ArukoneViewer.prototype.check = function()
{
    var X = this.X;
    var Y = this.Y;

    // create a clean solution from user input and givens
    var checkr = teka.new_array([this.X-1,this.Y],0);
    for (var i=0;i<this.X-1;i++) {
        for (var j=0;j<this.Y;j++) {
            checkr[i][j] = this.fr[i][j]==1?1:0;
            if (this.pr[i][j]===1) {
                checkr[i][j] = 1;
            }
            if (this.puzzle[i][j]==teka.viewer.arukone.Defaults.BLACK ||
                this.puzzle[i+1][j]==teka.viewer.arukone.Defaults.BLACK) {
                checkr[i][j] = 0;
            }
        }
    }

    var checkd = teka.new_array([this.X,this.Y-1],0);
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y-1;j++) {
            checkd[i][j] = this.fd[i][j]==1?1:0;
            if (this.pd[i][j]===1) {
                checkd[i][j] = 1;
            }
            if (this.puzzle[i][j]==teka.viewer.arukone.Defaults.BLACK ||
                this.puzzle[i][j+1]==teka.viewer.arukone.Defaults.BLACK) {
                checkd[i][j] = 0;
            }
        }
    }

    for (var i=0;i<X;i++) {
        for (var j=0;j<Y;j++) {
            var h = this.countLines(i,j,checkr,checkd);
            if (this.puzzle[i][j]===0) {
                if (h!=0 && h!=2) {
                    this.error[i][j] = true;
                    switch (h) {
                      case 1: return 'arukone_deadend';
                      case 3: return 'arukone_junction';
                      case 4: return 'arukone_crossing';
                    }
                    return '???'; // should never happen...
                }
                continue;
            }

            if (this.puzzle[i][j]==teka.viewer.arukone.Defaults.BLACK) {
                continue;
            }

            if (h!=1) {
                this.error[i][j] = true;
                if (h===0) {
                    return 'arukone_letter_not_connected';
                }
                return 'arukone_letter_connected_several_times';
            }
        }
    }

    var mark = teka.new_array([X,Y],0);

    var c = 0;
    for (var i=0;i<X;i++) {
        for (var j=0;j<Y;j++) {
            if (this.puzzle[i][j]>0 && mark[i][j]===0) {
                var erg = this.followLine(mark,i,j,++c,checkr,checkd);
                if (erg!==this.puzzle[i][j]) {
                    for (var ii=0;ii<X;ii++) {
                        for (var jj=0;jj<Y;jj++) {
                            if (mark[ii][jj]==c) {
                                this.error[ii][jj] = true;
                            }
                        }
                    }
                    return 'arukone_different_letters';
                }
            }
        }
    }

    for (var i=0;i<X;i++) {
        for (var j=0;j<Y;j++) {
            if (mark[i][j]===0 && this.countLines(i,j,checkr,checkd)>0) {
                this.error[i][j] = true;
                return 'arukone_circle';
            }
        }
    }

    return true;
};

/** Count the lines, that start at position x,y. */
teka.viewer.arukone.ArukoneViewer.prototype.countLines = function(x, y, checkr, checkd)
{
    var az = 0;
    if (x>0 && checkr[x-1][y]==1) {
        az++;
    }
    if (x<this.X-1 && checkr[x][y]==1) {
        az++;
    }
    if (y>0 && checkd[x][y-1]==1) {
        az++;
    }
    if (y<this.Y-1 && checkd[x][y]==1) {
        az++;
    }
    return az;
};

/** Find the letter at the other end of a line. */
teka.viewer.arukone.ArukoneViewer.prototype.followLine = function(mark, x, y, val, checkr, checkd)
{
    mark[x][y] = val;

    var c = 0;
    while (true) {
        if (++c>10000) {
            break; // emergency exit
        }

        if (x>0 && checkr[x-1][y]==1 && mark[x-1][y]===0) {
            x--;
        } else if (x<this.X-1 && checkr[x][y]==1 && mark[x+1][y]===0) {
            x++;
        } else if (y>0 && checkd[x][y-1]==1 && mark[x][y-1]===0) {
            y--;
        } else if (y<this.Y-1 && checkd[x][y]==1 && mark[x][y+1]===0) {
            y++;
        } else {
            return false;
        }

        mark[x][y] = val;

        if (this.puzzle[x][y]>0) {
            return this.puzzle[x][y];
        }
    }

    return false;
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
teka.viewer.arukone.ArukoneViewer.prototype.setMetrics = function(g)
{
    this.scale = Math.floor(Math.min((this.width-3)/this.X,
                                     (this.height-3)/this.Y));
    var realwidth = this.X*this.scale+3;
    var realheight = this.Y*this.scale+3;

    this.deltaX = Math.floor((this.width-realwidth)/2)+0.5;
    this.deltaY = Math.floor((this.height-realheight)/2)+0.5;
    this.borderX = 1;
    this.borderY = 1;

    this.font = teka.getFontData(Math.round(this.scale/2)+'px sans-serif',this.scale);
    this.boldfont = teka.getFontData('bold '+Math.round(this.scale/2)+'px sans-serif',this.scale);
    this.smallfont = teka.getFontData(Math.round(this.scale/4)+'px sans-serif',this.scale);

    if (realwidth>this.width || realheight>this.height) {
        this.scale=false;
    }
    return {width:realwidth,height:realheight,scale:this.scale};
};

/** Paints the diagram. */
teka.viewer.arukone.ArukoneViewer.prototype.paint = function(g)
{
    var X = this.X;
    var Y = this.Y;
    var S = this.scale;

    g.save();
    g.translate(this.deltaX+this.borderX,this.deltaY+this.borderY);

    g.fillStyle = '#fff';
    g.fillRect(0,0,S*X,S*Y);

    // paint background of the cells
    for (var i=0;i<X;i++) {
        for (var j=0;j<Y;j++) {
            g.fillStyle = this.isBlinking()?
                this.getBlinkColor(i,j,X,this.fr[i%(X-1)][j]):
                (this.error[i][j]?'#f00':'#fff');
            g.fillRect(i*S,j*S,S,S);
        }
    }

    // paint grid
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

    // paint symbols on vertical edges
    g.lineCap = 'square';
    for (var i=0;i<X-1;i++) {
        for (var j=0;j<Y;j++) {
            if (this.pr[i][j]==1) {
                g.strokeStyle = '#000';
                g.lineWidth = 5;
                teka.drawLine(g,i*S+Math.floor(S/2),j*S+Math.floor(S/2),
                              (i+1)*S+Math.floor(S/2),j*S+Math.floor(S/2));
                g.lineWidth = 1;
                continue;
            }
            if (this.puzzle[i][j]==teka.viewer.arukone.Defaults.BLACK ||
                this.puzzle[i+1][j]==teka.viewer.arukone.Defaults.BLACK) {
                continue;
            }
            g.strokeStyle = this.getColorString(this.cr[i][j]);
            switch (this.fr[i][j]) {
              case 1:
                g.lineWidth = 5;
                teka.drawLine(g,i*S+Math.floor(S/2),j*S+Math.floor(S/2),
                              (i+1)*S+Math.floor(S/2),j*S+Math.floor(S/2));
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

    // paint symbols on horizontal edges
    for (var i=0;i<X;i++) {
        for (var j=0;j<Y-1;j++) {
            if (this.pd[i][j]==1) {
                g.strokeStyle = '#000';
                g.lineWidth = 5;
                teka.drawLine(g,i*S+Math.floor(S/2),j*S+Math.floor(S/2),
                              i*S+Math.floor(S/2),(j+1)*S+Math.floor(S/2));
                g.lineWidth = 1;
                continue;
            }
            if (this.puzzle[i][j]==teka.viewer.arukone.Defaults.BLACK ||
                this.puzzle[i][j+1]==teka.viewer.arukone.Defaults.BLACK) {
                continue;
            }
            g.strokeStyle = this.getColorString(this.cd[i][j]);
            switch (this.fd[i][j]) {
              case 1:
                g.lineWidth = 5;
                teka.drawLine(g,i*S+Math.floor(S/2),j*S+Math.floor(S/2),
                              i*S+Math.floor(S/2),(j+1)*S+Math.floor(S/2));
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

    // paint content of the cells
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    for (var i=0;i<X;i++) {
        for (var j=0;j<Y;j++) {
            if (this.puzzle[i][j]==teka.viewer.arukone.Defaults.BLACK) {
                g.fillStyle = '#000';
                g.fillRect(i*S,j*S,S,S);
                continue;
            }

            if (this.puzzle[i][j]>0) {
                g.fillStyle = this.isBlinking()?
                    this.getBlinkColor(i,j,X,this.fr[i%(X-1)][j]):
                    (this.error[i][j]?'#f00':'#fff');
                teka.fillOval(g,i*S+S/2,j*S+S/2,S/2-S/6);
                g.fillStyle = '#000';
                g.font = this.boldfont.font;
                if (this.letters===true) {
                    g.fillText(teka.chr(teka.ord('A')+this.puzzle[i][j]-1),
                               i*S+S/2,j*S+S/2+this.boldfont.delta);
                } else {
                    g.fillText(this.puzzle[i][j],
                               i*S+S/2,j*S+S/2+this.boldfont.delta);
                }
                continue;
            }

            if (this.f[i][j]==1) {
                g.strokeStyle = this.getColorString(this.c[i][j]);
                teka.drawLine(g,i*S+S/8,j*S+S/8,(i+1)*S-S/8,(j+1)*S-S/8);
                teka.drawLine(g,i*S+S/8,(j+1)*S-S/8,(i+1)*S-S/8,j*S+S/8);
                continue;
            }

            if (this.end[i][j]>0) {
                g.save();
                g.textAlign = 'left';
                g.textBaseline = 'bottom';
                g.fillStyle = '#000';
                g.font = this.smallfont.font;
                if (this.letters===true) {
                    g.fillText(teka.chr(teka.ord('A')+this.end[i][j]-1),
                               i*S+S/2+2,j*S+S/2-2+this.smallfont.delta);
                } else {
                    g.fillText(this.end[i][j],
                               i*S+S/2+2,j*S+S/2-2+this.smallfont.delta);
                }
                g.restore();
            }
        }
    }

    // paint cursor
    if (this.mode==teka.viewer.Defaults.NORMAL) {
        if (this.cursor_mode==teka.viewer.arukone.Defaults.CELL) {
            g.fillStyle = '#f00';
            g.fillRect(Math.floor(this.x*S+S/2)-3.5,Math.floor(this.y*S+S/2)-3.5,7,7);
        } else if (this.cursor_mode==teka.viewer.arukone.Defaults.V_EDGE) {
            g.strokeStyle = '#f00';
            g.lineWidth = 3;
            teka.drawLine(g,(this.x+1)*S-S/10,this.y*S+S/2-S/10,(this.x+1)*S+S/10,this.y*S+S/2+S/10);
            teka.drawLine(g,(this.x+1)*S-S/10,this.y*S+S/2+S/10,(this.x+1)*S+S/10,this.y*S+S/2-S/10);
        } else {
            g.strokeStyle = '#f00';
            g.lineWidth = 3;
            teka.drawLine(g,this.x*S+S/2-S/10,(this.y+1)*S-S/10,this.x*S+S/2+S/10,(this.y+1)*S+S/10);
            teka.drawLine(g,this.x*S+S/2-S/10,(this.y+1)*S+S/10,this.x*S+S/2+S/10,(this.y+1)*S-S/10);
        }
    }

    g.restore();
};

//////////////////////////////////////////////////////////////////

/** Handles mousemove event. */
teka.viewer.arukone.ArukoneViewer.prototype.processMousemoveEvent = function(xc, yc, pressed)
{
    this.coord = this.normalizeCoordinates(xc,yc);

    var oldx = this.x;
    var oldy = this.y;
    var old_cursor = this.cursor_mode;

    if (this.start===undefined ||
        this.start.x!=this.coord.x ||
        this.start.y!=this.coord.y) {
        this.moved = true;
    }

    if (this.coord.x<0 || this.coord.x>=this.X ||
        this.coord.y<0 || this.coord.y>=this.Y) {
        return false;
    }

    this.x = this.coord.x;
    this.y = this.coord.y;

    if (pressed
        && this.cursor_mode==teka.viewer.arukone.Defaults.CELL) {
        this.processMousedraggedEvent(xc,yc);
        return true;
    }

    this.checkCloseToEdge(this.coord);

    return this.x!=oldx || this.y!=oldy || this.cursor_mode!=old_cursor;
};

/** Handles mousedown event. */
teka.viewer.arukone.ArukoneViewer.prototype.processMousedownEvent = function(xc, yc)
{
    this.processMousemoveEvent(xc,yc,false);

    this.startx = xc;
    this.starty = yc;
    this.start = this.coord;
    this.moved = false;

    return true;
};

/** Handles mouseup event. */
teka.viewer.arukone.ArukoneViewer.prototype.processMouseupEvent = function(xc, yc)
{
    this.processMousemoveEvent(xc,yc,false);

    if (!this.moved)
        {
            if (this.start.top==this.coord.top &&
                this.start.bottom==this.coord.bottom &&
                this.cursor_mode==teka.viewer.arukone.Defaults.H_EDGE) {
                this.setEdge(this.x,this.y,this.get(this.x,this.y,false)==2?0:2,false);
            }
            if (this.start.left==this.coord.left &&
                this.start.right==this.coord.right &&
                this.cursor_mode==teka.viewer.arukone.Defaults.V_EDGE) {
                this.setEdge(this.x,this.y,this.get(this.x,this.y,true)==2?0:2,true);
            }
            if (this.cursor_mode==teka.viewer.arukone.Defaults.CELL) {
                this.set(this.x,this.y,!this.f[this.x][this.y]);
            }
        }

    this.startx = false;
    this.starty = false;

    return true;
};

/**
 * Handles pseudo event 'mousedragged'
 * Horizontal and vertical lines are treated separately, as
 * much faster algorithms can be applied and they should make up the
 * majority of use cases.
 */
teka.viewer.arukone.ArukoneViewer.prototype.processMousedraggedEvent = function(xc, yc)
{
    if (this.startx===false || this.starty===false) {
        this.startx = xc;
        this.starty = yc;
        this.start = this.coord;
        this.moved = false;
        return;
    }

    var lastx = this.startx;
    var lasty = this.starty;
    this.startx = xc;
    this.starty = yc;

    var from = this.normalizeCoordinates(lastx,lasty);
    var to = this.normalizeCoordinates(this.startx,this.starty);

    if (from.x==to.x && from.y==to.y) {
        return;
    }

    // horizontal line
    if (from.y==to.y) {
        if (to.x>from.x) {
            for (var x=from.x;x<to.x;x++) {
                this.setEdge(x,from.y,(this.get(x,from.y,true)+1)%2,true);
            }
        }
        else {
            for (var x=from.x;x>to.x;x--) {
                this.setEdge(x-1,from.y,(this.get(x-1,from.y,true)+1)%2,true);
            }
        }
        return;
    }

    // vertical line
    if (from.x==to.x) {
        if (to.y>from.y) {
            for (var y=from.y;y<to.y;y++) {
                this.setEdge(from.x,y,(this.get(from.x,y,false)+1)%2,false);
            }
        }
        else {
            for (var y=from.y;y>to.y;y--) {
                this.setEdge(from.x,y-1,(this.get(from.x,y-1,false)+1)%2,false);
            }
        }
        return;
    }

    // draw line from from to to
    while (from.x!=to.x || from.y!=to.y) {
        if (Math.abs(to.x-from.x)>=Math.abs(to.y-from.y)) {
            if (to.x>from.x) {
                this.setEdge(from.x,from.y,(this.get(from.x,from.y,true)+1)%2,true);
                from.x++;
            } else {
                this.setEdge(from.x-1,from.y,(this.get(from.x-1,from.y,true)+1)%2,true);
                from.x--;
            }
        } else {
            if (to.y>from.y) {
                this.setEdge(from.x,from.y,(this.get(from.x,from.y,false)+1)%2,false);
                from.y++;
            } else {
                this.setEdge(from.x,from.y-1,(this.get(from.x,from.y-1,false)+1)%2,false);
                from.y--;
            }
        }
    }
};

/** Handles keydown event. */
teka.viewer.arukone.ArukoneViewer.prototype.processKeydownEvent = function(e)
{
    if (e.key==teka.KEY_DOWN) {
        if (this.y<this.Y-1) {
            if (e.shift) {
                this.setEdge(this.x,this.y,(this.get(this.x,this.y,false)+1)%2,false);
            }
            this.y++;
        }
        return true;
    }
    if (e.key==teka.KEY_UP) {
        if (this.y>0) {
            if (e.shift) {
                this.setEdge(this.x,this.y-1,(this.get(this.x,this.y-1,false)+1)%2,false);
            }
            this.y--;
        }
        return true;
    }
    if (e.key==teka.KEY_RIGHT) {
        if (this.x<this.X-1) {
            if (e.shift) {
                this.setEdge(this.x,this.y,(this.get(this.x,this.y,true)+1)%2,true);
            }
            this.x++;
        }
        return true;
    }
    if (e.key==teka.KEY_LEFT) {
        if (this.x>0) {
            if (e.shift) {
                this.setEdge(this.x-1,this.y,(this.get(this.x-1,this.y,true)+1)%2,true);
            }
            this.x--;
        }
        return true;
    }

    if (e.key==teka.KEY_SPACE) {
        this.set(this.x,this.y,0);
        return true;
    }

    if (e.key==teka.KEY_HASH || e.key==teka.KEY_X) {
        this.set(this.x,this.y,1);
        return true;
    }

    return false;
};

//////////////////////////////////////////////////////////////////

/**
 * If mouse is close to an edge, replace the normal cursor by an
 * edge cursor.
 */
teka.viewer.arukone.ArukoneViewer.prototype.checkCloseToEdge = function(coord)
{
    if (coord.center) {
        this.cursor_mode = teka.viewer.arukone.Defaults.CELL;
        return;
    }

    if (coord.left && coord.x>0) {
        this.cursor_mode = teka.viewer.arukone.Defaults.V_EDGE;
        this.x--;
        return;
    }

    if (coord.right && coord.x<this.X-1) {
        this.cursor_mode = teka.viewer.arukone.Defaults.V_EDGE;
        return;
    }

    if (coord.top && coord.y>0) {
        this.cursor_mode = teka.viewer.arukone.Defaults.H_EDGE;
        this.y--;
        return;
    }

    if (coord.bottom && coord.y<this.Y-1) {
        this.cursor_mode = teka.viewer.arukone.Defaults.H_EDGE;
        return;
    }

    this.cursor_mode = teka.viewer.arukone.Defaults.CELL;
};

//////////////////////////////////////////////////////////////////

/** Sets the value of an edge, if the color fits. */
teka.viewer.arukone.ArukoneViewer.prototype.setEdge = function(x, y, value, vertical)
{
    if (vertical) {
        this.setVertical(x,y,value);
    } else {
        this.setHorizontal(x,y,value);
    }
    this.updateEnds();
};

/** Sets the value of a vertical edge. */
teka.viewer.arukone.ArukoneViewer.prototype.setVertical = function(x, y, value)
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

/** Sets the value of a horizontal edge. */
teka.viewer.arukone.ArukoneViewer.prototype.setHorizontal = function(x, y, value)
{
    if (x<0 || x>=this.X || y<0 || y>=this.Y-1) {
        return;
    }

    if (this.fd[x][y]!=0 && this.cd[x][y]!=this.color) {
        return;
    }

    this.fd[x][y] = value;
    this.cd[x][y] = this.color;
};

/** Gets the value of an edge. */
teka.viewer.arukone.ArukoneViewer.prototype.get = function(x, y, vertical)
{
    if (vertical) {
        if (x<0 || x>=this.X-1 || y<0 || y>=this.Y) {
            return 0;
        }

        return this.fr[x][y];
    }

    if (x<0 || x>=this.X || y<0 || y>=this.Y-1) {
        return 0;
    }

    return this.fd[x][y];
};

/** Sets the value of a cell, if the color fits. */
teka.viewer.arukone.ArukoneViewer.prototype.set = function(x,y,value)
{
    if (this.f[x][y]!=0 && this.c[x][y]!=this.color) {
        return;
    }

    this.f[x][y] = value;
    this.c[x][y] = this.color;
};

//////////////////////////////////////////////////////////////////

/** Calculate small letters at the end of a line. */
teka.viewer.arukone.ArukoneViewer.prototype.updateEnds = function()
{
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            this.end[i][j] = 0;
        }
    }

    var mark = teka.new_array([this.X,this.Y],0);

    var c = 0;
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            if (this.puzzle[i][j]>0 && mark[i][j]===0) {
                this.fill(mark,i,j,this.puzzle[i][j],++c);
            }
        }
    }
};

/** Floodfill connected area and mark ends with letter val. */
teka.viewer.arukone.ArukoneViewer.prototype.fill = function(mark, x, y, endval, val)
{
    if (mark[x][y]!==0) {
        return;
    }

    if (this.isDeadEnd(x,y)) {
        this.end[x][y] = endval;
    }
    mark[x][y] = val;

    if (x>0 && (this.fr[x-1][y]==1 || this.pr[x-1][y]==1)) {
        this.fill(mark,x-1,y,endval,val);
    }
    if (x<this.X-1 && (this.fr[x][y]==1 || this.pr[x][y]==1)) {
        this.fill(mark,x+1,y,endval,val);
    }
    if (y>0 && (this.fd[x][y-1]==1 || this.pd[x][y-1]==1)) {
        this.fill(mark,x,y-1,endval,val);
    }
    if (y<this.Y-1 && (this.fd[x][y]==1 || this.pd[x][y]==1)) {
        this.fill(mark,x,y+1,endval,val);
    }
};

/** Check, if a dead end is at position x,y */
teka.viewer.arukone.ArukoneViewer.prototype.isDeadEnd = function(x, y)
{
    var az = 0;
    if (x>0 && (this.fr[x-1][y]==1 || this.pr[x-1][y]==1)) {
        az++;
    }
    if (x<this.X-1 && (this.fr[x][y]==1 || this.pr[x][y]==1)) {
        az++;
    }
    if (y>0 && (this.fd[x][y-1]==1 || this.pd[x][y-1]==1)) {
        az++;
    }
    if (y<this.Y-1 && (this.fd[x][y]==1 || this.pd[x][y]==1)) {
        az++;
    }
    return az==1;
};
