// ─────────────────────────────────────────────────────────────────────────────
// knowledge.ts  — Medical knowledge base
// All data is compiled from open medical literature (NIH, WHO, FDA public data)
// No external API required — fully self-contained
// ─────────────────────────────────────────────────────────────────────────────

// ── Symptom → possible conditions mapping ────────────────────────────────────
export interface Condition {
  name:        string;
  probability: "common" | "possible" | "rare";
  urgency:     "emergency" | "urgent" | "see_doctor" | "monitor" | "self_care";
  description: string;
  symptoms:    string[];   // matching keywords
}

export const CONDITIONS: Condition[] = [
  // ── Emergency conditions ──
  {
    name: "Heart Attack",
    probability: "possible",
    urgency: "emergency",
    description: "Blockage of blood flow to the heart muscle. Requires immediate emergency care.",
    symptoms: ["chest pain", "chest tightness", "chest pressure", "left arm pain", "arm pain", "jaw pain", "shortness of breath", "sweating", "nausea", "dizziness", "pain radiating"],
  },
  {
    name: "Stroke",
    probability: "possible",
    urgency: "emergency",
    description: "Disruption of blood supply to the brain. Time-critical emergency — call 911 immediately.",
    symptoms: ["face drooping", "arm weakness", "speech difficulty", "sudden confusion", "sudden headache", "vision loss", "numbness one side", "balance problems", "sudden severe headache"],
  },
  {
    name: "Severe Allergic Reaction (Anaphylaxis)",
    probability: "possible",
    urgency: "emergency",
    description: "Life-threatening allergic reaction requiring immediate epinephrine and emergency care.",
    symptoms: ["throat swelling", "throat closing", "difficulty breathing", "hives", "rash", "swollen face", "swollen lips", "wheezing", "rapid heartbeat", "after eating", "after bee sting"],
  },
  {
    name: "Pulmonary Embolism",
    probability: "rare",
    urgency: "emergency",
    description: "Blood clot in the lungs. Sudden onset of symptoms requires emergency evaluation.",
    symptoms: ["sudden chest pain", "sudden shortness of breath", "coughing blood", "rapid heart rate", "leg swelling", "recent surgery", "long flight"],
  },

  // ── Urgent conditions ──
  {
    name: "Appendicitis",
    probability: "possible",
    urgency: "urgent",
    description: "Inflammation of the appendix. Requires prompt surgical evaluation to prevent rupture.",
    symptoms: ["right side pain", "lower right abdomen", "nausea", "vomiting", "fever", "loss of appetite", "abdominal pain worse with movement"],
  },
  {
    name: "Urinary Tract Infection (UTI)",
    probability: "common",
    urgency: "see_doctor",
    description: "Bacterial infection of the urinary tract. Needs antibiotic treatment.",
    symptoms: ["burning urination", "frequent urination", "painful urination", "cloudy urine", "blood in urine", "pelvic pain", "lower back pain", "urge to urinate"],
  },
  {
    name: "Pneumonia",
    probability: "possible",
    urgency: "urgent",
    description: "Lung infection that can range from mild to severe. Needs medical evaluation and possible antibiotics.",
    symptoms: ["cough", "fever", "chills", "difficulty breathing", "chest pain", "fatigue", "coughing mucus", "shortness of breath", "rapid breathing"],
  },
  {
    name: "Kidney Infection (Pyelonephritis)",
    probability: "possible",
    urgency: "urgent",
    description: "Bacterial infection that has reached the kidneys. Requires prompt antibiotic treatment.",
    symptoms: ["back pain", "flank pain", "fever", "chills", "nausea", "vomiting", "frequent urination", "burning urination", "upper back pain"],
  },

  // ── See a doctor ──
  {
    name: "Common Cold",
    probability: "common",
    urgency: "self_care",
    description: "Viral upper respiratory infection. Usually resolves in 7–10 days with rest and hydration.",
    symptoms: ["runny nose", "stuffy nose", "sore throat", "sneezing", "cough", "mild fever", "congestion", "watery eyes", "fatigue"],
  },
  {
    name: "Influenza (Flu)",
    probability: "common",
    urgency: "see_doctor",
    description: "Viral infection more severe than a cold. Antiviral medication is most effective within 48 hours.",
    symptoms: ["fever", "chills", "body aches", "muscle pain", "fatigue", "headache", "sore throat", "cough", "sudden onset", "high fever"],
  },
  {
    name: "Gastroenteritis (Stomach Flu)",
    probability: "common",
    urgency: "monitor",
    description: "Inflammation of the stomach and intestines, usually viral. Focus on hydration.",
    symptoms: ["nausea", "vomiting", "diarrhea", "stomach cramps", "stomach pain", "abdominal pain", "low grade fever", "loss of appetite"],
  },
  {
    name: "Migraine",
    probability: "common",
    urgency: "see_doctor",
    description: "Recurring headaches often with nausea and light sensitivity. Treatment can significantly improve quality of life.",
    symptoms: ["severe headache", "throbbing headache", "nausea", "light sensitivity", "sound sensitivity", "visual aura", "one side headache", "pulsing pain", "headache with nausea"],
  },
  {
    name: "Anxiety / Panic Attack",
    probability: "common",
    urgency: "see_doctor",
    description: "Intense episode of fear with physical symptoms. Treatment is very effective.",
    symptoms: ["racing heart", "heart pounding", "chest tightness", "shortness of breath", "dizziness", "sweating", "shaking", "fear", "numbness", "feeling of doom", "trembling"],
  },
  {
    name: "Hypertension (High Blood Pressure)",
    probability: "common",
    urgency: "see_doctor",
    description: "Elevated blood pressure that increases risk of heart disease and stroke. Often has no symptoms.",
    symptoms: ["headache", "dizziness", "blurred vision", "nosebleed", "shortness of breath", "chest pain", "fatigue"],
  },
  {
    name: "Type 2 Diabetes",
    probability: "possible",
    urgency: "see_doctor",
    description: "Chronic condition affecting blood sugar regulation. Early diagnosis and management prevents complications.",
    symptoms: ["frequent urination", "excessive thirst", "hunger", "fatigue", "blurred vision", "slow healing wounds", "frequent infections", "weight loss unexplained"],
  },
  {
    name: "Acid Reflux (GERD)",
    probability: "common",
    urgency: "monitor",
    description: "Stomach acid flowing back into the esophagus. Lifestyle changes and medication are effective.",
    symptoms: ["heartburn", "chest burning", "regurgitation", "sour taste", "difficulty swallowing", "chest pain", "worse after eating", "worse lying down"],
  },
  {
    name: "Tension Headache",
    probability: "common",
    urgency: "self_care",
    description: "Most common type of headache, often related to stress or posture. Responds well to over-the-counter pain relief.",
    symptoms: ["headache", "head pressure", "tight band around head", "neck pain", "shoulder tension", "stress", "mild to moderate pain"],
  },
  {
    name: "Allergic Rhinitis (Hay Fever)",
    probability: "common",
    urgency: "self_care",
    description: "Allergic reaction to airborne allergens. Antihistamines and nasal sprays are very effective.",
    symptoms: ["runny nose", "sneezing", "itchy eyes", "watery eyes", "nasal congestion", "itchy nose", "itchy throat", "seasonal"],
  },
  {
    name: "Iron Deficiency Anemia",
    probability: "common",
    urgency: "see_doctor",
    description: "Low red blood cell count due to iron deficiency. Simple blood test can confirm.",
    symptoms: ["fatigue", "weakness", "pale skin", "shortness of breath", "dizziness", "cold hands", "cold feet", "brittle nails", "headache", "lightheadedness"],
  },
  {
    name: "Hypothyroidism",
    probability: "possible",
    urgency: "see_doctor",
    description: "Underactive thyroid gland. Very treatable with daily medication once diagnosed.",
    symptoms: ["fatigue", "weight gain", "cold sensitivity", "dry skin", "hair loss", "constipation", "depression", "slow heart rate", "muscle weakness", "forgetfulness"],
  },
  {
    name: "Depression",
    probability: "common",
    urgency: "see_doctor",
    description: "A common and treatable mental health condition. Therapy and/or medication are highly effective.",
    symptoms: ["sadness", "low mood", "loss of interest", "fatigue", "sleep problems", "appetite changes", "hopelessness", "worthlessness", "difficulty concentrating", "no motivation"],
  },
  {
    name: "Insomnia",
    probability: "common",
    urgency: "see_doctor",
    description: "Difficulty falling or staying asleep. Cognitive behavioral therapy (CBT) is the most effective treatment.",
    symptoms: ["can't sleep", "difficulty sleeping", "waking up", "tired", "not rested", "lying awake", "racing thoughts at night", "sleep problems"],
  },
  {
    name: "Back Pain (Musculoskeletal)",
    probability: "common",
    urgency: "monitor",
    description: "Most back pain is musculoskeletal and improves with exercise, stretching, and time.",
    symptoms: ["back pain", "lower back pain", "upper back pain", "back ache", "muscle pain", "stiff back", "pain when bending", "pain when lifting"],
  },
  {
    name: "Eczema (Atopic Dermatitis)",
    probability: "common",
    urgency: "see_doctor",
    description: "Chronic skin condition causing dry, itchy, inflamed skin. Manageable with moisturizers and creams.",
    symptoms: ["itchy skin", "dry skin", "red skin", "rash", "skin inflammation", "skin flare", "scaly skin", "skin patches"],
  },
  {
    name: "COVID-19",
    probability: "common",
    urgency: "see_doctor",
    description: "Respiratory illness caused by SARS-CoV-2. Testing is recommended. Isolate until results known.",
    symptoms: ["fever", "cough", "fatigue", "loss of taste", "loss of smell", "sore throat", "shortness of breath", "body aches", "headache", "runny nose"],
  },
];

