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
  const data = JSON.parse(arg);
  //console.log(impresoras)
  //printer

  const receipt = [
    {
      type: 'image',
      path: path.join(__dirname, '/receipt2.jpg'),     // file path
      position: 'center',                                  // position of image: 'left' | 'center' | 'right'
      width: '300px',                                           // width of image in px; default: auto
      height: '60px',                                          // width of image in px; default: 50 or '50px'
    },
    {
      type: 'text',                                       // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
      value: `Victor Ruiz Limon`,
      style: `text-align:center; margin-top: 0px;`,
      css: { "font-weight": "700", "font-size": "11px" }
    },
    {
      type: 'text',                                       // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
      value: `RULV690623SM4`,
      style: `text-align:center; margin-top: 5px;`,
      css: { "font-weight": "700", "font-size": "11px" }
    },
    {
      type: 'text',                                       // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
      value: `AV. 5 DE MAYO S/N CP. 95641`,
      style: `text-align:center; margin-top: 5px;`,
      css: { "font-weight": "700", "font-size": "11px" }
    }, {
      type: 'text',                                       // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
      value: `ISLA, VER.`,
      style: `text-align:center; margin-top: 5px;`,
      css: { "font-weight": "700", "font-size": "11px" }
    },
    {
      type: 'text',                                       // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
      value: data.hoy,
      style: `text-align:left; margin-top: 8px;`,
      css: { "font-weight": "700", "font-size": "11px" }
    },
    {
      type: 'text',                                       // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
      value: `Folio: N${data.folio}`,
      style: `text-align:left; margin-top: 8px;`,
      css: { "font-weight": "700", "font-size": "11px" }
    },
    {
      type: 'table',
      // style the table
      style: 'font-weight": "700"; "font-size": "12px;',
      // list of the columns to be rendered in the table header
      tableHeader: ['Producto', 'Precio', 'Cant', 'Total'],
      // multi dimensional array depicting the rows and columns of the table body
      tableBody: data.productosNota,
      tableBodyStyle: 'font-size: 9px; font-weight: 700;',

    },
    {
      type: 'text',                                       // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
      value: `Total: ${data.total.toFixed(2)}`,
      style: `text-align:right; margin-top: 12px; margin-bottom: 12px; padding-right: 20px;`,
      css: { "font-weight": "700", "font-size": "15px" }
    },
    {
      type: 'text',                                       // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
      value: 'Gracias por su compra !!!',
      style: `text-align:center; margin-top: 10px; margin-bottom: 10px`,
      css: { "font-weight": "700", "font-size": "13px" }
    },

  ]

  PosPrinter.print(receipt, {
    printerName: 'EPSON TM-T20III Receipt',
    silent: false,
    preview: false,
    timeOutPerLine: 5000,
    width: '300px' // page size  
  })
    .then(() => { console.log("print succesfully") })
    .catch((error) => {
      console.error(error);
    });




})



