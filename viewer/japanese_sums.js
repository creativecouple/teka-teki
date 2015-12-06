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
teka.viewer.japanese_sums = {};

/** Some constants. */
teka.viewer.japanese_sums.Defaults = {
    EMPTY: 0,
    BLOCK: -1,
    DIGIT: -2
};

/** Constructor */
teka.viewer.japanese_sums.Japanese_sumsViewer = function(data)
{
    teka.viewer.PuzzleViewer.call(this,data);

    this.x = 0;
    this.y = 0;
    this.xm = 0;
    this.ym = 0;
    this.exp = false;
};
teka.extend(teka.viewer.japanese_sums.Japanese_sumsViewer,teka.viewer.PuzzleViewer);

//////////////////////////////////////////////////////////////////

/** Initialize this viewer width the PSData object provided. */
teka.viewer.japanese_sums.Japanese_sumsViewer.prototype.initData = function(data)
{
    this.X = parseInt(data.get('X'),10);
    this.Y = parseInt(data.get('Y'),10);
    this.MAX = parseInt(data.get('max'),10);
    this.L = parseInt(data.get('links'),10);
    this.T = parseInt(data.get('oben'),10);
    this.asciiToData(data.get('puzzle'));
    this.asciiToSolution(data.get('solution'));

    this.f = teka.new_array([this.X,this.Y],0);
    this.c = teka.new_array([this.X,this.Y],0);
    this.error = teka.new_array([this.X,this.Y],false);
    this.top_error = teka.new_array([this.X,this.T],false);
    this.left_error = teka.new_array([this.L,this.Y],false);
};

/** Read puzzle from ascii art. */
teka.viewer.japanese_sums.Japanese_sumsViewer.prototype.asciiToData = function(ascii)
{
    if (ascii===false) {
        return;
    }

    var c = this.asciiToArray(ascii);

    this.topdata = teka.new_array([this.X,this.T],0);
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.T;j++) {
            if (c[2*this.L+2+2*i][j]==teka.ord(' ')) {
                this.topdata[i][j] = -1;
            } else if (c[2*this.L+1+2*i][j]==teka.ord(' ')) {
                this.topdata[i][j] = c[2*this.L+2+2*i][j]-teka.ord('0');
            } else {
                this.topdata[i][j] = c[2*this.L+2+2*i][j]-teka.ord('0')
                                 +10*(c[2*this.L+1+2*i][j]-teka.ord('0'));
            }
        }
    }

    this.top_empty = teka.new_array([this.X],true);
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.T;j++) {
            if (this.topdata[i][j]!=-1) {
                this.top_empty[i] = false;
            }
        }
    }

    this.leftdata = teka.new_array([this.L,this.Y],0);
    for (var i=0;i<this.L;i++) {
        for (var j=0;j<this.Y;j++) {
            if (c[2*i+1][this.T+1+j]==teka.ord(' ')) {
                this.leftdata[i][j] = -1;
            } else if (c[2*i][this.T+1+j]==teka.ord(' ')) {
                this.leftdata[i][j] = c[2*i+1][this.T+1+j]-teka.ord('0');
            } else {
                this.leftdata[i][j] = c[2*i+1][this.T+1+j]-teka.ord('0')
                                  +10*(c[2*i][this.T+1+j]-teka.ord('0'));
            }
        }
    }

    this.left_empty = teka.new_array([this.Y],true);
    for (var i=0;i<this.L;i++) {
        for (var j=0;j<this.Y;j++) {
            if (this.leftdata[i][j]!=-1) {
                this.left_empty[j] = false;
            }
        }
    }

    this.puzzle = teka.new_array([this.X,this.Y],0);
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            if (c[2*this.L+2*i+2][this.T+1+j]==teka.ord('#')) {
                this.puzzle[i][j] = -1;
            } else if (c[2*this.L+2*i+2][this.T+1+j]==teka.ord(' ')
                       || c[2*this.L+2*i+2][this.T+1+j]==teka.ord('.')) {
                this.puzzle[i][j] = 0;
            } else if (c[2*this.L+2*i+1][this.T+1+j]==teka.ord(' ')) {
                this.puzzle[i][j] = c[2*this.L+2*i+2][this.T+1+j]-teka.ord('0');
            } else {
                this.puzzle[i][j] = c[2*this.L+2*i+2][this.T+1+j]-teka.ord('0')
                                    +10*(c[2*this.L+2*i+1][this.T+1+j]-teka.ord('0'));
            }
        }
    }
};

