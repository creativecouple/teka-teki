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

var teka = {};

teka.Defaults = {
    TEXTCOLOR: '#000000',
    HIGHLIGHTCOLOR: '#ff0000',
    HEADFONTHEIGHT: 20,
    HEADHEIGHT: 28,
    HEADCOLOR: '#000000',
    HEADTEXT: '',
    BUTTON_COLOR_ACTIVE: '#303030',
    BUTTON_COLOR_PASSIVE: '#606060',
    BUTTON_COLOR_BORDER_DARK: '#202020',
    BUTTON_COLOR_BORDER_BRIGHT: '#A0A0A0',
    BUTTON_COLOR_TEXT: '#FFFFFF',
    BUTTON_TEXT_HEIGHT: 12,
    PUZZLEMARGIN: 10,
    TOOLGAP:20,
    SOLVED_COLOR: [
        '#101010','#303030','#505050','#707070',
        '#909090','#A0A0A0','#B0B0B0','#C0C0C0'
    ],
    COLORTOOL_COLORS: {
        colors: ['#000','#00f','#0c0','#c40'],
        names: ['schwarz','blau','grün','braun'],
    },
    FILE: false
};

/** Overall width of the applet */
teka.Defaults.WIDTH = 500;

/** Overall height of the applet */
teka.Defaults.HEIGHT = 350;

/** Name (ID) of the target html-container, where the applet will
    be inserted. The html-container should be empty to avoid side-
    conflicts. */
teka.Defaults.TARGET = 'applet';

/** CSS-style of the border of the applet. */
teka.Defaults.BORDER = '1px solid black';

/** Background color of the applet. */
teka.Defaults.BACKGROUND_COLOR = '#EEE';

/** Outline color of the default logo. */
teka.Defaults.LOGO_OUTLINE_COLOR = '#000';

/** Fill color of the default logo. */
teka.Defaults.LOGO_FILL_COLOR = '#888';

/** Language to be used to display texts. */
teka.Defaults.LANGUAGE = 'de';
    
teka.PuzzleApplet = function(options)
{
    this.setDefaults();

    if (options !== undefined) {
        this.setOptions(options);
    }

    this.showInstructions = false;
    this.canvas = this.addCanvas();
    this.image = this.canvas.getContext('2d');

    this.paintLogo();

    teka.addScript('language/'+this.values_.LANGUAGE+'.js', teka.myBind(this,function() {
        setTimeout(this.init.bind(this),1000);
    }));
};

teka.PuzzleApplet.prototype.setDefaults = function()
{
    this.values_ = {};
    for (var k in teka.Defaults) {
        this.values_[k] = teka.Defaults[k];
    }
};

teka.PuzzleApplet.prototype.setOptions = function(options)
{
    for (var k in options) {
        if (this.values_[k] !== undefined) {
            this.values_[k] = options[k];
        }
    }
};

teka.PuzzleApplet.prototype.setText = function(text, highlight)
{
    if (this.tt!==undefined) {
        if (this.tt.setText(text,highlight)) {
            this.paint();
        }
    }
};

teka.PuzzleApplet.prototype.addCanvas = function()
{
    var canvas = document.createElement('canvas');
    canvas.width = this.values_.WIDTH;
    canvas.height = this.values_.HEIGHT;
    canvas.style.width = canvas.width+'px';
    canvas.style.height = canvas.height+'px';
    canvas.style.border = this.values_.BORDER;
    canvas.style.outline = '0px';
    canvas.setAttribute('tabindex','1');
    document.getElementById(this.values_.TARGET).appendChild(canvas);
    canvas.focus();
    return canvas;
};

/** Paints a simple Teka-Teki logo on the screen until loading
 *  of the puzzle and additional script files has beend done.
 *  Fill and outline color can be customized using LOGO_FILL_COLOR
 *  and LOGO_OUTLINE_COLOR.
 */
teka.PuzzleApplet.prototype.paintLogo = function()
{
    var image = this.image;
    var width = this.canvas.width;
    var height = this.canvas.height;
    var textHeight = 133;
    
    image.fillStyle = this.values_.BACKGROUND_COLOR;
    image.fillRect(0,0,width,height);

    image.textBaseline = 'middle';
    image.font = 'bold '+textHeight+'px sans-serif';
    image.fillStyle = this.values_.LOGO_FILL_COLOR;
    image.strokeStyle = this.values_.LOGO_OUTLINE_COLOR;

    var teka_right = Math.max(width/2+108,
                              image.measureText('TEKA').width+20);
    var teki_left = Math.min(width/2-48,
                             width-image.measureText('TEKI').width-20);
    var teka_top = height/2-0.25*textHeight;
    var teki_top = height/2+0.25*textHeight;
    
    image.textAlign = 'right';
    image.fillText('TEKA',teka_right,teka_top);
    image.strokeText('TEKA',teka_right,teka_top);

    image.textAlign = 'left';
    image.fillText('TEKI',teki_left,teki_top);
    image.strokeText('TEKI',teki_left,teki_top);
};

