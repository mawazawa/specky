import { parseArgs } from "./args.js";
import { usage } from "./usage.js";
import { runCommand } from "./commands.js";

export const run = async (argv) => {
  const { command, flags, positionals } = parseArgs(argv);

  if (!command || command === "help" || flags.h || flags.help) {
    console.log(usage());
    return 0;
  }

  const exitCode = await runCommand(command, positionals, flags);
  if (exitCode === null) {
    console.error(`Unknown command: ${command}`);
    console.log(usage());
    return 1;
  }

  return exitCode;
};
