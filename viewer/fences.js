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

    this.properties = [];
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
    this.edge_error = teka.new_array([this.B],false);
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
    this.node = [];

    var e = [];
    for (var i=0;i<=X;i++) {
        for (var j=0;j<=Y;j++) {
            if (grid[2*i][2*j]==teka.ord('+')) {
                this.node[this.E] = {x:i,y:Y-j};
                e[i+(X+1)*(Y-j)] = this.E;
                this.E++;
            }
        }
    }

    this.B = 0;
    this.edge = [];

    for (var i=0;i<X;i++) {
        for (var j=0;j<=Y;j++) {
            if (grid[2*i+1][2*j]==teka.ord('-')) {
                this.edge[this.B] = {from:e[i+(X+1)*(Y-j)],to:e[i+1+(X+1)*(Y-j)]};
                this.B++;
            }
        }
    }
    for (var i=0;i<=X;i++) {
        for (var j=0;j<Y;j++) {
            if (grid[2*i][2*j+1]==teka.ord('|')) {
                this.edge[this.B] = {from:e[i+(X+1)*(Y-j)],to:e[i+(X+1)*(Y-(j+1))]};
                this.B++;
            }
        }
    }

    this.A = 0;
    this.area = [];
    var holes = false;

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
                holes = true;
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

    this.properties.push(teka.translate('fences_rectangular_size',[X+'x'+Y]));
    if (holes) {
        this.properties.push(teka.translate('fences_with_holes'));
    }
};

/** Initialize with puzzle in graph format. */
teka.viewer.fences.FencesViewer.prototype.initDataGraph = function(data)
{
    this.listToNode(data.get('node'));
    this.listToEdge(data.get('edge'));
    this.listToArea(data.get('area'));
    this.listToStyle(data.get('style'));
    this.properties.push(teka.translate('fences_graph_size',[this.A]));
};

/** Read nodes from list. */
teka.viewer.fences.FencesViewer.prototype.listToNode = function(ascii)
{
    if (ascii===false) {
        return;
    }
    var list = this.asciiToList(ascii);

    this.E = 0;
    this.node = [];

    for (var i=0;i<list.length;i+=2) {
        this.node[this.E] = {x:parseFloat(list[i]),y:parseFloat(list[i+1])};
        this.E++;
    }
};

