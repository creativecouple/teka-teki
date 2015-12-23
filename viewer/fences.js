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
teka.viewer.fences = {};

/** Some constants. */
teka.viewer.fences.Defaults = {
    NONE: 0,
    SET: 1,
    EMPTY: 2
};

/** Constructor */
teka.viewer.fences.FencesViewer = function(data)
{
    teka.viewer.PuzzleViewer.call(this,data);

    this.cursor = false;
    this.list = false;
    this.selected = false;
};
teka.extend(teka.viewer.fences.FencesViewer,teka.viewer.PuzzleViewer);

//////////////////////////////////////////////////////////////////

/** Initialize this viewer with the PSData object provided. */
teka.viewer.fences.FencesViewer.prototype.initData = function(data)
{
    var format = data.get('format');
    format = format===false?1:parseInt(data.get('format'),10);

    switch (format) {
      case 1:
        this.initDataRectangle(data);
        break;
      case 2:
        this.initDataGraph(data);
        break;
    }

    this.moveToFirstQuadrant();
    this.addGraphData();
    this.calculateListsOfNextNeighbours();

    this.f = teka.new_array([this.B],0);
    this.c = teka.new_array([this.B],0);
    this.area_error = teka.new_array([this.A],false);
    this.border_error = teka.new_array([this.B],false);
};

/** Initialize with puzzle in rectangular ascii art. */
teka.viewer.fences.FencesViewer.prototype.initDataRectangle = function(data)
{
    var X = parseInt(data.get('X'),10);
    var Y = parseInt(data.get('Y'),10);
    this.asciiToData(data.get('puzzle'),X,Y);
};

/** Read puzzle from rectangular ascii art. */
teka.viewer.fences.FencesViewer.prototype.asciiToData = function(ascii, X, Y)
{
    if (ascii===false) {
        return;
    }
    var grid = this.asciiToArray(ascii);

    this.E = 0;
    this.edge = [];

    var e = [];
    for (var i=0;i<=X;i++) {
        for (var j=0;j<=Y;j++) {
            if (grid[2*i][2*j]==teka.ord('+')) {
                this.edge[this.E] = {x:i,y:Y-j};
                e[i+(X+1)*(Y-j)] = this.E;
                this.E++;
            }
        }
    }

    this.B = 0;
    this.border = [];

    for (var i=0;i<X;i++) {
        for (var j=0;j<=Y;j++) {
            if (grid[2*i+1][2*j]==teka.ord('-')) {
                this.border[this.B] = {from:e[i+(X+1)*(Y-j)],to:e[i+1+(X+1)*(Y-j)]};
                this.B++;
            }
        }
    }
    for (var i=0;i<=X;i++) {
        for (var j=0;j<Y;j++) {
            if (grid[2*i][2*j+1]==teka.ord('|')) {
                this.border[this.B] = {from:e[i+(X+1)*(Y-j)],to:e[i+(X+1)*(Y-(j+1))]};
                this.B++;
            }
        }
    }

    this.A = 0;
    this.area = [];

    for (var i=1;i<X;i++) {
        for (var j=1;j<Y;j++) {
            if (grid[2*i-2][2*j-2]==teka.ord('+') &&
                grid[2*i-2][2*j]==teka.ord('+') &&
                grid[2*i-2][2*j+2]==teka.ord('+') &&
                grid[2*i][2*j-2]==teka.ord('+') &&
                grid[2*i][2*j+2]==teka.ord('+') &&
                grid[2*i+2][2*j-2]==teka.ord('+') &&
                grid[2*i+2][2*j]==teka.ord('+') &&
                grid[2*i+2][2*j+2]==teka.ord('+') &&
                grid[2*i][2*j]!=teka.ord('+')) {
                this.area[this.A] = {
                    x:i,
                    y:Y-j,
                    value:grid[2*i][2*j]==teka.ord(' ')?false:(grid[2*i][2*j]-teka.ord('0')),
                    style:1
                };
                this.A++;
            }
        }
    }

    for (var i=0;i<X;i++) {
        for (var j=0;j<Y;j++) {
            if (grid[2*i][2*j]==teka.ord('+') &&
                grid[2*i+2][2*j]==teka.ord('+') &&
                grid[2*i][2*j+2]==teka.ord('+') &&
                grid[2*i+2][2*j+2]==teka.ord('+') &&
                grid[2*i][2*j+1]==teka.ord('|') &&
                grid[2*i+2][2*j+1]==teka.ord('|') &&
                grid[2*i+1][2*j]==teka.ord('-') &&
                grid[2*i+1][2*j+2]==teka.ord('-')) {
                this.area[this.A] = {
                    x:i+0.5,
                    y:Y-(j+0.5),
                    value:grid[2*i+1][2*j+1]==teka.ord(' ')?false:(grid[2*i+1][2*j+1]-teka.ord('0')),
                    style:0
                };
                this.A++;
            }
        }
    }

    this.S = 1;
    this.style = [ [1,0,0,1,0,0], [1.7,0,0,1.7,0,0] ];
};

