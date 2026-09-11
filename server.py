"""
Dual-Stack Integrated Server for Oru Average Malayali
Connects Act 1 (Web Career Agent) with Act 2 (Python Indian Education Machine)
Supports both IPv4 and IPv6 (localhost / 127.0.0.1) on Windows seamlessly!
"""

import http.server
import json
import os
import socket
import subprocess
import sys

PORT = 8080
PROJECT_DIR = os.path.dirname(os.path.abspath(__file__))
ACT2_DIR = os.path.join(PROJECT_DIR, "useless_project_temp")


class IntegratedHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=PROJECT_DIR, **kwargs)

    def address_string(self):
        # Prevent slow / hanging reverse DNS lookups on Windows
        return str(self.client_address[0])

    def end_headers(self):
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def _read_tail(self, path, n=15):
        try:
            with open(path, "r", encoding="utf-8", errors="replace") as f:
                lines = f.readlines()
            return [ln.rstrip("\n") for ln in lines[-n:]]
        except Exception:
            return []

    def do_GET(self):
        if self.path == "/api/health":
            resp_bytes = json.dumps({
                "status": "ok",
                "service": "oruaveragelag", 
                "act2_dir_exists": os.path.isdir(ACT2_DIR),
                "act2_script_exists": os.path.exists(os.path.join(ACT2_DIR, "act2_app.py"))
            }).encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(resp_bytes)))
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(resp_bytes)
            return
        super().do_GET()

    def do_POST(self):
        if self.path == "/api/start-act2":
            try:
                length = int(self.headers.get("Content-Length", 0))
                body = self.rfile.read(length)
                try:
                    data = json.loads(body.decode("utf-8"))
                except Exception:
                    data = {}

                career_verdict = data.get("careerVerdict", "B.Tech Engineering Edition")
                candidate_name = data.get("candidateName", "Aspirant")
                stream_badge = data.get("streamBadge", "ENGINEER PATHWAY")
                ammavan_quote = data.get("ammavanQuote", "It's Indian society, you don't have another option.")

                # 1. Update session.json in useless_project_temp
                session_path = os.path.join(ACT2_DIR, "session.json")
                session_data = {
                    "career_verdict": career_verdict,
                    "candidate_name": candidate_name,
                    "stream_badge": stream_badge,
                    "ammavan_advice": ammavan_quote,
                    "timestamp": data.get("timestamp", "")
                }

                try:
                    with open(session_path, "w", encoding="utf-8") as f:
                        json.dump(session_data, f, indent=2)
                    print(f"[Bridge] Wrote session.json: {career_verdict} for {candidate_name}", flush=True)
                except Exception as e:
                    print(f"[Bridge] Error writing session.json: {e}", flush=True)

                # Terminate any previously running act2_app instance to prevent webcam device lock
                try:
                    import psutil
                    for p in psutil.process_iter(['pid', 'cmdline']):
                        cmdline = p.info.get('cmdline') or []
                        if any('act2_app.py' in str(arg) for arg in cmdline):
                            try:
                                p.kill()
                                print(f"[Bridge] Terminated previous act2_app PID {p.pid}", flush=True)
                            except Exception:
                                pass
                except Exception as pe:
                    print(f"[Bridge] Cleanup note: {pe}", flush=True)

                # 2. Launch Act 2 (act2_app.py) via Python in the foreground (GUI directly, no console box)
                launched = False
                error_msg = ""
                child_pid = None
                try:
                    # Prefer pythonw.exe so no black command prompt/terminal window opens
                    pythonw = os.path.join(os.path.dirname(sys.executable), "pythonw.exe")
                    py_exe = pythonw if os.path.exists(pythonw) else sys.executable

                    # Capture stderr so a silent crash is visible instead of a fake "RUNNING"
                    log_path = os.path.join(ACT2_DIR, "act2_launch.log")
                    log_handle = open(log_path, "w", encoding="utf-8")

                    cmd = [py_exe, "act2_app.py"]
                    proc = subprocess.Popen(
                        cmd,
                        cwd=ACT2_DIR,
                        stdout=log_handle,
                        stderr=subprocess.STDOUT,
                        stdin=subprocess.DEVNULL
                    )
                    child_pid = proc.pid

                    # Liveness check: give it ~3s to boot (camera + mediapipe init).
                    # If the process dies immediately it means the interpreter is
                    # missing deps / the script crashed — report the real error.
                    try:
                        exit_code = proc.wait(timeout=3.0)
                        if exit_code is not None:
                            log_handle.flush()
                            tail = "\n".join(self._read_tail(log_path, 15)) or "(no output captured)"
                            error_msg = f"Act 2 exited immediately (code {exit_code}). Details:\n{tail}"
                            print(f"[Bridge] act2_app.py died early (code {exit_code}). {tail}", flush=True)
                    except subprocess.TimeoutExpired:
                        launched = True
                        print(f"[Bridge] Launched Act 2 (act2_app.py) as PID {proc.pid} using {py_exe} — still alive after boot check.", flush=True)
                except Exception as e:
                    error_msg = str(e)
                    print(f"[Bridge] Error launching act2_app.py: {e}", flush=True)

                resp = {
                    "status": "ok",
                    "launched": launched,
                    "error": error_msg,
                    "pid": child_pid,
                    "career": career_verdict,
                    "candidate": candidate_name
                }
                resp_bytes = json.dumps(resp).encode("utf-8")
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.send_header("Content-Length", str(len(resp_bytes)))
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(resp_bytes)
            except Exception as outer_err:
                import traceback
                traceback.print_exc()
                err_bytes = json.dumps({"status": "error", "error": str(outer_err)}).encode("utf-8")
                self.send_response(500)
                self.send_header("Content-Type", "application/json")
                self.send_header("Content-Length", str(len(err_bytes)))
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(err_bytes)
        else:
            self.send_error(404, "Endpoint not found")

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()


class DualStackServer(http.server.ThreadingHTTPServer):
    allow_reuse_address = True
    daemon_threads = True

    def __init__(self, server_address, RequestHandlerClass):
        # Determine whether system supports IPv6 dual stack
        if socket.has_ipv6:
            self.address_family = socket.AF_INET6
        super().__init__(server_address, RequestHandlerClass)

    def server_bind(self):
        self.socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        if self.address_family == socket.AF_INET6:
            try:
                # Enable dual-stack to accept both IPv4 and IPv6 connections on same port
                self.socket.setsockopt(socket.IPPROTO_IPV6, socket.IPV6_V6ONLY, 0)
            except (AttributeError, OSError):
                pass
        super().server_bind()


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else PORT
    bind_addr = "::" if socket.has_ipv6 else "0.0.0.0"
    print(f"Starting Dual-Stack Server on {bind_addr}:{port} (supporting localhost & 127.0.0.1)...")
    try:
        server = DualStackServer((bind_addr, port), IntegratedHandler)
    except Exception as e:
        print(f"Dual-stack bind fallback to IPv4: {e}")
        server = http.server.ThreadingHTTPServer(("0.0.0.0", port), IntegratedHandler)
    server.serve_forever()
