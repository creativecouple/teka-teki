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
 * All stuff of the teka-teki applet is stored in teka, to avoid
 * conflicts with other javascript.
 */
var teka = {};

/**
 * Contains default values that can be overridden when invoking
 * the applet.
 */
teka.Defaults = {};

/** Overall width of the applet */
teka.Defaults.WIDTH = 500;

/** Overall height of the applet */
teka.Defaults.HEIGHT = 350;

/**
 * Name (ID) of the target html-container, where the applet will
 * be inserted. The html-container should be empty to avoid side-
 * conflicts.
 */
teka.Defaults.TARGET = 'applet';

/** CSS-style of the border of the applet. */
teka.Defaults.BORDER = '1px solid black';

/**
 * CSS-style of the outline of the applet. As the applet
 * tries to hold the focus all the time, it might be usefull
 * to suppress the outline.
 */
teka.Defaults.OUTLINE = '0px';

/** Background color of the applet. */
teka.Defaults.BACKGROUND_COLOR = '#EEE';

/** Color used to print normal text. */
teka.Defaults.TEXT_COLOR = '#000';

/** Text height of normal text. */
teka.Defaults.TEXT_HEIGHT = 12;

/** Color used to print highlighted text. */
teka.Defaults.TEXT_HIGHLIGHT_COLOR = '#f00';

/** Outline color of the default logo. */
teka.Defaults.LOGO_OUTLINE_COLOR = '#000';

/** Fill color of the default logo. */
teka.Defaults.LOGO_FILL_COLOR = '#888';

/**
 * The time to display the logo before loading operations will be
 * started. The logo will stay on the screen until these operations
 * have been finished, which might take some time due to a slow
 * internet connection.
 */
teka.Defaults.LOGO_WAIT = 1000;

/** Language to be used to display texts. */
teka.Defaults.LANGUAGE = 'de';

/** Margin around the puzzle. */
teka.Defaults.MARGIN = 10;

/** Gap between displayed tools. */
teka.Defaults.GAP = 20;

/** Height of the head display. */
teka.Defaults.HEAD_HEIGHT = 20;

/** Prefix to be displayed in front of the name of the puzzle. */
teka.Defaults.HEAD_PREFIX = false;

/** The colors to use for the buttons. */
teka.Defaults.BUTTON_COLORS = {
    TEXT: '#FFF',
    ACTIVE: '#303030',
    PASSIVE: '#606060',
    BORDER_DARK: '#202020',
    BORDER_BRIGHT: '#A0A0A0'
};

/** The height of the buttons. */
teka.Defaults.BUTTON_HEIGHT = 17;

/**
 * The colors to use, when the puzzle is solved and starts blinking.
 * Some viewers will split the colors in two groups of four colors
 * to reflect the underlying image.
 */
teka.Defaults.SOLVED_COLOR = [
    '#101010','#303030','#505050','#707070',
    '#909090','#A0A0A0','#B0B0B0','#C0C0C0'
];

/** The colors used in the color tool. */
teka.Defaults.COLORTOOL_COLORS = {
    colors: ['#000','#00f','#0c0','#c40'],
    names: ['black','blue','green','brown']
};

/** The maximum level to use in the cases tool. */
teka.Defaults.MAX_LEVEL = 12;

/** The name of the file to load. Has to be overridden. */
teka.Defaults.FILE = false;

//////////////////////////////////////////////////////////////////

/**
 *  Constructor.
 *
 *  Create a new instance of PuzzleApplet to show a new applet.
 *  The options are an object with parameters to overwrite the
 *  defaults. At least FILE should be given.
 */
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

    this.correctLang();

    teka.addScript('language/'+this.values_.LANGUAGE+'.js', teka.myBind(this,function() {
        setTimeout(this.init.bind(this),this.values_.LOGO_WAIT);
    }));
};

