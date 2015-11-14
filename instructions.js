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
    
    this.mode = 0;
    this.aktivButton = false;
    this.event = false;
};
teka.extend(teka.Instructions,teka.Tool);

teka.Instructions.prototype.setEvent = function(f)
{
    if (f!==undefined) {
        this.event = f;
    }
};

teka.Instructions.prototype.paint = function(g)
{
    var bw = (this.width-30)/4;
    var bh = this.textHeight+5;
    
    this.paintButton(g,0,0,bw,bh,this.BUTTON_ACTIVE,teka.translate('problem'));
    this.paintButton(g,bw+10,0,bw,bh,this.BUTTON_ACTIVE,teka.translate('usage'));
    this.paintButton(g,2*bw+20,0,bw,bh,this.BUTTON_ACTIVE,teka.translate('usage_applet'));
    this.paintButton(g,3*bw+30,0,bw,bh,this.BUTTON_ACTIVE,teka.translate('back_to_puzzle'));
    
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
    }

    return true;
};

teka.Instructions.prototype.getButton = function(xc,yc)
{
    var bw = (this.width-30)/4;
    var bh = this.textHeight+5;
    
    for (var i=0;i<4;i++) {
        if (xc>=i*(10+bw) && xc<=i*(10+bw)+bw && yc>=0 && yc<=bh) {
            return i;
        }
    }
    return false;
};
