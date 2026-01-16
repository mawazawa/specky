// Simple mock of an MCP Client for "Exa" or "Memory"
// In a real app, this would connect to the local MCP server

export interface MCPToolCall {
  serverName: string;
  toolName: string;
  arguments: Record<string, any>;
}

export class MCPClient {
  private servers: Map<string, boolean>;

  constructor() {
    this.servers = new Map();
    this.servers.set("exa", true);
    this.servers.set("memory", true);
  }

  async isAvailable(serverName: string): Promise<boolean> {
    return this.servers.get(serverName) || false;
  }

  async execute<T>(call: MCPToolCall): Promise<T | null> {
    if (!await this.isAvailable(call.serverName)) {
      console.warn(`[MCP] Server ${call.serverName} not available.`);
      return null;
    }

    console.log(`[MCP] Executing ${call.serverName}/${call.toolName}`, call.arguments);
    
    // Mock responses for now
    if (call.serverName === "exa" && call.toolName === "search") {
      return {
        results: [
          { title: "Verified Result", url: "https://example.com", publishedDate: "2026-01-15" }
        ]
      } as unknown as T;
    }

    return null;
  }
}
