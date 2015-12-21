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
        this.border[this.B] = {from:parseInt(list[i]),to:parseInt(list[i+1])};
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
            value:parseInt(list[i+2]),
            style:parseInt(list[i+3])
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

///////// from here on it might be rubbish...


/** calculatePolygons */
/*
teka.viewer.fences.FencesViewer.prototype.calculatePolygons = function()
{
    for (var i=0;i<this.A;i++) {
        this.area[i].p = null;
    }

    for (var i=0;i<this.B;i++) {
        Polygon p = calculatePolygon(this.border[i].von, this.border[i].nach);
        findArea(p);
        p = calculatePolygon(this.border[i].nach, this.border[i].von);
        findArea(p);
    }

    for (var i=0;i<this.B;i++) {
        this.border[i].areas = teka.new_array([2],0);
        this.border[i].areas[0] = -1;
        this.border[i].areas[1] = -1;
    }

    for (var i=0;i<this.A;i++) {
        for (var j=0;j<this.area[i].borders.length;j++) {
            this.border[this.area[i].borders[j]].areas[this.border[this.area[i].borders[j]].areas[0]==-1?0:1] = i;
        }
    }
};
*/
/** findArea */
/*
teka.viewer.fences.FencesViewer.prototype.findArea = function(p)
{
    if (p===false) {
        return;
    }

    for (var i=0;i<this.A;i++) {
        if (this.area[i].p===false && p.contains(this.area[i].x*this.scale+3,this.area[i].y*this.scale+3)) {
            this.area[i].p = p;
            this.area[i].borders = teka.new_array([p.npoints],0);
            for (var k=0;k<this.edge_list.length-1;k++) {
                this.area[i].borders[k] = findBorder(this.edge_list[k],this.edge_list[k+1]);
            }
        }
    }
};
*/
/** findBorder */
/*
teka.viewer.fences.FencesViewer.prototype.findBorder = function(von, nach)
{
    for (var i=0;i<this.B;i++) {
        if (this.border[i].von==von && this.border[i].nach==nach) {
            return i;
        }
        if (this.border[i].von==nach && this.border[i].nach==von) {
            return i;
        }
    }
    return -1;
};
*/
/** calculatePolygon */
/*
teka.viewer.fences.FencesViewer.prototype.calculatePolygon = function(von, nach)
{
    var e = teka.new_array([this.E],0);
    var ec = 0;

    double sum = 0;
    var s = nach;
    e[ec++] = von;
    while (s!=von) {
        e[ec++] = s;
        var best = s;
        double bestangle=400.0;
        for (var i=0;i<this.B;i++) {
            if (this.border[i].von==s && this.border[i].nach!=e[ec-2]) {
                double h=angle(e[ec-2],e[ec-1],this.border[i].nach);
                if (h<bestangle) {
                    best = this.border[i].nach;
                    bestangle = h;
                }
            }
            if (this.border[i].nach==s && this.border[i].von!=e[ec-2]) {
                double h=angle(e[ec-2],e[ec-1],this.border[i].von);
                if (h<bestangle) {
                    best = this.border[i].von;
                    bestangle = h;
                }
            }
        }
        s = best;
        sum+=bestangle;
    }
    sum+=angle(e[ec-1],von,nach);
    if (Math.abs(sum-(ec-2)*Math.PI)>0.1) {
        return null;
    }

    var xp = teka.new_array([ec],0);
    var yp = teka.new_array([ec],0);
    for (var i=0;i<ec;i++) {
        xp[i] = (var)(this.edge[e[i]].x*this.scale)+3;
        yp[i] = (var)(this.edge[e[i]].y*this.scale)+3;
    }

    this.edge_list = teka.new_array([ec+1],0);
    for (var i=0;i<ec;i++) {
        this.edge_list[i] = e[i];
    }
    this.edge_list[ec] = e[0];

    return new Polygon(xp,yp,ec);
};
*/
/** angle */
/*
teka.viewer.fences.FencesViewer.prototype.angle = function(a, b, c)
{
    double la = sqr(this.edge[a].x-this.edge[b].x)+sqr(this.edge[a].y-this.edge[b].y);
    double lb = sqr(this.edge[c].x-this.edge[b].x)+sqr(this.edge[c].y-this.edge[b].y);
    double lc = sqr(this.edge[a].x-this.edge[c].x)+sqr(this.edge[a].y-this.edge[c].y);
    double h = (la+lb-lc)/(2*Math.sqrt(la*lb));
    if (h<-0.999999) {
        return Math.PI;
    }
    double w = Math.acos(h);

    double k = (this.edge[c].x-this.edge[a].x)*(this.edge[b].y-this.edge[a].y)-(this.edge[c].y-this.edge[a].y)*(this.edge[b].x-this.edge[a].x);

    if (k<0) {
        w=2*Math.PI-w;
    }
    return w;
};
*/
/** angle */
/*
teka.viewer.fences.FencesViewer.prototype.angle = function(ax, ay, bx, by, cx, cy)
{
    double la = sqr(ax-bx)+sqr(ay-by);
    double lb = sqr(cx-bx)+sqr(cy-by);
    double lc = sqr(ax-cx)+sqr(ay-cy);
    double h = (la+lb-lc)/(2*Math.sqrt(la*lb));
    double w = Math.acos(h);

    return w;
};
*/
/** calculateNeighbours */
/*
teka.viewer.fences.FencesViewer.prototype.calculateNeighbours = function()
{
    var nb = teka.new_array([this.B],false);

    var l = teka.new_array([this.B],0);
    var r = teka.new_array([this.B],0);
    var t = teka.new_array([this.B],0);
    var b = teka.new_array([this.B],0);
    double[] la = new double[this.B];
    double[] ra = new double[this.B];
    double[] ta = new double[this.B];
    double[] ba = new double[this.B];

    for (var i=0;i<this.B;i++) {
        var e1 = this.border[i].von;
        var e2 = this.border[i].nach;
        for (var j=0;j<this.B;j++) {
            nb[j] = this.border[j].von==e1 || this.border[j].von==e2 || this.border[j].nach==e1 || this.border[j].nach==e2;
        }

        for (var j=0;j<this.border[i].areas.length;j++) {
            if (this.border[i].areas[j]!=-1) {
                for (var k=0;k<this.area[this.border[i].areas[j]].borders.length;k++) {
                    nb[this.area[this.border[i].areas[j]].borders[k]] = true;
                }
            }
        }

        nb[i] = false;

        double this.xm = (this.edge[e1].x+this.edge[e2].x)/2;
        double this.ym = (this.edge[e1].y+this.edge[e2].y)/2;

        var lc = 0;
        var rc = 0;
        var tc = 0;
        var bc = 0;

        for (var j=0;j<this.B;j++) {
            if (nb[j]) {
                double xm2 = (this.edge[this.border[j].von].x+this.edge[this.border[j].nach].x)/2;
                double ym2 = (this.edge[this.border[j].von].y+this.edge[this.border[j].nach].y)/2;
                double dx = this.xm-xm2;
                double dy = this.ym-ym2;

                if (Math.abs(dx)<=Math.abs(dy)) {
                    if (dy<0) {
                        b[bc] = j;
                        ba[bc] = angle(this.xm,ym2,this.xm,this.ym,xm2,ym2);
                        bc++;
                    } else {
                        t[tc] = j;
                        ta[tc] = angle(this.xm,ym2,this.xm,this.ym,xm2,ym2);
                        tc++;
                    }
                }
                if (Math.abs(dx)>=Math.abs(dy)) {
                    if (dx<=0) {
                        r[rc] = j;
                        ra[rc] = angle(xm2,this.ym,this.xm,this.ym,xm2,ym2);
                        rc++;
                    } else {
                        l[lc] = j;
                        la[lc] = angle(xm2,this.ym,this.xm,this.ym,xm2,ym2);
                        lc++;
                    }
                }
            }
        }

        this.border[i].left = teka.new_array([lc],0);
        System.arraycopy(l,0,this.border[i].left,0,lc);
        this.border[i].right = teka.new_array([rc],0);
        System.arraycopy(r,0,this.border[i].right,0,rc);
        this.border[i].top = teka.new_array([tc],0);
        System.arraycopy(t,0,this.border[i].top,0,tc);
        this.border[i].bottom = teka.new_array([bc],0);
        System.arraycopy(b,0,this.border[i].bottom,0,bc);
        sort(this.border[i].left,la,lc);
        sort(this.border[i].right,ra,rc);
        sort(this.border[i].top,ta,tc);
        sort(this.border[i].bottom,ba,bc);
    }
};
*/
/** sort */
/*
teka.viewer.fences.FencesViewer.prototype.sort = function(a, sa, max)
{
    for (var i=0;i<max-1;i++) {
        double min = sa[i];
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
            double hlp2 = sa[i];
            sa[i] = sa[minpos];
            sa[minpos] = hlp2;
        }
    }
};
*/

