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

/**
 * Constructor.
 *
 * A container arranging the puzzle as well as the needed tools in
 * top-down order. That is, the puzzle is displayed at the top and
 * the tools are displayed below the puzzle in columns.
 */
teka.TDLayout = function()
{
    teka.Layout.call(this);
};
teka.extend(teka.TDLayout,teka.Layout);

/**
 * Calculates the extent of the tools. The first tool is assumed to be
 * the puzzle. A value of false will be returned if the tools do not
 * fit in the given place. If they fit, the scale of the cells of the
 * puzzle will be returned as a measure on how good the layout fits.
 */
teka.TDLayout.prototype.arrangeTools = function(g)
{
    if (this.tools.length===0) {
        return false;
    }

    var mindim = [];
    for (var i=1;i<this.tools.length;i++) {
        mindim[i] = this.tools[i].getMinDim(g);
    }

    this.getOptimumFit(mindim);

    var x = 0;
    var y = this.height-this.bestheight;
    for (var i=0;i<this.best.length;i++) {
        if (this.best[i].length>0) {
            var maxwidth = 0;
            for (var j=0;j<this.best[i].length;j++) {
                maxwidth = Math.max(maxwidth,mindim[this.best[i][j]].width);
            }

            if (i==this.best.length-1) {
                maxwidth = Math.max(maxwidth,this.width-x);
            }
            for (var j=0;j<this.best[i].length-1;j++) {
                this.tools[this.best[i][j]].setExtent(x,y,
                                                 maxwidth,
                                                 mindim[this.best[i][j]].height);
                y+=mindim[this.best[i][j]].height+this.gap;
            }
            this.tools[this.best[i][this.best[i].length-1]].
                setExtent(x,y,
                          maxwidth,
                          this.height-y);
            x += maxwidth+this.gap;
            y = this.height-this.bestheight;
        }
    }

    this.tools[0].setExtent(0,0,this.width,this.height-this.bestheight-this.gap);
    var metrics = this.tools[0].setMetrics(g);

    if (metrics.scale<1.5*this.textHeight) {
        return false;
    }

    return metrics.scale;
};

/**
 * Calculates the best way to arrange the tools. Best way
 * means, that the maximum of space is left for the puzzle
 * while all tools fit on the page. Parameter mindim is an
 * array of the minimum width and height of the tools.
 */
teka.TDLayout.prototype.getOptimumFit = function(mindim)
{
    this.bestheight = this.height;
    this.best = [];
    this.fill(mindim,1,0,[]);
};

/** Recursively add one tool after another. */
teka.TDLayout.prototype.fill = function(mindim, nr, col, akt)
{
    if (nr>=mindim.length){

        var height = 0;
        for (var i=0;i<akt.length;i++) {
            if (akt[i].length>0) {
                var sum = -this.gap;
                for (var j=0;j<akt[i].length;j++) {
                    sum+=mindim[akt[i][j]].height+this.gap;
                }
                height = Math.max(height,sum);
            }
        }

        var width = -this.gap;
        for (var i=0;i<akt.length;i++) {
            if (akt[i].length>0) {
                var max = 0;
                for (var j=0;j<akt[i].length;j++) {
                    max = Math.max(max,mindim[akt[i][j]].width);
                }
                width+=max+this.gap;
            }
        }

        if (width>this.width || height>=this.bestheight) {
            return;
        }

        this.best = [];
        for (var i=0;i<akt.length;i++) {
            if (akt[i].length>0) {
                this.best[i] = [];
                for (var j=0;j<akt[i].length;j++) {
                    this.best[i][j] = akt[i][j];
                }
            }
        }
        this.bestheight = height;

        return;
    }

    if (akt[col]===undefined) {
        akt[col] = [];
    }
    akt[col].push(nr);
    this.fill(mindim,nr+1,col,akt);
    akt[col].pop();
    if (akt[col].length>0) {
        if (akt[col+1]===undefined) {
            akt[col+1] = [];
        }
        akt[col+1].push(nr);
        this.fill(mindim,nr+1,col+1,akt);
        akt[col+1].pop();
    }
};
