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
teka.viewer.killer_sudoku = {};

/** Some constants. */
teka.viewer.killer_sudoku.Defaults = {
    NONE: 0,
    NO_MINI: -1
};

/** Constructor */
teka.viewer.killer_sudoku.Killer_sudokuViewer = function(data)
{
    teka.viewer.PuzzleViewer.call(this,data);

    this.x = 0;
    this.y = 0;
    this.xm = 0;
    this.ym = 0;
    this.exp = false;
};
teka.extend(teka.viewer.killer_sudoku.Killer_sudokuViewer,teka.viewer.PuzzleViewer);

//////////////////////////////////////////////////////////////////

/** Initialize this viewer width the PSData object provided. */
teka.viewer.killer_sudoku.Killer_sudokuViewer.prototype.initData = function(data)
{
    this.X = parseInt(data.get('size'),10);
    this.asciiToData(data.get('puzzle'));
    this.asciiToSmallAreas(data.get('smallareas'));
    this.asciiToSolution(data.get('solution'));

    this.f = teka.new_array([this.X,this.X],0);
    this.c = teka.new_array([this.X,this.X],0);
    this.error = teka.new_array([this.X,this.X],false);
};

/** Read puzzle from ascii art. */
teka.viewer.killer_sudoku.Killer_sudokuViewer.prototype.asciiToData = function(ascii)
{
    if (ascii===false) {
        return;
    }

    var grid = this.asciiToArray(ascii);

    this.puzzle = teka.new_array([this.X,this.X],0);
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.X;j++) {
            this.puzzle[i][j] = grid[2*i+1][2*j+1]==teka.ord(' ')
                ?teka.viewer.killer_sudoku.Defaults.NONE
                :(grid[2*i+1][2*j+1]-teka.ord('0'));
        }
    }

    this.area = teka.new_array([this.X,this.X],0);
    var nr=0;
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.X;j++) {
            if (this.area[i][j]===0) {
                this.fillArea(grid,i,j,++nr);
            }
        }
    }
};

/** Recursive filling of areas */
teka.viewer.killer_sudoku.Killer_sudokuViewer.prototype.fillArea = function(c, x, y, nr)
{
    if (x<0 || y<0 || x>=this.X || y>=this.X) {
        return;
    }
    if (this.area[x][y]!=0) {
        return;
    }
    this.area[x][y] = nr;
    if (c[2*x+2][2*y+1]==teka.ord(' ')) {
        this.fillArea(c,x+1,y,nr);
    }
    if (c[2*x][2*y+1]==teka.ord(' ')) {
        this.fillArea(c,x-1,y,nr);
    }
    if (c[2*x+1][2*y+2]==teka.ord(' ')) {
        this.fillArea(c,x,y+1,nr);
    }
    if (c[2*x+1][2*y]==teka.ord(' ')) {
        this.fillArea(c,x,y-1,nr);
    }
};

/** Read small areas from ascii art */
teka.viewer.killer_sudoku.Killer_sudokuViewer.prototype.asciiToSmallAreas = function(ascii)
{
    var grid = this.asciiToArray(ascii);

    this.mini = teka.new_array([this.X,this.X],0);
    this.smallarea = teka.new_array([this.X,this.X],0);
    var co = 0;
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.X;j++) {
            if (this.mini[i][j]===0 && grid[3*i+2][2*j+1]!=teka.ord('#')) {
                this.fillSmallArea(grid,i,j,++co);
            }
            if (grid[3*i+2][2*j+1]==teka.ord('#')) {
                this.mini[i][j] = teka.viewer.killer_sudoku.Defaults.NO_MINI;
            }
        }
    }
};

/** Recursive filling of small areas */
teka.viewer.killer_sudoku.Killer_sudokuViewer.prototype.fillSmallArea = function(c, x, y, value)
{
    if (x<0 || x>=this.X || y<0 || y>=this.X) {
        return;
    }
    if (this.smallarea[x][y]!=0) {
        return;
    }
    this.smallarea[x][y] = value;

    if (c[3*x+2][2*y+1]>=teka.ord('0') && c[3*x+2][2*y+1]<=teka.ord('9'))
        {
            var nr = c[3*x+2][2*y+1]-teka.ord('0');
            if (c[3*x+1][2*y+1]!=teka.ord(' ')) {
                nr+=10*(c[3*x+1][2*y+1]-teka.ord('0'));
            }
            this.mini[x][y] = nr;
        }

    if (c[3*x][2*y+1]==teka.ord(' ')) {
        this.fillSmallArea(c,x-1,y,value);
    }
    if (c[3*x+3][2*y+1]==teka.ord(' ')) {
        this.fillSmallArea(c,x+1,y,value);
    }
    if (c[3*x+2][2*y]==teka.ord(' ')) {
        this.fillSmallArea(c,x,y-1,value);
    }
    if (c[3*x+2][2*y+2]==teka.ord(' ')) {
        this.fillSmallArea(c,x,y+1,value);
    }
};

