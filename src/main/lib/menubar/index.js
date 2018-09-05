/* eslint-disable */
const path = require('path');
const events = require('events');
const fs = require('fs');

const electron = require('electron');

const app = electron.app;
const Tray = electron.Tray;
const BrowserWindow = electron.BrowserWindow;

const extend = require('extend');
const Positioner = require('electron-positioner');

module.exports = function create(opts) {
  if (typeof opts === 'undefined') opts = { dir: app.getAppPath() };
  if (typeof opts === 'string') opts = { dir: opts };
  if (!opts.dir) opts.dir = app.getAppPath();
  if (!path.isAbsolute(opts.dir)) opts.dir = path.resolve(opts.dir);
  if (!opts.index) opts.index = `file://${path.join(opts.dir, 'index.html')}`;
  if (!opts.windowPosition) {
    opts.windowPosition =
      process.platform === 'win32' ? 'trayBottomCenter' : 'trayCenter';
  }
  if (typeof opts.showDockIcon === 'undefined') opts.showDockIcon = false;

  // set width/height on opts to be usable before the window is created
  opts.width = opts.width || 400;
  opts.height = opts.height || 400;
  opts.tooltip = opts.tooltip || '';

  const menubar = new events.EventEmitter();
  menubar.app = app;

  if (app.isReady()) appReady();
  else app.on('ready', appReady);

  // Set / get options
  menubar.setOption = function(opt, val) {
    opts[opt] = val;
  };

  menubar.getOption = function(opt) {
    return opts[opt];
  };

  return menubar;

  function appReady() {
    if (app.dock && !opts.showDockIcon) app.dock.hide();

    let iconPath = opts.icon || path.join(opts.dir, 'IconTemplate.png');
    if (!fs.existsSync(iconPath)) {
      iconPath = path.join(__dirname, 'example', 'IconTemplate.png');
    } // default cat icon

    let cachedBounds; // cachedBounds are needed for double-clicked event
    const defaultClickEvent = opts.showOnRightClick ? 'right-click' : 'click';

    menubar.tray = opts.tray || new Tray(iconPath);
    menubar.tray.on(defaultClickEvent, clicked);
    menubar.tray.on('double-click', clicked);
    menubar.tray.setToolTip(opts.tooltip);

    // let supportsTrayHighlightState = false;
    // try {
    //   menubar.tray.setHighlightMode('never');
    //   supportsTrayHighlightState = true;
    // } catch (e) {}

    if (opts.preloadWindow) {
      createWindow();
    }

    menubar.showWindow = showWindow;
    menubar.hideWindow = hideWindow;
    menubar.emit('ready');

    function clicked(e, bounds) {
      if (e.altKey || e.shiftKey || e.ctrlKey || e.metaKey) return hideWindow();
      if (menubar.window && menubar.window.isVisible()) return hideWindow();
      cachedBounds = bounds || cachedBounds;
      showWindow(cachedBounds);
    }

    function createWindow() {
      menubar.emit('create-window');
      const defaults = {
        show: false,
        frame: false,
      };

      const winOpts = extend(defaults, opts);
      menubar.window = new BrowserWindow(winOpts);
      menubar.positioner = new Positioner(menubar.window);

      menubar.window.on('blur', () => {
        menubar.window.isAlwaysOnTop() ? emitBlur() : hideWindow();
      });

      if (opts.showOnAllWorkspaces !== false) {
        menubar.window.setVisibleOnAllWorkspaces(true);
      }

      menubar.window.on('close', windowClear);
      menubar.window.loadURL(opts.index);
      menubar.emit('after-create-window');
    }

    function showWindow(trayPos) {
      // if (supportsTrayHighlightState) menubar.tray.setHighlightMode('always');
      if (!menubar.window) {
        createWindow();
      }

      menubar.emit('show');

      if (trayPos && trayPos.x !== 0) {
        // Cache the bounds
        cachedBounds = trayPos;
      } else if (cachedBounds) {
        // Cached value will be used if showWindow is called without bounds data
        trayPos = cachedBounds;
      } else if (menubar.tray.getBounds) {
        // Get the current tray bounds
        trayPos = menubar.tray.getBounds();
      }

      // Default the window to the right if `trayPos` bounds are undefined or null.
      let noBoundsPosition = null;
      if (
        (trayPos === undefined || trayPos.x === 0) &&
        opts.windowPosition.substr(0, 4) === 'tray'
      ) {
        noBoundsPosition =
          process.platform === 'win32' ? 'bottomRight' : 'topRight';
      }

      const position = menubar.positioner.calculate(
        noBoundsPosition || opts.windowPosition,
        trayPos
      );

      const x = opts.x !== undefined ? opts.x : position.x;
      const y = opts.y !== undefined ? opts.y : position.y;

      menubar.window.setPosition(x, y);
      menubar.window.show();
      menubar.emit('after-show');
    }

    function hideWindow() {
      // if (supportsTrayHighlightState) menubar.tray.setHighlightMode('never');
      if (!menubar.window) return;
      menubar.emit('hide');
      menubar.window.hide();
      menubar.emit('after-hide');
    }

    function windowClear() {
      delete menubar.window;
      menubar.emit('after-close');
    }

    function emitBlur() {
      menubar.emit('focus-lost');
    }
  }
};
