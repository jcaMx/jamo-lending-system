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
