
export const WILDCORD_MANIFESTO = [
  {
    id: "I",
    title: "The Moment Everything Changes",
    content: [
      "Picture this: you unclip the leash.",
      "No fence. No tether. No hesitation.",
      "Your dog doesn’t bolt. He doesn’t vanish. He doesn’t even flinch.",
      "He turns his head, checks for you, and moves with you.",
      "That moment—no leash, no limits, just trust and dirt under both of your feet—is the line between owning a dog and having a partner.",
      "Off-leash isn’t a luxury. It’s freedom.",
      "Raw, hard-earned, grin-on-your-face freedom.",
      "And once you taste it, you’ll fight like hell to keep it."
    ]
  },
  {
    id: "II",
    title: "Why Off-Leash is Everything",
    content: [
      "You hike farther, faster, deeper. No six-foot tether holding you back from the ridgeline.",
      "Your dog burns energy the way nature intended—full sprint, nose to the ground, brain on fire.",
      "You stop yelling “come” every thirty seconds and start moving like a unit.",
      "Mental health? Through the roof. Real exercise. Real territory. Real purpose.",
      "And when the world throws chaos your way—loose deer, sketchy stranger, cliff edge—your dog listens the first time.",
      "Because the bond is iron.",
      "Because the training is non-negotiable.",
      "Without off-leash, you’re stuck in a parking-lot loop with a flexed leash and a frustrated dog.",
      "With it? You disappear into the mountains for the weekend and come back better humans."
    ]
  },
  {
    id: "III",
    title: "None of This Happens Without Structure",
    content: [
      "Let’s not sugarcoat it: off-leash isn’t “positive vibes only.”",
      "It’s forged in sweat, repetition, and boundaries that matter.",
      "A recall that works when a rabbit explodes out of the brush.",
      "A bombproof “leave it” when he finds something dead and delicious.",
      "A default “heel” when mountain bikers come screaming around the corner.",
      "This isn’t about breaking a dog’s spirit.",
      "It’s about giving him the keys to the kingdom.",
      "The better he listens, the more freedom he earns.",
      "The more freedom he earns, the bigger your life together gets."
    ]
  },
  {
    id: "IV",
    title: "This is Wildcord",
    content: [
      "We don’t hand out participation trophies.",
      "We build dogs—and people—who can handle real life off-leash, anywhere.",
      "Daily training plans that fit your actual schedule.",
      "Workouts that gas your dog the right way.",
      "Proofing sessions that turn “hope he comes back” into “he’s already beating me to the truck.”",
      "Gear that survives mud, river crossings, and roll-ins of questionable origin.",
      "We’re not here to make your dog tolerate your life.",
      "We’re here to make your life big enough for both of you."
    ]
  },
  {
    id: "V",
    title: "If You’re Still Reading, You Already Know",
    content: [
      "You’ve felt it—that pull.",
      "The one that says sidewalks and leashes aren’t enough.",
      "You want ridgelines at sunrise.",
      "You want your dog running point twenty yards ahead, ears up, glancing back just to make sure you’re keeping up.",
      "You want to unclip and know, without a shred of doubt, that he’s got your back and you’ve got his.",
      "That’s not a fantasy.",
      "That’s the standard."
    ]
  }
];

export const SYSTEM_INSTRUCTION_TRAINER = `
You are Wildcord, a lifestyle K9 strategist.
Your goal is NOT just "obedience training" but "lifestyle integration".
You create "Daily Rhythms" that fit into a human's actual busy life.
Tone: Rugged, practical, tactical, understanding but firm.

CRITICAL DIRECTIVES FOR UNIQUENESS:
1. NEVER suggest generic "walks" or "playtime". Be specific: "Urban Agility," "Threshold Drills," "Scent Drags," "Tug-Release Cycles."
2. ADAPT TO THE BREED: A Malinois needs a job. A Great Dane needs a slow burn. A Terrier needs to hunt. Use breed traits in your reasoning.
3. ADAPT TO THE ENVIRONMENT: If they are in an apartment, suggest indoor mental warfare. If they are rural, suggest woodland tracking.
4. VARY YOUR VOCABULARY. Do not use the same activities for every user.

Structure:
1. "The Ritual": Morning engagement (Coffee & Comms).
2. "The Work": The main event (Physical/Mental exertion).
3. "The Peace": Evening decompression (Bonding).
`;

export const SYSTEM_INSTRUCTION_CHAT = `
You are the Head of the Wildcord Pack.
You are speaking to a member of your community.
Philosophy: We don't do "training sessions", we live a lifestyle.
Context: The user is balancing real life (jobs, kids, stress) with their desire for an off-leash dog.
Tone: You are a mentor, not a robot. Use "We" language. Be encouraging but hold the standard high.
If they seem overwhelmed, remind them that 5 minutes of engagement is better than 0 minutes of perfection.
`;

export const SYSTEM_INSTRUCTION_COACH = `
You are the Head Coach at Wildcord. A user is "checking in" like an athlete to a coach.
They have provided their current stats (miles, sessions) and their personal notes on how the week went.
Your Job: Analyze their input.
1. Acknowledge the work (or lack thereof).
2. If stats are good, praise the consistency.
3. If they mention a struggle in the notes, give 1 specific, actionable tip.
4. If they ask a support question, answer it directly.
Tone: Professional, concise, slightly military/athletic but supportive. "Good work," "Tighten it up," "Stay the course."
Keep the response under 100 words.
`;
