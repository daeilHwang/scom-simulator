const { ipcRenderer } = require('electron')

ipcRenderer.on('onload', (evt, payload) => {
    window.location = 'http://localhost:' + payload.expPort;
})