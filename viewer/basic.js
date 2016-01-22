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
teka.viewer.basic = {};

/** Some constants. */
teka.viewer.basic.Defaults = {
    NONE: 0
};

/** Constructor */
teka.viewer.basic.BasicViewer = function(data)
{
    teka.viewer.PuzzleViewer.call(this,data);

    this.x = 0;
    this.y = 0;
    this.xm = 0;
    this.ym = 0;
    this.exp = false;
};
teka.extend(teka.viewer.basic.BasicViewer,teka.viewer.PuzzleViewer);

//////////////////////////////////////////////////////////////////

/** Initialize this viewer width the PSData object provided. */
teka.viewer.basic.BasicViewer.prototype.initData = function(data)
{
    this.X = parseInt(data.get('size'),10);
    var digits = data.get('digits');
    digits = digits===false?1:parseInt(data.get('digits'),10);
    if (digits<2) {
        digits = 2;
    }
    this.asciiToData(data.get('puzzle'),digits);
    this.asciiToSolution(data.get('solution'));

    this.f = teka.new_array([this.X,this.X],0);
    this.c = teka.new_array([this.X,this.X],0);
    this.error = teka.new_array([this.X,this.X],false);
};

/** Read puzzle from ascii art. */
teka.viewer.basic.BasicViewer.prototype.asciiToData = function(ascii,d)
{
    if (ascii===false) {
        return;
    }

    var grid = this.asciiToArray(ascii);

    this.puzzle = teka.new_array([this.X,this.X],0);
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.X;j++) {
            if (grid[i*(d+1)+1][3*j+1]!=teka.ord(' ')) {
                this.puzzle[i][j] = grid[i*(d+1)+1][3*j+1]-teka.ord('0');
            }
        }
    }

    this.area = teka.new_array([this.X,this.X],-1);
    this.mini = teka.new_array([this.X,this.X],-1);
    this.op = teka.new_array([this.X,this.X],teka.ord(' '));
    var c = 0;
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.X;j++) {
            if (this.area[i][j]==-1) {
                this.fillArea(grid,i,j,c,d);
                c++;
            }
        }
    }
};

/** Recursivly determine an area an it's values. */
teka.viewer.basic.BasicViewer.prototype.fillArea = function(c, x, y, value, d)
{
    if (x<0 || x>=this.X || y<0 || y>=this.X) {
        return;
    }
    if (this.area[x][y]!=-1) {
        return;
    }
    this.area[x][y] = value;
    if (c[(d+1)*x+d][3*y+1]!=teka.ord(' ')) {
        this.op[x][y] = c[(d+1)*x+d][3*y+1];
    }
    if (c[(d+1)*x+d][3*y+2]!=teka.ord(' ')) {
        this.mini[x][y] = 0;
        var k = 0;
        var exp = 1;
        while (k<d && c[(d+1)*x+d-k][3*y+2]!=teka.ord(' '))
            {
                this.mini[x][y] += exp*(c[(d+1)*x+d-k][3*y+2]-teka.ord('0'));
                exp *= 10;
                k++;
            }
    }

    if (c[(d+1)*x][3*y+1]==teka.ord(' ')) {
        this.fillArea(c,x-1,y,value,d);
    }
    if (c[(d+1)*x+(d+1)][3*y+1]==teka.ord(' ')) {
        this.fillArea(c,x+1,y,value,d);
    }
    if (c[(d+1)*x+1][3*y]==teka.ord(' ')) {
        this.fillArea(c,x,y-1,value,d);
    }
    if (c[(d+1)*x+1][3*y+3]==teka.ord(' ')) {
        this.fillArea(c,x,y+1,value,d);
    }
};

/** Read solution from ascii art. */
teka.viewer.basic.BasicViewer.prototype.asciiToSolution = function(ascii)
{
    if (ascii===false) {
        return;
    }

    var grid = this.asciiToArray(ascii);

    this.solution = teka.new_array([this.X,this.X],0);
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.X;j++) {
            if (grid[i][j]!=teka.ord(' ')) {
                this.solution[i][j] = grid[i][j]-teka.ord('0');
            }
        }
    }
};

/** asciiToArea */
teka.viewer.basic.BasicViewer.prototype.asciiToArea = function(ascii)
{
    if (ascii===false) {
        return;
    }

};

/** Add solution. */
teka.viewer.basic.BasicViewer.prototype.addSolution = function()
{
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.X;j++) {
            this.f[i][j] = this.solution[i][j];
        }
    }
};

//////////////////////////////////////////////////////////////////

