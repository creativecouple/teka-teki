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
teka.viewer.skyscrapers = {};

/** Some constants. */
teka.viewer.skyscrapers.Defaults = {
    EMPTY: 0
};

/** Constructor */
teka.viewer.skyscrapers.SkyscrapersViewer = function(data)
{
    teka.viewer.PuzzleViewer.call(this,data);

    this.x = 0;
    this.y = 0;
    this.xm = 0;
    this.ym = 0;
    this.exp = false;
};
teka.extend(teka.viewer.skyscrapers.SkyscrapersViewer,teka.viewer.PuzzleViewer);

//////////////////////////////////////////////////////////////////

/** Initialize this viewer width the PSData object provided. */
teka.viewer.skyscrapers.SkyscrapersViewer.prototype.initData = function(data)
{
    this.X = parseInt(data.get('size'),10);
    var digits = data.get('digits');
    digits = digits===false?1:parseInt(data.get('digits'),10);
    this.asciiToData(data.get('puzzle'),digits);
    this.asciiToSolution(data.get('solution'),digits);

    this.f = teka.new_array([this.X,this.X],0);
    this.c = teka.new_array([this.X,this.X],0);
    this.error = teka.new_array([this.X,this.X],false);
    this.error_top = teka.new_array([this.X],false);
    this.error_bottom = teka.new_array([this.X],false);
    this.error_left = teka.new_array([this.X],false);
    this.error_right = teka.new_array([this.X],false);
};

/** Read puzzle from ascii art. */
teka.viewer.skyscrapers.SkyscrapersViewer.prototype.asciiToData = function(ascii, d)
{
    if (ascii===false) {
        return;
    }

    var grid = this.asciiToArray(ascii);

    this.puzzle = teka.new_array([this.X,this.X],teka.viewer.skyscrapers.Defaults.EMPTY);
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.X;j++) {
            var nr = this.getNr(grid,d*(i+1),j+1,d);
            if (nr!==false) {
                this.puzzle[i][j] = nr;
            }
        }
    }

    this.leftdata = teka.new_array([this.X],-1);
    this.rightdata = teka.new_array([this.X],-1);
    this.topdata = teka.new_array([this.X],-1);
    this.bottomdata = teka.new_array([this.X],-1);
    for (var i=0;i<this.X;i++) {
        var nr = this.getNr(grid,d*(i+1),0,d);
        if (nr!==false) {
            this.topdata[i] = nr;
        }
        nr = this.getNr(grid,d*(i+1),this.X+1,d);
        if (nr!==false) {
            this.bottomdata[i] = nr;
        }
        nr = this.getNr(grid,0,i+1,d);
        if (nr!==false) {
            this.leftdata[i] = nr;
        }
        nr = this.getNr(grid,d*(this.X+1),i+1,d);
        if (nr!==false) {
            this.rightdata[i] = nr;
        }
    }
};

/** Read solution from ascii art. */
teka.viewer.skyscrapers.SkyscrapersViewer.prototype.asciiToSolution = function(ascii, d)
{
    if (ascii===false) {
        return;
    }

    var grid = this.asciiToArray(ascii);

    this.solution = teka.new_array([this.X,this.X],0);
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.X;j++) {
            var nr = this.getNr(grid,d*i,j,d);
            if (nr!==false) {
                this.solution[i][j] = nr;
            }
        }
    }
};

/** Add solution. */
teka.viewer.skyscrapers.SkyscrapersViewer.prototype.addSolution = function()
{
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.X;j++) {
            this.f[i][j] = this.solution[i][j];
        }
    }
};

//////////////////////////////////////////////////////////////////

/** Returns a small example. */
teka.viewer.skyscrapers.SkyscrapersViewer.prototype.getExample = function()
{
    return '/format 1\n/type (skyscrapers)\n/sol false\n/size 4\n'
        +'/puzzle [ ( 3    ) (     2) (     1) (2     ) (     4) (   2  ) ]\n'
        +'/solution [ (2413) (1234) (3142) (4321) ]';
};

