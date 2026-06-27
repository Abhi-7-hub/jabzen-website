import http.server
import socketserver
import os

PORT = 32419

class CleanURLHandler(http.server.SimpleHTTPRequestHandler):
    def translate_path(self, path):
        # Strip query parameters and fragment
        path_clean = path.split('?')[0].split('#')[0]
        translated = super().translate_path(path_clean)
        
        # If path points to a file/directory that doesn't exist, check if adding .html exists
        if not os.path.exists(translated) and os.path.exists(translated + ".html"):
            return translated + ".html"
            
        return translated

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

if __name__ == "__main__":
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), CleanURLHandler) as httpd:
        print(f"Dev server running at http://localhost:{PORT}")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("Server stopped.")
