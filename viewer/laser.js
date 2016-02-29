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
teka.viewer.laser = {};

/** Some constants. */
teka.viewer.laser.Defaults = {
    EMPTY: 0,
    MIRROR: 1,
    NO_MIRROR: 2,
    CELL: 1,
    NODE: 2
};

/** Constructor */
teka.viewer.laser.LaserViewer = function(data)
{
    teka.viewer.PuzzleViewer.call(this,data);

    this.x = 1;
    this.y = 1;
    this.cursor_mode = teka.viewer.laser.Defaults.CELL;
};
teka.extend(teka.viewer.laser.LaserViewer,teka.viewer.PuzzleViewer);

//////////////////////////////////////////////////////////////////

/** Initialize this viewer width the PSData object provided. */
teka.viewer.laser.LaserViewer.prototype.initData = function(data)
{
    this.X = parseInt(data.get('X'),10);
    this.Y = parseInt(data.get('Y'),10);
    var digits = data.get('digits');
    digits = digits===false?1:parseInt(data.get('digits'),10);
    this.asciiToData(data.get('puzzle'),digits);
    this.asciiToSolution(data.get('solution'));

    this.f = teka.new_array([this.X,this.Y],0);
    this.c = teka.new_array([this.X,this.Y],0);
    this.mirror_f = teka.new_array([this.X+1,this.Y+1],0);
    this.mirror_c = teka.new_array([this.X+1,this.Y+1],0);
    this.error = teka.new_array([this.X,this.Y],false);
    this.mirror_error = teka.new_array([this.X+1,this.Y+1],false);
    this.top_error = teka.new_array([this.X],false);
    this.left_error = teka.new_array([this.Y],false);
    this.bottom_error = teka.new_array([this.X+1],false);
    this.right_error = teka.new_array([this.Y+1],false);
};

/** Read puzzle from ascii art. */
teka.viewer.laser.LaserViewer.prototype.asciiToData = function(ascii,d)
{
    if (ascii===false) {
        return;
    }

    var grid = this.asciiToArray(ascii);

    this.topdata = teka.new_array([this.X],-1);
    for (var i=0;i<this.X;i++) {
        this.topdata[i] = this.getVNr(grid,2*i+1+d,0,d);
    }

    this.leftdata = teka.new_array([this.Y],0);
    for (var j=0;j<this.Y;j++) {
        this.leftdata[j] = this.getNr(grid,0,2*j+1+d,d);
    }

    this.bottom = teka.new_array([this.X+1],0);
    for (var i=0;i<=this.X;i++) {
        this.bottom[i] = this.getVNr(grid,2*i+d,2*this.Y+1+d,d);
    }

    this.right = teka.new_array([this.Y+1],0);
    for (var j=0;j<=this.Y;j++) {
        this.right[j] = this.getNr(grid,2*this.X+1+d,2*j+d,d);
    }

    this.crossing = teka.new_array([this.X+1,this.Y+1],false);
    this.v_mirror = teka.new_array([this.X+1,this.Y+1],false);
    this.h_mirror = teka.new_array([this.X+1,this.Y+1],false);
    for (var i=0;i<=this.X;i++) {
        for (var j=0;j<=this.Y;j++) {
            this.crossing[i][j] = grid[2*i+d][2*j+d]==teka.ord('X');
            this.v_mirror[i][j] = grid[2*i+d][2*j+d]==teka.ord('|');
            this.h_mirror[i][j] = grid[2*i+d][2*j+d]==teka.ord('-');
            switch (grid[2*i+d][2*j+d]) {
              case teka.ord('n'):
                this.arrowstartx = i;
                this.arrowstarty = j;
                this.arrowstartdir = (i===0 || j===0)?1:5;
                break;
              case teka.ord('7'):
                this.arrowstartx = i;
                this.arrowstarty = j;
                this.arrowstartdir = (i==this.X || j===0)?3:7;
                break;
              case teka.ord('N'):
                this.zielx = i;
                this.ziely = j;
                this.zieldir = (i===0 || j===0)?5:1;
                break;
              case teka.ord('/'):
                this.zielx = i;
                this.ziely = j;
                this.zieldir = (i==this.X || j===0)?7:3;
                break;
            }
        }
    }
    this.parity = (this.arrowstartx+this.arrowstarty)%2;

    this.puzzle = teka.new_array([this.X,this.Y],0);
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            if (grid[2*i+d+1][2*j+d+1]==teka.ord('N') ||
                grid[2*i+d+1][2*j+d+1]==teka.ord('/')) {
                this.puzzle[i][j] = 1;
            }
            if (grid[2*i+d+1][2*j+d+1]==teka.ord('#')) {
                this.puzzle[i][j] = 2;
            }
        }
    }
};

