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

teka.HeadDisplay = function()
{
    this.setExtent(0,0,300,24);
    this.title = 'Teka-Teki';
    this.color = '#000';
    this.textheight = 20;
};
teka.HeadDisplay.prototype = new teka.Display;

teka.HeadDisplay.prototype.setTitle = function(title)
{
    if (title!==undefined)
        this.title = title;
};

teka.HeadDisplay.prototype.setColor = function(color)
{
    if (color!==undefined)
        this.color = color;
};

teka.HeadDisplay.prototype.setTextHeight = function(textheight)
{
    if (textheight!==undefined)
        this.textheight = textheight;
};

teka.HeadDisplay.prototype.paint = function(g)
{
    g.textAlign = 'center';
    g.textBaseline = 'alphabetic';
    g.fillStyle = this.color;
    g.font = 'bold '+this.textheight+'px "URW Chancery L",sans-serif';
    g.fillText(this.title,this.width/2,this.height-this.textheight/2);
};

