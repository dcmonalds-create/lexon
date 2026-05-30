import type { Tool } from '../types';

export const TOOLS: Tool[] = [
  {
    id: 'signsafe',
    name: 'SignSafe',
    tagline: 'Contract risk scanner',
    description: 'Paste any contract and get a plain-language breakdown of dangerous clauses, hidden fees, and what you are actually signing away.',
    icon: 'FileText',
    color: 'bg-emerald-50',
    inputType: 'textarea',
    inputLabel: 'Paste your contract text or upload the document',
    inputPlaceholder: 'Paste the full contract here, or upload a photo/PDF above...',
    price: 1,
    templates: [
      {
        label: '💼 Employment contract',
        text: 'I am about to sign an employment contract and need a full risk analysis.\n\nCountry / jurisdiction: [COUNTRY]\nRole: [JOB TITLE] at a [startup / mid-size / corporate] company\nSalary: [AMOUNT + currency], [permanent / fixed-term]\nProbation period: [X months]\nNotice period: [X weeks/months]\n\nKey clauses I am concerned about:\n- Non-compete clause: [yes / no — if yes, duration and scope]\n- IP ownership: [does the contract claim rights to work done outside hours?]\n- Termination conditions: [describe any unusual terms]\n- Other clauses that seem unusual: [describe]\n\nMy main concern: [what specifically worries you about this contract?]',
      },
      {
        label: '🏠 Rental agreement',
        text: 'I am about to sign a rental lease and need a full risk analysis.\n\nCountry / city: [COUNTRY, CITY]\nMonthly rent: [AMOUNT + currency]\nDeposit amount: [AMOUNT — how many months rent?]\nLease duration: [X months, fixed-term / rolling]\nProperty type: [apartment / house / room]\n\nClauses I am concerned about:\n- Rent increase terms: [describe — e.g. landlord can raise by X% every Y months]\n- Repair responsibilities: [what does the contract say the tenant must pay for?]\n- Guest / subletting restrictions: [describe]\n- Early termination: [what penalty if I leave early?]\n- Any other unusual terms: [describe]\n\nMy main concern: [what specifically worries you?]',
      },
      {
        label: '🤝 Freelance contract',
        text: 'I am signing a freelance / independent contractor agreement and need a full risk analysis.\n\nCountry / jurisdiction: [COUNTRY]\nMy role: [freelancer / contractor]\nClient type: [agency / startup / corporation]\nProject: [describe the work briefly]\nTotal fee: [AMOUNT + currency]\nPayment terms: [upfront / milestone / on delivery / NET 30]\nProject duration: [X weeks/months]\n\nClauses I am concerned about:\n- Revision / change requests: [unlimited? capped?]\n- IP / copyright ownership: [when does it transfer? any conditions?]\n- Liability clause: [any indemnification or limitation of liability?]\n- Dispute resolution: [court / arbitration / which jurisdiction?]\n- Non-solicitation or non-compete: [yes / no]\n\nMy main concern: [what specifically worries you?]',
      },
    ],
  },
  {
    id: 'finebot',
    name: 'FineBot',
    tagline: 'Dispute any fine or ticket',
    description: 'Got a parking ticket or admin penalty? Get a ready-to-send dispute letter tailored to your jurisdiction in under 60 seconds.',
    icon: 'AlertTriangle',
    color: 'bg-amber-50',
    inputType: 'form',
    inputLabel: 'Describe your fine or upload a photo of it',
    inputPlaceholder: 'e.g. Parking fine, €80, issued in Lisbon Portugal on 15 May 2026. I was parked for 10 minutes while unloading...',
    price: 1,
    templates: [
      {
        label: '🚗 Parking / traffic fine',
        text: 'I received a fine and want to dispute it.\n\nCountry / city: [COUNTRY, CITY]\nFine type: [parking / speeding / traffic violation / bus lane / other]\nFine amount: [AMOUNT + currency]\nIssuing authority: [e.g. municipal police / traffic authority / private company]\nDate issued: [DATE]\nAppeal deadline: [DATE or X days shown on notice]\n\nOfficial reason stated on notice: [copy the exact wording]\n\nWhat actually happened: [describe the full situation — what you were doing, how long you were there, any mitigating factors]\n\nGrounds I believe I have to dispute it:\n- [e.g. signage was unclear / I was not the driver / procedural error on notice / emergency circumstances]\n\nEvidence I have: [photos / dashcam / witness / receipt / medical document / other]',
      },
      {
        label: '📷 Speed camera fine',
        text: 'I received a speed camera fine and want to challenge it.\n\nCountry: [COUNTRY]\nFine amount: [AMOUNT + currency]\nPenalty points: [X points, if applicable]\nAlleged speed: [X km/h or mph] in a [Y] zone\nDate of alleged offence: [DATE]\nDeadline to respond: [DATE or X days]\nI am: [the driver / the registered owner but not the driver]\n\nWhy I believe the fine is wrong:\n- [e.g. I was not speeding / I was not the driver at the time / camera location is disputed / calibration concerns / signs were not visible]\n\nEvidence I have: [dashcam footage / alibi / witness / GPS data / other]',
      },
      {
        label: '📋 Administrative penalty',
        text: 'I received an administrative fine or penalty from a government authority and want to contest it.\n\nCountry: [COUNTRY]\nIssuing authority: [e.g. tax office / environmental agency / labour inspectorate / municipality]\nFine amount: [AMOUNT + currency]\nReason stated: [describe what the authority claims you violated]\nDate issued: [DATE]\nDeadline to contest: [DATE or X days]\n\nWhy I believe the penalty is unjust or disproportionate:\n- [e.g. I was not aware of the requirement / I had already complied / the rule was applied incorrectly / procedural error]\n\nPrior communication with the authority: [yes / no — if yes, describe]\nEvidence I have: [documents / correspondence / receipts / permits / other]',
      },
    ],
  },
  {
    id: 'tenantshield',
    name: 'TenantShield',
    tagline: 'Know your rental rights',
    description: 'Describe your landlord issue and get your exact legal rights plus a templated demand letter.',
    icon: 'Home',
    color: 'bg-purple-50',
    inputType: 'textarea',
    inputLabel: 'Describe your rental issue or upload evidence',
    inputPlaceholder: 'e.g. My landlord in Berlin refuses to return my €1200 deposit after I moved out 6 weeks ago...',
    price: 1,
    templates: [
      {
        label: '💰 Deposit not returned',
        text: 'My landlord is refusing to return my deposit after I moved out.\n\nCountry / city: [COUNTRY, CITY]\nDeposit amount: [AMOUNT + currency]\nMove-out date: [DATE]\nTime since move-out: [X weeks]\nLease type: [fixed-term / rolling monthly]\nRent was: [fully up to date / X weeks overdue]\n\nCondition of property at move-out: [excellent / normal wear and tear / some damage — describe]\nDid you have a move-in / move-out inspection report? [yes / no]\nPhotos or evidence of condition: [yes / no]\n\nLandlord\'s reason for withholding: [describe exactly what they claim]\nDeductions they are demanding: [list each item and amount]\n\nCommunication so far: [describe — emails sent, responses received, how many weeks have passed]',
      },
      {
        label: '🔧 Landlord refusing repairs',
        text: 'My landlord is refusing to carry out necessary repairs to my rental property.\n\nCountry / city: [COUNTRY, CITY]\nType of tenancy: [private / social / student housing]\nMonthly rent: [AMOUNT + currency]\nLease remaining: [X months]\n\nProblem requiring repair: [describe in detail — e.g. broken heating, water leak, mould, structural issue, pest infestation]\nIs this affecting health or safety? [yes / no — describe impact]\nHow long has the problem existed? [X weeks / months]\n\nHow I notified the landlord:\n- [number of times, method: email / text / phone / letter, dates if known]\nLandlord\'s response: [ignored / promised to fix but did not / refused / offered inadequate solution]\n\nEvidence I have: [photos / written correspondence / medical records / other]',
      },
      {
        label: '🚪 Illegal eviction',
        text: 'My landlord is threatening to evict me or has taken action I believe is unlawful.\n\nCountry / city: [COUNTRY, CITY]\nTenancy duration: [X years / months]\nLease type: [fixed-term — expires DATE / rolling monthly]\nRent status: [fully up to date / X weeks overdue]\n\nWhat the landlord has done or threatened:\n- [e.g. verbally told me to leave / sent a letter / changed locks / removed belongings / cut off utilities]\n\nNotice given: [none / X days — was it written or verbal?]\nReason given by landlord: [e.g. wants property back / claims non-payment / selling property / other]\n\nWhy I believe this is unlawful: [describe your understanding]\nEvidence I have: [tenancy agreement / correspondence / photos / witness]\nIs this urgent (immediate threat)? [yes / no]',
      },
    ],
  },
  {
    id: 'workershield',
    name: 'WorkerShield',
    tagline: 'Employment rights checker',
    description: 'Describe what happened at work — wrongful termination, unpaid overtime, or harassment — and get a legal action plan.',
    icon: 'Briefcase',
    color: 'bg-blue-50',
    inputType: 'textarea',
    inputLabel: 'Describe your work situation or upload relevant documents',
    inputPlaceholder: 'e.g. I was fired by email with no notice after 3 years at the company in the UK...',
    price: 1,
    templates: [
      {
        label: '🔴 Wrongful termination',
        text: 'I was dismissed from my job and I believe it was unlawful.\n\nCountry: [COUNTRY]\nYears / months employed: [X]\nContract type: [permanent / fixed-term / probationary / zero-hours]\nRole: [JOB TITLE]\n\nHow I was dismissed: [in person / by letter / by email / verbally]\nNotice given: [none / X days — what does my contract specify?]\nOfficial reason given by employer: [exact wording if possible]\nPrior disciplinary warnings: [none / X warnings — describe]\n\nWhy I believe the dismissal was unlawful:\n- [e.g. no valid reason / discriminatory / retaliation for complaint / procedural breach / during protected period such as maternity/sick leave]\n\nDocumentation I have: [contract / termination letter / payslips / performance reviews / emails / other]\nHave I raised a grievance internally? [yes / no]\nTime since dismissal: [X days / weeks]',
      },
      {
        label: '⏰ Unpaid wages',
        text: 'My employer owes me money and is refusing to pay.\n\nCountry: [COUNTRY]\nEmployment type: [employed / contractor / zero-hours]\nAmount owed: approximately [AMOUNT + currency]\nType of unpaid amount: [overtime / withheld salary / unpaid bonus / commission / holiday pay / other]\nPeriod this covers: [DATE RANGE]\n\nHow the underpayment happened:\n- [e.g. hours recorded incorrectly / bonus conditions disputed / salary not paid at all / deductions made without consent]\n\nWhat my contract or agreement says about this: [describe the relevant terms]\nHave I raised this with HR or management? [yes / no — if yes, their response]\nEvidence I have: [payslips / timesheets / contract / emails / messages]\nIs my employment ongoing or have I left? [still employed / left on DATE]',
      },
      {
        label: '⚠️ Harassment / discrimination',
        text: 'I am experiencing harassment or discrimination at work and want to know my legal options.\n\nCountry: [COUNTRY]\nType of issue: [sexual harassment / racial discrimination / age discrimination / bullying / victimisation / other — describe]\nWho is responsible: [direct manager / colleague / HR / senior leadership]\nDuration: [X weeks / months]\n\nSpecific incidents (describe the most significant ones):\n1. [date, what happened, who was present]\n2. [date, what happened, who was present]\n\nHave you reported it internally? [yes / no]\nIf yes — to whom, when, and what was the response?\n\nEvidence I have: [emails / messages / witness names / medical records / HR correspondence]\nImpact on me: [describe — e.g. forced to resign / demoted / anxiety / sick leave]',
      },
    ],
  },
  {
    id: 'refundforce',
    name: 'RefundForce',
    tagline: 'Force a refund or chargeback',
    description: 'Describe your consumer dispute and get the exact legal template and escalation path to force a refund.',
    icon: 'Receipt',
    color: 'bg-red-50',
    inputType: 'textarea',
    inputLabel: 'Describe your consumer dispute or upload the receipt/invoice',
    inputPlaceholder: 'e.g. I bought a laptop from an online store in Italy 3 weeks ago. It arrived broken...',
    price: 1,
    templates: [
      {
        label: '📦 Defective product',
        text: 'I purchased a product that is defective or not as described and the seller is refusing to help.\n\nCountry: [COUNTRY]\nSeller type: [online retailer / physical store / marketplace like Amazon/eBay]\nSeller location: [same country / different country — specify]\nProduct: [describe item]\nPurchase price: [AMOUNT + currency]\nPurchase date: [DATE]\nPayment method: [credit card / debit card / PayPal / bank transfer — card type if known]\n\nDefect / problem: [describe exactly what is wrong]\nWhen defect appeared: [on arrival / after X days of use]\nDid you report it to the seller? [yes — on DATE / no]\nSeller\'s response: [refused / offered repair only / blamed me / no response]\n\nEvidence I have: [photos / videos / delivery photos / written seller response / other]\nHave you already attempted a return? [yes / no — describe outcome]',
      },
      {
        label: '🚚 Item not delivered',
        text: 'I paid for a product or service that was never delivered and I want my money back.\n\nCountry: [COUNTRY]\nSeller / company: [NAME and website if online]\nSeller location: [same country / abroad — specify]\nAmount paid: [AMOUNT + currency]\nPayment method: [credit card / debit card / PayPal / bank transfer — card type if known]\nOrder date: [DATE]\nPromised delivery date: [DATE]\n\nCurrent situation: [tracking stuck / no tracking provided / seller says it was delivered but I never received it / seller went silent]\nTime since expected delivery: [X weeks]\n\nCommunication with seller:\n- [number of contacts, dates, what they said]\n\nWhat I want: [full refund / reshipment]\nHave you opened a dispute with PayPal or your bank yet? [yes / no]',
      },
      {
        label: '🔄 Unauthorised charges',
        text: 'A company is charging me for a subscription or service I cancelled or never agreed to.\n\nCountry: [COUNTRY]\nCompany name: [NAME]\nCharge amount: [AMOUNT per month/year]\nTotal charged since issue began: [AMOUNT over X months]\nPayment method: [credit card / debit card — card network: Visa / Mastercard / Amex]\n\nWhat happened:\n- [e.g. I cancelled but charges continued / I was enrolled in auto-renewal without clear consent / free trial converted to paid without warning]\n\nCancellation date: [DATE]\nDo you have proof of cancellation? [yes — describe / no]\nCompany\'s response when contacted: [describe — e.g. partial refund offered, said cancellation did not go through]\n\nWhat I want: [full refund of all unauthorised charges / cancellation confirmed / both]',
      },
    ],
  },
  {
    id: 'tokenlegal',
    name: 'TokenLegal',
    tagline: 'Crypto tax & legal check',
    description: 'Describe your crypto activities and get a jurisdiction-specific tax and legal risk summary.',
    icon: 'Coins',
    color: 'bg-yellow-50',
    inputType: 'textarea',
    inputLabel: 'Describe your crypto situation or upload a transaction statement',
    inputPlaceholder: 'e.g. I am in Romania. I staked ETH in 2024 and earned ~2 ETH in rewards...',
    price: 1,
    templates: [
      {
        label: '₿ Trading profits',
        text: 'I made profits from buying and selling cryptocurrency and need to understand my tax obligations.\n\nCountry of tax residence: [COUNTRY]\nTax year: [YEAR]\nCoins traded: [BTC / ETH / altcoins — specify]\nApproximate total proceeds from sales: [AMOUNT + local currency]\nApproximate total cost of coins sold: [AMOUNT + local currency]\nNet gain / loss: [AMOUNT]\nHolding periods: [all under 1 year / some over 1 year / all over 1 year]\n\nHave you reported crypto income before? [yes / no]\nDo you have full transaction records? [yes — from which exchange(s) / partial / no]\nOther relevant details: [e.g. crypto-to-crypto swaps, DeFi activity, losses to offset]\n\nMain questions I have:\n- [e.g. which tax category applies / what rate / which form to use / can I offset losses]',
      },
      {
        label: '🔒 Staking & yield',
        text: 'I earned cryptocurrency through staking, yield farming, or lending and need to understand my tax obligations.\n\nCountry of tax residence: [COUNTRY]\nTax year: [YEAR]\nPlatform / protocol: [e.g. Binance / Lido / Aave / Coinbase]\nActivity type: [proof-of-stake staking / liquidity pool / lending / other]\nCrypto received as rewards: [AMOUNT in crypto — e.g. 2 ETH]\nApproximate fiat value at time of receipt: [AMOUNT + local currency]\nHave you sold the rewards yet? [yes — at what price / no — current value approximately X]\n\nHave you reported this type of income before? [yes / no]\nFull transaction history available? [yes / partial / no]\n\nMain questions I have:\n- [e.g. is this income or capital gains / what rate applies / does social/payroll tax apply / which form to use]',
      },
      {
        label: '🖼️ NFT & DeFi activity',
        text: 'I have complex cryptocurrency activity including NFTs or DeFi and need a tax analysis.\n\nCountry of tax residence: [COUNTRY]\nTax year: [YEAR]\n\nActivity breakdown:\n- NFT sales: [number of transactions, total proceeds, total cost basis, net gain/loss]\n- DeFi / liquidity pools: [describe activity and approximate amounts]\n- Airdrops received: [yes / no — describe and approximate value]\n- Crypto received as payment for work: [yes / no — describe]\n\nHave you kept records of all transactions? [yes / partial / no — which exchanges/wallets]\nHave you reported crypto taxes before? [yes / no]\n\nMain questions I have:\n- [e.g. how are NFT profits taxed / do airdrops count as income at receipt / which form to use / can I offset losses across different activities]',
      },
    ],
  },
  {
    id: 'docwizard',
    name: 'DocWizard',
    tagline: 'Any government form, explained',
    description: 'Describe or paste a government form and get a plain-language guide on how to fill it correctly.',
    icon: 'ScrollText',
    color: 'bg-teal-50',
    inputType: 'textarea',
    inputLabel: 'Describe the form or upload a photo of it',
    inputPlaceholder: 'e.g. I have to fill out a Form DS-160 (US visa application)...',
    price: 1,
    templates: [
      {
        label: '✈️ Visa application',
        text: 'I need help understanding and completing a visa application correctly.\n\nVisa type: [tourist / business / student / family reunification / work / other]\nCountry I am applying to: [COUNTRY]\nMy nationality: [COUNTRY]\nCountry I currently live in: [COUNTRY]\nApplication method: [online portal / paper form / consulate appointment]\nForm name or number (if known): [e.g. DS-160 / Schengen Form C / other]\n\nSections I am confused about:\n1. [describe the specific field or section — e.g. "previous visa refusals" / "purpose of visit" / "financial means"]\n2. [another section if applicable]\n\nMy specific situation that may affect the application:\n- [e.g. self-employed / gaps in employment / prior visa refusal / dual nationality / family ties in destination country]\n\nDocuments I have / am unsure about: [list what you have and what you are not sure is needed]',
      },
      {
        label: '🏦 Tax return',
        text: 'I need guidance on completing my tax return correctly.\n\nCountry: [COUNTRY]\nTax year: [YEAR]\nForm / system: [e.g. Self Assessment / Form 1040 / Déclaration 2042 / other]\nMy income situation: [employed / self-employed / both / retired / investor]\n\nIncome sources this year:\n- Employment (PAYE/salary): [AMOUNT or "not applicable"]\n- Self-employment / freelance: [AMOUNT or "not applicable"]\n- Rental income: [AMOUNT or "not applicable"]\n- Investment / dividends: [AMOUNT or "not applicable"]\n- Other: [describe]\n\nExpenses / deductions I am claiming: [describe — e.g. home office / equipment / professional subscriptions]\nSpecific sections I am confused about: [describe]\nHave I filed this type of return before? [yes / no]\nDeadline: [DATE if known]',
      },
      {
        label: '🛂 Residence / work permit',
        text: 'I need to apply for a residence or work permit and need a step-by-step guide.\n\nCountry I am applying in: [COUNTRY]\nPermit type: [work permit / residence permit / permanent residency / family reunification / other]\nMy current nationality: [COUNTRY]\nMy current immigration status in this country: [tourist visa / student visa / already resident / just arrived / other]\n\nReason for application: [e.g. new job offer / marriage to local resident / study / long-term stay]\nEmployer or sponsor: [yes — company name / no]\nHow long have I been in this country: [X months / years / not yet arrived]\n\nSpecific parts of the process I am confused about: [describe — e.g. which form to use / what documents are required / whether to apply inside or outside the country / processing time]\nIs this urgent? [yes — explain deadline / no]',
      },
    ],
  },
  {
    id: 'lexdraft',
    name: 'LexDraft',
    tagline: 'AI document generator',
    description: 'Describe any legal document you need and get a complete, lawyer-quality draft in seconds. NDAs, freelance contracts, demand letters, consent forms — all tailored to your jurisdiction.',
    icon: 'PenLine',
    color: 'bg-violet-50',
    inputType: 'textarea',
    inputLabel: 'Describe the document you need',
    inputPlaceholder: 'e.g. NDA between me and a freelancer, Romanian law, 6-month confidentiality, covers software development work for my startup...',
    price: 1,
    templates: [
      {
        label: '🤫 NDA',
        text: 'I need a Non-Disclosure Agreement drafted.\n\nJurisdiction / governing law: [COUNTRY]\nParty 1 (disclosing party): [my name / company name and role — e.g. "my startup as the disclosing party"]\nParty 2 (receiving party): [other party name and role — e.g. "a freelance developer"]\n\nWhat confidential information needs protecting:\n- [e.g. source code / business strategy / client data / product roadmap / financial information]\n\nKey terms I need:\n- Confidentiality period: [X months / years / indefinite]\n- Is this mutual (both parties share secrets) or one-way? [mutual / one-way]\n- Should work-for-hire / IP ownership be addressed? [yes / no]\n- Remedy for breach: [injunctive relief / damages / both]\n- Any non-solicitation clause needed? [yes / no]\n\nContext: [briefly describe the business relationship and why you need this NDA]',
      },
      {
        label: '💻 Freelance contract',
        text: 'I need a freelance services agreement drafted.\n\nJurisdiction / governing law: [COUNTRY]\nClient (commissioning party): [name / company]\nFreelancer / contractor: [name]\nServices to be performed: [describe the work — e.g. web development / logo design / copywriting]\n\nCommercial terms:\n- Total fee: [AMOUNT + currency]\n- Payment structure: [e.g. 50% upfront / milestone-based / on delivery / NET 30]\n- Project timeline: [X weeks / specific deadline]\n- Revision rounds included: [X rounds or unlimited]\n\nKey clauses I need:\n- IP / copyright ownership: [transfers to client on full payment / freelancer retains license / other]\n- Subcontracting: [permitted / not permitted]\n- Termination: [X days notice / for cause only / other]\n- Liability cap: [yes — limit to fee paid / no specific cap]\n- Confidentiality: [yes / no]\n- Dispute resolution: [court / arbitration — which jurisdiction]',
      },
      {
        label: '✉️ Demand letter',
        text: 'I need a formal legal demand letter drafted.\n\nJurisdiction / governing law: [COUNTRY]\nSender: [your name / company]\nRecipient: [name / company]\n\nNature of the dispute:\n- [e.g. unpaid invoice / breach of contract / property damage / failure to deliver / other]\n\nAmount demanded: [AMOUNT + currency]\nBasis for the claim: [describe — e.g. invoice issued on DATE for services delivered and accepted, payment due by DATE per contract]\nPrior attempts to resolve: [describe — informal emails, calls, how many, dates, responses received]\n\nWhat I want the letter to demand:\n- Payment / specific performance / both\n- Response deadline: [X days — e.g. 14 days]\n- Consequence if ignored: [legal proceedings / small claims court / credit reporting / other]\n\nTone required: [firm and professional / final warning / opening position]',
      },
    ],
  },
  {
    id: 'toscanner',
    name: 'ToScan',
    tagline: 'Any Terms of Service, exposed',
    description: 'Paste any website URL and get a trust score, top red flags with exact quotes, what data they collect, rights you waive, and what to do before agreeing.',
    icon: 'Link',
    color: 'bg-indigo-50',
    inputType: 'url',
    inputLabel: 'Website or Terms of Service URL',
    inputPlaceholder: 'https://airbnb.com',
    price: 1,
    templates: [
      {
        label: '🏠 Airbnb',
        text: 'https://www.airbnb.com/terms',
      },
      {
        label: '🎵 Spotify',
        text: 'https://www.spotify.com/legal/end-user-agreement/',
      },
      {
        label: '📱 TikTok',
        text: 'https://www.tiktok.com/legal/page/eea/terms-of-service/en',
      },
    ],
  },
];

export function getToolById(id: string): Tool | undefined {
  return TOOLS.find((t) => t.id === id);
}
