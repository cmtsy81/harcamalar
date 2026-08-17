import http.server
import json
import os
import shutil
import subprocess
from datetime import datetime

PORT = int(os.environ.get('PORT', 3000))
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(BASE_DIR, 'data.json')
BACKUP_FILE = os.path.join(BASE_DIR, 'data.backup.json')

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=BASE_DIR, **kwargs)

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_GET(self):
        if self.path == '/api/data':
            if not os.path.exists(DATA_FILE):
                self.send_error(404, 'data.json bulunamadi')
                return
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            with open(DATA_FILE, 'rb') as f:
                self.wfile.write(f.read())
            return
        elif self.path == '/':
            self.path = '/admin.html'
        
        super().do_GET()

    def do_POST(self):
        if self.path == '/api/save':
            length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(length).decode('utf-8')
            try:
                data = json.loads(body)
                
                # Backup existing
                if os.path.exists(DATA_FILE):
                    try:
                        shutil.copyfile(DATA_FILE, BACKUP_FILE)
                    except Exception as e:
                        print(f"Yedek alinamadi: {e}")

                # Save new data
                with open(DATA_FILE, 'w', encoding='utf-8') as f:
                    json.dump(data, f, ensure_ascii=False, indent=2)

                now = datetime.now().strftime('%H:%M:%S')
                ver = data.get('version', '?')
                print(f"[{now}] data.json güncellendi (v{ver})")

                self.send_response(200)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({'success': True, 'version': ver}).encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({'success': False, 'error': str(e)}).encode('utf-8'))
            return

        if self.path == '/api/git-push':
            try:
                out = subprocess.check_output('git add data.json && git commit -m "Harcamalar güncellendi" && git push', cwd=BASE_DIR, shell=True, stderr=subprocess.STDOUT)
                self.send_response(200)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({'success': True, 'output': out.decode('utf-8', errors='ignore')}).encode('utf-8'))
            except subprocess.CalledProcessError as e:
                out_text = e.output.decode('utf-8', errors='ignore') if e.output else str(e)
                if 'nothing to commit' in out_text:
                    self.send_response(200)
                    self.send_header('Content-Type', 'application/json; charset=utf-8')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    self.wfile.write(json.dumps({'success': True, 'message': 'Değişiklik yok'}).encode('utf-8'))
                    return
                self.send_response(500)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({'success': False, 'error': out_text}).encode('utf-8'))
            return
        
        self.send_error(404, 'Endpoint bulunamadi')

if __name__ == '__main__':
    server = http.server.ThreadingHTTPServer(('0.0.0.0', PORT), CustomHandler)
    print("==================================================")
    print(f"🚀 Harcama Takip Sunucusu Başlatıldı (Python)!")
    print(f"👉 Admin Paneli: http://localhost:{PORT}/admin.html")
    print(f"👉 Görüntüleme:  http://localhost:{PORT}/index.html")
    print(f"💾 Otomatik data.json kaydı devrede.")
    print("==================================================")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nSunucu kapatıldı.")
