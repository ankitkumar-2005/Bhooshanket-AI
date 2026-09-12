from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from datetime import datetime, timezone
import json
import random
from urllib.parse import unquote

HOST = "127.0.0.1"
PORT = 8010

LOCATION_TELEMETRY = {
    "Shillong Monitoring Zone": {"rainfall": 82, "soilMoisture": 78, "slopeMovement": 66, "humidity": 88, "temperature": 22},
    "Gangtok Monitoring Zone": {"rainfall": 96, "soilMoisture": 85, "slopeMovement": 81, "humidity": 92, "temperature": 15},
    "Kohima Monitoring Zone": {"rainfall": 73, "soilMoisture": 71, "slopeMovement": 58, "humidity": 82, "temperature": 20},
}


class TelemetryHandler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, OPTIONS")
        self.end_headers()

    def do_GET(self):
        if self.path.split("?", 1)[0] != "/api/telemetry":
            self.send_error(404, "Telemetry endpoint not found")
            return

        query = self.path.split("?", 1)[1] if "?" in self.path else ""
        params = dict(part.split("=", 1) for part in query.split("&") if "=" in part)
        location = unquote(params.get("location", "Shillong Monitoring Zone"))
        base = LOCATION_TELEMETRY.get(location, LOCATION_TELEMETRY["Shillong Monitoring Zone"])
        jitter = lambda amount: round(random.uniform(-amount, amount), 1)
        payload = {
            "source": "BhooShanket Telemetry Gateway",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "location": location,
            "quality": "SIMULATED-LIVE",
            "readings": {
                "rainfall": max(0, base["rainfall"] + jitter(2.5)),
                "soilMoisture": max(0, min(100, base["soilMoisture"] + jitter(1.2))),
                "slopeMovement": max(0, base["slopeMovement"] + jitter(1.8)),
                "humidity": max(0, min(100, base["humidity"] + jitter(1.0))),
                "temperature": round(base["temperature"] + jitter(0.4), 1),
            },
        }
        body = json.dumps(payload).encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, format, *args):
        return


if __name__ == "__main__":
    server = ThreadingHTTPServer((HOST, PORT), TelemetryHandler)
    print(f"BhooShanket telemetry gateway listening on http://{HOST}:{PORT}")
    server.serve_forever()
