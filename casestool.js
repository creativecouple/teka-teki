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

teka.CasesTool = function()
{
    teka.Tool.call(this);

    this.aktivButton = false;
    this.delta = 0;
    this.stack = [];
    this.events = [false,false,false,false];
    this.colorNormalText = '#000';
};
teka.extend(teka.CasesTool,teka.Tool);

teka.CasesTool.prototype.setColorNormalText = function(color)
{
    if (color!==undefined) {
        this.colorNormalText = color;
    }
};

teka.CasesTool.prototype.setEvents = function(f1,f2,f3)
{
    if (f1!==undefined) {
        this.events[0] = f1;
    }
    if (f2!==undefined) {
        this.events[1] = f2;
    }
    if (f3!==undefined) {
        this.events[2] = f3;
    }
};

teka.CasesTool.prototype.getMinDim = function(g)
{
    g.font = this.getButtonFont();
    return { width:g.measureText(teka.translate('level',['9'])).width+2*this.textHeight+14,
             height:this.textHeight+7 };
};

teka.CasesTool.prototype.paint = function(g)
{
    var mindim = this.getMinDim(g);
    this.delta = (this.width-mindim.width)/2;
    g.save();
    g.translate(this.delta,0);

    var half = (this.textHeight+5)/2;

    var button = this.aktivButton===false?-1:this.aktivButton;

    if (this.stack.length<9) {
        this.paintButton(g,1.5,1.5,this.textHeight+5,this.textHeight+5,
                         button===0?this.BUTTON_ACTIVE:this.BUTTON_PASSIVE,false);

        g.strokeStyle = this.colorText;
        g.beginPath();
        g.moveTo(5,half+1);
        g.lineTo(half+half-3,half+1);
        g.stroke();
        g.beginPath();
        g.moveTo(half+1,5);
        g.lineTo(half+1,half+half-3);
        g.stroke();
    }

    if (this.stack.length>0) {
        this.paintButton(g,this.textHeight+12.5,1.5,this.textHeight+5,this.textHeight+5,
                         button===1?this.BUTTON_ACTIVE:this.BUTTON_PASSIVE,false);

        g.strokeStyle = this.colorText;
        g.beginPath();
        g.moveTo(this.textHeight+11+5,half+1);
        g.lineTo(this.textHeight+11+half+half-3,half+1);
        g.stroke();
    }

    g.fillStyle = this.colorNormalText;
    g.textAlign = 'left';
    g.textBaseline = 'middle';
    g.font = this.getButtonFont();
    g.fillText(teka.translate('level',[this.stack.length]),
               2*this.textHeight+23.5,
               1.5+(this.textHeight+5)/2);

    g.restore();
};

teka.CasesTool.prototype.processMouseMovedEvent = function(xc,yc)
{
    this.aktivButton = this.getButton(xc,yc);
    if (this.aktivButton===-1) {
        return false;
    }

    if (this.aktivButton===0 && this.stack.length<9) {
        if (this.events[2]!==false) {
            this.events[2](teka.translate('save_state'),false);
        }
        return true;
    }

    if (this.aktivButton===1 && this.stack.length>0) {
        if (this.events[2]!==false) {
            this.events[2](teka.translate('load_state'),false);
        }
        return true;
    }

    return false;
};

teka.CasesTool.prototype.processMousePressedEvent = function(xc,yc)
{
    this.aktivButton = this.getButton(xc,yc);
    if (this.aktivButton===-1) {
        return false;
    }

    if (this.aktivButton===0 && this.stack.length<9) {
        if (this.events[0]!==false) {
            this.stack.push(this.events[0]());
        }
        return true;
    }

    if (this.aktivButton===1 && this.stack.length>0) {
        if (this.events[1]!==false) {
            this.events[1](this.stack.pop());
        }
        return true;
    }

    return true;
};

teka.CasesTool.prototype.getButton = function(xc,yc)
{
    xc -= this.delta;

    if (xc>=2 && xc<=2+this.textHeight+5 && yc>=1 && yc<1+this.textHeight+5) {
        return 0;
    }
    if (xc>=this.textHeight+13 && xc<=2*this.textHeight+18 && yc>=1 && yc<1+this.textHeight+5) {
        return 1;
    }
    return false;
};