/** Read solution from ascii art. */
teka.viewer.japanese_sums.Japanese_sumsViewer.prototype.asciiToSolution = function(ascii)
{
    if (ascii===false) {
        return;
    }

    var c = this.asciiToArray(ascii);

    this.solution = teka.new_array([this.X,this.Y],0);
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            this.solution[i][j] = c[i][j]==teka.ord('#')
                ?teka.viewer.japanese_sums.Defaults.BLOCK
                :(c[i][j]-teka.ord('0'));
        }
    }
};

/** Add solution. */
teka.viewer.japanese_sums.Japanese_sumsViewer.prototype.addSolution = function()
{
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            this.f[i][j] = this.solution[i][j];
        }
    }
};

//////////////////////////////////////////////////////////////////

/** Returns a small example. */
teka.viewer.japanese_sums.Japanese_sumsViewer.prototype.getExample = function()
{
    return '/format 1\n/type (japanese_sums)\n/sol false\n/X 4\n/Y 4\n/max 3\n/links 2\n/oben 2\n'
        +'/puzzle [ (        3   3) (      4 2 4 3) (    +--------) ( 3 2| . . . .) '
        +'(   4| . . . .) ( 3 1| . . . .) ( 3 3| . . . .) ]\n'
        +'/solution [ (#3#2) (##31) (3#1#) (12#3) ]';
};

/** Returns a list of automatically generated properties. */
teka.viewer.japanese_sums.Japanese_sumsViewer.prototype.getProperties = function()
{
    return [teka.translate('japanese_sums_prop_size',[this.X+'x'+this.Y]),
            teka.translate('japanese_sums_digits',[this.MAX])];
};

//////////////////////////////////////////////////////////////////

/** Reset the whole diagram. */
teka.viewer.japanese_sums.Japanese_sumsViewer.prototype.reset = function()
{
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            this.f[i][j]=0;
            this.c[i][j]=0;
        }
    }
};

/** Reset the error marks. */
teka.viewer.japanese_sums.Japanese_sumsViewer.prototype.clearError = function()
{
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            this.error[i][j] = false;
        }
    }
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.T;j++) {
            this.top_error[i][j] = false;
        }
    }
    for (var i=0;i<this.L;i++) {
        for (var j=0;j<this.Y;j++) {
            this.left_error[i][j] = false;
        }
    }
};