teka.PuzzleApplet.prototype.init = function()
{
    if (this.values_.FILE===false) {
        return;
    }

    this.loadFile(this.values_.FILE, teka.myBind(this,function() {

        var pv = new teka.viewer[this.type][this.type.substring(0,1).toUpperCase()+this.type.substring(1)+'Viewer'](this.psdata);
        var hd = new teka.HeadDisplay();
        var bt = new teka.ButtonTool();
        var ct = new teka.ColorTool();
        var cat = new teka.CasesTool();
        var tt = new teka.TextTool();

        this.pv = pv;
        this.bt = bt;
        this.ct = ct;
        this.cat = ct;
        this.tt = tt;
        this.display = [hd,pv,bt,ct,cat,tt];

        pv.setSolvedColor(this.values_.SOLVED_COLOR);
        pv.setColorTool(ct);
        pv.setTextParameter(this.values_.TEXTCOLOR,this.values_.BUTTON_TEXT_HEIGHT);

        hd.setTitle(this.pv.getName());
        hd.setColor(this.values_.HEADCOLOR);
        hd.setTextHeight(this.values_.HEADFONTHEIGHT);
        hd.setExtent(0,0,this.canvas.width,this.values_.HEADHEIGHT);

        bt.setColorActive(this.values_.BUTTON_COLOR_ACTIVE);
        bt.setColorPassive(this.values_.BUTTON_COLOR_PASSIVE);
        bt.setColorBorderDark(this.values_.BUTTON_COLOR_BORDER_DARK);
        bt.setColorBorderBright(this.values_.BUTTON_COLOR_BORDER_BRIGHT);
        bt.setColorText(this.values_.BUTTON_COLOR_TEXT);
        bt.setTextHeight(this.values_.BUTTON_TEXT_HEIGHT);
        bt.setEvents(this.check.bind(this),
                     this.undo.bind(this),
                     this.setInstructions.bind(this),
                     this.setText.bind(this));

        ct.setColors(this.values_.COLORTOOL_COLORS);
        ct.setColorActive(this.values_.BUTTON_COLOR_ACTIVE);
        ct.setColorPassive(this.values_.BUTTON_COLOR_PASSIVE);
        ct.setColorBorderDark(this.values_.BUTTON_COLOR_BORDER_DARK);
        ct.setColorBorderBright(this.values_.BUTTON_COLOR_BORDER_BRIGHT);
        ct.setColorText(this.values_.BUTTON_COLOR_TEXT);
        ct.setColorHeadline(this.values_.TEXTCOLOR);
        ct.setTextHeight(this.values_.BUTTON_TEXT_HEIGHT);
        ct.setEvents(this.setColor.bind(this),this.copyColor.bind(this),this.clearColor.bind(this),this.setText.bind(this));

        cat.setColorActive(this.values_.BUTTON_COLOR_ACTIVE);
        cat.setColorPassive(this.values_.BUTTON_COLOR_PASSIVE);
        cat.setColorBorderDark(this.values_.BUTTON_COLOR_BORDER_DARK);
        cat.setColorBorderBright(this.values_.BUTTON_COLOR_BORDER_BRIGHT);
        cat.setColorText(this.values_.BUTTON_COLOR_TEXT);
        cat.setColorNormalText(this.values_.TEXTCOLOR);
        cat.setTextHeight(this.values_.BUTTON_TEXT_HEIGHT);
        cat.setEvents(this.saveState.bind(this),this.loadState.bind(this),this.setText.bind(this));

        tt.setTextcolor(this.values_.TEXTCOLOR);
        tt.setHighlight(this.values_.HIGHLIGHTCOLOR);

        var pm = this.values_.PUZZLEMARGIN;

        var mindimbt = bt.getMinDim(this.image);
        var mindimct = ct.getMinDim(this.image);
        var mindimcat = cat.getMinDim(this.image);
        var mindimtt = tt.getMinDim(this.image);
        var mindim = { width: Math.max(Math.max(Math.max(mindimbt.width,mindimct.width),mindimcat.width),mindimtt.width),
                       height: mindimbt.height+mindimct.height+mindimcat.height+mindimtt.height+3*this.values_.TOOLGAP };
        pv.setExtent(pm,this.values_.HEADHEIGHT+pm,
                     this.canvas.width-mindim.width-3*pm,
                     this.canvas.height-this.values_.HEADHEIGHT-2*pm);
        var metrics = pv.setMetrics();
        pv.setExtent(pm,this.values_.HEADHEIGHT+pm,metrics.width,metrics.height);
        pv.setMetrics();

        bt.setExtent(Math.floor(metrics.width+2*pm),Math.floor(this.values_.HEADHEIGHT+pm),
                     Math.floor(this.canvas.width-3*pm-metrics.width),Math.floor(mindimbt.height));

        ct.setExtent(Math.floor(metrics.width+2*pm),Math.floor(this.values_.HEADHEIGHT+pm+Math.floor(mindimbt.height)+this.values_.TOOLGAP),
                     Math.floor(this.canvas.width-3*pm-metrics.width),Math.floor(mindimct.height));

        cat.setExtent(Math.floor(metrics.width+2*pm),Math.floor(this.values_.HEADHEIGHT+pm+Math.floor(mindimbt.height)+Math.floor(mindimct.height)+2*this.values_.TOOLGAP),
                     Math.floor(this.canvas.width-3*pm-metrics.width),Math.floor(mindimcat.height));

        tt.setExtent(Math.floor(metrics.width+2*pm),Math.floor(this.values_.HEADHEIGHT+pm+Math.floor(mindimbt.height)+Math.floor(mindimct.height)+Math.floor(mindimcat.height)+3*this.values_.TOOLGAP),
                     Math.floor(this.canvas.width-3*pm-metrics.width),this.canvas.height-Math.floor(mindimbt.height)-Math.floor(mindimct.height)-2*this.values_.TOOLGAP-2*pm-this.values_.HEADHEIGHT);

        this.paint();

        this.canvas.addEventListener('mousemove',this.mouseMovedListener.bind(this),false);
        this.canvas.addEventListener('mousedown',this.mousePressedListener.bind(this),false);
        this.canvas.addEventListener('keypress',this.keyPressedListener.bind(this),false);
        this.canvas.focus();

        var instructions = new teka.Instructions();

        this.instructions = instructions;
        instructions.setColorActive(this.values_.BUTTON_COLOR_ACTIVE);
        instructions.setColorPassive(this.values_.BUTTON_COLOR_PASSIVE);
        instructions.setColorBorderDark(this.values_.BUTTON_COLOR_BORDER_DARK);
        instructions.setColorBorderBright(this.values_.BUTTON_COLOR_BORDER_BRIGHT);
        instructions.setColor(this.values_.TEXTCOLOR);
        instructions.setGraphics(this.image);
        instructions.setInstructions(pv.getInstructions());
        instructions.setUsage(pv.getUsage());

        var ex = new teka.viewer[this.type][this.type.substring(0,1).toUpperCase()+this.type.substring(1)+'Viewer'](new teka.PSData('<<\n'+pv.getExample()+'\n>>'));
        ex.setTextParameter(this.values_.TEXTCOLOR,this.values_.BUTTON_TEXT_HEIGHT);
        ex.setMode(teka.viewer.Defaults.WAIT);
        instructions.setExampleViewer(ex);
        instructions.setExtent(pm,
                               pm+this.values_.HEADHEIGHT,
                               this.canvas.width-2*pm,
                               this.canvas.height-this.values_.HEADHEIGHT-2*pm);
        instructions.setEvent(this.setInstructions.bind(this));
    }));
};

