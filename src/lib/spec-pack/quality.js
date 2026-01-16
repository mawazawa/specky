const daysBetween = (start, end) => {
  const ms = end - start;
  return Math.floor(ms / (1000 * 60 * 60 * 24));
};

export const classifyStaleness = (decisions, verificationDate) => {
  const fresh = [];
  const verify = [];
  const stale = [];
  const baseline = new Date(verificationDate);

  for (const decision of decisions) {
    const verifiedAt = new Date(decision.verifiedAt);
    const ageDays = daysBetween(verifiedAt, baseline);
    if (ageDays > 90) {
      stale.push(decision.id);
    } else if (ageDays >= 30) {
      verify.push(decision.id);
    } else {
      fresh.push(decision.id);
    }
  }

  return { fresh, verify, stale };
};

const computeFreshnessScore = ({ fresh, verify, stale }) => {
  const total = fresh.length + verify.length + stale.length;
  if (total === 0) return 0;
  const score = (fresh.length * 1 + verify.length * 0.7 + stale.length * 0.4) / total;
  return Math.round(score * 100);
};

export const buildQualityReport = ({ decisions, tasks, verificationDate }) => {
  const missingCitations = decisions.filter((decision) => !decision.sources?.length).map((decision) => decision.id);
  const atomicTaskFailures = tasks.filter((task) => task.files.length > 3).map((task) => task.id);

  const staleness = classifyStaleness(decisions, verificationDate);
  const citationCoverage = decisions.length === 0 ? 0 : Math.round(((decisions.length - missingCitations.length) / decisions.length) * 100);
  const freshnessScore = computeFreshnessScore(staleness);
  const tasksScore = atomicTaskFailures.length === 0 ? 95 : 50;
  const requirementsScore = Math.round((citationCoverage + freshnessScore) / 2);
  const designScore = requirementsScore;
  const overallScore = Math.round((requirementsScore + designScore + tasksScore) / 3);

  return {
    overallScore,
    sections: {
      requirements: requirementsScore,
      design: designScore,
      tasks: tasksScore,
    },
    staleness,
    violations: {
      missingCitations,
      atomicTaskFailures,
    },
  };
};
