const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipcMain = electron.ipcMain;
const { PosPrinter } = require('electron-pos-printer')
const path = require('path');
const isDev = require('electron-is-dev');
const ThermalPrinter = require("node-thermal-printer").printer;
const PrinterTypes = require("node-thermal-printer").types;

let mainWindow;

let impresoras = {};

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200, height: 720, center: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,

    }
  });

  impresoras = mainWindow.webContents.getPrinters()
  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
  if (isDev) {
    //Open the DevTools.
    //BrowserWindow.addDevToolsExtension('<location to your react chrome extension>');

  }

  mainWindow.on('closed', () => mainWindow = null);
}

app.on('ready', createWindow);


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});


ipcMain.on('print', (event, arg) => {
  //const data = JSON.parse(arg);
  //console.log(impresoras)
  //printer

const data = [
  {
    type: 'image',                                       
    path: path.join(__dirname, '/membrete.jpg'),     // file path
    position: 'center',                                  // position of image: 'left' | 'center' | 'right'
    width: '300px',                                           // width of image in px; default: auto
    height: '80px',                                          // width of image in px; default: 50 or '50px'
  },
  {
    type: 'text',                                       // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
    value: 'SAMPLE HEADING',
    style: `text-align:center;`,
    css: {"font-weight": "700", "font-size": "18px"}
 },
 {
  type: 'table',
  // style the table
  style: 'font-weight": "700"; "font-size": "12px;',
  // list of the columns to be rendered in the table header
  tableHeader: ['Producto', 'Precio', 'Cant', 'Total'],
  // multi dimensional array depicting the rows and columns of the table body
  tableBody: [
      ["PHILIPS .- TUBO LED 16 W T8 MOD. ECOFIT 110-240 V", 20.50, 3, 65.50],
      ["PHILIPS .- TUBO LED 16 W T8 MOD. ECOFIT 110-240 V", 20.50, 3, 65.50],
      ["PHILIPS .- TUBO LED 16 W T8 MOD. ECOFIT 110-240 V", 20.50, 3, 65.50],
  ],
  tableBodyStyle: 'font-size: 9px; font-weight: 700;',

}

]

  PosPrinter.print(data, {
    printerName: 'EPSON TM-T20III Receipt',
    silent: false,  
    preview: true,
    timeOutPerLine: 5000,
    width: '300px' // page size  
  })
    .then(() => {console.log("print succesfully") })
    .catch((error) => {
      console.error(error);
    });


  

})



