export function getHealthCheck(serverUrl: string) {
  try {
    fetch(`${serverUrl}/health`).then(() => {
      console.log("Server is running");
    });
  } catch {
    console.error("Server is not running");
  }
}

// 토큰 검증

// 토큰 재발급

// 가입
