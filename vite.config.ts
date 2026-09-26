import { execFile } from "node:child_process";
import { request } from "node:https";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

type NetworkResponse = {
  connected: boolean;
  ssid: string | null;
  internet: boolean;
};

const parseNetworkOutput = (output: string): NetworkResponse => {
  const match = output.match(/^\s*SSID\s*:\s*(.*?)\s*$/im);
  const ssid = match?.[1]?.trim() || null;

  return { connected: Boolean(ssid), ssid, internet: false };
};

const checkInternet = () =>
  new Promise<boolean>((resolve) => {
    const probe = request(
      "https://www.gstatic.com/generate_204",
      { method: "GET", timeout: 3000 },
      (response) => {
        response.resume();
        resolve((response.statusCode ?? 0) >= 200 && (response.statusCode ?? 0) < 400);
      },
    );
    probe.on("error", () => resolve(false));
    probe.on("timeout", () => {
      probe.destroy();
      resolve(false);
    });
    probe.end();
  });

const sendJson = (response: import("node:http").ServerResponse, status: number, body: NetworkResponse) => {
  response.statusCode = status;
  response.setHeader("Content-Type", "application/json");
  response.end(JSON.stringify(body));
};

const networkHandler = (
  _request: import("node:http").IncomingMessage,
  response: import("node:http").ServerResponse,
) => {
  if (process.platform !== "win32") {
    sendJson(response, 200, { connected: false, ssid: null, internet: false });
    return;
  }

  execFile(
    "netsh",
    ["wlan", "show", "interfaces"],
    { encoding: "utf8" },
    async (error, stdout) => {
      if (error) {
        sendJson(response, 500, { connected: false, ssid: null, internet: false });
        return;
      }

      const wifi = parseNetworkOutput(stdout);
      const internet = wifi.connected ? await checkInternet() : false;
      sendJson(response, 200, { ...wifi, internet });
    },
  );
};

const networkApi = (): Plugin => ({
  name: "browseros-network-api",
  configureServer(server) {
    server.middlewares.use("/api/network", networkHandler);
  },
  configurePreviewServer(server) {
    server.middlewares.use("/api/network", networkHandler);
  },
});

export default defineConfig({
  plugins: [react(), networkApi()],
});
