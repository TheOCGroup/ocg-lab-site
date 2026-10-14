/**
 * TED Super Agent — build execution behavior (Phase 2.2).
 *
 * TED is not a chatbot waiting for perfectly worded commands. When the
 * founder has a technical objective, TED tracks it as an ACTIVE BUILD and
 * moves through stages conversationally:
 *
 *   idea -> requirements -> research -> architecture -> build-plan
 *        -> implementation -> testing -> qa -> deployment-recommendation
 *
 * He infers the technical objective, asks for missing requirements ONLY when
 * they actually matter (max 3, plain English), recommends an approach, spots
 * problems, remembers the active build across turns, keeps working through
 * multi-step tasks, and says plainly when he needs a founder decision.
 *
 * Founder-friendly by default: technical detail appears on request or when
 * necessary. No dashboard, no exposed routing — the build lives in the
 * conversation.
 */

export type BuildStage =
  | 'idea'
  | 'requirements'
  | 'research'
  | 'architecture'
  | 'build-plan'
  | 'implementation'
  | 'testing'
  | 'qa'
  | 'deployment';

export interface BuildDecision {
  question: string;
  /** Why TED can't decide this alone. */
  whyItMatters: string;
  options?: string[];
}

export interface BuildContext {
  /** Short project name, e.g. "Real estate investor AI product". */
  projectName: string;
  stage: BuildStage;
  /** What TED inferred the founder wants to build. */
  objective: string;
  /** Confirmed requirements (founder-stated or confirmed). */
  requirements: string[];
  /** Open questions TED genuinely needs answered. Max 3. */
  decisionsNeeded: BuildDecision[];
  /** Problems TED spotted. */
  risks: string[];
  /** Recommended approach, in plain English. */
  recommendedApproach: string | null;
  updatedAt: number;
}

export function emptyBuild(): BuildContext | null {
  return null;
}

const normalized = (value: string): string =>
  value.toLowerCase().replace(/[’]/g, "'").replace(/\s+/g, ' ').trim();

/** Founder signals they want to move from idea to building. */
export function wantsBuildPlan(message: string): boolean {
  const q = normalized(message);
  return (
    /let'?s build|start building|build it|make it real|plan (it|this|the build)/.test(q) ||
    /how do we (build|start|make)/.test(q) ||
    /architecture for|tech stack for/.test(q)
  );
}

/**
 * Infer the technical objective from the idea draft. Plain English, one or
 * two sentences — a starting point the founder can correct, not a spec.
 */
export function inferObjective(ideaDraft: string): string {
  const d = normalized(ideaDraft);
  const bits: string[] = [];
  if (/real estate|investor|property|deal/.test(d)) bits.push('real-estate investors');
  if (/ai\b|artificial intelligence|llm|gpt|Muse|agent/.test(d)) bits.push('AI assistance');
  if (/etsy|shop|store|sell|product/.test(d)) bits.push('selling a product');
  if (/app|platform|dashboard|tool/.test(d)) bits.push('a usable app');
  if (/saas|subscription|monthly/.test(d)) bits.push('recurring revenue');
  if (bits.length === 0) return 'a working product from this idea';
  return bits.join(' + ');
}

/**
 * Identify missing requirements that ACTUALLY matter — the 2-3 decisions
 * that change the architecture. Never a 20-question form.
 */
export function identifyMissingRequirements(ideaDraft: string): BuildDecision[] {
  const d = normalized(ideaDraft);
  const decisions: BuildDecision[] = [];
  if (!/who|user|customer|investor|seller|buyer/.test(d) || /real estate/.test(d)) {
    decisions.push({
      question: 'Who exactly is this for — what does that person do all day?',
      whyItMatters: 'The user determines everything: web app vs mobile, simple vs power-user, price point.',
    });
  }
  if (!/money|revenue|price|subscription|saas|sell/.test(d)) {
    decisions.push({
      question: 'How does it make money — one-time, subscription, or something else?',
      whyItMatters: 'Revenue model drives the build: auth, billing, and account structure differ completely.',
    });
  }
  if (!/mvp|first version|start/.test(d)) {
    decisions.push({
      question: 'What does version one do — the single thing it must do well?',
      whyItMatters: 'Scope is where builds die. One sharp feature ships; five vague ones stall.',
    });
  }
  return decisions.slice(0, 3);
}

/** Plain-English stage names for the founder. */
export function stageLabel(stage: BuildStage): string {
  switch (stage) {
    case 'idea': return 'idea';
    case 'requirements': return 'requirements';
    case 'research': return 'research';
    case 'architecture': return 'architecture';
    case 'build-plan': return 'build plan';
    case 'implementation': return 'implementation';
    case 'testing': return 'testing';
    case 'qa': return 'QA';
    case 'deployment': return 'deployment recommendation';
  }
}

