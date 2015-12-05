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

/** Some constants, used for the dots. */
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
            if (this.c[i][j]==this.color) {
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
    
    var check = teka.new_array([X,Y],0);
    for (var i=0;i<X;i++) {
        for (var j=0;j<Y;j++) {
            if (this.puzzle[i][j]!=0) {
                if (this.puzzle[i][j]==-1) {
                    check[i][j] = teka.viewer.japanese_sums.Defaults.BLOCK;
                } else {
                    check[i][j] = this.puzzle[i][j];
                }
                continue;
            }
            
            if (this.f[i][j]==0 || this.f[i][j]==1000) {
                this.error[i][j] = true;
                return 'japanese_sums_empty';
            } else if (this.f[i][j]==teka.viewer.japanese_sums.Defaults.BLOCK || (this.f[i][j]>=1 && this.f[i][j]<=this.MAX)) {
                check[i][j] = this.f[i][j];
            } else if (this.f[i][j]>=1000) {
                check[i][j] = this.getExpert(this.f[i][j]);
                if (check[i][j]<1 || check[i][j]>this.MAX) {
                    this.error[i][j] = true;
                    return 'japanese_sums_not_unique';
                }
            } else if (this.f[i][j]>100) {
                var min = this.f[i][j]%10;
                var max = ((this.f[i][j]-100)/10);
                if (min==0 && max==1) {
                    min = 1;
                }
                if (min==MAX && max==0) {
                    max = this.MAX;
                }
                if (min!=max) {
                    this.error[i][j] = true;
                    return 'japanese_sums_not_unique';
                }
                check[i][j] = min;
            } else {
                this.error[i][j] = true;
                return 'japanese_sums_not_unique';
            }
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

    for (var j=0;j<Y;j++) {
        if (!this.left_empty[j]) {
            var erg = this.checkWaagSums(j,check);
            if (erg!=null) {
                return erg;
            }
        }
    }

    for (var i=0;i<X;i++) {
        if (!this.top_empty[i]) {
            var erg = this.checkSenkSums(i,check);
            if (erg!=null) {
                return erg;
            }
        }
    }

    return true;
};

/** checkWaagSums */
teka.viewer.japanese_sums.Japanese_sumsViewer.prototype.checkWaagSums = function(y, f)
{
    var sp = teka.new_array([this.L],0);
    var ep = teka.new_array([this.L],0);
    var sums = teka.new_array([this.L],0);
    for (var i=0;i<this.L;i++) {
        sums[i] = -1;
    }

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

/** checkSenkSums */
teka.viewer.japanese_sums.Japanese_sumsViewer.prototype.checkSenkSums = function(x, f)
{
    var sp = teka.new_array([this.T],0);
    var ep = teka.new_array([this.T],0);
    var sums = teka.new_array([this.T],0);
    for (var i=0;i<this.T;i++) {
        sums[i] = -1;
    }

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
    this.scale = Math.floor(Math.min((this.width-2)/(this.X+this.L),(this.height-2-this.textHeight-2)/(this.Y+this.T)));
    var realwidth = (this.X+this.L)*this.scale+2;
    var realheight = (this.Y+this.T)*this.scale+2+this.textHeight+2;

    this.bottomText = teka.translate('japanese_sums_digits',[this.MAX]);
    g.font = 'bold '+this.textHeight+'px sans-serif';
    var textwidth = g.measureText(this.bottomText).width+1;
    realwidth = Math.max(realwidth,textwidth);
    
    this.deltaX = Math.round((this.width-realwidth)/2)+0.5;
    this.deltaY = Math.round((this.height-realheight)/2)+0.5;

    this.font = teka.getFontData(Math.round(this.scale/2)+'px sans-serif',this.scale);
    this.boldfont = teka.getFontData('bold '+Math.round(this.scale/2)+'px sans-serif',this.scale);
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

    g.save();
    g.translate(this.deltaX,this.deltaY);

    g.fillStyle = '#fff';
    g.fillRect(this.L*S,this.T*S,X*S,Y*S);

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
            g.fillRect((i+this.L)*S,(j+this.T)*S,S,S);
        }
    }
    
    g.strokeStyle = '#000';
    for (var i=0;i<=X;i++) {
        teka.drawLine(g,(this.L+i)*S,this.T*S,(this.L+i)*S,(this.T+Y)*S);
    }
    for (var j=0;j<=Y;j++) {
        teka.drawLine(g,this.L*S,(this.T+j)*S,(this.L+X)*S,(this.T+j)*S);
    }

    teka.drawLine(g,this.L*S-1,this.T*S-1,this.L*S-1,(this.T+Y)*S);
    teka.drawLine(g,this.L*S-1,this.T*S-1,(this.L+X)*S,this.T*S-1);
    teka.drawLine(g,(this.L+X)*S+1,this.T*S-1,(this.L+X)*S+1,(this.T+Y)*S+1);
    teka.drawLine(g,this.L*S-1,(this.T+Y)*S+1,(this.L+X)*S+1,(this.T+Y)*S+1);
    
    g.fillStyle = '#000';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.font = this.font.font;
    for (var i=0;i<this.L;i++) {
        for (var j=0;j<Y;j++) {
            if (this.leftdata[i][j]!=-1) {
                if (this.left_error[i][j]) {
                    g.fillStyle = '#f00';
                    teka.fillOval(g,i*S+S/2,(j+this.T)*S+S/2,S/4,0,2*Math.PI);
                    g.strokeStyle = '#000';
                    teka.strokeOval(g,i*S+S/2,(j+this.T)*S+S/2,S/4,0,2*Math.PI);
                    g.fillStyle = '#000';
                }
                
                g.fillText(this.leftdata[i][j],i*S+S/2,(j+this.T)*S+S/2+this.font.delta);
            }
        }
    }
    
    for (var i=0;i<X;i++) {
        for (var j=0;j<this.T;j++) {
            if (this.topdata[i][j]!=-1) {
                if (this.top_error[i][j]) {
                    g.fillStyle = '#f00';
                    teka.fillOval(g,(this.L+i)*S+S/4,j*S+S/4,S/2,0,2*Math.PI);
                    g.strokeStyle = '#000';
                    teka.strokeOval(g,(this.L+i)*S+S/4,j*S+S/4,S/2,0,2*Math.PI);
                }
                
                g.fillText(this.topdata[i][j],(this.L+i)*S+S/2,j*S+S/2+this.font.delta);
            }
        }
    }

    for (var i=0;i<X;i++) {
        for (var j=0;j<Y;j++) {
            if (this.puzzle[i][j]!=0) {
                g.fillStyle = '#000';
                if (this.puzzle[i][j]==-1) {
                    g.fillRect((this.L+i)*S,(this.T+j)*S,S,S);
                } else {
                    g.fillStyle = '#000';
                    g.textAlign = 'center';
                    g.textBaseline = 'middle';
                    g.font = this.boldfont.font;
                    g.fillText(this.puzzle[i][j],(i+this.L)*S+S/2,(j+this.T)*S+S/2+this.boldfont.delta);
                }
                continue;
            }
            
            g.fillStyle = this.getColorString(this.c[i][j]);
            g.strokeStyle = this.getColorString(this.c[i][j]);
            if (this.f[i][j]>0 && this.f[i][j]<10) {
                g.textAlign = 'center';
                g.textBaseline = 'middle';
                g.font = this.font.font;
                g.fillText(this.f[i][j],(i+this.L)*S+S/2,(j+this.T)*S+S/2+this.font.delta);
            }  else if (this.f[i][j]==teka.viewer.japanese_sums.Defaults.BLOCK && !this.error[i][j]) {
                g.fillRect((this.L+i)*S,(this.T+j)*S,S,S);
            }  else if (this.f[i][j]==teka.viewer.japanese_sums.Defaults.DIGIT) {
                teka.strokeOval(g,(this.L+i)*S+S/2,(this.T+j)*S+S/2,S/2,0,2*Math.PI);
            } /* else if (this.f[i][j]>=100 && this.f[i][j]<1000) {
                var a = (this.f[i][j]-100)%10;
                var b = (this.f[i][j]-100)/10;
                String hh = (a==0?'?':(''+a))+'-'+(b==0?'?':(''+b));
                g.setFont(fo_mittel);
                g.fillStyle = (ColorTool.colors[this.c[i][j]]);
                g.drawString(hh,S*(this.L+i)+(S-fm_mittel.stringWidth(hh))/2,S*(this.T+j)+(S+fm_mittel.getAscent()-fm_mittel.getDescent())/2);
                g.setFont(fo_gross);
            } else if (this.f[i][j]>=1000) {
                g.setFont(fo_klein);
                for (var k=1;k<=9;k++) {
                    var da = ((this.f[i][j]-1000)&(1<<k))!=0;
                    if (da) {
                        String hh = ''+k;
                        g.fillStyle = (ColorTool.colors[this.c[i][j]]);
                        g.drawString(hh,
                        S*(i+this.L)+S/6-fm_klein.stringWidth(hh)/2+((k-1)%3)*S/3+1,
                        S*(j+this.T)+S/6+(fm_klein.getAscent()-fm_klein.getDescent())/2+((k-1)/3)*S/3+1);
                    }
                }
                g.fillStyle = ('#888');
                teka.drawLine(g,S*(i+this.L)+3,S*(j+this.T)+S/3,S*(i+this.L)+S-3,S*(j+this.T)+S/3);
                teka.drawLine(g,S*(i+this.L)+3,S*(j+this.T)+2*S/3,S*(i+this.L)+S-3,S*(j+this.T)+2*S/3);
                teka.drawLine(g,S*(i+this.L)+S/3,S*(j+this.T)+3,S*(i+this.L)+S/3,S*(j+this.T)+S-3);
                teka.drawLine(g,S*(i+this.L)+2*S/3,S*(j+this.T)+3,S*(i+this.L)+2*S/3,S*(j+this.T)+S-3);
                teka.drawLine(g,(this.L+i+1)*S+3-S/8,(this.T+j+1)*S+3-S/8,(this.L+i+1)*S-2,(this.T+j+1)*S-2);
                teka.drawLine(g,(this.L+i+1)*S+3-S/8,(this.T+j+1)*S-2,(this.L+i+1)*S-2,(this.T+j+1)*S+3-S/8);
            }
             */
        }
    }

    g.textAlign = 'left';
    g.textBaseline = 'top';
    g.fillStyle = this.textcolor;
    g.font = 'bold '+this.textHeight+'px sans-serif';
    g.fillText(this.bottomText,this.L*S+1,(Y+this.T)*S+5);

    if (this.mode==teka.viewer.Defaults.NORMAL) {
        g.strokeStyle = '#f00';
        if (this.exp) {
            teka.drawLine(g,(this.L+this.x+1)*S+3-S/8,(this.T+this.y+1)*S+3-S/8,(this.L+this.x+1)*S-2,(this.T+this.y+1)*S-2);
            teka.drawLine(g,(this.L+this.x+1)*S+3-S/8,(this.T+this.y+1)*S-2,(this.L+this.x+1)*S-2,(this.T+this.y+1)*S+3-S/8);
        } else {
            g.strokeRect(S*(this.x+this.L)+2,S*(this.y+this.T)+2,S-4,S-4);
            g.strokeRect(S*(this.x+this.L)+3,S*(this.y+this.T)+3,S-6,S-6);
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
            this.set(this.x,this.y,this.setExpert(this.f[this.x][this.y]),false);
        } else {
            this.set(this.x,this.y,this.getExpert(this.f[this.x][this.y]),false);
        }
        return true;
    }

    if (this.f[this.x][this.y]>=100 && this.f[this.x][this.y]<1000) {
        if (this.xm<this.scale/2) {
            this.set(this.x,this.y,(((this.f[this.x][this.y]-100)%10)+1)%(this.MAX+1)+((this.f[this.x][this.y]-100)/10*10)+100,false);
        } else {
            this.set(this.x,this.y,((((this.f[this.x][this.y]-100)/10)+1)%(this.MAX+1))*10+((this.f[this.x][this.y]-100)%10)+100,false);
        }
        return true;
    }

    if (this.f[this.x][this.y]>=1000) {
        var nr = ((this.xm<this.scale/3)?0:(this.xm>2*this.scale/3)?2:1)+
            3*((this.ym<this.scale/3)?0:(this.ym>2*this.scale/3)?2:1)+1;
        if (nr<1 || nr>this.MAX) {
            return erg;
        }
        this.set(this.x,this.y,((this.f[this.x][this.y]-1000)^(1<<nr))+1000,false);
        return true;
    }

    if (this.f[this.x][this.y]==0) {
        this.set(this.x,this.y,teka.viewer.japanese_sums.Defaults.DIGIT,false);
    } else if (this.f[this.x][this.y]==teka.viewer.japanese_sums.Defaults.DIGIT) {
        this.set(this.x,this.y,teka.viewer.japanese_sums.Defaults.BLOCK,false);
    } else if (this.f[this.x][this.y]==teka.viewer.japanese_sums.Defaults.BLOCK) {
        this.set(this.x,this.y,1,false);
    } else {
        this.set(this.x,this.y,(this.f[this.x][this.y]+1)%(this.MAX+1),false);
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
        this.set(this.x,this.y,teka.viewer.japanese_sums.Defaults.EMPTY,false);
        return true;
    }
    
    if (e.key==teka.KEY_X || e.key==teka.KEY_B || e.key==teka.KEY_S) {
        this.set(this.x,this.y,teka.viewer.japanese_sums.Defaults.BLOCK,false);
        return true;
    }
    
    if (e.key==teka.KEY_DOT || e.key==teka.KEY_O) {
        this.set(this.x,this.y,teka.viewer.japanese_sums.Defaults.DIGIT,false);
        return true;
    }

    if (e.key>=teka.KEY_1 && e.key<=teka.KEY_9) {
        if (e.key<=teka.KEY_0+this.MAX) {
            this.set(this.x,this.y,e.key-teka.KEY_0,false);
        }
        return true;
    }

    /*
    } else if (ch>='1' && ch<'1'+this.MAX) {
        if (this.f[this.x][this.y]>=100 && this.f[this.x][this.y]<110) {
            this.set(this.x,this.y,this.f[this.x][this.y]+10*(ch-'0'));
        } else if (this.f[this.x][this.y]>=1000) {
            this.set(this.x,this.y,((this.f[this.x][this.y]-1000)^(1<<(ch-'0')))+1000);
        } else {
            this.set(this.x,this.y,ch-'0');
        }
    } else if (ch=='-') {
        if (this.f[this.x][this.y]<100 && this.f[this.x][this.y]>=0) {
            this.set(this.x,this.y,100+this.f[this.x][this.y]);
        } else {
            this.set(this.x,this.y,100);
        }
    } else if (ch=='#' || ch==',') {
        if (this.f[this.x][this.y]<1000) {
            this.set(this.x,this.y,this.setExpert(this.f[this.x][this.y]),true);
        } else {
            this.set(this.x,this.y,this.getExpert(this.f[this.x][this.y]),true);
        }
    }
     */
    return true;
};

//////////////////////////////////////////////////////////////////

/** Sets the value of a cell, if the color fits. */
teka.viewer.japanese_sums.Japanese_sumsViewer.prototype.set = function(x, y, w, force)
{
    if (!force && this.f[x][y]!=0 && this.c[x][y]!=this.color) {
        return;
    }
    if (!force || this.f[x][y]==0) {
        this.c[x][y] = this.color;
    }
    this.f[x][y] = w;
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