/** Initialize with puzzle in graph format. */
teka.viewer.fences.FencesViewer.prototype.initDataGraph = function(data)
{
    this.listToEdge(data.get('edge'));
    this.listToBorder(data.get('border'));
    this.listToArea(data.get('area'));
    this.listToStyle(data.get('style'));
};

/** Read edges from list. */
teka.viewer.fences.FencesViewer.prototype.listToEdge = function(ascii)
{
    if (ascii===false) {
        return;
    }
    var list = this.asciiToList(ascii);

    this.E = 0;
    this.edge = [];

    for (var i=0;i<list.length;i+=2) {
        this.edge[this.E] = {x:parseFloat(list[i]),y:parseFloat(list[i+1])};
        this.E++;
    }
};

/** Read borders from list. */
teka.viewer.fences.FencesViewer.prototype.listToBorder = function(ascii)
{
    if (ascii===false) {
        return;
    }
    var list = this.asciiToList(ascii);

    this.B = 0;
    this.border = [];

    for (var i=0;i<list.length;i+=3) {
        this.border[this.B] = {from:parseInt(list[i],10),to:parseInt(list[i+1],10)};
        this.B++;
    }
};

/** Read areas from list. */
teka.viewer.fences.FencesViewer.prototype.listToArea = function(ascii, format2)
{
    if (ascii===false) {
        return;
    }
    var list = this.asciiToList(ascii);

    this.A = 0;
    this.area = [];

    for (var i=0;i<list.length;i+=4) {
        this.area[this.A] = {
            x:parseFloat(list[i]),
            y:parseFloat(list[i+1]),
            value:parseInt(list[i+2],10),
            style:parseInt(list[i+3],10)
        };
        if (this.area[this.A].value===-1) {
            this.area[this.A].value = false;
        }
        this.A++;
    }
};

/** Read digit style info from list. */
teka.viewer.fences.FencesViewer.prototype.listToStyle = function(ascii)
{
    if (ascii===false) {
        return;
    }
    var list = this.asciiToList(ascii);

    this.S = 0;
    this.style = [];

    for (var i=0;i<list.length;i+=6) {
        this.style[this.S] =
            [ parseFloat(list[i]),
              parseFloat(list[i+1]),
              parseFloat(list[i+2]),
              parseFloat(list[i+3]),
              parseFloat(list[i+4]),
              parseFloat(list[i+5]) ];
        this.S++;
    }
};

//////////////////////////////////////////////////////////////////

/**
 * Normalizes the data to attach at the left and the top to zero
 * coordinates. As the spf-format for graphs has the origin at the
 * bottom, contrary to computer screens, where it is at the top, the
 * whole graph is mirrored at the y-axis.
 */
