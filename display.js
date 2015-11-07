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

teka.Display = function(left,top,width,height) 
{
    this.setExtent(left,top,width,height);
};

teka.Display.prototype.setExtent = function(left,top,width,height)
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

teka.Display.prototype.translate = function(g)
{
    g.translate(this.left,this.top);
};