/** Read puzzle from ascii art. */
teka.viewer.laser.LaserViewer.prototype.asciiToSolution = function(ascii)
{
    if (ascii===false) {
        return;
    }

    var grid = this.asciiToArray(ascii);

    this.solution = teka.new_array([this.X,this.Y],false);
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            if (grid[i][j]==teka.ord('N') ||
                grid[i][j]==teka.ord('/')) {
                this.solution[i][j] = true;
            }
        }
    }
};

/** Add solution. */
teka.viewer.laser.LaserViewer.prototype.addSolution = function()
{
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            this.f[i][j] = this.solution[i][j]?1:0;
        }
    }

    for (var i=0;i<=this.X;i++) {
        for (var j=0;j<=this.Y;j++) {
            if ((i+j+this.parity)%2==0) {
                var tl = i>0 && j>0 && this.f[i-1][j-1]==1;
                var tr = i>0 && j<this.Y && this.f[i-1][j]==1;
                var bl = i<this.X && j>0 && this.f[i][j-1]==1;
                var br = i<this.X && j<this.Y && this.f[i][j]==1;
                if (!(tl && tr && bl && br)) {
                    if ((tl && tr) || (bl && br) || (tl && bl) || (tr && br)) {
                        this.mirror_f[i][j] = teka.viewer.laser.Defaults.MIRROR;
                    }
                }
            }
        }
    }
};

//////////////////////////////////////////////////////////////////

/** Returns a small example. */
teka.viewer.laser.LaserViewer.prototype.getExample = function()
{
    return '/format 1\n/type (laser)\n/sol false\n/X 5\n/Y 5\n'
        +'/puzzle [ (          2  ) ( n-+-+-+-+-+ ) ( |         | ) '
        +'( + X + + + + ) ( |         | ) ( + + + + + + ) ( |         | ) '
        +'( + + + + + +3) ( |         | ) ( + + + + + + ) (1|         | ) '
        +'( +-+-+-N-+-+ ) (       1     ) ]\n/solution [ (N/N  ) (/N N ) '
        +'(N/  N) (  /N/) (  N  ) ]';
};

/** Returns a list of automatically generated properties. */
teka.viewer.laser.LaserViewer.prototype.getProperties = function()
{
    return [teka.translate('generic_size',[this.X+'x'+this.Y])];
};

//////////////////////////////////////////////////////////////////

/** Reset the whole diagram. */
teka.viewer.laser.LaserViewer.prototype.reset = function()
{
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            this.f[i][j] = 0;
        }
    }
    for (var i=0;i<=this.X;i++) {
        for (var j=0;j<=this.Y;j++) {
            this.mirror_f[i][j] = 0;
        }
    }
};

/** Reset the error marks. */
teka.viewer.laser.LaserViewer.prototype.clearError = function()
{
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            this.error[i][j] = false;
        }
    }

    for (var i=0;i<=this.X;i++) {
        for (var j=0;j<=this.Y;j++) {
            this.mirror_error[i][j] = false;
        }
    }

    for (var i=0;i<this.X;i++) {
        this.top_error[i] = false;
    }

    for (var j=0;j<this.Y;j++) {
        this.left_error[j] = false;
    }

    for (var i=0;i<=this.X;i++) {
        this.bottom_error[i] = false;
    }

    for (var j=0;j<=this.Y;j++) {
        this.right_error[j] = false;
    }

    this.start_error = false;
    this.ziel_error = false;
};

