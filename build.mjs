import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
const dist = resolve(root, "dist");
const client = resolve(dist, "client");
const server = resolve(dist, "server");

await rm(dist, { recursive: true, force: true });
await mkdir(resolve(client, "images"), { recursive: true });
await mkdir(server, { recursive: true });

await Promise.all([
  cp(resolve(root, "index.html"), resolve(client, "index.html")),
  cp(resolve(root, "style.css"), resolve(client, "style.css")),
  cp(resolve(root, "script.js"), resolve(client, "script.js")),
  cp(resolve(root, "favicon.svg"), resolve(client, "favicon.svg")),
  cp(resolve(root, "images", "notistan.png"), resolve(client, "images", "notistan.png")),
  cp(resolve(root, "images", "age-of-tycoon.png"), resolve(client, "images", "age-of-tycoon.png")),
  cp(resolve(root, "images", "online-pisti.jpg"), resolve(client, "images", "online-pisti.jpg")),
  cp(resolve(root, "images", "todo-preview.png"), resolve(client, "images", "todo-preview.png"))
]);

const worker = `export default {
  async fetch(request, env) {
    return env.ASSETS.fetch(request);
  }
};
`;

await writeFile(resolve(server, "index.js"), worker);
