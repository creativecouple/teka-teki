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
teka.viewer.fillomino = {};

/** Some constants. */
teka.viewer.fillomino.Defaults = {
    NONE: 0,
    SET: 1,
    EMPTY: 2
};

/** Constructor */
teka.viewer.fillomino.FillominoViewer = function(data)
{
    teka.viewer.PuzzleViewer.call(this,data);

    this.cursor = {edge:false,nr:false};
    this.list = false;
    this.selected = false;
    this.old = 0;
};
teka.extend(teka.viewer.fillomino.FillominoViewer,teka.viewer.PuzzleViewer);

//////////////////////////////////////////////////////////////////

/** Initialize this viewer with the PSData object provided. */
teka.viewer.fillomino.FillominoViewer.prototype.initData = function(data)
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

    this.f = teka.new_array([this.B],0);
    this.c = teka.new_array([this.B],0);
    this.fa = teka.new_array([this.A],0);
    this.ca = teka.new_array([this.A],0);
    this.area_error = teka.new_array([this.A],false);
    this.auto = teka.new_array([this.B],false);

    if (this.node!==undefined) {
        this.moveToFirstQuadrant();
        this.addGraphData();
        this.calculateListsOfNextNeighbours();
    }
};

/** Initialize with puzzle in rectangular ascii art. */
teka.viewer.fillomino.FillominoViewer.prototype.initDataRectangle = function(data)
{
    var X = parseInt(data.get('X'),10);
    var Y = parseInt(data.get('Y'),10);
    var digits = data.get('digits');
    digits = digits===false?1:parseInt(data.get('digits'),10);
    this.asciiToData(data.get('puzzle'),X,Y,digits);
};

/** Read puzzle from rectangular ascii art. */
teka.viewer.fillomino.FillominoViewer.prototype.asciiToData = function(ascii, X, Y, d)
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
            if (grid[(d+1)*i][2*j]==teka.ord('+')) {
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
            this.edge[this.B] = {
                from:e[i+(X+1)*(Y-j)],
                to:e[i+1+(X+1)*(Y-j)],
                show:grid[(d+1)*i+d][2*j]==teka.ord('-')
            };
            this.B++;
        }
    }
    for (var i=0;i<=X;i++) {
        for (var j=0;j<Y;j++) {
            this.edge[this.B] = {
                from:e[i+(X+1)*(Y-j)],
                to:e[i+(X+1)*(Y-(j+1))],
                show:grid[(d+1)*i][2*j+1]==teka.ord('|')
            };
            this.B++;
        }
    }

    this.A = 0;
    this.area = [];

    for (var i=0;i<X;i++) {
        for (var j=0;j<Y;j++) {
            this.area[this.A] = {
                x:i+0.5,
                y:Y-(j+0.5),
                value:this.getNr(grid,(d+1)*i+1,2*j+1,d),
                style:0
            };
            this.A++;
        }
    }

    this.S = 0;
    this.style = [ [1,0,0,1,0,0] ];

    this.properties.push(teka.translate('fillomino_rectangular_size',[X+'x'+Y]));
};

//////////////////////////////////////////////////////////////////

/** Initialize with puzzle in graph format. */
teka.viewer.fillomino.FillominoViewer.prototype.initDataGraph = function(data)
{
    this.listToNode(data.get('node'));
    this.listToEdge(data.get('edge'));
    this.listToArea(data.get('area'));
    this.listToStyle(data.get('style'));
    this.properties.push(teka.translate('fillomino_graph_size',[this.A]));
};

/** Read nodes from list. */
teka.viewer.fillomino.FillominoViewer.prototype.listToNode = function(ascii)
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
teka.viewer.fillomino.FillominoViewer.prototype.listToEdge = function(ascii)
{
    if (ascii===false) {
        return;
    }
    var list = this.asciiToList(ascii);

    this.B = 0;
    this.edge = [];

    for (var i=0;i<list.length;i+=3) {
        this.edge[this.B] = {
            from:parseInt(list[i],10),
            to:parseInt(list[i+1],10),
            show:list[i+2]=='true'
        };
        this.B++;
    }
};

/** Read areas from list. */
teka.viewer.fillomino.FillominoViewer.prototype.listToArea = function(ascii, format2)
{
    if (ascii===false) {
        return;
    }
    var list = this.asciiToList(ascii);

    this.A = 0;
    this.area = [];
    this.solution = [];

    for (var i=0;i<list.length;i+=5) {
        this.area[this.A] = {
            x:parseFloat(list[i]),
            y:parseFloat(list[i+1]),
            value:parseInt(list[i+2],10),
            style:parseInt(list[i+3],10)
        };
        if (this.area[this.A].value===-1) {
            this.area[this.A].value = false;
        }
        this.solution[this.A] = parseInt(list[i+4],10);
        this.A++;
    }
};

/** Read digit style info from list. */
teka.viewer.fillomino.FillominoViewer.prototype.listToStyle = function(ascii)
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
teka.viewer.fillomino.FillominoViewer.prototype.moveToFirstQuadrant = function()
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
teka.viewer.fillomino.FillominoViewer.prototype.addGraphData = function()
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
teka.viewer.fillomino.FillominoViewer.prototype.findRightArea = function(b, forward)
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
teka.viewer.fillomino.FillominoViewer.prototype.getEdgelistToTheRight = function(b, forward)
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
teka.viewer.fillomino.FillominoViewer.prototype.getAngleFromEdgelist = function(bl)
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
teka.viewer.fillomino.FillominoViewer.prototype.getAngle = function(a,b,c)
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

/** Calculate the angle between the points x1,y1, x2,y2 and x3,y3 */
teka.viewer.fillomino.FillominoViewer.prototype.getAngleFromCoords = function(x1,y1,x2,y2,x3,y3)
{
    var la = teka.sqr(x1-x2)+teka.sqr(y1-y2);
    var lb = teka.sqr(x3-x2)+teka.sqr(y3-y2);
    var lc = teka.sqr(x1-x3)+teka.sqr(y1-y3);
    var h = (la+lb-lc)/(2*Math.sqrt(la*lb));
    if (h<-0.999999) {
        return Math.PI;
    }
    var w = Math.acos(h);

    var k = (x3-x1)*(y2-y1)-(y3-y1)*(x2-x1);

    if (k<0) {
        w=2*Math.PI-w;
    }
    return w;
};