/** Copy digits colored with this.color to color. */
teka.viewer.laser.LaserViewer.prototype.copyColor = function(color)
{
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            if (this.c[i][j]==this.color) {
                this.c[i][j] = color;
            }
        }
    }

    for (var i=0;i<=this.X;i++) {
        for (var j=0;j<=this.Y;j++) {
            if (this.mirror_c[i][j]==this.color) {
                this.mirror_c[i][j] = color;
            }
        }
    }
};

/** Delete all digits with color. */
teka.viewer.laser.LaserViewer.prototype.clearColor = function(color)
{
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            if (this.c[i][j]==color) {
                this.f[i][j] = 0;
            }
        }
    }
    for (var i=0;i<=this.X;i++) {
        for (var j=0;j<=this.Y;j++) {
            if (this.mirror_c[i][j]==color) {
                this.mirror_f[i][j] = 0;
            }
        }
    }
};

/** Save current state. */
teka.viewer.laser.LaserViewer.prototype.saveState = function()
{
    var f = teka.new_array([this.X,this.Y],0);
    var c = teka.new_array([this.X,this.Y],0);
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            f[i][j] = this.f[i][j];
            c[i][j] = this.c[i][j];
        }
    }

    var mirror_f = teka.new_array([this.X+1,this.Y+1],0);
    var mirror_c = teka.new_array([this.X+1,this.Y+1],0);
    for (var i=0;i<=this.X;i++) {
        for (var j=0;j<=this.Y;j++) {
            mirror_f[i][j] = this.mirror_f[i][j];
            mirror_c[i][j] = this.mirror_c[i][j];
        }
    }

    return { f:f, c:c, mirror_f:mirror_f, mirror_c:mirror_c };
};

/** Load state. */
teka.viewer.laser.LaserViewer.prototype.loadState = function(state)
{
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.Y;j++) {
            this.f[i][j] = state.f[i][j];
            this.c[i][j] = state.c[i][j];
        }
    }

    for (var i=0;i<=this.X;i++) {
        for (var j=0;j<=this.Y;j++) {
            this.mirror_f[i][j] = state.mirror_f[i][j];
            this.mirror_c[i][j] = state.mirror_c[i][j];
        }
    }
};

//////////////////////////////////////////////////////////////////

