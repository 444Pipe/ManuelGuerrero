const express = require('express');
const path = require('path');
const compression = require('compression');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(compression());

app.use(express.static(__dirname, {
    maxAge: '1h',
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('.html')) {
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        }
        if (/\.(css|js)$/.test(filePath)) {
            res.setHeader('Cache-Control', 'public, max-age=3600');
        }
        if (/\.(png|jpg|jpeg|webp|svg|gif|ico)$/.test(filePath)) {
            res.setHeader('Cache-Control', 'public, max-age=86400');
        }
    }
}));

app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Manuel Guerrero Arquitectos running on http://0.0.0.0:${PORT}`);
});