/** Read edges from list. */
teka.viewer.fences.FencesViewer.prototype.listToEdge = function(ascii)
{
    if (ascii===false) {
        return;
    }
    var list = this.asciiToList(ascii);

    this.B = 0;
    this.edge = [];
    this.solution = [];

    for (var i=0;i<list.length;i+=3) {
        this.edge[this.B] = {from:parseInt(list[i],10),to:parseInt(list[i+1],10)};
        this.solution[this.B] = list[i+2]=='true'
            ?teka.viewer.fences.Defaults.SET
            :teka.viewer.fences.Defaults.NONE;
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
    var minx=this.node[0].x;
    var miny=this.node[0].y;
    var maxx=this.node[0].x;
    var maxy=this.node[0].y;

    for (var i=1;i<this.E;i++) {
        minx = Math.min(minx,this.node[i].x);
        maxx = Math.max(maxx,this.node[i].x);
        miny = Math.min(miny,this.node[i].y);
        maxy = Math.max(maxy,this.node[i].y);
    }

    for (var i=0;i<this.E;i++) {
        this.node[i].x-=minx;
        this.node[i].y=maxy-this.node[i].y;
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
 * a) areas get a sorted list of touching edges and touching nodes.
 * b) edges get the two areas at the left and at the right.
 */
teka.viewer.fences.FencesViewer.prototype.addGraphData = function()
{
    for (var i=0;i<this.A;i++) {
        this.area[i].edgelist = false;
        this.area[i].nodelist = false;
    }

    for (var i=0;i<this.B;i++) {
        this.edge[i].r_area = false;
        this.edge[i].l_area = false;
    }

    for (var i=0;i<this.B;i++) {
        if (this.edge[i].r_area===false) {
            this.findRightArea(i,true);
        }
        if (this.edge[i].l_area===false) {
            this.findRightArea(i,false);
        }
    }
};

/**
 * Finds the area to the right of the given edge b. Which side is
 * 'right' depends on the value of forward. Attaches the edges and
 * nodes to this area as well as the area to the edges.
 */
teka.viewer.fences.FencesViewer.prototype.findRightArea = function(b, forward)
{
    var edgelist = this.getEdgelistToTheRight(b, forward);
    if (edgelist===false) {
        return;
    }

    var angle = this.getAngleFromEdgelist(edgelist);
    if (Math.abs(angle-(edgelist.length-2)*Math.PI)>0.1) {
        // we found the outside polygon
        this.setAreaForEdgesInEdgelist(edgelist,false);
        return;
    }

    var nodelist = this.getNodelistFromEdgelist(edgelist);
    var area = this.getAreaFromNodelist(nodelist);

    this.setAreaForEdgesInEdgelist(edgelist,area);
    this.addEdgelistAndNodelistToArea(area,edgelist,nodelist);
};

/**
 * Follows the graph, starting by edge b, always selecting the rightmost
 * continuation.
 */
teka.viewer.fences.FencesViewer.prototype.getEdgelistToTheRight = function(b, forward)
{
    var result = [{nr:b,forward:forward}];

    var start = forward?this.edge[b].from:this.edge[b].to;
    var last = start;
    var node = forward?this.edge[b].to:this.edge[b].from;

    while (node!=start) {
        var best = false;
        var bestforward = false;
        var bestangle = 400;

        for (var i=0;i<this.B;i++) {
            if (this.edge[i].from==node && this.edge[i].to!=last) {
                var h = this.getAngle(last,node,this.edge[i].to);
                if (h<bestangle) {
                    bestangle = h;
                    best = i;
                    bestforward = true;
                }
            }
            if (this.edge[i].to==node && this.edge[i].from!=last) {
                var h = this.getAngle(last,node,this.edge[i].from);
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

        last = node;
        node = bestforward?this.edge[best].to:this.edge[best].from;
    }

    return result;
};

/** Calculate the sum of all inner angles in the polygon bl. */
teka.viewer.fences.FencesViewer.prototype.getAngleFromEdgelist = function(bl)
{
    var result = 0;
    var last = bl.length-1;
    var node = 0;

    while (node<bl.length) {
        result += this.getAngle(bl[last].forward===true?this.edge[bl[last].nr].from:this.edge[bl[last].nr].to,
                                bl[node].forward===true?this.edge[bl[node].nr].from:this.edge[bl[node].nr].to,
                                bl[node].forward===true?this.edge[bl[node].nr].to:this.edge[bl[node].nr].from);
        last = node;
        node++;
    }

    return result;
};

/** Calculate the angle between the nodes e1, e2, e3 */
teka.viewer.fences.FencesViewer.prototype.getAngle = function(a,b,c)
{
    var la = teka.sqr(this.node[a].x-this.node[b].x)+teka.sqr(this.node[a].y-this.node[b].y);
    var lb = teka.sqr(this.node[c].x-this.node[b].x)+teka.sqr(this.node[c].y-this.node[b].y);
    var lc = teka.sqr(this.node[a].x-this.node[c].x)+teka.sqr(this.node[a].y-this.node[c].y);
    var h = (la+lb-lc)/(2*Math.sqrt(la*lb));
    if (h<-0.999999) {
        return Math.PI;
    }
    var w = Math.acos(h);

    var k = (this.node[c].x-this.node[a].x)*(this.node[b].y-this.node[a].y)-(this.node[c].y-this.node[a].y)*(this.node[b].x-this.node[a].x);

    if (k<0) {
        w=2*Math.PI-w;
    }
    return w;
};

/** Calculate the area, that is framed by the given el. */
teka.viewer.fences.FencesViewer.prototype.getAreaFromNodelist = function(el)
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
    var node = 0;

    while (node<el.length) {
        if (((this.node[el[node]].y>a.y) != (this.node[el[last]].y>a.y))
            && (a.x<(this.node[el[last]].x-this.node[el[node]].x)*
                (a.y-this.node[el[node]].y)/(this.node[el[last]].y-this.node[el[node]].y)+
                this.node[el[node]].x)) {
            result = !result;
        }
        last = node;
        node++;
    }

    return result;
};

/** Create an nodelist from the edges in the bl. */
teka.viewer.fences.FencesViewer.prototype.getNodelistFromEdgelist = function(bl)
{
    var el = [];
    for (var i=0;i<bl.length;i++) {
        if (bl[i].forward===true) {
            el.push(this.edge[bl[i].nr].to);
        } else {
            el.push(this.edge[bl[i].nr].from);
        }
    }
    return el;
};

/** Add area a to all edges in bl. */
teka.viewer.fences.FencesViewer.prototype.setAreaForEdgesInEdgelist = function(bl, a)
{
    for (var i=0;i<bl.length;i++) {
        if (bl[i].forward===true) {
            this.edge[bl[i].nr].r_area = a;
        } else {
            this.edge[bl[i].nr].l_area = a;
        }
    }
};

/** Add edgelist bl and nodelist el to area. */
teka.viewer.fences.FencesViewer.prototype.addEdgelistAndNodelistToArea = function(a, bl, el)
{
    this.area[a].edgelist = bl;
    this.area[a].nodelist = el;
};

/** Add solution. */
teka.viewer.fences.FencesViewer.prototype.addSolution = function()
{
    for (var i=0;i<this.B;i++) {
        this.f[i] = this.solution[i];
    }
};

//////////////////////////////////////////////////////////////////

/**
 * For use with keys: For every edge the edges, that can be considered to
 * be left, right, top and bottom, are calculated and saved in lists.
 */
teka.viewer.fences.FencesViewer.prototype.calculateListsOfNextNeighbours = function()
{
    for (var i=0;i<this.B;i++) {
        this.edge[i].left = [];
        this.edge[i].right = [];
        this.edge[i].top = [];
        this.edge[i].bottom = [];
    }

    for (var i=0;i<this.B;i++) {
        for (var j=0;j<this.B;j++) {
            if (i!=j) {
                if (this.edge[j].from==this.edge[i].from ||
                    this.edge[j].from==this.edge[i].to) {
                    if (this.node[this.edge[j].to].x>this.node[this.edge[j].from].x) {
                        this.edge[i].right.push(j);
                    }
                    if (this.node[this.edge[j].to].x<this.node[this.edge[j].from].x) {
                        this.edge[i].left.push(j);
                    }
                    if (this.node[this.edge[j].to].y>this.node[this.edge[j].from].y) {
                        this.edge[i].bottom.push(j);
                    }
                    if (this.node[this.edge[j].to].y<this.node[this.edge[j].from].y) {
                        this.edge[i].top.push(j);
                    }
                }
                if (this.edge[j].to==this.edge[i].from ||
                    this.edge[j].to==this.edge[i].to) {
                    if (this.node[this.edge[j].from].x>this.node[this.edge[j].to].x) {
                        this.edge[i].right.push(j);
                    }
                    if (this.node[this.edge[j].from].x<this.node[this.edge[j].to].x) {
                        this.edge[i].left.push(j);
                    }
                    if (this.node[this.edge[j].from].y>this.node[this.edge[j].to].y) {
                        this.edge[i].bottom.push(j);
                    }
                    if (this.node[this.edge[j].from].y<this.node[this.edge[j].to].y) {
                        this.edge[i].top.push(j);
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
    return '/format 2\n/type (fences)\n/sol false\n/style [ [ 1 0 0 1 0 0 ] ]\n'
        +'/node [ [ 0 0 ] [ 1 0 ] [ 2 0 ] [ 3 0 ] [ 4 0 ] [ 0 1 ] [ 1 1 ] [ 2 1 ] '
        +'[ 3 1 ] [ 4 1 ] [ 0 2 ] [ 1 2 ] [ 2 2 ] [ 3 2 ] [ 4 2 ] [ 0 3 ] [ 1 3 ] '
        +'[ 2 3 ] [ 3 3 ] [ 4 3 ] [ 0 4 ] [ 1 4 ] [ 2 4 ] [ 3 4 ] [ 4 4 ] ]\n'
        +'/edge [ [ 0 1 false ] [ 1 2 false ] [ 2 3 false ] [ 3 4 true ] '
        +'[ 5 6 false ] [ 6 7 true ] [ 7 8 false ] [ 8 9 false ] [ 10 11 true ] '
        +'[ 11 12 false ] [ 12 13 false ] [ 13 14 false ] [ 15 16 false ] '
        +'[ 16 17 false ] [ 17 18 true ] [ 18 19 false ] [ 20 21 true ] '
        +'[ 21 22 true ] [ 22 23 true ] [ 23 24 true ] [ 0 5 false ] [ 5 10 false ] '
        +'[ 10 15 true ] [ 15 20 true ] [ 1 6 false ] [ 6 11 true ] [ 11 16 false ] '
        +'[ 16 21 false ] [ 2 7 false ] [ 7 12 true ] [ 12 17 true ] [ 17 22 false ] '
        +'[ 3 8 true ] [ 8 13 true ] [ 13 18 true ] [ 18 23 false ] [ 4 9 true ] '
        +'[ 9 14 true ] [ 14 19 true ] [ 19 24 true ] ]\n'
        +'/area [ [ 0.5 0.5 0 0 ] [ 1.5 0.5 -1 0 ] [ 2.5 0.5 1 0 ] [ 3.5 0.5 -1 0 ] '
        +'[ 0.5 1.5 2 0 ] [ 1.5 1.5 3 0 ] [ 2.5 1.5 2 0 ] [ 3.5 1.5 -1 0 ] '
        +'[ 0.5 2.5 -1 0 ] [ 1.5 2.5 -1 0 ] [ 2.5 2.5 -1 0 ] [ 3.5 2.5 -1 0 ] '
        +'[ 0.5 3.5 -1 0 ] [ 1.5 3.5 1 0 ] [ 2.5 3.5 -1 0 ] [ 3.5 3.5 -1 0 ] ]';
};

/** Returns a list of automatically generated properties. */
teka.viewer.fences.FencesViewer.prototype.getProperties = function()
{
    return this.properties;
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
        this.edge_error[i] = false;
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
    // check for dead ends and branching
    for (var i=0;i<this.E;i++) {
        var az = 0;
        for (var j=0;j<this.B;j++) {
            if (this.f[j]==teka.viewer.fences.Defaults.SET
                && (this.edge[j].from==i || this.edge[j].to==i)) {
                az++;
            }
        }
        if (az!=0 && az!=2) {
            for (var j=0;j<this.B;j++) {
                if (this.f[j]==teka.viewer.fences.Defaults.SET
                    && (this.edge[j].from==i || this.edge[j].to==i)) {
                    this.edge_error[j] = true;
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
            for (var j=0;j<this.area[i].edgelist.length;j++) {
                if (this.f[this.area[i].edgelist[j].nr]==teka.viewer.fences.Defaults.SET) {
                    az++;
                }
            }
            if (az!=this.area[i].value) {
                this.area_error[i] = true;
                return 'fences_number_wrong';
            }
        }
    }

    // find one set edge
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

    // mark all edges, that are set and connected with edge k
    var start = this.edge[k].from;
    var last = this.edge[k].from;
    var node = this.edge[k].to;
    this.edge_error[k] = true;

    while (node!=start) {
        var neu = false;

        for (var i=0;i<this.B;i++) {
            if (this.f[i]==teka.viewer.fences.Defaults.SET) {
                if (this.edge[i].from==node && this.edge[i].to!=last) {
                    neu = this.edge[i].to;
                    this.edge_error[i] = true;
                }
                if (this.edge[i].to==node && this.edge[i].from!=last) {
                    neu = this.edge[i].from;
                    this.edge_error[i] = true;
                }
            }
        }

        last = node;
        node = neu;
    }

    // still set edges left? => not connected
    for (var i=0;i<this.B;i++) {
        if (this.f[i]==teka.viewer.fences.Defaults.SET && !this.edge_error[i]) {
            return 'fences_not_connected';
        }
    }

    // cleaning up
    for (var i=0;i<this.B;i++) {
        this.edge_error[i] = false;
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
    this.edgeX = 3;
    this.edgeY = 3;

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
    g.translate(this.deltaX+this.edgeX,this.deltaY+this.edgeY);

    // paint background
    for (var i=0;i<this.A;i++) {
        if (this.area[i].nodelist!==false) {
            g.fillStyle = this.isBlinking()?
                this.getBlinkColor(i,i,this.A,this.f[i]):
                (this.area_error[i]?'#f00':'#fff');
            g.beginPath();
            g.moveTo(this.node[this.area[i].nodelist[0]].x*S,
                     this.node[this.area[i].nodelist[0]].y*S);
            for (var k=1;k<this.area[i].nodelist.length;k++) {
                g.lineTo(this.node[this.area[i].nodelist[k]].x*S,
                         this.node[this.area[i].nodelist[k]].y*S);
            }
            g.fill();
        }
    }

    // paint grid
    g.strokeStyle = this.isBlinking()?'#000':'#888';
    for (var i=0;i<this.B;i++) {
        teka.drawLine(g,
                      this.node[this.edge[i].from].x*S,
                      this.node[this.edge[i].from].y*S,
                      this.node[this.edge[i].to].x*S,
                      this.node[this.edge[i].to].y*S);
    }

    // paint nodes
    g.fillStyle = '#000';
    for (var i=0;i<this.E;i++) {
        teka.fillOval(g,this.node[i].x*S,this.node[i].y*S,3);
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
            g.translate(this.area[i].x*S,this.area[i].y*S);
            g.transform(h[0],h[1],h[2],h[3],h[4],h[5]);
            g.fillText(this.area[i].value,0,this.font.delta);
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
                          this.node[this.edge[i].from].x*S,
                          this.node[this.edge[i].from].y*S,
                          this.node[this.edge[i].to].x*S,
                          this.node[this.edge[i].to].y*S);
            g.lineCap = 'butt';
            g.lineWidth = 1;
        }

        if (this.f[i]==teka.viewer.fences.Defaults.EMPTY) {
            var x = (this.node[this.edge[i].from].x+this.node[this.edge[i].to].x)/2*S;
            var y = (this.node[this.edge[i].from].y+this.node[this.edge[i].to].y)/2*S;

            g.lineWidth = 2;
            teka.drawLine(g,x-3,y-3,x+3,y+3);
            teka.drawLine(g,x-3,y+3,x+3,y-3);
            g.lineWidth = 1;
        }
    }

    // paint erroneous edges
    g.strokeStyle = '#f00';
    g.lineWidth = 5;
    g.lineCap = 'round';
    for (var i=0;i<this.B;i++) {
        if (this.edge_error[i]) {
            teka.drawLine(g,
                          this.node[this.edge[i].from].x*S,
                          this.node[this.edge[i].from].y*S,
                          this.node[this.edge[i].to].x*S,
                          this.node[this.edge[i].to].y*S);
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
                          this.node[this.edge[this.cursor].from].x*S,
                          this.node[this.edge[this.cursor].from].y*S,
                          this.node[this.edge[this.cursor].to].x*S,
                          this.node[this.edge[this.cursor].to].y*S);
            g.lineWidth = 1;
        }
    }

    if (this.list!==false) {
        g.strokeStyle = '#f00';
        for (var i=0;i<this.list.length;i++) {
            if (this.list[i]!=this.cursor) {
            teka.drawLine(g,
                          this.node[this.edge[this.list[i]].from].x*S,
                          this.node[this.edge[this.list[i]].from].y*S,
                          this.node[this.edge[this.list[i]].to].x*S,
                          this.node[this.edge[this.list[i]].to].y*S);
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

    xc = xc-this.deltaX-this.edgeX;
    yc = yc-this.deltaY-this.edgeY;

    var oldcursor = this.cursor;

    this.cursor = this.getEdge(xc/this.scale,yc/this.scale);

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

    if (e.key==teka.KEY_DOWN && this.edge[this.cursor].bottom.length>0) {
        this.list = this.edge[this.cursor].bottom;
        this.cursor = this.edge[this.cursor].bottom[0];
        return true;
    }
    if (e.key==teka.KEY_UP && this.edge[this.cursor].top.length>0) {
        this.list = this.edge[this.cursor].top;
        this.cursor = this.edge[this.cursor].top[0];
        return true;
    }
    if (e.key==teka.KEY_LEFT && this.edge[this.cursor].left.length>0) {
        this.list = this.edge[this.cursor].left;
        this.cursor = this.edge[this.cursor].left[0];
        return true;
    }
    if (e.key==teka.KEY_RIGHT && this.edge[this.cursor].right.length>0) {
        this.list = this.edge[this.cursor].right;
        this.cursor = this.edge[this.cursor].right[0];
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
 * Searches the edge, that is next to point x,y. Returns false,
 * if all edges are too far.
 */
teka.viewer.fences.FencesViewer.prototype.getEdge = function(x, y)
{
    var minpos = false;
    var mindist = 1000;

    for (var i=0;i<this.B;i++) {
        var ax = this.node[this.edge[i].from].x;
        var ay = this.node[this.edge[i].from].y;
        var bx = this.node[this.edge[i].to].x;
        var by = this.node[this.edge[i].to].y;

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
