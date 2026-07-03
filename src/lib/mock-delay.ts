export async function mockDelay(ms = 400) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}