teka.viewer.fences.FencesViewer.prototype.moveToFirstQuadrant = function()
{
    var minx=this.edge[0].x;
    var miny=this.edge[0].y;
    var maxx=this.edge[0].x;
    var maxy=this.edge[0].y;

    for (var i=1;i<this.E;i++) {
        minx = Math.min(minx,this.edge[i].x);
        maxx = Math.max(maxx,this.edge[i].x);
        miny = Math.min(miny,this.edge[i].y);
        maxy = Math.max(maxy,this.edge[i].y);
    }

    for (var i=0;i<this.E;i++) {
        this.edge[i].x-=minx;
        this.edge[i].y=maxy-this.edge[i].y;
    }

    for (var i=0;i<this.A;i++) {
        this.area[i].x-=minx;
        this.area[i].y=maxy-this.area[i].y;
    }

    for (var i=0;i<this.S;i++) {
        this.style[i][1] = -this.style[i][1];
        this.style[i][2] = -this.style[i][2];
    }

    this.MAXX = Math.ceil(maxx-minx);
    this.MAXY = Math.ceil(maxy-miny);
};

//////////////////////////////////////////////////////////////////

/**
 * Adds some usefull data to the graph datas:
 * a) areas get a sorted list of touching borders and touching edges.
 * b) borders get the two areas at the left and at the right.
 */
teka.viewer.fences.FencesViewer.prototype.addGraphData = function()
{
    for (var i=0;i<this.A;i++) {
        this.area[i].borderlist = false;
        this.area[i].edgelist = false;
    }

    for (var i=0;i<this.B;i++) {
        this.border[i].r_area = false;
        this.border[i].l_area = false;
    }

    for (var i=0;i<this.B;i++) {
        if (this.border[i].r_area===false) {
            this.findRightArea(i,true);
        }
        if (this.border[i].l_area===false) {
            this.findRightArea(i,false);
        }
    }
};

/**
 * Finds the area to the right of the given border b. Which side is
 * 'right' depends on the value of forward. Attaches the borders and
 * edges to this area as well as the area to the borders.
 */
teka.viewer.fences.FencesViewer.prototype.findRightArea = function(b, forward)
{
    var borderlist = this.getBorderlistToTheRight(b, forward);
    if (borderlist===false) {
        return;
    }

    var angle = this.getAngleFromBorderlist(borderlist);
    if (Math.abs(angle-(borderlist.length-2)*Math.PI)>0.1) {
        // we found the outside polygon
        this.setAreaForBordersInBorderlist(borderlist,false);
        return;
    }

    var edgelist = this.getEdgelistFromBorderlist(borderlist);
    var area = this.getAreaFromEdgelist(edgelist);

    this.setAreaForBordersInBorderlist(borderlist,area);
    this.addBorderlistAndEdgelistToArea(area,borderlist,edgelist);
};

/**
 * Follows the graph, starting by border b, always selecting the rightmost
 * continuation.
 */
teka.viewer.fences.FencesViewer.prototype.getBorderlistToTheRight = function(b, forward)
{
    var result = [{nr:b,forward:forward}];

    var start = forward?this.border[b].from:this.border[b].to;
    var last = start;
    var edge = forward?this.border[b].to:this.border[b].from;

    while (edge!=start) {
        var best = false;
        var bestforward = false;
        var bestangle = 400;

        for (var i=0;i<this.B;i++) {
            if (this.border[i].from==edge && this.border[i].to!=last) {
                var h = this.getAngle(last,edge,this.border[i].to);
                if (h<bestangle) {
                    bestangle = h;
                    best = i;
                    bestforward = true;
                }
            }
            if (this.border[i].to==edge && this.border[i].from!=last) {
                var h = this.getAngle(last,edge,this.border[i].from);
                if (h<bestangle) {
                    bestangle = h;
                    best = i;
                    bestforward = false;
                }
            }
        }

        if (best===false) {
            return false;
        }

        result.push({nr:best,forward:bestforward});

        last = edge;
        edge = bestforward?this.border[best].to:this.border[best].from;
    }

    return result;
};

