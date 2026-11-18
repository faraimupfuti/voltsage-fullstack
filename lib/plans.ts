/** Single source of truth for access rules and plan numbers shown on the site. */

/** Free standard-mode assessments an unauthenticated visitor gets before an account is required. */
export const FREE_TRIES = 2

/**
 * Authorised users per Company subscription.
 * NOTE: the Fair Use Policy document said six, while the Terms of Service said ten (and, in one
 * sentence, fifteen). The site uses this one value everywhere. Change it here to change both pages.
 */
export const COMPANY_USERS = 10

/** Date shown on the Terms and Fair Use pages. The source documents still said "[Insert date]". */
export const LEGAL_UPDATED = '17 November 2026'

/** Two kinds of account, each with its own sign-in tab. */
export type AccountType = 'individual' | 'organisation'

/** Tools that are not open to every signed-in account. */
export type AccessFeature = 'networkDesign'

/**
 * Which account type may use which restricted tool.
 *
 * Everything else (all four sizing tools in Standard and Advanced mode, PDF reports in Advanced mode,
 * Boujie calculations) is the same for both, matching the Terms: the plans differ by seats and administration.
 * Network Design is the exception. It is a multi-step BOQ / circuit / earthing design tool for installers, EPCs
 * and companies designing for clients, and neither the Terms nor the Fair Use Policy lists it, so it is set to
 * organisation accounts. Flip the flag below to open it to individuals.
 */
export const ACCESS: Record<AccountType, Record<AccessFeature, boolean>> = {
  individual: { networkDesign: false },
  organisation: { networkDesign: true },
}
