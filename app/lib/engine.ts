// ─────────────────────────────────────────────────────────────────────────────
// engine.ts  — Analysis engine
// Processes symptoms and medications through semantic matching,
// returns structured medical assessment
// ─────────────────────────────────────────────────────────────────────────────

import {
  CONDITIONS, DRUG_ALIASES, DRUG_INTERACTIONS, EMERGENCY_SYMPTOMS, SELF_CARE_TIPS,
  type Condition, type DrugInteraction,
} from "./knowledge";

// ── Output types ──────────────────────────────────────────────────────────────
export type UrgencyLevel = "emergency" | "urgent" | "see_doctor" | "monitor" | "self_care";

export interface MatchedCondition {
  condition:   Condition;
  matchScore:  number;   // 0–1
  matchedOn:   string[]; // which symptoms matched
}

export interface InteractionResult {
  interaction: DrugInteraction;
  drug1Display: string;
  drug2Display: string;
}

export interface AnalysisInput {
  symptoms:    string;   // free text
  medications: string;   // free text or comma separated
  age?:        number;
  context?:    string;   // any extra info
}

export interface AnalysisOutput {
  urgency:          UrgencyLevel;
  isEmergency:      boolean;
  emergencySymptoms: string[];
  conditions:       MatchedCondition[];
  interactions:     InteractionResult[];
  selfCareTips:     string[];
  aiNarrative:      string;
  whenToSeekCare:   string;
  confidence:       number;   // 0–1
  drugsFound:       string[]; // normalised drug names found
  symptomsFound:    string[]; // extracted symptom keywords
}

