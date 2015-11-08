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

teka.Tool = function()
{
};
teka.Tool.prototype = new teka.Display;

teka.Tool.prototype.getMinDim = function(g)
{
    return { width:0, height:0 };
};

teka.Tool.prototype.paintButton = function(g,x,y,width,height,mode,text)
{
    g.fillStyle = '#606060';
    g.fillRect(x,y,width,height);
    g.strokeStyle = '#A0A0A0';
    g.beginPath();
    g.moveTo(x,y+height-1);
    g.lineTo(x,y);
    g.lineTo(x+width-1,y);
    g.stroke();
    g.strokeStyle = '#202020';
    g.beginPath();
    g.moveTo(x,y+height-1);
    g.lineTo(x+width-1,y+height-1);
    g.lineTo(x+width-1,y);
    g.stroke();
    
    g.fillStyle = '#FFFFFF';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.font = 'bold 12px sans-serif';
    g.fillText(text,x+width/2,y+height/2);
};
