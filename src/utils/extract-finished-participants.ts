import type { RankingItem } from "~/types";

export function extractFinishedParticipantsFromMarkdown(
  content: string
): RankingItem[] {
  const mainTitleRegex =
    /## Participantes que completaram o desafio([\s\S]*?)## Como Contribuir/g;

  const matchParticipants = mainTitleRegex.exec(content);

  if (!matchParticipants) {
    return [];
  }

  return matchParticipants[1]
    .trim()
    .split("\n")
    .splice(2)
    .map((s) => s.split("|").splice(1))
    .reduce((acc, row, index) => {
      const twitterMatch = row[6].match(/\[Twitter\]\(([^)]+)\)/);
      const linkedinMatch = row[6].match(/\[LinkedIn\]\(([^)]+)\)/);

      return [
        ...acc,
        {
          index: index + 1,
          name: row[1].trim(),
          started_at: row[2].trim(),
          ended_at: row[3].trim(),
          stack: (row[4] as string).split(",").map((a) => a.trim()),
          looking_for_job: (row[5] as string).trim() === "Sim",
          // TODO: We don't have this information on the markdown table today
          github_username: "",
          socials: [
            twitterMatch
              ? {
                  favicon: "twitter",
                  social_url: twitterMatch[1],
                }
              : undefined,
            linkedinMatch
              ? {
                  favicon: "linkedin",
                  social_url: linkedinMatch[1],
                }
              : undefined,
          ],
        },
      ] as RankingItem[];
    }, [] as RankingItem[]);
}
