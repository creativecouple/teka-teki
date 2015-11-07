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
    this.left = 0;
    this.top = 0;
    this.width = 300;
    this.height = 24;
    this.title = 'Teka-Teki';
    this.color = '#000';
    this.textheight = 20;
};
teka.HeadDisplay.prototype = teka.Display.prototype;

teka.HeadDisplay.prototype.setTitle = function(title)
{
    if (title!==undefined)
        this.title = title;
};

teka.HeadDisplay.prototype.setExtent = function(left,top,width,height)
{
    if (left!==undefined)
        this.left = left;
    if (top!==undefined)
        this.top = top;
    if (width!==undefined)
        this.width = width;
    if (height!==undefined)
        this.height = height;
};

teka.HeadDisplay.prototype.translate = function(g)
{
    g.translate(this.left,this.top);
};

teka.HeadDisplay.prototype.paint = function(g)
{
    g.fillStyle = '#f00';
    g.fillRect(this.left,this.top,this.width,this.height);
    
    g.textAlign = 'center';
    g.textBaseline = 'alphabetic';
    g.fillStyle = this.color;
    g.font = 'bold '+this.textheight+'px URW Chancery L';
    g.fillText(this.title,this.width/2,this.height-this.textheight/2);
};
