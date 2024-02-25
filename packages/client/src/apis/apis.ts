export async function getHealthCheck(serverUrl: string) {
  try {
    await fetch(`${serverUrl}/health`).then(() => {
      console.log("Server is running");
    });
  } catch {
    console.error("Server is not running");
  }
}
