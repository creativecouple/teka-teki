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
teka.viewer.kakuro = {};

/** Some constants. */
teka.viewer.kakuro.Defaults = {
};

/** Constructor */
teka.viewer.kakuro.KakuroViewer = function(data)
{
    teka.viewer.PuzzleViewer.call(this,data);

    this.x = 1;
    this.y = 1;
    this.xm = 0;
    this.ym = 0;
    this.exp = false;
};
teka.extend(teka.viewer.kakuro.KakuroViewer,teka.viewer.PuzzleViewer);

//////////////////////////////////////////////////////////////////

/** Initialize this viewer width the PSData object provided. */
teka.viewer.kakuro.KakuroViewer.prototype.initData = function(data)
{
    this.X = parseInt(data.get('X'),10);
    this.Y = parseInt(data.get('Y'),10);
    this.asciiToPuzzle(data.get('puzzle'));
    this.asciiToSolution(data.get('solution'));
    
    this.f = teka.new_array([this.X,this.Y],0);
    this.c = teka.new_array([this.X,this.Y],0);
    this.error = teka.new_array([this.X,this.Y],false);
};

/** asciiToPuzzle */
teka.viewer.kakuro.KakuroViewer.prototype.asciiToPuzzle = function(ascii)
{
    if (ascii===false) {
        return;
    }
    
    var grid = this.asciiToArray(ascii);
    
    this.puzzle = teka.new_array([this.X,this.Y,2],0);
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            if (grid[2*i+1][2*j+1]==teka.ord(' ')) {
                if (grid[2*i][2*j]==teka.ord(' ')) {
                    this.puzzle[i][j] = null;
                } else {
                    this.puzzle[i][j] = teka.new_array([1],0);
                    this.puzzle[i][j][0] = grid[2*i][2*j]-teka.ord('0');
                }
                continue;
            }
            if (grid[2*i+1][2*j]==teka.ord('#')) {
                this.puzzle[i][j][0] = 0;
            } else if (grid[2*i][2*j]==teka.ord('#')) {
                this.puzzle[i][j][0] = grid[2*i+1][2*j]-teka.ord('0');
            } else {
                this.puzzle[i][j][0] = 10*(grid[2*i][2*j]-teka.ord('0'))+(grid[2*i+1][2*j]-teka.ord('0'));
            }
            
            if (grid[2*i+1][2*j+1]==teka.ord('#')) {
                this.puzzle[i][j][1] = 0;
            } else if (grid[2*i][2*j+1]==teka.ord('#')) {
                this.puzzle[i][j][1] = grid[2*i+1][2*j+1]-teka.ord('0');
            } else {
                this.puzzle[i][j][1] = 10*(grid[2*i][2*j+1]-teka.ord('0'))+(grid[2*i+1][2*j+1]-teka.ord('0'));
            }
        }
    }
};

/** Read solution from ascii art. */
teka.viewer.kakuro.KakuroViewer.prototype.asciiToSolution = function(ascii)
{
    if (ascii===false) {
        return;
    }
    
    var grid = this.asciiToArray(ascii);
    
    this.solution = teka.new_array([this.X,this.Y],0);
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            if (grid[i][j]==teka.ord('#')) {
                this.solution[i][j] = 0;
            } else {
                this.solution[i][j] = grid[i][j]-teka.ord('0');
            }
        }
    }
};

/** Add solution. */
teka.viewer.kakuro.KakuroViewer.prototype.addSolution = function()
{
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            this.f[i][j] = this.solution[i][j];
        }
    }
};

//////////////////////////////////////////////////////////////////

/** Returns a small example. */
teka.viewer.kakuro.KakuroViewer.prototype.getExample = function()
{
    return '/format 1\n/type (kakuro)\n/sol false\n/X 5\n/Y 5'
        +'\n/puzzle [ (##########) (##1614####) (#8    ####) (##    10#7) (30        )'
        +' (##        ) (###6      ) (####      ) (###3    ##) (####    ##) ]'
        +'\n/solution [ (#####) (#71##) (#9876) (##321) (##21#) ]';
};