/** Read solution from ascii art. */
teka.viewer.killer_sudoku.Killer_sudokuViewer.prototype.asciiToSolution = function(ascii)
{
    if (ascii===false) {
        return;
    }

    var grid = this.asciiToArray(ascii);

    this.solution = teka.new_array([this.X,this.X],0);
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.X;j++) {
            this.solution[i][j] = grid[i][j]-teka.ord('0');
        }
    }
};

/** Add solution. */
teka.viewer.killer_sudoku.Killer_sudokuViewer.prototype.addSolution = function()
{
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.X;j++) {
            this.f[i][j] = this.solution[i][j];
        }
    }
};

//////////////////////////////////////////////////////////////////

/** Returns a small example. */
teka.viewer.killer_sudoku.Killer_sudokuViewer.prototype.getExample = function()
{
    return '/format 1\n/type (killer_sudoku)\n/sol false\n/size 4'
        +'\n/puzzle [ (+-+-+-+-+) (|   |   |) (+ + + + +) (|   |   |) (+-+-+-+-+)'
        +' (|   |   |) (+ + + + +) (|   |4  |) (+-+-+-+-+) ]'
        +'\n/smallareas [ (+--+--+--+--+) (| 4   | 6   |) (+--+--+--+--+)'
        +' (|10| 7   | 6|) (+  +--+--+  +) (|        |  |) (+--+--+--+  +)'
        +' (| 7      |  |) (+--+--+--+--+) ]'
        +'\n/solution [ (3124) (2431) (4312) (1243) ]';
};

/** Returns a list of automatically generated properties. */
teka.viewer.killer_sudoku.Killer_sudokuViewer.prototype.getProperties = function()
{
    return [teka.translate('generic_size',[this.X+'x'+this.X])];
};

//////////////////////////////////////////////////////////////////

/** Reset the whole diagram. */
teka.viewer.killer_sudoku.Killer_sudokuViewer.prototype.reset = function()
{
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.X;j++) {
            this.f[i][j] = 0;
            this.c[i][j] = 0;
        }
    }
};

/** Reset the error marks. */
teka.viewer.killer_sudoku.Killer_sudokuViewer.prototype.clearError = function()
{
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.X;j++) {
            this.error[i][j] = false;
        }
    }
};

/** Copy digits colored with this.color to color. */
teka.viewer.killer_sudoku.Killer_sudokuViewer.prototype.copyColor = function(color)
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
teka.viewer.killer_sudoku.Killer_sudokuViewer.prototype.clearColor = function(color)
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
teka.viewer.killer_sudoku.Killer_sudokuViewer.prototype.saveState = function()
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
teka.viewer.killer_sudoku.Killer_sudokuViewer.prototype.loadState = function(state)
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
teka.viewer.killer_sudoku.Killer_sudokuViewer.prototype.check = function()
{
    var X = this.X;

    // copy givens into f
    for (var i=0;i<X;i++) {
        for (var j=0;j<X;j++) {
            if (this.puzzle[i][j]!=teka.viewer.killer_sudoku.Defaults.NONE) {
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
                if (check[i][j]==teka.viewer.killer_sudoku.Defaults.NONE && this.f[i][j]!=1000) {
                    this.error[i][j] = true;
                    return 'killer_sudoku_not_unique';
                }
            } else {
                check[i][j] = this.f[i][j];
            }

            if (check[i][j]==teka.viewer.killer_sudoku.Defaults.NONE) {
                this.error[i][j] = true;
                return 'killer_sudoku_empty';
            }
        }
    }

    // check rows
    for (var i=0;i<X;i++) {
        if (!this.checkRow(check,i)) {
            return 'killer_sudoku_row_duplicate';
        }
    }

    // check columns
    for (var i=0;i<X;i++) {
        if (!this.checkColumn(check,i)) {
            return 'killer_sudoku_column_duplicate';
        }
    }

    // check areas
    for (var i=0;i<X;i++) {
        if (!this.checkArea(check,i)) {
            return 'killer_sudoku_area_duplicate';
        }
    }

    var mark = teka.new_array([this.X,this.X],false);
    for (var i=0;i<X;i++) {
        for (var j=0;j<X;j++) {
            if (mark[i][j]===false
                && this.mini[i][j]!=teka.viewer.killer_sudoku.Defaults.NO_MINI) {
                var erg = this.checkKillerSums(check,i,j,mark);
                if (erg!=null) {
                    return erg;
                }
            }
        }
    }

    return true;
};