/** Returns a small example. */
teka.viewer.basic.BasicViewer.prototype.getExample = function()
{
    return '/format 1\n/type (basic)\n/sol false\n/size 4\n/digits 2\n'
        +'/puzzle [ (+--+--+--+--+) (|3 | x|     |) (|  | 8| 2   |) '
        +'(+  +  +--+--+) (|  |   1 | +|) (|  |     |10|) (+--+--+--+  +) '
        +'(| :   |     |) (| 2   |     |) (+--+--+--+--+) (| +   | -   |) '
        +'(| 4   | 2   |) (+--+--+--+--+) ]\n/solution [ (3421) (4213) (2134) (1342) ]';
};

/** Returns a list of automatically generated properties. */
teka.viewer.basic.BasicViewer.prototype.getProperties = function()
{
    return [teka.translate('generic_size',[this.X+'x'+this.X])];
};

//////////////////////////////////////////////////////////////////

/** Reset the whole diagram. */
teka.viewer.basic.BasicViewer.prototype.reset = function()
{
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.X;j++) {
            this.f[i][j] = teka.viewer.basic.Defaults.NONE;
            this.c[i][j] = 0;
        }
    }
};

/** Reset the error marks. */
teka.viewer.basic.BasicViewer.prototype.clearError = function()
{
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.X;j++) {
            this.error[i][j] = false;
        }
    }
};

/** Copy digits colored with this.color to color. */
teka.viewer.basic.BasicViewer.prototype.copyColor = function(color)
{
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.X;j++) {
            if (this.c[i][j]==this.color && this.puzzle[i][j]===0) {
                this.c[i][j] = color;
            }
        }
    }
};

/** Delete all digits with color. */
teka.viewer.basic.BasicViewer.prototype.clearColor = function(color)
{
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.X;j++) {
            if (this.c[i][j]==color && this.puzzle[i][j]===0) {
                this.f[i][j] = teka.viewer.basic.Defaults.NONE;
            }
        }
    }
};

/** Save current state. */
teka.viewer.basic.BasicViewer.prototype.saveState = function()
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
teka.viewer.basic.BasicViewer.prototype.loadState = function(state)
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
teka.viewer.basic.BasicViewer.prototype.check = function()
{
    var X = this.X;

    // copy givens into f
    for (var i=0;i<X;i++) {
        for (var j=0;j<X;j++) {
            if (this.puzzle[i][j]!=teka.viewer.basic.Defaults.NONE) {
                this.f[i][j] = this.puzzle[i][j];
            }
        }
    }

    // convert user input to check
    var check = teka.new_array([X,X],0);
    for (var i=0;i<X;i++) {
        for (var j=0;j<X;j++) {
            if (this.f[i][j]>=1000) {
                check[i][j] = this.getExpert(this.f[i][j]);
                if (check[i][j]==teka.viewer.basic.Defaults.NONE && this.f[i][j]!=1000) {
                    this.error[i][j] = true;
                    return 'basic_not_unique';
                }
            } else {
                check[i][j] = this.f[i][j];
            }

            if (check[i][j]==teka.viewer.basic.Defaults.NONE) {
                this.error[i][j] = true;
                return 'basic_empty';
            }
        }
    }

    // check rows
    for (var i=0;i<X;i++) {
        if (!this.checkRow(check,i)) {
            return 'basic_row_duplicate';
        }
    }

    // check columns
    for (var i=0;i<X;i++) {
        if (!this.checkColumn(check,i)) {
            return 'basic_column_duplicate';
        }
    }

    var mark = teka.new_array([this.X,this.X],false);
    for (var i=0;i<X;i++) {
        for (var j=0;j<X;j++) {
            if (mark[i][j]===false) {
                var erg = this.checkSums(check,i,j,mark);
                if (erg!=null) {
                    return erg;
                }
            }
        }
    }

    return true;
};

/** Check, if all digits in a row are distinct */
teka.viewer.basic.BasicViewer.prototype.checkRow = function(check, j)
{
    var used = teka.new_array([this.X],false);

    for (var i=0;i<this.X;i++) {
        if (used[check[i][j]-1]) {
            for (var ii=0;ii<this.X;ii++) {
                if (check[i][j]==check[ii][j]) {
                    this.error[ii][j] = true;
                }
            }
            return false;
        }

        used[check[i][j]-1] = true;
    }

    return true;
};

/** Check, if all digits in a column are distinct */
teka.viewer.basic.BasicViewer.prototype.checkColumn = function(check, i)
{
    var used = teka.new_array([this.X],false);

    for (var j=0;j<this.X;j++) {
        if (used[check[i][j]-1]) {
            for (var jj=0;jj<this.X;jj++) {
                if (check[i][j]==check[i][jj]) {
                    this.error[i][jj] = true;
                }
            }

            return false;
        }
        used[check[i][j]-1] = true;
    }

    return true;
};

