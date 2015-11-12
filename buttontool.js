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

teka.ButtonTool = function()
{
    teka.Tool.call(this);

    this.buttons_ = ['Testen','Rückgängig','Anleitung'];
    this.description_ = [
        'Überprüft, ob die Lösung richtig ist.',
        'Macht alles bis inklusive der letzten größeren Änderung (=färben, löschen) rückgängig. Nochmaliges Drücken macht das letzte Rückgängingmachen wieder rückgängig.',
        'Zeigt die Aufgabenstellung und eine Anleitung zur Bedienung dieses Applets an.'
    ];
    this.aktivButton = false;
    this.y = [0,0,0];
    this.events = [false,false,false,false];
};
teka.extend(teka.ButtonTool,teka.Tool);

teka.ButtonTool.prototype.setEvents = function(f1,f2,f3,f4)
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

teka.ButtonTool.prototype.getMinDim = function(g)
{
    g.font = this.getButtonFont();
    var w = g.measureText(this.buttons_[0]).width;
    w = Math.max(w,g.measureText(this.buttons_[1]).width);
    w = Math.max(w,g.measureText(this.buttons_[2]).width);
    var h = 3*(this.textHeight+5)+2*6;
    return { width:w+32, height:h };
};

teka.ButtonTool.prototype.paint = function(g)
{
    var mindim = this.getMinDim(g);
    var x = (this.width-mindim.width)/2;
    this.y[0] = 1;
    this.y[1] = Math.floor((this.height-(this.textHeight+5))/2);
    this.y[2] = this.height-(this.textHeight+5)-1;

    for (var i=0;i<=2;i++) {
        this.paintButton(g,x+0.5,this.y[i]+0.5,
                         mindim.width,this.textHeight+5,
                         this.aktivButton===i?this.BUTTON_ACTIVE:this.BUTTON_PASSIVE,this.buttons_[i]);
    }
};

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

teka.ButtonTool.prototype.processMousePressedEvent = function(xc,yc)
{
    this.aktivButton = this.getButton(xc,yc);
    if (this.aktivButton===-1) {
        return false;
    }

    if (this.events[this.aktivButton]!==false) {
        this.events[this.aktivButton]();
    }

    return true;
};

teka.ButtonTool.prototype.getButton = function(xc,yc)
{
    for (var i=0;i<3;i++) {
        if (yc>=this.y[i] && yc<=this.y[i]+this.textHeight+5) {
            return i;
        }
    }
    return false;
};

teka.ButtonTool.prototype.resetButtons = function()
{
    if (this.aktivButton===false) {
        return false;
    }
    this.aktivButton = false;
    return true;
};
