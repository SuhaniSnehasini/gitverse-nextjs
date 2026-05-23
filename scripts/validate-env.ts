import dotenv from "dotenv";
import fs from "node:fs";
import path from "node:path";

type ValidationResult = {
  key: string;
  required: boolean;
  isValid: boolean;
  message: string;
};

const envFileCandidates = [".env.local", ".env"];

function loadEnvironmentFile() {
  for (const candidate of envFileCandidates) {
    const filePath = path.resolve(process.cwd(), candidate);

    if (fs.existsSync(filePath)) {
      dotenv.config({ path: filePath, override: false });
      return filePath;
    }
  }

  return null;
}

function isPlaceholder(value: string) {
  const normalized = value.trim().toLowerCase();

  return (
    normalized === "your-secret-here" ||
    normalized === "replace-me" ||
    normalized === "change-me" ||
    normalized === "example" ||
    normalized.includes("your-") ||
    normalized.includes("placeholder")
  );
}

function isAbsoluteUrl(value: string) {
  try {
    const parsed = new URL(value.trim());
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function colorize(text: string, code: number) {
  return `\u001b[${code}m${text}\u001b[0m`;
}

function validateRequiredValue(
  key: string,
  value: string | undefined,
  validate: (trimmedValue: string) => { isValid: boolean; message: string },
): ValidationResult {
  const trimmedValue = value?.trim() ?? "";

  if (!trimmedValue) {
    return {
      key,
      required: true,
      isValid: false,
      message: "Missing required value",
    };
  }

  const result = validate(trimmedValue);

  return {
    key,
    required: true,
    isValid: result.isValid,
    message: result.message,
  };
}

function validateOptionalValue(
  key: string,
  value: string | undefined,
  validate: (trimmedValue: string) => { isValid: boolean; message: string },
): ValidationResult | null {
  const trimmedValue = value?.trim() ?? "";

  if (!trimmedValue) {
    return null;
  }

  const result = validate(trimmedValue);

  return {
    key,
    required: false,
    isValid: result.isValid,
    message: result.message,
  };
}
import dotenv from "dotenv";
import fs from "node:fs";
import path from "node:path";

type ValidationResult = {
  key: string;
  required: boolean;
  isValid: boolean;
  message: string;
};

const envFileCandidates = [".env.local", ".env"];

function loadEnvironmentFile() {
  for (const candidate of envFileCandidates) {
    const filePath = path.resolve(process.cwd(), candidate);

    if (fs.existsSync(filePath)) {
      dotenv.config({ path: filePath, override: false });
      return filePath;
    }
  }

  return null;
}

function isPlaceholder(value: string) {
  const normalized = value.trim().toLowerCase();

  return (
    normalized === "your-secret-here" ||
    normalized === "replace-me" ||
    normalized === "change-me" ||
    normalized === "example" ||
    normalized.includes("your-") ||
    normalized.includes("placeholder")
  );
}

function isAbsoluteUrl(value: string) {
  try {
  console.error(
      colorize(`\nEnvironment validation failed with ${failures.length} issue(s).`, 31),
    );
    process.exit(1);
  }

  console.log(colorize("\nEnvironment validation passed.", 32));
}

runValidation();
    validateRequiredValue("JWT_SECRET", process.env.JWT_SECRET, (value) => {
      const isValid = Buffer.byteLength(value, "utf8") >= 32 && !isPlaceholder(value);

      return {
        isValid,
        message: isValid
          ? "Meets the 32-byte minimum"
          : "Should be at least 32 bytes/characters for adequate security",
      };
    }),
    validateRequiredValue("GEMINI_API_KEY", process.env.GEMINI_API_KEY, (value) => {
      const isValid = !isPlaceholder(value);

      return {
        isValid,
        message: isValid ? "Configured" : "Must not be a placeholder value",
      };
    }),
    validateRequiredValue("NEXTAUTH_SECRET", process.env.NEXTAUTH_SECRET, (value) => {
      const isValid = Buffer.byteLength(value, "utf8") >= 32 && !isPlaceholder(value);

      return {
        isValid,
        message: isValid
          ? "Meets the 32-byte minimum"
          : "Should be non-placeholder and at least 32 bytes/characters",
      };
    }),
    validateRequiredValue("NEXTAUTH_URL", process.env.NEXTAUTH_URL, (value) => {
      const isValid = isAbsoluteUrl(value);

      return {
        isValid,
        message: isValid ? "Valid absolute URL" : "Must be a valid absolute http(s) URL",
      };
    }),
    validateOptionalValue("GITHUB_APP_ID", process.env.GITHUB_APP_ID, (value) => {
      const isValid = !isPlaceholder(value);

      return {
        isValid,
        message: isValid ? "Configured" : "Should not be a placeholder value",
      };
    }),
    validateOptionalValue(
      "GITHUB_APP_PRIVATE_KEY",
      process.env.GITHUB_APP_PRIVATE_KEY,
      (value) => {
        const isValid = !isPlaceholder(value);

        return {
          isValid,
          message: isValid ? "Configured" : "Should not be a placeholder value",
        };
      },
    ),
  ];

  const activeResults = results.filter((result): result is ValidationResult => result !== null);
  const failures = activeResults.filter((result) => !result.isValid);

  activeResults.forEach((result) => {
    console.log(formatResult(result));
  });

  if (failures.length > 0) {
    console.error(
      colorize(`\nEnvironment validation failed with ${failures.length} issue(s).`, 31),
>>>>>>> 470289f (chore: remove issue_*.md copies per PR review; keep validator focused)
    );
    process.exit(1);
  }

<<<<<<< HEAD
  console.log(`Loaded environment from: ${COLORS.green}${COLORS.bold}${loadedPath}${COLORS.reset}\n`);

  let errors = 0;
  let warnings = 0;

  for (const rule of envRules) {
    const value = process.env[rule.key];

    if (!value) {
      if (rule.required) {
        console.error(
          `${COLORS.red}❌ Missing Required:${COLORS.reset} ${COLORS.bold}${rule.key}${COLORS.reset}`
        );
        errors++;
      } else if (rule.warning) {
        console.warn(
          `${COLORS.yellow}⚠️  Missing Optional (Recommended):${COLORS.reset} ${COLORS.bold}${rule.key}${COLORS.reset}`
        );
        warnings++;
      }
      continue;
    }

    if (rule.validate) {
      const { isValid, message } = rule.validate(value);
      if (!isValid) {
        console.error(
          `${COLORS.red}❌ Invalid Format:${COLORS.reset} ${COLORS.bold}${rule.key}${COLORS.reset}`
        );
        console.error(`   👉 ${COLORS.yellow}${message}${COLORS.reset}`);
        errors++;
        continue;
      }
    }

    // Mask value for secure display
    const masked = value.length > 8 
      ? value.substring(0, 4) + "... [MASKED] ..." + value.substring(value.length - 4)
      : "*** [MASKED] ***";

    console.log(
      `${COLORS.green}✅ Validated:${COLORS.reset} ${COLORS.bold}${rule.key}${COLORS.reset} (${COLORS.cyan}${masked}${COLORS.reset})`
    );
  }

  console.log(`\n${COLORS.bold}${COLORS.cyan}-----------------------------------------${COLORS.reset}`);
  if (errors > 0) {
    console.error(
      `🚨 ${COLORS.red}${COLORS.bold}Validation Failed!${COLORS.reset} Found ${COLORS.bold}${errors}${COLORS.reset} error(s) and ${COLORS.bold}${warnings}${COLORS.reset} warning(s).`
    );
    console.error(
      `Please correct the configurations in your ${COLORS.cyan}${loadedPath}${COLORS.reset} file.\n`
    );
    process.exit(1);
  } else if (warnings > 0) {
    console.log(
      `✨ ${COLORS.yellow}${COLORS.bold}Validation Completed with Warnings!${COLORS.reset} All required configurations are valid. Found ${COLORS.bold}${warnings}${COLORS.reset} optional warning(s).`
    );
    console.log("Ready for development! Run `npm run dev` to start.\n");
  } else {
    console.log(
      `🎉 ${COLORS.green}${COLORS.bold}All Configurations are 100% Valid!${COLORS.reset} Excellent setup.`
    );
    console.log("Ready for development! Run `npm run dev` to start.\n");
  }
}

try {
  runValidation();
} catch (error) {
  console.error("An unexpected error occurred during validation:", error);
  process.exit(1);
}
=======
  console.log(colorize("\nEnvironment validation passed.", 32));
}

runValidation();
>>>>>>> 470289f (chore: remove issue_*.md copies per PR review; keep validator focused)
