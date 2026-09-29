#!/usr/bin/env python3
"""
ALETHEIA — Evidence Integrity & Recovery Gateway Server
Serves static dashboard files and provides MCP JSON-RPC mock endpoints.
"""

import http.server
import socketserver
import json
import sys
import os

PORT = int(os.environ.get("PORT", 8080))

class AletheiaHandler(http.server.SimpleHTTPRequestHandler):
    def do_POST(self):
        if self.path.startswith("/mcp/v1"):
            content_length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(content_length)
            try:
                data = json.loads(body.decode("utf-8"))
            except Exception:
                data = {}

            response = {
                "jsonrpc": "2.0",
                "id": data.get("id", 1),
                "result": {
                    "gateway": "ALETHEIA-v1.1",
                    "status": "HEALTHY",
                    "circuit_state": "CLOSED",
                    "verified_records": 142
                }
            }
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps(response).encode("utf-8"))
        else:
            self.send_error(404, "Endpoint not found")

    def end_headers(self):
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        super().end_headers()

if __name__ == "__main__":
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    with socketserver.TCPServer(("", PORT), AletheiaHandler) as httpd:
        print(f"==================================================")
        print(f" ALETHEIA 1-Bit Console & MCP Gateway running on:")
        print(f" http://localhost:{PORT}")
        print(f"==================================================")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server.")
            httpd.server_close()