// ── Drug interaction database ─────────────────────────────────────────────────
// Source: FDA drug interaction data (public domain)
export interface DrugInteraction {
  drug1:       string;
  drug2:       string;
  severity:    "mild" | "moderate" | "severe" | "contraindicated";
  description: string;
  mechanism:   string;
}

// Common drug names (brand + generic) for recognition
export const DRUG_ALIASES: Record<string, string> = {
  // Pain / NSAIDs
  "tylenol": "acetaminophen", "paracetamol": "acetaminophen",
  "advil": "ibuprofen", "motrin": "ibuprofen", "nurofen": "ibuprofen",
  "aleve": "naproxen", "naprosyn": "naproxen",
  "aspirin": "aspirin", "bayer": "aspirin",
  // Blood thinners
  "coumadin": "warfarin", "jantoven": "warfarin",
  "xarelto": "rivaroxaban", "eliquis": "apixaban", "pradaxa": "dabigatran",
  "plavix": "clopidogrel",
  // Heart / BP
  "lopressor": "metoprolol", "toprol": "metoprolol",
  "zestril": "lisinopril", "prinivil": "lisinopril",
  "norvasc": "amlodipine",
  "lipitor": "atorvastatin", "crestor": "rosuvastatin", "zocor": "simvastatin",
  "digox": "digoxin", "lanoxin": "digoxin",
  // Antibiotics
  "zithromax": "azithromycin", "z-pak": "azithromycin",
  "cipro": "ciprofloxacin",
  "amoxil": "amoxicillin",
  "flagyl": "metronidazole",
  // Mental health
  "prozac": "fluoxetine", "zoloft": "sertraline", "lexapro": "escitalopram",
  "effexor": "venlafaxine", "cymbalta": "duloxetine",
  "xanax": "alprazolam", "valium": "diazepam", "ativan": "lorazepam",
  "wellbutrin": "bupropion",
  "lithium": "lithium",
  // Diabetes
  "glucophage": "metformin",
  "lantus": "insulin glargine", "humalog": "insulin lispro",
  // Stomach
  "prilosec": "omeprazole", "nexium": "esomeprazole", "prevacid": "lansoprazole",
  // Asthma
  "ventolin": "albuterol", "proair": "albuterol",
  // Thyroid
  "synthroid": "levothyroxine", "eltroxin": "levothyroxine",
  // Other common
  "zyrtec": "cetirizine", "claritin": "loratadine", "benadryl": "diphenhydramine",
  "sudafed": "pseudoephedrine",
  "prednisone": "prednisone", "prednisolone": "prednisolone",
  "methotrexate": "methotrexate",
  "sildenafil": "sildenafil", "viagra": "sildenafil",
  "tadalafil": "tadalafil", "cialis": "tadalafil",
};

