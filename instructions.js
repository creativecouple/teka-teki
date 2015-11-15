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

teka.Instructions = function()
{
    teka.Tool.call(this);

    this.bw = 50;
    this.bh = 10;

    this.text = false;
    this.instructions = '';
    this.usage = '';

    this.mode = 0;
    this.aktivButton = false;
    this.event = false;
};
teka.extend(teka.Instructions,teka.Tool);

teka.Instructions.prototype.setInstructions = function(instructions)
{
    this.instructions = instructions;
};

teka.Instructions.prototype.setUsage = function(usage)
{
    this.usage = usage;
};

teka.Instructions.prototype.setExtent = function(left,top,width,height)
{
    this.setExtent_(left,top,width,height);

    this.initButtons(this.width,this.height);
    this.initTexts(this.width,this.height);
    this.initExample(this.width,this.height);
};

teka.Instructions.prototype.initButtons = function(w,h)
{
    this.bw = (this.width-30)/4;
    this.bh = this.textHeight+5;
};

teka.Instructions.prototype.initTexts = function(w,h)
{
    this.text = [];
    this.text[0] = this.wrap(this.instructions,w-230,h-2*this.bh-20);
    this.text[1] = this.wrap(this.usage,w-20,h-2*this.bh-20);
    this.text[2] = this.wrap(teka.translate('instructions_global'),
                             w-20,h-2*this.bh-20);
};

teka.Instructions.prototype.initExample = function(w,h)
{
};

teka.Instructions.prototype.setEvent = function(f)
{
    if (f!==undefined) {
        this.event = f;
    }
};

teka.Instructions.prototype.paint = function(g)
{
    this.paintButton(g,0,0,this.bw,this.bh,
                     this.mode===0?this.BUTTON_DEACTIVATED:
                         (this.aktivButton===0?this.BUTTON_ACTIVE:this.BUTTON_PASSIVE),
                     teka.translate('problem'));
    this.paintButton(g,this.bw+10,0,this.bw,this.bh,
                     this.mode===1?this.BUTTON_DEACTIVATED:
                         (this.aktivButton===1?this.BUTTON_ACTIVE:this.BUTTON_PASSIVE),
                     teka.translate('usage'));
    this.paintButton(g,2*this.bw+20,0,this.bw,this.bh,
                     this.mode===2?this.BUTTON_DEACTIVATED:
                         (this.aktivButton===2?this.BUTTON_ACTIVE:this.BUTTON_PASSIVE),
                     teka.translate('usage_applet'));
    this.paintButton(g,3*this.bw+30,0,this.bw,this.bh,
                     this.aktivButton===3?this.BUTTON_ACTIVE:this.BUTTON_PASSIVE,
                     teka.translate('back_to_puzzle'));

    switch (this.mode) {
      case 0:
        // paintProblem
        break;
      case 1:
        // paintUsage
        break;
      case 2:
        // paintUsageApplet
        break;
    }
};

teka.Instructions.prototype.processMouseMovedEvent = function(xc,yc)
{
    this.aktivButton = this.getButton(xc,yc);
    if (this.aktivButton===-1) {
        return false;
    }

    return true;
};

teka.Instructions.prototype.processMousePressedEvent = function(xc,yc)
{
    this.aktivButton = this.getButton(xc,yc);
    if (this.aktivButton===-1) {
        return false;
    }

    if (this.aktivButton==3) {
        this.event(false);
    } else {
        this.mode = this.aktivButton;
    }

    return true;
};

teka.Instructions.prototype.getButton = function(xc,yc)
{
    for (var i=0;i<4;i++) {
        if (xc>=i*(10+this.bw) && xc<=i*(10+this.bw)+this.bw && yc>=0 && yc<=this.bh) {
            return i;
        }
    }
    return false;
};

teka.Instructions.prototype.wrap = function(text,w,h)
{
    console.log('wrapping: '+text);
    return [];
};
