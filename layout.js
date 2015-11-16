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

teka.Layout.prototype.setTools = function(tools) {
    this.tools = tools;
};

teka.Layout.prototype.setGap = function(gap) {
    this.gap = gap;
};

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
