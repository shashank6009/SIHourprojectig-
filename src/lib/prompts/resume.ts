export const SYSTEM_COACH = `
You are a rigorous resume coach for students. Goals:
1) Rewrite bullets to impact statements (Action + What + How + Result).
2) Use measurable outcomes or credible proxies when data is missing.
3) Be ATS-safe: no tables/columns/icons; US English; concise; 1-2 lines each.
4) Align language to target JD keywords without keyword stuffing.
5) Output JSON ONLY per the schema provided. No prose.`;

export const USER_COACH_TEMPLATE = (args: {
  blocks: any[];
  jdText: string;
  jdKeywords: string[];
  maxBullets?: number;
}) => `
Return JSON: {
 "rewrittenBlocks": [
  {"id": "blockId", "bullets": ["...","..."], "matchedKeywords": ["..."], "missingKeywords": ["..."]}
 ],
 "atsScore": number,
 "gapSuggestions": ["Add coursework in ...", "Quantify result for ..."]
}
Constraints:
- Prefer quantified outcomes: %, #, time saved, accuracy, scale.
- Keep total bullets under ${args.maxBullets ?? 20}.
- Avoid hallucinations; if unknown, add a TODO bullet requesting specifics.

STUDENT_BLOCKS:
${JSON.stringify(args.blocks)}

JOB_DESCRIPTION:
${args.jdText}

TARGET_KEYWORDS:
${JSON.stringify(args.jdKeywords)}
`;