/** Calculate the sum of all inner angles in the polygon bl. */
teka.viewer.fences.FencesViewer.prototype.getAngleFromBorderlist = function(bl)
{
    var result = 0;
    var last = bl.length-1;
    var edge = 0;

    while (edge<bl.length) {
        result += this.getAngle(bl[last].forward===true?this.border[bl[last].nr].from:this.border[bl[last].nr].to,
                                bl[edge].forward===true?this.border[bl[edge].nr].from:this.border[bl[edge].nr].to,
                                bl[edge].forward===true?this.border[bl[edge].nr].to:this.border[bl[edge].nr].from);
        last = edge;
        edge++;
    }

    return result;
};

/** Calculate the angle between the edges e1, e2, e3 */
teka.viewer.fences.FencesViewer.prototype.getAngle = function(a,b,c)
{
    var la = teka.sqr(this.edge[a].x-this.edge[b].x)+teka.sqr(this.edge[a].y-this.edge[b].y);
    var lb = teka.sqr(this.edge[c].x-this.edge[b].x)+teka.sqr(this.edge[c].y-this.edge[b].y);
    var lc = teka.sqr(this.edge[a].x-this.edge[c].x)+teka.sqr(this.edge[a].y-this.edge[c].y);
    var h = (la+lb-lc)/(2*Math.sqrt(la*lb));
    if (h<-0.999999) {
        return Math.PI;
    }
    var w = Math.acos(h);

    var k = (this.edge[c].x-this.edge[a].x)*(this.edge[b].y-this.edge[a].y)-(this.edge[c].y-this.edge[a].y)*(this.edge[b].x-this.edge[a].x);

    if (k<0) {
        w=2*Math.PI-w;
    }
    return w;
};

/** Calculate the area, that is framed by the given el. */
teka.viewer.fences.FencesViewer.prototype.getAreaFromEdgelist = function(el)
{
    var area = false;

    for (var i=0;i<this.A;i++) {
        if (this.inPoly(el,this.area[i])) {
            area = i;
            break;
        }
    }

    return area;
};

/** PNPoly algorithm found by W. Randolph Franklin. */
teka.viewer.fences.FencesViewer.prototype.inPoly = function(el,a)
{
    var result = false;
    var last = el.length-1;
    var edge = 0;

    while (edge<el.length) {
        if (((this.edge[el[edge]].y>a.y) != (this.edge[el[last]].y>a.y))
            && (a.x<(this.edge[el[last]].x-this.edge[el[edge]].x)*
                (a.y-this.edge[el[edge]].y)/(this.edge[el[last]].y-this.edge[el[edge]].y)+
                this.edge[el[edge]].x)) {
            result = !result;
        }
        last = edge;
        edge++;
    }

    return result;
};

/** Create an edgelist from the borders in the bl. */
teka.viewer.fences.FencesViewer.prototype.getEdgelistFromBorderlist = function(bl)
{
    var el = [];
    for (var i=0;i<bl.length;i++) {
        if (bl[i].forward===true) {
            el.push(this.border[bl[i].nr].to);
        } else {
            el.push(this.border[bl[i].nr].from);
        }
    }
    return el;
};

/** Add area a to all borders in bl. */
teka.viewer.fences.FencesViewer.prototype.setAreaForBordersInBorderlist = function(bl, a)
{
    for (var i=0;i<bl.length;i++) {
        if (bl[i].forward===true) {
            this.border[bl[i].nr].r_area = a;
        } else {
            this.border[bl[i].nr].l_area = a;
        }
    }
};

/** Add borderlist bl and edgelist el to area. */
teka.viewer.fences.FencesViewer.prototype.addBorderlistAndEdgelistToArea = function(a, bl, el)
{
    this.area[a].borderlist = bl;
    this.area[a].edgelist = el;
};

/** Add solution. */
teka.viewer.fences.FencesViewer.prototype.addSolution = function()
{
    for (var i=0;i<this.B;i++) {
        this.f[i] = this.solution[i];
    }
};

//////////////////////////////////////////////////////////////////

