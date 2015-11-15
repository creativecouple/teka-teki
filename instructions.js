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

    this.buttonText = [
        teka.translate('problem'),
        teka.translate('usage'),
        teka.translate('usage_applet'),
        teka.translate('back_to_puzzle'),
        teka.translate('next'),
        teka.translate('back')
    ];

    this.bw = 50;
    this.bh = 10;

    this.text = false;
    this.instructions = '';
    this.usage = '';

    this.mode = 0;
    this.page = 0;
    this.aktivButton = false;
    this.event = false;

    this.graphics = null;
    this.textcolor = '#000';

    this.exampleViewer = false;
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

teka.Instructions.prototype.setExampleViewer = function(ex)
{
    this.exampleViewer = ex;
};

teka.Instructions.prototype.setGraphics = function(g)
{
    this.graphics = g;
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
    this.text[0] = this.wrap(this.instructions,w-210,h-2*this.bh-40-this.bh*2);
    this.text[1] = this.wrap(this.usage,w,h-2*this.bh-40-this.bh*2);
    this.text[2] = this.wrap(teka.translate('instructions_global'),
                             w,h-2*this.bh-40-this.bh*2);
};

teka.Instructions.prototype.initExample = function(w,h)
{
    this.exampleViewer.setExtent(0,0,200,h/2-this.bh-20);
    this.exampleViewer.setMetrics();
};

teka.Instructions.prototype.setEvent = function(f)
{
    if (f!==undefined) {
        this.event = f;
    }
};

teka.Tool.prototype.getTitleFont = function()
{
    return 'bold '+(2*this.textHeight)+'px sans-serif';
};

teka.Instructions.prototype.paint = function(g)
{
    this.paintButton(g,0,0,this.bw,this.bh,
                     this.mode===0?this.BUTTON_DEACTIVATED:
                         (this.aktivButton===0?this.BUTTON_ACTIVE:this.BUTTON_PASSIVE),
                     this.buttonText[0]);
    this.paintButton(g,this.bw+10,0,this.bw,this.bh,
                     this.mode===1?this.BUTTON_DEACTIVATED:
                         (this.aktivButton===1?this.BUTTON_ACTIVE:this.BUTTON_PASSIVE),
                     this.buttonText[1]);
    this.paintButton(g,2*this.bw+20,0,this.bw,this.bh,
                     this.mode===2?this.BUTTON_DEACTIVATED:
                         (this.aktivButton===2?this.BUTTON_ACTIVE:this.BUTTON_PASSIVE),
                     this.buttonText[2]);
    this.paintButton(g,3*this.bw+30,0,this.bw,this.bh,
                     this.aktivButton===3?this.BUTTON_ACTIVE:this.BUTTON_PASSIVE,
                     this.buttonText[3]);

    if (this.mode==0) {
        g.save();
        g.translate(this.width-210,this.bh+20);
        this.exampleViewer.paint(g);
        g.restore();
        this.exampleViewer.addSolution();
        g.save();
        g.translate(this.width-210,this.bh+this.height/2+5);
        this.exampleViewer.paint(g);
        g.restore();
        this.exampleViewer.reset();
    }

    g.fillStyle = this.textcolor;
    g.textAlign = 'left';
    g.textBaseline = 'top';
    g.font = this.getTitleFont();

    g.fillText(this.buttonText[this.mode],0,this.bh+20);

    g.font = this.getTextFont();
    var y = this.bh+50+this.textHeight*2;
    var lh = this.textHeight;
    for (var i=0;i<this.text[this.mode][this.page].length;i++) {
        if (this.text[this.mode][this.page][i]!==null) {
            g.fillText(this.text[this.mode][this.page][i],0,y);
        }
        y += lh;
    }

    if (this.page==0 && this.text[this.mode].length>1) {
        this.paintButton(g,(this.width-(this.mode==0?200:0)-this.bw)/2,this.height-this.bh,this.bw,this.bh,
                         this.aktivButton===4?this.BUTTON_ACTIVE:this.BUTTON_PASSIVE,
                         this.buttonText[4]);
    }
    if (this.page==this.text[this.mode].length-1 && this.text[this.mode].length>1) {
        this.paintButton(g,(this.width-(this.mode==0?200:0)-this.bw)/2,this.height-this.bh,this.bw,this.bh,
                         this.aktivButton===5?this.BUTTON_ACTIVE:this.BUTTON_PASSIVE,
                         this.buttonText[5]);
    }
    if (this.page>0 && this.page<this.text[this.mode].length-1) {
        this.paintButton(g,(this.width-(this.mode==0?200:0))/2+5,this.height-this.bh,this.bw,this.bh,
                         this.aktivButton===4?this.BUTTON_ACTIVE:this.BUTTON_PASSIVE,
                         this.buttonText[4]);
        this.paintButton(g,(this.width-(this.mode==0?200:0))/2-this.bw-5,this.height-this.bh,this.bw,this.bh,
                         this.aktivButton===5?this.BUTTON_ACTIVE:this.BUTTON_PASSIVE,
                         this.buttonText[5]);
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

    if (this.aktivButton==4 && this.page<this.text[this.mode].length-1) {
        this.page++;
        this.aktivButton = this.getButton(xc,yc);
    } else if (this.aktivButton==5 && this.page>0) {
        this.page--;
        this.aktivButton = this.getButton(xc,yc);
    } else if (this.aktivButton==3) {
        this.event(false);
    } else {
        this.mode = this.aktivButton;
        this.page = 0;
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

    if (yc>=this.height-this.bh && yc<=this.height) {
        if (this.page==0) {
            if (xc>=(this.width-(this.mode==0?200:0)-this.bw)/2 &&
                xc<=(this.width-(this.mode==0?200:0)+this.bw)/2)
                return 4;
        }
        if (this.page==this.text[this.mode].length-1) {
            if (xc>=(this.width-(this.mode==0?200:0)-this.bw)/2 &&
                xc<=(this.width-(this.mode==0?200:0)+this.bw)/2)
                return 5;
        }
        if (this.page>0 && this.page<this.text[this.mode].length-1) {
            if (xc>=(this.width-(this.mode==0?200:0))/2-this.bw-5 &&
                xc<=(this.width-(this.mode==0?200:0))/2-5)
                return 5;
            if (xc>=(this.width-(this.mode==0?200:0))/2+5 &&
                xc<=(this.width-(this.mode==0?200:0))/2+this.bw+5)
                return 4;
        }
    }

    return false;
};

teka.Instructions.prototype.wrap = function(text,width,height)
{
    var vv = [];
    var v = [];

    var ch = 0;

    var t = text.split('\n');
    var first = true;

    this.graphics.font = this.getTextFont();
    while (t.length>0) {
        var par = t.shift();
        if (par==='\n') {
            if (first) {
                first = false;
                continue;
            }
            ch += this.textHeight;
            v.push(null);
        }
        first = true;

        var t2 = par.split(' ');
        var az = t2.length;
        var c = 0;
        while (c<az) {
            var h = t2[c++];
            while (c<az && this.graphics.measureText(h+' '+t2[c]).width<width) {
                h = h+' '+t2[c++];
            }
            ch += this.textHeight;
            v.push(h);

            if (ch+this.textHeight>height-this.textHeight) {
                vv.push(v);
                v = [];
                ch = 0;
            }
        }
    }

    if (v.length>0) {
        vv.push(v);
    }

    return vv;
};
