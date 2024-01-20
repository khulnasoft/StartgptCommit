#!/usr/bin/env node
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all3) => {
  for (var name in all3)
    __defProp(target, name, { get: all3[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/isexe/windows.js
var require_windows = __commonJS({
  "node_modules/isexe/windows.js"(exports, module2) {
    module2.exports = isexe;
    isexe.sync = sync;
    var fs4 = require("fs");
    function checkPathExt(path5, options) {
      var pathext = options.pathExt !== void 0 ? options.pathExt : process.env.PATHEXT;
      if (!pathext) {
        return true;
      }
      pathext = pathext.split(";");
      if (pathext.indexOf("") !== -1) {
        return true;
      }
      for (var i2 = 0; i2 < pathext.length; i2++) {
        var p4 = pathext[i2].toLowerCase();
        if (p4 && path5.substr(-p4.length).toLowerCase() === p4) {
          return true;
        }
      }
      return false;
    }
    function checkStat(stat, path5, options) {
      if (!stat.isSymbolicLink() && !stat.isFile()) {
        return false;
      }
      return checkPathExt(path5, options);
    }
    function isexe(path5, options, cb) {
      fs4.stat(path5, function(er, stat) {
        cb(er, er ? false : checkStat(stat, path5, options));
      });
    }
    function sync(path5, options) {
      return checkStat(fs4.statSync(path5), path5, options);
    }
  }
});

// node_modules/isexe/mode.js
var require_mode = __commonJS({
  "node_modules/isexe/mode.js"(exports, module2) {
    module2.exports = isexe;
    isexe.sync = sync;
    var fs4 = require("fs");
    function isexe(path5, options, cb) {
      fs4.stat(path5, function(er, stat) {
        cb(er, er ? false : checkStat(stat, options));
      });
    }
    function sync(path5, options) {
      return checkStat(fs4.statSync(path5), options);
    }
    function checkStat(stat, options) {
      return stat.isFile() && checkMode(stat, options);
    }
    function checkMode(stat, options) {
      var mod = stat.mode;
      var uid = stat.uid;
      var gid = stat.gid;
      var myUid = options.uid !== void 0 ? options.uid : process.getuid && process.getuid();
      var myGid = options.gid !== void 0 ? options.gid : process.getgid && process.getgid();
      var u2 = parseInt("100", 8);
      var g3 = parseInt("010", 8);
      var o2 = parseInt("001", 8);
      var ug = u2 | g3;
      var ret = mod & o2 || mod & g3 && gid === myGid || mod & u2 && uid === myUid || mod & ug && myUid === 0;
      return ret;
    }
  }
});

// node_modules/isexe/index.js
var require_isexe = __commonJS({
  "node_modules/isexe/index.js"(exports, module2) {
    var fs4 = require("fs");
    var core;
    if (process.platform === "win32" || global.TESTING_WINDOWS) {
      core = require_windows();
    } else {
      core = require_mode();
    }
    module2.exports = isexe;
    isexe.sync = sync;
    function isexe(path5, options, cb) {
      if (typeof options === "function") {
        cb = options;
        options = {};
      }
      if (!cb) {
        if (typeof Promise !== "function") {
          throw new TypeError("callback not provided");
        }
        return new Promise(function(resolve, reject) {
          isexe(path5, options || {}, function(er, is) {
            if (er) {
              reject(er);
            } else {
              resolve(is);
            }
          });
        });
      }
      core(path5, options || {}, function(er, is) {
        if (er) {
          if (er.code === "EACCES" || options && options.ignoreErrors) {
            er = null;
            is = false;
          }
        }
        cb(er, is);
      });
    }
    function sync(path5, options) {
      try {
        return core.sync(path5, options || {});
      } catch (er) {
        if (options && options.ignoreErrors || er.code === "EACCES") {
          return false;
        } else {
          throw er;
        }
      }
    }
  }
});

// node_modules/which/which.js
var require_which = __commonJS({
  "node_modules/which/which.js"(exports, module2) {
    var isWindows = process.platform === "win32" || process.env.OSTYPE === "cygwin" || process.env.OSTYPE === "msys";
    var path5 = require("path");
    var COLON = isWindows ? ";" : ":";
    var isexe = require_isexe();
    var getNotFoundError = (cmd) => Object.assign(new Error(`not found: ${cmd}`), { code: "ENOENT" });
    var getPathInfo = (cmd, opt) => {
      const colon = opt.colon || COLON;
      const pathEnv = cmd.match(/\//) || isWindows && cmd.match(/\\/) ? [""] : [
        ...isWindows ? [process.cwd()] : [],
        ...(opt.path || process.env.PATH || "").split(colon)
      ];
      const pathExtExe = isWindows ? opt.pathExt || process.env.PATHEXT || ".EXE;.CMD;.BAT;.COM" : "";
      const pathExt = isWindows ? pathExtExe.split(colon) : [""];
      if (isWindows) {
        if (cmd.indexOf(".") !== -1 && pathExt[0] !== "")
          pathExt.unshift("");
      }
      return {
        pathEnv,
        pathExt,
        pathExtExe
      };
    };
    var which = (cmd, opt, cb) => {
      if (typeof opt === "function") {
        cb = opt;
        opt = {};
      }
      if (!opt)
        opt = {};
      const { pathEnv, pathExt, pathExtExe } = getPathInfo(cmd, opt);
      const found = [];
      const step = (i2) => new Promise((resolve, reject) => {
        if (i2 === pathEnv.length)
          return opt.all && found.length ? resolve(found) : reject(getNotFoundError(cmd));
        const ppRaw = pathEnv[i2];
        const pathPart = /^".*"$/.test(ppRaw) ? ppRaw.slice(1, -1) : ppRaw;
        const pCmd = path5.join(pathPart, cmd);
        const p4 = !pathPart && /^\.[\\\/]/.test(cmd) ? cmd.slice(0, 2) + pCmd : pCmd;
        resolve(subStep(p4, i2, 0));
      });
      const subStep = (p4, i2, ii) => new Promise((resolve, reject) => {
        if (ii === pathExt.length)
          return resolve(step(i2 + 1));
        const ext = pathExt[ii];
        isexe(p4 + ext, { pathExt: pathExtExe }, (er, is) => {
          if (!er && is) {
            if (opt.all)
              found.push(p4 + ext);
            else
              return resolve(p4 + ext);
          }
          return resolve(subStep(p4, i2, ii + 1));
        });
      });
      return cb ? step(0).then((res) => cb(null, res), cb) : step(0);
    };
    var whichSync = (cmd, opt) => {
      opt = opt || {};
      const { pathEnv, pathExt, pathExtExe } = getPathInfo(cmd, opt);
      const found = [];
      for (let i2 = 0; i2 < pathEnv.length; i2++) {
        const ppRaw = pathEnv[i2];
        const pathPart = /^".*"$/.test(ppRaw) ? ppRaw.slice(1, -1) : ppRaw;
        const pCmd = path5.join(pathPart, cmd);
        const p4 = !pathPart && /^\.[\\\/]/.test(cmd) ? cmd.slice(0, 2) + pCmd : pCmd;
        for (let j3 = 0; j3 < pathExt.length; j3++) {
          const cur = p4 + pathExt[j3];
          try {
            const is = isexe.sync(cur, { pathExt: pathExtExe });
            if (is) {
              if (opt.all)
                found.push(cur);
              else
                return cur;
            }
          } catch (ex) {
          }
        }
      }
      if (opt.all && found.length)
        return found;
      if (opt.nothrow)
        return null;
      throw getNotFoundError(cmd);
    };
    module2.exports = which;
    which.sync = whichSync;
  }
});

// node_modules/path-key/index.js
var require_path_key = __commonJS({
  "node_modules/path-key/index.js"(exports, module2) {
    "use strict";
    var pathKey2 = (options = {}) => {
      const environment = options.env || process.env;
      const platform = options.platform || process.platform;
      if (platform !== "win32") {
        return "PATH";
      }
      return Object.keys(environment).reverse().find((key) => key.toUpperCase() === "PATH") || "Path";
    };
    module2.exports = pathKey2;
    module2.exports.default = pathKey2;
  }
});

// node_modules/cross-spawn/lib/util/resolveCommand.js
var require_resolveCommand = __commonJS({
  "node_modules/cross-spawn/lib/util/resolveCommand.js"(exports, module2) {
    "use strict";
    var path5 = require("path");
    var which = require_which();
    var getPathKey = require_path_key();
    function resolveCommandAttempt(parsed, withoutPathExt) {
      const env2 = parsed.options.env || process.env;
      const cwd = process.cwd();
      const hasCustomCwd = parsed.options.cwd != null;
      const shouldSwitchCwd = hasCustomCwd && process.chdir !== void 0 && !process.chdir.disabled;
      if (shouldSwitchCwd) {
        try {
          process.chdir(parsed.options.cwd);
        } catch (err) {
        }
      }
      let resolved;
      try {
        resolved = which.sync(parsed.command, {
          path: env2[getPathKey({ env: env2 })],
          pathExt: withoutPathExt ? path5.delimiter : void 0
        });
      } catch (e2) {
      } finally {
        if (shouldSwitchCwd) {
          process.chdir(cwd);
        }
      }
      if (resolved) {
        resolved = path5.resolve(hasCustomCwd ? parsed.options.cwd : "", resolved);
      }
      return resolved;
    }
    function resolveCommand(parsed) {
      return resolveCommandAttempt(parsed) || resolveCommandAttempt(parsed, true);
    }
    module2.exports = resolveCommand;
  }
});

// node_modules/cross-spawn/lib/util/escape.js
var require_escape = __commonJS({
  "node_modules/cross-spawn/lib/util/escape.js"(exports, module2) {
    "use strict";
    var metaCharsRegExp = /([()\][%!^"`<>&|;, *?])/g;
    function escapeCommand(arg) {
      arg = arg.replace(metaCharsRegExp, "^$1");
      return arg;
    }
    function escapeArgument(arg, doubleEscapeMetaChars) {
      arg = `${arg}`;
      arg = arg.replace(/(\\*)"/g, '$1$1\\"');
      arg = arg.replace(/(\\*)$/, "$1$1");
      arg = `"${arg}"`;
      arg = arg.replace(metaCharsRegExp, "^$1");
      if (doubleEscapeMetaChars) {
        arg = arg.replace(metaCharsRegExp, "^$1");
      }
      return arg;
    }
    module2.exports.command = escapeCommand;
    module2.exports.argument = escapeArgument;
  }
});

// node_modules/shebang-regex/index.js
var require_shebang_regex = __commonJS({
  "node_modules/shebang-regex/index.js"(exports, module2) {
    "use strict";
    module2.exports = /^#!(.*)/;
  }
});

// node_modules/shebang-command/index.js
var require_shebang_command = __commonJS({
  "node_modules/shebang-command/index.js"(exports, module2) {
    "use strict";
    var shebangRegex = require_shebang_regex();
    module2.exports = (string = "") => {
      const match = string.match(shebangRegex);
      if (!match) {
        return null;
      }
      const [path5, argument] = match[0].replace(/#! ?/, "").split(" ");
      const binary = path5.split("/").pop();
      if (binary === "env") {
        return argument;
      }
      return argument ? `${binary} ${argument}` : binary;
    };
  }
});

// node_modules/cross-spawn/lib/util/readShebang.js
var require_readShebang = __commonJS({
  "node_modules/cross-spawn/lib/util/readShebang.js"(exports, module2) {
    "use strict";
    var fs4 = require("fs");
    var shebangCommand = require_shebang_command();
    function readShebang(command2) {
      const size = 150;
      const buffer = Buffer.alloc(size);
      let fd;
      try {
        fd = fs4.openSync(command2, "r");
        fs4.readSync(fd, buffer, 0, size, 0);
        fs4.closeSync(fd);
      } catch (e2) {
      }
      return shebangCommand(buffer.toString());
    }
    module2.exports = readShebang;
  }
});

// node_modules/cross-spawn/lib/parse.js
var require_parse = __commonJS({
  "node_modules/cross-spawn/lib/parse.js"(exports, module2) {
    "use strict";
    var path5 = require("path");
    var resolveCommand = require_resolveCommand();
    var escape = require_escape();
    var readShebang = require_readShebang();
    var isWin = process.platform === "win32";
    var isExecutableRegExp = /\.(?:com|exe)$/i;
    var isCmdShimRegExp = /node_modules[\\/].bin[\\/][^\\/]+\.cmd$/i;
    function detectShebang(parsed) {
      parsed.file = resolveCommand(parsed);
      const shebang = parsed.file && readShebang(parsed.file);
      if (shebang) {
        parsed.args.unshift(parsed.file);
        parsed.command = shebang;
        return resolveCommand(parsed);
      }
      return parsed.file;
    }
    function parseNonShell(parsed) {
      if (!isWin) {
        return parsed;
      }
      const commandFile = detectShebang(parsed);
      const needsShell = !isExecutableRegExp.test(commandFile);
      if (parsed.options.forceShell || needsShell) {
        const needsDoubleEscapeMetaChars = isCmdShimRegExp.test(commandFile);
        parsed.command = path5.normalize(parsed.command);
        parsed.command = escape.command(parsed.command);
        parsed.args = parsed.args.map((arg) => escape.argument(arg, needsDoubleEscapeMetaChars));
        const shellCommand = [parsed.command].concat(parsed.args).join(" ");
        parsed.args = ["/d", "/s", "/c", `"${shellCommand}"`];
        parsed.command = process.env.comspec || "cmd.exe";
        parsed.options.windowsVerbatimArguments = true;
      }
      return parsed;
    }
    function parse(command2, args, options) {
      if (args && !Array.isArray(args)) {
        options = args;
        args = null;
      }
      args = args ? args.slice(0) : [];
      options = Object.assign({}, options);
      const parsed = {
        command: command2,
        args,
        options,
        file: void 0,
        original: {
          command: command2,
          args
        }
      };
      return options.shell ? parsed : parseNonShell(parsed);
    }
    module2.exports = parse;
  }
});

// node_modules/cross-spawn/lib/enoent.js
var require_enoent = __commonJS({
  "node_modules/cross-spawn/lib/enoent.js"(exports, module2) {
    "use strict";
    var isWin = process.platform === "win32";
    function notFoundError(original, syscall) {
      return Object.assign(new Error(`${syscall} ${original.command} ENOENT`), {
        code: "ENOENT",
        errno: "ENOENT",
        syscall: `${syscall} ${original.command}`,
        path: original.command,
        spawnargs: original.args
      });
    }
    function hookChildProcess(cp, parsed) {
      if (!isWin) {
        return;
      }
      const originalEmit = cp.emit;
      cp.emit = function(name, arg1) {
        if (name === "exit") {
          const err = verifyENOENT(arg1, parsed, "spawn");
          if (err) {
            return originalEmit.call(cp, "error", err);
          }
        }
        return originalEmit.apply(cp, arguments);
      };
    }
    function verifyENOENT(status, parsed) {
      if (isWin && status === 1 && !parsed.file) {
        return notFoundError(parsed.original, "spawn");
      }
      return null;
    }
    function verifyENOENTSync(status, parsed) {
      if (isWin && status === 1 && !parsed.file) {
        return notFoundError(parsed.original, "spawnSync");
      }
      return null;
    }
    module2.exports = {
      hookChildProcess,
      verifyENOENT,
      verifyENOENTSync,
      notFoundError
    };
  }
});

// node_modules/cross-spawn/index.js
var require_cross_spawn = __commonJS({
  "node_modules/cross-spawn/index.js"(exports, module2) {
    "use strict";
    var cp = require("child_process");
    var parse = require_parse();
    var enoent = require_enoent();
    function spawn(command2, args, options) {
      const parsed = parse(command2, args, options);
      const spawned = cp.spawn(parsed.command, parsed.args, parsed.options);
      enoent.hookChildProcess(spawned, parsed);
      return spawned;
    }
    function spawnSync(command2, args, options) {
      const parsed = parse(command2, args, options);
      const result = cp.spawnSync(parsed.command, parsed.args, parsed.options);
      result.error = result.error || enoent.verifyENOENTSync(result.status, parsed);
      return result;
    }
    module2.exports = spawn;
    module2.exports.spawn = spawn;
    module2.exports.sync = spawnSync;
    module2.exports._parse = parse;
    module2.exports._enoent = enoent;
  }
});

// node_modules/signal-exit/signals.js
var require_signals = __commonJS({
  "node_modules/signal-exit/signals.js"(exports, module2) {
    module2.exports = [
      "SIGABRT",
      "SIGALRM",
      "SIGHUP",
      "SIGINT",
      "SIGTERM"
    ];
    if (process.platform !== "win32") {
      module2.exports.push(
        "SIGVTALRM",
        "SIGXCPU",
        "SIGXFSZ",
        "SIGUSR2",
        "SIGTRAP",
        "SIGSYS",
        "SIGQUIT",
        "SIGIOT"
      );
    }
    if (process.platform === "linux") {
      module2.exports.push(
        "SIGIO",
        "SIGPOLL",
        "SIGPWR",
        "SIGSTKFLT",
        "SIGUNUSED"
      );
    }
  }
});

// node_modules/signal-exit/index.js
var require_signal_exit = __commonJS({
  "node_modules/signal-exit/index.js"(exports, module2) {
    var process7 = global.process;
    var processOk = function(process8) {
      return process8 && typeof process8 === "object" && typeof process8.removeListener === "function" && typeof process8.emit === "function" && typeof process8.reallyExit === "function" && typeof process8.listeners === "function" && typeof process8.kill === "function" && typeof process8.pid === "number" && typeof process8.on === "function";
    };
    if (!processOk(process7)) {
      module2.exports = function() {
        return function() {
        };
      };
    } else {
      assert = require("assert");
      signals = require_signals();
      isWin = /^win/i.test(process7.platform);
      EE = require("events");
      if (typeof EE !== "function") {
        EE = EE.EventEmitter;
      }
      if (process7.__signal_exit_emitter__) {
        emitter = process7.__signal_exit_emitter__;
      } else {
        emitter = process7.__signal_exit_emitter__ = new EE();
        emitter.count = 0;
        emitter.emitted = {};
      }
      if (!emitter.infinite) {
        emitter.setMaxListeners(Infinity);
        emitter.infinite = true;
      }
      module2.exports = function(cb, opts) {
        if (!processOk(global.process)) {
          return function() {
          };
        }
        assert.equal(typeof cb, "function", "a callback must be provided for exit handler");
        if (loaded === false) {
          load();
        }
        var ev = "exit";
        if (opts && opts.alwaysLast) {
          ev = "afterexit";
        }
        var remove = function() {
          emitter.removeListener(ev, cb);
          if (emitter.listeners("exit").length === 0 && emitter.listeners("afterexit").length === 0) {
            unload();
          }
        };
        emitter.on(ev, cb);
        return remove;
      };
      unload = function unload2() {
        if (!loaded || !processOk(global.process)) {
          return;
        }
        loaded = false;
        signals.forEach(function(sig) {
          try {
            process7.removeListener(sig, sigListeners[sig]);
          } catch (er) {
          }
        });
        process7.emit = originalProcessEmit;
        process7.reallyExit = originalProcessReallyExit;
        emitter.count -= 1;
      };
      module2.exports.unload = unload;
      emit = function emit2(event, code, signal) {
        if (emitter.emitted[event]) {
          return;
        }
        emitter.emitted[event] = true;
        emitter.emit(event, code, signal);
      };
      sigListeners = {};
      signals.forEach(function(sig) {
        sigListeners[sig] = function listener() {
          if (!processOk(global.process)) {
            return;
          }
          var listeners = process7.listeners(sig);
          if (listeners.length === emitter.count) {
            unload();
            emit("exit", null, sig);
            emit("afterexit", null, sig);
            if (isWin && sig === "SIGHUP") {
              sig = "SIGINT";
            }
            process7.kill(process7.pid, sig);
          }
        };
      });
      module2.exports.signals = function() {
        return signals;
      };
      loaded = false;
      load = function load2() {
        if (loaded || !processOk(global.process)) {
          return;
        }
        loaded = true;
        emitter.count += 1;
        signals = signals.filter(function(sig) {
          try {
            process7.on(sig, sigListeners[sig]);
            return true;
          } catch (er) {
            return false;
          }
        });
        process7.emit = processEmit;
        process7.reallyExit = processReallyExit;
      };
      module2.exports.load = load;
      originalProcessReallyExit = process7.reallyExit;
      processReallyExit = function processReallyExit2(code) {
        if (!processOk(global.process)) {
          return;
        }
        process7.exitCode = code || 0;
        emit("exit", process7.exitCode, null);
        emit("afterexit", process7.exitCode, null);
        originalProcessReallyExit.call(process7, process7.exitCode);
      };
      originalProcessEmit = process7.emit;
      processEmit = function processEmit2(ev, arg) {
        if (ev === "exit" && processOk(global.process)) {
          if (arg !== void 0) {
            process7.exitCode = arg;
          }
          var ret = originalProcessEmit.apply(this, arguments);
          emit("exit", process7.exitCode, null);
          emit("afterexit", process7.exitCode, null);
          return ret;
        } else {
          return originalProcessEmit.apply(this, arguments);
        }
      };
    }
    var assert;
    var signals;
    var isWin;
    var EE;
    var emitter;
    var unload;
    var emit;
    var sigListeners;
    var loaded;
    var load;
    var originalProcessReallyExit;
    var processReallyExit;
    var originalProcessEmit;
    var processEmit;
  }
});

// node_modules/get-stream/buffer-stream.js
var require_buffer_stream = __commonJS({
  "node_modules/get-stream/buffer-stream.js"(exports, module2) {
    "use strict";
    var { PassThrough: PassThroughStream } = require("stream");
    module2.exports = (options) => {
      options = { ...options };
      const { array } = options;
      let { encoding } = options;
      const isBuffer2 = encoding === "buffer";
      let objectMode = false;
      if (array) {
        objectMode = !(encoding || isBuffer2);
      } else {
        encoding = encoding || "utf8";
      }
      if (isBuffer2) {
        encoding = null;
      }
      const stream4 = new PassThroughStream({ objectMode });
      if (encoding) {
        stream4.setEncoding(encoding);
      }
      let length = 0;
      const chunks = [];
      stream4.on("data", (chunk) => {
        chunks.push(chunk);
        if (objectMode) {
          length = chunks.length;
        } else {
          length += chunk.length;
        }
      });
      stream4.getBufferedValue = () => {
        if (array) {
          return chunks;
        }
        return isBuffer2 ? Buffer.concat(chunks, length) : chunks.join("");
      };
      stream4.getBufferedLength = () => length;
      return stream4;
    };
  }
});

// node_modules/get-stream/index.js
var require_get_stream = __commonJS({
  "node_modules/get-stream/index.js"(exports, module2) {
    "use strict";
    var { constants: BufferConstants } = require("buffer");
    var stream4 = require("stream");
    var { promisify } = require("util");
    var bufferStream = require_buffer_stream();
    var streamPipelinePromisified = promisify(stream4.pipeline);
    var MaxBufferError = class extends Error {
      constructor() {
        super("maxBuffer exceeded");
        this.name = "MaxBufferError";
      }
    };
    async function getStream2(inputStream, options) {
      if (!inputStream) {
        throw new Error("Expected a stream");
      }
      options = {
        maxBuffer: Infinity,
        ...options
      };
      const { maxBuffer } = options;
      const stream5 = bufferStream(options);
      await new Promise((resolve, reject) => {
        const rejectPromise = (error) => {
          if (error && stream5.getBufferedLength() <= BufferConstants.MAX_LENGTH) {
            error.bufferedData = stream5.getBufferedValue();
          }
          reject(error);
        };
        (async () => {
          try {
            await streamPipelinePromisified(inputStream, stream5);
            resolve();
          } catch (error) {
            rejectPromise(error);
          }
        })();
        stream5.on("data", () => {
          if (stream5.getBufferedLength() > maxBuffer) {
            rejectPromise(new MaxBufferError());
          }
        });
      });
      return stream5.getBufferedValue();
    }
    module2.exports = getStream2;
    module2.exports.buffer = (stream5, options) => getStream2(stream5, { ...options, encoding: "buffer" });
    module2.exports.array = (stream5, options) => getStream2(stream5, { ...options, array: true });
    module2.exports.MaxBufferError = MaxBufferError;
  }
});

// node_modules/merge-stream/index.js
var require_merge_stream = __commonJS({
  "node_modules/merge-stream/index.js"(exports, module2) {
    "use strict";
    var { PassThrough } = require("stream");
    module2.exports = function() {
      var sources = [];
      var output = new PassThrough({ objectMode: true });
      output.setMaxListeners(0);
      output.add = add;
      output.isEmpty = isEmpty;
      output.on("unpipe", remove);
      Array.prototype.slice.call(arguments).forEach(add);
      return output;
      function add(source) {
        if (Array.isArray(source)) {
          source.forEach(add);
          return this;
        }
        sources.push(source);
        source.once("end", remove.bind(null, source));
        source.once("error", output.emit.bind(output, "error"));
        source.pipe(output, { end: false });
        return this;
      }
      function isEmpty() {
        return sources.length == 0;
      }
      function remove(source) {
        sources = sources.filter(function(it) {
          return it !== source;
        });
        if (!sources.length && output.readable) {
          output.end();
        }
      }
    };
  }
});

// node_modules/sisteransi/src/index.js
var require_src = __commonJS({
  "node_modules/sisteransi/src/index.js"(exports, module2) {
    "use strict";
    var ESC = "\x1B";
    var CSI = `${ESC}[`;
    var beep = "\x07";
    var cursor = {
      to(x4, y5) {
        if (!y5)
          return `${CSI}${x4 + 1}G`;
        return `${CSI}${y5 + 1};${x4 + 1}H`;
      },
      move(x4, y5) {
        let ret = "";
        if (x4 < 0)
          ret += `${CSI}${-x4}D`;
        else if (x4 > 0)
          ret += `${CSI}${x4}C`;
        if (y5 < 0)
          ret += `${CSI}${-y5}A`;
        else if (y5 > 0)
          ret += `${CSI}${y5}B`;
        return ret;
      },
      up: (count = 1) => `${CSI}${count}A`,
      down: (count = 1) => `${CSI}${count}B`,
      forward: (count = 1) => `${CSI}${count}C`,
      backward: (count = 1) => `${CSI}${count}D`,
      nextLine: (count = 1) => `${CSI}E`.repeat(count),
      prevLine: (count = 1) => `${CSI}F`.repeat(count),
      left: `${CSI}G`,
      hide: `${CSI}?25l`,
      show: `${CSI}?25h`,
      save: `${ESC}7`,
      restore: `${ESC}8`
    };
    var scroll = {
      up: (count = 1) => `${CSI}S`.repeat(count),
      down: (count = 1) => `${CSI}T`.repeat(count)
    };
    var erase = {
      screen: `${CSI}2J`,
      up: (count = 1) => `${CSI}1J`.repeat(count),
      down: (count = 1) => `${CSI}J`.repeat(count),
      line: `${CSI}2K`,
      lineEnd: `${CSI}K`,
      lineStart: `${CSI}1K`,
      lines(count) {
        let clear = "";
        for (let i2 = 0; i2 < count; i2++)
          clear += this.line + (i2 < count - 1 ? cursor.up() : "");
        if (count)
          clear += cursor.left;
        return clear;
      }
    };
    module2.exports = { cursor, scroll, erase, beep };
  }
});

// node_modules/picocolors/picocolors.js
var require_picocolors = __commonJS({
  "node_modules/picocolors/picocolors.js"(exports, module2) {
    var tty2 = require("tty");
    var isColorSupported = !("NO_COLOR" in process.env || process.argv.includes("--no-color")) && ("FORCE_COLOR" in process.env || process.argv.includes("--color") || process.platform === "win32" || tty2.isatty(1) && process.env.TERM !== "dumb" || "CI" in process.env);
    var formatter = (open, close, replace = open) => (input) => {
      let string = "" + input;
      let index = string.indexOf(close, open.length);
      return ~index ? open + replaceClose(string, close, replace, index) + close : open + string + close;
    };
    var replaceClose = (string, close, replace, index) => {
      let start = string.substring(0, index) + replace;
      let end = string.substring(index + close.length);
      let nextIndex = end.indexOf(close);
      return ~nextIndex ? start + replaceClose(end, close, replace, nextIndex) : start + end;
    };
    var createColors = (enabled = isColorSupported) => ({
      isColorSupported: enabled,
      reset: enabled ? (s) => `\x1B[0m${s}\x1B[0m` : String,
      bold: enabled ? formatter("\x1B[1m", "\x1B[22m", "\x1B[22m\x1B[1m") : String,
      dim: enabled ? formatter("\x1B[2m", "\x1B[22m", "\x1B[22m\x1B[2m") : String,
      italic: enabled ? formatter("\x1B[3m", "\x1B[23m") : String,
      underline: enabled ? formatter("\x1B[4m", "\x1B[24m") : String,
      inverse: enabled ? formatter("\x1B[7m", "\x1B[27m") : String,
      hidden: enabled ? formatter("\x1B[8m", "\x1B[28m") : String,
      strikethrough: enabled ? formatter("\x1B[9m", "\x1B[29m") : String,
      black: enabled ? formatter("\x1B[30m", "\x1B[39m") : String,
      red: enabled ? formatter("\x1B[31m", "\x1B[39m") : String,
      green: enabled ? formatter("\x1B[32m", "\x1B[39m") : String,
      yellow: enabled ? formatter("\x1B[33m", "\x1B[39m") : String,
      blue: enabled ? formatter("\x1B[34m", "\x1B[39m") : String,
      magenta: enabled ? formatter("\x1B[35m", "\x1B[39m") : String,
      cyan: enabled ? formatter("\x1B[36m", "\x1B[39m") : String,
      white: enabled ? formatter("\x1B[37m", "\x1B[39m") : String,
      gray: enabled ? formatter("\x1B[90m", "\x1B[39m") : String,
      bgBlack: enabled ? formatter("\x1B[40m", "\x1B[49m") : String,
      bgRed: enabled ? formatter("\x1B[41m", "\x1B[49m") : String,
      bgGreen: enabled ? formatter("\x1B[42m", "\x1B[49m") : String,
      bgYellow: enabled ? formatter("\x1B[43m", "\x1B[49m") : String,
      bgBlue: enabled ? formatter("\x1B[44m", "\x1B[49m") : String,
      bgMagenta: enabled ? formatter("\x1B[45m", "\x1B[49m") : String,
      bgCyan: enabled ? formatter("\x1B[46m", "\x1B[49m") : String,
      bgWhite: enabled ? formatter("\x1B[47m", "\x1B[49m") : String
    });
    module2.exports = createColors();
    module2.exports.createColors = createColors;
  }
});

// node_modules/openai/node_modules/axios/lib/helpers/bind.js
var require_bind = __commonJS({
  "node_modules/openai/node_modules/axios/lib/helpers/bind.js"(exports, module2) {
    "use strict";
    module2.exports = function bind2(fn, thisArg) {
      return function wrap() {
        var args = new Array(arguments.length);
        for (var i2 = 0; i2 < args.length; i2++) {
          args[i2] = arguments[i2];
        }
        return fn.apply(thisArg, args);
      };
    };
  }
});

// node_modules/openai/node_modules/axios/lib/utils.js
var require_utils = __commonJS({
  "node_modules/openai/node_modules/axios/lib/utils.js"(exports, module2) {
    "use strict";
    var bind2 = require_bind();
    var toString3 = Object.prototype.toString;
    function isArray2(val) {
      return Array.isArray(val);
    }
    function isUndefined2(val) {
      return typeof val === "undefined";
    }
    function isBuffer2(val) {
      return val !== null && !isUndefined2(val) && val.constructor !== null && !isUndefined2(val.constructor) && typeof val.constructor.isBuffer === "function" && val.constructor.isBuffer(val);
    }
    function isArrayBuffer2(val) {
      return toString3.call(val) === "[object ArrayBuffer]";
    }
    function isFormData2(val) {
      return toString3.call(val) === "[object FormData]";
    }
    function isArrayBufferView2(val) {
      var result;
      if (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView) {
        result = ArrayBuffer.isView(val);
      } else {
        result = val && val.buffer && isArrayBuffer2(val.buffer);
      }
      return result;
    }
    function isString2(val) {
      return typeof val === "string";
    }
    function isNumber2(val) {
      return typeof val === "number";
    }
    function isObject2(val) {
      return val !== null && typeof val === "object";
    }
    function isPlainObject2(val) {
      if (toString3.call(val) !== "[object Object]") {
        return false;
      }
      var prototype3 = Object.getPrototypeOf(val);
      return prototype3 === null || prototype3 === Object.prototype;
    }
    function isDate2(val) {
      return toString3.call(val) === "[object Date]";
    }
    function isFile2(val) {
      return toString3.call(val) === "[object File]";
    }
    function isBlob2(val) {
      return toString3.call(val) === "[object Blob]";
    }
    function isFunction2(val) {
      return toString3.call(val) === "[object Function]";
    }
    function isStream3(val) {
      return isObject2(val) && isFunction2(val.pipe);
    }
    function isURLSearchParams2(val) {
      return toString3.call(val) === "[object URLSearchParams]";
    }
    function trim2(str) {
      return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, "");
    }
    function isStandardBrowserEnv() {
      if (typeof navigator !== "undefined" && (navigator.product === "ReactNative" || navigator.product === "NativeScript" || navigator.product === "NS")) {
        return false;
      }
      return typeof window !== "undefined" && typeof document !== "undefined";
    }
    function forEach2(obj, fn) {
      if (obj === null || typeof obj === "undefined") {
        return;
      }
      if (typeof obj !== "object") {
        obj = [obj];
      }
      if (isArray2(obj)) {
        for (var i2 = 0, l = obj.length; i2 < l; i2++) {
          fn.call(null, obj[i2], i2, obj);
        }
      } else {
        for (var key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            fn.call(null, obj[key], key, obj);
          }
        }
      }
    }
    function merge2() {
      var result = {};
      function assignValue(val, key) {
        if (isPlainObject2(result[key]) && isPlainObject2(val)) {
          result[key] = merge2(result[key], val);
        } else if (isPlainObject2(val)) {
          result[key] = merge2({}, val);
        } else if (isArray2(val)) {
          result[key] = val.slice();
        } else {
          result[key] = val;
        }
      }
      for (var i2 = 0, l = arguments.length; i2 < l; i2++) {
        forEach2(arguments[i2], assignValue);
      }
      return result;
    }
    function extend2(a2, b6, thisArg) {
      forEach2(b6, function assignValue(val, key) {
        if (thisArg && typeof val === "function") {
          a2[key] = bind2(val, thisArg);
        } else {
          a2[key] = val;
        }
      });
      return a2;
    }
    function stripBOM2(content) {
      if (content.charCodeAt(0) === 65279) {
        content = content.slice(1);
      }
      return content;
    }
    module2.exports = {
      isArray: isArray2,
      isArrayBuffer: isArrayBuffer2,
      isBuffer: isBuffer2,
      isFormData: isFormData2,
      isArrayBufferView: isArrayBufferView2,
      isString: isString2,
      isNumber: isNumber2,
      isObject: isObject2,
      isPlainObject: isPlainObject2,
      isUndefined: isUndefined2,
      isDate: isDate2,
      isFile: isFile2,
      isBlob: isBlob2,
      isFunction: isFunction2,
      isStream: isStream3,
      isURLSearchParams: isURLSearchParams2,
      isStandardBrowserEnv,
      forEach: forEach2,
      merge: merge2,
      extend: extend2,
      trim: trim2,
      stripBOM: stripBOM2
    };
  }
});

// node_modules/openai/node_modules/axios/lib/helpers/buildURL.js
var require_buildURL = __commonJS({
  "node_modules/openai/node_modules/axios/lib/helpers/buildURL.js"(exports, module2) {
    "use strict";
    var utils = require_utils();
    function encode3(val) {
      return encodeURIComponent(val).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+").replace(/%5B/gi, "[").replace(/%5D/gi, "]");
    }
    module2.exports = function buildURL2(url3, params, paramsSerializer) {
      if (!params) {
        return url3;
      }
      var serializedParams;
      if (paramsSerializer) {
        serializedParams = paramsSerializer(params);
      } else if (utils.isURLSearchParams(params)) {
        serializedParams = params.toString();
      } else {
        var parts = [];
        utils.forEach(params, function serialize(val, key) {
          if (val === null || typeof val === "undefined") {
            return;
          }
          if (utils.isArray(val)) {
            key = key + "[]";
          } else {
            val = [val];
          }
          utils.forEach(val, function parseValue(v4) {
            if (utils.isDate(v4)) {
              v4 = v4.toISOString();
            } else if (utils.isObject(v4)) {
              v4 = JSON.stringify(v4);
            }
            parts.push(encode3(key) + "=" + encode3(v4));
          });
        });
        serializedParams = parts.join("&");
      }
      if (serializedParams) {
        var hashmarkIndex = url3.indexOf("#");
        if (hashmarkIndex !== -1) {
          url3 = url3.slice(0, hashmarkIndex);
        }
        url3 += (url3.indexOf("?") === -1 ? "?" : "&") + serializedParams;
      }
      return url3;
    };
  }
});

// node_modules/openai/node_modules/axios/lib/core/InterceptorManager.js
var require_InterceptorManager = __commonJS({
  "node_modules/openai/node_modules/axios/lib/core/InterceptorManager.js"(exports, module2) {
    "use strict";
    var utils = require_utils();
    function InterceptorManager2() {
      this.handlers = [];
    }
    InterceptorManager2.prototype.use = function use(fulfilled, rejected, options) {
      this.handlers.push({
        fulfilled,
        rejected,
        synchronous: options ? options.synchronous : false,
        runWhen: options ? options.runWhen : null
      });
      return this.handlers.length - 1;
    };
    InterceptorManager2.prototype.eject = function eject(id) {
      if (this.handlers[id]) {
        this.handlers[id] = null;
      }
    };
    InterceptorManager2.prototype.forEach = function forEach2(fn) {
      utils.forEach(this.handlers, function forEachHandler(h4) {
        if (h4 !== null) {
          fn(h4);
        }
      });
    };
    module2.exports = InterceptorManager2;
  }
});

// node_modules/openai/node_modules/axios/lib/helpers/normalizeHeaderName.js
var require_normalizeHeaderName = __commonJS({
  "node_modules/openai/node_modules/axios/lib/helpers/normalizeHeaderName.js"(exports, module2) {
    "use strict";
    var utils = require_utils();
    module2.exports = function normalizeHeaderName(headers, normalizedName) {
      utils.forEach(headers, function processHeader(value, name) {
        if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
          headers[normalizedName] = value;
          delete headers[name];
        }
      });
    };
  }
});

// node_modules/openai/node_modules/axios/lib/core/enhanceError.js
var require_enhanceError = __commonJS({
  "node_modules/openai/node_modules/axios/lib/core/enhanceError.js"(exports, module2) {
    "use strict";
    module2.exports = function enhanceError(error, config8, code, request, response) {
      error.config = config8;
      if (code) {
        error.code = code;
      }
      error.request = request;
      error.response = response;
      error.isAxiosError = true;
      error.toJSON = function toJSON2() {
        return {
          message: this.message,
          name: this.name,
          description: this.description,
          number: this.number,
          fileName: this.fileName,
          lineNumber: this.lineNumber,
          columnNumber: this.columnNumber,
          stack: this.stack,
          config: this.config,
          code: this.code,
          status: this.response && this.response.status ? this.response.status : null
        };
      };
      return error;
    };
  }
});

// node_modules/openai/node_modules/axios/lib/defaults/transitional.js
var require_transitional = __commonJS({
  "node_modules/openai/node_modules/axios/lib/defaults/transitional.js"(exports, module2) {
    "use strict";
    module2.exports = {
      silentJSONParsing: true,
      forcedJSONParsing: true,
      clarifyTimeoutError: false
    };
  }
});

// node_modules/openai/node_modules/axios/lib/core/createError.js
var require_createError = __commonJS({
  "node_modules/openai/node_modules/axios/lib/core/createError.js"(exports, module2) {
    "use strict";
    var enhanceError = require_enhanceError();
    module2.exports = function createError(message, config8, code, request, response) {
      var error = new Error(message);
      return enhanceError(error, config8, code, request, response);
    };
  }
});

// node_modules/openai/node_modules/axios/lib/core/settle.js
var require_settle = __commonJS({
  "node_modules/openai/node_modules/axios/lib/core/settle.js"(exports, module2) {
    "use strict";
    var createError = require_createError();
    module2.exports = function settle2(resolve, reject, response) {
      var validateStatus2 = response.config.validateStatus;
      if (!response.status || !validateStatus2 || validateStatus2(response.status)) {
        resolve(response);
      } else {
        reject(createError(
          "Request failed with status code " + response.status,
          response.config,
          null,
          response.request,
          response
        ));
      }
    };
  }
});

// node_modules/openai/node_modules/axios/lib/helpers/cookies.js
var require_cookies = __commonJS({
  "node_modules/openai/node_modules/axios/lib/helpers/cookies.js"(exports, module2) {
    "use strict";
    var utils = require_utils();
    module2.exports = utils.isStandardBrowserEnv() ? function standardBrowserEnv2() {
      return {
        write: function write(name, value, expires, path5, domain, secure) {
          var cookie = [];
          cookie.push(name + "=" + encodeURIComponent(value));
          if (utils.isNumber(expires)) {
            cookie.push("expires=" + new Date(expires).toGMTString());
          }
          if (utils.isString(path5)) {
            cookie.push("path=" + path5);
          }
          if (utils.isString(domain)) {
            cookie.push("domain=" + domain);
          }
          if (secure === true) {
            cookie.push("secure");
          }
          document.cookie = cookie.join("; ");
        },
        read: function read(name) {
          var match = document.cookie.match(new RegExp("(^|;\\s*)(" + name + ")=([^;]*)"));
          return match ? decodeURIComponent(match[3]) : null;
        },
        remove: function remove(name) {
          this.write(name, "", Date.now() - 864e5);
        }
      };
    }() : function nonStandardBrowserEnv2() {
      return {
        write: function write() {
        },
        read: function read() {
          return null;
        },
        remove: function remove() {
        }
      };
    }();
  }
});

// node_modules/openai/node_modules/axios/lib/helpers/isAbsoluteURL.js
var require_isAbsoluteURL = __commonJS({
  "node_modules/openai/node_modules/axios/lib/helpers/isAbsoluteURL.js"(exports, module2) {
    "use strict";
    module2.exports = function isAbsoluteURL2(url3) {
      return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url3);
    };
  }
});

// node_modules/openai/node_modules/axios/lib/helpers/combineURLs.js
var require_combineURLs = __commonJS({
  "node_modules/openai/node_modules/axios/lib/helpers/combineURLs.js"(exports, module2) {
    "use strict";
    module2.exports = function combineURLs2(baseURL, relativeURL) {
      return relativeURL ? baseURL.replace(/\/+$/, "") + "/" + relativeURL.replace(/^\/+/, "") : baseURL;
    };
  }
});

// node_modules/openai/node_modules/axios/lib/core/buildFullPath.js
var require_buildFullPath = __commonJS({
  "node_modules/openai/node_modules/axios/lib/core/buildFullPath.js"(exports, module2) {
    "use strict";
    var isAbsoluteURL2 = require_isAbsoluteURL();
    var combineURLs2 = require_combineURLs();
    module2.exports = function buildFullPath2(baseURL, requestedURL) {
      if (baseURL && !isAbsoluteURL2(requestedURL)) {
        return combineURLs2(baseURL, requestedURL);
      }
      return requestedURL;
    };
  }
});

// node_modules/openai/node_modules/axios/lib/helpers/parseHeaders.js
var require_parseHeaders = __commonJS({
  "node_modules/openai/node_modules/axios/lib/helpers/parseHeaders.js"(exports, module2) {
    "use strict";
    var utils = require_utils();
    var ignoreDuplicateOf2 = [
      "age",
      "authorization",
      "content-length",
      "content-type",
      "etag",
      "expires",
      "from",
      "host",
      "if-modified-since",
      "if-unmodified-since",
      "last-modified",
      "location",
      "max-forwards",
      "proxy-authorization",
      "referer",
      "retry-after",
      "user-agent"
    ];
    module2.exports = function parseHeaders(headers) {
      var parsed = {};
      var key;
      var val;
      var i2;
      if (!headers) {
        return parsed;
      }
      utils.forEach(headers.split("\n"), function parser(line) {
        i2 = line.indexOf(":");
        key = utils.trim(line.substr(0, i2)).toLowerCase();
        val = utils.trim(line.substr(i2 + 1));
        if (key) {
          if (parsed[key] && ignoreDuplicateOf2.indexOf(key) >= 0) {
            return;
          }
          if (key === "set-cookie") {
            parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
          } else {
            parsed[key] = parsed[key] ? parsed[key] + ", " + val : val;
          }
        }
      });
      return parsed;
    };
  }
});

// node_modules/openai/node_modules/axios/lib/helpers/isURLSameOrigin.js
var require_isURLSameOrigin = __commonJS({
  "node_modules/openai/node_modules/axios/lib/helpers/isURLSameOrigin.js"(exports, module2) {
    "use strict";
    var utils = require_utils();
    module2.exports = utils.isStandardBrowserEnv() ? function standardBrowserEnv2() {
      var msie = /(msie|trident)/i.test(navigator.userAgent);
      var urlParsingNode = document.createElement("a");
      var originURL;
      function resolveURL(url3) {
        var href = url3;
        if (msie) {
          urlParsingNode.setAttribute("href", href);
          href = urlParsingNode.href;
        }
        urlParsingNode.setAttribute("href", href);
        return {
          href: urlParsingNode.href,
          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, "") : "",
          host: urlParsingNode.host,
          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, "") : "",
          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, "") : "",
          hostname: urlParsingNode.hostname,
          port: urlParsingNode.port,
          pathname: urlParsingNode.pathname.charAt(0) === "/" ? urlParsingNode.pathname : "/" + urlParsingNode.pathname
        };
      }
      originURL = resolveURL(window.location.href);
      return function isURLSameOrigin(requestURL) {
        var parsed = utils.isString(requestURL) ? resolveURL(requestURL) : requestURL;
        return parsed.protocol === originURL.protocol && parsed.host === originURL.host;
      };
    }() : function nonStandardBrowserEnv2() {
      return function isURLSameOrigin() {
        return true;
      };
    }();
  }
});

// node_modules/openai/node_modules/axios/lib/cancel/Cancel.js
var require_Cancel = __commonJS({
  "node_modules/openai/node_modules/axios/lib/cancel/Cancel.js"(exports, module2) {
    "use strict";
    function Cancel2(message) {
      this.message = message;
    }
    Cancel2.prototype.toString = function toString3() {
      return "Cancel" + (this.message ? ": " + this.message : "");
    };
    Cancel2.prototype.__CANCEL__ = true;
    module2.exports = Cancel2;
  }
});

// node_modules/openai/node_modules/axios/lib/adapters/xhr.js
var require_xhr = __commonJS({
  "node_modules/openai/node_modules/axios/lib/adapters/xhr.js"(exports, module2) {
    "use strict";
    var utils = require_utils();
    var settle2 = require_settle();
    var cookies = require_cookies();
    var buildURL2 = require_buildURL();
    var buildFullPath2 = require_buildFullPath();
    var parseHeaders = require_parseHeaders();
    var isURLSameOrigin = require_isURLSameOrigin();
    var createError = require_createError();
    var transitionalDefaults = require_transitional();
    var Cancel2 = require_Cancel();
    module2.exports = function xhrAdapter(config8) {
      return new Promise(function dispatchXhrRequest(resolve, reject) {
        var requestData = config8.data;
        var requestHeaders = config8.headers;
        var responseType = config8.responseType;
        var onCanceled;
        function done() {
          if (config8.cancelToken) {
            config8.cancelToken.unsubscribe(onCanceled);
          }
          if (config8.signal) {
            config8.signal.removeEventListener("abort", onCanceled);
          }
        }
        if (utils.isFormData(requestData)) {
          delete requestHeaders["Content-Type"];
        }
        var request = new XMLHttpRequest();
        if (config8.auth) {
          var username = config8.auth.username || "";
          var password = config8.auth.password ? unescape(encodeURIComponent(config8.auth.password)) : "";
          requestHeaders.Authorization = "Basic " + btoa(username + ":" + password);
        }
        var fullPath = buildFullPath2(config8.baseURL, config8.url);
        request.open(config8.method.toUpperCase(), buildURL2(fullPath, config8.params, config8.paramsSerializer), true);
        request.timeout = config8.timeout;
        function onloadend() {
          if (!request) {
            return;
          }
          var responseHeaders = "getAllResponseHeaders" in request ? parseHeaders(request.getAllResponseHeaders()) : null;
          var responseData = !responseType || responseType === "text" || responseType === "json" ? request.responseText : request.response;
          var response = {
            data: responseData,
            status: request.status,
            statusText: request.statusText,
            headers: responseHeaders,
            config: config8,
            request
          };
          settle2(function _resolve(value) {
            resolve(value);
            done();
          }, function _reject(err) {
            reject(err);
            done();
          }, response);
          request = null;
        }
        if ("onloadend" in request) {
          request.onloadend = onloadend;
        } else {
          request.onreadystatechange = function handleLoad() {
            if (!request || request.readyState !== 4) {
              return;
            }
            if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf("file:") === 0)) {
              return;
            }
            setTimeout(onloadend);
          };
        }
        request.onabort = function handleAbort() {
          if (!request) {
            return;
          }
          reject(createError("Request aborted", config8, "ECONNABORTED", request));
          request = null;
        };
        request.onerror = function handleError() {
          reject(createError("Network Error", config8, null, request));
          request = null;
        };
        request.ontimeout = function handleTimeout() {
          var timeoutErrorMessage = config8.timeout ? "timeout of " + config8.timeout + "ms exceeded" : "timeout exceeded";
          var transitional2 = config8.transitional || transitionalDefaults;
          if (config8.timeoutErrorMessage) {
            timeoutErrorMessage = config8.timeoutErrorMessage;
          }
          reject(createError(
            timeoutErrorMessage,
            config8,
            transitional2.clarifyTimeoutError ? "ETIMEDOUT" : "ECONNABORTED",
            request
          ));
          request = null;
        };
        if (utils.isStandardBrowserEnv()) {
          var xsrfValue = (config8.withCredentials || isURLSameOrigin(fullPath)) && config8.xsrfCookieName ? cookies.read(config8.xsrfCookieName) : void 0;
          if (xsrfValue) {
            requestHeaders[config8.xsrfHeaderName] = xsrfValue;
          }
        }
        if ("setRequestHeader" in request) {
          utils.forEach(requestHeaders, function setRequestHeader(val, key) {
            if (typeof requestData === "undefined" && key.toLowerCase() === "content-type") {
              delete requestHeaders[key];
            } else {
              request.setRequestHeader(key, val);
            }
          });
        }
        if (!utils.isUndefined(config8.withCredentials)) {
          request.withCredentials = !!config8.withCredentials;
        }
        if (responseType && responseType !== "json") {
          request.responseType = config8.responseType;
        }
        if (typeof config8.onDownloadProgress === "function") {
          request.addEventListener("progress", config8.onDownloadProgress);
        }
        if (typeof config8.onUploadProgress === "function" && request.upload) {
          request.upload.addEventListener("progress", config8.onUploadProgress);
        }
        if (config8.cancelToken || config8.signal) {
          onCanceled = function(cancel) {
            if (!request) {
              return;
            }
            reject(!cancel || cancel && cancel.type ? new Cancel2("canceled") : cancel);
            request.abort();
            request = null;
          };
          config8.cancelToken && config8.cancelToken.subscribe(onCanceled);
          if (config8.signal) {
            config8.signal.aborted ? onCanceled() : config8.signal.addEventListener("abort", onCanceled);
          }
        }
        if (!requestData) {
          requestData = null;
        }
        request.send(requestData);
      });
    };
  }
});

// node_modules/ms/index.js
var require_ms = __commonJS({
  "node_modules/ms/index.js"(exports, module2) {
    var s = 1e3;
    var m4 = s * 60;
    var h4 = m4 * 60;
    var d6 = h4 * 24;
    var w6 = d6 * 7;
    var y5 = d6 * 365.25;
    module2.exports = function(val, options) {
      options = options || {};
      var type = typeof val;
      if (type === "string" && val.length > 0) {
        return parse(val);
      } else if (type === "number" && isFinite(val)) {
        return options.long ? fmtLong(val) : fmtShort(val);
      }
      throw new Error(
        "val is not a non-empty string or a valid number. val=" + JSON.stringify(val)
      );
    };
    function parse(str) {
      str = String(str);
      if (str.length > 100) {
        return;
      }
      var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
        str
      );
      if (!match) {
        return;
      }
      var n = parseFloat(match[1]);
      var type = (match[2] || "ms").toLowerCase();
      switch (type) {
        case "years":
        case "year":
        case "yrs":
        case "yr":
        case "y":
          return n * y5;
        case "weeks":
        case "week":
        case "w":
          return n * w6;
        case "days":
        case "day":
        case "d":
          return n * d6;
        case "hours":
        case "hour":
        case "hrs":
        case "hr":
        case "h":
          return n * h4;
        case "minutes":
        case "minute":
        case "mins":
        case "min":
        case "m":
          return n * m4;
        case "seconds":
        case "second":
        case "secs":
        case "sec":
        case "s":
          return n * s;
        case "milliseconds":
        case "millisecond":
        case "msecs":
        case "msec":
        case "ms":
          return n;
        default:
          return void 0;
      }
    }
    function fmtShort(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d6) {
        return Math.round(ms / d6) + "d";
      }
      if (msAbs >= h4) {
        return Math.round(ms / h4) + "h";
      }
      if (msAbs >= m4) {
        return Math.round(ms / m4) + "m";
      }
      if (msAbs >= s) {
        return Math.round(ms / s) + "s";
      }
      return ms + "ms";
    }
    function fmtLong(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d6) {
        return plural(ms, msAbs, d6, "day");
      }
      if (msAbs >= h4) {
        return plural(ms, msAbs, h4, "hour");
      }
      if (msAbs >= m4) {
        return plural(ms, msAbs, m4, "minute");
      }
      if (msAbs >= s) {
        return plural(ms, msAbs, s, "second");
      }
      return ms + " ms";
    }
    function plural(ms, msAbs, n, name) {
      var isPlural = msAbs >= n * 1.5;
      return Math.round(ms / n) + " " + name + (isPlural ? "s" : "");
    }
  }
});

// node_modules/debug/src/common.js
var require_common = __commonJS({
  "node_modules/debug/src/common.js"(exports, module2) {
    function setup(env2) {
      createDebug.debug = createDebug;
      createDebug.default = createDebug;
      createDebug.coerce = coerce;
      createDebug.disable = disable;
      createDebug.enable = enable;
      createDebug.enabled = enabled;
      createDebug.humanize = require_ms();
      createDebug.destroy = destroy;
      Object.keys(env2).forEach((key) => {
        createDebug[key] = env2[key];
      });
      createDebug.names = [];
      createDebug.skips = [];
      createDebug.formatters = {};
      function selectColor(namespace) {
        let hash = 0;
        for (let i2 = 0; i2 < namespace.length; i2++) {
          hash = (hash << 5) - hash + namespace.charCodeAt(i2);
          hash |= 0;
        }
        return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
      }
      createDebug.selectColor = selectColor;
      function createDebug(namespace) {
        let prevTime;
        let enableOverride = null;
        let namespacesCache;
        let enabledCache;
        function debug(...args) {
          if (!debug.enabled) {
            return;
          }
          const self2 = debug;
          const curr = Number(new Date());
          const ms = curr - (prevTime || curr);
          self2.diff = ms;
          self2.prev = prevTime;
          self2.curr = curr;
          prevTime = curr;
          args[0] = createDebug.coerce(args[0]);
          if (typeof args[0] !== "string") {
            args.unshift("%O");
          }
          let index = 0;
          args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
            if (match === "%%") {
              return "%";
            }
            index++;
            const formatter = createDebug.formatters[format];
            if (typeof formatter === "function") {
              const val = args[index];
              match = formatter.call(self2, val);
              args.splice(index, 1);
              index--;
            }
            return match;
          });
          createDebug.formatArgs.call(self2, args);
          const logFn = self2.log || createDebug.log;
          logFn.apply(self2, args);
        }
        debug.namespace = namespace;
        debug.useColors = createDebug.useColors();
        debug.color = createDebug.selectColor(namespace);
        debug.extend = extend2;
        debug.destroy = createDebug.destroy;
        Object.defineProperty(debug, "enabled", {
          enumerable: true,
          configurable: false,
          get: () => {
            if (enableOverride !== null) {
              return enableOverride;
            }
            if (namespacesCache !== createDebug.namespaces) {
              namespacesCache = createDebug.namespaces;
              enabledCache = createDebug.enabled(namespace);
            }
            return enabledCache;
          },
          set: (v4) => {
            enableOverride = v4;
          }
        });
        if (typeof createDebug.init === "function") {
          createDebug.init(debug);
        }
        return debug;
      }
      function extend2(namespace, delimiter) {
        const newDebug = createDebug(this.namespace + (typeof delimiter === "undefined" ? ":" : delimiter) + namespace);
        newDebug.log = this.log;
        return newDebug;
      }
      function enable(namespaces) {
        createDebug.save(namespaces);
        createDebug.namespaces = namespaces;
        createDebug.names = [];
        createDebug.skips = [];
        let i2;
        const split = (typeof namespaces === "string" ? namespaces : "").split(/[\s,]+/);
        const len = split.length;
        for (i2 = 0; i2 < len; i2++) {
          if (!split[i2]) {
            continue;
          }
          namespaces = split[i2].replace(/\*/g, ".*?");
          if (namespaces[0] === "-") {
            createDebug.skips.push(new RegExp("^" + namespaces.slice(1) + "$"));
          } else {
            createDebug.names.push(new RegExp("^" + namespaces + "$"));
          }
        }
      }
      function disable() {
        const namespaces = [
          ...createDebug.names.map(toNamespace),
          ...createDebug.skips.map(toNamespace).map((namespace) => "-" + namespace)
        ].join(",");
        createDebug.enable("");
        return namespaces;
      }
      function enabled(name) {
        if (name[name.length - 1] === "*") {
          return true;
        }
        let i2;
        let len;
        for (i2 = 0, len = createDebug.skips.length; i2 < len; i2++) {
          if (createDebug.skips[i2].test(name)) {
            return false;
          }
        }
        for (i2 = 0, len = createDebug.names.length; i2 < len; i2++) {
          if (createDebug.names[i2].test(name)) {
            return true;
          }
        }
        return false;
      }
      function toNamespace(regexp) {
        return regexp.toString().substring(2, regexp.toString().length - 2).replace(/\.\*\?$/, "*");
      }
      function coerce(val) {
        if (val instanceof Error) {
          return val.stack || val.message;
        }
        return val;
      }
      function destroy() {
        console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
      }
      createDebug.enable(createDebug.load());
      return createDebug;
    }
    module2.exports = setup;
  }
});

// node_modules/debug/src/browser.js
var require_browser = __commonJS({
  "node_modules/debug/src/browser.js"(exports, module2) {
    exports.formatArgs = formatArgs;
    exports.save = save;
    exports.load = load;
    exports.useColors = useColors;
    exports.storage = localstorage();
    exports.destroy = (() => {
      let warned = false;
      return () => {
        if (!warned) {
          warned = true;
          console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
        }
      };
    })();
    exports.colors = [
      "#0000CC",
      "#0000FF",
      "#0033CC",
      "#0033FF",
      "#0066CC",
      "#0066FF",
      "#0099CC",
      "#0099FF",
      "#00CC00",
      "#00CC33",
      "#00CC66",
      "#00CC99",
      "#00CCCC",
      "#00CCFF",
      "#3300CC",
      "#3300FF",
      "#3333CC",
      "#3333FF",
      "#3366CC",
      "#3366FF",
      "#3399CC",
      "#3399FF",
      "#33CC00",
      "#33CC33",
      "#33CC66",
      "#33CC99",
      "#33CCCC",
      "#33CCFF",
      "#6600CC",
      "#6600FF",
      "#6633CC",
      "#6633FF",
      "#66CC00",
      "#66CC33",
      "#9900CC",
      "#9900FF",
      "#9933CC",
      "#9933FF",
      "#99CC00",
      "#99CC33",
      "#CC0000",
      "#CC0033",
      "#CC0066",
      "#CC0099",
      "#CC00CC",
      "#CC00FF",
      "#CC3300",
      "#CC3333",
      "#CC3366",
      "#CC3399",
      "#CC33CC",
      "#CC33FF",
      "#CC6600",
      "#CC6633",
      "#CC9900",
      "#CC9933",
      "#CCCC00",
      "#CCCC33",
      "#FF0000",
      "#FF0033",
      "#FF0066",
      "#FF0099",
      "#FF00CC",
      "#FF00FF",
      "#FF3300",
      "#FF3333",
      "#FF3366",
      "#FF3399",
      "#FF33CC",
      "#FF33FF",
      "#FF6600",
      "#FF6633",
      "#FF9900",
      "#FF9933",
      "#FFCC00",
      "#FFCC33"
    ];
    function useColors() {
      if (typeof window !== "undefined" && window.process && (window.process.type === "renderer" || window.process.__nwjs)) {
        return true;
      }
      if (typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
        return false;
      }
      return typeof document !== "undefined" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || typeof window !== "undefined" && window.console && (window.console.firebug || window.console.exception && window.console.table) || typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    function formatArgs(args) {
      args[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + args[0] + (this.useColors ? "%c " : " ") + "+" + module2.exports.humanize(this.diff);
      if (!this.useColors) {
        return;
      }
      const c3 = "color: " + this.color;
      args.splice(1, 0, c3, "color: inherit");
      let index = 0;
      let lastC = 0;
      args[0].replace(/%[a-zA-Z%]/g, (match) => {
        if (match === "%%") {
          return;
        }
        index++;
        if (match === "%c") {
          lastC = index;
        }
      });
      args.splice(lastC, 0, c3);
    }
    exports.log = console.debug || console.log || (() => {
    });
    function save(namespaces) {
      try {
        if (namespaces) {
          exports.storage.setItem("debug", namespaces);
        } else {
          exports.storage.removeItem("debug");
        }
      } catch (error) {
      }
    }
    function load() {
      let r2;
      try {
        r2 = exports.storage.getItem("debug");
      } catch (error) {
      }
      if (!r2 && typeof process !== "undefined" && "env" in process) {
        r2 = process.env.DEBUG;
      }
      return r2;
    }
    function localstorage() {
      try {
        return localStorage;
      } catch (error) {
      }
    }
    module2.exports = require_common()(exports);
    var { formatters } = module2.exports;
    formatters.j = function(v4) {
      try {
        return JSON.stringify(v4);
      } catch (error) {
        return "[UnexpectedJSONParseError]: " + error.message;
      }
    };
  }
});

// node_modules/has-flag/index.js
var require_has_flag = __commonJS({
  "node_modules/has-flag/index.js"(exports, module2) {
    "use strict";
    module2.exports = (flag, argv = process.argv) => {
      const prefix = flag.startsWith("-") ? "" : flag.length === 1 ? "-" : "--";
      const position = argv.indexOf(prefix + flag);
      const terminatorPosition = argv.indexOf("--");
      return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
    };
  }
});

// node_modules/supports-color/index.js
var require_supports_color = __commonJS({
  "node_modules/supports-color/index.js"(exports, module2) {
    "use strict";
    var os3 = require("os");
    var tty2 = require("tty");
    var hasFlag2 = require_has_flag();
    var { env: env2 } = process;
    var forceColor;
    if (hasFlag2("no-color") || hasFlag2("no-colors") || hasFlag2("color=false") || hasFlag2("color=never")) {
      forceColor = 0;
    } else if (hasFlag2("color") || hasFlag2("colors") || hasFlag2("color=true") || hasFlag2("color=always")) {
      forceColor = 1;
    }
    if ("FORCE_COLOR" in env2) {
      if (env2.FORCE_COLOR === "true") {
        forceColor = 1;
      } else if (env2.FORCE_COLOR === "false") {
        forceColor = 0;
      } else {
        forceColor = env2.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(env2.FORCE_COLOR, 10), 3);
      }
    }
    function translateLevel2(level) {
      if (level === 0) {
        return false;
      }
      return {
        level,
        hasBasic: true,
        has256: level >= 2,
        has16m: level >= 3
      };
    }
    function supportsColor2(haveStream, streamIsTTY) {
      if (forceColor === 0) {
        return 0;
      }
      if (hasFlag2("color=16m") || hasFlag2("color=full") || hasFlag2("color=truecolor")) {
        return 3;
      }
      if (hasFlag2("color=256")) {
        return 2;
      }
      if (haveStream && !streamIsTTY && forceColor === void 0) {
        return 0;
      }
      const min = forceColor || 0;
      if (env2.TERM === "dumb") {
        return min;
      }
      if (process.platform === "win32") {
        const osRelease = os3.release().split(".");
        if (Number(osRelease[0]) >= 10 && Number(osRelease[2]) >= 10586) {
          return Number(osRelease[2]) >= 14931 ? 3 : 2;
        }
        return 1;
      }
      if ("CI" in env2) {
        if (["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI", "GITHUB_ACTIONS", "BUILDKITE"].some((sign) => sign in env2) || env2.CI_NAME === "codeship") {
          return 1;
        }
        return min;
      }
      if ("TEAMCITY_VERSION" in env2) {
        return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env2.TEAMCITY_VERSION) ? 1 : 0;
      }
      if (env2.COLORTERM === "truecolor") {
        return 3;
      }
      if ("TERM_PROGRAM" in env2) {
        const version = parseInt((env2.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
        switch (env2.TERM_PROGRAM) {
          case "iTerm.app":
            return version >= 3 ? 3 : 2;
          case "Apple_Terminal":
            return 2;
        }
      }
      if (/-256(color)?$/i.test(env2.TERM)) {
        return 2;
      }
      if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env2.TERM)) {
        return 1;
      }
      if ("COLORTERM" in env2) {
        return 1;
      }
      return min;
    }
    function getSupportLevel(stream4) {
      const level = supportsColor2(stream4, stream4 && stream4.isTTY);
      return translateLevel2(level);
    }
    module2.exports = {
      supportsColor: getSupportLevel,
      stdout: translateLevel2(supportsColor2(true, tty2.isatty(1))),
      stderr: translateLevel2(supportsColor2(true, tty2.isatty(2)))
    };
  }
});

// node_modules/debug/src/node.js
var require_node = __commonJS({
  "node_modules/debug/src/node.js"(exports, module2) {
    var tty2 = require("tty");
    var util2 = require("util");
    exports.init = init;
    exports.log = log;
    exports.formatArgs = formatArgs;
    exports.save = save;
    exports.load = load;
    exports.useColors = useColors;
    exports.destroy = util2.deprecate(
      () => {
      },
      "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."
    );
    exports.colors = [6, 2, 3, 4, 5, 1];
    try {
      const supportsColor2 = require_supports_color();
      if (supportsColor2 && (supportsColor2.stderr || supportsColor2).level >= 2) {
        exports.colors = [
          20,
          21,
          26,
          27,
          32,
          33,
          38,
          39,
          40,
          41,
          42,
          43,
          44,
          45,
          56,
          57,
          62,
          63,
          68,
          69,
          74,
          75,
          76,
          77,
          78,
          79,
          80,
          81,
          92,
          93,
          98,
          99,
          112,
          113,
          128,
          129,
          134,
          135,
          148,
          149,
          160,
          161,
          162,
          163,
          164,
          165,
          166,
          167,
          168,
          169,
          170,
          171,
          172,
          173,
          178,
          179,
          184,
          185,
          196,
          197,
          198,
          199,
          200,
          201,
          202,
          203,
          204,
          205,
          206,
          207,
          208,
          209,
          214,
          215,
          220,
          221
        ];
      }
    } catch (error) {
    }
    exports.inspectOpts = Object.keys(process.env).filter((key) => {
      return /^debug_/i.test(key);
    }).reduce((obj, key) => {
      const prop = key.substring(6).toLowerCase().replace(/_([a-z])/g, (_6, k6) => {
        return k6.toUpperCase();
      });
      let val = process.env[key];
      if (/^(yes|on|true|enabled)$/i.test(val)) {
        val = true;
      } else if (/^(no|off|false|disabled)$/i.test(val)) {
        val = false;
      } else if (val === "null") {
        val = null;
      } else {
        val = Number(val);
      }
      obj[prop] = val;
      return obj;
    }, {});
    function useColors() {
      return "colors" in exports.inspectOpts ? Boolean(exports.inspectOpts.colors) : tty2.isatty(process.stderr.fd);
    }
    function formatArgs(args) {
      const { namespace: name, useColors: useColors2 } = this;
      if (useColors2) {
        const c3 = this.color;
        const colorCode = "\x1B[3" + (c3 < 8 ? c3 : "8;5;" + c3);
        const prefix = `  ${colorCode};1m${name} \x1B[0m`;
        args[0] = prefix + args[0].split("\n").join("\n" + prefix);
        args.push(colorCode + "m+" + module2.exports.humanize(this.diff) + "\x1B[0m");
      } else {
        args[0] = getDate() + name + " " + args[0];
      }
    }
    function getDate() {
      if (exports.inspectOpts.hideDate) {
        return "";
      }
      return new Date().toISOString() + " ";
    }
    function log(...args) {
      return process.stderr.write(util2.format(...args) + "\n");
    }
    function save(namespaces) {
      if (namespaces) {
        process.env.DEBUG = namespaces;
      } else {
        delete process.env.DEBUG;
      }
    }
    function load() {
      return process.env.DEBUG;
    }
    function init(debug) {
      debug.inspectOpts = {};
      const keys = Object.keys(exports.inspectOpts);
      for (let i2 = 0; i2 < keys.length; i2++) {
        debug.inspectOpts[keys[i2]] = exports.inspectOpts[keys[i2]];
      }
    }
    module2.exports = require_common()(exports);
    var { formatters } = module2.exports;
    formatters.o = function(v4) {
      this.inspectOpts.colors = this.useColors;
      return util2.inspect(v4, this.inspectOpts).split("\n").map((str) => str.trim()).join(" ");
    };
    formatters.O = function(v4) {
      this.inspectOpts.colors = this.useColors;
      return util2.inspect(v4, this.inspectOpts);
    };
  }
});

// node_modules/debug/src/index.js
var require_src2 = __commonJS({
  "node_modules/debug/src/index.js"(exports, module2) {
    if (typeof process === "undefined" || process.type === "renderer" || process.browser === true || process.__nwjs) {
      module2.exports = require_browser();
    } else {
      module2.exports = require_node();
    }
  }
});

// node_modules/follow-redirects/debug.js
var require_debug = __commonJS({
  "node_modules/follow-redirects/debug.js"(exports, module2) {
    var debug;
    module2.exports = function() {
      if (!debug) {
        try {
          debug = require_src2()("follow-redirects");
        } catch (error) {
        }
        if (typeof debug !== "function") {
          debug = function() {
          };
        }
      }
      debug.apply(null, arguments);
    };
  }
});

// node_modules/follow-redirects/index.js
var require_follow_redirects = __commonJS({
  "node_modules/follow-redirects/index.js"(exports, module2) {
    var url3 = require("url");
    var URL2 = url3.URL;
    var http2 = require("http");
    var https2 = require("https");
    var Writable = require("stream").Writable;
    var assert = require("assert");
    var debug = require_debug();
    var useNativeURL = false;
    try {
      assert(new URL2());
    } catch (error) {
      useNativeURL = error.code === "ERR_INVALID_URL";
    }
    var preservedUrlFields = [
      "auth",
      "host",
      "hostname",
      "href",
      "path",
      "pathname",
      "port",
      "protocol",
      "query",
      "search",
      "hash"
    ];
    var events = ["abort", "aborted", "connect", "error", "socket", "timeout"];
    var eventHandlers = /* @__PURE__ */ Object.create(null);
    events.forEach(function(event) {
      eventHandlers[event] = function(arg1, arg2, arg3) {
        this._redirectable.emit(event, arg1, arg2, arg3);
      };
    });
    var InvalidUrlError = createErrorType(
      "ERR_INVALID_URL",
      "Invalid URL",
      TypeError
    );
    var RedirectionError = createErrorType(
      "ERR_FR_REDIRECTION_FAILURE",
      "Redirected request failed"
    );
    var TooManyRedirectsError = createErrorType(
      "ERR_FR_TOO_MANY_REDIRECTS",
      "Maximum number of redirects exceeded",
      RedirectionError
    );
    var MaxBodyLengthExceededError = createErrorType(
      "ERR_FR_MAX_BODY_LENGTH_EXCEEDED",
      "Request body larger than maxBodyLength limit"
    );
    var WriteAfterEndError = createErrorType(
      "ERR_STREAM_WRITE_AFTER_END",
      "write after end"
    );
    var destroy = Writable.prototype.destroy || noop2;
    function RedirectableRequest(options, responseCallback) {
      Writable.call(this);
      this._sanitizeOptions(options);
      this._options = options;
      this._ended = false;
      this._ending = false;
      this._redirectCount = 0;
      this._redirects = [];
      this._requestBodyLength = 0;
      this._requestBodyBuffers = [];
      if (responseCallback) {
        this.on("response", responseCallback);
      }
      var self2 = this;
      this._onNativeResponse = function(response) {
        try {
          self2._processResponse(response);
        } catch (cause) {
          self2.emit("error", cause instanceof RedirectionError ? cause : new RedirectionError({ cause }));
        }
      };
      this._performRequest();
    }
    RedirectableRequest.prototype = Object.create(Writable.prototype);
    RedirectableRequest.prototype.abort = function() {
      destroyRequest(this._currentRequest);
      this._currentRequest.abort();
      this.emit("abort");
    };
    RedirectableRequest.prototype.destroy = function(error) {
      destroyRequest(this._currentRequest, error);
      destroy.call(this, error);
      return this;
    };
    RedirectableRequest.prototype.write = function(data, encoding, callback) {
      if (this._ending) {
        throw new WriteAfterEndError();
      }
      if (!isString2(data) && !isBuffer2(data)) {
        throw new TypeError("data should be a string, Buffer or Uint8Array");
      }
      if (isFunction2(encoding)) {
        callback = encoding;
        encoding = null;
      }
      if (data.length === 0) {
        if (callback) {
          callback();
        }
        return;
      }
      if (this._requestBodyLength + data.length <= this._options.maxBodyLength) {
        this._requestBodyLength += data.length;
        this._requestBodyBuffers.push({ data, encoding });
        this._currentRequest.write(data, encoding, callback);
      } else {
        this.emit("error", new MaxBodyLengthExceededError());
        this.abort();
      }
    };
    RedirectableRequest.prototype.end = function(data, encoding, callback) {
      if (isFunction2(data)) {
        callback = data;
        data = encoding = null;
      } else if (isFunction2(encoding)) {
        callback = encoding;
        encoding = null;
      }
      if (!data) {
        this._ended = this._ending = true;
        this._currentRequest.end(null, null, callback);
      } else {
        var self2 = this;
        var currentRequest = this._currentRequest;
        this.write(data, encoding, function() {
          self2._ended = true;
          currentRequest.end(null, null, callback);
        });
        this._ending = true;
      }
    };
    RedirectableRequest.prototype.setHeader = function(name, value) {
      this._options.headers[name] = value;
      this._currentRequest.setHeader(name, value);
    };
    RedirectableRequest.prototype.removeHeader = function(name) {
      delete this._options.headers[name];
      this._currentRequest.removeHeader(name);
    };
    RedirectableRequest.prototype.setTimeout = function(msecs, callback) {
      var self2 = this;
      function destroyOnTimeout(socket) {
        socket.setTimeout(msecs);
        socket.removeListener("timeout", socket.destroy);
        socket.addListener("timeout", socket.destroy);
      }
      function startTimer(socket) {
        if (self2._timeout) {
          clearTimeout(self2._timeout);
        }
        self2._timeout = setTimeout(function() {
          self2.emit("timeout");
          clearTimer();
        }, msecs);
        destroyOnTimeout(socket);
      }
      function clearTimer() {
        if (self2._timeout) {
          clearTimeout(self2._timeout);
          self2._timeout = null;
        }
        self2.removeListener("abort", clearTimer);
        self2.removeListener("error", clearTimer);
        self2.removeListener("response", clearTimer);
        self2.removeListener("close", clearTimer);
        if (callback) {
          self2.removeListener("timeout", callback);
        }
        if (!self2.socket) {
          self2._currentRequest.removeListener("socket", startTimer);
        }
      }
      if (callback) {
        this.on("timeout", callback);
      }
      if (this.socket) {
        startTimer(this.socket);
      } else {
        this._currentRequest.once("socket", startTimer);
      }
      this.on("socket", destroyOnTimeout);
      this.on("abort", clearTimer);
      this.on("error", clearTimer);
      this.on("response", clearTimer);
      this.on("close", clearTimer);
      return this;
    };
    [
      "flushHeaders",
      "getHeader",
      "setNoDelay",
      "setSocketKeepAlive"
    ].forEach(function(method) {
      RedirectableRequest.prototype[method] = function(a2, b6) {
        return this._currentRequest[method](a2, b6);
      };
    });
    ["aborted", "connection", "socket"].forEach(function(property) {
      Object.defineProperty(RedirectableRequest.prototype, property, {
        get: function() {
          return this._currentRequest[property];
        }
      });
    });
    RedirectableRequest.prototype._sanitizeOptions = function(options) {
      if (!options.headers) {
        options.headers = {};
      }
      if (options.host) {
        if (!options.hostname) {
          options.hostname = options.host;
        }
        delete options.host;
      }
      if (!options.pathname && options.path) {
        var searchPos = options.path.indexOf("?");
        if (searchPos < 0) {
          options.pathname = options.path;
        } else {
          options.pathname = options.path.substring(0, searchPos);
          options.search = options.path.substring(searchPos);
        }
      }
    };
    RedirectableRequest.prototype._performRequest = function() {
      var protocol = this._options.protocol;
      var nativeProtocol = this._options.nativeProtocols[protocol];
      if (!nativeProtocol) {
        throw new TypeError("Unsupported protocol " + protocol);
      }
      if (this._options.agents) {
        var scheme = protocol.slice(0, -1);
        this._options.agent = this._options.agents[scheme];
      }
      var request = this._currentRequest = nativeProtocol.request(this._options, this._onNativeResponse);
      request._redirectable = this;
      for (var event of events) {
        request.on(event, eventHandlers[event]);
      }
      this._currentUrl = /^\//.test(this._options.path) ? url3.format(this._options) : this._options.path;
      if (this._isRedirect) {
        var i2 = 0;
        var self2 = this;
        var buffers = this._requestBodyBuffers;
        (function writeNext(error) {
          if (request === self2._currentRequest) {
            if (error) {
              self2.emit("error", error);
            } else if (i2 < buffers.length) {
              var buffer = buffers[i2++];
              if (!request.finished) {
                request.write(buffer.data, buffer.encoding, writeNext);
              }
            } else if (self2._ended) {
              request.end();
            }
          }
        })();
      }
    };
    RedirectableRequest.prototype._processResponse = function(response) {
      var statusCode = response.statusCode;
      if (this._options.trackRedirects) {
        this._redirects.push({
          url: this._currentUrl,
          headers: response.headers,
          statusCode
        });
      }
      var location = response.headers.location;
      if (!location || this._options.followRedirects === false || statusCode < 300 || statusCode >= 400) {
        response.responseUrl = this._currentUrl;
        response.redirects = this._redirects;
        this.emit("response", response);
        this._requestBodyBuffers = [];
        return;
      }
      destroyRequest(this._currentRequest);
      response.destroy();
      if (++this._redirectCount > this._options.maxRedirects) {
        throw new TooManyRedirectsError();
      }
      var requestHeaders;
      var beforeRedirect = this._options.beforeRedirect;
      if (beforeRedirect) {
        requestHeaders = Object.assign({
          Host: response.req.getHeader("host")
        }, this._options.headers);
      }
      var method = this._options.method;
      if ((statusCode === 301 || statusCode === 302) && this._options.method === "POST" || statusCode === 303 && !/^(?:GET|HEAD)$/.test(this._options.method)) {
        this._options.method = "GET";
        this._requestBodyBuffers = [];
        removeMatchingHeaders(/^content-/i, this._options.headers);
      }
      var currentHostHeader = removeMatchingHeaders(/^host$/i, this._options.headers);
      var currentUrlParts = parseUrl(this._currentUrl);
      var currentHost = currentHostHeader || currentUrlParts.host;
      var currentUrl = /^\w+:/.test(location) ? this._currentUrl : url3.format(Object.assign(currentUrlParts, { host: currentHost }));
      var redirectUrl = resolveUrl(location, currentUrl);
      debug("redirecting to", redirectUrl.href);
      this._isRedirect = true;
      spreadUrlObject(redirectUrl, this._options);
      if (redirectUrl.protocol !== currentUrlParts.protocol && redirectUrl.protocol !== "https:" || redirectUrl.host !== currentHost && !isSubdomain(redirectUrl.host, currentHost)) {
        removeMatchingHeaders(/^(?:authorization|cookie)$/i, this._options.headers);
      }
      if (isFunction2(beforeRedirect)) {
        var responseDetails = {
          headers: response.headers,
          statusCode
        };
        var requestDetails = {
          url: currentUrl,
          method,
          headers: requestHeaders
        };
        beforeRedirect(this._options, responseDetails, requestDetails);
        this._sanitizeOptions(this._options);
      }
      this._performRequest();
    };
    function wrap(protocols) {
      var exports2 = {
        maxRedirects: 21,
        maxBodyLength: 10 * 1024 * 1024
      };
      var nativeProtocols = {};
      Object.keys(protocols).forEach(function(scheme) {
        var protocol = scheme + ":";
        var nativeProtocol = nativeProtocols[protocol] = protocols[scheme];
        var wrappedProtocol = exports2[scheme] = Object.create(nativeProtocol);
        function request(input, options, callback) {
          if (isURL(input)) {
            input = spreadUrlObject(input);
          } else if (isString2(input)) {
            input = spreadUrlObject(parseUrl(input));
          } else {
            callback = options;
            options = validateUrl(input);
            input = { protocol };
          }
          if (isFunction2(options)) {
            callback = options;
            options = null;
          }
          options = Object.assign({
            maxRedirects: exports2.maxRedirects,
            maxBodyLength: exports2.maxBodyLength
          }, input, options);
          options.nativeProtocols = nativeProtocols;
          if (!isString2(options.host) && !isString2(options.hostname)) {
            options.hostname = "::1";
          }
          assert.equal(options.protocol, protocol, "protocol mismatch");
          debug("options", options);
          return new RedirectableRequest(options, callback);
        }
        function get(input, options, callback) {
          var wrappedRequest = wrappedProtocol.request(input, options, callback);
          wrappedRequest.end();
          return wrappedRequest;
        }
        Object.defineProperties(wrappedProtocol, {
          request: { value: request, configurable: true, enumerable: true, writable: true },
          get: { value: get, configurable: true, enumerable: true, writable: true }
        });
      });
      return exports2;
    }
    function noop2() {
    }
    function parseUrl(input) {
      var parsed;
      if (useNativeURL) {
        parsed = new URL2(input);
      } else {
        parsed = validateUrl(url3.parse(input));
        if (!isString2(parsed.protocol)) {
          throw new InvalidUrlError({ input });
        }
      }
      return parsed;
    }
    function resolveUrl(relative, base) {
      return useNativeURL ? new URL2(relative, base) : parseUrl(url3.resolve(base, relative));
    }
    function validateUrl(input) {
      if (/^\[/.test(input.hostname) && !/^\[[:0-9a-f]+\]$/i.test(input.hostname)) {
        throw new InvalidUrlError({ input: input.href || input });
      }
      if (/^\[/.test(input.host) && !/^\[[:0-9a-f]+\](:\d+)?$/i.test(input.host)) {
        throw new InvalidUrlError({ input: input.href || input });
      }
      return input;
    }
    function spreadUrlObject(urlObject, target) {
      var spread3 = target || {};
      for (var key of preservedUrlFields) {
        spread3[key] = urlObject[key];
      }
      if (spread3.hostname.startsWith("[")) {
        spread3.hostname = spread3.hostname.slice(1, -1);
      }
      if (spread3.port !== "") {
        spread3.port = Number(spread3.port);
      }
      spread3.path = spread3.search ? spread3.pathname + spread3.search : spread3.pathname;
      return spread3;
    }
    function removeMatchingHeaders(regex, headers) {
      var lastValue;
      for (var header in headers) {
        if (regex.test(header)) {
          lastValue = headers[header];
          delete headers[header];
        }
      }
      return lastValue === null || typeof lastValue === "undefined" ? void 0 : String(lastValue).trim();
    }
    function createErrorType(code, message, baseClass) {
      function CustomError(properties) {
        Error.captureStackTrace(this, this.constructor);
        Object.assign(this, properties || {});
        this.code = code;
        this.message = this.cause ? message + ": " + this.cause.message : message;
      }
      CustomError.prototype = new (baseClass || Error)();
      Object.defineProperties(CustomError.prototype, {
        constructor: {
          value: CustomError,
          enumerable: false
        },
        name: {
          value: "Error [" + code + "]",
          enumerable: false
        }
      });
      return CustomError;
    }
    function destroyRequest(request, error) {
      for (var event of events) {
        request.removeListener(event, eventHandlers[event]);
      }
      request.on("error", noop2);
      request.destroy(error);
    }
    function isSubdomain(subdomain, domain) {
      assert(isString2(subdomain) && isString2(domain));
      var dot = subdomain.length - domain.length - 1;
      return dot > 0 && subdomain[dot] === "." && subdomain.endsWith(domain);
    }
    function isString2(value) {
      return typeof value === "string" || value instanceof String;
    }
    function isFunction2(value) {
      return typeof value === "function";
    }
    function isBuffer2(value) {
      return typeof value === "object" && "length" in value;
    }
    function isURL(value) {
      return URL2 && value instanceof URL2;
    }
    module2.exports = wrap({ http: http2, https: https2 });
    module2.exports.wrap = wrap;
  }
});

// node_modules/openai/node_modules/axios/lib/env/data.js
var require_data = __commonJS({
  "node_modules/openai/node_modules/axios/lib/env/data.js"(exports, module2) {
    module2.exports = {
      "version": "0.26.1"
    };
  }
});

// node_modules/openai/node_modules/axios/lib/adapters/http.js
var require_http = __commonJS({
  "node_modules/openai/node_modules/axios/lib/adapters/http.js"(exports, module2) {
    "use strict";
    var utils = require_utils();
    var settle2 = require_settle();
    var buildFullPath2 = require_buildFullPath();
    var buildURL2 = require_buildURL();
    var http2 = require("http");
    var https2 = require("https");
    var httpFollow2 = require_follow_redirects().http;
    var httpsFollow2 = require_follow_redirects().https;
    var url3 = require("url");
    var zlib2 = require("zlib");
    var VERSION3 = require_data().version;
    var createError = require_createError();
    var enhanceError = require_enhanceError();
    var transitionalDefaults = require_transitional();
    var Cancel2 = require_Cancel();
    var isHttps2 = /https:?/;
    function setProxy2(options, proxy, location) {
      options.hostname = proxy.host;
      options.host = proxy.host;
      options.port = proxy.port;
      options.path = location;
      if (proxy.auth) {
        var base64 = Buffer.from(proxy.auth.username + ":" + proxy.auth.password, "utf8").toString("base64");
        options.headers["Proxy-Authorization"] = "Basic " + base64;
      }
      options.beforeRedirect = function beforeRedirect(redirection) {
        redirection.headers.host = redirection.host;
        setProxy2(redirection, proxy, redirection.href);
      };
    }
    module2.exports = function httpAdapter2(config8) {
      return new Promise(function dispatchHttpRequest(resolvePromise, rejectPromise) {
        var onCanceled;
        function done() {
          if (config8.cancelToken) {
            config8.cancelToken.unsubscribe(onCanceled);
          }
          if (config8.signal) {
            config8.signal.removeEventListener("abort", onCanceled);
          }
        }
        var resolve = function resolve2(value) {
          done();
          resolvePromise(value);
        };
        var rejected = false;
        var reject = function reject2(value) {
          done();
          rejected = true;
          rejectPromise(value);
        };
        var data = config8.data;
        var headers = config8.headers;
        var headerNames = {};
        Object.keys(headers).forEach(function storeLowerName(name) {
          headerNames[name.toLowerCase()] = name;
        });
        if ("user-agent" in headerNames) {
          if (!headers[headerNames["user-agent"]]) {
            delete headers[headerNames["user-agent"]];
          }
        } else {
          headers["User-Agent"] = "axios/" + VERSION3;
        }
        if (data && !utils.isStream(data)) {
          if (Buffer.isBuffer(data)) {
          } else if (utils.isArrayBuffer(data)) {
            data = Buffer.from(new Uint8Array(data));
          } else if (utils.isString(data)) {
            data = Buffer.from(data, "utf-8");
          } else {
            return reject(createError(
              "Data after transformation must be a string, an ArrayBuffer, a Buffer, or a Stream",
              config8
            ));
          }
          if (config8.maxBodyLength > -1 && data.length > config8.maxBodyLength) {
            return reject(createError("Request body larger than maxBodyLength limit", config8));
          }
          if (!headerNames["content-length"]) {
            headers["Content-Length"] = data.length;
          }
        }
        var auth = void 0;
        if (config8.auth) {
          var username = config8.auth.username || "";
          var password = config8.auth.password || "";
          auth = username + ":" + password;
        }
        var fullPath = buildFullPath2(config8.baseURL, config8.url);
        var parsed = url3.parse(fullPath);
        var protocol = parsed.protocol || "http:";
        if (!auth && parsed.auth) {
          var urlAuth = parsed.auth.split(":");
          var urlUsername = urlAuth[0] || "";
          var urlPassword = urlAuth[1] || "";
          auth = urlUsername + ":" + urlPassword;
        }
        if (auth && headerNames.authorization) {
          delete headers[headerNames.authorization];
        }
        var isHttpsRequest = isHttps2.test(protocol);
        var agent = isHttpsRequest ? config8.httpsAgent : config8.httpAgent;
        try {
          buildURL2(parsed.path, config8.params, config8.paramsSerializer).replace(/^\?/, "");
        } catch (err) {
          var customErr = new Error(err.message);
          customErr.config = config8;
          customErr.url = config8.url;
          customErr.exists = true;
          reject(customErr);
        }
        var options = {
          path: buildURL2(parsed.path, config8.params, config8.paramsSerializer).replace(/^\?/, ""),
          method: config8.method.toUpperCase(),
          headers,
          agent,
          agents: { http: config8.httpAgent, https: config8.httpsAgent },
          auth
        };
        if (config8.socketPath) {
          options.socketPath = config8.socketPath;
        } else {
          options.hostname = parsed.hostname;
          options.port = parsed.port;
        }
        var proxy = config8.proxy;
        if (!proxy && proxy !== false) {
          var proxyEnv = protocol.slice(0, -1) + "_proxy";
          var proxyUrl = process.env[proxyEnv] || process.env[proxyEnv.toUpperCase()];
          if (proxyUrl) {
            var parsedProxyUrl = url3.parse(proxyUrl);
            var noProxyEnv = process.env.no_proxy || process.env.NO_PROXY;
            var shouldProxy = true;
            if (noProxyEnv) {
              var noProxy = noProxyEnv.split(",").map(function trim2(s) {
                return s.trim();
              });
              shouldProxy = !noProxy.some(function proxyMatch(proxyElement) {
                if (!proxyElement) {
                  return false;
                }
                if (proxyElement === "*") {
                  return true;
                }
                if (proxyElement[0] === "." && parsed.hostname.substr(parsed.hostname.length - proxyElement.length) === proxyElement) {
                  return true;
                }
                return parsed.hostname === proxyElement;
              });
            }
            if (shouldProxy) {
              proxy = {
                host: parsedProxyUrl.hostname,
                port: parsedProxyUrl.port,
                protocol: parsedProxyUrl.protocol
              };
              if (parsedProxyUrl.auth) {
                var proxyUrlAuth = parsedProxyUrl.auth.split(":");
                proxy.auth = {
                  username: proxyUrlAuth[0],
                  password: proxyUrlAuth[1]
                };
              }
            }
          }
        }
        if (proxy) {
          options.headers.host = parsed.hostname + (parsed.port ? ":" + parsed.port : "");
          setProxy2(options, proxy, protocol + "//" + parsed.hostname + (parsed.port ? ":" + parsed.port : "") + options.path);
        }
        var transport;
        var isHttpsProxy = isHttpsRequest && (proxy ? isHttps2.test(proxy.protocol) : true);
        if (config8.transport) {
          transport = config8.transport;
        } else if (config8.maxRedirects === 0) {
          transport = isHttpsProxy ? https2 : http2;
        } else {
          if (config8.maxRedirects) {
            options.maxRedirects = config8.maxRedirects;
          }
          transport = isHttpsProxy ? httpsFollow2 : httpFollow2;
        }
        if (config8.maxBodyLength > -1) {
          options.maxBodyLength = config8.maxBodyLength;
        }
        if (config8.insecureHTTPParser) {
          options.insecureHTTPParser = config8.insecureHTTPParser;
        }
        var req = transport.request(options, function handleResponse(res) {
          if (req.aborted)
            return;
          var stream4 = res;
          var lastRequest = res.req || req;
          if (res.statusCode !== 204 && lastRequest.method !== "HEAD" && config8.decompress !== false) {
            switch (res.headers["content-encoding"]) {
              case "gzip":
              case "compress":
              case "deflate":
                stream4 = stream4.pipe(zlib2.createUnzip());
                delete res.headers["content-encoding"];
                break;
            }
          }
          var response = {
            status: res.statusCode,
            statusText: res.statusMessage,
            headers: res.headers,
            config: config8,
            request: lastRequest
          };
          if (config8.responseType === "stream") {
            response.data = stream4;
            settle2(resolve, reject, response);
          } else {
            var responseBuffer = [];
            var totalResponseBytes = 0;
            stream4.on("data", function handleStreamData(chunk) {
              responseBuffer.push(chunk);
              totalResponseBytes += chunk.length;
              if (config8.maxContentLength > -1 && totalResponseBytes > config8.maxContentLength) {
                rejected = true;
                stream4.destroy();
                reject(createError(
                  "maxContentLength size of " + config8.maxContentLength + " exceeded",
                  config8,
                  null,
                  lastRequest
                ));
              }
            });
            stream4.on("aborted", function handlerStreamAborted() {
              if (rejected) {
                return;
              }
              stream4.destroy();
              reject(createError("error request aborted", config8, "ERR_REQUEST_ABORTED", lastRequest));
            });
            stream4.on("error", function handleStreamError(err) {
              if (req.aborted)
                return;
              reject(enhanceError(err, config8, null, lastRequest));
            });
            stream4.on("end", function handleStreamEnd() {
              try {
                var responseData = responseBuffer.length === 1 ? responseBuffer[0] : Buffer.concat(responseBuffer);
                if (config8.responseType !== "arraybuffer") {
                  responseData = responseData.toString(config8.responseEncoding);
                  if (!config8.responseEncoding || config8.responseEncoding === "utf8") {
                    responseData = utils.stripBOM(responseData);
                  }
                }
                response.data = responseData;
              } catch (err) {
                reject(enhanceError(err, config8, err.code, response.request, response));
              }
              settle2(resolve, reject, response);
            });
          }
        });
        req.on("error", function handleRequestError(err) {
          if (req.aborted && err.code !== "ERR_FR_TOO_MANY_REDIRECTS")
            return;
          reject(enhanceError(err, config8, null, req));
        });
        req.on("socket", function handleRequestSocket(socket) {
          socket.setKeepAlive(true, 1e3 * 60);
        });
        if (config8.timeout) {
          var timeout = parseInt(config8.timeout, 10);
          if (isNaN(timeout)) {
            reject(createError(
              "error trying to parse `config.timeout` to int",
              config8,
              "ERR_PARSE_TIMEOUT",
              req
            ));
            return;
          }
          req.setTimeout(timeout, function handleRequestTimeout() {
            req.abort();
            var timeoutErrorMessage = "";
            if (config8.timeoutErrorMessage) {
              timeoutErrorMessage = config8.timeoutErrorMessage;
            } else {
              timeoutErrorMessage = "timeout of " + config8.timeout + "ms exceeded";
            }
            var transitional2 = config8.transitional || transitionalDefaults;
            reject(createError(
              timeoutErrorMessage,
              config8,
              transitional2.clarifyTimeoutError ? "ETIMEDOUT" : "ECONNABORTED",
              req
            ));
          });
        }
        if (config8.cancelToken || config8.signal) {
          onCanceled = function(cancel) {
            if (req.aborted)
              return;
            req.abort();
            reject(!cancel || cancel && cancel.type ? new Cancel2("canceled") : cancel);
          };
          config8.cancelToken && config8.cancelToken.subscribe(onCanceled);
          if (config8.signal) {
            config8.signal.aborted ? onCanceled() : config8.signal.addEventListener("abort", onCanceled);
          }
        }
        if (utils.isStream(data)) {
          data.on("error", function handleStreamError(err) {
            reject(enhanceError(err, config8, null, req));
          }).pipe(req);
        } else {
          req.end(data);
        }
      });
    };
  }
});

// node_modules/openai/node_modules/axios/lib/defaults/index.js
var require_defaults = __commonJS({
  "node_modules/openai/node_modules/axios/lib/defaults/index.js"(exports, module2) {
    "use strict";
    var utils = require_utils();
    var normalizeHeaderName = require_normalizeHeaderName();
    var enhanceError = require_enhanceError();
    var transitionalDefaults = require_transitional();
    var DEFAULT_CONTENT_TYPE = {
      "Content-Type": "application/x-www-form-urlencoded"
    };
    function setContentTypeIfUnset(headers, value) {
      if (!utils.isUndefined(headers) && utils.isUndefined(headers["Content-Type"])) {
        headers["Content-Type"] = value;
      }
    }
    function getDefaultAdapter() {
      var adapter;
      if (typeof XMLHttpRequest !== "undefined") {
        adapter = require_xhr();
      } else if (typeof process !== "undefined" && Object.prototype.toString.call(process) === "[object process]") {
        adapter = require_http();
      }
      return adapter;
    }
    function stringifySafely2(rawValue, parser, encoder) {
      if (utils.isString(rawValue)) {
        try {
          (parser || JSON.parse)(rawValue);
          return utils.trim(rawValue);
        } catch (e2) {
          if (e2.name !== "SyntaxError") {
            throw e2;
          }
        }
      }
      return (encoder || JSON.stringify)(rawValue);
    }
    var defaults2 = {
      transitional: transitionalDefaults,
      adapter: getDefaultAdapter(),
      transformRequest: [function transformRequest2(data, headers) {
        normalizeHeaderName(headers, "Accept");
        normalizeHeaderName(headers, "Content-Type");
        if (utils.isFormData(data) || utils.isArrayBuffer(data) || utils.isBuffer(data) || utils.isStream(data) || utils.isFile(data) || utils.isBlob(data)) {
          return data;
        }
        if (utils.isArrayBufferView(data)) {
          return data.buffer;
        }
        if (utils.isURLSearchParams(data)) {
          setContentTypeIfUnset(headers, "application/x-www-form-urlencoded;charset=utf-8");
          return data.toString();
        }
        if (utils.isObject(data) || headers && headers["Content-Type"] === "application/json") {
          setContentTypeIfUnset(headers, "application/json");
          return stringifySafely2(data);
        }
        return data;
      }],
      transformResponse: [function transformResponse2(data) {
        var transitional2 = this.transitional || defaults2.transitional;
        var silentJSONParsing = transitional2 && transitional2.silentJSONParsing;
        var forcedJSONParsing = transitional2 && transitional2.forcedJSONParsing;
        var strictJSONParsing = !silentJSONParsing && this.responseType === "json";
        if (strictJSONParsing || forcedJSONParsing && utils.isString(data) && data.length) {
          try {
            return JSON.parse(data);
          } catch (e2) {
            if (strictJSONParsing) {
              if (e2.name === "SyntaxError") {
                throw enhanceError(e2, this, "E_JSON_PARSE");
              }
              throw e2;
            }
          }
        }
        return data;
      }],
      timeout: 0,
      xsrfCookieName: "XSRF-TOKEN",
      xsrfHeaderName: "X-XSRF-TOKEN",
      maxContentLength: -1,
      maxBodyLength: -1,
      validateStatus: function validateStatus2(status) {
        return status >= 200 && status < 300;
      },
      headers: {
        common: {
          "Accept": "application/json, text/plain, */*"
        }
      }
    };
    utils.forEach(["delete", "get", "head"], function forEachMethodNoData2(method) {
      defaults2.headers[method] = {};
    });
    utils.forEach(["post", "put", "patch"], function forEachMethodWithData2(method) {
      defaults2.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
    });
    module2.exports = defaults2;
  }
});

// node_modules/openai/node_modules/axios/lib/core/transformData.js
var require_transformData = __commonJS({
  "node_modules/openai/node_modules/axios/lib/core/transformData.js"(exports, module2) {
    "use strict";
    var utils = require_utils();
    var defaults2 = require_defaults();
    module2.exports = function transformData2(data, headers, fns) {
      var context = this || defaults2;
      utils.forEach(fns, function transform(fn) {
        data = fn.call(context, data, headers);
      });
      return data;
    };
  }
});

// node_modules/openai/node_modules/axios/lib/cancel/isCancel.js
var require_isCancel = __commonJS({
  "node_modules/openai/node_modules/axios/lib/cancel/isCancel.js"(exports, module2) {
    "use strict";
    module2.exports = function isCancel3(value) {
      return !!(value && value.__CANCEL__);
    };
  }
});

// node_modules/openai/node_modules/axios/lib/core/dispatchRequest.js
var require_dispatchRequest = __commonJS({
  "node_modules/openai/node_modules/axios/lib/core/dispatchRequest.js"(exports, module2) {
    "use strict";
    var utils = require_utils();
    var transformData2 = require_transformData();
    var isCancel3 = require_isCancel();
    var defaults2 = require_defaults();
    var Cancel2 = require_Cancel();
    function throwIfCancellationRequested2(config8) {
      if (config8.cancelToken) {
        config8.cancelToken.throwIfRequested();
      }
      if (config8.signal && config8.signal.aborted) {
        throw new Cancel2("canceled");
      }
    }
    module2.exports = function dispatchRequest2(config8) {
      throwIfCancellationRequested2(config8);
      config8.headers = config8.headers || {};
      config8.data = transformData2.call(
        config8,
        config8.data,
        config8.headers,
        config8.transformRequest
      );
      config8.headers = utils.merge(
        config8.headers.common || {},
        config8.headers[config8.method] || {},
        config8.headers
      );
      utils.forEach(
        ["delete", "get", "head", "post", "put", "patch", "common"],
        function cleanHeaderConfig(method) {
          delete config8.headers[method];
        }
      );
      var adapter = config8.adapter || defaults2.adapter;
      return adapter(config8).then(function onAdapterResolution(response) {
        throwIfCancellationRequested2(config8);
        response.data = transformData2.call(
          config8,
          response.data,
          response.headers,
          config8.transformResponse
        );
        return response;
      }, function onAdapterRejection(reason) {
        if (!isCancel3(reason)) {
          throwIfCancellationRequested2(config8);
          if (reason && reason.response) {
            reason.response.data = transformData2.call(
              config8,
              reason.response.data,
              reason.response.headers,
              config8.transformResponse
            );
          }
        }
        return Promise.reject(reason);
      });
    };
  }
});

// node_modules/openai/node_modules/axios/lib/core/mergeConfig.js
var require_mergeConfig = __commonJS({
  "node_modules/openai/node_modules/axios/lib/core/mergeConfig.js"(exports, module2) {
    "use strict";
    var utils = require_utils();
    module2.exports = function mergeConfig3(config1, config22) {
      config22 = config22 || {};
      var config8 = {};
      function getMergedValue(target, source) {
        if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
          return utils.merge(target, source);
        } else if (utils.isPlainObject(source)) {
          return utils.merge({}, source);
        } else if (utils.isArray(source)) {
          return source.slice();
        }
        return source;
      }
      function mergeDeepProperties(prop) {
        if (!utils.isUndefined(config22[prop])) {
          return getMergedValue(config1[prop], config22[prop]);
        } else if (!utils.isUndefined(config1[prop])) {
          return getMergedValue(void 0, config1[prop]);
        }
      }
      function valueFromConfig2(prop) {
        if (!utils.isUndefined(config22[prop])) {
          return getMergedValue(void 0, config22[prop]);
        }
      }
      function defaultToConfig2(prop) {
        if (!utils.isUndefined(config22[prop])) {
          return getMergedValue(void 0, config22[prop]);
        } else if (!utils.isUndefined(config1[prop])) {
          return getMergedValue(void 0, config1[prop]);
        }
      }
      function mergeDirectKeys(prop) {
        if (prop in config22) {
          return getMergedValue(config1[prop], config22[prop]);
        } else if (prop in config1) {
          return getMergedValue(void 0, config1[prop]);
        }
      }
      var mergeMap = {
        "url": valueFromConfig2,
        "method": valueFromConfig2,
        "data": valueFromConfig2,
        "baseURL": defaultToConfig2,
        "transformRequest": defaultToConfig2,
        "transformResponse": defaultToConfig2,
        "paramsSerializer": defaultToConfig2,
        "timeout": defaultToConfig2,
        "timeoutMessage": defaultToConfig2,
        "withCredentials": defaultToConfig2,
        "adapter": defaultToConfig2,
        "responseType": defaultToConfig2,
        "xsrfCookieName": defaultToConfig2,
        "xsrfHeaderName": defaultToConfig2,
        "onUploadProgress": defaultToConfig2,
        "onDownloadProgress": defaultToConfig2,
        "decompress": defaultToConfig2,
        "maxContentLength": defaultToConfig2,
        "maxBodyLength": defaultToConfig2,
        "transport": defaultToConfig2,
        "httpAgent": defaultToConfig2,
        "httpsAgent": defaultToConfig2,
        "cancelToken": defaultToConfig2,
        "socketPath": defaultToConfig2,
        "responseEncoding": defaultToConfig2,
        "validateStatus": mergeDirectKeys
      };
      utils.forEach(Object.keys(config1).concat(Object.keys(config22)), function computeConfigValue(prop) {
        var merge2 = mergeMap[prop] || mergeDeepProperties;
        var configValue = merge2(prop);
        utils.isUndefined(configValue) && merge2 !== mergeDirectKeys || (config8[prop] = configValue);
      });
      return config8;
    };
  }
});

// node_modules/openai/node_modules/axios/lib/helpers/validator.js
var require_validator = __commonJS({
  "node_modules/openai/node_modules/axios/lib/helpers/validator.js"(exports, module2) {
    "use strict";
    var VERSION3 = require_data().version;
    var validators3 = {};
    ["object", "boolean", "number", "function", "string", "symbol"].forEach(function(type, i2) {
      validators3[type] = function validator(thing) {
        return typeof thing === type || "a" + (i2 < 1 ? "n " : " ") + type;
      };
    });
    var deprecatedWarnings2 = {};
    validators3.transitional = function transitional2(validator, version, message) {
      function formatMessage(opt, desc) {
        return "[Axios v" + VERSION3 + "] Transitional option '" + opt + "'" + desc + (message ? ". " + message : "");
      }
      return function(value, opt, opts) {
        if (validator === false) {
          throw new Error(formatMessage(opt, " has been removed" + (version ? " in " + version : "")));
        }
        if (version && !deprecatedWarnings2[opt]) {
          deprecatedWarnings2[opt] = true;
          console.warn(
            formatMessage(
              opt,
              " has been deprecated since v" + version + " and will be removed in the near future"
            )
          );
        }
        return validator ? validator(value, opt, opts) : true;
      };
    };
    function assertOptions2(options, schema, allowUnknown) {
      if (typeof options !== "object") {
        throw new TypeError("options must be an object");
      }
      var keys = Object.keys(options);
      var i2 = keys.length;
      while (i2-- > 0) {
        var opt = keys[i2];
        var validator = schema[opt];
        if (validator) {
          var value = options[opt];
          var result = value === void 0 || validator(value, opt, options);
          if (result !== true) {
            throw new TypeError("option " + opt + " must be " + result);
          }
          continue;
        }
        if (allowUnknown !== true) {
          throw Error("Unknown option " + opt);
        }
      }
    }
    module2.exports = {
      assertOptions: assertOptions2,
      validators: validators3
    };
  }
});

// node_modules/openai/node_modules/axios/lib/core/Axios.js
var require_Axios = __commonJS({
  "node_modules/openai/node_modules/axios/lib/core/Axios.js"(exports, module2) {
    "use strict";
    var utils = require_utils();
    var buildURL2 = require_buildURL();
    var InterceptorManager2 = require_InterceptorManager();
    var dispatchRequest2 = require_dispatchRequest();
    var mergeConfig3 = require_mergeConfig();
    var validator = require_validator();
    var validators3 = validator.validators;
    function Axios3(instanceConfig) {
      this.defaults = instanceConfig;
      this.interceptors = {
        request: new InterceptorManager2(),
        response: new InterceptorManager2()
      };
    }
    Axios3.prototype.request = function request(configOrUrl, config8) {
      if (typeof configOrUrl === "string") {
        config8 = config8 || {};
        config8.url = configOrUrl;
      } else {
        config8 = configOrUrl || {};
      }
      config8 = mergeConfig3(this.defaults, config8);
      if (config8.method) {
        config8.method = config8.method.toLowerCase();
      } else if (this.defaults.method) {
        config8.method = this.defaults.method.toLowerCase();
      } else {
        config8.method = "get";
      }
      var transitional2 = config8.transitional;
      if (transitional2 !== void 0) {
        validator.assertOptions(transitional2, {
          silentJSONParsing: validators3.transitional(validators3.boolean),
          forcedJSONParsing: validators3.transitional(validators3.boolean),
          clarifyTimeoutError: validators3.transitional(validators3.boolean)
        }, false);
      }
      var requestInterceptorChain = [];
      var synchronousRequestInterceptors = true;
      this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
        if (typeof interceptor.runWhen === "function" && interceptor.runWhen(config8) === false) {
          return;
        }
        synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;
        requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
      });
      var responseInterceptorChain = [];
      this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
        responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
      });
      var promise;
      if (!synchronousRequestInterceptors) {
        var chain = [dispatchRequest2, void 0];
        Array.prototype.unshift.apply(chain, requestInterceptorChain);
        chain = chain.concat(responseInterceptorChain);
        promise = Promise.resolve(config8);
        while (chain.length) {
          promise = promise.then(chain.shift(), chain.shift());
        }
        return promise;
      }
      var newConfig = config8;
      while (requestInterceptorChain.length) {
        var onFulfilled = requestInterceptorChain.shift();
        var onRejected = requestInterceptorChain.shift();
        try {
          newConfig = onFulfilled(newConfig);
        } catch (error) {
          onRejected(error);
          break;
        }
      }
      try {
        promise = dispatchRequest2(newConfig);
      } catch (error) {
        return Promise.reject(error);
      }
      while (responseInterceptorChain.length) {
        promise = promise.then(responseInterceptorChain.shift(), responseInterceptorChain.shift());
      }
      return promise;
    };
    Axios3.prototype.getUri = function getUri(config8) {
      config8 = mergeConfig3(this.defaults, config8);
      return buildURL2(config8.url, config8.params, config8.paramsSerializer).replace(/^\?/, "");
    };
    utils.forEach(["delete", "get", "head", "options"], function forEachMethodNoData2(method) {
      Axios3.prototype[method] = function(url3, config8) {
        return this.request(mergeConfig3(config8 || {}, {
          method,
          url: url3,
          data: (config8 || {}).data
        }));
      };
    });
    utils.forEach(["post", "put", "patch"], function forEachMethodWithData2(method) {
      Axios3.prototype[method] = function(url3, data, config8) {
        return this.request(mergeConfig3(config8 || {}, {
          method,
          url: url3,
          data
        }));
      };
    });
    module2.exports = Axios3;
  }
});

// node_modules/openai/node_modules/axios/lib/cancel/CancelToken.js
var require_CancelToken = __commonJS({
  "node_modules/openai/node_modules/axios/lib/cancel/CancelToken.js"(exports, module2) {
    "use strict";
    var Cancel2 = require_Cancel();
    function CancelToken3(executor) {
      if (typeof executor !== "function") {
        throw new TypeError("executor must be a function.");
      }
      var resolvePromise;
      this.promise = new Promise(function promiseExecutor(resolve) {
        resolvePromise = resolve;
      });
      var token = this;
      this.promise.then(function(cancel) {
        if (!token._listeners)
          return;
        var i2;
        var l = token._listeners.length;
        for (i2 = 0; i2 < l; i2++) {
          token._listeners[i2](cancel);
        }
        token._listeners = null;
      });
      this.promise.then = function(onfulfilled) {
        var _resolve;
        var promise = new Promise(function(resolve) {
          token.subscribe(resolve);
          _resolve = resolve;
        }).then(onfulfilled);
        promise.cancel = function reject() {
          token.unsubscribe(_resolve);
        };
        return promise;
      };
      executor(function cancel(message) {
        if (token.reason) {
          return;
        }
        token.reason = new Cancel2(message);
        resolvePromise(token.reason);
      });
    }
    CancelToken3.prototype.throwIfRequested = function throwIfRequested() {
      if (this.reason) {
        throw this.reason;
      }
    };
    CancelToken3.prototype.subscribe = function subscribe(listener) {
      if (this.reason) {
        listener(this.reason);
        return;
      }
      if (this._listeners) {
        this._listeners.push(listener);
      } else {
        this._listeners = [listener];
      }
    };
    CancelToken3.prototype.unsubscribe = function unsubscribe(listener) {
      if (!this._listeners) {
        return;
      }
      var index = this._listeners.indexOf(listener);
      if (index !== -1) {
        this._listeners.splice(index, 1);
      }
    };
    CancelToken3.source = function source() {
      var cancel;
      var token = new CancelToken3(function executor(c3) {
        cancel = c3;
      });
      return {
        token,
        cancel
      };
    };
    module2.exports = CancelToken3;
  }
});

// node_modules/openai/node_modules/axios/lib/helpers/spread.js
var require_spread = __commonJS({
  "node_modules/openai/node_modules/axios/lib/helpers/spread.js"(exports, module2) {
    "use strict";
    module2.exports = function spread3(callback) {
      return function wrap(arr) {
        return callback.apply(null, arr);
      };
    };
  }
});

// node_modules/openai/node_modules/axios/lib/helpers/isAxiosError.js
var require_isAxiosError = __commonJS({
  "node_modules/openai/node_modules/axios/lib/helpers/isAxiosError.js"(exports, module2) {
    "use strict";
    var utils = require_utils();
    module2.exports = function isAxiosError3(payload) {
      return utils.isObject(payload) && payload.isAxiosError === true;
    };
  }
});

// node_modules/openai/node_modules/axios/lib/axios.js
var require_axios = __commonJS({
  "node_modules/openai/node_modules/axios/lib/axios.js"(exports, module2) {
    "use strict";
    var utils = require_utils();
    var bind2 = require_bind();
    var Axios3 = require_Axios();
    var mergeConfig3 = require_mergeConfig();
    var defaults2 = require_defaults();
    function createInstance2(defaultConfig) {
      var context = new Axios3(defaultConfig);
      var instance = bind2(Axios3.prototype.request, context);
      utils.extend(instance, Axios3.prototype, context);
      utils.extend(instance, context);
      instance.create = function create(instanceConfig) {
        return createInstance2(mergeConfig3(defaultConfig, instanceConfig));
      };
      return instance;
    }
    var axios2 = createInstance2(defaults2);
    axios2.Axios = Axios3;
    axios2.Cancel = require_Cancel();
    axios2.CancelToken = require_CancelToken();
    axios2.isCancel = require_isCancel();
    axios2.VERSION = require_data().version;
    axios2.all = function all3(promises) {
      return Promise.all(promises);
    };
    axios2.spread = require_spread();
    axios2.isAxiosError = require_isAxiosError();
    module2.exports = axios2;
    module2.exports.default = axios2;
  }
});

// node_modules/openai/node_modules/axios/index.js
var require_axios2 = __commonJS({
  "node_modules/openai/node_modules/axios/index.js"(exports, module2) {
    module2.exports = require_axios();
  }
});

// node_modules/openai/dist/base.js
var require_base = __commonJS({
  "node_modules/openai/dist/base.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RequiredError = exports.BaseAPI = exports.COLLECTION_FORMATS = exports.BASE_PATH = void 0;
    var axios_1 = require_axios2();
    exports.BASE_PATH = "https://api.openai.com/v1".replace(/\/+$/, "");
    exports.COLLECTION_FORMATS = {
      csv: ",",
      ssv: " ",
      tsv: "	",
      pipes: "|"
    };
    var BaseAPI = class {
      constructor(configuration, basePath2 = exports.BASE_PATH, axios2 = axios_1.default) {
        this.basePath = basePath2;
        this.axios = axios2;
        if (configuration) {
          this.configuration = configuration;
          this.basePath = configuration.basePath || this.basePath;
        }
      }
    };
    exports.BaseAPI = BaseAPI;
    var RequiredError = class extends Error {
      constructor(field, msg) {
        super(msg);
        this.field = field;
        this.name = "RequiredError";
      }
    };
    exports.RequiredError = RequiredError;
  }
});

// node_modules/openai/dist/common.js
var require_common2 = __commonJS({
  "node_modules/openai/dist/common.js"(exports) {
    "use strict";
    var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P3, generator) {
      function adopt(value) {
        return value instanceof P3 ? value : new P3(function(resolve) {
          resolve(value);
        });
      }
      return new (P3 || (P3 = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e2) {
            reject(e2);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e2) {
            reject(e2);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createRequestFunction = exports.toPathString = exports.serializeDataIfNeeded = exports.setSearchParams = exports.setOAuthToObject = exports.setBearerAuthToObject = exports.setBasicAuthToObject = exports.setApiKeyToObject = exports.assertParamExists = exports.DUMMY_BASE_URL = void 0;
    var base_1 = require_base();
    exports.DUMMY_BASE_URL = "https://example.com";
    exports.assertParamExists = function(functionName, paramName, paramValue) {
      if (paramValue === null || paramValue === void 0) {
        throw new base_1.RequiredError(paramName, `Required parameter ${paramName} was null or undefined when calling ${functionName}.`);
      }
    };
    exports.setApiKeyToObject = function(object, keyParamName, configuration) {
      return __awaiter(this, void 0, void 0, function* () {
        if (configuration && configuration.apiKey) {
          const localVarApiKeyValue = typeof configuration.apiKey === "function" ? yield configuration.apiKey(keyParamName) : yield configuration.apiKey;
          object[keyParamName] = localVarApiKeyValue;
        }
      });
    };
    exports.setBasicAuthToObject = function(object, configuration) {
      if (configuration && (configuration.username || configuration.password)) {
        object["auth"] = { username: configuration.username, password: configuration.password };
      }
    };
    exports.setBearerAuthToObject = function(object, configuration) {
      return __awaiter(this, void 0, void 0, function* () {
        if (configuration && configuration.accessToken) {
          const accessToken = typeof configuration.accessToken === "function" ? yield configuration.accessToken() : yield configuration.accessToken;
          object["Authorization"] = "Bearer " + accessToken;
        }
      });
    };
    exports.setOAuthToObject = function(object, name, scopes, configuration) {
      return __awaiter(this, void 0, void 0, function* () {
        if (configuration && configuration.accessToken) {
          const localVarAccessTokenValue = typeof configuration.accessToken === "function" ? yield configuration.accessToken(name, scopes) : yield configuration.accessToken;
          object["Authorization"] = "Bearer " + localVarAccessTokenValue;
        }
      });
    };
    function setFlattenedQueryParams(urlSearchParams, parameter, key = "") {
      if (parameter == null)
        return;
      if (typeof parameter === "object") {
        if (Array.isArray(parameter)) {
          parameter.forEach((item) => setFlattenedQueryParams(urlSearchParams, item, key));
        } else {
          Object.keys(parameter).forEach((currentKey) => setFlattenedQueryParams(urlSearchParams, parameter[currentKey], `${key}${key !== "" ? "." : ""}${currentKey}`));
        }
      } else {
        if (urlSearchParams.has(key)) {
          urlSearchParams.append(key, parameter);
        } else {
          urlSearchParams.set(key, parameter);
        }
      }
    }
    exports.setSearchParams = function(url3, ...objects) {
      const searchParams = new URLSearchParams(url3.search);
      setFlattenedQueryParams(searchParams, objects);
      url3.search = searchParams.toString();
    };
    exports.serializeDataIfNeeded = function(value, requestOptions, configuration) {
      const nonString = typeof value !== "string";
      const needsSerialization = nonString && configuration && configuration.isJsonMime ? configuration.isJsonMime(requestOptions.headers["Content-Type"]) : nonString;
      return needsSerialization ? JSON.stringify(value !== void 0 ? value : {}) : value || "";
    };
    exports.toPathString = function(url3) {
      return url3.pathname + url3.search + url3.hash;
    };
    exports.createRequestFunction = function(axiosArgs, globalAxios, BASE_PATH, configuration) {
      return (axios2 = globalAxios, basePath2 = BASE_PATH) => {
        const axiosRequestArgs = Object.assign(Object.assign({}, axiosArgs.options), { url: ((configuration === null || configuration === void 0 ? void 0 : configuration.basePath) || basePath2) + axiosArgs.url });
        return axios2.request(axiosRequestArgs);
      };
    };
  }
});

// node_modules/openai/dist/api.js
var require_api = __commonJS({
  "node_modules/openai/dist/api.js"(exports) {
    "use strict";
    var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P3, generator) {
      function adopt(value) {
        return value instanceof P3 ? value : new P3(function(resolve) {
          resolve(value);
        });
      }
      return new (P3 || (P3 = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e2) {
            reject(e2);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e2) {
            reject(e2);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.OpenAIApi = exports.OpenAIApiFactory = exports.OpenAIApiFp = exports.OpenAIApiAxiosParamCreator = exports.CreateImageRequestResponseFormatEnum = exports.CreateImageRequestSizeEnum = exports.ChatCompletionResponseMessageRoleEnum = exports.ChatCompletionRequestMessageRoleEnum = void 0;
    var axios_1 = require_axios2();
    var common_1 = require_common2();
    var base_1 = require_base();
    exports.ChatCompletionRequestMessageRoleEnum = {
      System: "system",
      User: "user",
      Assistant: "assistant",
      Function: "function"
    };
    exports.ChatCompletionResponseMessageRoleEnum = {
      System: "system",
      User: "user",
      Assistant: "assistant",
      Function: "function"
    };
    exports.CreateImageRequestSizeEnum = {
      _256x256: "256x256",
      _512x512: "512x512",
      _1024x1024: "1024x1024"
    };
    exports.CreateImageRequestResponseFormatEnum = {
      Url: "url",
      B64Json: "b64_json"
    };
    exports.OpenAIApiAxiosParamCreator = function(configuration) {
      return {
        cancelFineTune: (fineTuneId, options = {}) => __awaiter(this, void 0, void 0, function* () {
          common_1.assertParamExists("cancelFineTune", "fineTuneId", fineTuneId);
          const localVarPath = `/fine-tunes/{fine_tune_id}/cancel`.replace(`{${"fine_tune_id"}}`, encodeURIComponent(String(fineTuneId)));
          const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
          let baseOptions;
          if (configuration) {
            baseOptions = configuration.baseOptions;
          }
          const localVarRequestOptions = Object.assign(Object.assign({ method: "POST" }, baseOptions), options);
          const localVarHeaderParameter = {};
          const localVarQueryParameter = {};
          common_1.setSearchParams(localVarUrlObj, localVarQueryParameter);
          let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
          localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
          return {
            url: common_1.toPathString(localVarUrlObj),
            options: localVarRequestOptions
          };
        }),
        createAnswer: (createAnswerRequest, options = {}) => __awaiter(this, void 0, void 0, function* () {
          common_1.assertParamExists("createAnswer", "createAnswerRequest", createAnswerRequest);
          const localVarPath = `/answers`;
          const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
          let baseOptions;
          if (configuration) {
            baseOptions = configuration.baseOptions;
          }
          const localVarRequestOptions = Object.assign(Object.assign({ method: "POST" }, baseOptions), options);
          const localVarHeaderParameter = {};
          const localVarQueryParameter = {};
          localVarHeaderParameter["Content-Type"] = "application/json";
          common_1.setSearchParams(localVarUrlObj, localVarQueryParameter);
          let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
          localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
          localVarRequestOptions.data = common_1.serializeDataIfNeeded(createAnswerRequest, localVarRequestOptions, configuration);
          return {
            url: common_1.toPathString(localVarUrlObj),
            options: localVarRequestOptions
          };
        }),
        createChatCompletion: (createChatCompletionRequest, options = {}) => __awaiter(this, void 0, void 0, function* () {
          common_1.assertParamExists("createChatCompletion", "createChatCompletionRequest", createChatCompletionRequest);
          const localVarPath = `/chat/completions`;
          const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
          let baseOptions;
          if (configuration) {
            baseOptions = configuration.baseOptions;
          }
          const localVarRequestOptions = Object.assign(Object.assign({ method: "POST" }, baseOptions), options);
          const localVarHeaderParameter = {};
          const localVarQueryParameter = {};
          localVarHeaderParameter["Content-Type"] = "application/json";
          common_1.setSearchParams(localVarUrlObj, localVarQueryParameter);
          let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
          localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
          localVarRequestOptions.data = common_1.serializeDataIfNeeded(createChatCompletionRequest, localVarRequestOptions, configuration);
          return {
            url: common_1.toPathString(localVarUrlObj),
            options: localVarRequestOptions
          };
        }),
        createClassification: (createClassificationRequest, options = {}) => __awaiter(this, void 0, void 0, function* () {
          common_1.assertParamExists("createClassification", "createClassificationRequest", createClassificationRequest);
          const localVarPath = `/classifications`;
          const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
          let baseOptions;
          if (configuration) {
            baseOptions = configuration.baseOptions;
          }
          const localVarRequestOptions = Object.assign(Object.assign({ method: "POST" }, baseOptions), options);
          const localVarHeaderParameter = {};
          const localVarQueryParameter = {};
          localVarHeaderParameter["Content-Type"] = "application/json";
          common_1.setSearchParams(localVarUrlObj, localVarQueryParameter);
          let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
          localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
          localVarRequestOptions.data = common_1.serializeDataIfNeeded(createClassificationRequest, localVarRequestOptions, configuration);
          return {
            url: common_1.toPathString(localVarUrlObj),
            options: localVarRequestOptions
          };
        }),
        createCompletion: (createCompletionRequest, options = {}) => __awaiter(this, void 0, void 0, function* () {
          common_1.assertParamExists("createCompletion", "createCompletionRequest", createCompletionRequest);
          const localVarPath = `/completions`;
          const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
          let baseOptions;
          if (configuration) {
            baseOptions = configuration.baseOptions;
          }
          const localVarRequestOptions = Object.assign(Object.assign({ method: "POST" }, baseOptions), options);
          const localVarHeaderParameter = {};
          const localVarQueryParameter = {};
          localVarHeaderParameter["Content-Type"] = "application/json";
          common_1.setSearchParams(localVarUrlObj, localVarQueryParameter);
          let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
          localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
          localVarRequestOptions.data = common_1.serializeDataIfNeeded(createCompletionRequest, localVarRequestOptions, configuration);
          return {
            url: common_1.toPathString(localVarUrlObj),
            options: localVarRequestOptions
          };
        }),
        createEdit: (createEditRequest, options = {}) => __awaiter(this, void 0, void 0, function* () {
          common_1.assertParamExists("createEdit", "createEditRequest", createEditRequest);
          const localVarPath = `/edits`;
          const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
          let baseOptions;
          if (configuration) {
            baseOptions = configuration.baseOptions;
          }
          const localVarRequestOptions = Object.assign(Object.assign({ method: "POST" }, baseOptions), options);
          const localVarHeaderParameter = {};
          const localVarQueryParameter = {};
          localVarHeaderParameter["Content-Type"] = "application/json";
          common_1.setSearchParams(localVarUrlObj, localVarQueryParameter);
          let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
          localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
          localVarRequestOptions.data = common_1.serializeDataIfNeeded(createEditRequest, localVarRequestOptions, configuration);
          return {
            url: common_1.toPathString(localVarUrlObj),
            options: localVarRequestOptions
          };
        }),
        createEmbedding: (createEmbeddingRequest, options = {}) => __awaiter(this, void 0, void 0, function* () {
          common_1.assertParamExists("createEmbedding", "createEmbeddingRequest", createEmbeddingRequest);
          const localVarPath = `/embeddings`;
          const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
          let baseOptions;
          if (configuration) {
            baseOptions = configuration.baseOptions;
          }
          const localVarRequestOptions = Object.assign(Object.assign({ method: "POST" }, baseOptions), options);
          const localVarHeaderParameter = {};
          const localVarQueryParameter = {};
          localVarHeaderParameter["Content-Type"] = "application/json";
          common_1.setSearchParams(localVarUrlObj, localVarQueryParameter);
          let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
          localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
          localVarRequestOptions.data = common_1.serializeDataIfNeeded(createEmbeddingRequest, localVarRequestOptions, configuration);
          return {
            url: common_1.toPathString(localVarUrlObj),
            options: localVarRequestOptions
          };
        }),
        createFile: (file, purpose, options = {}) => __awaiter(this, void 0, void 0, function* () {
          common_1.assertParamExists("createFile", "file", file);
          common_1.assertParamExists("createFile", "purpose", purpose);
          const localVarPath = `/files`;
          const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
          let baseOptions;
          if (configuration) {
            baseOptions = configuration.baseOptions;
          }
          const localVarRequestOptions = Object.assign(Object.assign({ method: "POST" }, baseOptions), options);
          const localVarHeaderParameter = {};
          const localVarQueryParameter = {};
          const localVarFormParams = new (configuration && configuration.formDataCtor || FormData)();
          if (file !== void 0) {
            localVarFormParams.append("file", file);
          }
          if (purpose !== void 0) {
            localVarFormParams.append("purpose", purpose);
          }
          localVarHeaderParameter["Content-Type"] = "multipart/form-data";
          common_1.setSearchParams(localVarUrlObj, localVarQueryParameter);
          let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
          localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), localVarFormParams.getHeaders()), headersFromBaseOptions), options.headers);
          localVarRequestOptions.data = localVarFormParams;
          return {
            url: common_1.toPathString(localVarUrlObj),
            options: localVarRequestOptions
          };
        }),
        createFineTune: (createFineTuneRequest, options = {}) => __awaiter(this, void 0, void 0, function* () {
          common_1.assertParamExists("createFineTune", "createFineTuneRequest", createFineTuneRequest);
          const localVarPath = `/fine-tunes`;
          const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
          let baseOptions;
          if (configuration) {
            baseOptions = configuration.baseOptions;
          }
          const localVarRequestOptions = Object.assign(Object.assign({ method: "POST" }, baseOptions), options);
          const localVarHeaderParameter = {};
          const localVarQueryParameter = {};
          localVarHeaderParameter["Content-Type"] = "application/json";
          common_1.setSearchParams(localVarUrlObj, localVarQueryParameter);
          let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
          localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
          localVarRequestOptions.data = common_1.serializeDataIfNeeded(createFineTuneRequest, localVarRequestOptions, configuration);
          return {
            url: common_1.toPathString(localVarUrlObj),
            options: localVarRequestOptions
          };
        }),
        createImage: (createImageRequest, options = {}) => __awaiter(this, void 0, void 0, function* () {
          common_1.assertParamExists("createImage", "createImageRequest", createImageRequest);
          const localVarPath = `/images/generations`;
          const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
          let baseOptions;
          if (configuration) {
            baseOptions = configuration.baseOptions;
          }
          const localVarRequestOptions = Object.assign(Object.assign({ method: "POST" }, baseOptions), options);
          const localVarHeaderParameter = {};
          const localVarQueryParameter = {};
          localVarHeaderParameter["Content-Type"] = "application/json";
          common_1.setSearchParams(localVarUrlObj, localVarQueryParameter);
          let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
          localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
          localVarRequestOptions.data = common_1.serializeDataIfNeeded(createImageRequest, localVarRequestOptions, configuration);
          return {
            url: common_1.toPathString(localVarUrlObj),
            options: localVarRequestOptions
          };
        }),
        createImageEdit: (image, prompt, mask, n, size, responseFormat, user, options = {}) => __awaiter(this, void 0, void 0, function* () {
          common_1.assertParamExists("createImageEdit", "image", image);
          common_1.assertParamExists("createImageEdit", "prompt", prompt);
          const localVarPath = `/images/edits`;
          const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
          let baseOptions;
          if (configuration) {
            baseOptions = configuration.baseOptions;
          }
          const localVarRequestOptions = Object.assign(Object.assign({ method: "POST" }, baseOptions), options);
          const localVarHeaderParameter = {};
          const localVarQueryParameter = {};
          const localVarFormParams = new (configuration && configuration.formDataCtor || FormData)();
          if (image !== void 0) {
            localVarFormParams.append("image", image);
          }
          if (mask !== void 0) {
            localVarFormParams.append("mask", mask);
          }
          if (prompt !== void 0) {
            localVarFormParams.append("prompt", prompt);
          }
          if (n !== void 0) {
            localVarFormParams.append("n", n);
          }
          if (size !== void 0) {
            localVarFormParams.append("size", size);
          }
          if (responseFormat !== void 0) {
            localVarFormParams.append("response_format", responseFormat);
          }
          if (user !== void 0) {
            localVarFormParams.append("user", user);
          }
          localVarHeaderParameter["Content-Type"] = "multipart/form-data";
          common_1.setSearchParams(localVarUrlObj, localVarQueryParameter);
          let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
          localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), localVarFormParams.getHeaders()), headersFromBaseOptions), options.headers);
          localVarRequestOptions.data = localVarFormParams;
          return {
            url: common_1.toPathString(localVarUrlObj),
            options: localVarRequestOptions
          };
        }),
        createImageVariation: (image, n, size, responseFormat, user, options = {}) => __awaiter(this, void 0, void 0, function* () {
          common_1.assertParamExists("createImageVariation", "image", image);
          const localVarPath = `/images/variations`;
          const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
          let baseOptions;
          if (configuration) {
            baseOptions = configuration.baseOptions;
          }
          const localVarRequestOptions = Object.assign(Object.assign({ method: "POST" }, baseOptions), options);
          const localVarHeaderParameter = {};
          const localVarQueryParameter = {};
          const localVarFormParams = new (configuration && configuration.formDataCtor || FormData)();
          if (image !== void 0) {
            localVarFormParams.append("image", image);
          }
          if (n !== void 0) {
            localVarFormParams.append("n", n);
          }
          if (size !== void 0) {
            localVarFormParams.append("size", size);
          }
          if (responseFormat !== void 0) {
            localVarFormParams.append("response_format", responseFormat);
          }
          if (user !== void 0) {
            localVarFormParams.append("user", user);
          }
          localVarHeaderParameter["Content-Type"] = "multipart/form-data";
          common_1.setSearchParams(localVarUrlObj, localVarQueryParameter);
          let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
          localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), localVarFormParams.getHeaders()), headersFromBaseOptions), options.headers);
          localVarRequestOptions.data = localVarFormParams;
          return {
            url: common_1.toPathString(localVarUrlObj),
            options: localVarRequestOptions
          };
        }),
        createModeration: (createModerationRequest, options = {}) => __awaiter(this, void 0, void 0, function* () {
          common_1.assertParamExists("createModeration", "createModerationRequest", createModerationRequest);
          const localVarPath = `/moderations`;
          const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
          let baseOptions;
          if (configuration) {
            baseOptions = configuration.baseOptions;
          }
          const localVarRequestOptions = Object.assign(Object.assign({ method: "POST" }, baseOptions), options);
          const localVarHeaderParameter = {};
          const localVarQueryParameter = {};
          localVarHeaderParameter["Content-Type"] = "application/json";
          common_1.setSearchParams(localVarUrlObj, localVarQueryParameter);
          let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
          localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
          localVarRequestOptions.data = common_1.serializeDataIfNeeded(createModerationRequest, localVarRequestOptions, configuration);
          return {
            url: common_1.toPathString(localVarUrlObj),
            options: localVarRequestOptions
          };
        }),
        createSearch: (engineId, createSearchRequest, options = {}) => __awaiter(this, void 0, void 0, function* () {
          common_1.assertParamExists("createSearch", "engineId", engineId);
          common_1.assertParamExists("createSearch", "createSearchRequest", createSearchRequest);
          const localVarPath = `/engines/{engine_id}/search`.replace(`{${"engine_id"}}`, encodeURIComponent(String(engineId)));
          const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
          let baseOptions;
          if (configuration) {
            baseOptions = configuration.baseOptions;
          }
          const localVarRequestOptions = Object.assign(Object.assign({ method: "POST" }, baseOptions), options);
          const localVarHeaderParameter = {};
          const localVarQueryParameter = {};
          localVarHeaderParameter["Content-Type"] = "application/json";
          common_1.setSearchParams(localVarUrlObj, localVarQueryParameter);
          let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
          localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
          localVarRequestOptions.data = common_1.serializeDataIfNeeded(createSearchRequest, localVarRequestOptions, configuration);
          return {
            url: common_1.toPathString(localVarUrlObj),
            options: localVarRequestOptions
          };
        }),
        createTranscription: (file, model, prompt, responseFormat, temperature, language, options = {}) => __awaiter(this, void 0, void 0, function* () {
          common_1.assertParamExists("createTranscription", "file", file);
          common_1.assertParamExists("createTranscription", "model", model);
          const localVarPath = `/audio/transcriptions`;
          const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
          let baseOptions;
          if (configuration) {
            baseOptions = configuration.baseOptions;
          }
          const localVarRequestOptions = Object.assign(Object.assign({ method: "POST" }, baseOptions), options);
          const localVarHeaderParameter = {};
          const localVarQueryParameter = {};
          const localVarFormParams = new (configuration && configuration.formDataCtor || FormData)();
          if (file !== void 0) {
            localVarFormParams.append("file", file);
          }
          if (model !== void 0) {
            localVarFormParams.append("model", model);
          }
          if (prompt !== void 0) {
            localVarFormParams.append("prompt", prompt);
          }
          if (responseFormat !== void 0) {
            localVarFormParams.append("response_format", responseFormat);
          }
          if (temperature !== void 0) {
            localVarFormParams.append("temperature", temperature);
          }
          if (language !== void 0) {
            localVarFormParams.append("language", language);
          }
          localVarHeaderParameter["Content-Type"] = "multipart/form-data";
          common_1.setSearchParams(localVarUrlObj, localVarQueryParameter);
          let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
          localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), localVarFormParams.getHeaders()), headersFromBaseOptions), options.headers);
          localVarRequestOptions.data = localVarFormParams;
          return {
            url: common_1.toPathString(localVarUrlObj),
            options: localVarRequestOptions
          };
        }),
        createTranslation: (file, model, prompt, responseFormat, temperature, options = {}) => __awaiter(this, void 0, void 0, function* () {
          common_1.assertParamExists("createTranslation", "file", file);
          common_1.assertParamExists("createTranslation", "model", model);
          const localVarPath = `/audio/translations`;
          const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
          let baseOptions;
          if (configuration) {
            baseOptions = configuration.baseOptions;
          }
          const localVarRequestOptions = Object.assign(Object.assign({ method: "POST" }, baseOptions), options);
          const localVarHeaderParameter = {};
          const localVarQueryParameter = {};
          const localVarFormParams = new (configuration && configuration.formDataCtor || FormData)();
          if (file !== void 0) {
            localVarFormParams.append("file", file);
          }
          if (model !== void 0) {
            localVarFormParams.append("model", model);
          }
          if (prompt !== void 0) {
            localVarFormParams.append("prompt", prompt);
          }
          if (responseFormat !== void 0) {
            localVarFormParams.append("response_format", responseFormat);
          }
          if (temperature !== void 0) {
            localVarFormParams.append("temperature", temperature);
          }
          localVarHeaderParameter["Content-Type"] = "multipart/form-data";
          common_1.setSearchParams(localVarUrlObj, localVarQueryParameter);
          let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
          localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), localVarFormParams.getHeaders()), headersFromBaseOptions), options.headers);
          localVarRequestOptions.data = localVarFormParams;
          return {
            url: common_1.toPathString(localVarUrlObj),
            options: localVarRequestOptions
          };
        }),
        deleteFile: (fileId, options = {}) => __awaiter(this, void 0, void 0, function* () {
          common_1.assertParamExists("deleteFile", "fileId", fileId);
          const localVarPath = `/files/{file_id}`.replace(`{${"file_id"}}`, encodeURIComponent(String(fileId)));
          const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
          let baseOptions;
          if (configuration) {
            baseOptions = configuration.baseOptions;
          }
          const localVarRequestOptions = Object.assign(Object.assign({ method: "DELETE" }, baseOptions), options);
          const localVarHeaderParameter = {};
          const localVarQueryParameter = {};
          common_1.setSearchParams(localVarUrlObj, localVarQueryParameter);
          let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
          localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
          return {
            url: common_1.toPathString(localVarUrlObj),
            options: localVarRequestOptions
          };
        }),
        deleteModel: (model, options = {}) => __awaiter(this, void 0, void 0, function* () {
          common_1.assertParamExists("deleteModel", "model", model);
          const localVarPath = `/models/{model}`.replace(`{${"model"}}`, encodeURIComponent(String(model)));
          const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
          let baseOptions;
          if (configuration) {
            baseOptions = configuration.baseOptions;
          }
          const localVarRequestOptions = Object.assign(Object.assign({ method: "DELETE" }, baseOptions), options);
          const localVarHeaderParameter = {};
          const localVarQueryParameter = {};
          common_1.setSearchParams(localVarUrlObj, localVarQueryParameter);
          let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
          localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
          return {
            url: common_1.toPathString(localVarUrlObj),
            options: localVarRequestOptions
          };
        }),
        downloadFile: (fileId, options = {}) => __awaiter(this, void 0, void 0, function* () {
          common_1.assertParamExists("downloadFile", "fileId", fileId);
          const localVarPath = `/files/{file_id}/content`.replace(`{${"file_id"}}`, encodeURIComponent(String(fileId)));
          const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
          let baseOptions;
          if (configuration) {
            baseOptions = configuration.baseOptions;
          }
          const localVarRequestOptions = Object.assign(Object.assign({ method: "GET" }, baseOptions), options);
          const localVarHeaderParameter = {};
          const localVarQueryParameter = {};
          common_1.setSearchParams(localVarUrlObj, localVarQueryParameter);
          let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
          localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
          return {
            url: common_1.toPathString(localVarUrlObj),
            options: localVarRequestOptions
          };
        }),
        listEngines: (options = {}) => __awaiter(this, void 0, void 0, function* () {
          const localVarPath = `/engines`;
          const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
          let baseOptions;
          if (configuration) {
            baseOptions = configuration.baseOptions;
          }
          const localVarRequestOptions = Object.assign(Object.assign({ method: "GET" }, baseOptions), options);
          const localVarHeaderParameter = {};
          const localVarQueryParameter = {};
          common_1.setSearchParams(localVarUrlObj, localVarQueryParameter);
          let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
          localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
          return {
            url: common_1.toPathString(localVarUrlObj),
            options: localVarRequestOptions
          };
        }),
        listFiles: (options = {}) => __awaiter(this, void 0, void 0, function* () {
          const localVarPath = `/files`;
          const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
          let baseOptions;
          if (configuration) {
            baseOptions = configuration.baseOptions;
          }
          const localVarRequestOptions = Object.assign(Object.assign({ method: "GET" }, baseOptions), options);
          const localVarHeaderParameter = {};
          const localVarQueryParameter = {};
          common_1.setSearchParams(localVarUrlObj, localVarQueryParameter);
          let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
          localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
          return {
            url: common_1.toPathString(localVarUrlObj),
            options: localVarRequestOptions
          };
        }),
        listFineTuneEvents: (fineTuneId, stream4, options = {}) => __awaiter(this, void 0, void 0, function* () {
          common_1.assertParamExists("listFineTuneEvents", "fineTuneId", fineTuneId);
          const localVarPath = `/fine-tunes/{fine_tune_id}/events`.replace(`{${"fine_tune_id"}}`, encodeURIComponent(String(fineTuneId)));
          const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
          let baseOptions;
          if (configuration) {
            baseOptions = configuration.baseOptions;
          }
          const localVarRequestOptions = Object.assign(Object.assign({ method: "GET" }, baseOptions), options);
          const localVarHeaderParameter = {};
          const localVarQueryParameter = {};
          if (stream4 !== void 0) {
            localVarQueryParameter["stream"] = stream4;
          }
          common_1.setSearchParams(localVarUrlObj, localVarQueryParameter);
          let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
          localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
          return {
            url: common_1.toPathString(localVarUrlObj),
            options: localVarRequestOptions
          };
        }),
        listFineTunes: (options = {}) => __awaiter(this, void 0, void 0, function* () {
          const localVarPath = `/fine-tunes`;
          const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
          let baseOptions;
          if (configuration) {
            baseOptions = configuration.baseOptions;
          }
          const localVarRequestOptions = Object.assign(Object.assign({ method: "GET" }, baseOptions), options);
          const localVarHeaderParameter = {};
          const localVarQueryParameter = {};
          common_1.setSearchParams(localVarUrlObj, localVarQueryParameter);
          let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
          localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
          return {
            url: common_1.toPathString(localVarUrlObj),
            options: localVarRequestOptions
          };
        }),
        listModels: (options = {}) => __awaiter(this, void 0, void 0, function* () {
          const localVarPath = `/models`;
          const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
          let baseOptions;
          if (configuration) {
            baseOptions = configuration.baseOptions;
          }
          const localVarRequestOptions = Object.assign(Object.assign({ method: "GET" }, baseOptions), options);
          const localVarHeaderParameter = {};
          const localVarQueryParameter = {};
          common_1.setSearchParams(localVarUrlObj, localVarQueryParameter);
          let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
          localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
          return {
            url: common_1.toPathString(localVarUrlObj),
            options: localVarRequestOptions
          };
        }),
        retrieveEngine: (engineId, options = {}) => __awaiter(this, void 0, void 0, function* () {
          common_1.assertParamExists("retrieveEngine", "engineId", engineId);
          const localVarPath = `/engines/{engine_id}`.replace(`{${"engine_id"}}`, encodeURIComponent(String(engineId)));
          const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
          let baseOptions;
          if (configuration) {
            baseOptions = configuration.baseOptions;
          }
          const localVarRequestOptions = Object.assign(Object.assign({ method: "GET" }, baseOptions), options);
          const localVarHeaderParameter = {};
          const localVarQueryParameter = {};
          common_1.setSearchParams(localVarUrlObj, localVarQueryParameter);
          let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
          localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
          return {
            url: common_1.toPathString(localVarUrlObj),
            options: localVarRequestOptions
          };
        }),
        retrieveFile: (fileId, options = {}) => __awaiter(this, void 0, void 0, function* () {
          common_1.assertParamExists("retrieveFile", "fileId", fileId);
          const localVarPath = `/files/{file_id}`.replace(`{${"file_id"}}`, encodeURIComponent(String(fileId)));
          const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
          let baseOptions;
          if (configuration) {
            baseOptions = configuration.baseOptions;
          }
          const localVarRequestOptions = Object.assign(Object.assign({ method: "GET" }, baseOptions), options);
          const localVarHeaderParameter = {};
          const localVarQueryParameter = {};
          common_1.setSearchParams(localVarUrlObj, localVarQueryParameter);
          let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
          localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
          return {
            url: common_1.toPathString(localVarUrlObj),
            options: localVarRequestOptions
          };
        }),
        retrieveFineTune: (fineTuneId, options = {}) => __awaiter(this, void 0, void 0, function* () {
          common_1.assertParamExists("retrieveFineTune", "fineTuneId", fineTuneId);
          const localVarPath = `/fine-tunes/{fine_tune_id}`.replace(`{${"fine_tune_id"}}`, encodeURIComponent(String(fineTuneId)));
          const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
          let baseOptions;
          if (configuration) {
            baseOptions = configuration.baseOptions;
          }
          const localVarRequestOptions = Object.assign(Object.assign({ method: "GET" }, baseOptions), options);
          const localVarHeaderParameter = {};
          const localVarQueryParameter = {};
          common_1.setSearchParams(localVarUrlObj, localVarQueryParameter);
          let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
          localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
          return {
            url: common_1.toPathString(localVarUrlObj),
            options: localVarRequestOptions
          };
        }),
        retrieveModel: (model, options = {}) => __awaiter(this, void 0, void 0, function* () {
          common_1.assertParamExists("retrieveModel", "model", model);
          const localVarPath = `/models/{model}`.replace(`{${"model"}}`, encodeURIComponent(String(model)));
          const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
          let baseOptions;
          if (configuration) {
            baseOptions = configuration.baseOptions;
          }
          const localVarRequestOptions = Object.assign(Object.assign({ method: "GET" }, baseOptions), options);
          const localVarHeaderParameter = {};
          const localVarQueryParameter = {};
          common_1.setSearchParams(localVarUrlObj, localVarQueryParameter);
          let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
          localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
          return {
            url: common_1.toPathString(localVarUrlObj),
            options: localVarRequestOptions
          };
        })
      };
    };
    exports.OpenAIApiFp = function(configuration) {
      const localVarAxiosParamCreator = exports.OpenAIApiAxiosParamCreator(configuration);
      return {
        cancelFineTune(fineTuneId, options) {
          return __awaiter(this, void 0, void 0, function* () {
            const localVarAxiosArgs = yield localVarAxiosParamCreator.cancelFineTune(fineTuneId, options);
            return common_1.createRequestFunction(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
          });
        },
        createAnswer(createAnswerRequest, options) {
          return __awaiter(this, void 0, void 0, function* () {
            const localVarAxiosArgs = yield localVarAxiosParamCreator.createAnswer(createAnswerRequest, options);
            return common_1.createRequestFunction(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
          });
        },
        createChatCompletion(createChatCompletionRequest, options) {
          return __awaiter(this, void 0, void 0, function* () {
            const localVarAxiosArgs = yield localVarAxiosParamCreator.createChatCompletion(createChatCompletionRequest, options);
            return common_1.createRequestFunction(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
          });
        },
        createClassification(createClassificationRequest, options) {
          return __awaiter(this, void 0, void 0, function* () {
            const localVarAxiosArgs = yield localVarAxiosParamCreator.createClassification(createClassificationRequest, options);
            return common_1.createRequestFunction(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
          });
        },
        createCompletion(createCompletionRequest, options) {
          return __awaiter(this, void 0, void 0, function* () {
            const localVarAxiosArgs = yield localVarAxiosParamCreator.createCompletion(createCompletionRequest, options);
            return common_1.createRequestFunction(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
          });
        },
        createEdit(createEditRequest, options) {
          return __awaiter(this, void 0, void 0, function* () {
            const localVarAxiosArgs = yield localVarAxiosParamCreator.createEdit(createEditRequest, options);
            return common_1.createRequestFunction(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
          });
        },
        createEmbedding(createEmbeddingRequest, options) {
          return __awaiter(this, void 0, void 0, function* () {
            const localVarAxiosArgs = yield localVarAxiosParamCreator.createEmbedding(createEmbeddingRequest, options);
            return common_1.createRequestFunction(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
          });
        },
        createFile(file, purpose, options) {
          return __awaiter(this, void 0, void 0, function* () {
            const localVarAxiosArgs = yield localVarAxiosParamCreator.createFile(file, purpose, options);
            return common_1.createRequestFunction(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
          });
        },
        createFineTune(createFineTuneRequest, options) {
          return __awaiter(this, void 0, void 0, function* () {
            const localVarAxiosArgs = yield localVarAxiosParamCreator.createFineTune(createFineTuneRequest, options);
            return common_1.createRequestFunction(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
          });
        },
        createImage(createImageRequest, options) {
          return __awaiter(this, void 0, void 0, function* () {
            const localVarAxiosArgs = yield localVarAxiosParamCreator.createImage(createImageRequest, options);
            return common_1.createRequestFunction(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
          });
        },
        createImageEdit(image, prompt, mask, n, size, responseFormat, user, options) {
          return __awaiter(this, void 0, void 0, function* () {
            const localVarAxiosArgs = yield localVarAxiosParamCreator.createImageEdit(image, prompt, mask, n, size, responseFormat, user, options);
            return common_1.createRequestFunction(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
          });
        },
        createImageVariation(image, n, size, responseFormat, user, options) {
          return __awaiter(this, void 0, void 0, function* () {
            const localVarAxiosArgs = yield localVarAxiosParamCreator.createImageVariation(image, n, size, responseFormat, user, options);
            return common_1.createRequestFunction(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
          });
        },
        createModeration(createModerationRequest, options) {
          return __awaiter(this, void 0, void 0, function* () {
            const localVarAxiosArgs = yield localVarAxiosParamCreator.createModeration(createModerationRequest, options);
            return common_1.createRequestFunction(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
          });
        },
        createSearch(engineId, createSearchRequest, options) {
          return __awaiter(this, void 0, void 0, function* () {
            const localVarAxiosArgs = yield localVarAxiosParamCreator.createSearch(engineId, createSearchRequest, options);
            return common_1.createRequestFunction(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
          });
        },
        createTranscription(file, model, prompt, responseFormat, temperature, language, options) {
          return __awaiter(this, void 0, void 0, function* () {
            const localVarAxiosArgs = yield localVarAxiosParamCreator.createTranscription(file, model, prompt, responseFormat, temperature, language, options);
            return common_1.createRequestFunction(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
          });
        },
        createTranslation(file, model, prompt, responseFormat, temperature, options) {
          return __awaiter(this, void 0, void 0, function* () {
            const localVarAxiosArgs = yield localVarAxiosParamCreator.createTranslation(file, model, prompt, responseFormat, temperature, options);
            return common_1.createRequestFunction(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
          });
        },
        deleteFile(fileId, options) {
          return __awaiter(this, void 0, void 0, function* () {
            const localVarAxiosArgs = yield localVarAxiosParamCreator.deleteFile(fileId, options);
            return common_1.createRequestFunction(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
          });
        },
        deleteModel(model, options) {
          return __awaiter(this, void 0, void 0, function* () {
            const localVarAxiosArgs = yield localVarAxiosParamCreator.deleteModel(model, options);
            return common_1.createRequestFunction(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
          });
        },
        downloadFile(fileId, options) {
          return __awaiter(this, void 0, void 0, function* () {
            const localVarAxiosArgs = yield localVarAxiosParamCreator.downloadFile(fileId, options);
            return common_1.createRequestFunction(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
          });
        },
        listEngines(options) {
          return __awaiter(this, void 0, void 0, function* () {
            const localVarAxiosArgs = yield localVarAxiosParamCreator.listEngines(options);
            return common_1.createRequestFunction(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
          });
        },
        listFiles(options) {
          return __awaiter(this, void 0, void 0, function* () {
            const localVarAxiosArgs = yield localVarAxiosParamCreator.listFiles(options);
            return common_1.createRequestFunction(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
          });
        },
        listFineTuneEvents(fineTuneId, stream4, options) {
          return __awaiter(this, void 0, void 0, function* () {
            const localVarAxiosArgs = yield localVarAxiosParamCreator.listFineTuneEvents(fineTuneId, stream4, options);
            return common_1.createRequestFunction(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
          });
        },
        listFineTunes(options) {
          return __awaiter(this, void 0, void 0, function* () {
            const localVarAxiosArgs = yield localVarAxiosParamCreator.listFineTunes(options);
            return common_1.createRequestFunction(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
          });
        },
        listModels(options) {
          return __awaiter(this, void 0, void 0, function* () {
            const localVarAxiosArgs = yield localVarAxiosParamCreator.listModels(options);
            return common_1.createRequestFunction(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
          });
        },
        retrieveEngine(engineId, options) {
          return __awaiter(this, void 0, void 0, function* () {
            const localVarAxiosArgs = yield localVarAxiosParamCreator.retrieveEngine(engineId, options);
            return common_1.createRequestFunction(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
          });
        },
        retrieveFile(fileId, options) {
          return __awaiter(this, void 0, void 0, function* () {
            const localVarAxiosArgs = yield localVarAxiosParamCreator.retrieveFile(fileId, options);
            return common_1.createRequestFunction(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
          });
        },
        retrieveFineTune(fineTuneId, options) {
          return __awaiter(this, void 0, void 0, function* () {
            const localVarAxiosArgs = yield localVarAxiosParamCreator.retrieveFineTune(fineTuneId, options);
            return common_1.createRequestFunction(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
          });
        },
        retrieveModel(model, options) {
          return __awaiter(this, void 0, void 0, function* () {
            const localVarAxiosArgs = yield localVarAxiosParamCreator.retrieveModel(model, options);
            return common_1.createRequestFunction(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
          });
        }
      };
    };
    exports.OpenAIApiFactory = function(configuration, basePath2, axios2) {
      const localVarFp = exports.OpenAIApiFp(configuration);
      return {
        cancelFineTune(fineTuneId, options) {
          return localVarFp.cancelFineTune(fineTuneId, options).then((request) => request(axios2, basePath2));
        },
        createAnswer(createAnswerRequest, options) {
          return localVarFp.createAnswer(createAnswerRequest, options).then((request) => request(axios2, basePath2));
        },
        createChatCompletion(createChatCompletionRequest, options) {
          return localVarFp.createChatCompletion(createChatCompletionRequest, options).then((request) => request(axios2, basePath2));
        },
        createClassification(createClassificationRequest, options) {
          return localVarFp.createClassification(createClassificationRequest, options).then((request) => request(axios2, basePath2));
        },
        createCompletion(createCompletionRequest, options) {
          return localVarFp.createCompletion(createCompletionRequest, options).then((request) => request(axios2, basePath2));
        },
        createEdit(createEditRequest, options) {
          return localVarFp.createEdit(createEditRequest, options).then((request) => request(axios2, basePath2));
        },
        createEmbedding(createEmbeddingRequest, options) {
          return localVarFp.createEmbedding(createEmbeddingRequest, options).then((request) => request(axios2, basePath2));
        },
        createFile(file, purpose, options) {
          return localVarFp.createFile(file, purpose, options).then((request) => request(axios2, basePath2));
        },
        createFineTune(createFineTuneRequest, options) {
          return localVarFp.createFineTune(createFineTuneRequest, options).then((request) => request(axios2, basePath2));
        },
        createImage(createImageRequest, options) {
          return localVarFp.createImage(createImageRequest, options).then((request) => request(axios2, basePath2));
        },
        createImageEdit(image, prompt, mask, n, size, responseFormat, user, options) {
          return localVarFp.createImageEdit(image, prompt, mask, n, size, responseFormat, user, options).then((request) => request(axios2, basePath2));
        },
        createImageVariation(image, n, size, responseFormat, user, options) {
          return localVarFp.createImageVariation(image, n, size, responseFormat, user, options).then((request) => request(axios2, basePath2));
        },
        createModeration(createModerationRequest, options) {
          return localVarFp.createModeration(createModerationRequest, options).then((request) => request(axios2, basePath2));
        },
        createSearch(engineId, createSearchRequest, options) {
          return localVarFp.createSearch(engineId, createSearchRequest, options).then((request) => request(axios2, basePath2));
        },
        createTranscription(file, model, prompt, responseFormat, temperature, language, options) {
          return localVarFp.createTranscription(file, model, prompt, responseFormat, temperature, language, options).then((request) => request(axios2, basePath2));
        },
        createTranslation(file, model, prompt, responseFormat, temperature, options) {
          return localVarFp.createTranslation(file, model, prompt, responseFormat, temperature, options).then((request) => request(axios2, basePath2));
        },
        deleteFile(fileId, options) {
          return localVarFp.deleteFile(fileId, options).then((request) => request(axios2, basePath2));
        },
        deleteModel(model, options) {
          return localVarFp.deleteModel(model, options).then((request) => request(axios2, basePath2));
        },
        downloadFile(fileId, options) {
          return localVarFp.downloadFile(fileId, options).then((request) => request(axios2, basePath2));
        },
        listEngines(options) {
          return localVarFp.listEngines(options).then((request) => request(axios2, basePath2));
        },
        listFiles(options) {
          return localVarFp.listFiles(options).then((request) => request(axios2, basePath2));
        },
        listFineTuneEvents(fineTuneId, stream4, options) {
          return localVarFp.listFineTuneEvents(fineTuneId, stream4, options).then((request) => request(axios2, basePath2));
        },
        listFineTunes(options) {
          return localVarFp.listFineTunes(options).then((request) => request(axios2, basePath2));
        },
        listModels(options) {
          return localVarFp.listModels(options).then((request) => request(axios2, basePath2));
        },
        retrieveEngine(engineId, options) {
          return localVarFp.retrieveEngine(engineId, options).then((request) => request(axios2, basePath2));
        },
        retrieveFile(fileId, options) {
          return localVarFp.retrieveFile(fileId, options).then((request) => request(axios2, basePath2));
        },
        retrieveFineTune(fineTuneId, options) {
          return localVarFp.retrieveFineTune(fineTuneId, options).then((request) => request(axios2, basePath2));
        },
        retrieveModel(model, options) {
          return localVarFp.retrieveModel(model, options).then((request) => request(axios2, basePath2));
        }
      };
    };
    var OpenAIApi2 = class extends base_1.BaseAPI {
      cancelFineTune(fineTuneId, options) {
        return exports.OpenAIApiFp(this.configuration).cancelFineTune(fineTuneId, options).then((request) => request(this.axios, this.basePath));
      }
      createAnswer(createAnswerRequest, options) {
        return exports.OpenAIApiFp(this.configuration).createAnswer(createAnswerRequest, options).then((request) => request(this.axios, this.basePath));
      }
      createChatCompletion(createChatCompletionRequest, options) {
        return exports.OpenAIApiFp(this.configuration).createChatCompletion(createChatCompletionRequest, options).then((request) => request(this.axios, this.basePath));
      }
      createClassification(createClassificationRequest, options) {
        return exports.OpenAIApiFp(this.configuration).createClassification(createClassificationRequest, options).then((request) => request(this.axios, this.basePath));
      }
      createCompletion(createCompletionRequest, options) {
        return exports.OpenAIApiFp(this.configuration).createCompletion(createCompletionRequest, options).then((request) => request(this.axios, this.basePath));
      }
      createEdit(createEditRequest, options) {
        return exports.OpenAIApiFp(this.configuration).createEdit(createEditRequest, options).then((request) => request(this.axios, this.basePath));
      }
      createEmbedding(createEmbeddingRequest, options) {
        return exports.OpenAIApiFp(this.configuration).createEmbedding(createEmbeddingRequest, options).then((request) => request(this.axios, this.basePath));
      }
      createFile(file, purpose, options) {
        return exports.OpenAIApiFp(this.configuration).createFile(file, purpose, options).then((request) => request(this.axios, this.basePath));
      }
      createFineTune(createFineTuneRequest, options) {
        return exports.OpenAIApiFp(this.configuration).createFineTune(createFineTuneRequest, options).then((request) => request(this.axios, this.basePath));
      }
      createImage(createImageRequest, options) {
        return exports.OpenAIApiFp(this.configuration).createImage(createImageRequest, options).then((request) => request(this.axios, this.basePath));
      }
      createImageEdit(image, prompt, mask, n, size, responseFormat, user, options) {
        return exports.OpenAIApiFp(this.configuration).createImageEdit(image, prompt, mask, n, size, responseFormat, user, options).then((request) => request(this.axios, this.basePath));
      }
      createImageVariation(image, n, size, responseFormat, user, options) {
        return exports.OpenAIApiFp(this.configuration).createImageVariation(image, n, size, responseFormat, user, options).then((request) => request(this.axios, this.basePath));
      }
      createModeration(createModerationRequest, options) {
        return exports.OpenAIApiFp(this.configuration).createModeration(createModerationRequest, options).then((request) => request(this.axios, this.basePath));
      }
      createSearch(engineId, createSearchRequest, options) {
        return exports.OpenAIApiFp(this.configuration).createSearch(engineId, createSearchRequest, options).then((request) => request(this.axios, this.basePath));
      }
      createTranscription(file, model, prompt, responseFormat, temperature, language, options) {
        return exports.OpenAIApiFp(this.configuration).createTranscription(file, model, prompt, responseFormat, temperature, language, options).then((request) => request(this.axios, this.basePath));
      }
      createTranslation(file, model, prompt, responseFormat, temperature, options) {
        return exports.OpenAIApiFp(this.configuration).createTranslation(file, model, prompt, responseFormat, temperature, options).then((request) => request(this.axios, this.basePath));
      }
      deleteFile(fileId, options) {
        return exports.OpenAIApiFp(this.configuration).deleteFile(fileId, options).then((request) => request(this.axios, this.basePath));
      }
      deleteModel(model, options) {
        return exports.OpenAIApiFp(this.configuration).deleteModel(model, options).then((request) => request(this.axios, this.basePath));
      }
      downloadFile(fileId, options) {
        return exports.OpenAIApiFp(this.configuration).downloadFile(fileId, options).then((request) => request(this.axios, this.basePath));
      }
      listEngines(options) {
        return exports.OpenAIApiFp(this.configuration).listEngines(options).then((request) => request(this.axios, this.basePath));
      }
      listFiles(options) {
        return exports.OpenAIApiFp(this.configuration).listFiles(options).then((request) => request(this.axios, this.basePath));
      }
      listFineTuneEvents(fineTuneId, stream4, options) {
        return exports.OpenAIApiFp(this.configuration).listFineTuneEvents(fineTuneId, stream4, options).then((request) => request(this.axios, this.basePath));
      }
      listFineTunes(options) {
        return exports.OpenAIApiFp(this.configuration).listFineTunes(options).then((request) => request(this.axios, this.basePath));
      }
      listModels(options) {
        return exports.OpenAIApiFp(this.configuration).listModels(options).then((request) => request(this.axios, this.basePath));
      }
      retrieveEngine(engineId, options) {
        return exports.OpenAIApiFp(this.configuration).retrieveEngine(engineId, options).then((request) => request(this.axios, this.basePath));
      }
      retrieveFile(fileId, options) {
        return exports.OpenAIApiFp(this.configuration).retrieveFile(fileId, options).then((request) => request(this.axios, this.basePath));
      }
      retrieveFineTune(fineTuneId, options) {
        return exports.OpenAIApiFp(this.configuration).retrieveFineTune(fineTuneId, options).then((request) => request(this.axios, this.basePath));
      }
      retrieveModel(model, options) {
        return exports.OpenAIApiFp(this.configuration).retrieveModel(model, options).then((request) => request(this.axios, this.basePath));
      }
    };
    exports.OpenAIApi = OpenAIApi2;
  }
});

// node_modules/openai/package.json
var require_package = __commonJS({
  "node_modules/openai/package.json"(exports, module2) {
    module2.exports = {
      name: "openai",
      version: "3.3.0",
      description: "Node.js library for the OpenAI API",
      repository: {
        type: "git",
        url: "git@github.com:openai/openai-node.git"
      },
      keywords: [
        "openai",
        "open",
        "ai",
        "gpt-3",
        "gpt3"
      ],
      author: "OpenAI",
      license: "MIT",
      main: "./dist/index.js",
      types: "./dist/index.d.ts",
      scripts: {
        build: "tsc --outDir dist/"
      },
      dependencies: {
        axios: "^0.26.0",
        "form-data": "^4.0.0"
      },
      devDependencies: {
        "@types/node": "^12.11.5",
        typescript: "^3.6.4"
      }
    };
  }
});

// node_modules/delayed-stream/lib/delayed_stream.js
var require_delayed_stream = __commonJS({
  "node_modules/delayed-stream/lib/delayed_stream.js"(exports, module2) {
    var Stream = require("stream").Stream;
    var util2 = require("util");
    module2.exports = DelayedStream;
    function DelayedStream() {
      this.source = null;
      this.dataSize = 0;
      this.maxDataSize = 1024 * 1024;
      this.pauseStream = true;
      this._maxDataSizeExceeded = false;
      this._released = false;
      this._bufferedEvents = [];
    }
    util2.inherits(DelayedStream, Stream);
    DelayedStream.create = function(source, options) {
      var delayedStream = new this();
      options = options || {};
      for (var option in options) {
        delayedStream[option] = options[option];
      }
      delayedStream.source = source;
      var realEmit = source.emit;
      source.emit = function() {
        delayedStream._handleEmit(arguments);
        return realEmit.apply(source, arguments);
      };
      source.on("error", function() {
      });
      if (delayedStream.pauseStream) {
        source.pause();
      }
      return delayedStream;
    };
    Object.defineProperty(DelayedStream.prototype, "readable", {
      configurable: true,
      enumerable: true,
      get: function() {
        return this.source.readable;
      }
    });
    DelayedStream.prototype.setEncoding = function() {
      return this.source.setEncoding.apply(this.source, arguments);
    };
    DelayedStream.prototype.resume = function() {
      if (!this._released) {
        this.release();
      }
      this.source.resume();
    };
    DelayedStream.prototype.pause = function() {
      this.source.pause();
    };
    DelayedStream.prototype.release = function() {
      this._released = true;
      this._bufferedEvents.forEach(function(args) {
        this.emit.apply(this, args);
      }.bind(this));
      this._bufferedEvents = [];
    };
    DelayedStream.prototype.pipe = function() {
      var r2 = Stream.prototype.pipe.apply(this, arguments);
      this.resume();
      return r2;
    };
    DelayedStream.prototype._handleEmit = function(args) {
      if (this._released) {
        this.emit.apply(this, args);
        return;
      }
      if (args[0] === "data") {
        this.dataSize += args[1].length;
        this._checkIfMaxDataSizeExceeded();
      }
      this._bufferedEvents.push(args);
    };
    DelayedStream.prototype._checkIfMaxDataSizeExceeded = function() {
      if (this._maxDataSizeExceeded) {
        return;
      }
      if (this.dataSize <= this.maxDataSize) {
        return;
      }
      this._maxDataSizeExceeded = true;
      var message = "DelayedStream#maxDataSize of " + this.maxDataSize + " bytes exceeded.";
      this.emit("error", new Error(message));
    };
  }
});

// node_modules/combined-stream/lib/combined_stream.js
var require_combined_stream = __commonJS({
  "node_modules/combined-stream/lib/combined_stream.js"(exports, module2) {
    var util2 = require("util");
    var Stream = require("stream").Stream;
    var DelayedStream = require_delayed_stream();
    module2.exports = CombinedStream;
    function CombinedStream() {
      this.writable = false;
      this.readable = true;
      this.dataSize = 0;
      this.maxDataSize = 2 * 1024 * 1024;
      this.pauseStreams = true;
      this._released = false;
      this._streams = [];
      this._currentStream = null;
      this._insideLoop = false;
      this._pendingNext = false;
    }
    util2.inherits(CombinedStream, Stream);
    CombinedStream.create = function(options) {
      var combinedStream = new this();
      options = options || {};
      for (var option in options) {
        combinedStream[option] = options[option];
      }
      return combinedStream;
    };
    CombinedStream.isStreamLike = function(stream4) {
      return typeof stream4 !== "function" && typeof stream4 !== "string" && typeof stream4 !== "boolean" && typeof stream4 !== "number" && !Buffer.isBuffer(stream4);
    };
    CombinedStream.prototype.append = function(stream4) {
      var isStreamLike = CombinedStream.isStreamLike(stream4);
      if (isStreamLike) {
        if (!(stream4 instanceof DelayedStream)) {
          var newStream = DelayedStream.create(stream4, {
            maxDataSize: Infinity,
            pauseStream: this.pauseStreams
          });
          stream4.on("data", this._checkDataSize.bind(this));
          stream4 = newStream;
        }
        this._handleErrors(stream4);
        if (this.pauseStreams) {
          stream4.pause();
        }
      }
      this._streams.push(stream4);
      return this;
    };
    CombinedStream.prototype.pipe = function(dest, options) {
      Stream.prototype.pipe.call(this, dest, options);
      this.resume();
      return dest;
    };
    CombinedStream.prototype._getNext = function() {
      this._currentStream = null;
      if (this._insideLoop) {
        this._pendingNext = true;
        return;
      }
      this._insideLoop = true;
      try {
        do {
          this._pendingNext = false;
          this._realGetNext();
        } while (this._pendingNext);
      } finally {
        this._insideLoop = false;
      }
    };
    CombinedStream.prototype._realGetNext = function() {
      var stream4 = this._streams.shift();
      if (typeof stream4 == "undefined") {
        this.end();
        return;
      }
      if (typeof stream4 !== "function") {
        this._pipeNext(stream4);
        return;
      }
      var getStream2 = stream4;
      getStream2(function(stream5) {
        var isStreamLike = CombinedStream.isStreamLike(stream5);
        if (isStreamLike) {
          stream5.on("data", this._checkDataSize.bind(this));
          this._handleErrors(stream5);
        }
        this._pipeNext(stream5);
      }.bind(this));
    };
    CombinedStream.prototype._pipeNext = function(stream4) {
      this._currentStream = stream4;
      var isStreamLike = CombinedStream.isStreamLike(stream4);
      if (isStreamLike) {
        stream4.on("end", this._getNext.bind(this));
        stream4.pipe(this, { end: false });
        return;
      }
      var value = stream4;
      this.write(value);
      this._getNext();
    };
    CombinedStream.prototype._handleErrors = function(stream4) {
      var self2 = this;
      stream4.on("error", function(err) {
        self2._emitError(err);
      });
    };
    CombinedStream.prototype.write = function(data) {
      this.emit("data", data);
    };
    CombinedStream.prototype.pause = function() {
      if (!this.pauseStreams) {
        return;
      }
      if (this.pauseStreams && this._currentStream && typeof this._currentStream.pause == "function")
        this._currentStream.pause();
      this.emit("pause");
    };
    CombinedStream.prototype.resume = function() {
      if (!this._released) {
        this._released = true;
        this.writable = true;
        this._getNext();
      }
      if (this.pauseStreams && this._currentStream && typeof this._currentStream.resume == "function")
        this._currentStream.resume();
      this.emit("resume");
    };
    CombinedStream.prototype.end = function() {
      this._reset();
      this.emit("end");
    };
    CombinedStream.prototype.destroy = function() {
      this._reset();
      this.emit("close");
    };
    CombinedStream.prototype._reset = function() {
      this.writable = false;
      this._streams = [];
      this._currentStream = null;
    };
    CombinedStream.prototype._checkDataSize = function() {
      this._updateDataSize();
      if (this.dataSize <= this.maxDataSize) {
        return;
      }
      var message = "DelayedStream#maxDataSize of " + this.maxDataSize + " bytes exceeded.";
      this._emitError(new Error(message));
    };
    CombinedStream.prototype._updateDataSize = function() {
      this.dataSize = 0;
      var self2 = this;
      this._streams.forEach(function(stream4) {
        if (!stream4.dataSize) {
          return;
        }
        self2.dataSize += stream4.dataSize;
      });
      if (this._currentStream && this._currentStream.dataSize) {
        this.dataSize += this._currentStream.dataSize;
      }
    };
    CombinedStream.prototype._emitError = function(err) {
      this._reset();
      this.emit("error", err);
    };
  }
});

// node_modules/mime-db/db.json
var require_db = __commonJS({
  "node_modules/mime-db/db.json"(exports, module2) {
    module2.exports = {
      "application/1d-interleaved-parityfec": {
        source: "iana"
      },
      "application/3gpdash-qoe-report+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/3gpp-ims+xml": {
        source: "iana",
        compressible: true
      },
      "application/3gpphal+json": {
        source: "iana",
        compressible: true
      },
      "application/3gpphalforms+json": {
        source: "iana",
        compressible: true
      },
      "application/a2l": {
        source: "iana"
      },
      "application/ace+cbor": {
        source: "iana"
      },
      "application/activemessage": {
        source: "iana"
      },
      "application/activity+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-costmap+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-costmapfilter+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-directory+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-endpointcost+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-endpointcostparams+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-endpointprop+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-endpointpropparams+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-error+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-networkmap+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-networkmapfilter+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-updatestreamcontrol+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-updatestreamparams+json": {
        source: "iana",
        compressible: true
      },
      "application/aml": {
        source: "iana"
      },
      "application/andrew-inset": {
        source: "iana",
        extensions: ["ez"]
      },
      "application/applefile": {
        source: "iana"
      },
      "application/applixware": {
        source: "apache",
        extensions: ["aw"]
      },
      "application/at+jwt": {
        source: "iana"
      },
      "application/atf": {
        source: "iana"
      },
      "application/atfx": {
        source: "iana"
      },
      "application/atom+xml": {
        source: "iana",
        compressible: true,
        extensions: ["atom"]
      },
      "application/atomcat+xml": {
        source: "iana",
        compressible: true,
        extensions: ["atomcat"]
      },
      "application/atomdeleted+xml": {
        source: "iana",
        compressible: true,
        extensions: ["atomdeleted"]
      },
      "application/atomicmail": {
        source: "iana"
      },
      "application/atomsvc+xml": {
        source: "iana",
        compressible: true,
        extensions: ["atomsvc"]
      },
      "application/atsc-dwd+xml": {
        source: "iana",
        compressible: true,
        extensions: ["dwd"]
      },
      "application/atsc-dynamic-event-message": {
        source: "iana"
      },
      "application/atsc-held+xml": {
        source: "iana",
        compressible: true,
        extensions: ["held"]
      },
      "application/atsc-rdt+json": {
        source: "iana",
        compressible: true
      },
      "application/atsc-rsat+xml": {
        source: "iana",
        compressible: true,
        extensions: ["rsat"]
      },
      "application/atxml": {
        source: "iana"
      },
      "application/auth-policy+xml": {
        source: "iana",
        compressible: true
      },
      "application/bacnet-xdd+zip": {
        source: "iana",
        compressible: false
      },
      "application/batch-smtp": {
        source: "iana"
      },
      "application/bdoc": {
        compressible: false,
        extensions: ["bdoc"]
      },
      "application/beep+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/calendar+json": {
        source: "iana",
        compressible: true
      },
      "application/calendar+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xcs"]
      },
      "application/call-completion": {
        source: "iana"
      },
      "application/cals-1840": {
        source: "iana"
      },
      "application/captive+json": {
        source: "iana",
        compressible: true
      },
      "application/cbor": {
        source: "iana"
      },
      "application/cbor-seq": {
        source: "iana"
      },
      "application/cccex": {
        source: "iana"
      },
      "application/ccmp+xml": {
        source: "iana",
        compressible: true
      },
      "application/ccxml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["ccxml"]
      },
      "application/cdfx+xml": {
        source: "iana",
        compressible: true,
        extensions: ["cdfx"]
      },
      "application/cdmi-capability": {
        source: "iana",
        extensions: ["cdmia"]
      },
      "application/cdmi-container": {
        source: "iana",
        extensions: ["cdmic"]
      },
      "application/cdmi-domain": {
        source: "iana",
        extensions: ["cdmid"]
      },
      "application/cdmi-object": {
        source: "iana",
        extensions: ["cdmio"]
      },
      "application/cdmi-queue": {
        source: "iana",
        extensions: ["cdmiq"]
      },
      "application/cdni": {
        source: "iana"
      },
      "application/cea": {
        source: "iana"
      },
      "application/cea-2018+xml": {
        source: "iana",
        compressible: true
      },
      "application/cellml+xml": {
        source: "iana",
        compressible: true
      },
      "application/cfw": {
        source: "iana"
      },
      "application/city+json": {
        source: "iana",
        compressible: true
      },
      "application/clr": {
        source: "iana"
      },
      "application/clue+xml": {
        source: "iana",
        compressible: true
      },
      "application/clue_info+xml": {
        source: "iana",
        compressible: true
      },
      "application/cms": {
        source: "iana"
      },
      "application/cnrp+xml": {
        source: "iana",
        compressible: true
      },
      "application/coap-group+json": {
        source: "iana",
        compressible: true
      },
      "application/coap-payload": {
        source: "iana"
      },
      "application/commonground": {
        source: "iana"
      },
      "application/conference-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/cose": {
        source: "iana"
      },
      "application/cose-key": {
        source: "iana"
      },
      "application/cose-key-set": {
        source: "iana"
      },
      "application/cpl+xml": {
        source: "iana",
        compressible: true,
        extensions: ["cpl"]
      },
      "application/csrattrs": {
        source: "iana"
      },
      "application/csta+xml": {
        source: "iana",
        compressible: true
      },
      "application/cstadata+xml": {
        source: "iana",
        compressible: true
      },
      "application/csvm+json": {
        source: "iana",
        compressible: true
      },
      "application/cu-seeme": {
        source: "apache",
        extensions: ["cu"]
      },
      "application/cwt": {
        source: "iana"
      },
      "application/cybercash": {
        source: "iana"
      },
      "application/dart": {
        compressible: true
      },
      "application/dash+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mpd"]
      },
      "application/dash-patch+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mpp"]
      },
      "application/dashdelta": {
        source: "iana"
      },
      "application/davmount+xml": {
        source: "iana",
        compressible: true,
        extensions: ["davmount"]
      },
      "application/dca-rft": {
        source: "iana"
      },
      "application/dcd": {
        source: "iana"
      },
      "application/dec-dx": {
        source: "iana"
      },
      "application/dialog-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/dicom": {
        source: "iana"
      },
      "application/dicom+json": {
        source: "iana",
        compressible: true
      },
      "application/dicom+xml": {
        source: "iana",
        compressible: true
      },
      "application/dii": {
        source: "iana"
      },
      "application/dit": {
        source: "iana"
      },
      "application/dns": {
        source: "iana"
      },
      "application/dns+json": {
        source: "iana",
        compressible: true
      },
      "application/dns-message": {
        source: "iana"
      },
      "application/docbook+xml": {
        source: "apache",
        compressible: true,
        extensions: ["dbk"]
      },
      "application/dots+cbor": {
        source: "iana"
      },
      "application/dskpp+xml": {
        source: "iana",
        compressible: true
      },
      "application/dssc+der": {
        source: "iana",
        extensions: ["dssc"]
      },
      "application/dssc+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xdssc"]
      },
      "application/dvcs": {
        source: "iana"
      },
      "application/ecmascript": {
        source: "iana",
        compressible: true,
        extensions: ["es", "ecma"]
      },
      "application/edi-consent": {
        source: "iana"
      },
      "application/edi-x12": {
        source: "iana",
        compressible: false
      },
      "application/edifact": {
        source: "iana",
        compressible: false
      },
      "application/efi": {
        source: "iana"
      },
      "application/elm+json": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/elm+xml": {
        source: "iana",
        compressible: true
      },
      "application/emergencycalldata.cap+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/emergencycalldata.comment+xml": {
        source: "iana",
        compressible: true
      },
      "application/emergencycalldata.control+xml": {
        source: "iana",
        compressible: true
      },
      "application/emergencycalldata.deviceinfo+xml": {
        source: "iana",
        compressible: true
      },
      "application/emergencycalldata.ecall.msd": {
        source: "iana"
      },
      "application/emergencycalldata.providerinfo+xml": {
        source: "iana",
        compressible: true
      },
      "application/emergencycalldata.serviceinfo+xml": {
        source: "iana",
        compressible: true
      },
      "application/emergencycalldata.subscriberinfo+xml": {
        source: "iana",
        compressible: true
      },
      "application/emergencycalldata.veds+xml": {
        source: "iana",
        compressible: true
      },
      "application/emma+xml": {
        source: "iana",
        compressible: true,
        extensions: ["emma"]
      },
      "application/emotionml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["emotionml"]
      },
      "application/encaprtp": {
        source: "iana"
      },
      "application/epp+xml": {
        source: "iana",
        compressible: true
      },
      "application/epub+zip": {
        source: "iana",
        compressible: false,
        extensions: ["epub"]
      },
      "application/eshop": {
        source: "iana"
      },
      "application/exi": {
        source: "iana",
        extensions: ["exi"]
      },
      "application/expect-ct-report+json": {
        source: "iana",
        compressible: true
      },
      "application/express": {
        source: "iana",
        extensions: ["exp"]
      },
      "application/fastinfoset": {
        source: "iana"
      },
      "application/fastsoap": {
        source: "iana"
      },
      "application/fdt+xml": {
        source: "iana",
        compressible: true,
        extensions: ["fdt"]
      },
      "application/fhir+json": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/fhir+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/fido.trusted-apps+json": {
        compressible: true
      },
      "application/fits": {
        source: "iana"
      },
      "application/flexfec": {
        source: "iana"
      },
      "application/font-sfnt": {
        source: "iana"
      },
      "application/font-tdpfr": {
        source: "iana",
        extensions: ["pfr"]
      },
      "application/font-woff": {
        source: "iana",
        compressible: false
      },
      "application/framework-attributes+xml": {
        source: "iana",
        compressible: true
      },
      "application/geo+json": {
        source: "iana",
        compressible: true,
        extensions: ["geojson"]
      },
      "application/geo+json-seq": {
        source: "iana"
      },
      "application/geopackage+sqlite3": {
        source: "iana"
      },
      "application/geoxacml+xml": {
        source: "iana",
        compressible: true
      },
      "application/gltf-buffer": {
        source: "iana"
      },
      "application/gml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["gml"]
      },
      "application/gpx+xml": {
        source: "apache",
        compressible: true,
        extensions: ["gpx"]
      },
      "application/gxf": {
        source: "apache",
        extensions: ["gxf"]
      },
      "application/gzip": {
        source: "iana",
        compressible: false,
        extensions: ["gz"]
      },
      "application/h224": {
        source: "iana"
      },
      "application/held+xml": {
        source: "iana",
        compressible: true
      },
      "application/hjson": {
        extensions: ["hjson"]
      },
      "application/http": {
        source: "iana"
      },
      "application/hyperstudio": {
        source: "iana",
        extensions: ["stk"]
      },
      "application/ibe-key-request+xml": {
        source: "iana",
        compressible: true
      },
      "application/ibe-pkg-reply+xml": {
        source: "iana",
        compressible: true
      },
      "application/ibe-pp-data": {
        source: "iana"
      },
      "application/iges": {
        source: "iana"
      },
      "application/im-iscomposing+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/index": {
        source: "iana"
      },
      "application/index.cmd": {
        source: "iana"
      },
      "application/index.obj": {
        source: "iana"
      },
      "application/index.response": {
        source: "iana"
      },
      "application/index.vnd": {
        source: "iana"
      },
      "application/inkml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["ink", "inkml"]
      },
      "application/iotp": {
        source: "iana"
      },
      "application/ipfix": {
        source: "iana",
        extensions: ["ipfix"]
      },
      "application/ipp": {
        source: "iana"
      },
      "application/isup": {
        source: "iana"
      },
      "application/its+xml": {
        source: "iana",
        compressible: true,
        extensions: ["its"]
      },
      "application/java-archive": {
        source: "apache",
        compressible: false,
        extensions: ["jar", "war", "ear"]
      },
      "application/java-serialized-object": {
        source: "apache",
        compressible: false,
        extensions: ["ser"]
      },
      "application/java-vm": {
        source: "apache",
        compressible: false,
        extensions: ["class"]
      },
      "application/javascript": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
        extensions: ["js", "mjs"]
      },
      "application/jf2feed+json": {
        source: "iana",
        compressible: true
      },
      "application/jose": {
        source: "iana"
      },
      "application/jose+json": {
        source: "iana",
        compressible: true
      },
      "application/jrd+json": {
        source: "iana",
        compressible: true
      },
      "application/jscalendar+json": {
        source: "iana",
        compressible: true
      },
      "application/json": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
        extensions: ["json", "map"]
      },
      "application/json-patch+json": {
        source: "iana",
        compressible: true
      },
      "application/json-seq": {
        source: "iana"
      },
      "application/json5": {
        extensions: ["json5"]
      },
      "application/jsonml+json": {
        source: "apache",
        compressible: true,
        extensions: ["jsonml"]
      },
      "application/jwk+json": {
        source: "iana",
        compressible: true
      },
      "application/jwk-set+json": {
        source: "iana",
        compressible: true
      },
      "application/jwt": {
        source: "iana"
      },
      "application/kpml-request+xml": {
        source: "iana",
        compressible: true
      },
      "application/kpml-response+xml": {
        source: "iana",
        compressible: true
      },
      "application/ld+json": {
        source: "iana",
        compressible: true,
        extensions: ["jsonld"]
      },
      "application/lgr+xml": {
        source: "iana",
        compressible: true,
        extensions: ["lgr"]
      },
      "application/link-format": {
        source: "iana"
      },
      "application/load-control+xml": {
        source: "iana",
        compressible: true
      },
      "application/lost+xml": {
        source: "iana",
        compressible: true,
        extensions: ["lostxml"]
      },
      "application/lostsync+xml": {
        source: "iana",
        compressible: true
      },
      "application/lpf+zip": {
        source: "iana",
        compressible: false
      },
      "application/lxf": {
        source: "iana"
      },
      "application/mac-binhex40": {
        source: "iana",
        extensions: ["hqx"]
      },
      "application/mac-compactpro": {
        source: "apache",
        extensions: ["cpt"]
      },
      "application/macwriteii": {
        source: "iana"
      },
      "application/mads+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mads"]
      },
      "application/manifest+json": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
        extensions: ["webmanifest"]
      },
      "application/marc": {
        source: "iana",
        extensions: ["mrc"]
      },
      "application/marcxml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mrcx"]
      },
      "application/mathematica": {
        source: "iana",
        extensions: ["ma", "nb", "mb"]
      },
      "application/mathml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mathml"]
      },
      "application/mathml-content+xml": {
        source: "iana",
        compressible: true
      },
      "application/mathml-presentation+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbms-associated-procedure-description+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbms-deregister+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbms-envelope+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbms-msk+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbms-msk-response+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbms-protection-description+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbms-reception-report+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbms-register+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbms-register-response+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbms-schedule+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbms-user-service-description+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbox": {
        source: "iana",
        extensions: ["mbox"]
      },
      "application/media-policy-dataset+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mpf"]
      },
      "application/media_control+xml": {
        source: "iana",
        compressible: true
      },
      "application/mediaservercontrol+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mscml"]
      },
      "application/merge-patch+json": {
        source: "iana",
        compressible: true
      },
      "application/metalink+xml": {
        source: "apache",
        compressible: true,
        extensions: ["metalink"]
      },
      "application/metalink4+xml": {
        source: "iana",
        compressible: true,
        extensions: ["meta4"]
      },
      "application/mets+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mets"]
      },
      "application/mf4": {
        source: "iana"
      },
      "application/mikey": {
        source: "iana"
      },
      "application/mipc": {
        source: "iana"
      },
      "application/missing-blocks+cbor-seq": {
        source: "iana"
      },
      "application/mmt-aei+xml": {
        source: "iana",
        compressible: true,
        extensions: ["maei"]
      },
      "application/mmt-usd+xml": {
        source: "iana",
        compressible: true,
        extensions: ["musd"]
      },
      "application/mods+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mods"]
      },
      "application/moss-keys": {
        source: "iana"
      },
      "application/moss-signature": {
        source: "iana"
      },
      "application/mosskey-data": {
        source: "iana"
      },
      "application/mosskey-request": {
        source: "iana"
      },
      "application/mp21": {
        source: "iana",
        extensions: ["m21", "mp21"]
      },
      "application/mp4": {
        source: "iana",
        extensions: ["mp4s", "m4p"]
      },
      "application/mpeg4-generic": {
        source: "iana"
      },
      "application/mpeg4-iod": {
        source: "iana"
      },
      "application/mpeg4-iod-xmt": {
        source: "iana"
      },
      "application/mrb-consumer+xml": {
        source: "iana",
        compressible: true
      },
      "application/mrb-publish+xml": {
        source: "iana",
        compressible: true
      },
      "application/msc-ivr+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/msc-mixer+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/msword": {
        source: "iana",
        compressible: false,
        extensions: ["doc", "dot"]
      },
      "application/mud+json": {
        source: "iana",
        compressible: true
      },
      "application/multipart-core": {
        source: "iana"
      },
      "application/mxf": {
        source: "iana",
        extensions: ["mxf"]
      },
      "application/n-quads": {
        source: "iana",
        extensions: ["nq"]
      },
      "application/n-triples": {
        source: "iana",
        extensions: ["nt"]
      },
      "application/nasdata": {
        source: "iana"
      },
      "application/news-checkgroups": {
        source: "iana",
        charset: "US-ASCII"
      },
      "application/news-groupinfo": {
        source: "iana",
        charset: "US-ASCII"
      },
      "application/news-transmission": {
        source: "iana"
      },
      "application/nlsml+xml": {
        source: "iana",
        compressible: true
      },
      "application/node": {
        source: "iana",
        extensions: ["cjs"]
      },
      "application/nss": {
        source: "iana"
      },
      "application/oauth-authz-req+jwt": {
        source: "iana"
      },
      "application/oblivious-dns-message": {
        source: "iana"
      },
      "application/ocsp-request": {
        source: "iana"
      },
      "application/ocsp-response": {
        source: "iana"
      },
      "application/octet-stream": {
        source: "iana",
        compressible: false,
        extensions: ["bin", "dms", "lrf", "mar", "so", "dist", "distz", "pkg", "bpk", "dump", "elc", "deploy", "exe", "dll", "deb", "dmg", "iso", "img", "msi", "msp", "msm", "buffer"]
      },
      "application/oda": {
        source: "iana",
        extensions: ["oda"]
      },
      "application/odm+xml": {
        source: "iana",
        compressible: true
      },
      "application/odx": {
        source: "iana"
      },
      "application/oebps-package+xml": {
        source: "iana",
        compressible: true,
        extensions: ["opf"]
      },
      "application/ogg": {
        source: "iana",
        compressible: false,
        extensions: ["ogx"]
      },
      "application/omdoc+xml": {
        source: "apache",
        compressible: true,
        extensions: ["omdoc"]
      },
      "application/onenote": {
        source: "apache",
        extensions: ["onetoc", "onetoc2", "onetmp", "onepkg"]
      },
      "application/opc-nodeset+xml": {
        source: "iana",
        compressible: true
      },
      "application/oscore": {
        source: "iana"
      },
      "application/oxps": {
        source: "iana",
        extensions: ["oxps"]
      },
      "application/p21": {
        source: "iana"
      },
      "application/p21+zip": {
        source: "iana",
        compressible: false
      },
      "application/p2p-overlay+xml": {
        source: "iana",
        compressible: true,
        extensions: ["relo"]
      },
      "application/parityfec": {
        source: "iana"
      },
      "application/passport": {
        source: "iana"
      },
      "application/patch-ops-error+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xer"]
      },
      "application/pdf": {
        source: "iana",
        compressible: false,
        extensions: ["pdf"]
      },
      "application/pdx": {
        source: "iana"
      },
      "application/pem-certificate-chain": {
        source: "iana"
      },
      "application/pgp-encrypted": {
        source: "iana",
        compressible: false,
        extensions: ["pgp"]
      },
      "application/pgp-keys": {
        source: "iana",
        extensions: ["asc"]
      },
      "application/pgp-signature": {
        source: "iana",
        extensions: ["asc", "sig"]
      },
      "application/pics-rules": {
        source: "apache",
        extensions: ["prf"]
      },
      "application/pidf+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/pidf-diff+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/pkcs10": {
        source: "iana",
        extensions: ["p10"]
      },
      "application/pkcs12": {
        source: "iana"
      },
      "application/pkcs7-mime": {
        source: "iana",
        extensions: ["p7m", "p7c"]
      },
      "application/pkcs7-signature": {
        source: "iana",
        extensions: ["p7s"]
      },
      "application/pkcs8": {
        source: "iana",
        extensions: ["p8"]
      },
      "application/pkcs8-encrypted": {
        source: "iana"
      },
      "application/pkix-attr-cert": {
        source: "iana",
        extensions: ["ac"]
      },
      "application/pkix-cert": {
        source: "iana",
        extensions: ["cer"]
      },
      "application/pkix-crl": {
        source: "iana",
        extensions: ["crl"]
      },
      "application/pkix-pkipath": {
        source: "iana",
        extensions: ["pkipath"]
      },
      "application/pkixcmp": {
        source: "iana",
        extensions: ["pki"]
      },
      "application/pls+xml": {
        source: "iana",
        compressible: true,
        extensions: ["pls"]
      },
      "application/poc-settings+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/postscript": {
        source: "iana",
        compressible: true,
        extensions: ["ai", "eps", "ps"]
      },
      "application/ppsp-tracker+json": {
        source: "iana",
        compressible: true
      },
      "application/problem+json": {
        source: "iana",
        compressible: true
      },
      "application/problem+xml": {
        source: "iana",
        compressible: true
      },
      "application/provenance+xml": {
        source: "iana",
        compressible: true,
        extensions: ["provx"]
      },
      "application/prs.alvestrand.titrax-sheet": {
        source: "iana"
      },
      "application/prs.cww": {
        source: "iana",
        extensions: ["cww"]
      },
      "application/prs.cyn": {
        source: "iana",
        charset: "7-BIT"
      },
      "application/prs.hpub+zip": {
        source: "iana",
        compressible: false
      },
      "application/prs.nprend": {
        source: "iana"
      },
      "application/prs.plucker": {
        source: "iana"
      },
      "application/prs.rdf-xml-crypt": {
        source: "iana"
      },
      "application/prs.xsf+xml": {
        source: "iana",
        compressible: true
      },
      "application/pskc+xml": {
        source: "iana",
        compressible: true,
        extensions: ["pskcxml"]
      },
      "application/pvd+json": {
        source: "iana",
        compressible: true
      },
      "application/qsig": {
        source: "iana"
      },
      "application/raml+yaml": {
        compressible: true,
        extensions: ["raml"]
      },
      "application/raptorfec": {
        source: "iana"
      },
      "application/rdap+json": {
        source: "iana",
        compressible: true
      },
      "application/rdf+xml": {
        source: "iana",
        compressible: true,
        extensions: ["rdf", "owl"]
      },
      "application/reginfo+xml": {
        source: "iana",
        compressible: true,
        extensions: ["rif"]
      },
      "application/relax-ng-compact-syntax": {
        source: "iana",
        extensions: ["rnc"]
      },
      "application/remote-printing": {
        source: "iana"
      },
      "application/reputon+json": {
        source: "iana",
        compressible: true
      },
      "application/resource-lists+xml": {
        source: "iana",
        compressible: true,
        extensions: ["rl"]
      },
      "application/resource-lists-diff+xml": {
        source: "iana",
        compressible: true,
        extensions: ["rld"]
      },
      "application/rfc+xml": {
        source: "iana",
        compressible: true
      },
      "application/riscos": {
        source: "iana"
      },
      "application/rlmi+xml": {
        source: "iana",
        compressible: true
      },
      "application/rls-services+xml": {
        source: "iana",
        compressible: true,
        extensions: ["rs"]
      },
      "application/route-apd+xml": {
        source: "iana",
        compressible: true,
        extensions: ["rapd"]
      },
      "application/route-s-tsid+xml": {
        source: "iana",
        compressible: true,
        extensions: ["sls"]
      },
      "application/route-usd+xml": {
        source: "iana",
        compressible: true,
        extensions: ["rusd"]
      },
      "application/rpki-ghostbusters": {
        source: "iana",
        extensions: ["gbr"]
      },
      "application/rpki-manifest": {
        source: "iana",
        extensions: ["mft"]
      },
      "application/rpki-publication": {
        source: "iana"
      },
      "application/rpki-roa": {
        source: "iana",
        extensions: ["roa"]
      },
      "application/rpki-updown": {
        source: "iana"
      },
      "application/rsd+xml": {
        source: "apache",
        compressible: true,
        extensions: ["rsd"]
      },
      "application/rss+xml": {
        source: "apache",
        compressible: true,
        extensions: ["rss"]
      },
      "application/rtf": {
        source: "iana",
        compressible: true,
        extensions: ["rtf"]
      },
      "application/rtploopback": {
        source: "iana"
      },
      "application/rtx": {
        source: "iana"
      },
      "application/samlassertion+xml": {
        source: "iana",
        compressible: true
      },
      "application/samlmetadata+xml": {
        source: "iana",
        compressible: true
      },
      "application/sarif+json": {
        source: "iana",
        compressible: true
      },
      "application/sarif-external-properties+json": {
        source: "iana",
        compressible: true
      },
      "application/sbe": {
        source: "iana"
      },
      "application/sbml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["sbml"]
      },
      "application/scaip+xml": {
        source: "iana",
        compressible: true
      },
      "application/scim+json": {
        source: "iana",
        compressible: true
      },
      "application/scvp-cv-request": {
        source: "iana",
        extensions: ["scq"]
      },
      "application/scvp-cv-response": {
        source: "iana",
        extensions: ["scs"]
      },
      "application/scvp-vp-request": {
        source: "iana",
        extensions: ["spq"]
      },
      "application/scvp-vp-response": {
        source: "iana",
        extensions: ["spp"]
      },
      "application/sdp": {
        source: "iana",
        extensions: ["sdp"]
      },
      "application/secevent+jwt": {
        source: "iana"
      },
      "application/senml+cbor": {
        source: "iana"
      },
      "application/senml+json": {
        source: "iana",
        compressible: true
      },
      "application/senml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["senmlx"]
      },
      "application/senml-etch+cbor": {
        source: "iana"
      },
      "application/senml-etch+json": {
        source: "iana",
        compressible: true
      },
      "application/senml-exi": {
        source: "iana"
      },
      "application/sensml+cbor": {
        source: "iana"
      },
      "application/sensml+json": {
        source: "iana",
        compressible: true
      },
      "application/sensml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["sensmlx"]
      },
      "application/sensml-exi": {
        source: "iana"
      },
      "application/sep+xml": {
        source: "iana",
        compressible: true
      },
      "application/sep-exi": {
        source: "iana"
      },
      "application/session-info": {
        source: "iana"
      },
      "application/set-payment": {
        source: "iana"
      },
      "application/set-payment-initiation": {
        source: "iana",
        extensions: ["setpay"]
      },
      "application/set-registration": {
        source: "iana"
      },
      "application/set-registration-initiation": {
        source: "iana",
        extensions: ["setreg"]
      },
      "application/sgml": {
        source: "iana"
      },
      "application/sgml-open-catalog": {
        source: "iana"
      },
      "application/shf+xml": {
        source: "iana",
        compressible: true,
        extensions: ["shf"]
      },
      "application/sieve": {
        source: "iana",
        extensions: ["siv", "sieve"]
      },
      "application/simple-filter+xml": {
        source: "iana",
        compressible: true
      },
      "application/simple-message-summary": {
        source: "iana"
      },
      "application/simplesymbolcontainer": {
        source: "iana"
      },
      "application/sipc": {
        source: "iana"
      },
      "application/slate": {
        source: "iana"
      },
      "application/smil": {
        source: "iana"
      },
      "application/smil+xml": {
        source: "iana",
        compressible: true,
        extensions: ["smi", "smil"]
      },
      "application/smpte336m": {
        source: "iana"
      },
      "application/soap+fastinfoset": {
        source: "iana"
      },
      "application/soap+xml": {
        source: "iana",
        compressible: true
      },
      "application/sparql-query": {
        source: "iana",
        extensions: ["rq"]
      },
      "application/sparql-results+xml": {
        source: "iana",
        compressible: true,
        extensions: ["srx"]
      },
      "application/spdx+json": {
        source: "iana",
        compressible: true
      },
      "application/spirits-event+xml": {
        source: "iana",
        compressible: true
      },
      "application/sql": {
        source: "iana"
      },
      "application/srgs": {
        source: "iana",
        extensions: ["gram"]
      },
      "application/srgs+xml": {
        source: "iana",
        compressible: true,
        extensions: ["grxml"]
      },
      "application/sru+xml": {
        source: "iana",
        compressible: true,
        extensions: ["sru"]
      },
      "application/ssdl+xml": {
        source: "apache",
        compressible: true,
        extensions: ["ssdl"]
      },
      "application/ssml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["ssml"]
      },
      "application/stix+json": {
        source: "iana",
        compressible: true
      },
      "application/swid+xml": {
        source: "iana",
        compressible: true,
        extensions: ["swidtag"]
      },
      "application/tamp-apex-update": {
        source: "iana"
      },
      "application/tamp-apex-update-confirm": {
        source: "iana"
      },
      "application/tamp-community-update": {
        source: "iana"
      },
      "application/tamp-community-update-confirm": {
        source: "iana"
      },
      "application/tamp-error": {
        source: "iana"
      },
      "application/tamp-sequence-adjust": {
        source: "iana"
      },
      "application/tamp-sequence-adjust-confirm": {
        source: "iana"
      },
      "application/tamp-status-query": {
        source: "iana"
      },
      "application/tamp-status-response": {
        source: "iana"
      },
      "application/tamp-update": {
        source: "iana"
      },
      "application/tamp-update-confirm": {
        source: "iana"
      },
      "application/tar": {
        compressible: true
      },
      "application/taxii+json": {
        source: "iana",
        compressible: true
      },
      "application/td+json": {
        source: "iana",
        compressible: true
      },
      "application/tei+xml": {
        source: "iana",
        compressible: true,
        extensions: ["tei", "teicorpus"]
      },
      "application/tetra_isi": {
        source: "iana"
      },
      "application/thraud+xml": {
        source: "iana",
        compressible: true,
        extensions: ["tfi"]
      },
      "application/timestamp-query": {
        source: "iana"
      },
      "application/timestamp-reply": {
        source: "iana"
      },
      "application/timestamped-data": {
        source: "iana",
        extensions: ["tsd"]
      },
      "application/tlsrpt+gzip": {
        source: "iana"
      },
      "application/tlsrpt+json": {
        source: "iana",
        compressible: true
      },
      "application/tnauthlist": {
        source: "iana"
      },
      "application/token-introspection+jwt": {
        source: "iana"
      },
      "application/toml": {
        compressible: true,
        extensions: ["toml"]
      },
      "application/trickle-ice-sdpfrag": {
        source: "iana"
      },
      "application/trig": {
        source: "iana",
        extensions: ["trig"]
      },
      "application/ttml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["ttml"]
      },
      "application/tve-trigger": {
        source: "iana"
      },
      "application/tzif": {
        source: "iana"
      },
      "application/tzif-leap": {
        source: "iana"
      },
      "application/ubjson": {
        compressible: false,
        extensions: ["ubj"]
      },
      "application/ulpfec": {
        source: "iana"
      },
      "application/urc-grpsheet+xml": {
        source: "iana",
        compressible: true
      },
      "application/urc-ressheet+xml": {
        source: "iana",
        compressible: true,
        extensions: ["rsheet"]
      },
      "application/urc-targetdesc+xml": {
        source: "iana",
        compressible: true,
        extensions: ["td"]
      },
      "application/urc-uisocketdesc+xml": {
        source: "iana",
        compressible: true
      },
      "application/vcard+json": {
        source: "iana",
        compressible: true
      },
      "application/vcard+xml": {
        source: "iana",
        compressible: true
      },
      "application/vemmi": {
        source: "iana"
      },
      "application/vividence.scriptfile": {
        source: "apache"
      },
      "application/vnd.1000minds.decision-model+xml": {
        source: "iana",
        compressible: true,
        extensions: ["1km"]
      },
      "application/vnd.3gpp-prose+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp-prose-pc3ch+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp-v2x-local-service-information": {
        source: "iana"
      },
      "application/vnd.3gpp.5gnas": {
        source: "iana"
      },
      "application/vnd.3gpp.access-transfer-events+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.bsf+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.gmop+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.gtpc": {
        source: "iana"
      },
      "application/vnd.3gpp.interworking-data": {
        source: "iana"
      },
      "application/vnd.3gpp.lpp": {
        source: "iana"
      },
      "application/vnd.3gpp.mc-signalling-ear": {
        source: "iana"
      },
      "application/vnd.3gpp.mcdata-affiliation-command+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcdata-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcdata-payload": {
        source: "iana"
      },
      "application/vnd.3gpp.mcdata-service-config+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcdata-signalling": {
        source: "iana"
      },
      "application/vnd.3gpp.mcdata-ue-config+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcdata-user-profile+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcptt-affiliation-command+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcptt-floor-request+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcptt-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcptt-location-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcptt-mbms-usage-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcptt-service-config+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcptt-signed+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcptt-ue-config+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcptt-ue-init-config+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcptt-user-profile+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcvideo-affiliation-command+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcvideo-affiliation-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcvideo-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcvideo-location-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcvideo-mbms-usage-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcvideo-service-config+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcvideo-transmission-request+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcvideo-ue-config+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcvideo-user-profile+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mid-call+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.ngap": {
        source: "iana"
      },
      "application/vnd.3gpp.pfcp": {
        source: "iana"
      },
      "application/vnd.3gpp.pic-bw-large": {
        source: "iana",
        extensions: ["plb"]
      },
      "application/vnd.3gpp.pic-bw-small": {
        source: "iana",
        extensions: ["psb"]
      },
      "application/vnd.3gpp.pic-bw-var": {
        source: "iana",
        extensions: ["pvb"]
      },
      "application/vnd.3gpp.s1ap": {
        source: "iana"
      },
      "application/vnd.3gpp.sms": {
        source: "iana"
      },
      "application/vnd.3gpp.sms+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.srvcc-ext+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.srvcc-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.state-and-event-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.ussd+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp2.bcmcsinfo+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp2.sms": {
        source: "iana"
      },
      "application/vnd.3gpp2.tcap": {
        source: "iana",
        extensions: ["tcap"]
      },
      "application/vnd.3lightssoftware.imagescal": {
        source: "iana"
      },
      "application/vnd.3m.post-it-notes": {
        source: "iana",
        extensions: ["pwn"]
      },
      "application/vnd.accpac.simply.aso": {
        source: "iana",
        extensions: ["aso"]
      },
      "application/vnd.accpac.simply.imp": {
        source: "iana",
        extensions: ["imp"]
      },
      "application/vnd.acucobol": {
        source: "iana",
        extensions: ["acu"]
      },
      "application/vnd.acucorp": {
        source: "iana",
        extensions: ["atc", "acutc"]
      },
      "application/vnd.adobe.air-application-installer-package+zip": {
        source: "apache",
        compressible: false,
        extensions: ["air"]
      },
      "application/vnd.adobe.flash.movie": {
        source: "iana"
      },
      "application/vnd.adobe.formscentral.fcdt": {
        source: "iana",
        extensions: ["fcdt"]
      },
      "application/vnd.adobe.fxp": {
        source: "iana",
        extensions: ["fxp", "fxpl"]
      },
      "application/vnd.adobe.partial-upload": {
        source: "iana"
      },
      "application/vnd.adobe.xdp+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xdp"]
      },
      "application/vnd.adobe.xfdf": {
        source: "iana",
        extensions: ["xfdf"]
      },
      "application/vnd.aether.imp": {
        source: "iana"
      },
      "application/vnd.afpc.afplinedata": {
        source: "iana"
      },
      "application/vnd.afpc.afplinedata-pagedef": {
        source: "iana"
      },
      "application/vnd.afpc.cmoca-cmresource": {
        source: "iana"
      },
      "application/vnd.afpc.foca-charset": {
        source: "iana"
      },
      "application/vnd.afpc.foca-codedfont": {
        source: "iana"
      },
      "application/vnd.afpc.foca-codepage": {
        source: "iana"
      },
      "application/vnd.afpc.modca": {
        source: "iana"
      },
      "application/vnd.afpc.modca-cmtable": {
        source: "iana"
      },
      "application/vnd.afpc.modca-formdef": {
        source: "iana"
      },
      "application/vnd.afpc.modca-mediummap": {
        source: "iana"
      },
      "application/vnd.afpc.modca-objectcontainer": {
        source: "iana"
      },
      "application/vnd.afpc.modca-overlay": {
        source: "iana"
      },
      "application/vnd.afpc.modca-pagesegment": {
        source: "iana"
      },
      "application/vnd.age": {
        source: "iana",
        extensions: ["age"]
      },
      "application/vnd.ah-barcode": {
        source: "iana"
      },
      "application/vnd.ahead.space": {
        source: "iana",
        extensions: ["ahead"]
      },
      "application/vnd.airzip.filesecure.azf": {
        source: "iana",
        extensions: ["azf"]
      },
      "application/vnd.airzip.filesecure.azs": {
        source: "iana",
        extensions: ["azs"]
      },
      "application/vnd.amadeus+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.amazon.ebook": {
        source: "apache",
        extensions: ["azw"]
      },
      "application/vnd.amazon.mobi8-ebook": {
        source: "iana"
      },
      "application/vnd.americandynamics.acc": {
        source: "iana",
        extensions: ["acc"]
      },
      "application/vnd.amiga.ami": {
        source: "iana",
        extensions: ["ami"]
      },
      "application/vnd.amundsen.maze+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.android.ota": {
        source: "iana"
      },
      "application/vnd.android.package-archive": {
        source: "apache",
        compressible: false,
        extensions: ["apk"]
      },
      "application/vnd.anki": {
        source: "iana"
      },
      "application/vnd.anser-web-certificate-issue-initiation": {
        source: "iana",
        extensions: ["cii"]
      },
      "application/vnd.anser-web-funds-transfer-initiation": {
        source: "apache",
        extensions: ["fti"]
      },
      "application/vnd.antix.game-component": {
        source: "iana",
        extensions: ["atx"]
      },
      "application/vnd.apache.arrow.file": {
        source: "iana"
      },
      "application/vnd.apache.arrow.stream": {
        source: "iana"
      },
      "application/vnd.apache.thrift.binary": {
        source: "iana"
      },
      "application/vnd.apache.thrift.compact": {
        source: "iana"
      },
      "application/vnd.apache.thrift.json": {
        source: "iana"
      },
      "application/vnd.api+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.aplextor.warrp+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.apothekende.reservation+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.apple.installer+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mpkg"]
      },
      "application/vnd.apple.keynote": {
        source: "iana",
        extensions: ["key"]
      },
      "application/vnd.apple.mpegurl": {
        source: "iana",
        extensions: ["m3u8"]
      },
      "application/vnd.apple.numbers": {
        source: "iana",
        extensions: ["numbers"]
      },
      "application/vnd.apple.pages": {
        source: "iana",
        extensions: ["pages"]
      },
      "application/vnd.apple.pkpass": {
        compressible: false,
        extensions: ["pkpass"]
      },
      "application/vnd.arastra.swi": {
        source: "iana"
      },
      "application/vnd.aristanetworks.swi": {
        source: "iana",
        extensions: ["swi"]
      },
      "application/vnd.artisan+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.artsquare": {
        source: "iana"
      },
      "application/vnd.astraea-software.iota": {
        source: "iana",
        extensions: ["iota"]
      },
      "application/vnd.audiograph": {
        source: "iana",
        extensions: ["aep"]
      },
      "application/vnd.autopackage": {
        source: "iana"
      },
      "application/vnd.avalon+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.avistar+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.balsamiq.bmml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["bmml"]
      },
      "application/vnd.balsamiq.bmpr": {
        source: "iana"
      },
      "application/vnd.banana-accounting": {
        source: "iana"
      },
      "application/vnd.bbf.usp.error": {
        source: "iana"
      },
      "application/vnd.bbf.usp.msg": {
        source: "iana"
      },
      "application/vnd.bbf.usp.msg+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.bekitzur-stech+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.bint.med-content": {
        source: "iana"
      },
      "application/vnd.biopax.rdf+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.blink-idb-value-wrapper": {
        source: "iana"
      },
      "application/vnd.blueice.multipass": {
        source: "iana",
        extensions: ["mpm"]
      },
      "application/vnd.bluetooth.ep.oob": {
        source: "iana"
      },
      "application/vnd.bluetooth.le.oob": {
        source: "iana"
      },
      "application/vnd.bmi": {
        source: "iana",
        extensions: ["bmi"]
      },
      "application/vnd.bpf": {
        source: "iana"
      },
      "application/vnd.bpf3": {
        source: "iana"
      },
      "application/vnd.businessobjects": {
        source: "iana",
        extensions: ["rep"]
      },
      "application/vnd.byu.uapi+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.cab-jscript": {
        source: "iana"
      },
      "application/vnd.canon-cpdl": {
        source: "iana"
      },
      "application/vnd.canon-lips": {
        source: "iana"
      },
      "application/vnd.capasystems-pg+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.cendio.thinlinc.clientconf": {
        source: "iana"
      },
      "application/vnd.century-systems.tcp_stream": {
        source: "iana"
      },
      "application/vnd.chemdraw+xml": {
        source: "iana",
        compressible: true,
        extensions: ["cdxml"]
      },
      "application/vnd.chess-pgn": {
        source: "iana"
      },
      "application/vnd.chipnuts.karaoke-mmd": {
        source: "iana",
        extensions: ["mmd"]
      },
      "application/vnd.ciedi": {
        source: "iana"
      },
      "application/vnd.cinderella": {
        source: "iana",
        extensions: ["cdy"]
      },
      "application/vnd.cirpack.isdn-ext": {
        source: "iana"
      },
      "application/vnd.citationstyles.style+xml": {
        source: "iana",
        compressible: true,
        extensions: ["csl"]
      },
      "application/vnd.claymore": {
        source: "iana",
        extensions: ["cla"]
      },
      "application/vnd.cloanto.rp9": {
        source: "iana",
        extensions: ["rp9"]
      },
      "application/vnd.clonk.c4group": {
        source: "iana",
        extensions: ["c4g", "c4d", "c4f", "c4p", "c4u"]
      },
      "application/vnd.cluetrust.cartomobile-config": {
        source: "iana",
        extensions: ["c11amc"]
      },
      "application/vnd.cluetrust.cartomobile-config-pkg": {
        source: "iana",
        extensions: ["c11amz"]
      },
      "application/vnd.coffeescript": {
        source: "iana"
      },
      "application/vnd.collabio.xodocuments.document": {
        source: "iana"
      },
      "application/vnd.collabio.xodocuments.document-template": {
        source: "iana"
      },
      "application/vnd.collabio.xodocuments.presentation": {
        source: "iana"
      },
      "application/vnd.collabio.xodocuments.presentation-template": {
        source: "iana"
      },
      "application/vnd.collabio.xodocuments.spreadsheet": {
        source: "iana"
      },
      "application/vnd.collabio.xodocuments.spreadsheet-template": {
        source: "iana"
      },
      "application/vnd.collection+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.collection.doc+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.collection.next+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.comicbook+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.comicbook-rar": {
        source: "iana"
      },
      "application/vnd.commerce-battelle": {
        source: "iana"
      },
      "application/vnd.commonspace": {
        source: "iana",
        extensions: ["csp"]
      },
      "application/vnd.contact.cmsg": {
        source: "iana",
        extensions: ["cdbcmsg"]
      },
      "application/vnd.coreos.ignition+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.cosmocaller": {
        source: "iana",
        extensions: ["cmc"]
      },
      "application/vnd.crick.clicker": {
        source: "iana",
        extensions: ["clkx"]
      },
      "application/vnd.crick.clicker.keyboard": {
        source: "iana",
        extensions: ["clkk"]
      },
      "application/vnd.crick.clicker.palette": {
        source: "iana",
        extensions: ["clkp"]
      },
      "application/vnd.crick.clicker.template": {
        source: "iana",
        extensions: ["clkt"]
      },
      "application/vnd.crick.clicker.wordbank": {
        source: "iana",
        extensions: ["clkw"]
      },
      "application/vnd.criticaltools.wbs+xml": {
        source: "iana",
        compressible: true,
        extensions: ["wbs"]
      },
      "application/vnd.cryptii.pipe+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.crypto-shade-file": {
        source: "iana"
      },
      "application/vnd.cryptomator.encrypted": {
        source: "iana"
      },
      "application/vnd.cryptomator.vault": {
        source: "iana"
      },
      "application/vnd.ctc-posml": {
        source: "iana",
        extensions: ["pml"]
      },
      "application/vnd.ctct.ws+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.cups-pdf": {
        source: "iana"
      },
      "application/vnd.cups-postscript": {
        source: "iana"
      },
      "application/vnd.cups-ppd": {
        source: "iana",
        extensions: ["ppd"]
      },
      "application/vnd.cups-raster": {
        source: "iana"
      },
      "application/vnd.cups-raw": {
        source: "iana"
      },
      "application/vnd.curl": {
        source: "iana"
      },
      "application/vnd.curl.car": {
        source: "apache",
        extensions: ["car"]
      },
      "application/vnd.curl.pcurl": {
        source: "apache",
        extensions: ["pcurl"]
      },
      "application/vnd.cyan.dean.root+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.cybank": {
        source: "iana"
      },
      "application/vnd.cyclonedx+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.cyclonedx+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.d2l.coursepackage1p0+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.d3m-dataset": {
        source: "iana"
      },
      "application/vnd.d3m-problem": {
        source: "iana"
      },
      "application/vnd.dart": {
        source: "iana",
        compressible: true,
        extensions: ["dart"]
      },
      "application/vnd.data-vision.rdz": {
        source: "iana",
        extensions: ["rdz"]
      },
      "application/vnd.datapackage+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dataresource+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dbf": {
        source: "iana",
        extensions: ["dbf"]
      },
      "application/vnd.debian.binary-package": {
        source: "iana"
      },
      "application/vnd.dece.data": {
        source: "iana",
        extensions: ["uvf", "uvvf", "uvd", "uvvd"]
      },
      "application/vnd.dece.ttml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["uvt", "uvvt"]
      },
      "application/vnd.dece.unspecified": {
        source: "iana",
        extensions: ["uvx", "uvvx"]
      },
      "application/vnd.dece.zip": {
        source: "iana",
        extensions: ["uvz", "uvvz"]
      },
      "application/vnd.denovo.fcselayout-link": {
        source: "iana",
        extensions: ["fe_launch"]
      },
      "application/vnd.desmume.movie": {
        source: "iana"
      },
      "application/vnd.dir-bi.plate-dl-nosuffix": {
        source: "iana"
      },
      "application/vnd.dm.delegation+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dna": {
        source: "iana",
        extensions: ["dna"]
      },
      "application/vnd.document+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dolby.mlp": {
        source: "apache",
        extensions: ["mlp"]
      },
      "application/vnd.dolby.mobile.1": {
        source: "iana"
      },
      "application/vnd.dolby.mobile.2": {
        source: "iana"
      },
      "application/vnd.doremir.scorecloud-binary-document": {
        source: "iana"
      },
      "application/vnd.dpgraph": {
        source: "iana",
        extensions: ["dpg"]
      },
      "application/vnd.dreamfactory": {
        source: "iana",
        extensions: ["dfac"]
      },
      "application/vnd.drive+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ds-keypoint": {
        source: "apache",
        extensions: ["kpxx"]
      },
      "application/vnd.dtg.local": {
        source: "iana"
      },
      "application/vnd.dtg.local.flash": {
        source: "iana"
      },
      "application/vnd.dtg.local.html": {
        source: "iana"
      },
      "application/vnd.dvb.ait": {
        source: "iana",
        extensions: ["ait"]
      },
      "application/vnd.dvb.dvbisl+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dvb.dvbj": {
        source: "iana"
      },
      "application/vnd.dvb.esgcontainer": {
        source: "iana"
      },
      "application/vnd.dvb.ipdcdftnotifaccess": {
        source: "iana"
      },
      "application/vnd.dvb.ipdcesgaccess": {
        source: "iana"
      },
      "application/vnd.dvb.ipdcesgaccess2": {
        source: "iana"
      },
      "application/vnd.dvb.ipdcesgpdd": {
        source: "iana"
      },
      "application/vnd.dvb.ipdcroaming": {
        source: "iana"
      },
      "application/vnd.dvb.iptv.alfec-base": {
        source: "iana"
      },
      "application/vnd.dvb.iptv.alfec-enhancement": {
        source: "iana"
      },
      "application/vnd.dvb.notif-aggregate-root+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dvb.notif-container+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dvb.notif-generic+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dvb.notif-ia-msglist+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dvb.notif-ia-registration-request+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dvb.notif-ia-registration-response+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dvb.notif-init+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dvb.pfr": {
        source: "iana"
      },
      "application/vnd.dvb.service": {
        source: "iana",
        extensions: ["svc"]
      },
      "application/vnd.dxr": {
        source: "iana"
      },
      "application/vnd.dynageo": {
        source: "iana",
        extensions: ["geo"]
      },
      "application/vnd.dzr": {
        source: "iana"
      },
      "application/vnd.easykaraoke.cdgdownload": {
        source: "iana"
      },
      "application/vnd.ecdis-update": {
        source: "iana"
      },
      "application/vnd.ecip.rlp": {
        source: "iana"
      },
      "application/vnd.eclipse.ditto+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ecowin.chart": {
        source: "iana",
        extensions: ["mag"]
      },
      "application/vnd.ecowin.filerequest": {
        source: "iana"
      },
      "application/vnd.ecowin.fileupdate": {
        source: "iana"
      },
      "application/vnd.ecowin.series": {
        source: "iana"
      },
      "application/vnd.ecowin.seriesrequest": {
        source: "iana"
      },
      "application/vnd.ecowin.seriesupdate": {
        source: "iana"
      },
      "application/vnd.efi.img": {
        source: "iana"
      },
      "application/vnd.efi.iso": {
        source: "iana"
      },
      "application/vnd.emclient.accessrequest+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.enliven": {
        source: "iana",
        extensions: ["nml"]
      },
      "application/vnd.enphase.envoy": {
        source: "iana"
      },
      "application/vnd.eprints.data+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.epson.esf": {
        source: "iana",
        extensions: ["esf"]
      },
      "application/vnd.epson.msf": {
        source: "iana",
        extensions: ["msf"]
      },
      "application/vnd.epson.quickanime": {
        source: "iana",
        extensions: ["qam"]
      },
      "application/vnd.epson.salt": {
        source: "iana",
        extensions: ["slt"]
      },
      "application/vnd.epson.ssf": {
        source: "iana",
        extensions: ["ssf"]
      },
      "application/vnd.ericsson.quickcall": {
        source: "iana"
      },
      "application/vnd.espass-espass+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.eszigno3+xml": {
        source: "iana",
        compressible: true,
        extensions: ["es3", "et3"]
      },
      "application/vnd.etsi.aoc+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.asic-e+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.etsi.asic-s+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.etsi.cug+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.iptvcommand+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.iptvdiscovery+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.iptvprofile+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.iptvsad-bc+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.iptvsad-cod+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.iptvsad-npvr+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.iptvservice+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.iptvsync+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.iptvueprofile+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.mcid+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.mheg5": {
        source: "iana"
      },
      "application/vnd.etsi.overload-control-policy-dataset+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.pstn+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.sci+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.simservs+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.timestamp-token": {
        source: "iana"
      },
      "application/vnd.etsi.tsl+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.tsl.der": {
        source: "iana"
      },
      "application/vnd.eu.kasparian.car+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.eudora.data": {
        source: "iana"
      },
      "application/vnd.evolv.ecig.profile": {
        source: "iana"
      },
      "application/vnd.evolv.ecig.settings": {
        source: "iana"
      },
      "application/vnd.evolv.ecig.theme": {
        source: "iana"
      },
      "application/vnd.exstream-empower+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.exstream-package": {
        source: "iana"
      },
      "application/vnd.ezpix-album": {
        source: "iana",
        extensions: ["ez2"]
      },
      "application/vnd.ezpix-package": {
        source: "iana",
        extensions: ["ez3"]
      },
      "application/vnd.f-secure.mobile": {
        source: "iana"
      },
      "application/vnd.familysearch.gedcom+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.fastcopy-disk-image": {
        source: "iana"
      },
      "application/vnd.fdf": {
        source: "iana",
        extensions: ["fdf"]
      },
      "application/vnd.fdsn.mseed": {
        source: "iana",
        extensions: ["mseed"]
      },
      "application/vnd.fdsn.seed": {
        source: "iana",
        extensions: ["seed", "dataless"]
      },
      "application/vnd.ffsns": {
        source: "iana"
      },
      "application/vnd.ficlab.flb+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.filmit.zfc": {
        source: "iana"
      },
      "application/vnd.fints": {
        source: "iana"
      },
      "application/vnd.firemonkeys.cloudcell": {
        source: "iana"
      },
      "application/vnd.flographit": {
        source: "iana",
        extensions: ["gph"]
      },
      "application/vnd.fluxtime.clip": {
        source: "iana",
        extensions: ["ftc"]
      },
      "application/vnd.font-fontforge-sfd": {
        source: "iana"
      },
      "application/vnd.framemaker": {
        source: "iana",
        extensions: ["fm", "frame", "maker", "book"]
      },
      "application/vnd.frogans.fnc": {
        source: "iana",
        extensions: ["fnc"]
      },
      "application/vnd.frogans.ltf": {
        source: "iana",
        extensions: ["ltf"]
      },
      "application/vnd.fsc.weblaunch": {
        source: "iana",
        extensions: ["fsc"]
      },
      "application/vnd.fujifilm.fb.docuworks": {
        source: "iana"
      },
      "application/vnd.fujifilm.fb.docuworks.binder": {
        source: "iana"
      },
      "application/vnd.fujifilm.fb.docuworks.container": {
        source: "iana"
      },
      "application/vnd.fujifilm.fb.jfi+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.fujitsu.oasys": {
        source: "iana",
        extensions: ["oas"]
      },
      "application/vnd.fujitsu.oasys2": {
        source: "iana",
        extensions: ["oa2"]
      },
      "application/vnd.fujitsu.oasys3": {
        source: "iana",
        extensions: ["oa3"]
      },
      "application/vnd.fujitsu.oasysgp": {
        source: "iana",
        extensions: ["fg5"]
      },
      "application/vnd.fujitsu.oasysprs": {
        source: "iana",
        extensions: ["bh2"]
      },
      "application/vnd.fujixerox.art-ex": {
        source: "iana"
      },
      "application/vnd.fujixerox.art4": {
        source: "iana"
      },
      "application/vnd.fujixerox.ddd": {
        source: "iana",
        extensions: ["ddd"]
      },
      "application/vnd.fujixerox.docuworks": {
        source: "iana",
        extensions: ["xdw"]
      },
      "application/vnd.fujixerox.docuworks.binder": {
        source: "iana",
        extensions: ["xbd"]
      },
      "application/vnd.fujixerox.docuworks.container": {
        source: "iana"
      },
      "application/vnd.fujixerox.hbpl": {
        source: "iana"
      },
      "application/vnd.fut-misnet": {
        source: "iana"
      },
      "application/vnd.futoin+cbor": {
        source: "iana"
      },
      "application/vnd.futoin+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.fuzzysheet": {
        source: "iana",
        extensions: ["fzs"]
      },
      "application/vnd.genomatix.tuxedo": {
        source: "iana",
        extensions: ["txd"]
      },
      "application/vnd.gentics.grd+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.geo+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.geocube+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.geogebra.file": {
        source: "iana",
        extensions: ["ggb"]
      },
      "application/vnd.geogebra.slides": {
        source: "iana"
      },
      "application/vnd.geogebra.tool": {
        source: "iana",
        extensions: ["ggt"]
      },
      "application/vnd.geometry-explorer": {
        source: "iana",
        extensions: ["gex", "gre"]
      },
      "application/vnd.geonext": {
        source: "iana",
        extensions: ["gxt"]
      },
      "application/vnd.geoplan": {
        source: "iana",
        extensions: ["g2w"]
      },
      "application/vnd.geospace": {
        source: "iana",
        extensions: ["g3w"]
      },
      "application/vnd.gerber": {
        source: "iana"
      },
      "application/vnd.globalplatform.card-content-mgt": {
        source: "iana"
      },
      "application/vnd.globalplatform.card-content-mgt-response": {
        source: "iana"
      },
      "application/vnd.gmx": {
        source: "iana",
        extensions: ["gmx"]
      },
      "application/vnd.google-apps.document": {
        compressible: false,
        extensions: ["gdoc"]
      },
      "application/vnd.google-apps.presentation": {
        compressible: false,
        extensions: ["gslides"]
      },
      "application/vnd.google-apps.spreadsheet": {
        compressible: false,
        extensions: ["gsheet"]
      },
      "application/vnd.google-earth.kml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["kml"]
      },
      "application/vnd.google-earth.kmz": {
        source: "iana",
        compressible: false,
        extensions: ["kmz"]
      },
      "application/vnd.gov.sk.e-form+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.gov.sk.e-form+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.gov.sk.xmldatacontainer+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.grafeq": {
        source: "iana",
        extensions: ["gqf", "gqs"]
      },
      "application/vnd.gridmp": {
        source: "iana"
      },
      "application/vnd.groove-account": {
        source: "iana",
        extensions: ["gac"]
      },
      "application/vnd.groove-help": {
        source: "iana",
        extensions: ["ghf"]
      },
      "application/vnd.groove-identity-message": {
        source: "iana",
        extensions: ["gim"]
      },
      "application/vnd.groove-injector": {
        source: "iana",
        extensions: ["grv"]
      },
      "application/vnd.groove-tool-message": {
        source: "iana",
        extensions: ["gtm"]
      },
      "application/vnd.groove-tool-template": {
        source: "iana",
        extensions: ["tpl"]
      },
      "application/vnd.groove-vcard": {
        source: "iana",
        extensions: ["vcg"]
      },
      "application/vnd.hal+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.hal+xml": {
        source: "iana",
        compressible: true,
        extensions: ["hal"]
      },
      "application/vnd.handheld-entertainment+xml": {
        source: "iana",
        compressible: true,
        extensions: ["zmm"]
      },
      "application/vnd.hbci": {
        source: "iana",
        extensions: ["hbci"]
      },
      "application/vnd.hc+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.hcl-bireports": {
        source: "iana"
      },
      "application/vnd.hdt": {
        source: "iana"
      },
      "application/vnd.heroku+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.hhe.lesson-player": {
        source: "iana",
        extensions: ["les"]
      },
      "application/vnd.hl7cda+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/vnd.hl7v2+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/vnd.hp-hpgl": {
        source: "iana",
        extensions: ["hpgl"]
      },
      "application/vnd.hp-hpid": {
        source: "iana",
        extensions: ["hpid"]
      },
      "application/vnd.hp-hps": {
        source: "iana",
        extensions: ["hps"]
      },
      "application/vnd.hp-jlyt": {
        source: "iana",
        extensions: ["jlt"]
      },
      "application/vnd.hp-pcl": {
        source: "iana",
        extensions: ["pcl"]
      },
      "application/vnd.hp-pclxl": {
        source: "iana",
        extensions: ["pclxl"]
      },
      "application/vnd.httphone": {
        source: "iana"
      },
      "application/vnd.hydrostatix.sof-data": {
        source: "iana",
        extensions: ["sfd-hdstx"]
      },
      "application/vnd.hyper+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.hyper-item+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.hyperdrive+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.hzn-3d-crossword": {
        source: "iana"
      },
      "application/vnd.ibm.afplinedata": {
        source: "iana"
      },
      "application/vnd.ibm.electronic-media": {
        source: "iana"
      },
      "application/vnd.ibm.minipay": {
        source: "iana",
        extensions: ["mpy"]
      },
      "application/vnd.ibm.modcap": {
        source: "iana",
        extensions: ["afp", "listafp", "list3820"]
      },
      "application/vnd.ibm.rights-management": {
        source: "iana",
        extensions: ["irm"]
      },
      "application/vnd.ibm.secure-container": {
        source: "iana",
        extensions: ["sc"]
      },
      "application/vnd.iccprofile": {
        source: "iana",
        extensions: ["icc", "icm"]
      },
      "application/vnd.ieee.1905": {
        source: "iana"
      },
      "application/vnd.igloader": {
        source: "iana",
        extensions: ["igl"]
      },
      "application/vnd.imagemeter.folder+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.imagemeter.image+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.immervision-ivp": {
        source: "iana",
        extensions: ["ivp"]
      },
      "application/vnd.immervision-ivu": {
        source: "iana",
        extensions: ["ivu"]
      },
      "application/vnd.ims.imsccv1p1": {
        source: "iana"
      },
      "application/vnd.ims.imsccv1p2": {
        source: "iana"
      },
      "application/vnd.ims.imsccv1p3": {
        source: "iana"
      },
      "application/vnd.ims.lis.v2.result+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ims.lti.v2.toolconsumerprofile+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ims.lti.v2.toolproxy+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ims.lti.v2.toolproxy.id+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ims.lti.v2.toolsettings+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ims.lti.v2.toolsettings.simple+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.informedcontrol.rms+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.informix-visionary": {
        source: "iana"
      },
      "application/vnd.infotech.project": {
        source: "iana"
      },
      "application/vnd.infotech.project+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.innopath.wamp.notification": {
        source: "iana"
      },
      "application/vnd.insors.igm": {
        source: "iana",
        extensions: ["igm"]
      },
      "application/vnd.intercon.formnet": {
        source: "iana",
        extensions: ["xpw", "xpx"]
      },
      "application/vnd.intergeo": {
        source: "iana",
        extensions: ["i2g"]
      },
      "application/vnd.intertrust.digibox": {
        source: "iana"
      },
      "application/vnd.intertrust.nncp": {
        source: "iana"
      },
      "application/vnd.intu.qbo": {
        source: "iana",
        extensions: ["qbo"]
      },
      "application/vnd.intu.qfx": {
        source: "iana",
        extensions: ["qfx"]
      },
      "application/vnd.iptc.g2.catalogitem+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.iptc.g2.conceptitem+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.iptc.g2.knowledgeitem+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.iptc.g2.newsitem+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.iptc.g2.newsmessage+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.iptc.g2.packageitem+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.iptc.g2.planningitem+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ipunplugged.rcprofile": {
        source: "iana",
        extensions: ["rcprofile"]
      },
      "application/vnd.irepository.package+xml": {
        source: "iana",
        compressible: true,
        extensions: ["irp"]
      },
      "application/vnd.is-xpr": {
        source: "iana",
        extensions: ["xpr"]
      },
      "application/vnd.isac.fcs": {
        source: "iana",
        extensions: ["fcs"]
      },
      "application/vnd.iso11783-10+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.jam": {
        source: "iana",
        extensions: ["jam"]
      },
      "application/vnd.japannet-directory-service": {
        source: "iana"
      },
      "application/vnd.japannet-jpnstore-wakeup": {
        source: "iana"
      },
      "application/vnd.japannet-payment-wakeup": {
        source: "iana"
      },
      "application/vnd.japannet-registration": {
        source: "iana"
      },
      "application/vnd.japannet-registration-wakeup": {
        source: "iana"
      },
      "application/vnd.japannet-setstore-wakeup": {
        source: "iana"
      },
      "application/vnd.japannet-verification": {
        source: "iana"
      },
      "application/vnd.japannet-verification-wakeup": {
        source: "iana"
      },
      "application/vnd.jcp.javame.midlet-rms": {
        source: "iana",
        extensions: ["rms"]
      },
      "application/vnd.jisp": {
        source: "iana",
        extensions: ["jisp"]
      },
      "application/vnd.joost.joda-archive": {
        source: "iana",
        extensions: ["joda"]
      },
      "application/vnd.jsk.isdn-ngn": {
        source: "iana"
      },
      "application/vnd.kahootz": {
        source: "iana",
        extensions: ["ktz", "ktr"]
      },
      "application/vnd.kde.karbon": {
        source: "iana",
        extensions: ["karbon"]
      },
      "application/vnd.kde.kchart": {
        source: "iana",
        extensions: ["chrt"]
      },
      "application/vnd.kde.kformula": {
        source: "iana",
        extensions: ["kfo"]
      },
      "application/vnd.kde.kivio": {
        source: "iana",
        extensions: ["flw"]
      },
      "application/vnd.kde.kontour": {
        source: "iana",
        extensions: ["kon"]
      },
      "application/vnd.kde.kpresenter": {
        source: "iana",
        extensions: ["kpr", "kpt"]
      },
      "application/vnd.kde.kspread": {
        source: "iana",
        extensions: ["ksp"]
      },
      "application/vnd.kde.kword": {
        source: "iana",
        extensions: ["kwd", "kwt"]
      },
      "application/vnd.kenameaapp": {
        source: "iana",
        extensions: ["htke"]
      },
      "application/vnd.kidspiration": {
        source: "iana",
        extensions: ["kia"]
      },
      "application/vnd.kinar": {
        source: "iana",
        extensions: ["kne", "knp"]
      },
      "application/vnd.koan": {
        source: "iana",
        extensions: ["skp", "skd", "skt", "skm"]
      },
      "application/vnd.kodak-descriptor": {
        source: "iana",
        extensions: ["sse"]
      },
      "application/vnd.las": {
        source: "iana"
      },
      "application/vnd.las.las+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.las.las+xml": {
        source: "iana",
        compressible: true,
        extensions: ["lasxml"]
      },
      "application/vnd.laszip": {
        source: "iana"
      },
      "application/vnd.leap+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.liberty-request+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.llamagraphics.life-balance.desktop": {
        source: "iana",
        extensions: ["lbd"]
      },
      "application/vnd.llamagraphics.life-balance.exchange+xml": {
        source: "iana",
        compressible: true,
        extensions: ["lbe"]
      },
      "application/vnd.logipipe.circuit+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.loom": {
        source: "iana"
      },
      "application/vnd.lotus-1-2-3": {
        source: "iana",
        extensions: ["123"]
      },
      "application/vnd.lotus-approach": {
        source: "iana",
        extensions: ["apr"]
      },
      "application/vnd.lotus-freelance": {
        source: "iana",
        extensions: ["pre"]
      },
      "application/vnd.lotus-notes": {
        source: "iana",
        extensions: ["nsf"]
      },
      "application/vnd.lotus-organizer": {
        source: "iana",
        extensions: ["org"]
      },
      "application/vnd.lotus-screencam": {
        source: "iana",
        extensions: ["scm"]
      },
      "application/vnd.lotus-wordpro": {
        source: "iana",
        extensions: ["lwp"]
      },
      "application/vnd.macports.portpkg": {
        source: "iana",
        extensions: ["portpkg"]
      },
      "application/vnd.mapbox-vector-tile": {
        source: "iana",
        extensions: ["mvt"]
      },
      "application/vnd.marlin.drm.actiontoken+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.marlin.drm.conftoken+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.marlin.drm.license+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.marlin.drm.mdcf": {
        source: "iana"
      },
      "application/vnd.mason+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.maxar.archive.3tz+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.maxmind.maxmind-db": {
        source: "iana"
      },
      "application/vnd.mcd": {
        source: "iana",
        extensions: ["mcd"]
      },
      "application/vnd.medcalcdata": {
        source: "iana",
        extensions: ["mc1"]
      },
      "application/vnd.mediastation.cdkey": {
        source: "iana",
        extensions: ["cdkey"]
      },
      "application/vnd.meridian-slingshot": {
        source: "iana"
      },
      "application/vnd.mfer": {
        source: "iana",
        extensions: ["mwf"]
      },
      "application/vnd.mfmp": {
        source: "iana",
        extensions: ["mfm"]
      },
      "application/vnd.micro+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.micrografx.flo": {
        source: "iana",
        extensions: ["flo"]
      },
      "application/vnd.micrografx.igx": {
        source: "iana",
        extensions: ["igx"]
      },
      "application/vnd.microsoft.portable-executable": {
        source: "iana"
      },
      "application/vnd.microsoft.windows.thumbnail-cache": {
        source: "iana"
      },
      "application/vnd.miele+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.mif": {
        source: "iana",
        extensions: ["mif"]
      },
      "application/vnd.minisoft-hp3000-save": {
        source: "iana"
      },
      "application/vnd.mitsubishi.misty-guard.trustweb": {
        source: "iana"
      },
      "application/vnd.mobius.daf": {
        source: "iana",
        extensions: ["daf"]
      },
      "application/vnd.mobius.dis": {
        source: "iana",
        extensions: ["dis"]
      },
      "application/vnd.mobius.mbk": {
        source: "iana",
        extensions: ["mbk"]
      },
      "application/vnd.mobius.mqy": {
        source: "iana",
        extensions: ["mqy"]
      },
      "application/vnd.mobius.msl": {
        source: "iana",
        extensions: ["msl"]
      },
      "application/vnd.mobius.plc": {
        source: "iana",
        extensions: ["plc"]
      },
      "application/vnd.mobius.txf": {
        source: "iana",
        extensions: ["txf"]
      },
      "application/vnd.mophun.application": {
        source: "iana",
        extensions: ["mpn"]
      },
      "application/vnd.mophun.certificate": {
        source: "iana",
        extensions: ["mpc"]
      },
      "application/vnd.motorola.flexsuite": {
        source: "iana"
      },
      "application/vnd.motorola.flexsuite.adsi": {
        source: "iana"
      },
      "application/vnd.motorola.flexsuite.fis": {
        source: "iana"
      },
      "application/vnd.motorola.flexsuite.gotap": {
        source: "iana"
      },
      "application/vnd.motorola.flexsuite.kmr": {
        source: "iana"
      },
      "application/vnd.motorola.flexsuite.ttc": {
        source: "iana"
      },
      "application/vnd.motorola.flexsuite.wem": {
        source: "iana"
      },
      "application/vnd.motorola.iprm": {
        source: "iana"
      },
      "application/vnd.mozilla.xul+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xul"]
      },
      "application/vnd.ms-3mfdocument": {
        source: "iana"
      },
      "application/vnd.ms-artgalry": {
        source: "iana",
        extensions: ["cil"]
      },
      "application/vnd.ms-asf": {
        source: "iana"
      },
      "application/vnd.ms-cab-compressed": {
        source: "iana",
        extensions: ["cab"]
      },
      "application/vnd.ms-color.iccprofile": {
        source: "apache"
      },
      "application/vnd.ms-excel": {
        source: "iana",
        compressible: false,
        extensions: ["xls", "xlm", "xla", "xlc", "xlt", "xlw"]
      },
      "application/vnd.ms-excel.addin.macroenabled.12": {
        source: "iana",
        extensions: ["xlam"]
      },
      "application/vnd.ms-excel.sheet.binary.macroenabled.12": {
        source: "iana",
        extensions: ["xlsb"]
      },
      "application/vnd.ms-excel.sheet.macroenabled.12": {
        source: "iana",
        extensions: ["xlsm"]
      },
      "application/vnd.ms-excel.template.macroenabled.12": {
        source: "iana",
        extensions: ["xltm"]
      },
      "application/vnd.ms-fontobject": {
        source: "iana",
        compressible: true,
        extensions: ["eot"]
      },
      "application/vnd.ms-htmlhelp": {
        source: "iana",
        extensions: ["chm"]
      },
      "application/vnd.ms-ims": {
        source: "iana",
        extensions: ["ims"]
      },
      "application/vnd.ms-lrm": {
        source: "iana",
        extensions: ["lrm"]
      },
      "application/vnd.ms-office.activex+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ms-officetheme": {
        source: "iana",
        extensions: ["thmx"]
      },
      "application/vnd.ms-opentype": {
        source: "apache",
        compressible: true
      },
      "application/vnd.ms-outlook": {
        compressible: false,
        extensions: ["msg"]
      },
      "application/vnd.ms-package.obfuscated-opentype": {
        source: "apache"
      },
      "application/vnd.ms-pki.seccat": {
        source: "apache",
        extensions: ["cat"]
      },
      "application/vnd.ms-pki.stl": {
        source: "apache",
        extensions: ["stl"]
      },
      "application/vnd.ms-playready.initiator+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ms-powerpoint": {
        source: "iana",
        compressible: false,
        extensions: ["ppt", "pps", "pot"]
      },
      "application/vnd.ms-powerpoint.addin.macroenabled.12": {
        source: "iana",
        extensions: ["ppam"]
      },
      "application/vnd.ms-powerpoint.presentation.macroenabled.12": {
        source: "iana",
        extensions: ["pptm"]
      },
      "application/vnd.ms-powerpoint.slide.macroenabled.12": {
        source: "iana",
        extensions: ["sldm"]
      },
      "application/vnd.ms-powerpoint.slideshow.macroenabled.12": {
        source: "iana",
        extensions: ["ppsm"]
      },
      "application/vnd.ms-powerpoint.template.macroenabled.12": {
        source: "iana",
        extensions: ["potm"]
      },
      "application/vnd.ms-printdevicecapabilities+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ms-printing.printticket+xml": {
        source: "apache",
        compressible: true
      },
      "application/vnd.ms-printschematicket+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ms-project": {
        source: "iana",
        extensions: ["mpp", "mpt"]
      },
      "application/vnd.ms-tnef": {
        source: "iana"
      },
      "application/vnd.ms-windows.devicepairing": {
        source: "iana"
      },
      "application/vnd.ms-windows.nwprinting.oob": {
        source: "iana"
      },
      "application/vnd.ms-windows.printerpairing": {
        source: "iana"
      },
      "application/vnd.ms-windows.wsd.oob": {
        source: "iana"
      },
      "application/vnd.ms-wmdrm.lic-chlg-req": {
        source: "iana"
      },
      "application/vnd.ms-wmdrm.lic-resp": {
        source: "iana"
      },
      "application/vnd.ms-wmdrm.meter-chlg-req": {
        source: "iana"
      },
      "application/vnd.ms-wmdrm.meter-resp": {
        source: "iana"
      },
      "application/vnd.ms-word.document.macroenabled.12": {
        source: "iana",
        extensions: ["docm"]
      },
      "application/vnd.ms-word.template.macroenabled.12": {
        source: "iana",
        extensions: ["dotm"]
      },
      "application/vnd.ms-works": {
        source: "iana",
        extensions: ["wps", "wks", "wcm", "wdb"]
      },
      "application/vnd.ms-wpl": {
        source: "iana",
        extensions: ["wpl"]
      },
      "application/vnd.ms-xpsdocument": {
        source: "iana",
        compressible: false,
        extensions: ["xps"]
      },
      "application/vnd.msa-disk-image": {
        source: "iana"
      },
      "application/vnd.mseq": {
        source: "iana",
        extensions: ["mseq"]
      },
      "application/vnd.msign": {
        source: "iana"
      },
      "application/vnd.multiad.creator": {
        source: "iana"
      },
      "application/vnd.multiad.creator.cif": {
        source: "iana"
      },
      "application/vnd.music-niff": {
        source: "iana"
      },
      "application/vnd.musician": {
        source: "iana",
        extensions: ["mus"]
      },
      "application/vnd.muvee.style": {
        source: "iana",
        extensions: ["msty"]
      },
      "application/vnd.mynfc": {
        source: "iana",
        extensions: ["taglet"]
      },
      "application/vnd.nacamar.ybrid+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ncd.control": {
        source: "iana"
      },
      "application/vnd.ncd.reference": {
        source: "iana"
      },
      "application/vnd.nearst.inv+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.nebumind.line": {
        source: "iana"
      },
      "application/vnd.nervana": {
        source: "iana"
      },
      "application/vnd.netfpx": {
        source: "iana"
      },
      "application/vnd.neurolanguage.nlu": {
        source: "iana",
        extensions: ["nlu"]
      },
      "application/vnd.nimn": {
        source: "iana"
      },
      "application/vnd.nintendo.nitro.rom": {
        source: "iana"
      },
      "application/vnd.nintendo.snes.rom": {
        source: "iana"
      },
      "application/vnd.nitf": {
        source: "iana",
        extensions: ["ntf", "nitf"]
      },
      "application/vnd.noblenet-directory": {
        source: "iana",
        extensions: ["nnd"]
      },
      "application/vnd.noblenet-sealer": {
        source: "iana",
        extensions: ["nns"]
      },
      "application/vnd.noblenet-web": {
        source: "iana",
        extensions: ["nnw"]
      },
      "application/vnd.nokia.catalogs": {
        source: "iana"
      },
      "application/vnd.nokia.conml+wbxml": {
        source: "iana"
      },
      "application/vnd.nokia.conml+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.nokia.iptv.config+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.nokia.isds-radio-presets": {
        source: "iana"
      },
      "application/vnd.nokia.landmark+wbxml": {
        source: "iana"
      },
      "application/vnd.nokia.landmark+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.nokia.landmarkcollection+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.nokia.n-gage.ac+xml": {
        source: "iana",
        compressible: true,
        extensions: ["ac"]
      },
      "application/vnd.nokia.n-gage.data": {
        source: "iana",
        extensions: ["ngdat"]
      },
      "application/vnd.nokia.n-gage.symbian.install": {
        source: "iana",
        extensions: ["n-gage"]
      },
      "application/vnd.nokia.ncd": {
        source: "iana"
      },
      "application/vnd.nokia.pcd+wbxml": {
        source: "iana"
      },
      "application/vnd.nokia.pcd+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.nokia.radio-preset": {
        source: "iana",
        extensions: ["rpst"]
      },
      "application/vnd.nokia.radio-presets": {
        source: "iana",
        extensions: ["rpss"]
      },
      "application/vnd.novadigm.edm": {
        source: "iana",
        extensions: ["edm"]
      },
      "application/vnd.novadigm.edx": {
        source: "iana",
        extensions: ["edx"]
      },
      "application/vnd.novadigm.ext": {
        source: "iana",
        extensions: ["ext"]
      },
      "application/vnd.ntt-local.content-share": {
        source: "iana"
      },
      "application/vnd.ntt-local.file-transfer": {
        source: "iana"
      },
      "application/vnd.ntt-local.ogw_remote-access": {
        source: "iana"
      },
      "application/vnd.ntt-local.sip-ta_remote": {
        source: "iana"
      },
      "application/vnd.ntt-local.sip-ta_tcp_stream": {
        source: "iana"
      },
      "application/vnd.oasis.opendocument.chart": {
        source: "iana",
        extensions: ["odc"]
      },
      "application/vnd.oasis.opendocument.chart-template": {
        source: "iana",
        extensions: ["otc"]
      },
      "application/vnd.oasis.opendocument.database": {
        source: "iana",
        extensions: ["odb"]
      },
      "application/vnd.oasis.opendocument.formula": {
        source: "iana",
        extensions: ["odf"]
      },
      "application/vnd.oasis.opendocument.formula-template": {
        source: "iana",
        extensions: ["odft"]
      },
      "application/vnd.oasis.opendocument.graphics": {
        source: "iana",
        compressible: false,
        extensions: ["odg"]
      },
      "application/vnd.oasis.opendocument.graphics-template": {
        source: "iana",
        extensions: ["otg"]
      },
      "application/vnd.oasis.opendocument.image": {
        source: "iana",
        extensions: ["odi"]
      },
      "application/vnd.oasis.opendocument.image-template": {
        source: "iana",
        extensions: ["oti"]
      },
      "application/vnd.oasis.opendocument.presentation": {
        source: "iana",
        compressible: false,
        extensions: ["odp"]
      },
      "application/vnd.oasis.opendocument.presentation-template": {
        source: "iana",
        extensions: ["otp"]
      },
      "application/vnd.oasis.opendocument.spreadsheet": {
        source: "iana",
        compressible: false,
        extensions: ["ods"]
      },
      "application/vnd.oasis.opendocument.spreadsheet-template": {
        source: "iana",
        extensions: ["ots"]
      },
      "application/vnd.oasis.opendocument.text": {
        source: "iana",
        compressible: false,
        extensions: ["odt"]
      },
      "application/vnd.oasis.opendocument.text-master": {
        source: "iana",
        extensions: ["odm"]
      },
      "application/vnd.oasis.opendocument.text-template": {
        source: "iana",
        extensions: ["ott"]
      },
      "application/vnd.oasis.opendocument.text-web": {
        source: "iana",
        extensions: ["oth"]
      },
      "application/vnd.obn": {
        source: "iana"
      },
      "application/vnd.ocf+cbor": {
        source: "iana"
      },
      "application/vnd.oci.image.manifest.v1+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oftn.l10n+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oipf.contentaccessdownload+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oipf.contentaccessstreaming+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oipf.cspg-hexbinary": {
        source: "iana"
      },
      "application/vnd.oipf.dae.svg+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oipf.dae.xhtml+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oipf.mippvcontrolmessage+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oipf.pae.gem": {
        source: "iana"
      },
      "application/vnd.oipf.spdiscovery+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oipf.spdlist+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oipf.ueprofile+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oipf.userprofile+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.olpc-sugar": {
        source: "iana",
        extensions: ["xo"]
      },
      "application/vnd.oma-scws-config": {
        source: "iana"
      },
      "application/vnd.oma-scws-http-request": {
        source: "iana"
      },
      "application/vnd.oma-scws-http-response": {
        source: "iana"
      },
      "application/vnd.oma.bcast.associated-procedure-parameter+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.bcast.drm-trigger+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.bcast.imd+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.bcast.ltkm": {
        source: "iana"
      },
      "application/vnd.oma.bcast.notification+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.bcast.provisioningtrigger": {
        source: "iana"
      },
      "application/vnd.oma.bcast.sgboot": {
        source: "iana"
      },
      "application/vnd.oma.bcast.sgdd+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.bcast.sgdu": {
        source: "iana"
      },
      "application/vnd.oma.bcast.simple-symbol-container": {
        source: "iana"
      },
      "application/vnd.oma.bcast.smartcard-trigger+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.bcast.sprov+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.bcast.stkm": {
        source: "iana"
      },
      "application/vnd.oma.cab-address-book+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.cab-feature-handler+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.cab-pcc+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.cab-subs-invite+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.cab-user-prefs+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.dcd": {
        source: "iana"
      },
      "application/vnd.oma.dcdc": {
        source: "iana"
      },
      "application/vnd.oma.dd2+xml": {
        source: "iana",
        compressible: true,
        extensions: ["dd2"]
      },
      "application/vnd.oma.drm.risd+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.group-usage-list+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.lwm2m+cbor": {
        source: "iana"
      },
      "application/vnd.oma.lwm2m+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.lwm2m+tlv": {
        source: "iana"
      },
      "application/vnd.oma.pal+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.poc.detailed-progress-report+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.poc.final-report+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.poc.groups+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.poc.invocation-descriptor+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.poc.optimized-progress-report+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.push": {
        source: "iana"
      },
      "application/vnd.oma.scidm.messages+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.xcap-directory+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.omads-email+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/vnd.omads-file+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/vnd.omads-folder+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/vnd.omaloc-supl-init": {
        source: "iana"
      },
      "application/vnd.onepager": {
        source: "iana"
      },
      "application/vnd.onepagertamp": {
        source: "iana"
      },
      "application/vnd.onepagertamx": {
        source: "iana"
      },
      "application/vnd.onepagertat": {
        source: "iana"
      },
      "application/vnd.onepagertatp": {
        source: "iana"
      },
      "application/vnd.onepagertatx": {
        source: "iana"
      },
      "application/vnd.openblox.game+xml": {
        source: "iana",
        compressible: true,
        extensions: ["obgx"]
      },
      "application/vnd.openblox.game-binary": {
        source: "iana"
      },
      "application/vnd.openeye.oeb": {
        source: "iana"
      },
      "application/vnd.openofficeorg.extension": {
        source: "apache",
        extensions: ["oxt"]
      },
      "application/vnd.openstreetmap.data+xml": {
        source: "iana",
        compressible: true,
        extensions: ["osm"]
      },
      "application/vnd.opentimestamps.ots": {
        source: "iana"
      },
      "application/vnd.openxmlformats-officedocument.custom-properties+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.customxmlproperties+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.drawing+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.drawingml.chart+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.drawingml.chartshapes+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.drawingml.diagramcolors+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.drawingml.diagramdata+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.drawingml.diagramlayout+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.drawingml.diagramstyle+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.extended-properties+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.commentauthors+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.comments+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.handoutmaster+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.notesmaster+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.notesslide+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.presentation": {
        source: "iana",
        compressible: false,
        extensions: ["pptx"]
      },
      "application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.presprops+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.slide": {
        source: "iana",
        extensions: ["sldx"]
      },
      "application/vnd.openxmlformats-officedocument.presentationml.slide+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.slidelayout+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.slidemaster+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.slideshow": {
        source: "iana",
        extensions: ["ppsx"]
      },
      "application/vnd.openxmlformats-officedocument.presentationml.slideshow.main+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.slideupdateinfo+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.tablestyles+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.tags+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.template": {
        source: "iana",
        extensions: ["potx"]
      },
      "application/vnd.openxmlformats-officedocument.presentationml.template.main+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.viewprops+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.calcchain+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.chartsheet+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.comments+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.connections+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.dialogsheet+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.externallink+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcachedefinition+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcacherecords+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.pivottable+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.querytable+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.revisionheaders+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.revisionlog+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sharedstrings+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": {
        source: "iana",
        compressible: false,
        extensions: ["xlsx"]
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheetmetadata+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.table+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.tablesinglecells+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.template": {
        source: "iana",
        extensions: ["xltx"]
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.template.main+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.usernames+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.volatiledependencies+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.theme+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.themeoverride+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.vmldrawing": {
        source: "iana"
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.comments+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
        source: "iana",
        compressible: false,
        extensions: ["docx"]
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document.glossary+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.endnotes+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.fonttable+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.footnotes+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.template": {
        source: "iana",
        extensions: ["dotx"]
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.template.main+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.websettings+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-package.core-properties+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-package.digital-signature-xmlsignature+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-package.relationships+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oracle.resource+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.orange.indata": {
        source: "iana"
      },
      "application/vnd.osa.netdeploy": {
        source: "iana"
      },
      "application/vnd.osgeo.mapguide.package": {
        source: "iana",
        extensions: ["mgp"]
      },
      "application/vnd.osgi.bundle": {
        source: "iana"
      },
      "application/vnd.osgi.dp": {
        source: "iana",
        extensions: ["dp"]
      },
      "application/vnd.osgi.subsystem": {
        source: "iana",
        extensions: ["esa"]
      },
      "application/vnd.otps.ct-kip+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oxli.countgraph": {
        source: "iana"
      },
      "application/vnd.pagerduty+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.palm": {
        source: "iana",
        extensions: ["pdb", "pqa", "oprc"]
      },
      "application/vnd.panoply": {
        source: "iana"
      },
      "application/vnd.paos.xml": {
        source: "iana"
      },
      "application/vnd.patentdive": {
        source: "iana"
      },
      "application/vnd.patientecommsdoc": {
        source: "iana"
      },
      "application/vnd.pawaafile": {
        source: "iana",
        extensions: ["paw"]
      },
      "application/vnd.pcos": {
        source: "iana"
      },
      "application/vnd.pg.format": {
        source: "iana",
        extensions: ["str"]
      },
      "application/vnd.pg.osasli": {
        source: "iana",
        extensions: ["ei6"]
      },
      "application/vnd.piaccess.application-licence": {
        source: "iana"
      },
      "application/vnd.picsel": {
        source: "iana",
        extensions: ["efif"]
      },
      "application/vnd.pmi.widget": {
        source: "iana",
        extensions: ["wg"]
      },
      "application/vnd.poc.group-advertisement+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.pocketlearn": {
        source: "iana",
        extensions: ["plf"]
      },
      "application/vnd.powerbuilder6": {
        source: "iana",
        extensions: ["pbd"]
      },
      "application/vnd.powerbuilder6-s": {
        source: "iana"
      },
      "application/vnd.powerbuilder7": {
        source: "iana"
      },
      "application/vnd.powerbuilder7-s": {
        source: "iana"
      },
      "application/vnd.powerbuilder75": {
        source: "iana"
      },
      "application/vnd.powerbuilder75-s": {
        source: "iana"
      },
      "application/vnd.preminet": {
        source: "iana"
      },
      "application/vnd.previewsystems.box": {
        source: "iana",
        extensions: ["box"]
      },
      "application/vnd.proteus.magazine": {
        source: "iana",
        extensions: ["mgz"]
      },
      "application/vnd.psfs": {
        source: "iana"
      },
      "application/vnd.publishare-delta-tree": {
        source: "iana",
        extensions: ["qps"]
      },
      "application/vnd.pvi.ptid1": {
        source: "iana",
        extensions: ["ptid"]
      },
      "application/vnd.pwg-multiplexed": {
        source: "iana"
      },
      "application/vnd.pwg-xhtml-print+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.qualcomm.brew-app-res": {
        source: "iana"
      },
      "application/vnd.quarantainenet": {
        source: "iana"
      },
      "application/vnd.quark.quarkxpress": {
        source: "iana",
        extensions: ["qxd", "qxt", "qwd", "qwt", "qxl", "qxb"]
      },
      "application/vnd.quobject-quoxdocument": {
        source: "iana"
      },
      "application/vnd.radisys.moml+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-audit+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-audit-conf+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-audit-conn+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-audit-dialog+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-audit-stream+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-conf+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-dialog+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-dialog-base+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-dialog-fax-detect+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-dialog-fax-sendrecv+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-dialog-group+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-dialog-speech+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-dialog-transform+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.rainstor.data": {
        source: "iana"
      },
      "application/vnd.rapid": {
        source: "iana"
      },
      "application/vnd.rar": {
        source: "iana",
        extensions: ["rar"]
      },
      "application/vnd.realvnc.bed": {
        source: "iana",
        extensions: ["bed"]
      },
      "application/vnd.recordare.musicxml": {
        source: "iana",
        extensions: ["mxl"]
      },
      "application/vnd.recordare.musicxml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["musicxml"]
      },
      "application/vnd.renlearn.rlprint": {
        source: "iana"
      },
      "application/vnd.resilient.logic": {
        source: "iana"
      },
      "application/vnd.restful+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.rig.cryptonote": {
        source: "iana",
        extensions: ["cryptonote"]
      },
      "application/vnd.rim.cod": {
        source: "apache",
        extensions: ["cod"]
      },
      "application/vnd.rn-realmedia": {
        source: "apache",
        extensions: ["rm"]
      },
      "application/vnd.rn-realmedia-vbr": {
        source: "apache",
        extensions: ["rmvb"]
      },
      "application/vnd.route66.link66+xml": {
        source: "iana",
        compressible: true,
        extensions: ["link66"]
      },
      "application/vnd.rs-274x": {
        source: "iana"
      },
      "application/vnd.ruckus.download": {
        source: "iana"
      },
      "application/vnd.s3sms": {
        source: "iana"
      },
      "application/vnd.sailingtracker.track": {
        source: "iana",
        extensions: ["st"]
      },
      "application/vnd.sar": {
        source: "iana"
      },
      "application/vnd.sbm.cid": {
        source: "iana"
      },
      "application/vnd.sbm.mid2": {
        source: "iana"
      },
      "application/vnd.scribus": {
        source: "iana"
      },
      "application/vnd.sealed.3df": {
        source: "iana"
      },
      "application/vnd.sealed.csf": {
        source: "iana"
      },
      "application/vnd.sealed.doc": {
        source: "iana"
      },
      "application/vnd.sealed.eml": {
        source: "iana"
      },
      "application/vnd.sealed.mht": {
        source: "iana"
      },
      "application/vnd.sealed.net": {
        source: "iana"
      },
      "application/vnd.sealed.ppt": {
        source: "iana"
      },
      "application/vnd.sealed.tiff": {
        source: "iana"
      },
      "application/vnd.sealed.xls": {
        source: "iana"
      },
      "application/vnd.sealedmedia.softseal.html": {
        source: "iana"
      },
      "application/vnd.sealedmedia.softseal.pdf": {
        source: "iana"
      },
      "application/vnd.seemail": {
        source: "iana",
        extensions: ["see"]
      },
      "application/vnd.seis+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.sema": {
        source: "iana",
        extensions: ["sema"]
      },
      "application/vnd.semd": {
        source: "iana",
        extensions: ["semd"]
      },
      "application/vnd.semf": {
        source: "iana",
        extensions: ["semf"]
      },
      "application/vnd.shade-save-file": {
        source: "iana"
      },
      "application/vnd.shana.informed.formdata": {
        source: "iana",
        extensions: ["ifm"]
      },
      "application/vnd.shana.informed.formtemplate": {
        source: "iana",
        extensions: ["itp"]
      },
      "application/vnd.shana.informed.interchange": {
        source: "iana",
        extensions: ["iif"]
      },
      "application/vnd.shana.informed.package": {
        source: "iana",
        extensions: ["ipk"]
      },
      "application/vnd.shootproof+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.shopkick+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.shp": {
        source: "iana"
      },
      "application/vnd.shx": {
        source: "iana"
      },
      "application/vnd.sigrok.session": {
        source: "iana"
      },
      "application/vnd.simtech-mindmapper": {
        source: "iana",
        extensions: ["twd", "twds"]
      },
      "application/vnd.siren+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.smaf": {
        source: "iana",
        extensions: ["mmf"]
      },
      "application/vnd.smart.notebook": {
        source: "iana"
      },
      "application/vnd.smart.teacher": {
        source: "iana",
        extensions: ["teacher"]
      },
      "application/vnd.snesdev-page-table": {
        source: "iana"
      },
      "application/vnd.software602.filler.form+xml": {
        source: "iana",
        compressible: true,
        extensions: ["fo"]
      },
      "application/vnd.software602.filler.form-xml-zip": {
        source: "iana"
      },
      "application/vnd.solent.sdkm+xml": {
        source: "iana",
        compressible: true,
        extensions: ["sdkm", "sdkd"]
      },
      "application/vnd.spotfire.dxp": {
        source: "iana",
        extensions: ["dxp"]
      },
      "application/vnd.spotfire.sfs": {
        source: "iana",
        extensions: ["sfs"]
      },
      "application/vnd.sqlite3": {
        source: "iana"
      },
      "application/vnd.sss-cod": {
        source: "iana"
      },
      "application/vnd.sss-dtf": {
        source: "iana"
      },
      "application/vnd.sss-ntf": {
        source: "iana"
      },
      "application/vnd.stardivision.calc": {
        source: "apache",
        extensions: ["sdc"]
      },
      "application/vnd.stardivision.draw": {
        source: "apache",
        extensions: ["sda"]
      },
      "application/vnd.stardivision.impress": {
        source: "apache",
        extensions: ["sdd"]
      },
      "application/vnd.stardivision.math": {
        source: "apache",
        extensions: ["smf"]
      },
      "application/vnd.stardivision.writer": {
        source: "apache",
        extensions: ["sdw", "vor"]
      },
      "application/vnd.stardivision.writer-global": {
        source: "apache",
        extensions: ["sgl"]
      },
      "application/vnd.stepmania.package": {
        source: "iana",
        extensions: ["smzip"]
      },
      "application/vnd.stepmania.stepchart": {
        source: "iana",
        extensions: ["sm"]
      },
      "application/vnd.street-stream": {
        source: "iana"
      },
      "application/vnd.sun.wadl+xml": {
        source: "iana",
        compressible: true,
        extensions: ["wadl"]
      },
      "application/vnd.sun.xml.calc": {
        source: "apache",
        extensions: ["sxc"]
      },
      "application/vnd.sun.xml.calc.template": {
        source: "apache",
        extensions: ["stc"]
      },
      "application/vnd.sun.xml.draw": {
        source: "apache",
        extensions: ["sxd"]
      },
      "application/vnd.sun.xml.draw.template": {
        source: "apache",
        extensions: ["std"]
      },
      "application/vnd.sun.xml.impress": {
        source: "apache",
        extensions: ["sxi"]
      },
      "application/vnd.sun.xml.impress.template": {
        source: "apache",
        extensions: ["sti"]
      },
      "application/vnd.sun.xml.math": {
        source: "apache",
        extensions: ["sxm"]
      },
      "application/vnd.sun.xml.writer": {
        source: "apache",
        extensions: ["sxw"]
      },
      "application/vnd.sun.xml.writer.global": {
        source: "apache",
        extensions: ["sxg"]
      },
      "application/vnd.sun.xml.writer.template": {
        source: "apache",
        extensions: ["stw"]
      },
      "application/vnd.sus-calendar": {
        source: "iana",
        extensions: ["sus", "susp"]
      },
      "application/vnd.svd": {
        source: "iana",
        extensions: ["svd"]
      },
      "application/vnd.swiftview-ics": {
        source: "iana"
      },
      "application/vnd.sycle+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.syft+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.symbian.install": {
        source: "apache",
        extensions: ["sis", "sisx"]
      },
      "application/vnd.syncml+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
        extensions: ["xsm"]
      },
      "application/vnd.syncml.dm+wbxml": {
        source: "iana",
        charset: "UTF-8",
        extensions: ["bdm"]
      },
      "application/vnd.syncml.dm+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
        extensions: ["xdm"]
      },
      "application/vnd.syncml.dm.notification": {
        source: "iana"
      },
      "application/vnd.syncml.dmddf+wbxml": {
        source: "iana"
      },
      "application/vnd.syncml.dmddf+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
        extensions: ["ddf"]
      },
      "application/vnd.syncml.dmtnds+wbxml": {
        source: "iana"
      },
      "application/vnd.syncml.dmtnds+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/vnd.syncml.ds.notification": {
        source: "iana"
      },
      "application/vnd.tableschema+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.tao.intent-module-archive": {
        source: "iana",
        extensions: ["tao"]
      },
      "application/vnd.tcpdump.pcap": {
        source: "iana",
        extensions: ["pcap", "cap", "dmp"]
      },
      "application/vnd.think-cell.ppttc+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.tmd.mediaflex.api+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.tml": {
        source: "iana"
      },
      "application/vnd.tmobile-livetv": {
        source: "iana",
        extensions: ["tmo"]
      },
      "application/vnd.tri.onesource": {
        source: "iana"
      },
      "application/vnd.trid.tpt": {
        source: "iana",
        extensions: ["tpt"]
      },
      "application/vnd.triscape.mxs": {
        source: "iana",
        extensions: ["mxs"]
      },
      "application/vnd.trueapp": {
        source: "iana",
        extensions: ["tra"]
      },
      "application/vnd.truedoc": {
        source: "iana"
      },
      "application/vnd.ubisoft.webplayer": {
        source: "iana"
      },
      "application/vnd.ufdl": {
        source: "iana",
        extensions: ["ufd", "ufdl"]
      },
      "application/vnd.uiq.theme": {
        source: "iana",
        extensions: ["utz"]
      },
      "application/vnd.umajin": {
        source: "iana",
        extensions: ["umj"]
      },
      "application/vnd.unity": {
        source: "iana",
        extensions: ["unityweb"]
      },
      "application/vnd.uoml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["uoml"]
      },
      "application/vnd.uplanet.alert": {
        source: "iana"
      },
      "application/vnd.uplanet.alert-wbxml": {
        source: "iana"
      },
      "application/vnd.uplanet.bearer-choice": {
        source: "iana"
      },
      "application/vnd.uplanet.bearer-choice-wbxml": {
        source: "iana"
      },
      "application/vnd.uplanet.cacheop": {
        source: "iana"
      },
      "application/vnd.uplanet.cacheop-wbxml": {
        source: "iana"
      },
      "application/vnd.uplanet.channel": {
        source: "iana"
      },
      "application/vnd.uplanet.channel-wbxml": {
        source: "iana"
      },
      "application/vnd.uplanet.list": {
        source: "iana"
      },
      "application/vnd.uplanet.list-wbxml": {
        source: "iana"
      },
      "application/vnd.uplanet.listcmd": {
        source: "iana"
      },
      "application/vnd.uplanet.listcmd-wbxml": {
        source: "iana"
      },
      "application/vnd.uplanet.signal": {
        source: "iana"
      },
      "application/vnd.uri-map": {
        source: "iana"
      },
      "application/vnd.valve.source.material": {
        source: "iana"
      },
      "application/vnd.vcx": {
        source: "iana",
        extensions: ["vcx"]
      },
      "application/vnd.vd-study": {
        source: "iana"
      },
      "application/vnd.vectorworks": {
        source: "iana"
      },
      "application/vnd.vel+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.verimatrix.vcas": {
        source: "iana"
      },
      "application/vnd.veritone.aion+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.veryant.thin": {
        source: "iana"
      },
      "application/vnd.ves.encrypted": {
        source: "iana"
      },
      "application/vnd.vidsoft.vidconference": {
        source: "iana"
      },
      "application/vnd.visio": {
        source: "iana",
        extensions: ["vsd", "vst", "vss", "vsw"]
      },
      "application/vnd.visionary": {
        source: "iana",
        extensions: ["vis"]
      },
      "application/vnd.vividence.scriptfile": {
        source: "iana"
      },
      "application/vnd.vsf": {
        source: "iana",
        extensions: ["vsf"]
      },
      "application/vnd.wap.sic": {
        source: "iana"
      },
      "application/vnd.wap.slc": {
        source: "iana"
      },
      "application/vnd.wap.wbxml": {
        source: "iana",
        charset: "UTF-8",
        extensions: ["wbxml"]
      },
      "application/vnd.wap.wmlc": {
        source: "iana",
        extensions: ["wmlc"]
      },
      "application/vnd.wap.wmlscriptc": {
        source: "iana",
        extensions: ["wmlsc"]
      },
      "application/vnd.webturbo": {
        source: "iana",
        extensions: ["wtb"]
      },
      "application/vnd.wfa.dpp": {
        source: "iana"
      },
      "application/vnd.wfa.p2p": {
        source: "iana"
      },
      "application/vnd.wfa.wsc": {
        source: "iana"
      },
      "application/vnd.windows.devicepairing": {
        source: "iana"
      },
      "application/vnd.wmc": {
        source: "iana"
      },
      "application/vnd.wmf.bootstrap": {
        source: "iana"
      },
      "application/vnd.wolfram.mathematica": {
        source: "iana"
      },
      "application/vnd.wolfram.mathematica.package": {
        source: "iana"
      },
      "application/vnd.wolfram.player": {
        source: "iana",
        extensions: ["nbp"]
      },
      "application/vnd.wordperfect": {
        source: "iana",
        extensions: ["wpd"]
      },
      "application/vnd.wqd": {
        source: "iana",
        extensions: ["wqd"]
      },
      "application/vnd.wrq-hp3000-labelled": {
        source: "iana"
      },
      "application/vnd.wt.stf": {
        source: "iana",
        extensions: ["stf"]
      },
      "application/vnd.wv.csp+wbxml": {
        source: "iana"
      },
      "application/vnd.wv.csp+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.wv.ssp+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.xacml+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.xara": {
        source: "iana",
        extensions: ["xar"]
      },
      "application/vnd.xfdl": {
        source: "iana",
        extensions: ["xfdl"]
      },
      "application/vnd.xfdl.webform": {
        source: "iana"
      },
      "application/vnd.xmi+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.xmpie.cpkg": {
        source: "iana"
      },
      "application/vnd.xmpie.dpkg": {
        source: "iana"
      },
      "application/vnd.xmpie.plan": {
        source: "iana"
      },
      "application/vnd.xmpie.ppkg": {
        source: "iana"
      },
      "application/vnd.xmpie.xlim": {
        source: "iana"
      },
      "application/vnd.yamaha.hv-dic": {
        source: "iana",
        extensions: ["hvd"]
      },
      "application/vnd.yamaha.hv-script": {
        source: "iana",
        extensions: ["hvs"]
      },
      "application/vnd.yamaha.hv-voice": {
        source: "iana",
        extensions: ["hvp"]
      },
      "application/vnd.yamaha.openscoreformat": {
        source: "iana",
        extensions: ["osf"]
      },
      "application/vnd.yamaha.openscoreformat.osfpvg+xml": {
        source: "iana",
        compressible: true,
        extensions: ["osfpvg"]
      },
      "application/vnd.yamaha.remote-setup": {
        source: "iana"
      },
      "application/vnd.yamaha.smaf-audio": {
        source: "iana",
        extensions: ["saf"]
      },
      "application/vnd.yamaha.smaf-phrase": {
        source: "iana",
        extensions: ["spf"]
      },
      "application/vnd.yamaha.through-ngn": {
        source: "iana"
      },
      "application/vnd.yamaha.tunnel-udpencap": {
        source: "iana"
      },
      "application/vnd.yaoweme": {
        source: "iana"
      },
      "application/vnd.yellowriver-custom-menu": {
        source: "iana",
        extensions: ["cmp"]
      },
      "application/vnd.youtube.yt": {
        source: "iana"
      },
      "application/vnd.zul": {
        source: "iana",
        extensions: ["zir", "zirz"]
      },
      "application/vnd.zzazz.deck+xml": {
        source: "iana",
        compressible: true,
        extensions: ["zaz"]
      },
      "application/voicexml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["vxml"]
      },
      "application/voucher-cms+json": {
        source: "iana",
        compressible: true
      },
      "application/vq-rtcpxr": {
        source: "iana"
      },
      "application/wasm": {
        source: "iana",
        compressible: true,
        extensions: ["wasm"]
      },
      "application/watcherinfo+xml": {
        source: "iana",
        compressible: true,
        extensions: ["wif"]
      },
      "application/webpush-options+json": {
        source: "iana",
        compressible: true
      },
      "application/whoispp-query": {
        source: "iana"
      },
      "application/whoispp-response": {
        source: "iana"
      },
      "application/widget": {
        source: "iana",
        extensions: ["wgt"]
      },
      "application/winhlp": {
        source: "apache",
        extensions: ["hlp"]
      },
      "application/wita": {
        source: "iana"
      },
      "application/wordperfect5.1": {
        source: "iana"
      },
      "application/wsdl+xml": {
        source: "iana",
        compressible: true,
        extensions: ["wsdl"]
      },
      "application/wspolicy+xml": {
        source: "iana",
        compressible: true,
        extensions: ["wspolicy"]
      },
      "application/x-7z-compressed": {
        source: "apache",
        compressible: false,
        extensions: ["7z"]
      },
      "application/x-abiword": {
        source: "apache",
        extensions: ["abw"]
      },
      "application/x-ace-compressed": {
        source: "apache",
        extensions: ["ace"]
      },
      "application/x-amf": {
        source: "apache"
      },
      "application/x-apple-diskimage": {
        source: "apache",
        extensions: ["dmg"]
      },
      "application/x-arj": {
        compressible: false,
        extensions: ["arj"]
      },
      "application/x-authorware-bin": {
        source: "apache",
        extensions: ["aab", "x32", "u32", "vox"]
      },
      "application/x-authorware-map": {
        source: "apache",
        extensions: ["aam"]
      },
      "application/x-authorware-seg": {
        source: "apache",
        extensions: ["aas"]
      },
      "application/x-bcpio": {
        source: "apache",
        extensions: ["bcpio"]
      },
      "application/x-bdoc": {
        compressible: false,
        extensions: ["bdoc"]
      },
      "application/x-bittorrent": {
        source: "apache",
        extensions: ["torrent"]
      },
      "application/x-blorb": {
        source: "apache",
        extensions: ["blb", "blorb"]
      },
      "application/x-bzip": {
        source: "apache",
        compressible: false,
        extensions: ["bz"]
      },
      "application/x-bzip2": {
        source: "apache",
        compressible: false,
        extensions: ["bz2", "boz"]
      },
      "application/x-cbr": {
        source: "apache",
        extensions: ["cbr", "cba", "cbt", "cbz", "cb7"]
      },
      "application/x-cdlink": {
        source: "apache",
        extensions: ["vcd"]
      },
      "application/x-cfs-compressed": {
        source: "apache",
        extensions: ["cfs"]
      },
      "application/x-chat": {
        source: "apache",
        extensions: ["chat"]
      },
      "application/x-chess-pgn": {
        source: "apache",
        extensions: ["pgn"]
      },
      "application/x-chrome-extension": {
        extensions: ["crx"]
      },
      "application/x-cocoa": {
        source: "nginx",
        extensions: ["cco"]
      },
      "application/x-compress": {
        source: "apache"
      },
      "application/x-conference": {
        source: "apache",
        extensions: ["nsc"]
      },
      "application/x-cpio": {
        source: "apache",
        extensions: ["cpio"]
      },
      "application/x-csh": {
        source: "apache",
        extensions: ["csh"]
      },
      "application/x-deb": {
        compressible: false
      },
      "application/x-debian-package": {
        source: "apache",
        extensions: ["deb", "udeb"]
      },
      "application/x-dgc-compressed": {
        source: "apache",
        extensions: ["dgc"]
      },
      "application/x-director": {
        source: "apache",
        extensions: ["dir", "dcr", "dxr", "cst", "cct", "cxt", "w3d", "fgd", "swa"]
      },
      "application/x-doom": {
        source: "apache",
        extensions: ["wad"]
      },
      "application/x-dtbncx+xml": {
        source: "apache",
        compressible: true,
        extensions: ["ncx"]
      },
      "application/x-dtbook+xml": {
        source: "apache",
        compressible: true,
        extensions: ["dtb"]
      },
      "application/x-dtbresource+xml": {
        source: "apache",
        compressible: true,
        extensions: ["res"]
      },
      "application/x-dvi": {
        source: "apache",
        compressible: false,
        extensions: ["dvi"]
      },
      "application/x-envoy": {
        source: "apache",
        extensions: ["evy"]
      },
      "application/x-eva": {
        source: "apache",
        extensions: ["eva"]
      },
      "application/x-font-bdf": {
        source: "apache",
        extensions: ["bdf"]
      },
      "application/x-font-dos": {
        source: "apache"
      },
      "application/x-font-framemaker": {
        source: "apache"
      },
      "application/x-font-ghostscript": {
        source: "apache",
        extensions: ["gsf"]
      },
      "application/x-font-libgrx": {
        source: "apache"
      },
      "application/x-font-linux-psf": {
        source: "apache",
        extensions: ["psf"]
      },
      "application/x-font-pcf": {
        source: "apache",
        extensions: ["pcf"]
      },
      "application/x-font-snf": {
        source: "apache",
        extensions: ["snf"]
      },
      "application/x-font-speedo": {
        source: "apache"
      },
      "application/x-font-sunos-news": {
        source: "apache"
      },
      "application/x-font-type1": {
        source: "apache",
        extensions: ["pfa", "pfb", "pfm", "afm"]
      },
      "application/x-font-vfont": {
        source: "apache"
      },
      "application/x-freearc": {
        source: "apache",
        extensions: ["arc"]
      },
      "application/x-futuresplash": {
        source: "apache",
        extensions: ["spl"]
      },
      "application/x-gca-compressed": {
        source: "apache",
        extensions: ["gca"]
      },
      "application/x-glulx": {
        source: "apache",
        extensions: ["ulx"]
      },
      "application/x-gnumeric": {
        source: "apache",
        extensions: ["gnumeric"]
      },
      "application/x-gramps-xml": {
        source: "apache",
        extensions: ["gramps"]
      },
      "application/x-gtar": {
        source: "apache",
        extensions: ["gtar"]
      },
      "application/x-gzip": {
        source: "apache"
      },
      "application/x-hdf": {
        source: "apache",
        extensions: ["hdf"]
      },
      "application/x-httpd-php": {
        compressible: true,
        extensions: ["php"]
      },
      "application/x-install-instructions": {
        source: "apache",
        extensions: ["install"]
      },
      "application/x-iso9660-image": {
        source: "apache",
        extensions: ["iso"]
      },
      "application/x-iwork-keynote-sffkey": {
        extensions: ["key"]
      },
      "application/x-iwork-numbers-sffnumbers": {
        extensions: ["numbers"]
      },
      "application/x-iwork-pages-sffpages": {
        extensions: ["pages"]
      },
      "application/x-java-archive-diff": {
        source: "nginx",
        extensions: ["jardiff"]
      },
      "application/x-java-jnlp-file": {
        source: "apache",
        compressible: false,
        extensions: ["jnlp"]
      },
      "application/x-javascript": {
        compressible: true
      },
      "application/x-keepass2": {
        extensions: ["kdbx"]
      },
      "application/x-latex": {
        source: "apache",
        compressible: false,
        extensions: ["latex"]
      },
      "application/x-lua-bytecode": {
        extensions: ["luac"]
      },
      "application/x-lzh-compressed": {
        source: "apache",
        extensions: ["lzh", "lha"]
      },
      "application/x-makeself": {
        source: "nginx",
        extensions: ["run"]
      },
      "application/x-mie": {
        source: "apache",
        extensions: ["mie"]
      },
      "application/x-mobipocket-ebook": {
        source: "apache",
        extensions: ["prc", "mobi"]
      },
      "application/x-mpegurl": {
        compressible: false
      },
      "application/x-ms-application": {
        source: "apache",
        extensions: ["application"]
      },
      "application/x-ms-shortcut": {
        source: "apache",
        extensions: ["lnk"]
      },
      "application/x-ms-wmd": {
        source: "apache",
        extensions: ["wmd"]
      },
      "application/x-ms-wmz": {
        source: "apache",
        extensions: ["wmz"]
      },
      "application/x-ms-xbap": {
        source: "apache",
        extensions: ["xbap"]
      },
      "application/x-msaccess": {
        source: "apache",
        extensions: ["mdb"]
      },
      "application/x-msbinder": {
        source: "apache",
        extensions: ["obd"]
      },
      "application/x-mscardfile": {
        source: "apache",
        extensions: ["crd"]
      },
      "application/x-msclip": {
        source: "apache",
        extensions: ["clp"]
      },
      "application/x-msdos-program": {
        extensions: ["exe"]
      },
      "application/x-msdownload": {
        source: "apache",
        extensions: ["exe", "dll", "com", "bat", "msi"]
      },
      "application/x-msmediaview": {
        source: "apache",
        extensions: ["mvb", "m13", "m14"]
      },
      "application/x-msmetafile": {
        source: "apache",
        extensions: ["wmf", "wmz", "emf", "emz"]
      },
      "application/x-msmoney": {
        source: "apache",
        extensions: ["mny"]
      },
      "application/x-mspublisher": {
        source: "apache",
        extensions: ["pub"]
      },
      "application/x-msschedule": {
        source: "apache",
        extensions: ["scd"]
      },
      "application/x-msterminal": {
        source: "apache",
        extensions: ["trm"]
      },
      "application/x-mswrite": {
        source: "apache",
        extensions: ["wri"]
      },
      "application/x-netcdf": {
        source: "apache",
        extensions: ["nc", "cdf"]
      },
      "application/x-ns-proxy-autoconfig": {
        compressible: true,
        extensions: ["pac"]
      },
      "application/x-nzb": {
        source: "apache",
        extensions: ["nzb"]
      },
      "application/x-perl": {
        source: "nginx",
        extensions: ["pl", "pm"]
      },
      "application/x-pilot": {
        source: "nginx",
        extensions: ["prc", "pdb"]
      },
      "application/x-pkcs12": {
        source: "apache",
        compressible: false,
        extensions: ["p12", "pfx"]
      },
      "application/x-pkcs7-certificates": {
        source: "apache",
        extensions: ["p7b", "spc"]
      },
      "application/x-pkcs7-certreqresp": {
        source: "apache",
        extensions: ["p7r"]
      },
      "application/x-pki-message": {
        source: "iana"
      },
      "application/x-rar-compressed": {
        source: "apache",
        compressible: false,
        extensions: ["rar"]
      },
      "application/x-redhat-package-manager": {
        source: "nginx",
        extensions: ["rpm"]
      },
      "application/x-research-info-systems": {
        source: "apache",
        extensions: ["ris"]
      },
      "application/x-sea": {
        source: "nginx",
        extensions: ["sea"]
      },
      "application/x-sh": {
        source: "apache",
        compressible: true,
        extensions: ["sh"]
      },
      "application/x-shar": {
        source: "apache",
        extensions: ["shar"]
      },
      "application/x-shockwave-flash": {
        source: "apache",
        compressible: false,
        extensions: ["swf"]
      },
      "application/x-silverlight-app": {
        source: "apache",
        extensions: ["xap"]
      },
      "application/x-sql": {
        source: "apache",
        extensions: ["sql"]
      },
      "application/x-stuffit": {
        source: "apache",
        compressible: false,
        extensions: ["sit"]
      },
      "application/x-stuffitx": {
        source: "apache",
        extensions: ["sitx"]
      },
      "application/x-subrip": {
        source: "apache",
        extensions: ["srt"]
      },
      "application/x-sv4cpio": {
        source: "apache",
        extensions: ["sv4cpio"]
      },
      "application/x-sv4crc": {
        source: "apache",
        extensions: ["sv4crc"]
      },
      "application/x-t3vm-image": {
        source: "apache",
        extensions: ["t3"]
      },
      "application/x-tads": {
        source: "apache",
        extensions: ["gam"]
      },
      "application/x-tar": {
        source: "apache",
        compressible: true,
        extensions: ["tar"]
      },
      "application/x-tcl": {
        source: "apache",
        extensions: ["tcl", "tk"]
      },
      "application/x-tex": {
        source: "apache",
        extensions: ["tex"]
      },
      "application/x-tex-tfm": {
        source: "apache",
        extensions: ["tfm"]
      },
      "application/x-texinfo": {
        source: "apache",
        extensions: ["texinfo", "texi"]
      },
      "application/x-tgif": {
        source: "apache",
        extensions: ["obj"]
      },
      "application/x-ustar": {
        source: "apache",
        extensions: ["ustar"]
      },
      "application/x-virtualbox-hdd": {
        compressible: true,
        extensions: ["hdd"]
      },
      "application/x-virtualbox-ova": {
        compressible: true,
        extensions: ["ova"]
      },
      "application/x-virtualbox-ovf": {
        compressible: true,
        extensions: ["ovf"]
      },
      "application/x-virtualbox-vbox": {
        compressible: true,
        extensions: ["vbox"]
      },
      "application/x-virtualbox-vbox-extpack": {
        compressible: false,
        extensions: ["vbox-extpack"]
      },
      "application/x-virtualbox-vdi": {
        compressible: true,
        extensions: ["vdi"]
      },
      "application/x-virtualbox-vhd": {
        compressible: true,
        extensions: ["vhd"]
      },
      "application/x-virtualbox-vmdk": {
        compressible: true,
        extensions: ["vmdk"]
      },
      "application/x-wais-source": {
        source: "apache",
        extensions: ["src"]
      },
      "application/x-web-app-manifest+json": {
        compressible: true,
        extensions: ["webapp"]
      },
      "application/x-www-form-urlencoded": {
        source: "iana",
        compressible: true
      },
      "application/x-x509-ca-cert": {
        source: "iana",
        extensions: ["der", "crt", "pem"]
      },
      "application/x-x509-ca-ra-cert": {
        source: "iana"
      },
      "application/x-x509-next-ca-cert": {
        source: "iana"
      },
      "application/x-xfig": {
        source: "apache",
        extensions: ["fig"]
      },
      "application/x-xliff+xml": {
        source: "apache",
        compressible: true,
        extensions: ["xlf"]
      },
      "application/x-xpinstall": {
        source: "apache",
        compressible: false,
        extensions: ["xpi"]
      },
      "application/x-xz": {
        source: "apache",
        extensions: ["xz"]
      },
      "application/x-zmachine": {
        source: "apache",
        extensions: ["z1", "z2", "z3", "z4", "z5", "z6", "z7", "z8"]
      },
      "application/x400-bp": {
        source: "iana"
      },
      "application/xacml+xml": {
        source: "iana",
        compressible: true
      },
      "application/xaml+xml": {
        source: "apache",
        compressible: true,
        extensions: ["xaml"]
      },
      "application/xcap-att+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xav"]
      },
      "application/xcap-caps+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xca"]
      },
      "application/xcap-diff+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xdf"]
      },
      "application/xcap-el+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xel"]
      },
      "application/xcap-error+xml": {
        source: "iana",
        compressible: true
      },
      "application/xcap-ns+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xns"]
      },
      "application/xcon-conference-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/xcon-conference-info-diff+xml": {
        source: "iana",
        compressible: true
      },
      "application/xenc+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xenc"]
      },
      "application/xhtml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xhtml", "xht"]
      },
      "application/xhtml-voice+xml": {
        source: "apache",
        compressible: true
      },
      "application/xliff+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xlf"]
      },
      "application/xml": {
        source: "iana",
        compressible: true,
        extensions: ["xml", "xsl", "xsd", "rng"]
      },
      "application/xml-dtd": {
        source: "iana",
        compressible: true,
        extensions: ["dtd"]
      },
      "application/xml-external-parsed-entity": {
        source: "iana"
      },
      "application/xml-patch+xml": {
        source: "iana",
        compressible: true
      },
      "application/xmpp+xml": {
        source: "iana",
        compressible: true
      },
      "application/xop+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xop"]
      },
      "application/xproc+xml": {
        source: "apache",
        compressible: true,
        extensions: ["xpl"]
      },
      "application/xslt+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xsl", "xslt"]
      },
      "application/xspf+xml": {
        source: "apache",
        compressible: true,
        extensions: ["xspf"]
      },
      "application/xv+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mxml", "xhvml", "xvml", "xvm"]
      },
      "application/yang": {
        source: "iana",
        extensions: ["yang"]
      },
      "application/yang-data+json": {
        source: "iana",
        compressible: true
      },
      "application/yang-data+xml": {
        source: "iana",
        compressible: true
      },
      "application/yang-patch+json": {
        source: "iana",
        compressible: true
      },
      "application/yang-patch+xml": {
        source: "iana",
        compressible: true
      },
      "application/yin+xml": {
        source: "iana",
        compressible: true,
        extensions: ["yin"]
      },
      "application/zip": {
        source: "iana",
        compressible: false,
        extensions: ["zip"]
      },
      "application/zlib": {
        source: "iana"
      },
      "application/zstd": {
        source: "iana"
      },
      "audio/1d-interleaved-parityfec": {
        source: "iana"
      },
      "audio/32kadpcm": {
        source: "iana"
      },
      "audio/3gpp": {
        source: "iana",
        compressible: false,
        extensions: ["3gpp"]
      },
      "audio/3gpp2": {
        source: "iana"
      },
      "audio/aac": {
        source: "iana"
      },
      "audio/ac3": {
        source: "iana"
      },
      "audio/adpcm": {
        source: "apache",
        extensions: ["adp"]
      },
      "audio/amr": {
        source: "iana",
        extensions: ["amr"]
      },
      "audio/amr-wb": {
        source: "iana"
      },
      "audio/amr-wb+": {
        source: "iana"
      },
      "audio/aptx": {
        source: "iana"
      },
      "audio/asc": {
        source: "iana"
      },
      "audio/atrac-advanced-lossless": {
        source: "iana"
      },
      "audio/atrac-x": {
        source: "iana"
      },
      "audio/atrac3": {
        source: "iana"
      },
      "audio/basic": {
        source: "iana",
        compressible: false,
        extensions: ["au", "snd"]
      },
      "audio/bv16": {
        source: "iana"
      },
      "audio/bv32": {
        source: "iana"
      },
      "audio/clearmode": {
        source: "iana"
      },
      "audio/cn": {
        source: "iana"
      },
      "audio/dat12": {
        source: "iana"
      },
      "audio/dls": {
        source: "iana"
      },
      "audio/dsr-es201108": {
        source: "iana"
      },
      "audio/dsr-es202050": {
        source: "iana"
      },
      "audio/dsr-es202211": {
        source: "iana"
      },
      "audio/dsr-es202212": {
        source: "iana"
      },
      "audio/dv": {
        source: "iana"
      },
      "audio/dvi4": {
        source: "iana"
      },
      "audio/eac3": {
        source: "iana"
      },
      "audio/encaprtp": {
        source: "iana"
      },
      "audio/evrc": {
        source: "iana"
      },
      "audio/evrc-qcp": {
        source: "iana"
      },
      "audio/evrc0": {
        source: "iana"
      },
      "audio/evrc1": {
        source: "iana"
      },
      "audio/evrcb": {
        source: "iana"
      },
      "audio/evrcb0": {
        source: "iana"
      },
      "audio/evrcb1": {
        source: "iana"
      },
      "audio/evrcnw": {
        source: "iana"
      },
      "audio/evrcnw0": {
        source: "iana"
      },
      "audio/evrcnw1": {
        source: "iana"
      },
      "audio/evrcwb": {
        source: "iana"
      },
      "audio/evrcwb0": {
        source: "iana"
      },
      "audio/evrcwb1": {
        source: "iana"
      },
      "audio/evs": {
        source: "iana"
      },
      "audio/flexfec": {
        source: "iana"
      },
      "audio/fwdred": {
        source: "iana"
      },
      "audio/g711-0": {
        source: "iana"
      },
      "audio/g719": {
        source: "iana"
      },
      "audio/g722": {
        source: "iana"
      },
      "audio/g7221": {
        source: "iana"
      },
      "audio/g723": {
        source: "iana"
      },
      "audio/g726-16": {
        source: "iana"
      },
      "audio/g726-24": {
        source: "iana"
      },
      "audio/g726-32": {
        source: "iana"
      },
      "audio/g726-40": {
        source: "iana"
      },
      "audio/g728": {
        source: "iana"
      },
      "audio/g729": {
        source: "iana"
      },
      "audio/g7291": {
        source: "iana"
      },
      "audio/g729d": {
        source: "iana"
      },
      "audio/g729e": {
        source: "iana"
      },
      "audio/gsm": {
        source: "iana"
      },
      "audio/gsm-efr": {
        source: "iana"
      },
      "audio/gsm-hr-08": {
        source: "iana"
      },
      "audio/ilbc": {
        source: "iana"
      },
      "audio/ip-mr_v2.5": {
        source: "iana"
      },
      "audio/isac": {
        source: "apache"
      },
      "audio/l16": {
        source: "iana"
      },
      "audio/l20": {
        source: "iana"
      },
      "audio/l24": {
        source: "iana",
        compressible: false
      },
      "audio/l8": {
        source: "iana"
      },
      "audio/lpc": {
        source: "iana"
      },
      "audio/melp": {
        source: "iana"
      },
      "audio/melp1200": {
        source: "iana"
      },
      "audio/melp2400": {
        source: "iana"
      },
      "audio/melp600": {
        source: "iana"
      },
      "audio/mhas": {
        source: "iana"
      },
      "audio/midi": {
        source: "apache",
        extensions: ["mid", "midi", "kar", "rmi"]
      },
      "audio/mobile-xmf": {
        source: "iana",
        extensions: ["mxmf"]
      },
      "audio/mp3": {
        compressible: false,
        extensions: ["mp3"]
      },
      "audio/mp4": {
        source: "iana",
        compressible: false,
        extensions: ["m4a", "mp4a"]
      },
      "audio/mp4a-latm": {
        source: "iana"
      },
      "audio/mpa": {
        source: "iana"
      },
      "audio/mpa-robust": {
        source: "iana"
      },
      "audio/mpeg": {
        source: "iana",
        compressible: false,
        extensions: ["mpga", "mp2", "mp2a", "mp3", "m2a", "m3a"]
      },
      "audio/mpeg4-generic": {
        source: "iana"
      },
      "audio/musepack": {
        source: "apache"
      },
      "audio/ogg": {
        source: "iana",
        compressible: false,
        extensions: ["oga", "ogg", "spx", "opus"]
      },
      "audio/opus": {
        source: "iana"
      },
      "audio/parityfec": {
        source: "iana"
      },
      "audio/pcma": {
        source: "iana"
      },
      "audio/pcma-wb": {
        source: "iana"
      },
      "audio/pcmu": {
        source: "iana"
      },
      "audio/pcmu-wb": {
        source: "iana"
      },
      "audio/prs.sid": {
        source: "iana"
      },
      "audio/qcelp": {
        source: "iana"
      },
      "audio/raptorfec": {
        source: "iana"
      },
      "audio/red": {
        source: "iana"
      },
      "audio/rtp-enc-aescm128": {
        source: "iana"
      },
      "audio/rtp-midi": {
        source: "iana"
      },
      "audio/rtploopback": {
        source: "iana"
      },
      "audio/rtx": {
        source: "iana"
      },
      "audio/s3m": {
        source: "apache",
        extensions: ["s3m"]
      },
      "audio/scip": {
        source: "iana"
      },
      "audio/silk": {
        source: "apache",
        extensions: ["sil"]
      },
      "audio/smv": {
        source: "iana"
      },
      "audio/smv-qcp": {
        source: "iana"
      },
      "audio/smv0": {
        source: "iana"
      },
      "audio/sofa": {
        source: "iana"
      },
      "audio/sp-midi": {
        source: "iana"
      },
      "audio/speex": {
        source: "iana"
      },
      "audio/t140c": {
        source: "iana"
      },
      "audio/t38": {
        source: "iana"
      },
      "audio/telephone-event": {
        source: "iana"
      },
      "audio/tetra_acelp": {
        source: "iana"
      },
      "audio/tetra_acelp_bb": {
        source: "iana"
      },
      "audio/tone": {
        source: "iana"
      },
      "audio/tsvcis": {
        source: "iana"
      },
      "audio/uemclip": {
        source: "iana"
      },
      "audio/ulpfec": {
        source: "iana"
      },
      "audio/usac": {
        source: "iana"
      },
      "audio/vdvi": {
        source: "iana"
      },
      "audio/vmr-wb": {
        source: "iana"
      },
      "audio/vnd.3gpp.iufp": {
        source: "iana"
      },
      "audio/vnd.4sb": {
        source: "iana"
      },
      "audio/vnd.audiokoz": {
        source: "iana"
      },
      "audio/vnd.celp": {
        source: "iana"
      },
      "audio/vnd.cisco.nse": {
        source: "iana"
      },
      "audio/vnd.cmles.radio-events": {
        source: "iana"
      },
      "audio/vnd.cns.anp1": {
        source: "iana"
      },
      "audio/vnd.cns.inf1": {
        source: "iana"
      },
      "audio/vnd.dece.audio": {
        source: "iana",
        extensions: ["uva", "uvva"]
      },
      "audio/vnd.digital-winds": {
        source: "iana",
        extensions: ["eol"]
      },
      "audio/vnd.dlna.adts": {
        source: "iana"
      },
      "audio/vnd.dolby.heaac.1": {
        source: "iana"
      },
      "audio/vnd.dolby.heaac.2": {
        source: "iana"
      },
      "audio/vnd.dolby.mlp": {
        source: "iana"
      },
      "audio/vnd.dolby.mps": {
        source: "iana"
      },
      "audio/vnd.dolby.pl2": {
        source: "iana"
      },
      "audio/vnd.dolby.pl2x": {
        source: "iana"
      },
      "audio/vnd.dolby.pl2z": {
        source: "iana"
      },
      "audio/vnd.dolby.pulse.1": {
        source: "iana"
      },
      "audio/vnd.dra": {
        source: "iana",
        extensions: ["dra"]
      },
      "audio/vnd.dts": {
        source: "iana",
        extensions: ["dts"]
      },
      "audio/vnd.dts.hd": {
        source: "iana",
        extensions: ["dtshd"]
      },
      "audio/vnd.dts.uhd": {
        source: "iana"
      },
      "audio/vnd.dvb.file": {
        source: "iana"
      },
      "audio/vnd.everad.plj": {
        source: "iana"
      },
      "audio/vnd.hns.audio": {
        source: "iana"
      },
      "audio/vnd.lucent.voice": {
        source: "iana",
        extensions: ["lvp"]
      },
      "audio/vnd.ms-playready.media.pya": {
        source: "iana",
        extensions: ["pya"]
      },
      "audio/vnd.nokia.mobile-xmf": {
        source: "iana"
      },
      "audio/vnd.nortel.vbk": {
        source: "iana"
      },
      "audio/vnd.nuera.ecelp4800": {
        source: "iana",
        extensions: ["ecelp4800"]
      },
      "audio/vnd.nuera.ecelp7470": {
        source: "iana",
        extensions: ["ecelp7470"]
      },
      "audio/vnd.nuera.ecelp9600": {
        source: "iana",
        extensions: ["ecelp9600"]
      },
      "audio/vnd.octel.sbc": {
        source: "iana"
      },
      "audio/vnd.presonus.multitrack": {
        source: "iana"
      },
      "audio/vnd.qcelp": {
        source: "iana"
      },
      "audio/vnd.rhetorex.32kadpcm": {
        source: "iana"
      },
      "audio/vnd.rip": {
        source: "iana",
        extensions: ["rip"]
      },
      "audio/vnd.rn-realaudio": {
        compressible: false
      },
      "audio/vnd.sealedmedia.softseal.mpeg": {
        source: "iana"
      },
      "audio/vnd.vmx.cvsd": {
        source: "iana"
      },
      "audio/vnd.wave": {
        compressible: false
      },
      "audio/vorbis": {
        source: "iana",
        compressible: false
      },
      "audio/vorbis-config": {
        source: "iana"
      },
      "audio/wav": {
        compressible: false,
        extensions: ["wav"]
      },
      "audio/wave": {
        compressible: false,
        extensions: ["wav"]
      },
      "audio/webm": {
        source: "apache",
        compressible: false,
        extensions: ["weba"]
      },
      "audio/x-aac": {
        source: "apache",
        compressible: false,
        extensions: ["aac"]
      },
      "audio/x-aiff": {
        source: "apache",
        extensions: ["aif", "aiff", "aifc"]
      },
      "audio/x-caf": {
        source: "apache",
        compressible: false,
        extensions: ["caf"]
      },
      "audio/x-flac": {
        source: "apache",
        extensions: ["flac"]
      },
      "audio/x-m4a": {
        source: "nginx",
        extensions: ["m4a"]
      },
      "audio/x-matroska": {
        source: "apache",
        extensions: ["mka"]
      },
      "audio/x-mpegurl": {
        source: "apache",
        extensions: ["m3u"]
      },
      "audio/x-ms-wax": {
        source: "apache",
        extensions: ["wax"]
      },
      "audio/x-ms-wma": {
        source: "apache",
        extensions: ["wma"]
      },
      "audio/x-pn-realaudio": {
        source: "apache",
        extensions: ["ram", "ra"]
      },
      "audio/x-pn-realaudio-plugin": {
        source: "apache",
        extensions: ["rmp"]
      },
      "audio/x-realaudio": {
        source: "nginx",
        extensions: ["ra"]
      },
      "audio/x-tta": {
        source: "apache"
      },
      "audio/x-wav": {
        source: "apache",
        extensions: ["wav"]
      },
      "audio/xm": {
        source: "apache",
        extensions: ["xm"]
      },
      "chemical/x-cdx": {
        source: "apache",
        extensions: ["cdx"]
      },
      "chemical/x-cif": {
        source: "apache",
        extensions: ["cif"]
      },
      "chemical/x-cmdf": {
        source: "apache",
        extensions: ["cmdf"]
      },
      "chemical/x-cml": {
        source: "apache",
        extensions: ["cml"]
      },
      "chemical/x-csml": {
        source: "apache",
        extensions: ["csml"]
      },
      "chemical/x-pdb": {
        source: "apache"
      },
      "chemical/x-xyz": {
        source: "apache",
        extensions: ["xyz"]
      },
      "font/collection": {
        source: "iana",
        extensions: ["ttc"]
      },
      "font/otf": {
        source: "iana",
        compressible: true,
        extensions: ["otf"]
      },
      "font/sfnt": {
        source: "iana"
      },
      "font/ttf": {
        source: "iana",
        compressible: true,
        extensions: ["ttf"]
      },
      "font/woff": {
        source: "iana",
        extensions: ["woff"]
      },
      "font/woff2": {
        source: "iana",
        extensions: ["woff2"]
      },
      "image/aces": {
        source: "iana",
        extensions: ["exr"]
      },
      "image/apng": {
        compressible: false,
        extensions: ["apng"]
      },
      "image/avci": {
        source: "iana",
        extensions: ["avci"]
      },
      "image/avcs": {
        source: "iana",
        extensions: ["avcs"]
      },
      "image/avif": {
        source: "iana",
        compressible: false,
        extensions: ["avif"]
      },
      "image/bmp": {
        source: "iana",
        compressible: true,
        extensions: ["bmp"]
      },
      "image/cgm": {
        source: "iana",
        extensions: ["cgm"]
      },
      "image/dicom-rle": {
        source: "iana",
        extensions: ["drle"]
      },
      "image/emf": {
        source: "iana",
        extensions: ["emf"]
      },
      "image/fits": {
        source: "iana",
        extensions: ["fits"]
      },
      "image/g3fax": {
        source: "iana",
        extensions: ["g3"]
      },
      "image/gif": {
        source: "iana",
        compressible: false,
        extensions: ["gif"]
      },
      "image/heic": {
        source: "iana",
        extensions: ["heic"]
      },
      "image/heic-sequence": {
        source: "iana",
        extensions: ["heics"]
      },
      "image/heif": {
        source: "iana",
        extensions: ["heif"]
      },
      "image/heif-sequence": {
        source: "iana",
        extensions: ["heifs"]
      },
      "image/hej2k": {
        source: "iana",
        extensions: ["hej2"]
      },
      "image/hsj2": {
        source: "iana",
        extensions: ["hsj2"]
      },
      "image/ief": {
        source: "iana",
        extensions: ["ief"]
      },
      "image/jls": {
        source: "iana",
        extensions: ["jls"]
      },
      "image/jp2": {
        source: "iana",
        compressible: false,
        extensions: ["jp2", "jpg2"]
      },
      "image/jpeg": {
        source: "iana",
        compressible: false,
        extensions: ["jpeg", "jpg", "jpe"]
      },
      "image/jph": {
        source: "iana",
        extensions: ["jph"]
      },
      "image/jphc": {
        source: "iana",
        extensions: ["jhc"]
      },
      "image/jpm": {
        source: "iana",
        compressible: false,
        extensions: ["jpm"]
      },
      "image/jpx": {
        source: "iana",
        compressible: false,
        extensions: ["jpx", "jpf"]
      },
      "image/jxr": {
        source: "iana",
        extensions: ["jxr"]
      },
      "image/jxra": {
        source: "iana",
        extensions: ["jxra"]
      },
      "image/jxrs": {
        source: "iana",
        extensions: ["jxrs"]
      },
      "image/jxs": {
        source: "iana",
        extensions: ["jxs"]
      },
      "image/jxsc": {
        source: "iana",
        extensions: ["jxsc"]
      },
      "image/jxsi": {
        source: "iana",
        extensions: ["jxsi"]
      },
      "image/jxss": {
        source: "iana",
        extensions: ["jxss"]
      },
      "image/ktx": {
        source: "iana",
        extensions: ["ktx"]
      },
      "image/ktx2": {
        source: "iana",
        extensions: ["ktx2"]
      },
      "image/naplps": {
        source: "iana"
      },
      "image/pjpeg": {
        compressible: false
      },
      "image/png": {
        source: "iana",
        compressible: false,
        extensions: ["png"]
      },
      "image/prs.btif": {
        source: "iana",
        extensions: ["btif"]
      },
      "image/prs.pti": {
        source: "iana",
        extensions: ["pti"]
      },
      "image/pwg-raster": {
        source: "iana"
      },
      "image/sgi": {
        source: "apache",
        extensions: ["sgi"]
      },
      "image/svg+xml": {
        source: "iana",
        compressible: true,
        extensions: ["svg", "svgz"]
      },
      "image/t38": {
        source: "iana",
        extensions: ["t38"]
      },
      "image/tiff": {
        source: "iana",
        compressible: false,
        extensions: ["tif", "tiff"]
      },
      "image/tiff-fx": {
        source: "iana",
        extensions: ["tfx"]
      },
      "image/vnd.adobe.photoshop": {
        source: "iana",
        compressible: true,
        extensions: ["psd"]
      },
      "image/vnd.airzip.accelerator.azv": {
        source: "iana",
        extensions: ["azv"]
      },
      "image/vnd.cns.inf2": {
        source: "iana"
      },
      "image/vnd.dece.graphic": {
        source: "iana",
        extensions: ["uvi", "uvvi", "uvg", "uvvg"]
      },
      "image/vnd.djvu": {
        source: "iana",
        extensions: ["djvu", "djv"]
      },
      "image/vnd.dvb.subtitle": {
        source: "iana",
        extensions: ["sub"]
      },
      "image/vnd.dwg": {
        source: "iana",
        extensions: ["dwg"]
      },
      "image/vnd.dxf": {
        source: "iana",
        extensions: ["dxf"]
      },
      "image/vnd.fastbidsheet": {
        source: "iana",
        extensions: ["fbs"]
      },
      "image/vnd.fpx": {
        source: "iana",
        extensions: ["fpx"]
      },
      "image/vnd.fst": {
        source: "iana",
        extensions: ["fst"]
      },
      "image/vnd.fujixerox.edmics-mmr": {
        source: "iana",
        extensions: ["mmr"]
      },
      "image/vnd.fujixerox.edmics-rlc": {
        source: "iana",
        extensions: ["rlc"]
      },
      "image/vnd.globalgraphics.pgb": {
        source: "iana"
      },
      "image/vnd.microsoft.icon": {
        source: "iana",
        compressible: true,
        extensions: ["ico"]
      },
      "image/vnd.mix": {
        source: "iana"
      },
      "image/vnd.mozilla.apng": {
        source: "iana"
      },
      "image/vnd.ms-dds": {
        compressible: true,
        extensions: ["dds"]
      },
      "image/vnd.ms-modi": {
        source: "iana",
        extensions: ["mdi"]
      },
      "image/vnd.ms-photo": {
        source: "apache",
        extensions: ["wdp"]
      },
      "image/vnd.net-fpx": {
        source: "iana",
        extensions: ["npx"]
      },
      "image/vnd.pco.b16": {
        source: "iana",
        extensions: ["b16"]
      },
      "image/vnd.radiance": {
        source: "iana"
      },
      "image/vnd.sealed.png": {
        source: "iana"
      },
      "image/vnd.sealedmedia.softseal.gif": {
        source: "iana"
      },
      "image/vnd.sealedmedia.softseal.jpg": {
        source: "iana"
      },
      "image/vnd.svf": {
        source: "iana"
      },
      "image/vnd.tencent.tap": {
        source: "iana",
        extensions: ["tap"]
      },
      "image/vnd.valve.source.texture": {
        source: "iana",
        extensions: ["vtf"]
      },
      "image/vnd.wap.wbmp": {
        source: "iana",
        extensions: ["wbmp"]
      },
      "image/vnd.xiff": {
        source: "iana",
        extensions: ["xif"]
      },
      "image/vnd.zbrush.pcx": {
        source: "iana",
        extensions: ["pcx"]
      },
      "image/webp": {
        source: "apache",
        extensions: ["webp"]
      },
      "image/wmf": {
        source: "iana",
        extensions: ["wmf"]
      },
      "image/x-3ds": {
        source: "apache",
        extensions: ["3ds"]
      },
      "image/x-cmu-raster": {
        source: "apache",
        extensions: ["ras"]
      },
      "image/x-cmx": {
        source: "apache",
        extensions: ["cmx"]
      },
      "image/x-freehand": {
        source: "apache",
        extensions: ["fh", "fhc", "fh4", "fh5", "fh7"]
      },
      "image/x-icon": {
        source: "apache",
        compressible: true,
        extensions: ["ico"]
      },
      "image/x-jng": {
        source: "nginx",
        extensions: ["jng"]
      },
      "image/x-mrsid-image": {
        source: "apache",
        extensions: ["sid"]
      },
      "image/x-ms-bmp": {
        source: "nginx",
        compressible: true,
        extensions: ["bmp"]
      },
      "image/x-pcx": {
        source: "apache",
        extensions: ["pcx"]
      },
      "image/x-pict": {
        source: "apache",
        extensions: ["pic", "pct"]
      },
      "image/x-portable-anymap": {
        source: "apache",
        extensions: ["pnm"]
      },
      "image/x-portable-bitmap": {
        source: "apache",
        extensions: ["pbm"]
      },
      "image/x-portable-graymap": {
        source: "apache",
        extensions: ["pgm"]
      },
      "image/x-portable-pixmap": {
        source: "apache",
        extensions: ["ppm"]
      },
      "image/x-rgb": {
        source: "apache",
        extensions: ["rgb"]
      },
      "image/x-tga": {
        source: "apache",
        extensions: ["tga"]
      },
      "image/x-xbitmap": {
        source: "apache",
        extensions: ["xbm"]
      },
      "image/x-xcf": {
        compressible: false
      },
      "image/x-xpixmap": {
        source: "apache",
        extensions: ["xpm"]
      },
      "image/x-xwindowdump": {
        source: "apache",
        extensions: ["xwd"]
      },
      "message/cpim": {
        source: "iana"
      },
      "message/delivery-status": {
        source: "iana"
      },
      "message/disposition-notification": {
        source: "iana",
        extensions: [
          "disposition-notification"
        ]
      },
      "message/external-body": {
        source: "iana"
      },
      "message/feedback-report": {
        source: "iana"
      },
      "message/global": {
        source: "iana",
        extensions: ["u8msg"]
      },
      "message/global-delivery-status": {
        source: "iana",
        extensions: ["u8dsn"]
      },
      "message/global-disposition-notification": {
        source: "iana",
        extensions: ["u8mdn"]
      },
      "message/global-headers": {
        source: "iana",
        extensions: ["u8hdr"]
      },
      "message/http": {
        source: "iana",
        compressible: false
      },
      "message/imdn+xml": {
        source: "iana",
        compressible: true
      },
      "message/news": {
        source: "iana"
      },
      "message/partial": {
        source: "iana",
        compressible: false
      },
      "message/rfc822": {
        source: "iana",
        compressible: true,
        extensions: ["eml", "mime"]
      },
      "message/s-http": {
        source: "iana"
      },
      "message/sip": {
        source: "iana"
      },
      "message/sipfrag": {
        source: "iana"
      },
      "message/tracking-status": {
        source: "iana"
      },
      "message/vnd.si.simp": {
        source: "iana"
      },
      "message/vnd.wfa.wsc": {
        source: "iana",
        extensions: ["wsc"]
      },
      "model/3mf": {
        source: "iana",
        extensions: ["3mf"]
      },
      "model/e57": {
        source: "iana"
      },
      "model/gltf+json": {
        source: "iana",
        compressible: true,
        extensions: ["gltf"]
      },
      "model/gltf-binary": {
        source: "iana",
        compressible: true,
        extensions: ["glb"]
      },
      "model/iges": {
        source: "iana",
        compressible: false,
        extensions: ["igs", "iges"]
      },
      "model/mesh": {
        source: "iana",
        compressible: false,
        extensions: ["msh", "mesh", "silo"]
      },
      "model/mtl": {
        source: "iana",
        extensions: ["mtl"]
      },
      "model/obj": {
        source: "iana",
        extensions: ["obj"]
      },
      "model/step": {
        source: "iana"
      },
      "model/step+xml": {
        source: "iana",
        compressible: true,
        extensions: ["stpx"]
      },
      "model/step+zip": {
        source: "iana",
        compressible: false,
        extensions: ["stpz"]
      },
      "model/step-xml+zip": {
        source: "iana",
        compressible: false,
        extensions: ["stpxz"]
      },
      "model/stl": {
        source: "iana",
        extensions: ["stl"]
      },
      "model/vnd.collada+xml": {
        source: "iana",
        compressible: true,
        extensions: ["dae"]
      },
      "model/vnd.dwf": {
        source: "iana",
        extensions: ["dwf"]
      },
      "model/vnd.flatland.3dml": {
        source: "iana"
      },
      "model/vnd.gdl": {
        source: "iana",
        extensions: ["gdl"]
      },
      "model/vnd.gs-gdl": {
        source: "apache"
      },
      "model/vnd.gs.gdl": {
        source: "iana"
      },
      "model/vnd.gtw": {
        source: "iana",
        extensions: ["gtw"]
      },
      "model/vnd.moml+xml": {
        source: "iana",
        compressible: true
      },
      "model/vnd.mts": {
        source: "iana",
        extensions: ["mts"]
      },
      "model/vnd.opengex": {
        source: "iana",
        extensions: ["ogex"]
      },
      "model/vnd.parasolid.transmit.binary": {
        source: "iana",
        extensions: ["x_b"]
      },
      "model/vnd.parasolid.transmit.text": {
        source: "iana",
        extensions: ["x_t"]
      },
      "model/vnd.pytha.pyox": {
        source: "iana"
      },
      "model/vnd.rosette.annotated-data-model": {
        source: "iana"
      },
      "model/vnd.sap.vds": {
        source: "iana",
        extensions: ["vds"]
      },
      "model/vnd.usdz+zip": {
        source: "iana",
        compressible: false,
        extensions: ["usdz"]
      },
      "model/vnd.valve.source.compiled-map": {
        source: "iana",
        extensions: ["bsp"]
      },
      "model/vnd.vtu": {
        source: "iana",
        extensions: ["vtu"]
      },
      "model/vrml": {
        source: "iana",
        compressible: false,
        extensions: ["wrl", "vrml"]
      },
      "model/x3d+binary": {
        source: "apache",
        compressible: false,
        extensions: ["x3db", "x3dbz"]
      },
      "model/x3d+fastinfoset": {
        source: "iana",
        extensions: ["x3db"]
      },
      "model/x3d+vrml": {
        source: "apache",
        compressible: false,
        extensions: ["x3dv", "x3dvz"]
      },
      "model/x3d+xml": {
        source: "iana",
        compressible: true,
        extensions: ["x3d", "x3dz"]
      },
      "model/x3d-vrml": {
        source: "iana",
        extensions: ["x3dv"]
      },
      "multipart/alternative": {
        source: "iana",
        compressible: false
      },
      "multipart/appledouble": {
        source: "iana"
      },
      "multipart/byteranges": {
        source: "iana"
      },
      "multipart/digest": {
        source: "iana"
      },
      "multipart/encrypted": {
        source: "iana",
        compressible: false
      },
      "multipart/form-data": {
        source: "iana",
        compressible: false
      },
      "multipart/header-set": {
        source: "iana"
      },
      "multipart/mixed": {
        source: "iana"
      },
      "multipart/multilingual": {
        source: "iana"
      },
      "multipart/parallel": {
        source: "iana"
      },
      "multipart/related": {
        source: "iana",
        compressible: false
      },
      "multipart/report": {
        source: "iana"
      },
      "multipart/signed": {
        source: "iana",
        compressible: false
      },
      "multipart/vnd.bint.med-plus": {
        source: "iana"
      },
      "multipart/voice-message": {
        source: "iana"
      },
      "multipart/x-mixed-replace": {
        source: "iana"
      },
      "text/1d-interleaved-parityfec": {
        source: "iana"
      },
      "text/cache-manifest": {
        source: "iana",
        compressible: true,
        extensions: ["appcache", "manifest"]
      },
      "text/calendar": {
        source: "iana",
        extensions: ["ics", "ifb"]
      },
      "text/calender": {
        compressible: true
      },
      "text/cmd": {
        compressible: true
      },
      "text/coffeescript": {
        extensions: ["coffee", "litcoffee"]
      },
      "text/cql": {
        source: "iana"
      },
      "text/cql-expression": {
        source: "iana"
      },
      "text/cql-identifier": {
        source: "iana"
      },
      "text/css": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
        extensions: ["css"]
      },
      "text/csv": {
        source: "iana",
        compressible: true,
        extensions: ["csv"]
      },
      "text/csv-schema": {
        source: "iana"
      },
      "text/directory": {
        source: "iana"
      },
      "text/dns": {
        source: "iana"
      },
      "text/ecmascript": {
        source: "iana"
      },
      "text/encaprtp": {
        source: "iana"
      },
      "text/enriched": {
        source: "iana"
      },
      "text/fhirpath": {
        source: "iana"
      },
      "text/flexfec": {
        source: "iana"
      },
      "text/fwdred": {
        source: "iana"
      },
      "text/gff3": {
        source: "iana"
      },
      "text/grammar-ref-list": {
        source: "iana"
      },
      "text/html": {
        source: "iana",
        compressible: true,
        extensions: ["html", "htm", "shtml"]
      },
      "text/jade": {
        extensions: ["jade"]
      },
      "text/javascript": {
        source: "iana",
        compressible: true
      },
      "text/jcr-cnd": {
        source: "iana"
      },
      "text/jsx": {
        compressible: true,
        extensions: ["jsx"]
      },
      "text/less": {
        compressible: true,
        extensions: ["less"]
      },
      "text/markdown": {
        source: "iana",
        compressible: true,
        extensions: ["markdown", "md"]
      },
      "text/mathml": {
        source: "nginx",
        extensions: ["mml"]
      },
      "text/mdx": {
        compressible: true,
        extensions: ["mdx"]
      },
      "text/mizar": {
        source: "iana"
      },
      "text/n3": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
        extensions: ["n3"]
      },
      "text/parameters": {
        source: "iana",
        charset: "UTF-8"
      },
      "text/parityfec": {
        source: "iana"
      },
      "text/plain": {
        source: "iana",
        compressible: true,
        extensions: ["txt", "text", "conf", "def", "list", "log", "in", "ini"]
      },
      "text/provenance-notation": {
        source: "iana",
        charset: "UTF-8"
      },
      "text/prs.fallenstein.rst": {
        source: "iana"
      },
      "text/prs.lines.tag": {
        source: "iana",
        extensions: ["dsc"]
      },
      "text/prs.prop.logic": {
        source: "iana"
      },
      "text/raptorfec": {
        source: "iana"
      },
      "text/red": {
        source: "iana"
      },
      "text/rfc822-headers": {
        source: "iana"
      },
      "text/richtext": {
        source: "iana",
        compressible: true,
        extensions: ["rtx"]
      },
      "text/rtf": {
        source: "iana",
        compressible: true,
        extensions: ["rtf"]
      },
      "text/rtp-enc-aescm128": {
        source: "iana"
      },
      "text/rtploopback": {
        source: "iana"
      },
      "text/rtx": {
        source: "iana"
      },
      "text/sgml": {
        source: "iana",
        extensions: ["sgml", "sgm"]
      },
      "text/shaclc": {
        source: "iana"
      },
      "text/shex": {
        source: "iana",
        extensions: ["shex"]
      },
      "text/slim": {
        extensions: ["slim", "slm"]
      },
      "text/spdx": {
        source: "iana",
        extensions: ["spdx"]
      },
      "text/strings": {
        source: "iana"
      },
      "text/stylus": {
        extensions: ["stylus", "styl"]
      },
      "text/t140": {
        source: "iana"
      },
      "text/tab-separated-values": {
        source: "iana",
        compressible: true,
        extensions: ["tsv"]
      },
      "text/troff": {
        source: "iana",
        extensions: ["t", "tr", "roff", "man", "me", "ms"]
      },
      "text/turtle": {
        source: "iana",
        charset: "UTF-8",
        extensions: ["ttl"]
      },
      "text/ulpfec": {
        source: "iana"
      },
      "text/uri-list": {
        source: "iana",
        compressible: true,
        extensions: ["uri", "uris", "urls"]
      },
      "text/vcard": {
        source: "iana",
        compressible: true,
        extensions: ["vcard"]
      },
      "text/vnd.a": {
        source: "iana"
      },
      "text/vnd.abc": {
        source: "iana"
      },
      "text/vnd.ascii-art": {
        source: "iana"
      },
      "text/vnd.curl": {
        source: "iana",
        extensions: ["curl"]
      },
      "text/vnd.curl.dcurl": {
        source: "apache",
        extensions: ["dcurl"]
      },
      "text/vnd.curl.mcurl": {
        source: "apache",
        extensions: ["mcurl"]
      },
      "text/vnd.curl.scurl": {
        source: "apache",
        extensions: ["scurl"]
      },
      "text/vnd.debian.copyright": {
        source: "iana",
        charset: "UTF-8"
      },
      "text/vnd.dmclientscript": {
        source: "iana"
      },
      "text/vnd.dvb.subtitle": {
        source: "iana",
        extensions: ["sub"]
      },
      "text/vnd.esmertec.theme-descriptor": {
        source: "iana",
        charset: "UTF-8"
      },
      "text/vnd.familysearch.gedcom": {
        source: "iana",
        extensions: ["ged"]
      },
      "text/vnd.ficlab.flt": {
        source: "iana"
      },
      "text/vnd.fly": {
        source: "iana",
        extensions: ["fly"]
      },
      "text/vnd.fmi.flexstor": {
        source: "iana",
        extensions: ["flx"]
      },
      "text/vnd.gml": {
        source: "iana"
      },
      "text/vnd.graphviz": {
        source: "iana",
        extensions: ["gv"]
      },
      "text/vnd.hans": {
        source: "iana"
      },
      "text/vnd.hgl": {
        source: "iana"
      },
      "text/vnd.in3d.3dml": {
        source: "iana",
        extensions: ["3dml"]
      },
      "text/vnd.in3d.spot": {
        source: "iana",
        extensions: ["spot"]
      },
      "text/vnd.iptc.newsml": {
        source: "iana"
      },
      "text/vnd.iptc.nitf": {
        source: "iana"
      },
      "text/vnd.latex-z": {
        source: "iana"
      },
      "text/vnd.motorola.reflex": {
        source: "iana"
      },
      "text/vnd.ms-mediapackage": {
        source: "iana"
      },
      "text/vnd.net2phone.commcenter.command": {
        source: "iana"
      },
      "text/vnd.radisys.msml-basic-layout": {
        source: "iana"
      },
      "text/vnd.senx.warpscript": {
        source: "iana"
      },
      "text/vnd.si.uricatalogue": {
        source: "iana"
      },
      "text/vnd.sosi": {
        source: "iana"
      },
      "text/vnd.sun.j2me.app-descriptor": {
        source: "iana",
        charset: "UTF-8",
        extensions: ["jad"]
      },
      "text/vnd.trolltech.linguist": {
        source: "iana",
        charset: "UTF-8"
      },
      "text/vnd.wap.si": {
        source: "iana"
      },
      "text/vnd.wap.sl": {
        source: "iana"
      },
      "text/vnd.wap.wml": {
        source: "iana",
        extensions: ["wml"]
      },
      "text/vnd.wap.wmlscript": {
        source: "iana",
        extensions: ["wmls"]
      },
      "text/vtt": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
        extensions: ["vtt"]
      },
      "text/x-asm": {
        source: "apache",
        extensions: ["s", "asm"]
      },
      "text/x-c": {
        source: "apache",
        extensions: ["c", "cc", "cxx", "cpp", "h", "hh", "dic"]
      },
      "text/x-component": {
        source: "nginx",
        extensions: ["htc"]
      },
      "text/x-fortran": {
        source: "apache",
        extensions: ["f", "for", "f77", "f90"]
      },
      "text/x-gwt-rpc": {
        compressible: true
      },
      "text/x-handlebars-template": {
        extensions: ["hbs"]
      },
      "text/x-java-source": {
        source: "apache",
        extensions: ["java"]
      },
      "text/x-jquery-tmpl": {
        compressible: true
      },
      "text/x-lua": {
        extensions: ["lua"]
      },
      "text/x-markdown": {
        compressible: true,
        extensions: ["mkd"]
      },
      "text/x-nfo": {
        source: "apache",
        extensions: ["nfo"]
      },
      "text/x-opml": {
        source: "apache",
        extensions: ["opml"]
      },
      "text/x-org": {
        compressible: true,
        extensions: ["org"]
      },
      "text/x-pascal": {
        source: "apache",
        extensions: ["p", "pas"]
      },
      "text/x-processing": {
        compressible: true,
        extensions: ["pde"]
      },
      "text/x-sass": {
        extensions: ["sass"]
      },
      "text/x-scss": {
        extensions: ["scss"]
      },
      "text/x-setext": {
        source: "apache",
        extensions: ["etx"]
      },
      "text/x-sfv": {
        source: "apache",
        extensions: ["sfv"]
      },
      "text/x-suse-ymp": {
        compressible: true,
        extensions: ["ymp"]
      },
      "text/x-uuencode": {
        source: "apache",
        extensions: ["uu"]
      },
      "text/x-vcalendar": {
        source: "apache",
        extensions: ["vcs"]
      },
      "text/x-vcard": {
        source: "apache",
        extensions: ["vcf"]
      },
      "text/xml": {
        source: "iana",
        compressible: true,
        extensions: ["xml"]
      },
      "text/xml-external-parsed-entity": {
        source: "iana"
      },
      "text/yaml": {
        compressible: true,
        extensions: ["yaml", "yml"]
      },
      "video/1d-interleaved-parityfec": {
        source: "iana"
      },
      "video/3gpp": {
        source: "iana",
        extensions: ["3gp", "3gpp"]
      },
      "video/3gpp-tt": {
        source: "iana"
      },
      "video/3gpp2": {
        source: "iana",
        extensions: ["3g2"]
      },
      "video/av1": {
        source: "iana"
      },
      "video/bmpeg": {
        source: "iana"
      },
      "video/bt656": {
        source: "iana"
      },
      "video/celb": {
        source: "iana"
      },
      "video/dv": {
        source: "iana"
      },
      "video/encaprtp": {
        source: "iana"
      },
      "video/ffv1": {
        source: "iana"
      },
      "video/flexfec": {
        source: "iana"
      },
      "video/h261": {
        source: "iana",
        extensions: ["h261"]
      },
      "video/h263": {
        source: "iana",
        extensions: ["h263"]
      },
      "video/h263-1998": {
        source: "iana"
      },
      "video/h263-2000": {
        source: "iana"
      },
      "video/h264": {
        source: "iana",
        extensions: ["h264"]
      },
      "video/h264-rcdo": {
        source: "iana"
      },
      "video/h264-svc": {
        source: "iana"
      },
      "video/h265": {
        source: "iana"
      },
      "video/iso.segment": {
        source: "iana",
        extensions: ["m4s"]
      },
      "video/jpeg": {
        source: "iana",
        extensions: ["jpgv"]
      },
      "video/jpeg2000": {
        source: "iana"
      },
      "video/jpm": {
        source: "apache",
        extensions: ["jpm", "jpgm"]
      },
      "video/jxsv": {
        source: "iana"
      },
      "video/mj2": {
        source: "iana",
        extensions: ["mj2", "mjp2"]
      },
      "video/mp1s": {
        source: "iana"
      },
      "video/mp2p": {
        source: "iana"
      },
      "video/mp2t": {
        source: "iana",
        extensions: ["ts"]
      },
      "video/mp4": {
        source: "iana",
        compressible: false,
        extensions: ["mp4", "mp4v", "mpg4"]
      },
      "video/mp4v-es": {
        source: "iana"
      },
      "video/mpeg": {
        source: "iana",
        compressible: false,
        extensions: ["mpeg", "mpg", "mpe", "m1v", "m2v"]
      },
      "video/mpeg4-generic": {
        source: "iana"
      },
      "video/mpv": {
        source: "iana"
      },
      "video/nv": {
        source: "iana"
      },
      "video/ogg": {
        source: "iana",
        compressible: false,
        extensions: ["ogv"]
      },
      "video/parityfec": {
        source: "iana"
      },
      "video/pointer": {
        source: "iana"
      },
      "video/quicktime": {
        source: "iana",
        compressible: false,
        extensions: ["qt", "mov"]
      },
      "video/raptorfec": {
        source: "iana"
      },
      "video/raw": {
        source: "iana"
      },
      "video/rtp-enc-aescm128": {
        source: "iana"
      },
      "video/rtploopback": {
        source: "iana"
      },
      "video/rtx": {
        source: "iana"
      },
      "video/scip": {
        source: "iana"
      },
      "video/smpte291": {
        source: "iana"
      },
      "video/smpte292m": {
        source: "iana"
      },
      "video/ulpfec": {
        source: "iana"
      },
      "video/vc1": {
        source: "iana"
      },
      "video/vc2": {
        source: "iana"
      },
      "video/vnd.cctv": {
        source: "iana"
      },
      "video/vnd.dece.hd": {
        source: "iana",
        extensions: ["uvh", "uvvh"]
      },
      "video/vnd.dece.mobile": {
        source: "iana",
        extensions: ["uvm", "uvvm"]
      },
      "video/vnd.dece.mp4": {
        source: "iana"
      },
      "video/vnd.dece.pd": {
        source: "iana",
        extensions: ["uvp", "uvvp"]
      },
      "video/vnd.dece.sd": {
        source: "iana",
        extensions: ["uvs", "uvvs"]
      },
      "video/vnd.dece.video": {
        source: "iana",
        extensions: ["uvv", "uvvv"]
      },
      "video/vnd.directv.mpeg": {
        source: "iana"
      },
      "video/vnd.directv.mpeg-tts": {
        source: "iana"
      },
      "video/vnd.dlna.mpeg-tts": {
        source: "iana"
      },
      "video/vnd.dvb.file": {
        source: "iana",
        extensions: ["dvb"]
      },
      "video/vnd.fvt": {
        source: "iana",
        extensions: ["fvt"]
      },
      "video/vnd.hns.video": {
        source: "iana"
      },
      "video/vnd.iptvforum.1dparityfec-1010": {
        source: "iana"
      },
      "video/vnd.iptvforum.1dparityfec-2005": {
        source: "iana"
      },
      "video/vnd.iptvforum.2dparityfec-1010": {
        source: "iana"
      },
      "video/vnd.iptvforum.2dparityfec-2005": {
        source: "iana"
      },
      "video/vnd.iptvforum.ttsavc": {
        source: "iana"
      },
      "video/vnd.iptvforum.ttsmpeg2": {
        source: "iana"
      },
      "video/vnd.motorola.video": {
        source: "iana"
      },
      "video/vnd.motorola.videop": {
        source: "iana"
      },
      "video/vnd.mpegurl": {
        source: "iana",
        extensions: ["mxu", "m4u"]
      },
      "video/vnd.ms-playready.media.pyv": {
        source: "iana",
        extensions: ["pyv"]
      },
      "video/vnd.nokia.interleaved-multimedia": {
        source: "iana"
      },
      "video/vnd.nokia.mp4vr": {
        source: "iana"
      },
      "video/vnd.nokia.videovoip": {
        source: "iana"
      },
      "video/vnd.objectvideo": {
        source: "iana"
      },
      "video/vnd.radgamettools.bink": {
        source: "iana"
      },
      "video/vnd.radgamettools.smacker": {
        source: "iana"
      },
      "video/vnd.sealed.mpeg1": {
        source: "iana"
      },
      "video/vnd.sealed.mpeg4": {
        source: "iana"
      },
      "video/vnd.sealed.swf": {
        source: "iana"
      },
      "video/vnd.sealedmedia.softseal.mov": {
        source: "iana"
      },
      "video/vnd.uvvu.mp4": {
        source: "iana",
        extensions: ["uvu", "uvvu"]
      },
      "video/vnd.vivo": {
        source: "iana",
        extensions: ["viv"]
      },
      "video/vnd.youtube.yt": {
        source: "iana"
      },
      "video/vp8": {
        source: "iana"
      },
      "video/vp9": {
        source: "iana"
      },
      "video/webm": {
        source: "apache",
        compressible: false,
        extensions: ["webm"]
      },
      "video/x-f4v": {
        source: "apache",
        extensions: ["f4v"]
      },
      "video/x-fli": {
        source: "apache",
        extensions: ["fli"]
      },
      "video/x-flv": {
        source: "apache",
        compressible: false,
        extensions: ["flv"]
      },
      "video/x-m4v": {
        source: "apache",
        extensions: ["m4v"]
      },
      "video/x-matroska": {
        source: "apache",
        compressible: false,
        extensions: ["mkv", "mk3d", "mks"]
      },
      "video/x-mng": {
        source: "apache",
        extensions: ["mng"]
      },
      "video/x-ms-asf": {
        source: "apache",
        extensions: ["asf", "asx"]
      },
      "video/x-ms-vob": {
        source: "apache",
        extensions: ["vob"]
      },
      "video/x-ms-wm": {
        source: "apache",
        extensions: ["wm"]
      },
      "video/x-ms-wmv": {
        source: "apache",
        compressible: false,
        extensions: ["wmv"]
      },
      "video/x-ms-wmx": {
        source: "apache",
        extensions: ["wmx"]
      },
      "video/x-ms-wvx": {
        source: "apache",
        extensions: ["wvx"]
      },
      "video/x-msvideo": {
        source: "apache",
        extensions: ["avi"]
      },
      "video/x-sgi-movie": {
        source: "apache",
        extensions: ["movie"]
      },
      "video/x-smv": {
        source: "apache",
        extensions: ["smv"]
      },
      "x-conference/x-cooltalk": {
        source: "apache",
        extensions: ["ice"]
      },
      "x-shader/x-fragment": {
        compressible: true
      },
      "x-shader/x-vertex": {
        compressible: true
      }
    };
  }
});

// node_modules/mime-db/index.js
var require_mime_db = __commonJS({
  "node_modules/mime-db/index.js"(exports, module2) {
    module2.exports = require_db();
  }
});

// node_modules/mime-types/index.js
var require_mime_types = __commonJS({
  "node_modules/mime-types/index.js"(exports) {
    "use strict";
    var db = require_mime_db();
    var extname = require("path").extname;
    var EXTRACT_TYPE_REGEXP = /^\s*([^;\s]*)(?:;|\s|$)/;
    var TEXT_TYPE_REGEXP = /^text\//i;
    exports.charset = charset;
    exports.charsets = { lookup: charset };
    exports.contentType = contentType;
    exports.extension = extension;
    exports.extensions = /* @__PURE__ */ Object.create(null);
    exports.lookup = lookup;
    exports.types = /* @__PURE__ */ Object.create(null);
    populateMaps(exports.extensions, exports.types);
    function charset(type) {
      if (!type || typeof type !== "string") {
        return false;
      }
      var match = EXTRACT_TYPE_REGEXP.exec(type);
      var mime = match && db[match[1].toLowerCase()];
      if (mime && mime.charset) {
        return mime.charset;
      }
      if (match && TEXT_TYPE_REGEXP.test(match[1])) {
        return "UTF-8";
      }
      return false;
    }
    function contentType(str) {
      if (!str || typeof str !== "string") {
        return false;
      }
      var mime = str.indexOf("/") === -1 ? exports.lookup(str) : str;
      if (!mime) {
        return false;
      }
      if (mime.indexOf("charset") === -1) {
        var charset2 = exports.charset(mime);
        if (charset2)
          mime += "; charset=" + charset2.toLowerCase();
      }
      return mime;
    }
    function extension(type) {
      if (!type || typeof type !== "string") {
        return false;
      }
      var match = EXTRACT_TYPE_REGEXP.exec(type);
      var exts = match && exports.extensions[match[1].toLowerCase()];
      if (!exts || !exts.length) {
        return false;
      }
      return exts[0];
    }
    function lookup(path5) {
      if (!path5 || typeof path5 !== "string") {
        return false;
      }
      var extension2 = extname("x." + path5).toLowerCase().substr(1);
      if (!extension2) {
        return false;
      }
      return exports.types[extension2] || false;
    }
    function populateMaps(extensions, types) {
      var preference = ["nginx", "apache", void 0, "iana"];
      Object.keys(db).forEach(function forEachMimeType(type) {
        var mime = db[type];
        var exts = mime.extensions;
        if (!exts || !exts.length) {
          return;
        }
        extensions[type] = exts;
        for (var i2 = 0; i2 < exts.length; i2++) {
          var extension2 = exts[i2];
          if (types[extension2]) {
            var from = preference.indexOf(db[types[extension2]].source);
            var to = preference.indexOf(mime.source);
            if (types[extension2] !== "application/octet-stream" && (from > to || from === to && types[extension2].substr(0, 12) === "application/")) {
              continue;
            }
          }
          types[extension2] = type;
        }
      });
    }
  }
});

// node_modules/asynckit/lib/defer.js
var require_defer = __commonJS({
  "node_modules/asynckit/lib/defer.js"(exports, module2) {
    module2.exports = defer;
    function defer(fn) {
      var nextTick = typeof setImmediate == "function" ? setImmediate : typeof process == "object" && typeof process.nextTick == "function" ? process.nextTick : null;
      if (nextTick) {
        nextTick(fn);
      } else {
        setTimeout(fn, 0);
      }
    }
  }
});

// node_modules/asynckit/lib/async.js
var require_async = __commonJS({
  "node_modules/asynckit/lib/async.js"(exports, module2) {
    var defer = require_defer();
    module2.exports = async;
    function async(callback) {
      var isAsync = false;
      defer(function() {
        isAsync = true;
      });
      return function async_callback(err, result) {
        if (isAsync) {
          callback(err, result);
        } else {
          defer(function nextTick_callback() {
            callback(err, result);
          });
        }
      };
    }
  }
});

// node_modules/asynckit/lib/abort.js
var require_abort = __commonJS({
  "node_modules/asynckit/lib/abort.js"(exports, module2) {
    module2.exports = abort;
    function abort(state) {
      Object.keys(state.jobs).forEach(clean.bind(state));
      state.jobs = {};
    }
    function clean(key) {
      if (typeof this.jobs[key] == "function") {
        this.jobs[key]();
      }
    }
  }
});

// node_modules/asynckit/lib/iterate.js
var require_iterate = __commonJS({
  "node_modules/asynckit/lib/iterate.js"(exports, module2) {
    var async = require_async();
    var abort = require_abort();
    module2.exports = iterate;
    function iterate(list, iterator, state, callback) {
      var key = state["keyedList"] ? state["keyedList"][state.index] : state.index;
      state.jobs[key] = runJob(iterator, key, list[key], function(error, output) {
        if (!(key in state.jobs)) {
          return;
        }
        delete state.jobs[key];
        if (error) {
          abort(state);
        } else {
          state.results[key] = output;
        }
        callback(error, state.results);
      });
    }
    function runJob(iterator, key, item, callback) {
      var aborter;
      if (iterator.length == 2) {
        aborter = iterator(item, async(callback));
      } else {
        aborter = iterator(item, key, async(callback));
      }
      return aborter;
    }
  }
});

// node_modules/asynckit/lib/state.js
var require_state = __commonJS({
  "node_modules/asynckit/lib/state.js"(exports, module2) {
    module2.exports = state;
    function state(list, sortMethod) {
      var isNamedList = !Array.isArray(list), initState = {
        index: 0,
        keyedList: isNamedList || sortMethod ? Object.keys(list) : null,
        jobs: {},
        results: isNamedList ? {} : [],
        size: isNamedList ? Object.keys(list).length : list.length
      };
      if (sortMethod) {
        initState.keyedList.sort(isNamedList ? sortMethod : function(a2, b6) {
          return sortMethod(list[a2], list[b6]);
        });
      }
      return initState;
    }
  }
});

// node_modules/asynckit/lib/terminator.js
var require_terminator = __commonJS({
  "node_modules/asynckit/lib/terminator.js"(exports, module2) {
    var abort = require_abort();
    var async = require_async();
    module2.exports = terminator;
    function terminator(callback) {
      if (!Object.keys(this.jobs).length) {
        return;
      }
      this.index = this.size;
      abort(this);
      async(callback)(null, this.results);
    }
  }
});

// node_modules/asynckit/parallel.js
var require_parallel = __commonJS({
  "node_modules/asynckit/parallel.js"(exports, module2) {
    var iterate = require_iterate();
    var initState = require_state();
    var terminator = require_terminator();
    module2.exports = parallel;
    function parallel(list, iterator, callback) {
      var state = initState(list);
      while (state.index < (state["keyedList"] || list).length) {
        iterate(list, iterator, state, function(error, result) {
          if (error) {
            callback(error, result);
            return;
          }
          if (Object.keys(state.jobs).length === 0) {
            callback(null, state.results);
            return;
          }
        });
        state.index++;
      }
      return terminator.bind(state, callback);
    }
  }
});

// node_modules/asynckit/serialOrdered.js
var require_serialOrdered = __commonJS({
  "node_modules/asynckit/serialOrdered.js"(exports, module2) {
    var iterate = require_iterate();
    var initState = require_state();
    var terminator = require_terminator();
    module2.exports = serialOrdered;
    module2.exports.ascending = ascending;
    module2.exports.descending = descending;
    function serialOrdered(list, iterator, sortMethod, callback) {
      var state = initState(list, sortMethod);
      iterate(list, iterator, state, function iteratorHandler(error, result) {
        if (error) {
          callback(error, result);
          return;
        }
        state.index++;
        if (state.index < (state["keyedList"] || list).length) {
          iterate(list, iterator, state, iteratorHandler);
          return;
        }
        callback(null, state.results);
      });
      return terminator.bind(state, callback);
    }
    function ascending(a2, b6) {
      return a2 < b6 ? -1 : a2 > b6 ? 1 : 0;
    }
    function descending(a2, b6) {
      return -1 * ascending(a2, b6);
    }
  }
});

// node_modules/asynckit/serial.js
var require_serial = __commonJS({
  "node_modules/asynckit/serial.js"(exports, module2) {
    var serialOrdered = require_serialOrdered();
    module2.exports = serial;
    function serial(list, iterator, callback) {
      return serialOrdered(list, iterator, null, callback);
    }
  }
});

// node_modules/asynckit/index.js
var require_asynckit = __commonJS({
  "node_modules/asynckit/index.js"(exports, module2) {
    module2.exports = {
      parallel: require_parallel(),
      serial: require_serial(),
      serialOrdered: require_serialOrdered()
    };
  }
});

// node_modules/form-data/lib/populate.js
var require_populate = __commonJS({
  "node_modules/form-data/lib/populate.js"(exports, module2) {
    module2.exports = function(dst, src) {
      Object.keys(src).forEach(function(prop) {
        dst[prop] = dst[prop] || src[prop];
      });
      return dst;
    };
  }
});

// node_modules/form-data/lib/form_data.js
var require_form_data = __commonJS({
  "node_modules/form-data/lib/form_data.js"(exports, module2) {
    var CombinedStream = require_combined_stream();
    var util2 = require("util");
    var path5 = require("path");
    var http2 = require("http");
    var https2 = require("https");
    var parseUrl = require("url").parse;
    var fs4 = require("fs");
    var Stream = require("stream").Stream;
    var mime = require_mime_types();
    var asynckit = require_asynckit();
    var populate = require_populate();
    module2.exports = FormData3;
    util2.inherits(FormData3, CombinedStream);
    function FormData3(options) {
      if (!(this instanceof FormData3)) {
        return new FormData3(options);
      }
      this._overheadLength = 0;
      this._valueLength = 0;
      this._valuesToMeasure = [];
      CombinedStream.call(this);
      options = options || {};
      for (var option in options) {
        this[option] = options[option];
      }
    }
    FormData3.LINE_BREAK = "\r\n";
    FormData3.DEFAULT_CONTENT_TYPE = "application/octet-stream";
    FormData3.prototype.append = function(field, value, options) {
      options = options || {};
      if (typeof options == "string") {
        options = { filename: options };
      }
      var append2 = CombinedStream.prototype.append.bind(this);
      if (typeof value == "number") {
        value = "" + value;
      }
      if (util2.isArray(value)) {
        this._error(new Error("Arrays are not supported."));
        return;
      }
      var header = this._multiPartHeader(field, value, options);
      var footer = this._multiPartFooter();
      append2(header);
      append2(value);
      append2(footer);
      this._trackLength(header, value, options);
    };
    FormData3.prototype._trackLength = function(header, value, options) {
      var valueLength = 0;
      if (options.knownLength != null) {
        valueLength += +options.knownLength;
      } else if (Buffer.isBuffer(value)) {
        valueLength = value.length;
      } else if (typeof value === "string") {
        valueLength = Buffer.byteLength(value);
      }
      this._valueLength += valueLength;
      this._overheadLength += Buffer.byteLength(header) + FormData3.LINE_BREAK.length;
      if (!value || !value.path && !(value.readable && value.hasOwnProperty("httpVersion")) && !(value instanceof Stream)) {
        return;
      }
      if (!options.knownLength) {
        this._valuesToMeasure.push(value);
      }
    };
    FormData3.prototype._lengthRetriever = function(value, callback) {
      if (value.hasOwnProperty("fd")) {
        if (value.end != void 0 && value.end != Infinity && value.start != void 0) {
          callback(null, value.end + 1 - (value.start ? value.start : 0));
        } else {
          fs4.stat(value.path, function(err, stat) {
            var fileSize;
            if (err) {
              callback(err);
              return;
            }
            fileSize = stat.size - (value.start ? value.start : 0);
            callback(null, fileSize);
          });
        }
      } else if (value.hasOwnProperty("httpVersion")) {
        callback(null, +value.headers["content-length"]);
      } else if (value.hasOwnProperty("httpModule")) {
        value.on("response", function(response) {
          value.pause();
          callback(null, +response.headers["content-length"]);
        });
        value.resume();
      } else {
        callback("Unknown stream");
      }
    };
    FormData3.prototype._multiPartHeader = function(field, value, options) {
      if (typeof options.header == "string") {
        return options.header;
      }
      var contentDisposition = this._getContentDisposition(value, options);
      var contentType = this._getContentType(value, options);
      var contents = "";
      var headers = {
        "Content-Disposition": ["form-data", 'name="' + field + '"'].concat(contentDisposition || []),
        "Content-Type": [].concat(contentType || [])
      };
      if (typeof options.header == "object") {
        populate(headers, options.header);
      }
      var header;
      for (var prop in headers) {
        if (!headers.hasOwnProperty(prop))
          continue;
        header = headers[prop];
        if (header == null) {
          continue;
        }
        if (!Array.isArray(header)) {
          header = [header];
        }
        if (header.length) {
          contents += prop + ": " + header.join("; ") + FormData3.LINE_BREAK;
        }
      }
      return "--" + this.getBoundary() + FormData3.LINE_BREAK + contents + FormData3.LINE_BREAK;
    };
    FormData3.prototype._getContentDisposition = function(value, options) {
      var filename, contentDisposition;
      if (typeof options.filepath === "string") {
        filename = path5.normalize(options.filepath).replace(/\\/g, "/");
      } else if (options.filename || value.name || value.path) {
        filename = path5.basename(options.filename || value.name || value.path);
      } else if (value.readable && value.hasOwnProperty("httpVersion")) {
        filename = path5.basename(value.client._httpMessage.path || "");
      }
      if (filename) {
        contentDisposition = 'filename="' + filename + '"';
      }
      return contentDisposition;
    };
    FormData3.prototype._getContentType = function(value, options) {
      var contentType = options.contentType;
      if (!contentType && value.name) {
        contentType = mime.lookup(value.name);
      }
      if (!contentType && value.path) {
        contentType = mime.lookup(value.path);
      }
      if (!contentType && value.readable && value.hasOwnProperty("httpVersion")) {
        contentType = value.headers["content-type"];
      }
      if (!contentType && (options.filepath || options.filename)) {
        contentType = mime.lookup(options.filepath || options.filename);
      }
      if (!contentType && typeof value == "object") {
        contentType = FormData3.DEFAULT_CONTENT_TYPE;
      }
      return contentType;
    };
    FormData3.prototype._multiPartFooter = function() {
      return function(next) {
        var footer = FormData3.LINE_BREAK;
        var lastPart = this._streams.length === 0;
        if (lastPart) {
          footer += this._lastBoundary();
        }
        next(footer);
      }.bind(this);
    };
    FormData3.prototype._lastBoundary = function() {
      return "--" + this.getBoundary() + "--" + FormData3.LINE_BREAK;
    };
    FormData3.prototype.getHeaders = function(userHeaders) {
      var header;
      var formHeaders = {
        "content-type": "multipart/form-data; boundary=" + this.getBoundary()
      };
      for (header in userHeaders) {
        if (userHeaders.hasOwnProperty(header)) {
          formHeaders[header.toLowerCase()] = userHeaders[header];
        }
      }
      return formHeaders;
    };
    FormData3.prototype.setBoundary = function(boundary) {
      this._boundary = boundary;
    };
    FormData3.prototype.getBoundary = function() {
      if (!this._boundary) {
        this._generateBoundary();
      }
      return this._boundary;
    };
    FormData3.prototype.getBuffer = function() {
      var dataBuffer = new Buffer.alloc(0);
      var boundary = this.getBoundary();
      for (var i2 = 0, len = this._streams.length; i2 < len; i2++) {
        if (typeof this._streams[i2] !== "function") {
          if (Buffer.isBuffer(this._streams[i2])) {
            dataBuffer = Buffer.concat([dataBuffer, this._streams[i2]]);
          } else {
            dataBuffer = Buffer.concat([dataBuffer, Buffer.from(this._streams[i2])]);
          }
          if (typeof this._streams[i2] !== "string" || this._streams[i2].substring(2, boundary.length + 2) !== boundary) {
            dataBuffer = Buffer.concat([dataBuffer, Buffer.from(FormData3.LINE_BREAK)]);
          }
        }
      }
      return Buffer.concat([dataBuffer, Buffer.from(this._lastBoundary())]);
    };
    FormData3.prototype._generateBoundary = function() {
      var boundary = "--------------------------";
      for (var i2 = 0; i2 < 24; i2++) {
        boundary += Math.floor(Math.random() * 10).toString(16);
      }
      this._boundary = boundary;
    };
    FormData3.prototype.getLengthSync = function() {
      var knownLength = this._overheadLength + this._valueLength;
      if (this._streams.length) {
        knownLength += this._lastBoundary().length;
      }
      if (!this.hasKnownLength()) {
        this._error(new Error("Cannot calculate proper length in synchronous way."));
      }
      return knownLength;
    };
    FormData3.prototype.hasKnownLength = function() {
      var hasKnownLength = true;
      if (this._valuesToMeasure.length) {
        hasKnownLength = false;
      }
      return hasKnownLength;
    };
    FormData3.prototype.getLength = function(cb) {
      var knownLength = this._overheadLength + this._valueLength;
      if (this._streams.length) {
        knownLength += this._lastBoundary().length;
      }
      if (!this._valuesToMeasure.length) {
        process.nextTick(cb.bind(this, null, knownLength));
        return;
      }
      asynckit.parallel(this._valuesToMeasure, this._lengthRetriever, function(err, values) {
        if (err) {
          cb(err);
          return;
        }
        values.forEach(function(length) {
          knownLength += length;
        });
        cb(null, knownLength);
      });
    };
    FormData3.prototype.submit = function(params, cb) {
      var request, options, defaults2 = { method: "post" };
      if (typeof params == "string") {
        params = parseUrl(params);
        options = populate({
          port: params.port,
          path: params.pathname,
          host: params.hostname,
          protocol: params.protocol
        }, defaults2);
      } else {
        options = populate(params, defaults2);
        if (!options.port) {
          options.port = options.protocol == "https:" ? 443 : 80;
        }
      }
      options.headers = this.getHeaders(params.headers);
      if (options.protocol == "https:") {
        request = https2.request(options);
      } else {
        request = http2.request(options);
      }
      this.getLength(function(err, length) {
        if (err && err !== "Unknown stream") {
          this._error(err);
          return;
        }
        if (length) {
          request.setHeader("Content-Length", length);
        }
        this.pipe(request);
        if (cb) {
          var onResponse;
          var callback = function(error, responce) {
            request.removeListener("error", callback);
            request.removeListener("response", onResponse);
            return cb.call(this, error, responce);
          };
          onResponse = callback.bind(this, null);
          request.on("error", callback);
          request.on("response", onResponse);
        }
      }.bind(this));
      return request;
    };
    FormData3.prototype._error = function(err) {
      if (!this.error) {
        this.error = err;
        this.pause();
        this.emit("error", err);
      }
    };
    FormData3.prototype.toString = function() {
      return "[object FormData]";
    };
  }
});

// node_modules/openai/dist/configuration.js
var require_configuration = __commonJS({
  "node_modules/openai/dist/configuration.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Configuration = void 0;
    var packageJson = require_package();
    var Configuration = class {
      constructor(param = {}) {
        this.apiKey = param.apiKey;
        this.organization = param.organization;
        this.username = param.username;
        this.password = param.password;
        this.accessToken = param.accessToken;
        this.basePath = param.basePath;
        this.baseOptions = param.baseOptions;
        this.formDataCtor = param.formDataCtor;
        if (!this.baseOptions) {
          this.baseOptions = {};
        }
        this.baseOptions.headers = Object.assign({ "User-Agent": `OpenAI/NodeJS/${packageJson.version}`, "Authorization": `Bearer ${this.apiKey}` }, this.baseOptions.headers);
        if (this.organization) {
          this.baseOptions.headers["OpenAI-Organization"] = this.organization;
        }
        if (!this.formDataCtor) {
          this.formDataCtor = require_form_data();
        }
      }
      isJsonMime(mime) {
        const jsonMime = new RegExp("^(application/json|[^;/ 	]+/[^;/ 	]+[+]json)[ 	]*(;.*)?$", "i");
        return mime !== null && (jsonMime.test(mime) || mime.toLowerCase() === "application/json-patch+json");
      }
    };
    exports.Configuration = Configuration;
  }
});

// node_modules/openai/dist/index.js
var require_dist = __commonJS({
  "node_modules/openai/dist/index.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o2, m4, k6, k22) {
      if (k22 === void 0)
        k22 = k6;
      Object.defineProperty(o2, k22, { enumerable: true, get: function() {
        return m4[k6];
      } });
    } : function(o2, m4, k6, k22) {
      if (k22 === void 0)
        k22 = k6;
      o2[k22] = m4[k6];
    });
    var __exportStar = exports && exports.__exportStar || function(m4, exports2) {
      for (var p4 in m4)
        if (p4 !== "default" && !exports2.hasOwnProperty(p4))
          __createBinding(exports2, m4, p4);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    __exportStar(require_api(), exports);
    __exportStar(require_configuration(), exports);
  }
});

// node_modules/proxy-from-env/index.js
var require_proxy_from_env = __commonJS({
  "node_modules/proxy-from-env/index.js"(exports) {
    "use strict";
    var parseUrl = require("url").parse;
    var DEFAULT_PORTS = {
      ftp: 21,
      gopher: 70,
      http: 80,
      https: 443,
      ws: 80,
      wss: 443
    };
    var stringEndsWith = String.prototype.endsWith || function(s) {
      return s.length <= this.length && this.indexOf(s, this.length - s.length) !== -1;
    };
    function getProxyForUrl2(url3) {
      var parsedUrl = typeof url3 === "string" ? parseUrl(url3) : url3 || {};
      var proto2 = parsedUrl.protocol;
      var hostname = parsedUrl.host;
      var port = parsedUrl.port;
      if (typeof hostname !== "string" || !hostname || typeof proto2 !== "string") {
        return "";
      }
      proto2 = proto2.split(":", 1)[0];
      hostname = hostname.replace(/:\d*$/, "");
      port = parseInt(port) || DEFAULT_PORTS[proto2] || 0;
      if (!shouldProxy(hostname, port)) {
        return "";
      }
      var proxy = getEnv2("npm_config_" + proto2 + "_proxy") || getEnv2(proto2 + "_proxy") || getEnv2("npm_config_proxy") || getEnv2("all_proxy");
      if (proxy && proxy.indexOf("://") === -1) {
        proxy = proto2 + "://" + proxy;
      }
      return proxy;
    }
    function shouldProxy(hostname, port) {
      var NO_PROXY = (getEnv2("npm_config_no_proxy") || getEnv2("no_proxy")).toLowerCase();
      if (!NO_PROXY) {
        return true;
      }
      if (NO_PROXY === "*") {
        return false;
      }
      return NO_PROXY.split(/[,\s]/).every(function(proxy) {
        if (!proxy) {
          return true;
        }
        var parsedProxy = proxy.match(/^(.+):(\d+)$/);
        var parsedProxyHostname = parsedProxy ? parsedProxy[1] : proxy;
        var parsedProxyPort = parsedProxy ? parseInt(parsedProxy[2]) : 0;
        if (parsedProxyPort && parsedProxyPort !== port) {
          return true;
        }
        if (!/^[.*]/.test(parsedProxyHostname)) {
          return hostname !== parsedProxyHostname;
        }
        if (parsedProxyHostname.charAt(0) === "*") {
          parsedProxyHostname = parsedProxyHostname.slice(1);
        }
        return !stringEndsWith.call(hostname, parsedProxyHostname);
      });
    }
    function getEnv2(key) {
      return process.env[key.toLowerCase()] || process.env[key.toUpperCase()] || "";
    }
    exports.getProxyForUrl = getProxyForUrl2;
  }
});

// node_modules/dotenv/package.json
var require_package2 = __commonJS({
  "node_modules/dotenv/package.json"(exports, module2) {
    module2.exports = {
      name: "dotenv",
      version: "16.3.2",
      description: "Loads environment variables from .env file",
      main: "lib/main.js",
      types: "lib/main.d.ts",
      exports: {
        ".": {
          types: "./lib/main.d.ts",
          require: "./lib/main.js",
          default: "./lib/main.js"
        },
        "./config": "./config.js",
        "./config.js": "./config.js",
        "./lib/env-options": "./lib/env-options.js",
        "./lib/env-options.js": "./lib/env-options.js",
        "./lib/cli-options": "./lib/cli-options.js",
        "./lib/cli-options.js": "./lib/cli-options.js",
        "./package.json": "./package.json"
      },
      scripts: {
        "dts-check": "tsc --project tests/types/tsconfig.json",
        lint: "standard",
        "lint-readme": "standard-markdown",
        pretest: "npm run lint && npm run dts-check",
        test: "tap tests/*.js --100 -Rspec",
        prerelease: "npm test",
        release: "standard-version"
      },
      repository: {
        type: "git",
        url: "git://github.com/motdotla/dotenv.git"
      },
      funding: "https://github.com/motdotla/dotenv?sponsor=1",
      keywords: [
        "dotenv",
        "env",
        ".env",
        "environment",
        "variables",
        "config",
        "settings"
      ],
      readmeFilename: "README.md",
      license: "BSD-2-Clause",
      devDependencies: {
        "@definitelytyped/dtslint": "^0.0.133",
        "@types/node": "^18.11.3",
        decache: "^4.6.1",
        sinon: "^14.0.1",
        standard: "^17.0.0",
        "standard-markdown": "^7.1.0",
        "standard-version": "^9.5.0",
        tap: "^16.3.0",
        tar: "^6.1.11",
        typescript: "^4.8.4"
      },
      engines: {
        node: ">=12"
      },
      browser: {
        fs: false
      }
    };
  }
});

// node_modules/dotenv/lib/main.js
var require_main = __commonJS({
  "node_modules/dotenv/lib/main.js"(exports, module2) {
    var fs4 = require("fs");
    var path5 = require("path");
    var os3 = require("os");
    var crypto2 = require("crypto");
    var packageJson = require_package2();
    var version = packageJson.version;
    var LINE = /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/mg;
    function parse(src) {
      const obj = {};
      let lines = src.toString();
      lines = lines.replace(/\r\n?/mg, "\n");
      let match;
      while ((match = LINE.exec(lines)) != null) {
        const key = match[1];
        let value = match[2] || "";
        value = value.trim();
        const maybeQuote = value[0];
        value = value.replace(/^(['"`])([\s\S]*)\1$/mg, "$2");
        if (maybeQuote === '"') {
          value = value.replace(/\\n/g, "\n");
          value = value.replace(/\\r/g, "\r");
        }
        obj[key] = value;
      }
      return obj;
    }
    function _parseVault(options) {
      const vaultPath = _vaultPath(options);
      const result = DotenvModule.configDotenv({ path: vaultPath });
      if (!result.parsed) {
        throw new Error(`MISSING_DATA: Cannot parse ${vaultPath} for an unknown reason`);
      }
      const keys = _dotenvKey(options).split(",");
      const length = keys.length;
      let decrypted;
      for (let i2 = 0; i2 < length; i2++) {
        try {
          const key = keys[i2].trim();
          const attrs = _instructions(result, key);
          decrypted = DotenvModule.decrypt(attrs.ciphertext, attrs.key);
          break;
        } catch (error) {
          if (i2 + 1 >= length) {
            throw error;
          }
        }
      }
      return DotenvModule.parse(decrypted);
    }
    function _log(message) {
      console.log(`[dotenv@${version}][INFO] ${message}`);
    }
    function _warn(message) {
      console.log(`[dotenv@${version}][WARN] ${message}`);
    }
    function _debug(message) {
      console.log(`[dotenv@${version}][DEBUG] ${message}`);
    }
    function _dotenvKey(options) {
      if (options && options.DOTENV_KEY && options.DOTENV_KEY.length > 0) {
        return options.DOTENV_KEY;
      }
      if (process.env.DOTENV_KEY && process.env.DOTENV_KEY.length > 0) {
        return process.env.DOTENV_KEY;
      }
      return "";
    }
    function _instructions(result, dotenvKey) {
      let uri;
      try {
        uri = new URL(dotenvKey);
      } catch (error) {
        if (error.code === "ERR_INVALID_URL") {
          throw new Error("INVALID_DOTENV_KEY: Wrong format. Must be in valid uri format like dotenv://:key_1234@dotenv.org/vault/.env.vault?environment=development");
        }
        throw error;
      }
      const key = uri.password;
      if (!key) {
        throw new Error("INVALID_DOTENV_KEY: Missing key part");
      }
      const environment = uri.searchParams.get("environment");
      if (!environment) {
        throw new Error("INVALID_DOTENV_KEY: Missing environment part");
      }
      const environmentKey = `DOTENV_VAULT_${environment.toUpperCase()}`;
      const ciphertext = result.parsed[environmentKey];
      if (!ciphertext) {
        throw new Error(`NOT_FOUND_DOTENV_ENVIRONMENT: Cannot locate environment ${environmentKey} in your .env.vault file.`);
      }
      return { ciphertext, key };
    }
    function _vaultPath(options) {
      let dotenvPath = path5.resolve(process.cwd(), ".env");
      if (options && options.path && options.path.length > 0) {
        dotenvPath = options.path;
      }
      return dotenvPath.endsWith(".vault") ? dotenvPath : `${dotenvPath}.vault`;
    }
    function _resolveHome(envPath) {
      return envPath[0] === "~" ? path5.join(os3.homedir(), envPath.slice(1)) : envPath;
    }
    function _configVault(options) {
      _log("Loading env from encrypted .env.vault");
      const parsed = DotenvModule._parseVault(options);
      let processEnv = process.env;
      if (options && options.processEnv != null) {
        processEnv = options.processEnv;
      }
      DotenvModule.populate(processEnv, parsed, options);
      return { parsed };
    }
    function configDotenv(options) {
      let dotenvPath = path5.resolve(process.cwd(), ".env");
      let encoding = "utf8";
      const debug = Boolean(options && options.debug);
      if (options) {
        if (options.path != null) {
          dotenvPath = _resolveHome(options.path);
        }
        if (options.encoding != null) {
          encoding = options.encoding;
        } else {
          if (debug) {
            _debug("No encoding is specified. UTF-8 is used by default");
          }
        }
      }
      try {
        const parsed = DotenvModule.parse(fs4.readFileSync(dotenvPath, { encoding }));
        let processEnv = process.env;
        if (options && options.processEnv != null) {
          processEnv = options.processEnv;
        }
        DotenvModule.populate(processEnv, parsed, options);
        return { parsed };
      } catch (e2) {
        if (debug) {
          _debug(`Failed to load ${dotenvPath} ${e2.message}`);
        }
        return { error: e2 };
      }
    }
    function config8(options) {
      const vaultPath = _vaultPath(options);
      if (_dotenvKey(options).length === 0) {
        return DotenvModule.configDotenv(options);
      }
      if (!fs4.existsSync(vaultPath)) {
        _warn(`You set DOTENV_KEY but you are missing a .env.vault file at ${vaultPath}. Did you forget to build it?`);
        return DotenvModule.configDotenv(options);
      }
      return DotenvModule._configVault(options);
    }
    function decrypt(encrypted, keyStr) {
      const key = Buffer.from(keyStr.slice(-64), "hex");
      let ciphertext = Buffer.from(encrypted, "base64");
      const nonce = ciphertext.subarray(0, 12);
      const authTag = ciphertext.subarray(-16);
      ciphertext = ciphertext.subarray(12, -16);
      try {
        const aesgcm = crypto2.createDecipheriv("aes-256-gcm", key, nonce);
        aesgcm.setAuthTag(authTag);
        return `${aesgcm.update(ciphertext)}${aesgcm.final()}`;
      } catch (error) {
        const isRange = error instanceof RangeError;
        const invalidKeyLength = error.message === "Invalid key length";
        const decryptionFailed = error.message === "Unsupported state or unable to authenticate data";
        if (isRange || invalidKeyLength) {
          const msg = "INVALID_DOTENV_KEY: It must be 64 characters long (or more)";
          throw new Error(msg);
        } else if (decryptionFailed) {
          const msg = "DECRYPTION_FAILED: Please check your DOTENV_KEY";
          throw new Error(msg);
        } else {
          console.error("Error: ", error.code);
          console.error("Error: ", error.message);
          throw error;
        }
      }
    }
    function populate(processEnv, parsed, options = {}) {
      const debug = Boolean(options && options.debug);
      const override = Boolean(options && options.override);
      if (typeof parsed !== "object") {
        throw new Error("OBJECT_REQUIRED: Please check the processEnv argument being passed to populate");
      }
      for (const key of Object.keys(parsed)) {
        if (Object.prototype.hasOwnProperty.call(processEnv, key)) {
          if (override === true) {
            processEnv[key] = parsed[key];
          }
          if (debug) {
            if (override === true) {
              _debug(`"${key}" is already defined and WAS overwritten`);
            } else {
              _debug(`"${key}" is already defined and was NOT overwritten`);
            }
          }
        } else {
          processEnv[key] = parsed[key];
        }
      }
    }
    var DotenvModule = {
      configDotenv,
      _configVault,
      _parseVault,
      config: config8,
      decrypt,
      parse,
      populate
    };
    module2.exports.configDotenv = DotenvModule.configDotenv;
    module2.exports._configVault = DotenvModule._configVault;
    module2.exports._parseVault = DotenvModule._parseVault;
    module2.exports.config = DotenvModule.config;
    module2.exports.decrypt = DotenvModule.decrypt;
    module2.exports.parse = DotenvModule.parse;
    module2.exports.populate = DotenvModule.populate;
    module2.exports = DotenvModule;
  }
});

// node_modules/ini/lib/ini.js
var require_ini = __commonJS({
  "node_modules/ini/lib/ini.js"(exports, module2) {
    var { hasOwnProperty: hasOwnProperty2 } = Object.prototype;
    var eol = typeof process !== "undefined" && process.platform === "win32" ? "\r\n" : "\n";
    var encode3 = (obj, opt) => {
      const children = [];
      let out = "";
      if (typeof opt === "string") {
        opt = {
          section: opt,
          whitespace: false
        };
      } else {
        opt = opt || /* @__PURE__ */ Object.create(null);
        opt.whitespace = opt.whitespace === true;
      }
      const separator = opt.whitespace ? " = " : "=";
      for (const k6 of Object.keys(obj)) {
        const val = obj[k6];
        if (val && Array.isArray(val)) {
          for (const item of val) {
            out += safe(k6 + "[]") + separator + safe(item) + eol;
          }
        } else if (val && typeof val === "object") {
          children.push(k6);
        } else {
          out += safe(k6) + separator + safe(val) + eol;
        }
      }
      if (opt.section && out.length) {
        out = "[" + safe(opt.section) + "]" + eol + out;
      }
      for (const k6 of children) {
        const nk = dotSplit(k6).join("\\.");
        const section = (opt.section ? opt.section + "." : "") + nk;
        const { whitespace } = opt;
        const child = encode3(obj[k6], {
          section,
          whitespace
        });
        if (out.length && child.length) {
          out += eol;
        }
        out += child;
      }
      return out;
    };
    var dotSplit = (str) => str.replace(/\1/g, "LITERAL\\1LITERAL").replace(/\\\./g, "").split(/\./).map((part) => part.replace(/\1/g, "\\.").replace(/\2LITERAL\\1LITERAL\2/g, ""));
    var decode = (str) => {
      const out = /* @__PURE__ */ Object.create(null);
      let p4 = out;
      let section = null;
      const re2 = /^\[([^\]]*)\]$|^([^=]+)(=(.*))?$/i;
      const lines = str.split(/[\r\n]+/g);
      for (const line of lines) {
        if (!line || line.match(/^\s*[;#]/)) {
          continue;
        }
        const match = line.match(re2);
        if (!match) {
          continue;
        }
        if (match[1] !== void 0) {
          section = unsafe(match[1]);
          if (section === "__proto__") {
            p4 = /* @__PURE__ */ Object.create(null);
            continue;
          }
          p4 = out[section] = out[section] || /* @__PURE__ */ Object.create(null);
          continue;
        }
        const keyRaw = unsafe(match[2]);
        const isArray2 = keyRaw.length > 2 && keyRaw.slice(-2) === "[]";
        const key = isArray2 ? keyRaw.slice(0, -2) : keyRaw;
        if (key === "__proto__") {
          continue;
        }
        const valueRaw = match[3] ? unsafe(match[4]) : true;
        const value = valueRaw === "true" || valueRaw === "false" || valueRaw === "null" ? JSON.parse(valueRaw) : valueRaw;
        if (isArray2) {
          if (!hasOwnProperty2.call(p4, key)) {
            p4[key] = [];
          } else if (!Array.isArray(p4[key])) {
            p4[key] = [p4[key]];
          }
        }
        if (Array.isArray(p4[key])) {
          p4[key].push(value);
        } else {
          p4[key] = value;
        }
      }
      const remove = [];
      for (const k6 of Object.keys(out)) {
        if (!hasOwnProperty2.call(out, k6) || typeof out[k6] !== "object" || Array.isArray(out[k6])) {
          continue;
        }
        const parts = dotSplit(k6);
        p4 = out;
        const l = parts.pop();
        const nl = l.replace(/\\\./g, ".");
        for (const part of parts) {
          if (part === "__proto__") {
            continue;
          }
          if (!hasOwnProperty2.call(p4, part) || typeof p4[part] !== "object") {
            p4[part] = /* @__PURE__ */ Object.create(null);
          }
          p4 = p4[part];
        }
        if (p4 === out && nl === l) {
          continue;
        }
        p4[nl] = out[k6];
        remove.push(k6);
      }
      for (const del of remove) {
        delete out[del];
      }
      return out;
    };
    var isQuoted = (val) => {
      return val.startsWith('"') && val.endsWith('"') || val.startsWith("'") && val.endsWith("'");
    };
    var safe = (val) => {
      if (typeof val !== "string" || val.match(/[=\r\n]/) || val.match(/^\[/) || val.length > 1 && isQuoted(val) || val !== val.trim()) {
        return JSON.stringify(val);
      }
      return val.split(";").join("\\;").split("#").join("\\#");
    };
    var unsafe = (val, doUnesc) => {
      val = (val || "").trim();
      if (isQuoted(val)) {
        if (val.charAt(0) === "'") {
          val = val.slice(1, -1);
        }
        try {
          val = JSON.parse(val);
        } catch {
        }
      } else {
        let esc = false;
        let unesc = "";
        for (let i2 = 0, l = val.length; i2 < l; i2++) {
          const c3 = val.charAt(i2);
          if (esc) {
            if ("\\;#".indexOf(c3) !== -1) {
              unesc += c3;
            } else {
              unesc += "\\" + c3;
            }
            esc = false;
          } else if (";#".indexOf(c3) !== -1) {
            break;
          } else if (c3 === "\\") {
            esc = true;
          } else {
            unesc += c3;
          }
        }
        if (esc) {
          unesc += "\\";
        }
        return unesc.trim();
      }
      return val;
    };
    module2.exports = {
      parse: decode,
      decode,
      stringify: encode3,
      encode: encode3,
      safe,
      unsafe
    };
  }
});

// node_modules/@dqbd/tiktoken/lite/tiktoken_bg.cjs
var require_tiktoken_bg = __commonJS({
  "node_modules/@dqbd/tiktoken/lite/tiktoken_bg.cjs"(exports, module2) {
    var wasm;
    module2.exports.__wbg_set_wasm = function(val) {
      wasm = val;
    };
    var heap = new Array(128).fill(void 0);
    heap.push(void 0, null, true, false);
    function getObject(idx) {
      return heap[idx];
    }
    var heap_next = heap.length;
    function dropObject(idx) {
      if (idx < 132)
        return;
      heap[idx] = heap_next;
      heap_next = idx;
    }
    function takeObject(idx) {
      const ret = getObject(idx);
      dropObject(idx);
      return ret;
    }
    var WASM_VECTOR_LEN = 0;
    var cachedUint8Memory0 = null;
    function getUint8Memory0() {
      if (cachedUint8Memory0 === null || cachedUint8Memory0.byteLength === 0) {
        cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);
      }
      return cachedUint8Memory0;
    }
    var lTextEncoder = typeof TextEncoder === "undefined" ? (0, module2.require)("util").TextEncoder : TextEncoder;
    var cachedTextEncoder = new lTextEncoder("utf-8");
    var encodeString = typeof cachedTextEncoder.encodeInto === "function" ? function(arg, view) {
      return cachedTextEncoder.encodeInto(arg, view);
    } : function(arg, view) {
      const buf = cachedTextEncoder.encode(arg);
      view.set(buf);
      return {
        read: arg.length,
        written: buf.length
      };
    };
    function passStringToWasm0(arg, malloc, realloc) {
      if (realloc === void 0) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr2 = malloc(buf.length);
        getUint8Memory0().subarray(ptr2, ptr2 + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr2;
      }
      let len = arg.length;
      let ptr = malloc(len);
      const mem = getUint8Memory0();
      let offset = 0;
      for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 127)
          break;
        mem[ptr + offset] = code;
      }
      if (offset !== len) {
        if (offset !== 0) {
          arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3);
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);
        offset += ret.written;
      }
      WASM_VECTOR_LEN = offset;
      return ptr;
    }
    function isLikeNone(x4) {
      return x4 === void 0 || x4 === null;
    }
    var cachedInt32Memory0 = null;
    function getInt32Memory0() {
      if (cachedInt32Memory0 === null || cachedInt32Memory0.byteLength === 0) {
        cachedInt32Memory0 = new Int32Array(wasm.memory.buffer);
      }
      return cachedInt32Memory0;
    }
    var lTextDecoder = typeof TextDecoder === "undefined" ? (0, module2.require)("util").TextDecoder : TextDecoder;
    var cachedTextDecoder = new lTextDecoder("utf-8", { ignoreBOM: true, fatal: true });
    cachedTextDecoder.decode();
    function getStringFromWasm0(ptr, len) {
      return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
    }
    function addHeapObject(obj) {
      if (heap_next === heap.length)
        heap.push(heap.length + 1);
      const idx = heap_next;
      heap_next = heap[idx];
      heap[idx] = obj;
      return idx;
    }
    var cachedUint32Memory0 = null;
    function getUint32Memory0() {
      if (cachedUint32Memory0 === null || cachedUint32Memory0.byteLength === 0) {
        cachedUint32Memory0 = new Uint32Array(wasm.memory.buffer);
      }
      return cachedUint32Memory0;
    }
    function getArrayU32FromWasm0(ptr, len) {
      return getUint32Memory0().subarray(ptr / 4, ptr / 4 + len);
    }
    function passArray8ToWasm0(arg, malloc) {
      const ptr = malloc(arg.length * 1);
      getUint8Memory0().set(arg, ptr / 1);
      WASM_VECTOR_LEN = arg.length;
      return ptr;
    }
    function passArray32ToWasm0(arg, malloc) {
      const ptr = malloc(arg.length * 4);
      getUint32Memory0().set(arg, ptr / 4);
      WASM_VECTOR_LEN = arg.length;
      return ptr;
    }
    function getArrayU8FromWasm0(ptr, len) {
      return getUint8Memory0().subarray(ptr / 1, ptr / 1 + len);
    }
    function handleError(f3, args) {
      try {
        return f3.apply(this, args);
      } catch (e2) {
        wasm.__wbindgen_export_3(addHeapObject(e2));
      }
    }
    var Tiktoken2 = class {
      constructor(tiktoken_bfe, special_tokens, pat_str) {
        if (wasm == null)
          throw new Error("@dqbd/tiktoken: WASM binary has not been propery initialized.");
        const ptr0 = passStringToWasm0(tiktoken_bfe, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(pat_str, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.tiktoken_new(ptr0, len0, addHeapObject(special_tokens), ptr1, len1);
        return Tiktoken2.__wrap(ret);
      }
      get name() {
        try {
          const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
          wasm.tiktoken_name(retptr, this.ptr);
          var r0 = getInt32Memory0()[retptr / 4 + 0];
          var r1 = getInt32Memory0()[retptr / 4 + 1];
          let v0;
          if (r0 !== 0) {
            v0 = getStringFromWasm0(r0, r1).slice();
            wasm.__wbindgen_export_2(r0, r1 * 1);
          }
          return v0;
        } finally {
          wasm.__wbindgen_add_to_stack_pointer(16);
        }
      }
      static __wrap(ptr) {
        const obj = Object.create(Tiktoken2.prototype);
        obj.ptr = ptr;
        return obj;
      }
      __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;
        return ptr;
      }
      free() {
        if (wasm == null)
          throw new Error("@dqbd/tiktoken: WASM binary has not been propery initialized.");
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_tiktoken_free(ptr);
      }
      encode(text, allowed_special, disallowed_special) {
        if (wasm == null)
          throw new Error("@dqbd/tiktoken: WASM binary has not been propery initialized.");
        try {
          const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
          const ptr0 = passStringToWasm0(text, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
          const len0 = WASM_VECTOR_LEN;
          wasm.tiktoken_encode(retptr, this.ptr, ptr0, len0, addHeapObject(allowed_special), addHeapObject(disallowed_special));
          var r0 = getInt32Memory0()[retptr / 4 + 0];
          var r1 = getInt32Memory0()[retptr / 4 + 1];
          var r2 = getInt32Memory0()[retptr / 4 + 2];
          var r3 = getInt32Memory0()[retptr / 4 + 3];
          if (r3) {
            throw takeObject(r2);
          }
          var v1 = getArrayU32FromWasm0(r0, r1).slice();
          wasm.__wbindgen_export_2(r0, r1 * 4);
          return v1;
        } finally {
          wasm.__wbindgen_add_to_stack_pointer(16);
        }
      }
      encode_ordinary(text) {
        if (wasm == null)
          throw new Error("@dqbd/tiktoken: WASM binary has not been propery initialized.");
        try {
          const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
          const ptr0 = passStringToWasm0(text, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
          const len0 = WASM_VECTOR_LEN;
          wasm.tiktoken_encode_ordinary(retptr, this.ptr, ptr0, len0);
          var r0 = getInt32Memory0()[retptr / 4 + 0];
          var r1 = getInt32Memory0()[retptr / 4 + 1];
          var v1 = getArrayU32FromWasm0(r0, r1).slice();
          wasm.__wbindgen_export_2(r0, r1 * 4);
          return v1;
        } finally {
          wasm.__wbindgen_add_to_stack_pointer(16);
        }
      }
      encode_with_unstable(text, allowed_special, disallowed_special) {
        if (wasm == null)
          throw new Error("@dqbd/tiktoken: WASM binary has not been propery initialized.");
        try {
          const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
          const ptr0 = passStringToWasm0(text, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
          const len0 = WASM_VECTOR_LEN;
          wasm.tiktoken_encode_with_unstable(retptr, this.ptr, ptr0, len0, addHeapObject(allowed_special), addHeapObject(disallowed_special));
          var r0 = getInt32Memory0()[retptr / 4 + 0];
          var r1 = getInt32Memory0()[retptr / 4 + 1];
          var r2 = getInt32Memory0()[retptr / 4 + 2];
          if (r2) {
            throw takeObject(r1);
          }
          return takeObject(r0);
        } finally {
          wasm.__wbindgen_add_to_stack_pointer(16);
        }
      }
      encode_single_token(bytes) {
        if (wasm == null)
          throw new Error("@dqbd/tiktoken: WASM binary has not been propery initialized.");
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_export_0);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.tiktoken_encode_single_token(this.ptr, ptr0, len0);
        return ret >>> 0;
      }
      decode(tokens) {
        if (wasm == null)
          throw new Error("@dqbd/tiktoken: WASM binary has not been propery initialized.");
        try {
          const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
          const ptr0 = passArray32ToWasm0(tokens, wasm.__wbindgen_export_0);
          const len0 = WASM_VECTOR_LEN;
          wasm.tiktoken_decode(retptr, this.ptr, ptr0, len0);
          var r0 = getInt32Memory0()[retptr / 4 + 0];
          var r1 = getInt32Memory0()[retptr / 4 + 1];
          var v1 = getArrayU8FromWasm0(r0, r1).slice();
          wasm.__wbindgen_export_2(r0, r1 * 1);
          return v1;
        } finally {
          wasm.__wbindgen_add_to_stack_pointer(16);
        }
      }
      decode_single_token_bytes(token) {
        if (wasm == null)
          throw new Error("@dqbd/tiktoken: WASM binary has not been propery initialized.");
        try {
          const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
          wasm.tiktoken_decode_single_token_bytes(retptr, this.ptr, token);
          var r0 = getInt32Memory0()[retptr / 4 + 0];
          var r1 = getInt32Memory0()[retptr / 4 + 1];
          var v0 = getArrayU8FromWasm0(r0, r1).slice();
          wasm.__wbindgen_export_2(r0, r1 * 1);
          return v0;
        } finally {
          wasm.__wbindgen_add_to_stack_pointer(16);
        }
      }
      token_byte_values() {
        if (wasm == null)
          throw new Error("@dqbd/tiktoken: WASM binary has not been propery initialized.");
        const ret = wasm.tiktoken_token_byte_values(this.ptr);
        return takeObject(ret);
      }
    };
    module2.exports.Tiktoken = Tiktoken2;
    module2.exports.__wbindgen_is_undefined = function(arg0) {
      const ret = getObject(arg0) === void 0;
      return ret;
    };
    module2.exports.__wbg_stringify_029a979dfb73aa17 = function() {
      return handleError(function(arg0) {
        const ret = JSON.stringify(getObject(arg0));
        return addHeapObject(ret);
      }, arguments);
    };
    module2.exports.__wbindgen_object_drop_ref = function(arg0) {
      takeObject(arg0);
    };
    module2.exports.__wbindgen_string_get = function(arg0, arg1) {
      if (wasm == null)
        throw new Error("@dqbd/tiktoken: WASM binary has not been propery initialized.");
      const obj = getObject(arg1);
      const ret = typeof obj === "string" ? obj : void 0;
      var ptr0 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
      var len0 = WASM_VECTOR_LEN;
      getInt32Memory0()[arg0 / 4 + 1] = len0;
      getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    };
    module2.exports.__wbindgen_error_new = function(arg0, arg1) {
      const ret = new Error(getStringFromWasm0(arg0, arg1));
      return addHeapObject(ret);
    };
    module2.exports.__wbg_parse_3ac95b51fc312db8 = function() {
      return handleError(function(arg0, arg1) {
        const ret = JSON.parse(getStringFromWasm0(arg0, arg1));
        return addHeapObject(ret);
      }, arguments);
    };
    module2.exports.__wbindgen_throw = function(arg0, arg1) {
      throw new Error(getStringFromWasm0(arg0, arg1));
    };
  }
});

// node_modules/@dqbd/tiktoken/lite/tiktoken.cjs
var require_tiktoken = __commonJS({
  "node_modules/@dqbd/tiktoken/lite/tiktoken.cjs"(exports) {
    var wasm = require_tiktoken_bg();
    var imports = {};
    imports["./tiktoken_bg.js"] = wasm;
    var path5 = require("path");
    var fs4 = require("fs");
    var candidates = __dirname.split(path5.sep).reduce((memo, _6, index, array) => {
      const prefix = array.slice(0, index + 1).join(path5.sep) + path5.sep;
      if (!prefix.includes("node_modules" + path5.sep)) {
        memo.unshift(
          path5.join(
            prefix,
            "node_modules",
            "@dqbd",
            "tiktoken",
            "lite",
            "./tiktoken_bg.wasm"
          )
        );
      }
      return memo;
    }, []);
    candidates.unshift(path5.join(__dirname, "./tiktoken_bg.wasm"));
    var bytes = null;
    for (const candidate of candidates) {
      try {
        bytes = fs4.readFileSync(candidate);
        break;
      } catch {
      }
    }
    if (bytes == null)
      throw new Error("Missing tiktoken_bg.wasm");
    var wasmModule = new WebAssembly.Module(bytes);
    var wasmInstance = new WebAssembly.Instance(wasmModule, imports);
    wasm.__wbg_set_wasm(wasmInstance.exports);
    exports["Tiktoken"] = wasm["Tiktoken"];
  }
});

// node_modules/@commitlint/types/lib/ensure.js
var require_ensure = __commonJS({
  "node_modules/@commitlint/types/lib/ensure.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/@commitlint/types/lib/format.js
var require_format = __commonJS({
  "node_modules/@commitlint/types/lib/format.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/@commitlint/types/lib/is-ignored.js
var require_is_ignored = __commonJS({
  "node_modules/@commitlint/types/lib/is-ignored.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/@commitlint/types/lib/lint.js
var require_lint = __commonJS({
  "node_modules/@commitlint/types/lib/lint.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/@commitlint/types/lib/load.js
var require_load = __commonJS({
  "node_modules/@commitlint/types/lib/load.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/@commitlint/types/lib/parse.js
var require_parse2 = __commonJS({
  "node_modules/@commitlint/types/lib/parse.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/@commitlint/types/lib/prompt.js
var require_prompt = __commonJS({
  "node_modules/@commitlint/types/lib/prompt.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/@commitlint/types/lib/rules.js
var require_rules = __commonJS({
  "node_modules/@commitlint/types/lib/rules.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RuleConfigQuality = exports.RuleConfigSeverity = void 0;
    var RuleConfigSeverity2;
    (function(RuleConfigSeverity3) {
      RuleConfigSeverity3[RuleConfigSeverity3["Disabled"] = 0] = "Disabled";
      RuleConfigSeverity3[RuleConfigSeverity3["Warning"] = 1] = "Warning";
      RuleConfigSeverity3[RuleConfigSeverity3["Error"] = 2] = "Error";
    })(RuleConfigSeverity2 || (exports.RuleConfigSeverity = RuleConfigSeverity2 = {}));
    var RuleConfigQuality;
    (function(RuleConfigQuality2) {
      RuleConfigQuality2[RuleConfigQuality2["User"] = 0] = "User";
      RuleConfigQuality2[RuleConfigQuality2["Qualified"] = 1] = "Qualified";
    })(RuleConfigQuality || (exports.RuleConfigQuality = RuleConfigQuality = {}));
  }
});

// node_modules/@commitlint/types/lib/index.js
var require_lib = __commonJS({
  "node_modules/@commitlint/types/lib/index.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o2, m4, k6, k22) {
      if (k22 === void 0)
        k22 = k6;
      var desc = Object.getOwnPropertyDescriptor(m4, k6);
      if (!desc || ("get" in desc ? !m4.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m4[k6];
        } };
      }
      Object.defineProperty(o2, k22, desc);
    } : function(o2, m4, k6, k22) {
      if (k22 === void 0)
        k22 = k6;
      o2[k22] = m4[k6];
    });
    var __exportStar = exports && exports.__exportStar || function(m4, exports2) {
      for (var p4 in m4)
        if (p4 !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p4))
          __createBinding(exports2, m4, p4);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    __exportStar(require_ensure(), exports);
    __exportStar(require_format(), exports);
    __exportStar(require_is_ignored(), exports);
    __exportStar(require_lint(), exports);
    __exportStar(require_load(), exports);
    __exportStar(require_parse2(), exports);
    __exportStar(require_prompt(), exports);
    __exportStar(require_rules(), exports);
  }
});

// node_modules/ignore/index.js
var require_ignore = __commonJS({
  "node_modules/ignore/index.js"(exports, module2) {
    function makeArray(subject) {
      return Array.isArray(subject) ? subject : [subject];
    }
    var EMPTY = "";
    var SPACE = " ";
    var ESCAPE = "\\";
    var REGEX_TEST_BLANK_LINE = /^\s+$/;
    var REGEX_INVALID_TRAILING_BACKSLASH = /(?:[^\\]|^)\\$/;
    var REGEX_REPLACE_LEADING_EXCAPED_EXCLAMATION = /^\\!/;
    var REGEX_REPLACE_LEADING_EXCAPED_HASH = /^\\#/;
    var REGEX_SPLITALL_CRLF = /\r?\n/g;
    var REGEX_TEST_INVALID_PATH = /^\.*\/|^\.+$/;
    var SLASH = "/";
    var TMP_KEY_IGNORE = "node-ignore";
    if (typeof Symbol !== "undefined") {
      TMP_KEY_IGNORE = Symbol.for("node-ignore");
    }
    var KEY_IGNORE = TMP_KEY_IGNORE;
    var define = (object, key, value) => Object.defineProperty(object, key, { value });
    var REGEX_REGEXP_RANGE = /([0-z])-([0-z])/g;
    var RETURN_FALSE = () => false;
    var sanitizeRange = (range) => range.replace(
      REGEX_REGEXP_RANGE,
      (match, from, to) => from.charCodeAt(0) <= to.charCodeAt(0) ? match : EMPTY
    );
    var cleanRangeBackSlash = (slashes) => {
      const { length } = slashes;
      return slashes.slice(0, length - length % 2);
    };
    var REPLACERS = [
      [
        /\\?\s+$/,
        (match) => match.indexOf("\\") === 0 ? SPACE : EMPTY
      ],
      [
        /\\\s/g,
        () => SPACE
      ],
      [
        /[\\$.|*+(){^]/g,
        (match) => `\\${match}`
      ],
      [
        /(?!\\)\?/g,
        () => "[^/]"
      ],
      [
        /^\//,
        () => "^"
      ],
      [
        /\//g,
        () => "\\/"
      ],
      [
        /^\^*\\\*\\\*\\\//,
        () => "^(?:.*\\/)?"
      ],
      [
        /^(?=[^^])/,
        function startingReplacer() {
          return !/\/(?!$)/.test(this) ? "(?:^|\\/)" : "^";
        }
      ],
      [
        /\\\/\\\*\\\*(?=\\\/|$)/g,
        (_6, index, str) => index + 6 < str.length ? "(?:\\/[^\\/]+)*" : "\\/.+"
      ],
      [
        /(^|[^\\]+)(\\\*)+(?=.+)/g,
        (_6, p1, p22) => {
          const unescaped = p22.replace(/\\\*/g, "[^\\/]*");
          return p1 + unescaped;
        }
      ],
      [
        /\\\\\\(?=[$.|*+(){^])/g,
        () => ESCAPE
      ],
      [
        /\\\\/g,
        () => ESCAPE
      ],
      [
        /(\\)?\[([^\]/]*?)(\\*)($|\])/g,
        (match, leadEscape, range, endEscape, close) => leadEscape === ESCAPE ? `\\[${range}${cleanRangeBackSlash(endEscape)}${close}` : close === "]" ? endEscape.length % 2 === 0 ? `[${sanitizeRange(range)}${endEscape}]` : "[]" : "[]"
      ],
      [
        /(?:[^*])$/,
        (match) => /\/$/.test(match) ? `${match}$` : `${match}(?=$|\\/$)`
      ],
      [
        /(\^|\\\/)?\\\*$/,
        (_6, p1) => {
          const prefix = p1 ? `${p1}[^/]+` : "[^/]*";
          return `${prefix}(?=$|\\/$)`;
        }
      ]
    ];
    var regexCache = /* @__PURE__ */ Object.create(null);
    var makeRegex = (pattern, ignoreCase) => {
      let source = regexCache[pattern];
      if (!source) {
        source = REPLACERS.reduce(
          (prev, current) => prev.replace(current[0], current[1].bind(pattern)),
          pattern
        );
        regexCache[pattern] = source;
      }
      return ignoreCase ? new RegExp(source, "i") : new RegExp(source);
    };
    var isString2 = (subject) => typeof subject === "string";
    var checkPattern = (pattern) => pattern && isString2(pattern) && !REGEX_TEST_BLANK_LINE.test(pattern) && !REGEX_INVALID_TRAILING_BACKSLASH.test(pattern) && pattern.indexOf("#") !== 0;
    var splitPattern = (pattern) => pattern.split(REGEX_SPLITALL_CRLF);
    var IgnoreRule = class {
      constructor(origin, pattern, negative, regex) {
        this.origin = origin;
        this.pattern = pattern;
        this.negative = negative;
        this.regex = regex;
      }
    };
    var createRule = (pattern, ignoreCase) => {
      const origin = pattern;
      let negative = false;
      if (pattern.indexOf("!") === 0) {
        negative = true;
        pattern = pattern.substr(1);
      }
      pattern = pattern.replace(REGEX_REPLACE_LEADING_EXCAPED_EXCLAMATION, "!").replace(REGEX_REPLACE_LEADING_EXCAPED_HASH, "#");
      const regex = makeRegex(pattern, ignoreCase);
      return new IgnoreRule(
        origin,
        pattern,
        negative,
        regex
      );
    };
    var throwError = (message, Ctor) => {
      throw new Ctor(message);
    };
    var checkPath = (path5, originalPath, doThrow) => {
      if (!isString2(path5)) {
        return doThrow(
          `path must be a string, but got \`${originalPath}\``,
          TypeError
        );
      }
      if (!path5) {
        return doThrow(`path must not be empty`, TypeError);
      }
      if (checkPath.isNotRelative(path5)) {
        const r2 = "`path.relative()`d";
        return doThrow(
          `path should be a ${r2} string, but got "${originalPath}"`,
          RangeError
        );
      }
      return true;
    };
    var isNotRelative = (path5) => REGEX_TEST_INVALID_PATH.test(path5);
    checkPath.isNotRelative = isNotRelative;
    checkPath.convert = (p4) => p4;
    var Ignore2 = class {
      constructor({
        ignorecase = true,
        ignoreCase = ignorecase,
        allowRelativePaths = false
      } = {}) {
        define(this, KEY_IGNORE, true);
        this._rules = [];
        this._ignoreCase = ignoreCase;
        this._allowRelativePaths = allowRelativePaths;
        this._initCache();
      }
      _initCache() {
        this._ignoreCache = /* @__PURE__ */ Object.create(null);
        this._testCache = /* @__PURE__ */ Object.create(null);
      }
      _addPattern(pattern) {
        if (pattern && pattern[KEY_IGNORE]) {
          this._rules = this._rules.concat(pattern._rules);
          this._added = true;
          return;
        }
        if (checkPattern(pattern)) {
          const rule = createRule(pattern, this._ignoreCase);
          this._added = true;
          this._rules.push(rule);
        }
      }
      add(pattern) {
        this._added = false;
        makeArray(
          isString2(pattern) ? splitPattern(pattern) : pattern
        ).forEach(this._addPattern, this);
        if (this._added) {
          this._initCache();
        }
        return this;
      }
      addPattern(pattern) {
        return this.add(pattern);
      }
      _testOne(path5, checkUnignored) {
        let ignored = false;
        let unignored = false;
        this._rules.forEach((rule) => {
          const { negative } = rule;
          if (unignored === negative && ignored !== unignored || negative && !ignored && !unignored && !checkUnignored) {
            return;
          }
          const matched = rule.regex.test(path5);
          if (matched) {
            ignored = !negative;
            unignored = negative;
          }
        });
        return {
          ignored,
          unignored
        };
      }
      _test(originalPath, cache, checkUnignored, slices) {
        const path5 = originalPath && checkPath.convert(originalPath);
        checkPath(
          path5,
          originalPath,
          this._allowRelativePaths ? RETURN_FALSE : throwError
        );
        return this._t(path5, cache, checkUnignored, slices);
      }
      _t(path5, cache, checkUnignored, slices) {
        if (path5 in cache) {
          return cache[path5];
        }
        if (!slices) {
          slices = path5.split(SLASH);
        }
        slices.pop();
        if (!slices.length) {
          return cache[path5] = this._testOne(path5, checkUnignored);
        }
        const parent = this._t(
          slices.join(SLASH) + SLASH,
          cache,
          checkUnignored,
          slices
        );
        return cache[path5] = parent.ignored ? parent : this._testOne(path5, checkUnignored);
      }
      ignores(path5) {
        return this._test(path5, this._ignoreCache, false).ignored;
      }
      createFilter() {
        return (path5) => !this.ignores(path5);
      }
      filter(paths) {
        return makeArray(paths).filter(this.createFilter());
      }
      test(path5) {
        return this._test(path5, this._testCache, true);
      }
    };
    var factory = (options) => new Ignore2(options);
    var isPathValid = (path5) => checkPath(path5 && checkPath.convert(path5), path5, RETURN_FALSE);
    factory.isPathValid = isPathValid;
    factory.default = factory;
    module2.exports = factory;
    if (typeof process !== "undefined" && (process.env && process.env.IGNORE_TEST_WIN32 || process.platform === "win32")) {
      const makePosix = (str) => /^\\\\\?\\/.test(str) || /["<>|\u0000-\u001F]+/u.test(str) ? str : str.replace(/\\/g, "/");
      checkPath.convert = makePosix;
      const REGIX_IS_WINDOWS_PATH_ABSOLUTE = /^[a-z]:\//i;
      checkPath.isNotRelative = (path5) => REGIX_IS_WINDOWS_PATH_ABSOLUTE.test(path5) || isNotRelative(path5);
    }
  }
});

// node_modules/type-flag/dist/index.mjs
var V = "known-flag";
var k = "unknown-flag";
var C = "argument";
var { stringify: h } = JSON;
var O = /\B([A-Z])/g;
var v = (t) => t.replace(O, "-$1").toLowerCase();
var { hasOwnProperty: D } = Object.prototype;
var w = (t, n) => D.call(t, n);
var L = (t) => Array.isArray(t);
var b = (t) => typeof t == "function" ? [t, false] : L(t) ? [t[0], true] : b(t.type);
var d = (t, n) => t === Boolean ? n !== "false" : n;
var m = (t, n) => typeof n == "boolean" ? n : t === Number && n === "" ? Number.NaN : t(n);
var R = /[\s.:=]/;
var B = (t) => {
  const n = `Flag name ${h(t)}`;
  if (t.length === 0)
    throw new Error(`${n} cannot be empty`);
  if (t.length === 1)
    throw new Error(`${n} must be longer than a character`);
  const r2 = t.match(R);
  if (r2)
    throw new Error(`${n} cannot contain ${h(r2?.[0])}`);
};
var K = (t) => {
  const n = {}, r2 = (e2, o2) => {
    if (w(n, e2))
      throw new Error(`Duplicate flags named ${h(e2)}`);
    n[e2] = o2;
  };
  for (const e2 in t) {
    if (!w(t, e2))
      continue;
    B(e2);
    const o2 = t[e2], s = [[], ...b(o2), o2];
    r2(e2, s);
    const i2 = v(e2);
    if (e2 !== i2 && r2(i2, s), "alias" in o2 && typeof o2.alias == "string") {
      const { alias: a2 } = o2, l = `Flag alias ${h(a2)} for flag ${h(e2)}`;
      if (a2.length === 0)
        throw new Error(`${l} cannot be empty`);
      if (a2.length > 1)
        throw new Error(`${l} must be a single character`);
      r2(a2, s);
    }
  }
  return n;
};
var _ = (t, n) => {
  const r2 = {};
  for (const e2 in t) {
    if (!w(t, e2))
      continue;
    const [o2, , s, i2] = n[e2];
    if (o2.length === 0 && "default" in i2) {
      let { default: a2 } = i2;
      typeof a2 == "function" && (a2 = a2()), r2[e2] = a2;
    } else
      r2[e2] = s ? o2 : o2.pop();
  }
  return r2;
};
var F = "--";
var G = /[.:=]/;
var T = /^-{1,2}\w/;
var N = (t) => {
  if (!T.test(t))
    return;
  const n = !t.startsWith(F);
  let r2 = t.slice(n ? 1 : 2), e2;
  const o2 = r2.match(G);
  if (o2) {
    const { index: s } = o2;
    e2 = r2.slice(s + 1), r2 = r2.slice(0, s);
  }
  return [r2, e2, n];
};
var $ = (t, { onFlag: n, onArgument: r2 }) => {
  let e2;
  const o2 = (s, i2) => {
    if (typeof e2 != "function")
      return true;
    e2(s, i2), e2 = void 0;
  };
  for (let s = 0; s < t.length; s += 1) {
    const i2 = t[s];
    if (i2 === F) {
      o2();
      const l = t.slice(s + 1);
      r2?.(l, [s], true);
      break;
    }
    const a2 = N(i2);
    if (a2) {
      if (o2(), !n)
        continue;
      const [l, f3, g3] = a2;
      if (g3)
        for (let c3 = 0; c3 < l.length; c3 += 1) {
          o2();
          const u2 = c3 === l.length - 1;
          e2 = n(l[c3], u2 ? f3 : void 0, [s, c3 + 1, u2]);
        }
      else
        e2 = n(l, f3, [s]);
    } else
      o2(i2, [s]) && r2?.([i2], [s]);
  }
  o2();
};
var E = (t, n) => {
  for (const [r2, e2, o2] of n.reverse()) {
    if (e2) {
      const s = t[r2];
      let i2 = s.slice(0, e2);
      if (o2 || (i2 += s.slice(e2 + 1)), i2 !== "-") {
        t[r2] = i2;
        continue;
      }
    }
    t.splice(r2, 1);
  }
};
var U = (t, n = process.argv.slice(2), { ignore: r2 } = {}) => {
  const e2 = [], o2 = K(t), s = {}, i2 = [];
  return i2[F] = [], $(n, { onFlag(a2, l, f3) {
    const g3 = w(o2, a2);
    if (!r2?.(g3 ? V : k, a2, l)) {
      if (g3) {
        const [c3, u2] = o2[a2], y5 = d(u2, l), p4 = (P3, A3) => {
          e2.push(f3), A3 && e2.push(A3), c3.push(m(u2, P3 || ""));
        };
        return y5 === void 0 ? p4 : p4(y5);
      }
      w(s, a2) || (s[a2] = []), s[a2].push(l === void 0 ? true : l), e2.push(f3);
    }
  }, onArgument(a2, l, f3) {
    r2?.(C, n[l[0]]) || (i2.push(...a2), f3 ? (i2[F] = a2, n.splice(l[0])) : e2.push(l));
  } }), E(n, e2), { flags: _(t, o2), unknownFlags: s, _: i2 };
};

// node_modules/cleye/dist/index.mjs
var import_tty = __toESM(require("tty"), 1);

// node_modules/terminal-columns/dist/index.mjs
var DD = Object.create;
var m2 = Object.defineProperty;
var uD = Object.defineProperties;
var FD = Object.getOwnPropertyDescriptor;
var CD = Object.getOwnPropertyDescriptors;
var tD = Object.getOwnPropertyNames;
var I = Object.getOwnPropertySymbols;
var ED = Object.getPrototypeOf;
var L2 = Object.prototype.hasOwnProperty;
var eD = Object.prototype.propertyIsEnumerable;
var W = (D4, F4, u2) => F4 in D4 ? m2(D4, F4, { enumerable: true, configurable: true, writable: true, value: u2 }) : D4[F4] = u2;
var p = (D4, F4) => {
  for (var u2 in F4 || (F4 = {}))
    L2.call(F4, u2) && W(D4, u2, F4[u2]);
  if (I)
    for (var u2 of I(F4))
      eD.call(F4, u2) && W(D4, u2, F4[u2]);
  return D4;
};
var c = (D4, F4) => uD(D4, CD(F4));
var nD = (D4) => m2(D4, "__esModule", { value: true });
var rD = (D4, F4) => () => (D4 && (F4 = D4(D4 = 0)), F4);
var iD = (D4, F4) => () => (F4 || D4((F4 = { exports: {} }).exports, F4), F4.exports);
var oD = (D4, F4, u2, C4) => {
  if (F4 && typeof F4 == "object" || typeof F4 == "function")
    for (let t of tD(F4))
      !L2.call(D4, t) && (u2 || t !== "default") && m2(D4, t, { get: () => F4[t], enumerable: !(C4 = FD(F4, t)) || C4.enumerable });
  return D4;
};
var BD = (D4, F4) => oD(nD(m2(D4 != null ? DD(ED(D4)) : {}, "default", !F4 && D4 && D4.__esModule ? { get: () => D4.default, enumerable: true } : { value: D4, enumerable: true })), D4);
var i = rD(() => {
});
var $2 = iD((LD, N5) => {
  "use strict";
  i();
  N5.exports = function() {
    return /\uD83C\uDFF4\uDB40\uDC67\uDB40\uDC62(?:\uDB40\uDC77\uDB40\uDC6C\uDB40\uDC73|\uDB40\uDC73\uDB40\uDC63\uDB40\uDC74|\uDB40\uDC65\uDB40\uDC6E\uDB40\uDC67)\uDB40\uDC7F|(?:\uD83E\uDDD1\uD83C\uDFFF\u200D\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFF\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69]))(?:\uD83C[\uDFFB-\uDFFE])|(?:\uD83E\uDDD1\uD83C\uDFFE\u200D\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFE\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69]))(?:\uD83C[\uDFFB-\uDFFD\uDFFF])|(?:\uD83E\uDDD1\uD83C\uDFFD\u200D\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFD\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69]))(?:\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])|(?:\uD83E\uDDD1\uD83C\uDFFC\u200D\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFC\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69]))(?:\uD83C[\uDFFB\uDFFD-\uDFFF])|(?:\uD83E\uDDD1\uD83C\uDFFB\u200D\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFB\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69]))(?:\uD83C[\uDFFC-\uDFFF])|\uD83D\uDC68(?:\uD83C\uDFFB(?:\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFF])|\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFF]))|\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFC-\uDFFF])|[\u2695\u2696\u2708]\uFE0F|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD]))?|(?:\uD83C[\uDFFC-\uDFFF])\u200D\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFF])|\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFF]))|\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83D\uDC68|(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFE])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFE\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFD\uDFFF])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFC\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFD-\uDFFF])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|(?:\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])\uFE0F|\u200D(?:(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D[\uDC66\uDC67])|\uD83D[\uDC66\uDC67])|\uD83C\uDFFF|\uD83C\uDFFE|\uD83C\uDFFD|\uD83C\uDFFC)?|(?:\uD83D\uDC69(?:\uD83C\uDFFB\u200D\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69])|(?:\uD83C[\uDFFC-\uDFFF])\u200D\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69]))|\uD83E\uDDD1(?:\uD83C[\uDFFB-\uDFFF])\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1)(?:\uD83C[\uDFFB-\uDFFF])|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC69(?:\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFE\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFC\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFB\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD]))|\uD83E\uDDD1(?:\u200D(?:\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFE\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFC\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFB\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD]))|\uD83D\uDC69\u200D\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D[\uDC66\uDC67])|\uD83D\uDC69\u200D\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|(?:\uD83D\uDC41\uFE0F\u200D\uD83D\uDDE8|\uD83E\uDDD1(?:\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708]|\uD83C\uDFFB\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])|\uD83D\uDC69(?:\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708]|\uD83C\uDFFB\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])|\uD83D\uDE36\u200D\uD83C\uDF2B|\uD83C\uDFF3\uFE0F\u200D\u26A7|\uD83D\uDC3B\u200D\u2744|(?:(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC70\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD35\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD4\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])|\uD83D\uDC6F|\uD83E[\uDD3C\uDDDE\uDDDF])\u200D[\u2640\u2642]|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uFE0F|\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|\uD83C\uDFF4\u200D\u2620|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC70\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD35\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD4\uDDD6-\uDDDD])\u200D[\u2640\u2642]|[\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u2328\u23CF\u23ED-\u23EF\u23F1\u23F2\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB\u25FC\u2600-\u2604\u260E\u2611\u2618\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u2692\u2694-\u2697\u2699\u269B\u269C\u26A0\u26A7\u26B0\u26B1\u26C8\u26CF\u26D1\u26D3\u26E9\u26F0\u26F1\u26F4\u26F7\u26F8\u2702\u2708\u2709\u270F\u2712\u2714\u2716\u271D\u2721\u2733\u2734\u2744\u2747\u2763\u27A1\u2934\u2935\u2B05-\u2B07\u3030\u303D\u3297\u3299]|\uD83C[\uDD70\uDD71\uDD7E\uDD7F\uDE02\uDE37\uDF21\uDF24-\uDF2C\uDF36\uDF7D\uDF96\uDF97\uDF99-\uDF9B\uDF9E\uDF9F\uDFCD\uDFCE\uDFD4-\uDFDF\uDFF5\uDFF7]|\uD83D[\uDC3F\uDCFD\uDD49\uDD4A\uDD6F\uDD70\uDD73\uDD76-\uDD79\uDD87\uDD8A-\uDD8D\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA\uDECB\uDECD-\uDECF\uDEE0-\uDEE5\uDEE9\uDEF0\uDEF3])\uFE0F|\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08|\uD83D\uDC69\u200D\uD83D\uDC67|\uD83D\uDC69\u200D\uD83D\uDC66|\uD83D\uDE35\u200D\uD83D\uDCAB|\uD83D\uDE2E\u200D\uD83D\uDCA8|\uD83D\uDC15\u200D\uD83E\uDDBA|\uD83E\uDDD1(?:\uD83C\uDFFF|\uD83C\uDFFE|\uD83C\uDFFD|\uD83C\uDFFC|\uD83C\uDFFB)?|\uD83D\uDC69(?:\uD83C\uDFFF|\uD83C\uDFFE|\uD83C\uDFFD|\uD83C\uDFFC|\uD83C\uDFFB)?|\uD83C\uDDFD\uD83C\uDDF0|\uD83C\uDDF6\uD83C\uDDE6|\uD83C\uDDF4\uD83C\uDDF2|\uD83D\uDC08\u200D\u2B1B|\u2764\uFE0F\u200D(?:\uD83D\uDD25|\uD83E\uDE79)|\uD83D\uDC41\uFE0F|\uD83C\uDFF3\uFE0F|\uD83C\uDDFF(?:\uD83C[\uDDE6\uDDF2\uDDFC])|\uD83C\uDDFE(?:\uD83C[\uDDEA\uDDF9])|\uD83C\uDDFC(?:\uD83C[\uDDEB\uDDF8])|\uD83C\uDDFB(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDEE\uDDF3\uDDFA])|\uD83C\uDDFA(?:\uD83C[\uDDE6\uDDEC\uDDF2\uDDF3\uDDF8\uDDFE\uDDFF])|\uD83C\uDDF9(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDED\uDDEF-\uDDF4\uDDF7\uDDF9\uDDFB\uDDFC\uDDFF])|\uD83C\uDDF8(?:\uD83C[\uDDE6-\uDDEA\uDDEC-\uDDF4\uDDF7-\uDDF9\uDDFB\uDDFD-\uDDFF])|\uD83C\uDDF7(?:\uD83C[\uDDEA\uDDF4\uDDF8\uDDFA\uDDFC])|\uD83C\uDDF5(?:\uD83C[\uDDE6\uDDEA-\uDDED\uDDF0-\uDDF3\uDDF7-\uDDF9\uDDFC\uDDFE])|\uD83C\uDDF3(?:\uD83C[\uDDE6\uDDE8\uDDEA-\uDDEC\uDDEE\uDDF1\uDDF4\uDDF5\uDDF7\uDDFA\uDDFF])|\uD83C\uDDF2(?:\uD83C[\uDDE6\uDDE8-\uDDED\uDDF0-\uDDFF])|\uD83C\uDDF1(?:\uD83C[\uDDE6-\uDDE8\uDDEE\uDDF0\uDDF7-\uDDFB\uDDFE])|\uD83C\uDDF0(?:\uD83C[\uDDEA\uDDEC-\uDDEE\uDDF2\uDDF3\uDDF5\uDDF7\uDDFC\uDDFE\uDDFF])|\uD83C\uDDEF(?:\uD83C[\uDDEA\uDDF2\uDDF4\uDDF5])|\uD83C\uDDEE(?:\uD83C[\uDDE8-\uDDEA\uDDF1-\uDDF4\uDDF6-\uDDF9])|\uD83C\uDDED(?:\uD83C[\uDDF0\uDDF2\uDDF3\uDDF7\uDDF9\uDDFA])|\uD83C\uDDEC(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEE\uDDF1-\uDDF3\uDDF5-\uDDFA\uDDFC\uDDFE])|\uD83C\uDDEB(?:\uD83C[\uDDEE-\uDDF0\uDDF2\uDDF4\uDDF7])|\uD83C\uDDEA(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDED\uDDF7-\uDDFA])|\uD83C\uDDE9(?:\uD83C[\uDDEA\uDDEC\uDDEF\uDDF0\uDDF2\uDDF4\uDDFF])|\uD83C\uDDE8(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDEE\uDDF0-\uDDF5\uDDF7\uDDFA-\uDDFF])|\uD83C\uDDE7(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEF\uDDF1-\uDDF4\uDDF6-\uDDF9\uDDFB\uDDFC\uDDFE\uDDFF])|\uD83C\uDDE6(?:\uD83C[\uDDE8-\uDDEC\uDDEE\uDDF1\uDDF2\uDDF4\uDDF6-\uDDFA\uDDFC\uDDFD\uDDFF])|[#\*0-9]\uFE0F\u20E3|\u2764\uFE0F|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC70\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD35\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD4\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uFE0F|\uD83C[\uDFFB-\uDFFF])|\uD83C\uDFF4|(?:[\u270A\u270B]|\uD83C[\uDF85\uDFC2\uDFC7]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC6B-\uDC6D\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDC8F\uDC91\uDCAA\uDD7A\uDD95\uDD96\uDE4C\uDE4F\uDEC0\uDECC]|\uD83E[\uDD0C\uDD0F\uDD18-\uDD1C\uDD1E\uDD1F\uDD30-\uDD34\uDD36\uDD77\uDDB5\uDDB6\uDDBB\uDDD2\uDDD3\uDDD5])(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u261D\u270C\u270D]|\uD83D[\uDD74\uDD90])(?:\uFE0F|\uD83C[\uDFFB-\uDFFF])|[\u270A\u270B]|\uD83C[\uDF85\uDFC2\uDFC7]|\uD83D[\uDC08\uDC15\uDC3B\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC6B-\uDC6D\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDC8F\uDC91\uDCAA\uDD7A\uDD95\uDD96\uDE2E\uDE35\uDE36\uDE4C\uDE4F\uDEC0\uDECC]|\uD83E[\uDD0C\uDD0F\uDD18-\uDD1C\uDD1E\uDD1F\uDD30-\uDD34\uDD36\uDD77\uDDB5\uDDB6\uDDBB\uDDD2\uDDD3\uDDD5]|\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC70\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD35\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD4\uDDD6-\uDDDD]|\uD83D\uDC6F|\uD83E[\uDD3C\uDDDE\uDDDF]|[\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55]|\uD83C[\uDC04\uDCCF\uDD8E\uDD91-\uDD9A\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF7C\uDF7E-\uDF84\uDF86-\uDF93\uDFA0-\uDFC1\uDFC5\uDFC6\uDFC8\uDFC9\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF8-\uDFFF]|\uD83D[\uDC00-\uDC07\uDC09-\uDC14\uDC16-\uDC3A\uDC3C-\uDC3E\uDC40\uDC44\uDC45\uDC51-\uDC65\uDC6A\uDC79-\uDC7B\uDC7D-\uDC80\uDC84\uDC88-\uDC8E\uDC90\uDC92-\uDCA9\uDCAB-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDDA4\uDDFB-\uDE2D\uDE2F-\uDE34\uDE37-\uDE44\uDE48-\uDE4A\uDE80-\uDEA2\uDEA4-\uDEB3\uDEB7-\uDEBF\uDEC1-\uDEC5\uDED0-\uDED2\uDED5-\uDED7\uDEEB\uDEEC\uDEF4-\uDEFC\uDFE0-\uDFEB]|\uD83E[\uDD0D\uDD0E\uDD10-\uDD17\uDD1D\uDD20-\uDD25\uDD27-\uDD2F\uDD3A\uDD3F-\uDD45\uDD47-\uDD76\uDD78\uDD7A-\uDDB4\uDDB7\uDDBA\uDDBC-\uDDCB\uDDD0\uDDE0-\uDDFF\uDE70-\uDE74\uDE78-\uDE7A\uDE80-\uDE86\uDE90-\uDEA8\uDEB0-\uDEB6\uDEC0-\uDEC2\uDED0-\uDED6]|(?:[\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u270A\u270B\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55]|\uD83C[\uDC04\uDCCF\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF7C\uDF7E-\uDF93\uDFA0-\uDFCA\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF4\uDFF8-\uDFFF]|\uD83D[\uDC00-\uDC3E\uDC40\uDC42-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDD7A\uDD95\uDD96\uDDA4\uDDFB-\uDE4F\uDE80-\uDEC5\uDECC\uDED0-\uDED2\uDED5-\uDED7\uDEEB\uDEEC\uDEF4-\uDEFC\uDFE0-\uDFEB]|\uD83E[\uDD0C-\uDD3A\uDD3C-\uDD45\uDD47-\uDD78\uDD7A-\uDDCB\uDDCD-\uDDFF\uDE70-\uDE74\uDE78-\uDE7A\uDE80-\uDE86\uDE90-\uDEA8\uDEB0-\uDEB6\uDEC0-\uDEC2\uDED0-\uDED6])|(?:[#\*0-9\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u261D\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u267F\u2692-\u2697\u2699\u269B\u269C\u26A0\u26A1\u26A7\u26AA\u26AB\u26B0\u26B1\u26BD\u26BE\u26C4\u26C5\u26C8\u26CE\u26CF\u26D1\u26D3\u26D4\u26E9\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70\uDD71\uDD7E\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF]|\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95\uDD96\uDDA4\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDED5-\uDED7\uDEE0-\uDEE5\uDEE9\uDEEB\uDEEC\uDEF0\uDEF3-\uDEFC\uDFE0-\uDFEB]|\uD83E[\uDD0C-\uDD3A\uDD3C-\uDD45\uDD47-\uDD78\uDD7A-\uDDCB\uDDCD-\uDDFF\uDE70-\uDE74\uDE78-\uDE7A\uDE80-\uDE86\uDE90-\uDEA8\uDEB0-\uDEB6\uDEC0-\uDEC2\uDED0-\uDED6])\uFE0F|(?:[\u261D\u26F9\u270A-\u270D]|\uD83C[\uDF85\uDFC2-\uDFC4\uDFC7\uDFCA-\uDFCC]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66-\uDC78\uDC7C\uDC81-\uDC83\uDC85-\uDC87\uDC8F\uDC91\uDCAA\uDD74\uDD75\uDD7A\uDD90\uDD95\uDD96\uDE45-\uDE47\uDE4B-\uDE4F\uDEA3\uDEB4-\uDEB6\uDEC0\uDECC]|\uD83E[\uDD0C\uDD0F\uDD18-\uDD1F\uDD26\uDD30-\uDD39\uDD3C-\uDD3E\uDD77\uDDB5\uDDB6\uDDB8\uDDB9\uDDBB\uDDCD-\uDDCF\uDDD1-\uDDDD])/g;
  };
});
i();
i();
i();
var v2 = (D4) => {
  var u2, C4, t;
  let F4 = (u2 = process.stdout.columns) != null ? u2 : Number.POSITIVE_INFINITY;
  return typeof D4 == "function" && (D4 = D4(F4)), D4 || (D4 = {}), Array.isArray(D4) ? { columns: D4, stdoutColumns: F4 } : { columns: (C4 = D4.columns) != null ? C4 : [], stdoutColumns: (t = D4.stdoutColumns) != null ? t : F4 };
};
i();
i();
i();
i();
i();
function w2({ onlyFirst: D4 = false } = {}) {
  let F4 = ["[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)", "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))"].join("|");
  return new RegExp(F4, D4 ? void 0 : "g");
}
function d2(D4) {
  if (typeof D4 != "string")
    throw new TypeError(`Expected a \`string\`, got \`${typeof D4}\``);
  return D4.replace(w2(), "");
}
i();
function y(D4) {
  return Number.isInteger(D4) ? D4 >= 4352 && (D4 <= 4447 || D4 === 9001 || D4 === 9002 || 11904 <= D4 && D4 <= 12871 && D4 !== 12351 || 12880 <= D4 && D4 <= 19903 || 19968 <= D4 && D4 <= 42182 || 43360 <= D4 && D4 <= 43388 || 44032 <= D4 && D4 <= 55203 || 63744 <= D4 && D4 <= 64255 || 65040 <= D4 && D4 <= 65049 || 65072 <= D4 && D4 <= 65131 || 65281 <= D4 && D4 <= 65376 || 65504 <= D4 && D4 <= 65510 || 110592 <= D4 && D4 <= 110593 || 127488 <= D4 && D4 <= 127569 || 131072 <= D4 && D4 <= 262141) : false;
}
var j = BD($2(), 1);
function g(D4) {
  if (typeof D4 != "string" || D4.length === 0 || (D4 = d2(D4), D4.length === 0))
    return 0;
  D4 = D4.replace((0, j.default)(), "  ");
  let F4 = 0;
  for (let u2 = 0; u2 < D4.length; u2++) {
    let C4 = D4.codePointAt(u2);
    C4 <= 31 || C4 >= 127 && C4 <= 159 || C4 >= 768 && C4 <= 879 || (C4 > 65535 && u2++, F4 += y(C4) ? 2 : 1);
  }
  return F4;
}
var b2 = (D4) => Math.max(...D4.split(`
`).map(g));
var k2 = (D4) => {
  let F4 = [];
  for (let u2 of D4) {
    let { length: C4 } = u2, t = C4 - F4.length;
    for (let E3 = 0; E3 < t; E3 += 1)
      F4.push(0);
    for (let E3 = 0; E3 < C4; E3 += 1) {
      let e2 = b2(u2[E3]);
      e2 > F4[E3] && (F4[E3] = e2);
    }
  }
  return F4;
};
i();
var _2 = /^\d+%$/;
var z = { width: "auto", align: "left", contentWidth: 0, paddingLeft: 0, paddingRight: 0, paddingTop: 0, paddingBottom: 0, horizontalPadding: 0, paddingLeftString: "", paddingRightString: "" };
var sD = (D4, F4) => {
  var C4;
  let u2 = [];
  for (let t = 0; t < D4.length; t += 1) {
    let E3 = (C4 = F4[t]) != null ? C4 : "auto";
    if (typeof E3 == "number" || E3 === "auto" || E3 === "content-width" || typeof E3 == "string" && _2.test(E3)) {
      u2.push(c(p({}, z), { width: E3, contentWidth: D4[t] }));
      continue;
    }
    if (E3 && typeof E3 == "object") {
      let e2 = c(p(p({}, z), E3), { contentWidth: D4[t] });
      e2.horizontalPadding = e2.paddingLeft + e2.paddingRight, u2.push(e2);
      continue;
    }
    throw new Error(`Invalid column width: ${JSON.stringify(E3)}`);
  }
  return u2;
};
function aD(D4, F4) {
  for (let u2 of D4) {
    let { width: C4 } = u2;
    if (C4 === "content-width" && (u2.width = u2.contentWidth), C4 === "auto") {
      let n = Math.min(20, u2.contentWidth);
      u2.width = n, u2.autoOverflow = u2.contentWidth - n;
    }
    if (typeof C4 == "string" && _2.test(C4)) {
      let n = Number.parseFloat(C4.slice(0, -1)) / 100;
      u2.width = Math.floor(F4 * n) - (u2.paddingLeft + u2.paddingRight);
    }
    let { horizontalPadding: t } = u2, E3 = 1, e2 = E3 + t;
    if (e2 >= F4) {
      let n = e2 - F4, o2 = Math.ceil(u2.paddingLeft / t * n), B2 = n - o2;
      u2.paddingLeft -= o2, u2.paddingRight -= B2, u2.horizontalPadding = u2.paddingLeft + u2.paddingRight;
    }
    u2.paddingLeftString = u2.paddingLeft ? " ".repeat(u2.paddingLeft) : "", u2.paddingRightString = u2.paddingRight ? " ".repeat(u2.paddingRight) : "";
    let r2 = F4 - u2.horizontalPadding;
    u2.width = Math.max(Math.min(u2.width, r2), E3);
  }
}
var G2 = () => Object.assign([], { columns: 0 });
function lD(D4, F4) {
  let u2 = [G2()], [C4] = u2;
  for (let t of D4) {
    let E3 = t.width + t.horizontalPadding;
    C4.columns + E3 > F4 && (C4 = G2(), u2.push(C4)), C4.push(t), C4.columns += E3;
  }
  for (let t of u2) {
    let E3 = t.reduce((s, l) => s + l.width + l.horizontalPadding, 0), e2 = F4 - E3;
    if (e2 === 0)
      continue;
    let r2 = t.filter((s) => "autoOverflow" in s), n = r2.filter((s) => s.autoOverflow > 0), o2 = n.reduce((s, l) => s + l.autoOverflow, 0), B2 = Math.min(o2, e2);
    for (let s of n) {
      let l = Math.floor(s.autoOverflow / o2 * B2);
      s.width += l, e2 -= l;
    }
    let a2 = Math.floor(e2 / r2.length);
    for (let s = 0; s < r2.length; s += 1) {
      let l = r2[s];
      s === r2.length - 1 ? l.width += e2 : l.width += a2, e2 -= a2;
    }
  }
  return u2;
}
function Z(D4, F4, u2) {
  let C4 = sD(u2, F4);
  return aD(C4, D4), lD(C4, D4);
}
i();
i();
i();
var O2 = 10;
var U2 = (D4 = 0) => (F4) => `\x1B[${F4 + D4}m`;
var V2 = (D4 = 0) => (F4) => `\x1B[${38 + D4};5;${F4}m`;
var Y = (D4 = 0) => (F4, u2, C4) => `\x1B[${38 + D4};2;${F4};${u2};${C4}m`;
function AD() {
  let D4 = /* @__PURE__ */ new Map(), F4 = { modifier: { reset: [0, 0], bold: [1, 22], dim: [2, 22], italic: [3, 23], underline: [4, 24], overline: [53, 55], inverse: [7, 27], hidden: [8, 28], strikethrough: [9, 29] }, color: { black: [30, 39], red: [31, 39], green: [32, 39], yellow: [33, 39], blue: [34, 39], magenta: [35, 39], cyan: [36, 39], white: [37, 39], blackBright: [90, 39], redBright: [91, 39], greenBright: [92, 39], yellowBright: [93, 39], blueBright: [94, 39], magentaBright: [95, 39], cyanBright: [96, 39], whiteBright: [97, 39] }, bgColor: { bgBlack: [40, 49], bgRed: [41, 49], bgGreen: [42, 49], bgYellow: [43, 49], bgBlue: [44, 49], bgMagenta: [45, 49], bgCyan: [46, 49], bgWhite: [47, 49], bgBlackBright: [100, 49], bgRedBright: [101, 49], bgGreenBright: [102, 49], bgYellowBright: [103, 49], bgBlueBright: [104, 49], bgMagentaBright: [105, 49], bgCyanBright: [106, 49], bgWhiteBright: [107, 49] } };
  F4.color.gray = F4.color.blackBright, F4.bgColor.bgGray = F4.bgColor.bgBlackBright, F4.color.grey = F4.color.blackBright, F4.bgColor.bgGrey = F4.bgColor.bgBlackBright;
  for (let [u2, C4] of Object.entries(F4)) {
    for (let [t, E3] of Object.entries(C4))
      F4[t] = { open: `\x1B[${E3[0]}m`, close: `\x1B[${E3[1]}m` }, C4[t] = F4[t], D4.set(E3[0], E3[1]);
    Object.defineProperty(F4, u2, { value: C4, enumerable: false });
  }
  return Object.defineProperty(F4, "codes", { value: D4, enumerable: false }), F4.color.close = "\x1B[39m", F4.bgColor.close = "\x1B[49m", F4.color.ansi = U2(), F4.color.ansi256 = V2(), F4.color.ansi16m = Y(), F4.bgColor.ansi = U2(O2), F4.bgColor.ansi256 = V2(O2), F4.bgColor.ansi16m = Y(O2), Object.defineProperties(F4, { rgbToAnsi256: { value: (u2, C4, t) => u2 === C4 && C4 === t ? u2 < 8 ? 16 : u2 > 248 ? 231 : Math.round((u2 - 8) / 247 * 24) + 232 : 16 + 36 * Math.round(u2 / 255 * 5) + 6 * Math.round(C4 / 255 * 5) + Math.round(t / 255 * 5), enumerable: false }, hexToRgb: { value: (u2) => {
    let C4 = /(?<colorString>[a-f\d]{6}|[a-f\d]{3})/i.exec(u2.toString(16));
    if (!C4)
      return [0, 0, 0];
    let { colorString: t } = C4.groups;
    t.length === 3 && (t = t.split("").map((e2) => e2 + e2).join(""));
    let E3 = Number.parseInt(t, 16);
    return [E3 >> 16 & 255, E3 >> 8 & 255, E3 & 255];
  }, enumerable: false }, hexToAnsi256: { value: (u2) => F4.rgbToAnsi256(...F4.hexToRgb(u2)), enumerable: false }, ansi256ToAnsi: { value: (u2) => {
    if (u2 < 8)
      return 30 + u2;
    if (u2 < 16)
      return 90 + (u2 - 8);
    let C4, t, E3;
    if (u2 >= 232)
      C4 = ((u2 - 232) * 10 + 8) / 255, t = C4, E3 = C4;
    else {
      u2 -= 16;
      let n = u2 % 36;
      C4 = Math.floor(u2 / 36) / 5, t = Math.floor(n / 6) / 5, E3 = n % 6 / 5;
    }
    let e2 = Math.max(C4, t, E3) * 2;
    if (e2 === 0)
      return 30;
    let r2 = 30 + (Math.round(E3) << 2 | Math.round(t) << 1 | Math.round(C4));
    return e2 === 2 && (r2 += 60), r2;
  }, enumerable: false }, rgbToAnsi: { value: (u2, C4, t) => F4.ansi256ToAnsi(F4.rgbToAnsi256(u2, C4, t)), enumerable: false }, hexToAnsi: { value: (u2) => F4.ansi256ToAnsi(F4.hexToAnsi256(u2)), enumerable: false } }), F4;
}
var fD = AD();
var K2 = fD;
var x = /* @__PURE__ */ new Set(["\x1B", "\x9B"]);
var gD = 39;
var R2 = "\x07";
var q = "[";
var pD = "]";
var H = "m";
var M = `${pD}8;;`;
var J = (D4) => `${x.values().next().value}${q}${D4}${H}`;
var Q = (D4) => `${x.values().next().value}${M}${D4}${R2}`;
var hD = (D4) => D4.split(" ").map((F4) => g(F4));
var S = (D4, F4, u2) => {
  let C4 = [...F4], t = false, E3 = false, e2 = g(d2(D4[D4.length - 1]));
  for (let [r2, n] of C4.entries()) {
    let o2 = g(n);
    if (e2 + o2 <= u2 ? D4[D4.length - 1] += n : (D4.push(n), e2 = 0), x.has(n) && (t = true, E3 = C4.slice(r2 + 1).join("").startsWith(M)), t) {
      E3 ? n === R2 && (t = false, E3 = false) : n === H && (t = false);
      continue;
    }
    e2 += o2, e2 === u2 && r2 < C4.length - 1 && (D4.push(""), e2 = 0);
  }
  !e2 && D4[D4.length - 1].length > 0 && D4.length > 1 && (D4[D4.length - 2] += D4.pop());
};
var cD = (D4) => {
  let F4 = D4.split(" "), u2 = F4.length;
  for (; u2 > 0 && !(g(F4[u2 - 1]) > 0); )
    u2--;
  return u2 === F4.length ? D4 : F4.slice(0, u2).join(" ") + F4.slice(u2).join("");
};
var dD = (D4, F4, u2 = {}) => {
  if (u2.trim !== false && D4.trim() === "")
    return "";
  let C4 = "", t, E3, e2 = hD(D4), r2 = [""];
  for (let [o2, B2] of D4.split(" ").entries()) {
    u2.trim !== false && (r2[r2.length - 1] = r2[r2.length - 1].trimStart());
    let a2 = g(r2[r2.length - 1]);
    if (o2 !== 0 && (a2 >= F4 && (u2.wordWrap === false || u2.trim === false) && (r2.push(""), a2 = 0), (a2 > 0 || u2.trim === false) && (r2[r2.length - 1] += " ", a2++)), u2.hard && e2[o2] > F4) {
      let s = F4 - a2, l = 1 + Math.floor((e2[o2] - s - 1) / F4);
      Math.floor((e2[o2] - 1) / F4) < l && r2.push(""), S(r2, B2, F4);
      continue;
    }
    if (a2 + e2[o2] > F4 && a2 > 0 && e2[o2] > 0) {
      if (u2.wordWrap === false && a2 < F4) {
        S(r2, B2, F4);
        continue;
      }
      r2.push("");
    }
    if (a2 + e2[o2] > F4 && u2.wordWrap === false) {
      S(r2, B2, F4);
      continue;
    }
    r2[r2.length - 1] += B2;
  }
  u2.trim !== false && (r2 = r2.map((o2) => cD(o2)));
  let n = [...r2.join(`
`)];
  for (let [o2, B2] of n.entries()) {
    if (C4 += B2, x.has(B2)) {
      let { groups: s } = new RegExp(`(?:\\${q}(?<code>\\d+)m|\\${M}(?<uri>.*)${R2})`).exec(n.slice(o2).join("")) || { groups: {} };
      if (s.code !== void 0) {
        let l = Number.parseFloat(s.code);
        t = l === gD ? void 0 : l;
      } else
        s.uri !== void 0 && (E3 = s.uri.length === 0 ? void 0 : s.uri);
    }
    let a2 = K2.codes.get(Number(t));
    n[o2 + 1] === `
` ? (E3 && (C4 += Q("")), t && a2 && (C4 += J(a2))) : B2 === `
` && (t && a2 && (C4 += J(t)), E3 && (C4 += Q(E3)));
  }
  return C4;
};
function T2(D4, F4, u2) {
  return String(D4).normalize().replace(/\r\n/g, `
`).split(`
`).map((C4) => dD(C4, F4, u2)).join(`
`);
}
var X = (D4) => Array.from({ length: D4 }).fill("");
function P(D4, F4) {
  let u2 = [], C4 = 0;
  for (let t of D4) {
    let E3 = 0, e2 = t.map((n) => {
      var a2;
      let o2 = (a2 = F4[C4]) != null ? a2 : "";
      C4 += 1, n.preprocess && (o2 = n.preprocess(o2)), b2(o2) > n.width && (o2 = T2(o2, n.width, { hard: true }));
      let B2 = o2.split(`
`);
      if (n.postprocess) {
        let { postprocess: s } = n;
        B2 = B2.map((l, h4) => s.call(n, l, h4));
      }
      return n.paddingTop && B2.unshift(...X(n.paddingTop)), n.paddingBottom && B2.push(...X(n.paddingBottom)), B2.length > E3 && (E3 = B2.length), c(p({}, n), { lines: B2 });
    }), r2 = [];
    for (let n = 0; n < E3; n += 1) {
      let o2 = e2.map((B2) => {
        var h4;
        let a2 = (h4 = B2.lines[n]) != null ? h4 : "", s = Number.isFinite(B2.width) ? " ".repeat(B2.width - g(a2)) : "", l = B2.paddingLeftString;
        return B2.align === "right" && (l += s), l += a2, B2.align === "left" && (l += s), l + B2.paddingRightString;
      }).join("");
      r2.push(o2);
    }
    u2.push(r2.join(`
`));
  }
  return u2.join(`
`);
}
function mD(D4, F4) {
  if (!D4 || D4.length === 0)
    return "";
  let u2 = k2(D4), C4 = u2.length;
  if (C4 === 0)
    return "";
  let { stdoutColumns: t, columns: E3 } = v2(F4);
  if (E3.length > C4)
    throw new Error(`${E3.length} columns defined, but only ${C4} columns found`);
  let e2 = Z(t, E3, u2);
  return D4.map((r2) => P(e2, r2)).join(`
`);
}
i();
var bD = ["<", ">", "=", ">=", "<="];
function xD(D4) {
  if (!bD.includes(D4))
    throw new TypeError(`Invalid breakpoint operator: ${D4}`);
}
function wD(D4) {
  let F4 = Object.keys(D4).map((u2) => {
    let [C4, t] = u2.split(" ");
    xD(C4);
    let E3 = Number.parseInt(t, 10);
    if (Number.isNaN(E3))
      throw new TypeError(`Invalid breakpoint value: ${t}`);
    let e2 = D4[u2];
    return { operator: C4, breakpoint: E3, value: e2 };
  }).sort((u2, C4) => C4.breakpoint - u2.breakpoint);
  return (u2) => {
    var C4;
    return (C4 = F4.find(({ operator: t, breakpoint: E3 }) => t === "=" && u2 === E3 || t === ">" && u2 > E3 || t === "<" && u2 < E3 || t === ">=" && u2 >= E3 || t === "<=" && u2 <= E3)) == null ? void 0 : C4.value;
  };
}

// node_modules/cleye/dist/index.mjs
var S2 = (t) => t.replace(/[\W_]([a-z\d])?/gi, (e2, r2) => r2 ? r2.toUpperCase() : "");
var q2 = (t) => t.replace(/\B([A-Z])/g, "-$1").toLowerCase();
var I2 = { "> 80": [{ width: "content-width", paddingLeft: 2, paddingRight: 8 }, { width: "auto" }], "> 40": [{ width: "auto", paddingLeft: 2, paddingRight: 8, preprocess: (t) => t.trim() }, { width: "100%", paddingLeft: 2, paddingBottom: 1 }], "> 0": { stdoutColumns: 1e3, columns: [{ width: "content-width", paddingLeft: 2, paddingRight: 8 }, { width: "content-width" }] } };
function D2(t) {
  let e2 = false;
  return { type: "table", data: { tableData: Object.keys(t).sort((a2, i2) => a2.localeCompare(i2)).map((a2) => {
    const i2 = t[a2], s = "alias" in i2;
    return s && (e2 = true), { name: a2, flag: i2, flagFormatted: `--${q2(a2)}`, aliasesEnabled: e2, aliasFormatted: s ? `-${i2.alias}` : void 0 };
  }).map((a2) => (a2.aliasesEnabled = e2, [{ type: "flagName", data: a2 }, { type: "flagDescription", data: a2 }])), tableBreakpoints: I2 } };
}
var A = (t) => !t || (t.version ?? (t.help ? t.help.version : void 0));
var C2 = (t) => {
  const e2 = "parent" in t && t.parent?.name;
  return (e2 ? `${e2} ` : "") + t.name;
};
function R3(t) {
  const e2 = [];
  t.name && e2.push(C2(t));
  const r2 = A(t) ?? ("parent" in t && A(t.parent));
  if (r2 && e2.push(`v${r2}`), e2.length !== 0)
    return { id: "name", type: "text", data: `${e2.join(" ")}
` };
}
function L3(t) {
  const { help: e2 } = t;
  if (!(!e2 || !e2.description))
    return { id: "description", type: "text", data: `${e2.description}
` };
}
function T3(t) {
  const e2 = t.help || {};
  if ("usage" in e2)
    return e2.usage ? { id: "usage", type: "section", data: { title: "Usage:", body: Array.isArray(e2.usage) ? e2.usage.join(`
`) : e2.usage } } : void 0;
  if (t.name) {
    const r2 = [], n = [C2(t)];
    if (t.flags && Object.keys(t.flags).length > 0 && n.push("[flags...]"), t.parameters && t.parameters.length > 0) {
      const { parameters: a2 } = t, i2 = a2.indexOf("--"), s = i2 > -1 && a2.slice(i2 + 1).some((o2) => o2.startsWith("<"));
      n.push(a2.map((o2) => o2 !== "--" ? o2 : s ? "--" : "[--]").join(" "));
    }
    if (n.length > 1 && r2.push(n.join(" ")), "commands" in t && t.commands?.length && r2.push(`${t.name} <command>`), r2.length > 0)
      return { id: "usage", type: "section", data: { title: "Usage:", body: r2.join(`
`) } };
  }
}
function _3(t) {
  return !("commands" in t) || !t.commands?.length ? void 0 : { id: "commands", type: "section", data: { title: "Commands:", body: { type: "table", data: { tableData: t.commands.map((n) => [n.options.name, n.options.help ? n.options.help.description : ""]), tableOptions: [{ width: "content-width", paddingLeft: 2, paddingRight: 8 }] } }, indentBody: 0 } };
}
function k3(t) {
  if (!(!t.flags || Object.keys(t.flags).length === 0))
    return { id: "flags", type: "section", data: { title: "Flags:", body: D2(t.flags), indentBody: 0 } };
}
function F2(t) {
  const { help: e2 } = t;
  if (!e2 || !e2.examples || e2.examples.length === 0)
    return;
  let { examples: r2 } = e2;
  if (Array.isArray(r2) && (r2 = r2.join(`
`)), r2)
    return { id: "examples", type: "section", data: { title: "Examples:", body: r2 } };
}
function H2(t) {
  if (!("alias" in t) || !t.alias)
    return;
  const { alias: e2 } = t;
  return { id: "aliases", type: "section", data: { title: "Aliases:", body: Array.isArray(e2) ? e2.join(", ") : e2 } };
}
var U3 = (t) => [R3, L3, T3, _3, k3, F2, H2].map((e2) => e2(t)).filter(Boolean);
var J2 = import_tty.default.WriteStream.prototype.hasColors();
var M2 = class {
  text(e2) {
    return e2;
  }
  bold(e2) {
    return J2 ? `\x1B[1m${e2}\x1B[22m` : e2.toLocaleUpperCase();
  }
  indentText({ text: e2, spaces: r2 }) {
    return e2.replace(/^/gm, " ".repeat(r2));
  }
  heading(e2) {
    return this.bold(e2);
  }
  section({ title: e2, body: r2, indentBody: n = 2 }) {
    return `${(e2 ? `${this.heading(e2)}
` : "") + (r2 ? this.indentText({ text: this.render(r2), spaces: n }) : "")}
`;
  }
  table({ tableData: e2, tableOptions: r2, tableBreakpoints: n }) {
    return mD(e2.map((a2) => a2.map((i2) => this.render(i2))), n ? wD(n) : r2);
  }
  flagParameter(e2) {
    return e2 === Boolean ? "" : e2 === String ? "<string>" : e2 === Number ? "<number>" : Array.isArray(e2) ? this.flagParameter(e2[0]) : "<value>";
  }
  flagOperator(e2) {
    return " ";
  }
  flagName(e2) {
    const { flag: r2, flagFormatted: n, aliasesEnabled: a2, aliasFormatted: i2 } = e2;
    let s = "";
    if (i2 ? s += `${i2}, ` : a2 && (s += "    "), s += n, "placeholder" in r2 && typeof r2.placeholder == "string")
      s += `${this.flagOperator(e2)}${r2.placeholder}`;
    else {
      const o2 = this.flagParameter("type" in r2 ? r2.type : r2);
      o2 && (s += `${this.flagOperator(e2)}${o2}`);
    }
    return s;
  }
  flagDefault(e2) {
    return JSON.stringify(e2);
  }
  flagDescription({ flag: e2 }) {
    let r2 = "description" in e2 ? e2.description ?? "" : "";
    if ("default" in e2) {
      let { default: n } = e2;
      typeof n == "function" && (n = n()), n && (r2 += ` (default: ${this.flagDefault(n)})`);
    }
    return r2;
  }
  render(e2) {
    if (typeof e2 == "string")
      return e2;
    if (Array.isArray(e2))
      return e2.map((r2) => this.render(r2)).join(`
`);
    if ("type" in e2 && this[e2.type]) {
      const r2 = this[e2.type];
      if (typeof r2 == "function")
        return r2.call(this, e2.data);
    }
    throw new Error(`Invalid node type: ${JSON.stringify(e2)}`);
  }
};
var y2 = /^[\w.-]+$/;
var { stringify: d3 } = JSON;
var V3 = /[|\\{}()[\]^$+*?.]/;
function w3(t) {
  const e2 = [];
  let r2, n;
  for (const a2 of t) {
    if (n)
      throw new Error(`Invalid parameter: Spread parameter ${d3(n)} must be last`);
    const i2 = a2[0], s = a2[a2.length - 1];
    let o2;
    if (i2 === "<" && s === ">" && (o2 = true, r2))
      throw new Error(`Invalid parameter: Required parameter ${d3(a2)} cannot come after optional parameter ${d3(r2)}`);
    if (i2 === "[" && s === "]" && (o2 = false, r2 = a2), o2 === void 0)
      throw new Error(`Invalid parameter: ${d3(a2)}. Must be wrapped in <> (required parameter) or [] (optional parameter)`);
    let l = a2.slice(1, -1);
    const f3 = l.slice(-3) === "...";
    f3 && (n = a2, l = l.slice(0, -3));
    const p4 = l.match(V3);
    if (p4)
      throw new Error(`Invalid parameter: ${d3(a2)}. Invalid character found ${d3(p4[0])}`);
    e2.push({ name: l, required: o2, spread: f3 });
  }
  return e2;
}
function b3(t, e2, r2, n) {
  for (let a2 = 0; a2 < e2.length; a2 += 1) {
    const { name: i2, required: s, spread: o2 } = e2[a2], l = S2(i2);
    if (l in t)
      throw new Error(`Invalid parameter: ${d3(i2)} is used more than once.`);
    const f3 = o2 ? r2.slice(a2) : r2[a2];
    if (o2 && (a2 = e2.length), s && (!f3 || o2 && f3.length === 0))
      return console.error(`Error: Missing required parameter ${d3(i2)}
`), n(), process.exit(1);
    t[l] = f3;
  }
}
function W2(t) {
  return t === void 0 || t !== false;
}
function x2(t, e2, r2, n) {
  const a2 = { ...e2.flags }, i2 = e2.version;
  i2 && (a2.version = { type: Boolean, description: "Show version" });
  const { help: s } = e2, o2 = W2(s);
  o2 && !("help" in a2) && (a2.help = { type: Boolean, alias: "h", description: "Show help" });
  const l = U(a2, n, { ignore: e2.ignoreArgv }), f3 = () => {
    console.log(e2.version);
  };
  if (i2 && l.flags.version === true)
    return f3(), process.exit(0);
  const p4 = new M2(), O4 = o2 && s?.render ? s.render : (c3) => p4.render(c3), u2 = (c3) => {
    const m4 = U3({ ...e2, ...c3 ? { help: c3 } : {}, flags: a2 });
    console.log(O4(m4, p4));
  };
  if (o2 && l.flags.help === true)
    return u2(), process.exit(0);
  if (e2.parameters) {
    let { parameters: c3 } = e2, m4 = l._;
    const g3 = c3.indexOf("--"), v4 = c3.slice(g3 + 1), h4 = /* @__PURE__ */ Object.create(null);
    if (g3 > -1 && v4.length > 0) {
      c3 = c3.slice(0, g3);
      const E3 = l._["--"];
      m4 = m4.slice(0, -E3.length || void 0), b3(h4, w3(c3), m4, u2), b3(h4, w3(v4), E3, u2);
    } else
      b3(h4, w3(c3), m4, u2);
    Object.assign(l._, h4);
  }
  const $5 = { ...l, showVersion: f3, showHelp: u2 };
  return typeof r2 == "function" && r2($5), { command: t, ...$5 };
}
function z2(t, e2) {
  const r2 = /* @__PURE__ */ new Map();
  for (const n of e2) {
    const a2 = [n.options.name], { alias: i2 } = n.options;
    i2 && (Array.isArray(i2) ? a2.push(...i2) : a2.push(i2));
    for (const s of a2) {
      if (r2.has(s))
        throw new Error(`Duplicate command name found: ${d3(s)}`);
      r2.set(s, n);
    }
  }
  return r2.get(t);
}
function Z2(t, e2, r2 = process.argv.slice(2)) {
  if (!t)
    throw new Error("Options is required");
  if ("name" in t && (!t.name || !y2.test(t.name)))
    throw new Error(`Invalid script name: ${d3(t.name)}`);
  const n = r2[0];
  if (t.commands && y2.test(n)) {
    const a2 = z2(n, t.commands);
    if (a2)
      return x2(a2.options.name, { ...a2.options, parent: t }, a2.callback, r2.slice(1));
  }
  return x2(void 0, t, e2, r2);
}
function G3(t, e2) {
  if (!t)
    throw new Error("Command options are required");
  const { name: r2 } = t;
  if (t.name === void 0)
    throw new Error("Command name is required");
  if (!y2.test(r2))
    throw new Error(`Invalid command name ${JSON.stringify(r2)}. Command names must be one word.`);
  return { options: t, callback: e2 };
}

// package.json
var package_default = {
  name: "startgptcommit",
  version: "3.0.4",
  description: "Auto-generate impressive commits in 1 second. Killing lame commits with AI \u{1F92F}\u{1F52B}",
  keywords: [
    "git",
    "chatgpt",
    "gpt",
    "ai",
    "openai",
    "startgptcommit",
    "aicommit",
    "aicommits",
    "gptcommit",
    "commit"
  ],
  main: "cli.js",
  bin: {
    "startgptcommit": "./out/cli.cjs",
    oco: "./out/cli.cjs"
  },
  repository: {
    url: "https://github.com/khulnasoft/startgptcommit"
  },
  type: "module",
  author: "https://github.com/khulnasoft",
  license: "MIT",
  files: [
    "out/cli.cjs",
    "out/tiktoken_bg.wasm"
  ],
  release: {
    branches: [
      "master"
    ]
  },
  publishConfig: {
    access: "public"
  },
  scripts: {
    watch: "npm run -S build -- --sourcemap --watch",
    start: "node ./out/cli.cjs",
    dev: "ts-node ./src/cli.ts",
    build: "rimraf out && node esbuild.config.js",
    "build:push": "npm run build && git add . && git commit -m 'build' && git push",
    deploy: "npm version patch && npm run build:push && git push --tags && npm publish --tag latest",
    lint: "eslint src --ext ts && tsc --noEmit",
    format: "prettier --write src"
  },
  devDependencies: {
    "@commitlint/types": "^17.8.1",
    "@types/ini": "^1.3.34",
    "@types/inquirer": "^9.0.3",
    "@types/node": "^16.18.14",
    "@typescript-eslint/eslint-plugin": "^5.45.0",
    "@typescript-eslint/parser": "^5.45.0",
    dotenv: "^16.3.2",
    esbuild: "^0.15.18",
    eslint: "^8.56.0",
    prettier: "^2.8.4",
    "ts-node": "^10.9.2",
    typescript: "^4.9.5"
  },
  dependencies: {
    "@actions/core": "^1.10.0",
    "@actions/exec": "^1.1.1",
    "@actions/github": "^5.1.1",
    "@clack/prompts": "^0.6.1",
    "@dqbd/tiktoken": "^1.0.2",
    "@octokit/webhooks-schemas": "^6.11.0",
    "@octokit/webhooks-types": "^6.11.0",
    axios: "^1.3.4",
    chalk: "^5.2.0",
    cleye: "^1.3.2",
    crypto: "^1.0.1",
    execa: "^7.0.0",
    ignore: "^5.2.4",
    ini: "^3.0.1",
    inquirer: "^9.1.4",
    openai: "^3.2.1"
  }
};

// node_modules/chalk/source/vendor/ansi-styles/index.js
var ANSI_BACKGROUND_OFFSET = 10;
var wrapAnsi16 = (offset = 0) => (code) => `\x1B[${code + offset}m`;
var wrapAnsi256 = (offset = 0) => (code) => `\x1B[${38 + offset};5;${code}m`;
var wrapAnsi16m = (offset = 0) => (red, green, blue) => `\x1B[${38 + offset};2;${red};${green};${blue}m`;
var styles = {
  modifier: {
    reset: [0, 0],
    bold: [1, 22],
    dim: [2, 22],
    italic: [3, 23],
    underline: [4, 24],
    overline: [53, 55],
    inverse: [7, 27],
    hidden: [8, 28],
    strikethrough: [9, 29]
  },
  color: {
    black: [30, 39],
    red: [31, 39],
    green: [32, 39],
    yellow: [33, 39],
    blue: [34, 39],
    magenta: [35, 39],
    cyan: [36, 39],
    white: [37, 39],
    blackBright: [90, 39],
    gray: [90, 39],
    grey: [90, 39],
    redBright: [91, 39],
    greenBright: [92, 39],
    yellowBright: [93, 39],
    blueBright: [94, 39],
    magentaBright: [95, 39],
    cyanBright: [96, 39],
    whiteBright: [97, 39]
  },
  bgColor: {
    bgBlack: [40, 49],
    bgRed: [41, 49],
    bgGreen: [42, 49],
    bgYellow: [43, 49],
    bgBlue: [44, 49],
    bgMagenta: [45, 49],
    bgCyan: [46, 49],
    bgWhite: [47, 49],
    bgBlackBright: [100, 49],
    bgGray: [100, 49],
    bgGrey: [100, 49],
    bgRedBright: [101, 49],
    bgGreenBright: [102, 49],
    bgYellowBright: [103, 49],
    bgBlueBright: [104, 49],
    bgMagentaBright: [105, 49],
    bgCyanBright: [106, 49],
    bgWhiteBright: [107, 49]
  }
};
var modifierNames = Object.keys(styles.modifier);
var foregroundColorNames = Object.keys(styles.color);
var backgroundColorNames = Object.keys(styles.bgColor);
var colorNames = [...foregroundColorNames, ...backgroundColorNames];
function assembleStyles() {
  const codes = /* @__PURE__ */ new Map();
  for (const [groupName, group] of Object.entries(styles)) {
    for (const [styleName, style] of Object.entries(group)) {
      styles[styleName] = {
        open: `\x1B[${style[0]}m`,
        close: `\x1B[${style[1]}m`
      };
      group[styleName] = styles[styleName];
      codes.set(style[0], style[1]);
    }
    Object.defineProperty(styles, groupName, {
      value: group,
      enumerable: false
    });
  }
  Object.defineProperty(styles, "codes", {
    value: codes,
    enumerable: false
  });
  styles.color.close = "\x1B[39m";
  styles.bgColor.close = "\x1B[49m";
  styles.color.ansi = wrapAnsi16();
  styles.color.ansi256 = wrapAnsi256();
  styles.color.ansi16m = wrapAnsi16m();
  styles.bgColor.ansi = wrapAnsi16(ANSI_BACKGROUND_OFFSET);
  styles.bgColor.ansi256 = wrapAnsi256(ANSI_BACKGROUND_OFFSET);
  styles.bgColor.ansi16m = wrapAnsi16m(ANSI_BACKGROUND_OFFSET);
  Object.defineProperties(styles, {
    rgbToAnsi256: {
      value(red, green, blue) {
        if (red === green && green === blue) {
          if (red < 8) {
            return 16;
          }
          if (red > 248) {
            return 231;
          }
          return Math.round((red - 8) / 247 * 24) + 232;
        }
        return 16 + 36 * Math.round(red / 255 * 5) + 6 * Math.round(green / 255 * 5) + Math.round(blue / 255 * 5);
      },
      enumerable: false
    },
    hexToRgb: {
      value(hex) {
        const matches = /[a-f\d]{6}|[a-f\d]{3}/i.exec(hex.toString(16));
        if (!matches) {
          return [0, 0, 0];
        }
        let [colorString] = matches;
        if (colorString.length === 3) {
          colorString = [...colorString].map((character) => character + character).join("");
        }
        const integer = Number.parseInt(colorString, 16);
        return [
          integer >> 16 & 255,
          integer >> 8 & 255,
          integer & 255
        ];
      },
      enumerable: false
    },
    hexToAnsi256: {
      value: (hex) => styles.rgbToAnsi256(...styles.hexToRgb(hex)),
      enumerable: false
    },
    ansi256ToAnsi: {
      value(code) {
        if (code < 8) {
          return 30 + code;
        }
        if (code < 16) {
          return 90 + (code - 8);
        }
        let red;
        let green;
        let blue;
        if (code >= 232) {
          red = ((code - 232) * 10 + 8) / 255;
          green = red;
          blue = red;
        } else {
          code -= 16;
          const remainder = code % 36;
          red = Math.floor(code / 36) / 5;
          green = Math.floor(remainder / 6) / 5;
          blue = remainder % 6 / 5;
        }
        const value = Math.max(red, green, blue) * 2;
        if (value === 0) {
          return 30;
        }
        let result = 30 + (Math.round(blue) << 2 | Math.round(green) << 1 | Math.round(red));
        if (value === 2) {
          result += 60;
        }
        return result;
      },
      enumerable: false
    },
    rgbToAnsi: {
      value: (red, green, blue) => styles.ansi256ToAnsi(styles.rgbToAnsi256(red, green, blue)),
      enumerable: false
    },
    hexToAnsi: {
      value: (hex) => styles.ansi256ToAnsi(styles.hexToAnsi256(hex)),
      enumerable: false
    }
  });
  return styles;
}
var ansiStyles = assembleStyles();
var ansi_styles_default = ansiStyles;

// node_modules/chalk/source/vendor/supports-color/index.js
var import_node_process = __toESM(require("node:process"), 1);
var import_node_os = __toESM(require("node:os"), 1);
var import_node_tty = __toESM(require("node:tty"), 1);
function hasFlag(flag, argv = globalThis.Deno ? globalThis.Deno.args : import_node_process.default.argv) {
  const prefix = flag.startsWith("-") ? "" : flag.length === 1 ? "-" : "--";
  const position = argv.indexOf(prefix + flag);
  const terminatorPosition = argv.indexOf("--");
  return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
}
var { env } = import_node_process.default;
var flagForceColor;
if (hasFlag("no-color") || hasFlag("no-colors") || hasFlag("color=false") || hasFlag("color=never")) {
  flagForceColor = 0;
} else if (hasFlag("color") || hasFlag("colors") || hasFlag("color=true") || hasFlag("color=always")) {
  flagForceColor = 1;
}
function envForceColor() {
  if ("FORCE_COLOR" in env) {
    if (env.FORCE_COLOR === "true") {
      return 1;
    }
    if (env.FORCE_COLOR === "false") {
      return 0;
    }
    return env.FORCE_COLOR.length === 0 ? 1 : Math.min(Number.parseInt(env.FORCE_COLOR, 10), 3);
  }
}
function translateLevel(level) {
  if (level === 0) {
    return false;
  }
  return {
    level,
    hasBasic: true,
    has256: level >= 2,
    has16m: level >= 3
  };
}
function _supportsColor(haveStream, { streamIsTTY, sniffFlags = true } = {}) {
  const noFlagForceColor = envForceColor();
  if (noFlagForceColor !== void 0) {
    flagForceColor = noFlagForceColor;
  }
  const forceColor = sniffFlags ? flagForceColor : noFlagForceColor;
  if (forceColor === 0) {
    return 0;
  }
  if (sniffFlags) {
    if (hasFlag("color=16m") || hasFlag("color=full") || hasFlag("color=truecolor")) {
      return 3;
    }
    if (hasFlag("color=256")) {
      return 2;
    }
  }
  if ("TF_BUILD" in env && "AGENT_NAME" in env) {
    return 1;
  }
  if (haveStream && !streamIsTTY && forceColor === void 0) {
    return 0;
  }
  const min = forceColor || 0;
  if (env.TERM === "dumb") {
    return min;
  }
  if (import_node_process.default.platform === "win32") {
    const osRelease = import_node_os.default.release().split(".");
    if (Number(osRelease[0]) >= 10 && Number(osRelease[2]) >= 10586) {
      return Number(osRelease[2]) >= 14931 ? 3 : 2;
    }
    return 1;
  }
  if ("CI" in env) {
    if ("GITHUB_ACTIONS" in env || "GITEA_ACTIONS" in env) {
      return 3;
    }
    if (["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI", "BUILDKITE", "DRONE"].some((sign) => sign in env) || env.CI_NAME === "codeship") {
      return 1;
    }
    return min;
  }
  if ("TEAMCITY_VERSION" in env) {
    return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
  }
  if (env.COLORTERM === "truecolor") {
    return 3;
  }
  if (env.TERM === "xterm-kitty") {
    return 3;
  }
  if ("TERM_PROGRAM" in env) {
    const version = Number.parseInt((env.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
    switch (env.TERM_PROGRAM) {
      case "iTerm.app": {
        return version >= 3 ? 3 : 2;
      }
      case "Apple_Terminal": {
        return 2;
      }
    }
  }
  if (/-256(color)?$/i.test(env.TERM)) {
    return 2;
  }
  if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
    return 1;
  }
  if ("COLORTERM" in env) {
    return 1;
  }
  return min;
}
function createSupportsColor(stream4, options = {}) {
  const level = _supportsColor(stream4, {
    streamIsTTY: stream4 && stream4.isTTY,
    ...options
  });
  return translateLevel(level);
}
var supportsColor = {
  stdout: createSupportsColor({ isTTY: import_node_tty.default.isatty(1) }),
  stderr: createSupportsColor({ isTTY: import_node_tty.default.isatty(2) })
};
var supports_color_default = supportsColor;

// node_modules/chalk/source/utilities.js
function stringReplaceAll(string, substring, replacer) {
  let index = string.indexOf(substring);
  if (index === -1) {
    return string;
  }
  const substringLength = substring.length;
  let endIndex = 0;
  let returnValue = "";
  do {
    returnValue += string.slice(endIndex, index) + substring + replacer;
    endIndex = index + substringLength;
    index = string.indexOf(substring, endIndex);
  } while (index !== -1);
  returnValue += string.slice(endIndex);
  return returnValue;
}
function stringEncaseCRLFWithFirstIndex(string, prefix, postfix, index) {
  let endIndex = 0;
  let returnValue = "";
  do {
    const gotCR = string[index - 1] === "\r";
    returnValue += string.slice(endIndex, gotCR ? index - 1 : index) + prefix + (gotCR ? "\r\n" : "\n") + postfix;
    endIndex = index + 1;
    index = string.indexOf("\n", endIndex);
  } while (index !== -1);
  returnValue += string.slice(endIndex);
  return returnValue;
}

// node_modules/chalk/source/index.js
var { stdout: stdoutColor, stderr: stderrColor } = supports_color_default;
var GENERATOR = Symbol("GENERATOR");
var STYLER = Symbol("STYLER");
var IS_EMPTY = Symbol("IS_EMPTY");
var levelMapping = [
  "ansi",
  "ansi",
  "ansi256",
  "ansi16m"
];
var styles2 = /* @__PURE__ */ Object.create(null);
var applyOptions = (object, options = {}) => {
  if (options.level && !(Number.isInteger(options.level) && options.level >= 0 && options.level <= 3)) {
    throw new Error("The `level` option should be an integer from 0 to 3");
  }
  const colorLevel = stdoutColor ? stdoutColor.level : 0;
  object.level = options.level === void 0 ? colorLevel : options.level;
};
var chalkFactory = (options) => {
  const chalk2 = (...strings) => strings.join(" ");
  applyOptions(chalk2, options);
  Object.setPrototypeOf(chalk2, createChalk.prototype);
  return chalk2;
};
function createChalk(options) {
  return chalkFactory(options);
}
Object.setPrototypeOf(createChalk.prototype, Function.prototype);
for (const [styleName, style] of Object.entries(ansi_styles_default)) {
  styles2[styleName] = {
    get() {
      const builder = createBuilder(this, createStyler(style.open, style.close, this[STYLER]), this[IS_EMPTY]);
      Object.defineProperty(this, styleName, { value: builder });
      return builder;
    }
  };
}
styles2.visible = {
  get() {
    const builder = createBuilder(this, this[STYLER], true);
    Object.defineProperty(this, "visible", { value: builder });
    return builder;
  }
};
var getModelAnsi = (model, level, type, ...arguments_) => {
  if (model === "rgb") {
    if (level === "ansi16m") {
      return ansi_styles_default[type].ansi16m(...arguments_);
    }
    if (level === "ansi256") {
      return ansi_styles_default[type].ansi256(ansi_styles_default.rgbToAnsi256(...arguments_));
    }
    return ansi_styles_default[type].ansi(ansi_styles_default.rgbToAnsi(...arguments_));
  }
  if (model === "hex") {
    return getModelAnsi("rgb", level, type, ...ansi_styles_default.hexToRgb(...arguments_));
  }
  return ansi_styles_default[type][model](...arguments_);
};
var usedModels = ["rgb", "hex", "ansi256"];
for (const model of usedModels) {
  styles2[model] = {
    get() {
      const { level } = this;
      return function(...arguments_) {
        const styler = createStyler(getModelAnsi(model, levelMapping[level], "color", ...arguments_), ansi_styles_default.color.close, this[STYLER]);
        return createBuilder(this, styler, this[IS_EMPTY]);
      };
    }
  };
  const bgModel = "bg" + model[0].toUpperCase() + model.slice(1);
  styles2[bgModel] = {
    get() {
      const { level } = this;
      return function(...arguments_) {
        const styler = createStyler(getModelAnsi(model, levelMapping[level], "bgColor", ...arguments_), ansi_styles_default.bgColor.close, this[STYLER]);
        return createBuilder(this, styler, this[IS_EMPTY]);
      };
    }
  };
}
var proto = Object.defineProperties(() => {
}, {
  ...styles2,
  level: {
    enumerable: true,
    get() {
      return this[GENERATOR].level;
    },
    set(level) {
      this[GENERATOR].level = level;
    }
  }
});
var createStyler = (open, close, parent) => {
  let openAll;
  let closeAll;
  if (parent === void 0) {
    openAll = open;
    closeAll = close;
  } else {
    openAll = parent.openAll + open;
    closeAll = close + parent.closeAll;
  }
  return {
    open,
    close,
    openAll,
    closeAll,
    parent
  };
};
var createBuilder = (self2, _styler, _isEmpty) => {
  const builder = (...arguments_) => applyStyle(builder, arguments_.length === 1 ? "" + arguments_[0] : arguments_.join(" "));
  Object.setPrototypeOf(builder, proto);
  builder[GENERATOR] = self2;
  builder[STYLER] = _styler;
  builder[IS_EMPTY] = _isEmpty;
  return builder;
};
var applyStyle = (self2, string) => {
  if (self2.level <= 0 || !string) {
    return self2[IS_EMPTY] ? "" : string;
  }
  let styler = self2[STYLER];
  if (styler === void 0) {
    return string;
  }
  const { openAll, closeAll } = styler;
  if (string.includes("\x1B")) {
    while (styler !== void 0) {
      string = stringReplaceAll(string, styler.close, styler.open);
      styler = styler.parent;
    }
  }
  const lfIndex = string.indexOf("\n");
  if (lfIndex !== -1) {
    string = stringEncaseCRLFWithFirstIndex(string, closeAll, openAll, lfIndex);
  }
  return openAll + string + closeAll;
};
Object.defineProperties(createChalk.prototype, styles2);
var chalk = createChalk();
var chalkStderr = createChalk({ level: stderrColor ? stderrColor.level : 0 });
var source_default = chalk;

// node_modules/execa/index.js
var import_node_buffer2 = require("node:buffer");
var import_node_path2 = __toESM(require("node:path"), 1);
var import_node_child_process3 = __toESM(require("node:child_process"), 1);
var import_node_process5 = __toESM(require("node:process"), 1);
var import_cross_spawn = __toESM(require_cross_spawn(), 1);

// node_modules/strip-final-newline/index.js
function stripFinalNewline(input) {
  const LF = typeof input === "string" ? "\n" : "\n".charCodeAt();
  const CR = typeof input === "string" ? "\r" : "\r".charCodeAt();
  if (input[input.length - 1] === LF) {
    input = input.slice(0, -1);
  }
  if (input[input.length - 1] === CR) {
    input = input.slice(0, -1);
  }
  return input;
}

// node_modules/npm-run-path/index.js
var import_node_process2 = __toESM(require("node:process"), 1);
var import_node_path = __toESM(require("node:path"), 1);
var import_node_url = __toESM(require("node:url"), 1);

// node_modules/npm-run-path/node_modules/path-key/index.js
function pathKey(options = {}) {
  const {
    env: env2 = process.env,
    platform = process.platform
  } = options;
  if (platform !== "win32") {
    return "PATH";
  }
  return Object.keys(env2).reverse().find((key) => key.toUpperCase() === "PATH") || "Path";
}

// node_modules/npm-run-path/index.js
function npmRunPath(options = {}) {
  const {
    cwd = import_node_process2.default.cwd(),
    path: path_ = import_node_process2.default.env[pathKey()],
    execPath = import_node_process2.default.execPath
  } = options;
  let previous;
  const execPathString = execPath instanceof URL ? import_node_url.default.fileURLToPath(execPath) : execPath;
  const cwdString = cwd instanceof URL ? import_node_url.default.fileURLToPath(cwd) : cwd;
  let cwdPath = import_node_path.default.resolve(cwdString);
  const result = [];
  while (previous !== cwdPath) {
    result.push(import_node_path.default.join(cwdPath, "node_modules/.bin"));
    previous = cwdPath;
    cwdPath = import_node_path.default.resolve(cwdPath, "..");
  }
  result.push(import_node_path.default.resolve(cwdString, execPathString, ".."));
  return [...result, path_].join(import_node_path.default.delimiter);
}
function npmRunPathEnv({ env: env2 = import_node_process2.default.env, ...options } = {}) {
  env2 = { ...env2 };
  const path5 = pathKey({ env: env2 });
  options.path = env2[path5];
  env2[path5] = npmRunPath(options);
  return env2;
}

// node_modules/mimic-fn/index.js
var copyProperty = (to, from, property, ignoreNonConfigurable) => {
  if (property === "length" || property === "prototype") {
    return;
  }
  if (property === "arguments" || property === "caller") {
    return;
  }
  const toDescriptor = Object.getOwnPropertyDescriptor(to, property);
  const fromDescriptor = Object.getOwnPropertyDescriptor(from, property);
  if (!canCopyProperty(toDescriptor, fromDescriptor) && ignoreNonConfigurable) {
    return;
  }
  Object.defineProperty(to, property, fromDescriptor);
};
var canCopyProperty = function(toDescriptor, fromDescriptor) {
  return toDescriptor === void 0 || toDescriptor.configurable || toDescriptor.writable === fromDescriptor.writable && toDescriptor.enumerable === fromDescriptor.enumerable && toDescriptor.configurable === fromDescriptor.configurable && (toDescriptor.writable || toDescriptor.value === fromDescriptor.value);
};
var changePrototype = (to, from) => {
  const fromPrototype = Object.getPrototypeOf(from);
  if (fromPrototype === Object.getPrototypeOf(to)) {
    return;
  }
  Object.setPrototypeOf(to, fromPrototype);
};
var wrappedToString = (withName, fromBody) => `/* Wrapped ${withName}*/
${fromBody}`;
var toStringDescriptor = Object.getOwnPropertyDescriptor(Function.prototype, "toString");
var toStringName = Object.getOwnPropertyDescriptor(Function.prototype.toString, "name");
var changeToString = (to, from, name) => {
  const withName = name === "" ? "" : `with ${name.trim()}() `;
  const newToString = wrappedToString.bind(null, withName, from.toString());
  Object.defineProperty(newToString, "name", toStringName);
  Object.defineProperty(to, "toString", { ...toStringDescriptor, value: newToString });
};
function mimicFunction(to, from, { ignoreNonConfigurable = false } = {}) {
  const { name } = to;
  for (const property of Reflect.ownKeys(from)) {
    copyProperty(to, from, property, ignoreNonConfigurable);
  }
  changePrototype(to, from);
  changeToString(to, from, name);
  return to;
}

// node_modules/onetime/index.js
var calledFunctions = /* @__PURE__ */ new WeakMap();
var onetime = (function_, options = {}) => {
  if (typeof function_ !== "function") {
    throw new TypeError("Expected a function");
  }
  let returnValue;
  let callCount = 0;
  const functionName = function_.displayName || function_.name || "<anonymous>";
  const onetime2 = function(...arguments_) {
    calledFunctions.set(onetime2, ++callCount);
    if (callCount === 1) {
      returnValue = function_.apply(this, arguments_);
      function_ = null;
    } else if (options.throw === true) {
      throw new Error(`Function \`${functionName}\` can only be called once`);
    }
    return returnValue;
  };
  mimicFunction(onetime2, function_);
  calledFunctions.set(onetime2, callCount);
  return onetime2;
};
onetime.callCount = (function_) => {
  if (!calledFunctions.has(function_)) {
    throw new Error(`The given function \`${function_.name}\` is not wrapped by the \`onetime\` package`);
  }
  return calledFunctions.get(function_);
};
var onetime_default = onetime;

// node_modules/execa/lib/error.js
var import_node_process3 = __toESM(require("node:process"), 1);

// node_modules/human-signals/build/src/main.js
var import_node_os3 = require("node:os");

// node_modules/human-signals/build/src/realtime.js
var getRealtimeSignals = () => {
  const length = SIGRTMAX - SIGRTMIN + 1;
  return Array.from({ length }, getRealtimeSignal);
};
var getRealtimeSignal = (value, index) => ({
  name: `SIGRT${index + 1}`,
  number: SIGRTMIN + index,
  action: "terminate",
  description: "Application-specific signal (realtime)",
  standard: "posix"
});
var SIGRTMIN = 34;
var SIGRTMAX = 64;

// node_modules/human-signals/build/src/signals.js
var import_node_os2 = require("node:os");

// node_modules/human-signals/build/src/core.js
var SIGNALS = [
  {
    name: "SIGHUP",
    number: 1,
    action: "terminate",
    description: "Terminal closed",
    standard: "posix"
  },
  {
    name: "SIGINT",
    number: 2,
    action: "terminate",
    description: "User interruption with CTRL-C",
    standard: "ansi"
  },
  {
    name: "SIGQUIT",
    number: 3,
    action: "core",
    description: "User interruption with CTRL-\\",
    standard: "posix"
  },
  {
    name: "SIGILL",
    number: 4,
    action: "core",
    description: "Invalid machine instruction",
    standard: "ansi"
  },
  {
    name: "SIGTRAP",
    number: 5,
    action: "core",
    description: "Debugger breakpoint",
    standard: "posix"
  },
  {
    name: "SIGABRT",
    number: 6,
    action: "core",
    description: "Aborted",
    standard: "ansi"
  },
  {
    name: "SIGIOT",
    number: 6,
    action: "core",
    description: "Aborted",
    standard: "bsd"
  },
  {
    name: "SIGBUS",
    number: 7,
    action: "core",
    description: "Bus error due to misaligned, non-existing address or paging error",
    standard: "bsd"
  },
  {
    name: "SIGEMT",
    number: 7,
    action: "terminate",
    description: "Command should be emulated but is not implemented",
    standard: "other"
  },
  {
    name: "SIGFPE",
    number: 8,
    action: "core",
    description: "Floating point arithmetic error",
    standard: "ansi"
  },
  {
    name: "SIGKILL",
    number: 9,
    action: "terminate",
    description: "Forced termination",
    standard: "posix",
    forced: true
  },
  {
    name: "SIGUSR1",
    number: 10,
    action: "terminate",
    description: "Application-specific signal",
    standard: "posix"
  },
  {
    name: "SIGSEGV",
    number: 11,
    action: "core",
    description: "Segmentation fault",
    standard: "ansi"
  },
  {
    name: "SIGUSR2",
    number: 12,
    action: "terminate",
    description: "Application-specific signal",
    standard: "posix"
  },
  {
    name: "SIGPIPE",
    number: 13,
    action: "terminate",
    description: "Broken pipe or socket",
    standard: "posix"
  },
  {
    name: "SIGALRM",
    number: 14,
    action: "terminate",
    description: "Timeout or timer",
    standard: "posix"
  },
  {
    name: "SIGTERM",
    number: 15,
    action: "terminate",
    description: "Termination",
    standard: "ansi"
  },
  {
    name: "SIGSTKFLT",
    number: 16,
    action: "terminate",
    description: "Stack is empty or overflowed",
    standard: "other"
  },
  {
    name: "SIGCHLD",
    number: 17,
    action: "ignore",
    description: "Child process terminated, paused or unpaused",
    standard: "posix"
  },
  {
    name: "SIGCLD",
    number: 17,
    action: "ignore",
    description: "Child process terminated, paused or unpaused",
    standard: "other"
  },
  {
    name: "SIGCONT",
    number: 18,
    action: "unpause",
    description: "Unpaused",
    standard: "posix",
    forced: true
  },
  {
    name: "SIGSTOP",
    number: 19,
    action: "pause",
    description: "Paused",
    standard: "posix",
    forced: true
  },
  {
    name: "SIGTSTP",
    number: 20,
    action: "pause",
    description: 'Paused using CTRL-Z or "suspend"',
    standard: "posix"
  },
  {
    name: "SIGTTIN",
    number: 21,
    action: "pause",
    description: "Background process cannot read terminal input",
    standard: "posix"
  },
  {
    name: "SIGBREAK",
    number: 21,
    action: "terminate",
    description: "User interruption with CTRL-BREAK",
    standard: "other"
  },
  {
    name: "SIGTTOU",
    number: 22,
    action: "pause",
    description: "Background process cannot write to terminal output",
    standard: "posix"
  },
  {
    name: "SIGURG",
    number: 23,
    action: "ignore",
    description: "Socket received out-of-band data",
    standard: "bsd"
  },
  {
    name: "SIGXCPU",
    number: 24,
    action: "core",
    description: "Process timed out",
    standard: "bsd"
  },
  {
    name: "SIGXFSZ",
    number: 25,
    action: "core",
    description: "File too big",
    standard: "bsd"
  },
  {
    name: "SIGVTALRM",
    number: 26,
    action: "terminate",
    description: "Timeout or timer",
    standard: "bsd"
  },
  {
    name: "SIGPROF",
    number: 27,
    action: "terminate",
    description: "Timeout or timer",
    standard: "bsd"
  },
  {
    name: "SIGWINCH",
    number: 28,
    action: "ignore",
    description: "Terminal window size changed",
    standard: "bsd"
  },
  {
    name: "SIGIO",
    number: 29,
    action: "terminate",
    description: "I/O is available",
    standard: "other"
  },
  {
    name: "SIGPOLL",
    number: 29,
    action: "terminate",
    description: "Watched event",
    standard: "other"
  },
  {
    name: "SIGINFO",
    number: 29,
    action: "ignore",
    description: "Request for process information",
    standard: "other"
  },
  {
    name: "SIGPWR",
    number: 30,
    action: "terminate",
    description: "Device running out of power",
    standard: "systemv"
  },
  {
    name: "SIGSYS",
    number: 31,
    action: "core",
    description: "Invalid system call",
    standard: "other"
  },
  {
    name: "SIGUNUSED",
    number: 31,
    action: "terminate",
    description: "Invalid system call",
    standard: "other"
  }
];

// node_modules/human-signals/build/src/signals.js
var getSignals = () => {
  const realtimeSignals = getRealtimeSignals();
  const signals = [...SIGNALS, ...realtimeSignals].map(normalizeSignal);
  return signals;
};
var normalizeSignal = ({
  name,
  number: defaultNumber,
  description,
  action,
  forced = false,
  standard
}) => {
  const {
    signals: { [name]: constantSignal }
  } = import_node_os2.constants;
  const supported = constantSignal !== void 0;
  const number = supported ? constantSignal : defaultNumber;
  return { name, number, description, supported, action, forced, standard };
};

// node_modules/human-signals/build/src/main.js
var getSignalsByName = () => {
  const signals = getSignals();
  return Object.fromEntries(signals.map(getSignalByName));
};
var getSignalByName = ({
  name,
  number,
  description,
  supported,
  action,
  forced,
  standard
}) => [name, { name, number, description, supported, action, forced, standard }];
var signalsByName = getSignalsByName();
var getSignalsByNumber = () => {
  const signals = getSignals();
  const length = SIGRTMAX + 1;
  const signalsA = Array.from({ length }, (value, number) => getSignalByNumber(number, signals));
  return Object.assign({}, ...signalsA);
};
var getSignalByNumber = (number, signals) => {
  const signal = findSignalByNumber(number, signals);
  if (signal === void 0) {
    return {};
  }
  const { name, description, supported, action, forced, standard } = signal;
  return {
    [number]: {
      name,
      number,
      description,
      supported,
      action,
      forced,
      standard
    }
  };
};
var findSignalByNumber = (number, signals) => {
  const signal = signals.find(({ name }) => import_node_os3.constants.signals[name] === number);
  if (signal !== void 0) {
    return signal;
  }
  return signals.find((signalA) => signalA.number === number);
};
var signalsByNumber = getSignalsByNumber();

// node_modules/execa/lib/error.js
var getErrorPrefix = ({ timedOut, timeout, errorCode, signal, signalDescription, exitCode, isCanceled }) => {
  if (timedOut) {
    return `timed out after ${timeout} milliseconds`;
  }
  if (isCanceled) {
    return "was canceled";
  }
  if (errorCode !== void 0) {
    return `failed with ${errorCode}`;
  }
  if (signal !== void 0) {
    return `was killed with ${signal} (${signalDescription})`;
  }
  if (exitCode !== void 0) {
    return `failed with exit code ${exitCode}`;
  }
  return "failed";
};
var makeError = ({
  stdout,
  stderr,
  all: all3,
  error,
  signal,
  exitCode,
  command: command2,
  escapedCommand,
  timedOut,
  isCanceled,
  killed,
  parsed: { options: { timeout, cwd = import_node_process3.default.cwd() } }
}) => {
  exitCode = exitCode === null ? void 0 : exitCode;
  signal = signal === null ? void 0 : signal;
  const signalDescription = signal === void 0 ? void 0 : signalsByName[signal].description;
  const errorCode = error && error.code;
  const prefix = getErrorPrefix({ timedOut, timeout, errorCode, signal, signalDescription, exitCode, isCanceled });
  const execaMessage = `Command ${prefix}: ${command2}`;
  const isError = Object.prototype.toString.call(error) === "[object Error]";
  const shortMessage = isError ? `${execaMessage}
${error.message}` : execaMessage;
  const message = [shortMessage, stderr, stdout].filter(Boolean).join("\n");
  if (isError) {
    error.originalMessage = error.message;
    error.message = message;
  } else {
    error = new Error(message);
  }
  error.shortMessage = shortMessage;
  error.command = command2;
  error.escapedCommand = escapedCommand;
  error.exitCode = exitCode;
  error.signal = signal;
  error.signalDescription = signalDescription;
  error.stdout = stdout;
  error.stderr = stderr;
  error.cwd = cwd;
  if (all3 !== void 0) {
    error.all = all3;
  }
  if ("bufferedData" in error) {
    delete error.bufferedData;
  }
  error.failed = true;
  error.timedOut = Boolean(timedOut);
  error.isCanceled = isCanceled;
  error.killed = killed && !timedOut;
  return error;
};

// node_modules/execa/lib/stdio.js
var aliases = ["stdin", "stdout", "stderr"];
var hasAlias = (options) => aliases.some((alias) => options[alias] !== void 0);
var normalizeStdio = (options) => {
  if (!options) {
    return;
  }
  const { stdio } = options;
  if (stdio === void 0) {
    return aliases.map((alias) => options[alias]);
  }
  if (hasAlias(options)) {
    throw new Error(`It's not possible to provide \`stdio\` in combination with one of ${aliases.map((alias) => `\`${alias}\``).join(", ")}`);
  }
  if (typeof stdio === "string") {
    return stdio;
  }
  if (!Array.isArray(stdio)) {
    throw new TypeError(`Expected \`stdio\` to be of type \`string\` or \`Array\`, got \`${typeof stdio}\``);
  }
  const length = Math.max(stdio.length, aliases.length);
  return Array.from({ length }, (value, index) => stdio[index]);
};

// node_modules/execa/lib/kill.js
var import_node_os4 = __toESM(require("node:os"), 1);
var import_signal_exit = __toESM(require_signal_exit(), 1);
var DEFAULT_FORCE_KILL_TIMEOUT = 1e3 * 5;
var spawnedKill = (kill, signal = "SIGTERM", options = {}) => {
  const killResult = kill(signal);
  setKillTimeout(kill, signal, options, killResult);
  return killResult;
};
var setKillTimeout = (kill, signal, options, killResult) => {
  if (!shouldForceKill(signal, options, killResult)) {
    return;
  }
  const timeout = getForceKillAfterTimeout(options);
  const t = setTimeout(() => {
    kill("SIGKILL");
  }, timeout);
  if (t.unref) {
    t.unref();
  }
};
var shouldForceKill = (signal, { forceKillAfterTimeout }, killResult) => isSigterm(signal) && forceKillAfterTimeout !== false && killResult;
var isSigterm = (signal) => signal === import_node_os4.default.constants.signals.SIGTERM || typeof signal === "string" && signal.toUpperCase() === "SIGTERM";
var getForceKillAfterTimeout = ({ forceKillAfterTimeout = true }) => {
  if (forceKillAfterTimeout === true) {
    return DEFAULT_FORCE_KILL_TIMEOUT;
  }
  if (!Number.isFinite(forceKillAfterTimeout) || forceKillAfterTimeout < 0) {
    throw new TypeError(`Expected the \`forceKillAfterTimeout\` option to be a non-negative integer, got \`${forceKillAfterTimeout}\` (${typeof forceKillAfterTimeout})`);
  }
  return forceKillAfterTimeout;
};
var spawnedCancel = (spawned, context) => {
  const killResult = spawned.kill();
  if (killResult) {
    context.isCanceled = true;
  }
};
var timeoutKill = (spawned, signal, reject) => {
  spawned.kill(signal);
  reject(Object.assign(new Error("Timed out"), { timedOut: true, signal }));
};
var setupTimeout = (spawned, { timeout, killSignal = "SIGTERM" }, spawnedPromise) => {
  if (timeout === 0 || timeout === void 0) {
    return spawnedPromise;
  }
  let timeoutId;
  const timeoutPromise = new Promise((resolve, reject) => {
    timeoutId = setTimeout(() => {
      timeoutKill(spawned, killSignal, reject);
    }, timeout);
  });
  const safeSpawnedPromise = spawnedPromise.finally(() => {
    clearTimeout(timeoutId);
  });
  return Promise.race([timeoutPromise, safeSpawnedPromise]);
};
var validateTimeout = ({ timeout }) => {
  if (timeout !== void 0 && (!Number.isFinite(timeout) || timeout < 0)) {
    throw new TypeError(`Expected the \`timeout\` option to be a non-negative integer, got \`${timeout}\` (${typeof timeout})`);
  }
};
var setExitHandler = async (spawned, { cleanup, detached }, timedPromise) => {
  if (!cleanup || detached) {
    return timedPromise;
  }
  const removeExitHandler = (0, import_signal_exit.default)(() => {
    spawned.kill();
  });
  return timedPromise.finally(() => {
    removeExitHandler();
  });
};

// node_modules/execa/lib/pipe.js
var import_node_fs = require("node:fs");
var import_node_child_process = require("node:child_process");

// node_modules/is-stream/index.js
function isStream(stream4) {
  return stream4 !== null && typeof stream4 === "object" && typeof stream4.pipe === "function";
}
function isWritableStream(stream4) {
  return isStream(stream4) && stream4.writable !== false && typeof stream4._write === "function" && typeof stream4._writableState === "object";
}

// node_modules/execa/lib/pipe.js
var isExecaChildProcess = (target) => target instanceof import_node_child_process.ChildProcess && typeof target.then === "function";
var pipeToTarget = (spawned, streamName, target) => {
  if (typeof target === "string") {
    spawned[streamName].pipe((0, import_node_fs.createWriteStream)(target));
    return spawned;
  }
  if (isWritableStream(target)) {
    spawned[streamName].pipe(target);
    return spawned;
  }
  if (!isExecaChildProcess(target)) {
    throw new TypeError("The second argument must be a string, a stream or an Execa child process.");
  }
  if (!isWritableStream(target.stdin)) {
    throw new TypeError("The target child process's stdin must be available.");
  }
  spawned[streamName].pipe(target.stdin);
  return target;
};
var addPipeMethods = (spawned) => {
  if (spawned.stdout !== null) {
    spawned.pipeStdout = pipeToTarget.bind(void 0, spawned, "stdout");
  }
  if (spawned.stderr !== null) {
    spawned.pipeStderr = pipeToTarget.bind(void 0, spawned, "stderr");
  }
  if (spawned.all !== void 0) {
    spawned.pipeAll = pipeToTarget.bind(void 0, spawned, "all");
  }
};

// node_modules/execa/lib/stream.js
var import_node_fs2 = require("node:fs");
var import_get_stream = __toESM(require_get_stream(), 1);
var import_merge_stream = __toESM(require_merge_stream(), 1);
var validateInputOptions = (input) => {
  if (input !== void 0) {
    throw new TypeError("The `input` and `inputFile` options cannot be both set.");
  }
};
var getInputSync = ({ input, inputFile }) => {
  if (typeof inputFile !== "string") {
    return input;
  }
  validateInputOptions(input);
  return (0, import_node_fs2.readFileSync)(inputFile);
};
var handleInputSync = (options) => {
  const input = getInputSync(options);
  if (isStream(input)) {
    throw new TypeError("The `input` option cannot be a stream in sync mode");
  }
  return input;
};
var getInput = ({ input, inputFile }) => {
  if (typeof inputFile !== "string") {
    return input;
  }
  validateInputOptions(input);
  return (0, import_node_fs2.createReadStream)(inputFile);
};
var handleInput = (spawned, options) => {
  const input = getInput(options);
  if (input === void 0) {
    return;
  }
  if (isStream(input)) {
    input.pipe(spawned.stdin);
  } else {
    spawned.stdin.end(input);
  }
};
var makeAllStream = (spawned, { all: all3 }) => {
  if (!all3 || !spawned.stdout && !spawned.stderr) {
    return;
  }
  const mixed = (0, import_merge_stream.default)();
  if (spawned.stdout) {
    mixed.add(spawned.stdout);
  }
  if (spawned.stderr) {
    mixed.add(spawned.stderr);
  }
  return mixed;
};
var getBufferedData = async (stream4, streamPromise) => {
  if (!stream4 || streamPromise === void 0) {
    return;
  }
  stream4.destroy();
  try {
    return await streamPromise;
  } catch (error) {
    return error.bufferedData;
  }
};
var getStreamPromise = (stream4, { encoding, buffer, maxBuffer }) => {
  if (!stream4 || !buffer) {
    return;
  }
  if (encoding) {
    return (0, import_get_stream.default)(stream4, { encoding, maxBuffer });
  }
  return import_get_stream.default.buffer(stream4, { maxBuffer });
};
var getSpawnedResult = async ({ stdout, stderr, all: all3 }, { encoding, buffer, maxBuffer }, processDone) => {
  const stdoutPromise = getStreamPromise(stdout, { encoding, buffer, maxBuffer });
  const stderrPromise = getStreamPromise(stderr, { encoding, buffer, maxBuffer });
  const allPromise = getStreamPromise(all3, { encoding, buffer, maxBuffer: maxBuffer * 2 });
  try {
    return await Promise.all([processDone, stdoutPromise, stderrPromise, allPromise]);
  } catch (error) {
    return Promise.all([
      { error, signal: error.signal, timedOut: error.timedOut },
      getBufferedData(stdout, stdoutPromise),
      getBufferedData(stderr, stderrPromise),
      getBufferedData(all3, allPromise)
    ]);
  }
};

// node_modules/execa/lib/promise.js
var nativePromisePrototype = (async () => {
})().constructor.prototype;
var descriptors = ["then", "catch", "finally"].map((property) => [
  property,
  Reflect.getOwnPropertyDescriptor(nativePromisePrototype, property)
]);
var mergePromise = (spawned, promise) => {
  for (const [property, descriptor] of descriptors) {
    const value = typeof promise === "function" ? (...args) => Reflect.apply(descriptor.value, promise(), args) : descriptor.value.bind(promise);
    Reflect.defineProperty(spawned, property, { ...descriptor, value });
  }
};
var getSpawnedPromise = (spawned) => new Promise((resolve, reject) => {
  spawned.on("exit", (exitCode, signal) => {
    resolve({ exitCode, signal });
  });
  spawned.on("error", (error) => {
    reject(error);
  });
  if (spawned.stdin) {
    spawned.stdin.on("error", (error) => {
      reject(error);
    });
  }
});

// node_modules/execa/lib/command.js
var import_node_buffer = require("node:buffer");
var import_node_child_process2 = require("node:child_process");
var normalizeArgs = (file, args = []) => {
  if (!Array.isArray(args)) {
    return [file];
  }
  return [file, ...args];
};
var NO_ESCAPE_REGEXP = /^[\w.-]+$/;
var DOUBLE_QUOTES_REGEXP = /"/g;
var escapeArg = (arg) => {
  if (typeof arg !== "string" || NO_ESCAPE_REGEXP.test(arg)) {
    return arg;
  }
  return `"${arg.replace(DOUBLE_QUOTES_REGEXP, '\\"')}"`;
};
var joinCommand = (file, args) => normalizeArgs(file, args).join(" ");
var getEscapedCommand = (file, args) => normalizeArgs(file, args).map((arg) => escapeArg(arg)).join(" ");
var SPACES_REGEXP = / +/g;
var parseExpression = (expression) => {
  const typeOfExpression = typeof expression;
  if (typeOfExpression === "string") {
    return expression;
  }
  if (typeOfExpression === "number") {
    return String(expression);
  }
  if (typeOfExpression === "object" && expression !== null && !(expression instanceof import_node_child_process2.ChildProcess) && "stdout" in expression) {
    const typeOfStdout = typeof expression.stdout;
    if (typeOfStdout === "string") {
      return expression.stdout;
    }
    if (import_node_buffer.Buffer.isBuffer(expression.stdout)) {
      return expression.stdout.toString();
    }
    throw new TypeError(`Unexpected "${typeOfStdout}" stdout in template expression`);
  }
  throw new TypeError(`Unexpected "${typeOfExpression}" in template expression`);
};
var concatTokens = (tokens, nextTokens, isNew) => isNew || tokens.length === 0 || nextTokens.length === 0 ? [...tokens, ...nextTokens] : [
  ...tokens.slice(0, -1),
  `${tokens[tokens.length - 1]}${nextTokens[0]}`,
  ...nextTokens.slice(1)
];
var parseTemplate = ({ templates, expressions, tokens, index, template }) => {
  const templateString = template ?? templates.raw[index];
  const templateTokens = templateString.split(SPACES_REGEXP).filter(Boolean);
  const newTokens = concatTokens(
    tokens,
    templateTokens,
    templateString.startsWith(" ")
  );
  if (index === expressions.length) {
    return newTokens;
  }
  const expression = expressions[index];
  const expressionTokens = Array.isArray(expression) ? expression.map((expression2) => parseExpression(expression2)) : [parseExpression(expression)];
  return concatTokens(
    newTokens,
    expressionTokens,
    templateString.endsWith(" ")
  );
};
var parseTemplates = (templates, expressions) => {
  let tokens = [];
  for (const [index, template] of templates.entries()) {
    tokens = parseTemplate({ templates, expressions, tokens, index, template });
  }
  return tokens;
};

// node_modules/execa/lib/verbose.js
var import_node_util = require("node:util");
var import_node_process4 = __toESM(require("node:process"), 1);
var verboseDefault = (0, import_node_util.debuglog)("execa").enabled;
var padField = (field, padding) => String(field).padStart(padding, "0");
var getTimestamp = () => {
  const date = new Date();
  return `${padField(date.getHours(), 2)}:${padField(date.getMinutes(), 2)}:${padField(date.getSeconds(), 2)}.${padField(date.getMilliseconds(), 3)}`;
};
var logCommand = (escapedCommand, { verbose }) => {
  if (!verbose) {
    return;
  }
  import_node_process4.default.stderr.write(`[${getTimestamp()}] ${escapedCommand}
`);
};

// node_modules/execa/index.js
var DEFAULT_MAX_BUFFER = 1e3 * 1e3 * 100;
var getEnv = ({ env: envOption, extendEnv, preferLocal, localDir, execPath }) => {
  const env2 = extendEnv ? { ...import_node_process5.default.env, ...envOption } : envOption;
  if (preferLocal) {
    return npmRunPathEnv({ env: env2, cwd: localDir, execPath });
  }
  return env2;
};
var handleArguments = (file, args, options = {}) => {
  const parsed = import_cross_spawn.default._parse(file, args, options);
  file = parsed.command;
  args = parsed.args;
  options = parsed.options;
  options = {
    maxBuffer: DEFAULT_MAX_BUFFER,
    buffer: true,
    stripFinalNewline: true,
    extendEnv: true,
    preferLocal: false,
    localDir: options.cwd || import_node_process5.default.cwd(),
    execPath: import_node_process5.default.execPath,
    encoding: "utf8",
    reject: true,
    cleanup: true,
    all: false,
    windowsHide: true,
    verbose: verboseDefault,
    ...options
  };
  options.env = getEnv(options);
  options.stdio = normalizeStdio(options);
  if (import_node_process5.default.platform === "win32" && import_node_path2.default.basename(file, ".exe") === "cmd") {
    args.unshift("/q");
  }
  return { file, args, options, parsed };
};
var handleOutput = (options, value, error) => {
  if (typeof value !== "string" && !import_node_buffer2.Buffer.isBuffer(value)) {
    return error === void 0 ? void 0 : "";
  }
  if (options.stripFinalNewline) {
    return stripFinalNewline(value);
  }
  return value;
};
function execa(file, args, options) {
  const parsed = handleArguments(file, args, options);
  const command2 = joinCommand(file, args);
  const escapedCommand = getEscapedCommand(file, args);
  logCommand(escapedCommand, parsed.options);
  validateTimeout(parsed.options);
  let spawned;
  try {
    spawned = import_node_child_process3.default.spawn(parsed.file, parsed.args, parsed.options);
  } catch (error) {
    const dummySpawned = new import_node_child_process3.default.ChildProcess();
    const errorPromise = Promise.reject(makeError({
      error,
      stdout: "",
      stderr: "",
      all: "",
      command: command2,
      escapedCommand,
      parsed,
      timedOut: false,
      isCanceled: false,
      killed: false
    }));
    mergePromise(dummySpawned, errorPromise);
    return dummySpawned;
  }
  const spawnedPromise = getSpawnedPromise(spawned);
  const timedPromise = setupTimeout(spawned, parsed.options, spawnedPromise);
  const processDone = setExitHandler(spawned, parsed.options, timedPromise);
  const context = { isCanceled: false };
  spawned.kill = spawnedKill.bind(null, spawned.kill.bind(spawned));
  spawned.cancel = spawnedCancel.bind(null, spawned, context);
  const handlePromise = async () => {
    const [{ error, exitCode, signal, timedOut }, stdoutResult, stderrResult, allResult] = await getSpawnedResult(spawned, parsed.options, processDone);
    const stdout = handleOutput(parsed.options, stdoutResult);
    const stderr = handleOutput(parsed.options, stderrResult);
    const all3 = handleOutput(parsed.options, allResult);
    if (error || exitCode !== 0 || signal !== null) {
      const returnedError = makeError({
        error,
        exitCode,
        signal,
        stdout,
        stderr,
        all: all3,
        command: command2,
        escapedCommand,
        parsed,
        timedOut,
        isCanceled: context.isCanceled || (parsed.options.signal ? parsed.options.signal.aborted : false),
        killed: spawned.killed
      });
      if (!parsed.options.reject) {
        return returnedError;
      }
      throw returnedError;
    }
    return {
      command: command2,
      escapedCommand,
      exitCode: 0,
      stdout,
      stderr,
      all: all3,
      failed: false,
      timedOut: false,
      isCanceled: false,
      killed: false
    };
  };
  const handlePromiseOnce = onetime_default(handlePromise);
  handleInput(spawned, parsed.options);
  spawned.all = makeAllStream(spawned, parsed.options);
  addPipeMethods(spawned);
  mergePromise(spawned, handlePromiseOnce);
  return spawned;
}
function execaSync(file, args, options) {
  const parsed = handleArguments(file, args, options);
  const command2 = joinCommand(file, args);
  const escapedCommand = getEscapedCommand(file, args);
  logCommand(escapedCommand, parsed.options);
  const input = handleInputSync(parsed.options);
  let result;
  try {
    result = import_node_child_process3.default.spawnSync(parsed.file, parsed.args, { ...parsed.options, input });
  } catch (error) {
    throw makeError({
      error,
      stdout: "",
      stderr: "",
      all: "",
      command: command2,
      escapedCommand,
      parsed,
      timedOut: false,
      isCanceled: false,
      killed: false
    });
  }
  const stdout = handleOutput(parsed.options, result.stdout, result.error);
  const stderr = handleOutput(parsed.options, result.stderr, result.error);
  if (result.error || result.status !== 0 || result.signal !== null) {
    const error = makeError({
      stdout,
      stderr,
      error: result.error,
      signal: result.signal,
      exitCode: result.status,
      command: command2,
      escapedCommand,
      parsed,
      timedOut: result.error && result.error.code === "ETIMEDOUT",
      isCanceled: false,
      killed: result.signal !== null
    });
    if (!parsed.options.reject) {
      return error;
    }
    throw error;
  }
  return {
    command: command2,
    escapedCommand,
    exitCode: 0,
    stdout,
    stderr,
    failed: false,
    timedOut: false,
    isCanceled: false,
    killed: false
  };
}
var normalizeScriptStdin = ({ input, inputFile, stdio }) => input === void 0 && inputFile === void 0 && stdio === void 0 ? { stdin: "inherit" } : {};
var normalizeScriptOptions = (options = {}) => ({
  preferLocal: true,
  ...normalizeScriptStdin(options),
  ...options
});
function create$(options) {
  function $5(templatesOrOptions, ...expressions) {
    if (!Array.isArray(templatesOrOptions)) {
      return create$({ ...options, ...templatesOrOptions });
    }
    const [file, ...args] = parseTemplates(templatesOrOptions, expressions);
    return execa(file, args, normalizeScriptOptions(options));
  }
  $5.sync = (templates, ...expressions) => {
    if (!Array.isArray(templates)) {
      throw new TypeError("Please use $(options).sync`command` instead of $.sync(options)`command`.");
    }
    const [file, ...args] = parseTemplates(templates, expressions);
    return execaSync(file, args, normalizeScriptOptions(options));
  };
  return $5;
}
var $3 = create$();

// node_modules/@clack/core/dist/index.mjs
var import_sisteransi = __toESM(require_src(), 1);
var import_node_process6 = require("node:process");
var f = __toESM(require("node:readline"), 1);
var import_node_readline = __toESM(require("node:readline"), 1);
var import_node_tty2 = require("node:tty");
function z3({ onlyFirst: t = false } = {}) {
  const u2 = ["[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)", "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))"].join("|");
  return new RegExp(u2, t ? void 0 : "g");
}
function $4(t) {
  if (typeof t != "string")
    throw new TypeError(`Expected a \`string\`, got \`${typeof t}\``);
  return t.replace(z3(), "");
}
var m3 = {};
var G4 = { get exports() {
  return m3;
}, set exports(t) {
  m3 = t;
} };
(function(t) {
  var u2 = {};
  t.exports = u2, u2.eastAsianWidth = function(e2) {
    var s = e2.charCodeAt(0), C4 = e2.length == 2 ? e2.charCodeAt(1) : 0, D4 = s;
    return 55296 <= s && s <= 56319 && 56320 <= C4 && C4 <= 57343 && (s &= 1023, C4 &= 1023, D4 = s << 10 | C4, D4 += 65536), D4 == 12288 || 65281 <= D4 && D4 <= 65376 || 65504 <= D4 && D4 <= 65510 ? "F" : D4 == 8361 || 65377 <= D4 && D4 <= 65470 || 65474 <= D4 && D4 <= 65479 || 65482 <= D4 && D4 <= 65487 || 65490 <= D4 && D4 <= 65495 || 65498 <= D4 && D4 <= 65500 || 65512 <= D4 && D4 <= 65518 ? "H" : 4352 <= D4 && D4 <= 4447 || 4515 <= D4 && D4 <= 4519 || 4602 <= D4 && D4 <= 4607 || 9001 <= D4 && D4 <= 9002 || 11904 <= D4 && D4 <= 11929 || 11931 <= D4 && D4 <= 12019 || 12032 <= D4 && D4 <= 12245 || 12272 <= D4 && D4 <= 12283 || 12289 <= D4 && D4 <= 12350 || 12353 <= D4 && D4 <= 12438 || 12441 <= D4 && D4 <= 12543 || 12549 <= D4 && D4 <= 12589 || 12593 <= D4 && D4 <= 12686 || 12688 <= D4 && D4 <= 12730 || 12736 <= D4 && D4 <= 12771 || 12784 <= D4 && D4 <= 12830 || 12832 <= D4 && D4 <= 12871 || 12880 <= D4 && D4 <= 13054 || 13056 <= D4 && D4 <= 19903 || 19968 <= D4 && D4 <= 42124 || 42128 <= D4 && D4 <= 42182 || 43360 <= D4 && D4 <= 43388 || 44032 <= D4 && D4 <= 55203 || 55216 <= D4 && D4 <= 55238 || 55243 <= D4 && D4 <= 55291 || 63744 <= D4 && D4 <= 64255 || 65040 <= D4 && D4 <= 65049 || 65072 <= D4 && D4 <= 65106 || 65108 <= D4 && D4 <= 65126 || 65128 <= D4 && D4 <= 65131 || 110592 <= D4 && D4 <= 110593 || 127488 <= D4 && D4 <= 127490 || 127504 <= D4 && D4 <= 127546 || 127552 <= D4 && D4 <= 127560 || 127568 <= D4 && D4 <= 127569 || 131072 <= D4 && D4 <= 194367 || 177984 <= D4 && D4 <= 196605 || 196608 <= D4 && D4 <= 262141 ? "W" : 32 <= D4 && D4 <= 126 || 162 <= D4 && D4 <= 163 || 165 <= D4 && D4 <= 166 || D4 == 172 || D4 == 175 || 10214 <= D4 && D4 <= 10221 || 10629 <= D4 && D4 <= 10630 ? "Na" : D4 == 161 || D4 == 164 || 167 <= D4 && D4 <= 168 || D4 == 170 || 173 <= D4 && D4 <= 174 || 176 <= D4 && D4 <= 180 || 182 <= D4 && D4 <= 186 || 188 <= D4 && D4 <= 191 || D4 == 198 || D4 == 208 || 215 <= D4 && D4 <= 216 || 222 <= D4 && D4 <= 225 || D4 == 230 || 232 <= D4 && D4 <= 234 || 236 <= D4 && D4 <= 237 || D4 == 240 || 242 <= D4 && D4 <= 243 || 247 <= D4 && D4 <= 250 || D4 == 252 || D4 == 254 || D4 == 257 || D4 == 273 || D4 == 275 || D4 == 283 || 294 <= D4 && D4 <= 295 || D4 == 299 || 305 <= D4 && D4 <= 307 || D4 == 312 || 319 <= D4 && D4 <= 322 || D4 == 324 || 328 <= D4 && D4 <= 331 || D4 == 333 || 338 <= D4 && D4 <= 339 || 358 <= D4 && D4 <= 359 || D4 == 363 || D4 == 462 || D4 == 464 || D4 == 466 || D4 == 468 || D4 == 470 || D4 == 472 || D4 == 474 || D4 == 476 || D4 == 593 || D4 == 609 || D4 == 708 || D4 == 711 || 713 <= D4 && D4 <= 715 || D4 == 717 || D4 == 720 || 728 <= D4 && D4 <= 731 || D4 == 733 || D4 == 735 || 768 <= D4 && D4 <= 879 || 913 <= D4 && D4 <= 929 || 931 <= D4 && D4 <= 937 || 945 <= D4 && D4 <= 961 || 963 <= D4 && D4 <= 969 || D4 == 1025 || 1040 <= D4 && D4 <= 1103 || D4 == 1105 || D4 == 8208 || 8211 <= D4 && D4 <= 8214 || 8216 <= D4 && D4 <= 8217 || 8220 <= D4 && D4 <= 8221 || 8224 <= D4 && D4 <= 8226 || 8228 <= D4 && D4 <= 8231 || D4 == 8240 || 8242 <= D4 && D4 <= 8243 || D4 == 8245 || D4 == 8251 || D4 == 8254 || D4 == 8308 || D4 == 8319 || 8321 <= D4 && D4 <= 8324 || D4 == 8364 || D4 == 8451 || D4 == 8453 || D4 == 8457 || D4 == 8467 || D4 == 8470 || 8481 <= D4 && D4 <= 8482 || D4 == 8486 || D4 == 8491 || 8531 <= D4 && D4 <= 8532 || 8539 <= D4 && D4 <= 8542 || 8544 <= D4 && D4 <= 8555 || 8560 <= D4 && D4 <= 8569 || D4 == 8585 || 8592 <= D4 && D4 <= 8601 || 8632 <= D4 && D4 <= 8633 || D4 == 8658 || D4 == 8660 || D4 == 8679 || D4 == 8704 || 8706 <= D4 && D4 <= 8707 || 8711 <= D4 && D4 <= 8712 || D4 == 8715 || D4 == 8719 || D4 == 8721 || D4 == 8725 || D4 == 8730 || 8733 <= D4 && D4 <= 8736 || D4 == 8739 || D4 == 8741 || 8743 <= D4 && D4 <= 8748 || D4 == 8750 || 8756 <= D4 && D4 <= 8759 || 8764 <= D4 && D4 <= 8765 || D4 == 8776 || D4 == 8780 || D4 == 8786 || 8800 <= D4 && D4 <= 8801 || 8804 <= D4 && D4 <= 8807 || 8810 <= D4 && D4 <= 8811 || 8814 <= D4 && D4 <= 8815 || 8834 <= D4 && D4 <= 8835 || 8838 <= D4 && D4 <= 8839 || D4 == 8853 || D4 == 8857 || D4 == 8869 || D4 == 8895 || D4 == 8978 || 9312 <= D4 && D4 <= 9449 || 9451 <= D4 && D4 <= 9547 || 9552 <= D4 && D4 <= 9587 || 9600 <= D4 && D4 <= 9615 || 9618 <= D4 && D4 <= 9621 || 9632 <= D4 && D4 <= 9633 || 9635 <= D4 && D4 <= 9641 || 9650 <= D4 && D4 <= 9651 || 9654 <= D4 && D4 <= 9655 || 9660 <= D4 && D4 <= 9661 || 9664 <= D4 && D4 <= 9665 || 9670 <= D4 && D4 <= 9672 || D4 == 9675 || 9678 <= D4 && D4 <= 9681 || 9698 <= D4 && D4 <= 9701 || D4 == 9711 || 9733 <= D4 && D4 <= 9734 || D4 == 9737 || 9742 <= D4 && D4 <= 9743 || 9748 <= D4 && D4 <= 9749 || D4 == 9756 || D4 == 9758 || D4 == 9792 || D4 == 9794 || 9824 <= D4 && D4 <= 9825 || 9827 <= D4 && D4 <= 9829 || 9831 <= D4 && D4 <= 9834 || 9836 <= D4 && D4 <= 9837 || D4 == 9839 || 9886 <= D4 && D4 <= 9887 || 9918 <= D4 && D4 <= 9919 || 9924 <= D4 && D4 <= 9933 || 9935 <= D4 && D4 <= 9953 || D4 == 9955 || 9960 <= D4 && D4 <= 9983 || D4 == 10045 || D4 == 10071 || 10102 <= D4 && D4 <= 10111 || 11093 <= D4 && D4 <= 11097 || 12872 <= D4 && D4 <= 12879 || 57344 <= D4 && D4 <= 63743 || 65024 <= D4 && D4 <= 65039 || D4 == 65533 || 127232 <= D4 && D4 <= 127242 || 127248 <= D4 && D4 <= 127277 || 127280 <= D4 && D4 <= 127337 || 127344 <= D4 && D4 <= 127386 || 917760 <= D4 && D4 <= 917999 || 983040 <= D4 && D4 <= 1048573 || 1048576 <= D4 && D4 <= 1114109 ? "A" : "N";
  }, u2.characterLength = function(e2) {
    var s = this.eastAsianWidth(e2);
    return s == "F" || s == "W" || s == "A" ? 2 : 1;
  };
  function F4(e2) {
    return e2.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]|[^\uD800-\uDFFF]/g) || [];
  }
  u2.length = function(e2) {
    for (var s = F4(e2), C4 = 0, D4 = 0; D4 < s.length; D4++)
      C4 = C4 + this.characterLength(s[D4]);
    return C4;
  }, u2.slice = function(e2, s, C4) {
    textLen = u2.length(e2), s = s || 0, C4 = C4 || 1, s < 0 && (s = textLen + s), C4 < 0 && (C4 = textLen + C4);
    for (var D4 = "", i2 = 0, o2 = F4(e2), E3 = 0; E3 < o2.length; E3++) {
      var a2 = o2[E3], n = u2.length(a2);
      if (i2 >= s - (n == 2 ? 1 : 0))
        if (i2 + n <= C4)
          D4 += a2;
        else
          break;
      i2 += n;
    }
    return D4;
  };
})(G4);
var K3 = m3;
var Y2 = function() {
  return /\uD83C\uDFF4\uDB40\uDC67\uDB40\uDC62(?:\uDB40\uDC77\uDB40\uDC6C\uDB40\uDC73|\uDB40\uDC73\uDB40\uDC63\uDB40\uDC74|\uDB40\uDC65\uDB40\uDC6E\uDB40\uDC67)\uDB40\uDC7F|(?:\uD83E\uDDD1\uD83C\uDFFF\u200D\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFF\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69]))(?:\uD83C[\uDFFB-\uDFFE])|(?:\uD83E\uDDD1\uD83C\uDFFE\u200D\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFE\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69]))(?:\uD83C[\uDFFB-\uDFFD\uDFFF])|(?:\uD83E\uDDD1\uD83C\uDFFD\u200D\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFD\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69]))(?:\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])|(?:\uD83E\uDDD1\uD83C\uDFFC\u200D\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFC\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69]))(?:\uD83C[\uDFFB\uDFFD-\uDFFF])|(?:\uD83E\uDDD1\uD83C\uDFFB\u200D\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFB\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69]))(?:\uD83C[\uDFFC-\uDFFF])|\uD83D\uDC68(?:\uD83C\uDFFB(?:\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFF])|\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFF]))|\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFC-\uDFFF])|[\u2695\u2696\u2708]\uFE0F|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD]))?|(?:\uD83C[\uDFFC-\uDFFF])\u200D\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFF])|\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFF]))|\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83D\uDC68|(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFE])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFE\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFD\uDFFF])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFC\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFD-\uDFFF])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|(?:\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])\uFE0F|\u200D(?:(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D[\uDC66\uDC67])|\uD83D[\uDC66\uDC67])|\uD83C\uDFFF|\uD83C\uDFFE|\uD83C\uDFFD|\uD83C\uDFFC)?|(?:\uD83D\uDC69(?:\uD83C\uDFFB\u200D\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69])|(?:\uD83C[\uDFFC-\uDFFF])\u200D\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69]))|\uD83E\uDDD1(?:\uD83C[\uDFFB-\uDFFF])\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1)(?:\uD83C[\uDFFB-\uDFFF])|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC69(?:\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFE\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFC\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFB\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD]))|\uD83E\uDDD1(?:\u200D(?:\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFE\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFC\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFB\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD]))|\uD83D\uDC69\u200D\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D[\uDC66\uDC67])|\uD83D\uDC69\u200D\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|(?:\uD83D\uDC41\uFE0F\u200D\uD83D\uDDE8|\uD83E\uDDD1(?:\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708]|\uD83C\uDFFB\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])|\uD83D\uDC69(?:\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708]|\uD83C\uDFFB\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])|\uD83D\uDE36\u200D\uD83C\uDF2B|\uD83C\uDFF3\uFE0F\u200D\u26A7|\uD83D\uDC3B\u200D\u2744|(?:(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC70\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD35\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD4\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])|\uD83D\uDC6F|\uD83E[\uDD3C\uDDDE\uDDDF])\u200D[\u2640\u2642]|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uFE0F|\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|\uD83C\uDFF4\u200D\u2620|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC70\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD35\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD4\uDDD6-\uDDDD])\u200D[\u2640\u2642]|[\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u2328\u23CF\u23ED-\u23EF\u23F1\u23F2\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB\u25FC\u2600-\u2604\u260E\u2611\u2618\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u2692\u2694-\u2697\u2699\u269B\u269C\u26A0\u26A7\u26B0\u26B1\u26C8\u26CF\u26D1\u26D3\u26E9\u26F0\u26F1\u26F4\u26F7\u26F8\u2702\u2708\u2709\u270F\u2712\u2714\u2716\u271D\u2721\u2733\u2734\u2744\u2747\u2763\u27A1\u2934\u2935\u2B05-\u2B07\u3030\u303D\u3297\u3299]|\uD83C[\uDD70\uDD71\uDD7E\uDD7F\uDE02\uDE37\uDF21\uDF24-\uDF2C\uDF36\uDF7D\uDF96\uDF97\uDF99-\uDF9B\uDF9E\uDF9F\uDFCD\uDFCE\uDFD4-\uDFDF\uDFF5\uDFF7]|\uD83D[\uDC3F\uDCFD\uDD49\uDD4A\uDD6F\uDD70\uDD73\uDD76-\uDD79\uDD87\uDD8A-\uDD8D\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA\uDECB\uDECD-\uDECF\uDEE0-\uDEE5\uDEE9\uDEF0\uDEF3])\uFE0F|\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08|\uD83D\uDC69\u200D\uD83D\uDC67|\uD83D\uDC69\u200D\uD83D\uDC66|\uD83D\uDE35\u200D\uD83D\uDCAB|\uD83D\uDE2E\u200D\uD83D\uDCA8|\uD83D\uDC15\u200D\uD83E\uDDBA|\uD83E\uDDD1(?:\uD83C\uDFFF|\uD83C\uDFFE|\uD83C\uDFFD|\uD83C\uDFFC|\uD83C\uDFFB)?|\uD83D\uDC69(?:\uD83C\uDFFF|\uD83C\uDFFE|\uD83C\uDFFD|\uD83C\uDFFC|\uD83C\uDFFB)?|\uD83C\uDDFD\uD83C\uDDF0|\uD83C\uDDF6\uD83C\uDDE6|\uD83C\uDDF4\uD83C\uDDF2|\uD83D\uDC08\u200D\u2B1B|\u2764\uFE0F\u200D(?:\uD83D\uDD25|\uD83E\uDE79)|\uD83D\uDC41\uFE0F|\uD83C\uDFF3\uFE0F|\uD83C\uDDFF(?:\uD83C[\uDDE6\uDDF2\uDDFC])|\uD83C\uDDFE(?:\uD83C[\uDDEA\uDDF9])|\uD83C\uDDFC(?:\uD83C[\uDDEB\uDDF8])|\uD83C\uDDFB(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDEE\uDDF3\uDDFA])|\uD83C\uDDFA(?:\uD83C[\uDDE6\uDDEC\uDDF2\uDDF3\uDDF8\uDDFE\uDDFF])|\uD83C\uDDF9(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDED\uDDEF-\uDDF4\uDDF7\uDDF9\uDDFB\uDDFC\uDDFF])|\uD83C\uDDF8(?:\uD83C[\uDDE6-\uDDEA\uDDEC-\uDDF4\uDDF7-\uDDF9\uDDFB\uDDFD-\uDDFF])|\uD83C\uDDF7(?:\uD83C[\uDDEA\uDDF4\uDDF8\uDDFA\uDDFC])|\uD83C\uDDF5(?:\uD83C[\uDDE6\uDDEA-\uDDED\uDDF0-\uDDF3\uDDF7-\uDDF9\uDDFC\uDDFE])|\uD83C\uDDF3(?:\uD83C[\uDDE6\uDDE8\uDDEA-\uDDEC\uDDEE\uDDF1\uDDF4\uDDF5\uDDF7\uDDFA\uDDFF])|\uD83C\uDDF2(?:\uD83C[\uDDE6\uDDE8-\uDDED\uDDF0-\uDDFF])|\uD83C\uDDF1(?:\uD83C[\uDDE6-\uDDE8\uDDEE\uDDF0\uDDF7-\uDDFB\uDDFE])|\uD83C\uDDF0(?:\uD83C[\uDDEA\uDDEC-\uDDEE\uDDF2\uDDF3\uDDF5\uDDF7\uDDFC\uDDFE\uDDFF])|\uD83C\uDDEF(?:\uD83C[\uDDEA\uDDF2\uDDF4\uDDF5])|\uD83C\uDDEE(?:\uD83C[\uDDE8-\uDDEA\uDDF1-\uDDF4\uDDF6-\uDDF9])|\uD83C\uDDED(?:\uD83C[\uDDF0\uDDF2\uDDF3\uDDF7\uDDF9\uDDFA])|\uD83C\uDDEC(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEE\uDDF1-\uDDF3\uDDF5-\uDDFA\uDDFC\uDDFE])|\uD83C\uDDEB(?:\uD83C[\uDDEE-\uDDF0\uDDF2\uDDF4\uDDF7])|\uD83C\uDDEA(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDED\uDDF7-\uDDFA])|\uD83C\uDDE9(?:\uD83C[\uDDEA\uDDEC\uDDEF\uDDF0\uDDF2\uDDF4\uDDFF])|\uD83C\uDDE8(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDEE\uDDF0-\uDDF5\uDDF7\uDDFA-\uDDFF])|\uD83C\uDDE7(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEF\uDDF1-\uDDF4\uDDF6-\uDDF9\uDDFB\uDDFC\uDDFE\uDDFF])|\uD83C\uDDE6(?:\uD83C[\uDDE8-\uDDEC\uDDEE\uDDF1\uDDF2\uDDF4\uDDF6-\uDDFA\uDDFC\uDDFD\uDDFF])|[#\*0-9]\uFE0F\u20E3|\u2764\uFE0F|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC70\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD35\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD4\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uFE0F|\uD83C[\uDFFB-\uDFFF])|\uD83C\uDFF4|(?:[\u270A\u270B]|\uD83C[\uDF85\uDFC2\uDFC7]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC6B-\uDC6D\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDC8F\uDC91\uDCAA\uDD7A\uDD95\uDD96\uDE4C\uDE4F\uDEC0\uDECC]|\uD83E[\uDD0C\uDD0F\uDD18-\uDD1C\uDD1E\uDD1F\uDD30-\uDD34\uDD36\uDD77\uDDB5\uDDB6\uDDBB\uDDD2\uDDD3\uDDD5])(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u261D\u270C\u270D]|\uD83D[\uDD74\uDD90])(?:\uFE0F|\uD83C[\uDFFB-\uDFFF])|[\u270A\u270B]|\uD83C[\uDF85\uDFC2\uDFC7]|\uD83D[\uDC08\uDC15\uDC3B\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC6B-\uDC6D\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDC8F\uDC91\uDCAA\uDD7A\uDD95\uDD96\uDE2E\uDE35\uDE36\uDE4C\uDE4F\uDEC0\uDECC]|\uD83E[\uDD0C\uDD0F\uDD18-\uDD1C\uDD1E\uDD1F\uDD30-\uDD34\uDD36\uDD77\uDDB5\uDDB6\uDDBB\uDDD2\uDDD3\uDDD5]|\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC70\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD35\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD4\uDDD6-\uDDDD]|\uD83D\uDC6F|\uD83E[\uDD3C\uDDDE\uDDDF]|[\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55]|\uD83C[\uDC04\uDCCF\uDD8E\uDD91-\uDD9A\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF7C\uDF7E-\uDF84\uDF86-\uDF93\uDFA0-\uDFC1\uDFC5\uDFC6\uDFC8\uDFC9\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF8-\uDFFF]|\uD83D[\uDC00-\uDC07\uDC09-\uDC14\uDC16-\uDC3A\uDC3C-\uDC3E\uDC40\uDC44\uDC45\uDC51-\uDC65\uDC6A\uDC79-\uDC7B\uDC7D-\uDC80\uDC84\uDC88-\uDC8E\uDC90\uDC92-\uDCA9\uDCAB-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDDA4\uDDFB-\uDE2D\uDE2F-\uDE34\uDE37-\uDE44\uDE48-\uDE4A\uDE80-\uDEA2\uDEA4-\uDEB3\uDEB7-\uDEBF\uDEC1-\uDEC5\uDED0-\uDED2\uDED5-\uDED7\uDEEB\uDEEC\uDEF4-\uDEFC\uDFE0-\uDFEB]|\uD83E[\uDD0D\uDD0E\uDD10-\uDD17\uDD1D\uDD20-\uDD25\uDD27-\uDD2F\uDD3A\uDD3F-\uDD45\uDD47-\uDD76\uDD78\uDD7A-\uDDB4\uDDB7\uDDBA\uDDBC-\uDDCB\uDDD0\uDDE0-\uDDFF\uDE70-\uDE74\uDE78-\uDE7A\uDE80-\uDE86\uDE90-\uDEA8\uDEB0-\uDEB6\uDEC0-\uDEC2\uDED0-\uDED6]|(?:[\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u270A\u270B\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55]|\uD83C[\uDC04\uDCCF\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF7C\uDF7E-\uDF93\uDFA0-\uDFCA\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF4\uDFF8-\uDFFF]|\uD83D[\uDC00-\uDC3E\uDC40\uDC42-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDD7A\uDD95\uDD96\uDDA4\uDDFB-\uDE4F\uDE80-\uDEC5\uDECC\uDED0-\uDED2\uDED5-\uDED7\uDEEB\uDEEC\uDEF4-\uDEFC\uDFE0-\uDFEB]|\uD83E[\uDD0C-\uDD3A\uDD3C-\uDD45\uDD47-\uDD78\uDD7A-\uDDCB\uDDCD-\uDDFF\uDE70-\uDE74\uDE78-\uDE7A\uDE80-\uDE86\uDE90-\uDEA8\uDEB0-\uDEB6\uDEC0-\uDEC2\uDED0-\uDED6])|(?:[#\*0-9\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u261D\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u267F\u2692-\u2697\u2699\u269B\u269C\u26A0\u26A1\u26A7\u26AA\u26AB\u26B0\u26B1\u26BD\u26BE\u26C4\u26C5\u26C8\u26CE\u26CF\u26D1\u26D3\u26D4\u26E9\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70\uDD71\uDD7E\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF]|\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95\uDD96\uDDA4\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDED5-\uDED7\uDEE0-\uDEE5\uDEE9\uDEEB\uDEEC\uDEF0\uDEF3-\uDEFC\uDFE0-\uDFEB]|\uD83E[\uDD0C-\uDD3A\uDD3C-\uDD45\uDD47-\uDD78\uDD7A-\uDDCB\uDDCD-\uDDFF\uDE70-\uDE74\uDE78-\uDE7A\uDE80-\uDE86\uDE90-\uDEA8\uDEB0-\uDEB6\uDEC0-\uDEC2\uDED0-\uDED6])\uFE0F|(?:[\u261D\u26F9\u270A-\u270D]|\uD83C[\uDF85\uDFC2-\uDFC4\uDFC7\uDFCA-\uDFCC]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66-\uDC78\uDC7C\uDC81-\uDC83\uDC85-\uDC87\uDC8F\uDC91\uDCAA\uDD74\uDD75\uDD7A\uDD90\uDD95\uDD96\uDE45-\uDE47\uDE4B-\uDE4F\uDEA3\uDEB4-\uDEB6\uDEC0\uDECC]|\uD83E[\uDD0C\uDD0F\uDD18-\uDD1F\uDD26\uDD30-\uDD39\uDD3C-\uDD3E\uDD77\uDDB5\uDDB6\uDDB8\uDDB9\uDDBB\uDDCD-\uDDCF\uDDD1-\uDDDD])/g;
};
function c2(t, u2 = {}) {
  if (typeof t != "string" || t.length === 0 || (u2 = { ambiguousIsNarrow: true, ...u2 }, t = $4(t), t.length === 0))
    return 0;
  t = t.replace(Y2(), "  ");
  const F4 = u2.ambiguousIsNarrow ? 1 : 2;
  let e2 = 0;
  for (const s of t) {
    const C4 = s.codePointAt(0);
    if (C4 <= 31 || C4 >= 127 && C4 <= 159 || C4 >= 768 && C4 <= 879)
      continue;
    switch (K3.eastAsianWidth(s)) {
      case "F":
      case "W":
        e2 += 2;
        break;
      case "A":
        e2 += F4;
        break;
      default:
        e2 += 1;
    }
  }
  return e2;
}
var v3 = 10;
var M3 = (t = 0) => (u2) => `\x1B[${u2 + t}m`;
var L4 = (t = 0) => (u2) => `\x1B[${38 + t};5;${u2}m`;
var T4 = (t = 0) => (u2, F4, e2) => `\x1B[${38 + t};2;${u2};${F4};${e2}m`;
var r = { modifier: { reset: [0, 0], bold: [1, 22], dim: [2, 22], italic: [3, 23], underline: [4, 24], overline: [53, 55], inverse: [7, 27], hidden: [8, 28], strikethrough: [9, 29] }, color: { black: [30, 39], red: [31, 39], green: [32, 39], yellow: [33, 39], blue: [34, 39], magenta: [35, 39], cyan: [36, 39], white: [37, 39], blackBright: [90, 39], gray: [90, 39], grey: [90, 39], redBright: [91, 39], greenBright: [92, 39], yellowBright: [93, 39], blueBright: [94, 39], magentaBright: [95, 39], cyanBright: [96, 39], whiteBright: [97, 39] }, bgColor: { bgBlack: [40, 49], bgRed: [41, 49], bgGreen: [42, 49], bgYellow: [43, 49], bgBlue: [44, 49], bgMagenta: [45, 49], bgCyan: [46, 49], bgWhite: [47, 49], bgBlackBright: [100, 49], bgGray: [100, 49], bgGrey: [100, 49], bgRedBright: [101, 49], bgGreenBright: [102, 49], bgYellowBright: [103, 49], bgBlueBright: [104, 49], bgMagentaBright: [105, 49], bgCyanBright: [106, 49], bgWhiteBright: [107, 49] } };
Object.keys(r.modifier);
var Z3 = Object.keys(r.color);
var H3 = Object.keys(r.bgColor);
[...Z3, ...H3];
function U4() {
  const t = /* @__PURE__ */ new Map();
  for (const [u2, F4] of Object.entries(r)) {
    for (const [e2, s] of Object.entries(F4))
      r[e2] = { open: `\x1B[${s[0]}m`, close: `\x1B[${s[1]}m` }, F4[e2] = r[e2], t.set(s[0], s[1]);
    Object.defineProperty(r, u2, { value: F4, enumerable: false });
  }
  return Object.defineProperty(r, "codes", { value: t, enumerable: false }), r.color.close = "\x1B[39m", r.bgColor.close = "\x1B[49m", r.color.ansi = M3(), r.color.ansi256 = L4(), r.color.ansi16m = T4(), r.bgColor.ansi = M3(v3), r.bgColor.ansi256 = L4(v3), r.bgColor.ansi16m = T4(v3), Object.defineProperties(r, { rgbToAnsi256: { value: (u2, F4, e2) => u2 === F4 && F4 === e2 ? u2 < 8 ? 16 : u2 > 248 ? 231 : Math.round((u2 - 8) / 247 * 24) + 232 : 16 + 36 * Math.round(u2 / 255 * 5) + 6 * Math.round(F4 / 255 * 5) + Math.round(e2 / 255 * 5), enumerable: false }, hexToRgb: { value: (u2) => {
    const F4 = /[a-f\d]{6}|[a-f\d]{3}/i.exec(u2.toString(16));
    if (!F4)
      return [0, 0, 0];
    let [e2] = F4;
    e2.length === 3 && (e2 = [...e2].map((C4) => C4 + C4).join(""));
    const s = Number.parseInt(e2, 16);
    return [s >> 16 & 255, s >> 8 & 255, s & 255];
  }, enumerable: false }, hexToAnsi256: { value: (u2) => r.rgbToAnsi256(...r.hexToRgb(u2)), enumerable: false }, ansi256ToAnsi: { value: (u2) => {
    if (u2 < 8)
      return 30 + u2;
    if (u2 < 16)
      return 90 + (u2 - 8);
    let F4, e2, s;
    if (u2 >= 232)
      F4 = ((u2 - 232) * 10 + 8) / 255, e2 = F4, s = F4;
    else {
      u2 -= 16;
      const i2 = u2 % 36;
      F4 = Math.floor(u2 / 36) / 5, e2 = Math.floor(i2 / 6) / 5, s = i2 % 6 / 5;
    }
    const C4 = Math.max(F4, e2, s) * 2;
    if (C4 === 0)
      return 30;
    let D4 = 30 + (Math.round(s) << 2 | Math.round(e2) << 1 | Math.round(F4));
    return C4 === 2 && (D4 += 60), D4;
  }, enumerable: false }, rgbToAnsi: { value: (u2, F4, e2) => r.ansi256ToAnsi(r.rgbToAnsi256(u2, F4, e2)), enumerable: false }, hexToAnsi: { value: (u2) => r.ansi256ToAnsi(r.hexToAnsi256(u2)), enumerable: false } }), r;
}
var q3 = U4();
var p2 = /* @__PURE__ */ new Set(["\x1B", "\x9B"]);
var J3 = 39;
var b4 = "\x07";
var W3 = "[";
var Q2 = "]";
var I3 = "m";
var w4 = `${Q2}8;;`;
var N3 = (t) => `${p2.values().next().value}${W3}${t}${I3}`;
var j2 = (t) => `${p2.values().next().value}${w4}${t}${b4}`;
var X2 = (t) => t.split(" ").map((u2) => c2(u2));
var _4 = (t, u2, F4) => {
  const e2 = [...u2];
  let s = false, C4 = false, D4 = c2($4(t[t.length - 1]));
  for (const [i2, o2] of e2.entries()) {
    const E3 = c2(o2);
    if (D4 + E3 <= F4 ? t[t.length - 1] += o2 : (t.push(o2), D4 = 0), p2.has(o2) && (s = true, C4 = e2.slice(i2 + 1).join("").startsWith(w4)), s) {
      C4 ? o2 === b4 && (s = false, C4 = false) : o2 === I3 && (s = false);
      continue;
    }
    D4 += E3, D4 === F4 && i2 < e2.length - 1 && (t.push(""), D4 = 0);
  }
  !D4 && t[t.length - 1].length > 0 && t.length > 1 && (t[t.length - 2] += t.pop());
};
var DD2 = (t) => {
  const u2 = t.split(" ");
  let F4 = u2.length;
  for (; F4 > 0 && !(c2(u2[F4 - 1]) > 0); )
    F4--;
  return F4 === u2.length ? t : u2.slice(0, F4).join(" ") + u2.slice(F4).join("");
};
var uD2 = (t, u2, F4 = {}) => {
  if (F4.trim !== false && t.trim() === "")
    return "";
  let e2 = "", s, C4;
  const D4 = X2(t);
  let i2 = [""];
  for (const [E3, a2] of t.split(" ").entries()) {
    F4.trim !== false && (i2[i2.length - 1] = i2[i2.length - 1].trimStart());
    let n = c2(i2[i2.length - 1]);
    if (E3 !== 0 && (n >= u2 && (F4.wordWrap === false || F4.trim === false) && (i2.push(""), n = 0), (n > 0 || F4.trim === false) && (i2[i2.length - 1] += " ", n++)), F4.hard && D4[E3] > u2) {
      const B2 = u2 - n, A3 = 1 + Math.floor((D4[E3] - B2 - 1) / u2);
      Math.floor((D4[E3] - 1) / u2) < A3 && i2.push(""), _4(i2, a2, u2);
      continue;
    }
    if (n + D4[E3] > u2 && n > 0 && D4[E3] > 0) {
      if (F4.wordWrap === false && n < u2) {
        _4(i2, a2, u2);
        continue;
      }
      i2.push("");
    }
    if (n + D4[E3] > u2 && F4.wordWrap === false) {
      _4(i2, a2, u2);
      continue;
    }
    i2[i2.length - 1] += a2;
  }
  F4.trim !== false && (i2 = i2.map((E3) => DD2(E3)));
  const o2 = [...i2.join(`
`)];
  for (const [E3, a2] of o2.entries()) {
    if (e2 += a2, p2.has(a2)) {
      const { groups: B2 } = new RegExp(`(?:\\${W3}(?<code>\\d+)m|\\${w4}(?<uri>.*)${b4})`).exec(o2.slice(E3).join("")) || { groups: {} };
      if (B2.code !== void 0) {
        const A3 = Number.parseFloat(B2.code);
        s = A3 === J3 ? void 0 : A3;
      } else
        B2.uri !== void 0 && (C4 = B2.uri.length === 0 ? void 0 : B2.uri);
    }
    const n = q3.codes.get(Number(s));
    o2[E3 + 1] === `
` ? (C4 && (e2 += j2("")), s && n && (e2 += N3(n))) : a2 === `
` && (s && n && (e2 += N3(s)), C4 && (e2 += j2(C4)));
  }
  return e2;
};
function P2(t, u2, F4) {
  return String(t).normalize().replace(/\r\n/g, `
`).split(`
`).map((e2) => uD2(e2, u2, F4)).join(`
`);
}
function FD2(t, u2) {
  if (t === u2)
    return;
  const F4 = t.split(`
`), e2 = u2.split(`
`), s = [];
  for (let C4 = 0; C4 < Math.max(F4.length, e2.length); C4++)
    F4[C4] !== e2[C4] && s.push(C4);
  return s;
}
var R4 = Symbol("clack:cancel");
function eD2(t) {
  return t === R4;
}
function g2(t, u2) {
  t.isTTY && t.setRawMode(u2);
}
var V4 = /* @__PURE__ */ new Map([["k", "up"], ["j", "down"], ["h", "left"], ["l", "right"]]);
var tD2 = /* @__PURE__ */ new Set(["up", "down", "left", "right", "space", "enter"]);
var h2 = class {
  constructor({ render: u2, input: F4 = import_node_process6.stdin, output: e2 = import_node_process6.stdout, ...s }, C4 = true) {
    this._track = false, this._cursor = 0, this.state = "initial", this.error = "", this.subscribers = /* @__PURE__ */ new Map(), this._prevFrame = "", this.opts = s, this.onKeypress = this.onKeypress.bind(this), this.close = this.close.bind(this), this.render = this.render.bind(this), this._render = u2.bind(this), this._track = C4, this.input = F4, this.output = e2;
  }
  prompt() {
    const u2 = new import_node_tty2.WriteStream(0);
    return u2._write = (F4, e2, s) => {
      this._track && (this.value = this.rl.line.replace(/\t/g, ""), this._cursor = this.rl.cursor, this.emit("value", this.value)), s();
    }, this.input.pipe(u2), this.rl = import_node_readline.default.createInterface({ input: this.input, output: u2, tabSize: 2, prompt: "", escapeCodeTimeout: 50 }), import_node_readline.default.emitKeypressEvents(this.input, this.rl), this.rl.prompt(), this.opts.initialValue !== void 0 && this._track && this.rl.write(this.opts.initialValue), this.input.on("keypress", this.onKeypress), g2(this.input, true), this.output.on("resize", this.render), this.render(), new Promise((F4, e2) => {
      this.once("submit", () => {
        this.output.write(import_sisteransi.cursor.show), this.output.off("resize", this.render), g2(this.input, false), F4(this.value);
      }), this.once("cancel", () => {
        this.output.write(import_sisteransi.cursor.show), this.output.off("resize", this.render), g2(this.input, false), F4(R4);
      });
    });
  }
  on(u2, F4) {
    const e2 = this.subscribers.get(u2) ?? [];
    e2.push({ cb: F4 }), this.subscribers.set(u2, e2);
  }
  once(u2, F4) {
    const e2 = this.subscribers.get(u2) ?? [];
    e2.push({ cb: F4, once: true }), this.subscribers.set(u2, e2);
  }
  emit(u2, ...F4) {
    const e2 = this.subscribers.get(u2) ?? [], s = [];
    for (const C4 of e2)
      C4.cb(...F4), C4.once && s.push(() => e2.splice(e2.indexOf(C4), 1));
    for (const C4 of s)
      C4();
  }
  unsubscribe() {
    this.subscribers.clear();
  }
  onKeypress(u2, F4) {
    if (this.state === "error" && (this.state = "active"), F4?.name && !this._track && V4.has(F4.name) && this.emit("cursor", V4.get(F4.name)), F4?.name && tD2.has(F4.name) && this.emit("cursor", F4.name), u2 && (u2.toLowerCase() === "y" || u2.toLowerCase() === "n") && this.emit("confirm", u2.toLowerCase() === "y"), u2 && this.emit("key", u2.toLowerCase()), F4?.name === "return") {
      if (this.opts.validate) {
        const e2 = this.opts.validate(this.value);
        e2 && (this.error = e2, this.state = "error", this.rl.write(this.value));
      }
      this.state !== "error" && (this.state = "submit");
    }
    u2 === "" && (this.state = "cancel"), (this.state === "submit" || this.state === "cancel") && this.emit("finalize"), this.render(), (this.state === "submit" || this.state === "cancel") && this.close();
  }
  close() {
    this.input.unpipe(), this.input.removeListener("keypress", this.onKeypress), this.output.write(`
`), g2(this.input, false), this.rl.close(), this.emit(`${this.state}`, this.value), this.unsubscribe();
  }
  restoreCursor() {
    const u2 = P2(this._prevFrame, process.stdout.columns, { hard: true }).split(`
`).length - 1;
    this.output.write(import_sisteransi.cursor.move(-999, u2 * -1));
  }
  render() {
    const u2 = P2(this._render(this) ?? "", process.stdout.columns, { hard: true });
    if (u2 !== this._prevFrame) {
      if (this.state === "initial")
        this.output.write(import_sisteransi.cursor.hide);
      else {
        const F4 = FD2(this._prevFrame, u2);
        if (this.restoreCursor(), F4 && F4?.length === 1) {
          const e2 = F4[0];
          this.output.write(import_sisteransi.cursor.move(0, e2)), this.output.write(import_sisteransi.erase.lines(1));
          const s = u2.split(`
`);
          this.output.write(s[e2]), this._prevFrame = u2, this.output.write(import_sisteransi.cursor.move(0, s.length - e2 - 1));
          return;
        } else if (F4 && F4?.length > 1) {
          const e2 = F4[0];
          this.output.write(import_sisteransi.cursor.move(0, e2)), this.output.write(import_sisteransi.erase.down());
          const C4 = u2.split(`
`).slice(e2);
          this.output.write(C4.join(`
`)), this._prevFrame = u2;
          return;
        }
        this.output.write(import_sisteransi.erase.down());
      }
      this.output.write(u2), this.state === "initial" && (this.state = "active"), this._prevFrame = u2;
    }
  }
};
var sD2 = class extends h2 {
  get cursor() {
    return this.value ? 0 : 1;
  }
  get _value() {
    return this.cursor === 0;
  }
  constructor(u2) {
    super(u2, false), this.value = !!u2.initialValue, this.on("value", () => {
      this.value = this._value;
    }), this.on("confirm", (F4) => {
      this.output.write(import_sisteransi.cursor.move(0, -1)), this.value = F4, this.state = "submit", this.close();
    }), this.on("cursor", () => {
      this.value = !this.value;
    });
  }
};
var iD2 = class extends h2 {
  constructor(u2) {
    super(u2, false), this.cursor = 0, this.options = u2.options, this.value = [...u2.initialValues ?? []], this.cursor = Math.max(this.options.findIndex(({ value: F4 }) => F4 === u2.cursorAt), 0), this.on("key", (F4) => {
      F4 === "a" && this.toggleAll();
    }), this.on("cursor", (F4) => {
      switch (F4) {
        case "left":
        case "up":
          this.cursor = this.cursor === 0 ? this.options.length - 1 : this.cursor - 1;
          break;
        case "down":
        case "right":
          this.cursor = this.cursor === this.options.length - 1 ? 0 : this.cursor + 1;
          break;
        case "space":
          this.toggleValue();
          break;
      }
    });
  }
  get _value() {
    return this.options[this.cursor].value;
  }
  toggleAll() {
    const u2 = this.value.length === this.options.length;
    this.value = u2 ? [] : this.options.map((F4) => F4.value);
  }
  toggleValue() {
    const u2 = this.value.includes(this._value);
    this.value = u2 ? this.value.filter((F4) => F4 !== this._value) : [...this.value, this._value];
  }
};
var ED2 = class extends h2 {
  constructor(u2) {
    super(u2, false), this.cursor = 0, this.options = u2.options, this.cursor = this.options.findIndex(({ value: F4 }) => F4 === u2.initialValue), this.cursor === -1 && (this.cursor = 0), this.changeValue(), this.on("cursor", (F4) => {
      switch (F4) {
        case "left":
        case "up":
          this.cursor = this.cursor === 0 ? this.options.length - 1 : this.cursor - 1;
          break;
        case "down":
        case "right":
          this.cursor = this.cursor === this.options.length - 1 ? 0 : this.cursor + 1;
          break;
      }
      this.changeValue();
    });
  }
  get _value() {
    return this.options[this.cursor];
  }
  changeValue() {
    this.value = this._value.value;
  }
};
function aD2({ input: t = import_node_process6.stdin, output: u2 = import_node_process6.stdout, overwrite: F4 = true, hideCursor: e2 = true } = {}) {
  const s = f.createInterface({ input: t, output: u2, prompt: "", tabSize: 1 });
  f.emitKeypressEvents(t, s), t.isTTY && t.setRawMode(true);
  const C4 = (D4, { name: i2 }) => {
    if (String(D4) === "" && process.exit(0), !F4)
      return;
    let E3 = i2 === "return" ? 0 : -1, a2 = i2 === "return" ? -1 : 0;
    f.moveCursor(u2, E3, a2, () => {
      f.clearLine(u2, 1, () => {
        t.once("keypress", C4);
      });
    });
  };
  return e2 && process.stdout.write(import_sisteransi.cursor.hide), t.once("keypress", C4), () => {
    t.off("keypress", C4), e2 && process.stdout.write(import_sisteransi.cursor.show), t.isTTY && t.setRawMode(false), s.terminal = false, s.close();
  };
}

// node_modules/@clack/prompts/dist/index.mjs
var import_node_process7 = __toESM(require("node:process"), 1);
var import_picocolors = __toESM(require_picocolors(), 1);
var import_sisteransi2 = __toESM(require_src(), 1);
function N4() {
  return import_node_process7.default.platform !== "win32" ? import_node_process7.default.env.TERM !== "linux" : Boolean(import_node_process7.default.env.CI) || Boolean(import_node_process7.default.env.WT_SESSION) || Boolean(import_node_process7.default.env.TERMINUS_SUBLIME) || import_node_process7.default.env.ConEmuTask === "{cmd::Cmder}" || import_node_process7.default.env.TERM_PROGRAM === "Terminus-Sublime" || import_node_process7.default.env.TERM_PROGRAM === "vscode" || import_node_process7.default.env.TERM === "xterm-256color" || import_node_process7.default.env.TERM === "alacritty" || import_node_process7.default.env.TERMINAL_EMULATOR === "JetBrains-JediTerm";
}
var p3 = N4();
var u = (r2, n) => p3 ? r2 : n;
var W4 = u("\u25C6", "*");
var D3 = u("\u25A0", "x");
var F3 = u("\u25B2", "x");
var f2 = u("\u25C7", "o");
var L5 = u("\u250C", "T");
var a = u("\u2502", "|");
var o = u("\u2514", "\u2014");
var w5 = u("\u25CF", ">");
var S4 = u("\u25CB", " ");
var _5 = u("\u25FB", "[\u2022]");
var y4 = u("\u25FC", "[+]");
var A2 = u("\u25FB", "[ ]");
var q4 = u("\u25AA", "\u2022");
var R5 = u("\u2500", "-");
var G5 = u("\u256E", "+");
var H4 = u("\u251C", "+");
var K4 = u("\u256F", "+");
var U5 = u("\u25CF", "\u2022");
var Z4 = u("\u25C6", "*");
var z4 = u("\u25B2", "!");
var X3 = u("\u25A0", "x");
var h3 = (r2) => {
  switch (r2) {
    case "initial":
    case "active":
      return import_picocolors.default.cyan(W4);
    case "cancel":
      return import_picocolors.default.red(D3);
    case "error":
      return import_picocolors.default.yellow(F3);
    case "submit":
      return import_picocolors.default.green(f2);
  }
};
var Q3 = (r2) => {
  const n = r2.active ?? "Yes", s = r2.inactive ?? "No";
  return new sD2({ active: n, inactive: s, initialValue: r2.initialValue ?? true, render() {
    const t = `${import_picocolors.default.gray(a)}
${h3(this.state)}  ${r2.message}
`, i2 = this.value ? n : s;
    switch (this.state) {
      case "submit":
        return `${t}${import_picocolors.default.gray(a)}  ${import_picocolors.default.dim(i2)}`;
      case "cancel":
        return `${t}${import_picocolors.default.gray(a)}  ${import_picocolors.default.strikethrough(import_picocolors.default.dim(i2))}
${import_picocolors.default.gray(a)}`;
      default:
        return `${t}${import_picocolors.default.cyan(a)}  ${this.value ? `${import_picocolors.default.green(w5)} ${n}` : `${import_picocolors.default.dim(S4)} ${import_picocolors.default.dim(n)}`} ${import_picocolors.default.dim("/")} ${this.value ? `${import_picocolors.default.dim(S4)} ${import_picocolors.default.dim(s)}` : `${import_picocolors.default.green(w5)} ${s}`}
${import_picocolors.default.cyan(o)}
`;
    }
  } }).prompt();
};
var ee = (r2) => {
  const n = (s, t) => {
    const i2 = s.label ?? String(s.value);
    return t === "active" ? `${import_picocolors.default.green(w5)} ${i2} ${s.hint ? import_picocolors.default.dim(`(${s.hint})`) : ""}` : t === "selected" ? `${import_picocolors.default.dim(i2)}` : t === "cancelled" ? `${import_picocolors.default.strikethrough(import_picocolors.default.dim(i2))}` : `${import_picocolors.default.dim(S4)} ${import_picocolors.default.dim(i2)}`;
  };
  return new ED2({ options: r2.options, initialValue: r2.initialValue, render() {
    const s = `${import_picocolors.default.gray(a)}
${h3(this.state)}  ${r2.message}
`;
    switch (this.state) {
      case "submit":
        return `${s}${import_picocolors.default.gray(a)}  ${n(this.options[this.cursor], "selected")}`;
      case "cancel":
        return `${s}${import_picocolors.default.gray(a)}  ${n(this.options[this.cursor], "cancelled")}
${import_picocolors.default.gray(a)}`;
      default:
        return `${s}${import_picocolors.default.cyan(a)}  ${this.options.map((t, i2) => n(t, i2 === this.cursor ? "active" : "inactive")).join(`
${import_picocolors.default.cyan(a)}  `)}
${import_picocolors.default.cyan(o)}
`;
    }
  } }).prompt();
};
var re = (r2) => {
  const n = (s, t) => {
    const i2 = s.label ?? String(s.value);
    return t === "active" ? `${import_picocolors.default.cyan(_5)} ${i2} ${s.hint ? import_picocolors.default.dim(`(${s.hint})`) : ""}` : t === "selected" ? `${import_picocolors.default.green(y4)} ${import_picocolors.default.dim(i2)}` : t === "cancelled" ? `${import_picocolors.default.strikethrough(import_picocolors.default.dim(i2))}` : t === "active-selected" ? `${import_picocolors.default.green(y4)} ${i2} ${s.hint ? import_picocolors.default.dim(`(${s.hint})`) : ""}` : t === "submitted" ? `${import_picocolors.default.dim(i2)}` : `${import_picocolors.default.dim(A2)} ${import_picocolors.default.dim(i2)}`;
  };
  return new iD2({ options: r2.options, initialValues: r2.initialValues, required: r2.required ?? true, cursorAt: r2.cursorAt, validate(s) {
    if (this.required && s.length === 0)
      return `Please select at least one option.
${import_picocolors.default.reset(import_picocolors.default.dim(`Press ${import_picocolors.default.gray(import_picocolors.default.bgWhite(import_picocolors.default.inverse(" space ")))} to select, ${import_picocolors.default.gray(import_picocolors.default.bgWhite(import_picocolors.default.inverse(" enter ")))} to submit`))}`;
  }, render() {
    let s = `${import_picocolors.default.gray(a)}
${h3(this.state)}  ${r2.message}
`;
    switch (this.state) {
      case "submit":
        return `${s}${import_picocolors.default.gray(a)}  ${this.options.filter(({ value: t }) => this.value.includes(t)).map((t) => n(t, "submitted")).join(import_picocolors.default.dim(", ")) || import_picocolors.default.dim("none")}`;
      case "cancel": {
        const t = this.options.filter(({ value: i2 }) => this.value.includes(i2)).map((i2) => n(i2, "cancelled")).join(import_picocolors.default.dim(", "));
        return `${s}${import_picocolors.default.gray(a)}  ${t.trim() ? `${t}
${import_picocolors.default.gray(a)}` : ""}`;
      }
      case "error": {
        const t = this.error.split(`
`).map((i2, c3) => c3 === 0 ? `${import_picocolors.default.yellow(o)}  ${import_picocolors.default.yellow(i2)}` : `   ${i2}`).join(`
`);
        return s + import_picocolors.default.yellow(a) + "  " + this.options.map((i2, c3) => {
          const l = this.value.includes(i2.value), $5 = c3 === this.cursor;
          return $5 && l ? n(i2, "active-selected") : l ? n(i2, "selected") : n(i2, $5 ? "active" : "inactive");
        }).join(`
${import_picocolors.default.yellow(a)}  `) + `
` + t + `
`;
      }
      default:
        return `${s}${import_picocolors.default.cyan(a)}  ${this.options.map((t, i2) => {
          const c3 = this.value.includes(t.value), l = i2 === this.cursor;
          return l && c3 ? n(t, "active-selected") : c3 ? n(t, "selected") : n(t, l ? "active" : "inactive");
        }).join(`
${import_picocolors.default.cyan(a)}  `)}
${import_picocolors.default.cyan(o)}
`;
    }
  } }).prompt();
};
var b5 = (r2) => r2.replace(ue(), "");
var ie = (r2 = "", n = "") => {
  const s = `
${r2}
`.split(`
`), t = Math.max(s.reduce((c3, l) => (l = b5(l), l.length > c3 ? l.length : c3), 0), b5(n).length) + 2, i2 = s.map((c3) => `${import_picocolors.default.gray(a)}  ${import_picocolors.default.dim(c3)}${" ".repeat(t - b5(c3).length)}${import_picocolors.default.gray(a)}`).join(`
`);
  process.stdout.write(`${import_picocolors.default.gray(a)}
${import_picocolors.default.green(f2)}  ${import_picocolors.default.reset(n)} ${import_picocolors.default.gray(R5.repeat(Math.max(t - n.length - 1, 1)) + G5)}
${i2}
${import_picocolors.default.gray(H4 + R5.repeat(t + 2) + K4)}
`);
};
var ae = (r2 = "") => {
  process.stdout.write(`${import_picocolors.default.gray(L5)}  ${r2}
`);
};
var ce = (r2 = "") => {
  process.stdout.write(`${import_picocolors.default.gray(a)}
${import_picocolors.default.gray(o)}  ${r2}

`);
};
var C3 = p3 ? ["\u25D2", "\u25D0", "\u25D3", "\u25D1"] : ["\u2022", "o", "O", "0"];
var le = () => {
  let r2, n;
  const s = p3 ? 80 : 120;
  return { start(t = "") {
    t = t.replace(/\.?\.?\.$/, ""), r2 = aD2(), process.stdout.write(`${import_picocolors.default.gray(a)}
${import_picocolors.default.magenta("\u25CB")}  ${t}
`);
    let i2 = 0, c3 = 0;
    n = setInterval(() => {
      let l = C3[i2];
      process.stdout.write(import_sisteransi2.cursor.move(-999, -1)), process.stdout.write(`${import_picocolors.default.magenta(l)}  ${t}${Math.floor(c3) >= 1 ? ".".repeat(Math.floor(c3)).slice(0, 3) : ""}   
`), i2 = i2 === C3.length - 1 ? 0 : i2 + 1, c3 = c3 === C3.length ? 0 : c3 + 0.125;
    }, s);
  }, stop(t = "") {
    process.stdout.write(import_sisteransi2.cursor.move(-999, -2)), process.stdout.write(import_sisteransi2.erase.down(2)), clearInterval(n), process.stdout.write(`${import_picocolors.default.gray(a)}
${import_picocolors.default.green(f2)}  ${t}
`), r2();
  } };
};
function ue() {
  const r2 = ["[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)", "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]))"].join("|");
  return new RegExp(r2, "g");
}

// src/generateCommitMessageFromGitDiff.ts
var import_openai4 = __toESM(require_dist(), 1);

// node_modules/axios/lib/helpers/bind.js
function bind(fn, thisArg) {
  return function wrap() {
    return fn.apply(thisArg, arguments);
  };
}

// node_modules/axios/lib/utils.js
var { toString } = Object.prototype;
var { getPrototypeOf } = Object;
var kindOf = ((cache) => (thing) => {
  const str = toString.call(thing);
  return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
})(/* @__PURE__ */ Object.create(null));
var kindOfTest = (type) => {
  type = type.toLowerCase();
  return (thing) => kindOf(thing) === type;
};
var typeOfTest = (type) => (thing) => typeof thing === type;
var { isArray } = Array;
var isUndefined = typeOfTest("undefined");
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor) && isFunction(val.constructor.isBuffer) && val.constructor.isBuffer(val);
}
var isArrayBuffer = kindOfTest("ArrayBuffer");
function isArrayBufferView(val) {
  let result;
  if (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView) {
    result = ArrayBuffer.isView(val);
  } else {
    result = val && val.buffer && isArrayBuffer(val.buffer);
  }
  return result;
}
var isString = typeOfTest("string");
var isFunction = typeOfTest("function");
var isNumber = typeOfTest("number");
var isObject = (thing) => thing !== null && typeof thing === "object";
var isBoolean = (thing) => thing === true || thing === false;
var isPlainObject = (val) => {
  if (kindOf(val) !== "object") {
    return false;
  }
  const prototype3 = getPrototypeOf(val);
  return (prototype3 === null || prototype3 === Object.prototype || Object.getPrototypeOf(prototype3) === null) && !(Symbol.toStringTag in val) && !(Symbol.iterator in val);
};
var isDate = kindOfTest("Date");
var isFile = kindOfTest("File");
var isBlob = kindOfTest("Blob");
var isFileList = kindOfTest("FileList");
var isStream2 = (val) => isObject(val) && isFunction(val.pipe);
var isFormData = (thing) => {
  let kind;
  return thing && (typeof FormData === "function" && thing instanceof FormData || isFunction(thing.append) && ((kind = kindOf(thing)) === "formdata" || kind === "object" && isFunction(thing.toString) && thing.toString() === "[object FormData]"));
};
var isURLSearchParams = kindOfTest("URLSearchParams");
var trim = (str) => str.trim ? str.trim() : str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
function forEach(obj, fn, { allOwnKeys = false } = {}) {
  if (obj === null || typeof obj === "undefined") {
    return;
  }
  let i2;
  let l;
  if (typeof obj !== "object") {
    obj = [obj];
  }
  if (isArray(obj)) {
    for (i2 = 0, l = obj.length; i2 < l; i2++) {
      fn.call(null, obj[i2], i2, obj);
    }
  } else {
    const keys = allOwnKeys ? Object.getOwnPropertyNames(obj) : Object.keys(obj);
    const len = keys.length;
    let key;
    for (i2 = 0; i2 < len; i2++) {
      key = keys[i2];
      fn.call(null, obj[key], key, obj);
    }
  }
}
function findKey(obj, key) {
  key = key.toLowerCase();
  const keys = Object.keys(obj);
  let i2 = keys.length;
  let _key;
  while (i2-- > 0) {
    _key = keys[i2];
    if (key === _key.toLowerCase()) {
      return _key;
    }
  }
  return null;
}
var _global = (() => {
  if (typeof globalThis !== "undefined")
    return globalThis;
  return typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : global;
})();
var isContextDefined = (context) => !isUndefined(context) && context !== _global;
function merge() {
  const { caseless } = isContextDefined(this) && this || {};
  const result = {};
  const assignValue = (val, key) => {
    const targetKey = caseless && findKey(result, key) || key;
    if (isPlainObject(result[targetKey]) && isPlainObject(val)) {
      result[targetKey] = merge(result[targetKey], val);
    } else if (isPlainObject(val)) {
      result[targetKey] = merge({}, val);
    } else if (isArray(val)) {
      result[targetKey] = val.slice();
    } else {
      result[targetKey] = val;
    }
  };
  for (let i2 = 0, l = arguments.length; i2 < l; i2++) {
    arguments[i2] && forEach(arguments[i2], assignValue);
  }
  return result;
}
var extend = (a2, b6, thisArg, { allOwnKeys } = {}) => {
  forEach(b6, (val, key) => {
    if (thisArg && isFunction(val)) {
      a2[key] = bind(val, thisArg);
    } else {
      a2[key] = val;
    }
  }, { allOwnKeys });
  return a2;
};
var stripBOM = (content) => {
  if (content.charCodeAt(0) === 65279) {
    content = content.slice(1);
  }
  return content;
};
var inherits = (constructor, superConstructor, props, descriptors3) => {
  constructor.prototype = Object.create(superConstructor.prototype, descriptors3);
  constructor.prototype.constructor = constructor;
  Object.defineProperty(constructor, "super", {
    value: superConstructor.prototype
  });
  props && Object.assign(constructor.prototype, props);
};
var toFlatObject = (sourceObj, destObj, filter2, propFilter) => {
  let props;
  let i2;
  let prop;
  const merged = {};
  destObj = destObj || {};
  if (sourceObj == null)
    return destObj;
  do {
    props = Object.getOwnPropertyNames(sourceObj);
    i2 = props.length;
    while (i2-- > 0) {
      prop = props[i2];
      if ((!propFilter || propFilter(prop, sourceObj, destObj)) && !merged[prop]) {
        destObj[prop] = sourceObj[prop];
        merged[prop] = true;
      }
    }
    sourceObj = filter2 !== false && getPrototypeOf(sourceObj);
  } while (sourceObj && (!filter2 || filter2(sourceObj, destObj)) && sourceObj !== Object.prototype);
  return destObj;
};
var endsWith = (str, searchString, position) => {
  str = String(str);
  if (position === void 0 || position > str.length) {
    position = str.length;
  }
  position -= searchString.length;
  const lastIndex = str.indexOf(searchString, position);
  return lastIndex !== -1 && lastIndex === position;
};
var toArray = (thing) => {
  if (!thing)
    return null;
  if (isArray(thing))
    return thing;
  let i2 = thing.length;
  if (!isNumber(i2))
    return null;
  const arr = new Array(i2);
  while (i2-- > 0) {
    arr[i2] = thing[i2];
  }
  return arr;
};
var isTypedArray = ((TypedArray) => {
  return (thing) => {
    return TypedArray && thing instanceof TypedArray;
  };
})(typeof Uint8Array !== "undefined" && getPrototypeOf(Uint8Array));
var forEachEntry = (obj, fn) => {
  const generator = obj && obj[Symbol.iterator];
  const iterator = generator.call(obj);
  let result;
  while ((result = iterator.next()) && !result.done) {
    const pair = result.value;
    fn.call(obj, pair[0], pair[1]);
  }
};
var matchAll = (regExp, str) => {
  let matches;
  const arr = [];
  while ((matches = regExp.exec(str)) !== null) {
    arr.push(matches);
  }
  return arr;
};
var isHTMLForm = kindOfTest("HTMLFormElement");
var toCamelCase = (str) => {
  return str.toLowerCase().replace(
    /[-_\s]([a-z\d])(\w*)/g,
    function replacer(m4, p1, p22) {
      return p1.toUpperCase() + p22;
    }
  );
};
var hasOwnProperty = (({ hasOwnProperty: hasOwnProperty2 }) => (obj, prop) => hasOwnProperty2.call(obj, prop))(Object.prototype);
var isRegExp = kindOfTest("RegExp");
var reduceDescriptors = (obj, reducer) => {
  const descriptors3 = Object.getOwnPropertyDescriptors(obj);
  const reducedDescriptors = {};
  forEach(descriptors3, (descriptor, name) => {
    let ret;
    if ((ret = reducer(descriptor, name, obj)) !== false) {
      reducedDescriptors[name] = ret || descriptor;
    }
  });
  Object.defineProperties(obj, reducedDescriptors);
};
var freezeMethods = (obj) => {
  reduceDescriptors(obj, (descriptor, name) => {
    if (isFunction(obj) && ["arguments", "caller", "callee"].indexOf(name) !== -1) {
      return false;
    }
    const value = obj[name];
    if (!isFunction(value))
      return;
    descriptor.enumerable = false;
    if ("writable" in descriptor) {
      descriptor.writable = false;
      return;
    }
    if (!descriptor.set) {
      descriptor.set = () => {
        throw Error("Can not rewrite read-only method '" + name + "'");
      };
    }
  });
};
var toObjectSet = (arrayOrString, delimiter) => {
  const obj = {};
  const define = (arr) => {
    arr.forEach((value) => {
      obj[value] = true;
    });
  };
  isArray(arrayOrString) ? define(arrayOrString) : define(String(arrayOrString).split(delimiter));
  return obj;
};
var noop = () => {
};
var toFiniteNumber = (value, defaultValue) => {
  value = +value;
  return Number.isFinite(value) ? value : defaultValue;
};
var ALPHA = "abcdefghijklmnopqrstuvwxyz";
var DIGIT = "0123456789";
var ALPHABET = {
  DIGIT,
  ALPHA,
  ALPHA_DIGIT: ALPHA + ALPHA.toUpperCase() + DIGIT
};
var generateString = (size = 16, alphabet = ALPHABET.ALPHA_DIGIT) => {
  let str = "";
  const { length } = alphabet;
  while (size--) {
    str += alphabet[Math.random() * length | 0];
  }
  return str;
};
function isSpecCompliantForm(thing) {
  return !!(thing && isFunction(thing.append) && thing[Symbol.toStringTag] === "FormData" && thing[Symbol.iterator]);
}
var toJSONObject = (obj) => {
  const stack = new Array(10);
  const visit = (source, i2) => {
    if (isObject(source)) {
      if (stack.indexOf(source) >= 0) {
        return;
      }
      if (!("toJSON" in source)) {
        stack[i2] = source;
        const target = isArray(source) ? [] : {};
        forEach(source, (value, key) => {
          const reducedValue = visit(value, i2 + 1);
          !isUndefined(reducedValue) && (target[key] = reducedValue);
        });
        stack[i2] = void 0;
        return target;
      }
    }
    return source;
  };
  return visit(obj, 0);
};
var isAsyncFn = kindOfTest("AsyncFunction");
var isThenable = (thing) => thing && (isObject(thing) || isFunction(thing)) && isFunction(thing.then) && isFunction(thing.catch);
var utils_default = {
  isArray,
  isArrayBuffer,
  isBuffer,
  isFormData,
  isArrayBufferView,
  isString,
  isNumber,
  isBoolean,
  isObject,
  isPlainObject,
  isUndefined,
  isDate,
  isFile,
  isBlob,
  isRegExp,
  isFunction,
  isStream: isStream2,
  isURLSearchParams,
  isTypedArray,
  isFileList,
  forEach,
  merge,
  extend,
  trim,
  stripBOM,
  inherits,
  toFlatObject,
  kindOf,
  kindOfTest,
  endsWith,
  toArray,
  forEachEntry,
  matchAll,
  isHTMLForm,
  hasOwnProperty,
  hasOwnProp: hasOwnProperty,
  reduceDescriptors,
  freezeMethods,
  toObjectSet,
  toCamelCase,
  noop,
  toFiniteNumber,
  findKey,
  global: _global,
  isContextDefined,
  ALPHABET,
  generateString,
  isSpecCompliantForm,
  toJSONObject,
  isAsyncFn,
  isThenable
};

// node_modules/axios/lib/core/AxiosError.js
function AxiosError(message, code, config8, request, response) {
  Error.call(this);
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, this.constructor);
  } else {
    this.stack = new Error().stack;
  }
  this.message = message;
  this.name = "AxiosError";
  code && (this.code = code);
  config8 && (this.config = config8);
  request && (this.request = request);
  response && (this.response = response);
}
utils_default.inherits(AxiosError, Error, {
  toJSON: function toJSON() {
    return {
      message: this.message,
      name: this.name,
      description: this.description,
      number: this.number,
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      config: utils_default.toJSONObject(this.config),
      code: this.code,
      status: this.response && this.response.status ? this.response.status : null
    };
  }
});
var prototype = AxiosError.prototype;
var descriptors2 = {};
[
  "ERR_BAD_OPTION_VALUE",
  "ERR_BAD_OPTION",
  "ECONNABORTED",
  "ETIMEDOUT",
  "ERR_NETWORK",
  "ERR_FR_TOO_MANY_REDIRECTS",
  "ERR_DEPRECATED",
  "ERR_BAD_RESPONSE",
  "ERR_BAD_REQUEST",
  "ERR_CANCELED",
  "ERR_NOT_SUPPORT",
  "ERR_INVALID_URL"
].forEach((code) => {
  descriptors2[code] = { value: code };
});
Object.defineProperties(AxiosError, descriptors2);
Object.defineProperty(prototype, "isAxiosError", { value: true });
AxiosError.from = (error, code, config8, request, response, customProps) => {
  const axiosError = Object.create(prototype);
  utils_default.toFlatObject(error, axiosError, function filter2(obj) {
    return obj !== Error.prototype;
  }, (prop) => {
    return prop !== "isAxiosError";
  });
  AxiosError.call(axiosError, error.message, code, config8, request, response);
  axiosError.cause = error;
  axiosError.name = error.name;
  customProps && Object.assign(axiosError, customProps);
  return axiosError;
};
var AxiosError_default = AxiosError;

// node_modules/axios/lib/platform/node/classes/FormData.js
var import_form_data = __toESM(require_form_data(), 1);
var FormData_default = import_form_data.default;

// node_modules/axios/lib/helpers/toFormData.js
function isVisitable(thing) {
  return utils_default.isPlainObject(thing) || utils_default.isArray(thing);
}
function removeBrackets(key) {
  return utils_default.endsWith(key, "[]") ? key.slice(0, -2) : key;
}
function renderKey(path5, key, dots) {
  if (!path5)
    return key;
  return path5.concat(key).map(function each(token, i2) {
    token = removeBrackets(token);
    return !dots && i2 ? "[" + token + "]" : token;
  }).join(dots ? "." : "");
}
function isFlatArray(arr) {
  return utils_default.isArray(arr) && !arr.some(isVisitable);
}
var predicates = utils_default.toFlatObject(utils_default, {}, null, function filter(prop) {
  return /^is[A-Z]/.test(prop);
});
function toFormData(obj, formData, options) {
  if (!utils_default.isObject(obj)) {
    throw new TypeError("target must be an object");
  }
  formData = formData || new (FormData_default || FormData)();
  options = utils_default.toFlatObject(options, {
    metaTokens: true,
    dots: false,
    indexes: false
  }, false, function defined(option, source) {
    return !utils_default.isUndefined(source[option]);
  });
  const metaTokens = options.metaTokens;
  const visitor = options.visitor || defaultVisitor;
  const dots = options.dots;
  const indexes = options.indexes;
  const _Blob = options.Blob || typeof Blob !== "undefined" && Blob;
  const useBlob = _Blob && utils_default.isSpecCompliantForm(formData);
  if (!utils_default.isFunction(visitor)) {
    throw new TypeError("visitor must be a function");
  }
  function convertValue(value) {
    if (value === null)
      return "";
    if (utils_default.isDate(value)) {
      return value.toISOString();
    }
    if (!useBlob && utils_default.isBlob(value)) {
      throw new AxiosError_default("Blob is not supported. Use a Buffer instead.");
    }
    if (utils_default.isArrayBuffer(value) || utils_default.isTypedArray(value)) {
      return useBlob && typeof Blob === "function" ? new Blob([value]) : Buffer.from(value);
    }
    return value;
  }
  function defaultVisitor(value, key, path5) {
    let arr = value;
    if (value && !path5 && typeof value === "object") {
      if (utils_default.endsWith(key, "{}")) {
        key = metaTokens ? key : key.slice(0, -2);
        value = JSON.stringify(value);
      } else if (utils_default.isArray(value) && isFlatArray(value) || (utils_default.isFileList(value) || utils_default.endsWith(key, "[]")) && (arr = utils_default.toArray(value))) {
        key = removeBrackets(key);
        arr.forEach(function each(el, index) {
          !(utils_default.isUndefined(el) || el === null) && formData.append(
            indexes === true ? renderKey([key], index, dots) : indexes === null ? key : key + "[]",
            convertValue(el)
          );
        });
        return false;
      }
    }
    if (isVisitable(value)) {
      return true;
    }
    formData.append(renderKey(path5, key, dots), convertValue(value));
    return false;
  }
  const stack = [];
  const exposedHelpers = Object.assign(predicates, {
    defaultVisitor,
    convertValue,
    isVisitable
  });
  function build(value, path5) {
    if (utils_default.isUndefined(value))
      return;
    if (stack.indexOf(value) !== -1) {
      throw Error("Circular reference detected in " + path5.join("."));
    }
    stack.push(value);
    utils_default.forEach(value, function each(el, key) {
      const result = !(utils_default.isUndefined(el) || el === null) && visitor.call(
        formData,
        el,
        utils_default.isString(key) ? key.trim() : key,
        path5,
        exposedHelpers
      );
      if (result === true) {
        build(el, path5 ? path5.concat(key) : [key]);
      }
    });
    stack.pop();
  }
  if (!utils_default.isObject(obj)) {
    throw new TypeError("data must be an object");
  }
  build(obj);
  return formData;
}
var toFormData_default = toFormData;

// node_modules/axios/lib/helpers/AxiosURLSearchParams.js
function encode(str) {
  const charMap = {
    "!": "%21",
    "'": "%27",
    "(": "%28",
    ")": "%29",
    "~": "%7E",
    "%20": "+",
    "%00": "\0"
  };
  return encodeURIComponent(str).replace(/[!'()~]|%20|%00/g, function replacer(match) {
    return charMap[match];
  });
}
function AxiosURLSearchParams(params, options) {
  this._pairs = [];
  params && toFormData_default(params, this, options);
}
var prototype2 = AxiosURLSearchParams.prototype;
prototype2.append = function append(name, value) {
  this._pairs.push([name, value]);
};
prototype2.toString = function toString2(encoder) {
  const _encode = encoder ? function(value) {
    return encoder.call(this, value, encode);
  } : encode;
  return this._pairs.map(function each(pair) {
    return _encode(pair[0]) + "=" + _encode(pair[1]);
  }, "").join("&");
};
var AxiosURLSearchParams_default = AxiosURLSearchParams;

// node_modules/axios/lib/helpers/buildURL.js
function encode2(val) {
  return encodeURIComponent(val).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+").replace(/%5B/gi, "[").replace(/%5D/gi, "]");
}
function buildURL(url3, params, options) {
  if (!params) {
    return url3;
  }
  const _encode = options && options.encode || encode2;
  const serializeFn = options && options.serialize;
  let serializedParams;
  if (serializeFn) {
    serializedParams = serializeFn(params, options);
  } else {
    serializedParams = utils_default.isURLSearchParams(params) ? params.toString() : new AxiosURLSearchParams_default(params, options).toString(_encode);
  }
  if (serializedParams) {
    const hashmarkIndex = url3.indexOf("#");
    if (hashmarkIndex !== -1) {
      url3 = url3.slice(0, hashmarkIndex);
    }
    url3 += (url3.indexOf("?") === -1 ? "?" : "&") + serializedParams;
  }
  return url3;
}

// node_modules/axios/lib/core/InterceptorManager.js
var InterceptorManager = class {
  constructor() {
    this.handlers = [];
  }
  use(fulfilled, rejected, options) {
    this.handlers.push({
      fulfilled,
      rejected,
      synchronous: options ? options.synchronous : false,
      runWhen: options ? options.runWhen : null
    });
    return this.handlers.length - 1;
  }
  eject(id) {
    if (this.handlers[id]) {
      this.handlers[id] = null;
    }
  }
  clear() {
    if (this.handlers) {
      this.handlers = [];
    }
  }
  forEach(fn) {
    utils_default.forEach(this.handlers, function forEachHandler(h4) {
      if (h4 !== null) {
        fn(h4);
      }
    });
  }
};
var InterceptorManager_default = InterceptorManager;

// node_modules/axios/lib/defaults/transitional.js
var transitional_default = {
  silentJSONParsing: true,
  forcedJSONParsing: true,
  clarifyTimeoutError: false
};

// node_modules/axios/lib/platform/node/classes/URLSearchParams.js
var import_url = __toESM(require("url"), 1);
var URLSearchParams_default = import_url.default.URLSearchParams;

// node_modules/axios/lib/platform/node/index.js
var node_default = {
  isNode: true,
  classes: {
    URLSearchParams: URLSearchParams_default,
    FormData: FormData_default,
    Blob: typeof Blob !== "undefined" && Blob || null
  },
  protocols: ["http", "https", "file", "data"]
};

// node_modules/axios/lib/platform/common/utils.js
var utils_exports = {};
__export(utils_exports, {
  hasBrowserEnv: () => hasBrowserEnv,
  hasStandardBrowserEnv: () => hasStandardBrowserEnv,
  hasStandardBrowserWebWorkerEnv: () => hasStandardBrowserWebWorkerEnv
});
var hasBrowserEnv = typeof window !== "undefined" && typeof document !== "undefined";
var hasStandardBrowserEnv = ((product) => {
  return hasBrowserEnv && ["ReactNative", "NativeScript", "NS"].indexOf(product) < 0;
})(typeof navigator !== "undefined" && navigator.product);
var hasStandardBrowserWebWorkerEnv = (() => {
  return typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope && typeof self.importScripts === "function";
})();

// node_modules/axios/lib/platform/index.js
var platform_default = {
  ...utils_exports,
  ...node_default
};

// node_modules/axios/lib/helpers/toURLEncodedForm.js
function toURLEncodedForm(data, options) {
  return toFormData_default(data, new platform_default.classes.URLSearchParams(), Object.assign({
    visitor: function(value, key, path5, helpers) {
      if (platform_default.isNode && utils_default.isBuffer(value)) {
        this.append(key, value.toString("base64"));
        return false;
      }
      return helpers.defaultVisitor.apply(this, arguments);
    }
  }, options));
}

// node_modules/axios/lib/helpers/formDataToJSON.js
function parsePropPath(name) {
  return utils_default.matchAll(/\w+|\[(\w*)]/g, name).map((match) => {
    return match[0] === "[]" ? "" : match[1] || match[0];
  });
}
function arrayToObject(arr) {
  const obj = {};
  const keys = Object.keys(arr);
  let i2;
  const len = keys.length;
  let key;
  for (i2 = 0; i2 < len; i2++) {
    key = keys[i2];
    obj[key] = arr[key];
  }
  return obj;
}
function formDataToJSON(formData) {
  function buildPath(path5, value, target, index) {
    let name = path5[index++];
    if (name === "__proto__")
      return true;
    const isNumericKey = Number.isFinite(+name);
    const isLast = index >= path5.length;
    name = !name && utils_default.isArray(target) ? target.length : name;
    if (isLast) {
      if (utils_default.hasOwnProp(target, name)) {
        target[name] = [target[name], value];
      } else {
        target[name] = value;
      }
      return !isNumericKey;
    }
    if (!target[name] || !utils_default.isObject(target[name])) {
      target[name] = [];
    }
    const result = buildPath(path5, value, target[name], index);
    if (result && utils_default.isArray(target[name])) {
      target[name] = arrayToObject(target[name]);
    }
    return !isNumericKey;
  }
  if (utils_default.isFormData(formData) && utils_default.isFunction(formData.entries)) {
    const obj = {};
    utils_default.forEachEntry(formData, (name, value) => {
      buildPath(parsePropPath(name), value, obj, 0);
    });
    return obj;
  }
  return null;
}
var formDataToJSON_default = formDataToJSON;

// node_modules/axios/lib/defaults/index.js
function stringifySafely(rawValue, parser, encoder) {
  if (utils_default.isString(rawValue)) {
    try {
      (parser || JSON.parse)(rawValue);
      return utils_default.trim(rawValue);
    } catch (e2) {
      if (e2.name !== "SyntaxError") {
        throw e2;
      }
    }
  }
  return (encoder || JSON.stringify)(rawValue);
}
var defaults = {
  transitional: transitional_default,
  adapter: ["xhr", "http"],
  transformRequest: [function transformRequest(data, headers) {
    const contentType = headers.getContentType() || "";
    const hasJSONContentType = contentType.indexOf("application/json") > -1;
    const isObjectPayload = utils_default.isObject(data);
    if (isObjectPayload && utils_default.isHTMLForm(data)) {
      data = new FormData(data);
    }
    const isFormData2 = utils_default.isFormData(data);
    if (isFormData2) {
      if (!hasJSONContentType) {
        return data;
      }
      return hasJSONContentType ? JSON.stringify(formDataToJSON_default(data)) : data;
    }
    if (utils_default.isArrayBuffer(data) || utils_default.isBuffer(data) || utils_default.isStream(data) || utils_default.isFile(data) || utils_default.isBlob(data)) {
      return data;
    }
    if (utils_default.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils_default.isURLSearchParams(data)) {
      headers.setContentType("application/x-www-form-urlencoded;charset=utf-8", false);
      return data.toString();
    }
    let isFileList2;
    if (isObjectPayload) {
      if (contentType.indexOf("application/x-www-form-urlencoded") > -1) {
        return toURLEncodedForm(data, this.formSerializer).toString();
      }
      if ((isFileList2 = utils_default.isFileList(data)) || contentType.indexOf("multipart/form-data") > -1) {
        const _FormData = this.env && this.env.FormData;
        return toFormData_default(
          isFileList2 ? { "files[]": data } : data,
          _FormData && new _FormData(),
          this.formSerializer
        );
      }
    }
    if (isObjectPayload || hasJSONContentType) {
      headers.setContentType("application/json", false);
      return stringifySafely(data);
    }
    return data;
  }],
  transformResponse: [function transformResponse(data) {
    const transitional2 = this.transitional || defaults.transitional;
    const forcedJSONParsing = transitional2 && transitional2.forcedJSONParsing;
    const JSONRequested = this.responseType === "json";
    if (data && utils_default.isString(data) && (forcedJSONParsing && !this.responseType || JSONRequested)) {
      const silentJSONParsing = transitional2 && transitional2.silentJSONParsing;
      const strictJSONParsing = !silentJSONParsing && JSONRequested;
      try {
        return JSON.parse(data);
      } catch (e2) {
        if (strictJSONParsing) {
          if (e2.name === "SyntaxError") {
            throw AxiosError_default.from(e2, AxiosError_default.ERR_BAD_RESPONSE, this, null, this.response);
          }
          throw e2;
        }
      }
    }
    return data;
  }],
  timeout: 0,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
  maxContentLength: -1,
  maxBodyLength: -1,
  env: {
    FormData: platform_default.classes.FormData,
    Blob: platform_default.classes.Blob
  },
  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  },
  headers: {
    common: {
      "Accept": "application/json, text/plain, */*",
      "Content-Type": void 0
    }
  }
};
utils_default.forEach(["delete", "get", "head", "post", "put", "patch"], (method) => {
  defaults.headers[method] = {};
});
var defaults_default = defaults;

// node_modules/axios/lib/helpers/parseHeaders.js
var ignoreDuplicateOf = utils_default.toObjectSet([
  "age",
  "authorization",
  "content-length",
  "content-type",
  "etag",
  "expires",
  "from",
  "host",
  "if-modified-since",
  "if-unmodified-since",
  "last-modified",
  "location",
  "max-forwards",
  "proxy-authorization",
  "referer",
  "retry-after",
  "user-agent"
]);
var parseHeaders_default = (rawHeaders) => {
  const parsed = {};
  let key;
  let val;
  let i2;
  rawHeaders && rawHeaders.split("\n").forEach(function parser(line) {
    i2 = line.indexOf(":");
    key = line.substring(0, i2).trim().toLowerCase();
    val = line.substring(i2 + 1).trim();
    if (!key || parsed[key] && ignoreDuplicateOf[key]) {
      return;
    }
    if (key === "set-cookie") {
      if (parsed[key]) {
        parsed[key].push(val);
      } else {
        parsed[key] = [val];
      }
    } else {
      parsed[key] = parsed[key] ? parsed[key] + ", " + val : val;
    }
  });
  return parsed;
};

// node_modules/axios/lib/core/AxiosHeaders.js
var $internals = Symbol("internals");
function normalizeHeader(header) {
  return header && String(header).trim().toLowerCase();
}
function normalizeValue(value) {
  if (value === false || value == null) {
    return value;
  }
  return utils_default.isArray(value) ? value.map(normalizeValue) : String(value);
}
function parseTokens(str) {
  const tokens = /* @__PURE__ */ Object.create(null);
  const tokensRE = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
  let match;
  while (match = tokensRE.exec(str)) {
    tokens[match[1]] = match[2];
  }
  return tokens;
}
var isValidHeaderName = (str) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(str.trim());
function matchHeaderValue(context, value, header, filter2, isHeaderNameFilter) {
  if (utils_default.isFunction(filter2)) {
    return filter2.call(this, value, header);
  }
  if (isHeaderNameFilter) {
    value = header;
  }
  if (!utils_default.isString(value))
    return;
  if (utils_default.isString(filter2)) {
    return value.indexOf(filter2) !== -1;
  }
  if (utils_default.isRegExp(filter2)) {
    return filter2.test(value);
  }
}
function formatHeader(header) {
  return header.trim().toLowerCase().replace(/([a-z\d])(\w*)/g, (w6, char, str) => {
    return char.toUpperCase() + str;
  });
}
function buildAccessors(obj, header) {
  const accessorName = utils_default.toCamelCase(" " + header);
  ["get", "set", "has"].forEach((methodName) => {
    Object.defineProperty(obj, methodName + accessorName, {
      value: function(arg1, arg2, arg3) {
        return this[methodName].call(this, header, arg1, arg2, arg3);
      },
      configurable: true
    });
  });
}
var AxiosHeaders = class {
  constructor(headers) {
    headers && this.set(headers);
  }
  set(header, valueOrRewrite, rewrite) {
    const self2 = this;
    function setHeader(_value, _header, _rewrite) {
      const lHeader = normalizeHeader(_header);
      if (!lHeader) {
        throw new Error("header name must be a non-empty string");
      }
      const key = utils_default.findKey(self2, lHeader);
      if (!key || self2[key] === void 0 || _rewrite === true || _rewrite === void 0 && self2[key] !== false) {
        self2[key || _header] = normalizeValue(_value);
      }
    }
    const setHeaders = (headers, _rewrite) => utils_default.forEach(headers, (_value, _header) => setHeader(_value, _header, _rewrite));
    if (utils_default.isPlainObject(header) || header instanceof this.constructor) {
      setHeaders(header, valueOrRewrite);
    } else if (utils_default.isString(header) && (header = header.trim()) && !isValidHeaderName(header)) {
      setHeaders(parseHeaders_default(header), valueOrRewrite);
    } else {
      header != null && setHeader(valueOrRewrite, header, rewrite);
    }
    return this;
  }
  get(header, parser) {
    header = normalizeHeader(header);
    if (header) {
      const key = utils_default.findKey(this, header);
      if (key) {
        const value = this[key];
        if (!parser) {
          return value;
        }
        if (parser === true) {
          return parseTokens(value);
        }
        if (utils_default.isFunction(parser)) {
          return parser.call(this, value, key);
        }
        if (utils_default.isRegExp(parser)) {
          return parser.exec(value);
        }
        throw new TypeError("parser must be boolean|regexp|function");
      }
    }
  }
  has(header, matcher) {
    header = normalizeHeader(header);
    if (header) {
      const key = utils_default.findKey(this, header);
      return !!(key && this[key] !== void 0 && (!matcher || matchHeaderValue(this, this[key], key, matcher)));
    }
    return false;
  }
  delete(header, matcher) {
    const self2 = this;
    let deleted = false;
    function deleteHeader(_header) {
      _header = normalizeHeader(_header);
      if (_header) {
        const key = utils_default.findKey(self2, _header);
        if (key && (!matcher || matchHeaderValue(self2, self2[key], key, matcher))) {
          delete self2[key];
          deleted = true;
        }
      }
    }
    if (utils_default.isArray(header)) {
      header.forEach(deleteHeader);
    } else {
      deleteHeader(header);
    }
    return deleted;
  }
  clear(matcher) {
    const keys = Object.keys(this);
    let i2 = keys.length;
    let deleted = false;
    while (i2--) {
      const key = keys[i2];
      if (!matcher || matchHeaderValue(this, this[key], key, matcher, true)) {
        delete this[key];
        deleted = true;
      }
    }
    return deleted;
  }
  normalize(format) {
    const self2 = this;
    const headers = {};
    utils_default.forEach(this, (value, header) => {
      const key = utils_default.findKey(headers, header);
      if (key) {
        self2[key] = normalizeValue(value);
        delete self2[header];
        return;
      }
      const normalized = format ? formatHeader(header) : String(header).trim();
      if (normalized !== header) {
        delete self2[header];
      }
      self2[normalized] = normalizeValue(value);
      headers[normalized] = true;
    });
    return this;
  }
  concat(...targets) {
    return this.constructor.concat(this, ...targets);
  }
  toJSON(asStrings) {
    const obj = /* @__PURE__ */ Object.create(null);
    utils_default.forEach(this, (value, header) => {
      value != null && value !== false && (obj[header] = asStrings && utils_default.isArray(value) ? value.join(", ") : value);
    });
    return obj;
  }
  [Symbol.iterator]() {
    return Object.entries(this.toJSON())[Symbol.iterator]();
  }
  toString() {
    return Object.entries(this.toJSON()).map(([header, value]) => header + ": " + value).join("\n");
  }
  get [Symbol.toStringTag]() {
    return "AxiosHeaders";
  }
  static from(thing) {
    return thing instanceof this ? thing : new this(thing);
  }
  static concat(first, ...targets) {
    const computed = new this(first);
    targets.forEach((target) => computed.set(target));
    return computed;
  }
  static accessor(header) {
    const internals = this[$internals] = this[$internals] = {
      accessors: {}
    };
    const accessors = internals.accessors;
    const prototype3 = this.prototype;
    function defineAccessor(_header) {
      const lHeader = normalizeHeader(_header);
      if (!accessors[lHeader]) {
        buildAccessors(prototype3, _header);
        accessors[lHeader] = true;
      }
    }
    utils_default.isArray(header) ? header.forEach(defineAccessor) : defineAccessor(header);
    return this;
  }
};
AxiosHeaders.accessor(["Content-Type", "Content-Length", "Accept", "Accept-Encoding", "User-Agent", "Authorization"]);
utils_default.reduceDescriptors(AxiosHeaders.prototype, ({ value }, key) => {
  let mapped = key[0].toUpperCase() + key.slice(1);
  return {
    get: () => value,
    set(headerValue) {
      this[mapped] = headerValue;
    }
  };
});
utils_default.freezeMethods(AxiosHeaders);
var AxiosHeaders_default = AxiosHeaders;

// node_modules/axios/lib/core/transformData.js
function transformData(fns, response) {
  const config8 = this || defaults_default;
  const context = response || config8;
  const headers = AxiosHeaders_default.from(context.headers);
  let data = context.data;
  utils_default.forEach(fns, function transform(fn) {
    data = fn.call(config8, data, headers.normalize(), response ? response.status : void 0);
  });
  headers.normalize();
  return data;
}

// node_modules/axios/lib/cancel/isCancel.js
function isCancel(value) {
  return !!(value && value.__CANCEL__);
}

// node_modules/axios/lib/cancel/CanceledError.js
function CanceledError(message, config8, request) {
  AxiosError_default.call(this, message == null ? "canceled" : message, AxiosError_default.ERR_CANCELED, config8, request);
  this.name = "CanceledError";
}
utils_default.inherits(CanceledError, AxiosError_default, {
  __CANCEL__: true
});
var CanceledError_default = CanceledError;

// node_modules/axios/lib/core/settle.js
function settle(resolve, reject, response) {
  const validateStatus2 = response.config.validateStatus;
  if (!response.status || !validateStatus2 || validateStatus2(response.status)) {
    resolve(response);
  } else {
    reject(new AxiosError_default(
      "Request failed with status code " + response.status,
      [AxiosError_default.ERR_BAD_REQUEST, AxiosError_default.ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4],
      response.config,
      response.request,
      response
    ));
  }
}

// node_modules/axios/lib/helpers/isAbsoluteURL.js
function isAbsoluteURL(url3) {
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url3);
}

// node_modules/axios/lib/helpers/combineURLs.js
function combineURLs(baseURL, relativeURL) {
  return relativeURL ? baseURL.replace(/\/?\/$/, "") + "/" + relativeURL.replace(/^\/+/, "") : baseURL;
}

// node_modules/axios/lib/core/buildFullPath.js
function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
}

// node_modules/axios/lib/adapters/http.js
var import_proxy_from_env = __toESM(require_proxy_from_env(), 1);
var import_http = __toESM(require("http"), 1);
var import_https = __toESM(require("https"), 1);
var import_util2 = __toESM(require("util"), 1);
var import_follow_redirects = __toESM(require_follow_redirects(), 1);
var import_zlib = __toESM(require("zlib"), 1);

// node_modules/axios/lib/env/data.js
var VERSION = "1.6.5";

// node_modules/axios/lib/helpers/parseProtocol.js
function parseProtocol(url3) {
  const match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url3);
  return match && match[1] || "";
}

// node_modules/axios/lib/helpers/fromDataURI.js
var DATA_URL_PATTERN = /^(?:([^;]+);)?(?:[^;]+;)?(base64|),([\s\S]*)$/;
function fromDataURI(uri, asBlob, options) {
  const _Blob = options && options.Blob || platform_default.classes.Blob;
  const protocol = parseProtocol(uri);
  if (asBlob === void 0 && _Blob) {
    asBlob = true;
  }
  if (protocol === "data") {
    uri = protocol.length ? uri.slice(protocol.length + 1) : uri;
    const match = DATA_URL_PATTERN.exec(uri);
    if (!match) {
      throw new AxiosError_default("Invalid URL", AxiosError_default.ERR_INVALID_URL);
    }
    const mime = match[1];
    const isBase64 = match[2];
    const body = match[3];
    const buffer = Buffer.from(decodeURIComponent(body), isBase64 ? "base64" : "utf8");
    if (asBlob) {
      if (!_Blob) {
        throw new AxiosError_default("Blob is not supported", AxiosError_default.ERR_NOT_SUPPORT);
      }
      return new _Blob([buffer], { type: mime });
    }
    return buffer;
  }
  throw new AxiosError_default("Unsupported protocol " + protocol, AxiosError_default.ERR_NOT_SUPPORT);
}

// node_modules/axios/lib/adapters/http.js
var import_stream5 = __toESM(require("stream"), 1);

// node_modules/axios/lib/helpers/AxiosTransformStream.js
var import_stream2 = __toESM(require("stream"), 1);

// node_modules/axios/lib/helpers/throttle.js
function throttle(fn, freq) {
  let timestamp = 0;
  const threshold = 1e3 / freq;
  let timer = null;
  return function throttled(force, args) {
    const now = Date.now();
    if (force || now - timestamp > threshold) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      timestamp = now;
      return fn.apply(null, args);
    }
    if (!timer) {
      timer = setTimeout(() => {
        timer = null;
        timestamp = Date.now();
        return fn.apply(null, args);
      }, threshold - (now - timestamp));
    }
  };
}
var throttle_default = throttle;

// node_modules/axios/lib/helpers/speedometer.js
function speedometer(samplesCount, min) {
  samplesCount = samplesCount || 10;
  const bytes = new Array(samplesCount);
  const timestamps = new Array(samplesCount);
  let head = 0;
  let tail = 0;
  let firstSampleTS;
  min = min !== void 0 ? min : 1e3;
  return function push(chunkLength) {
    const now = Date.now();
    const startedAt = timestamps[tail];
    if (!firstSampleTS) {
      firstSampleTS = now;
    }
    bytes[head] = chunkLength;
    timestamps[head] = now;
    let i2 = tail;
    let bytesCount = 0;
    while (i2 !== head) {
      bytesCount += bytes[i2++];
      i2 = i2 % samplesCount;
    }
    head = (head + 1) % samplesCount;
    if (head === tail) {
      tail = (tail + 1) % samplesCount;
    }
    if (now - firstSampleTS < min) {
      return;
    }
    const passed = startedAt && now - startedAt;
    return passed ? Math.round(bytesCount * 1e3 / passed) : void 0;
  };
}
var speedometer_default = speedometer;

// node_modules/axios/lib/helpers/AxiosTransformStream.js
var kInternals = Symbol("internals");
var AxiosTransformStream = class extends import_stream2.default.Transform {
  constructor(options) {
    options = utils_default.toFlatObject(options, {
      maxRate: 0,
      chunkSize: 64 * 1024,
      minChunkSize: 100,
      timeWindow: 500,
      ticksRate: 2,
      samplesCount: 15
    }, null, (prop, source) => {
      return !utils_default.isUndefined(source[prop]);
    });
    super({
      readableHighWaterMark: options.chunkSize
    });
    const self2 = this;
    const internals = this[kInternals] = {
      length: options.length,
      timeWindow: options.timeWindow,
      ticksRate: options.ticksRate,
      chunkSize: options.chunkSize,
      maxRate: options.maxRate,
      minChunkSize: options.minChunkSize,
      bytesSeen: 0,
      isCaptured: false,
      notifiedBytesLoaded: 0,
      ts: Date.now(),
      bytes: 0,
      onReadCallback: null
    };
    const _speedometer = speedometer_default(internals.ticksRate * options.samplesCount, internals.timeWindow);
    this.on("newListener", (event) => {
      if (event === "progress") {
        if (!internals.isCaptured) {
          internals.isCaptured = true;
        }
      }
    });
    let bytesNotified = 0;
    internals.updateProgress = throttle_default(function throttledHandler() {
      const totalBytes = internals.length;
      const bytesTransferred = internals.bytesSeen;
      const progressBytes = bytesTransferred - bytesNotified;
      if (!progressBytes || self2.destroyed)
        return;
      const rate = _speedometer(progressBytes);
      bytesNotified = bytesTransferred;
      process.nextTick(() => {
        self2.emit("progress", {
          "loaded": bytesTransferred,
          "total": totalBytes,
          "progress": totalBytes ? bytesTransferred / totalBytes : void 0,
          "bytes": progressBytes,
          "rate": rate ? rate : void 0,
          "estimated": rate && totalBytes && bytesTransferred <= totalBytes ? (totalBytes - bytesTransferred) / rate : void 0
        });
      });
    }, internals.ticksRate);
    const onFinish = () => {
      internals.updateProgress(true);
    };
    this.once("end", onFinish);
    this.once("error", onFinish);
  }
  _read(size) {
    const internals = this[kInternals];
    if (internals.onReadCallback) {
      internals.onReadCallback();
    }
    return super._read(size);
  }
  _transform(chunk, encoding, callback) {
    const self2 = this;
    const internals = this[kInternals];
    const maxRate = internals.maxRate;
    const readableHighWaterMark = this.readableHighWaterMark;
    const timeWindow = internals.timeWindow;
    const divider = 1e3 / timeWindow;
    const bytesThreshold = maxRate / divider;
    const minChunkSize = internals.minChunkSize !== false ? Math.max(internals.minChunkSize, bytesThreshold * 0.01) : 0;
    function pushChunk(_chunk, _callback) {
      const bytes = Buffer.byteLength(_chunk);
      internals.bytesSeen += bytes;
      internals.bytes += bytes;
      if (internals.isCaptured) {
        internals.updateProgress();
      }
      if (self2.push(_chunk)) {
        process.nextTick(_callback);
      } else {
        internals.onReadCallback = () => {
          internals.onReadCallback = null;
          process.nextTick(_callback);
        };
      }
    }
    const transformChunk = (_chunk, _callback) => {
      const chunkSize = Buffer.byteLength(_chunk);
      let chunkRemainder = null;
      let maxChunkSize = readableHighWaterMark;
      let bytesLeft;
      let passed = 0;
      if (maxRate) {
        const now = Date.now();
        if (!internals.ts || (passed = now - internals.ts) >= timeWindow) {
          internals.ts = now;
          bytesLeft = bytesThreshold - internals.bytes;
          internals.bytes = bytesLeft < 0 ? -bytesLeft : 0;
          passed = 0;
        }
        bytesLeft = bytesThreshold - internals.bytes;
      }
      if (maxRate) {
        if (bytesLeft <= 0) {
          return setTimeout(() => {
            _callback(null, _chunk);
          }, timeWindow - passed);
        }
        if (bytesLeft < maxChunkSize) {
          maxChunkSize = bytesLeft;
        }
      }
      if (maxChunkSize && chunkSize > maxChunkSize && chunkSize - maxChunkSize > minChunkSize) {
        chunkRemainder = _chunk.subarray(maxChunkSize);
        _chunk = _chunk.subarray(0, maxChunkSize);
      }
      pushChunk(_chunk, chunkRemainder ? () => {
        process.nextTick(_callback, null, chunkRemainder);
      } : _callback);
    };
    transformChunk(chunk, function transformNextChunk(err, _chunk) {
      if (err) {
        return callback(err);
      }
      if (_chunk) {
        transformChunk(_chunk, transformNextChunk);
      } else {
        callback(null);
      }
    });
  }
  setLength(length) {
    this[kInternals].length = +length;
    return this;
  }
};
var AxiosTransformStream_default = AxiosTransformStream;

// node_modules/axios/lib/adapters/http.js
var import_events = __toESM(require("events"), 1);

// node_modules/axios/lib/helpers/formDataToStream.js
var import_util = require("util");
var import_stream3 = require("stream");

// node_modules/axios/lib/helpers/readBlob.js
var { asyncIterator } = Symbol;
var readBlob = async function* (blob) {
  if (blob.stream) {
    yield* blob.stream();
  } else if (blob.arrayBuffer) {
    yield await blob.arrayBuffer();
  } else if (blob[asyncIterator]) {
    yield* blob[asyncIterator]();
  } else {
    yield blob;
  }
};
var readBlob_default = readBlob;

// node_modules/axios/lib/helpers/formDataToStream.js
var BOUNDARY_ALPHABET = utils_default.ALPHABET.ALPHA_DIGIT + "-_";
var textEncoder = new import_util.TextEncoder();
var CRLF = "\r\n";
var CRLF_BYTES = textEncoder.encode(CRLF);
var CRLF_BYTES_COUNT = 2;
var FormDataPart = class {
  constructor(name, value) {
    const { escapeName } = this.constructor;
    const isStringValue = utils_default.isString(value);
    let headers = `Content-Disposition: form-data; name="${escapeName(name)}"${!isStringValue && value.name ? `; filename="${escapeName(value.name)}"` : ""}${CRLF}`;
    if (isStringValue) {
      value = textEncoder.encode(String(value).replace(/\r?\n|\r\n?/g, CRLF));
    } else {
      headers += `Content-Type: ${value.type || "application/octet-stream"}${CRLF}`;
    }
    this.headers = textEncoder.encode(headers + CRLF);
    this.contentLength = isStringValue ? value.byteLength : value.size;
    this.size = this.headers.byteLength + this.contentLength + CRLF_BYTES_COUNT;
    this.name = name;
    this.value = value;
  }
  async *encode() {
    yield this.headers;
    const { value } = this;
    if (utils_default.isTypedArray(value)) {
      yield value;
    } else {
      yield* readBlob_default(value);
    }
    yield CRLF_BYTES;
  }
  static escapeName(name) {
    return String(name).replace(/[\r\n"]/g, (match) => ({
      "\r": "%0D",
      "\n": "%0A",
      '"': "%22"
    })[match]);
  }
};
var formDataToStream = (form, headersHandler, options) => {
  const {
    tag = "form-data-boundary",
    size = 25,
    boundary = tag + "-" + utils_default.generateString(size, BOUNDARY_ALPHABET)
  } = options || {};
  if (!utils_default.isFormData(form)) {
    throw TypeError("FormData instance required");
  }
  if (boundary.length < 1 || boundary.length > 70) {
    throw Error("boundary must be 10-70 characters long");
  }
  const boundaryBytes = textEncoder.encode("--" + boundary + CRLF);
  const footerBytes = textEncoder.encode("--" + boundary + "--" + CRLF + CRLF);
  let contentLength = footerBytes.byteLength;
  const parts = Array.from(form.entries()).map(([name, value]) => {
    const part = new FormDataPart(name, value);
    contentLength += part.size;
    return part;
  });
  contentLength += boundaryBytes.byteLength * parts.length;
  contentLength = utils_default.toFiniteNumber(contentLength);
  const computedHeaders = {
    "Content-Type": `multipart/form-data; boundary=${boundary}`
  };
  if (Number.isFinite(contentLength)) {
    computedHeaders["Content-Length"] = contentLength;
  }
  headersHandler && headersHandler(computedHeaders);
  return import_stream3.Readable.from(async function* () {
    for (const part of parts) {
      yield boundaryBytes;
      yield* part.encode();
    }
    yield footerBytes;
  }());
};
var formDataToStream_default = formDataToStream;

// node_modules/axios/lib/helpers/ZlibHeaderTransformStream.js
var import_stream4 = __toESM(require("stream"), 1);
var ZlibHeaderTransformStream = class extends import_stream4.default.Transform {
  __transform(chunk, encoding, callback) {
    this.push(chunk);
    callback();
  }
  _transform(chunk, encoding, callback) {
    if (chunk.length !== 0) {
      this._transform = this.__transform;
      if (chunk[0] !== 120) {
        const header = Buffer.alloc(2);
        header[0] = 120;
        header[1] = 156;
        this.push(header, encoding);
      }
    }
    this.__transform(chunk, encoding, callback);
  }
};
var ZlibHeaderTransformStream_default = ZlibHeaderTransformStream;

// node_modules/axios/lib/helpers/callbackify.js
var callbackify = (fn, reducer) => {
  return utils_default.isAsyncFn(fn) ? function(...args) {
    const cb = args.pop();
    fn.apply(this, args).then((value) => {
      try {
        reducer ? cb(null, ...reducer(value)) : cb(null, value);
      } catch (err) {
        cb(err);
      }
    }, cb);
  } : fn;
};
var callbackify_default = callbackify;

// node_modules/axios/lib/adapters/http.js
var zlibOptions = {
  flush: import_zlib.default.constants.Z_SYNC_FLUSH,
  finishFlush: import_zlib.default.constants.Z_SYNC_FLUSH
};
var brotliOptions = {
  flush: import_zlib.default.constants.BROTLI_OPERATION_FLUSH,
  finishFlush: import_zlib.default.constants.BROTLI_OPERATION_FLUSH
};
var isBrotliSupported = utils_default.isFunction(import_zlib.default.createBrotliDecompress);
var { http: httpFollow, https: httpsFollow } = import_follow_redirects.default;
var isHttps = /https:?/;
var supportedProtocols = platform_default.protocols.map((protocol) => {
  return protocol + ":";
});
function dispatchBeforeRedirect(options) {
  if (options.beforeRedirects.proxy) {
    options.beforeRedirects.proxy(options);
  }
  if (options.beforeRedirects.config) {
    options.beforeRedirects.config(options);
  }
}
function setProxy(options, configProxy, location) {
  let proxy = configProxy;
  if (!proxy && proxy !== false) {
    const proxyUrl = (0, import_proxy_from_env.getProxyForUrl)(location);
    if (proxyUrl) {
      proxy = new URL(proxyUrl);
    }
  }
  if (proxy) {
    if (proxy.username) {
      proxy.auth = (proxy.username || "") + ":" + (proxy.password || "");
    }
    if (proxy.auth) {
      if (proxy.auth.username || proxy.auth.password) {
        proxy.auth = (proxy.auth.username || "") + ":" + (proxy.auth.password || "");
      }
      const base64 = Buffer.from(proxy.auth, "utf8").toString("base64");
      options.headers["Proxy-Authorization"] = "Basic " + base64;
    }
    options.headers.host = options.hostname + (options.port ? ":" + options.port : "");
    const proxyHost = proxy.hostname || proxy.host;
    options.hostname = proxyHost;
    options.host = proxyHost;
    options.port = proxy.port;
    options.path = location;
    if (proxy.protocol) {
      options.protocol = proxy.protocol.includes(":") ? proxy.protocol : `${proxy.protocol}:`;
    }
  }
  options.beforeRedirects.proxy = function beforeRedirect(redirectOptions) {
    setProxy(redirectOptions, configProxy, redirectOptions.href);
  };
}
var isHttpAdapterSupported = typeof process !== "undefined" && utils_default.kindOf(process) === "process";
var wrapAsync = (asyncExecutor) => {
  return new Promise((resolve, reject) => {
    let onDone;
    let isDone;
    const done = (value, isRejected) => {
      if (isDone)
        return;
      isDone = true;
      onDone && onDone(value, isRejected);
    };
    const _resolve = (value) => {
      done(value);
      resolve(value);
    };
    const _reject = (reason) => {
      done(reason, true);
      reject(reason);
    };
    asyncExecutor(_resolve, _reject, (onDoneHandler) => onDone = onDoneHandler).catch(_reject);
  });
};
var resolveFamily = ({ address, family }) => {
  if (!utils_default.isString(address)) {
    throw TypeError("address must be a string");
  }
  return {
    address,
    family: family || (address.indexOf(".") < 0 ? 6 : 4)
  };
};
var buildAddressEntry = (address, family) => resolveFamily(utils_default.isObject(address) ? address : { address, family });
var http_default = isHttpAdapterSupported && function httpAdapter(config8) {
  return wrapAsync(async function dispatchHttpRequest(resolve, reject, onDone) {
    let { data, lookup, family } = config8;
    const { responseType, responseEncoding } = config8;
    const method = config8.method.toUpperCase();
    let isDone;
    let rejected = false;
    let req;
    if (lookup) {
      const _lookup = callbackify_default(lookup, (value) => utils_default.isArray(value) ? value : [value]);
      lookup = (hostname, opt, cb) => {
        _lookup(hostname, opt, (err, arg0, arg1) => {
          if (err) {
            return cb(err);
          }
          const addresses = utils_default.isArray(arg0) ? arg0.map((addr) => buildAddressEntry(addr)) : [buildAddressEntry(arg0, arg1)];
          opt.all ? cb(err, addresses) : cb(err, addresses[0].address, addresses[0].family);
        });
      };
    }
    const emitter = new import_events.default();
    const onFinished = () => {
      if (config8.cancelToken) {
        config8.cancelToken.unsubscribe(abort);
      }
      if (config8.signal) {
        config8.signal.removeEventListener("abort", abort);
      }
      emitter.removeAllListeners();
    };
    onDone((value, isRejected) => {
      isDone = true;
      if (isRejected) {
        rejected = true;
        onFinished();
      }
    });
    function abort(reason) {
      emitter.emit("abort", !reason || reason.type ? new CanceledError_default(null, config8, req) : reason);
    }
    emitter.once("abort", reject);
    if (config8.cancelToken || config8.signal) {
      config8.cancelToken && config8.cancelToken.subscribe(abort);
      if (config8.signal) {
        config8.signal.aborted ? abort() : config8.signal.addEventListener("abort", abort);
      }
    }
    const fullPath = buildFullPath(config8.baseURL, config8.url);
    const parsed = new URL(fullPath, "http://localhost");
    const protocol = parsed.protocol || supportedProtocols[0];
    if (protocol === "data:") {
      let convertedData;
      if (method !== "GET") {
        return settle(resolve, reject, {
          status: 405,
          statusText: "method not allowed",
          headers: {},
          config: config8
        });
      }
      try {
        convertedData = fromDataURI(config8.url, responseType === "blob", {
          Blob: config8.env && config8.env.Blob
        });
      } catch (err) {
        throw AxiosError_default.from(err, AxiosError_default.ERR_BAD_REQUEST, config8);
      }
      if (responseType === "text") {
        convertedData = convertedData.toString(responseEncoding);
        if (!responseEncoding || responseEncoding === "utf8") {
          convertedData = utils_default.stripBOM(convertedData);
        }
      } else if (responseType === "stream") {
        convertedData = import_stream5.default.Readable.from(convertedData);
      }
      return settle(resolve, reject, {
        data: convertedData,
        status: 200,
        statusText: "OK",
        headers: new AxiosHeaders_default(),
        config: config8
      });
    }
    if (supportedProtocols.indexOf(protocol) === -1) {
      return reject(new AxiosError_default(
        "Unsupported protocol " + protocol,
        AxiosError_default.ERR_BAD_REQUEST,
        config8
      ));
    }
    const headers = AxiosHeaders_default.from(config8.headers).normalize();
    headers.set("User-Agent", "axios/" + VERSION, false);
    const onDownloadProgress = config8.onDownloadProgress;
    const onUploadProgress = config8.onUploadProgress;
    const maxRate = config8.maxRate;
    let maxUploadRate = void 0;
    let maxDownloadRate = void 0;
    if (utils_default.isSpecCompliantForm(data)) {
      const userBoundary = headers.getContentType(/boundary=([-_\w\d]{10,70})/i);
      data = formDataToStream_default(data, (formHeaders) => {
        headers.set(formHeaders);
      }, {
        tag: `axios-${VERSION}-boundary`,
        boundary: userBoundary && userBoundary[1] || void 0
      });
    } else if (utils_default.isFormData(data) && utils_default.isFunction(data.getHeaders)) {
      headers.set(data.getHeaders());
      if (!headers.hasContentLength()) {
        try {
          const knownLength = await import_util2.default.promisify(data.getLength).call(data);
          Number.isFinite(knownLength) && knownLength >= 0 && headers.setContentLength(knownLength);
        } catch (e2) {
        }
      }
    } else if (utils_default.isBlob(data)) {
      data.size && headers.setContentType(data.type || "application/octet-stream");
      headers.setContentLength(data.size || 0);
      data = import_stream5.default.Readable.from(readBlob_default(data));
    } else if (data && !utils_default.isStream(data)) {
      if (Buffer.isBuffer(data)) {
      } else if (utils_default.isArrayBuffer(data)) {
        data = Buffer.from(new Uint8Array(data));
      } else if (utils_default.isString(data)) {
        data = Buffer.from(data, "utf-8");
      } else {
        return reject(new AxiosError_default(
          "Data after transformation must be a string, an ArrayBuffer, a Buffer, or a Stream",
          AxiosError_default.ERR_BAD_REQUEST,
          config8
        ));
      }
      headers.setContentLength(data.length, false);
      if (config8.maxBodyLength > -1 && data.length > config8.maxBodyLength) {
        return reject(new AxiosError_default(
          "Request body larger than maxBodyLength limit",
          AxiosError_default.ERR_BAD_REQUEST,
          config8
        ));
      }
    }
    const contentLength = utils_default.toFiniteNumber(headers.getContentLength());
    if (utils_default.isArray(maxRate)) {
      maxUploadRate = maxRate[0];
      maxDownloadRate = maxRate[1];
    } else {
      maxUploadRate = maxDownloadRate = maxRate;
    }
    if (data && (onUploadProgress || maxUploadRate)) {
      if (!utils_default.isStream(data)) {
        data = import_stream5.default.Readable.from(data, { objectMode: false });
      }
      data = import_stream5.default.pipeline([data, new AxiosTransformStream_default({
        length: contentLength,
        maxRate: utils_default.toFiniteNumber(maxUploadRate)
      })], utils_default.noop);
      onUploadProgress && data.on("progress", (progress) => {
        onUploadProgress(Object.assign(progress, {
          upload: true
        }));
      });
    }
    let auth = void 0;
    if (config8.auth) {
      const username = config8.auth.username || "";
      const password = config8.auth.password || "";
      auth = username + ":" + password;
    }
    if (!auth && parsed.username) {
      const urlUsername = parsed.username;
      const urlPassword = parsed.password;
      auth = urlUsername + ":" + urlPassword;
    }
    auth && headers.delete("authorization");
    let path5;
    try {
      path5 = buildURL(
        parsed.pathname + parsed.search,
        config8.params,
        config8.paramsSerializer
      ).replace(/^\?/, "");
    } catch (err) {
      const customErr = new Error(err.message);
      customErr.config = config8;
      customErr.url = config8.url;
      customErr.exists = true;
      return reject(customErr);
    }
    headers.set(
      "Accept-Encoding",
      "gzip, compress, deflate" + (isBrotliSupported ? ", br" : ""),
      false
    );
    const options = {
      path: path5,
      method,
      headers: headers.toJSON(),
      agents: { http: config8.httpAgent, https: config8.httpsAgent },
      auth,
      protocol,
      family,
      beforeRedirect: dispatchBeforeRedirect,
      beforeRedirects: {}
    };
    !utils_default.isUndefined(lookup) && (options.lookup = lookup);
    if (config8.socketPath) {
      options.socketPath = config8.socketPath;
    } else {
      options.hostname = parsed.hostname;
      options.port = parsed.port;
      setProxy(options, config8.proxy, protocol + "//" + parsed.hostname + (parsed.port ? ":" + parsed.port : "") + options.path);
    }
    let transport;
    const isHttpsRequest = isHttps.test(options.protocol);
    options.agent = isHttpsRequest ? config8.httpsAgent : config8.httpAgent;
    if (config8.transport) {
      transport = config8.transport;
    } else if (config8.maxRedirects === 0) {
      transport = isHttpsRequest ? import_https.default : import_http.default;
    } else {
      if (config8.maxRedirects) {
        options.maxRedirects = config8.maxRedirects;
      }
      if (config8.beforeRedirect) {
        options.beforeRedirects.config = config8.beforeRedirect;
      }
      transport = isHttpsRequest ? httpsFollow : httpFollow;
    }
    if (config8.maxBodyLength > -1) {
      options.maxBodyLength = config8.maxBodyLength;
    } else {
      options.maxBodyLength = Infinity;
    }
    if (config8.insecureHTTPParser) {
      options.insecureHTTPParser = config8.insecureHTTPParser;
    }
    req = transport.request(options, function handleResponse(res) {
      if (req.destroyed)
        return;
      const streams = [res];
      const responseLength = +res.headers["content-length"];
      if (onDownloadProgress) {
        const transformStream = new AxiosTransformStream_default({
          length: utils_default.toFiniteNumber(responseLength),
          maxRate: utils_default.toFiniteNumber(maxDownloadRate)
        });
        onDownloadProgress && transformStream.on("progress", (progress) => {
          onDownloadProgress(Object.assign(progress, {
            download: true
          }));
        });
        streams.push(transformStream);
      }
      let responseStream = res;
      const lastRequest = res.req || req;
      if (config8.decompress !== false && res.headers["content-encoding"]) {
        if (method === "HEAD" || res.statusCode === 204) {
          delete res.headers["content-encoding"];
        }
        switch ((res.headers["content-encoding"] || "").toLowerCase()) {
          case "gzip":
          case "x-gzip":
          case "compress":
          case "x-compress":
            streams.push(import_zlib.default.createUnzip(zlibOptions));
            delete res.headers["content-encoding"];
            break;
          case "deflate":
            streams.push(new ZlibHeaderTransformStream_default());
            streams.push(import_zlib.default.createUnzip(zlibOptions));
            delete res.headers["content-encoding"];
            break;
          case "br":
            if (isBrotliSupported) {
              streams.push(import_zlib.default.createBrotliDecompress(brotliOptions));
              delete res.headers["content-encoding"];
            }
        }
      }
      responseStream = streams.length > 1 ? import_stream5.default.pipeline(streams, utils_default.noop) : streams[0];
      const offListeners = import_stream5.default.finished(responseStream, () => {
        offListeners();
        onFinished();
      });
      const response = {
        status: res.statusCode,
        statusText: res.statusMessage,
        headers: new AxiosHeaders_default(res.headers),
        config: config8,
        request: lastRequest
      };
      if (responseType === "stream") {
        response.data = responseStream;
        settle(resolve, reject, response);
      } else {
        const responseBuffer = [];
        let totalResponseBytes = 0;
        responseStream.on("data", function handleStreamData(chunk) {
          responseBuffer.push(chunk);
          totalResponseBytes += chunk.length;
          if (config8.maxContentLength > -1 && totalResponseBytes > config8.maxContentLength) {
            rejected = true;
            responseStream.destroy();
            reject(new AxiosError_default(
              "maxContentLength size of " + config8.maxContentLength + " exceeded",
              AxiosError_default.ERR_BAD_RESPONSE,
              config8,
              lastRequest
            ));
          }
        });
        responseStream.on("aborted", function handlerStreamAborted() {
          if (rejected) {
            return;
          }
          const err = new AxiosError_default(
            "maxContentLength size of " + config8.maxContentLength + " exceeded",
            AxiosError_default.ERR_BAD_RESPONSE,
            config8,
            lastRequest
          );
          responseStream.destroy(err);
          reject(err);
        });
        responseStream.on("error", function handleStreamError(err) {
          if (req.destroyed)
            return;
          reject(AxiosError_default.from(err, null, config8, lastRequest));
        });
        responseStream.on("end", function handleStreamEnd() {
          try {
            let responseData = responseBuffer.length === 1 ? responseBuffer[0] : Buffer.concat(responseBuffer);
            if (responseType !== "arraybuffer") {
              responseData = responseData.toString(responseEncoding);
              if (!responseEncoding || responseEncoding === "utf8") {
                responseData = utils_default.stripBOM(responseData);
              }
            }
            response.data = responseData;
          } catch (err) {
            return reject(AxiosError_default.from(err, null, config8, response.request, response));
          }
          settle(resolve, reject, response);
        });
      }
      emitter.once("abort", (err) => {
        if (!responseStream.destroyed) {
          responseStream.emit("error", err);
          responseStream.destroy();
        }
      });
    });
    emitter.once("abort", (err) => {
      reject(err);
      req.destroy(err);
    });
    req.on("error", function handleRequestError(err) {
      reject(AxiosError_default.from(err, null, config8, req));
    });
    req.on("socket", function handleRequestSocket(socket) {
      socket.setKeepAlive(true, 1e3 * 60);
    });
    if (config8.timeout) {
      const timeout = parseInt(config8.timeout, 10);
      if (Number.isNaN(timeout)) {
        reject(new AxiosError_default(
          "error trying to parse `config.timeout` to int",
          AxiosError_default.ERR_BAD_OPTION_VALUE,
          config8,
          req
        ));
        return;
      }
      req.setTimeout(timeout, function handleRequestTimeout() {
        if (isDone)
          return;
        let timeoutErrorMessage = config8.timeout ? "timeout of " + config8.timeout + "ms exceeded" : "timeout exceeded";
        const transitional2 = config8.transitional || transitional_default;
        if (config8.timeoutErrorMessage) {
          timeoutErrorMessage = config8.timeoutErrorMessage;
        }
        reject(new AxiosError_default(
          timeoutErrorMessage,
          transitional2.clarifyTimeoutError ? AxiosError_default.ETIMEDOUT : AxiosError_default.ECONNABORTED,
          config8,
          req
        ));
        abort();
      });
    }
    if (utils_default.isStream(data)) {
      let ended = false;
      let errored = false;
      data.on("end", () => {
        ended = true;
      });
      data.once("error", (err) => {
        errored = true;
        req.destroy(err);
      });
      data.on("close", () => {
        if (!ended && !errored) {
          abort(new CanceledError_default("Request stream has been aborted", config8, req));
        }
      });
      data.pipe(req);
    } else {
      req.end(data);
    }
  });
};

// node_modules/axios/lib/helpers/cookies.js
var cookies_default = platform_default.hasStandardBrowserEnv ? {
  write(name, value, expires, path5, domain, secure) {
    const cookie = [name + "=" + encodeURIComponent(value)];
    utils_default.isNumber(expires) && cookie.push("expires=" + new Date(expires).toGMTString());
    utils_default.isString(path5) && cookie.push("path=" + path5);
    utils_default.isString(domain) && cookie.push("domain=" + domain);
    secure === true && cookie.push("secure");
    document.cookie = cookie.join("; ");
  },
  read(name) {
    const match = document.cookie.match(new RegExp("(^|;\\s*)(" + name + ")=([^;]*)"));
    return match ? decodeURIComponent(match[3]) : null;
  },
  remove(name) {
    this.write(name, "", Date.now() - 864e5);
  }
} : {
  write() {
  },
  read() {
    return null;
  },
  remove() {
  }
};

// node_modules/axios/lib/helpers/isURLSameOrigin.js
var isURLSameOrigin_default = platform_default.hasStandardBrowserEnv ? function standardBrowserEnv() {
  const msie = /(msie|trident)/i.test(navigator.userAgent);
  const urlParsingNode = document.createElement("a");
  let originURL;
  function resolveURL(url3) {
    let href = url3;
    if (msie) {
      urlParsingNode.setAttribute("href", href);
      href = urlParsingNode.href;
    }
    urlParsingNode.setAttribute("href", href);
    return {
      href: urlParsingNode.href,
      protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, "") : "",
      host: urlParsingNode.host,
      search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, "") : "",
      hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, "") : "",
      hostname: urlParsingNode.hostname,
      port: urlParsingNode.port,
      pathname: urlParsingNode.pathname.charAt(0) === "/" ? urlParsingNode.pathname : "/" + urlParsingNode.pathname
    };
  }
  originURL = resolveURL(window.location.href);
  return function isURLSameOrigin(requestURL) {
    const parsed = utils_default.isString(requestURL) ? resolveURL(requestURL) : requestURL;
    return parsed.protocol === originURL.protocol && parsed.host === originURL.host;
  };
}() : function nonStandardBrowserEnv() {
  return function isURLSameOrigin() {
    return true;
  };
}();

// node_modules/axios/lib/adapters/xhr.js
function progressEventReducer(listener, isDownloadStream) {
  let bytesNotified = 0;
  const _speedometer = speedometer_default(50, 250);
  return (e2) => {
    const loaded = e2.loaded;
    const total = e2.lengthComputable ? e2.total : void 0;
    const progressBytes = loaded - bytesNotified;
    const rate = _speedometer(progressBytes);
    const inRange = loaded <= total;
    bytesNotified = loaded;
    const data = {
      loaded,
      total,
      progress: total ? loaded / total : void 0,
      bytes: progressBytes,
      rate: rate ? rate : void 0,
      estimated: rate && total && inRange ? (total - loaded) / rate : void 0,
      event: e2
    };
    data[isDownloadStream ? "download" : "upload"] = true;
    listener(data);
  };
}
var isXHRAdapterSupported = typeof XMLHttpRequest !== "undefined";
var xhr_default = isXHRAdapterSupported && function(config8) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    let requestData = config8.data;
    const requestHeaders = AxiosHeaders_default.from(config8.headers).normalize();
    let { responseType, withXSRFToken } = config8;
    let onCanceled;
    function done() {
      if (config8.cancelToken) {
        config8.cancelToken.unsubscribe(onCanceled);
      }
      if (config8.signal) {
        config8.signal.removeEventListener("abort", onCanceled);
      }
    }
    let contentType;
    if (utils_default.isFormData(requestData)) {
      if (platform_default.hasStandardBrowserEnv || platform_default.hasStandardBrowserWebWorkerEnv) {
        requestHeaders.setContentType(false);
      } else if ((contentType = requestHeaders.getContentType()) !== false) {
        const [type, ...tokens] = contentType ? contentType.split(";").map((token) => token.trim()).filter(Boolean) : [];
        requestHeaders.setContentType([type || "multipart/form-data", ...tokens].join("; "));
      }
    }
    let request = new XMLHttpRequest();
    if (config8.auth) {
      const username = config8.auth.username || "";
      const password = config8.auth.password ? unescape(encodeURIComponent(config8.auth.password)) : "";
      requestHeaders.set("Authorization", "Basic " + btoa(username + ":" + password));
    }
    const fullPath = buildFullPath(config8.baseURL, config8.url);
    request.open(config8.method.toUpperCase(), buildURL(fullPath, config8.params, config8.paramsSerializer), true);
    request.timeout = config8.timeout;
    function onloadend() {
      if (!request) {
        return;
      }
      const responseHeaders = AxiosHeaders_default.from(
        "getAllResponseHeaders" in request && request.getAllResponseHeaders()
      );
      const responseData = !responseType || responseType === "text" || responseType === "json" ? request.responseText : request.response;
      const response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config8,
        request
      };
      settle(function _resolve(value) {
        resolve(value);
        done();
      }, function _reject(err) {
        reject(err);
        done();
      }, response);
      request = null;
    }
    if ("onloadend" in request) {
      request.onloadend = onloadend;
    } else {
      request.onreadystatechange = function handleLoad() {
        if (!request || request.readyState !== 4) {
          return;
        }
        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf("file:") === 0)) {
          return;
        }
        setTimeout(onloadend);
      };
    }
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }
      reject(new AxiosError_default("Request aborted", AxiosError_default.ECONNABORTED, config8, request));
      request = null;
    };
    request.onerror = function handleError() {
      reject(new AxiosError_default("Network Error", AxiosError_default.ERR_NETWORK, config8, request));
      request = null;
    };
    request.ontimeout = function handleTimeout() {
      let timeoutErrorMessage = config8.timeout ? "timeout of " + config8.timeout + "ms exceeded" : "timeout exceeded";
      const transitional2 = config8.transitional || transitional_default;
      if (config8.timeoutErrorMessage) {
        timeoutErrorMessage = config8.timeoutErrorMessage;
      }
      reject(new AxiosError_default(
        timeoutErrorMessage,
        transitional2.clarifyTimeoutError ? AxiosError_default.ETIMEDOUT : AxiosError_default.ECONNABORTED,
        config8,
        request
      ));
      request = null;
    };
    if (platform_default.hasStandardBrowserEnv) {
      withXSRFToken && utils_default.isFunction(withXSRFToken) && (withXSRFToken = withXSRFToken(config8));
      if (withXSRFToken || withXSRFToken !== false && isURLSameOrigin_default(fullPath)) {
        const xsrfValue = config8.xsrfHeaderName && config8.xsrfCookieName && cookies_default.read(config8.xsrfCookieName);
        if (xsrfValue) {
          requestHeaders.set(config8.xsrfHeaderName, xsrfValue);
        }
      }
    }
    requestData === void 0 && requestHeaders.setContentType(null);
    if ("setRequestHeader" in request) {
      utils_default.forEach(requestHeaders.toJSON(), function setRequestHeader(val, key) {
        request.setRequestHeader(key, val);
      });
    }
    if (!utils_default.isUndefined(config8.withCredentials)) {
      request.withCredentials = !!config8.withCredentials;
    }
    if (responseType && responseType !== "json") {
      request.responseType = config8.responseType;
    }
    if (typeof config8.onDownloadProgress === "function") {
      request.addEventListener("progress", progressEventReducer(config8.onDownloadProgress, true));
    }
    if (typeof config8.onUploadProgress === "function" && request.upload) {
      request.upload.addEventListener("progress", progressEventReducer(config8.onUploadProgress));
    }
    if (config8.cancelToken || config8.signal) {
      onCanceled = (cancel) => {
        if (!request) {
          return;
        }
        reject(!cancel || cancel.type ? new CanceledError_default(null, config8, request) : cancel);
        request.abort();
        request = null;
      };
      config8.cancelToken && config8.cancelToken.subscribe(onCanceled);
      if (config8.signal) {
        config8.signal.aborted ? onCanceled() : config8.signal.addEventListener("abort", onCanceled);
      }
    }
    const protocol = parseProtocol(fullPath);
    if (protocol && platform_default.protocols.indexOf(protocol) === -1) {
      reject(new AxiosError_default("Unsupported protocol " + protocol + ":", AxiosError_default.ERR_BAD_REQUEST, config8));
      return;
    }
    request.send(requestData || null);
  });
};

// node_modules/axios/lib/adapters/adapters.js
var knownAdapters = {
  http: http_default,
  xhr: xhr_default
};
utils_default.forEach(knownAdapters, (fn, value) => {
  if (fn) {
    try {
      Object.defineProperty(fn, "name", { value });
    } catch (e2) {
    }
    Object.defineProperty(fn, "adapterName", { value });
  }
});
var renderReason = (reason) => `- ${reason}`;
var isResolvedHandle = (adapter) => utils_default.isFunction(adapter) || adapter === null || adapter === false;
var adapters_default = {
  getAdapter: (adapters) => {
    adapters = utils_default.isArray(adapters) ? adapters : [adapters];
    const { length } = adapters;
    let nameOrAdapter;
    let adapter;
    const rejectedReasons = {};
    for (let i2 = 0; i2 < length; i2++) {
      nameOrAdapter = adapters[i2];
      let id;
      adapter = nameOrAdapter;
      if (!isResolvedHandle(nameOrAdapter)) {
        adapter = knownAdapters[(id = String(nameOrAdapter)).toLowerCase()];
        if (adapter === void 0) {
          throw new AxiosError_default(`Unknown adapter '${id}'`);
        }
      }
      if (adapter) {
        break;
      }
      rejectedReasons[id || "#" + i2] = adapter;
    }
    if (!adapter) {
      const reasons = Object.entries(rejectedReasons).map(
        ([id, state]) => `adapter ${id} ` + (state === false ? "is not supported by the environment" : "is not available in the build")
      );
      let s = length ? reasons.length > 1 ? "since :\n" + reasons.map(renderReason).join("\n") : " " + renderReason(reasons[0]) : "as no adapter specified";
      throw new AxiosError_default(
        `There is no suitable adapter to dispatch the request ` + s,
        "ERR_NOT_SUPPORT"
      );
    }
    return adapter;
  },
  adapters: knownAdapters
};

// node_modules/axios/lib/core/dispatchRequest.js
function throwIfCancellationRequested(config8) {
  if (config8.cancelToken) {
    config8.cancelToken.throwIfRequested();
  }
  if (config8.signal && config8.signal.aborted) {
    throw new CanceledError_default(null, config8);
  }
}
function dispatchRequest(config8) {
  throwIfCancellationRequested(config8);
  config8.headers = AxiosHeaders_default.from(config8.headers);
  config8.data = transformData.call(
    config8,
    config8.transformRequest
  );
  if (["post", "put", "patch"].indexOf(config8.method) !== -1) {
    config8.headers.setContentType("application/x-www-form-urlencoded", false);
  }
  const adapter = adapters_default.getAdapter(config8.adapter || defaults_default.adapter);
  return adapter(config8).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config8);
    response.data = transformData.call(
      config8,
      config8.transformResponse,
      response
    );
    response.headers = AxiosHeaders_default.from(response.headers);
    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config8);
      if (reason && reason.response) {
        reason.response.data = transformData.call(
          config8,
          config8.transformResponse,
          reason.response
        );
        reason.response.headers = AxiosHeaders_default.from(reason.response.headers);
      }
    }
    return Promise.reject(reason);
  });
}

// node_modules/axios/lib/core/mergeConfig.js
var headersToObject = (thing) => thing instanceof AxiosHeaders_default ? thing.toJSON() : thing;
function mergeConfig(config1, config22) {
  config22 = config22 || {};
  const config8 = {};
  function getMergedValue(target, source, caseless) {
    if (utils_default.isPlainObject(target) && utils_default.isPlainObject(source)) {
      return utils_default.merge.call({ caseless }, target, source);
    } else if (utils_default.isPlainObject(source)) {
      return utils_default.merge({}, source);
    } else if (utils_default.isArray(source)) {
      return source.slice();
    }
    return source;
  }
  function mergeDeepProperties(a2, b6, caseless) {
    if (!utils_default.isUndefined(b6)) {
      return getMergedValue(a2, b6, caseless);
    } else if (!utils_default.isUndefined(a2)) {
      return getMergedValue(void 0, a2, caseless);
    }
  }
  function valueFromConfig2(a2, b6) {
    if (!utils_default.isUndefined(b6)) {
      return getMergedValue(void 0, b6);
    }
  }
  function defaultToConfig2(a2, b6) {
    if (!utils_default.isUndefined(b6)) {
      return getMergedValue(void 0, b6);
    } else if (!utils_default.isUndefined(a2)) {
      return getMergedValue(void 0, a2);
    }
  }
  function mergeDirectKeys(a2, b6, prop) {
    if (prop in config22) {
      return getMergedValue(a2, b6);
    } else if (prop in config1) {
      return getMergedValue(void 0, a2);
    }
  }
  const mergeMap = {
    url: valueFromConfig2,
    method: valueFromConfig2,
    data: valueFromConfig2,
    baseURL: defaultToConfig2,
    transformRequest: defaultToConfig2,
    transformResponse: defaultToConfig2,
    paramsSerializer: defaultToConfig2,
    timeout: defaultToConfig2,
    timeoutMessage: defaultToConfig2,
    withCredentials: defaultToConfig2,
    withXSRFToken: defaultToConfig2,
    adapter: defaultToConfig2,
    responseType: defaultToConfig2,
    xsrfCookieName: defaultToConfig2,
    xsrfHeaderName: defaultToConfig2,
    onUploadProgress: defaultToConfig2,
    onDownloadProgress: defaultToConfig2,
    decompress: defaultToConfig2,
    maxContentLength: defaultToConfig2,
    maxBodyLength: defaultToConfig2,
    beforeRedirect: defaultToConfig2,
    transport: defaultToConfig2,
    httpAgent: defaultToConfig2,
    httpsAgent: defaultToConfig2,
    cancelToken: defaultToConfig2,
    socketPath: defaultToConfig2,
    responseEncoding: defaultToConfig2,
    validateStatus: mergeDirectKeys,
    headers: (a2, b6) => mergeDeepProperties(headersToObject(a2), headersToObject(b6), true)
  };
  utils_default.forEach(Object.keys(Object.assign({}, config1, config22)), function computeConfigValue(prop) {
    const merge2 = mergeMap[prop] || mergeDeepProperties;
    const configValue = merge2(config1[prop], config22[prop], prop);
    utils_default.isUndefined(configValue) && merge2 !== mergeDirectKeys || (config8[prop] = configValue);
  });
  return config8;
}

// node_modules/axios/lib/helpers/validator.js
var validators = {};
["object", "boolean", "number", "function", "string", "symbol"].forEach((type, i2) => {
  validators[type] = function validator(thing) {
    return typeof thing === type || "a" + (i2 < 1 ? "n " : " ") + type;
  };
});
var deprecatedWarnings = {};
validators.transitional = function transitional(validator, version, message) {
  function formatMessage(opt, desc) {
    return "[Axios v" + VERSION + "] Transitional option '" + opt + "'" + desc + (message ? ". " + message : "");
  }
  return (value, opt, opts) => {
    if (validator === false) {
      throw new AxiosError_default(
        formatMessage(opt, " has been removed" + (version ? " in " + version : "")),
        AxiosError_default.ERR_DEPRECATED
      );
    }
    if (version && !deprecatedWarnings[opt]) {
      deprecatedWarnings[opt] = true;
      console.warn(
        formatMessage(
          opt,
          " has been deprecated since v" + version + " and will be removed in the near future"
        )
      );
    }
    return validator ? validator(value, opt, opts) : true;
  };
};
function assertOptions(options, schema, allowUnknown) {
  if (typeof options !== "object") {
    throw new AxiosError_default("options must be an object", AxiosError_default.ERR_BAD_OPTION_VALUE);
  }
  const keys = Object.keys(options);
  let i2 = keys.length;
  while (i2-- > 0) {
    const opt = keys[i2];
    const validator = schema[opt];
    if (validator) {
      const value = options[opt];
      const result = value === void 0 || validator(value, opt, options);
      if (result !== true) {
        throw new AxiosError_default("option " + opt + " must be " + result, AxiosError_default.ERR_BAD_OPTION_VALUE);
      }
      continue;
    }
    if (allowUnknown !== true) {
      throw new AxiosError_default("Unknown option " + opt, AxiosError_default.ERR_BAD_OPTION);
    }
  }
}
var validator_default = {
  assertOptions,
  validators
};

// node_modules/axios/lib/core/Axios.js
var validators2 = validator_default.validators;
var Axios = class {
  constructor(instanceConfig) {
    this.defaults = instanceConfig;
    this.interceptors = {
      request: new InterceptorManager_default(),
      response: new InterceptorManager_default()
    };
  }
  request(configOrUrl, config8) {
    if (typeof configOrUrl === "string") {
      config8 = config8 || {};
      config8.url = configOrUrl;
    } else {
      config8 = configOrUrl || {};
    }
    config8 = mergeConfig(this.defaults, config8);
    const { transitional: transitional2, paramsSerializer, headers } = config8;
    if (transitional2 !== void 0) {
      validator_default.assertOptions(transitional2, {
        silentJSONParsing: validators2.transitional(validators2.boolean),
        forcedJSONParsing: validators2.transitional(validators2.boolean),
        clarifyTimeoutError: validators2.transitional(validators2.boolean)
      }, false);
    }
    if (paramsSerializer != null) {
      if (utils_default.isFunction(paramsSerializer)) {
        config8.paramsSerializer = {
          serialize: paramsSerializer
        };
      } else {
        validator_default.assertOptions(paramsSerializer, {
          encode: validators2.function,
          serialize: validators2.function
        }, true);
      }
    }
    config8.method = (config8.method || this.defaults.method || "get").toLowerCase();
    let contextHeaders = headers && utils_default.merge(
      headers.common,
      headers[config8.method]
    );
    headers && utils_default.forEach(
      ["delete", "get", "head", "post", "put", "patch", "common"],
      (method) => {
        delete headers[method];
      }
    );
    config8.headers = AxiosHeaders_default.concat(contextHeaders, headers);
    const requestInterceptorChain = [];
    let synchronousRequestInterceptors = true;
    this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
      if (typeof interceptor.runWhen === "function" && interceptor.runWhen(config8) === false) {
        return;
      }
      synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;
      requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
    });
    const responseInterceptorChain = [];
    this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
      responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
    });
    let promise;
    let i2 = 0;
    let len;
    if (!synchronousRequestInterceptors) {
      const chain = [dispatchRequest.bind(this), void 0];
      chain.unshift.apply(chain, requestInterceptorChain);
      chain.push.apply(chain, responseInterceptorChain);
      len = chain.length;
      promise = Promise.resolve(config8);
      while (i2 < len) {
        promise = promise.then(chain[i2++], chain[i2++]);
      }
      return promise;
    }
    len = requestInterceptorChain.length;
    let newConfig = config8;
    i2 = 0;
    while (i2 < len) {
      const onFulfilled = requestInterceptorChain[i2++];
      const onRejected = requestInterceptorChain[i2++];
      try {
        newConfig = onFulfilled(newConfig);
      } catch (error) {
        onRejected.call(this, error);
        break;
      }
    }
    try {
      promise = dispatchRequest.call(this, newConfig);
    } catch (error) {
      return Promise.reject(error);
    }
    i2 = 0;
    len = responseInterceptorChain.length;
    while (i2 < len) {
      promise = promise.then(responseInterceptorChain[i2++], responseInterceptorChain[i2++]);
    }
    return promise;
  }
  getUri(config8) {
    config8 = mergeConfig(this.defaults, config8);
    const fullPath = buildFullPath(config8.baseURL, config8.url);
    return buildURL(fullPath, config8.params, config8.paramsSerializer);
  }
};
utils_default.forEach(["delete", "get", "head", "options"], function forEachMethodNoData(method) {
  Axios.prototype[method] = function(url3, config8) {
    return this.request(mergeConfig(config8 || {}, {
      method,
      url: url3,
      data: (config8 || {}).data
    }));
  };
});
utils_default.forEach(["post", "put", "patch"], function forEachMethodWithData(method) {
  function generateHTTPMethod(isForm) {
    return function httpMethod(url3, data, config8) {
      return this.request(mergeConfig(config8 || {}, {
        method,
        headers: isForm ? {
          "Content-Type": "multipart/form-data"
        } : {},
        url: url3,
        data
      }));
    };
  }
  Axios.prototype[method] = generateHTTPMethod();
  Axios.prototype[method + "Form"] = generateHTTPMethod(true);
});
var Axios_default = Axios;

// node_modules/axios/lib/cancel/CancelToken.js
var CancelToken = class {
  constructor(executor) {
    if (typeof executor !== "function") {
      throw new TypeError("executor must be a function.");
    }
    let resolvePromise;
    this.promise = new Promise(function promiseExecutor(resolve) {
      resolvePromise = resolve;
    });
    const token = this;
    this.promise.then((cancel) => {
      if (!token._listeners)
        return;
      let i2 = token._listeners.length;
      while (i2-- > 0) {
        token._listeners[i2](cancel);
      }
      token._listeners = null;
    });
    this.promise.then = (onfulfilled) => {
      let _resolve;
      const promise = new Promise((resolve) => {
        token.subscribe(resolve);
        _resolve = resolve;
      }).then(onfulfilled);
      promise.cancel = function reject() {
        token.unsubscribe(_resolve);
      };
      return promise;
    };
    executor(function cancel(message, config8, request) {
      if (token.reason) {
        return;
      }
      token.reason = new CanceledError_default(message, config8, request);
      resolvePromise(token.reason);
    });
  }
  throwIfRequested() {
    if (this.reason) {
      throw this.reason;
    }
  }
  subscribe(listener) {
    if (this.reason) {
      listener(this.reason);
      return;
    }
    if (this._listeners) {
      this._listeners.push(listener);
    } else {
      this._listeners = [listener];
    }
  }
  unsubscribe(listener) {
    if (!this._listeners) {
      return;
    }
    const index = this._listeners.indexOf(listener);
    if (index !== -1) {
      this._listeners.splice(index, 1);
    }
  }
  static source() {
    let cancel;
    const token = new CancelToken(function executor(c3) {
      cancel = c3;
    });
    return {
      token,
      cancel
    };
  }
};
var CancelToken_default = CancelToken;

// node_modules/axios/lib/helpers/spread.js
function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
}

// node_modules/axios/lib/helpers/isAxiosError.js
function isAxiosError(payload) {
  return utils_default.isObject(payload) && payload.isAxiosError === true;
}

// node_modules/axios/lib/helpers/HttpStatusCode.js
var HttpStatusCode = {
  Continue: 100,
  SwitchingProtocols: 101,
  Processing: 102,
  EarlyHints: 103,
  Ok: 200,
  Created: 201,
  Accepted: 202,
  NonAuthoritativeInformation: 203,
  NoContent: 204,
  ResetContent: 205,
  PartialContent: 206,
  MultiStatus: 207,
  AlreadyReported: 208,
  ImUsed: 226,
  MultipleChoices: 300,
  MovedPermanently: 301,
  Found: 302,
  SeeOther: 303,
  NotModified: 304,
  UseProxy: 305,
  Unused: 306,
  TemporaryRedirect: 307,
  PermanentRedirect: 308,
  BadRequest: 400,
  Unauthorized: 401,
  PaymentRequired: 402,
  Forbidden: 403,
  NotFound: 404,
  MethodNotAllowed: 405,
  NotAcceptable: 406,
  ProxyAuthenticationRequired: 407,
  RequestTimeout: 408,
  Conflict: 409,
  Gone: 410,
  LengthRequired: 411,
  PreconditionFailed: 412,
  PayloadTooLarge: 413,
  UriTooLong: 414,
  UnsupportedMediaType: 415,
  RangeNotSatisfiable: 416,
  ExpectationFailed: 417,
  ImATeapot: 418,
  MisdirectedRequest: 421,
  UnprocessableEntity: 422,
  Locked: 423,
  FailedDependency: 424,
  TooEarly: 425,
  UpgradeRequired: 426,
  PreconditionRequired: 428,
  TooManyRequests: 429,
  RequestHeaderFieldsTooLarge: 431,
  UnavailableForLegalReasons: 451,
  InternalServerError: 500,
  NotImplemented: 501,
  BadGateway: 502,
  ServiceUnavailable: 503,
  GatewayTimeout: 504,
  HttpVersionNotSupported: 505,
  VariantAlsoNegotiates: 506,
  InsufficientStorage: 507,
  LoopDetected: 508,
  NotExtended: 510,
  NetworkAuthenticationRequired: 511
};
Object.entries(HttpStatusCode).forEach(([key, value]) => {
  HttpStatusCode[value] = key;
});
var HttpStatusCode_default = HttpStatusCode;

// node_modules/axios/lib/axios.js
function createInstance(defaultConfig) {
  const context = new Axios_default(defaultConfig);
  const instance = bind(Axios_default.prototype.request, context);
  utils_default.extend(instance, Axios_default.prototype, context, { allOwnKeys: true });
  utils_default.extend(instance, context, null, { allOwnKeys: true });
  instance.create = function create(instanceConfig) {
    return createInstance(mergeConfig(defaultConfig, instanceConfig));
  };
  return instance;
}
var axios = createInstance(defaults_default);
axios.Axios = Axios_default;
axios.CanceledError = CanceledError_default;
axios.CancelToken = CancelToken_default;
axios.isCancel = isCancel;
axios.VERSION = VERSION;
axios.toFormData = toFormData_default;
axios.AxiosError = AxiosError_default;
axios.Cancel = axios.CanceledError;
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = spread;
axios.isAxiosError = isAxiosError;
axios.mergeConfig = mergeConfig;
axios.AxiosHeaders = AxiosHeaders_default;
axios.formToJSON = (thing) => formDataToJSON_default(utils_default.isHTMLForm(thing) ? new FormData(thing) : thing);
axios.getAdapter = adapters_default.getAdapter;
axios.HttpStatusCode = HttpStatusCode_default;
axios.default = axios;
var axios_default = axios;

// node_modules/axios/index.js
var {
  Axios: Axios2,
  AxiosError: AxiosError2,
  CanceledError: CanceledError2,
  isCancel: isCancel2,
  CancelToken: CancelToken2,
  VERSION: VERSION2,
  all: all2,
  Cancel,
  isAxiosError: isAxiosError2,
  spread: spread2,
  toFormData: toFormData2,
  AxiosHeaders: AxiosHeaders2,
  HttpStatusCode: HttpStatusCode2,
  formToJSON,
  getAdapter,
  mergeConfig: mergeConfig2
} = axios_default;

// src/api.ts
var import_openai = __toESM(require_dist(), 1);

// src/commands/config.ts
var dotenv = __toESM(require_main(), 1);
var import_fs = require("fs");
var import_ini = __toESM(require_ini(), 1);
var import_os = require("os");
var import_path = require("path");

// src/i18n/cs.json
var cs_default = {
  localLanguage: "\u010Desky",
  commitFix: "fix(server.ts): zlep\u0161en\xED velikosti prom\u011Bnn\xE9 port na velk\xE1 p\xEDsmena PORT",
  commitFeat: "feat(server.ts): p\u0159id\xE1n\xED podpory pro prom\u011Bnnou prost\u0159ed\xED process.env.PORT",
  commitDescription: "Prom\u011Bnn\xE1 port se nyn\xED jmenuje PORT, co\u017E odpov\xEDd\xE1 konvenci pojmenov\xE1n\xED, proto\u017Ee PORT je konstanta. Podpora prom\u011Bnn\xE9 prost\u0159ed\xED process.env.PORT umo\u017E\u0148uje snadn\u011Bj\u0161\xED spr\xE1vu nastaven\xED p\u0159i spu\u0161t\u011Bn\xED."
};

// src/i18n/de.json
var de_default = {
  localLanguage: "Deutsch",
  commitFix: "fix(server.ts): \xC4ndere die Gro\xDF- und Kleinschreibung der Port-Variable von Kleinbuchstaben auf Gro\xDFbuchstaben PORT.",
  commitFeat: "Funktion(server.ts): Unterst\xFCtzung f\xFCr die Umgebungsvariable process.env.PORT hinzuf\xFCgen",
  commitDescription: "Die Port-Variable hei\xDFt jetzt PORT, was die Konsistenz mit den Namenskonventionen verbessert, da PORT eine Konstante ist. Die Unterst\xFCtzung f\xFCr eine Umgebungsvariable erm\xF6glicht es der Anwendung, flexibler zu sein, da sie jetzt auf jedem verf\xFCgbaren Port laufen kann, der \xFCber die Umgebungsvariable process.env.PORT angegeben wird."
};

// src/i18n/en.json
var en_default = {
  localLanguage: "english",
  commitFix: "fix(server.ts): change port variable case from lowercase port to uppercase PORT to improve semantics",
  commitFeat: "feat(server.ts): add support for process.env.PORT environment variable to be able to run app on a configurable port",
  commitDescription: "The port variable is now named PORT, which improves consistency with the naming conventions as PORT is a constant. Support for an environment variable allows the application to be more flexible as it can now run on any available port specified via the process.env.PORT environment variable."
};

// src/i18n/es_ES.json
var es_ES_default = {
  localLanguage: "spanish",
  commitFix: "fix(server.ts): cambiar la variable port de min\xFAsculas a may\xFAsculas PORT",
  commitFeat: "feat(server.ts): a\xF1adir soporte para la variable de entorno process.env.PORT",
  commitDescription: "La variable port ahora se llama PORT, lo que mejora la coherencia con las convenciones de nomenclatura, ya que PORT es una constante. El soporte para una variable de entorno permite que la aplicaci\xF3n sea m\xE1s flexible, ya que ahora puede ejecutarse en cualquier puerto disponible especificado a trav\xE9s de la variable de entorno process.env.PORT."
};

// src/i18n/fr.json
var fr_default = {
  localLanguage: "fran\xE7aise",
  commitFix: "corriger(server.ts) : changer la casse de la variable de port de minuscules \xE0 majuscules (PORT)",
  commitFeat: "fonctionnalit\xE9(server.ts) : ajouter la prise en charge de la variable d'environnement process.env.PORT",
  commitDescription: "La variable de port est maintenant nomm\xE9e PORT, ce qui am\xE9liore la coh\xE9rence avec les conventions de nommage car PORT est une constante. La prise en charge d'une variable d'environnement permet \xE0 l'application d'\xEAtre plus flexible car elle peut maintenant s'ex\xE9cuter sur n'importe quel port disponible sp\xE9cifi\xE9 via la variable d'environnement process.env.PORT."
};

// src/i18n/id_ID.json
var id_ID_default = {
  localLanguage: "bahasa",
  commitFix: "fix(server.ts): mengubah huruf port variable dari huruf kecil ke huruf besar PORT",
  commitFeat: "feat(server.ts): menambahkan support di process.env.PORT environment variabel",
  commitDescription: "Port variabel bernama PORT, yang membantu konsistensi dengan memberi nama yaitu PORT yang konstan. Bantuan environment variabel membantu aplikasi lebih fleksibel, dan dapat di jalankan di port manapun yang tertulis pada process.env.PORT"
};

// src/i18n/it.json
var it_default = {
  localLanguage: "italiano",
  commitFix: "fix(server.ts): cambia la grafia della variabile della porta dal minuscolo port al maiuscolo PORT",
  commitFeat: "feat(server.ts): aggiunge il supporto per la variabile di ambiente process.env.PORT",
  commitDescription: "La variabile port \xE8 ora chiamata PORT, migliorando la coerenza con le convenzioni di denominazione in quanto PORT \xE8 una costante. Il supporto per una variabile di ambiente consente all'applicazione di essere pi\xF9 flessibile poich\xE9 ora pu\xF2 essere eseguita su qualsiasi porta disponibile specificata tramite la variabile di ambiente process.env.PORT."
};

// src/i18n/ja.json
var ja_default = {
  localLanguage: "\u65E5\u672C\u8A9E",
  commitFix: "\u4FEE\u6B63(server.ts): \u30DD\u30FC\u30C8\u5909\u6570\u3092\u5C0F\u6587\u5B57\u306Eport\u304B\u3089\u5927\u6587\u5B57\u306EPORT\u306B\u5909\u66F4",
  commitFeat: "\u65B0\u6A5F\u80FD(server.ts): \u74B0\u5883\u5909\u6570process.env.PORT\u306E\u30B5\u30DD\u30FC\u30C8\u3092\u8FFD\u52A0",
  commitDescription: "\u30DD\u30FC\u30C8\u5909\u6570\u306F\u73FE\u5728PORT\u3068\u3044\u3046\u540D\u524D\u306B\u306A\u308A\u3001\u5B9A\u6570\u3067\u3042\u308BPORT\u3092\u4F7F\u3046\u3053\u3068\u3067\u547D\u540D\u898F\u5247\u306B\u4E00\u8CAB\u6027\u304C\u751F\u307E\u308C\u307E\u3057\u305F\u3002\u74B0\u5883\u5909\u6570\u3092\u30B5\u30DD\u30FC\u30C8\u3059\u308B\u3053\u3068\u3067\u3001\u74B0\u5883\u5909\u6570process.env.PORT\u3067\u6307\u5B9A\u3055\u308C\u305F\u4EFB\u610F\u306E\u5229\u7528\u53EF\u80FD\u306A\u30DD\u30FC\u30C8\u3067\u5B9F\u884C\u3067\u304D\u308B\u3088\u3046\u306B\u306A\u308A\u3001\u30A2\u30D7\u30EA\u30B1\u30FC\u30B7\u30E7\u30F3\u306F\u3088\u308A\u67D4\u8EDF\u306B\u306A\u308A\u307E\u3057\u305F\u3002"
};

// src/i18n/ko.json
var ko_default = {
  localLanguage: "\uD55C\uAD6D\uC5B4",
  commitFix: "fix(server.ts): \uD3EC\uD2B8 \uBCC0\uC218\uB97C \uC18C\uBB38\uC790 port\uC5D0\uC11C \uB300\uBB38\uC790 PORT\uB85C \uBCC0\uACBD",
  commitFeat: "\uD53C\uD2B8(server.ts): process.env.PORT \uD658\uACBD \uBCC0\uC218 \uC9C0\uC6D0 \uCD94\uAC00",
  commitDescription: "\uD3EC\uD2B8 \uBCC0\uC218\uB294 \uC774\uC81C PORT\uB85C \uC774\uB984\uC774 \uC9C0\uC815\uB418\uC5B4 \uC0C1\uC218\uC778 PORT\uC640 \uC77C\uAD00\uC131 \uC788\uB294 \uC774\uB984 \uADDC\uCE59\uC744 \uB530\uB985\uB2C8\uB2E4. \uD658\uACBD \uBCC0\uC218 \uC9C0\uC6D0\uC744 \uD1B5\uD574 \uC560\uD50C\uB9AC\uCF00\uC774\uC158\uC740 \uC774\uC81C process.env.PORT \uD658\uACBD \uBCC0\uC218\uB85C \uC9C0\uC815\uB41C \uC0AC\uC6A9 \uAC00\uB2A5\uD55C \uBAA8\uB4E0 \uD3EC\uD2B8\uC5D0\uC11C \uC2E4\uD589\uD560 \uC218 \uC788\uC73C\uBBC0\uB85C \uB354 \uC720\uC5F0\uD574\uC84C\uC2B5\uB2C8\uB2E4."
};

// src/i18n/nl.json
var nl_default = {
  localLanguage: "Nederlands",
  commitFix: "fix(server.ts): verander poortvariabele van kleine letters poort naar hoofdletters PORT",
  commitFeat: "feat(server.ts): voeg ondersteuning toe voor process.env.PORT omgevingsvariabele",
  commitDescription: "De poortvariabele heet nu PORT, wat de consistentie met de naamgevingsconventies verbetert omdat PORT een constante is. Ondersteuning voor een omgevingsvariabele maakt de applicatie flexibeler, omdat deze nu kan draaien op elke beschikbare poort die is gespecificeerd via de process.env.PORT omgevingsvariabele."
};

// src/i18n/pl.json
var pl_default = {
  localLanguage: "polski",
  commitFix: "fix(server.ts): poprawa wielko\u015Bci zmiennej port na pisane z du\u017Cymi literami PORT",
  commitFeat: "feat(server.ts): dodanie obs\u0142ugi zmiennej \u015Brodowiskowej process.env.PORT",
  commitDescription: "Zmienna port jest teraz nazwana PORT, co jest zgodne z konwencj\u0105 nazewnicz\u0105 poniewa\u017C PORT jest sta\u0142\u0105. Obs\u0142uga zmiennej \u015Brodowiskowej process.env.PORT pozwala \u0142atwiej zarz\u0105dza\u0107 ustawieniami przy starcie."
};

// src/i18n/pt_br.json
var pt_br_default = {
  localLanguage: "portugu\xEAs",
  commitFix: "fix(server.ts): altera o caso da vari\xE1vel de porta de port min\xFAscula para PORT mai\xFAscula",
  commitFeat: "feat(server.ts): adiciona suporte para a vari\xE1vel de ambiente process.env.PORT",
  commitDescription: "A vari\xE1vel de porta agora \xE9 denominada PORT, o que melhora a consist\xEAncia com as conven\xE7\xF5es de nomenclatura, pois PORT \xE9 uma constante. O suporte para uma vari\xE1vel de ambiente permite que o aplicativo seja mais flex\xEDvel, pois agora pode ser executado em qualquer porta dispon\xEDvel especificada por meio da vari\xE1vel de ambiente process.env.PORT."
};

// src/i18n/ru.json
var ru_default = {
  localLanguage: "\u0440\u0443\u0441\u0441\u043A\u0438\u0439",
  commitFix: "fix(server.ts): \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u0435 \u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0430 \u043F\u0435\u0440\u0435\u043C\u0435\u043D\u043D\u043E\u0439 \u043F\u043E\u0440\u0442\u0430 \u0441 \u043D\u0438\u0436\u043D\u0435\u0433\u043E \u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0430 port \u043D\u0430 \u0432\u0435\u0440\u0445\u043D\u0438\u0439 \u0440\u0435\u0433\u0438\u0441\u0442\u0440 PORT",
  commitFeat: "feat(server.ts): \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u0430 \u043F\u043E\u0434\u0434\u0435\u0440\u0436\u043A\u0430 \u043F\u0435\u0440\u0435\u043C\u0435\u043D\u043D\u043E\u0439 \u043E\u043A\u0440\u0443\u0436\u0435\u043D\u0438\u044F process.env.PORT",
  commitDescription: "\u041F\u0435\u0440\u0435\u043C\u0435\u043D\u043D\u0430\u044F port \u0442\u0435\u043F\u0435\u0440\u044C \u043D\u0430\u0437\u044B\u0432\u0430\u0435\u0442\u0441\u044F PORT, \u0447\u0442\u043E \u0443\u043B\u0443\u0447\u0448\u0430\u0435\u0442 \u0441\u043E\u0433\u043B\u0430\u0441\u043E\u0432\u0430\u043D\u043D\u043E\u0441\u0442\u044C \u0441 \u0441\u043E\u0433\u043B\u0430\u0448\u0435\u043D\u0438\u044F\u043C\u0438 \u043E\u0431 \u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0438 \u043A\u043E\u043D\u0441\u0442\u0430\u043D\u0442. \u041F\u043E\u0434\u0434\u0435\u0440\u0436\u043A\u0430 \u043F\u0435\u0440\u0435\u043C\u0435\u043D\u043D\u043E\u0439 \u043E\u043A\u0440\u0443\u0436\u0435\u043D\u0438\u044F \u043F\u043E\u0437\u0432\u043E\u043B\u044F\u0435\u0442 \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u044E \u0431\u044B\u0442\u044C \u0431\u043E\u043B\u0435\u0435 \u0433\u0438\u0431\u043A\u0438\u043C, \u0437\u0430\u043F\u0443\u0441\u043A\u0430\u044F\u0441\u044C \u043D\u0430 \u043B\u044E\u0431\u043E\u043C \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u043E\u043C \u043F\u043E\u0440\u0442\u0443, \u0443\u043A\u0430\u0437\u0430\u043D\u043D\u043E\u043C \u0441 \u043F\u043E\u043C\u043E\u0449\u044C\u044E \u043F\u0435\u0440\u0435\u043C\u0435\u043D\u043D\u043E\u0439 \u043E\u043A\u0440\u0443\u0436\u0435\u043D\u0438\u044F process.env.PORT."
};

// src/i18n/sv.json
var sv_default = {
  localLanguage: "svenska",
  commitFix: "fixa(server.ts): \xE4ndra variabelnamnet f\xF6r port fr\xE5n sm\xE5 bokst\xE4ver till stora bokst\xE4ver PORT",
  commitFeat: "nyhet(server.ts): l\xE4gg till st\xF6d f\xF6r process.env.PORT milj\xF6variabel",
  commitDescription: "Variabeln som inneh\xE5ller portnumret heter nu PORT vilket f\xF6rb\xE4ttrar konsekvensen med namngivningskonventionerna eftersom PORT \xE4r en konstant. St\xF6d f\xF6r en milj\xF6variabel g\xF6r att applikationen kan vara mer flexibel d\xE5 den nu kan k\xF6ras p\xE5 vilken port som helst som specificeras via milj\xF6variabeln process.env.PORT."
};

// src/i18n/th.json
var th_default = {
  localLanguage: "\u0E44\u0E17\u0E22",
  commitFix: "fix(server.ts): \u0E40\u0E1B\u0E25\u0E35\u0E48\u0E22\u0E19\u0E15\u0E31\u0E27\u0E1E\u0E34\u0E21\u0E1E\u0E4C\u0E02\u0E2D\u0E07\u0E15\u0E31\u0E27\u0E41\u0E1B\u0E23 \u0E08\u0E32\u0E01\u0E15\u0E31\u0E27\u0E1E\u0E34\u0E21\u0E1E\u0E4C\u0E40\u0E25\u0E47\u0E01 port \u0E40\u0E1B\u0E47\u0E19\u0E15\u0E31\u0E27\u0E1E\u0E34\u0E21\u0E1E\u0E4C\u0E43\u0E2B\u0E0D\u0E48 PORT",
  commitFeat: "feat(server.ts): \u0E40\u0E1E\u0E34\u0E48\u0E21\u0E01\u0E32\u0E23\u0E23\u0E2D\u0E07\u0E23\u0E31\u0E1A\u0E2A\u0E33\u0E2B\u0E23\u0E31\u0E1A\u0E15\u0E31\u0E27\u0E41\u0E1B\u0E23\u0E2A\u0E20\u0E32\u0E1E\u0E41\u0E27\u0E14\u0E25\u0E49\u0E2D\u0E21 process.env.PORT",
  commitDescription: "\u0E15\u0E2D\u0E19\u0E19\u0E35\u0E49\u0E15\u0E31\u0E27\u0E41\u0E1B\u0E23\u0E1E\u0E2D\u0E23\u0E4C\u0E15\u0E21\u0E35\u0E0A\u0E37\u0E48\u0E2D\u0E27\u0E48\u0E32 PORT, \u0E0B\u0E36\u0E48\u0E07\u0E1B\u0E23\u0E31\u0E1A\u0E1B\u0E23\u0E38\u0E07\u0E04\u0E27\u0E32\u0E21\u0E2A\u0E2D\u0E14\u0E04\u0E25\u0E49\u0E2D\u0E07\u0E01\u0E31\u0E1A\u0E2B\u0E25\u0E31\u0E01\u0E01\u0E32\u0E23\u0E15\u0E31\u0E49\u0E07\u0E0A\u0E37\u0E48\u0E2D\u0E40\u0E19\u0E37\u0E48\u0E2D\u0E07\u0E08\u0E32\u0E01 PORT \u0E40\u0E1B\u0E47\u0E19\u0E04\u0E48\u0E32\u0E04\u0E07\u0E17\u0E35\u0E48. \u0E01\u0E32\u0E23\u0E2A\u0E19\u0E31\u0E1A\u0E2A\u0E19\u0E38\u0E19\u0E2A\u0E33\u0E2B\u0E23\u0E31\u0E1A\u0E15\u0E31\u0E27\u0E41\u0E1B\u0E23\u0E2A\u0E20\u0E32\u0E1E\u0E41\u0E27\u0E14\u0E25\u0E49\u0E2D\u0E21 \u0E0A\u0E48\u0E27\u0E22\u0E43\u0E2B\u0E49\u0E41\u0E2D\u0E1B\u0E1E\u0E25\u0E34\u0E40\u0E04\u0E0A\u0E31\u0E19\u0E21\u0E35\u0E04\u0E27\u0E32\u0E21\u0E22\u0E37\u0E14\u0E2B\u0E22\u0E38\u0E48\u0E19\u0E21\u0E32\u0E01\u0E02\u0E36\u0E49\u0E19\u0E40\u0E19\u0E37\u0E48\u0E2D\u0E07\u0E08\u0E32\u0E01 \u0E2A\u0E32\u0E21\u0E32\u0E23\u0E16\u0E17\u0E33\u0E07\u0E32\u0E19\u0E1A\u0E19\u0E1E\u0E2D\u0E23\u0E4C\u0E15\u0E43\u0E14 \u0E46 \u0E15\u0E32\u0E21\u0E17\u0E35\u0E48\u0E01\u0E33\u0E2B\u0E19\u0E14 \u0E0B\u0E36\u0E48\u0E07\u0E23\u0E30\u0E1A\u0E38\u0E1C\u0E48\u0E32\u0E19\u0E15\u0E31\u0E27\u0E41\u0E1B\u0E23\u0E2A\u0E20\u0E32\u0E1E\u0E41\u0E27\u0E14\u0E25\u0E49\u0E2D\u0E21 process.env.PORT"
};

// src/i18n/tr.json
var tr_default = {
  localLanguage: "Turkish",
  commitFix: "fix(server.ts): port de\u011Fi\u015Fkeni k\xFC\xE7\xFCk harfli porttan b\xFCy\xFCk harfli PORT'a de\u011Fi\u015Ftirildi",
  commitFeat: "feat(server.ts): process.env.PORT ortam de\u011Fi\u015Fkeni i\xE7in destek eklendi.",
  commitDescription: "Ba\u011Flant\u0131 noktas\u0131 de\u011Fi\u015Fkeni art\u0131k PORT olarak adland\u0131r\u0131ld\u0131 ve PORT bir sabit de\u011Fi\u015Fken oldu\u011Fu i\xE7in bu adland\u0131rma tutarl\u0131l\u0131\u011F\u0131 art\u0131r\u0131r. Ortam de\u011Fi\u015Fkeni deste\u011Fi, art\u0131k process.env.PORT ortam de\u011Fi\u015Fkeni arac\u0131l\u0131\u011F\u0131yla belirtilen herhangi bir kullan\u0131labilir ba\u011Flant\u0131 noktas\u0131nda \xE7al\u0131\u015Fabilece\u011Finden uygulaman\u0131n daha esnek olmas\u0131n\u0131 sa\u011Flar."
};

// src/i18n/vi_VN.json
var vi_VN_default = {
  localLanguage: "vietnamese",
  commitFix: "fix(server.ts): thay \u0111\u1ED5i ch\u1EEF vi\u1EBFt th\u01B0\u1EDDng c\u1EE7a bi\u1EBFn port th\xE0nh ch\u1EEF vi\u1EBFt hoa PORT",
  commitFeat: "feat(server.ts): th\xEAm h\u1ED7 tr\u1EE3 cho bi\u1EBFn m\xF4i tr\u01B0\u1EDDng process.env.PORT",
  commitDescription: "Bi\u1EBFn port \u0111\xE3 \u0111\u01B0\u1EE3c \u0111\u1ED5i t\xEAn th\xE0nh PORT, gi\xFAp c\u1EA3i thi\u1EC7n t\xEDnh nh\u1EA5t qu\xE1n trong vi\u1EC7c \u0111\u1EB7t t\xEAn theo quy \u01B0\u1EDBc v\xEC PORT l\xE0 m\u1ED9t h\u1EB1ng s\u1ED1. H\u1ED7 tr\u1EE3 cho bi\u1EBFn m\xF4i tr\u01B0\u1EDDng cho ph\xE9p \u1EE9ng d\u1EE5ng linh ho\u1EA1t h\u01A1n khi c\xF3 th\u1EC3 ch\u1EA1y tr\xEAn b\u1EA5t k\u1EF3 c\u1ED5ng n\xE0o \u0111\u01B0\u1EE3c ch\u1EC9 \u0111\u1ECBnh th\xF4ng qua bi\u1EBFn m\xF4i tr\u01B0\u1EDDng process.env.PORT."
};

// src/i18n/zh_CN.json
var zh_CN_default = {
  localLanguage: "\u7B80\u4F53\u4E2D\u6587",
  commitFix: "\u4FEE\u590D(server.ts)\uFF1A\u5C06\u7AEF\u53E3\u53D8\u91CF\u4ECE\u5C0F\u5199port\u6539\u4E3A\u5927\u5199PORT",
  commitFeat: "\u529F\u80FD(server.ts)\uFF1A\u6DFB\u52A0\u5BF9process.env.PORT\u73AF\u5883\u53D8\u91CF\u7684\u652F\u6301",
  commitDescription: "\u73B0\u5728\u7AEF\u53E3\u53D8\u91CF\u88AB\u547D\u540D\u4E3APORT\uFF0C\u8FD9\u63D0\u9AD8\u4E86\u547D\u540D\u7EA6\u5B9A\u7684\u4E00\u81F4\u6027\uFF0C\u56E0\u4E3APORT\u662F\u4E00\u4E2A\u5E38\u91CF\u3002\u73AF\u5883\u53D8\u91CF\u7684\u652F\u6301\u4F7F\u5E94\u7528\u7A0B\u5E8F\u66F4\u52A0\u7075\u6D3B\uFF0C\u56E0\u4E3A\u5B83\u73B0\u5728\u53EF\u4EE5\u901A\u8FC7process.env.PORT\u73AF\u5883\u53D8\u91CF\u5728\u4EFB\u4F55\u53EF\u7528\u7AEF\u53E3\u4E0A\u8FD0\u884C\u3002"
};

// src/i18n/zh_TW.json
var zh_TW_default = {
  localLanguage: "\u7E41\u9AD4\u4E2D\u6587",
  commitFix: "\u4FEE\u6B63(server.ts)\uFF1A\u5C07\u7AEF\u53E3\u8B8A\u6578\u5F9E\u5C0F\u5BEB\u7AEF\u53E3\u6539\u70BA\u5927\u5BEBPORT",
  commitFeat: "\u529F\u80FD(server.ts)\uFF1A\u65B0\u589E\u5C0Dprocess.env.PORT\u74B0\u5883\u8B8A\u6578\u7684\u652F\u63F4",
  commitDescription: "\u73FE\u5728port\u8B8A\u6578\u5DF2\u66F4\u540D\u70BAPORT\uFF0C\u4EE5\u7B26\u5408\u547D\u540D\u6163\u4F8B\uFF0C\u56E0\u70BAPORT\u662F\u4E00\u500B\u5E38\u91CF\u3002\u652F\u63F4\u74B0\u5883\u8B8A\u6578\u53EF\u4EE5\u4F7F\u61C9\u7528\u7A0B\u5E8F\u66F4\u9748\u6D3B\uFF0C\u56E0\u70BA\u5B83\u73FE\u5728\u53EF\u4EE5\u901A\u904Eprocess.env.PORT\u74B0\u5883\u8B8A\u6578\u904B\u884C\u5728\u4EFB\u4F55\u53EF\u7528\u7AEF\u53E3\u4E0A\u3002"
};

// src/i18n/index.ts
var i18n = {
  en: en_default,
  zh_CN: zh_CN_default,
  zh_TW: zh_TW_default,
  ja: ja_default,
  cs: cs_default,
  de: de_default,
  fr: fr_default,
  it: it_default,
  ko: ko_default,
  pt_br: pt_br_default,
  vi_VN: vi_VN_default,
  es_ES: es_ES_default,
  sv: sv_default,
  id_ID: id_ID_default,
  nl: nl_default,
  ru: ru_default,
  pl: pl_default,
  tr: tr_default,
  th: th_default
};
var I18N_CONFIG_ALIAS = {
  zh_CN: ["zh_CN", "\u7B80\u4F53\u4E2D\u6587", "\u4E2D\u6587", "\u7B80\u4F53"],
  zh_TW: ["zh_TW", "\u7E41\u9AD4\u4E2D\u6587", "\u7E41\u9AD4"],
  ja: ["ja", "Japanese", "\u306B\u307B\u3093\u3054"],
  ko: ["ko", "Korean", "\uD55C\uAD6D\uC5B4"],
  cs: ["cs", "Czech", "\u010Desky"],
  de: ["de", "German", "Deutsch"],
  fr: ["fr", "French", "fran\xE7aise"],
  it: ["it", "Italian", "italiano"],
  nl: ["nl", "Dutch", "Nederlands"],
  pt_br: ["pt_br", "Portuguese", "portugu\xEAs"],
  vi_VN: ["vi_VN", "Vietnamese", "ti\u1EBFng Vi\u1EC7t"],
  en: ["en", "English", "english"],
  es_ES: ["es_ES", "Spanish", "espa\xF1ol"],
  sv: ["sv", "Swedish", "Svenska"],
  ru: ["ru", "Russian", "\u0440\u0443\u0441\u0441\u043A\u0438\u0439"],
  id_ID: ["id_ID", "Bahasa", "bahasa"],
  pl: ["pl", "Polish", "Polski"],
  tr: ["tr", "Turkish", "Turkish"],
  th: ["th", "Thai", "\u0E44\u0E17\u0E22"]
};
function getI18nLocal(value) {
  for (const key in I18N_CONFIG_ALIAS) {
    const aliases2 = I18N_CONFIG_ALIAS[key];
    if (aliases2.includes(value)) {
      return key;
    }
  }
  return false;
}

// src/commands/config.ts
dotenv.config();
var DEFAULT_MODEL_TOKEN_LIMIT = 4096;
var validateConfig = (key, condition, validationMessage) => {
  if (!condition) {
    ce(
      `${source_default.red("\u2716")} Unsupported config key ${key}: ${validationMessage}`
    );
    process.exit(1);
  }
};
var configValidators = {
  ["OCO_OPENAI_API_KEY" /* OCO_OPENAI_API_KEY */](value, config8 = {}) {
    validateConfig("OCO_OPENAI_API_KEY" /* OCO_OPENAI_API_KEY */, value, "Cannot be empty");
    validateConfig(
      "OCO_OPENAI_API_KEY" /* OCO_OPENAI_API_KEY */,
      value.startsWith("sk-"),
      'Must start with "sk-"'
    );
    validateConfig(
      "OCO_OPENAI_API_KEY" /* OCO_OPENAI_API_KEY */,
      config8["OCO_OPENAI_BASE_PATH" /* OCO_OPENAI_BASE_PATH */] || value.length === 51,
      "Must be 51 characters long"
    );
    return value;
  },
  ["OCO_DESCRIPTION" /* OCO_DESCRIPTION */](value) {
    validateConfig(
      "OCO_DESCRIPTION" /* OCO_DESCRIPTION */,
      typeof value === "boolean",
      "Must be true or false"
    );
    return value;
  },
  ["OCO_OPENAI_MAX_TOKENS" /* OCO_OPENAI_MAX_TOKENS */](value) {
    if (typeof value === "string") {
      value = parseInt(value);
      validateConfig(
        "OCO_OPENAI_MAX_TOKENS" /* OCO_OPENAI_MAX_TOKENS */,
        !isNaN(value),
        "Must be a number"
      );
    }
    validateConfig(
      "OCO_OPENAI_MAX_TOKENS" /* OCO_OPENAI_MAX_TOKENS */,
      value ? typeof value === "number" : void 0,
      "Must be a number"
    );
    return value;
  },
  ["OCO_EMOJI" /* OCO_EMOJI */](value) {
    validateConfig(
      "OCO_EMOJI" /* OCO_EMOJI */,
      typeof value === "boolean",
      "Must be true or false"
    );
    return value;
  },
  ["OCO_LANGUAGE" /* OCO_LANGUAGE */](value) {
    validateConfig(
      "OCO_LANGUAGE" /* OCO_LANGUAGE */,
      getI18nLocal(value),
      `${value} is not supported yet`
    );
    return getI18nLocal(value);
  },
  ["OCO_OPENAI_BASE_PATH" /* OCO_OPENAI_BASE_PATH */](value) {
    validateConfig(
      "OCO_OPENAI_BASE_PATH" /* OCO_OPENAI_BASE_PATH */,
      typeof value === "string",
      "Must be string"
    );
    return value;
  },
  ["OCO_MODEL" /* OCO_MODEL */](value) {
    validateConfig(
      "OCO_MODEL" /* OCO_MODEL */,
      [
        "gpt-3.5-turbo",
        "gpt-4",
        "gpt-3.5-turbo-16k",
        "gpt-3.5-turbo-0613"
      ].includes(value),
      `${value} is not supported yet, use 'gpt-4', 'gpt-3.5-turbo-16k' (default), 'gpt-3.5-turbo-0613' or 'gpt-3.5-turbo'`
    );
    return value;
  },
  ["OCO_MESSAGE_TEMPLATE_PLACEHOLDER" /* OCO_MESSAGE_TEMPLATE_PLACEHOLDER */](value) {
    validateConfig(
      "OCO_MESSAGE_TEMPLATE_PLACEHOLDER" /* OCO_MESSAGE_TEMPLATE_PLACEHOLDER */,
      value.startsWith("$"),
      `${value} must start with $, for example: '$msg'`
    );
    return value;
  },
  ["OCO_PROMPT_MODULE" /* OCO_PROMPT_MODULE */](value) {
    validateConfig(
      "OCO_PROMPT_MODULE" /* OCO_PROMPT_MODULE */,
      ["conventional-commit", "@commitlint"].includes(value),
      `${value} is not supported yet, use '@commitlint' or 'conventional-commit' (default)`
    );
    return value;
  }
};
var configPath = (0, import_path.join)((0, import_os.homedir)(), ".startgptcommit");
var getConfig = () => {
  const configFromEnv = {
    OCO_OPENAI_API_KEY: process.env.OCO_OPENAI_API_KEY,
    OCO_OPENAI_MAX_TOKENS: process.env.OCO_OPENAI_MAX_TOKENS ? Number(process.env.OCO_OPENAI_MAX_TOKENS) : void 0,
    OCO_OPENAI_BASE_PATH: process.env.OCO_OPENAI_BASE_PATH,
    OCO_DESCRIPTION: process.env.OCO_DESCRIPTION === "true" ? true : false,
    OCO_EMOJI: process.env.OCO_EMOJI === "true" ? true : false,
    OCO_MODEL: process.env.OCO_MODEL || "gpt-3.5-turbo-16k",
    OCO_LANGUAGE: process.env.OCO_LANGUAGE || "en",
    OCO_MESSAGE_TEMPLATE_PLACEHOLDER: process.env.OCO_MESSAGE_TEMPLATE_PLACEHOLDER || "$msg",
    OCO_PROMPT_MODULE: process.env.OCO_PROMPT_MODULE || "conventional-commit"
  };
  const configExists = (0, import_fs.existsSync)(configPath);
  if (!configExists)
    return configFromEnv;
  const configFile = (0, import_fs.readFileSync)(configPath, "utf8");
  const config8 = (0, import_ini.parse)(configFile);
  for (const configKey of Object.keys(config8)) {
    if (!config8[configKey] || ["null", "undefined"].includes(config8[configKey])) {
      config8[configKey] = void 0;
      continue;
    }
    try {
      const validator = configValidators[configKey];
      const validValue = validator(
        config8[configKey] ?? configFromEnv[configKey],
        config8
      );
      config8[configKey] = validValue;
    } catch (error) {
      ce(`Unknown '${configKey}' config option.`);
      ce(
        `Manually fix the '.env' file or global '~/.startgptcommit' config file.`
      );
      process.exit(1);
    }
  }
  return config8;
};
var setConfig = (keyValues) => {
  const config8 = getConfig() || {};
  for (const [configKey, configValue] of keyValues) {
    if (!configValidators.hasOwnProperty(configKey)) {
      throw new Error(`Unsupported config key: ${configKey}`);
    }
    let parsedConfigValue;
    try {
      parsedConfigValue = JSON.parse(configValue);
    } catch (error) {
      parsedConfigValue = configValue;
    }
    const validValue = configValidators[configKey](parsedConfigValue);
    config8[configKey] = validValue;
  }
  (0, import_fs.writeFileSync)(configPath, (0, import_ini.stringify)(config8), "utf8");
  ce(`${source_default.green("\u2714")} Config successfully set`);
};
var configCommand = G3(
  {
    name: "config" /* config */,
    parameters: ["<mode>", "<key=values...>"]
  },
  async (argv) => {
    ae("startgptcommit \u2014 config");
    try {
      const { mode: mode2, keyValues } = argv._;
      if (mode2 === "get" /* get */) {
        const config8 = getConfig() || {};
        for (const key of keyValues) {
          ce(`${key}=${config8[key]}`);
        }
      } else if (mode2 === "set" /* set */) {
        await setConfig(
          keyValues.map((keyValue) => keyValue.split("="))
        );
      } else {
        throw new Error(
          `Unsupported mode: ${mode2}. Valid modes are: "set" and "get"`
        );
      }
    } catch (error) {
      ce(`${source_default.red("\u2716")} ${error}`);
      process.exit(1);
    }
  }
);

// node_modules/@dqbd/tiktoken/encoders/cl100k_base.json

// src/utils/tokenCount.ts
var import_lite = __toESM(require_tiktoken(), 1);
function tokenCount(content) {
  const encoding = new import_lite.Tiktoken(
    cl100k_base_default.bpe_ranks,
    cl100k_base_default.special_tokens,
    cl100k_base_default.pat_str
  );
  const tokens = encoding.encode(content);
  encoding.free();
  return tokens.length;
}

// src/api.ts
var config2 = getConfig();
var maxTokens = config2?.OCO_OPENAI_MAX_TOKENS;
var basePath = config2?.OCO_OPENAI_BASE_PATH;
var apiKey = config2?.OCO_OPENAI_API_KEY;
var [command, mode] = process.argv.slice(2);
if (!apiKey && command !== "config" && mode !== "set" /* set */) {
  ae("startgptcommit");
  ce(
    "OCO_OPENAI_API_KEY is not set, please run `oco config set OCO_OPENAI_API_KEY=<your token>. Make sure you add payment details, so API works.`"
  );
  ce(
    "For help look into README https://github.com/khulnasoft/startgptcommit#setup"
  );
  process.exit(1);
}
var MODEL = config2?.OCO_MODEL || "gpt-3.5-turbo";
var OpenAi = class {
  openAiApiConfiguration = new import_openai.Configuration({
    apiKey
  });
  openAI;
  constructor() {
    if (basePath) {
      this.openAiApiConfiguration.basePath = basePath;
    }
    this.openAI = new import_openai.OpenAIApi(this.openAiApiConfiguration);
  }
  generateCommitMessage = async (messages) => {
    const params = {
      model: MODEL,
      messages,
      temperature: 0,
      top_p: 0.1,
      max_tokens: maxTokens || 500
    };
    try {
      const REQUEST_TOKENS = messages.map((msg) => tokenCount(msg.content) + 4).reduce((a2, b6) => a2 + b6, 0);
      if (REQUEST_TOKENS > DEFAULT_MODEL_TOKEN_LIMIT - maxTokens) {
        throw new Error("TOO_MUCH_TOKENS" /* tooMuchTokens */);
      }
      const { data } = await this.openAI.createChatCompletion(params);
      const message = data.choices[0].message;
      return message?.content;
    } catch (error) {
      ce(`${source_default.red("\u2716")} ${JSON.stringify(params)}`);
      const err = error;
      ce(`${source_default.red("\u2716")} ${err?.message || err}`);
      if (axios_default.isAxiosError(error) && error.response?.status === 401) {
        const openAiError = error.response.data.error;
        if (openAiError?.message)
          ce(openAiError.message);
        ce(
          "For help look into README https://github.com/khulnasoft/startgptcommit#setup"
        );
      }
      throw err;
    }
  };
};
var getStartgptCommitLatestVersion = async () => {
  try {
    const { stdout } = await execa("npm", [
      "view",
      "startgptcommit",
      "version"
    ]);
    return stdout;
  } catch (_6) {
    ce("Error while getting the latest version of startgptcommit");
    return void 0;
  }
};
var api = new OpenAi();

// src/prompts.ts
var import_openai3 = __toESM(require_dist(), 1);

// src/modules/commitlint/constants.ts
var COMMITLINT_LLM_CONFIG_PATH = `${process.env.PWD}/.startgptcommit-commitlint`;

// src/modules/commitlint/crypto.ts
var import_crypto = __toESM(require("crypto"), 1);
var computeHash = async (content, algorithm = "sha256") => {
  try {
    const hash = import_crypto.default.createHash(algorithm);
    hash.update(content);
    return hash.digest("hex");
  } catch (error) {
    console.error("Error while computing hash:", error);
    throw error;
  }
};

// src/modules/commitlint/prompts.ts
var import_openai2 = __toESM(require_dist(), 1);
var import_types = __toESM(require_lib(), 1);
var config3 = getConfig();
var translation = i18n[config3?.OCO_LANGUAGE || "en"];
var getTypeRuleExtraDescription = (type, prompt) => prompt?.questions?.type?.enum?.[type]?.description;
var llmReadableRules = {
  blankline: (key, applicable) => `There should ${applicable} be a blank line at the beginning of the ${key}.`,
  caseRule: (key, applicable, value) => `The ${key} should ${applicable} be in ${Array.isArray(value) ? `one of the following case: 
  - ${value.join("\n  - ")}.` : `${value} case.`}`,
  emptyRule: (key, applicable) => `The ${key} should ${applicable} be empty.`,
  enumRule: (key, applicable, value) => `The ${key} should ${applicable} be one of the following values: 
  - ${Array.isArray(value) ? value.join("\n  - ") : value}.`,
  enumTypeRule: (key, applicable, value, prompt) => `The ${key} should ${applicable} be one of the following values: 
  - ${Array.isArray(value) ? value.map((v4) => {
    const description = getTypeRuleExtraDescription(v4, prompt);
    if (description) {
      return `${v4} (${description})`;
    } else
      return v4;
  }).join("\n  - ") : value}.`,
  fullStopRule: (key, applicable, value) => `The ${key} should ${applicable} end with '${value}'.`,
  maxLengthRule: (key, applicable, value) => `The ${key} should ${applicable} have ${value} characters or less.`,
  minLengthRule: (key, applicable, value) => `The ${key} should ${applicable} have ${value} characters or more.`
};
var rulesPrompts = {
  "body-case": (applicable, value) => llmReadableRules.caseRule("body", applicable, value),
  "body-empty": (applicable) => llmReadableRules.emptyRule("body", applicable, void 0),
  "body-full-stop": (applicable, value) => llmReadableRules.fullStopRule("body", applicable, value),
  "body-leading-blank": (applicable) => llmReadableRules.blankline("body", applicable, void 0),
  "body-max-length": (applicable, value) => llmReadableRules.maxLengthRule("body", applicable, value),
  "body-max-line-length": (applicable, value) => `Each line of the body should ${applicable} have ${value} characters or less.`,
  "body-min-length": (applicable, value) => llmReadableRules.minLengthRule("body", applicable, value),
  "footer-case": (applicable, value) => llmReadableRules.caseRule("footer", applicable, value),
  "footer-empty": (applicable) => llmReadableRules.emptyRule("footer", applicable, void 0),
  "footer-leading-blank": (applicable) => llmReadableRules.blankline("footer", applicable, void 0),
  "footer-max-length": (applicable, value) => llmReadableRules.maxLengthRule("footer", applicable, value),
  "footer-max-line-length": (applicable, value) => `Each line of the footer should ${applicable} have ${value} characters or less.`,
  "footer-min-length": (applicable, value) => llmReadableRules.minLengthRule("footer", applicable, value),
  "header-case": (applicable, value) => llmReadableRules.caseRule("header", applicable, value),
  "header-full-stop": (applicable, value) => llmReadableRules.fullStopRule("header", applicable, value),
  "header-max-length": (applicable, value) => llmReadableRules.maxLengthRule("header", applicable, value),
  "header-min-length": (applicable, value) => llmReadableRules.minLengthRule("header", applicable, value),
  "references-empty": (applicable) => llmReadableRules.emptyRule("references section", applicable, void 0),
  "scope-case": (applicable, value) => llmReadableRules.caseRule("scope", applicable, value),
  "scope-empty": (applicable) => llmReadableRules.emptyRule("scope", applicable, void 0),
  "scope-enum": (applicable, value) => llmReadableRules.enumRule("type", applicable, value),
  "scope-max-length": (applicable, value) => llmReadableRules.maxLengthRule("scope", applicable, value),
  "scope-min-length": (applicable, value) => llmReadableRules.minLengthRule("scope", applicable, value),
  "signed-off-by": (applicable, value) => `The commit message should ${applicable} have a "Signed-off-by" line with the value "${value}".`,
  "subject-case": (applicable, value) => llmReadableRules.caseRule("subject", applicable, value),
  "subject-empty": (applicable) => llmReadableRules.emptyRule("subject", applicable, void 0),
  "subject-full-stop": (applicable, value) => llmReadableRules.fullStopRule("subject", applicable, value),
  "subject-max-length": (applicable, value) => llmReadableRules.maxLengthRule("subject", applicable, value),
  "subject-min-length": (applicable, value) => llmReadableRules.minLengthRule("subject", applicable, value),
  "type-case": (applicable, value) => llmReadableRules.caseRule("type", applicable, value),
  "type-empty": (applicable) => llmReadableRules.emptyRule("type", applicable, void 0),
  "type-enum": (applicable, value, prompt) => llmReadableRules.enumTypeRule("type", applicable, value, prompt),
  "type-max-length": (applicable, value) => llmReadableRules.maxLengthRule("type", applicable, value),
  "type-min-length": (applicable, value) => llmReadableRules.minLengthRule("type", applicable, value)
};
var getPrompt = (ruleName, ruleConfig, prompt) => {
  const [severity, applicable, value] = ruleConfig;
  if (severity === import_types.RuleConfigSeverity.Disabled)
    return null;
  const promptFn = rulesPrompts[ruleName];
  if (promptFn) {
    return promptFn(applicable, value, prompt);
  }
  ce(`${source_default.red("\u2716")} No prompt handler for rule "${ruleName}".`);
  return `Please manualy set the prompt for rule "${ruleName}".`;
};
var inferPromptsFromCommitlintConfig = (config8) => {
  const { rules, prompt } = config8;
  if (!rules)
    return [];
  return Object.keys(rules).map(
    (ruleName) => getPrompt(ruleName, rules[ruleName], prompt)
  ).filter((prompt2) => prompt2 !== null);
};
var STRUCTURE_OF_COMMIT = `
- Header of commit is composed of type, scope, subject: <type-of-commit>(<scope-of-commit>): <subject-of-commit>
- Description of commit is composed of body and footer (optional): <body-of-commit>
<footer(s)-of-commit>`;
var GEN_COMMITLINT_CONSISTENCY_PROMPT = (prompts) => [
  {
    role: import_openai2.ChatCompletionRequestMessageRoleEnum.Assistant,
    content: `${IDENTITY} Your mission is to create clean and comprehensive commit messages for two different changes in a single codebase and output them in the provided JSON format: one for a bug fix and another for a new feature. 

Here are the specific requirements and conventions that should be strictly followed:

Commit Message Conventions:
- The commit message consists of three parts: Header, Body, and Footer.
- Header: 
  - Format: \`<type>(<scope>): <subject>\`
- ${prompts.join("\n- ")}

JSON Output Format:
- The JSON output should contain the commit messages for a bug fix and a new feature in the following format:
\`\`\`json
{
  "localLanguage": "${translation.localLanguage}",
  "commitFix": "<Header of commit for bug fix>",
  "commitFeat": "<Header of commit for feature>",
  "commitDescription": "<Description of commit for both the bug fix and the feature>"
}
\`\`\`
- The "commitDescription" should not include the commit message\u2019s header, only the description.
- Description should not be more than 74 characters.

Additional Details:
- Changing the variable 'port' to uppercase 'PORT' is considered a bug fix. 
- Allowing the server to listen on a port specified through the environment variable is considered a new feature. 

Example Git Diff is to follow:`
  },
  INIT_DIFF_PROMPT
];
var INIT_MAIN_PROMPT = (language, prompts) => ({
  role: import_openai2.ChatCompletionRequestMessageRoleEnum.System,
  content: `${IDENTITY} Your mission is to create clean and comprehensive commit messages in the given @commitlint convention and explain WHAT were the changes and WHY the changes were done. I'll send you an output of 'git diff --staged' command, and you convert it into a commit message.
${config3?.OCO_EMOJI ? "Use GitMoji convention to preface the commit." : "Do not preface the commit with anything."}
${config3?.OCO_DESCRIPTION ? `Add a short description of WHY the changes are done after the commit message. Don't start it with "This commit", just describe the changes.` : "Don't add any descriptions to the commit, only commit message."}
Use the present tense. Use ${language} to answer.
    
You will strictly follow the following conventions to generate the content of the commit message:
- ${prompts.join("\n- ")}

The conventions refers to the following structure of commit message:
${STRUCTURE_OF_COMMIT}
    
    `
});
var commitlintPrompts = {
  INIT_MAIN_PROMPT,
  GEN_COMMITLINT_CONSISTENCY_PROMPT
};

// src/modules/commitlint/pwd-commitlint.ts
var import_path2 = __toESM(require("path"), 1);
var nodeModulesPath = import_path2.default.join(
  process.env.PWD || process.cwd(),
  "node_modules",
  "@commitlint",
  "load"
);
var getCommitLintPWDConfig = async () => {
  const load = require(nodeModulesPath).default;
  if (load && typeof load === "function") {
    return await load();
  }
  return null;
};

// src/modules/commitlint/utils.ts
var import_promises = __toESM(require("fs/promises"), 1);
var removeDoubleNewlines = (input) => {
  const pattern = /\\n\\n/g;
  if (pattern.test(input)) {
    const newInput = input.replace(pattern, "");
    return removeDoubleNewlines(newInput);
  }
  return input;
};
var commitlintLLMConfigExists = async () => {
  let exists;
  try {
    await import_promises.default.access(COMMITLINT_LLM_CONFIG_PATH);
    exists = true;
  } catch (e2) {
    exists = false;
  }
  return exists;
};
var writeCommitlintLLMConfig = async (commitlintLLMConfig) => {
  await import_promises.default.writeFile(
    COMMITLINT_LLM_CONFIG_PATH,
    JSON.stringify(commitlintLLMConfig, null, 2)
  );
};
var getCommitlintLLMConfig = async () => {
  const content = await import_promises.default.readFile(COMMITLINT_LLM_CONFIG_PATH);
  const commitLintLLMConfig = JSON.parse(
    content.toString()
  );
  return commitLintLLMConfig;
};

// src/modules/commitlint/config.ts
var config4 = getConfig();
var translation2 = i18n[config4?.OCO_LANGUAGE || "en"];
var configureCommitlintIntegration = async (force = false) => {
  const spin = le();
  spin.start("Loading @commitlint configuration");
  const fileExists = await commitlintLLMConfigExists();
  let commitLintConfig = await getCommitLintPWDConfig();
  const hash = await computeHash(JSON.stringify(commitLintConfig));
  spin.stop(`Read @commitlint configuration (hash: ${hash})`);
  if (fileExists) {
    const { hash: existingHash } = await getCommitlintLLMConfig();
    if (hash === existingHash && !force) {
      spin.stop(
        'Hashes are the same, no need to update the config. Run "force" command to bypass.'
      );
      return;
    }
  }
  spin.start("Generating consistency with given @commitlint rules");
  const prompts = inferPromptsFromCommitlintConfig(commitLintConfig);
  const consistencyPrompts = commitlintPrompts.GEN_COMMITLINT_CONSISTENCY_PROMPT(prompts);
  let consistency = await api.generateCommitMessage(consistencyPrompts) || "{}";
  prompts.forEach((prompt) => consistency = consistency.replace(prompt, ""));
  consistency = removeDoubleNewlines(consistency);
  const commitlintLLMConfig = {
    hash,
    prompts,
    consistency: {
      [translation2.localLanguage]: {
        ...JSON.parse(consistency)
      }
    }
  };
  await writeCommitlintLLMConfig(commitlintLLMConfig);
  spin.stop(`Done - please review contents of ${COMMITLINT_LLM_CONFIG_PATH}`);
};

// src/prompts.ts
var config5 = getConfig();
var translation3 = i18n[config5?.OCO_LANGUAGE || "en"];
var IDENTITY = "You are to act as the author of a commit message in git.";
var INIT_MAIN_PROMPT2 = (language) => ({
  role: import_openai3.ChatCompletionRequestMessageRoleEnum.System,
  content: `${IDENTITY} Your mission is to create clean and comprehensive commit messages as per the conventional commit convention and explain WHAT were the changes and mainly WHY the changes were done. I'll send you an output of 'git diff --staged' command, and you are to convert it into a commit message.
    ${config5?.OCO_EMOJI ? "Use GitMoji convention to preface the commit." : "Do not preface the commit with anything."}
    ${config5?.OCO_DESCRIPTION ? `Add a short description of WHY the changes are done after the commit message. Don't start it with "This commit", just describe the changes.` : "Don't add any descriptions to the commit, only commit message."}
    Use the present tense. Lines must not be longer than 74 characters. Use ${language} for the commit message.`
});
var INIT_DIFF_PROMPT = {
  role: import_openai3.ChatCompletionRequestMessageRoleEnum.User,
  content: `diff --git a/src/server.ts b/src/server.ts
    index ad4db42..f3b18a9 100644
    --- a/src/server.ts
    +++ b/src/server.ts
    @@ -10,7 +10,7 @@
    import {
        initWinstonLogger();
        
        const app = express();
        -const port = 7799;
        +const PORT = 7799;
        
        app.use(express.json());
        
        @@ -34,6 +34,6 @@
        app.use((_, res, next) => {
            // ROUTES
            app.use(PROTECTED_ROUTER_URL, protectedRouter);
            
            -app.listen(port, () => {
                -  console.log(\`Server listening on port \${port}\`);
                +app.listen(process.env.PORT || PORT, () => {
                    +  console.log(\`Server listening on port \${PORT}\`);
                });`
};
var INIT_CONSISTENCY_PROMPT = (translation4) => ({
  role: import_openai3.ChatCompletionRequestMessageRoleEnum.Assistant,
  content: `${config5?.OCO_EMOJI ? "\u{1F41B} " : ""}${translation4.commitFix}
${config5?.OCO_EMOJI ? "\u2728 " : ""}${translation4.commitFeat}
${config5?.OCO_DESCRIPTION ? translation4.commitDescription : ""}`
});
var getMainCommitPrompt = async () => {
  switch (config5?.OCO_PROMPT_MODULE) {
    case "@commitlint":
      if (!await commitlintLLMConfigExists()) {
        ie(
          `OCO_PROMPT_MODULE is @commitlint but you haven't generated consistency for this project yet.`
        );
        await configureCommitlintIntegration();
      }
      const commitLintConfig = await getCommitlintLLMConfig();
      return [
        commitlintPrompts.INIT_MAIN_PROMPT(
          translation3.localLanguage,
          commitLintConfig.prompts
        ),
        INIT_DIFF_PROMPT,
        INIT_CONSISTENCY_PROMPT(
          commitLintConfig.consistency[translation3.localLanguage]
        )
      ];
    default:
      return [
        INIT_MAIN_PROMPT2(translation3.localLanguage),
        INIT_DIFF_PROMPT,
        INIT_CONSISTENCY_PROMPT(translation3)
      ];
  }
};

// src/utils/mergeDiffs.ts
function mergeDiffs(arr, maxStringLength) {
  const mergedArr = [];
  let currentItem = arr[0];
  for (const item of arr.slice(1)) {
    if (tokenCount(currentItem + item) <= maxStringLength) {
      currentItem += item;
    } else {
      mergedArr.push(currentItem);
      currentItem = item;
    }
  }
  mergedArr.push(currentItem);
  return mergedArr;
}

// src/generateCommitMessageFromGitDiff.ts
var config6 = getConfig();
var generateCommitMessageChatCompletionPrompt = async (diff) => {
  const INIT_MESSAGES_PROMPT = await getMainCommitPrompt();
  const chatContextAsCompletionRequest = [...INIT_MESSAGES_PROMPT];
  chatContextAsCompletionRequest.push({
    role: import_openai4.ChatCompletionRequestMessageRoleEnum.User,
    content: diff
  });
  return chatContextAsCompletionRequest;
};
var ADJUSTMENT_FACTOR = 20;
var generateCommitMessageByDiff = async (diff) => {
  try {
    const INIT_MESSAGES_PROMPT = await getMainCommitPrompt();
    const INIT_MESSAGES_PROMPT_LENGTH = INIT_MESSAGES_PROMPT.map(
      (msg) => tokenCount(msg.content) + 4
    ).reduce((a2, b6) => a2 + b6, 0);
    const MAX_REQUEST_TOKENS = DEFAULT_MODEL_TOKEN_LIMIT - ADJUSTMENT_FACTOR - INIT_MESSAGES_PROMPT_LENGTH - config6?.OCO_OPENAI_MAX_TOKENS;
    if (tokenCount(diff) >= MAX_REQUEST_TOKENS) {
      const commitMessagePromises = await getCommitMsgsPromisesFromFileDiffs(
        diff,
        MAX_REQUEST_TOKENS
      );
      const commitMessages = [];
      for (const promise of commitMessagePromises) {
        commitMessages.push(await promise);
        await delay(2e3);
      }
      return commitMessages.join("\n\n");
    }
    const messages = await generateCommitMessageChatCompletionPrompt(diff);
    const commitMessage = await api.generateCommitMessage(messages);
    if (!commitMessage)
      throw new Error("EMPTY_MESSAGE" /* emptyMessage */);
    return commitMessage;
  } catch (error) {
    throw error;
  }
};
function getMessagesPromisesByChangesInFile(fileDiff, separator, maxChangeLength) {
  const hunkHeaderSeparator = "@@ ";
  const [fileHeader, ...fileDiffByLines] = fileDiff.split(hunkHeaderSeparator);
  const mergedChanges = mergeDiffs(
    fileDiffByLines.map((line) => hunkHeaderSeparator + line),
    maxChangeLength
  );
  const lineDiffsWithHeader = [];
  for (const change of mergedChanges) {
    const totalChange = fileHeader + change;
    if (tokenCount(totalChange) > maxChangeLength) {
      const splitChanges = splitDiff(totalChange, maxChangeLength);
      lineDiffsWithHeader.push(...splitChanges);
    } else {
      lineDiffsWithHeader.push(totalChange);
    }
  }
  const commitMsgsFromFileLineDiffs = lineDiffsWithHeader.map(
    async (lineDiff) => {
      const messages = await generateCommitMessageChatCompletionPrompt(
        separator + lineDiff
      );
      return api.generateCommitMessage(messages);
    }
  );
  return commitMsgsFromFileLineDiffs;
}
function splitDiff(diff, maxChangeLength) {
  const lines = diff.split("\n");
  const splitDiffs = [];
  let currentDiff = "";
  for (let line of lines) {
    while (tokenCount(line) > maxChangeLength) {
      const subLine = line.substring(0, maxChangeLength);
      line = line.substring(maxChangeLength);
      splitDiffs.push(subLine);
    }
    if (tokenCount(currentDiff) + tokenCount("\n" + line) > maxChangeLength) {
      splitDiffs.push(currentDiff);
      currentDiff = line;
    } else {
      currentDiff += "\n" + line;
    }
  }
  if (currentDiff) {
    splitDiffs.push(currentDiff);
  }
  return splitDiffs;
}
var getCommitMsgsPromisesFromFileDiffs = async (diff, maxDiffLength) => {
  const separator = "diff --git ";
  const diffByFiles = diff.split(separator).slice(1);
  const mergedFilesDiffs = mergeDiffs(diffByFiles, maxDiffLength);
  const commitMessagePromises = [];
  for (const fileDiff of mergedFilesDiffs) {
    if (tokenCount(fileDiff) >= maxDiffLength) {
      const messagesPromises = getMessagesPromisesByChangesInFile(
        fileDiff,
        separator,
        maxDiffLength
      );
      commitMessagePromises.push(...messagesPromises);
    } else {
      const messages = await generateCommitMessageChatCompletionPrompt(
        separator + fileDiff
      );
      commitMessagePromises.push(api.generateCommitMessage(messages));
    }
  }
  return commitMessagePromises;
};
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// src/utils/git.ts
var import_fs2 = require("fs");
var import_ignore = __toESM(require_ignore(), 1);
var assertGitRepo = async () => {
  try {
    await execa("git", ["rev-parse"]);
  } catch (error) {
    throw new Error(error);
  }
};
var getStartgptCommitIgnore = () => {
  const ig = (0, import_ignore.default)();
  try {
    ig.add((0, import_fs2.readFileSync)(".startgptcommitignore").toString().split("\n"));
  } catch (e2) {
  }
  return ig;
};
var getCoreHooksPath = async () => {
  const { stdout } = await execa("git", ["config", "core.hooksPath"]);
  return stdout;
};
var getStagedFiles = async () => {
  const { stdout: gitDir } = await execa("git", [
    "rev-parse",
    "--show-toplevel"
  ]);
  const { stdout: files } = await execa("git", [
    "diff",
    "--name-only",
    "--cached",
    "--relative",
    gitDir
  ]);
  if (!files)
    return [];
  const filesList = files.split("\n");
  const ig = getStartgptCommitIgnore();
  const allowedFiles = filesList.filter((file) => !ig.ignores(file));
  if (!allowedFiles)
    return [];
  return allowedFiles.sort();
};
var getChangedFiles = async () => {
  const { stdout: modified } = await execa("git", ["ls-files", "--modified"]);
  const { stdout: others } = await execa("git", [
    "ls-files",
    "--others",
    "--exclude-standard"
  ]);
  const files = [...modified.split("\n"), ...others.split("\n")].filter(
    (file) => !!file
  );
  return files.sort();
};
var gitAdd = async ({ files }) => {
  const gitAddSpinner = le();
  gitAddSpinner.start("Adding files to commit");
  await execa("git", ["add", ...files]);
  gitAddSpinner.stop("Done");
};
var getDiff = async ({ files }) => {
  const lockFiles = files.filter(
    (file) => file.includes(".lock") || file.includes("-lock.") || file.includes(".svg") || file.includes(".png") || file.includes(".jpg") || file.includes(".jpeg") || file.includes(".webp") || file.includes(".gif")
  );
  if (lockFiles.length) {
    ce(
      `Some files are excluded by default from 'git diff'. No commit messages are generated for this files:
${lockFiles.join(
        "\n"
      )}`
    );
  }
  const filesWithoutLocks = files.filter(
    (file) => !file.includes(".lock") && !file.includes("-lock.")
  );
  const { stdout: diff } = await execa("git", [
    "diff",
    "--staged",
    "--",
    ...filesWithoutLocks
  ]);
  return diff;
};

// src/utils/trytm.ts
var trytm = async (promise) => {
  try {
    const data = await promise;
    return [data, null];
  } catch (throwable) {
    if (throwable instanceof Error)
      return [null, throwable];
    throw throwable;
  }
};

// src/commands/commit.ts
var config7 = getConfig();
var getGitRemotes = async () => {
  const { stdout } = await execa("git", ["remote"]);
  return stdout.split("\n").filter((remote) => Boolean(remote.trim()));
};
var checkMessageTemplate = (extraArgs2) => {
  for (const key in extraArgs2) {
    if (extraArgs2[key].includes(config7?.OCO_MESSAGE_TEMPLATE_PLACEHOLDER))
      return extraArgs2[key];
  }
  return false;
};
var generateCommitMessageFromGitDiff = async (diff, extraArgs2) => {
  await assertGitRepo();
  const commitSpinner = le();
  commitSpinner.start("Generating the commit message");
  try {
    let commitMessage = await generateCommitMessageByDiff(diff);
    const messageTemplate = checkMessageTemplate(extraArgs2);
    if (config7?.OCO_MESSAGE_TEMPLATE_PLACEHOLDER && typeof messageTemplate === "string") {
      commitMessage = messageTemplate.replace(
        config7?.OCO_MESSAGE_TEMPLATE_PLACEHOLDER,
        commitMessage
      );
    }
    commitSpinner.stop("\u{1F4DD} Commit message generated");
    ce(
      `Generated commit message:
${source_default.grey("\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014")}
${commitMessage}
${source_default.grey("\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014")}`
    );
    const isCommitConfirmedByUser = await Q3({
      message: "Confirm the commit message?"
    });
    if (isCommitConfirmedByUser && !eD2(isCommitConfirmedByUser)) {
      const { stdout } = await execa("git", [
        "commit",
        "-m",
        commitMessage,
        ...extraArgs2
      ]);
      ce(`${source_default.green("\u2714")} Successfully committed`);
      ce(stdout);
      const remotes = await getGitRemotes();
      if (!remotes.length) {
        const { stdout: stdout2 } = await execa("git", ["push"]);
        if (stdout2)
          ce(stdout2);
        process.exit(0);
      }
      if (remotes.length === 1) {
        const isPushConfirmedByUser = await Q3({
          message: "Do you want to run `git push`?"
        });
        if (isPushConfirmedByUser && !eD2(isPushConfirmedByUser)) {
          const pushSpinner = le();
          pushSpinner.start(`Running 'git push ${remotes[0]}'`);
          const { stdout: stdout2 } = await execa("git", [
            "push",
            "--verbose",
            remotes[0]
          ]);
          pushSpinner.stop(
            `${source_default.green("\u2714")} Successfully pushed all commits to ${remotes[0]}`
          );
          if (stdout2)
            ce(stdout2);
        } else {
          ce("`git push` aborted");
          process.exit(0);
        }
      } else {
        const selectedRemote = await ee({
          message: "Choose a remote to push to",
          options: remotes.map((remote) => ({ value: remote, label: remote }))
        });
        if (!eD2(selectedRemote)) {
          const pushSpinner = le();
          pushSpinner.start(`Running 'git push ${selectedRemote}'`);
          const { stdout: stdout2 } = await execa("git", ["push", selectedRemote]);
          pushSpinner.stop(
            `${source_default.green(
              "\u2714"
            )} Successfully pushed all commits to ${selectedRemote}`
          );
          if (stdout2)
            ce(stdout2);
        } else
          ce(`${source_default.gray("\u2716")} process cancelled`);
      }
    }
  } catch (error) {
    commitSpinner.stop("\u{1F4DD} Commit message generated");
    const err = error;
    ce(`${source_default.red("\u2716")} ${err?.message || err}`);
    process.exit(1);
  }
};
async function commit(extraArgs2 = [], isStageAllFlag = false) {
  if (isStageAllFlag) {
    const changedFiles2 = await getChangedFiles();
    if (changedFiles2)
      await gitAdd({ files: changedFiles2 });
    else {
      ce("No changes detected, write some code and run `oco` again");
      process.exit(1);
    }
  }
  const [stagedFiles, errorStagedFiles] = await trytm(getStagedFiles());
  const [changedFiles, errorChangedFiles] = await trytm(getChangedFiles());
  if (!changedFiles?.length && !stagedFiles?.length) {
    ce(source_default.red("No changes detected"));
    process.exit(1);
  }
  ae("open-commit");
  if (errorChangedFiles ?? errorStagedFiles) {
    ce(`${source_default.red("\u2716")} ${errorChangedFiles ?? errorStagedFiles}`);
    process.exit(1);
  }
  const stagedFilesSpinner = le();
  stagedFilesSpinner.start("Counting staged files");
  if (!stagedFiles.length) {
    stagedFilesSpinner.stop("No files are staged");
    const isStageAllAndCommitConfirmedByUser = await Q3({
      message: "Do you want to stage all files and generate commit message?"
    });
    if (isStageAllAndCommitConfirmedByUser && !eD2(isStageAllAndCommitConfirmedByUser)) {
      await commit(extraArgs2, true);
      process.exit(1);
    }
    if (stagedFiles.length === 0 && changedFiles.length > 0) {
      const files = await re({
        message: source_default.cyan("Select the files you want to add to the commit:"),
        options: changedFiles.map((file) => ({
          value: file,
          label: file
        }))
      });
      if (eD2(files))
        process.exit(1);
      await gitAdd({ files });
    }
    await commit(extraArgs2, false);
    process.exit(1);
  }
  stagedFilesSpinner.stop(
    `${stagedFiles.length} staged files:
${stagedFiles.map((file) => `  ${file}`).join("\n")}`
  );
  const [, generateCommitError] = await trytm(
    generateCommitMessageFromGitDiff(
      await getDiff({ files: stagedFiles }),
      extraArgs2
    )
  );
  if (generateCommitError) {
    ce(`${source_default.red("\u2716")} ${generateCommitError}`);
    process.exit(1);
  }
  process.exit(0);
}

// src/commands/commitlint.ts
var commitlintConfigCommand = G3(
  {
    name: "commitlint" /* commitlint */,
    parameters: ["<mode>"]
  },
  async (argv) => {
    ae("startgptcommit \u2014 configure @commitlint");
    try {
      const { mode: mode2 } = argv._;
      if (mode2 === "get" /* get */) {
        const commitLintConfig = await getCommitlintLLMConfig();
        ce(commitLintConfig.toString());
        return;
      }
      if (mode2 === "force" /* force */) {
        await configureCommitlintIntegration(true);
        return;
      }
      throw new Error(
        `Unsupported mode: ${mode2}. Valid modes are: "force" and "get"`
      );
    } catch (error) {
      ce(`${source_default.red("\u2716")} ${error}`);
      process.exit(1);
    }
  }
);

// src/commands/githook.ts
var import_fs3 = require("fs");
var import_promises2 = __toESM(require("fs/promises"), 1);
var import_path3 = __toESM(require("path"), 1);
var HOOK_NAME = "prepare-commit-msg";
var DEFAULT_SYMLINK_URL = import_path3.default.join(".git", "hooks", HOOK_NAME);
var getHooksPath = async () => {
  try {
    const hooksPath = await getCoreHooksPath();
    return import_path3.default.join(hooksPath, HOOK_NAME);
  } catch (error) {
    return DEFAULT_SYMLINK_URL;
  }
};
var isHookCalled = async () => {
  const hooksPath = await getHooksPath();
  return process.argv[1].endsWith(hooksPath);
};
var isHookExists = async () => {
  const hooksPath = await getHooksPath();
  return (0, import_fs3.existsSync)(hooksPath);
};
var hookCommand = G3(
  {
    name: "hook" /* hook */,
    parameters: ["<set/unset>"]
  },
  async (argv) => {
    const HOOK_URL = __filename;
    const SYMLINK_URL = await getHooksPath();
    try {
      await assertGitRepo();
      const { setUnset: mode2 } = argv._;
      if (mode2 === "set") {
        ae(
          `setting startgptcommit as '${HOOK_NAME}' hook at ${SYMLINK_URL}`
        );
        if (await isHookExists()) {
          let realPath;
          try {
            realPath = await import_promises2.default.realpath(SYMLINK_URL);
          } catch (error) {
            ce(error);
            realPath = null;
          }
          if (realPath === HOOK_URL)
            return ce(`StartgptCommit is already set as '${HOOK_NAME}'`);
          throw new Error(
            `Different ${HOOK_NAME} is already set. Remove it before setting startgptcommit as '${HOOK_NAME}' hook.`
          );
        }
        await import_promises2.default.mkdir(import_path3.default.dirname(SYMLINK_URL), { recursive: true });
        await import_promises2.default.symlink(HOOK_URL, SYMLINK_URL, "file");
        await import_promises2.default.chmod(SYMLINK_URL, 493);
        return ce(`${source_default.green("\u2714")} Hook set`);
      }
      if (mode2 === "unset") {
        ae(
          `unsetting startgptcommit as '${HOOK_NAME}' hook from ${SYMLINK_URL}`
        );
        if (!await isHookExists()) {
          return ce(
            `StartgptCommit wasn't previously set as '${HOOK_NAME}' hook, nothing to remove`
          );
        }
        const realpath = await import_promises2.default.realpath(SYMLINK_URL);
        if (realpath !== HOOK_URL) {
          return ce(
            `StartgptCommit wasn't previously set as '${HOOK_NAME}' hook, but different hook was, if you want to remove it \u2014 do it manually`
          );
        }
        await import_promises2.default.rm(SYMLINK_URL);
        return ce(`${source_default.green("\u2714")} Hook is removed`);
      }
      throw new Error(
        `Unsupported mode: ${mode2}. Supported modes are: 'set' or 'unset'`
      );
    } catch (error) {
      ce(`${source_default.red("\u2716")} ${error}`);
      process.exit(1);
    }
  }
);

// src/commands/prepare-commit-msg-hook.ts
var import_promises3 = __toESM(require("fs/promises"), 1);
var [messageFilePath, commitSource] = process.argv.slice(2);
var prepareCommitMessageHook = async (isStageAllFlag = false) => {
  try {
    if (!messageFilePath) {
      throw new Error(
        'Commit message file path is missing. This file should be called from the "prepare-commit-msg" git hook'
      );
    }
    if (commitSource)
      return;
    if (isStageAllFlag) {
      const changedFiles = await getChangedFiles();
      if (changedFiles)
        await gitAdd({ files: changedFiles });
      else {
        ce("No changes detected, write some code and run `oco` again");
        process.exit(1);
      }
    }
    const staged = await getStagedFiles();
    if (!staged)
      return;
    ae("startgptcommit");
    const config8 = getConfig();
    if (!config8?.OCO_OPENAI_API_KEY) {
      throw new Error(
        "No OPEN_AI_API exists. Set your OPEN_AI_API=<key> in ~/.startgptcommit"
      );
    }
    const spin = le();
    spin.start("Generating commit message");
    const commitMessage = await generateCommitMessageByDiff(
      await getDiff({ files: staged })
    );
    spin.stop("Done");
    const fileContent = await import_promises3.default.readFile(messageFilePath);
    await import_promises3.default.writeFile(
      messageFilePath,
      commitMessage + "\n" + fileContent.toString()
    );
  } catch (error) {
    ce(`${source_default.red("\u2716")} ${error}`);
    process.exit(1);
  }
};

// src/utils/checkIsLatestVersion.ts
var checkIsLatestVersion = async () => {
  const latestVersion = await getStartgptCommitLatestVersion();
  if (latestVersion) {
    const currentVersion = package_default.version;
    if (currentVersion !== latestVersion) {
      ce(
        source_default.yellow(
          `
You are not using the latest stable version of StartgptCommit with new features and bug fixes.
Current version: ${currentVersion}. Latest version: ${latestVersion}.
\u{1F680} To update run: npm i -g startgptcommit@latest.
        `
        )
      );
    }
  }
};

// src/cli.ts
var extraArgs = process.argv.slice(2);
Z2(
  {
    version: package_default.version,
    name: "startgptcommit",
    commands: [configCommand, hookCommand, commitlintConfigCommand],
    flags: {},
    ignoreArgv: (type) => type === "unknown-flag" || type === "argument",
    help: { description: package_default.description }
  },
  async () => {
    await checkIsLatestVersion();
    if (await isHookCalled()) {
      prepareCommitMessageHook();
    } else {
      commit(extraArgs);
    }
  },
  extraArgs
);
/*!
 * mime-db
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2015-2022 Douglas Christopher Wilson
 * MIT Licensed
 */
/*!
 * mime-types
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */