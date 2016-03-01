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
teka.viewer.pills = {};

/** Some constants. */
teka.viewer.pills.Defaults = {
    EMPTY: 0,
    HORIZ: 1,
    VERT: 2,
    NONE: 3,
    CIRC: 4
};

/** Constructor */
teka.viewer.pills.PillsViewer = function(data)
{
    teka.viewer.PuzzleViewer.call(this,data);

    this.x = 0;
    this.y = 0;
    this.pills = false;
};
teka.extend(teka.viewer.pills.PillsViewer,teka.viewer.PuzzleViewer);

//////////////////////////////////////////////////////////////////

/** Initialize this viewer width the PSData object provided. */
teka.viewer.pills.PillsViewer.prototype.initData = function(data)
{
    this.X = parseInt(data.get('X'),10);
    this.Y = parseInt(data.get('Y'),10);
    this.MAX = parseInt(data.get('max'),10);
    this.asciiToData(data.get('puzzle'));
    this.asciiToSolution(data.get('solution'));

    this.f = teka.new_array([this.X,this.Y],0);
    this.c = teka.new_array([this.X,this.Y],0);
    this.f_pills = teka.new_array([this.MAX],false);
    this.c_pills = teka.new_array([this.MAX],0);
    this.error = teka.new_array([this.X,this.Y],false);
    this.error_top = teka.new_array([this.X],false);
    this.error_left = teka.new_array([this.Y],false);
    this.used = teka.new_array([this.X,this.Y],false);
};

/** Read puzzle from ascii art. */
teka.viewer.pills.PillsViewer.prototype.asciiToData = function(ascii)
{
    if (ascii===false) {
        return;
    }

    var grid = this.asciiToArray(ascii);

    this.puzzle = teka.new_array([this.X,this.Y],0);
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            this.puzzle[i][j] = grid[2*i+2][j+1]==teka.ord(' ')?(grid[2*i+3][j+1]-teka.ord('0'))
                :(10*(grid[2*i+2][j+1]-teka.ord('0'))+(grid[2*i+3][j+1]-teka.ord('0')));
        }
    }

    this.topdata = teka.new_array([this.X],0);
    for (var i=0;i<this.X;i++) {
        if (grid[2*i+2][0]==teka.ord(' ') && grid[2*i+3][0]==teka.ord(' ')) {
            this.topdata[i] = -1;
        } else {
            this.topdata[i] = grid[2*i+2][0]==teka.ord(' ')?(grid[2*i+3][0]-teka.ord('0'))
                :(10*(grid[2*i+2][0]-teka.ord('0'))+(grid[2*i+3][0]-teka.ord('0')));
        }
    }

    this.leftdata = teka.new_array([this.Y],0);
    for (var j=0;j<this.Y;j++) {
        if (grid[0][j+1]==teka.ord(' ') && grid[1][j+1]==teka.ord(' ')) {
            this.leftdata[j] = -1;
        } else {
            this.leftdata[j] = grid[0][j+1]==teka.ord(' ')?(grid[1][j+1]-teka.ord('0'))
                :(10*(grid[0][j+1]-teka.ord('0'))+(grid[1][j+1]-teka.ord('0')));
        }
    }
};

/** Read solution from ascii art. */
teka.viewer.pills.PillsViewer.prototype.asciiToSolution = function(ascii)
{
    if (ascii===false) {
        return;
    }

    var grid = this.asciiToArray(ascii);

    this.solution = teka.new_array([this.X,this.Y],0);
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            if (grid[i][j]==teka.ord('W')) {
                this.solution[i][j] = teka.viewer.pills.Defaults.HORIZ;
            }
            if (grid[i][j]==teka.ord('S')) {
                this.solution[i][j] = teka.viewer.pills.Defaults.VERT;
            }
        }
    }
};

/** Add solution. */
teka.viewer.pills.PillsViewer.prototype.addSolution = function()
{
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            this.f[i][j] = this.solution[i][j];
        }
    }
};

//////////////////////////////////////////////////////////////////

/** Returns a small example. */
teka.viewer.pills.PillsViewer.prototype.getExample = function()
{
    return '/format 1\n/type (pills)\n/sol false\n/X 5\n/Y 5\n/max 4'
        +'\n/puzzle [ (   2 1 2 2 3) ( 2 1 2 2 1 2) ( 1 1 0 2 0 1) ( 1 0 0 1 0 0)'
        +' ( 2 0 2 3 2 2) ( 4 2 1 1 1 2) ]'
        +'\n/solution [ (     ) (    S) ( W S ) (     ) ( W   ) ]';
};

