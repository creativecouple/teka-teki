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
 * An abstract class used as parent for concrete layout classes.
 */
teka.Layout = function()
{
    teka.Display.call(this);

    this.tools = [];
    this.gap = '20';
};
teka.extend(teka.Layout,teka.Display);

/** Sets the tools that will be layouted. */
teka.Layout.prototype.setTools = function(tools) {
    this.tools = tools;
};

/** Sets the gap between the tools. */
teka.Layout.prototype.setGap = function(gap) {
    this.gap = gap;
};

/** Paints all tools in the layout on the screen. */
teka.Layout.prototype.paint = function(g)
{
    for (var i in this.tools) {
        g.save();
        this.tools[i].translate(g);
        this.tools[i].clip(g);
        this.tools[i].paint(g);
        g.restore();
    }
};

/** Handles mousemove events by sending them to the tools. */
teka.Layout.prototype.processMouseMovedEvent = function(xc,yc)
{
    var paint = false;
    for (var i=1;i<this.tools.length;i++) {
        if (this.tools[i].resetButtons()) {
            paint = true;
        }
    }
    
    for (var i=0;i<this.tools.length;i++) {
        if (this.tools[i].inExtent(xc,yc)) {
            if (this.tools[i].processMouseMovedEvent(xc-this.tools[i].left,
                                                     yc-this.tools[i].top)) {
                paint = true;
            }
        }
    }

    return paint;
};

/** Handles mousedown events by sending them to the tools. */
teka.Layout.prototype.processMousePressedEvent = function(xc,yc)
{
    var paint = false;
    for (var i=0;i<this.tools.length;i++) {
        if (this.tools[i].inExtent(xc,yc)) {
            if (this.tools[i].processMousePressedEvent(xc-this.tools[i].left,
                                                       yc-this.tools[i].top)) {
                paint = true;
            }
        }
    }

    return paint;
};
