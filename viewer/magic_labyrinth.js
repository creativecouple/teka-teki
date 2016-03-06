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
teka.viewer.magic_labyrinth = {};

/** Some constants. */
teka.viewer.magic_labyrinth.Defaults = {
    NONE: 0
};

/** Constructor */
teka.viewer.magic_labyrinth.Magic_labyrinthViewer = function(data)
{
    teka.viewer.PuzzleViewer.call(this,data);

    this.x = 0;
    this.y = 0;
    this.xm = 0;
    this.ym = 0;
    this.exp = false;
};
teka.extend(teka.viewer.magic_labyrinth.Magic_labyrinthViewer,teka.viewer.PuzzleViewer);

//////////////////////////////////////////////////////////////////

/** Initialize this viewer width the PSData object provided. */
teka.viewer.magic_labyrinth.Magic_labyrinthViewer.prototype.initData = function(data)
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
teka.viewer.magic_labyrinth.Magic_labyrinthViewer.prototype.asciiToData = function(ascii)
{
    if (ascii===false) {
        return;
    }

    var grid = this.asciiToArray(ascii);

    this.puzzle = teka.new_array([this.X,this.X],0);
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.X;j++) {
            this.puzzle[i][j] = grid[2*i+1][2*j+1]==teka.ord(' ')?0:(grid[2*i+1][2*j+1]==teka.ord('-')?-1:(grid[2*i+1][2*j+1]-teka.ord('0')));
        }
    }

    this.lrmaze = teka.new_array([this.X+1,this.X],false);
    for (var i=0;i<=this.X;i++) {
        for (var j=0;j<this.X;j++) {
            this.lrmaze[i][j] = grid[2*i][2*j+1]==teka.ord('|');
        }
    }

    this.udmaze = teka.new_array([this.X,this.X+1],false);
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<=this.X;j++) {
            this.udmaze[i][j] = grid[2*i+1][2*j]==teka.ord('-');
        }
    }
};

/** Read solution from ascii art. */
teka.viewer.magic_labyrinth.Magic_labyrinthViewer.prototype.asciiToSolution = function(ascii)
{
    if (ascii===false) {
        return;
    }

    var grid = this.asciiToArray(ascii);

    this.solution = teka.new_array([this.X,this.X],0);
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.X;j++) {
            this.solution[i][j] = grid[i][j]==teka.ord(' ')?0:(grid[i][j]-teka.ord('0'));
        }
    }
};

/** Add solution. */
teka.viewer.magic_labyrinth.Magic_labyrinthViewer.prototype.addSolution = function()
{
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.X;j++) {
            this.f[i][j] = this.solution[i][j];
        }
    }
};

//////////////////////////////////////////////////////////////////

/** Returns a small example. */
teka.viewer.magic_labyrinth.Magic_labyrinthViewer.prototype.getExample = function()
{
    return '/type (magic_labyrinth)\n/sol false\n/size 5\n/max 3'
        +'\n/puzzle [ (+-+-+-+-+-+) (|  1     3|) (+ +-+-+-+ +) (|      1| |)'
        +' (+-+-+-+ + +) (|2    | | |) (+ +-+ + + +) (|   |2  | |) (+-+ +-+-+ +)'
        +' (    |     |) (+-+-+-+-+-+) ]'
        +'\n/solution [ ( 1 23) (32 1 ) (231  ) (  231) (1 3 2) ]';
};

/** Returns a list of automatically generated properties. */
teka.viewer.magic_labyrinth.Magic_labyrinthViewer.prototype.getProperties = function()
{
    return [teka.translate('generic_size',[this.X+'x'+this.Y])];
};

//////////////////////////////////////////////////////////////////

/** Reset the whole diagram. */
teka.viewer.magic_labyrinth.Magic_labyrinthViewer.prototype.reset = function()
{
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.X;j++) {
            this.f[i][j]=0;
        }
    }
};

/** Reset the error marks. */
teka.viewer.magic_labyrinth.Magic_labyrinthViewer.prototype.clearError = function()
{
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.X;j++) {
            this.error[i][j]=false;
        }
    }
};

