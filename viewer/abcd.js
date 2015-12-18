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
    NIX: -1
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
    this.L = parseInt(data.get('letter'),10);
//    diagonal = 'true'.equals(data.this.get('diag'));
    this.asciiToData(data.get('puzzle'));
    this.asciiToSolution(data.get('solution'));

    this.f = teka.new_array([this.X,this.Y],0);
    this.top_f = teka.new_array([this.X,this.L],false);
    this.left_f = teka.new_array([this.L,this.Y],false);
    this.c = teka.new_array([this.X,this.Y],0);
    this.top_c = teka.new_array([this.X,this.L],0);
    this.left_c = teka.new_array([this.L,this.Y],0);
    this.error = teka.new_array([this.X,this.Y],false);
    this.top_error = teka.new_array([this.X,this.L],false);
    this.left_error = teka.new_array([this.L,this.Y],false);
};

/** Read puzzle from ascii art. */
teka.viewer.abcd.AbcdViewer.prototype.asciiToData = function(ascii)
{
    if (ascii===false) {
        return;
    }

    var grid = this.asciiToArray(ascii);

    this.puzzle = teka.new_array([this.X,this.Y],0);
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            this.puzzle[i][j] = grid[this.L+1+i][this.L+1+j]==teka.ord(' ')
                ?0:(grid[L+1+i][L+1+j]-teka.ord('A')+1);
        }
    }

    this.topdata = teka.new_array([this.X,this.L],0);
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.L;j++) {
            this.topdata[i][j] = grid[this.L+1+i][j]==teka.ord(' ')
                ?teka.viewer.abcd.Defaults.NIX:(grid[this.L+1+i][j]-teka.ord('0'));
        }
    }

    this.leftdata = teka.new_array([this.L,this.Y],0);
    for (var i=0;i<this.L;i++) {
        for (var j=0;j<this.Y;j++) {
            this.leftdata[i][j] = grid[i][this.L+1+j]==teka.ord(' ')
                ?teka.viewer.abcd.Defaults.NIX:(grid[i][this.L+1+j]-teka.ord('0'));
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
    return '/format 1\n/type (abcd)\n/sol false\n/X 4\n/Y 4\n/letter 5\n/diag false'
        +'\n/puzzle [ (      0111) (      0201) (      1020) (      1110)'
        +' (      2002) (     +----) (11110|    ) (10012|    ) (02200|    )'
        +' (10012|    ) ]'
        +'\n/solution [ (BDCE) (AEBA) (CDCD) (ABEA) ]';
};

/** Returns a list of automatically generated properties. */
teka.viewer.abcd.AbcdViewer.prototype.getProperties = function()
{
    return [teka.translate('generic_size',[this.X+'x'+this.Y])];
    // + Buchstaben von ... bis.
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
    for (var i=0;i<this.L;i++) {
        for (var j=0;j<this.Y;j++) {
            this.left_f[i][j] = false;
            this.left_c[i][j] = 0;
        }
    }
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.L;j++) {
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
        for (var j=0;j<this.L;j++) {
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
teka.viewer.abcd.AbcdViewer.prototype.copyColor = function(color)
{
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            if (this.c[i][j]==this.color) {
                this.c[i][j] = color;
            }
        }
    }
    for (var i=0;i<this.L;i++) {
        for (var j=0;j<this.Y;j++) {
            if (this.left_c[i][j]==this.color) {
                this.left_c[i][j] = color;
            }
        }
    }
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.L;j++) {
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
    for (var i=0;i<this.L;i++) {
        for (var j=0;j<this.Y;j++) {
            if (this.left_c[i][j]==color) {
                this.left_f[i][j] = false;
            }
        }
    }
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.L;j++) {
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

    var left_f = teka.new_array([this.L,this.Y],0);
    var left_c = teka.new_array([this.L,this.Y],0);
    for (var i=0;i<this.L;i++) {
        for (var j=0;j<this.Y;j++) {
            left_f[i][j] = this.left_f[i][j];
            left_c[i][j] = this.left_c[i][j];
        }
    }

    var top_f = teka.new_array([this.X,this.L],0);
    var top_c = teka.new_array([this.X,this.L],0);
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.L;j++) {
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

    for (var i=0;i<this.L;i++) {
        for (var j=0;j<this.Y;j++) {
            this.left_f[i][j] = state.left_f[i][j];
            this.left_c[i][j] = state.left_c[i][j];
        }
    }

    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.L;j++) {
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

    for (var i=0;i<X;i++) {
        for (var j=0;j<Y;j++) {
            if (this.puzzle[i][j]!=0) {
                this.f[i][j] = this.puzzle[i][j];
            }
        }
    }

    var check = teka.new_array([X,Y],0);
    for (var i=0;i<X;i++) {
        for (var j=0;j<Y;j++) {
            if (this.f[i][j]>=1000) {
                check[i][j] = this.getExpert(this.f[i][j]);
                if (check[i][j]==0 && this.f[i][j]!=1000) {
                    this.error[i][j] = true;
                    return 'Das markierte Feld enthält kein eindeutiges Symbol.';
                }
            } else {
                check[i][j] = this.f[i][j];
            }
        }
    }

    for (var i=0;i<X;i++) {
        for (var j=0;j<Y;j++) {
            if (check[i][j]==0) {
                this.error[i][j] = true;
                return 'Das markierte Feld ist leer.';
            }
        }
    }

    for (var i=0;i<X-1;i++) {
        for (var j=0;j<Y;j++) {
            if (check[i][j]==check[i+1][j]) {
                this.error[i][j] = this.error[i+1][j] = true;
                return 'In den markierten Feldern sind gleiche Buchstaben benachbart.';
            }
        }
    }

    for (var i=0;i<X;i++) {
        for (var j=0;j<Y-1;j++) {
            if (check[i][j]==check[i][j+1]) {
                this.error[i][j] = this.error[i][j+1] = true;
                return 'In den markierten Feldern sind gleiche Buchstaben benachbart.';
            }
        }
    }

    if (!diagonal) {
        for (var i=0;i<X-1;i++) {
            for (var j=0;j<Y-1;j++) {
                if (check[i][j]==check[i+1][j+1]) {
                    this.error[i][j] = this.error[i+1][j+1] = true;
                    return 'In den markierten Feldern sind gleiche Buchstaben benachbart.';
                }
                if (check[i][j+1]==check[i+1][j]) {
                    this.error[i][j+1] = this.error[i+1][j] = true;
                    return 'In den markierten Feldern sind gleiche Buchstaben benachbart.';
                }
            }
        }
    }

    for (var j=0;j<Y;j++) {
        var az = teka.new_array([L],0);
        for (var i=0;i<X;i++) {
            az[check[i][j]-1]++;
        }
        for (var i=0;i<L;i++) {
            if (left[L-i-1][j]!=-1 && left[L-i-1][j]!=az[i]) {
                left_error[L-i-1][j] = true;
                for (var ii=0;ii<X;ii++) {
                    if (check[ii][j]==i+1) {
                        this.error[ii][j] = true;
                    }
                }
                return 'Die Anzahl des markierten Buchstabens stimmt in der entsprechenden Zeile nicht.';
            }
        }
    }

    for (var i=0;i<X;i++) {
        var az = teka.new_array([L],0);
        for (var j=0;j<Y;j++) {
            az[check[i][j]-1]++;
        }
        for (var j=0;j<L;j++) {
            if (top[i][L-j-1]!=-1 && top[i][L-j-1]!=az[j]) {
                top_error[i][L-j-1] = true;
                for (var jj=0;jj<Y;jj++) {
                    if (check[i][jj]==j+1) {
                        this.error[i][jj] = true;
                    }
                }
                return 'Die Anzahl des markierten Buchstabens stimmt in der entsprechenden Spalte nicht.';
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
    this.scale = Math.floor(Math.min((this.width-3)/(this.X+this.L),
                                     (this.height-3-(this.textHeight+2))/(this.Y+this.L)));
    var realwidth = (this.X+this.L)*this.scale+3;
    var realheight = (this.Y+this.L)*this.scale+3+this.textHeight+2;

    this.deltaX = Math.floor((this.width-realwidth)/2)+0.5;
    this.deltaY = Math.floor((this.height-realheight)/2)+0.5;

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
    var L = this.L;

    g.save();
    g.translate(this.deltaX,this.deltaY);

    g.fillStyle = '#fff';
    g.fillRect(L*S+1,1,X*S,(L+Y)*S);
    g.fillRect(1,L*S+1,(L+X)*S,Y*S);

    /*
    for (var i=0;i<X;i++) {
        for (var j=0;j<Y;j++) {
            if (this.mode>=0) {
                g.fillStyle = (solvedColor[Math.abs((this.mode+(i+3)*this.mode%(j+1)+(j+1)*(j+4)*(9-this.mode)%(i+1)+this.f[i][j]+i+(X+1)*j)%8)]);
            } else if (this.error[i][j]) {
                g.fillStyle = ('#f00');
            } else {
                g.fillStyle = ('#fff');
            }
            g.fillRect((i+L)*S+1,(j+L)*S+1,S,S);
        }
    }

    for (var i=0;i<X;i++) {
        for (var j=0;j<L;j++) {
            g.fillStyle = (top_error[i][j]?'#f00':Color.lightGray);
            g.fillRect((L+i)*S+1,j*S+1,S,S);
        }
    }

    for (var i=0;i<L;i++) {
        for (var j=0;j<Y;j++) {
            g.fillStyle = (left_error[i][j]?'#f00':Color.lightGray);
            g.fillRect(i*S+1,(L+j)*S+1,S,S);
        }
    }

    g.fillStyle = ('#000');
    for (var i=0;i<=X;i++) {
        teka.drawLine(g,(i+L)*S+1,1,(i+L)*S+1,(Y+L)*S+1);
    }
    for (var i=0;i<=L;i++) {
        teka.drawLine(g,i*S+1,L*S+1,i*S+1,(L+Y)*S+1);
    }
    for (var j=0;j<=Y;j++) {
        teka.drawLine(g,1,(L+j)*S+1,(X+L)*S+1,(L+j)*S+1);
    }
    for (var j=0;j<=L;j++) {
        teka.drawLine(g,L*S+1,j*S+1,(L+X)*S+1,j*S+1);
    }

    g.strokeRect(0,S*L,S*(L+X)+2,S*Y+2);
    g.strokeRect(S*L,0,S*X+2,S*(L+Y)+2);

    g.setFont(fo_gross);
    g.fillStyle = ('#000');
    g.drawString('A',1+(L-1)*S+(S-fm_gross.stringWidth('A'))/2,
    1+(L-1)*S+(S+fm_gross.getAscent()-fm_gross.getDescent())/2);

    for (var i=1;i<L;i++) {
        String s = ''+(var)(i+'A');
        g.drawString(s,1+(L-i-1)*S+(S-fm_gross.stringWidth(s))/2,
        1+(L-1)*S+(S+fm_gross.getAscent()-fm_gross.getDescent())/2);
        g.drawString(s,1+(L-1)*S+(S-fm_gross.stringWidth(s))/2,
        1+(L-i-1)*S+(S+fm_gross.getAscent()-fm_gross.getDescent())/2);
    }

    for (var i=0;i<X;i++) {
        for (var j=0;j<L;j++) {
            if (top[i][j]!=-1) {
                g.fillStyle = ('#000');
                g.drawString(''+top[i][j],1+(L+i)*S+(S-fm_gross.stringWidth(''+top[i][j]))/2,1+j*S+(S+fm_gross.getAscent()-fm_gross.getDescent())/2);
            }
            if (top_f[i][j]) {
                g.fillStyle = (ColorTool.colors[top_c[i][j]]);
                teka.drawLine(g,(i+L)*S+S/4+1,j*S+S/4+1,(i+1+L)*S-S/4+1,(j+1)*S-S/4+1);
                teka.drawLine(g,(i+1+L)*S-S/4+1,j*S+S/4+1,(i+L)*S+S/4+1,(j+1)*S-S/4+1);
            }
        }
    }

    for (var i=0;i<L;i++) {
        for (var j=0;j<Y;j++) {
            if (left[i][j]!=-1) {
                g.fillStyle = ('#000');
                g.drawString(''+left[i][j],1+i*S+(S-fm_gross.stringWidth(''+left[i][j]))/2,1+(j+L)*S+(S+fm_gross.getAscent()-fm_gross.getDescent())/2);
            }
            if (left_f[i][j]) {
                g.fillStyle = (ColorTool.colors[left_c[i][j]]);
                teka.drawLine(g,(i)*S+S/4+1,(j+L)*S+S/4+1,(i+1)*S-S/4+1,(j+L+1)*S-S/4+1);
                teka.drawLine(g,(i+1)*S-S/4+1,(j+L)*S+S/4+1,(i)*S+S/4+1,(j+L+1)*S-S/4+1);
            }
        }
    }

    for (var i=0;i<X;i++) {
        for (var j=0;j<Y;j++) {
            if (this.puzzle[i][j]>0) {
                g.fillStyle = ('#000');
                g.setFont(fo_gross_bold);
                g.drawString(''+(var)('A'+this.puzzle[i][j]-1),1+(i+L)*S+(S-fm_gross_bold.stringWidth(''+(var)('A'+this.puzzle[i][j]-1)))/2,1+(j+L)*S+(S+fm_gross_bold.getAscent()-fm_gross_bold.getDescent())/2);
                continue;
            }
            if (this.f[i][j]>0 && this.f[i][j]<1000) {
                g.fillStyle = (ColorTool.colors[this.c[i][j]]);
                g.setFont(fo_gross);
                g.drawString(''+(var)(this.f[i][j]+'A'-1),1+(i+L)*S+(S-fm_gross.stringWidth(''+(var)(this.f[i][j]+'A'-1)))/2,1+(j+L)*S+(S+fm_gross.getAscent()-fm_gross.getDescent())/2);
            } else if (this.f[i][j]>=1000 && L<=4) {
                g.fillStyle = (ColorTool.colors[this.c[i][j]]);
                g.setFont(fo_klein);
                for (var k=0;k<4;k++) {
                    if (((this.f[i][j]-1000)&(1<<(k+1)))!=0) {
                        String hh = ''+(var)(k+'A');
                        g.drawString(hh,S*(i+L)+(S/2-fm_klein.stringWidth(hh))/2+(k%2)*S/2,S*(j+L)+(S/2+fm_klein.getAscent()-fm_klein.getDescent())/2+(k/2)*S/2);
                    }
                }
                g.fillStyle = ('#888');
                teka.drawLine(g,S*(i+L)+3,S*(j+L)+S/2,S*(i+L)+S-3,S*(j+L)+S/2);
                teka.drawLine(g,S*(i+L)+S/2,S*(j+L)+3,S*(i+L)+S/2,S*(j+L)+S-3);
                teka.drawLine(g,(i+L+1)*S+3-S/8,(j+L+1)*S+3-S/8,(i+L+1)*S-2,(j+L+1)*S-2);
                teka.drawLine(g,(i+L+1)*S+3-S/8,(j+L+1)*S-2,(i+L+1)*S-2,(j+L+1)*S+3-S/8);
            } else if (this.f[i][j]>=1000) {
                g.fillStyle = (ColorTool.colors[this.c[i][j]]);
                g.setFont(fo_klein);
                for (var k=0;k<9;k++) {
                    var da = ((this.f[i][j]-1000)&(1<<(k+1)))!=0;
                    if (da) {
                        String hh = ''+(var)(k+'A');
                        g.drawString(hh,S*(i+L)+(S-fm_klein.stringWidth(hh))/2+(k%3-1)*S/3,S*(j+L)+(S+fm_klein.getAscent()-fm_klein.getDescent())/2+(k/3-1)*S/3);
                    }
                }
                g.fillStyle = ('#888');
                teka.drawLine(g,S*(i+L)+3,S*(j+L)+S/3,S*(i+L)+S-3,S*(j+L)+S/3);
                teka.drawLine(g,S*(i+L)+3,S*(j+L)+2*S/3,S*(i+L)+S-3,S*(j+L)+2*S/3);
                teka.drawLine(g,S*(i+L)+S/3,S*(j+L)+3,S*(i+L)+S/3,S*(j+L)+S-3);
                teka.drawLine(g,S*(i+L)+2*S/3,S*(j+L)+3,S*(i+L)+2*S/3,S*(j+L)+S-3);
                teka.drawLine(g,(i+L+1)*S+3-S/8,(j+L+1)*S+3-S/8,(i+L+1)*S-2,(j+1+L)*S-2);
                teka.drawLine(g,(i+L+1)*S+3-S/8,(j+L+1)*S-2,(i+L+1)*S-2,(j+1+L)*S+3-S/8);
            }
        }
    }

    g.setFont(fo);
    g.fillStyle = ('#fff');
    g.drawString('Diagonal berühren '+(diagonal?'erlaubt':'verboten.'),2,realheight-fm.getDescent());

    // Cursor
    if (this.mode==NORMAL) {
        g.fillStyle = ('#f00');
        if (this.exp) {
            teka.drawLine(g,(this.x+L+1)*S+3-S/8,(this.y+L+1)*S+3-S/8,(this.x+L+1)*S-2,(this.y+L+1)*S-2);
            teka.drawLine(g,(this.x+L+1)*S+3-S/8,(this.y+L+1)*S-2,(this.x+L+1)*S-2,(this.y+L+1)*S+3-S/8);
        } else {
            g.strokeRect(S*(this.x+L)+3,S*(this.y+L)+3,S-4,S-4);
            g.strokeRect(S*(this.x+L)+4,S*(this.y+L)+4,S-6,S-6);
        }
    }
     */

    g.restore();
};

//////////////////////////////////////////////////////////////////

/** Handles mousemove event. */
teka.viewer.abcd.AbcdViewer.prototype.processMousemoveEvent = function(xc, yc, pressed)
{
    xc -= this.deltaX;
    yc -= this.deltaY;

    var oldx = this.x;
    var oldy = this.y;

    this.x = Math.floor(xc/this.scale)-this.L;
    this.y = Math.floor(yc/this.scale)-this.L;

    this.xm = xc-this.scale*(this.x+this.L);
    this.ym = yc-this.scale*(this.y+this.L);

    if (this.x<-this.L) {
        this.x=-this.L;
    }
    if (this.y<-this.L) {
        this.y=-this.L;
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
        this.set_left(this.x+this.L,this.y,!this.left_f[this.x+this.L][this.y]);
        return true;
    }
    if (this.y<0 && this.x>=0 && this.x<this.X) {
        this.set_top(this.x,this.y+this.L,!this.top_f[this.x][this.y+this.L]);
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
        if (this.L<=4) {
            var nr = ((this.xm<this.scale/2)?0:1)+2*((this.ym<this.scale/2)?0:1)+1;
            if (nr<1 || nr>this.L) {
                return erg;
            }
            this.set(this.x,this.y,((this.f[this.x][this.y]-1000)^(1<<nr))+1000);
            return true;
        } else {
            var nr = ((this.xm<3*this.scale/8)?0:(this.xm>this.scale-3*this.scale/8)?2:1)+
            3*((this.ym<3*this.scale/8)?0:(this.ym>this.scale-3*this.scale/8)?2:1)+1;
            if (nr<1 || nr>this.L) {
                return erg;
            }
            this.set(this.x,this.y,((this.f[this.x][this.y]-1000)^(1<<nr))+1000);
            return true;
        }
    }

    this.set(this.x,this.y,(this.f[this.x][this.y]+1)%(this.L+1));
    return true;
};

/** Handles keydown event. */
teka.viewer.abcd.AbcdViewer.prototype.processKeydownEvent = function(e)
{
    /*
    this.exp = false;
    if (co==40 && this.y<this.Y-1) {
        this.y++;
        return true;
    }
    if (co==38 && (this.y>0 || (this.x>=0 && this.y>-L))) {
        this.y--;
        return true;
    }
    if (co==39 && (this.x>0 || (this.y>=0 && this.x>-L))) {
        this.x--;
        return true;
    }
    if (co==37 && this.x<this.X-1) {
        this.x++;
        return true;
    }

    if (this.x<0) {
        if (this.c==' ') {
            set_left(this.x+L,this.y,false);
        } else if (this.c=='#' || this.c=='*' || this.c=='q' || this.c=='Q') {
            set_left(this.x+L,this.y,true);
        }
        return true;
    }
    if (this.y<0) {
        if (this.c==' ') {
            set_top(this.x,this.y+L,false);
        } else if (this.c=='#' || this.c=='*' || this.c=='q' || this.c=='Q') {
            set_top(this.x,this.y+L,true);
        }
        return true;
    }

    if (this.x<0 || this.y<0 || this.x>=this.X || this.y>=this.Y) {
        return false;
    }

    if (this.c==' ') {
        this.set(this.x,this.y,0);
    } else if (this.c>='A' && this.c<='A'+L-1) {
        if (this.f[this.x][this.y]>=1000) {
            this.set(this.x,this.y,((this.f[this.x][this.y]-1000)^(1<<(this.c-'A'+1)))+1000);
        } else {
            this.set(this.x,this.y,this.c-'A'+1);
        }
    } else if (this.c>='a' && this.c<='a'+L-1) {
        if (this.f[this.x][this.y]>=1000) {
            this.set(this.x,this.y,((this.f[this.x][this.y]-1000)^(1<<(this.c-'a'+1)))+1000);
        } else {
            this.set(this.x,this.y,this.c-'a'+1);
        }
    } else if (this.c=='#' || this.c==',') {
        if (this.f[this.x][this.y]<1000) {
            this.set(this.x,this.y,this.setExpert(this.f[this.x][this.y]));
        } else {
            this.set(this.x,this.y,this.getExpert(this.f[this.x][this.y]));
        }
    }
     */
    return true;
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
    if (left_f[x][y] && left_c[x][y]!=this.color) {
        return;
    }
    left_f[x][y] = value;
    left_c[x][y] = this.color;
};

/** set_top */
teka.viewer.abcd.AbcdViewer.prototype.set_top = function(x, y, value)
{
    if (top_f[x][y] && top_c[x][y]!=this.color) {
        return;
    }
    top_f[x][y] = value;
    top_c[x][y] = this.color;
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
    /*
    if (h>1000 && isPot(h-1000)) {
        return log(h-1000);
    }
     */
    return 0;
};
