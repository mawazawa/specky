import { commands } from "./commands";
import { parseArgs } from "node:util";

export async function run() {
  const args = process.argv.slice(2);
  const commandName = args[0];

  if (!commandName || commandName === "--help" || commandName === "-h") {
    printHelp();
    return;
  }

  const command = commands.find(c => c.name === commandName);
  if (!command) {
    console.error(`Unknown command: ${commandName}`);
    printHelp();
    process.exit(1);
  }

  // Simple argument parsing logic for now
  // In a real implementation, we'd use a more robust parser respecting command.options
  const options: Record<string, any> = {};
  
  if (command.options) {
    // Very basic manual parsing for demonstration
    for (let i = 1; i < args.length; i++) {
      const arg = args[i];
      if (arg.startsWith("--")) {
        const key = arg.slice(2);
        const value = args[i + 1];
        options[key] = value;
        i++;
      }
    }
  }

  try {
    await command.action(options);
  } catch (error) {
    console.error("Command failed:", error);
    process.exit(1);
  }
}

function printHelp() {
  console.log("🐦 Specky - The Spec is the Moat");
  console.log("\nUsage: specky <command> [options]");
  console.log("\nCommands:");
  commands.forEach(cmd => {
    console.log(`  ${cmd.name.padEnd(12)} ${cmd.description}`);
  });
}