/** Returns a list of automatically generated properties. */
teka.viewer.skyscrapers.SkyscrapersViewer.prototype.getProperties = function()
{
    return [teka.translate('generic_size',[this.X+'x'+this.X])];
};

//////////////////////////////////////////////////////////////////

/** Reset the whole diagram. */
teka.viewer.skyscrapers.SkyscrapersViewer.prototype.reset = function()
{
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.X;j++) {
            this.f[i][j] = teka.viewer.skyscrapers.Defaults.EMPTY;
            this.c[i][j] = 0;
        }
    }
};

/** Reset the error marks. */
teka.viewer.skyscrapers.SkyscrapersViewer.prototype.clearError = function()
{
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.X;j++) {
            this.error[i][j] = false;
        }
    }
    for (var i=0;i<this.X;i++) {
        this.error_top[i] = false;
        this.error_bottom[i] = false;
        this.error_left[i] = false;
        this.error_right[i] = false;
    }
};

/** Copy digits colored with this.color to color. */
teka.viewer.skyscrapers.SkyscrapersViewer.prototype.copyColor = function(color)
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
teka.viewer.skyscrapers.SkyscrapersViewer.prototype.clearColor = function(color)
{
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.X;j++) {
            if (this.c[i][j]==color) {
                this.f[i][j] = teka.viewer.skyscrapers.Defaults.EMPTY;
            }
        }
    }
};

/** Save current state. */
teka.viewer.skyscrapers.SkyscrapersViewer.prototype.saveState = function()
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
teka.viewer.skyscrapers.SkyscrapersViewer.prototype.loadState = function(state)
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
teka.viewer.skyscrapers.SkyscrapersViewer.prototype.check = function()
{
    var X = this.X;

    // Overwrite digits, that are allready given
    for (var i=0;i<X;i++) {
        for (var j=0;j<X;j++) {
            if (this.puzzle[i][j]!=teka.viewer.skyscrapers.Defaults.EMPTY) {
                this.f[i][j] = this.puzzle[i][j];
            }
        }
    }

    // Copy to array check, removing expert mode symbols.
    var check = teka.new_array([X,X],0);
    for (var i=0;i<X;i++) {
        for (var j=0;j<X;j++) {
            if (this.f[i][j]>=1000) {
                check[i][j] = this.getExpert(this.f[i][j]);
                if (check[i][j]<1 || check[i][j]>9) {
                    this.error[i][j] = true;
                    return 'skyscrapers_not_unique';
                }
                continue;
            }

            if (this.f[i][j]>=100) {
                var min = this.f[i][j]%10;
                var max = Math.floor((this.f[i][j]-100)/10);
                if (min===0 && max===1) {
                    min = 1;
                }
                if (min===this.X && max===0) {
                    max = this.X;
                }
                if (min!=max) {
                    this.error[i][j] = true;
                    return 'skyscrapers_not_unique';
                }
                check[i][j] = min;
                continue;
            }

            check[i][j] = this.f[i][j];

            if (check[i][j]==teka.viewer.skyscrapers.Defaults.EMPTY) {
                this.error[i][j] = true;
                return 'skyscrapers_empty';
            }
        }
    }

    // Check duplicates in row
    for (var j=0;j<X;j++) {
        var da = teka.new_array([X],false);
        for (var i=0;i<X;i++) {
            if (da[check[i][j]-1]===true) {
                for (var ii=0;ii<X;ii++) {
                    if (check[ii][j]==check[i][j]) {
                        this.error[ii][j] = true;
                    }
                }
                return 'skyscrapers_row_duplicate';
            } else {
                da[check[i][j]-1] = true;
            }
        }
    }

    // Check duplicates in column
    for (var i=0;i<X;i++) {
        var da = teka.new_array([X],false);
        for (var j=0;j<X;j++) {
            if (da[check[i][j]-1]===true) {
                for (var jj=0;jj<X;jj++) {
                    if (check[i][jj]==check[i][j]) {
                        this.error[i][jj] = true;
                    }
                }
                return 'skyscrapers_column_duplicate';
            } else {
                da[check[i][j]-1] = true;
            }
        }
    }

    for (var i=0;i<X;i++) {
        if (this.topdata[i]!=-1) {
            if (this.count(check,i,0,0,1,false)!=this.topdata[i]) {
                this.count(check,i,0,0,1,true);
                this.error_top[i] = true;
                return 'skyscrapers_top_wrong';
            }
        }
        if (this.bottomdata[i]!=-1) {
            if (this.count(check,i,X-1,0,-1,false)!=this.bottomdata[i]) {
                this.count(check,i,X-1,0,-1,true);
                this.error_bottom[i] = true;
                return 'skyscrapers_bottom_wrong';
            }
        }
        if (this.leftdata[i]!=-1) {
            if (this.count(check,0,i,1,0,false)!=this.leftdata[i]) {
                this.count(check,0,i,1,0,true);
                this.error_left[i] = true;
                return 'skyscrapers_left_wrong';
            }
        }
        if (this.rightdata[i]!=-1) {
            if (this.count(check,X-1,i,-1,0,false)!=this.rightdata[i]) {
                this.count(check,X-1,i,-1,0,true);
                this.error_right[i] = true;
                return 'skyscrapers_right_wrong';
            }
        }
    }

    return true;
};

