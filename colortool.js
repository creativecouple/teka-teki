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
 * Tool which controls all, that has to do with the color
 * of the items in the puzzle.
 */
teka.ColorTool = function()
{
    teka.Tool.call(this);

    this.colorname = ['black','blue','green','brown'];
    this.colors = ['#000','#00f','#0c0','#c40'];

    this.activeColor = 0;
    this.activeButton = false;
    this.events = [false,false,false,false];
    this.buttonWidth = 20;
    this.gap = 7;
    this.buttonPadding = 5;
};
teka.extend(teka.ColorTool,teka.Tool);

/**
 * Sets the names and the values of the colors.
 * Names are indices in the dictionary. Colors are
 * written as CSS styles.
 */
teka.ColorTool.prototype.setColors = function(c)
{
    if (c.names!==undefined) {
        this.colorname = c.names;
    }
    if (c.colors!==undefined) {
        this.colors = c.colors;
    }
};

/** Returns the CSS style of the active color. */
teka.ColorTool.prototype.getColorString = function(color)
{
    return this.colors[color];
};

/** Sets the functions to call in case of events. */
teka.ColorTool.prototype.setEvents = function(setColor,copyColor,clearColor,setText)
{
    this.events[0] = setColor;
    this.events[1] = copyColor;
    this.events[2] = clearColor;
    this.events[3] = setText;
};

/** Sets the active color. */
teka.ColorTool.prototype.setColor = function(color)
{
    this.activeColor = color;
};

/** Resets all buttons */
teka.ColorTool.prototype.resetButtons = function()
{
    var changed = this.activeButton!==false;
    this.activeButton = false;
    return changed;
};

/**
 * Returns the minimum dimension of this tool:
 * The width of all buttons is determined by the longest text
 * plus twice the constant buttonPadding.
 * The width is the width of three buttons plus two gaps between
 * or, if greater, the maximum width of the headline.
 * The height is the height of the headline plus the
 * sum of the height of all buttons plus all gaps.
 */
teka.ColorTool.prototype.getMinDim = function(g)
{
    g.font = this.getButtonFont();
    this.buttonWidth =
        Math.max(g.measureText(teka.translate('coloring')).width,
                 g.measureText(teka.translate('deleting')).width)+
        2*this.buttonPadding;
    var width = Math.max(3*this.buttonWidth+2*this.gap);
    for (var i=0;i<this.colorname.length;i++) {
        width = Math.max(width,
            g.measureText(
                teka.translate('color_of_pen',
                    [teka.translate(this.colorname[this.activeColor])])).width);
    }

    var height = this.textHeight+
        this.colorname.length*(this.buttonHeight+this.gap);

    return { width:width, height:height };
};

/** Paints the tool on the screen. */
teka.ColorTool.prototype.paint = function(g)
{
    var mindim = this.getMinDim(g);
    this.delta = (this.width-mindim.width)/2;

    g.save();
    g.translate(this.delta,0);

    g.fillStyle = this.textcolor;
    g.textAlign = 'center';
    g.textBaseline = 'top';
    g.font = 'bold '+this.getTextFont();
    g.fillText(teka.translate('color_of_pen',
                              [teka.translate(this.colorname[this.activeColor])]),
               mindim.width/2,2);

    g.translate(0,this.textHeight+this.gap);

    var x = this.activeButton===false?-1:this.activeButton.x;
    var y = this.activeButton===false?-1:this.activeButton.y;

    for (var i=0;i<this.colorname.length;i++) {
        this.paintButton(g,0,0,this.buttonWidth,this.buttonHeight,
                         (i==this.activeColor || (x===0 && i==y))?this.BUTTON_ACTIVE:this.BUTTON_PASSIVE,
                         false);
        g.fillStyle = this.colors[i];
        g.fillRect(4,4,this.buttonWidth-8,this.buttonHeight-8);

        if (i!=this.activeColor) {
            this.paintButton(g,this.gap+this.buttonWidth,0,
                             this.buttonWidth,this.buttonHeight,
                             (x===1 && i==y)?this.BUTTON_ACTIVE:this.BUTTON_PASSIVE,
                             teka.translate('coloring'));
        }

        this.paintButton(g,2*(this.gap+this.buttonWidth),0,
                         this.buttonWidth,this.buttonHeight,
                         (x===2 && i==y)?this.BUTTON_ACTIVE:this.BUTTON_PASSIVE,
                         teka.translate('deleting'));

        g.translate(0,this.buttonHeight+this.gap);
    }

    g.restore();
};

