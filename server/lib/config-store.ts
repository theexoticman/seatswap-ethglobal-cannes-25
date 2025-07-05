import { IConfigStorage, VerificationConfig } from "@selfxyz/core";
import { v4 as uuidv4 } from "uuid";

/**
 * An in-memory key-value store that implements the IConfigStorage interface.
 * This is a simple replacement for a real database (like Redis) for development.
 * NOTE: This is a singleton instance, so it's shared across all API requests.
 * In a real-world serverless environment, you would use an external DB.
 */
class InMemoryKVConfigStore implements IConfigStorage {
  private store = new Map<string, VerificationConfig>();

  async getActionId(userIdentifier: string, data: string): Promise<string> {
    // The userIdentifier from the proof IS the configId we need to look up.
    return userIdentifier;
  }

  async setConfig(id: string, config: VerificationConfig): Promise<boolean> {
    this.store.set(id, config);
    return true;
  }

  async getConfig(id: string): Promise<VerificationConfig> {
    const config = this.store.get(id);
    if (!config) {
      throw new Error(`Configuration not found for id: ${id}`);
    }
    return config;
  }
}

export const configStore = new InMemoryKVConfigStore(); 