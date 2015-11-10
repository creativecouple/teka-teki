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
    teka.Display.call(this);
    
    this.colorActive = '#303030';
    this.colorPassive = '#606060';
    this.colorBorderDark = '#202020';
    this.colorBorderBright = '#A0A0A0';
    this.colorText = '#FFFFFF';
    this.textHeight = 12;
    
    this.BUTTON_ACTIVE = 1;
    this.BUTTON_PASSIVE = 2;
    this.BUTTON_DEACTIVATED = 3;
};
teka.extend(teka.Tool,teka.Display);

teka.Tool.prototype.setColorActive = function(color)
{
    if (color!==undefined) {
        this.colorActive = color;
    }
};

teka.Tool.prototype.setColorPassive = function(color)
{
    if (color!==undefined) {
        this.colorPassive = color;
    }
};

teka.Tool.prototype.setColorBorderDark = function(color)
{
    if (color!==undefined) {
        this.colorBorderDark = color;
    }
};

teka.Tool.prototype.setColorBorderBright = function(color)
{
    if (color!==undefined) {
        this.colorBorderBright = color;
    }
};

teka.Tool.prototype.setColorText = function(color)
{
    if (color!==undefined) {
        this.colorText = color;
    }
};

teka.Tool.prototype.setTextHeight = function(textheight)
{
    if (textheight!==undefined) {
        this.textHeight = textheight;
    }
};

teka.Tool.prototype.getMinDim = function(g)
{
    return { width:0, height:0 };
};

teka.Tool.prototype.getTextFont = function()
{
    return ''+this.textHeight+'px sans-serif';
};

teka.Tool.prototype.getButtonFont = function()
{
    return 'bold '+this.textHeight+'px sans-serif';
};

teka.Tool.prototype.paintButton = function(g,x,y,width,height,mode,text)
{
    g.fillStyle = mode==this.BUTTON_ACTIVE?this.colorActive:this.colorPassive;
    g.fillRect(x,y,width,height);
    g.strokeStyle = this.colorBorderBright;
    g.beginPath();
    g.moveTo(x,y+height-1);
    g.lineTo(x,y);
    g.lineTo(x+width-1,y);
    g.stroke();
    g.strokeStyle = this.colorBorderDark;
    g.beginPath();
    g.moveTo(x,y+height-1);
    g.lineTo(x+width-1,y+height-1);
    g.lineTo(x+width-1,y);
    g.stroke();
    
    if (text!==false) {
        g.fillStyle = mode==this.BUTTON_DEACTIVATED?this.colorBorderBright:this.colorText;
        g.textAlign = 'center';
        g.textBaseline = 'middle';
        g.font = this.getButtonFont();
        g.fillText(text,x+width/2,y+height/2);
    }
};
