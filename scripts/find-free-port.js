const net = require('net');

/**
 * Check if a port is available
 * @param {number} port - Port to check
 * @returns {Promise<boolean>} - True if port is available
 */
function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    
    server.listen(port, () => {
      server.once('close', () => {
        resolve(true);
      });
      server.close();
    });
    
    server.on('error', () => {
      resolve(false);
    });
  });
}

/**
 * Find the first available port starting from a given port
 * @param {number} startPort - Port to start checking from (default: 3000)
 * @param {number} maxPort - Maximum port to check (default: 3100)
 * @returns {Promise<number>} - First available port
 */
async function findFreePort(startPort = 3000, maxPort = 3100) {
  for (let port = startPort; port <= maxPort; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available ports found between ${startPort} and ${maxPort}`);
}

/**
 * Find free port and start Next.js dev server
 */
async function startDevServer() {
  try {
    const port = await findFreePort(3000);
    console.log(`🚀 Starting Next.js development server on port ${port}`);
    
    // Start Next.js dev server with the found port
    const { spawn } = require('child_process');
    const nextDev = spawn('npx', ['next', 'dev', '-p', port.toString()], {
      stdio: 'inherit',
      shell: true
    });
    
    // Handle process termination
    process.on('SIGINT', () => {
      nextDev.kill('SIGINT');
      process.exit(0);
    });
    
    process.on('SIGTERM', () => {
      nextDev.kill('SIGTERM');
      process.exit(0);
    });
    
  } catch (error) {
    console.error('❌ Error starting dev server:', error.message);
    process.exit(1);
  }
}

// If this script is run directly, start the dev server
if (require.main === module) {
  startDevServer();
}

module.exports = { findFreePort, isPortAvailable };