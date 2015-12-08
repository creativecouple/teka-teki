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
    this.deltaButtonX = 0;
    this.deltaButtonY = 0;

    this.text = teka.translate('start_text');
    this.wrapped_text = false;
    this.printTextHeight = 12;

    this.graphics = null;
    this.events = [false,false];
    this.activeButton = false;
};
teka.extend(teka.StartScreen,teka.Tool);

/** Set text to display at the left. */
teka.StartScreen.prototype.setText = function(text)
{
    this.text = text;
};

/** Sets the properties to display at bottom right. */
teka.StartScreen.prototype.setProperties = function(properties)
{
    this.properties = properties;
};

/** Sets the text on the buttons. */
teka.StartScreen.prototype.setButtonText = function(buttonText)
{
    this.buttonText = buttonText;
};

/**
 * Set colors and height of buttons.
 * Calls the function in the 'superclass'. As this concept does
 * not exist in javascript, the superclass 'tool' contains
 * two versions of setButtonParameter, the one without _ to be
 * overridden, the other one to be used here.
 */
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

/** Sets the event which toggles the display of instructions. */
teka.StartScreen.prototype.setEvents = function(setInstructions,start)
{
    this.events[0] = setInstructions;
    this.events[1] = start;
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
    this.initText();
};

/** Calculate the width of the buttons. */
teka.StartScreen.prototype.initButtons = function()
{
    var width = 0;
    for (var i=0;i<this.buttonText.length;i++) {
        width = Math.max(width,this.graphics.measureText(this.buttonText[i]).width);
    }

    this.buttonWidth = width+100;

    this.deltaButtonX = Math.floor((this.rightWidth-this.buttonWidth)/2);
    var tmp = this.buttonText.length*this.buttonHeight+
        (this.buttonText.length-1)*this.gap;
    this.deltaButtonY = Math.floor((this.bottomHeight-tmp)/2);
};

/** Wraps the text displayed at the left. */
teka.StartScreen.prototype.initText = function()
{
    this.wrapText(this.graphics,this.width-this.rightWidth-this.gap);
};

/** Title is displayed twice as height as normal text. */
teka.StartScreen.prototype.getTitleFont = function()
{
    return 'bold '+this.textHeight+'px sans-serif';
};

//////////////////////////////////////////////////////////////////

/** Paints the start screen. */
teka.StartScreen.prototype.paint = function(g)
{
    // buttons at top right
    g.save();
    g.translate(this.width-this.rightWidth,0);

    g.translate(this.deltaButtonX,this.deltaButtonY);

    for (var i=0;i<this.buttonText.length;i++) {
        this.paintButton(g,0,i*(this.buttonHeight+this.gap),
                         this.buttonWidth,this.buttonHeight,
                         this.activeButton===i?this.BUTTON_ACTIVE:this.BUTTON_PASSIVE,
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
            g.fillText('*** '+this.properties[i]+' ***',0,2);
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

    g.translate(0,3*this.textHeight);
    g.font = this.getTextFont(this.printTextHeight);

    var y = 2;
    for (var i=0;i<this.wrapped_text.length;i++) {
        if (this.wrapped_text[i]===null) {
            y+=10;
        } else {
            g.fillText(this.wrapped_text[i],0,y);
            y+=this.printTextHeight+2;
        }
    }

    g.restore();
};

/** Handle mousemove event */
teka.StartScreen.prototype.processMouseMovedEvent = function(xc,yc)
{
    var last = this.activeButton;
    this.activeButton = this.getButton(xc,yc);
    return this.activeButton!==last;
};

/** Handle mousedown event */
teka.StartScreen.prototype.processMousePressedEvent = function(xc,yc)
{
    var last = this.activeButton;
    this.activeButton = this.getButton(xc,yc);
    if (this.activeButton===false) {
        return this.activeButton!==last;
    }

    if (this.activeButton===0) {
        if (this.events[0]!==false) {
            this.events[0](true);
        }
    }
    if (this.activeButton===1) {
        if (this.events[1]!==false) {
            this.events[1]();
        }
    }

    return true;
};

/** Handle keydown event */
teka.StartScreen.prototype.processKeyEvent = function(e)
{
    if (e.key==teka.KEY_DOWN) {
        if (this.activeButton===false) {
            this.activeButton = this.buttonText.length-1;
        } else if (this.activeButton<this.buttonText.length-1) {
            this.activeButton++;
        }
        return true;
    }

    if (e.key==teka.KEY_UP) {
        if (this.activeButton===false) {
            this.activeButton = 0;
        } else if (this.activeButton>0) {
            this.activeButton--;
        }
        return true;
    }

    if (e.key==teka.KEY_ENTER) {
        if (this.activeButton===0) {
            if (this.events[0]!==false) {
                this.events[0](true);
            }
        }
        if (this.activeButton===1) {
            if (this.events[1]!==false) {
                this.events[1]();
            }
        }
        return true;
    }

    return false;
};

//////////////////////////////////////////////////////////////////

/**
 * Calculate the number of the button at coordinates xc, yc.
 */
teka.StartScreen.prototype.getButton = function(xc,yc)
{
    xc -= this.deltaButtonX+(this.width-this.rightWidth);
    yc -= this.deltaButtonY;

    for (var i=0;i<this.buttonText.length;i++) {
        if (xc>=0 && xc<=this.buttonWidth &&
            yc>=i*(this.buttonHeight+this.gap) &&
            yc<=i*(this.buttonHeight+this.gap)+this.buttonHeight) {
            return i;
        }
    }

    return false;
};

/**
 * Calculates how to wrap the text. Linebreaks can only occur at spaces.
 * If it doesn't fit into the extent, the size of the font is reduced
 * until it fits or the size is too small. In the later case, it might
 * happen, that part of the text is not displayed anymore.
 */
teka.StartScreen.prototype.wrapText = function(g,maxwidth)
{
    if (this.text===undefined || this.text==='' || this.text===false) {
        this.wrapped_text = [];
        return;
    }

    var s = this.text;
    var v = [];

    this.printTextHeight = this.textHeight;
    while (true) {
        g.font = this.getTextFont(this.printTextHeight);
        v = [];
        var ch = this.printTextHeight;
        var t = s.split('\n');
        var tpos = 0;
        while (tpos<t.length) {
            var toks = t[tpos++].split(' ');

            // Wrap one paragraph
            var c = 0;
            while (c<toks.length) {
                var h = toks[c++];
                while (c<toks.length && g.measureText(h+' '+toks[c]).width<maxwidth) {
                    h = h+' '+toks[c++];
                }
                v.push(h);
                ch+=this.printTextHeight+2;
            }

            // Add some extra space between paragraphs
            if (tpos<t.length) {
                v.push(null);
                ch+=10;
            }
        }

        if (ch<=this.height-3*this.textHeight || this.printTextHeight<=this.textHeight*0.75) {
            break;
        }

        // Try again with textsize reduced by one
        this.printTextHeight--;
    }

    this.wrapped_text = v;
};