export const DRUG_INTERACTIONS: DrugInteraction[] = [
  // ── Contraindicated ───────────────────────────────────────────────────────
  {
    drug1: "warfarin", drug2: "aspirin",
    severity: "contraindicated",
    description: "Taking warfarin with aspirin dramatically increases bleeding risk, including life-threatening internal bleeding.",
    mechanism: "Both drugs inhibit clotting through different pathways, creating a compounded anticoagulant effect.",
  },
  {
    drug1: "sildenafil", drug2: "nitroglycerine",
    severity: "contraindicated",
    description: "This combination can cause a sudden, dangerous drop in blood pressure that can be fatal.",
    mechanism: "Both drugs are vasodilators; combined they cause extreme hypotension.",
  },
  {
    drug1: "fluoxetine", drug2: "tramadol",
    severity: "contraindicated",
    description: "This combination significantly increases the risk of serotonin syndrome — a potentially life-threatening condition.",
    mechanism: "Both increase serotonin levels through different pathways, causing toxic accumulation.",
  },
  {
    drug1: "sertraline", drug2: "tramadol",
    severity: "contraindicated",
    description: "High risk of serotonin syndrome when combining an SSRI with tramadol.",
    mechanism: "Serotonergic combination — both raise serotonin through different mechanisms.",
  },
  {
    drug1: "methotrexate", drug2: "ibuprofen",
    severity: "contraindicated",
    description: "NSAIDs like ibuprofen can increase methotrexate levels to toxic concentrations, risking severe organ damage.",
    mechanism: "NSAIDs reduce renal clearance of methotrexate, causing accumulation.",
  },

  // ── Severe ────────────────────────────────────────────────────────────────
  {
    drug1: "warfarin", drug2: "ibuprofen",
    severity: "severe",
    description: "Ibuprofen increases warfarin's blood-thinning effect, significantly raising the risk of dangerous bleeding.",
    mechanism: "Ibuprofen displaces warfarin from protein binding and inhibits platelet function.",
  },
  {
    drug1: "warfarin", drug2: "naproxen",
    severity: "severe",
    description: "Naproxen increases bleeding risk when combined with warfarin.",
    mechanism: "Similar to ibuprofen: protein displacement and platelet inhibition.",
  },
  {
    drug1: "metformin", drug2: "alcohol",
    severity: "severe",
    description: "Combining metformin with heavy alcohol use significantly raises the risk of lactic acidosis, a rare but dangerous condition.",
    mechanism: "Alcohol impairs hepatic lactate clearance, which metformin also affects.",
  },
  {
    drug1: "digoxin", drug2: "amiodarone",
    severity: "severe",
    description: "Amiodarone increases digoxin blood levels by up to 70%, potentially causing digoxin toxicity.",
    mechanism: "Amiodarone inhibits P-glycoprotein and CYP2C9, reducing digoxin elimination.",
  },
  {
    drug1: "lithium", drug2: "ibuprofen",
    severity: "severe",
    description: "NSAIDs can increase lithium levels to toxic concentrations, causing tremors, confusion, and kidney damage.",
    mechanism: "NSAIDs reduce renal lithium clearance, causing accumulation.",
  },
  {
    drug1: "simvastatin", drug2: "azithromycin",
    severity: "severe",
    description: "Azithromycin can raise simvastatin levels significantly, increasing the risk of muscle damage (rhabdomyolysis).",
    mechanism: "Azithromycin inhibits CYP3A4, the enzyme that breaks down simvastatin.",
  },
  {
    drug1: "clopidogrel", drug2: "omeprazole",
    severity: "severe",
    description: "Omeprazole significantly reduces the effectiveness of clopidogrel, increasing the risk of blood clots.",
    mechanism: "Omeprazole inhibits CYP2C19, which converts clopidogrel to its active form.",
  },
  {
    drug1: "alprazolam", drug2: "alcohol",
    severity: "severe",
    description: "Combining benzodiazepines with alcohol severely increases CNS depression, potentially causing respiratory failure.",
    mechanism: "Both are CNS depressants — combined effect is synergistic and dangerous.",
  },
  {
    drug1: "diazepam", drug2: "alcohol",
    severity: "severe",
    description: "Very dangerous combination — both depress the central nervous system, risking coma or death.",
    mechanism: "Synergistic CNS depression via GABA-A receptor enhancement.",
  },

  // ── Moderate ──────────────────────────────────────────────────────────────
  {
    drug1: "lisinopril", drug2: "ibuprofen",
    severity: "moderate",
    description: "Ibuprofen can reduce the blood pressure-lowering effect of lisinopril and increase the risk of kidney problems.",
    mechanism: "NSAIDs blunt the vasodilatory effect of ACE inhibitors and reduce renal blood flow.",
  },
  {
    drug1: "metoprolol", drug2: "fluoxetine",
    severity: "moderate",
    description: "Fluoxetine can significantly increase metoprolol blood levels, potentially causing bradycardia (slow heart rate).",
    mechanism: "Fluoxetine inhibits CYP2D6, the enzyme responsible for metoprolol metabolism.",
  },
  {
    drug1: "acetaminophen", drug2: "alcohol",
    severity: "moderate",
    description: "Regular alcohol use with acetaminophen increases the risk of liver damage, even at normal doses.",
    mechanism: "Both are hepatotoxic; alcohol induces CYP2E1, producing more toxic acetaminophen metabolite.",
  },
  {
    drug1: "atorvastatin", drug2: "azithromycin",
    severity: "moderate",
    description: "Azithromycin may increase atorvastatin levels, raising the risk of muscle pain and weakness.",
    mechanism: "CYP3A4 inhibition reduces atorvastatin clearance.",
  },
  {
    drug1: "levothyroxine", drug2: "omeprazole",
    severity: "moderate",
    description: "Omeprazole can reduce absorption of levothyroxine, potentially reducing its effectiveness.",
    mechanism: "Stomach acid is needed for optimal levothyroxine absorption; PPIs reduce acid.",
  },
  {
    drug1: "cetirizine", drug2: "alcohol",
    severity: "moderate",
    description: "Alcohol can enhance the sedating effect of cetirizine, affecting your ability to drive or operate machinery.",
    mechanism: "Additive CNS depression.",
  },
  {
    drug1: "metformin", drug2: "ibuprofen",
    severity: "moderate",
    description: "NSAIDs can reduce kidney function, which affects metformin clearance and may increase side effects.",
    mechanism: "NSAIDs reduce renal blood flow, slowing metformin excretion.",
  },
  {
    drug1: "venlafaxine", drug2: "tramadol",
    severity: "severe",
    description: "High risk of serotonin syndrome with this combination — seek medical advice before taking both.",
    mechanism: "Both increase serotonin levels; combined effect is dangerously high.",
  },
  {
    drug1: "amlodipine", drug2: "azithromycin",
    severity: "moderate",
    description: "Azithromycin may increase amlodipine blood levels, potentially causing low blood pressure.",
    mechanism: "Mild CYP3A4 inhibition by azithromycin.",
  },

  // ── Mild ──────────────────────────────────────────────────────────────────
  {
    drug1: "aspirin", drug2: "ibuprofen",
    severity: "mild",
    description: "Ibuprofen may reduce the antiplatelet effect of low-dose aspirin taken for heart protection.",
    mechanism: "Ibuprofen competes with aspirin for the COX-1 binding site.",
  },
  {
    drug1: "escitalopram", drug2: "omeprazole",
    severity: "mild",
    description: "Omeprazole may slightly increase escitalopram blood levels. Typically not clinically significant at normal doses.",
    mechanism: "Omeprazole inhibits CYP2C19, the main enzyme metabolising escitalopram.",
  },
  {
    drug1: "diphenhydramine", drug2: "alcohol",
    severity: "mild",
    description: "Alcohol increases the drowsiness caused by diphenhydramine (Benadryl). Avoid driving.",
    mechanism: "Additive CNS sedation.",
  },
];

