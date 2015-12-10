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
 * Creates a tool, which allowes the user to do trial and error
 * by saving states on a stack.
 */
teka.CasesTool = function()
{
    teka.Tool.call(this);

    this.activeButton = false;
    this.delta = 0;
    this.stack = [];
    this.events = [false,false,false];
    this.maxLevel = 9;
    this.gap = 7;
};
teka.extend(teka.CasesTool,teka.Tool);

/** Sets the maximum number of saved states. */
teka.CasesTool.prototype.setMaxLevel = function(level)
{
    this.maxLevel = level;
};

/** Sets the functions to call in case of events. */
teka.CasesTool.prototype.setEvents = function(plus,minus,setText)
{
    this.events[0] = plus;
    this.events[1] = minus;
    this.events[2] = setText;
};

/** Resets all buttons */
teka.CasesTool.prototype.resetButtons = function()
{
    var changed = this.activeButton!==false;
    this.activeButton = false;
    return changed;
};

/**
 * Returns the minimum dimension of this tool:
 * width: 2 squared buttons, 1 text and two gaps in between
 * height: the height of a button
 */
teka.CasesTool.prototype.getMinDim = function(g)
{
    g.font = this.getButtonFont();
    var width = 0;
    for (var i=0;i<=this.maxLevel;i++) {
        width = Math.max(width,g.measureText(teka.translate('level',[i])).width);
    }
    return {
        width: width+2*this.gap+2*this.buttonHeight,
        height: this.buttonHeight
    };
};

/** Paints the tool on the screen. */
teka.CasesTool.prototype.paint = function(g)
{
    var mindim = this.getMinDim(g);
    this.delta = (this.width-mindim.width)/2;
    g.save();
    g.translate(this.delta,0);

    var half = this.buttonHeight/2;

    var button = this.activeButton===false?-1:this.activeButton;

    if (this.stack.length<this.maxLevel) {
        this.paintButton(g,0,0,this.buttonHeight,this.buttonHeight,
                         button===0?this.BUTTON_ACTIVE:this.BUTTON_PASSIVE,false);

        g.strokeStyle = this.colorText;
        teka.drawLine(g,4,half,this.buttonHeight-4,half);
        teka.drawLine(g,half,4,half,this.buttonHeight-4);
    }

    g.translate(this.buttonHeight+this.gap,0);

    if (this.stack.length>0) {
        this.paintButton(g,0,0,this.buttonHeight,this.buttonHeight,
                         button===1?this.BUTTON_ACTIVE:this.BUTTON_PASSIVE,false);

        g.strokeStyle = this.colorText;
        teka.drawLine(g,4,half,this.buttonHeight-4,half);
    }

    g.translate(this.buttonHeight+this.gap,0);

    g.fillStyle = this.textcolor;
    g.textAlign = 'left';
    g.textBaseline = 'middle';
    g.font = 'bold '+this.getTextFont();
    g.fillText(teka.translate('level',[this.stack.length]),
               0,this.buttonHeight/2+1);

    g.restore();
};

/** Handle mousemove event */
teka.CasesTool.prototype.processMousemoveEvent = function(xc,yc,pressed)
{
    this.activeButton = this.getButton(xc,yc);
    if (this.activeButton===-1) {
        return false;
    }

    if (this.activeButton===0 && this.stack.length<this.maxLevel) {
        if (this.events[2]!==false) {
            this.events[2](teka.translate('save_state'),false);
        }
        return true;
    }

    if (this.activeButton===1 && this.stack.length>0) {
        if (this.events[2]!==false) {
            this.events[2](teka.translate('load_state'),false);
        }
        return true;
    }

    return false;
};

/** Handle mousedown event */
teka.CasesTool.prototype.processMousedownEvent = function(xc,yc)
{
    this.activeButton = this.getButton(xc,yc);
    if (this.activeButton===-1) {
        return false;
    }

    if (this.activeButton===0 && this.stack.length<this.maxLevel) {
        if (this.events[0]!==false) {
            this.stack.push(this.events[0]());
        }
        return true;
    }

    if (this.activeButton===1 && this.stack.length>0) {
        if (this.events[1]!==false) {
            this.events[1](this.stack.pop());
        }
        return true;
    }

    return true;
};

/** Handle keydown event */
teka.CasesTool.prototype.processKeydownEvent = function(e)
{
    if (e.key==teka.KEY_PAGE_UP) {
        if (this.stack.length<this.maxLevel) {
            if (this.events[0]!==false) {
                this.stack.push(this.events[0]());
            }
        }
        return true;
    }

    if (e.key==teka.KEY_PAGE_DOWN) {
        if (this.stack.length>0) {
            if (this.events[1]!==false) {
                this.events[1](this.stack.pop());
            }
        }
        return true;
    }

    return false;
};

/**
 * Calculate the number of the button at coordinates xc, yc.
 * 0 is the plus button, 1 is the minus button. If none
 * of the buttons is hit, false is returned.
 */
teka.CasesTool.prototype.getButton = function(xc,yc)
{
    xc -= this.delta;

    if (xc>=0 && xc<=this.buttonHeight &&
        yc>=0 && yc<=this.buttonHeight) {
        return 0;
    }

    xc -= this.buttonHeight+this.gap;
    if (xc>=0 && xc<=this.buttonHeight &&
        yc>=0 && yc<=this.buttonHeight) {
        return 1;
    }

    return false;
};
