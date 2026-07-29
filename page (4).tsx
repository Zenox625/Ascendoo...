:root {
  --bg: #EFEDE7; --glass: rgba(255,255,255,0.55); --glass-strong: rgba(255,255,255,0.75);
  --border: rgba(255,255,255,0.6); --border-strong: rgba(0,0,0,0.08);
  --text: #1A1B1E; --text-muted: #6B6D73; --text-faint: #9A9CA2;
  --accent: #4F8DE6; --accent-soft: rgba(79,141,230,0.14);
  --radius: 20px;
}

* { box-sizing: border-box; }
html, body { padding: 0; margin: 0; background: radial-gradient(circle at 30% 20%, #F7F5F0, #E4E0D8); color: var(--text); }
body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Inter, Roboto, sans-serif; }
a { color: inherit; }

.glass-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 40px 20px; }
.glass-card { width: 100%; max-width: 480px; background: var(--glass); backdrop-filter: blur(24px) saturate(160%); -webkit-backdrop-filter: blur(24px) saturate(160%); border: 1px solid var(--border); border-radius: var(--radius); padding: 28px; box-shadow: 0 20px 60px rgba(0,0,0,.08), inset 0 1px 0 rgba(255,255,255,.6); }
.h2 { font-family: Georgia, serif; font-size: 22px; font-weight: 600; letter-spacing: -0.01em; margin: 0 0 18px; }
.row-between { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
.row-gap { display: flex; align-items: center; gap: 8px; }
.mb-10 { margin-bottom: 10px; } .mb-16 { margin-bottom: 16px; } .mt-12 { margin-top: 12px; }

.card-title { font-size: 14px; font-weight: 600; }
.card-sub { font-size: 11.5px; color: var(--text-muted); }

.btn { display: inline-flex; align-items: center; gap: 6px; padding: 9px 16px; border-radius: 100px; font-size: 12.5px; cursor: pointer; border: 1px solid var(--border-strong); background: rgba(255,255,255,.5); color: var(--text); transition: background .2s ease, transform .15s ease; text-decoration: none; }
.btn:hover { background: rgba(255,255,255,.85); transform: translateY(-1px); }
.btn-accent { border-color: var(--accent); color: var(--accent); background: var(--accent-soft); }
.btn-accent:hover { background: var(--accent); color: white; }
.btn-ghost { border-color: transparent; color: var(--text-muted); background: transparent; }
.btn-icon { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 50%; border: 1px solid var(--border-strong); background: rgba(255,255,255,.5); color: var(--text); cursor: pointer; flex-shrink: 0; transition: background .2s ease; }
.btn-icon:hover { background: rgba(255,255,255,.85); }

.input { width: 100%; padding: 10px 13px; border-radius: 12px; font-size: 13px; border: 1px solid var(--border-strong); background: rgba(255,255,255,.6); color: var(--text); }
.input:focus { outline: none; border-color: var(--accent); }

.tracker-list { display: flex; flex-direction: column; gap: 8px; }
.tracker-row { display: flex; align-items: center; gap: 14px; padding: 10px 12px; border-radius: 14px; border: 1px solid var(--border-strong); background: rgba(255,255,255,.4); }
.tracker-main { display: flex; align-items: center; gap: 10px; flex: 1; min-width: 0; }
.tracker-thumb { width: 34px; height: 34px; border-radius: 8px; overflow: hidden; flex-shrink: 0; background: rgba(0,0,0,.05); }
.tracker-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
.thumb-fallback { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 600; color: var(--text-muted); }
.tracker-info { flex: 1; min-width: 0; }
.tracker-name { font-size: 13px; font-weight: 500; }
.tracker-meta { font-size: 11px; color: var(--text-muted); }

.empty-sub { font-size: 12px; color: var(--text-muted); }
.spin { animation: spin 1s linear infinite; }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

.mini-player { position: fixed; left: 50%; bottom: 22px; transform: translateX(-50%); z-index: 50; display: flex; align-items: center; gap: 16px; padding: 8px 16px; border-radius: 100px; background: rgba(20,22,28,.55); backdrop-filter: blur(20px) saturate(160%); -webkit-backdrop-filter: blur(20px) saturate(160%); border: 1px solid rgba(255,255,255,.12); box-shadow: 0 14px 40px rgba(0,0,0,.35); color: #F0EDE4; }
.mini-player-track { display: flex; align-items: center; gap: 10px; min-width: 0; max-width: 220px; }
.mini-player-art { width: 34px; height: 34px; border-radius: 8px; object-fit: cover; flex-shrink: 0; }
.mini-player-name { font-size: 12.5px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.mini-player-artist { font-size: 10.5px; color: rgba(240,237,228,.6); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.mini-player .btn-icon { width: 26px; height: 26px; background: rgba(255,255,255,.08); border-color: rgba(255,255,255,.15); color: #F0EDE4; }
.mini-player .btn-icon:hover { background: rgba(255,255,255,.18); }
