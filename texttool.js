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
 * Tool to display some text. The text may be highlighted.
 */
teka.TextTool = function()
{
    teka.Tool.call(this);

    this.text = '';
    this.textcolor = '#000';
    this.texthighlightcolor = '#f00';
    this.wrapped_text = false;
    this.printTextHeight = 12;
};
teka.extend(teka.TextTool,teka.Tool);

/**
 * Sets the text to display. If the second parameter is given
 * and set to true, the text will be highlighted.
 * Newlines can be used inside the text to indicate new paragraphs.
 * If neighter text nor highlight state are changed the
 * function returns false, else true. This helps the calling
 * function to decide, whether the tool has to be repainted.
 */
teka.TextTool.prototype.setText = function(g,t,highlight)
{
    if (this.text==t && this.highlight==highlight) {
        return false;
    }

    this.text = t;
    this.highlight = highlight;
    this.wrapText(g);
    return true;
};

/** Sets the color used for highlighted text. */
teka.TextTool.prototype.setHighlightColor = function(color)
{
    this.texthighlightcolor = color;
};

/**
 * Returns the minimum dimension of this tool, which is
 * three lines of text width 150 pixel.
 */
teka.TextTool.prototype.getMinDim = function(g)
{
    var h = 3*(this.textHeight+2);
    return { width:150, height:h };
};

/** Paints the text. */
teka.TextTool.prototype.paint = function(g)
{
    if (this.wrapped_text===false) {
        return;
    }

    g.fillStyle = this.highlight?this.texthighlightcolor:this.textcolor;
    g.textAlign = 'left';
    g.textBaseline = 'top';
    g.font = this.getTextFont(this.printTextHeight);

    var y = 2;
    for (var i=0;i<this.wrapped_text.length;i++) {
        if (this.wrapped_text[i]===null) {
            y+=5;
        } else {
            g.fillText(this.wrapped_text[i],0,y);
            y+=this.printTextHeight+2;
        }
    }
};

/**
 * Calculates how to wrap the text. Linebreaks can only occur at spaces.
 * If it doesn't fit into the extent, the size of the font is reduced
 * until it fits or the size is too small. In the later case, it might
 * happen, that part of the text is not displayed anymore.
 */
teka.TextTool.prototype.wrapText = function(g)
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
                while (c<toks.length && g.measureText(h+' '+toks[c]).width<this.width) {
                    h = h+' '+toks[c++];
                }
                v.push(h);
                ch+=this.printTextHeight+2;
            }

            // Add some extra space between paragraphs
            if (tpos<t.length) {
                v.push(null);
                ch+=5;
            }
        }

        if (ch<=this.height || this.printTextHeight<=9) {
            break;
        }

        // Try again with textsize reduced by one
        this.printTextHeight--;
    }

    this.wrapped_text = v;
};
