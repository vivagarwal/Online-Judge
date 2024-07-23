const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const executeCpp = (filepath, inputFilePath) => {
    const jobId = path.basename(filepath, '.cpp');
    const outDir = path.join(path.dirname(filepath), '../outputs/cpp');
    const outPath = path.join(outDir, `${jobId}${process.platform === "win32" ? ".exe" : ".out"}`);


    if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
    }

    return new Promise((resolve, reject) => {
        const command = process.platform === "win32"
          ? `g++ "${filepath}" -o "${outPath}" && "${outPath}" < "${inputFilePath}"` 
          : `g++ "${filepath}" -o "${outPath}" && cd "${outDir}" && ./"${jobId}.out" < "${inputFilePath}"`;

          console.log(`Command: ${command}`);
        console.log(`Filepath: ${filepath}`);
        console.log(`InputPath: ${inputFilePath}`);
        console.log(`OutPath: ${outPath}`);
    
        exec(command, (error, stdout, stderr) => {
          if (error) {
            console.error(`Error: ${error}`);
            return reject({ error, stderr });
          }
          if (stderr) {
            console.error(`Stderr: ${stderr}`);
            return reject(stderr);
          }
          console.log(`Stdout: ${stdout}`);
          const normalizedOutput = stdout.replace(/\r\n/g,'\n').trim();
          resolve({output : normalizedOutput});
        });
      });
    };
    
    module.exports = {
      executeCpp,
    };
    