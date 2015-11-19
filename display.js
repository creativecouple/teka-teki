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
 * The parent of all the tools, that can be seen on the canvas.
 */
teka.Display = function()
{
    this.textcolor = '#000';
    this.textheight = 12;
    this.top = 0;
    this.left = 0;
    this.width = 100;
    this.height = 100;
};

/**
 * Sets color and height of the standard text used in this tool.
 */
teka.Display.prototype.setTextParameter = function(color, height)
{
    this.textcolor = color;
    this.textheight = height;
};

/**
 * Set's the extent inside the canvas where the tool resides.
 */
teka.Display.prototype.setExtent = function(left,top,width,height)
{
    this.setExtent_(left,top,width,height);
};

/**
 * Used to overwrite the function in a descendant, as javascript
 * does not provide real inheritance.
 */
teka.Display.prototype.setExtent_ = function(left,top,width,height)
{
    this.left = left;
    this.top = top;
    this.width = width;
    this.height = height;
};

/**
 * Checks, if a given point (x,y) lies inside of the extent of
 * this tool.
 */
teka.Display.prototype.inExtent = function(x,y)
{
    return x>=this.left && x<=this.left+this.width
        && y>=this.top && y<=this.top+this.height;
};

/**
 * Translates the reference point of the canvas to the
 * topleft of the tool. After this translation the
 * tool can just assume, that it is placed at the origin.
 */
teka.Display.prototype.translate = function(g)
{
    g.translate(this.left,this.top);
};

/**
 * Clips the painting area to the extent of this tool. This prevents
 * the tool to accidentially overwrite other stuff on the canvas.
 */
teka.Display.prototype.clip = function(g)
{
    g.beginPath();
    g.moveTo(0,0);
    g.lineTo(this.width,0);
    g.lineTo(this.width,this.height);
    g.lineTo(0,this.height);
    g.closePath();
    g.clip();
};

/**
 * A dummy to paint the content of the tool in red. This is
 * only of use while programming to see the extend of the tool
 * soon.
 */
teka.Display.prototype.paint = function(g)
{
    g.fillStyle = '#f00';
    g.fillRect(0,0,this.width,this.height);
};

/** An eventhandler for mousemove. Does nothing. */
teka.Display.prototype.processMouseMovedEvent = function(xc,yc)
{
    return false;
};

/** An eventhandler for mousedown. Does nothing. */
teka.Display.prototype.processMousePressedEvent = function(xc,yc)
{
    return false;
};