/**
 * Start tracking an active build from the idea draft.
 */
export function startBuild(projectName: string, ideaDraft: string): BuildContext {
  const objective = inferObjective(ideaDraft);
  return {
    projectName,
    stage: 'requirements',
    objective,
    requirements: [],
    decisionsNeeded: identifyMissingRequirements(ideaDraft),
    risks: [],
    recommendedApproach: null,
    updatedAt: Date.now(),
  };
}

/**
 * Advance the build conversationally. Returns the reply and updated context.
 * Each stage asks for what's needed, recommends, and moves on — never stalls
 * waiting for perfect input.
 */
export function advanceBuild(
  build: BuildContext,
  message: string,
  opts: { researchAvailable: boolean; toolsAvailable: boolean },
): { reply: string; build: BuildContext } {
  const q = normalized(message);
  const next: BuildContext = { ...build, updatedAt: Date.now() };

  switch (build.stage) {
    case 'requirements': {
      // Founder answered (or skipped) — capture anything useful, move on.
      if (q.length > 8) {
        next.requirements = [...build.requirements, message.trim().slice(0, 200)];
      }
      if (next.requirements.length >= 2 || /skip|not sure|you decide|whatever/.test(q)) {
        next.stage = 'research';
        next.decisionsNeeded = [];
        return {
          build: next,
          reply:
            `Good — I've got enough to work with. Moving to research: ` +
            `${opts.researchAvailable ? "I'll check what's current out there now." : 'my live research isn\'t connected, so I\'ll work from stable knowledge and flag what to verify.'}`,
        };
      }
      const remaining = build.decisionsNeeded.slice(next.requirements.length);
      if (remaining.length === 0) {
        next.stage = 'research';
        return { build: next, reply: `Requirements captured. Moving to research.` };
      }
      const d = remaining[0];
      return {
        build: next,
        reply: `${d.question}\n\n${d.whyItMatters}`,
      };
    }
    case 'research': {
      next.stage = 'architecture';
      return {
        build: next,
        reply:
          `Research noted. Here's the architecture I'd recommend for "${build.objective}": ` +
          `a focused web app — one backend, one database, auth and billing from day one if there's revenue. ` +
          `Say "looks good" and I'll turn it into a build plan, or push back on any of it.`,
      };
    }
    case 'architecture': {
      if (/looks good|yes|good|ok|agree|sounds/.test(q)) {
        next.stage = 'build-plan';
        next.recommendedApproach = build.recommendedApproach ?? 'Focused web app: single backend, one database, auth + billing from day one.';
        return {
          build: next,
          reply:
            `Build plan for "${build.projectName}":\n\n` +
            `1. Project scaffold + repo\n2. Data model + database\n3. Core feature: ${build.objective}\n` +
            `4. Auth + billing\n5. Tests\n6. QA pass\n7. Deployment recommendation\n\n` +
            `${opts.toolsAvailable ? 'I can start on the scaffold now — say "go".' : 'To implement this I\'ll need my tool bridge running — say "go" and I\'ll tell you exactly what to start.'}`,
        };
      }
      next.recommendedApproach = message.trim().slice(0, 300);
      next.stage = 'build-plan';
      return { build: next, reply: `Noted — going with your call on architecture. Build plan is ready when you say "go".` };
    }
    case 'build-plan': {
      if (/^go\b|go ahead|do it|start/.test(q)) {
        if (opts.toolsAvailable) {
          next.stage = 'implementation';
          return { build: next, reply: `On it — starting implementation. I'll report each step with evidence.` };
        }
        return {
          build: next,
          reply:
            `I can't run the build from here yet — my tool bridge isn't connected. ` +
            `Start it and I'll move through implementation, testing, and QA with real results. ` +
            `Meanwhile, want me to write out the implementation steps in detail?`,
        };
      }
      return { build: next, reply: `Say "go" when you're ready and I'll start ${opts.toolsAvailable ? 'implementing' : 'walking through implementation'}.` };
    }
    default: {
      return { build: next, reply: `We're at ${stageLabel(build.stage)} on "${build.projectName}". What's next?` };
    }
  }
}

/** Founder-facing summary of the active build. Short — voice-friendly. */
export function buildStatusLine(build: BuildContext): string {
  const bits = [`"${build.projectName}" is at ${stageLabel(build.stage)}`];
  if (build.decisionsNeeded.length > 0) {
    bits.push(`${build.decisionsNeeded.length} decision${build.decisionsNeeded.length === 1 ? '' : 's'} needed`);
  }
  if (build.risks.length > 0) {
    bits.push(`${build.risks.length} risk${build.risks.length === 1 ? '' : 's'} spotted`);
  }
  return bits.join(' — ') + '.';
}
