export interface RuleRequirementsState {
  collateral: boolean;
  coborrower: boolean;
}

type RuleRequirementsPayload = Partial<{
  collateral: boolean;
  coborrower: boolean;
  requires_collateral: boolean;
  requires_coborrower: boolean;
}>;

export const emptyRuleRequirements = (): RuleRequirementsState => ({
  collateral: false,
  coborrower: false,
});

export const parseRuleRequirements = (
  payload: RuleRequirementsPayload | null | undefined,
): RuleRequirementsState => ({
  collateral: Boolean(payload?.collateral ?? payload?.requires_collateral),
  coborrower: Boolean(payload?.coborrower ?? payload?.requires_coborrower),
});

export const buildRuleEvaluationHeaders = (): Record<string, string> => {
  const csrfToken =
    typeof document !== "undefined"
      ? document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") ?? ""
      : "";

  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
    ...(csrfToken ? { "X-CSRF-TOKEN": csrfToken } : {}),
  };
};