/** Copy digits colored with this.color to color. */
teka.viewer.magic_labyrinth.Magic_labyrinthViewer.prototype.copyColor = function(color)
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
teka.viewer.magic_labyrinth.Magic_labyrinthViewer.prototype.clearColor = function(color)
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
teka.viewer.magic_labyrinth.Magic_labyrinthViewer.prototype.saveState = function()
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
teka.viewer.magic_labyrinth.Magic_labyrinthViewer.prototype.loadState = function(state)
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
teka.viewer.magic_labyrinth.Magic_labyrinthViewer.prototype.check = function()
{
    var X = this.X;

    for (var i=0;i<X;i++) {
        for (var j=0;j<X;j++) {
            if (this.puzzle[i][j]!=0) {
                this.f[i][j] = this.puzzle[i][j]==-1?0:this.puzzle[i][j];
            }
        }
    }

    var check = teka.new_array([X,X],0);
    for (var i=0;i<X;i++) {
        for (var j=0;j<X;j++) {
            if (this.f[i][j]>=1000) {
                check[i][j] = this.getExpert(this.f[i][j]);
                if (check[i][j]==teka.viewer.magic_labyrinth.Defaults.NONE && this.f[i][j]!=1000) {
                    this.error[i][j] = true;
                    return 'magic_labyrinth_not_unique';
                }
                if (check[i][j]==100) {
                    check[i][j]=0;
                }
            } else if (this.f[i][j]==100) {
                check[i][j] = 0;
            } else {
                check[i][j] = this.f[i][j];
            }
        }
    }

    for (var j=0;j<X;j++) {
        var da = teka.new_array([this.MAX],0);
        for (var i=0;i<X;i++) {
            if (check[i][j]>0 && check[i][j]<=this.MAX) {
                da[check[i][j]-1]++;
            }
        }

        for (var i=0;i<this.MAX;i++) {
            if (da[i]>1) {
                for (var k=0;k<X;k++) {
                    if (check[k][j]-1==i) {
                        this.error[k][j] = true;
                    }
                }
                return 'magic_labyrinth_row_duplicate';
            }
            if (da[i]===0) {
                for (var k=0;k<X;k++) {
                    this.error[k][j] = true;
                }
                return {text:'magic_labyrinth_row_missing',param:[i+1]};
            }
        }
    }

    for (var i=0;i<X;i++) {
        var da = teka.new_array([this.MAX],0);
        for (var j=0;j<X;j++) {
            if (check[i][j]>0 && check[i][j]<=this.MAX) {
                da[check[i][j]-1]++;
            }
        }

        for (var j=0;j<this.MAX;j++) {
            if (da[j]>1) {
                for (var k=0;k<X;k++) {
                    if (check[i][k]-1==j) {
                        this.error[i][k] = true;
                    }
                }
                return 'magic_labyrinth_column_duplicate';
            }
            if (da[j]===0) {
                for (var k=0;k<X;k++) {
                    this.error[i][k] = true;
                }
                return {text:'magic_labyrinth_column_missing',param:[j+1]};
            }
        }
    }

    var sx = 0;
    var sy = 0;
    for (var i=0;i<X;i++) {
        if (!this.udmaze[i][0]) {
            sx = i; sy = 0;
        }
        if (!this.udmaze[i][X]) {
            sx = i; sy = X-1;
        }
    }
    for (var j=0;j<X;j++) {
        if (!this.lrmaze[0][j]) {
            sx = 0; sy = j;
        }
        if (!this.lrmaze[X][j]) {
            sx = X-1; sy = j;
        }
    }

    var used = teka.new_array([X,X],false);
    var nr = 1;
    while (true) {
        if (check[sx][sy]!=0 && check[sx][sy]!=nr) {
            this.error[sx][sy] = true;
            return {text:'magic_labyrinth_wrong_number',param:[nr]};
        }
        if (check[sx][sy]==nr) {
            nr = (nr%this.MAX)+1;
        }

        used[sx][sy] = true;

        if (sx>0 && !this.lrmaze[sx][sy] && !used[sx-1][sy]) {
            sx--;
            continue;
        }
        if (sx<X-1 && !this.lrmaze[sx+1][sy] && !used[sx+1][sy]) {
            sx++;
            continue;
        }
        if (sy>0 && !this.udmaze[sx][sy] && !used[sx][sy-1]) {
            sy--;
            continue;
        }
        if (sy<X-1 && !this.udmaze[sx][sy+1] && !used[sx][sy+1]) {
            sy++;
            continue;
        }
        break;
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
teka.viewer.magic_labyrinth.Magic_labyrinthViewer.prototype.setMetrics = function(g)
{
    this.scale = Math.floor(Math.min((this.width-3)/this.X,
                                     (this.height-3-(this.textHeight+2))/this.X));
    var realwidth = this.X*this.scale+3;
    var realheight = this.X*this.scale+3+this.textHeight+2;

    this.bottomText = teka.translate('magic_labyrinth_digits',[this.MAX]);
    g.font = 'bold '+this.textHeight+'px sans-serif';
    var textwidth = g.measureText(this.bottomText).width+1;
    realwidth = Math.max(realwidth,textwidth);

    this.deltaX = Math.floor((this.width-realwidth)/2)+0.5;
    this.deltaY = Math.floor((this.height-realheight)/2)+0.5;
    this.borderX = 1;
    this.borderY = 1;

    this.font = teka.getFontData(Math.round(this.scale/2)+'px sans-serif',this.scale);
    this.boldfont = teka.getFontData('bold '+Math.round(this.scale/2)+'px sans-serif',this.scale);
    this.mediumfont = teka.getFontData(Math.round(this.scale/3)+'px sans-serif',this.scale);
    this.smallfont = teka.getFontData(Math.round((this.scale-6)/4)+'px sans-serif',this.scale);

    if (realwidth>this.width || realheight>this.height) {
        this.scale=false;
    }
    return {width:realwidth,height:realheight,scale:this.scale};
};

/** Paints the diagram. */
teka.viewer.magic_labyrinth.Magic_labyrinthViewer.prototype.paint = function(g)
{
    var X = this.X;
    var S = this.scale;

    g.save();
    g.translate(this.deltaX+this.borderX,this.deltaY+this.borderY);

    g.fillStyle = '#fff';
    g.fillRect(0,0,X*S,X*S);

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
    for (var i=1;i<X;i++) {
        teka.drawLine(g,0,i*S,X*S,i*S);
        teka.drawLine(g,i*S,0,i*S,X*S);
    }

    g.lineCap = 'square';
    for (var i=0;i<=X;i++) {
        for (var j=0;j<X;j++) {
            if (this.lrmaze[i][j]) {
                g.lineWidth = 3;
                teka.drawLine(g,i*S,j*S,i*S,(j+1)*S);
                g.lineWidth = 1;
            }
        }
    }

    for (var i=0;i<X;i++) {
        for (var j=0;j<=X;j++) {
            if (this.udmaze[i][j]) {
                g.lineWidth = 3;
                teka.drawLine(g,i*S,j*S,(i+1)*S,j*S);
                g.lineWidth = 1;
            }
        }
    }
    g.lineCap = 'butt';

    // paint the content of the cells
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    for (var i=0;i<X;i++) {
        for (var j=0;j<X;j++) {
            if (this.puzzle[i][j]==-1) {
                g.strokeStyle = '#000';
                g.lineWidth = 2;
                teka.drawLine(g,S*i+S/3,S*j+S/2,S*i+2*S/3,S*j+S/2);
                g.lineWidth = 1;
                continue;
            }

            // given numbers
            if (this.puzzle[i][j]!==0) {
                g.fillStyle = '#000';
                g.font = this.boldfont.font;
                g.fillText(this.puzzle[i][j],i*S+S/2,j*S+S/2+this.boldfont.delta);
                continue;
            }

            // empty?
            if (this.f[i][j]==teka.viewer.magic_labyrinth.Defaults.NONE) {
                continue;
            }

            // minus
            if (this.f[i][j]==100) {
                g.strokeStyle = this.getColorString(this.c[i][j]);
                teka.drawLine(g,S*i+S/3,S*j+Math.floor(S/2),S*i+2*S/3,S*j+Math.floor(S/2));
                continue;
            }

            // normal numbers
            if (this.f[i][j]<1000) {
                g.fillStyle = this.getColorString(this.c[i][j]);
                g.font = this.font.font;
                g.fillText(this.f[i][j],i*S+S/2,j*S+S/2+this.font.delta);
                continue;
            }

            if (this.MAX<=3) {
                g.fillStyle = this.getColorString(this.c[i][j]);
                g.font = this.mediumfont.font;
                for (var k=0;k<4;k++) {
                    if (((this.f[i][j]-1000)&(1<<k))!=0) {
                        g.fillText(k===0?'-':k,
                                   S*i+(k%2)*S/2+S/4,
                                   S*j+Math.floor(k/2)*S/2+S/4+this.mediumfont.delta);
                    }
                }

                g.strokeStyle = '#888';
                teka.drawLine(g,i*S+S/8,j*S+S/2,i*S+S-S/8,j*S+S/2);
                teka.drawLine(g,i*S+S/2,j*S+S/8,i*S+S/2,j*S+S-S/8);

                // little x
                teka.drawLine(g,(i+1)*S-S/8-2,(j+1)*S-S/8-2,(i+1)*S-2,(j+1)*S-2);
                teka.drawLine(g,(i+1)*S-S/8-2,(j+1)*S-2,(i+1)*S-2,(j+1)*S-S/8-2);
                continue;
            }

            // numbers in expert mode
            g.fillStyle = this.getColorString(this.c[i][j]);
            g.font = this.smallfont.font;
            for (var k=0;k<=8;k++) {
                if (((this.f[i][j]-1000)&(1<<k))!=0) {
                    g.fillText(k===0?'-':k,
                               S*i+(k%3+1)*S/4,
                               S*j+Math.floor(k/3+1)*S/4+this.smallfont.delta);
                }
            }

            // expert grid
            g.strokeStyle = '#888';
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
        if (this.exp && this.MAX<=8) {
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
teka.viewer.magic_labyrinth.Magic_labyrinthViewer.prototype.processMousemoveEvent = function(xc, yc, pressed)
{
    xc -= this.deltaX+this.borderX;
    yc -= this.deltaY+this.borderY;

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
    this.exp = this.xm>this.scale-this.scale/8 && this.ym>this.scale-this.scale/8;

    return this.x!=oldx || this.y!=oldy || this.exp!=oldexp;
};

/** Handles mousedown event. */
teka.viewer.magic_labyrinth.Magic_labyrinthViewer.prototype.processMousedownEvent = function(xc, yc)
{
    var erg = this.processMousemoveEvent(xc,yc,false);

    if (this.x<0 || this.y<0 || this.x>=this.X || this.y>=this.X) {
        return erg;
    }

    if (this.MAX<=8) {
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
        if (this.MAX<=3) {
            var nr = ((this.xm<2*this.scale/4)?0:1)+2*((this.ym<2*this.scale/4)?0:1);
            if (nr<0 || nr>this.MAX) {
                return erg;
            }

            this.set(this.x,this.y,((this.f[this.x][this.y]-1000)^(1<<nr))+1000);
            return true;
        }

        var nr = ((this.xm<3*this.scale/8)?0:(this.xm>this.scale-3*this.scale/8)?2:1)+
            3*((this.ym<3*this.scale/8)?0:(this.ym>this.scale-3*this.scale/8)?2:1);
        if (nr<0 || nr>this.MAX) {
            return erg;
        }

        this.set(this.x,this.y,((this.f[this.x][this.y]-1000)^(1<<nr))+1000);
        return true;
    }

    if (this.f[this.x][this.y]==this.MAX) {
        this.set(this.x,this.y,100);
    } else if (this.f[this.x][this.y]==100) {
        this.set(this.x,this.y,0);
    } else {
        this.set(this.x,this.y,this.f[this.x][this.y]+1);
    }

    return true;
};

/** Handles keydown event. */
teka.viewer.magic_labyrinth.Magic_labyrinthViewer.prototype.processKeydownEvent = function(e)
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

    if (e.key==teka.KEY_MINUS || e.key==teka.KEY_Q || e.key==teka.KEY_X) {
        if (this.f[this.x][this.y]<1000) {
            this.set(this.x,this.y,100);
        } else {
            this.set(this.x,this.y,((this.f[this.x][this.y]-1000)^1)+1000);
        }
    }

    if (e.key>=teka.KEY_0 && e.key<=teka.KEY_9) {

        var val = e.key-teka.KEY_0;

        if (val>this.MAX) {
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
        if (this.MAX<=8) {
            if (this.f[this.x][this.y]<1000) {
                this.set(this.x,this.y,this.setExpert(this.f[this.x][this.y]));
            } else {
                this.set(this.x,this.y,this.getExpert(this.f[this.x][this.y]));
            }
        }
        return true;
    }

    return true;
};

//////////////////////////////////////////////////////////////////

/** Sets the value of a cell, if the color fits. */
teka.viewer.magic_labyrinth.Magic_labyrinthViewer.prototype.set = function(x, y, value)
{
    if (this.f[x][y]!=0 && this.f[x][y]!=1000 && this.c[x][y]!=this.color) {
        return;
    }
    this.f[x][y] = value;
    this.c[x][y] = this.color;
};

/** Converts from normal mode to expert mode. */
teka.viewer.magic_labyrinth.Magic_labyrinthViewer.prototype.setExpert = function(h)
{
    if (h==100) {
        return 1001;
    }
    if (h===0) {
        return 1000;
    }
    if (h<10) {
        return 1000+(1<<h);
    }
    return 1000;
};

/** Converts back from expert mode to normal mode. */
teka.viewer.magic_labyrinth.Magic_labyrinthViewer.prototype.getExpert = function(h)
{
    var min = 10;
    var max = 0;
    h = h-1000;
    for (var i=0;i<=this.MAX;i++) {
        if ((h&(1<<i))!=0) {
            if (i<min) {
                min=i;
            }
            if (i>max) {
                max=i;
            }
        }
    }
    if (min==10 && max===0) {
        return 0;
    }
    if (min==max && min===0) {
        return 100;
    }
    if (min==max) {
        return min;
    }
    return 0;
};
