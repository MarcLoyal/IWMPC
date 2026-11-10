/**
 * Loan estimate using flat (simple) interest with equal monthly amortization:
 *
 *   interest = principal × monthly rate × months
 *   monthly  = (principal + interest) ÷ months
 *
 * This is the method named in the build spec; confirm it matches the
 * cooperative's actual computation (and any service fees, share-capital
 * retention or insurance deducted from proceeds) before launch.
 */

export type LoanInput = {
  principal: number;
  /** Interest per month, in percent (e.g. 1.5 for 1.5% a month). */
  monthlyRatePercent: number;
  termMonths: number;
};

export type LoanEstimate = {
  principal: number;
  totalInterest: number;
  totalPayable: number;
  monthlyAmortization: number;
};

export type LoanError = "principal" | "rate" | "term";

const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;

export function loanInputErrors(input: LoanInput): LoanError[] {
  const errors: LoanError[] = [];
  if (!Number.isFinite(input.principal) || input.principal <= 0)
    errors.push("principal");
  if (
    !Number.isFinite(input.monthlyRatePercent) ||
    input.monthlyRatePercent < 0
  )
    errors.push("rate");
  if (!Number.isInteger(input.termMonths) || input.termMonths < 1)
    errors.push("term");
  return errors;
}

export function estimateLoan(input: LoanInput): LoanEstimate {
  const errors = loanInputErrors(input);
  if (errors.length > 0)
    throw new RangeError(`invalid loan input: ${errors.join(", ")}`);

  const { principal, monthlyRatePercent, termMonths } = input;
  const totalInterest = round2(
    principal * (monthlyRatePercent / 100) * termMonths,
  );
  const totalPayable = round2(principal + totalInterest);
  return {
    principal,
    totalInterest,
    totalPayable,
    // Rounded to centavos; the final payment absorbs any rounding difference.
    monthlyAmortization: round2(totalPayable / termMonths),
  };
}