// ── Emergency red flag symptoms ───────────────────────────────────────────────
export const EMERGENCY_SYMPTOMS = [
  "chest pain", "chest tightness", "chest pressure",
  "difficulty breathing", "can't breathe", "not breathing",
  "face drooping", "arm weakness", "speech difficulty",
  "sudden confusion", "sudden severe headache",
  "throat closing", "throat swelling",
  "coughing blood", "vomiting blood", "blood in stool",
  "unconscious", "unresponsive", "seizure",
  "severe allergic reaction", "anaphylaxis",
  "suicidal", "self harm", "want to die",
  "overdose",
];

// ── Self-care advice by symptom category ──────────────────────────────────────
export const SELF_CARE_TIPS: Record<string, string[]> = {
  cold: [
    "Rest as much as possible — your body needs energy to fight infection",
    "Drink plenty of fluids: water, herbal tea, clear broth",
    "Use a humidifier or steam to ease congestion",
    "Honey (1 tsp) can soothe a cough in adults — do not give to children under 1",
    "Saline nasal spray can relieve congestion safely",
    "Symptoms typically improve within 7–10 days",
  ],
  headache: [
    "Drink a full glass of water — dehydration is a very common headache trigger",
    "Rest in a quiet, dark room",
    "Apply a cold or warm compress to your forehead or neck",
    "Over-the-counter pain relievers (ibuprofen or acetaminophen) at the recommended dose",
    "Avoid screens and bright light",
    "Caffeine withdrawal can cause headaches — a small amount of caffeine may help",
  ],
  stomach: [
    "Sip clear fluids slowly — water, diluted juice, oral rehydration solution",
    "Eat bland foods when you can tolerate them: bananas, rice, applesauce, toast (BRAT diet)",
    "Avoid dairy, fatty, spicy, or high-fiber foods until feeling better",
    "Rest — your digestive system needs a break",
    "Wash hands thoroughly to avoid spreading illness to others",
    "See a doctor if vomiting or diarrhea lasts more than 2 days, or if signs of dehydration appear",
  ],
  fever: [
    "Stay well-hydrated — fever increases fluid loss significantly",
    "Rest — your immune system is working hard",
    "Light, breathable clothing and a comfortable room temperature",
    "Acetaminophen or ibuprofen can reduce fever and discomfort",
    "Seek medical care if fever exceeds 39.5°C (103°F), lasts more than 3 days, or is accompanied by a stiff neck or rash",
    "Children: seek care sooner — high fever in young children requires prompt evaluation",
  ],
  back_pain: [
    "Continue gentle movement — bed rest for more than 1–2 days makes back pain worse",
    "Apply ice for the first 48–72 hours to reduce inflammation",
    "Switch to heat after 72 hours to relax muscles",
    "Over-the-counter anti-inflammatories (ibuprofen) can help",
    "Gentle stretching: knee-to-chest stretch, cat-cow stretch",
    "See a doctor if pain radiates down the leg, or if you notice numbness or weakness",
  ],
  anxiety: [
    "Box breathing: inhale 4 counts, hold 4, exhale 4, hold 4 — repeat 4–6 times",
    "Ground yourself: name 5 things you can see, 4 you can touch, 3 you can hear",
    "Physical exercise — even a 20-minute walk significantly reduces anxiety",
    "Limit caffeine and alcohol, which can worsen anxiety",
    "Talk to someone you trust",
    "Apps like Headspace, Calm, or Woebot offer free guided exercises",
    "A doctor can discuss therapy and medication options that are highly effective",
  ],
};
