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
    g.font = this.getButtonFont();
    var w = g.measureText(this.buttons_[0]).width;
    w = Math.max(w,g.measureText(this.buttons_[1]).width);
    w = Math.max(w,g.measureText(this.buttons_[2]).width);
    var h = 3*(this.textHeight+5)+2*6;
    return { width:w+32, height:h };
};

teka.ButtonTool.prototype.paint = function(g)
{
    var mindim = this.getMinDim(g);
    var x = (this.width-mindim.width)/2;
    var y = [];
    y[0] = 1;
    y[1] = Math.floor((this.height-(this.textHeight+5))/2);
    y[2] = this.height-(this.textHeight+5)-1;
    
    for (var i=0;i<=2;i++) {
        this.paintButton(g,x+0.5,y[i]+0.5,mindim.width,this.textHeight+5,false,this.buttons_[i]);
    }
};
