import { Person } from "@/lib/types";
import { composeFullName } from "@/lib/utils";
import { marked } from "marked";

/**
 * Process content with markdown and @mentions
 * @param text - The text containing markdown and potential @mentions
 * @param members - Array of members to check IDs against
 * @returns HTML string with markdown rendered and @mentions converted to links
 */
export function processContent(text: string, members: Person[]): string {
  const memberMap = new Map(members.map((m) => [m.id, m]));

  // First, process markdown
  let html = marked.parse(text, {
    async: false,
    breaks: true,
    gfm: true,
  }) as string;

  // Then process @mentions in the resulting HTML
  const mentionRegex = /@(\w+)/g;
  html = html.replace(mentionRegex, (match, personId) => {
    const member = memberMap.get(personId);
    if (member) {
      const fullName = composeFullName(member);
      return `<a href="/team/${personId}" class="link link-hover font-semibold text-secondary">${fullName}</a>`;
    }
    return match;
  });

  // Remove wrapping <p> tags if present (since we're using this inline)
  html = html.trim();
  if (html.startsWith("<p>") && html.endsWith("</p>")) {
    html = html.slice(3, -4);
  }

  return html;
}