/** Returns a list of automatically generated properties. */
teka.viewer.kakuro.KakuroViewer.prototype.getProperties = function()
{
    return [teka.translate('generic_size',[this.X+'x'+this.Y])];
};

//////////////////////////////////////////////////////////////////

/** Reset the whole diagram. */
teka.viewer.kakuro.KakuroViewer.prototype.reset = function()
{
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            this.f[i][j]=0;
            this.c[i][j]=0;
        }
    }
};

/** Reset the error marks. */
teka.viewer.kakuro.KakuroViewer.prototype.clearError = function()
{
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            this.error[i][j]=false;
        }
    }
};

/** Copy digits colored with this.color to color. */
teka.viewer.kakuro.KakuroViewer.prototype.copyColor = function(color)
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
teka.viewer.kakuro.KakuroViewer.prototype.clearColor = function(color)
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
teka.viewer.kakuro.KakuroViewer.prototype.saveState = function()
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
teka.viewer.kakuro.KakuroViewer.prototype.loadState = function(state)
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
teka.viewer.kakuro.KakuroViewer.prototype.check = function()
{
    var X = this.X;
    var Y = this.Y;
    var check = teka.new_array([X,Y],0);
    for (var i=0;i<X;i++) {
        for (var j=0;j<Y;j++) {
            if (this.puzzle[i][j]===null) {
                check[i][j] = this.getDigit(this.f[i][j]);
                if (check[i][j]==0) {
                    this.error[i][j] = true;
                    return 'Das markierte Feld enthält kein eindeutiges Symbol.';
                }
            } else if (this.puzzle[i][j].length==1) {
                check[i][j] = this.puzzle[i][j][0];
            }
        }
    }
    
    for (var i=0;i<X;i++) {
        for (var j=0;j<Y;j++) {
            if (this.puzzle[i][j]!==null && this.puzzle[i][j].length==2) {
                if (this.puzzle[i][j][0]>0) {
                    var h = this.checkSum(check,this.puzzle[i][j][0],1,0,i,j);
                    if (h!=null) {
                        return h;
                    }
                }
                
                if (this.puzzle[i][j][1]>0) {
                    var h = this.checkSum(check,this.puzzle[i][j][1],0,1,i,j);
                    if (h!=null) {
                        return h;
                    }
                }
            }
        }
    }
    return true;
};

