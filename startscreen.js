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
 * Displays a start screen. Users can read the instructions
 * and choose if they want to start the puzzle or not.
 */
teka.StartScreen = function()
{
    teka.Tool.call(this);

    this.buttonText = [
        teka.translate('instructions'),
        teka.translate('start')
    ];

    this.properties = [];
    
    this.buttonWidth = 50;
    this.gap = 5;
    this.rightWidth = 100;
    this.bottomHeight = 100;
    
    this.graphics = null;
};
teka.extend(teka.StartScreen,teka.Tool);

teka.StartScreen.prototype.setButtonParameter = function(colors,height)
{
    this.setButtonParameter_(colors,height);
    this.buttonHeight+=20;
};

/** Saves the image */
teka.StartScreen.prototype.setGraphics = function(g)
{
    this.graphics = g;
};

/** Sets the gap between the tools. */
teka.StartScreen.prototype.setGap = function(gap) {
    this.gap = gap;
};

/**
 * Sets the extent and inits the start screen.
 * Calls the function in the 'superclass'. As this concept does
 * not exist in javascript, the superclass 'display' contains
 * two versions of setExtent, the one without _ to be overridden,
 * the other one to be used here.
 */
teka.StartScreen.prototype.setExtent = function(left,top,width,height)
{
    this.setExtent_(left,top,width,height);

    this.rightWidth = Math.floor(0.382*(width-this.gap));
    this.bottomHeight = Math.floor(0.5*(height-this.gap));
    
    this.initButtons();
};

/** Calculate the width of the buttons. */
teka.StartScreen.prototype.initButtons = function()
{
    var width = 0;
    for (var i=0;i<this.buttonText.length;i++) {
        width = Math.max(width,this.graphics.measureText(this.buttonText[i]).width);
    }
    
    this.buttonWidth = width+100;
};

/** Title is displayed twice as height as normal text. */
teka.StartScreen.prototype.getTitleFont = function()
{
    return 'bold '+this.textHeight+'px sans-serif';
};

// ToDo:
// a) setProperties
// b) setMainText
// c) beides geeignet umbrechen
// d) Fehlermeldung, falls Platz nicht reicht
// e) Mouse-Events
// f) Key-Events

//////////////////////////////////////////////////////////////////

/** Paints the start screen. */
teka.StartScreen.prototype.paint = function(g)
{
    // buttons at top right
    g.save();
    g.translate(this.width-this.rightWidth,0);
    
    var deltaX = Math.floor((this.rightWidth-this.buttonWidth)/2);
    var tmp = this.buttonText.length*this.buttonHeight+
        (this.buttonText.length-1)*this.gap;
    var deltaY = Math.floor((this.bottomHeight-tmp)/2);
    
    g.translate(deltaX,deltaY);

    for (var i=0;i<this.buttonText.length;i++) {
        this.paintButton(g,0,i*(this.buttonHeight+this.gap),
                         this.buttonWidth,this.buttonHeight,
                         this.BUTTON_PASSIVE,
                         this.buttonText[i]);
    }
    g.restore();

    // properties at bottom right
    g.save();
    g.translate(this.width-this.rightWidth,this.height-this.bottomHeight);
    
    g.fillStyle = this.textcolor;
    g.textAlign = 'left';
    g.textBaseline = 'top';
    g.font = this.getTitleFont();
    g.fillText(teka.translate('properties'),0,2);
    
    g.translate(0,2*this.textHeight);
    g.font = 'italic '+this.getTextFont();
    
    if (this.properties.length===0) {
        g.fillText(teka.translate('no_properties'),0,2);
    } else {
        for (var i=0;i<this.properties.length;i++) {
            g.fillText(properties[i],0,2);
            g.translate(0,this.textHeight+2);
        }
    }
    g.restore();

    // some notes on solving on time at left
    g.save();
    g.fillStyle = this.textcolor;
    g.textAlign = 'left';
    g.textBaseline = 'top';
    g.font = this.getTitleFont();
    g.fillText(teka.translate('solving_on_time'),0,2);
    
    g.translate(0,2*this.textHeight);
    g.font = this.getTextFont();
    
    g.fillText('blah...',0,2);

    g.restore();
};
