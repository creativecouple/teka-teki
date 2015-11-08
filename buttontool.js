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

teka.ButtonTool = function()
{
    this.buttons_ = ['Testen','Rückgängig','Anleitung'];
};
teka.ButtonTool.prototype = new teka.Tool;

teka.ButtonTool.prototype.getMinDim = function(g)
{
    g.font = 'bold 12px sans-serif';
    var h = g.measureText(this.buttons_[0]).width;
    h = Math.max(h,g.measureText(this.buttons_[1]).width);
    h = Math.max(h,g.measureText(this.buttons_[2]).width);
    h+=32;
    return { width:h, height:67 };
};

teka.ButtonTool.prototype.paint = function(g)
{
    var mindim = this.getMinDim(g);
    var x = (this.width-mindim.width)/2;
    this.paintButton(g,x,1,mindim.width,17,false,this.buttons_[0]);
    this.paintButton(g,x,23,mindim.width,17,false,this.buttons_[1]);
    this.paintButton(g,x,45,mindim.width,17,false,this.buttons_[2]);
};
