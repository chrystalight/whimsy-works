#!/usr/bin/env node
// =============================================
// WHIMSY WORKS - Local Events Editor
// =============================================
//
// A small local GUI for editing events-data.js without hand-writing JS.
// Run it, then open the URL it prints in your browser.
//
//     node scripts/events-editor.js
//
// Saves write straight back to events-data.js in the same format the site
// expects. No dependencies, no build step, nothing installed — just Node,
// which you already have.

const http = require('http');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { exec } = require('child_process');

const PORT = 5390;
const EVENTS_FILE = path.join(__dirname, '..', 'events-data.js');
const FIELD_ORDER = ['date', 'title', 'badge', 'charity', 'location', 'time', 'description', 'link'];

function loadEvents() {
    const src = fs.readFileSync(EVENTS_FILE, 'utf8');
    const sandbox = {};
    vm.createContext(sandbox);
    // `const` at top level doesn't attach to the context global the way
    // `var` does, so swap it just for this in-memory eval.
    vm.runInContext(src.replace('const EVENTS', 'var EVENTS'), sandbox, { filename: 'events-data.js' });
    if (!Array.isArray(sandbox.EVENTS)) {
        throw new Error('events-data.js did not define an EVENTS array');
    }
    return sandbox.EVENTS;
}

function serializeEvent(ev) {
    const lines = [];
    for (const key of FIELD_ORDER) {
        const value = ev[key];
        if (value === undefined || value === null || value === '') continue;
        if (key === 'link') {
            if (!value.url) continue;
            lines.push(`        link: { url: ${JSON.stringify(value.url)}, text: ${JSON.stringify(value.text || 'Learn More →')} }`);
        } else {
            lines.push(`        ${key}: ${JSON.stringify(value)}`);
        }
    }
    return '    {\n' + lines.join(',\n') + '\n    }';
}

function saveEvents(events) {
    const current = fs.readFileSync(EVENTS_FILE, 'utf8');
    const marker = 'const EVENTS = [';
    const idx = current.indexOf(marker);
    const prefix = idx >= 0 ? current.slice(0, idx + marker.length) : '// See events-data.js\nconst EVENTS = [';

    const body = events.map(serializeEvent).join(',\n\n');
    const out = prefix + '\n\n' + body + (body ? ',\n\n' : '\n') + '];\n';
    fs.writeFileSync(EVENTS_FILE, out, 'utf8');
}

function sendJson(res, status, data) {
    const body = JSON.stringify(data);
    res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Content-Length': Buffer.byteLength(body) });
    res.end(body);
}

const HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Whimsy Works — Events Editor</title>
<style>
    :root {
        --primary: #937288; --primary-dark: #6f5468; --accent: #FFA7A0;
        --bg: #fdf8f9; --card: #ffffff; --border: #ecdfe3; --text: #4a3f45; --gray: #8a7e83;
    }
    * { box-sizing: border-box; }
    body {
        font-family: 'Segoe UI', system-ui, sans-serif;
        background: var(--bg); color: var(--text);
        margin: 0; padding: 2rem 1.5rem 6rem;
    }
    h1 { font-size: 1.5rem; color: var(--primary-dark); margin-bottom: 0.1rem; }
    .subtitle { color: var(--gray); margin-top: 0; margin-bottom: 1.5rem; font-size: 0.9rem; }
    .toolbar { display: flex; gap: 0.75rem; margin-bottom: 1.5rem; align-items: center; }
    button {
        font: inherit; cursor: pointer; border-radius: 8px; border: 1px solid var(--border);
        background: var(--card); padding: 0.55rem 1.1rem; color: var(--text);
    }
    button:hover { border-color: var(--primary); }
    .btn-primary { background: var(--primary); color: white; border-color: var(--primary); font-weight: 600; }
    .btn-primary:hover { background: var(--primary-dark); }
    .btn-danger { color: #a0524b; }
    .btn-danger:hover { border-color: #a0524b; }
    #status { font-size: 0.9rem; }
    #status.ok { color: #3a7a4e; }
    #status.err { color: #a0524b; }
    .card {
        background: var(--card); border: 1px solid var(--border); border-radius: 14px;
        padding: 1.25rem; margin-bottom: 1rem; position: relative;
    }
    .card-head { display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.9rem; }
    .pill {
        font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em;
        padding: 0.15rem 0.6rem; border-radius: 50px;
    }
    .pill-upcoming { background: rgba(160,203,212,0.3); color: #3a6d7a; }
    .pill-past { background: rgba(0,0,0,0.06); color: var(--gray); }
    .row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 0.75rem; }
    .row.single { grid-template-columns: 1fr; }
    label { display: block; font-size: 0.78rem; color: var(--gray); margin-bottom: 0.25rem; font-weight: 600; }
    input, textarea {
        width: 100%; font: inherit; padding: 0.5rem 0.65rem; border: 1px solid var(--border);
        border-radius: 8px; background: #fffdfd; color: var(--text);
    }
    input:focus, textarea:focus { outline: 2px solid var(--accent); outline-offset: 1px; }
    textarea { resize: vertical; min-height: 2.4rem; }
    .required-missing { border-color: #d67a74; background: #fff4f3; }
    .card-actions { position: absolute; top: 1rem; right: 1rem; }
    #save-bar {
        position: fixed; bottom: 0; left: 0; right: 0; background: var(--card);
        border-top: 1px solid var(--border); padding: 1rem 1.5rem; display: flex; align-items: center; gap: 1rem;
    }
    .empty-msg { color: var(--gray); text-align: center; padding: 2rem; }
</style>
</head>
<body>
    <h1>✨ Whimsy Works — Events Editor</h1>
    <p class="subtitle">Editing <code>events-data.js</code> directly. Upcoming/Past is worked out automatically from each date — you never need to move anything.</p>

    <div class="toolbar">
        <button class="btn-primary" id="add-btn">+ Add Event</button>
        <button id="reload-btn">Reload from file</button>
    </div>

    <div id="list"></div>
    <div class="empty-msg" id="empty-msg" style="display:none">No events yet — click "Add Event" to create one.</div>

    <div id="save-bar">
        <button class="btn-primary" id="save-btn">Save All Changes</button>
        <span id="status"></span>
    </div>

<script>
let events = [];
let nextId = 1;

function todayStr() {
    const d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
}

function fieldRow(id, key, label, value, type) {
    const val = (value || '').replace(/"/g, '&quot;');
    if (type === 'textarea') {
        return \`<label>\${label}</label><textarea data-id="\${id}" data-key="\${key}">\${(value||'').replace(/</g,'&lt;')}</textarea>\`;
    }
    return \`<label>\${label}</label><input data-id="\${id}" data-key="\${key}" value="\${val}">\`;
}

function render() {
    const list = document.getElementById('list');
    document.getElementById('empty-msg').style.display = events.length ? 'none' : 'block';
    const today = todayStr();

    list.innerHTML = events.map(ev => {
        const isUpcoming = (ev.date || '') >= today;
        const pillClass = ev.date ? (isUpcoming ? 'pill-upcoming' : 'pill-past') : '';
        const pillText = ev.date ? (isUpcoming ? 'Upcoming' : 'Past') : 'No date yet';
        const dateMissing = !ev.date ? 'required-missing' : '';
        const titleMissing = !ev.title ? 'required-missing' : '';

        return \`
        <div class="card" data-card="\${ev._id}">
            <div class="card-actions"><button class="btn-danger" data-delete="\${ev._id}">Delete</button></div>
            <div class="card-head"><span class="pill \${pillClass}">\${pillText}</span></div>
            <div class="row">
                <div><label>Date *</label><input type="date" class="\${dateMissing}" data-id="\${ev._id}" data-key="date" value="\${ev.date||''}"></div>
                <div><label>Badge</label><input list="badge-options" data-id="\${ev._id}" data-key="badge" value="\${(ev.badge||'').replace(/"/g,'&quot;')}"></div>
            </div>
            <div class="row single">
                <div><label>Title *</label><input class="\${titleMissing}" data-id="\${ev._id}" data-key="title" value="\${(ev.title||'').replace(/"/g,'&quot;')}"></div>
            </div>
            <div class="row">
                <div>\${fieldRow(ev._id, 'location', 'Location (include your own emoji, e.g. 📍)', ev.location)}</div>
                <div>\${fieldRow(ev._id, 'time', 'Time — only shown while upcoming (e.g. 🕙 10:00 AM – 1:00 PM)', ev.time)}</div>
            </div>
            <div class="row single">
                <div>\${fieldRow(ev._id, 'charity', 'Charity blurb (optional, <strong> allowed)', ev.charity, 'textarea')}</div>
            </div>
            <div class="row single">
                <div>\${fieldRow(ev._id, 'description', 'Description', ev.description, 'textarea')}</div>
            </div>
            <div class="row">
                <div><label>Link URL — only shown while upcoming</label><input data-id="\${ev._id}" data-key="linkUrl" value="\${((ev.link&&ev.link.url)||'').replace(/"/g,'&quot;')}"></div>
                <div><label>Link Text</label><input data-id="\${ev._id}" data-key="linkText" value="\${((ev.link&&ev.link.text)||'Learn More →').replace(/"/g,'&quot;')}"></div>
            </div>
        </div>\`;
    }).join('');

    list.querySelectorAll('[data-key]').forEach(el => {
        el.addEventListener('input', () => {
            const id = el.getAttribute('data-id');
            const key = el.getAttribute('data-key');
            const ev = events.find(e => e._id === id);
            if (!ev) return;
            if (key === 'linkUrl' || key === 'linkText') {
                ev.link = ev.link || {};
                ev.link[key === 'linkUrl' ? 'url' : 'text'] = el.value;
            } else {
                ev[key] = el.value;
            }
            if (key === 'date') {
                el.classList.toggle('required-missing', !el.value);
                const pill = el.closest('.card').querySelector('.pill');
                const isUpcoming = el.value >= todayStr();
                pill.className = 'pill ' + (el.value ? (isUpcoming ? 'pill-upcoming' : 'pill-past') : '');
                pill.textContent = el.value ? (isUpcoming ? 'Upcoming' : 'Past') : 'No date yet';
            }
        });
    });

    list.querySelectorAll('[data-delete]').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-delete');
            if (!confirm('Delete this event? This only takes effect once you click "Save All Changes".')) return;
            events = events.filter(e => e._id !== id);
            render();
        });
    });
}

function setStatus(msg, ok) {
    const el = document.getElementById('status');
    el.textContent = msg;
    el.className = ok ? 'ok' : 'err';
}

async function load() {
    const res = await fetch('/api/events');
    const data = await res.json();
    events = data.map(ev => ({ ...ev, _id: 'e' + (nextId++) }));
    render();
    setStatus('Loaded ' + events.length + ' events from events-data.js', true);
}

document.getElementById('add-btn').addEventListener('click', () => {
    events.unshift({ _id: 'e' + (nextId++), date: '', title: '', badge: 'Community' });
    render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

document.getElementById('reload-btn').addEventListener('click', () => {
    if (!confirm('Discard unsaved changes and reload from events-data.js?')) return;
    load();
});

document.getElementById('save-btn').addEventListener('click', async () => {
    const missing = events.filter(e => !e.date || !e.title);
    if (missing.length) {
        setStatus('Every event needs at least a Date and a Title before saving.', false);
        render();
        return;
    }
    const payload = events.map(({ _id, ...rest }) => rest);
    const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    if (res.ok) {
        setStatus('Saved to events-data.js ✓', true);
        load();
    } else {
        const err = await res.json().catch(() => ({}));
        setStatus('Save failed: ' + (err.error || res.status), false);
    }
});

load();
</script>
<datalist id="badge-options">
    <option value="Fundraiser">
    <option value="Community">
    <option value="Charity">
</datalist>
</body>
</html>`;

const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(HTML);
        return;
    }

    if (req.method === 'GET' && req.url === '/api/events') {
        try {
            sendJson(res, 200, loadEvents());
        } catch (err) {
            sendJson(res, 500, { error: err.message });
        }
        return;
    }

    if (req.method === 'POST' && req.url === '/api/events') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            try {
                const events = JSON.parse(body);
                if (!Array.isArray(events)) throw new Error('Expected an array of events');
                for (const ev of events) {
                    if (!ev.date || !ev.title) throw new Error('Every event needs a date and a title');
                }
                saveEvents(events);
                sendJson(res, 200, { ok: true });
            } catch (err) {
                sendJson(res, 400, { error: err.message });
            }
        });
        return;
    }

    res.writeHead(404);
    res.end('Not found');
});

server.listen(PORT, '127.0.0.1', () => {
    const url = `http://127.0.0.1:${PORT}`;
    console.log(`Whimsy Works events editor running at ${url}`);
    console.log('Press Ctrl+C to stop.');
    if (process.platform === 'win32') {
        exec(`start "" "${url}"`);
    }
});
