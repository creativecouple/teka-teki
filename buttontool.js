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
 * Tool with three buttons: Check, undo and instructions.
 */
teka.ButtonTool = function()
{
    teka.Tool.call(this);

    this.buttons_ = [
        teka.translate('check'),
        teka.translate('undo'),
        teka.translate('instructions')
    ];
    this.description_ = [
        teka.translate('check_descr'),
        teka.translate('undo_descr'),
        teka.translate('instructions_descr')
    ];
    this.aktivButton = false;
    this.events = [false,false,false,false];
    this.gap = 7;
    this.delta = 0;
    this.minwidth = 0;
};
teka.extend(teka.ButtonTool,teka.Tool);

/** Sets the functions to call in case of events. */
teka.ButtonTool.prototype.setEvents = function(check,undo,instr,setText)
{
    this.events[0] = check;
    this.events[1] = undo;
    this.events[2] = instr;
    this.events[3] = setText;
};

/** Resets all buttons */
teka.ButtonTool.prototype.resetButtons = function()
{
    var changed = this.aktivButton!==false;
    this.aktivButton = false;
    return changed;
};

/** 
 * Returns the minimum dimension of this tool:
 * The width is the width of the longest text plus 16 pixel on each side.
 * The height is the height of three buttons plus two gaps.
 */
teka.ButtonTool.prototype.getMinDim = function(g)
{
    g.font = this.getButtonFont();
    var width = 0;
    for (var i=0;i<3;i++) {
        width = Math.max(width,g.measureText(this.buttons_[i]).width);
    }
    var height = 3*this.buttonHeight+2*this.gap;
    return { width:width+32, height:height };
};

/** Paints the tool on the screen. */
teka.ButtonTool.prototype.paint = function(g)
{
    var mindim = this.getMinDim(g);
    this.delta = (this.width-mindim.width)/2;
    this.minwidth = mindim.width;
    
    g.save();
    g.translate(this.delta,0);
    for (var i=0;i<=2;i++) {
        this.paintButton(g,0,0,mindim.width,this.buttonHeight,
                         this.aktivButton===i?this.BUTTON_ACTIVE:this.BUTTON_PASSIVE,this.buttons_[i]);
        g.translate(0,this.buttonHeight+this.gap);
    }
    g.restore();
};

/** Handle mousemove event */
teka.ButtonTool.prototype.processMouseMovedEvent = function(xc,yc)
{
    this.aktivButton = this.getButton(xc,yc);
    if (this.aktivButton===-1) {
        return false;
    }

    if (this.events[3]!==false) {
        this.events[3](this.description_[this.aktivButton],false);
    }

    return true;
};

/** Handle mousedown event */
teka.ButtonTool.prototype.processMousePressedEvent = function(xc,yc)
{
    this.aktivButton = this.getButton(xc,yc);
    if (this.aktivButton===-1) {
        return false;
    }

    if (this.events[this.aktivButton]!==false) {
        if (this.aktivButton==2) {
            this.events[this.aktivButton](true);
        } else {
            this.events[this.aktivButton]();
        }
    }

    return true;
};

/** 
 * Calculate the number of the button at coordinates xc, yc.
 * If none of the buttons is hit, false is returned.
 */
teka.ButtonTool.prototype.getButton = function(xc,yc)
{
    xc -= this.delta;
    
    for (var i=0;i<=2;i++) {
        if (xc>=0 && xc<=this.minwidth &&
            yc>=0 && yc<=this.buttonHeight) {
            return i;
        }
        yc -= (this.buttonHeight+this.gap);
    }
    
    return false;
};

