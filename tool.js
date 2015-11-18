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
 * The parent of all tools, that can be used to manipulate the puzzle.
 */
teka.Tool = function()
{
    teka.Display.call(this);

    this.colorActive = '#303030';
    this.colorPassive = '#606060';
    this.colorBorderDark = '#202020';
    this.colorBorderBright = '#A0A0A0';
    this.colorText = '#FFFFFF';
    this.buttonHeight = 17;
    this.textHeight = 12;

    this.BUTTON_ACTIVE = 1;
    this.BUTTON_PASSIVE = 2;
    this.BUTTON_DEACTIVATED = 3;
};
teka.extend(teka.Tool,teka.Display);

/**
 * Sets color and height of buttons. The text of buttons is 5
 * pixel smaller than than the button itself.
 */
teka.Tool.prototype.setButtonParameter = function(colors,height)
{
    this.colorText = colors.TEXT;
    this.colorActive = colors.ACTIVE;
    this.colorPassive = colors.PASSIVE;
    this.colorBorderDark = colors.BORDER_DARK;
    this.colorBorderBright = colors.BORDER_BRIGHT;
    this.buttonHeight = height;
    this.textHeight = height-5;
};

/** Abstract function: Returns the minimum dimension, the tool needs. */
teka.Tool.prototype.getMinDim = function(g)
{
    return { width:0, height:0 };
};

/** 
 * Returns a well formated string containing the font used for normal
 * texts. If height is given, the default height is overridden.
 */
teka.Tool.prototype.getTextFont = function(height)
{
    return ''+(height!==undefined?height:this.textHeight)+'px sans-serif';
};

/** Returns a well formated string containg the font used for buttons. */
teka.Tool.prototype.getButtonFont = function()
{
    return 'bold '+this.textHeight+'px sans-serif';
};

/** 
 * Abstract function. Resets all buttons to passive mode. 
 * Returns true, of a change has occured.
 */
teka.Tool.prototype.resetButtons = function()
{
    return false;
};

/**
 * Paints a button on image g at position x,y = (top, left) of
 * given width and height. 
 *
 * The mode can be
 * BUTTON_PASSIVE, which is a normal button.
 * BUTTON_ACTIVE, which is a button, that is activated, either,
 * because it is something that is just in use or because the
 * mouse hovers over it.
 * BUTTON_DEACTIVATED, which is a button, that cannot be pressed.
 * 
 * If the text is not false, it is printed centered in the button.
 * The font, returned by getButtonFont is used. If the text is too
 * long for the button, the leftmost part is painted.
 */
teka.Tool.prototype.paintButton = function(g,x,y,width,height,mode,text)
{
    // background
    g.fillStyle = mode==this.BUTTON_ACTIVE?this.colorActive:this.colorPassive;
    g.fillRect(x,y,width,height);
    
    // top and left border
    g.strokeStyle = this.colorBorderBright;
    g.beginPath();
    g.moveTo(x,y+height-1);
    g.lineTo(x,y);
    g.lineTo(x+width-1,y);
    g.stroke();
    
    // bottom and right border
    g.strokeStyle = this.colorBorderDark;
    g.beginPath();
    g.moveTo(x,y+height-1);
    g.lineTo(x+width-1,y+height-1);
    g.lineTo(x+width-1,y);
    g.stroke();

    if (text===false)  return;

    g.save();
    
    // set clip area to avoid writing outside of the button
    g.beginPath();
    g.moveTo(x,y);
    g.lineTo(x+width,y);
    g.lineTo(x+width,y+height);
    g.lineTo(x,y+height);
    g.closePath();
    g.clip();

    // paint text
    g.fillStyle = mode==this.BUTTON_DEACTIVATED?this.colorBorderBright:this.colorText;
    g.textBaseline = 'middle';
    g.font = this.getButtonFont();
    var center = g.measureText(text).width<width;
    g.textAlign = center?'center':'left';
    g.fillText(text,x+(center?(width/2):0),y+height/2);
    
    g.restore();
};
