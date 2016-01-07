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
 * left-right order. That is, the puzzle is displayed at the left and
 * the tools are displayed at the right from top to bottom.
 */
teka.LRLayout = function()
{
    teka.Layout.call(this);
};
teka.extend(teka.LRLayout,teka.Layout);

/**
 * Calculates the extent of the tools. The first tool is assumed to be
 * the puzzle. A value of false will be returned if the tools do not
 * fit in the given place. If they fit, the scale of the cells of the
 * puzzle will be returned as a measure on how good the layout fits.
 */
teka.LRLayout.prototype.arrangeTools = function(g) {
    if (this.tools.length===0) {
        return false;
    }

    for (var i=1;i<this.tools.length;i++) {
        if (this.tools[i]===undefined) {
            return false;
        }
    }

    var mindim = [];
    for (var i=1;i<this.tools.length;i++) {
        mindim[i] = this.tools[i].getMinDim(g);
    }

    var width = 0;
    var height = (this.tools.length-2)*this.gap;
    for (var i=1;i<this.tools.length;i++) {
        width = Math.max(width,mindim[i].width);
        height += mindim[i].height;
    }

    if (width>this.width || height>this.height) {
        return false;
    }

    this.tools[0].setExtent(0,0,this.width-width-this.gap,this.height);
    var metrics = this.tools[0].setMetrics(g);
    if (metrics.scale===false) {
        return false;
    }
    this.tools[0].setExtent(0,0,metrics.width,this.height);
    var metrics = this.tools[0].setMetrics(g);

    var y = 0;
    for (var i=1;i<this.tools.length-1;i++) {
        this.tools[i].setExtent(metrics.width+this.gap,
                                y,
                                this.width-metrics.width-this.gap,
                                mindim[i].height);
        y+=mindim[i].height+this.gap;
    }

    this.tools[this.tools.length-1].setExtent(metrics.width+this.gap,
                                              y,
                                              this.width-metrics.width-this.gap,
                                              this.height-y);

    if (metrics.scale<1.5*this.textHeight) {
        return false;
    }

    return metrics.scale;
};