/** Calculate the area, that is framed by the given el. */
teka.viewer.fillomino.FillominoViewer.prototype.getAreaFromNodelist = function(el)
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
teka.viewer.fillomino.FillominoViewer.prototype.inPoly = function(el,a)
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
teka.viewer.fillomino.FillominoViewer.prototype.getNodelistFromEdgelist = function(bl)
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
teka.viewer.fillomino.FillominoViewer.prototype.setAreaForEdgesInEdgelist = function(bl, a)
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
teka.viewer.fillomino.FillominoViewer.prototype.addEdgelistAndNodelistToArea = function(a, bl, el)
{
    this.area[a].edgelist = bl;
    this.area[a].nodelist = el;
};

/** Add solution. */
teka.viewer.fillomino.FillominoViewer.prototype.addSolution = function()
{
    for (var i=0;i<this.A;i++) {
        this.fa[i] = this.solution[i];
    }
    this.addSomeStrokes();
};

//////////////////////////////////////////////////////////////////

/**
 * Calculates for every area a list of points to form a cursor for this list.
 */
teka.viewer.fillomino.FillominoViewer.prototype.calculateCursorlists = function()
{
    for (var i=0;i<this.A;i++) {
        this.area[i].cursorlist = this.getCursorlistFromEdgelist(this.area[i].edgelist);
    }
};

/**
 * Calculates a list of points from an ordered list of edges to form a polygon,
 * that is 4.5 pixel inside of the original polygon.
 */
teka.viewer.fillomino.FillominoViewer.prototype.getCursorlistFromEdgelist = function(el)
{
    var cl = [];

    for (var k=0;k<el.length;k++) {
        var node1 = this.node[this.edge[el[k].nr].from];
        var node2 = this.node[this.edge[el[k].nr].to];
        if (!el[k].forward) {
            var tmp = node1;
            node1 = node2;
            node2 = tmp;
        }

        var x1 = node1.x*this.scale;
        var y1 = node1.y*this.scale;
        var x2 = node2.x*this.scale;
        var y2 = node2.y*this.scale;
        var d = Math.sqrt(teka.sqr(x1-x2)+teka.sqr(y1-y2))/4.5;

        cl.push({
            x1: x1+(y2-y1)/d,
            y1: y1-(x2-x1)/d,
            x2: x2+(y2-y1)/d,
            y2: y2-(x2-x1)/d
        });
    }

    cl.push(cl[0]);

    var nl = [];
    for (var k=0;k<el.length;k++) {
        nl.push(this.intersectionPoint(cl[k],cl[k+1]));
    }

    return nl;
};

/**
 * Calculate the intersection point of two lines given by two points.
 */
teka.viewer.fillomino.FillominoViewer.prototype.intersectionPoint = function(g1,g2)
{
    var nenner = (g2.y2-g2.y1)*(g1.x2-g1.x1)-(g1.y2-g1.y1)*(g2.x2-g2.x1);
    if (nenner===0) {
        return false;
    }

    var xs = ((g2.x2-g2.x1)*(g1.x2*g1.y1-g1.x1*g1.y2)-(g1.x2-g1.x1)*(g2.x2*g2.y1-g2.x1*g2.y2))/nenner;
    var ys = ((g1.y1-g1.y2)*(g2.x2*g2.y1-g2.x1*g2.y2)-(g2.y1-g2.y2)*(g1.x2*g1.y1-g1.x1*g1.y2))/nenner;
    return {x:xs,y:ys};
};

teka.viewer.fillomino.FillominoViewer.prototype.calculateListsOfNextNeighbours = function()
{
    this.calculateListsOfNextEdgeNeighbours();
    this.calculateListsOfNextAreaNeighbours();
};

/**
 * For use with keys: For every edge the edges, that can be considered to
 * be left, right, top and bottom, are calculated and saved in lists.
 */
teka.viewer.fillomino.FillominoViewer.prototype.calculateListsOfNextAreaNeighbours = function()
{
    var l = teka.new_array([this.A],0);
    var r = teka.new_array([this.A],0);
    var t = teka.new_array([this.A],0);
    var b = teka.new_array([this.A],0);

    for (var i=0;i<this.A;i++) {
        var lc = 0;
        var rc = 0;
        var tc = 0;
        var bc = 0;

        if (this.area[i].edgelist===false) {
            continue;
        }

        for (var j=0;j<this.area[i].edgelist.length;j++) {
            var lh = this.edge[this.area[i].edgelist[j].nr].l_area;
            if (lh!==false && lh!=i) {
                var dx = this.area[i].x-this.area[lh].x;
                var dy = this.area[i].y-this.area[lh].y;

                if (Math.abs(dx)<Math.abs(dy)) {
                    if (dy<0) {
                        b[bc++] = lh;
                    } else {
                        t[tc++] = lh;
                    }
                } else {
                    if (dx<0) {
                        r[rc++] = lh;
                    } else {
                        l[lc++] = lh;
                    }
                }
            }
            var rh = this.edge[this.area[i].edgelist[j].nr].r_area;
            if (rh!==false && rh!=i) {
                var dx = this.area[i].x-this.area[rh].x;
                var dy = this.area[i].y-this.area[rh].y;

                if (Math.abs(dx)<Math.abs(dy)) {
                    if (dy<0) {
                        b[bc++] = rh;
                    } else {
                        t[tc++] = rh;
                    }
                } else {
                    if (dx<0) {
                        r[rc++] = rh;
                    } else {
                        l[lc++] = rh;
                    }
                }
            }
        }

        this.area[i].left = [];
        this.area[i].right = [];
        this.area[i].top = [];
        this.area[i].bottom = [];
        for (var k=0;k<lc;k++) {
            this.area[i].left.push(l[k]);
        }
        for (var k=0;k<rc;k++) {
            this.area[i].right.push(r[k]);
        }
        for (var k=0;k<tc;k++) {
            this.area[i].top.push(t[k]);
        }
        for (var k=0;k<bc;k++) {
            this.area[i].bottom.push(b[k]);
        }
    }
};

