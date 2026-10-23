import { ConversationAnalysis, RouteCategory } from '../types/routing';

export interface PreGeneratedRecordAnalysis {
  record_ref: string;
  source_id: string;
  primary_route: RouteCategory;
  suggested_routes: RouteCategory[];
  summary: string;
  confidence: 'high' | 'medium' | 'low' | 'ambiguous';
  routes: Array<{
    category: RouteCategory;
    explanation: string;
    confidence: 'high' | 'medium' | 'low' | 'ambiguous';
    next_action: string;
    action_owner: string | null;
    observed_facts: string[];
    inferences: string[];
    unestablished: string[];
    evidence: Array<{
      record_ref: string;
      source_type: 'call' | 'meeting';
      turn_number?: number;
      timecode?: string;
      speaker?: string;
      quote: string;
      rationale?: string;
    }>;
  }>;
  differentiated: any;
  what_is_unestablished: string[];
  evidence_citations: Array<{
    record_ref: string;
    source_type: 'call' | 'meeting';
    turn_number?: number;
    timecode?: string;
    speaker?: string;
    quote: string;
    rationale?: string;
  }>;
}

export const PRE_GENERATED_ANALYSES: Record<string, PreGeneratedRecordAnalysis> = {
  // C01
  C01: {
    record_ref: 'C01',
    source_id: '2ec4404c-beee-5377-a63c-aab701da08ed',
    primary_route: 'sales_coaching',
    suggested_routes: ['sales_coaching', 'partner_follow_up'],
    summary: 'Cold outreach from Arun to Pranav at Harborlight Advisory regarding finance operations partnership. Prospect objected strongly to unsolicited contact and clarified existing automation.',
    confidence: 'high',
    routes: [
      {
        category: 'sales_coaching',
        explanation: 'Evaluate cold call opening, permission-based discovery, and rep reaction when prospect pushes back on unsolicited outreach.',
        confidence: 'high',
        next_action: 'Coach rep on softening opening pitch and clarifying business relevance before pitching partnership services.',
        action_owner: 'Sales Manager',
        observed_facts: [
          'Arun introduced SpendNest to Pranav at Harborlight Advisory as cold outreach.',
          'Pranav stated: "I didn\'t ask for this call, and I\'m not interested. This number is for my work, not for people to sell things to me."',
          'Pranav confirmed Harborlight\'s finance processes are already heavily automated.',
          'Call ended politely without agreed follow-up.'
        ],
        inferences: [
          'Rep pitch conflated referral partnership with software vendor sales, creating immediate skepticism.',
          'Prospect felt ambushed by mobile outreach obtained via professional networking scraping.'
        ],
        unestablished: [
          'Does not establish whether Harborlight would ever partner under different commercial conditions.',
          'Does not prove firm size, tech stack, or pipeline value.'
        ],
        evidence: [
          {
            record_ref: 'C01',
            source_type: 'call',
            quote: 'Our processes are already very automated. We have a fairly advanced setup, so I don\'t think this is something we need.',
            rationale: 'Shows existing vendor in place and direct rejection of value proposition.'
          },
          {
            record_ref: 'C01',
            source_type: 'call',
            quote: 'This number is for my work, not for people to sell things to me.',
            rationale: 'Highlights cold outreach resistance and channel friction.'
          }
        ]
      },
      {
        category: 'partner_follow_up',
        explanation: 'Harborlight Advisory is an outsourced finance leadership firm, fitting SpendNest\'s target partner profile.',
        confidence: 'low',
        next_action: 'Place Harborlight on low-touch nurture list; do not make immediate direct sales calls.',
        action_owner: 'Partner Lead',
        observed_facts: ['Harborlight Advisory provides part-time outsourced finance leadership.'],
        inferences: ['Potential channel partner if approached via professional institutional channels rather than cold mobile dials.'],
        unestablished: ['No interest or referral capability was established during this call.'],
        evidence: [
          {
            record_ref: 'C01',
            source_type: 'call',
            quote: 'We partner with firms providing part-time finance leadership and look at ways to automate their finance operations.',
            rationale: 'Identifies target ICP category.'
          }
        ]
      }
    ],
    differentiated: {
      sales_coaching: {
        opening: 'Rep identified himself and SpendNest, but stumbled when prospect asked "Why are you calling?" resulting in immediate defensive reaction.',
        discovery: 'No structured questions asked about Harborlight\'s workflow before offering automation assistance.',
        objection_handling: 'Rep maintained polite composure and acknowledged the cold call honestly when challenged, which prevented hostile escalation.',
        communication_effectiveness: 'Tone was respectful, but positioning was too generic ("ways to automate finance operations").',
        coaching_recommendation: 'Train rep on permission-based cold outreach: asking for 30 seconds upfront and stating a peer reference before pitching.'
      }
    },
    what_is_unestablished: [
      'Actual finance software currently deployed by Harborlight.',
      'Potential client volume served by Harborlight.',
      'Whether Pranav is the sole decision maker.'
    ],
    evidence_citations: [
      {
        record_ref: 'C01',
        source_type: 'call',
        quote: 'Our processes are already very automated. We have a fairly advanced setup, so I don\'t think this is something we need.'
      }
    ]
  },

  // C02
  C02: {
    record_ref: 'C02',
    source_id: '4b870624-8aad-5315-a60e-0db95981cf99',
    primary_route: 'deal_follow_up',
    suggested_routes: ['deal_follow_up', 'manual_review'],
    summary: 'Arun called Fernhaven Group asking for Leela. Receptionist Kavya advised Leela was out of office; Arun left a voicemail.',
    confidence: 'medium',
    routes: [
      {
        category: 'deal_follow_up',
        explanation: 'Prospect was out of office. Voicemail left; calendar follow-up needed.',
        confidence: 'medium',
        next_action: 'Schedule follow-up call on Tuesday when Leela is expected back in office.',
        action_owner: 'Arun',
        observed_facts: [
          'Kavya at Fernhaven Group answered and checked Leela\'s availability.',
          'Leela was not in the office; call transferred to voicemail.'
        ],
        inferences: ['Routine outbound prospecting attempt to a target stakeholder.'],
        unestablished: ['No substantive conversation took place; interest, qualification, and project scope are completely unknown.'],
        evidence: [
          {
            record_ref: 'C02',
            source_type: 'call',
            quote: 'It looks as though she isn\'t in the office today. Would you like to leave a message with me, or would you prefer her voicemail?',
            rationale: 'Confirms gatekeeper transfer to voicemail.'
          }
        ]
      }
    ],
    differentiated: {
      deal_follow_up: {
        prospect_interest: 'Unknown — target was absent.',
        unresolved_concerns: 'None identified yet.',
        timeline_budget: 'Unestablished.',
        next_steps: 'Follow up via email or callback next week.',
        confirmed_owner: 'Arun'
      }
    },
    what_is_unestablished: ['Prospect need, buying intent, company size, or interest.'],
    evidence_citations: [
      {
        record_ref: 'C02',
        source_type: 'call',
        quote: 'It looks as though she isn\'t in the office today.'
      }
    ]
  },

  // C03
  C03: {
    record_ref: 'C03',
    source_id: '20d509ba-d589-5334-9aef-ea4ce6105b1a',
    primary_route: 'deal_follow_up',
    suggested_routes: ['deal_follow_up', 'sales_coaching'],
    summary: 'Kiran followed up with Milan regarding developer API access after a 5-week hiatus. Milan had severe audio connection issues while travelling; agreed to an email follow-up and Monday call.',
    confidence: 'high',
    routes: [
      {
        category: 'deal_follow_up',
        explanation: 'Active prospect evaluating developer API access with explicit price sensitivity and agreed email follow-up.',
        confidence: 'high',
        next_action: 'Send email titled "Developer access and event notifications — follow-up" and call Monday morning.',
        action_owner: 'Kiran',
        observed_facts: [
          'Prior conversation occurred 5 weeks ago regarding API access.',
          'Milan stated price is a barrier: "it isn\'t essential enough for us to spend much on it."',
          'Milan requested email with subject "Developer access and event notifications — follow-up" and a callback on Monday or Tuesday.'
        ],
        inferences: ['Low-to-medium purchase intent; technical interest exists but low willingness to pay full price.'],
        unestablished: ['Budget amount has not been disclosed; technical scope not yet clarified.'],
        evidence: [
          {
            record_ref: 'C03',
            source_type: 'call',
            quote: 'We did ask about some developer functionality, but it isn\'t essential enough for us to spend much on it.',
            rationale: 'Direct quote evidencing price sensitivity.'
          },
          {
            record_ref: 'C03',
            source_type: 'call',
            quote: 'Something like “Developer access and event notifications — follow-up”. Right, let\'s do that.',
            rationale: 'Shows agreed follow-up channel and subject line.'
          }
        ]
      }
    ],
    differentiated: {
      deal_follow_up: {
        prospect_interest: 'Moderate developer interest; evaluated API functionality previously.',
        unresolved_concerns: 'High price sensitivity; deemed non-essential.',
        timeline_budget: 'Awaiting email proposal; budget figure not disclosed.',
        next_steps: 'Send proposal email and dial Milan Monday morning.',
        confirmed_owner: 'Kiran'
      }
    },
    what_is_unestablished: ['Specific API endpoints required, team developer count, or decision authority.'],
    evidence_citations: [
      {
        record_ref: 'C03',
        source_type: 'call',
        quote: 'We did ask about some developer functionality, but it isn\'t essential enough for us to spend much on it.'
      }
    ]
  },

  // C04
  C04: {
    record_ref: 'C04',
    source_id: 'bcdcbf56-d338-5c78-9a97-42c2fc1c9931',
    primary_route: 'deal_follow_up',
    suggested_routes: ['deal_follow_up'],
    summary: 'Arun left a detailed voicemail for Ritesh at Lanternpath Media following up on expense software proposal after resolving an earlier incorrect email address issue.',
    confidence: 'high',
    routes: [
      {
        category: 'deal_follow_up',
        explanation: 'Follow-up on existing expense software evaluation after initial delivery bounce.',
        confidence: 'high',
        next_action: 'Monitor email open rate and retry phone outreach in 48 hours.',
        action_owner: 'Arun',
        observed_facts: [
          'Arun previously discussed expense software with Ritesh at Lanternpath Media.',
          'Initial email was sent to incorrect address; corrected address used subsequently.',
          'Detailed voicemail left asking Ritesh to advise status or questions.'
        ],
        inferences: ['High dropout risk due to initial miscommunication.'],
        unestablished: ['Unknown whether Ritesh reviewed the resent information.'],
        evidence: [
          {
            record_ref: 'C04',
            source_type: 'call',
            quote: 'My understanding is that our information first went to the wrong email address. We subsequently used the corrected address you gave us, and I hope you have now had a chance to see it.',
            rationale: 'Explains reason for delay and voicemail context.'
          }
        ]
      }
    ],
    differentiated: {
      deal_follow_up: {
        prospect_interest: 'Prior consideration established, current status unknown.',
        unresolved_concerns: 'Email delivery disruption.',
        timeline_budget: 'Unestablished.',
        next_steps: 'Check delivery and follow up by phone if no response.',
        confirmed_owner: 'Arun'
      }
    },
    what_is_unestablished: ['Current interest level, decision timeline, or pricing discussions.'],
    evidence_citations: [
      {
        record_ref: 'C04',
        source_type: 'call',
        quote: 'My understanding is that our information first went to the wrong email address.'
      }
    ]
  },

  // C05
  C05: {
    record_ref: 'C05',
    source_id: '75a6b94f-7717-5cfb-9e41-0acc94415e17',
    primary_route: 'deal_follow_up',
    suggested_routes: ['deal_follow_up', 'sales_coaching'],
    summary: 'Meera pitched SpendNest multi-store expense and card software. Prospect uses StoreHarbor and other tools for vendor payments and store cards, but agreed to receive a presentation at contact05@example.com.',
    confidence: 'high',
    routes: [
      {
        category: 'deal_follow_up',
        explanation: 'Competitor displacement opportunity; presentation requested for future review.',
        confidence: 'medium',
        next_action: 'Send customized displacement deck contrasting SpendNest with StoreHarbor to contact05@example.com.',
        action_owner: 'Meera',
        observed_facts: [
          'Prospect operates multiple retail stores.',
          'Currently uses StoreHarbor and other systems for expense approvals and vendor payments.',
          'Prospect requested: "What I suggest is that you send me your presentation. If we ever decide to change the providers we already have, we could consider it then."',
          'Email contact05@example.com confirmed.'
        ],
        inferences: ['Presentation request may be polite brush-off, but indicates open door if dissatisfaction with StoreHarbor arises.'],
        unestablished: ['Requesting a presentation does NOT establish purchase intent, active budget, or buying timeline.'],
        evidence: [
          {
            record_ref: 'C05',
            source_type: 'call',
            quote: 'There are several. One is StoreHarbor, and we use others too. What I suggest is that you send me your presentation.',
            rationale: 'Shows incumbent vendor and presentation request.'
          }
        ]
      }
    ],
    differentiated: {
      deal_follow_up: {
        prospect_interest: 'Incumbent in place; low immediate intent, open to receiving comparison.',
        unresolved_concerns: 'Happy with current multi-provider setup.',
        timeline_budget: 'Contingent on future provider re-evaluation.',
        next_steps: 'Send presentation to contact05@example.com.',
        confirmed_owner: 'Meera'
      }
    },
    what_is_unestablished: ['Store count, renewal date of StoreHarbor contract, or decision maker name.'],
    evidence_citations: [
      {
        record_ref: 'C05',
        source_type: 'call',
        quote: 'What I suggest is that you send me your presentation. If we ever decide to change the providers we already have, we could consider it then.'
      }
    ]
  },

  // C06
  C06: {
    record_ref: 'C06',
    source_id: '12216d5c-e254-52c6-b344-47de4c6e1ae5',
    primary_route: 'sales_coaching',
    suggested_routes: ['sales_coaching', 'deal_follow_up'],
    summary: 'Meera cold called Mr Nikhil regarding 120+ retail stores expense handling. Prospect firmly stated existing business management system and central team already provide full automation and visibility.',
    confidence: 'high',
    routes: [
      {
        category: 'sales_coaching',
        explanation: 'Analyze rep handling of entrenched incumbent enterprise solutions and graceful exit techniques.',
        confidence: 'high',
        next_action: 'Review call recording with Meera to practice pivoting away from generic feature recitation when enterprise has internal tools.',
        action_owner: 'Sales Manager',
        observed_facts: [
          'Mr Nikhil represents a retail business with 120+ stores.',
          'Nikhil stated: "We have quite a lot of automation... Head office manages it, and we have full visibility... If a particular need comes up later, we will reach out."',
          'Meera continued asking detailed card limit questions after initial rejection before closing.'
        ],
        inferences: ['Enterprise is entrenched in existing ERP; cold feature pitch was ineffective.'],
        unestablished: ['Specific ERP platform name was not disclosed.'],
        evidence: [
          {
            record_ref: 'C06',
            source_type: 'call',
            quote: 'The essential processes are automated and connected through our business management system. Head office manages it, and we have full visibility.',
            rationale: 'Evidence of existing enterprise automation.'
          }
        ]
      }
    ],
    differentiated: {
      sales_coaching: {
        opening: 'Upfront disclaimer ("this is a cold call, 40 seconds") was clear and professional.',
        discovery: 'Attempted to probe on cash advances vs cards across 120 stores.',
        objection_handling: 'Pushed slightly past clear polite dismissal rather than pivoting to executive pain.',
        communication_effectiveness: 'Respectful and polite tone throughout.',
        coaching_recommendation: 'Coach on identifying when a prospect has a dedicated in-house operations team and shifting inquiry to high-level strategic bottlenecks.'
      }
    },
    what_is_unestablished: ['Contract expiration date or ERP vendor.'],
    evidence_citations: [
      {
        record_ref: 'C06',
        source_type: 'call',
        quote: 'The essential processes are automated and connected through our business management system. Head office manages it, and we have full visibility.'
      }
    ]
  },

  // C07
  C07: {
    record_ref: 'C07',
    source_id: '428817fa-7e9e-5418-a7d4-bb396d28dfbf',
    primary_route: 'partner_follow_up',
    suggested_routes: ['partner_follow_up', 'deal_follow_up'],
    summary: 'Dev called Mr Aditya at Willowbank Advisory regarding virtual business accounts for newly incorporated overseas companies. Aditya confirmed they refer clients to digital providers and asked for proposal via chat.',
    confidence: 'high',
    routes: [
      {
        category: 'partner_follow_up',
        explanation: 'Corporate incorporation advisory firm routinely refers clients to digital bank account providers; excellent channel partner fit.',
        confidence: 'high',
        next_action: 'Send virtual account partnership proposal via messaging app and follow up Monday.',
        action_owner: 'Dev',
        observed_facts: [
          'Aditya at Willowbank Advisory assists clients with overseas incorporation.',
          'Aditya confirmed: "Yes, that is something we normally do" regarding referring clients to digital account providers.',
          'Aditya requested proposal details over chat app and agreed to a Monday follow-up call.'
        ],
        inferences: ['High-probability referral partner alignment for SpendNest global wallets.'],
        unestablished: ['Commercial commission expectation, referral volume, and client jurisdictions not yet established.'],
        evidence: [
          {
            record_ref: 'C07',
            source_type: 'call',
            quote: 'Do you currently refer clients to providers for that part of the process? Yes, that is something we normally do.',
            rationale: 'Direct confirmation of referral practice.'
          },
          {
            record_ref: 'C07',
            source_type: 'call',
            quote: 'could you message me on our chat app and send whatever proposal you have? ... Once you\'ve received them, could I call on Monday... Yes, that\'s fine.',
            rationale: 'Explicit next steps agreed.'
          }
        ]
      }
    ],
    differentiated: {
      partner_follow_up: {
        partner_type: 'Corporate advisory and overseas company formation.',
        commercial_model: 'Client referral to virtual account providers.',
        referral_process: 'Advisory firm introduces newly incorporated entities.',
        next_steps: 'Send messaging app brief and follow up on Monday.'
      }
    },
    what_is_unestablished: ['Monthly incorporation volume or fee share expectations.'],
    evidence_citations: [
      {
        record_ref: 'C07',
        source_type: 'call',
        quote: 'Do you currently refer clients to providers for that part of the process? Yes, that is something we normally do.'
      }
    ]
  },

  // C08
  C08: {
    record_ref: 'C08',
    source_id: '129497b2-8e1d-5e01-919c-e8a852b5ff68',
    primary_route: 'deal_follow_up',
    suggested_routes: ['deal_follow_up', 'sales_coaching'],
    summary: 'Meera called Mr Raghav regarding multi-location expense management. Raghav identified an active internal need and provided direct colleague contact contact08@example.com for proposal.',
    confidence: 'high',
    routes: [
      {
        category: 'deal_follow_up',
        explanation: 'Warm internal referral to decision maker for frontline location expenses.',
        confidence: 'high',
        next_action: 'Email comprehensive proposal to contact08@example.com citing conversation with Raghav.',
        action_owner: 'Meera',
        observed_facts: [
          'Raghav confirmed company was looking at an expense/operations solution: "I think we may have been looking at a solution, but I don\'t know the details. There have been some discussions."',
          'Raghav provided specific colleague email contact08@example.com handling people ops and location processes.',
          'Raghav authorized Meera to state she spoke with him.'
        ],
        inferences: ['Genuine internal project underway; warm intro gives high response likelihood.'],
        unestablished: ['Budget, vendor shortlist, or decision timeframe.'],
        evidence: [
          {
            record_ref: 'C08',
            source_type: 'call',
            quote: 'The colleague handling our people operations also deals with frontline processes and the locations. I think we may have been looking at a solution... If you send him a proposal and say you spoke with me, he can take a look.',
            rationale: 'Shows warm internal referral.'
          }
        ]
      }
    ],
    differentiated: {
      deal_follow_up: {
        prospect_interest: 'Internal discussions already underway; colleague assigned.',
        unresolved_concerns: 'Integration with existing enterprise management system.',
        timeline_budget: 'To be determined with people operations lead.',
        next_steps: 'Send email proposal to contact08@example.com.',
        confirmed_owner: 'Meera'
      }
    },
    what_is_unestablished: ['Specific company name or exact software shortlist.'],
    evidence_citations: [
      {
        record_ref: 'C08',
        source_type: 'call',
        quote: 'If you send him a proposal and say you spoke with me, he can take a look.'
      }
    ]
  },

  // C09
  C09: {
    record_ref: 'C09',
    source_id: '4a1de681-f884-55e8-b1ad-de22d17cd959',
    primary_route: 'deal_follow_up',
    suggested_routes: ['deal_follow_up', 'sales_coaching'],
    summary: 'Meera called Mr Vedant regarding 130 store locations. Company built software in-house; Vedant pointed to Business Head Rishabh on LinkedIn but explicitly forbade using his name.',
    confidence: 'high',
    routes: [
      {
        category: 'deal_follow_up',
        explanation: 'Target account with 130 retail locations; Business Head identified for outbound outreach.',
        confidence: 'medium',
        next_action: 'Reach out to Business Head Mr. Rishabh via professional networking without mentioning Vedant.',
        action_owner: 'Meera',
        observed_facts: [
          'Business operates approximately 130 store locations.',
          'Developed internal proprietary software for expenses and approvals.',
          'Vedant directed Meera to Business Head Mr. Rishabh on professional networking site.',
          'Vedant explicitly stated: "No, please don\'t use my name."'
        ],
        inferences: ['Vedant is protective of his internal standing; approach to Rishabh must be framed as independent market outreach.'],
        unestablished: ['Whether Rishabh is open to external solutions or satisfied with in-house tech.'],
        evidence: [
          {
            record_ref: 'C09',
            source_type: 'call',
            quote: 'We have developed our own software internally... you can find our business head, Mr Rishabh, on a professional networking site... No, please don\'t use my name.',
            rationale: 'Shows lead identification with explicit name boundary.'
          }
        ]
      }
    ],
    differentiated: {
      deal_follow_up: {
        prospect_interest: 'In-house solution present; central business head holds evaluation authority.',
        unresolved_concerns: 'Displacing internally built software.',
        timeline_budget: 'Unestablished.',
        next_steps: 'Outreach to Rishabh on LinkedIn without naming Vedant.',
        confirmed_owner: 'Meera'
      }
    },
    what_is_unestablished: ['Current tech stack limitations or Rishabh\'s direct contact details.'],
    evidence_citations: [
      {
        record_ref: 'C09',
        source_type: 'call',
        quote: 'No, please don\'t use my name.'
      }
    ]
  },

  // C10
  C10: {
    record_ref: 'C10',
    source_id: 'b747f592-810e-583c-9b81-8db5ab035806',
    primary_route: 'sales_coaching',
    suggested_routes: ['sales_coaching', 'manual_review'],
    summary: 'Meera called Mr Aniket regarding Meadowbrick. Aniket had left for a manufacturing company; agreed to a messaging brief but firmly shut down a scheduled callback.',
    confidence: 'high',
    routes: [
      {
        category: 'sales_coaching',
        explanation: 'Review rep boundary handling when prospect agrees to asynchronous messaging but refuses live calls.',
        confidence: 'high',
        next_action: 'Coach rep to accept prospect\'s communication boundary without trying to force calendar callbacks.',
        action_owner: 'Sales Manager',
        observed_facts: [
          'Aniket no longer works at target account Meadowbrick; moved to manufacturing.',
          'Aniket agreed to brief overview on messaging app.',
          'When Meera asked: "Would a follow-up call on Monday or Tuesday next week be okay?", Aniket replied: "No. I said I will contact you if there is anything to discuss."'
        ],
        inferences: ['Rep pushed past a clear preference, creating unnecessary friction.'],
        unestablished: ['Name of new manufacturing company or Aniket\'s current title.'],
        evidence: [
          {
            record_ref: 'C10',
            source_type: 'call',
            quote: 'No. I said I will contact you if there is anything to discuss.',
            rationale: 'Demonstrates prospect boundary pushback.'
          }
        ]
      }
    ],
    differentiated: {
      sales_coaching: {
        opening: 'Quickly discovered prospect job change.',
        discovery: 'Attempted to pivot to manufacturing sector use case.',
        objection_handling: 'Failed to respect the boundary when prospect offered async review.',
        communication_effectiveness: 'Professional, but pushy closing.',
        coaching_recommendation: 'Train rep on async qualification: when a prospect says "send it and I will reach out", respect that boundary.'
      }
    },
    what_is_unestablished: ['Current company name, title, or authority.'],
    evidence_citations: [
      {
        record_ref: 'C10',
        source_type: 'call',
        quote: 'No. I said I will contact you if there is anything to discuss.'
      }
    ]
  },

  // M01
  M01: {
    record_ref: 'M01',
    source_id: 'cb5cecac-e68d-52b7-b10b-b0c748efc467',
    primary_route: 'partner_follow_up',
    suggested_routes: ['partner_follow_up', 'deal_follow_up'],
    summary: 'Harborpath Advisory agreed to become a SpendNest referral partner for US entity virtual accounts. Commercial commission agreed (USD 260 activation + spend tiers); requested unique tracking link.',
    confidence: 'high',
    routes: [
      {
        category: 'partner_follow_up',
        explanation: 'Active channel partnership agreement ready for contract memorandum and tracking link deployment.',
        confidence: 'high',
        next_action: 'Send partner agreement memorandum and issue unique tracking link with shared reporting sheet.',
        action_owner: 'Team member A',
        observed_facts: [
          'Partner A provides incorporation and advisory services for businesses with US entities.',
          'Commission structure agreed: USD 260 per approved account + spend bonuses (USD 195 for $6.5k-$32.5k, USD 390 for up to $130k) + 5th referral bonus.',
          'Partner A requested scalable tracking link rather than manual email intros (Turn 20: "It cannot depend on me manually writing every email").',
          'Discussed future co-marketing podcast and partner directory listing.'
        ],
        inferences: ['High-value scalable referral pipeline for international US company incorporations.'],
        unestablished: ['Expected monthly referral volume was not committed.'],
        evidence: [
          {
            record_ref: 'M01',
            source_type: 'meeting',
            turn_number: 12,
            timecode: '00:10:26',
            speaker: 'Partner A',
            quote: 'No, let us get the partner onboarding started.',
            rationale: 'Direct agreement to onboard as partner.'
          },
          {
            record_ref: 'M01',
            source_type: 'meeting',
            turn_number: 21,
            timecode: '00:14:50',
            speaker: 'Team member A',
            quote: 'Then let us use the unique link. They fill in the business information, then go through to arranging a demo with our team.',
            rationale: 'Agreed referral mechanics.'
          }
        ]
      }
    ],
    differentiated: {
      partner_follow_up: {
        partner_type: 'Advisory and corporate services provider.',
        commercial_model: 'USD 260 activation fee + spend bonuses + volume tier bonus.',
        referral_process: 'Unique tracking link into automated demo scheduler.',
        next_steps: 'Send memorandum and unique tracking link.'
      }
    },
    what_is_unestablished: ['Firm monthly client volume.'],
    evidence_citations: [
      {
        record_ref: 'M01',
        source_type: 'meeting',
        turn_number: 12,
        timecode: '00:10:26',
        quote: 'No, let us get the partner onboarding started.'
      }
    ]
  },

  // M02
  M02: {
    record_ref: 'M02',
    source_id: '1a21c409-c050-5787-90af-2667e057e1b6',
    primary_route: 'internal_vendor',
    suggested_routes: ['internal_vendor'],
    summary: 'SpendNest strategy and product leads evaluated LedgerBridge as an e-invoicing compliance vendor for Singapore, Australia, and India rollout. Setup fees EUR 2,600–6,500.',
    confidence: 'high',
    routes: [
      {
        category: 'internal_vendor',
        explanation: 'Vendor procurement evaluation for electronic invoicing infrastructure.',
        confidence: 'high',
        next_action: 'Complete volume estimation template and schedule commercial walkthrough.',
        action_owner: 'Team member B',
        observed_facts: [
          'SpendNest is evaluating LedgerBridge for compliant electronic invoicing to support new receivables module.',
          'Target markets: Q4 starting with Singapore and Australia, followed by India.',
          'Pricing models: Country licenses with usage vs end-customer licenses with volume tiers; setup fee EUR 2,600 to 6,500+.'
        ],
        inferences: ['Vendor provides faster time-to-market than building proprietary e-invoicing network gateways in each country.'],
        unestablished: ['Q4 target date is flexible; internal executive budget approval is pending.'],
        evidence: [
          {
            record_ref: 'M02',
            source_type: 'meeting',
            turn_number: 1,
            timecode: '00:05:22',
            speaker: 'Team member A',
            quote: 'We want to understand whether LedgerBridge can give us compliant invoicing coverage across our operating markets.',
            rationale: 'Defines procurement purpose.'
          },
          {
            record_ref: 'M02',
            source_type: 'meeting',
            turn_number: 17,
            timecode: '00:22:07',
            speaker: 'Supplier A',
            quote: 'I will send a volume template: countries, small versus larger customers, invoices issued and invoices received.',
            rationale: 'Agreed vendor next step.'
          }
        ]
      }
    ],
    differentiated: {
      internal_vendor: {
        interaction_type: 'procurement',
        supplier_or_tool: 'LedgerBridge',
        operational_commitments: 'Fill out volume template; test sandbox with developer credentials.',
        pricing_model: 'EUR 2,600-6,500 setup + license/usage fees.'
      }
    },
    what_is_unestablished: ['Firm invoice volume forecasts for receivables product.'],
    evidence_citations: [
      {
        record_ref: 'M02',
        source_type: 'meeting',
        turn_number: 1,
        timecode: '00:05:22',
        quote: 'We want to understand whether LedgerBridge can give us compliant invoicing coverage across our operating markets.'
      }
    ]
  },

  // M03
  M03: {
    record_ref: 'M03',
    source_id: '398672e7-62dd-5afd-846d-0237d49792fb',
    primary_route: 'deal_follow_up',
    suggested_routes: ['deal_follow_up', 'sales_coaching'],
    summary: 'Asterloom Systems evaluated domestic corporate cards. Customer raised prepaid vs credit misconception, price objection on setup fees, and confirmed CFO holds final decision authority.',
    confidence: 'high',
    routes: [
      {
        category: 'deal_follow_up',
        explanation: 'Active opportunity with 65-employee firm; pricing proposal required for CFO sign-off.',
        confidence: 'high',
        next_action: 'Send clear pricing proposal breaking down INR 26k subscription vs INR 13k one-time setup for CFO review.',
        action_owner: 'Team member A',
        observed_facts: [
          'Asterloom currently reimburses INR 10–13 lakh monthly across ~65 employees.',
          'Customer initially expected corporate credit card; learned domestic cards are funded prepaid.',
          'Customer challenged pricing increase: INR 26,000 vs INR 39,000 (explained as INR 13,000 setup fee).',
          'CFO approval required for commercial sign-off.'
        ],
        inferences: ['Prospect is engaged but highly sensitive to unexpected upfront fees.'],
        unestablished: ['CFO willingness to approve prepaid model is unconfirmed.'],
        evidence: [
          {
            record_ref: 'M03',
            source_type: 'meeting',
            turn_number: 6,
            timecode: '00:11:04',
            speaker: 'Customer A',
            quote: 'Wait, these are prepaid? I had thought about a corporate credit card. So we put money in before anyone spends, and there is no credit facility on these domestic cards?',
            rationale: 'Shows key buyer expectation gap.'
          },
          {
            record_ref: 'M03',
            source_type: 'meeting',
            turn_number: 24,
            timecode: '00:30:43',
            speaker: 'Team member A',
            quote: 'INR 26,000 plus tax is the recurring annual subscription, and INR 13,000 is the one-time accounting integration setup.',
            rationale: 'Pricing structure clarification.'
          }
        ]
      }
    ],
    differentiated: {
      deal_follow_up: {
        prospect_interest: 'Strong operational need for 4-5 initial traveling users; INR 10-13L monthly spend.',
        unresolved_concerns: 'Prepaid funding requirement and INR 13k setup fee.',
        timeline_budget: 'INR 26k annual subscription budget expectation.',
        next_steps: 'Send itemized proposal for CFO review.',
        confirmed_owner: 'Team member A'
      }
    },
    what_is_unestablished: ['Whether CFO will reject prepaid cards in favor of a bank credit card.'],
    evidence_citations: [
      {
        record_ref: 'M03',
        source_type: 'meeting',
        turn_number: 6,
        timecode: '00:11:04',
        quote: 'Wait, these are prepaid? I had thought about a corporate credit card.'
      }
    ]
  },

  // M04
  M04: {
    record_ref: 'M04',
    source_id: 'b0f79b3d-37ba-52f9-b2bc-58b159dd6d91',
    primary_route: 'customer_success',
    suggested_routes: ['customer_success', 'deal_follow_up'],
    summary: 'Cedarwave Distribution migration review. Current card programme shutting down; client has INR 1.3 crore bank credit line and demands bank credit feed instead of another prepaid programme.',
    confidence: 'high',
    routes: [
      {
        category: 'customer_success',
        explanation: 'Critical account migration and potential churn risk over prepaid vs bank credit card integration.',
        confidence: 'high',
        next_action: 'Verify engineering feasibility for existing bank credit card feed and schedule department reconfiguration session.',
        action_owner: 'Team member A',
        observed_facts: [
          'Existing Cedarwave card programme closing due to acceptance problems on current network.',
          'Customer confirmed: "moving from prepaid to credit is the main issue for us."',
          'Customer already possesses INR 1.3 crore corporate bank credit line with few cards issued.',
          'Customer requested SpendNest sit as expense tracking layer over bank-issued credit cards.',
          'Customer reported department configuration confusion in UI requiring assistance.'
        ],
        inferences: ['Severe churn risk if forced into another pure prepaid card programme.'],
        unestablished: ['Technical ability of SpendNest to ingest Cedarwave\'s specific bank card feed is not confirmed.'],
        evidence: [
          {
            record_ref: 'M04',
            source_type: 'meeting',
            turn_number: 11,
            timecode: '00:07:17',
            speaker: 'Customer A',
            quote: 'Okay, I have confirmed it: moving from prepaid to credit is the main issue for us. At some stage we will have to consider another option for that.',
            rationale: 'Direct statement of core retention threat.'
          },
          {
            record_ref: 'M04',
            source_type: 'meeting',
            turn_number: 22,
            timecode: '00:24:32',
            speaker: 'Customer B',
            quote: 'We already have a corporate credit line of about INR 1.3 crore. Cards are issued to only a few people so far... If your platform can sit in between, we should understand that route.',
            rationale: 'Alternative architecture requested by customer.'
          }
        ]
      }
    ],
    differentiated: {
      customer_success: {
        support_needs: 'Card programme migration plan and department reassignment session.',
        adoption_issues: 'Card acceptance failures on existing network.',
        customer_commitments: 'Consult internal stakeholders before accepting migration.',
        technical_blockers: ['Unconfirmed bank credit card transaction feed integration.']
      }
    },
    what_is_unestablished: ['Eligibility of Cedarwave\'s specific bank cards for the transaction feed programme.'],
    evidence_citations: [
      {
        record_ref: 'M04',
        source_type: 'meeting',
        turn_number: 11,
        timecode: '00:07:17',
        quote: 'moving from prepaid to credit is the main issue for us.'
      }
    ]
  },

  // M06
  M06: {
    record_ref: 'M06',
    source_id: '657b9e9d-9472-5b01-a127-a648ad7e8cf7',
    primary_route: 'deal_follow_up',
    suggested_routes: ['deal_follow_up', 'sales_coaching'],
    summary: 'Exploratory discovery call with Mapletrail Services branch finance manager. Business issues 390–520 invoices/month in foreign currency; interest in receivables collection automation.',
    confidence: 'high',
    routes: [
      {
        category: 'deal_follow_up',
        explanation: 'Substantial invoice volume prospect for upcoming receivables automation module.',
        confidence: 'medium',
        next_action: 'Send product overview and security compliance documentation; seek introduction to central finance leadership.',
        action_owner: 'Team member A',
        observed_facts: [
          'Mapletrail branch finance covers 8 clients, but company has 65-78 customers issuing ~390-520 invoices/month.',
          'Manual effort spent chasing delivery managers and multi-currency collections.',
          'Central dedicated finance team of ~65 people manages primary ERP.',
          'Customer emphasized data confidentiality and security.'
        ],
        inferences: ['Branch contact is an influencer/user champion, not the enterprise buyer.'],
        unestablished: ['Branch contact does not have purchasing authority for central finance organization.'],
        evidence: [
          {
            record_ref: 'M06',
            source_type: 'meeting',
            turn_number: 16,
            timecode: '00:15:09',
            speaker: 'Customer A',
            quote: 'Approximately [390–520 invoices a month]. The value is the bigger point, and many are in foreign currency.',
            rationale: 'Volume and scope evidence.'
          },
          {
            record_ref: 'M06',
            source_type: 'meeting',
            turn_number: 31,
            timecode: '00:34:27',
            speaker: 'Customer A',
            quote: 'Confidentiality is important. Payment information is sensitive. How is that protected, and is there a risk of somebody interfering with it?',
            rationale: 'Security qualification gate.'
          }
        ]
      }
    ],
    differentiated: {
      deal_follow_up: {
        prospect_interest: 'Strong technical fit for AR collections; high invoice count and FX transactions.',
        unresolved_concerns: 'Data security, ERP integration, and central finance governance.',
        timeline_budget: 'Unestablished.',
        next_steps: 'Send receivables collateral and security certifications.',
        confirmed_owner: 'Team member A'
      }
    },
    what_is_unestablished: ['Budget, central finance approval, or current ERP vendor name.'],
    evidence_citations: [
      {
        record_ref: 'M06',
        source_type: 'meeting',
        turn_number: 16,
        timecode: '00:15:09',
        quote: 'The value is the bigger point, and many are in foreign currency.'
      }
    ]
  },

  // M07 (When updated!)
  M07: {
    record_ref: 'M07',
    source_id: '4f304fff-fd40-5cfc-a366-0a134c445c2a',
    primary_route: 'customer_success',
    suggested_routes: ['customer_success'],
    summary: 'Willowfield Trust troubleshooting call demonstrating 4 severe UI bugs: description edits not saving, document upload failing on Recreate payment, stuck reimbursements, and stale payment amount caching in Mark as Paid.',
    confidence: 'high',
    routes: [
      {
        category: 'customer_success',
        explanation: 'Critical customer issue triage detailing 4 distinct software bugs with reproducible steps.',
        confidence: 'high',
        next_action: 'Open critical bug tickets with screenshots for Description save failure, document upload blocker, stuck reimbursements, and Mark as Paid stale cache.',
        action_owner: 'Team member A',
        observed_facts: [
          'Bug 1: Editing event-payment description does not display updated value after clicking Save changes (Turns 2-4).',
          'Bug 2: Direct document upload fails on "Recreate payment"; workaround verified via Bill Pay -> Review inbox (Turns 8-13).',
          'Bug 3: Reimbursement payments released but stuck showing "Processing" state (Turns 16-19).',
          'Bug 4: "Mark as paid" form caches previous item\'s amount (INR 18,200) instead of fetching next item (Turns 21-24).',
          'Team member A promised update within 1-2 hours on stuck reimbursements.'
        ],
        inferences: ['Severe UI state management and client-side form caching defects impacting customer trust.'],
        unestablished: ['Engineering root cause is unknown.'],
        evidence: [
          {
            record_ref: 'M07',
            source_type: 'meeting',
            turn_number: 3,
            timecode: '00:11:16',
            speaker: 'Team member A',
            quote: 'The field still shows the earlier wording. So the change is not appearing after you save, is that right?',
            rationale: 'Confirms description persistence bug.'
          },
          {
            record_ref: 'M07',
            source_type: 'meeting',
            turn_number: 19,
            timecode: '00:15:37',
            speaker: 'Team member A',
            quote: 'The payments appear to have been released but are stuck showing Processing. I have asked the team to look at these. I expect an update or resolution in an hour or two...',
            rationale: 'Commitment on stuck reimbursement bug.'
          },
          {
            record_ref: 'M07',
            source_type: 'meeting',
            turn_number: 23,
            timecode: '00:17:50',
            speaker: 'Team member A',
            quote: 'Let me confirm: it is retaining the previous amount rather than fetching the next payment\'s value.',
            rationale: 'Confirms stale form state in Mark as Paid.'
          }
        ]
      }
    ],
    differentiated: {
      customer_success: {
        support_needs: 'Immediate engineering bug fixes and reimbursement release verification.',
        adoption_issues: 'Extra manual steps and duplicate data entry caused by UI state glitches.',
        customer_commitments: 'Status update within 1-2 hours.',
        technical_blockers: [
          'Description edit silent save failure',
          'Recreate payment document upload failure',
          'Reimbursements stuck in Processing status',
          'Mark as Paid form cache retention bug (INR 18,200)'
        ]
      }
    },
    what_is_unestablished: ['Root cause in backend API vs frontend state store.'],
    evidence_citations: [
      {
        record_ref: 'M07',
        source_type: 'meeting',
        turn_number: 23,
        timecode: '00:17:50',
        quote: 'Let me confirm: it is retaining the previous amount rather than fetching the next payment\'s value.'
      }
    ]
  },

  // M09
  M09: {
    record_ref: 'M09',
    source_id: '4b5b9192-f3fc-505a-8e77-4d2ffaa54594',
    primary_route: 'customer_success',
    suggested_routes: ['customer_success'],
    summary: 'Brookmint Holdings & Northkite Equipment onboarding. Fresh password reset link failed immediately with "token expired" error; customer clarified separate trial usage and requested guidance on shared mailbox administrator roles.',
    confidence: 'high',
    routes: [
      {
        category: 'customer_success',
        explanation: 'Customer onboarding blocker: authentication token expiration defect and multi-entity role configuration.',
        confidence: 'high',
        next_action: 'Resolve expired-token auth bug with engineering team and provide recommendation on dedicated admin credentials.',
        action_owner: 'Team member A',
        observed_facts: [
          'Customer manages two separate companies: Northkite Equipment and Brookmint Holdings.',
          'Customer clarified Northkite alone used the trial, not Brookmint.',
          'Live password reset link for Brookmint immediately returned: "It says the token has expired. This is the fresh message we just received."',
          'Discussed risk of shared accounts mailbox granting administrator rights to accounts-payable officer.'
        ],
        inferences: ['Authentication token generation clock drift or premature expiry bug in production.'],
        unestablished: ['Why token immediately expired.'],
        evidence: [
          {
            record_ref: 'M09',
            source_type: 'meeting',
            turn_number: 21,
            timecode: '00:13:54',
            speaker: 'Customer A',
            quote: 'It says the token has expired. This is the fresh message we just received.',
            rationale: 'Direct proof of authentication failure.'
          },
          {
            record_ref: 'M09',
            source_type: 'meeting',
            turn_number: 11,
            timecode: '00:07:28',
            speaker: 'Customer A',
            quote: 'But the accounts-payable officer can read that shared mailbox. Would that give that person the same administrator rights as me?',
            rationale: 'Highlights governance and role security concern.'
          }
        ]
      }
    ],
    differentiated: {
      customer_success: {
        support_needs: 'Immediate password reset link fix for Brookmint Holdings.',
        adoption_issues: 'Inability to log in to Brookmint Holdings account.',
        customer_commitments: 'Check with IT team on separate email identities.',
        technical_blockers: ['Instant password reset token expiration bug.']
      }
    },
    what_is_unestablished: ['Identity management system root cause.'],
    evidence_citations: [
      {
        record_ref: 'M09',
        source_type: 'meeting',
        turn_number: 21,
        timecode: '00:13:54',
        quote: 'It says the token has expired. This is the fresh message we just received.'
      }
    ]
  },

  // M10
  M10: {
    record_ref: 'M10',
    source_id: '337f297d-9385-5b82-9e54-5019c1ed912c',
    primary_route: 'internal_vendor',
    suggested_routes: ['internal_vendor'],
    summary: 'Internal operations training walkthrough on SpendNest back-office super-admin billing application, invoice deduction retries (days 1, 3, 7, 10), and account unfreezing procedures.',
    confidence: 'high',
    routes: [
      {
        category: 'internal_vendor',
        explanation: 'Internal operational training on back-office super-admin billing systems and grace period exceptions.',
        confidence: 'high',
        next_action: 'Provision demo back-office access for Team member B before next session and document manual unfreeze steps.',
        action_owner: 'Team member A',
        observed_facts: [
          'Meeting was internal training for operations staff, not an external customer call.',
          'Covered back-office super-admin application used to manage customer billing cycles.',
          'Explained billing grace periods: 7-day nominal due period, end-of-month allowance, and mid-next-month allowance.',
          'Automated deduction schedule: day 1 failure -> retry day 3 -> retry day 7 (with freeze warning) -> day 10 account block.',
          'Emphasized that topping up a frozen account does not automatically unfreeze; operations must clear invoice and manually update next billing date.'
        ],
        inferences: ['Manual unfreeze process has human error risk if operations forgets to adjust next billing date.'],
        unestablished: ['Zero external sales pipeline; not a commercial opportunity.'],
        evidence: [
          {
            record_ref: 'M10',
            source_type: 'meeting',
            turn_number: 5,
            timecode: '00:05:44',
            speaker: 'Team member A',
            quote: 'That is a different application. Operations uses it to create accounts, control enabled features and manage billing. I will show what it looks like, rather than ask you to create an invoice yourself.',
            rationale: 'Confirms internal operational tool walkthrough.'
          },
          {
            record_ref: 'M10',
            source_type: 'meeting',
            turn_number: 18,
            timecode: '00:20:24',
            speaker: 'Team member A',
            quote: 'The customer must tell us, then operations clears the outstanding invoice and unfreezes the account. Operations also needs to adjust the next billing date manually. Clearing the payment without checking that date can leave the next cycle wrong.',
            rationale: 'Key operational procedure detail.'
          }
        ]
      }
    ],
    differentiated: {
      internal_vendor: {
        interaction_type: 'training',
        supplier_or_tool: 'Internal Back-Office Super-Admin App',
        operational_commitments: 'Request super-admin access for Team member B.',
        pricing_model: 'Internal company billing rules.'
      }
    },
    what_is_unestablished: ['No customer or deal involved.'],
    evidence_citations: [
      {
        record_ref: 'M10',
        source_type: 'meeting',
        turn_number: 5,
        timecode: '00:05:44',
        quote: 'Operations uses it to create accounts, control enabled features and manage billing.'
      }
    ]
  }
};
