export async function login(email: string, password: string): Promise<void> {
  await new Promise<void>(resolve => setTimeout(resolve, 500));

  // Intentional deterministic failure path for demonstrating the error state.
  if (email.toLowerCase().startsWith('error@')) {
    throw new Error(
      'We could not sign you in. Check your details and try again.',
    );
  }

  if (!email || !password) {
    throw new Error('Email and password are required.');
  }
}