/**
 * For use with keys: For every edge the edges, that can be considered to
 * be left, right, top and bottom, are calculated and saved in lists.
 */
teka.viewer.fillomino.FillominoViewer.prototype.calculateListsOfNextEdgeNeighbours = function()
{
    var nb = teka.new_array([this.B],false);

    var l = teka.new_array([this.B],0);
    var r = teka.new_array([this.B],0);
    var t = teka.new_array([this.B],0);
    var b = teka.new_array([this.B],0);
    var la = teka.new_array([this.B],0);
    var ra = teka.new_array([this.B],0);
    var ta = teka.new_array([this.B],0);
    var ba = teka.new_array([this.B],0);

    for (var i=0;i<this.B;i++) {
        var e1 = this.edge[i].from;
        var e2 = this.edge[i].to;
        for (var j=0;j<this.B;j++) {
            nb[j] = this.edge[j].from==e1 || this.edge[j].from==e2
                || this.edge[j].to==e1 || this.edge[j].to==e2;
        }

        if (this.edge[i].l_area!==false) {
            for (var k=0;k<this.area[this.edge[i].l_area].edgelist.length;k++) {
                nb[this.area[this.edge[i].l_area].edgelist[k].nr] = true;
            }
        }
        if (this.edge[i].r_area!==false) {
            for (var k=0;k<this.area[this.edge[i].r_area].edgelist.length;k++) {
                nb[this.area[this.edge[i].r_area].edgelist[k].nr] = true;
            }
        }

        nb[i] = false;

        var xm = (this.node[e1].x+this.node[e2].x)/2;
        var ym = (this.node[e1].y+this.node[e2].y)/2;

        var lc = 0;
        var rc = 0;
        var tc = 0;
        var bc = 0;

        for (var j=0;j<this.B;j++) {
            if (nb[j]) {
                var xm2 = (this.node[this.edge[j].from].x+this.node[this.edge[j].to].x)/2;
                var ym2 = (this.node[this.edge[j].from].y+this.node[this.edge[j].to].y)/2;
                var dx = xm-xm2;
                var dy = ym-ym2;

                if (Math.abs(dx)<=Math.abs(dy)) {
                    if (dy<0) {
                        b[bc] = j;
                        ba[bc] = this.getAngleFromCoords(xm,ym2,xm,ym,xm2,ym2);
                        bc++;
                    } else {
                        t[tc] = j;
                        ta[tc] = this.getAngleFromCoords(xm,ym2,xm,ym,xm2,ym2);
                        tc++;
                    }
                }
                if (Math.abs(dx)>=Math.abs(dy)) {
                    if (dx<=0) {
                        r[rc] = j;
                        ra[rc] = this.getAngleFromCoords(xm2,ym,xm,ym,xm2,ym2);
                        rc++;
                    } else {
                        l[lc] = j;
                        la[lc] = this.getAngleFromCoords(xm2,ym,xm,ym,xm2,ym2);
                        lc++;
                    }
                }
            }
        }

        this.edge[i].left = [];
        this.edge[i].right = [];
        this.edge[i].top = [];
        this.edge[i].bottom = [];
        for (var k=0;k<lc;k++) {
            this.edge[i].left.push(l[k]);
        }
        for (var k=0;k<rc;k++) {
            this.edge[i].right.push(r[k]);
        }
        for (var k=0;k<tc;k++) {
            this.edge[i].top.push(t[k]);
        }
        for (var k=0;k<bc;k++) {
            this.edge[i].bottom.push(b[k]);
        }

        this.sortNeighbours(this.edge[i].left,la,lc);
        this.sortNeighbours(this.edge[i].right,ra,rc);
        this.sortNeighbours(this.edge[i].top,ta,tc);
        this.sortNeighbours(this.edge[i].bottom,ba,bc);
    }
};

/** Sort list of neighbours */
teka.viewer.fillomino.FillominoViewer.prototype.sortNeighbours = function(a, sa, max)
{
    for (var i=0;i<max-1;i++) {
        var min = sa[i];
        var minpos = i;
        for (var j=i+1;j<max;j++) {
            if (sa[j]<min) {
                min = sa[j];
                minpos = j;
            }
        }

        if (minpos!=i) {
            var hlp = a[i];
            a[i] = a[minpos];
            a[minpos] = hlp;
            var hlp2 = sa[i];
            sa[i] = sa[minpos];
            sa[minpos] = hlp2;
        }
    }
};

//////////////////////////////////////////////////////////////////