/** Returns a list of automatically generated properties. */
teka.viewer.pills.PillsViewer.prototype.getProperties = function()
{
    return [teka.translate('generic_size',[this.X+'x'+this.Y])];
};

//////////////////////////////////////////////////////////////////

/** Reset the whole diagram. */
teka.viewer.pills.PillsViewer.prototype.reset = function()
{
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            this.f[i][j]=0;
        }
    }
    for (var i=0;i<this.MAX;i++) {
        this.f_pills[i]=false;
    }
    this.checkOverlap();
};

/** Reset the error marks. */
teka.viewer.pills.PillsViewer.prototype.clearError = function()
{
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            this.error[i][j] = false;
        }
    }
    for (var i=0;i<this.X;i++) {
        this.error_top[i] = false;
    }
    for (var j=0;j<this.Y;j++) {
        this.error_left[j] = false;
    }
};

/** Copy digits colored with this.color to color. */
teka.viewer.pills.PillsViewer.prototype.copyColor = function(color)
{
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            if (this.c[i][j]==this.color) {
                this.c[i][j] = color;
            }
        }
    }
    for (var i=0;i<this.MAX;i++) {
        if (this.c_pills[i]==this.color) {
            this.c_pills[i]=color;
        }
    }
    this.checkOverlap();
};

/** Delete all digits with color. */
teka.viewer.pills.PillsViewer.prototype.clearColor = function(color)
{
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            if (this.c[i][j]==color) {
                this.f[i][j] = 0;
            }
        }
    }
    for (var i=0;i<this.MAX;i++) {
        if (this.c_pills[i]==color) {
            this.f_pills[i]=false;
        }
    }
    this.checkOverlap();
};

/** Save current state. */
teka.viewer.pills.PillsViewer.prototype.saveState = function()
{
    var f = teka.new_array([this.X,this.X],0);
    var c = teka.new_array([this.X,this.X],0);
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.X;j++) {
            f[i][j] = this.f[i][j];
            c[i][j] = this.c[i][j];
        }
    }
    var f_pills = teka.new_array([this.MAX],0);
    var c_pills = teka.new_array([this.MAX],0);
    for (var i=0;i<this.MAX;i++) {
        f_pills[i] = this.f_pills[i];
        c_pills[i] = this.c_pills[i];
    }

    return { f:f, c:c, f_pills:f_pills, c_pills:c_pills };
};

/** Load state. */
teka.viewer.pills.PillsViewer.prototype.loadState = function(state)
{
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.X;j++) {
            this.f[i][j] = state.f[i][j];
            this.c[i][j] = state.c[i][j];
        }
    }

    for (var i=0;i<this.MAX;i++) {
        this.f_pills[i] = state.f_pills[i];
        this.c_pills[i] = state.c_pills[i];
    }
    this.checkOverlap();
};

//////////////////////////////////////////////////////////////////

