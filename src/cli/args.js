const normalizeFlag = (flag) => flag.replace(/^--?/, "");

const parseFlags = (args) => {
  const flags = {};
  const positionals = [];
  let i = 0;

  while (i < args.length) {
    const arg = args[i];
    if (arg.startsWith("--")) {
      const [rawKey, rawValue] = arg.split("=");
      const key = normalizeFlag(rawKey);
      const value = rawValue ?? (args[i + 1] && !args[i + 1].startsWith("-") ? args[++i] : true);
      flags[key] = value;
    } else if (arg.startsWith("-")) {
      const key = normalizeFlag(arg);
      flags[key] = true;
    } else {
      positionals.push(arg);
    }
    i += 1;
  }

  return { flags, positionals };
};

export const parseArgs = (argv) => {
  const [command, ...rest] = argv;
  const { flags, positionals } = parseFlags(rest);
  return {
    command,
    flags,
    positionals,
  };
};
