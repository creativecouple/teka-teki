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
 * Displays a title at the top of the applet. This title is
 * typically the type of the puzzle to solve and can be preceded by
 * the type of the context, in which the puzzle is solved.
 */
teka.HeadDisplay = function()
{
    teka.Display.call(this);

    this.title = 'Teka-Teki';
    this.text_color = '#000';
};
teka.extend(teka.HeadDisplay,teka.Display);

/**
 * Returns the title used.
 */
teka.HeadDisplay.prototype.getTitle = function()
{
    return this.title;
};

/**
 * Sets the title. It will be used the next time, print() is called.
 */
teka.HeadDisplay.prototype.setTitle = function(title)
{
    if (title!==undefined) {
        this.title = title;
    }
};

/**
 * Returns the color used.
 */
teka.HeadDisplay.prototype.getTextColor = function()
{
    return this.text_color;
};

/**
 * Sets the color. It will be used the next time, print() is called.
 */
teka.HeadDisplay.prototype.setTextColor = function(color)
{
    if (color!==undefined) {
        this.text_color = color;
    }
};

/**
 * Prints the title.
 * The parameter g is an CanvasRenderingContext2D which is assumed 
 * to be translated to the origin of this display.
 */
teka.HeadDisplay.prototype.paint = function(g)
{
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillStyle = this.text_color;
    g.font = 'bold '+this.height+'px "URW Chancery L",sans-serif';
    g.fillText(this.title,this.width/2,this.height/2);
};
