// Dynamic icon registry - automatically includes all FontAwesome icons
import * as solidIcons from "@fortawesome/free-solid-svg-icons";
import * as brandIcons from "@fortawesome/free-brands-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

/**
 * Extracts all icon definitions from a FontAwesome package.
 * Filters out non-icon exports like 'fas', 'fab', 'prefix', etc.
 */
function extractIcons(
  pkg: Record<string, unknown>,
): Record<string, IconDefinition> {
  const icons: Record<string, IconDefinition> = {};

  Object.values(pkg).forEach((value) => {
    // Check if this is an icon definition (has iconName property)
    if (
      value &&
      typeof value === "object" &&
      "iconName" in value &&
      typeof value.iconName === "string"
    ) {
      const icon = value as IconDefinition;
      icons[icon.iconName] = icon;
    }
  });

  return icons;
}

// Build the registry from both packages (brands overwrite solids if there's a conflict)
const solidIconsMap = extractIcons(solidIcons);
const brandIconsMap = extractIcons(brandIcons);

/**
 * Registry mapping FontAwesome icon names to their icon definitions.
 * Automatically includes all icons from @fortawesome/free-solid-svg-icons
 * and @fortawesome/free-brands-svg-icons.
 */
export const iconRegistry = {
  ...solidIconsMap,
  ...brandIconsMap,
} as const;

/**
 * Icon name type - simply a string.
 * Valid icon names are validated at runtime via the registry.
 */
export type IconName = string;

/**
 * Array of all valid icon names for runtime validation.
 * Use this in JSON schemas and runtime checks.
 * Sorted alphabetically to ensure deterministic schema hashes.
 */
export const iconNames: readonly string[] = Object.keys(iconRegistry).sort();

/**
 * Get an icon definition by name.
 * Returns a fallback question mark icon if the name doesn't exist.
 */
export function getIcon(name: string): IconDefinition {
  const icon = iconRegistry[name as IconName];
  if (!icon) {
    console.warn(
      `[icon-registry] Unknown icon name: "${name}", using fallback`,
    );
    return solidIcons.faQuestion;
  }
  return icon;
}