/** Returns a small example. */
teka.viewer.fillomino.FillominoViewer.prototype.getExample = function()
{
    return '/format 2\n/type (fillomino)\n/sol false\n'
        +'/node [ [ 0 0 ] [ 1 0 ] [ 2 0 ] [ 3 0 ] [ 4 0 ] [ 0 1 ] [ 1 1 ] '
        +'[ 2 1 ] [ 3 1 ] [ 4 1 ] [ 0 2 ] [ 1 2 ] [ 2 2 ] [ 3 2 ] [ 4 2 ] '
        +'[ 0 3 ] [ 1 3 ] [ 2 3 ] [ 3 3 ] [ 4 3 ] [ 0 4 ] [ 1 4 ] [ 2 4 ] '
        +'[ 3 4 ] [ 4 4 ] ]\n/edge [ '
        +'[ 0 1 false ] [ 1 2 false ] [ 2 3 false ] [ 3 4 false ] '
        +'[ 5 6 false ] [ 6 7 false ] [ 7 8 false ] [ 8 9 false ] '
        +'[ 10 11 false ] [ 11 12 false ] [ 12 13 false ] [ 13 14 false ] '
        +'[ 15 16 false ] [ 16 17 false ] [ 17 18 false ] [ 18 19 false ] '
        +'[ 20 21 false ] [ 21 22 false ] [ 22 23 false ] [ 23 24 false ] '
        +'[ 0 5 false ] [ 5 10 false ] [ 10 15 false ] [ 15 20 false ] '
        +'[ 1 6 false ] [ 6 11 false ] [ 11 16 false ] [ 16 21 false ] '
        +'[ 2 7 false ] [ 7 12 false ] [ 12 17 false ] [ 17 22 false ] '
        +'[ 3 8 false ] [ 8 13 false ] [ 13 18 false ] [ 18 23 false ] '
        +'[ 4 9 false ] [ 9 14 false ] [ 14 19 false ] [ 19 24 false ] ]\n'
        +'/area [ [ 0.5 0.5 -1 0 2 ] [ 1.5 0.5 1 0 1 ] [ 2.5 0.5 -1 0 2 ] '
        +'[ 3.5 0.5 -1 0 2 ] [ 0.5 1.5 -1 0 2 ] [ 1.5 1.5 3 0 3 ] [ 2.5 1.5 -1 0 3 ] '
        +'[ 3.5 1.5 1 0 1 ] [ 0.5 2.5 4 0 4 ] [ 1.5 2.5 1 0 1 ] [ 2.5 2.5 3 0 3 ] '
        +'[ 3.5 2.5 -1 0 2 ] [ 0.5 3.5 -1 0 4 ] [ 1.5 3.5 -1 0 4 ] [ 2.5 3.5 -1 0 4 ] '
        +'[ 3.5 3.5 -1 0 2 ] ]\n/style [ [ 1 0 0 1 0 0 ] ]';
};

/** Returns a list of automatically generated properties. */
teka.viewer.fillomino.FillominoViewer.prototype.getProperties = function()
{
    return this.properties;
};

//////////////////////////////////////////////////////////////////

/** Reset the whole diagram. */
teka.viewer.fillomino.FillominoViewer.prototype.reset = function()
{
    for (var i=0;i<this.B;i++) {
        this.f[i] = teka.viewer.fillomino.Defaults.NONE;
        this.c[i] = 0;
    }
    for (var i=0;i<this.A;i++) {
        this.fa[i] = 0;
        this.ca[i] = 0;
    }
    this.addSomeStrokes();
};

/** Reset the error marks. */
teka.viewer.fillomino.FillominoViewer.prototype.clearError = function()
{
    for (var i=0;i<this.A;i++) {
        this.area_error[i] = false;
    }
};

/** Copy digits colored with this.color to color. */
teka.viewer.fillomino.FillominoViewer.prototype.copyColor = function(color)
{
    for (var i=0;i<this.B;i++) {
        if (this.c[i]==this.color) {
            this.c[i] = color;
        }
    }
    for (var i=0;i<this.A;i++) {
        if (this.ca[i]==this.color) {
            this.ca[i] = color;
        }
    }
    this.addSomeStrokes();
};

/** Delete all digits with color. */
teka.viewer.fillomino.FillominoViewer.prototype.clearColor = function(color)
{
    for (var i=0;i<this.B;i++) {
        if (this.c[i]==color) {
            this.f[i] = 0;
            this.c[i] = 0;
        }
    }
    for (var i=0;i<this.A;i++) {
        if (this.ca[i]==color) {
            this.fa[i] = 0;
            this.ca[i] = 0;
        }
    }
    this.addSomeStrokes();
};

/** Save current state. */
teka.viewer.fillomino.FillominoViewer.prototype.saveState = function()
{
    var f = teka.new_array([this.B],0);
    var c = teka.new_array([this.B],0);
    for (var i=0;i<this.B;i++) {
        f[i] = this.f[i];
        c[i] = this.c[i];
    }

    var fa = teka.new_array([this.A],0);
    var ca = teka.new_array([this.A],0);
    for (var i=0;i<this.A;i++) {
        fa[i] = this.fa[i];
        ca[i] = this.ca[i];
    }

    return { f:f, c:c, fa:fa, ca:ca };
};

/** Load state. */
teka.viewer.fillomino.FillominoViewer.prototype.loadState = function(state)
{
    for (var i=0;i<this.B;i++) {
        this.f[i] = state.f[i];
        this.c[i] = state.c[i];
    }
    for (var i=0;i<this.A;i++) {
        this.fa[i] = state.fa[i];
        this.ca[i] = state.ca[i];
    }
    this.addSomeStrokes();
};

//////////////////////////////////////////////////////////////////

/** Check, if the solution is correct. */
teka.viewer.fillomino.FillominoViewer.prototype.check = function()
{
    // Copy borders to array bcheck
    var bcheck = teka.new_array([this.B],0);
    for (var i=0;i<this.B;i++) {
        if (this.edge[i].show===true
            || (this.auto[i] && this.f[i]===0)
            || this.f[i]==teka.viewer.fillomino.Defaults.SET) {
            bcheck[i] = teka.viewer.fillomino.Defaults.SET;
        }
    }

    // Copy areas to array check
    var check = teka.new_array([this.A],0);
    for (var i=0;i<this.A;i++) {
        if (this.area[i].value!==false) {
            check[i] = this.area[i].value;
            continue;
        }
        if (this.fa[i]>=100) {
            var a = (this.fa[i]-100)%100;
            var b = Math.floor((this.fa[i]-100)/100);
            if (a===0 && b===0) {
                continue;
            }
            if (a===0) {
                a=1;
            }
            if (b===0 || a!=b) {
                this.area_error[i] = true;
                return 'fillomino_not_unique';
            }
            check[i] = a;
            continue;
        }
        if (this.fa[i]>0) {
            check[i] = this.fa[i];
            continue;
        }
    }

    // Try to get a value for empty cells
    for (var i=0;i<this.A;i++) {
        if (check[i]>0) {
            continue;
        }

        var mark = teka.new_array([this.A],false);

        var erg = this.findSize(mark,i,check, bcheck);

        var gut = true;
        for (var k=0;k<this.A;k++) {
            if (mark[k]===true && check[k]>0) {
                if (gut===true || gut===check[k]) {
                    gut = check[k];
                } else {
                    gut = false;
                }
            }
        }

        if (gut===false) {
            for (var k=0;k<this.A;k++) {
                if (mark[k]===true && check[k]===0) {
                    this.area_error[k] = true;
                }
            }
            return 'fillomino_ambiguous';
        }

        if (gut!==true) {
            erg = gut;
        }

        for (var k=0;k<this.A;k++) {
            if (mark[k]===true && check[k]===0) {
                check[k] = erg;
            }
        }
    }

    // check, if all sizes of the areas are correct
    var c = 0;
    var mark = teka.new_array([this.A],0);
    for (var i=0;i<this.A;i++) {
        if (mark[i]===0) {
            c++;
            var az = this.countArea(mark,i,check[i],c,check);
            if (az!=check[i]) {
                for (var k=0;k<this.A;k++) {
                    if (mark[k]==c) {
                        this.area_error[k] = true;
                    }
                }
                return 'fillomino_area_wrong_size';
            }
        }
    }

    // check, if areas of same size touch
    for (var i=0;i<this.B;i++) {
        if (this.edge[i].show===true) {
            if (this.edge[i].l_area!==false && this.edge[i].r_area!==false &&
                check[this.edge[i].l_area]==check[this.edge[i].r_area]) {
                this.area_error[this.edge[i].l_area] = true;
                this.area_error[this.edge[i].r_area] = true;
                return 'fillomino_edge_between_same';
            }
        }
    }

    return true;
};