/** checkSum */
teka.viewer.kakuro.KakuroViewer.prototype.checkSum = function(check, sum, dx, dy, x, y)
{
    x+=dx;
    y+=dy;
    var sx = x;
    var sy = y;
    var s = 0;
    var da = teka.new_array([10],false);
    while (x<this.X && y<this.Y) {
        if (this.puzzle[x][y]!=null && this.puzzle[x][y].length==2) {
            break;
        }
        s+=check[x][y];
        if (da[check[x][y]]) {
            while (sx<this.X && sy<this.Y) {
                if (this.puzzle[sx][sy]!=null && this.puzzle[sx][sy].length==2) {
                    break;
                }
                if (check[sx][sy]==check[x][y]) {
                    this.error[sx][sy] = true;
                }
                sx+=dx;
                sy+=dy;
            }
            return 'Die markierten Ziffern kommen in der Zahl mehrfach vor.';
        }
        da[check[x][y]] = true;
        x+=dx;
        y+=dy;
    }
    if (sum==s) {
        return null;
    }
    
    while (sx<this.X && sy<this.Y) {
        if (this.puzzle[sx][sy]!=null && this.puzzle[sx][sy].length==2) {
            break;
        }
        this.error[sx][sy] = true;
        sx+=dx;
        sy+=dy;
    }
    return 'Die Summe stimmt in der markierten Zahl nicht.';
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
teka.viewer.kakuro.KakuroViewer.prototype.setMetrics = function(g)
{
    this.scale = Math.floor(Math.min((this.width-1)/this.X,
                                     (this.height-1)/this.Y));
    var realwidth = this.X*this.scale+1;
    var realheight = this.Y*this.scale+1;
    
    this.deltaX = Math.floor((this.width-realwidth)/2)+0.5;
    this.deltaY = Math.floor((this.height-realheight)/2)+0.5;

    this.font = teka.getFontData(Math.round(this.scale/2)+'px sans-serif',this.scale);
    this.smallfont = teka.getFontData(Math.round(this.scale/4)+'px sans-serif',this.scale);
    
    if (realwidth>this.width || realheight>this.height) {
        this.scale=false;
    }
    return {width:realwidth,height:realheight,scale:this.scale};
};

/** Paints the diagram. */
teka.viewer.kakuro.KakuroViewer.prototype.paint = function(g)
{
    var X = this.X;
    var Y = this.Y;
    var S = this.scale;

    g.save();
    g.translate(this.deltaX,this.deltaY);

    /*
    g.fillStyle = '#0f0';
    g.fillRect(-10,-10,this.width+20,this.height+20);
    g.fillStyle = '#f00';
    var realwidth = this.X*this.scale+1;
    var realheight = this.Y*this.scale+1;
    g.fillRect(0,0,realwidth,realheight);
    */

    g.fillStyle = '#fff';
    g.fillRect(0,0,X*S,Y*S);
    
    for (var i=0;i<X;i++) {
        for (var j=0;j<Y;j++) {
            if (this.puzzle[i][j]===null || this.puzzle[i][j].length==1) {
                g.fillStyle = this.isBlinking()?
                    this.getBlinkColor(i,j,X,this.f[i][j]):
                    (this.error[i][j]?'#f00':'#fff');
                g.fillRect(i*S,j*S,S,S);
            }
        }
    }
    
    g.strokeStyle = '#000';
    for (var i=1;i<=X-1;i++) {
        teka.drawLine(g,i*S,0,i*S,Y*S);
    }
    for (var j=1;j<=Y-1;j++) {
        teka.drawLine(g,0,j*S,X*S,j*S);
    }
    
    for (var i=0;i<X;i++) {
        for (var j=0;j<Y;j++) {
            if (this.puzzle[i][j]!==null) {
                g.fillStyle = '#000';
                if (this.puzzle[i][j].length==1) {
                    /*
                    g.setFont(fo_gross);
                    g.drawString(''+this.puzzle[i][j][0],S*i+(S-fm_gross.stringWidth(''+this.puzzle[i][j][0]))/2,S*j+(S+fm_gross.getAscent()-fm_gross.getDescent())/2);
                    g.setFont(fo_klein_bold);
                     */
                    continue;
                }
                g.fillRect(S*i,S*j,S,S);
                g.strokeStyle = '#fff';
                teka.drawLine(g,S*i,S*j,S*(i+1),S*(j+1));
                if (i>0 && this.puzzle[i-1][j]!=null) {
                    teka.drawLine(g,S*i,S*j,S*i,S*j+S);
                }
                if (j>0 && this.puzzle[i][j-1]!=null) {
                    teka.drawLine(g,S*i,S*j,S*i+S,S*j);
                }
                
                g.textAlign = 'center';
                g.textBaseline = 'middle';
                g.fillStyle = '#fff';
                g.font = this.smallfont.font;
                if (this.puzzle[i][j][0]!=0) {
                    g.fillText(this.puzzle[i][j][0],S*(i+1)-S/4,S*j+S/4+this.smallfont.delta);
                }
                if (this.puzzle[i][j][1]!=0) {
                    g.fillText(this.puzzle[i][j][1],S*i+S/4,S*(j+1)-S/4+this.smallfont.delta);
                }
            }
        }
    }
    
    g.fillStyle = '#000';
    for (var i=0;i<X;i++) {
        for (var j=0;j<Y;j++) {
            if (this.puzzle[i][j]===null && this.f[i][j]>0) {
                g.fillStyle = this.getColorString(this.c[i][j]);
                
                if (this.f[i][j]<10) {
                    g.textAlign = 'center';
                    g.textBaseline = 'middle';
                    g.font = this.font.font;
                    g.fillText(this.f[i][j],S*i+S/2,S*j+S/2+this.font.delta);
                } 
                
                /*else if (this.f[i][j]<1000) {
                    var a = (this.f[i][j]-100)%10;
                    var b = (this.f[i][j]-100)/10;
                    String h = (a==0?'?':(''+a))+'-'+(b==0?'?':(''+b));
                    g.setFont(fo_klein);
                    g.drawString(h,S*i+(S-fm_klein.stringWidth(h))/2,S*j+(S+fm_klein.getAscent()-fm_klein.getDescent())/2);
                } else {
                    g.setFont(fo_klein);
                    for (var k=1;k<=9;k++) {
                        if (((this.f[i][j]-1000)&(1<<k))!=0) {
                            g.drawString(''+k,
                        }
                    }
                    S*i+1+S/4+((k-1)%3)*S/4-fm_klein.stringWidth(''+k)/2,
                    S*j+1+S/4+((k-1)/3)*(S/4+1)+(fm_klein.getAscent()-fm_klein.getDescent())/2);
                    
                    g.fillStyle = ('#888');
                    teka.drawLine(g,S*i+1+S/8,S*j+1+3*S/8,S*(i+1)+1-S/8,S*j+1+3*S/8);
                    teka.drawLine(g,S*i+1+S/8,S*(j+1)+1-3*S/8,S*(i+1)+1-S/8,S*(j+1)+1-3*S/8);
                    teka.drawLine(g,S*i+1+3*S/8,S*j+1+S/8,S*i+1+3*S/8,S*(j+1)+1-S/8);
                    teka.drawLine(g,S*(i+1)+1-3*S/8,S*j+1+S/8,S*(i+1)+1-3*S/8,S*(j+1)+1-S/8);
                    teka.drawLine(g,(i+1)*S+3-S/8,(j+1)*S+3-S/8,(i+1)*S-2,(j+1)*S-2);
                    teka.drawLine(g,(i+1)*S+3-S/8,(j+1)*S-2,(i+1)*S-2,(j+1)*S+3-S/8);
                } */
            }
        }
    }
    
    g.strokeStyle = '#000';
    g.strokeRect(0,0,X*S,Y*S);

    if (this.mode==teka.viewer.Defaults.NORMAL) {
        g.strokeStyle = '#f00';
        if (this.exp) {
            teka.drawLine(g,(this.x+1)*S+3-S/8,(this.y+1)*S+3-S/8,(this.x+1)*S-2,(this.y+1)*S-2);
            teka.drawLine(g,(this.x+1)*S+3-S/8,(this.y+1)*S-2,(this.x+1)*S-2,(this.y+1)*S+3-S/8);
        } else {
            g.lineWidth = 2;
            g.strokeRect(S*this.x+3.5,S*this.y+3.5,S-7,S-7);
        }
    }
    
    g.restore();
};

//////////////////////////////////////////////////////////////////

/** processMousemoveEvent */
teka.viewer.kakuro.KakuroViewer.prototype.processMousemoveEvent = function(xc, yc, pressed)
{
    var oldx = this.x;
    var oldy = this.y;

    this.x = Math.floor(xc/this.scale);
    this.y = Math.floor(yc/this.scale);
    
    this.xm = xc-this.scale*this.x;
    this.ym = yc-this.scale*this.y;
    
    if (this.x<1) {
        this.x=1;
    }
    if (this.y<1) {
        this.y=1;
    }
    if (this.x>this.X-1) {
        this.x=this.X-1;
    }
    if (this.y>this.Y-1) {
        this.y=this.Y-1;
    }
    
    var oldexp = this.exp;
    this.exp = this.xm>this.scale-this.scale/8 && this.ym>this.scale-this.scale/8;
    
    return this.x!=oldx || this.y!=oldy || this.exp!=oldexp;
};

/** processMousedownEvent */
teka.viewer.kakuro.KakuroViewer.prototype.processMousedownEvent = function(xc, yc)
{
    var erg = this.processMousemoveEvent(xc,yc,false);
    
    if (this.puzzle[this.x][this.y]!=null) {
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
            this.set(this.x,this.y,(((this.f[this.x][this.y]-100)%10)+1)%10+((this.f[this.x][this.y]-100)/10*10)+100);
        } else {
            this.set(this.x,this.y,((((this.f[this.x][this.y]-100)/10)+1)%10)*10+((this.f[this.x][this.y]-100)%10)+100);
        }
        return true;
    }
    
    if (this.f[this.x][this.y]>=1000) {
        var nr = ((this.xm<3*this.scale/8)?0:(this.xm>this.scale-3*this.scale/8)?2:1)+
        3*((this.ym<3*this.scale/8)?0:(this.ym>this.scale-3*this.scale/8)?2:1)+1;
        this.set(this.x,this.y,((this.f[this.x][this.y]-1000)^(1<<nr))+1000);
        return true;
    }
    
    this.set(this.x,this.y,(this.f[this.x][this.y]+1)%10);
    
    return true;
};

