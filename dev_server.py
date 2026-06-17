import http.server
import socketserver
import os

PORT = 32415

class CleanURLHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Get translate path
        filepath = self.translate_path(self.path.split('?')[0].split('#')[0])
        
        # If the file does not exist but file.html does, rewrite path
        if not os.path.exists(filepath) and os.path.exists(filepath + ".html"):
            # If path ends in /, remove it
            p = self.path
            query = ""
            if "?" in p:
                p, query = p.split("?", 1)
                query = "?" + query
            
            self.path = p + ".html" + query
            
        return super().do_GET()

if __name__ == "__main__":
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), CleanURLHandler) as httpd:
        print(f"Dev server running at http://localhost:{PORT}")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("Server stopped.")
