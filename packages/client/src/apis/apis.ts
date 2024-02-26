export async function getHealthCheck(this: { serverUrl: string }) {
  try {
    await fetch(`${this.serverUrl}/health`).then(() => {
      console.log("Server is running");
    });
  } catch {
    console.error("Server is not running");
  }
}