// ── Tokenise input text ───────────────────────────────────────────────────────
function tokenise(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

// ── Check text contains a phrase ─────────────────────────────────────────────
function contains(text: string, phrase: string): boolean {
  return text.toLowerCase().includes(phrase.toLowerCase());
}

// ── Extract drug names from free text ────────────────────────────────────────
function extractDrugs(text: string): string[] {
  const lower = text.toLowerCase();
  const found = new Set<string>();

  for (const [alias, canonical] of Object.entries(DRUG_ALIASES)) {
    if (lower.includes(alias)) found.add(canonical);
  }

  // Also try direct canonical name match
  const canonicals = new Set(Object.values(DRUG_ALIASES));
  for (const canonical of canonicals) {
    if (lower.includes(canonical)) found.add(canonical);
  }

  return Array.from(found);
}

// ── Extract symptom keywords from free text ───────────────────────────────────
function extractSymptoms(text: string): string[] {
  const lower = text.toLowerCase();
  const allSymptoms = new Set<string>();

  for (const condition of CONDITIONS) {
    for (const symptom of condition.symptoms) {
      if (contains(lower, symptom)) allSymptoms.add(symptom);
    }
  }

  return Array.from(allSymptoms);
}

// ── Check for emergency phrases ───────────────────────────────────────────────
function detectEmergency(text: string): string[] {
  const lower = text.toLowerCase();
  return EMERGENCY_SYMPTOMS.filter((phrase) => contains(lower, phrase));
}

// ── Match conditions against symptoms ────────────────────────────────────────
function matchConditions(symptoms: string[]): MatchedCondition[] {
  const results: MatchedCondition[] = [];

  for (const condition of CONDITIONS) {
    const matched = condition.symptoms.filter((s) =>
      symptoms.some((found) => found.includes(s) || s.includes(found))
    );

    if (matched.length === 0) continue;

    const score = matched.length / condition.symptoms.length;
    results.push({ condition, matchScore: score, matchedOn: matched });
  }

  // Sort by score desc, then by urgency
  const urgencyOrder = { emergency: 0, urgent: 1, see_doctor: 2, monitor: 3, self_care: 4 };
  return results
    .sort((a, b) => {
      const urgDiff = urgencyOrder[a.condition.urgency] - urgencyOrder[b.condition.urgency];
      if (urgDiff !== 0) return urgDiff;
      return b.matchScore - a.matchScore;
    })
    .slice(0, 5); // top 5
}

// ── Find drug interactions ────────────────────────────────────────────────────
function findInteractions(drugs: string[]): InteractionResult[] {
  const results: InteractionResult[] = [];

  for (let i = 0; i < drugs.length; i++) {
    for (let j = i + 1; j < drugs.length; j++) {
      const d1 = drugs[i];
      const d2 = drugs[j];

      const match = DRUG_INTERACTIONS.find(
        (ix) =>
          (ix.drug1 === d1 && ix.drug2 === d2) ||
          (ix.drug1 === d2 && ix.drug2 === d1)
      );

      if (match) {
        results.push({ interaction: match, drug1Display: d1, drug2Display: d2 });
      }
    }
  }

  // Check for drug + "alcohol" (if mentioned in symptoms/context)
  return results;
}

// ── Determine overall urgency ─────────────────────────────────────────────────
function determineUrgency(
  isEmergency: boolean,
  conditions: MatchedCondition[],
  interactions: InteractionResult[]
): UrgencyLevel {
  if (isEmergency) return "emergency";

  const hasContraindicated = interactions.some(
    (i) => i.interaction.severity === "contraindicated"
  );
  const hasSevere = interactions.some(
    (i) => i.interaction.severity === "severe"
  );

  if (hasContraindicated) return "urgent";
  if (hasSevere) return "urgent";

  const topCondition = conditions[0];
  if (!topCondition) return "self_care";

  if (topCondition.condition.urgency === "emergency") return "emergency";
  if (topCondition.condition.urgency === "urgent") return "urgent";
  if (topCondition.matchScore > 0.3 && topCondition.condition.urgency === "see_doctor")
    return "see_doctor";
  if (topCondition.condition.urgency === "monitor") return "monitor";

  return "self_care";
}

// ── Pick relevant self-care tips ──────────────────────────────────────────────
function pickSelfCareTips(symptoms: string[], conditions: MatchedCondition[]): string[] {
  const all: string[] = [];
  const lower = symptoms.join(" ");

  if (contains(lower, "cough") || contains(lower, "runny") || contains(lower, "sore throat"))
    all.push(...(SELF_CARE_TIPS.cold ?? []));
  if (contains(lower, "headache") || contains(lower, "head pain"))
    all.push(...(SELF_CARE_TIPS.headache ?? []));
  if (contains(lower, "nausea") || contains(lower, "vomiting") || contains(lower, "diarrhea") || contains(lower, "stomach"))
    all.push(...(SELF_CARE_TIPS.stomach ?? []));
  if (contains(lower, "fever"))
    all.push(...(SELF_CARE_TIPS.fever ?? []));
  if (contains(lower, "back pain") || contains(lower, "back ache"))
    all.push(...(SELF_CARE_TIPS.back_pain ?? []));
  if (contains(lower, "anxiety") || contains(lower, "panic") || contains(lower, "anxious") || contains(lower, "fear"))
    all.push(...(SELF_CARE_TIPS.anxiety ?? []));

  // De-duplicate
  return [...new Set(all)].slice(0, 5);
}

// ── Generate AI narrative ─────────────────────────────────────────────────────
function generateNarrative(
  input: AnalysisInput,
  conditions: MatchedCondition[],
  interactions: InteractionResult[],
  urgency: UrgencyLevel,
  drugs: string[]
): { narrative: string; whenToSeekCare: string } {
  const hasSymptoms = input.symptoms.trim().length > 0;
  const hasMeds = drugs.length > 0;

  let narrative = "";
  let whenToSeekCare = "";

  if (urgency === "emergency") {
    narrative =
      "Your symptoms include signs that may indicate a medical emergency. Please call emergency services (911 / 999 / 112) or go to your nearest emergency department immediately. Do not drive yourself.";
    whenToSeekCare = "RIGHT NOW — call emergency services immediately.";
    return { narrative, whenToSeekCare };
  }

  // Interaction section
  if (interactions.length > 0) {
    const worst = interactions.sort((a, b) => {
      const order = { contraindicated: 0, severe: 1, moderate: 2, mild: 3 };
      return order[a.interaction.severity] - order[b.interaction.severity];
    })[0];

    const severityText = {
      contraindicated: "a dangerous — potentially life-threatening —",
      severe:          "a serious",
      moderate:        "a moderate",
      mild:            "a mild",
    }[worst.interaction.severity];

    narrative += `Your medication list shows ${severityText} interaction between **${worst.drug1Display}** and **${worst.drug2Display}**. ${worst.interaction.description} `;

    if (worst.interaction.severity === "contraindicated" || worst.interaction.severity === "severe") {
      narrative += "You should speak with your doctor or pharmacist before taking these together. ";
    }
  }

  // Condition section
  if (conditions.length > 0 && hasSymptoms) {
    const top = conditions[0];
    const others = conditions.slice(1, 3);

    narrative += `Based on your symptoms, the most likely explanation is **${top.condition.name}**. ${top.condition.description} `;

    if (others.length > 0) {
      narrative += `Other possibilities include ${others.map((c) => c.condition.name).join(" or ")}. `;
    }
  } else if (!hasSymptoms && hasMeds) {
    narrative = "I've checked your medications for interactions. " + (interactions.length === 0
      ? "No known serious interactions were found between the medications listed. Always consult your pharmacist before adding new medications."
      : narrative);
  } else if (!hasSymptoms && !hasMeds) {
    narrative = "Please describe your symptoms or list your medications to receive a personalised assessment.";
  }

  // When to seek care
  switch (urgency) {
    case "urgent":
      whenToSeekCare = "Today — seek medical attention within the next few hours.";
      break;
    case "see_doctor":
      whenToSeekCare = "Within 1–3 days — book an appointment with your doctor soon.";
      break;
    case "monitor":
      whenToSeekCare = "If symptoms worsen or persist beyond 3–5 days — monitor closely at home for now.";
      break;
    case "self_care":
      whenToSeekCare = "Home care is appropriate for now. See a doctor if symptoms worsen or don't improve in 7–10 days.";
      break;
    default:
      whenToSeekCare = "See a doctor if symptoms worsen.";
  }

  return { narrative: narrative.trim(), whenToSeekCare };
}

// ── Main analysis function ────────────────────────────────────────────────────
export function analyse(input: AnalysisInput): AnalysisOutput {
  const symptomsText =
    `${input.symptoms} ${input.context ?? ""}`.trim();
  const medsText = input.medications;
  const combined = `${symptomsText} ${medsText}`;

  // Extract
  const symptomsFound  = extractSymptoms(symptomsText);
  const drugsFound     = extractDrugs(medsText + " " + combined);
  const emergencyHits  = detectEmergency(symptomsText);

  // Check if "alcohol" mentioned alongside medications
  if (contains(combined, "alcohol") || contains(combined, "drinking") || contains(combined, "wine") || contains(combined, "beer")) {
    drugsFound.push("alcohol");
  }

  // Match
  const conditions     = matchConditions(symptomsFound);
  const interactions   = findInteractions(drugsFound);
  const urgency        = determineUrgency(emergencyHits.length > 0, conditions, interactions);
  const selfCareTips   = pickSelfCareTips(symptomsFound, conditions);
  const { narrative, whenToSeekCare } = generateNarrative(
    input, conditions, interactions, urgency, drugsFound
  );

  // Confidence: how many symptom keywords matched
  const confidence = Math.min(
    1,
    (symptomsFound.length * 0.15 + drugsFound.length * 0.2 + (conditions[0]?.matchScore ?? 0) * 0.5) / 1.0
  );

  return {
    urgency,
    isEmergency:       emergencyHits.length > 0,
    emergencySymptoms: emergencyHits,
    conditions,
    interactions,
    selfCareTips,
    aiNarrative:       narrative,
    whenToSeekCare,
    confidence:        Math.min(0.98, confidence),
    drugsFound:        drugsFound.filter((d) => d !== "alcohol"),
    symptomsFound,
  };
}

