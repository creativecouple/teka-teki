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
    WIDTH: 500,
    HEIGHT: 350,
    BORDER: '1px solid black',
    TARGET: 'applet',
    BACKGROUND: '#eeeeee',
    TEXTCOLOR: '#000000',
    HIGHLIGHTCOLOR: '#ff0000',
    LOGOCOLOR: '#888888',
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
        names_akk: ['schwarzen','blauen','grünen','braunen']
    },
    FILE: false
};

teka.PuzzleApplet = function(options)
{
    this.setDefaults();

    if (options !== undefined) {
        this.setOptions(options);
    }

    this.canvas = this.addCanvas();
    this.image = this.canvas.getContext('2d');

    this.paintLogo();

    setTimeout(this.init.bind(this),1000);
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
    canvas.setAttribute('tabindex','1');
    document.getElementById(this.values_.TARGET).appendChild(canvas);
    canvas.focus();
    return canvas;
};

teka.PuzzleApplet.prototype.paintLogo = function()
{
    var image = this.image;
    image.fillStyle = this.values_.BACKGROUND;
    image.fillRect(0,0,this.canvas.width,this.canvas.height);

    var height = Math.floor(this.canvas.height/3);
    image.textAlign = 'left';
    image.textBaseline = 'middle';
    image.fillStyle = this.values_.LOGOCOLOR;
    image.font = 'bold '+height+'px sans-serif';
    image.fillText('TEKA',20,this.canvas.height/2-0.25*height);
    image.strokeStyle = '#000';
    image.strokeText('TEKA',20,this.canvas.height/2-0.25*height);

    image.textAlign = 'right';
    image.fillText('TEKI',this.canvas.width-20,this.canvas.height/2+0.25*height);
    image.strokeText('TEKI',this.canvas.width-20,this.canvas.height/2+0.25*height);
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
        bt.setEvents(this.check.bind(this),this.undo.bind(this),false,this.setText.bind(this));

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
    this.image.fillStyle = this.values_.BACKGROUND;
    this.image.fillRect(0,0,this.canvas.width,this.canvas.height);

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

    this.tt.setText('Herzlichen Glückwunsch!!!',false);
    this.pv.setMode(teka.viewer.Defaults.BLINK_START);
    this.paint();
    setTimeout(this.blink.bind(this),300);
};

teka.PuzzleApplet.prototype.undo = function()
{
    this.pv.undo();
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
