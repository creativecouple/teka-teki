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

teka.TextTool = function()
{
    teka.Tool.call(this);

    this.text = '';
    this.textcolor = '#000';
    this.texthighlightcolor = '#f00';
    this.wrapped_text = false;
};
teka.extend(teka.TextTool,teka.Tool);

teka.TextTool.prototype.getMinDim = function(g)
{
    var h = 3*this.textHeight+8;
    return { width:150, height:h };
};

teka.TextTool.prototype.setText = function(t,highlight)
{
    if (this.text==t && this.highlight==highlight) {
        return false;
    }

    this.text = t;
    this.highlight = highlight;
    this.wrapped_text = false;
    return true;
};

teka.TextTool.prototype.setTextcolor = function(color)
{
    this.textcolor = color;
};

teka.TextTool.prototype.setHighlight = function(color)
{
    this.texthighlightcolor = color;
};

teka.TextTool.prototype.paint = function(g)
{
    if (this.text===undefined) {
        return;
    }
    if (this.wrapped_text===false) {
        this.wrapText(g);
    }

    g.fillStyle = this.highlight?this.texthighlightcolor:this.textcolor;
    g.textAlign = 'left';
    g.textBaseline = 'top';
    g.font = this.getTextFont();

    var y = 2;
    for (var i=0;i<this.wrapped_text.length;i++) {
        if (this.wrapped_text[i]===null) {
            y+=5;
            continue;
        }
        g.fillText(this.wrapped_text[i],0,y);
        y+=this.textHeight+2;
    }
};

teka.TextTool.prototype.wrapText = function(g)
{
    var s = this.text;
    var v = [];

    while (true) {
        g.font = this.getTextFont();
        v = [];
        var ch = this.textHeight;
        var t = s.split('\n');
        var tpos = 0;
        while (tpos<t.length) {
            var par = t[tpos++];

            var toks = par.split(' ');

            var c = 0;
            while (c<toks.length) {
                var h = toks[c++];
                while (c<toks.length && g.measureText(h+' '+toks[c]).width<this.width-10) {
                    h = h+' '+toks[c++];
                }
                v.push(h);
                ch+=this.textHeight+2;
            }

            if (tpos<t.length) {
                v.push(null);
                ch+=5;
            }
        }

        if (ch<=this.height || this.textHeight<=6) {
            break;
        }

        this.textHeight--;
    }

    this.wrapped_text = v;
};