/** Copy digits colored with this.color to color. */
teka.viewer.japanese_sums.Japanese_sumsViewer.prototype.copyColor = function(color)
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
teka.viewer.japanese_sums.Japanese_sumsViewer.prototype.clearColor = function(color)
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
teka.viewer.japanese_sums.Japanese_sumsViewer.prototype.saveState = function()
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
teka.viewer.japanese_sums.Japanese_sumsViewer.prototype.loadState = function(state)
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
teka.viewer.japanese_sums.Japanese_sumsViewer.prototype.check = function()
{
    var X = this.X;
    var Y = this.Y;

    // copy to check, removing expert mode and other fancy stuff
    var check = teka.new_array([X,Y],0);
    for (var i=0;i<X;i++) {
        for (var j=0;j<Y;j++) {
            if (this.puzzle[i][j]!=0) {
                check[i][j] = this.puzzle[i][j]==-1?
                    teka.viewer.japanese_sums.Defaults.BLOCK:
                    this.puzzle[i][j];
                continue;
            }

            if (this.f[i][j]==0 || this.f[i][j]==1000) {
                this.error[i][j] = true;
                return 'japanese_sums_empty';
            }

            if (this.f[i][j]==teka.viewer.japanese_sums.Defaults.BLOCK
                || (this.f[i][j]>=1 && this.f[i][j]<=this.MAX)) {
                check[i][j] = this.f[i][j];
                continue;
            }

            if (this.f[i][j]>=1000) {
                check[i][j] = this.getExpert(this.f[i][j]);
                if (check[i][j]<1 || check[i][j]>this.MAX) {
                    this.error[i][j] = true;
                    return 'japanese_sums_not_unique';
                }
                continue;
            }

            if (this.f[i][j]>100) {
                var min = this.f[i][j]%10;
                var max = Math.floor((this.f[i][j]-100)/10);
                if (min==0 && max==1) {
                    min = 1;
                }
                if (min==this.MAX && max==0) {
                    max = this.MAX;
                }
                if (min!=max) {
                    this.error[i][j] = true;
                    return 'japanese_sums_not_unique';
                }
                check[i][j] = min;
                continue;
            }

            this.error[i][j] = true;
            return 'japanese_sums_not_unique';
        }
    }

    // check for same digits in row
    for (var j=0;j<Y;j++) {
        var da = teka.new_array([this.MAX+1],false);
        for (var i=0;i<X;i++) {
            if (check[i][j]>0) {
                if (da[check[i][j]]) {
                    for (var ii=0;ii<X;ii++) {
                        if (check[i][j]==check[ii][j]) {
                            this.error[ii][j] = true;
                        }
                    }
                    return 'japanese_sums_row_duplicate';
                }
                da[check[i][j]] = true;
            }
        }
    }

    // check for same digits in column
    for (var i=0;i<X;i++) {
        var da = teka.new_array([this.MAX+1],false);
        for (var j=0;j<Y;j++) {
            if (check[i][j]>0) {
                if (da[check[i][j]]) {
                    for (var jj=0;jj<Y;jj++) {
                        if (check[i][j]==check[i][jj]) {
                            this.error[i][jj] = true;
                        }
                    }
                    return 'japanese_sums_column_duplicate';
                }
                da[check[i][j]] = true;
            }
        }
    }

    // check if horizontal sums are correct
    for (var j=0;j<Y;j++) {
        if (!this.left_empty[j]) {
            var erg = this.checkHorizontalSums(j,check);
            if (erg!==null) {
                return erg;
            }
        }
    }

    // check if vertical sums are correct
    for (var i=0;i<X;i++) {
        if (!this.top_empty[i]) {
            var erg = this.checkVerticalSums(i,check);
            if (erg!==null) {
                return erg;
            }
        }
    }

    return true;
};

/** check horizontal sums */
teka.viewer.japanese_sums.Japanese_sumsViewer.prototype.checkHorizontalSums = function(y, f)
{
    var sp = teka.new_array([this.L],0);
    var ep = teka.new_array([this.L],0);
    var sums = teka.new_array([this.L],-1);

    var wrong_count = false;

    var az = -1;
    var lastblack = true;
    for (var i=this.X-1;i>=0;i--) {
        if (lastblack && f[i][y]!=teka.viewer.japanese_sums.Defaults.BLOCK) {
            az++;
            if (az>=this.L) {
                wrong_count = true;
                break;
            }
            sums[az]=0;
            sp[az] = i;
        }

        if (f[i][y]!=teka.viewer.japanese_sums.Defaults.BLOCK) {
            sums[az]+=f[i][y];
            ep[az] = i;
        }

        lastblack = f[i][y]==teka.viewer.japanese_sums.Defaults.BLOCK;
    }

    for (var i=0;i<this.L;i++) {
        if ((sums[i]==-1 && this.leftdata[this.L-i-1][y]!=-1)
            || (sums[i]!=-1 && this.leftdata[this.L-i-1][y]==-1)) {
            wrong_count = true;
        }
    }

    if (wrong_count) {
        for (var k=0;k<this.X;k++) {
            this.error[k][y] = true;
        }
        return 'japanese_sums_row_count';
    }

    for (var i=this.L-1;i>=0;i--) {
        if (sums[i]!=this.leftdata[this.L-i-1][y]) {
            this.left_error[this.L-i-1][y] = true;
            for (var k=ep[i];k<=sp[i];k++) {
                this.error[k][y] = true;
            }
            return 'japanese_sums_sum_wrong';
        }
    }

    return null;
};

