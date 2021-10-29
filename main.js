const { app, BrowserWindow } = require('electron');

let win;
const createWindow = () => {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    backgroundColor: '#000000',
    icon: `file://${__dirname}/dist/apps/avidcaster/assets/images/logos/logo.png`,
  });

  win.loadURL(`file://${__dirname}/dist/apps/avidcaster/index.html`);

  // Uncomment the DevTools below during development (debugging)
  win.webContents.openDevTools();

  // Event when the window is closed.
  win.on('closed', function () {
    win = null;
  });
};

// Create window on electron initialization
app.on('ready', createWindow);

app.on('activate', function () {
  // macOS specific close process
  if (win === null) {
    createWindow();
  }
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS specific close process
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