teka.PuzzleApplet.prototype.mouseMovedListener = function(e)
{
    this.canvas.focus();

    if (this.pv.getMode()!=teka.viewer.Defaults.NORMAL) {
        return;
    }

    e = teka.normalizeMouseEvent(e);

    var x = e.x-this.canvas.offsetLeft;
    var y = e.y-this.canvas.offsetTop;

    if (this.showInstructions) {
        if (this.instructions.processMouseMovedEvent(x-this.instructions.left,
                                                     y-this.instructions.top)) {
            this.paint();
        }
        return;
    }

    var paint = this.bt.resetButtons();
    for (var d in this.display) {
        if (this.display[d].inExtent(x,y)) {
            if (this.display[d].processMouseMovedEvent(x-this.display[d].left,y-this.display[d].top)) {
                paint = true;
            }
        }
    }
    if (paint) {
        this.paint();
    } else if (this.tt.setText("",false)) {
        this.paint();
    }
};

teka.PuzzleApplet.prototype.mousePressedListener = function(e)
{
    if (this.pv.getMode()==teka.viewer.Defaults.WAIT ||
        this.pv.getMode()==teka.viewer.Defaults.BLINK_END) {
        this.pv.clearError();
        this.pv.setMode(teka.viewer.Defaults.NORMAL);
        this.tt.setText('',false);
        this.paint();
        return;
    }
    if (this.pv.getMode()!=teka.viewer.Defaults.NORMAL) {
        return;
    }

    e = teka.normalizeMouseEvent(e);

    var x = e.x-this.canvas.offsetLeft;
    var y = e.y-this.canvas.offsetTop;

    if (this.showInstructions) {
        if (this.instructions.processMousePressedEvent(x-this.instructions.left,
                                                       y-this.instructions.top)) {
            this.paint();
        }
        return;
    }

    var paint = this.bt.resetButtons();
    for (var d in this.display) {
        if (this.display[d].inExtent(x,y)) {
            if (this.display[d].processMousePressedEvent(x-this.display[d].left,y-this.display[d].top)) {
                paint = true;
            }
        }
    }
    if (paint) {
        this.paint();
    }
};