teka.viewer.fences.FencesViewer.prototype.calculateListsOfNextNeighbours = function()
{
    for (var i=0;i<this.B;i++) {
        this.border[i].left = [];
        this.border[i].right = [];
        this.border[i].top = [];
        this.border[i].bottom = [];
    }

    for (var i=0;i<this.B;i++) {
        for (var j=0;j<this.B;j++) {
            if (i!=j) {
                if (this.border[j].from==this.border[i].from ||
                    this.border[j].from==this.border[i].to) {
                    if (this.edge[this.border[j].to].x>this.edge[this.border[j].from].x) {
                        this.border[i].right.push(j);
                    }
                    if (this.edge[this.border[j].to].x<this.edge[this.border[j].from].x) {
                        this.border[i].left.push(j);
                    }
                    if (this.edge[this.border[j].to].y>this.edge[this.border[j].from].y) {
                        this.border[i].bottom.push(j);
                    }
                    if (this.edge[this.border[j].to].y<this.edge[this.border[j].from].y) {
                        this.border[i].top.push(j);
                    }
                }
                if (this.border[j].to==this.border[i].from ||
                    this.border[j].to==this.border[i].to) {
                    if (this.edge[this.border[j].from].x>this.edge[this.border[j].to].x) {
                        this.border[i].right.push(j);
                    }
                    if (this.edge[this.border[j].from].x<this.edge[this.border[j].to].x) {
                        this.border[i].left.push(j);
                    }
                    if (this.edge[this.border[j].from].y>this.edge[this.border[j].to].y) {
                        this.border[i].bottom.push(j);
                    }
                    if (this.edge[this.border[j].from].y<this.edge[this.border[j].to].y) {
                        this.border[i].top.push(j);
                    }
                }
            }
        }
    }
};

//////////////////////////////////////////////////////////////////

/** Returns a small example. */
teka.viewer.fences.FencesViewer.prototype.getExample = function()
{
    return '/type (fences)\n/X 1\n/Y 1\n/puzzle [ (+-+) (|4|) (+-+) ]\n/solution [ (+-+) (| |) (+-+) ]';
};

/** Returns a list of automatically generated properties. */
teka.viewer.fences.FencesViewer.prototype.getProperties = function()
{
    return [];
};

//////////////////////////////////////////////////////////////////

/** Reset the whole diagram. */
teka.viewer.fences.FencesViewer.prototype.reset = function()
{
    for (var i=0;i<this.B;i++) {
        this.f[i] = teka.viewer.fences.Defaults.NONE;
    }
};

/** Reset the error marks. */
teka.viewer.fences.FencesViewer.prototype.clearError = function()
{
    for (var i=0;i<this.A;i++) {
        this.area_error[i] = false;
    }
    for (var i=0;i<this.B;i++) {
        this.border_error[i] = false;
    }
};

/** Copy digits colored with this.color to color. */
teka.viewer.fences.FencesViewer.prototype.copyColor = function(color)
{
    for (var i=0;i<this.B;i++) {
        if (this.c[i]==this.color) {
            this.c[i] = color;
        }
    }
};

/** Delete all digits with color. */
teka.viewer.fences.FencesViewer.prototype.clearColor = function(color)
{
    for (var i=0;i<this.B;i++) {
        if (this.c[i]==color) {
            this.f[i] = 0;
        }
    }
};

/** Save current state. */
teka.viewer.fences.FencesViewer.prototype.saveState = function()
{
    var f = teka.new_array([this.B],0);
    var c = teka.new_array([this.B],0);
    for (var i=0;i<this.B;i++) {
        f[i] = this.f[i];
        c[i] = this.c[i];
    }

    return { f:f, c:c };
};

/** Load state. */
teka.viewer.fences.FencesViewer.prototype.loadState = function(state)
{
    for (var i=0;i<this.B;i++) {
        this.f[i] = state.f[i];
        this.c[i] = state.c[i];
    }
};

//////////////////////////////////////////////////////////////////

