"""Public test fixture server; never logs the query text sent to the mock endpoint."""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from functools import partial
from pathlib import Path


class Handler(SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path.startswith('/429'):
            self.send_response(429)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(b'{"error":"Controlled test: quota exceeded"}')
        else:
            super().do_GET()

    def log_message(self, fmt, *args):
        # Avoid including Google-style q= translation texts in terminal logs.
        print('fixture request processed', flush=True)


if __name__ == '__main__':
    directory = str(Path(__file__).resolve().parent)
    print('Public acceptance fixture: http://127.0.0.1:8765/', flush=True)
    ThreadingHTTPServer(('127.0.0.1', 8765), partial(Handler, directory=directory)).serve_forever()
