import { spawn } from 'child_process';
import process from 'process';

if(process.pid) {
  console.log('PID: ', process.pid);
}

let proc = null;
let timeoutId = null;

const initTimer = () => {
  timeoutId = setTimeout(() => {
    if(!proc)
      return;

    proc.kill();
    console.log("restarting process...");
    spawnDownloader();
  }, 10000);
};

const spawnDownloader = () => {
  proc = spawn('node', ['moviesDownloader.js']);

  proc.stdout.on('data', function(data) {
    process.stdout.write(data);
    if(timeoutId) {
      clearTimeout(timeoutId)
      initTimer();
    }

    if(data.toString() === 'done');
      clearTimeout()
  });
  proc.stderr.on('data', function(data) {
    process.stderr.write(data);
  });
  proc.on('close', function(code, signal) {
    console.log('moviesDownloader closed');
  });
};

initTimer();
spawnDownloader();
