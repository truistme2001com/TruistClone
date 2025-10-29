import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export function Disclosures() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="bg-gray-50 border-t border-border">
      <div className="max-w-7xl mx-auto px-4">
        {/* Disclosure Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full py-6 flex items-center justify-between text-left hover:bg-gray-100 transition-colors"
          aria-expanded={isOpen}
        >
          <span className="text-base font-medium text-foreground">Disclosures</span>
          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          )}
        </button>

        {/* Disclosure Content */}
        {isOpen && (
          <div className="pb-8 text-sm text-muted-foreground space-y-6">
            <div className="space-y-4">
              <p>
                <sup>1</sup> Rates may vary based on branch location and whether you open an account in a branch, by phone or online. Interest rates and APYs are accurate as of 9/23/2025 and are subject to change without notice at any time, including after the account is opened.
              </p>
              
              <p>
                To qualify for any promotional interest rate shown below, clients must open a new Truist Business Money Market account. Clients whose Taxpayer Identification Number (TIN) is listed as the primary owner of an existing Truist money market account or an existing Truist Simple Business Savings account or clients who have closed a Truist money market account or Truist Simple Business Savings account within 30 days of the new Truist Business Money Market account opening are not eligible. To qualify for the 3.50% offer, clients must open a new Truist Business Money Market account at a Truist branch by calling 844-4TRUIST. Members FDIC.
              </p>

              <h4 className="font-semibold text-foreground mt-6">Greater Philadelphia</h4>
              <p>
                To qualify for the 4.00% APY offer, clients must open a new Truist Business Money Market account in at a Truist branch in the Greater Philadelphia area, or for online or phone account opening, the business's physical address must be in the Greater Philadelphia area. The Greater Philadelphia area includes the following counties in Pennsylvania: Bucks, Montgomery, Delaware, Philadelphia, Chester and the following counties in New Jersey: Salem, Camden, Burlington, Gloucester. This special promotional rate is limited to small business clients only. Accounts opened by Institutional, Commercial, Corporate and Wealth clients are not eligible for the special promotional rate and will revert to the standard rate after account opening. The 4.00% APY special rate offer is for eligible accounts with balances from $0.01 - $5,000,000. If the Money Market account's average ledger balance exceeds $5,000,000, your eligible account will automatically upgrade to the 2.25% APY rate. As the bank's standard, the variable interest rate and APY are both 0.01%. Fees may reduce earnings. Your new Money Market Account could initially earn a rate lower than $5,000,000 until 30 calendar days of account opening, your eligible account will automatically upgrade to the 2.25% APY rate.
              </p>

              <h4 className="font-semibold text-foreground mt-6">Texas and Ohio</h4>
              <p>
                To qualify for the 4.25% APY offer, clients must open a new Truist Business Money Market account in Texas or Ohio at a Truist branch, or for phone or online account opening, the business's physical address must be located in Texas or Ohio. This special promotional rate is limited to small business clients only. Accounts opened by Institutional, Commercial, Corporate and Wealth clients are not eligible for the special promotional rate and will revert to the standard rate after account opening. The 4.25% APY special rate offer is for eligible accounts with balances from $0.01 - $5,000,000. If the Money Market account's average ledger balance exceeds $5,000,000, your eligible account will automatically upgrade to the 2.25% APY rate. As the bank's standard, the variable interest rate and APY are both 0.01%. Fees may reduce earnings. Your new Money Market Account could initially earn a rate lower than $5,000,000 until 30 calendar days of account opening, your eligible account will automatically upgrade to the 2.25% APY rate.
              </p>

              <p className="mt-6">
                <sup>2</sup> The Truist Business Money Market account interest tiers are based on the following ledger balance tiers: Tier 1 - $0.01 to $999.99; Tier 2 - $1,000 to $9,999.99; Tier 3 - $10,000 to $49,999.99; Tier 4 - $50,000 to $99,999.99; Tier 5 - $100,000 to $249,999.99; Tier 6 - $250,000 or greater. For new accounts, the promotional Interest Rate is 3.44% and the Annual Percentage Yield (APY) is 3.50% for Tiers 1–6. Your new Money Market Account could initially earn a rate lower than the promotional rate until 30 days after account opening.
              </p>

              <h4 className="font-semibold text-foreground mt-6">Terms and Conditions for Truist One Checking $400 Online Offer 2025: TRUIST25DC400</h4>
              
              <p className="mt-4">
                <strong>Offer Information:</strong> Open a new Truist One Checking account online from 5/1/25 through 10/29/25, receive at least 2 qualifying Direct Deposits* totaling $1,000 or more within 120 days of account opening and earn $400.
              </p>

              <p>
                Account must be opened online. Enrollment in the promotion is required at the time of account opening using promo code TRUIST25DC400. Please refer to the Account Opening and Enrollment section below for full instructions.
              </p>

              <p>
                *A qualifying Direct Deposit is an electronic credit (greater than $5.00) of your salary, pension, Social Security or other regular monthly income deposited into your new checking account by your employer or outside agency via ACH. Person to person payments (such as Zelle®) or deposits made via a branch, ATM, online transfer, mobile device, debit/prepaid card number or the mail are not eligible direct deposits.
              </p>

              <p className="mt-4">
                <strong>Offer Eligibility:</strong> Clients that are the primary account holder on an existing personal checking account with Truist or who have closed a personal checking account with Truist on or after 5/1/24 are not eligible to participate. Offer valid for Truist One Checking accounts only. Primary account holder must be 18 or older at the time of account opening. Truist employees, Directors, Officers, and Local Boards/Advisors are not eligible. Offer available only to US residents with a valid Social Security number.
              </p>

              <p className="mt-4">
                <strong>Reward Processing:</strong> The reward will be deposited to the new checking account within 4 weeks after the qualification requirements have been met and verified. In order to receive the reward, the new checking account must be open, not restricted, and in good standing with a balance of at least $0.01 at the time of Truist verification and at the time of payout. An account is considered restricted if it has a temporary or permanent block that prevents credits from posting to the account.
              </p>

              <p className="mt-4">
                <strong>Reward Forfeiture:</strong> Reward forfeiture will occur if: (1) the new checking account is changed to an account type not included in this client offer prior to payout, (2) the new checking account has a $0.00 or negative available balance or is restricted at the time Truist verifies the qualification requirements have been met or (3) the new checking account is closed or restricted at the time of payout.
              </p>

              <p className="mt-4">
                <strong>Other Terms:</strong> Minimum opening deposit is $50. The offer is non-transferable, may not be combined with any other checking offers, is subject to change, and may be discontinued at any time. Truist reserves the right, in its sole discretion: 1) to prohibit a reward payout for any offers claimed through third-party websites with no affiliation or prior authorization from Truist; and 2) to disqualify any account if Truist suspects accounts are being opened for the purpose of exploiting promotional offers. Final determinations for all matters related to this offer will be made by Truist (including all determinations regarding eligibility, enrollment, qualification requirements and award disbursements) will be considered final, and no further disbursements will be made.
              </p>

              <p className="mt-4">
                <strong>Account Opening & Enrollment Instructions:</strong> To open and enroll your new account in the promotion, visit the offer website and click on "Open an account online." Enter TRUIST25DC400 into the promo code field provided, review the offer Terms and Conditions, and then select "Accept Offer". Accounts opened without the promo code applied will not be eligible to participate in the offer. Once enrolled in the promotion, clients may receive promotional updates via the email address provided or by calling 800-709-8700.
              </p>

              <p className="mt-4 text-xs">
                Version 2 03262025 TRUIST25DC400
              </p>

              <p className="mt-4">
                Truist Bank, Member FDIC. ©2025, Truist Financial Corporation. Truist, Truist Purple and the Truist Logo are service marks of Truist Financial Corporation.
              </p>

              <div className="mt-8 pt-6 border-t border-border">
                <h4 className="font-semibold text-foreground mb-4">Disclosures</h4>
                
                <p className="mb-4">
                  Truist Bank, Member FDIC. © 2025 Truist Financial Corporation. Truist, the Truist logo, Truist Purple, LightStream, and the LightStream logo are service marks of Truist Financial Corporation.
                </p>

                <p className="mb-4">Equal Housing Lender</p>

                <div className="mb-4">
                  <p className="font-semibold">Investment and Insurance Products:</p>
                  <ul className="list-disc ml-6 mt-2">
                    <li>Are Not FDIC or any other Government Agency Insured</li>
                    <li>Are Not Bank Guaranteed</li>
                    <li>May Lose Value</li>
                  </ul>
                </div>

                <p className="mb-4">
                  TRUIST is a service mark of Truist Financial Corporation (Truist) and its affiliates.
                </p>

                <p className="mb-4">
                  Services provided by Truist Financial Corporation (Truist) affiliates: Banking products and services, including loans and deposit accounts, provided by Truist Bank, Member FDIC. Trust and investment management services provided by Truist Bank. Securities, brokerage accounts and/or annuities offered by Truist Investment Services, Inc., an SEC registered broker-dealer, and member FINRA and SIPC, and a licensed insurance agency. Investment advisory services offered by Truist Advisory Services, Inc., and/or GFO Advisory Services, LLC, SEC registered investment advisers. Group insurance products offered by Truist Life Insurance Services, Inc. and/or affiliates of Marsh & McLennan Agency LLC, including Kensington Vanguard National Land Services, and Crump Life Insurance Services. Truist Life Insurance Services (TLIS) is a division of Crump, Arkansas License #100109477. Variable insurance material is for broker-dealer or registered representative use only. Variable products not available in all states.
                </p>

                <p className="mb-4">
                  Marsh & McLennan Agency LLC, Kensington Vanguard National Land Services, Crump Life Insurance Services, Truist Life Insurance Services, and P.J. Robb Variable, LLC are not affiliated with Truist Financial Corporation or any of its subsidiaries.
                </p>

                <p className="mb-4">
                  Truist Securities is a trademark of Truist Financial Corporation. Truist Securities is a trade name for the corporate and investment banking services of Truist and its subsidiaries. All rights reserved. Securities and strategic advisory services are provided by Truist Securities, Inc., member FINRA and SIPC. Lending, financial risk management, and treasury management and payment services are offered by Truist Bank.
                </p>

                <p className="mb-4">
                  Mortgage products and services are offered through Truist Bank. All Truist mortgage professionals are registered on the Nationwide Mortgage Licensing System & Registry (NMLS), which promotes uniformity and transparency throughout the residential real estate industry. Search the NMLS Registry.
                </p>

                <p className="mb-4">
                  Comments regarding tax implications are informational only. Truist and its representatives do not provide tax or legal advice. You should consult your individual tax or legal professional before taking any action that may have tax or legal consequences.
                </p>

                <p className="mb-4">
                  "Truist Advisors" may be officers and/or associated persons of the following affiliates of Truist, Truist Investment Services, Inc., and/or Truist Advisory Services, Inc. Truist Wealth, International Wealth, Center for Family Legacy, Business Owner Specialty Group, Sports and Entertainment Group, and Legal and Medical Specialty Groups are trade names used by Truist Bank, Truist Investment Services, Inc., and Truist Advisory Services, Inc.
                </p>

                <p className="mb-4">
                  <strong>Limited English Proficiency Support:</strong> Applications, agreements, disclosures, and other servicing communications provided by Truist Bank and its subsidiary businesses will be provided in English. As a result, it will be necessary for customers to speak, read and understand English or to have an appropriate translator assisting them. Please note that Truist provides translations of webpages, documents and disclosures as a courtesy and in the event of any inconsistencies or discrepancies, the English version will prevail.
                </p>

                <p className="mb-4">
                  <strong>New York City residents:</strong> Translation or other language access services may be available. When calling our office regarding collection activity, if you speak a language other than English and need verbal translation services, be sure to inform the representative. A description and translation of commonly-used debt collection terms is available in multiple languages at <a href="http://www.nyc.gov/dca" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">http://www.nyc.gov/dca</a>.
                </p>

                <p>
                  <strong>Borrowers with Limited English Proficiency (LEP)</strong> needing information can use the following resources:
                  The Consumer Finance Protection Bureau (CFPB) also provides additional resources for homeowners seeking payment assistance in select languages at: <a href="https://www.consumerfinance.gov/housing/housing-insecurity/help-for-homeowners/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://www.consumerfinance.gov/housing/housing-insecurity/help-for-homeowners/</a>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
