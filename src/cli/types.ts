export interface CLICommand {
  name: string;
  description: string;
  options?: CLIOption[];
  action: (args: Record<string, any>) => Promise<void>;
}

export interface CLIOption {
  name: string;
  alias?: string;
  description: string;
  type: "string" | "boolean";
  required?: boolean;
}

export interface CLIContext {
  cwd: string;
  version: string;
}