/** Check's if the given language is defined. */
teka.PuzzleApplet.prototype.correctLang = function()
{
    var whitelist = ['de','en'];

    for (var i=0;i<whitelist.length;i++) {
        if (whitelist[i]===this.values_.LANGUAGE) {
            return;
        }
    }

    // language is not defined, so fall back to german
    this.values_.LANGUAGE = 'de';
};

/** Copies all default values to this.values_. */
teka.PuzzleApplet.prototype.setDefaults = function()
{
    this.values_ = {};
    for (var k in teka.Defaults) {
        this.values_[k] = teka.Defaults[k];
    }
};

/**
 * Overwrites the defaults with the given options. Options, where
 * no default exists, will be ignored.
 */
teka.PuzzleApplet.prototype.setOptions = function(options)
{
    for (var k in options) {
        if (this.values_[k] !== undefined) {
            this.values_[k] = options[k];
        }
    }
};

/** Creates a new canvas and adds it to the container TARGET. */
teka.PuzzleApplet.prototype.addCanvas = function()
{
    var canvas = document.createElement('canvas');
    canvas.width = this.values_.WIDTH;
    canvas.height = this.values_.HEIGHT;
    canvas.style.width = canvas.width+'px';
    canvas.style.height = canvas.height+'px';
    canvas.style.border = this.values_.BORDER;
    canvas.style.outline = this.values_.OUTLINE;
    canvas.setAttribute('tabindex','1'); // Trick to make it focusable
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

//////////////////////////////////////////////////////////////////

/**
 * Initializes the applet: First, the puzzle is loaded and the
 * corresponding viewer is loaded too. Then all the needed tools
 * are created, initialized and attached to an layout container.
 * Eventlisteners are registered and finally the instructions
 * pages are initialized.
 */
teka.PuzzleApplet.prototype.init = function()
{
    if (this.values_.FILE===false) {
        teka.setError('Missing filename.');
        this.paint();
        return;
    }

    this.loadPuzzleData(this.values_.FILE, teka.myBind(this,function() {
        this.puzzleViewer =
            new teka.viewer[this.type][this.typeToViewer(this.type)](this.psdata);
        if (this.puzzleViewer===undefined || this.puzzleViewer===false) {
            teka.setError('Puzzleviewer cannot be loaded - '+this.type);
            this.paint();
            return;
        }
        this.head = new teka.HeadDisplay();
        this.buttonTool = new teka.ButtonTool();
        this.colorTool = new teka.ColorTool();
        this.casesTool = new teka.CasesTool();
        this.textTool = new teka.TextTool();
        this.instructions = new teka.Instructions();

        this.initPuzzleViewer();
        this.initHead(teka.translate(this.type));
        this.initButtonTool();
        this.initColorTool();
        this.initCasesTool();
        this.initTextTool();
        this.initInstructions();

        this.addLayout([this.puzzleViewer,
                        this.buttonTool,
                        this.colorTool,
                        this.casesTool,
                        this.textTool]);

        this.paint();

        this.canvas.addEventListener('mousemove',
                                     this.mouseMovedListener.bind(this),
                                     false);
        this.canvas.addEventListener('mousedown',
                                     this.mousePressedListener.bind(this),
                                     false);
        this.canvas.addEventListener('keydown',
                                     this.keyPressedListener.bind(this),
                                     false);
        this.canvas.focus();
    }));
};

//////////////////////////////////////////////////////////////////

/**
 * Loads the file 'filename' from the server. This file is
 * thought to contain the data describing the puzzle in spf format.
 * The type of the puzzle is extracted and the correspondig viewer
 * is loaded. After the load is complete, the callback function
 * is called.
 */
teka.PuzzleApplet.prototype.loadPuzzleData = function(filename, callback)
{
    var res = new XMLHttpRequest();
    res.open('GET',filename);
    res.responseType = 'text';
    res.onreadystatechange = teka.myBind(this, function() {
        if (res.readyState!=4) {
            return;
        }

        if (res.status!==200) {
            teka.setError('error while loading file: '+res.status);
            this.paint();
            return;
        }

        var psdata = new teka.PSData(res.responseText);
        if (psdata.failed()) {
            teka.setError('parsing psdata failed: '+res.responseText);
            this.paint();
            return;
        }

        var type = psdata.get('type');
        if (type===false || type.length<2) {
            teka.setError('wrong or not existent type: '+type);
            this.paint();
            return;
        }
        type = type.substring(1,type.length-1).toLowerCase();

        if (!this.correctType(type)) {
            teka.setError('unknown type: '+type);
            this.paint();
            return;
        }

        this.psdata = psdata;
        this.type = type;

        teka.addScript('viewer/'+type+'viewer.js',teka.myBind(this,callback));
    });
    res.send();
};

/**
 * Checks, if type is a valid puzzletype, that is, a type,
 * where a viewer exists. We use this, to prevent loading arbitrary
 * code with crafted files.
 */
teka.PuzzleApplet.prototype.correctType = function(type)
{
    var whitelist = ['kropki','magnets','starbattle','tapa'];

    for (var i=0;i<whitelist.length;i++) {
        if (whitelist[i]===type) {
            return true;
        }
    }

    return false;
};

//////////////////////////////////////////////////////////////////

/**
 * Adds an layout container to the applet. Two different
 * containers are tried and compared.
 */
teka.PuzzleApplet.prototype.addLayout = function(tools)
{
    var width = this.canvas.width;
    var height = this.canvas.height;
    var margin = this.values_.MARGIN;
    var headPlusGap = this.values_.HEAD_HEIGHT+this.values_.GAP;

    var lr = new teka.LRLayout();
    lr.setExtent(margin,margin+headPlusGap,
                 width-2*margin,height-2*margin-headPlusGap);
    lr.setTextParameter(this.values_.TEXT_COLOR,
                        this.values_.TEXT_HEIGHT);
    lr.setTools(tools);
    lr.setGap(this.values_.GAP);
    var lr_scale = lr.arrangeTools(this.image);

    var td = new teka.TDLayout();
    td.setExtent(margin,margin+headPlusGap,
                 width-2*margin,height-2*margin-headPlusGap);
    td.setTextParameter(this.values_.TEXT_COLOR,
                        this.values_.TEXT_HEIGHT);
    td.setTools(tools);
    td.setGap(this.values_.GAP);
    var td_scale = td.arrangeTools(this.image);

    if (lr_scale===false && td_scale===false) {
        teka.setError('image too small for puzzle');
        return;
    } else if (lr_scale===false) {
        this.layout = td;
    } else if (td_scale===false) {
        this.layout = lr;
    } else {
        this.layout = lr_scale>=td_scale?lr:td;
    }

    this.layout.arrangeTools(this.image);
};

/** Initializes the puzzleviewer. */
teka.PuzzleApplet.prototype.initPuzzleViewer = function()
{
    this.puzzleViewer.setTextParameter(this.values_.TEXT_COLOR,
                                       this.values_.TEXT_HEIGHT);
    this.puzzleViewer.setColorTool(this.colorTool);
    this.puzzleViewer.setSolvedColor(this.values_.SOLVED_COLOR);
};

/** Initializes the head. */
teka.PuzzleApplet.prototype.initHead = function(title)
{
    this.head.setTitle(title);
    this.head.setPrefix(this.values_.HEAD_PREFIX);
    this.head.setTextParameter(this.values_.TEXT_COLOR,
                                    this.values_.TEXT_HEIGHT);
    this.head.setExtent(this.values_.MARGIN,
                        this.values_.MARGIN,
                        this.canvas.width-2*this.values_.MARGIN,
                        this.values_.HEAD_HEIGHT);
};

/** Initializes the button tool. */
teka.PuzzleApplet.prototype.initButtonTool = function()
{
    this.buttonTool.setButtonParameter(this.values_.BUTTON_COLORS,
                                       this.values_.BUTTON_HEIGHT);
    this.buttonTool.setEvents(this.check.bind(this),
                              this.undo.bind(this),
                              this.setInstructions.bind(this),
                              this.setText.bind(this));
};

/** Initializes the color tool. */
teka.PuzzleApplet.prototype.initColorTool = function()
{
    this.colorTool.setColors(this.values_.COLORTOOL_COLORS);
    this.colorTool.setTextParameter(this.values_.TEXT_COLOR,
                                    this.values_.TEXT_HEIGHT);
    this.colorTool.setButtonParameter(this.values_.BUTTON_COLORS,
                                      this.values_.BUTTON_HEIGHT);
    this.colorTool.setEvents(this.setColor.bind(this),
                             this.copyColor.bind(this),
                             this.clearColor.bind(this),
                             this.setText.bind(this));
};

/** Initializes the cases tool. */
teka.PuzzleApplet.prototype.initCasesTool = function()
{
    this.casesTool.setMaxLevel(this.values_.MAX_LEVEL);
    this.casesTool.setTextParameter(this.values_.TEXT_COLOR,
                                    this.values_.TEXT_HEIGHT);
    this.casesTool.setButtonParameter(this.values_.BUTTON_COLORS,
                                      this.values_.BUTTON_HEIGHT);
    this.casesTool.setEvents(this.saveState.bind(this),
                             this.loadState.bind(this),
                             this.setText.bind(this));
};

/** Initializes the text tool. */
teka.PuzzleApplet.prototype.initTextTool = function()
{
    this.textTool.setTextParameter(this.values_.TEXT_COLOR,
                                   this.values_.TEXT_HEIGHT);
    this.textTool.setHighlightColor(this.values_.TEXT_HIGHLIGHT_COLOR);
};

/** Initializes the instructions. */
teka.PuzzleApplet.prototype.initInstructions = function()
{
    this.instructions.setTextParameter(this.values_.TEXT_COLOR,
                                       this.values_.TEXT_HEIGHT);
    this.instructions.setButtonParameter(this.values_.BUTTON_COLORS,
                                         this.values_.BUTTON_HEIGHT);
    this.instructions.setInstructions(teka.translate(this.type+'_instructions'));
    this.instructions.setUsage(teka.translate(this.type+'_usage'));
    this.instructions.setGraphics(this.image);
    this.instructions.setGap(this.values_.GAP);

    var psdata = new teka.PSData('<<\n'+this.puzzleViewer.getExample()+'\n>>');
    if (psdata.failed()) {
        teka.setError('loading example failed');
        return;
    }
    var type = psdata.get('type');
    if (type===false || type!=='('+this.type+')') {
        teka.setError('wrong type in example: '+type);
        return;
    }

    var ex = new teka.viewer[this.type][this.typeToViewer(this.type)](psdata);
    if (ex===undefined || ex===false) {
        teka.setError('example cannot be loaded - '+this.type);
        return;
    }
    ex.setTextParameter(this.values_.TEXT_COLOR,
                        this.values_.TEXT_HEIGHT);
    ex.setMode(teka.viewer.Defaults.WAIT);
    this.instructions.setExampleViewer(ex);
    this.instructions.setExtent(this.values_.MARGIN,
                                this.values_.MARGIN+this.values_.HEAD_HEIGHT+
                                    this.values_.GAP,
                                this.canvas.width-2*this.values_.MARGIN,
                                this.canvas.height-this.values_.HEAD_HEIGHT-
                                    2*this.values_.MARGIN-this.values_.GAP);
    this.instructions.setEvent(this.setInstructions.bind(this));
};

/** Converts the type to the name of the corresponding viewer. */
teka.PuzzleApplet.prototype.typeToViewer = function(type)
{
    return type.substring(0,1).toUpperCase()+type.substring(1)+'Viewer';
};

//////////////////////////////////////////////////////////////////

/**
 * Paints the canvas. First the whole canvas is painted
 * with the background color. Then, the head is painted.
 * After that, depending of the mode the instructions or the
 * layout container is painted.
 */
teka.PuzzleApplet.prototype.paint = function()
{
    this.image.fillStyle = this.values_.BACKGROUND_COLOR;
    this.image.fillRect(0,0,this.canvas.width,this.canvas.height);

    if (teka.error) {
        this.paintError();
        return;
    }

    this.image.save();
    this.head.translate(this.image);
    this.head.clip(this.image);
    this.head.paint(this.image);
    this.image.restore();

    if (this.showInstructions) {
        this.image.save();
        this.instructions.translate(this.image);
        this.instructions.clip(this.image);
        this.instructions.paint(this.image);
        this.image.restore();
        return;
    }

    this.image.save();
    this.layout.translate(this.image);
    this.layout.clip(this.image);
    this.layout.paint(this.image);
    this.image.restore();
};

/** Paints an error message on the screen. */
teka.PuzzleApplet.prototype.paintError = function()
{
    this.image.textBaseline = 'middle';
    this.image.textAlign = 'center';
    this.image.font = this.values_.TEXT_HEIGHT+'px sans-serif';
    this.image.fillStyle = this.values_.TEXT_COLOR;
    this.image.fillText(teka.translate('error'),
                        this.canvas.width/2,
                        this.canvas.height/2-this.values_.TEXT_HEIGHT);
    this.image.fillText(teka.error,
                        this.canvas.width/2,
                        this.canvas.height/2+this.values_.TEXT_HEIGHT);
};

//////////////////////////////////////////////////////////////////

/**
 * Eventhandler for mousemove events.
 */
teka.PuzzleApplet.prototype.mouseMovedListener = function(e)
{
    if (teka.error) {
        this.paint();
        return;
    }

    this.canvas.focus();

    if (this.puzzleViewer.getMode()!=teka.viewer.Defaults.NORMAL) {
        return;
    }

    var position = teka.normalizeMouseEvent(e);

    var x = position.x-this.canvas.offsetLeft;
    var y = position.y-this.canvas.offsetTop;

    if (this.showInstructions) {
        if (this.instructions.processMouseMovedEvent(x-this.instructions.left,
                                                     y-this.instructions.top)) {
            this.paint();
        }
        return;
    }

    var paint = false;
    if (this.layout.inExtent(x,y)) {
        if (this.layout.processMouseMovedEvent(x-this.layout.left,
                                               y-this.layout.top)) {
            paint = true;
        }
    }

    if (paint) {
        this.paint();
    } else if (this.setText("",false)) {
        this.paint();
    }
};

/**
 * Eventhandler for mousedown events.
 */
teka.PuzzleApplet.prototype.mousePressedListener = function(e)
{
    if (teka.error) {
        this.paint();
        return;
    }

    if (this.puzzleViewer.getMode()==teka.viewer.Defaults.WAIT ||
            this.puzzleViewer.getMode()==teka.viewer.Defaults.BLINK_END) {
        this.puzzleViewer.clearError();
        this.puzzleViewer.setMode(teka.viewer.Defaults.NORMAL);
        this.setText('',false);
        this.paint();
        return;
    }
    if (this.puzzleViewer.getMode()!=teka.viewer.Defaults.NORMAL) {
        return;
    }

    var position = teka.normalizeMouseEvent(e);

    var x = position.x-this.canvas.offsetLeft;
    var y = position.y-this.canvas.offsetTop;

    if (this.showInstructions) {
        if (this.instructions.processMousePressedEvent(x-this.instructions.left,
                                                       y-this.instructions.top)) {
            this.paint();
        }
        return;
    }

    var paint = false;
    if (this.layout.inExtent(x,y)) {
        if (this.layout.processMousePressedEvent(x-this.layout.left,
                                                 y-this.layout.top)) {
            paint = true;
        }
    }

    if (paint) {
        this.paint();
    }
};

/** Eventhandler for keydown events. */
teka.PuzzleApplet.prototype.keyPressedListener = function(e)
{
    if (teka.error) {
        this.paint();
        return true;
    }

    if (this.puzzleViewer.getMode()==teka.viewer.Defaults.WAIT ||
            this.puzzleViewer.getMode()==teka.viewer.Defaults.BLINK_END) {
        this.puzzleViewer.clearError();
        this.puzzleViewer.setMode(teka.viewer.Defaults.NORMAL);
        this.setText('',false);
        this.paint();
        teka.stopPropagation(e);
        return false;
    }
    if (this.puzzleViewer.getMode()!=teka.viewer.Defaults.NORMAL) {
        return true;
    }

    var myEvent = teka.normalizeKeyEvent(e);

    if (this.showInstructions) {
        if (this.instructions.processKeyEvent(myEvent)) {
            this.paint();
            teka.stopPropagation(e);
            return false;
        }
        return true;
    }

    if (this.layout.processKeyEvent(myEvent)) {
        this.paint();
        teka.stopPropagation(e);
        return false;
    }

    this.canvas.focus();
    return true;
};

//////////////////////////////////////////////////////////////////

/** Sets the text of the texttool. */
teka.PuzzleApplet.prototype.setText = function(text, highlight)
{
    if (this.textTool!==undefined) {
        if (this.textTool.setText(this.image,text,highlight)) {
            this.paint();
        }
    }
};

/** Sets, if instuctions should be displayed or not. */
teka.PuzzleApplet.prototype.setInstructions = function(val)
{
    this.showInstructions = val;
    this.paint();
};

/**
 * Checks, if the puzzle has been solved correctly. If not,
 * the reason will be displayed in the texttool and as red
 * marks in the puzzle. If it is correct, a congratulations
 * message is shown and the puzzle blinks for about 4 seconds.
 */
teka.PuzzleApplet.prototype.check = function()
{
    var erg = this.puzzleViewer.check();

    if (erg!==true) {
        this.setText(teka.translate(erg),false);
        this.puzzleViewer.setMode(teka.viewer.Defaults.WAIT);
        this.paint();
        return;
    }

    this.setText(teka.translate('congratulations'),false);
    this.puzzleViewer.setMode(teka.viewer.Defaults.BLINK_START);
    this.paint();

    setTimeout(this.blink.bind(this),300);
};

/**
 * Let's the applet blink by recursivly calling itself after
 * 300 milliseconds until the counter (mode) reaches BLINK_END.
 */
teka.PuzzleApplet.prototype.blink = function()
{
    if (this.puzzleViewer.getMode()<teka.viewer.Defaults.BLINK_START ||
        this.puzzleViewer.getMode()>=teka.viewer.Defaults.BLINK_END) {
        return;
    }

    this.puzzleViewer.setMode(this.puzzleViewer.getMode()+1);
    this.paint();
    setTimeout(this.blink.bind(this),300);
};

/** Undos the last part of changes. */
teka.PuzzleApplet.prototype.undo = function()
{
    this.puzzleViewer.undo();
};

/** Sets the color of the pen. */
teka.PuzzleApplet.prototype.setColor = function(color)
{
    this.colorTool.setColor(color);
    this.puzzleViewer.setColor(color);
};

/**
 * Changes all symbols in a certain color to the actual
 * color.
 */
teka.PuzzleApplet.prototype.copyColor = function(color)
{
    if (color==this.puzzleViewer.getColor()) {
        return;
    }
    this.puzzleViewer.save();
    this.puzzleViewer.copyColor(color);
};

/** Deletes all symbols of the given color. */
teka.PuzzleApplet.prototype.clearColor = function(color)
{
    this.puzzleViewer.save();
    this.puzzleViewer.clearColor(color);
};

/** Saves the current state of the puzzle. */
teka.PuzzleApplet.prototype.saveState = function()
{
    return this.puzzleViewer.saveState();
};

/** Loads the current state of the puzzle. */
teka.PuzzleApplet.prototype.loadState = function(state)
{
    this.puzzleViewer.save();
    this.puzzleViewer.loadState(state);
    this.paint();
};