/** processKeydownEvent */
teka.viewer.kakuro.KakuroViewer.prototype.processKeydownEvent = function(e)
{
    this.exp = false;
    
    if (e.key==teka.KEY_DOWN) {
        if (this.y<this.Y-1) {
            this.y++;
        }
        return true;
    }
    if (e.key==teka.KEY_UP) {
        if (this.y>1) {
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
        if (this.x>1) {
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

    if (e.key>=teka.KEY_1 && e.key<=teka.KEY_9) {
        this.set(this.x,this.y,e.key-teka.KEY_0);
        return true;
    }
    
    /*
    if (this.c>='1' && this.c<='9') {
        if (this.f[this.x][this.y]>=100 && this.f[this.x][this.y]<110) {
            this.set(this.x,this.y,this.f[this.x][this.y]+10*(this.c-'0'));
        } else if (this.f[this.x][this.y]>=1000) {
            this.set(this.x,this.y,((this.f[this.x][this.y]-1000)^(1<<(this.c-'0')))+1000);
        } else {
            this.set(this.x,this.y,this.c-'0');
        }
    } else if (this.c==' ') {
        this.set(this.x,this.y,0);
    } else if (this.c=='-') {
        if (this.f[this.x][this.y]<100) {
            this.set(this.x,this.y,100+this.f[this.x][this.y]);
        }
    } else if (this.c=='#' || this.c==',') {
        if (this.f[this.x][this.y]<1000) {
            this.set(this.x,this.y,this.setExpert(this.f[this.x][this.y]));
        } else {
            this.set(this.x,this.y,this.getExpert(this.f[this.x][this.y]));
        }
    } else {
        return false;
    }
     */
    return false;
};

//////////////////////////////////////////////////////////////////

/** Sets the value of a cell, if the color fits. */
teka.viewer.kakuro.KakuroViewer.prototype.set = function(x, y, value)
{
    if (this.f[x][y]!=1000 && this.f[x][y]!=0 && this.c[x][y]!=this.color) {
        return;
    }
    this.f[x][y]=value;
    this.c[x][y]=this.color;
};

/** getDigit */
teka.viewer.kakuro.KakuroViewer.prototype.getDigit = function(h)
{
    if (h<10) {
        return h;
    }
    if (h<100) {
        return 0;
    }
    if (h<1000) {
        var a = (h-100)%10;
        var b = (h-100)/10;
        if (a==0 && b==1) {
            return 1;
        }
        if (a==9 && b==0) {
            return 9;
        }
        if (a==b) {
            return a;
        }
        return 0;
    }
    var k = -1;
    for (var i=1;i<=9;i++) {
        if (((h-1000)&(1<<i))!=0) {
            if (k!=-1) {
                return 0;
            }
            k = i;
        }
    }
    if (k==-1) {
        return 0;
    }
    return k;
};

/** Converts from normal mode to expert mode. */
teka.viewer.kakuro.KakuroViewer.prototype.setExpert = function(h)
{
    if (h==0) {
        return 1000;
    }
    if (h<10) {
        return 1000+(1<<h);
    }
    var a = (h-100)%10;
    var b = (h-100)/10;
    if (b==0) {
        b=9;
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
    return k;
};

/** Converts back from expert mode to normal mode. */
teka.viewer.kakuro.KakuroViewer.prototype.getExpert = function(h)
{
    var min = 10;
    var max = 0;
    h = h-1000;
    for (var i=1;i<=9;i++) {
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
    return 100+10*max+min;
};

