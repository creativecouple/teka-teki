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
 * Tool, which displays a counter.
 */
teka.CounterTool = function()
{
    teka.Tool.call(this);

    this.counter = 0;
    this.highlight = false;
    this.textcolor = '#000';
    this.texthighlightcolor = '#f00';
};
teka.extend(teka.CounterTool,teka.Tool);

/** Sets the value of the counter in seconds. */
teka.CounterTool.prototype.setCounter = function(value,highlight)
{
    if (value<0) {
        value = 0;
    }
    highlight = highlight===false|| highlight===undefined?false:true;

    if (this.counter===value && this.highlight===highlight) {
        return false;
    }

    this.counter = value;
    this.highlight = highlight!==false;
    return true;
};

/** Sets the color used for highlighted text. */
teka.CounterTool.prototype.setHighlightColor = function(color)
{
    this.texthighlightcolor = color;
};
/**
 * Returns the minimum dimension of this tool:
 * The width is the width of 00:00:00 plus 16 pixel.
 * The height is the height of the font plus 4 pixel.
 */
teka.CounterTool.prototype.getMinDim = function(g)
{
    g.font = 'bold '+this.getTextFont();
    var width = g.measureText(teka.niceTime(0,true)).width;
    var height = this.buttonHeight;
    return { width:width+16, height:height+4 };
};

/** Paints the tool on the screen. */
teka.CounterTool.prototype.paint = function(g)
{
    g.fillStyle = this.highlight?this.texthighlightcolor:this.textcolor;
    g.textAlign = 'right';
    g.textBaseline = 'bottom';
    g.font = 'bold '+this.getTextFont();
    g.fillText(teka.niceTime(this.counter,true),this.width-8,this.height-2);
};
