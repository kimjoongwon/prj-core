const { execSync } = require('child_process');

try {
  console.log('Starting Jest...');
  const result = execSync('npx jest src/simple.test.ts --no-cache --runInBand', {
    cwd: process.cwd(),
    timeout: 5000,
    stdio: 'pipe'
  });
  console.log('Jest output:', result.toString());
} catch (error) {
  console.log('Jest error or timeout:', error.message);
  if (error.stdout) {
    console.log('Stdout:', error.stdout.toString());
  }
  if (error.stderr) {
    console.log('Stderr:', error.stderr.toString());
  }
}
