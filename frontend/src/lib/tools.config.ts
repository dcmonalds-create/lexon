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
        text: 'I am about to sign an employment contract. Country: [YOUR COUNTRY]. Key terms: salary [AMOUNT], notice period [X weeks], non-compete clause included. Please analyze the risks.',
      },
      {
        label: '🏠 Rental agreement',
        text: 'I am signing a rental lease agreement. Country: [YOUR COUNTRY]. Monthly rent: [AMOUNT]. Deposit: [AMOUNT]. Lease duration: [X months]. Please analyze the risks and red flags.',
      },
      {
        label: '🤝 Freelance contract',
        text: 'I am signing a freelance services contract as an independent contractor. Country: [YOUR COUNTRY]. Project value: [AMOUNT]. Payment terms: [NET 30/upfront etc]. Please analyze risks.',
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
        label: '🚗 Parking ticket',
        text: 'I received a parking ticket. Amount: [AMOUNT]. City/Country: [LOCATION]. Date: [DATE]. Reason given: [REASON]. Situation: I was [EXPLAIN what you were doing, e.g. unloading, emergency, signage unclear].',
      },
      {
        label: '📷 Speed camera fine',
        text: 'I received a speed camera fine. Amount: [AMOUNT]. Country: [COUNTRY]. Date: [DATE]. Alleged speed: [X] in a [Y] zone. I believe this is wrong because [REASON, e.g. I was not driving, signs not visible, camera malfunction].',
      },
      {
        label: '📋 Admin penalty',
        text: 'I received an administrative penalty/fine from a government agency. Amount: [AMOUNT]. Country: [COUNTRY]. Issuing authority: [NAME]. Reason: [REASON]. I want to dispute it because [YOUR GROUNDS].',
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
        text: 'My landlord is refusing to return my deposit. Country/City: [LOCATION]. Deposit amount: [AMOUNT]. Move-out date: [DATE]. Weeks since move-out: [X]. Apartment condition: [good/had minor wear]. Landlord reason: [what they said].',
      },
      {
        label: '🔧 Repairs ignored',
        text: 'My landlord is refusing to fix a serious problem in my rental. Country/City: [LOCATION]. Issue: [describe problem, e.g. broken heating, water leak, mold]. How long ignored: [X weeks/months]. I have notified them [X times] by [email/text/verbal].',
      },
      {
        label: '🚪 Illegal eviction threat',
        text: 'My landlord is threatening to evict me or has already changed the locks. Country/City: [LOCATION]. Tenancy duration: [X years/months]. Reason given by landlord: [REASON]. I believe this is illegal because [YOUR REASON]. Rent status: [up to date / X weeks behind].',
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
        text: 'I was fired from my job. Country: [COUNTRY]. Years employed: [X]. Notice given: [none/X days]. Reason given: [REASON]. Written contract: [yes/no]. I believe the termination was unlawful because [YOUR REASON].',
      },
      {
        label: '⏰ Unpaid wages/overtime',
        text: 'My employer owes me unpaid wages or overtime. Country: [COUNTRY]. Amount owed: approximately [AMOUNT]. Period: [DATE RANGE]. Type: [overtime/withheld salary/bonus]. I have [asked/not asked] HR about this.',
      },
      {
        label: '⚠️ Harassment/discrimination',
        text: 'I am experiencing harassment or discrimination at work. Country: [COUNTRY]. Type: [sexual harassment/racial discrimination/bullying/etc]. Duration: [X months]. Perpetrator: [colleague/manager/HR]. I have reported it: [yes/no]. Evidence I have: [emails/witnesses/etc].',
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
        label: '📦 Broken/defective product',
        text: 'I bought a product that arrived broken or stopped working. Country: [COUNTRY]. Store: [online/physical, name]. Purchase date: [DATE]. Amount: [AMOUNT]. Problem: [DESCRIBE DEFECT]. Seller response: [refused refund/ignored me/offered repair only].',
      },
      {
        label: '🚚 Never delivered',
        text: 'I paid for a product or service that was never delivered. Country: [COUNTRY]. Seller: [NAME/website]. Amount: [AMOUNT]. Order date: [DATE]. Expected delivery: [DATE]. Seller response: [no response/delayed again/blaming courier].',
      },
      {
        label: '🔄 Subscription cancelled but charged',
        text: 'A company is charging me after I cancelled a subscription. Country: [COUNTRY]. Company: [NAME]. Cancellation date: [DATE]. Charges since: [AMOUNT] over [X months]. I have proof of cancellation: [yes/no].',
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
        label: '₿ BTC/ETH trading profits',
        text: 'I made profits from buying and selling crypto. Country: [COUNTRY]. Tax year: [YEAR]. Coins traded: [BTC/ETH/etc]. Approximate total profit: [AMOUNT in local currency]. I have been trading for [X years]. I have/have not reported this before.',
      },
      {
        label: '🔒 Staking & yield rewards',
        text: 'I earned crypto through staking or yield farming. Country: [COUNTRY]. Tax year: [YEAR]. Protocol/platform: [NAME]. Estimated rewards received: [AMOUNT in crypto and USD value]. I am unsure if this counts as income or capital gains.',
      },
      {
        label: '🖼️ NFT sales',
        text: 'I bought and sold NFTs. Country: [COUNTRY]. Tax year: [YEAR]. Number of transactions: approximately [X]. Total proceeds: approximately [AMOUNT]. Total cost basis: approximately [AMOUNT]. Net profit/loss: [AMOUNT].',
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
        text: 'I need help filling out a visa application. Visa type: [tourist/work/student/etc]. Applying for: [COUNTRY]. My nationality: [COUNTRY]. I am confused about: [SPECIFIC SECTION or "the whole form"]. My situation: [briefly describe travel purpose, employment, etc].',
      },
      {
        label: '🏦 Tax return',
        text: 'I need help with my tax return. Country: [COUNTRY]. Tax year: [YEAR]. Form name: [e.g. Form 1040, Self Assessment, etc]. My situation: [employed/self-employed/both]. I am confused about: [SPECIFIC SECTION, e.g. deductions, foreign income, etc].',
      },
      {
        label: '🛂 Work/residence permit',
        text: 'I need to fill out a work or residence permit application. Country: [COUNTRY]. Permit type: [work/residence/family reunification]. My current status: [tourist/student/etc]. My employer/sponsor: [yes/no]. I am confused about: [SPECIFIC PART of the form].',
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
        text: 'Non-Disclosure Agreement between me ([YOUR NAME / COMPANY]) and a freelancer ([FREELANCER NAME]). Jurisdiction: [COUNTRY]. Confidentiality period: [X months/years]. Project: [describe what information to protect, e.g. software source code, business strategy, client data].',
      },
      {
        label: '💻 Freelance contract',
        text: 'Freelance services contract. Client: [YOUR NAME / COMPANY]. Freelancer: [FREELANCER NAME]. Country: [COUNTRY]. Services: [describe work, e.g. web development, logo design]. Total fee: [AMOUNT]. Payment: [e.g. 50% upfront, 50% on delivery]. Deadline: [DATE or timeframe]. IP ownership goes to the client.',
      },
      {
        label: '✉️ Demand letter',
        text: 'Formal demand letter from [YOUR NAME] to [RECIPIENT / COMPANY]. Country: [COUNTRY]. Dispute: [describe the issue, e.g. unpaid invoice of €X, defective product, breach of contract]. Amount or remedy demanded: [X]. Deadline to respond: [e.g. 14 days]. Consequence if ignored: [e.g. legal proceedings, small claims court].',
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
