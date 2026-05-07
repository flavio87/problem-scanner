import { parseCliArgs, runExperiment } from "./experiment1.js";

async function main(): Promise<void> {
  const config = parseCliArgs(process.argv.slice(2));
  const summary = await runExperiment(config);
  console.log(JSON.stringify({ summary }, null, 2));
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(JSON.stringify({ error: message }));
  process.exit(1);
});