/** Check, if the solution is correct. */
teka.viewer.fences.FencesViewer.prototype.check = function()
{
    var X = this.X;
    var Y = this.Y;

    // check for dead ends and branching
    for (var i=0;i<this.E;i++) {
        var az = 0;
        for (var j=0;j<this.B;j++) {
            if (this.f[j]==teka.viewer.fences.Defaults.SET
                && (this.border[j].from==i || this.border[j].to==i)) {
                az++;
            }
        }
        if (az!=0 && az!=2) {
            for (var j=0;j<this.B;j++) {
                if (this.f[j]==teka.viewer.fences.Defaults.SET
                    && (this.border[j].from==i || this.border[j].to==i)) {
                    this.border_error[j] = true;
                }
            }
        }
        if (az==1) {
            return 'fences_dead_end';
        }
        if (az>2) {
            return 'fences_branching';
        }
    }

    // check for wrong numbers
    for (var i=0;i<this.A;i++) {
        if (this.area[i].value!==false) {
            var az = 0;
            for (var j=0;j<this.area[i].borderlist.length;j++) {
                if (this.f[this.area[i].borderlist[j].nr]==teka.viewer.fences.Defaults.SET) {
                    az++;
                }
            }
            if (az!=this.area[i].value) {
                this.area_error[i] = true;
                return 'fences_number_wrong';
            }
        }
    }

    // find one set border
    var k = false;
    for (var i=0;i<this.B;i++) {
        if (this.f[i]==teka.viewer.fences.Defaults.SET) {
            k = i;
            break;
        }
    }

    // empty fence is considered correct...
    if (k===false) {
        return true;
    }

    // mark all borders, that are set and connected with border k
    var start = this.border[k].from;
    var last = this.border[k].from;
    var edge = this.border[k].to;
    this.border_error[k] = true;

    while (edge!=start) {
        var neu = false;

        for (var i=0;i<this.B;i++) {
            if (this.f[i]==teka.viewer.fences.Defaults.SET) {
                if (this.border[i].from==edge && this.border[i].to!=last) {
                    neu = this.border[i].to;
                    this.border_error[i] = true;
                }
                if (this.border[i].to==edge && this.border[i].from!=last) {
                    neu = this.border[i].from;
                    this.border_error[i] = true;
                }
            }
        }

        last = edge;
        edge = neu;
    }

    // still set borders left? => not connected
    for (var i=0;i<this.B;i++) {
        if (this.f[i]==teka.viewer.fences.Defaults.SET && !this.border_error[i]) {
            return 'fences_not_connected';
        }
    }

    // cleaning up
    for (var i=0;i<this.B;i++) {
        this.border_error[i] = false;
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
teka.viewer.fences.FencesViewer.prototype.setMetrics = function(g)
{
    this.scale = Math.floor(Math.min((this.width-7)/this.MAXX,(this.height-7)/this.MAXY));
    var realwidth = this.MAXX*this.scale+7;
    var realheight = this.MAXY*this.scale+7;

    this.deltaX = Math.floor((this.width-realwidth)/2)+0.5;
    this.deltaY = Math.floor((this.height-realheight)/2)+0.5;
    this.borderX = 3;
    this.borderY = 3;

    this.font = teka.getFontData(Math.round(this.scale/2)+'px sans-serif',this.scale);

    if (realwidth>this.width || realheight>this.height) {
        this.scale=false;
    }
    return {width:realwidth,height:realheight,scale:this.scale};
};

/** Paints the diagram. */
teka.viewer.fences.FencesViewer.prototype.paint = function(g)
{
    var S = this.scale;

    g.save();
    g.translate(this.deltaX+this.borderX,this.deltaY+this.borderY);

    // paint background
    for (var i=0;i<this.A;i++) {
        if (this.area[i].edgelist!==false) {
            g.fillStyle = this.isBlinking()?
                this.getBlinkColor(i,i,this.A,this.f[i]):
                (this.area_error[i]?'#f00':'#fff');
            g.beginPath();
            g.moveTo(this.edge[this.area[i].edgelist[0]].x*S,
                     this.edge[this.area[i].edgelist[0]].y*S);
            for (var k=1;k<this.area[i].edgelist.length;k++) {
                g.lineTo(this.edge[this.area[i].edgelist[k]].x*S,
                         this.edge[this.area[i].edgelist[k]].y*S);
            }
            g.fill();
        }
    }

    // paint grid
    g.strokeStyle = this.isBlinking()?'#000':'#888';
    for (var i=0;i<this.B;i++) {
        teka.drawLine(g,
                      this.edge[this.border[i].from].x*S,
                      this.edge[this.border[i].from].y*S,
                      this.edge[this.border[i].to].x*S,
                      this.edge[this.border[i].to].y*S);
    }

    // paint edges
    g.fillStyle = '#000';
    for (var i=0;i<this.E;i++) {
        teka.fillOval(g,this.edge[i].x*S,this.edge[i].y*S,3);
    }

    // paint numbers
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.font = this.font.font;
    g.fillStyle = '#000';
    for (var i=0;i<this.A;i++) {
        if (this.area[i].value!==false) {
            g.save();
            var h = this.style[this.area[i].style];
            g.transform(h[0],h[1],h[2],h[3],h[4],h[5]);
            g.fillText(this.area[i].value,this.area[i].x*S,this.area[i].y*S+this.font.delta);
            g.restore();
        }
    }

    // paint user input
    for (var i=0;i<this.B;i++) {
        g.strokeStyle = this.getColorString(this.c[i]);

        if (this.f[i]==teka.viewer.fences.Defaults.SET) {
            g.lineWidth = 4;
            g.lineCap = 'round';
            teka.drawLine(g,
                          this.edge[this.border[i].from].x*S,
                          this.edge[this.border[i].from].y*S,
                          this.edge[this.border[i].to].x*S,
                          this.edge[this.border[i].to].y*S);
            g.lineCap = 'butt';
            g.lineWidth = 1;
        }

        if (this.f[i]==teka.viewer.fences.Defaults.EMPTY) {
            var x = (this.edge[this.border[i].from].x+this.edge[this.border[i].to].x)/2*S;
            var y = (this.edge[this.border[i].from].y+this.edge[this.border[i].to].y)/2*S;

            g.lineWidth = 2;
            teka.drawLine(g,x-3,y-3,x+3,y+3);
            teka.drawLine(g,x-3,y+3,x+3,y-3);
            g.lineWidth = 1;
        }
    }

    // paint erroneous borders
    g.strokeStyle = '#f00';
    g.lineWidth = 5;
    g.lineCap = 'round';
    for (var i=0;i<this.B;i++) {
        if (this.border_error[i]) {
            teka.drawLine(g,
                          this.edge[this.border[i].from].x*S,
                          this.edge[this.border[i].from].y*S,
                          this.edge[this.border[i].to].x*S,
                          this.edge[this.border[i].to].y*S);
        }
    }
    g.lineCap = 'butt';
    g.lineWidth = 1;

    // paint the cursor
    if (this.mode==teka.viewer.Defaults.NORMAL) {
        if (this.cursor!==false) {
            g.strokeStyle = '#f00';
            g.lineWidth = 3;
            teka.drawLine(g,
                          this.edge[this.border[this.cursor].from].x*S,
                          this.edge[this.border[this.cursor].from].y*S,
                          this.edge[this.border[this.cursor].to].x*S,
                          this.edge[this.border[this.cursor].to].y*S);
            g.lineWidth = 1;
        }
    }

    if (this.list!=false) {
        g.strokeStyle = '#f00';
        for (var i=0;i<this.list.length;i++) {
            if (this.list[i]!=this.cursor) {
            teka.drawLine(g,
                          this.edge[this.border[this.list[i]].from].x*S,
                          this.edge[this.border[this.list[i]].from].y*S,
                          this.edge[this.border[this.list[i]].to].x*S,
                          this.edge[this.border[this.list[i]].to].y*S);
            }
        }
    }

    g.restore();
};

//////////////////////////////////////////////////////////////////

/** Handles mousemove event. */
teka.viewer.fences.FencesViewer.prototype.processMousemoveEvent = function(xc, yc, pressed)
{
    this.list = false;

    xc = xc-this.deltaX-this.borderX;
    yc = yc-this.deltaY-this.borderY;

    var oldcursor = this.cursor;

    this.cursor = this.getBorder(xc/this.scale,yc/this.scale);

    if (this.cursor===false) {
        this.cursor = oldcursor;
    }

    return this.cursor!=oldcursor;
};

/** Handles mousedown event. */
teka.viewer.fences.FencesViewer.prototype.processMousedownEvent = function(xc, yc)
{
    var erg = this.processMousemoveEvent(xc,yc);

    if (this.cursor===false) {
        return erg;
    }

    this.set(this.cursor,(this.f[this.cursor]+1)%3);

    return true;
};

/** Handles keydown event. */
teka.viewer.fences.FencesViewer.prototype.processKeydownEvent = function(e)
{
    if (e.key==teka.KEY_ESCAPE && this.list!==false && this.list.length>0) {
        this.selected = (this.selected+1)%this.list.length;
        this.cursor = this.list[this.selected];
        return true;
    }

    this.list = false;
    this.selected = false;

    if (e.key==teka.KEY_DOWN && this.border[this.cursor].bottom.length>0) {
        this.list = this.border[this.cursor].bottom;
        this.cursor = this.border[this.cursor].bottom[0];
        return true;
    }
    if (e.key==teka.KEY_UP && this.border[this.cursor].top.length>0) {
        this.list = this.border[this.cursor].top;
        this.cursor = this.border[this.cursor].top[0];
        return true;
    }
    if (e.key==teka.KEY_LEFT && this.border[this.cursor].left.length>0) {
        this.list = this.border[this.cursor].left;
        this.cursor = this.border[this.cursor].left[0];
        return true;
    }
    if (e.key==teka.KEY_RIGHT && this.border[this.cursor].right.length>0) {
        this.list = this.border[this.cursor].right;
        this.cursor = this.border[this.cursor].right[0];
        return true;
    }

    if (e.key==teka.KEY_HASH || e.key==teka.KEY_Q) {
        this.set(this.cursor,teka.viewer.fences.Defaults.SET);
        return true;
    }

    if (e.key==teka.KEY_MINUS || e.key==teka.KEY_W) {
        this.set(this.cursor,teka.viewer.fences.Defaults.EMPTY);
        return true;
    }

    if (e.key==teka.KEY_SPACE) {
        this.set(this.cursor,0);
        return true;
    }

    return false;
};

//////////////////////////////////////////////////////////////////

/** Sets the value of a cell, if the color fits. */
teka.viewer.fences.FencesViewer.prototype.set = function(k, value)
{
    if (this.f[k]!=0 && this.c[k]!=this.color) {
        return;
    }

    this.f[k] = value;
    this.c[k] = this.color;
};

/**
 * Searches the border, that is next to point x,y. Returns false,
 * if all borders are too far.
 */
teka.viewer.fences.FencesViewer.prototype.getBorder = function(x, y)
{
    var minpos = false;
    var mindist = 1000;

    for (var i=0;i<this.B;i++) {
        var ax = this.edge[this.border[i].from].x;
        var ay = this.edge[this.border[i].from].y;
        var bx = this.edge[this.border[i].to].x;
        var by = this.edge[this.border[i].to].y;

        var k = ((x-ax)*(bx-ax)+(y-ay)*(by-ay))/(teka.sqr(ax-bx)+teka.sqr(ay-by));

        if (k<0 || k>1) {
            continue;
        }

        var nx = ax+(bx-ax)*k;
        var ny = ay+(by-ay)*k;
        var d = teka.sqr(x-nx)+teka.sqr(y-ny);

        if (k>0.5) {
            k = 1-k;
        }

        if (d*2>k*k) {
            continue;
        }

        if (d*2>mindist) {
            continue;
        }

        minpos = i;
        mindist = d*2;
    }

    return minpos;
};
