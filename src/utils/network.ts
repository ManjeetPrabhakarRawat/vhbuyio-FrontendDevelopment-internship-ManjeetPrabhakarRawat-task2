export type NetworkState = {
  name: string | null;
  connected: boolean;
  internet: boolean;
  error?: boolean;
};

type NativeNetworkResult = {
  name?: unknown;
  connected?: unknown;
  internet?: unknown;
};

type NativeNetworkProvider = {
  getConnectedNetworkName: () =>
    | Promise<NativeNetworkResult | string | null>
    | NativeNetworkResult
    | string
    | null;
  subscribe?: (listener: () => void) => () => void;
};

declare global {
  interface Window {
    browserOSNetwork?: NativeNetworkProvider;
  }
}

const nativeProvider = () =>
  typeof window !== "undefined" ? window.browserOSNetwork : undefined;

const normalizeNativeResult = (
  result: NativeNetworkResult | string | null,
): NetworkState => {
  if (typeof result === "string") {
    return {
      name: result || null,
      connected: Boolean(result),
      internet: false,
    };
  }

  return {
    name: typeof result?.name === "string" && result.name ? result.name : null,
    connected: result?.connected === true,
    internet: result?.internet === true,
  };
};

export async function getConnectedNetworkName(): Promise<NetworkState> {
  const provider = nativeProvider();
  if (provider) {
    try {
      return normalizeNativeResult(await provider.getConnectedNetworkName());
    } catch (error) {
      console.error("[BrowserOS network] Native provider failed", error);
      return { name: null, connected: false, internet: false, error: true };
    }
  }

  const endpoint = "/api/network";
  try {
    const url = new URL(endpoint, window.location.origin).toString();
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Network API returned ${response.status} from ${url}`);
    }
    const result: unknown = await response.json();
    if (
      !result ||
      typeof result !== "object" ||
      typeof (result as { connected?: unknown }).connected !== "boolean" ||
      typeof (result as { internet?: unknown }).internet !== "boolean"
    ) {
      throw new Error(`Invalid network API response from ${url}`);
    }

    const data = result as {
      connected: boolean;
      ssid?: unknown;
      internet: boolean;
    };
    const name = typeof data.ssid === "string" && data.ssid ? data.ssid : null;
    return {
      name,
      connected: data.connected,
      internet: data.internet,
      error: data.connected && !name,
    };
  } catch (error) {
    console.error("[BrowserOS network] API request failed", error);
    return { name: null, connected: false, internet: false, error: true };
  }
}

export function subscribeToNetworkChanges(listener: () => void) {
  const cleanups: Array<() => void> = [];
  const provider = nativeProvider();

  if (provider?.subscribe) cleanups.push(provider.subscribe(listener));

  return () => cleanups.forEach((cleanup) => cleanup());
}
