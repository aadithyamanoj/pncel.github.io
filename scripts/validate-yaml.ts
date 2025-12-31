#!/usr/bin/env tsx

/**
 * Validates all YAML database files against their schemas.
 * This script should be run during build to catch data errors early.
 *
 * Usage:
 *   npm run validate-yaml
 *   or
 *   tsx scripts/validate-yaml.ts
 */

import { readFile } from "fs/promises";
import { parse } from "yaml";
import {
  validatePersonsYaml,
  validatePublicationsYaml,
  validatePhotosYaml,
} from "../src/lib/validation";

interface ValidationResult {
  file: string;
  success: boolean;
  errors?: string[];
  warnings?: string[];
}

async function validateYamlFile(
  filePath: string,
  validator: (data: unknown) => {
    success: boolean;
    errors?: string[];
    data?: unknown;
  },
): Promise<ValidationResult> {
  try {
    const content = await readFile(filePath, "utf-8");
    const data = parse(content);
    const result = validator(data);

    if (result.success) {
      return {
        file: filePath,
        success: true,
      };
    } else {
      return {
        file: filePath,
        success: false,
        errors: result.errors,
      };
    }
  } catch (error) {
    return {
      file: filePath,
      success: false,
      errors: [
        error instanceof Error
          ? `Failed to read/parse file: ${error.message}`
          : "Unknown error occurred",
      ],
    };
  }
}

async function validateCrossReferences(
  personsData: unknown,
  publicationsData: unknown,
): Promise<string[]> {
  const warnings: string[] = [];

  try {
    // Extract person IDs
    const persons = (personsData as any).docs || [];
    const personIds = new Set(persons.map((p: any) => p.id));

    // Check publication author IDs
    const publications = (publicationsData as any).docs || [];
    for (const pub of publications) {
      if (!pub.authorIds || !Array.isArray(pub.authorIds)) continue;

      for (const authorId of pub.authorIds) {
        if (!personIds.has(authorId)) {
          warnings.push(
            `Publication "${pub.id}" (${pub.title}) references unknown author ID: ${authorId}`,
          );
        }
      }
    }

    // Check member selectedPubIds
    for (const person of persons) {
      if (!person.memberInfo?.selectedPubIds) continue;

      const pubIds = new Set(publications.map((p: any) => p.id));
      for (const pubId of person.memberInfo.selectedPubIds) {
        if (!pubIds.has(pubId)) {
          warnings.push(
            `Person "${person.id}" (${person.firstname} ${person.lastname}) references unknown publication ID: ${pubId}`,
          );
        }
      }
    }
  } catch (error) {
    warnings.push(
      `Cross-reference validation failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }

  return warnings;
}

async function main() {
  console.log("🔍 Validating YAML database files...\n");

  const databaseDir = "public/database";
  const results: ValidationResult[] = [];

  // Validate each YAML file
  const personsResult = await validateYamlFile(
    `${databaseDir}/persons.yaml`,
    validatePersonsYaml,
  );
  results.push(personsResult);

  const pubsResult = await validateYamlFile(
    `${databaseDir}/pubs.yaml`,
    validatePublicationsYaml,
  );
  results.push(pubsResult);

  const photosResult = await validateYamlFile(
    `${databaseDir}/photos.yaml`,
    validatePhotosYaml,
  );
  results.push(photosResult);

  // Cross-reference validation
  let crossRefWarnings: string[] = [];
  if (personsResult.success && pubsResult.success) {
    const personsContent = await readFile(
      `${databaseDir}/persons.yaml`,
      "utf-8",
    );
    const pubsContent = await readFile(`${databaseDir}/pubs.yaml`, "utf-8");
    const personsData = parse(personsContent);
    const pubsData = parse(pubsContent);

    crossRefWarnings = await validateCrossReferences(personsData, pubsData);
  }

  // Print results
  let hasErrors = false;
  let hasWarnings = crossRefWarnings.length > 0;

  for (const result of results) {
    if (result.success) {
      console.log(`✅ ${result.file}: Valid`);
    } else {
      hasErrors = true;
      console.log(`❌ ${result.file}: Invalid`);
      if (result.errors) {
        for (const error of result.errors) {
          console.log(`   - ${error}`);
        }
      }
    }
  }

  if (crossRefWarnings.length > 0) {
    console.log("\n⚠️  Cross-reference warnings:");
    for (const warning of crossRefWarnings) {
      console.log(`   - ${warning}`);
    }
  }

  console.log("");

  if (hasErrors) {
    console.error(
      "❌ Validation failed with errors. Please fix the issues above.",
    );
    process.exit(1);
  } else if (hasWarnings) {
    console.warn(
      "⚠️  Validation passed with warnings. Review the warnings above.",
    );
    process.exit(0);
  } else {
    console.log("✅ All validations passed!");
    process.exit(0);
  }
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