/** Check, if the solution is correct. */
teka.viewer.laser.LaserViewer.prototype.check = function()
{
    var X = this.X;
    var Y = this.Y;

    // copy given pieces of the laser beam to the input array
    for (var i=0;i<X;i++) {
        for (var j=0;j<Y;j++) {
            if (this.puzzle[i][j]==1)
                this.f[i][j] = 1;
            if (this.puzzle[i][j]==2)
                this.f[i][j] = 2;
        }
    }

    // check number of rays at each point
    for (var i=0;i<=X;i++) {
        for (var j=0;j<=Y;j++) {
            var h = this.countRays(i,j);
            if (this.crossing[i][j]) {
                if (h!=4) {
                    this.mirror_error[i][j] = true;
                    return 'laser_no_crossing';
                }
                continue;
            }

            if ((i==this.arrowstartx && j==this.arrowstarty) ||
                (i==this.zielx && j==this.ziely)) {
                if (h!=1) {
                    this.mirror_error[i][j] = true;
                    return 'laser_start_end_count';
                }

                var sum = 0;
                if (i>0 && j>0 && this.f[i-1][j-1]==1) {
                    sum++;
                }
                if (i<X && j<Y && this.f[i][j]==1) {
                    sum++;
                }

                if (i==this.arrowstartx && j==this.arrowstarty) {
                    if (Math.floor((this.arrowstartdir-1)/2)%2==sum) {
                        this.mirror_error[i][j] = true;
                        return 'laser_wrong_start_angle';
                    }
                    continue;
                }

                if (i==this.zielx && j==this.ziely) {
                    if (Math.floor((this.zieldir-1)/2)%2==sum) {
                        this.mirror_error[i][j] = true;
                        return 'laser_wrong_finish_angle';
                    }
                    continue;
                }

                continue;
            }

            var tl = i>0 && j>0 && this.f[i-1][j-1]==1;
            var tr = i>0 && j<this.Y && this.f[i-1][j]==1;
            var bl = i<this.X && j>0 && this.f[i][j-1]==1;
            var br = i<this.X && j<this.Y && this.f[i][j]==1;

            if (this.h_mirror[i][j]) {
                if (h!=2) {
                    this.mirror_error[i][j] = true;
                    return 'laser_wrong_count';
                }
                if (tl!=bl || tr!=br) {
                    this.mirror_error[i][j] = true;
                    return 'laser_mirror_not_reflecting';
                }
            }

            if (this.v_mirror[i][j]) {
                if (h!=2) {
                    this.mirror_error[i][j] = true;
                    return 'laser_wrong_count';
                }
                if (tl!=tr || bl!=br) {
                    this.mirror_error[i][j] = true;
                    return 'laser_mirror_not_reflecting';
                }
            }

            if (h!=0 && h!=2) {
                this.mirror_error[i][j] = true;
                return 'laser_wrong_count';
            }
        }
    }

    // check numbers at the top
    for (var i=0;i<X;i++) {
        if (this.topdata[i]!==false) {
            var sum = 0;
            for (var j=0;j<Y;j++) {
                if (this.f[i][j]==1) {
                    sum++;
                }
            }
            if (sum!=this.topdata[i]) {
                this.top_error[i] = true;
                return 'laser_top_wrong';
            }
        }
    }

    // check numbers at the left
    for (var j=0;j<Y;j++) {
        if (this.leftdata[j]!==false) {
            var sum = 0;
            for (var i=0;i<X;i++) {
                if (this.f[i][j]==1) {
                    sum++;
                }
            }
            if (sum!=this.leftdata[j]) {
                this.left_error[j] = true;
                return 'laser_left_wrong';
            }
        }
    }

    // check numbers at the bottom
    for (var i=0;i<=X;i++) {
        if (this.bottom[i]!==false) {
            var sum = 0;
            for (var j=0;j<=Y;j++) {
                if (this.isMirror(i,j)) {
                    sum++;
                }
            }

            if (sum!=this.bottom[i]) {
                this.bottom_error[i] = true;
                return 'laser_bottom_wrong';
            }
        }
    }

    // check numbers at the right
    for (var j=0;j<=Y;j++) {
        if (this.right[j]!==false) {
            var sum = 0;
            for (var i=0;i<=X;i++) {
                if (this.isMirror(i,j)) {
                    sum++;
                }
            }

            if (sum!=this.right[j]) {
                this.right_error[j] = true;
                return 'laser_right_wrong';
            }
        }
    }

    // check, if the laserbeam is connected
    var sx = false;
    var sy = false;
    outer: for (var i=0;i<X;i++) {
        for (var j=0;j<Y;j++) {
            if (this.f[i][j]==1) {
                sx = i;
                sy = j;
                break outer;
            }
        }
    }

    var mark = teka.new_array([X,Y],false);
    this.fill(mark,sx,sy);

    var error = false;
    for (var i=0;i<X;i++) {
        for (var j=0;j<Y;j++) {
            if (!mark[i][j] && this.f[i][j]==1) {
                this.error[i][j] = true;
                error = true;
            }
        }
    }

    if (error) {
        return 'laser_not_connected';
    }

    return true;
};