/** Calculate recursively the size of an area. */
teka.viewer.fillomino.FillominoViewer.prototype.countArea = function(mark, nr, val, c, check)
{
    if (mark[nr]!==0) {
        return 0;
    }
    if (check[nr]!==val) {
        return 0;
    }

    mark[nr] = c;

    var az = 1;
    for (var i=0;i<this.area[nr].edgelist.length;i++) {
        var j = this.area[nr].edgelist[i].nr;
        if (this.edge[j].l_area!==false && this.edge[j].l_area!==nr) {
            az += this.countArea(mark,this.edge[j].l_area,val,c,check);
        }
        if (this.edge[j].r_area!==false && this.edge[j].r_area!==nr) {
            az += this.countArea(mark,this.edge[j].r_area,val,c,check);
        }
    }

    return az;
};

/** Try to findout the intended size of an area containing an empty cell. */
teka.viewer.fillomino.FillominoViewer.prototype.findSize = function(mark, nr, check, bcheck)
{
    if (mark[nr]!==false) {
        return 0;
    }

    mark[nr] = true;

    if (check[nr]!==0) {
        return 0;
    }

    var az = 1;
    for (var i=0;i<this.area[nr].edgelist.length;i++) {
        var j = this.area[nr].edgelist[i].nr;
        if (bcheck[j]==teka.viewer.fillomino.Defaults.SET) {
            continue;
        }
        if (this.edge[j].l_area!==false && this.edge[j].l_area!==nr) {
            az += this.findSize(mark,this.edge[j].l_area,check,bcheck);
        }
        if (this.edge[j].r_area!==false && this.edge[j].r_area!==nr) {
            az += this.findSize(mark,this.edge[j].r_area,check,bcheck);
        }
    }

    return az;
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
teka.viewer.fillomino.FillominoViewer.prototype.setMetrics = function(g)
{
    this.scale = Math.floor(Math.min((this.width-17)/this.MAXX,(this.height-17)/this.MAXY));
    var realwidth = this.MAXX*this.scale+17;
    var realheight = this.MAXY*this.scale+17;

    this.deltaX = Math.floor((this.width-realwidth)/2)+0.5;
    this.deltaY = Math.floor((this.height-realheight)/2)+0.5;
    this.edgeX = 8;
    this.edgeY = 8;

    this.font = teka.getFontData(Math.round(this.scale/2)+'px sans-serif',this.scale);
    this.mediumfont = teka.getFontData(Math.round(this.scale/3)+'px sans-serif',this.scale);

    this.calculateCursorlists();

    if (realwidth>this.width || realheight>this.height) {
        this.scale=false;
    }
    return {width:realwidth,height:realheight,scale:this.scale};
};

/** Paints the diagram. */
teka.viewer.fillomino.FillominoViewer.prototype.paint = function(g)
{
    var S = this.scale;

    g.save();
    g.translate(this.deltaX+this.edgeX,this.deltaY+this.edgeY);

    // paint background
    for (var i=0;i<this.A;i++) {
        if (this.area[i].nodelist!==false) {
            g.fillStyle = this.isBlinking()?
                this.getBlinkColor(Math.floor(this.area[i].x),Math.floor(this.area[i].y),this.A,this.fa[i]):
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
    g.strokeStyle = '#000';
    for (var i=0;i<this.B;i++) {
        teka.drawLine(g,
                      this.node[this.edge[i].from].x*S,
                      this.node[this.edge[i].from].y*S,
                      this.node[this.edge[i].to].x*S,
                      this.node[this.edge[i].to].y*S);
    }

    // paint areas
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillStyle = '#000';
    for (var i=0;i<this.A;i++) {
        if (this.area[i].value!==false) {
            g.save();
            var h = this.style[this.area[i].style];
            g.translate(this.area[i].x*S,this.area[i].y*S);
            g.transform(h[0],h[1],h[2],h[3],h[4],h[5]);
            g.font = this.font.font;
            g.fillText(this.area[i].value,0,this.font.delta);
            g.restore();
            continue;
        }

        if (this.fa[i]>=100) {
            var a = (this.fa[i]-100)%100;
            var b = Math.floor((this.fa[i]-100)/100);
            var tmp = (a===0?'?':a)+'-'+(b===0?'?':b);

            g.fillStyle = this.getColorString(this.ca[i]);
            g.font = this.mediumfont.font;
            g.save();
            var h = this.style[this.area[i].style];
            g.translate(this.area[i].x*S,this.area[i].y*S);
            g.transform(h[0],h[1],h[2],h[3],h[4],h[5]);
            g.fillText(tmp,0,this.font.delta);
            g.restore();
            continue;
        }

        if (this.fa[i]>0) {
            g.save();
            g.fillStyle = this.getColorString(this.ca[i]);
            var h = this.style[this.area[i].style];
            g.translate(this.area[i].x*S,this.area[i].y*S);
            g.transform(h[0],h[1],h[2],h[3],h[4],h[5]);
            g.font = this.font.font;
            g.fillText(this.fa[i],0,this.font.delta);
            g.restore();
        }
    }

    // paint edges
    for (var i=0;i<this.B;i++) {
        if (this.edge[i].show===true
            || (this.auto[i] && this.f[i]===0)) {
            g.strokeStyle = this.edge[i].show===true?'#000':'#888';
            g.lineWidth = 5;
            g.lineCap = 'round';
            teka.drawLine(g,
                          this.node[this.edge[i].from].x*S,
                          this.node[this.edge[i].from].y*S,
                          this.node[this.edge[i].to].x*S,
                          this.node[this.edge[i].to].y*S);
            g.lineCap = 'butt';
            g.lineWidth = 1;
            continue;
        }

        g.strokeStyle = this.getColorString(this.c[i]);
        if (this.f[i]==teka.viewer.fillomino.Defaults.SET) {
            g.lineWidth = 5;
            g.lineCap = 'round';
            teka.drawLine(g,
                          this.node[this.edge[i].from].x*S,
                          this.node[this.edge[i].from].y*S,
                          this.node[this.edge[i].to].x*S,
                          this.node[this.edge[i].to].y*S);
            g.lineCap = 'butt';
            g.lineWidth = 1;
        }

        if (this.f[i]==teka.viewer.fillomino.Defaults.EMPTY) {
            var x = (this.node[this.edge[i].from].x+this.node[this.edge[i].to].x)/2*S;
            var y = (this.node[this.edge[i].from].y+this.node[this.edge[i].to].y)/2*S;

            g.lineWidth = 2;
            teka.drawLine(g,x-3,y-3,x+3,y+3);
            teka.drawLine(g,x-3,y+3,x+3,y-3);
            g.lineWidth = 1;
        }
    }

    // paint the cursor
    if (this.mode==teka.viewer.Defaults.NORMAL) {
        if (this.cursor.edge===true && this.cursor.nr!==false) {
            g.strokeStyle = '#f00';
            g.lineWidth = 3;
            teka.drawLine(g,
                          this.node[this.edge[this.cursor.nr].from].x*S,
                          this.node[this.edge[this.cursor.nr].from].y*S,
                          this.node[this.edge[this.cursor.nr].to].x*S,
                          this.node[this.edge[this.cursor.nr].to].y*S);
            g.lineWidth = 1;
        }
        if (this.cursor.edge===false && this.cursor.nr!==false) {
            g.strokeStyle = '#f00';
            g.lineWidth = 2;
            g.beginPath();
            g.moveTo(this.area[this.cursor.nr].cursorlist[0].x,
                     this.area[this.cursor.nr].cursorlist[0].y);
            for (var k=1;k<this.area[this.cursor.nr].cursorlist.length;k++) {
                g.lineTo(this.area[this.cursor.nr].cursorlist[k].x,
                         this.area[this.cursor.nr].cursorlist[k].y);
            }
            g.closePath();
            g.stroke();
            g.lineWidth = 1;
        }
    }

    if (this.list!==false) {
        g.strokeStyle = '#f00';
        if (this.cursor.edge===true) {
            for (var i=0;i<this.list.length;i++) {
                if (this.list[i]!=this.cursor.nr) {
                    teka.drawLine(g,
                                  this.node[this.edge[this.list[i]].from].x*S,
                                  this.node[this.edge[this.list[i]].from].y*S,
                                  this.node[this.edge[this.list[i]].to].x*S,
                                  this.node[this.edge[this.list[i]].to].y*S);
                }
            }
        } else {
            for (var i=0;i<this.list.length;i++) {
                if (this.list[i]!=this.cursor.nr) {
                    g.beginPath();
                    g.moveTo(this.area[this.list[i]].cursorlist[0].x,
                             this.area[this.list[i]].cursorlist[0].y);
                    for (var k=1;k<this.area[this.list[i]].cursorlist.length;k++) {
                        g.lineTo(this.area[this.list[i]].cursorlist[k].x,
                                 this.area[this.list[i]].cursorlist[k].y);
                    }
                    g.closePath();
                    g.stroke();
                }
            }
        }
    }

    g.restore();
};

//////////////////////////////////////////////////////////////////

/** Handles mousemove event. */
teka.viewer.fillomino.FillominoViewer.prototype.processMousemoveEvent = function(xc, yc, pressed)
{
    this.list = false;

    xc = xc-this.deltaX-this.edgeX;
    yc = yc-this.deltaY-this.edgeY;

    var oldcursor = this.cursor;

    this.cursor = {edge:true, nr:this.getEdge(xc/this.scale,yc/this.scale)};
    if (this.cursor.nr===false || this.start!==false) {
        this.cursor = {edge:false, nr:this.getArea(xc/this.scale,yc/this.scale)};
    }

    if (this.cursor.nr===false) {
        this.cursor = oldcursor;
    }

    if (this.start!=this.cursor.nr) {
        this.moved = true;
    }

    if (pressed && this.cursor.edge===false) {
        this.processMousedraggedEvent(xc,yc);
        return true;
    }

    return this.cursor.nr!=oldcursor.nr || this.cursor.edge!=oldcursor.edge;
};

/** Handles mousedown event. */
teka.viewer.fillomino.FillominoViewer.prototype.processMousedownEvent = function(xc, yc)
{
    var erg = this.processMousemoveEvent(xc,yc);

    if (this.cursor.nr===false) {
        return erg;
    }

    if (this.cursor.edge===true) {
        this.set(this.cursor.nr,(this.f[this.cursor.nr]+1)%3);
        this.addSomeStrokes();
    } else {
        this.start = this.cursor.nr;
        this.moved = false;
    }

    return true;
};

/** Handles mouseup event. */
teka.viewer.fillomino.FillominoViewer.prototype.processMouseupEvent = function(xc, yc)
{
    this.processMousemoveEvent(xc,yc);

    if (this.cursor.edge===true) {
        return false;
    }

    if (!this.moved) {
        this.setArea(this.cursor.nr,(this.fa[this.cursor.nr]+1)%100);
        this.addSomeStrokes();
    }

    this.start = false;

    return true;
};

/**
 * Handles pseudo event 'mousedragged'
 * Horizontal and vertical lines are treated separately, as
 * much faster algorithms can be applied and they should make up the
 * majority of use cases.
 */
teka.viewer.fillomino.FillominoViewer.prototype.processMousedraggedEvent = function(xc, yc)
{
    if (this.start===false) {
        this.start = this.cursor.nr;
        this.moved = false;
        return;
    }

    var last = this.start;
    this.start = this.cursor.nr;

    this.setArea(this.cursor.nr,this.area[last].value>0
                    ?this.area[last].value
                    :this.fa[last]);
    this.addSomeStrokes();
};

/** Handles keydown event. */
teka.viewer.fillomino.FillominoViewer.prototype.processKeydownEvent = function(e)
{
    if (this.cursor.edge===true) {
        if (e.key==teka.KEY_ESCAPE && this.list!==false && this.list.length>0) {
            this.selected = (this.selected+1)%this.list.length;
            this.cursor.nr = this.list[this.selected];
            return true;
        }

        this.list = false;
        this.selected = 0;

        if (e.key==teka.KEY_DOWN && this.edge[this.cursor.nr].bottom.length>0) {
            this.list = this.edge[this.cursor.nr].bottom;
            this.cursor.nr = this.edge[this.cursor.nr].bottom[0];
            return true;
        }
        if (e.key==teka.KEY_UP && this.edge[this.cursor.nr].top.length>0) {
            this.list = this.edge[this.cursor.nr].top;
            this.cursor.nr = this.edge[this.cursor.nr].top[0];
            return true;
        }
        if (e.key==teka.KEY_LEFT && this.edge[this.cursor.nr].left.length>0) {
            this.list = this.edge[this.cursor.nr].left;
            this.cursor.nr = this.edge[this.cursor.nr].left[0];
            return true;
        }
        if (e.key==teka.KEY_RIGHT && this.edge[this.cursor.nr].right.length>0) {
            this.list = this.edge[this.cursor.nr].right;
            this.cursor.nr = this.edge[this.cursor.nr].right[0];
            return true;
        }

        if (e.key==teka.KEY_ESCAPE ||
            e.key==teka.KEY_DOWN ||
            e.key==teka.KEY_UP ||
            e.key==teka.KEY_LEFT ||
            e.key==teka.KEY_RIGHT) {
            return true;
        }

        if (e.key==teka.KEY_HASH || e.key==teka.KEY_Q || e.key==teka.KEY_STAR) {
            this.set(this.cursor.nr,teka.viewer.fillomino.Defaults.SET);
            this.addSomeStrokes();
            return true;
        }

        if (e.key==teka.KEY_MINUS || e.key==teka.KEY_W) {
            this.set(this.cursor.nr,teka.viewer.fillomino.Defaults.EMPTY);
            this.addSomeStrokes();
            return true;
        }

        if (e.key==teka.KEY_SPACE) {
            this.set(this.cursor.nr,0);
            this.addSomeStrokes();
            return true;
        }
    }

    if (this.cursor.edge===false) {
        if (e.key==teka.KEY_ESCAPE && this.list!==false && this.list.length>0) {
            if (e.shift) {
                var tmp = this.fa[this.list[this.selected]];
                this.setArea(this.list[this.selected],this.old);
                this.old = this.fa[this.list[(this.selected+1)%this.list.length]];
                this.setArea(this.list[(this.selected+1)%this.list.length],tmp);
                this.addSomeStrokes();
            }
            this.selected = (this.selected+1)%this.list.length;
            this.cursor.nr = this.list[this.selected];
            return true;
        }

        this.list = false;
        this.selected = 0;

        if (e.key==teka.KEY_DOWN && this.area[this.cursor.nr].bottom.length>0) {
            if (e.shift) {
                this.old = this.fa[this.area[this.cursor.nr].bottom[0]];
                this.setArea(this.area[this.cursor.nr].bottom[0],
                    this.area[this.cursor.nr].value>0
                    ?this.area[this.cursor.nr].value
                    :this.fa[this.cursor.nr]);
                this.addSomeStrokes();
            }
            this.list = this.area[this.cursor.nr].bottom;
            this.cursor.nr = this.area[this.cursor.nr].bottom[0];
            return true;
        }
        if (e.key==teka.KEY_UP && this.area[this.cursor.nr].top.length>0) {
            if (e.shift) {
                this.old = this.fa[this.area[this.cursor.nr].top[0]];
                this.setArea(this.area[this.cursor.nr].top[0],
                    this.area[this.cursor.nr].value>0
                    ?this.area[this.cursor.nr].value
                    :this.fa[this.cursor.nr]);
                this.addSomeStrokes();
            }
            this.list = this.area[this.cursor.nr].top;
            this.cursor.nr = this.area[this.cursor.nr].top[0];
            return true;
        }
        if (e.key==teka.KEY_LEFT && this.area[this.cursor.nr].left.length>0) {
            if (e.shift) {
                this.old = this.fa[this.area[this.cursor.nr].left[0]];
                this.setArea(this.area[this.cursor.nr].left[0],
                    this.area[this.cursor.nr].value>0
                    ?this.area[this.cursor.nr].value
                    :this.fa[this.cursor.nr]);
                this.addSomeStrokes();
            }
            this.list = this.area[this.cursor.nr].left;
            this.cursor.nr = this.area[this.cursor.nr].left[0];
            return true;
        }
        if (e.key==teka.KEY_RIGHT && this.area[this.cursor.nr].right.length>0) {
            if (e.shift) {
                this.old = this.fa[this.area[this.cursor.nr].right[0]];
                this.setArea(this.area[this.cursor.nr].right[0],
                    this.area[this.cursor.nr].value>0
                    ?this.area[this.cursor.nr].value
                    :this.fa[this.cursor.nr]);
                this.addSomeStrokes();
            }
            this.list = this.area[this.cursor.nr].right;
            this.cursor.nr = this.area[this.cursor.nr].right[0];
            return true;
        }

        if (e.key==teka.KEY_ESCAPE ||
            e.key==teka.KEY_DOWN ||
            e.key==teka.KEY_UP ||
            e.key==teka.KEY_LEFT ||
            e.key==teka.KEY_RIGHT) {
            return true;
        }

        if (e.key==teka.KEY_SPACE) {
            this.setArea(this.cursor.nr,0);
            this.addSomeStrokes();
            return true;
        }

        if (e.key>=teka.KEY_0 && e.key<=teka.KEY_9) {
            var val = e.key-teka.KEY_0;
            if (this.fa[this.cursor.nr]>0 && this.fa[this.cursor.nr]<=9) {
                this.setArea(this.cursor.nr,this.fa[this.cursor.nr]*10+val);
            } else if (this.fa[this.cursor.nr]>=100) {
                var a = (this.fa[this.cursor.nr]-100)%100;
                var b = Math.floor((this.fa[this.cursor.nr]-100)/100);
                if (b===0) {
                    this.setArea(this.cursor.nr,this.fa[this.cursor.nr]+100*val);
                } else if (b<10) {
                    this.setArea(this.cursor.nr,100+a+100*(10*b+val));
                } else {
                    this.setArea(this.cursor.nr,val);
                }
            } else if (e.key!=teka.KEY_0) {
                this.setArea(this.cursor.nr,val);
            }
            this.addSomeStrokes();
            return true;
        }

        if (e.key==teka.KEY_MINUS) {
            if (this.fa[this.cursor.nr]<100 && this.fa[this.cursor.nr]>=0) {
                this.setArea(this.cursor.nr,100+this.fa[this.cursor.nr]);
            } else {
                this.setArea(this.cursor.nr,100);
            }
            return true;
        }
    }

    return false;
};

//////////////////////////////////////////////////////////////////

/** Sets the value of an edge, if the color fits. */
teka.viewer.fillomino.FillominoViewer.prototype.set = function(k, value)
{
    if (this.f[k]!=0 && this.c[k]!=this.color) {
        return;
    }

    this.f[k] = value;
    this.c[k] = this.color;
};

/** Sets the value of an area, if the color fits. */
teka.viewer.fillomino.FillominoViewer.prototype.setArea = function(k, value)
{
    if (this.fa[k]!=0 && this.ca[k]!=this.color) {
        return;
    }

    this.fa[k] = value;
    this.ca[k] = this.color;
};

/**
 * Searches the edge, that is next to point x,y. Returns false,
 * if all edges are too far.
 */
teka.viewer.fillomino.FillominoViewer.prototype.getEdge = function(x, y)
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

        if (d*this.scale>1 && 64*d>1) {
            continue;
        }

        if (d>mindist) {
            continue;
        }

        minpos = i;
        mindist = d;
    }

    return minpos;
};

/**
 * Searches the area, where point x,y is inside. Returns false,
 * if non exists.
 */
teka.viewer.fillomino.FillominoViewer.prototype.getArea = function(x, y)
{
    for (var i=0;i<this.A;i++) {
        if (this.inPoly(this.area[i].nodelist,{x:x,y:y})) {
            return i;
        }
    }
    return false;
};

/** Add strokes at the edge, as well as between areas with different numbers. */
teka.viewer.fillomino.FillominoViewer.prototype.addSomeStrokes = function()
{
    for (var i=0;i<this.B;i++) {
        if (this.edge[i].l_area===false || this.edge[i].r_area===false) {
            this.f[i] = teka.viewer.fillomino.Defaults.SET;
            this.c[i] = 0;
            continue;
        }
        this.auto[i] = false;

        var a = this.area[this.edge[i].l_area].value;
        if (a===false) {
            a = this.fa[this.edge[i].l_area];
        }
        var b = this.area[this.edge[i].r_area].value;
        if (b===false) {
            b = this.fa[this.edge[i].r_area];
        }

        if (a>=100 || b>=100) {
            continue;
        }

        if (a!=0 && b!=0 && a!=b) {
            if (this.f[i]!=teka.viewer.fillomino.Defaults.SET) {
                this.auto[i] = teka.viewer.fillomino.Defaults.SET;
            }
        }
        if (a!=0 && b!=0 && a==b) {
            this.auto[i] = teka.viewer.fillomino.Defaults.NONE;
        }
    }

    var c = 0;
    var mark = teka.new_array([this.A],0);
    for (var i=0;i<this.A;i++) {
        if (mark[i]===0) {
            c++;

            var val = this.area[i].value===false?this.fa[i]:this.area[i].value;
            if (val===0 || val>=100) {
                continue;
            }

            var az = this.countAutoArea(mark,i,val,c);
            if (az==val) {
                for (var k=0;k<this.B;k++) {
                    if (this.edge[k].l_area===false || this.edge[k].r_area===false) {
                        continue;
                    }
                    var m1 = mark[this.edge[k].l_area];
                    var m2 = mark[this.edge[k].r_area];
                    if ((m1==c && m2!=c) || (m2==c && m1!=c)) {
                        this.auto[k] = teka.viewer.fillomino.Defaults.SET;
                    }
                }
            }
        }
    }
};

/** Calculate recursively the size of an area. */
teka.viewer.fillomino.FillominoViewer.prototype.countAutoArea = function(mark, nr, val, c)
{
    if (mark[nr]!==0) {
        return 0;
    }
    if ((this.area[nr].value===false?this.fa[nr]:this.area[nr].value)!==val) {
        return 0;
    }

    mark[nr] = c;

    var az = 1;
    for (var i=0;i<this.area[nr].edgelist.length;i++) {
        var j = this.area[nr].edgelist[i].nr;
        if (this.edge[j].l_area!==false && this.edge[j].l_area!==nr) {
            az += this.countAutoArea(mark,this.edge[j].l_area,val,c);
        }
        if (this.edge[j].r_area!==false && this.edge[j].r_area!==nr) {
            az += this.countAutoArea(mark,this.edge[j].r_area,val,c);
        }
    }

    return az;
};
