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
 * Displays the instructions of the puzzle, the usage of the
 * puzzle viewer and the usage of the applet as a whole.
 * Beneath the instructions of the puzzle, a small example
 * with solution is shown.
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

    this.buttonWidth = 50;
    this.gap = 5;
    this.imageWidth = 200;
    this.imageHeight = 200;
    this.headlineHeight = 20;
    this.textareaHeight = 200;

    this.text = false;
    this.instructions = '';
    this.usage = '';

    this.mode = 0;
    this.page = 0;
    this.activeButton = false;
    this.event = false;

    this.graphics = null;

    this.exampleViewer = false;
};
teka.extend(teka.Instructions,teka.Tool);

/** Sets the instructions vor the puzzle */
teka.Instructions.prototype.setInstructions = function(instructions)
{
    this.instructions = instructions;
};

/** Sets the usage for the viewer */
teka.Instructions.prototype.setUsage = function(usage)
{
    this.usage = usage;
};

/** Saves the image */
teka.Instructions.prototype.setGraphics = function(g)
{
    this.graphics = g;
};

/** Sets the gap between the tools. */
teka.Instructions.prototype.setGap = function(gap) {
    this.gap = gap;
};

/** Sets the viewer to be used to display the example. */
teka.Instructions.prototype.setExampleViewer = function(ex)
{
    this.exampleViewer = ex;
};

/** Sets the event which toggles the display of instructions. */
teka.Instructions.prototype.setEvent = function(setInstructions)
{
    this.event = setInstructions;
};

/**
 * Sets the extent and inits buttons, texts and example.
 * Calls the function in the 'superclass'. As this concept does
 * not exist in javascript, the superclass 'display' contains
 * two versions of setExtent, the one without _ to be overridden,
 * the other one to be used here.
 */
teka.Instructions.prototype.setExtent = function(left,top,width,height)
{
    this.setExtent_(left,top,width,height);

    this.initButtons();
    this.initExample();
    this.initTexts();
};

/** Calculate the width of the buttons. */
teka.Instructions.prototype.initButtons = function()
{
    this.buttonWidth = (this.width-30)/4;
};

/**
 * Calculates the extent of the example.
 * If the example needs less width than the 200px available.
 * The available space is reduced to have more space for the text.
 */
teka.Instructions.prototype.initExample = function()
{
    this.imageHeight = (this.height-this.buttonHeight-2*this.gap)/2;
    this.exampleViewer.setExtent(0,0,200,this.imageHeight);
    var metrics = this.exampleViewer.setMetrics(this.graphics);
    this.imageWidth = metrics.width;
    this.exampleViewer.setExtent(0,0,this.imageWidth,this.imageHeight);
    this.exampleViewer.setMetrics(this.graphics);
};

/** Wraps the three texts */
teka.Instructions.prototype.initTexts = function()
{
    this.headlineHeight = 2*this.textHeight+15;
    this.textareaHeight = this.height-2*this.buttonHeight-2*this.gap-
                          this.headlineHeight;

    this.text = [];
    this.text[0] = this.wrap(this.instructions,
                             this.width-this.imageWidth-this.gap,
                             this.textareaHeight);
    this.text[1] = this.wrap(this.usage,
                             this.width,
                             this.textareaHeight);
    this.text[2] = this.wrap(teka.translate('instructions_global'),
                             this.width,
                             this.textareaHeight);
};

/** Title is displayed twice as height as normal text. */
teka.Instructions.prototype.getTitleFont = function()
{
    return 'bold '+(2*this.textHeight)+'px sans-serif';
};

//////////////////////////////////////////////////////////////////

/** Paints the instructions on the screen. */
teka.Instructions.prototype.paint = function(g)
{
    // top buttons
    for (var i=0;i<=3;i++) {
        this.paintButton(g,i*(this.buttonWidth+10),0,
                         this.buttonWidth,this.buttonHeight,
                         this.mode===i?this.BUTTON_DEACTIVATED:
                         (this.activeButton===i?this.BUTTON_ACTIVE:this.BUTTON_PASSIVE),
                         this.buttonText[i]);
    }

    g.save();
    g.translate(0,this.buttonHeight+this.gap);

    // Should we show the examples?
    if (this.mode===0) {
        g.save();
        g.translate(this.width-this.imageWidth,0);
        this.exampleViewer.paint(g);
        g.restore();

        this.exampleViewer.addSolution();
        g.save();
        g.translate(this.width-this.imageWidth,Math.floor(this.imageHeight+this.gap));
        this.exampleViewer.paint(g);
        g.restore();
        this.exampleViewer.reset();
    }

    g.save();

    // Clip to avoid headline overlapping image
    if (this.mode===0) {
        g.beginPath();
        g.moveTo(0,0);
        g.lineTo(this.width-this.imageWidth-this.gap,0);
        g.lineTo(this.width-this.imageWidth-this.gap,this.headlineHeight);
        g.lineTo(0,this.headlineHeight);
        g.closePath();
        g.clip();
    }

    // headline
    g.fillStyle = this.textcolor;
    g.textAlign = 'left';
    g.textBaseline = 'top';
    g.font = this.getTitleFont();
    g.fillText(this.buttonText[this.mode]+
               (this.page>0?(' ('+teka.translate('continuation')+')'):''),
               0,2);
    g.restore();

    g.translate(0,this.headlineHeight);

    // textarea
    g.fillStyle = this.textcolor;
    g.textBaseline = 'top';
    g.font = this.getTextFont();
    var y = 2;
    for (var i=0;i<this.text[this.mode][this.page].length;i++) {
        if (this.text[this.mode][this.page][i]!==null) {
            g.fillText(this.text[this.mode][this.page][i],0,y);
        }
        y += this.textHeight+2;
    }

    g.translate(0,this.textareaHeight+this.gap);

    // bottom buttons
    var delta = (this.mode===0?(this.imageWidth+this.gap):0);

    if (this.page===0 && this.text[this.mode].length>1) {
        this.paintButton(g,(this.width-delta-this.buttonWidth)/2,0,
                         this.buttonWidth,this.buttonHeight,
                         this.activeButton===4?this.BUTTON_ACTIVE:this.BUTTON_PASSIVE,
                         this.buttonText[4]);
    }
    if (this.page==this.text[this.mode].length-1 && this.text[this.mode].length>1) {
        this.paintButton(g,(this.width-delta-this.buttonWidth)/2,0,
                         this.buttonWidth,this.buttonHeight,
                         this.activeButton===5?this.BUTTON_ACTIVE:this.BUTTON_PASSIVE,
                         this.buttonText[5]);
    }
    if (this.page>0 && this.page<this.text[this.mode].length-1) {
        this.paintButton(g,(this.width-delta)/2+5,0,
                         this.buttonWidth,this.buttonHeight,
                         this.activeButton===4?this.BUTTON_ACTIVE:this.BUTTON_PASSIVE,
                         this.buttonText[4]);
        this.paintButton(g,(this.width-delta)/2-this.buttonWidth-5,0,
                         this.buttonWidth,this.buttonHeight,
                         this.activeButton===5?this.BUTTON_ACTIVE:this.BUTTON_PASSIVE,
                         this.buttonText[5]);
    }

    g.restore();
};

