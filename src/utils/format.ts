export type Router = "expo-router" | "react-navigation";

export function wrapSection(title: string, content: string): string {
  return `# ${title}\n\n${content}`;
}

export function stepHeader(num: number, title: string): string {
  return `## Step ${num}: ${title}`;
}

export function checkpoint(text: string): string {
  return `\n✅ **Checkpoint**: ${text}\n`;
}