/** check vertical sums */
teka.viewer.japanese_sums.Japanese_sumsViewer.prototype.checkVerticalSums = function(x, f)
{
    var sp = teka.new_array([this.T],0);
    var ep = teka.new_array([this.T],0);
    var sums = teka.new_array([this.T],-1);

    var wrong_count = false;

    var az = -1;
    var lastblack = true;
    for (var j=this.Y-1;j>=0;j--) {
        if (lastblack && f[x][j]!=teka.viewer.japanese_sums.Defaults.BLOCK) {
            az++;
            if (az>=this.T) {
                wrong_count = true;
                break;
            }
            sums[az]=0;
            sp[az] = j;
        }

        if (f[x][j]!=teka.viewer.japanese_sums.Defaults.BLOCK) {
            sums[az]+=f[x][j];
            ep[az] = j;
        }

        lastblack = f[x][j]==teka.viewer.japanese_sums.Defaults.BLOCK;
    }

    for (var j=0;j<this.T;j++) {
        if ((sums[j]==-1 && this.topdata[x][this.T-j-1]!=-1)
            || (sums[j]!=-1 && this.topdata[x][this.T-j-1]==-1)) {
            wrong_count = true;
        }
    }

    if (wrong_count) {
        for (var k=0;k<this.Y;k++) {
            this.error[x][k] = true;
        }
        return 'japanese_sums_column_count';
    }

    for (var j=this.T-1;j>=0;j--) {
        if (sums[j]!=this.topdata[x][this.T-j-1]) {
            this.top_error[x][this.T-j-1] = true;
            for (var k=ep[j];k<=sp[j];k++) {
                this.error[x][k] = true;
            }
            return 'japanese_sums_sum_wrong';
        }
    }

    return null;
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
teka.viewer.japanese_sums.Japanese_sumsViewer.prototype.setMetrics = function(g)
{
    this.scale = Math.floor(Math.min((this.width-2)/(this.X+this.L),
                                     (this.height-2-(this.textHeight+2))/(this.Y+this.T)));
    var realwidth = (this.X+this.L)*this.scale+2;
    var realheight = (this.Y+this.T)*this.scale+2+this.textHeight+2;

    this.bottomText = teka.translate('japanese_sums_digits',[this.MAX]);
    g.font = 'bold '+this.textHeight+'px sans-serif';
    var textwidth = g.measureText(this.bottomText).width+1;
    realwidth = Math.max(realwidth,this.scale*this.L+textwidth);

    this.deltaX = Math.floor((this.width-realwidth)/2)+0.5;
    this.deltaY = Math.floor((this.height-realheight)/2)+0.5;

    this.font = teka.getFontData(Math.round(this.scale/2)+'px sans-serif',this.scale);
    this.boldfont = teka.getFontData('bold '+Math.round(this.scale/2)+'px sans-serif',this.scale);
    this.mediumfont = teka.getFontData(Math.round(this.scale/3)+'px sans-serif',this.scale);
    this.smallfont = teka.getFontData(Math.round((this.scale-6)/4)+'px sans-serif',this.scale);

    if (realwidth>this.width || realheight>this.height) this.scale=false;
    return {width:realwidth,height:realheight,scale:this.scale};
};

/** Paints the diagram. */
teka.viewer.japanese_sums.Japanese_sumsViewer.prototype.paint = function(g)
{
    var X = this.X;
    var Y = this.Y;
    var S = this.scale;
    var L = this.L;
    var T = this.T;

    g.save();
    g.translate(this.deltaX,this.deltaY);

    g.fillStyle = '#fff';
    g.fillRect(L*S,T*S,X*S,Y*S);

    for (var i=0;i<X;i++) {
        for (var j=0;j<Y;j++) {
            g.fillStyle = this.isBlinking()?
                this.getBlinkColor(i,j,X,this.f[i][j]):
                (this.error[i][j]?'#f00':'#fff');
            g.fillRect((i+L)*S,(j+T)*S,S,S);
        }
    }

    g.strokeStyle = '#000';
    for (var i=0;i<=X;i++) {
        teka.drawLine(g,(L+i)*S,T*S,(L+i)*S,(T+Y)*S);
    }
    for (var j=0;j<=Y;j++) {
        teka.drawLine(g,L*S,(T+j)*S,(L+X)*S,(T+j)*S);
    }

    g.lineWidth = 2;
    g.strokeRect(S*L-0.5,S*T-0.5,X*S+1,Y*S+1);
    g.lineWidth = 1;

    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.font = this.font.font;
    for (var i=0;i<L;i++) {
        for (var j=0;j<Y;j++) {
            if (this.leftdata[i][j]!=-1) {
                if (this.left_error[i][j]) {
                    g.fillStyle = '#f00';
                    teka.fillOval(g,i*S+S/2,(j+T)*S+S/2,S/4);
                    g.strokeStyle = '#000';
                    teka.strokeOval(g,i*S+S/2,(j+T)*S+S/2,S/4);
                }

                g.fillStyle = '#000';
                g.fillText(this.leftdata[i][j],i*S+S/2,(j+T)*S+S/2+this.font.delta);
            }
        }
    }

    for (var i=0;i<X;i++) {
        for (var j=0;j<T;j++) {
            if (this.topdata[i][j]!=-1) {
                if (this.top_error[i][j]) {
                    g.fillStyle = '#f00';
                    teka.fillOval(g,(L+i)*S+S/4,j*S+S/4,S/2);
                    g.strokeStyle = '#000';
                    teka.strokeOval(g,(L+i)*S+S/4,j*S+S/4,S/2);
                }

                g.fillStyle = '#000';
                g.fillText(this.topdata[i][j],(L+i)*S+S/2,j*S+S/2+this.font.delta);
            }
        }
    }

    g.textAlign = 'center';
    g.textBaseline = 'middle';
    for (var i=0;i<X;i++) {
        for (var j=0;j<Y;j++) {
            if (this.puzzle[i][j]!=0) {
                g.fillStyle = '#000';

                if (this.puzzle[i][j]==-1) {
                    g.fillRect((L+i)*S,(T+j)*S,S,S);
                } else {
                    g.font = this.boldfont.font;
                    g.fillText(this.puzzle[i][j],(i+L)*S+S/2,(j+T)*S+S/2+this.boldfont.delta);
                }
                continue;
            }

            if (this.f[i][j]===teka.viewer.japanese_sums.Defaults.EMPTY) {
                continue;
            }

            g.fillStyle = this.getColorString(this.c[i][j]);
            g.strokeStyle = this.getColorString(this.c[i][j]);

            if (this.f[i][j]>0 && this.f[i][j]<10) {
                g.font = this.font.font;
                g.fillText(this.f[i][j],(i+L)*S+S/2,(j+T)*S+S/2+this.font.delta);
                continue;
            }

            if (this.f[i][j]==teka.viewer.japanese_sums.Defaults.BLOCK && !this.error[i][j]) {
                g.fillRect((L+i)*S,(T+j)*S,S,S);
                continue;
            }

            if (this.f[i][j]==teka.viewer.japanese_sums.Defaults.DIGIT) {
                teka.strokeOval(g,(L+i)*S+S/2,(T+j)*S+S/2,S/2);
                continue;
            }

            if (this.f[i][j]>=100 && this.f[i][j]<1000) {
                var a = (this.f[i][j]-100)%10;
                var b = Math.floor((this.f[i][j]-100)/10);
                var tmp = (a==0?'?':a)+'-'+(b==0?'?':b);

                g.fillStyle = this.getColorString(this.c[i][j]);
                g.font = this.mediumfont.font;
                g.fillText(tmp,S*(L+i)+S/2,S*(T+j)+S/2+this.mediumfont.delta);
                continue;
            }

            g.save();
            g.translate(S*L,S*T);

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

            g.restore();
        }
    }

    g.textAlign = 'left';
    g.textBaseline = 'top';
    g.fillStyle = this.textcolor;
    g.font = 'bold '+this.textHeight+'px sans-serif';
    g.fillText(this.bottomText,L*S,(Y+T)*S+4);

    // paint cursor
    if (this.mode==teka.viewer.Defaults.NORMAL) {
        g.strokeStyle = '#f00';
        if (this.exp) {
            teka.drawLine(g,(L+this.x+1)*S-S/8-2,(T+this.y+1)*S-S/8-2,(L+this.x+1)*S-2,(T+this.y+1)*S-2);
            teka.drawLine(g,(L+this.x+1)*S-S/8-2,(T+this.y+1)*S-2,(L+this.x+1)*S-2,(T+this.y+1)*S-S/8-2);
        } else {
            g.lineWidth = 2;
            g.strokeRect(S*(this.x+L)+3.5,S*(this.y+T)+3.5,S-7,S-7);
        }
    }

    g.restore();
};

//////////////////////////////////////////////////////////////////

/** Handles mousemove event. */
teka.viewer.japanese_sums.Japanese_sumsViewer.prototype.processMouseMovedEvent = function(xc, yc)
{
    xc = xc-this.deltaX;
    yc = yc-this.deltaY;

    var oldx = this.x;
    var oldy = this.y;

    this.x = Math.floor(xc/this.scale)-this.L;
    this.y = Math.floor(yc/this.scale)-this.T;

    this.xm = xc-this.scale*(this.x+this.L);
    this.ym = yc-this.scale*(this.y+this.T);

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

    var oldexp = this.exp;
    this.exp = this.xm>this.scale-this.scale/8 && this.ym>this.scale-this.scale/8;

    return this.x!=oldx || this.y!=oldy || this.exp!=oldexp;
};

/** Handles mousedown event. */
teka.viewer.japanese_sums.Japanese_sumsViewer.prototype.processMousePressedEvent = function(xc, yc)
{
    var erg = this.processMouseMovedEvent(xc,yc);

    if (xc<this.L*this.scale || yc<this.T*this.scale || xc>=(this.X+this.L)*this.scale || yc>=(this.Y+this.T)*this.scale) {
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

    if (this.f[this.x][this.y]>=100 && this.f[this.x][this.y]<1000) {
        if (this.xm<this.scale/2) {
            this.set(this.x,this.y,(((this.f[this.x][this.y]-100)%10)+1)%(this.MAX+1)+((this.f[this.x][this.y]-100)/10*10)+100);
        } else {
            this.set(this.x,this.y,((((this.f[this.x][this.y]-100)/10)+1)%(this.MAX+1))*10+((this.f[this.x][this.y]-100)%10)+100);
        }
        return true;
    }

    if (this.f[this.x][this.y]>=1000) {
        var nr = ((this.xm<this.scale/3)?0:(this.xm>2*this.scale/3)?2:1)+
            3*((this.ym<this.scale/3)?0:(this.ym>2*this.scale/3)?2:1)+1;
        if (nr<1 || nr>this.MAX) {
            return erg;
        }
        this.set(this.x,this.y,((this.f[this.x][this.y]-1000)^(1<<nr))+1000);
        return true;
    }

    if (this.f[this.x][this.y]==0) {
        this.set(this.x,this.y,teka.viewer.japanese_sums.Defaults.DIGIT);
    } else if (this.f[this.x][this.y]==teka.viewer.japanese_sums.Defaults.DIGIT) {
        this.set(this.x,this.y,teka.viewer.japanese_sums.Defaults.BLOCK);
    } else if (this.f[this.x][this.y]==teka.viewer.japanese_sums.Defaults.BLOCK) {
        this.set(this.x,this.y,1);
    } else {
        this.set(this.x,this.y,(this.f[this.x][this.y]+1)%(this.MAX+1));
    }

    return true;
};

/** Handles keydown event. */
teka.viewer.japanese_sums.Japanese_sumsViewer.prototype.processKeyEvent = function(e)
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
        this.set(this.x,this.y,teka.viewer.japanese_sums.Defaults.EMPTY);
        return true;
    }

    if (e.key==teka.KEY_X || e.key==teka.KEY_B || e.key==teka.KEY_S) {
        this.set(this.x,this.y,teka.viewer.japanese_sums.Defaults.BLOCK);
        return true;
    }

    if (e.key==teka.KEY_DOT || e.key==teka.KEY_O) {
        this.set(this.x,this.y,teka.viewer.japanese_sums.Defaults.DIGIT);
        return true;
    }

    if (e.key>=teka.KEY_1 && e.key<=teka.KEY_9) {
        var val = e.key-teka.KEY_0;
        if (val<=this.MAX) {
            if (this.f[this.x][this.y]>=1000) {
                this.set(this.x,this.y,((this.f[this.x][this.y]-1000)^(1<<val))+1000);
            } else if (this.f[this.x][this.y]>=100 && this.f[this.x][this.y]<110) {
                this.set(this.x,this.y,this.f[this.x][this.y]+10*val);
            } else {
                this.set(this.x,this.y,val);
            }
        }
        return true;
    }

    if (e.key==teka.KEY_MINUS) {
        if (this.f[this.x][this.y]<100 && this.f[this.x][this.y]>=0) {
            this.set(this.x,this.y,100+this.f[this.x][this.y]);
        } else {
            this.set(this.x,this.y,100);
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
teka.viewer.japanese_sums.Japanese_sumsViewer.prototype.set = function(x, y, value)
{
    if (this.f[x][y]!=0 && this.f[x][y]!=1000 && this.c[x][y]!=this.color) {
        return;
    }
    this.f[x][y] = value;
    this.c[x][y] = this.color;
};

/** Converts from normal mode to expert mode. */
teka.viewer.japanese_sums.Japanese_sumsViewer.prototype.setExpert = function(h)
{
    if (h==teka.viewer.japanese_sums.Defaults.DIGIT) {
        return 1000;
    }
    if (h<=0) {
        return 1000;
    }
    if (h<10) {
        return 1000+(1<<h);
    }
    var a = (h-100)%10;
    var b = (h-100)/10;
    if (b==0) {
        b=this.MAX;
    }
    if (a>b) {
        var hlp = a;
        a = b;
        b = hlp;
    }
    var k=1000;
    for (var i=a;i<=b;i++) {
        k+=1<<i;
    }
    k&=~1;
    return k;
};

/** Converts back from expert mode to normal mode. */
teka.viewer.japanese_sums.Japanese_sumsViewer.prototype.getExpert = function(h)
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
    if (min==10 && max==0) {
        return 0;
    }
    if (min==max) {
        return min;
    }
    if (min==1 && max==this.MAX) {
        return teka.viewer.japanese_sums.Defaults.DIGIT;
    }
    return 100+10*max+min;
};
