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
        text: 'I am about to sign an employment contract in Germany. The role is a Software Engineer at a mid-size tech company. Key terms: €72,000 gross annual salary, 3-month probation period, 3-month notice period after probation, a non-compete clause preventing me from working for competitors for 12 months after leaving, and a clause saying all IP I create — even outside work hours — belongs to the company. Please analyze the risks and flag anything I should push back on before signing.',
      },
      {
        label: '🏠 Rental agreement',
        text: 'I am signing a 12-month rental lease in the Netherlands. Monthly rent: €1,450. Deposit: €2,900 (2 months). The contract includes a clause allowing the landlord to increase rent by up to 5% every 6 months, a restriction on having any guests stay longer than 7 consecutive days, and a clause saying I am responsible for all repairs under €500. Please identify the red flags and anything that may not be enforceable under Dutch law.',
      },
      {
        label: '🤝 Freelance contract',
        text: 'I am signing a freelance contract as an independent contractor in the UK. Client is a London-based marketing agency. Project: brand redesign and website. Total fee: £8,500, payment terms: 30% upfront, 70% on delivery with no milestone payments. The contract says the client can request unlimited revisions, ownership of all work transfers only after final payment, and any disputes go to arbitration rather than court. Please analyze the risks and what I should negotiate before signing.',
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
        text: 'I received a €60 parking fine in Barcelona, Spain. It was issued on a Tuesday afternoon. I had stopped on a yellow line for approximately 10 minutes to unload heavy groceries — there was no loading bay available on the street. The signage showing the yellow line restriction was partially covered by a tree branch and not clearly visible from where I parked. I have 20 days to appeal according to the notice. Please assess my grounds for dispute and draft a formal appeal letter.',
      },
      {
        label: '📷 Speed camera fine',
        text: 'I received a speed camera fine of £100 + 3 penalty points in the UK. The notice says I was doing 36mph in a 30mph zone on a road I drive regularly. I am certain I was not speeding — I had cruise control set to 30mph. I also believe the camera may not have been properly calibrated as there have been complaints about it online. I am the registered owner but I was not the driver at the time. The deadline to respond is 28 days. Please advise on my options.',
      },
      {
        label: '📋 Admin penalty',
        text: 'I received an administrative fine of €250 from the Romanian tax authority (ANAF) for allegedly failing to register a freelance contract on time. I was not notified of the requirement beforehand and only discovered this rule after receiving the fine. I am a sole trader who did register my business but was unaware of the contract registration requirement for certain types of agreements. I want to dispute the fine. Please assess whether I have valid grounds and draft a formal contestation.',
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
        text: 'My landlord in Berlin, Germany is refusing to return my €1,800 deposit. I moved out 7 weeks ago and left the apartment in excellent condition — I have photos taken on move-out day showing no damage. The landlord is claiming deductions for "general wear and tear" including repainting the walls (which were the same colour as when I moved in) and replacing a door handle that was already broken at check-in. I have sent two emails requesting the deposit return with no satisfactory response. Please explain my legal rights and draft a formal demand letter.',
      },
      {
        label: '🔧 Repairs ignored',
        text: 'My landlord in Dublin, Ireland has ignored a serious damp and mould problem in my apartment for 3 months. The mould is in the bedroom and has spread to clothing and furniture. I have notified the landlord 4 times — twice by text, twice by email — and each time they say they will "sort it out" but nothing has been done. My 12-month lease runs for another 8 months and rent is €1,600/month. I am worried about health impacts. Please tell me what my rights are and what action I can take.',
      },
      {
        label: '🚪 Illegal eviction threat',
        text: 'My landlord in Madrid, Spain is threatening to change the locks next week if I do not leave. I have been renting this apartment for 2.5 years on a rolling monthly contract. My rent is fully up to date. The landlord says he wants the property back for a family member. He gave me a verbal notice of only 2 weeks. I have nowhere to go and I believe he is not following the correct legal process. Please advise on my rights and what steps to take immediately.',
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
        text: 'I was dismissed from my job in France without proper notice or justification. I had been employed as an account manager for 4 years with a permanent (CDI) contract and no prior disciplinary warnings. My employer sent a registered letter terminating my contract citing "economic reasons" but the company posted record profits last quarter and hired 3 people in my department since I left. I received only 2 weeks notice despite my contract specifying 3 months. I believe this dismissal is without real and serious cause. Please advise on my rights and potential compensation.',
      },
      {
        label: '⏰ Unpaid wages/overtime',
        text: 'My employer in Poland owes me approximately 8,500 PLN in unpaid overtime from the past 6 months. I work as a warehouse supervisor averaging 52 hours per week but am paid for only 40. My contract specifies overtime at 150% rate but the company records my hours incorrectly to avoid paying. I have my own timesheets and WhatsApp messages from my manager asking me to stay late. I raised this with HR twice and was dismissed. Please advise on my legal options.',
      },
      {
        label: '⚠️ Harassment/discrimination',
        text: 'I am experiencing systematic bullying and discriminatory treatment at my workplace in the Netherlands. I am the only non-Dutch speaker in my team and my manager regularly excludes me from meetings, assigns worse projects, and has made comments about my accent in front of colleagues. This has been ongoing for 5 months. I reported it to HR 6 weeks ago and nothing changed. I have emails and two colleagues willing to support my account. Please advise on my legal options.',
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
        text: 'I bought a €349 laptop from an online store in Italy 5 weeks ago. It arrived with a cracked screen hinge and the keyboard backlight does not work. I reported the defects within 48 hours of delivery with photos. The seller first offered to repair it, then said the damage was caused by me and refused any remedy. I did not cause this damage — the box had visible dents when it arrived. I paid by Visa credit card. Please advise on my statutory rights under Italian/EU consumer law and the best strategy to get a full refund or replacement.',
      },
      {
        label: '🚚 Never delivered',
        text: 'I ordered a €520 item from an online retailer based in Portugal 6 weeks ago. The expected delivery was within 5 business days. The tracking number has shown "in transit" for 5 weeks without movement. The seller keeps telling me to wait and refuses to refund or reship. I paid via PayPal using my debit card. The seller is not responding to my last three messages sent over the past 2 weeks. Please advise on how to get my money back — refund process, PayPal dispute, and chargeback options.',
      },
      {
        label: '🔄 Subscription trap',
        text: 'A software company in the US is charging me £29.99/month even though I cancelled my subscription 3 months ago. I cancelled through their website and have a confirmation email. They have charged me a total of £89.97 since cancellation. When I contacted support they said my cancellation "did not process correctly" and offered only a 1-month refund. I paid by Mastercard. Please advise on my rights and how to recover all three months of unauthorised charges.',
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
        text: 'I am a tax resident in Germany and made profits from buying and selling Bitcoin and Ethereum during 2025. I bought 0.5 BTC at an average cost of €28,000 total and sold it at €41,000 total — a gain of approximately €13,000. I also traded ETH several times with a net profit of around €3,200. I have held some coins for less than 1 year and some for more than 1 year. I have never reported crypto before and I am not sure what my obligations are. Please explain my German tax position and what I need to declare.',
      },
      {
        label: '🔒 Staking rewards',
        text: 'I am a tax resident in Hungary and earned staking rewards through Binance during 2025. I staked ETH and received approximately 2 ETH in rewards over the year. The fair market value of those rewards at the time of receipt was approximately $3,200 in total. I have not sold the ETH yet. I am not sure whether this is classified as income or capital gains, what rate applies, and whether any social contribution tax is due on top of income tax. Please give me a precise analysis of my Hungarian tax obligations for these staking rewards.',
      },
      {
        label: '🖼️ NFT sales',
        text: 'I am a tax resident in the UK and sold several NFTs during the 2025/26 tax year. Total proceeds from NFT sales: approximately £18,500. Total amount I originally paid for the NFTs I sold: approximately £9,200. Net gain: approximately £9,300. I also have some NFTs I have not sold. I am unsure whether this falls under capital gains tax or income tax, what my annual CGT allowance is for 2025/26, and whether I need to report this on my Self Assessment. Please advise.',
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
        text: 'I need help filling out a Schengen visa application (Form C) to visit Italy for 2 weeks as a tourist. I am a Romanian citizen currently living in Canada on a work permit. I am confused about the "previous Schengen visas" section — I had a French Schengen visa 3 years ago but I cannot find the exact dates. I am also unsure what to put for "accommodation" since I am staying with a friend, not a hotel. My sponsor letter is in French — does it need to be translated? Please guide me through the sections I need to be careful about.',
      },
      {
        label: '🏦 Tax return',
        text: 'I need help with my UK Self Assessment tax return for the 2025/26 tax year. I was employed full-time (PAYE) earning £52,000 but also did freelance graphic design on the side earning approximately £8,400. I have business expenses for software subscriptions and equipment of about £1,200. I am unsure which expenses I can legitimately deduct, whether I need to register for VAT, and how the employment income interacts with the freelance income for tax purposes. Please guide me through what I need to declare and calculate.',
      },
      {
        label: '🛂 Residence permit',
        text: 'I need to apply for a long-term residence permit (permesso di soggiorno per lavoro) in Italy. I am a Brazilian national who has just accepted a full-time job offer from a company in Milan. My employer has confirmed they will sponsor my work visa. I need to understand the full process: which forms to complete, what documents to gather, whether I apply at the consulate in Brazil first or after arriving, and what the typical processing time is. I am particularly confused about the "Nulla Osta" procedure and the role of the Sportello Unico per l\'Immigrazione.',
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
        text: 'I need a Non-Disclosure Agreement under Romanian law between my startup (I am the founder) and a freelance developer I am hiring to build the backend of our SaaS product. The freelancer will have access to our source code, business logic, unreleased product roadmap, and client data architecture. I need: a 3-year confidentiality term, a clause covering all work-related communications and materials, an exception for information that becomes publicly available, and a clause specifying that breach allows me to seek injunctive relief without posting a bond. Please draft the complete NDA.',
      },
      {
        label: '💻 Freelance contract',
        text: 'I need a freelance services contract under English law between my UK company (the client) and a freelance UX designer based in Portugal. The project is a full redesign of our web application. Total fee: £12,000. Payment structure: £3,000 upfront, £4,500 at delivery of wireframes, £4,500 on final delivery. Timeline: 10 weeks. All intellectual property created must transfer to my company on final payment. The designer may not subcontract. I want a clause allowing me to terminate with 14 days notice if the work quality is not meeting agreed standards. Please draft the full contract.',
      },
      {
        label: '✉️ Demand letter',
        text: 'I need a formal legal demand letter under German law. I am a freelancer and a client owes me €4,200 for a completed web development project. The work was delivered and accepted in writing on 14 March 2026. The payment was due within 30 days per our contract but has not been received despite two informal reminders. I need the letter to: state the amount owed with interest accruing under §288 BGB, give a final 14-day deadline for payment, and warn that I will pursue the matter through the Mahnverfahren (payment order procedure) and report to Creditreform if payment is not received. Please draft the complete demand letter.',
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