/** Add solution. */
teka.viewer.fences.FencesViewer.prototype.addSolution = function()
{
    for (var i=0;i<this.B;i++) {
        this.f[i] = this.solution[i];
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
};

/** Load state. */
teka.viewer.fences.FencesViewer.prototype.loadState = function(state)
{
};

//////////////////////////////////////////////////////////////////

/** Check, if the solution is correct. */
teka.viewer.fences.FencesViewer.prototype.check = function()
{
    /*
    var X = this.X;
    var Y = this.Y;
    for (var i=0;i<this.A;i++) {
        System.out.print('[ '+(((var)((this.area[i].x+this.HELPMINX)*1000))/1000.0)+' '+(((var)((this.HELPMAXY-this.area[i].y)*1000))/1000.0)+' '+this.area[i].value+' '+this.area[i].this.style+' '+this.area[i].borders.length+' ');
        for (var j=0;j<this.area[i].borders.length;j++) {
            System.out.print(this.area[i].borders[j]+' ');
        }
        System.out.println(']');
    }

    for (var i=0;i<this.E;i++) {
        var az = 0;
        for (var j=0;j<this.B;j++) {
            if (this.f[j]==teka.viewer.fences.Defaults.SET && (this.border[j].von==i || this.border[j].nach==i)) {
                az++;
            }
        }
        if (az!=0 && az!=2) {
            for (var j=0;j<this.B;j++) {
                if (this.f[j]==teka.viewer.fences.Defaults.SET && (this.border[j].von==i || this.border[j].nach==i)) {
                    this.border_error[j] = true;
                }
            }
        }
        if (az==1) {
            return 'Die markierte Kante endet in einer Sackgasse.';
        }
        if (az>2) {
            return 'Die markierten Kanten treffen sich in einem Verzweigungspunkt.';
        }
    }

    for (var i=0;i<this.A;i++) {
        if (this.area[i].value!=-1) {
            var az = 0;
            for (var j=0;j<this.area[i].borders.length;j++) {
                if (this.f[this.area[i].borders[j]]==teka.viewer.fences.Defaults.SET) {
                    az++;
                }
            }
            if (az!=this.area[i].value) {
                this.area_error[i] = true;
                return 'Bei der markierten Fläche stimmt die Anzahl der Kanten nicht.';
            }
        }
    }

    var k = -1;
    for (var i=0;i<this.B;i++) {
        if (this.f[i]==teka.viewer.fences.Defaults.SET) {
            k = i;
            this.border_error[i] = true;
            break;
        }
    }

    var start = this.border[k].von;
    var last = start;
    var jetzt = this.border[k].nach;

    var e = teka.new_array([this.E],0);
    var ec = 1;
    e[0] = start;

    while (jetzt!=start) {
        e[ec++] = jetzt;
        var neu = -1;
        for (var i=0;i<this.B;i++) {
            if (this.f[i]==teka.viewer.fences.Defaults.SET) {
                if (this.border[i].von==jetzt && this.border[i].nach!=last) {
                    neu = this.border[i].nach;
                    this.border_error[i] = true;
                }
                if (this.border[i].nach==jetzt && this.border[i].von!=last) {
                    neu = this.border[i].von;
                    this.border_error[i] = true;
                }
            }
        }
        last = jetzt;
        jetzt = neu;
    }

    for (var i=0;i<this.B;i++) {
        if (this.f[i]==teka.viewer.fences.Defaults.SET && !this.border_error[i]) {
            return 'Die markierten Kanten hängen nicht mit dem Rest zusammen.';
        }
    }

    for (var i=0;i<this.B;i++) {
        this.border_error[i] = false;
    }

    var xp = teka.new_array([ec],0);
    var yp = teka.new_array([ec],0);
    for (var i=0;i<ec;i++) {
        xp[i] = (var)(this.edge[e[i]].x*this.scale)+3;
        yp[i] = (var)(this.edge[e[i]].y*this.scale)+3;
    }

    this.rundweg = new Polygon(xp,yp,ec);
     */

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

//    g.fillStyle = '#0f0';
//    g.fillRect(-10,-10,this.width+20,this.height+20);

    g.strokeStyle = '#888';
    for (var i=0;i<this.B;i++) {
        teka.drawLine(g,
                      this.edge[this.border[i].from].x*S,
                      this.edge[this.border[i].from].y*S,
                      this.edge[this.border[i].to].x*S,
                      this.edge[this.border[i].to].y*S);
    }

    g.fillStyle = '#000';
    for (var i=0;i<this.E;i++) {
        teka.fillOval(g,this.edge[i].x*S,this.edge[i].y*S,3);
    }

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

    /*
    var this.error = false;
    for (var i=0;i<this.A;i++) {
        if (this.area_error[i]) {
            this.error = true;
        }
    }
    for (var i=0;i<this.B;i++) {
        if (this.border_error[i]) {
            this.error = true;
        }
    }

    if (this.error!=lasterror || this.mode!=this.lastmode) {
        image=null;
    }
    lasterror = this.error;
    this.lastmode = this.mode;

    if (image===false) {
        image = master.createImage(realwidth,realheight);
        Graphics2D g2 = (Graphics2D)image.getGraphics();
        master.setHints(g2);
        g2.fillStyle = (master.bgColor);
        g2.fillRect(0,0,realwidth,realheight);

        for (var i=0;i<this.A;i++) {
            if (this.area[i].p!=null) {
                if (this.mode>=0) {
                    g2.fillStyle = (solvedColor[Math.abs((this.mode+(i+3)*this.mode%(i+1)+(i+1)*(i+4)*(9-this.mode)%(i+1)+this.f[i]+i)%4)+(this.rundweg.contains((var)(this.area[i].x*S)+3,(var)(this.area[i].y*S)+3)?0:4)]);
                } else if (this.area_error[i]) {
                    g2.fillStyle = ('#f00');
                } else {
                    g2.fillStyle = ('#fff');
                }
                g2.fillPolygon(this.area[i].p);
            }
        }


        AffineTransform at = g2.getTransform();
        g2.setFont(fo_gross);
        g2.fillStyle = ('#000');
        for (var i=0;i<this.A;i++) {
            if (this.area[i].value>=0) {
                g2.transform(this.area[i].at);
                g2.drawString(''+this.area[i].value,-fm_gross.stringWidth(''+this.area[i].value)/2,(fm_gross.getAscent()-fm_gross.getDescent())/2);
                g2.setTransform(at);
            }
        }
    }

    g.drawImage(image,0,0,master);

    Stroke s = g.getStroke();
    for (var i=0;i<this.B;i++) {
        g.fillStyle = (ColorTool.colors[this.c[i]]);
        if (this.f[i]==teka.viewer.fences.Defaults.SET) {
            g.setStroke(new BasicStroke(5));
            teka.drawLine(g,(var)(this.edge[this.border[i].von].x*S)+3,(var)(this.edge[this.border[i].von].y*S)+3,
            (var)(this.edge[this.border[i].nach].x*S)+3,(var)(this.edge[this.border[i].nach].y*S)+3);
        }
        if (this.f[i]==teka.viewer.fences.Defaults.EMPTY) {
            var x = (var)((this.edge[this.border[i].von].x+this.edge[this.border[i].nach].x)/2*S)+3;
            var y = (var)((this.edge[this.border[i].von].y+this.edge[this.border[i].nach].y)/2*S)+3;
            g.setStroke(new BasicStroke(2));
            teka.drawLine(g,x-3,y-3,x+3,y+3);
            teka.drawLine(g,x-3,y+3,x+3,y-3);
        }
    }
    g.setStroke(s);

    g.fillStyle = ('#f00');
    g.setStroke(new BasicStroke(5));
    for (var i=0;i<this.B;i++) {
        if (this.border_error[i]) {
            teka.drawLine(g,(var)(this.edge[this.border[i].von].x*S)+3,(var)(this.edge[this.border[i].von].y*S)+3,
        }
    }
    (var)(this.edge[this.border[i].nach].x*S)+3,(var)(this.edge[this.border[i].nach].y*S)+3);
    g.setStroke(s);

    g.fillStyle = ('#f00');
    if (this.mode==NORMAL) {
        g.setStroke(new BasicStroke(3));
        teka.drawLine(g,(var)(this.edge[this.border[x].von].x*S)+3,(var)(this.edge[this.border[x].von].y*S)+3,
        (var)(this.edge[this.border[x].nach].x*S)+3,(var)(this.edge[this.border[x].nach].y*S)+3);
        g.setStroke(s);
    }
    if (this.list!=null) {
        g.fillStyle = ('#f00');
        g.setStroke(new BasicStroke(1));
        for (var i=0;i<this.list.length;i++) {
            if (this.list[i]!=x) {
                teka.drawLine(g,(var)(this.edge[this.border[this.list[i]].von].x*S)+3,(var)(this.edge[this.border[this.list[i]].von].y*S)+3,
            }
        }
        (var)(this.edge[this.border[this.list[i]].nach].x*S)+3,(var)(this.edge[this.border[this.list[i]].nach].y*S)+3);
        g.setStroke(s);
    }
     */

    g.restore();
};

//////////////////////////////////////////////////////////////////

/** Handles mousemove event. */
teka.viewer.fences.FencesViewer.prototype.processMousemoveEvent = function(xc, yc, pressed)
{
    xc -= this.deltaX;
    yc -= this.deltaY;

    /*
    this.list = null;
    var oldx = x;
    x = getBorder((xc-3)/(double)this.scale,(yc-3)/(double)this.scale);
    if (x==-1) {
        x=oldx;
    }
    return x!=oldx;
     */
    return false;
};

/** Handles mousedown event. */
teka.viewer.fences.FencesViewer.prototype.processMousedownEvent = function(xc, yc)
{
    var erg = this.processMousemoveEvent(xc,yc);

    this.set(x,(this.f[x]+1)%3);

    return true;
};

/** Handles keydown event. */
teka.viewer.fences.FencesViewer.prototype.processKeydownEvent = function(e)
{
    /*
    if (co==KeyEvent.VK_ESCAPE && this.list!=null && this.list.length>0) {
        this.lp = (this.lp+1)%this.list.length;
        x = this.list[this.lp];
        return true;
    }

    this.list = null;
    this.lp = 0;

    if (co==40 && this.border[x].bottom.length>0) {
        this.list = this.border[x].bottom;
        x = this.border[x].bottom[0];
        return true;
    }
    if (co==38 && this.border[x].top.length>0) {
        this.list = this.border[x].top;
        x = this.border[x].top[0];
        return true;
    }
    if (co==39 && this.border[x].left.length>0) {
        this.list = this.border[x].left;
        x = this.border[x].left[0];
        return true;
    }
    if (co==37 && this.border[x].right.length>0) {
        this.list = this.border[x].right;
        x = this.border[x].right[0];
        return true;
    }

    if (this.c=='#' || this.c=='*' || this.c=='q' || this.c=='Q') {
        this.set(x,teka.viewer.fences.Defaults.SET);
        return true;
    }

    if (this.c=='-' || this.c=='/' || this.c=='w' || this.c=='W') {
        this.set(x,teka.viewer.fences.Defaults.EMPTY);
        return true;
    }

    if (this.c==' ') {
        this.set(x,0);
        return true;
    }
     */
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

/** getBorder */
/*
teka.viewer.fences.FencesViewer.prototype.getBorder = function(x, y)
{
    var mini = -1;
    double min = 1000;
    for (var i=0;i<this.B;i++) {
        double ax = this.edge[this.border[i].von].x;
        double ay = this.edge[this.border[i].von].y;
        double bx = this.edge[this.border[i].nach].x;
        double by = this.edge[this.border[i].nach].y;
        double k = ((x-ax)*(bx-ax)+(y-ay)*(by-ay))/(sqr(ax-bx)+sqr(ay-by));
        if (k<0 || k>1) {
            continue;
        }
        double nx = ax+(bx-ax)*k;
        double ny = ay+(by-ay)*k;
        double d = sqr(x-nx)+sqr(y-ny);
        if (k>0.5) {
            k = 1-k;
        }
        if (d*2>k*k) {
            continue;
        }
        if (d*2>min) {
            continue;
        }
        min = d*2;
        mini = i;
    }
    return mini;
};
*/