/** Check, if all conditions on a small area are fulfilled */
teka.viewer.basic.BasicViewer.prototype.checkSums = function(check, x, y, mark)
{
    var sum = 0;
    var prod = 1;
    var max = 0;
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.X;j++) {
            if (this.area[i][j]==this.area[x][y]) {
                sum+=check[i][j];
                prod*=check[i][j];
                max=Math.max(max,check[i][j]);
                mark[i][j] = true;
            }
        }
    }
    if (this.mini[x][y]==-1) {
        return null;
    }

    if (this.op[x][y]==teka.ord('+') && this.mini[x][y]==sum) {
        return null;
    }
    if (this.op[x][y]==teka.ord('x') && this.mini[x][y]==prod) {
        return null;
    }
    if (this.op[x][y]==teka.ord('-') && this.mini[x][y]==2*max-sum) {
        return null;
    }
    if (this.op[x][y]==teka.ord(':') && prod%max===0 &&
        max%Math.floor(prod/max)===0 && this.mini[x][y]==max/Math.floor(prod/max)) {
            return null;
    }
    if (this.op[x][y]==teka.ord(' ')) {
        if (this.mini[x][y]==sum || this.mini[x][y]==prod || this.mini[x][y]==2*max-sum) {
            return null;
        }
        if (prod%max===0 && max%Math.floor(prod/max)===0 && this.mini[x][y]==max/Math.floor(prod/max)) {
            return null;
        }
    }

    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.X;j++) {
            if (this.area[i][j]==this.area[x][y]) {
                this.error[i][j] = true;
            }
        }
    }
    return 'basic_wrong_result';
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
teka.viewer.basic.BasicViewer.prototype.setMetrics = function(g)
{
    this.scale = Math.floor(Math.min((this.width-3)/this.X,
                                     (this.height-3-(this.textHeight+2))/this.X));
    var realwidth = this.X*this.scale+3;
    var realheight = this.X*this.scale+3+this.textHeight+2;

    this.bottomText = teka.translate('basic_digits',[this.X]);
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
teka.viewer.basic.BasicViewer.prototype.paint = function(g)
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
    g.lineWidth = 3;
    g.strokeRect(0,0,X*S,X*S);
    g.lineWidth = 1;

    for (var i=1;i<X;i++) {
        teka.drawLine(g,0,i*S,X*S,i*S);
        teka.drawLine(g,i*S,0,i*S,X*S);
    }

    g.lineWidth = 3;
    g.lineCap = 'square';
    for (var i=0;i<X-1;i++) {
        for (var j=0;j<X;j++) {
            if (this.area[i][j]!=this.area[i+1][j]) {
                teka.drawLine(g,(i+1)*S,j*S,(i+1)*S,(j+1)*S);
            }
        }
    }

    for (var i=0;i<X;i++) {
        for (var j=0;j<X-1;j++) {
            if (this.area[i][j]!=this.area[i][j+1]) {
                teka.drawLine(g,i*S,(j+1)*S,(i+1)*S,(j+1)*S);
            }
        }
    }
    g.lineCap = 'butt';
    g.lineWidth = 1;

    // paint the numbers in the top left of the small areas
    g.textAlign = 'left';
    g.textBaseline = 'top';
    for (var i=0;i<X;i++) {
        for (var j=0;j<X;j++) {
            if (this.mini[i][j]>=0) {
                g.fillStyle = this.isBlinking()?
                    this.getBlinkColor(i,j,X,this.f[i][j]):
                    (this.error[i][j]?'#f00':'#fff');
                g.font = this.smallfont.font;
                var t_width = g.measureText(this.mini[i][j]).width;
                var t_height = (S-6)/4-this.smallfont.delta;
                g.fillRect(i*S+2,j*S+2,t_width+t_height,t_height);
                g.fillStyle = '#000';
                g.fillText(this.mini[i][j],i*S+2,j*S+2);
                this.paintOperator(g,i*S+2+t_width,j*S+2,this.op[i][j],t_height);
            }
        }
    }

    // paint the content of the cells
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    for (var i=0;i<X;i++) {
        for (var j=0;j<X;j++) {
            // given numbers
            if (this.puzzle[i][j]!==0) {
                g.fillStyle = '#000';
                g.font = this.boldfont.font;
                g.fillText(this.puzzle[i][j],i*S+S/2,j*S+S/2+this.boldfont.delta);
                continue;
            }

            // empty?
            if (this.f[i][j]==teka.viewer.basic.Defaults.NONE) {
                continue;
            }

            // normal numbers
            g.fillStyle = this.getColorString(this.c[i][j]);
            if (this.f[i][j]<100) {
                g.font = this.font.font;
                g.fillText(this.f[i][j],i*S+S/2,j*S+S/2+this.font.delta);
                continue;
            }

            if (this.f[i][j]>=100 && this.f[i][j]<1000) {
                var a = (this.f[i][j]-100)%10;
                var b = Math.floor((this.f[i][j]-100)/10);
                var tmp = (a===0?'?':a)+'-'+(b===0?'?':b);

                g.fillStyle = this.getColorString(this.c[i][j]);
                g.font = this.mediumfont.font;
                g.fillText(tmp,S*i+S/2,S*j+S/2+this.mediumfont.delta);
                continue;
            }

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
        if (this.exp) {
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

teka.viewer.basic.BasicViewer.prototype.paintOperator = function(g, x, y, val, scale)
{
    g.strokeStyle = '#000';
    switch (val)
        {
          case teka.ord('+'):
            teka.drawLine(g,x+scale/10,y+scale/2,x+scale-scale/10,y+scale/2);
            teka.drawLine(g,x+scale/2,y+scale/10,x+scale/2,y+scale-scale/10);
            break;
          case teka.ord('-'):
            teka.drawLine(g,x+scale/10,y+scale/2,x+scale-scale/10,y+scale/2);
            break;
          case teka.ord('x'):
            teka.drawLine(g,x+scale/5,y+scale/5,x+scale-scale/5,y+scale-scale/5);
            teka.drawLine(g,x+scale/5,y+scale-scale/5,x+scale-scale/5,y+scale/5);
            break;
          case teka.ord(':'):
            teka.drawLine(g,x+2,y+scale/2,x+scale-2,y+scale/2);
            teka.fillOval(g,x+scale/2,y+scale/4,scale/10);
            teka.fillOval(g,x+scale/2,y+scale-scale/4,scale/10);
            break;
        }
};

//////////////////////////////////////////////////////////////////

/** Handles mousemove event. */
teka.viewer.basic.BasicViewer.prototype.processMousemoveEvent = function(xc, yc, pressed)
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
teka.viewer.basic.BasicViewer.prototype.processMousedownEvent = function(xc, yc)
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

    if (this.f[this.x][this.y]>=100 && this.f[this.x][this.y]<1000) {
        if (this.xm<this.scale/2) {
            this.set(this.x,this.y,
                     (((this.f[this.x][this.y]-100)%10)+1)%(this.X+1)+
                     (Math.floor((this.f[this.x][this.y]-100)/10)*10)+100);
        } else {
            this.set(this.x,this.y,
                     ((Math.floor((this.f[this.x][this.y]-100)/10)+1)%(this.X+1))*10+
                     ((this.f[this.x][this.y]-100)%10)+100);
        }
        return true;
    }

    if (this.f[this.x][this.y]>=1000) {
        var nr = ((this.xm<3*this.scale/8)?0:(this.xm>this.scale-3*this.scale/8)?2:1)+
            3*((this.ym<3*this.scale/8)?0:(this.ym>this.scale-3*this.scale/8)?2:1)+1;
        if (nr<1 || nr>this.X) {
            return erg;
        }

        this.set(this.x,this.y,((this.f[this.x][this.y]-1000)^(1<<nr))+1000);
        return true;
    }

    this.set(this.x,this.y,(this.f[this.x][this.y]+1) % (this.X+1));

    return true;
};

/** Handles keydown event. */
teka.viewer.basic.BasicViewer.prototype.processKeydownEvent = function(e)
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

    if (e.key>=teka.KEY_1 && e.key<=teka.KEY_9) {
        var val = e.key-teka.KEY_0;
        if (val<=this.X) {
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
teka.viewer.basic.BasicViewer.prototype.set = function(x, y, value)
{
    if (this.puzzle[x][y]!=teka.viewer.basic.Defaults.NONE) {
        return;
    }
    if (this.f[x][y]!=teka.viewer.basic.Defaults.NONE && this.f[x][y]!=1000 && this.c[x][y]!=this.color) {
        return;
    }
    this.f[x][y] = value;
    this.c[x][y] = this.color;
};

/** Converts from normal mode to expert mode. */
teka.viewer.basic.BasicViewer.prototype.setExpert = function(h)
{
    if (h<=0) {
        return 1000;
    }
    if (h<10) {
        return 1000+(1<<h);
    }
    var a = (h-100)%10;
    var b = Math.floor((h-100)/10);
    if (b===0) {
        b=this.X;
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
teka.viewer.basic.BasicViewer.prototype.getExpert = function(h)
{
    var min = 10;
    var max = 0;
    h = h-1000;
    for (var i=1;i<=this.X;i++) {
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
    if (min==max) {
        return min;
    }
    return 100+10*max+min;
};
