const { exec } = require("child_process");

const executeJava = (filepath, inputFilePath) => {

  return new Promise((resolve, reject) => {
    exec(
      `java "${filepath}" < "${inputFilePath}"`,(error, stdout, stderr) => {
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
  executeJava,
};