/** Handle mousemove event */
teka.Instructions.prototype.processMousemoveEvent = function(xc,yc,pressed)
{
    var last = this.activeButton;
    this.activeButton = this.getButton(xc,yc);
    return this.activeButton!==last;
};

/** Handle mousedown event */
teka.Instructions.prototype.processMousedownEvent = function(xc,yc)
{
    var last = this.activeButton;
    this.activeButton = this.getButton(xc,yc);
    if (this.activeButton===false) {
        return this.activeButton!==last;
    }

    if (this.activeButton==4 && this.page<this.text[this.mode].length-1) {
        this.page++;
        this.activeButton = this.getButton(xc,yc);
    } else if (this.activeButton==5 && this.page>0) {
        this.page--;
        this.activeButton = this.getButton(xc,yc);
    } else if (this.activeButton==3) {
        if (this.event!==false) {
            this.event(false);
        }
    } else {
        this.mode = this.activeButton;
        this.page = 0;
    }

    return true;
};

/** Handle keydown event */
teka.Instructions.prototype.processKeydownEvent = function(e)
{
    if (e.key==teka.KEY_RIGHT) {
        if (this.activeButton===false || this.activeButton>3) {
            this.activeButton = 3;
        } else if (this.activeButton<3) {
            this.activeButton++;
        }
        return true;
    }

    if (e.key==teka.KEY_LEFT) {
        if (this.activeButton===false || this.activeButton>3) {
            this.activeButton = 0;
        } else if (this.activeButton>0) {
            this.activeButton--;
        }
        return true;
    }

    if (e.key==teka.KEY_ENTER) {
        if (this.activeButton!==false && this.activeButton<3) {
            this.mode = this.activeButton;
            this.page = 0;
        } else if (this.activeButton===3) {
            if (this.event!==false) {
                this.event(false);
            }
        }
        return true;
    }

    if (e.key==teka.KEY_DOWN) {
        if (this.page<this.text[this.mode].length-1) {
            this.page++;
        }
        return true;
    }

    if (e.key==teka.KEY_UP) {
        if (this.page>0) {
            this.page--;
        }
        return true;
    }

    return false;
};

/**
 * Calculate the number of the button at coordinates xc, yc.
 * 0 to 3 are the buttons at the top.
 * 4 is the next button and 5 is the back button.
 */
teka.Instructions.prototype.getButton = function(xc,yc)
{
    for (var i=0;i<4;i++) {
        if (xc>=i*(10+this.buttonWidth) && xc<=i*(10+this.buttonWidth)+this.buttonWidth &&
            yc>=0 && yc<=this.buttonHeight) {
            return i;
        }
    }

    var delta = (this.mode===0?(this.imageWidth+this.gap):0);

    if (yc>=this.height-this.buttonHeight && yc<=this.height) {
        if (this.page===0) {
            if (xc>=(this.width-delta-this.buttonWidth)/2 &&
                xc<=(this.width-delta+this.buttonWidth)/2) {
                return 4;
            }
        }
        if (this.page==this.text[this.mode].length-1) {
            if (xc>=(this.width-delta-this.buttonWidth)/2 &&
                xc<=(this.width-delta+this.buttonWidth)/2) {
                return 5;
            }
        }
        if (this.page>0 && this.page<this.text[this.mode].length-1) {
            if (xc>=(this.width-delta)/2-this.buttonWidth-5 &&
                xc<=(this.width-delta)/2-5) {
                return 5;
            }
            if (xc>=(this.width-delta)/2+5 &&
                xc<=(this.width-delta)/2+this.buttonWidth+5) {
                return 4;
            }
        }
    }

    return false;
};

/**
 * Wraps the given text. If the text does not fit in the
 * area spanned by width and height, several pages are
 * created.
 */
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
            ch += this.textHeight+2;
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
            ch += this.textHeight+2;
            v.push(h);

            if (ch+this.textHeight+2>height) {
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
