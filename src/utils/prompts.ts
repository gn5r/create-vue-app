import prompts from "prompts";
import { red } from "kolorist";
import { existsSync, readdirSync } from "node:fs";

const currentDirs = [".", "./"];

function toValidPackageName(projectName?: string) {
  if (!projectName) return "";
  return projectName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/^[._]/, "")
    .replace(/[^a-z0-9-~]+/g, "-");
}

function skipEmpty(dir?: string) {
  if (!dir) return true;
  if (!existsSync(dir)) return true;
  const files = readdirSync(dir);
  if (files.length === 0) return true;
  if (files.length === 1 && files[0] === ".git") return true;

  return false;
}

type Context = {
  cwd: string;
  targetDir?: string;
  projectName?: string;
  packageName?: string;
  isOverwrite?: boolean;
  author?: string;
  version?: string;
  usePages?: boolean;
  useVueLayouts?: boolean;
  runGitInit?: boolean;
  usePackageManager?: "npm" | "yarn" | null;
};

async function initPrompts(context: Context) {
  let targetDir = context.targetDir;

  // Prompts:
  // - Project name:
  // - Package name:
  // - Author:
  // - Version:
  // - Run git init?
  // - usePages?
  // - useVueLayouts?
  // - Install dependencies with yarn or npm?
  const answer = await prompts(
    [
      {
        name: "projectName",
        type: targetDir ? null : "text",
        message: "Project name:",
        initial: context.projectName,
        onState: (state) =>
          (targetDir = String(state.value).trim() || context.projectName),
      },
      {
        name: "packageName",
        type: "text",
        message: "Package name:",
        initial: () => toValidPackageName(targetDir),
      },
      {
        name: "isOverwrite",
        type: () => (skipEmpty(targetDir) ? null : "confirm"),
        message: () => {
          const dir = currentDirs.includes(targetDir as string)
            ? "Current directory"
            : `Target directory "${targetDir}"`;
          return `${dir} is not empty. Remove existing files and continue?`;
        },
      },
      {
        name: "author",
        type: "text",
        message: "Author:",
        initial: "",
      },
      {
        name: "version",
        type: "text",
        message: "Version:",
        initial: "0.1.0",
      },
      {
        name: "runGitInit",
        type: "toggle",
        message: "Run 'git init' command?",
        active: "Yes",
        inactive: "No",
        initial: true,
      },
      {
        name: "usePages",
        type: "toggle",
        message: "usePages?",
        active: "Yes",
        inactive: "No",
        initial: false,
      },
      {
        name: "useVueLayouts",
        type: "toggle",
        message: "useVueLayouts?",
        active: "Yes",
        inactive: "No",
        initial: false,
      },
      {
        name: "usePackageManager",
        type: "select",
        message: "Would you like to install dependencies with yarn or npm?",
        initial: 0,
        choices: [
          { title: "yarn", value: "yarn" },
          { title: "npm", value: "npm" },
          { title: "none", value: null },
        ],
      },
    ],
    {
      onCancel: () => {
        throw new Error(`${red("✖")} Operation canceled`);
      },
    }
  );

  return { ...context, ...answer, targetDir } as {
    [P in keyof Context]-?: Context[P];
  };
}

export { initPrompts };
export type { Context };