/** Check, if all digits in a row are distinct */
teka.viewer.killer_sudoku.Killer_sudokuViewer.prototype.checkRow = function(check, j)
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
teka.viewer.killer_sudoku.Killer_sudokuViewer.prototype.checkColumn = function(check, i)
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

/** Check, if all digits in an area are distinct */
teka.viewer.killer_sudoku.Killer_sudokuViewer.prototype.checkArea = function(check, n)
{
    var used = teka.new_array([this.X],false);

    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.X;j++) {
            if (this.area[i][j]==n) {
                if (used[check[i][j]-1]) {
                    for (var ii=0;ii<this.X;ii++) {
                        for (var jj=0;jj<this.X;jj++) {
                            if (this.area[ii][jj]==n) {
                                if (check[i][j]==check[ii][jj]) {
                                    this.error[ii][jj] = true;
                                }                            }
                        }
                    }

                    return false;
                }
                used[check[i][j]-1] = true;
            }
        }
    }

    return true;
};

/** Check, if all conditions on a small area are fulfilled */
teka.viewer.killer_sudoku.Killer_sudokuViewer.prototype.checkKillerSums = function(check, x, y, mark)
{
    var da = teka.new_array([this.X],false);
    var sum = 0;
    for (var i=0;i<this.X;i++) {
        for (var j=0;j<this.X;j++) {
            if (this.smallarea[i][j]==this.smallarea[x][y]) {
                if (da[check[i][j]-1]) {
                    for (var ii=0;ii<this.X;ii++) {
                        for (var jj=0;jj<this.X;jj++) {
                            if (this.smallarea[ii][jj]==this.smallarea[x][y]
                                && check[i][j]==check[ii][jj]) {
                                this.error[ii][jj] = true;
                            }
                        }
                    }
                    return 'killer_sudoku_sum_duplicate';
                }
                da[check[i][j]-1] = true;
                sum+=check[i][j];
                mark[i][j] = true;
            }
        }
    }
    if (this.mini[x][y]!==0 && sum!=this.mini[x][y]) {
        for (var i=0;i<this.X;i++) {
            for (var j=0;j<this.X;j++) {
                if (this.smallarea[i][j]==this.smallarea[x][y]) {
                    this.error[i][j] = true;
                }
            }
        }
        return 'killer_sudoku_wrong_sum';
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
teka.viewer.killer_sudoku.Killer_sudokuViewer.prototype.setMetrics = function(g)
{
    this.scale = Math.floor(Math.min((this.width-3)/this.X,(this.height-3-(this.textHeight+2))/this.X));
    var realwidth = this.X*this.scale+3;
    var realheight = this.X*this.scale+3+this.textHeight+2;

    this.bottomText = teka.translate('killer_sudoku_digits',[this.X]);
    g.font = 'bold '+this.textHeight+'px sans-serif';
    var textwidth = g.measureText(this.bottomText).width+1;
    realwidth = Math.max(realwidth,textwidth);

    this.deltaX = Math.floor((this.width-realwidth)/2)+0.5;
    this.deltaY = Math.floor((this.height-realheight)/2)+0.5;
    this.borderX = 1;
    this.borderY = 1;

    this.font = teka.getFontData(Math.round(this.scale/2)+'px sans-serif',this.scale);
    this.boldfont = teka.getFontData('bold '+Math.round(this.scale/2)+'px sans-serif',this.scale);
    this.smallfont = teka.getFontData(Math.round((this.scale-6)/4)+'px sans-serif',this.scale);

    if (realwidth>this.width || realheight>this.height) {
        this.scale=false;
    }
    return {width:realwidth,height:realheight,scale:this.scale};
};

/** Paints the diagram. */
teka.viewer.killer_sudoku.Killer_sudokuViewer.prototype.paint = function(g)
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
    g.lineWidth = 1;

    // paint the borders of the small areas
    g.lineWidth = 2;
    g.strokeStyle = '#888';
    for (var i=0;i<X;i++)
        for (var j=0;j<X;j++)
            if (this.mini[i][j]!=teka.viewer.killer_sudoku.Defaults.NO_MINI) {
                if (i===0 || this.smallarea[i][j]!=this.smallarea[i-1][j])
                    teka.drawLine(g,i*S+3.5,j*S+3.5,i*S+3.5,(j+1)*S-3.5);
                if (i==X-1 || this.smallarea[i][j]!=this.smallarea[i+1][j])
                    teka.drawLine(g,(i+1)*S-3.5,j*S+3.5,(i+1)*S-3.5,(j+1)*S-3.5);
                if (j===0 || this.smallarea[i][j]!=this.smallarea[i][j-1])
                    teka.drawLine(g,i*S+3.5,j*S+3.5,(i+1)*S-3.5,j*S+3.5);
                if (j==X-1 || this.smallarea[i][j]!=this.smallarea[i][j+1])
                    teka.drawLine(g,i*S+3.5,(j+1)*S-3.5,(i+1)*S-3.5,(j+1)*S-3.5);
            }

    for (var i=0;i<X-1;i++) {
        for (var j=0;j<X;j++) {
            if (this.smallarea[i][j]==this.smallarea[i+1][j]
               && this.mini[i][j]!=teka.viewer.killer_sudoku.Defaults.NO_MINI) {
                if (j===0 || this.smallarea[i][j]!=this.smallarea[i][j-1] || this.smallarea[i][j]!=this.smallarea[i+1][j-1]) {
                    teka.drawLine(g,i*S+S-3.5,j*S+3.5,i*S+S+3.5,j*S+3.5);
                }
                if (j==X-1 || this.smallarea[i][j]!=this.smallarea[i][j+1] || this.smallarea[i][j]!=this.smallarea[i+1][j+1]) {
                    teka.drawLine(g,i*S+S-3.5,j*S+S-3.5,i*S+S+3.5,j*S+S-3.5);
                }
            }
        }
    }

    for (var i=0;i<X;i++) {
        for (var j=0;j<X-1;j++) {
            if (this.smallarea[i][j]==this.smallarea[i][j+1]
               && this.mini[i][j]!=teka.viewer.killer_sudoku.Defaults.NO_MINI) {
                if (i===0 || this.smallarea[i][j]!=this.smallarea[i-1][j] || this.smallarea[i][j]!=this.smallarea[i-1][j+1]) {
                    teka.drawLine(g,i*S+3.5,j*S+S-3.5,i*S+3.5,j*S+S+3.5);
                }
                if (i==X-1 || this.smallarea[i][j]!=this.smallarea[i+1][j] || this.smallarea[i][j]!=this.smallarea[i+1][j+1]) {
                    teka.drawLine(g,i*S+S-3.5,j*S+S-3.5,i*S+S-3.5,j*S+S+3.5);
                }
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
            if (this.mini[i][j]>0) {
                g.fillStyle = this.isBlinking()?
                    this.getBlinkColor(i,j,X,this.f[i][j]):
                    (this.error[i][j]?'#f00':'#fff');
                g.font = this.smallfont.font;
                g.fillRect(i*S+2,j*S+2,g.measureText(this.mini[i][j]).width,(S-6)/4-this.smallfont.delta);
                g.fillStyle = '#000';
                g.fillText(this.mini[i][j],i*S+2,j*S+2);
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
            if (this.f[i][j]==teka.viewer.killer_sudoku.Defaults.NONE) {
                continue;
            }

            // normal numbers
            g.fillStyle = this.getColorString(this.c[i][j]);
            if (this.f[i][j]<1000) {
                g.font = this.font.font;
                g.fillText(this.f[i][j],i*S+S/2,j*S+S/2+this.font.delta);
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

//////////////////////////////////////////////////////////////////

/** Handles mousemove event. */
teka.viewer.killer_sudoku.Killer_sudokuViewer.prototype.processMousemoveEvent = function(xc, yc, pressed)
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
teka.viewer.killer_sudoku.Killer_sudokuViewer.prototype.processMousedownEvent = function(xc, yc)
{
    var erg = this.processMousemoveEvent(xc,yc,false);

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
teka.viewer.killer_sudoku.Killer_sudokuViewer.prototype.processKeydownEvent = function(e)
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

    if (e.key>=teka.KEY_0 && e.key<=teka.KEY_9) {

        var val = e.key-teka.KEY_0;

        if (val>this.X) {
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
        if (this.X<=9) {
            if (this.f[this.x][this.y]<1000) {
                this.set(this.x,this.y,this.setExpert(this.f[this.x][this.y]));
            } else {
                this.set(this.x,this.y,this.getExpert(this.f[this.x][this.y]));
            }
        }
        return true;
    }

    return false;
};

//////////////////////////////////////////////////////////////////

/** Sets the value of a cell, if the color fits. */
teka.viewer.killer_sudoku.Killer_sudokuViewer.prototype.set = function(x, y, value)
{
    if (this.f[x][y]!=0 && this.f[x][y]!=1000 && this.c[x][y]!=this.color) {
        return;
    }
    this.f[x][y] = value;
    this.c[x][y] = this.color;
};

/** Converts from normal mode to expert mode. */
teka.viewer.killer_sudoku.Killer_sudokuViewer.prototype.setExpert = function(h)
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
teka.viewer.killer_sudoku.Killer_sudokuViewer.prototype.getExpert = function(h)
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