/** Handle mousemove event */
teka.ColorTool.prototype.processMousemoveEvent = function(xc,yc,pressed)
{
    this.activeButton = this.getButton(xc,yc);
    if (this.activeButton===false) {
        return false;
    }

    var x = this.activeButton.x;
    var y = this.activeButton.y;

    if (x===0 && this.activeColor!=y) {
        if (this.events[3]!==false) {
            this.events[3](teka.translate('set_color',[teka.translate(this.colorname[y])]),false);
        }
        return true;
    }

    if (x===1 && this.activeColor!=y) {
        if (this.events[3]!==false) {
            this.events[3](teka.translate('change_color',[teka.translate(this.colorname[this.activeColor]+'_a'),teka.translate(this.colorname[y])]),false);
        }
        return true;
    }

    if (x==2) {
        if (this.events[3]!==false) {
            this.events[3](teka.translate('delete_color',[teka.translate(this.colorname[y]+'_a')]),false);
        }
        return true;
    }

    return false;
};

/** Handle mousedown event */
teka.ColorTool.prototype.processMousedownEvent = function(xc,yc)
{
    this.activeButton = this.getButton(xc,yc);
    if (this.activeButton===false) {
        return false;
    }

    var x = this.activeButton.x;
    var y = this.activeButton.y;

    if (x===0 && this.activeColor!=y) {
        if (this.events[0]!==false) {
            this.events[0](y);
        }
        return true;
    }

    if (x===1 && this.activeColor!=y) {
        if (this.events[1]!==false) {
            this.events[1](y);
        }
        return true;
    }

    if (x===2) {
        if (this.events[2]!==false) {
            this.events[2](y);
        }
        return true;
    }

    return false;
};

/**
 * Handle keydown event
 *
 * Only the first eight colors are supported, as most keyboard
 * do not have more than 12 function keys. Anyway, I cannot imagine,
 * that having more than 8 colors is useful.
 */
teka.ColorTool.prototype.processKeydownEvent = function(e)
{
    if (e.key>=teka.KEY_F5 && e.key<=teka.KEY_F12) {
        var y = e.key-teka.KEY_F5;
        if (y>=this.colorname.length) {
            return false;
        }
        if (e.shift===true) {
            if (this.events[1]!==false) {
                this.events[1](y);
            }
        } else if (e.ctrl===true) {
            if (this.events[2]!==false) {
                this.events[2](y);
            }
        } else {
            if (this.events[0]!==false) {
                this.events[0](y);
            }
        }
        return true;
    }

    return false;
};

/**
 * Calculate the button at coordinates xc, yc.
 * The return value will be an object with two values,
 * named x and y. x is 0 for setColor, 1 for copyColor
 * and 2 for clearColor. y is the button row.
 * If none of the buttons is hit, false is returned.
 */
teka.ColorTool.prototype.getButton = function(xc,yc)
{
    xc -= this.delta;
    for (var i=0;i<3;i++) {
        for (var j=0;j<this.colorname.length;j++) {
            if (xc>=i*(this.buttonWidth+this.gap)
                && xc<=i*(this.buttonWidth+this.gap)+this.buttonWidth
                && yc>=this.textHeight+this.gap+j*(this.buttonHeight+this.gap)
                && yc<=this.textHeight+this.gap+j*(this.buttonHeight+this.gap)+this.buttonHeight) {
                return {x:i,y:j};
            }
        }
    }
    return false;
};
