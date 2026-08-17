const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data.json');
const BACKUP_FILE = path.join(__dirname, 'data.backup.json');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

const server = http.createServer((req, res) => {
  // Enable CORS for local development
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  let pathname = decodeURIComponent(parsedUrl.pathname);

  // API: Get Data
  if (pathname === '/api/data' && req.method === 'GET') {
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'data.json okunamadı' }));
        return;
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(data);
    });
    return;
  }

  // API: Save Data to Disk
  if (pathname === '/api/save' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const parsed = JSON.parse(body);
        const formattedJson = JSON.stringify(parsed, null, 2);

        // First, create a backup of current data.json if it exists
        if (fs.existsSync(DATA_FILE)) {
          try {
            fs.copyFileSync(DATA_FILE, BACKUP_FILE);
          } catch (e) {
            console.warn('Yedekleme oluşturulamadı:', e.message);
          }
        }

        // Write new data directly to data.json
        fs.writeFile(DATA_FILE, formattedJson, 'utf8', (err) => {
          if (err) {
            console.error('Yazma hatası:', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: err.message }));
            return;
          }
          console.log(`[${new Date().toLocaleTimeString('tr-TR')}] data.json güncellendi (v${parsed.version || '?'})`);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, version: parsed.version }));
        });
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Geçersiz JSON verisi' }));
      }
    });
    return;
  }

  // API: Push Data to GitHub
  if (pathname === '/api/git-push' && req.method === 'POST') {
    exec('git add data.json && git commit -m "Harcamalar güncellendi" && git push', { cwd: __dirname }, (err, stdout, stderr) => {
      if (err) {
        // If there's nothing to commit, that's fine too
        if ((stdout && stdout.includes('nothing to commit')) || (stderr && stderr.includes('nothing to commit'))) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, message: 'Değişiklik yok, GitHub zaten güncel.' }));
          return;
        }
        console.error('Git push hatası:', stderr || err.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: stderr || err.message }));
        return;
      }
      console.log('GitHub\'a başarıyla push edildi.');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, output: stdout }));
    });
    return;
  }

  // Static File Serving
  if (pathname === '/') {
    pathname = '/admin.html';
  }

  const filePath = path.join(__dirname, pathname);

  // Security: prevent directory traversal
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Dosya Bulunamadı');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    });

    const readStream = fs.createReadStream(filePath);
    readStream.pipe(res);
  });
});

server.listen(PORT, () => {
  console.log('==================================================');
  console.log(`🚀 Harcama Takip Sunucusu Başlatıldı!`);
  console.log(`👉 Admin Paneli: http://localhost:${PORT}/admin.html`);
  console.log(`👉 Görüntüleme:  http://localhost:${PORT}/index.html`);
  console.log(`💾 Otomatik data.json kaydı devrede.`);
  console.log('==================================================');
});