/** counts the number of rays at intersection x,y */
teka.viewer.laser.LaserViewer.prototype.countRays = function(x, y)
{
    if ((x+y+this.parity)%2!=0) {
        return 0;
    }

    var sum = 0;
    if (x>0 && y>0 && this.f[x-1][y-1]==1) {
        sum++;
    }
    if (x>0 && y<this.Y && this.f[x-1][y]==1) {
        sum++;
    }
    if (x<this.X && y>0 && this.f[x][y-1]==1) {
        sum++;
    }
    if (x<this.X && y<this.Y && this.f[x][y]==1) {
        sum++;
    }
    return sum;
};

/** Checks if there is a mirror at intersection x,y. */
teka.viewer.laser.LaserViewer.prototype.isMirror = function(x, y)
{
    if (this.countRays(x,y)!=2) {
        return false;
    }
    var sum = 0;
    if (x>0 && y>0 && this.f[x-1][y-1]==1) {
        sum++;
    }
    if (x<this.X && y<this.Y && this.f[x][y]==1) {
        sum++;
    }
    return sum!=0 && sum!=2;
};

/** Recursivly fill from position x,y following the laser. */
teka.viewer.laser.LaserViewer.prototype.fill = function(mark, x, y)
{
    if (x<0 || x>=this.X || y<0 || y>=this.Y) {
        return;
    }
    if (mark[x][y]===true) {
        return;
    }
    if (this.f[x][y]!=1) {
        return;
    }
    mark[x][y] = true;

    if ((x+y+this.parity)%2===0) {
        this.fill(mark,x+1,y+1);
        this.fill(mark,x-1,y-1);
    } else {
        this.fill(mark,x+1,y-1);
        this.fill(mark,x-1,y+1);
    }
    this.fill(mark,x-1,y);
    this.fill(mark,x+1,y);
    this.fill(mark,x,y-1);
    this.fill(mark,x,y+1);
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
teka.viewer.laser.LaserViewer.prototype.setMetrics = function(g)
{
    this.scale = Math.floor(Math.min(this.width/(this.X+2),this.height/(this.Y+2)));
    var realwidth = (this.X+2)*this.scale;
    var realheight = (this.Y+2)*this.scale;

    this.deltaX = Math.floor((this.width-realwidth)/2)+0.5;
    this.deltaY = Math.floor((this.height-realheight)/2)+0.5;
    this.borderX = this.scale;
    this.borderY = this.scale;

    this.font = teka.getFontData(Math.round(this.scale/2)+'px sans-serif',this.scale);

    if (realwidth>this.width || realheight>this.height) {
        this.scale=false;
    }
    return {width:realwidth,height:realheight,scale:this.scale};
};

/** Paints the diagram. */
teka.viewer.laser.LaserViewer.prototype.paint = function(g)
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
            if (this.mode<0) {
                continue;
            }

            g.fillStyle = this.isBlinking()?
                this.getBlinkColor(i,j,X,this.f[i][j]):
                (this.error[i][j]?'#f00':'#fff');
            g.fillRect(i*S,j*S,S,S);
        }
    }

    g.strokeStyle = '#000';
    for (var i=0;i<=X;i++) {
        teka.drawLine(g,i*S,0,i*S,Y*S);
    }
    for (var j=0;j<=Y;j++) {
        teka.drawLine(g,0,j*S,X*S,j*S);
    }

    g.textAlign = 'center';
    g.textBaseline = 'middle';
    for (var i=0;i<X;i++) {
        if (this.topdata[i]!==false) {
            g.fillStyle = this.top_error[i]?'#f00':'#000';
            g.font = this.font.font;
            g.fillText(this.topdata[i],i*S+S/2,-S/2+this.font.delta);
        }
    }

    for (var j=0;j<Y;j++) {
        if (this.leftdata[j]!==false) {
            g.fillStyle = this.left_error[j]?'#f00':'#000';
            g.font = this.font.font;
            g.fillText(this.leftdata[j],-S/2,j*S+S/2+this.font.delta);
        }
    }

    for (var i=0;i<=X;i++) {
        if (this.bottom[i]!==false) {
            g.fillStyle = this.bottom_error[i]?'#f00':'#000';
            g.font = this.font.font;
            g.fillText(this.bottom[i],i*S,Y*S+S/2+this.font.delta);
        }
    }

    for (var j=0;j<=Y;j++) {
        if (this.right[j]!==false) {
            g.fillStyle = this.right_error[j]?'#f00':'#000';
            g.font = this.font.font;
            g.fillText(this.right[j],X*S+S/2,j*S+this.font.delta);
        }
    }

    g.strokeStyle = '#000';
    for (var i=0;i<X;i++) {
        for (var j=0;j<Y;j++) {
            if (this.puzzle[i][j]==1) {
                g.strokeStyle = '#000';
                g.lineWidth = 3;
                g.lineCap = 'round';
                if ((this.parity+i+j)%2===0) {
                    teka.drawLine(g,i*S,j*S,(i+1)*S,(j+1)*S);
                } else {
                    teka.drawLine(g,i*S,(j+1)*S,(i+1)*S,j*S);
                }
                g.lineCap = 'butt';
                g.lineWidth = 1;
                continue;
            }
            if (this.puzzle[i][j]==2) {
                g.fillStyle = '#000';
                g.fillRect(i*S,j*S,S,S);
                continue;
            }
            g.strokeStyle = this.error[i][j]?'#f00':this.getColorString(this.c[i][j]);
            if (this.f[i][j]==1) {
                g.lineWidth = 3;
                g.lineCap = 'round';
                if ((this.parity+i+j)%2===0) {
                    teka.drawLine(g,i*S,j*S,(i+1)*S,(j+1)*S);
                } else {
                    teka.drawLine(g,i*S,(j+1)*S,(i+1)*S,j*S);
                }
                g.lineCap = 'butt';
                g.lineWidth = 1;
            } else if (this.f[i][j]==2) {
                teka.drawLine(g,i*S+S/4,j*S+S/2,(i+1)*S-S/4,j*S+S/2);
            }
        }
    }

    for (var i=0;i<=X;i++) {
        for (var j=0;j<=Y;j++) {
            if (this.mirror_error[i][j]) {
                g.fillStyle = '#f00';
                g.fillRect(S*i-S/4-0.5,S*j-S/4-0.5,S/2+1,S/2+1);
            }
            if (this.crossing[i][j]===true) {
                g.strokeStyle = '#000';
                g.lineWidth = 2;
                teka.drawLine(g,i*S-S/4,j*S-S/4,i*S+S/4,j*S+S/4);
                teka.drawLine(g,i*S-S/4,j*S+S/4,i*S+S/4,j*S-S/4);
                g.lineWidth = 1;
                continue;
            }
            if (this.v_mirror[i][j]===true) {
                g.strokeStyle = '#000';
                g.lineWidth = 3;
                teka.drawLine(g,i*S,j*S-S/6,i*S,j*S+S/6);
                g.lineWidth = 1;
                continue;
            }
            if (this.h_mirror[i][j]===true) {
                g.strokeStyle = '#000';
                g.lineWidth = 3;
                teka.drawLine(g,i*S-S/6,j*S,i*S+S/6,j*S);
                g.lineWidth = 1;
                continue;
            }
            if (this.mirror_f[i][j]==teka.viewer.laser.Defaults.MIRROR) {
                if (((this.getf(i-1,j-1) && this.getf(i,j-1) && !this.getf(i-1,j) && !this.getf(i,j))
                     || (!this.getf(i-1,j-1) && !this.getf(i,j-1) && this.getf(i-1,j) && this.getf(i,j))) && (i+j+this.parity)%2===0) {
                    g.strokeStyle = this.getColorString(this.mirror_c[i][j]);
                    g.lineWidth = 3;
                    teka.drawLine(g,i*S-S/6,j*S,i*S+S/6,j*S);
                    g.lineWidth = 1;
                } else if (((this.getf(i-1,j-1) && this.getf(i-1,j) && !this.getf(i,j-1) && !this.getf(i,j))
                            || (!this.getf(i-1,j-1) && !this.getf(i-1,j) && this.getf(i,j-1) && this.getf(i,j))) && (i+j+this.parity)%2===0) {
                    g.strokeStyle = this.getColorString(this.mirror_c[i][j]);
                    g.lineWidth = 3;
                    teka.drawLine(g,i*S,j*S-S/6,i*S,j*S+S/6);
                    g.lineWidth = 1;
                } else {
                    g.fillStyle = this.getColorString(this.mirror_c[i][j]);
                    teka.fillOval(g,i*S,j*S,S/6);
                }
            } else if (this.mirror_f[i][j]==teka.viewer.laser.Defaults.NO_MIRROR) {
                g.strokeStyle = this.getColorString(this.mirror_c[i][j]);
                teka.strokeOval(g,i*S,j*S,S/6);
            }
        }
    }

    g.fillStyle = this.start_error?'#f00':'#000';
    g.strokeStyle = this.start_error?'#f00':'#000';
    this.drawArrow(g,this.arrowstartx*S,this.arrowstarty*S,this.arrowstartdir);

    g.fillStyle = this.ziel_error?'#f00':'#000';
    g.strokeStyle = this.ziel_error?'#f00':'#000';
    this.drawArrow(g,this.zielx*S,this.ziely*S,this.zieldir);

    if (this.mode==teka.viewer.Defaults.NORMAL) {
        g.strokeStyle='#f00';
        g.lineWidth = 2;
        if (this.cursor_mode==teka.viewer.laser.Defaults.NODE) {
            g.strokeRect(S*this.x-S/4+0.5,S*this.y-S/4+0.5,S/2,S/2);
        } else {
            g.strokeRect(S*this.x+3.5,S*this.y+3.5,S-7,S-7);
        }
    }

    g.restore();
};

