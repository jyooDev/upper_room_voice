class Logger {
  filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
  }

  debug(...val: any) {
    return console.log("DEBUG:", this.filePath, ...val);
  }

  error(...val: any) {
    return console.error("ERROR", this.filePath, ...val);
  }

  bigLog(...val: any) {
    return console.log(`
      **************************  
      **************************
      ${JSON.stringify(val)}
      **************************
      **************************
    `);
  }

  warn(...val: any) {
    return console.warn("WARN", this.filePath, ...val);
  }
}

export default Logger;
