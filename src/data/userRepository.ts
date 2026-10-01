import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_REGISTRY_KEY = '@learning-dashboard/user-registry-v1';

export type UserRegistryEntry = {
  email: string;
  status: 'active';
  firstLoginAt: string;
  lastLoginAt: string;
  loginCount: number;
};

export function normalizeUserEmail(email: string): string {
  return email.trim().toLowerCase();
}

async function readRegistry(): Promise<Record<string, UserRegistryEntry>> {
  const serialized = await AsyncStorage.getItem(USER_REGISTRY_KEY);
  if (!serialized) {
    return {};
  }

  try {
    const registry: unknown = JSON.parse(serialized);
    return registry !== null &&
      typeof registry === 'object' &&
      !Array.isArray(registry)
      ? (registry as Record<string, UserRegistryEntry>)
      : {};
  } catch {
    return {};
  }
}

export const userRepository = {
  async recordLogin(email: string): Promise<UserRegistryEntry> {
    const normalizedEmail = normalizeUserEmail(email);
    const registry = await readRegistry();
    const previous = registry[normalizedEmail];
    const now = new Date().toISOString();
    const user: UserRegistryEntry = {
      email: normalizedEmail,
      status: 'active',
      firstLoginAt: previous?.firstLoginAt ?? now,
      lastLoginAt: now,
      loginCount: (previous?.loginCount ?? 0) + 1,
    };

    registry[normalizedEmail] = user;
    await AsyncStorage.setItem(USER_REGISTRY_KEY, JSON.stringify(registry));
    return user;
  },

  async getUser(email: string): Promise<UserRegistryEntry | null> {
    const registry = await readRegistry();
    return registry[normalizeUserEmail(email)] ?? null;
  },
};