/** Count visible skyscrapers, seen from x,y in dir dx,dy */
teka.viewer.skyscrapers.SkyscrapersViewer.prototype.count = function(check, x, y, dx, dy, seterror)
{
    var c = 0;
    var h = 0;

    while (x>=0 && x<this.X && y>=0 && y<this.X) {
        if (check[x][y]>h) {
            if (seterror) {
                this.error[x][y] = true;
            }
            c++;
            h = check[x][y];
        }
        x+=dx;
        y+=dy;
    }

    return c;
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
teka.viewer.skyscrapers.SkyscrapersViewer.prototype.setMetrics = function(g)
{
    this.scale = Math.floor(Math.min((this.width-1)/(this.X+2),
                                     (this.height-1)/(this.X+2)));
    var realwidth = (this.X+2)*this.scale+1;
    var realheight = (this.X+2)*this.scale+1;

    this.deltaX = Math.floor((this.width-realwidth)/2)+0.5;
    this.deltaY = Math.floor((this.height-realheight)/2)+0.5;
    this.borderX = this.scale;
    this.borderY = this.scale;

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
teka.viewer.skyscrapers.SkyscrapersViewer.prototype.paint = function(g)
{
    var X = this.X;
    var S = this.scale;

    g.save();
    g.translate(this.deltaX,this.deltaY);

    g.fillStyle = '#fff';
    g.fillRect(S,S,X*S,X*S);

    // paint the background of the cells
    for (var i=0;i<X;i++) {
        for (var j=0;j<X;j++) {
            g.fillStyle = this.isBlinking()?
                this.getBlinkColor(i,j,X,this.f[i][j]):
                (this.error[i][j]?'#f00':'#fff');
            g.fillRect((i+1)*S,(j+1)*S,S,S);
        }
    }

    g.strokeStyle = '#000';
    for (var i=1;i<=X+1;i++) {
        teka.drawLine(g,i*S,S,i*S,(X+1)*S);
    }
    for (var j=1;j<=X+1;j++) {
        teka.drawLine(g,S,j*S,(X+1)*S,j*S);
    }

    // paint outside clues
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.font = this.font.font;
    for (var i=0;i<X;i++) {
        if (this.topdata[i]!=-1) {
            if (this.error_top[i]===true) {
                g.fillStyle = '#f00';
                teka.fillOval(g,(i+1)*S+S/2,S/2,S/3);
                g.strokeStyle = '#000';
                teka.strokeOval(g,(i+1)*S+S/2,S/2,S/3);
            }
            g.fillStyle = '#000';
            g.fillText(this.topdata[i],(i+1)*S+S/2,S/2+this.font.delta);
        }
        if (this.bottomdata[i]!=-1) {
            if (this.error_bottom[i]===true) {
                g.fillStyle = '#f00';
                teka.fillOval(g,(i+1)*S+S/2,(X+1)*S+S/2,S/3);
                g.strokeStyle = '#000';
                teka.strokeOval(g,(i+1)*S+S/2,(X+1)*S+S/2,S/3);
            }
            g.fillStyle = '#000';
            g.fillText(this.bottomdata[i],(i+1)*S+S/2,(X+1)*S+S/2+this.font.delta);
        }
        if (this.leftdata[i]!=-1) {
            if (this.error_left[i]===true) {
                g.fillStyle = '#f00';
                teka.fillOval(g,S/2,(i+1)*S+S/2,S/3);
                g.strokeStyle = '#000';
                teka.strokeOval(g,S/2,(i+1)*S+S/2,S/3);
            }
            g.fillStyle = '#000';
            g.fillText(this.leftdata[i],S/2,(i+1)*S+S/2+this.font.delta);
        }
        if (this.rightdata[i]!=-1) {
            if (this.error_right[i]===true) {
                g.fillStyle = '#f00';
                teka.fillOval(g,(X+1)*S+S/2,(i+1)*S+S/2,S/3);
                g.strokeStyle = '#000';
                teka.strokeOval(g,(X+1)*S+S/2,(i+1)*S+S/2,S/3);
            }
            g.fillStyle = '#000';
            g.fillText(this.rightdata[i],(X+1)*S+S/2,(i+1)*S+S/2+this.font.delta);
        }
    }

    // paint content of the cells
    for (var i=0;i<X;i++) {
        for (var j=0;j<X;j++) {
            if (this.puzzle[i][j]!=teka.viewer.skyscrapers.Defaults.EMPTY) {
                g.fillStyle = '#000';
                g.font = this.boldfont.font;
                g.fillText(this.puzzle[i][j],(i+1)*S+S/2,(j+1)*S+S/2+this.boldfont.delta);
                continue;
            }
            if (this.f[i][j]===0) {
                continue;
            }

            if (this.f[i][j]>0 && this.f[i][j]<=X) {
                g.fillStyle = this.getColorString(this.c[i][j]);
                g.font = this.font.font;
                g.fillText(this.f[i][j],S*(i+1)+S/2,S*(j+1)+S/2+this.font.delta);
                continue;
            }

            if (this.f[i][j]>=100 && this.f[i][j]<1000) {
                var a = (this.f[i][j]-100)%10;
                var b = Math.floor((this.f[i][j]-100)/10);
                var tmp = (a===0?'?':a)+'-'+(b===0?'?':b);

                g.fillStyle = this.getColorString(this.c[i][j]);
                g.font = this.mediumfont.font;
                g.fillText(tmp,S*(i+1)+S/2,S*(j+1)+S/2+this.mediumfont.delta);
                continue;
            }

            // numbers in expert mode
            g.fillStyle = this.getColorString(this.c[i][j]);
            g.font = this.smallfont.font;
            for (var k=1;k<=9;k++) {
                if (((this.f[i][j]-1000)&(1<<k))!=0) {
                    g.fillText(k,
                               S*(i+1)+((k-1)%3+1)*S/4,
                               S*(j+1)+Math.floor((k-1)/3+1)*S/4+this.smallfont.delta);
                }
            }

            // expert grid
            g.strokeStyle = '#888';
            teka.drawLine(g,S*(i+1)+3*S/8,S*(j+1)+S/8,S*(i+1)+3*S/8,S*(j+2)-S/8);
            teka.drawLine(g,S*(i+2)-3*S/8,S*(j+1)+S/8,S*(i+2)-3*S/8,S*(j+2)-S/8);
            teka.drawLine(g,S*(i+1)+S/8,S*(j+1)+3*S/8,S*(i+2)-S/8,S*(j+1)+3*S/8);
            teka.drawLine(g,S*(i+1)+S/8,S*(j+2)-3*S/8,S*(i+2)-S/8,S*(j+2)-3*S/8);

            // little x
            teka.drawLine(g,(i+2)*S-S/8-2,(j+2)*S-S/8-2,(i+2)*S-2,(j+2)*S-2);
            teka.drawLine(g,(i+2)*S-S/8-2,(j+2)*S-2,(i+2)*S-2,(j+2)*S-S/8-2);
        }
    }

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
teka.viewer.skyscrapers.SkyscrapersViewer.prototype.processMousemoveEvent = function(xc, yc, pressed)
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
    this.exp = this.X<=9 &&
        this.xm>this.scale-this.scale/8 && this.ym>this.scale-this.scale/8;

    return this.x!=oldx || this.y!=oldy || this.exp!=oldexp;
};

/** Handles mousedown event. */
teka.viewer.skyscrapers.SkyscrapersViewer.prototype.processMousedownEvent = function(xc, yc)
{
    var erg = this.processMousemoveEvent(xc,yc);

    if (this.x<0 || this.y<0 || this.x>=this.X || this.y>=this.X) {
        return erg;
    }

    if (this.X<=9) {
        if (this.xm>this.scale-this.scale/8 && this.ym>this.scale-this.scale/8) {
            if (this.f[this.x][this.y]<1000) {
                this.set(this.x,this.y,this.setExpert(this.f[this.x][this.y]));
            } else {
                this.set(this.x,this.y,this.getExpert(this.f[this.x][this.y]));
            }
            return true;
        }
    }

    if (this.X<=9) {
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

    this.set(this.x,this.y,(this.f[this.x][this.y]+1)%(this.X+1));

    return true;
};

/** Handles keydown event. */
teka.viewer.skyscrapers.SkyscrapersViewer.prototype.processKeydownEvent = function(e)
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
        this.set(this.x,this.y,teka.viewer.skyscrapers.Defaults.EMPTY);
        return true;
    }

    if (e.key>=teka.KEY_0 && e.key<=teka.KEY_9) {
        var val = e.key-teka.KEY_0;
        if (val>this.X) {
            return false;
        }

        if (this.f[this.x][this.y]>=1000) {
            this.set(this.x,this.y,((this.f[this.x][this.y]-1000)^(1<<val))+1000);
        } else if (this.f[this.x][this.y]>=100 && this.f[this.x][this.y]<110) {
            this.set(this.x,this.y,this.f[this.x][this.y]+10*val);
        } else {
            if (this.f[this.x][this.y]>0 &&
                this.f[this.x][this.y]*10+(e.key-teka.KEY_0)<=this.X) {
                this.set(this.x,this.y,this.f[this.x][this.y]*10+val);
            } else if (e.key>=teka.KEY_1) {
                this.set(this.x,this.y,val);
            }
        }
        return true;
    }

    if (e.key==teka.KEY_MINUS && this.X<=9) {
        if (this.f[this.x][this.y]<100 && this.f[this.x][this.y]>=0) {
            this.set(this.x,this.y,100+this.f[this.x][this.y]);
        } else {
            this.set(this.x,this.y,100);
        }
        return true;
    }

    if ((e.key==teka.KEY_HASH || e.key==teka.KEY_COMMA) && this.X<=9) {
        if (this.f[this.x][this.y]<1000) {
            this.set(this.x,this.y,this.setExpert(this.f[this.x][this.y]));
        } else {
            this.set(this.x,this.y,this.getExpert(this.f[this.x][this.y]));
        }
        return true;
    }

    return true;
};

//////////////////////////////////////////////////////////////////

/** Sets the value of a cell, if the color fits. */
teka.viewer.skyscrapers.SkyscrapersViewer.prototype.set = function(x, y, value)
{
    if (this.f[x][y]!=0 && this.f[x][y]!=1000 && this.c[x][y]!=this.color) {
        return;
    }

    this.f[x][y] = value;
    this.c[x][y] = this.color;
};

/** Converts from normal mode to expert mode. */
teka.viewer.skyscrapers.SkyscrapersViewer.prototype.setExpert = function(h)
{
    if (h===0) {
        return 1000;
    }
    if (h<10) {
        return 1000+(1<<h);
    }
    var a = (h-100)%10;
    var b = (h-100)/10;
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
    return k;
};

/** Converts back from expert mode to normal mode. */
teka.viewer.skyscrapers.SkyscrapersViewer.prototype.getExpert = function(h)
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
