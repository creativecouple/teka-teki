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
teka.Defaults.MAX_LEVEL = 9;

/** Set to true, if the time measurment should be done. */
teka.Defaults.TAKE_TIME = false;

/**
 * Maximum time (in seconds) allowed to use until the puzzle is solved.
 * Set to false, if no time limit should be applied.
 */
teka.Defaults.MAX_TIME = false;

/**
 * Set to true, if failed attempts should be counted.
 * Failed attempts are only counted, when time is taken.
 * Therefore teka.Defaults. TAKE_TIME must be true too, to
 * count failed attempt.
 */
teka.Defaults.COUNT_FAILED_ATTEMPTS = false;

/**
 * The properties shown on the start screen can be
 * eighter automatically derived by the puzzle viewer or
 * be set, using the description-key of the spf-file.
 * To use the later one, set this variable to true.
 *
 * Note: When using the values of the description-key,
 * the properties cannot be automatically translated.
 */
teka.Defaults.CUSTOM_PROPERTIES = false;

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

    if (this.values_.MAX_TIME!==false) {
        this.values_.TAKE_TIME = true;
    }

    this.showStart = this.values_.TAKE_TIME===true;
    this.showInstructions = false;
    this.timeout = false;
    this.canvas = this.addCanvas();
    this.image = this.canvas.getContext('2d');
    this.dragx = this.dragy = false;

    this.paintLogo();

    this.correctLanguage();

    teka.addScript('language/'+this.values_.LANGUAGE+'.js', teka.myBind(this,function() {
        setTimeout(this.init.bind(this),this.values_.LOGO_WAIT);
    }));
};

/** Checks if the given language is defined. */
teka.PuzzleApplet.prototype.correctLanguage = function()
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
 * Initializes the applet: First, the puzzle is loaded. Then, the
 * initTools method is called, to initialize all the tools needed.
 */
teka.PuzzleApplet.prototype.init = function()
{
    if (this.values_.FILE===false) {
        teka.setError('Missing filename.');
        this.paint();
        return;
    }

    this.loadPuzzleData(this.values_.FILE, this.initTools.bind(this));
};

/**
 * Initializes the tools of the applet: First, the viewer is loaded.
 * Then all the needed tools are created, initialized and attached to
 * an layout container. And the event listeners are registered.
 */
teka.PuzzleApplet.prototype.initTools = function()
{
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
    if (this.values_.TAKE_TIME===true) {
        this.start_screen = new teka.StartScreen();
    }

    this.initPuzzleViewer();
    this.initHead(teka.translate(this.type));
    this.initButtonTool();
    this.initColorTool();
    this.initCasesTool();
    this.initTextTool();
    this.initInstructions();
    if (this.values_.TAKE_TIME===true) {
        this.initStartScreen();
    }

    this.addLayout([this.puzzleViewer,
                    this.buttonTool,
                    this.colorTool,
                    this.casesTool,
                    this.textTool]);

    this.paint();

    this.canvas.addEventListener('mousemove',
                                 this.mousemoveListener.bind(this),
                                 false);
    this.canvas.addEventListener('mousedown',
                                 this.mousedownListener.bind(this),
                                 false);
    this.canvas.addEventListener('mouseup',
                                 this.mouseupListener.bind(this),
                                 false);
    this.canvas.addEventListener('keydown',
                                 this.keydownListener.bind(this),
                                 false);
    this.canvas.addEventListener('keypress',
                                 this.keypressListener.bind(this),
                                 false);
    this.canvas.focus();
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

        teka.addScript('viewer/'+type+'.js',teka.myBind(this,callback));
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
    var whitelist = ['abcd','abcd_diagonal','arukone','basic','domino',
                     'easy_as_abc','fences',
                     'fillomino','greater_than_sudoku','hashi','heyawake','hitori',
                     'japanese_sums','kakuro','killer_sudoku','kropki','laser',
                     'magic_labyrinth','magnets','masyu','pills','pyramid',
                     'skyscrapers','skyscrapers_with_parks','starbattle',
                     'starry_sky','sudoku','tapa'];

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
        this.layout = false;
        return;
    } else if (lr_scale===false) {
        this.layout = td;
    } else if (td_scale===false) {
        this.layout = lr;
    } else {
        this.layout = lr_scale>=td_scale?lr:td;
    }

    if (this.layout!==false) {
        this.layout.arrangeTools(this.image);
    }
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
    if (title!==undefined) {
        this.head.setTitle(title);
    }
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