//////////////////////////////////////////////////////////////////

/** Handles mousemove event. */
teka.viewer.laser.LaserViewer.prototype.processMousemoveEvent = function(xc, yc, pressed)
{
    this.coord = this.normalizeCoordinates(xc,yc);

    var oldx = this.x;
    var oldy = this.y;
    var old_cursor = this.cursor_mode;

    if (this.coord.topleft===true) {
        this.cursor_mode = teka.viewer.laser.Defaults.NODE;
        this.x = this.coord.x;
        this.y = this.coord.y;
    } else if (this.coord.topright===true) {
        this.cursor_mode = teka.viewer.laser.Defaults.NODE;
        this.x = this.coord.x+1;
        this.y = this.coord.y;
    } else if (this.coord.bottomleft===true) {
        this.cursor_mode = teka.viewer.laser.Defaults.NODE;
        this.x = this.coord.x;
        this.y = this.coord.y+1;
    } else if (this.coord.bottomright===true) {
        this.cursor_mode = teka.viewer.laser.Defaults.NODE;
        this.x = this.coord.x+1;
        this.y = this.coord.y+1;
    } else {
        this.cursor_mode = teka.viewer.laser.Defaults.CELL;
        this.x = this.coord.x;
        this.y = this.coord.y;
    }

    if (this.x<0) {
        this.x=0;
    }
    if (this.y<0) {
        this.y=0;
    }
    if (this.cursor_mode==teka.viewer.laser.Defaults.CELL && this.x>this.X-1) {
        this.x=this.X-1;
    }
    if (this.cursor_mode==teka.viewer.laser.Defaults.CELL && this.y>this.Y-1) {
        this.y=this.Y-1;
    }
    if (this.cursor_mode==teka.viewer.laser.Defaults.NODE && this.x>this.X) {
        this.x=this.X;
    }
    if (this.cursor_mode==teka.viewer.laser.Defaults.NODE && this.y>this.Y) {
        this.y=this.Y;
    }

    return this.x!=oldx || this.y!=oldy || this.cursor_mode!=old_cursor;
};

