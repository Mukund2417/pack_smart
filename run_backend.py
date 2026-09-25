#!/usr/bin/env python3
"""
PackSmart Backend Launcher
Run from the project root:  python run_backend.py
"""
import subprocess
import sys
import os

def main():
    port = os.getenv("PORT", "8001")
    host = os.getenv("HOST", "0.0.0.0")
    reload = "--reload" if os.getenv("RELOAD", "true").lower() == "true" else ""

    cmd = [
        sys.executable, "-m", "uvicorn",
        "backend.main:app",
        "--host", host,
        "--port", str(port),
        "--log-level", "info",
    ]
    if reload:
        cmd.append("--reload")

    print(f"\nPackSmart API starting on http://localhost:{port}")
    print(f"Swagger docs:   http://localhost:{port}/docs")
    print(f"ReDoc:          http://localhost:{port}/redoc")
    print(f"Health check:   http://localhost:{port}/api/health\n")

    subprocess.run(cmd, cwd=os.path.dirname(os.path.abspath(__file__)))


if __name__ == "__main__":
    main()
