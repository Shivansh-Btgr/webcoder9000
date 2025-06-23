const WebSocket = require('ws');
const { spawn } = require('child_process');

const wss = new WebSocket.Server({ port: 3001 });

wss.on('connection', ws => {
  // Use npx with shell:true for maximum Windows compatibility
  const pyright = spawn('npx', ['pyright-langserver', '--stdio'], { shell: true });
  ws.on('message', msg => pyright.stdin.write(msg));
  pyright.stdout.on('data', data => ws.send(data));
  pyright.stderr.on('data', data => console.error(data.toString()));
  ws.on('close', () => pyright.kill());
});