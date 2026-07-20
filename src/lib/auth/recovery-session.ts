export type RecoveryCredentials = {
  accessToken: string;
  refreshToken: string;
};

export function readRecoveryCredentials(hash: string): RecoveryCredentials | null {
  const fragment = new URLSearchParams(hash.replace(/^#/, ""));

  if (fragment.get("type") !== "recovery") {
    return null;
  }

  const accessToken = fragment.get("access_token");
  const refreshToken = fragment.get("refresh_token");

  return accessToken && refreshToken ? { accessToken, refreshToken } : null;
}
