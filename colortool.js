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

var teka = teka || {};

teka.ColorTool = function()
{
    teka.Tool.call(this);

    this.colorname = ['schwarz','blau','grün','braun'];
    this.colornameAkk = ['schwarzen','blauen','grünen','braunen'];
    this.colors = ['#000','#00f','#0c0','#c40'];

    this.color = 0;
    this.buttonHeight = 20;
    this.buttonWidth = 100;
    this.aktivButton = false;
    this.events = [false,false,false,false];

    this.colorHeadline = '#000';
};
teka.extend(teka.ColorTool,teka.Tool);

teka.ColorTool.prototype.setColorHeadline = function(color)
{
    if (color!==undefined) {
        this.colorHeadline = color;
    }
};

teka.ColorTool.prototype.setColors = function(c)
{
    this.colorname = c.names;
    this.colornameAKK = c.names_akk;
    this.colors = c.colors;
};

teka.ColorTool.prototype.setEvents = function(f1,f2,f3,f4)
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
    if (f4!==undefined) {
        this.events[3] = f4;
    }
};

teka.ColorTool.prototype.setColor = function(color)
{
    this.color = color;
};

teka.ColorTool.prototype.getColorString = function(color)
{
    return this.colors[color];
};

teka.ColorTool.prototype.getMinDim = function(g)
{
    g.font = this.getButtonFont();
    var w = g.measureText("färben").width;
    w = Math.max(w,g.measureText("löschen").width)+6;
    w = 14+Math.max(g.measureText("Stiftfarbe: schwarz").width,3*w);
    var h = 5*(this.textHeight+5)+26;
    return { width:w, height:h };
};

teka.ColorTool.prototype.processMouseMovedEvent = function(xc,yc)
{
    this.aktivButton = this.getButton(xc,yc);
    if (this.aktivButton===false) {
        return false;
    }

    var x = this.aktivButton.x;
    var y = this.aktivButton.y;

    if (x===0 && this.color!=y) {
        if (this.events[3]!==false) {
            this.events[3]('Setzt die Stiftfarbe auf '+this.colorname[y]+'.',false);
        }
        return true;
    }

    if (x===1 && this.color!=y) {
        if (this.events[3]!==false) {
            this.events[3]('Färbt alle Felder mit '+this.colornameAkk[this.color]+' Symbolen '+this.colorname[y]+' ein.',false);
        }
        return true;
    }

    if (x==2) {
        if (this.events[3]!==false) {
            this.events[3]('Löscht alle Felder mit '+this.colornameAkk[y]+' Symbolen.',false);
        }
        return true;
    }

    return false;
};

teka.ColorTool.prototype.processMousePressedEvent = function(xc,yc)
{
    this.aktivButton = this.getButton(xc,yc);
    if (this.aktivButton===false) {
        return false;
    }

    var x = this.aktivButton.x;
    var y = this.aktivButton.y;

    if (x===0 && this.color!=y) {
        if (this.events[0]!==false) {
            this.events[0](y);
        }
        return true;
    }

    if (x===1 && this.color!=y) {
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

teka.ColorTool.prototype.paint = function(g)
{
    g.fillStyle = this.colorHeadline;
    g.textAlign = 'center';
    g.textBaseline = 'top';
    g.font = this.getButtonFont();
    g.fillText('Stiftfarbe: '+this.colorname[this.color],this.width/2,2);

    this.buttonHeight = (this.height-26)/5;
    this.buttonWidth = (this.width-14)/3;

    var x = this.aktivButton===false?-1:this.aktivButton.x;
    var y = this.aktivButton===false?-1:this.aktivButton.y;

    for (var i=1;i<5;i++) {
        this.paintButton(g,1,1+i*(this.buttonHeight+6),
                         this.buttonWidth,this.buttonHeight,
                         (i-1==this.color || (x===0 && i-1==y))?this.BUTTON_ACTIVE:this.BUTTON_PASSIVE,
                         false);
        if (i-1!=this.color) {
            this.paintButton(g,7+this.buttonWidth,1+i*(this.buttonHeight+6),
                             this.buttonWidth,this.buttonHeight,
                             (x===1 && i-1==y)?this.BUTTON_ACTIVE:this.BUTTON_PASSIVE,
                             'färben');
        }
        this.paintButton(g,13+2*this.buttonWidth,1+i*(this.buttonHeight+6),
                         this.buttonWidth,this.buttonHeight,
                         (x===2 && i-1==y)?this.BUTTON_ACTIVE:this.BUTTON_PASSIVE,
                         'löschen');

        g.fillStyle = this.colors[i-1];
        g.fillRect(5,5+i*(this.buttonHeight+6),
                   this.buttonWidth-8,this.buttonHeight-8);
    }
};

teka.ColorTool.prototype.getButton = function(xc,yc)
{
    for (var i=0;i<3;i++) {
        for (var j=1;j<=4;j++) {
            if (xc>=1+i*(this.buttonWidth+6)
                && xc<=1+i*(this.buttonWidth+6)+this.buttonWidth
                && yc>=1+j*(this.buttonHeight+6)
                && yc<=1+j*(this.buttonHeight+6)+this.buttonHeight) {
                return {x:i,y:j-1};
            }
        }
    }
    return false;
};
