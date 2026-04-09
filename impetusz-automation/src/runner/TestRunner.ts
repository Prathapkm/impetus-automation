import { spawn } from "child_process";
import * as path from "path";

/**
 * TestRunner — spawns Cucumber as a child process.
 *
 * Usage:
 *   npm run test:all
 *   npm run test:smoke
 *   npm run test:regression
 *   npm run test:feature -- login_and_navigate.feature
 *
 * Or programmatically from another TS file:
 *   await TestRunner.run();
 *   await TestRunner.runByTag("@smoke");
 *   await TestRunner.runFeature("login_and_navigate.feature");
 */
export class TestRunner {
  private static readonly ROOT = path.resolve(__dirname, "../../");
  private static readonly CUCUMBER_BIN = path.join(
    this.ROOT,
    "node_modules",
    ".bin",
    "cucumber-js"
  );

  // ─── Core: spawn cucumber-js with given args ──────────────────────────────
  private static execute(args: string[]): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log(`\n▶  cucumber-js ${args.join(" ")}\n`);

      const proc = spawn(this.CUCUMBER_BIN, args, {
        cwd: this.ROOT,
        stdio: "inherit",   // stream output directly to terminal
        shell: false,
      });

      proc.on("close", (code) => {
        if (code === 0) {
          console.log("\n✅  Test run PASSED");
          resolve();
        } else {
          console.error(`\n❌  Test run FAILED (exit code ${code})`);
          process.exitCode = code ?? 1;
          resolve();            // resolve (not reject) so callers can chain cleanly
        }
      });

      proc.on("error", (err) => {
        console.error("Runner error:", err.message);
        reject(err);
      });
    });
  }

  // ─── Public API ───────────────────────────────────────────────────────────

  /** Run ALL scenarios */
  static async run(): Promise<void> {
    console.log("\n▶  Running ALL tests");
    await this.execute([]);
  }

  /**
   * Run scenarios matching a Cucumber tag expression.
   * Examples:  "@smoke"  |  "@regression"  |  "@smoke and not @wip"
   */
  static async runByTag(tag: string): Promise<void> {
    console.log(`\n▶  Running tests tagged: ${tag}`);
    await this.execute(["--tags", tag]);
  }

  /**
   * Run a single feature file by filename.
   * Example:  "login_and_navigate.feature"
   */
  static async runFeature(featureFileName: string): Promise<void> {
    const featurePath = path.join(this.ROOT, "features", featureFileName);
    console.log(`\n▶  Running feature: ${featureFileName}`);
    await this.execute([featurePath]);
  }

  /** Run @smoke tagged scenarios — quick sanity check */
  static async runSmoke(): Promise<void> {
    await this.runByTag("@smoke");
  }

  /** Run @regression tagged scenarios — full regression suite */
  static async runRegression(): Promise<void> {
    await this.runByTag("@regression");
  }
}