teka.PuzzleApplet.prototype.keyPressedListener = function(e)
{
    if (this.pv.processKeyEvent(e.keyCode,e.charCode)) {
        this.paint();

        if (e.preventDefault) {
            e.preventDefault();
        }
        if (e.stopPropagation) {
            e.stopPropagation();
        }
    }
    this.canvas.focus();
};

teka.PuzzleApplet.prototype.paint = function()
{
    this.image.fillStyle = this.values_.BACKGROUND_COLOR;
    this.image.fillRect(0,0,this.canvas.width,this.canvas.height);

    if (this.showInstructions) {
        this.image.save();
        this.display[0].translate(this.image);
        this.display[0].clip(this.image);
        this.display[0].paint(this.image);
        this.image.restore();
        this.image.save();
        this.instructions.translate(this.image);
        this.instructions.clip(this.image);
        this.instructions.paint(this.image);
        this.image.restore();
        return;
    }

    this.paintNormal();
};

teka.PuzzleApplet.prototype.paintNormal = function()
{
    for (var i in this.display) {
        this.image.save();
        this.display[i].translate(this.image);
        this.display[i].clip(this.image);
        this.display[i].paint(this.image);
        this.image.restore();
    }
};

teka.PuzzleApplet.prototype.check = function()
{
    var erg = this.pv.check();

    if (erg!==true)
        {
            this.tt.setText(erg,false);
            this.pv.setMode(teka.viewer.Defaults.WAIT);
            this.paint();
            return;
        }

    this.tt.setText(teka.translate('congratulations'),false);
    this.pv.setMode(teka.viewer.Defaults.BLINK_START);
    this.paint();
    setTimeout(this.blink.bind(this),300);
};

teka.PuzzleApplet.prototype.undo = function()
{
    this.pv.undo();
};

teka.PuzzleApplet.prototype.setInstructions = function(val)
{
    this.showInstructions = val;
    this.paint();
};

teka.PuzzleApplet.prototype.setColor = function(color)
{
    this.ct.setColor(color);
    this.pv.setColor(color);
};

teka.PuzzleApplet.prototype.copyColor = function(color)
{
    if (color==this.pv.getColor()) {
        return;
    }
    this.pv.save();
    this.pv.copyColor(color);
};

teka.PuzzleApplet.prototype.clearColor = function(color)
{
    this.pv.save();
    this.pv.clearColor(color);
};

teka.PuzzleApplet.prototype.saveState = function()
{
    return this.pv.saveState();
};

teka.PuzzleApplet.prototype.loadState = function(state)
{
    this.pv.save();
    this.pv.loadState(state);
    this.paint();
};

teka.PuzzleApplet.prototype.blink = function()
{
    if (this.pv.getMode()<teka.viewer.Defaults.BLINK_START ||
        this.pv.getMode()>=teka.viewer.Defaults.BLINK_END) {
        return;
    }

    this.pv.setMode(this.pv.getMode()+1);
    this.paint();
    setTimeout(this.blink.bind(this),300);
};

teka.PuzzleApplet.prototype.loadFile = function(filename, callback)
{
    var me = this;

    var res = new XMLHttpRequest();
    res.open('GET',filename);
    res.responseType = 'text';
    res.onreadystatechange = function() {
        if (this.readyState!=4) {
            return;
        }

        var psdata = new teka.PSData(this.responseText);
        if (psdata.failed()) {
            return;
        }

        var type = psdata.get('type');
        if (type.length<2) {
            return;
        }
        type = type.substring(1,type.length-1).toLowerCase();

        me.psdata = psdata;
        me.type = type;

        teka.addScript(type+'viewer.js',teka.myBind(this,callback));
    };
    res.send();
};
