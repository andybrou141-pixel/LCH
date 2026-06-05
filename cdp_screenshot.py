import json, base64, threading, time, sys
try:
    from websocket import create_connection
except ImportError:
    import subprocess, sys
    subprocess.check_call([sys.executable, "-m", "pip", "install", "websocket-client", "-q"])
    from websocket import create_connection

WS = "ws://localhost:9222/devtools/page/FE7264C327E0769AB225F6EEA15A998D"
OUT_NAV   = r"C:\Users\franck.brou\Desktop\HERMES KNOWLEDGE\screenshot_nav.png"
OUT_ALERT = r"C:\Users\franck.brou\Desktop\HERMES KNOWLEDGE\screenshot_alert.png"

ws = create_connection(WS, timeout=15)
_id = [0]

def call(method, params=None):
    _id[0] += 1
    msg = json.dumps({"id": _id[0], "method": method, "params": params or {}})
    ws.send(msg)
    while True:
        r = json.loads(ws.recv())
        if r.get("id") == _id[0]:
            return r.get("result", {})

def run_js(expr):
    return call("Runtime.evaluate", {"expression": expr, "awaitPromise": True})

def screenshot(path):
    r = call("Page.captureScreenshot", {"format": "png", "clip": {"x":0,"y":0,"width":1280,"height":900,"scale":1}})
    with open(path, "wb") as f:
        f.write(base64.b64decode(r["data"]))
    print(f"Saved: {path}")

# 1. Aller en admin (bypass login : injecter auth + ouvrir admin-app)
run_js("""
(function(){
  // Simuler un accès admin direct
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  const adminApp = document.getElementById('admin-app');
  if(adminApp){ adminApp.classList.add('active'); }
  if(typeof switchAdminView === 'function') switchAdminView('dashboard');
})()
""")
time.sleep(1.5)

# Screenshot du nav admin
screenshot(OUT_NAV)

# 2. Déclencher l'alerte paiement
run_js("if(typeof previewPayAlert==='function') previewPayAlert();")
time.sleep(0.8)
screenshot(OUT_ALERT)

ws.close()
print("Done.")