/** Handles mousedown event. */
teka.viewer.laser.LaserViewer.prototype.processMousedownEvent = function(xc, yc)
{
    var erg = this.processMousemoveEvent(xc,yc);

    if (this.cursor_mode==teka.viewer.laser.Defaults.NODE) {
        if (this.crossing[this.x][this.y]) {
            return erg;
        }
        if (this.x==this.arrowstartx && this.y==this.arrowstarty) {
            return erg;
        }
        if (this.x==this.zielx && this.y==this.ziely) {
            return erg;
        }
        this.setMirror(this.x,this.y,(this.mirror_f[this.x][this.y]+1)%3);
    } else {
        this.set(this.x,this.y,(this.f[this.x][this.y]+1)%3);
    }
    return true;
};

/** Handles keydown event. */
teka.viewer.laser.LaserViewer.prototype.processKeydownEvent = function(e)
{
    if (e.key==teka.KEY_DOWN) {
        if (this.y<this.Y-1 ||
            (this.cursor_mode==teka.viewer.laser.Defaults.NODE && this.y<this.Y)) {
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
        if (this.x<this.X-1 ||
            (this.cursor_mode==teka.viewer.laser.Defaults.NODE && this.x<this.X)) {
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

    if (e.key==teka.KEY_ESCAPE) {
        this.cursor_mode = 3-this.cursor_mode;
        if (this.x==this.X) {
            this.x=this.X-1;
        }
        if (this.y==this.Y) {
            this.y=this.Y-1;
        }
        return true;
    }

    if (this.cursor_mode==teka.viewer.laser.Defaults.NODE) {
        if (this.crossing[this.x][this.y]) {
            return false;
        }

        if (this.x==this.arrowstartx && this.y==this.arrowstarty) {
            return false;
        }

        if (this.x==this.zielx && this.y==this.ziely) {
            return false;
        }

        if (e.key==teka.KEY_SPACE) {
            this.setMirror(this.x,this.y,teka.viewer.laser.Defaults.EMPTY);
        } else if (e.key==teka.KEY_HASH || e.key==teka.KEY_STAR || e.key==teka.KEY_Q) {
            this.setMirror(this.x,this.y,teka.viewer.laser.Defaults.MIRROR);
        } else if (e.key==teka.KEY_MINUS || e.key==teka.KEY_SLASH || e.key==teka.KEY_W) {
            this.setMirror(this.x,this.y,teka.viewer.laser.Defaults.NO_MIRROR);
        }
        return true;
    }

    if (this.cursor_mode==teka.viewer.laser.Defaults.CELL) {
        if (e.key==teka.KEY_SPACE) {
            this.set(this.x,this.y,0);
        } else if (e.key==teka.KEY_HASH || e.key==teka.KEY_STAR || e.key==teka.KEY_q) {
            this.set(this.x,this.y,1);
        } else if (e.key==teka.KEY_MINUS || e.key==teka.KEY_SLASH || e.key==teka.KEY_W) {
            this.set(this.x,this.y,2);
        }
        return true;
    }

    return false;
};

//////////////////////////////////////////////////////////////////

/** Sets the value of a cell, if the color fits. */
teka.viewer.laser.LaserViewer.prototype.set = function(x, y, value)
{
    if (this.f[x][y]!=0 && this.color!=this.c[x][y]) {
        return;
    }
    this.f[x][y] = value;
    this.c[x][y] = this.color;
};

/** Sets the value of a node, if the color fits. */
teka.viewer.laser.LaserViewer.prototype.setMirror = function(x, y, value)
{
    if (this.mirror_f[x][y]!=0 && this.color!=this.mirror_c[x][y]) {
        return;
    }
    this.mirror_f[x][y] = value;
    this.mirror_c[x][y] = this.color;
};

/** Returns true if the cell x,y exists and contains a line.*/
teka.viewer.laser.LaserViewer.prototype.getf = function(x, y)
{
    if (x<0 || y<0 || x>=this.X || y>=this.Y) {
        return false;
    }
    return this.f[x][y]==1;
};