/** Initializes the start screen. */
teka.PuzzleApplet.prototype.initStartScreen = function()
{
    this.start_screen.setTextParameter(this.values_.TEXT_COLOR,
                                       this.values_.TEXT_HEIGHT);
    this.start_screen.setButtonParameter(this.values_.BUTTON_COLORS,
                                         this.values_.BUTTON_HEIGHT);
    this.start_screen.setProperties(this.values_.CUSTOM_PROPERTIES===true
        ?this.descriptionToProperties(this.psdata.get('description'))
        :this.puzzleViewer.getProperties());
    this.start_screen.setGraphics(this.image);
    this.start_screen.setGap(this.values_.GAP);
    this.start_screen.setExtent(this.values_.MARGIN,
                                this.values_.MARGIN+this.values_.HEAD_HEIGHT+
                                    this.values_.GAP,
                                this.canvas.width-2*this.values_.MARGIN,
                                this.canvas.height-this.values_.HEAD_HEIGHT-
                                    2*this.values_.MARGIN-this.values_.GAP);
    this.start_screen.setEvents([this.setInstructions.bind(this),
                                this.start.bind(this)]);
};

/** Converts the description of an spf file to a properties list. */
teka.PuzzleApplet.prototype.descriptionToProperties = function(descr)
{
    if (descr===false) {
        return [];
    }

    var erg = [];
    while (true) {
        var start = descr.indexOf('(');
        if (start==-1) {
            break;
        }
        var end = descr.indexOf(')');
        if (end<start) {
            return [];
        }
        erg.push(teka.convertEntities(descr.substr(start+1,end-start-1)));
        descr = descr.substr(end+1);
    }

    return erg;
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

    this.image.strokeStyle = '#000';
    for (var i=4;i<15;i+=4) {
        teka.drawLine(this.image,
                      this.canvas.width-i,this.canvas.height,
                      this.canvas.width,this.canvas.height-i);
    }

    this.image.save();
    this.head.translate(this.image);
    this.head.clip(this.image);
    this.head.paint(this.image);
    this.image.restore();

    if (this.timeout) {
        this.paintTimeout();
        return;
    }

    if (this.showInstructions) {
        this.image.save();
        this.instructions.translate(this.image);
        this.instructions.clip(this.image);
        this.instructions.paint(this.image);
        this.image.restore();
        return;
    }

    if (this.showStart) {
        this.image.save();
        this.start_screen.translate(this.image);
        this.start_screen.clip(this.image);
        this.start_screen.paint(this.image);
        this.image.restore();
        return;
    }

    if (this.layout===false) {
        this.paintTooSmall();
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

/** Paints an message on the screen, that the applet is too small. */
teka.PuzzleApplet.prototype.paintTooSmall = function()
{
    this.image.textBaseline = 'middle';
    this.image.textAlign = 'center';
    this.image.font = this.values_.TEXT_HEIGHT+'px sans-serif';
    this.image.fillStyle = this.values_.TEXT_COLOR;
    this.image.fillText(teka.translate('too_small'),
                        this.canvas.width/2,
                        this.canvas.height/2);
};

/** Paints a timeout message. */
teka.PuzzleApplet.prototype.paintTimeout = function()
{
    this.image.textBaseline = 'middle';
    this.image.textAlign = 'center';
    this.image.font = this.values_.TEXT_HEIGHT+'px sans-serif';
    this.image.fillStyle = this.values_.TEXT_COLOR;
    this.image.fillText(teka.translate('timeout'),
                        this.canvas.width/2,
                        this.canvas.height/2);
};

//////////////////////////////////////////////////////////////////

/** Eventhandler for mousemove events. */
teka.PuzzleApplet.prototype.mousemoveListener = function(e)
{
    if (teka.error) {
        this.paint();
        return;
    }

    this.canvas.focus();

    this.checkTimeout();

    if (this.puzzleViewer.getMode()!=teka.viewer.Defaults.NORMAL) {
        return;
    }

    var position = teka.normalizeMouseEvent(e);
    var buttonPressed = teka.buttonPressed(e);

    var x = position.x-this.canvas.offsetLeft;
    var y = position.y-this.canvas.offsetTop;

    if (this.showInstructions) {
        if (this.instructions.processMousemoveEvent(x-this.instructions.left,
                                                    y-this.instructions.top,
                                                    buttonPressed)) {
            this.paint();
        }
        return;
    }

    if (this.showStart) {
        if (this.start_screen.processMousemoveEvent(x-this.start_screen.left,
                                                    y-this.start_screen.top,
                                                    buttonPressed)) {
            this.paint();
        }
        return;
    }

    var paint = false;
    if (this.layout!==false && this.layout.inExtent(x,y)) {
        if (this.layout.processMousemoveEvent(x-this.layout.left,
                                              y-this.layout.top,
                                              buttonPressed)) {
            paint = true;
        }
    }

    if (paint) {
        this.paint();
    } else if (this.setText("",false)) {
        this.paint();
    }
};

/** Eventhandler for mousedown events. */
teka.PuzzleApplet.prototype.mousedownListener = function(e)
{
    if (teka.error) {
        this.paint();
        return;
    }

    this.checkTimeout();

    if (this.dragx!==false) {
        return;
    }

    if (this.values_.TAKE_TIME && new Date().getTime()<this.timer_start+500) {
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

    if (x>=this.canvas.width-15 && y>=this.canvas.height-15) {
        this.dragx = x;
        this.dragy = y;
        this.dragwidth = this.canvas.width;
        this.dragheight = this.canvas.height;
        this.draglistener = this.mousedragListener.bind(this);
        document.addEventListener('mousemove',
                                  this.draglistener,
                                  false);
        return;
    }

    if (this.showInstructions) {
        if (this.instructions.processMousedownEvent(x-this.instructions.left,
                                                    y-this.instructions.top)) {
            this.paint();
        }
        return;
    }

    if (this.showStart) {
        if (this.start_screen.processMousedownEvent(x-this.start_screen.left,
                                                    y-this.start_screen.top)) {
            this.paint();
        }
        return;
    }

    var paint = false;
    if (this.layout!==false && this.layout.inExtent(x,y)) {
        if (this.layout.processMousedownEvent(x-this.layout.left,
                                              y-this.layout.top)) {
            paint = true;
        }
    }

    if (paint) {
        this.paint();
    }
};

/** Eventhandler for mouseup events. */
teka.PuzzleApplet.prototype.mouseupListener = function(e)
{
    if (teka.error) {
        this.paint();
        return;
    }

    this.checkTimeout();

    if (this.puzzleViewer.getMode()!=teka.viewer.Defaults.NORMAL) {
        return;
    }

    var position = teka.normalizeMouseEvent(e);

    var x = position.x-this.canvas.offsetLeft;
    var y = position.y-this.canvas.offsetTop;

    if (this.showInstructions) {
        return;
    }

    if (this.showStart) {
        return;
    }

    var paint = false;
    if (this.layout!==false && this.layout.inExtent(x,y)) {
        if (this.layout.processMouseupEvent(x-this.layout.left,
                                            y-this.layout.top)) {
            paint = true;
        }
    }

    if (paint) {
        this.paint();
    }
};

/** Eventhandler for mousedown events. */
teka.PuzzleApplet.prototype.mousedragListener = function(e)
{
    if (teka.error) {
        document.removeEventListener('mousemove',
                                     this.draglistener,
                                     false);
        this.paint();
        return;
    }

    var position = teka.normalizeMouseEvent(e);
    var buttonPressed = teka.buttonPressed(e);

    if (buttonPressed===false) {
        document.removeEventListener('mousemove',
                                     this.draglistener,
                                     false);
        this.dragx = this.dragy = false;
        this.paint();
        return;
    }

    var x = position.x-this.canvas.offsetLeft;
    var y = position.y-this.canvas.offsetTop;

    this.canvas.width = this.dragwidth+(x-this.dragx);
    this.canvas.height = this.dragheight+(y-this.dragy);
    if (this.canvas.width<200) {
        this.canvas.width=200;
    }
    if (this.canvas.width>2000) {
        this.canvas.width=2000;
    }
    if (this.canvas.height<200) {
        this.canvas.height=200;
    }
    if (this.canvas.height>2000) {
        this.canvas.height=2000;
    }
    this.canvas.style.width = this.canvas.width+'px';
    this.canvas.style.height = this.canvas.height+'px';

    this.initHead();
    if (this.showStart) {
        this.initStartScreen();
    }
    this.initInstructions();
    this.addLayout([this.puzzleViewer,
                    this.buttonTool,
                    this.colorTool,
                    this.casesTool,
                    this.textTool]);

    this.setText('',false);
    this.paint();
};

/** Eventhandler for keydown events. */
teka.PuzzleApplet.prototype.keydownListener = function(e)
{
    this.keyListener(e,teka.normalizeKeyDownEvent(e));
};

/** Eventhandler for keypress events. */
teka.PuzzleApplet.prototype.keypressListener = function(e)
{
    this.keyListener(e,teka.normalizeKeyPressEvent(e));
};

/** Eventhandler for normalized key events. */
teka.PuzzleApplet.prototype.keyListener = function(e, myEvent)
{
    if (myEvent===false) {
        return false;
    }

    if (teka.error) {
        this.paint();
        return true;
    }

    if (myEvent.key==teka.KEY_BACKSPACE) {
        teka.stopPropagation(e);
        return false;
    }

    this.checkTimeout();

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

    if (this.checkResize(myEvent)) {
        this.initHead();
        if (this.showStart) {
            this.initStartScreen();
        }
        this.initInstructions();
        this.addLayout([this.puzzleViewer,
                        this.buttonTool,
                        this.colorTool,
                        this.casesTool,
                        this.textTool]);

        this.setText('',false);
        this.paint();
        teka.stopPropagation(e);
        return false;
    }

    if (this.showInstructions) {
        if (this.instructions.processKeydownEvent(myEvent)) {
            this.paint();
            teka.stopPropagation(e);
            return false;
        }
        return true;
    }

    if (this.showStart) {
        if (this.start_screen.processKeydownEvent(myEvent)) {
            this.paint();
            teka.stopPropagation(e);
            return false;
        }
        return true;
    }

    if (this.layout!==false && this.layout.processKeydownEvent(myEvent)) {
        this.paint();
        teka.stopPropagation(e);
        return false;
    }

    this.canvas.focus();
    return true;
};

/** Checks for ctrl-cursor and resizes the canvas. */
teka.PuzzleApplet.prototype.checkResize = function(e)
{
    if (e.key==teka.KEY_RIGHT && e.ctrl===true) {
        this.canvas.width += 50;
        if (this.canvas.width>2000) {
            this.canvas.width = 2000;
        }
        this.canvas.style.width = this.canvas.width+'px';
        return true;
    }

    if (e.key==teka.KEY_LEFT && e.ctrl===true) {
        this.canvas.width -= 50;
        if (this.canvas.width<200) {
            this.canvas.width = 200;
        }
        this.canvas.style.width = this.canvas.width+'px';
        return true;
    }

    if (e.key==teka.KEY_DOWN && e.ctrl===true) {
        this.canvas.height += 50;
        if (this.canvas.height>2000) {
            this.canvas.height = 2000;
        }
        this.canvas.style.height = this.canvas.height+'px';
        return true;
    }

    if (e.key==teka.KEY_UP && e.ctrl===true) {
        this.canvas.height -= 50;
        if (this.canvas.height<200) {
            this.canvas.height = 200;
        }
        this.canvas.style.height = this.canvas.height+'px';
        return true;
    }

    return false;
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

/** Removes the startscreen and starts the timer. */
teka.PuzzleApplet.prototype.start = function()
{
    this.showStart = false;

    this.failed_attempts = 0;
    this.timer_stop = false;
    this.timer_start = new Date().getTime();

    this.startHook();
};

/** Checks, if MAX_TIME has been reached. */
teka.PuzzleApplet.prototype.checkTimeout = function()
{
    if (this.values_.MAX_TIME===false) {
        return;
    }
    if (this.showStart!==false) {
        return;
    }

    if (new Date().getTime()<this.timer_start+1000*this.values_.MAX_TIME) {
        return;
    }

    this.timeout = true;
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
        if (this.values_.TAKE_TIME===true && this.timer_stop===false) {
            this.failed_attempts++;
            this.failedAttemptHook();
        }
        if (typeof erg=='string') {
            this.setText(teka.translate(erg),false);
        } else {
            this.setText(teka.translate(erg['text'],erg['param']),false);
        }
        this.puzzleViewer.setMode(teka.viewer.Defaults.WAIT);
        this.paint();
        return;
    }

    if (this.values_.TAKE_TIME===true && this.timer_stop===false) {
        this.timer_stop = new Date().getTime();
    }

    var duration = Math.floor(this.timer_stop/1000)-Math.floor(this.timer_start/1000);

    var result = this.createResultMessage(duration,this.failed_attempts);

    this.setText(result,false);
    this.puzzleViewer.setMode(teka.viewer.Defaults.BLINK_START);
    this.paint();

    setTimeout(this.blink.bind(this),300);
    this.correctHook(result);
};

/** Creates a result message. */
teka.PuzzleApplet.prototype.createResultMessage = function(duration, failed_attempts)
{
    var result = teka.translate('congratulations');
    if (this.values_.TAKE_TIME===true) {
        result += '\n'+this.niceTime(duration);

        if (this.values_.COUNT_FAILED_ATTEMPTS===true && failed_attempts>0) {
            result += ' '+
                (failed_attempts==1
                    ?teka.translate('failed_attempt')
                    :teka.translate('failed_attempts',[failed_attempts]));
        }
    }

    return result;
};

/** Converts duration d, given in seconds, into a human readable format. */
teka.PuzzleApplet.prototype.niceTime = function(d)
{
    if (d<60) {
        return teka.translate('duration_seconds',[d]);
    }
    var sec = d%60;
    d = Math.floor(d/60);
    if (d<60) {
        return teka.translate('duration_minutes',[d,sec]);
    }
    var min = d%60;
    d = Math.floor(d/60);
    if (d<24) {
        return teka.translate('duration_hours',[d,min,sec]);
    }
    var hrs = d%24;
    d = Math.floor(d/24);
    return teka.translate('duration_days',[d,hrs,min,sec]);
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

//////////////////////////////////////////////////////////////////

/** To be overridden by descendant. */
teka.PuzzleApplet.prototype.startHook = function()
{
};

/** To be overridden by descendant. */
teka.PuzzleApplet.prototype.failedAttemptHook = function()
{
};

/** To be overridden by descendant. */
teka.PuzzleApplet.prototype.correctHook = function(result)
{
};