/** Check, if the solution is correct. */
teka.viewer.pills.PillsViewer.prototype.check = function()
{
    var X = this.X;
    var Y = this.Y;

    var used = teka.new_array([X,Y],false);
    for (var i=0;i<X;i++) {
        for (var j=0;j<Y;j++) {
            if (this.f[i][j]==teka.viewer.pills.Defaults.HORIZ) {
                if (i===0 || i==X-1) {
                    this.error[i][j] = true;
                    return 'pills_cut_pill';
                }
                for (var k=-1;k<=1;k++) {
                    if (used[i+k][j]) {
                        this.error[i][j] = true;
                        return 'pills_overlap_pill';
                    }
                }
                for (var k=-1;k<=1;k++) {
                    used[i+k][j] = true;
                }
            }
            if (this.f[i][j]==teka.viewer.pills.Defaults.VERT) {
                if (j===0 || j==Y-1) {
                    this.error[i][j] = true;
                    return 'pills_cut_pill';
                }
                for (var k=-1;k<=1;k++) {
                    if (used[i][j+k]) {
                        this.error[i][j] = true;
                        return 'pills_overlap_pill';
                    }
                }
                for (var k=-1;k<=1;k++) {
                    used[i][j+k] = true;
                }
            }
        }
    }

    for (var i=0;i<X;i++) {
        if (this.topdata[i]==-1) {
            continue;
        }
        var sum=0;
        for (var j=0;j<Y;j++) {
            if (used[i][j]) {
                sum+=this.puzzle[i][j];
            }
        }
        if (sum!=this.topdata[i]) {
            this.error_top[i] = true;
            return 'pills_top';
        }
    }

    for (var j=0;j<Y;j++) {
        if (this.leftdata[j]==-1) {
            continue;
        }
        var sum=0;
        for (var i=0;i<X;i++) {
            if (used[i][j]) {
                sum+=this.puzzle[i][j];
            }
        }
        if (sum!=this.leftdata[j]) {
            this.error_left[j] = true;
            return 'pills_left';
        }
    }

    var da = teka.new_array([this.MAX],-1);
    for (var i=0;i<X;i++) {
        for (var j=0;j<Y;j++) {
            if (this.f[i][j]==teka.viewer.pills.Defaults.HORIZ) {
                var val = this.puzzle[i-1][j]+this.puzzle[i][j]+this.puzzle[i+1][j];
                if (val<1 || val>this.MAX) {
                    this.error[i][j] = true;
                    return 'pills_wrong_pill';
                }
                val--;
                if (da[val]!=-1) {
                    this.error[i][j] = true;
                    this.error[da[val]%X][Math.floor(da[val]/X)] = true;
                    return 'pills_same_sum';
                }
                da[val] = i+X*j;
            }
            if (this.f[i][j]==teka.viewer.pills.Defaults.VERT) {
                var val = this.puzzle[i][j-1]+this.puzzle[i][j]+this.puzzle[i][j+1];
                if (val<1 || val>this.MAX) {
                    this.error[i][j] = true;
                    return 'pills_wrong_pill';
                }
                val--;
                if (da[val]!=-1) {
                    this.error[i][j] = true;
                    this.error[da[val]%X][Math.floor(da[val]/X)] = true;
                    return 'pills_same_sum';
                }
                da[val] = i+X*j;
            }
        }
    }

    for (var i=0;i<this.MAX;i++) {
        if (da[i]==-1) {
            return {text:'pills_pill_missing',param:[i+1]};
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
teka.viewer.pills.PillsViewer.prototype.setMetrics = function(g)
{
    var pillen = (this.MAX-1)/this.X+1; // number of rows of pills

    this.scale = Math.floor(Math.min((this.width-2)/(this.X+1),
                                     3*(this.height-2-(this.textHeight+6))/
                                       (3*(this.Y+1)+pillen)));
    var realwidth = (this.X+1)*this.scale+2;
    var realheight = (this.Y+1)*this.scale+2+this.textHeight+6+pillen*(this.scale/3);

    this.bottomText = teka.translate('pills_pills',[this.MAX]);
    g.font = 'bold '+this.textHeight+'px sans-serif';
    var textwidth = g.measureText(this.bottomText).width+1;
    realwidth = Math.max(realwidth,textwidth+this.scale);

    this.deltaX = Math.floor((this.width-realwidth)/2)+0.5;
    this.deltaY = Math.floor((this.height-realheight)/2)+0.5;
    this.borderX = this.scale;
    this.borderY = this.scale;

    this.font = teka.getFontData(Math.round(this.scale/2)+'px sans-serif',this.scale);
    this.smallfont = teka.getFontData(Math.round((this.scale-6)/4)+'px sans-serif',this.scale);

    if (realwidth>this.width || realheight>this.height || (this.scale-6)/4<6) {
        this.scale=false;
    }
    return {width:realwidth,height:realheight,scale:this.scale};
};

/** Paints the diagram. */
teka.viewer.pills.PillsViewer.prototype.paint = function(g)
{
    var X = this.X;
    var Y = this.Y;
    var S = this.scale;

    g.save();
    g.translate(this.deltaX,this.deltaY);

    g.fillStyle = '#fff';
    g.fillRect(S,S,X*S,Y*S);

    // paint the background of the cells
    for (var i=0;i<X;i++) {
        for (var j=0;j<X;j++) {
            g.fillStyle = this.isBlinking()?
                this.getBlinkColor(i,j,X,this.f[i][j]):
                (this.error[i][j]?'#f00':'#fff');
            g.fillRect((i+1)*S,(j+1)*S,S,S);
        }
    }

    // paint the grid
    g.strokeStyle = '#000';
    g.lineWidth = 3;
    g.strokeRect(S,S,X*S,Y*S);
    g.lineWidth = 1;

    for (var i=1;i<=X+1;i++) {
        teka.drawLine(g,i*S,S,i*S,(Y+1)*S);
    }
    for (var j=1;j<=Y+1;j++) {
        teka.drawLine(g,S,j*S,(X+1)*S,j*S);
    }

    // paint the background of the pills
    g.save();
    g.beginPath();
    g.moveTo(S,S);
    g.lineTo((X+1)*S,S);
    g.lineTo((X+1)*S,(Y+1)*S);
    g.lineTo(S,(Y+1)*S);
    g.closePath();
    g.clip();
    for (var i=0;i<X;i++) {
        for (var j=0;j<Y;j++) {
            g.fillStyle = this.isBlinking()?
                this.getBlinkColor(i,j,X,this.f[i][j]):
                (this.error[i][j]?'#f00':'#fff');
            if (this.f[i][j]==teka.viewer.pills.Defaults.HORIZ) {
                g.beginPath();
                g.arc(i*S+S/2,(j+1)*S+S/2,S/2-2,Math.PI/2,3*Math.PI/2);
                g.arc((i+2)*S+S/2,(j+1)*S+S/2,S/2-2,3*Math.PI/2,Math.PI/2);
                g.closePath();
                g.fill();
            }
            if (this.f[i][j]==teka.viewer.pills.Defaults.VERT) {
                g.beginPath();
                g.arc((i+1)*S+S/2,j*S+S/2,S/2-2,Math.PI,0);
                g.arc((i+1)*S+S/2,(j+2)*S+S/2,S/2-2,0,Math.PI);
                g.closePath();
                g.fill();
            }
        }
    }
    g.restore();

    // paint the numbers in the grid
    g.fillStyle = '#000';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.font = this.font.font;
    for (var i=0;i<X;i++) {
        for (var j=0;j<Y;j++) {
            g.fillText(this.puzzle[i][j],(i+1)*S+S/2,(j+1)*S+S/2+this.font.delta);
        }
    }

    // paint the numbers at the top
    for (var i=0;i<X;i++) {
        if (this.topdata[i]==-1) {
            continue;
        }
        if (this.error_top[i]) {
            g.fillStyle = '#f00';
            teka.fillOval(g,(i+1)*S+S/2,S/2,S/4);
            g.strokeStyle = '#000';
            teka.strokeOval(g,(i+1)*S+S/2,S/2,S/4);
        }
        g.fillStyle = '#000';
        g.fillText(this.topdata[i],(i+1)*S+S/2,S/2+this.font.delta);
    }

    // paint the numbers at the left
    for (var j=0;j<Y;j++) {
        if (this.leftdata[j]==-1) {
            continue;
        }
        if (this.error_left[j]) {
            g.fillStyle = '#f00';
            teka.fillOval(g,S/4,(j+1)*S+S/4,S/2);
            g.strokeStyle = '#000';
            teka.strokeOval(g,S/4,(j+1)*S+S/4,S/2);
        }
        g.fillStyle = '#000';
        g.fillText(this.leftdata[j],S/2,(j+1)*S+S/2+this.font.delta);
    }

    // paint the content of the cells
    g.save();
    g.beginPath();
    g.moveTo(S,S);
    g.lineTo((X+1)*S,S);
    g.lineTo((X+1)*S,(Y+1)*S);
    g.lineTo(S,(Y+1)*S);
    g.closePath();
    g.clip();
    for (var i=0;i<X;i++) {
        for (var j=0;j<Y;j++) {
            switch (this.f[i][j]) {
              case teka.viewer.pills.Defaults.EMPTY:
                break;
              case teka.viewer.pills.Defaults.HORIZ:
                g.strokeStyle = this.getColorString(this.c[i][j]);
                g.lineWidth = 3;
                g.beginPath();
                g.arc(i*S+S/2,(j+1)*S+S/2,S/2-2,Math.PI/2,3*Math.PI/2);
                g.arc((i+2)*S+S/2,(j+1)*S+S/2,S/2-2,3*Math.PI/2,Math.PI/2);
                g.closePath();
                g.stroke();
                g.lineWidth = 1;
                break;
              case teka.viewer.pills.Defaults.VERT:
                g.strokeStyle = this.getColorString(this.c[i][j]);
                g.lineWidth = 3;
                g.beginPath();
                g.arc((i+1)*S+S/2,j*S+S/2,S/2-2,Math.PI,0);
                g.arc((i+1)*S+S/2,(j+2)*S+S/2,S/2-2,0,Math.PI);
                g.closePath();
                g.stroke();
                g.lineWidth = 1;
                break;
              case teka.viewer.pills.Defaults.NONE:
                if (this.used[i][j]) {
                    continue;
                }
                g.fillStyle = this.getColorString(this.c[i][j]);
                g.fillRect((i+1)*S,(j+1)*S,S,S);
                break;
              case teka.viewer.pills.Defaults.CIRC:
                if (this.used[i][j]) {
                    continue;
                }
                g.strokeStyle = this.getColorString(this.c[i][j]);
                g.lineWidth = 3;
                teka.strokeOval(g,(i+1)*S+S/2,(j+1)*S+S/2,S/2-2);
                g.lineWidth = 1;
                break;
            }
        }
    }
    g.restore();

    // paint text below the grid
    g.textAlign = 'left';
    g.textBaseline = 'top';
    g.fillStyle = this.textcolor;
    g.font = 'bold '+this.textHeight+'px sans-serif';
    g.fillText(this.bottomText,S,(Y+1)*S+4);

    // paint the pills below the grid
    for (var i=0;i<this.MAX;i++) {
        var px = i%X+1;
        var py = Math.floor(i/X);
        g.save();
          g.translate(px*S+S/2,py*(S/3)+(Y+1)*S+S/6+this.textHeight+6);
          g.save();
            g.scale(3,1);
            g.fillStyle = '#fff';
            teka.fillOval(g,0,0,S/6-1);
            g.strokeStyle = '#000';
            teka.strokeOval(g,0,0,S/6-1);
          g.restore();
          g.fillStyle = '#000';
          g.textAlign = 'center';
          g.textBaseline = 'middle';
          g.font = this.smallfont.font;
          g.fillText(i+1,0,this.smallfont.delta);
          if (this.f_pills[i]) {
              g.strokeStyle = this.getColorString(this.c_pills[i]);
              teka.drawLine(g,-S/2+2,-S/6+1,S/2-2,S/6-1);
              teka.drawLine(g,-S/2+2,S/6-1,S/2-2,-S/6+1);
          }
        g.restore();
    }

    // paint cursor
    if (this.mode==teka.viewer.Defaults.NORMAL) {
        g.strokeStyle='#f00';
        if (this.pills) {
            g.save();
            g.translate((this.x+1)*S+S/2,this.y*(S/3)+(Y+1)*S+S/6+this.textHeight+6);
            g.scale(3,1);
            teka.strokeOval(g,0,0,S/6-2);
            g.restore();
        }
        else {
            g.lineWidth = 2;
            g.strokeRect(S*(this.x+1)+3.5,S*(this.y+1)+3.5,S-7,S-7);
        }
    }

    g.restore();
};

//////////////////////////////////////////////////////////////////

/** Handles mousemove event. */
teka.viewer.pills.PillsViewer.prototype.processMousemoveEvent = function(xc, yc, pressed)
{
    xc -= this.deltaX+this.borderX;
    yc -= this.deltaY+this.borderY;

    var oldx = this.x;
    var oldy = this.y;
    var oldpills = this.pills;

    if (yc>this.Y*this.scale+this.textHeight+6) {
        yc -= this.Y*this.scale+this.textHeight+6;

        this.x = Math.floor(xc/this.scale);
        this.y = Math.floor(yc/(this.scale/3));

        if (this.x<0) {
            this.x=0;
        }
        if (this.x>this.X-1) {
            this.x=this.X-1;
        }
        while (this.x+this.X*this.y>=this.MAX) {
            this.y--;
        }
        if (this.y<0) {
            this.y = 0;
            this.x = this.MAX-1;
        }
        this.pills = true;
    }
    else {
        this.x = Math.floor(xc/this.scale);
        this.y = Math.floor(yc/this.scale);

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
        this.pills = false;
    }

    return this.x!=oldx || this.y!=oldy || this.pills!=oldpills;
};

/** Handles mousedown event. */
teka.viewer.pills.PillsViewer.prototype.processMousedownEvent = function(xc, yc)
{
    this.processMousemoveEvent(xc,yc);

    if (this.pills) {
        this.setPill(this.x,this.y,!this.f_pills[this.x+this.X*this.y]);
        return true;
    }

    this.set(this.x,this.y,(this.f[this.x][this.y]+1)%5);

    return true;
};

/** Handles keydown event. */
teka.viewer.pills.PillsViewer.prototype.processKeydownEvent = function(e)
{
    if (this.pills) {

        if (e.key==teka.KEY_DOWN) {
            if (this.y<this.Y-1 && this.x+(this.y+1)*this.X<this.MAX) {
                this.y++;
            }
            return true;
        }
        if (e.key==teka.KEY_UP) {
            if (this.y===0) {
                this.y = this.Y-1;
                this.pills = false;
                return true;
            }
            if (this.y>0) {
                this.y--;
            }
            return true;
        }
        if (e.key==teka.KEY_RIGHT) {
            if (this.x<this.Y-1 && this.x+this.y*this.X<this.MAX-1) {
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
            this.setPill(this.x,this.y,false);
            return true;
        }

        if (e.key==teka.KEY_HASH || e.key==teka.KEY_STAR || e.key==teka.KEY_Q) {
            this.setPill(this.x,this.y,true);
            return true;
        }

        return false;
    }

    if (e.key==teka.KEY_DOWN) {
        if (this.y==this.Y-1) {
            this.y=0;
            this.pills = true;
            if (this.x>=this.MAX) {
                this.x = this.MAX-1;
            }
            return true;
        }
        if (this.y<this.Y-1) {
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
        if (this.x<this.Y-1) {
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

    if (this.x<0 || this.x>=this.X || this.y<0 || this.y>=this.Y) {
        return false;
    }

    if (e.key==teka.KEY_SPACE) {
        this.set(this.x,this.y,teka.viewer.pills.Defaults.EMPTY);
        return true;
    }

    if (e.key==teka.KEY_S) {
        this.set(this.x,this.y,teka.viewer.pills.Defaults.VERT);
        return true;
    }

    if (e.key==teka.KEY_W) {
        this.set(this.x,this.y,teka.viewer.pills.Defaults.HORIZ);
        return true;
    }

    if (e.key==teka.KEY_MINUS || e.key==teka.KEY_SLASH || e.key==teka.KEY_A) {
        this.set(this.x,this.y,teka.viewer.pills.Defaults.NONE);
        return true;
    }

    if (e.key==teka.KEY_HASH || e.key==teka.KEY_STAR || e.key==teka.KEY_Q) {
        this.set(this.x,this.y,teka.viewer.pills.Defaults.CIRC);
        return true;
    }

    return false;
};

//////////////////////////////////////////////////////////////////

/** Sets the value of a cell, if the color fits. */
teka.viewer.pills.PillsViewer.prototype.set = function(x, y, value)
{
    if (this.f[x][y]!=teka.viewer.pills.Defaults.EMPTY && this.c[x][y]!=this.color) {
        return;
    }
    this.f[x][y] = value;
    this.c[x][y] = this.color;
    this.checkOverlap();
};

/** Sets the value of a pill, if the color fits. */
teka.viewer.pills.PillsViewer.prototype.setPill = function(x, y, value)
{
    var nr = x+this.X*y;
    if (this.f_pills[nr] && this.c_pills[nr]!=this.color) {
        return;
    }
    this.f_pills[nr] = value;
    this.c_pills[nr] = this.color;
};

/** Check, if pills are overlapping other symbols and mark them as unused. */
teka.viewer.pills.PillsViewer.prototype.checkOverlap = function()
{
    this.used = teka.new_array([this.X,this.Y],false);

    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            if (this.f[i][j]==teka.viewer.pills.Defaults.HORIZ) {
                this.used[i][j] = true;
                if (i>0) {
                    this.used[i-1][j] = true;
                }
                if (i<this.X-1) {
                    this.used[i+1][j] = true;
                }
            }
            if (this.f[i][j]==teka.viewer.pills.Defaults.VERT) {
                this.used[i][j] = true;
                if (j>0) {
                    this.used[i][j-1] = true;
                }
                if (j<this.Y-1) {
                    this.used[i][j+1] = true;
                }
            }
        }
    }
};
