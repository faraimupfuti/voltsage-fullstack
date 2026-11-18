import { COMPANY_USERS } from './plans'

/** A block is a paragraph (string), a bullet list (string[]) or a sub-heading ({ h }). */
export type LegalBlock = string | string[] | { h: string }
export interface LegalSection { title: string; blocks: LegalBlock[] }

export const TERMS_SECTIONS: LegalSection[] = [
  {
    title: 'Introduction and acceptance of terms',
    blocks: [
      'These Terms of Service govern access to and use of the VoltSage website, software platform, digital energy assessment tools and associated services.',
      'VoltSage is operated by VOLTSAGE SOLUTIONS, a company incorporated in the Republic of South Africa under registration number 2026/745189/07 with its registered address at 1 Dolce Street, Wilgelheuwel, Roodeport, Gauteng, 1724 (“VoltSage”, “we”, “us” or “our”).',
      'By accessing the VoltSage platform, registering an account, purchasing a subscription or using any of its services, you (“User”, “you” or “Subscriber”) agree to be bound by these Terms of Service. If you do not agree with these terms, you must not access or use the platform.',
      'If you access the platform on behalf of a company or other organisation, you confirm that you are authorised to accept these terms on that organisation’s behalf.',
    ],
  },
  {
    title: 'Description of services',
    blocks: [
      'VoltSage is a web-based digital energy assessment and preliminary system sizing platform designed to support the initial assessment of energy requirements and preliminary planning of solar and other energy systems.',
      'Depending on the subscription and tools made available, the platform may provide:',
      [
        'Residential and small commercial energy assessment and preliminary sizing.',
        'Agricultural energy assessment and preliminary sizing.',
        'Battery runtime calculations.',
        'DC cable sizing calculations.',
        'Standard and Advanced assessment modes.',
        'Energy consumption and demand calculations.',
        'Preliminary inverter, battery and photovoltaic (PV) sizing recommendations.',
        'Generation and downloading of PDF assessment reports.',
      ],
      'VoltSage may introduce, modify, improve, replace or discontinue features and tools as the platform develops.',
      'Access to particular features may depend on the active subscription or other arrangements agreed with VoltSage.',
    ],
  },
  {
    title: 'Account registration and eligibility',
    blocks: [
      'To use subscription-based services, users must register an account and provide accurate, complete and current information.',
      'You agree to:',
      [
        'Provide truthful registration and contact information.',
        'Maintain the confidentiality of your login credentials.',
        'Ensure that your account is not accessed by unauthorised individuals.',
        'Notify VoltSage promptly if you suspect unauthorised access to your account.',
        'Keep your account information updated.',
      ],
      'Users must be legally capable of entering into a binding agreement under the laws applicable to them.',
      'VoltSage reserves the right to refuse, restrict or terminate account access where registration information is materially inaccurate, fraudulent or used in violation of these terms.',
    ],
  },
  {
    title: 'Subscription plans and access',
    blocks: [
      'VoltSage currently offers the following subscription plans:',
      { h: '4.1 Individual subscription' },
      'Price:',
      ['$5 per month.', '$50 per year when paid annually.'],
      'The Individual subscription provides:',
      [
        'Access for one registered individual.',
        'Unlimited access to Advanced Mode.',
        'Access to the available energy assessment and sizing tools.',
        'Unlimited preliminary assessments.',
        'Unlimited PDF report generation and downloads.',
      ],
      'Individual subscriptions are intended for personal professional use and must not be shared with other individuals.',
      { h: '4.2 Company subscription' },
      'Price:',
      ['$30 per month.', '$300 per year when paid annually.'],
      'The Company subscription provides:',
      [
        `Access for up to ${COMPANY_USERS} authorised users.`,
        'Unlimited access to Advanced Mode.',
        'Access to the available energy assessment and sizing tools.',
        'Unlimited preliminary assessments.',
        'Unlimited PDF report generation and downloads.',
        'Company-level account administration.',
      ],
      'Each authorised user must have an individual login.',
      'The company account administrator is responsible for managing access and ensuring that the subscription is used only by authorised personnel within the subscribing organisation.',
      'A Company subscription must not be shared between separate or unrelated organisations.',
      `Organisations requiring more than ${COMPANY_USERS} users may contact VoltSage to discuss additional access arrangements and pricing.`,
      { h: '4.3 Annual subscriptions' },
      'Subscribers who choose annual billing receive a discounted subscription equivalent to ten monthly payments for twelve months of access.',
      'Annual subscriptions are therefore:',
      ['Individual: $50 per year.', 'Company: $300 per year.'],
      'The annual discount is reflected in the subscription price at the time of purchase.',
      { h: '4.4 Pricing and currency' },
      'Unless otherwise stated, subscription prices are quoted in United States Dollars (USD).',
      'Any applicable taxes, payment processing charges or other additional costs will be disclosed where applicable before payment is completed.',
      'VoltSage reserves the right to revise subscription prices. Changes will not affect an already-paid subscription period. Subscribers will be notified of applicable price changes before their next renewal.',
    ],
  },
  {
    title: 'Billing, renewals and cancellation',
    blocks: [
      'Subscriptions are billed according to the billing cycle selected at registration.',
      'Where recurring billing is enabled, subscriptions will automatically renew at the end of the applicable billing period unless cancelled before the renewal date.',
      'By subscribing to a recurring payment plan, you authorise the applicable payment provider to process subscription payments in accordance with the selected billing arrangement.',
      'Subscribers may cancel their subscriptions through the available account settings or by contacting VoltSage at info@voltsage.co.',
      'Unless otherwise required by applicable law:',
      [
        'Cancellation prevents future subscription renewals.',
        'Access remains available until the end of the paid subscription period.',
        'Cancellation does not automatically entitle the subscriber to a refund for the unused portion of an active subscription period.',
        'Any outstanding amounts remain payable.',
      ],
      'Refunds and cancellation rights will be handled in accordance with applicable consumer protection and electronic commerce legislation.',
      'Where a statutory cooling-off or cancellation right applies, these Terms do not limit that right.',
    ],
  },
  {
    title: 'Fair use policy',
    blocks: [
      'VoltSage provides unlimited preliminary assessments and PDF report downloads within the scope of an active subscription.',
      'However, unlimited access does not permit misuse of the platform or activities that compromise its security, performance or availability.',
      'Users must not:',
      [
        'Share individual login credentials with other individuals.',
        `Exceed the ${COMPANY_USERS}-user allowance under a Company subscription.`,
        'Use automated scripts, bots or scraping tools to access the platform without written authorisation.',
        'Attempt to bypass subscription restrictions or security controls.',
        'Interfere with the operation, availability or security of the platform.',
        'Resell, sublicense or commercially redistribute platform access without written permission.',
        'Use the platform to develop or reproduce a competing service through unauthorised extraction or copying.',
      ],
      'VoltSage may investigate unusual usage patterns or suspected misuse.',
      'Where misuse is identified, VoltSage may contact the subscriber and request corrective action. Serious or repeated violations may result in temporary restriction, suspension or termination of access.',
      'Where reasonably possible, users will be notified and given an opportunity to resolve the issue before access is suspended, except where immediate action is necessary to protect platform security or service availability.',
      'The detailed Fair Use and Subscription Access Policy forms part of these Terms.',
    ],
  },
  {
    title: 'Permitted use of the platform',
    blocks: [
      'Users may access and use VoltSage for legitimate energy assessment, preliminary system sizing, project planning and related professional or business activities.',
      'You agree not to:',
      [
        'Reverse engineer, decompile or attempt to extract the source code of the platform, except where applicable law expressly permits this.',
        'Copy, modify, distribute or reproduce the platform or its proprietary components without authorisation.',
        'Circumvent technical restrictions or access controls.',
        'Upload malicious code or attempt to compromise platform infrastructure.',
        'Use the platform for unlawful, fraudulent or misleading activities.',
        'Misrepresent preliminary outputs as certified engineering designs or guarantees of system performance.',
      ],
      'Users are responsible for ensuring that their use of the platform complies with the laws and regulations applicable to them.',
    ],
  },
  {
    title: 'Intellectual property',
    blocks: [
      'The VoltSage platform, including its software, source code, algorithms, calculation methodologies, interface, branding, logos, documentation, designs and associated materials, is owned by or licensed to VoltSage and is protected by applicable intellectual property laws.',
      'Purchasing a subscription grants the user a limited, non-exclusive, non-transferable and revocable right to access and use the platform for the duration of the subscription.',
      'A subscription does not transfer ownership of any VoltSage intellectual property to the subscriber.',
      'Unless otherwise agreed in writing, users retain ownership of the original information and data they submit to the platform.',
      'PDF reports generated through VoltSage may be downloaded, stored, shared and used by the subscriber for legitimate project, customer and business purposes.',
      'However, users may not remove proprietary notices, misrepresent ownership of VoltSage software or claim ownership of the underlying platform calculations, algorithms or technology.',
    ],
  },
  {
    title: 'Energy assessment and engineering disclaimer',
    blocks: [
      'VoltSage provides digital energy assessment and preliminary system sizing outputs intended to support early-stage planning and decision-making.',
      'The platform’s calculations and recommendations are based on the information supplied by users, together with the assumptions, equipment data and calculation methodologies incorporated into the platform.',
      'VoltSage does not replace detailed engineering design, professional engineering judgement, physical site assessments or equipment verification.',
      'Users acknowledge that:',
      [
        'The accuracy of outputs depends on the accuracy and completeness of the information entered.',
        'Preliminary sizing recommendations are not final system specifications.',
        'Actual system performance may vary due to equipment characteristics, installation conditions, environmental factors, operating conditions and other project-specific considerations.',
        'Final equipment selection, system configuration, protection, installation and commissioning must be appropriately reviewed and verified by competent professionals.',
        'Applicable electrical regulations, technical standards, manufacturer requirements and local authority requirements must be observed.',
      ],
      'VoltSage does not guarantee that a preliminary assessment will result in a particular system performance, energy saving, financial return or uninterrupted electricity supply.',
      'Users and relevant project professionals remain responsible for reviewing and validating the outputs before making procurement, installation or operational decisions.',
    ],
  },
  {
    title: 'User information and data protection',
    blocks: [
      'VoltSage may collect and process personal information and other data necessary to provide, maintain, secure and improve its services.',
      'Such information may include:',
      [
        'Account registration and contact information.',
        'Subscription and transaction information.',
        'Assessment information entered by users.',
        'Platform usage and technical information.',
        'Communications and support requests.',
      ],
      'VoltSage will process personal information in accordance with applicable data protection legislation, including South Africa’s Protection of Personal Information Act 4 of 2013 (POPIA), where applicable.',
      'Where services are accessed from other African countries, VoltSage will also consider applicable local data protection requirements.',
      'Users agree to provide information lawfully and must ensure that they have the necessary authority or permission to submit personal information relating to other individuals.',
      'Further details concerning the collection, processing, storage, disclosure, retention and protection of personal information are provided in the VoltSage Privacy Policy.',
      'The Privacy Policy forms part of the information governing your use of the platform.',
    ],
  },
  {
    title: 'Third-party services',
    blocks: [
      'VoltSage may use third-party service providers to support its operations, including hosting providers, payment processors, analytics services, communications providers and other technology services.',
      'These providers may process relevant information in order to deliver their services to VoltSage.',
      'Third-party services may be subject to their own terms, conditions and privacy policies.',
      'VoltSage is not responsible for the independent operation, availability or policies of third-party services, subject to obligations imposed by applicable law.',
    ],
  },
  {
    title: 'Platform availability and maintenance',
    blocks: [
      'VoltSage aims to maintain reliable access to the platform but does not guarantee uninterrupted or error-free availability.',
      'Access may occasionally be interrupted due to:',
      [
        'Scheduled maintenance or upgrades.',
        'Technical faults or infrastructure failures.',
        'Internet or telecommunications disruptions.',
        'Cybersecurity incidents.',
        'Third-party service interruptions.',
        'Circumstances beyond VoltSage’s reasonable control.',
      ],
      'VoltSage will take reasonable steps to restore service where disruptions occur.',
      'Where reasonably practicable, users may be notified of planned maintenance or significant service interruptions.',
    ],
  },
  {
    title: 'Limitation of liability',
    blocks: [
      'To the extent permitted by applicable law, VoltSage will not be liable for indirect, incidental, special or consequential losses arising from the use of, or inability to use, the platform.',
      'This may include loss of business opportunities, anticipated savings, revenue, profits or data, where such exclusion is legally permitted.',
      'VoltSage is not responsible for losses arising from:',
      [
        'Inaccurate, incomplete or misleading information entered by users.',
        'Reliance on preliminary outputs without appropriate technical verification.',
        'Incorrect equipment selection or installation decisions made by users or third parties.',
        'Failure to comply with applicable technical standards or legal requirements.',
        'Unauthorised access resulting from a user’s failure to protect account credentials.',
      ],
      'Nothing in these Terms excludes or limits liability where such exclusion or limitation is prohibited by applicable law, including liability that cannot lawfully be excluded under applicable consumer protection legislation.',
    ],
  },
  {
    title: 'Suspension and termination',
    blocks: [
      'VoltSage may suspend or terminate an account where:',
      [
        'The user materially breaches these Terms.',
        'Subscription payments remain outstanding.',
        'The account is used fraudulently or unlawfully.',
        'There is suspected unauthorised access or misuse.',
        'The user’s activities pose a material security or operational risk to the platform.',
      ],
      'Where reasonably practicable, VoltSage will notify the subscriber and provide an opportunity to address the breach before termination.',
      'Users may terminate their subscriptions in accordance with the cancellation provisions in these Terms.',
      'Upon termination, access to subscription-based features may be withdrawn.',
      'Any data retention, export or deletion will be handled in accordance with applicable data protection requirements and the VoltSage Privacy Policy.',
    ],
  },
  {
    title: 'Changes to the platform and these Terms',
    blocks: [
      'VoltSage may update its platform, services, subscription plans and these Terms from time to time.',
      'Material changes to these Terms will be communicated through the website, platform or registered contact details, as appropriate.',
      'The updated Terms will state their effective date.',
      'Where changes affect existing subscription arrangements or statutory consumer rights, VoltSage will apply the changes in accordance with applicable law.',
      'Continued use of the platform after the effective date of an update constitutes acceptance of the revised Terms, to the extent that such acceptance is legally valid.',
    ],
  },
  {
    title: 'Governing law and jurisdiction',
    blocks: [
      'These Terms are governed by and interpreted in accordance with the laws of the Republic of South Africa.',
      'Subject to mandatory legal rights and requirements applicable in the country where a user resides or conducts business, disputes arising from these Terms or the use of the VoltSage platform shall be submitted to the jurisdiction of the competent courts of the Republic of South Africa.',
      'Nothing in this clause prevents a consumer from exercising a right or remedy that cannot lawfully be excluded under the laws applicable to that consumer.',
    ],
  },
  {
    title: 'General provisions',
    blocks: [
      'If any provision of these Terms is found to be unlawful, invalid or unenforceable, the remaining provisions will continue to apply to the extent legally permissible.',
      'Failure by VoltSage to enforce a provision does not constitute a waiver of its right to enforce that provision at a later stage.',
      'These Terms, together with the applicable Privacy Policy, Fair Use Policy and any additional written subscription agreement, constitute the agreement governing the use of the VoltSage platform.',
      'Where a separate written agreement has been entered into with a company or organisation, the terms of that agreement will prevail to the extent of any direct inconsistency.',
    ],
  },
  {
    title: 'Contact information',
    blocks: [
      'For subscription enquiries, account support, complaints or questions relating to these Terms, contact:',
      [
        'VoltSage',
        'Website: https://www.voltsage.co',
        'Email: info@voltsage.co',
        'Company registration number: 2026/745189/07',
        'Registered address: 1 Dolce Street, Wilgelheuwel, Roodeport, Gauteng',
        'Physical address for legal service: 1 Dolce Street, Wilgelheuwel, Roodeport, Gauteng',
        'Telephone: +263712670508',
      ],
      'By registering for or using VoltSage, you acknowledge that you have read and understood these Terms of Service.',
    ],
  },
]

export const FAIR_USE_INTRO = [
  'VoltSage subscriptions provide users with access to the platform’s energy assessment and preliminary sizing tools, including Advanced Mode and PDF report generation.',
  'The platform is designed to support legitimate personal and organisational energy assessment activities. To maintain service reliability, security and fair access for all subscribers, the following conditions apply.',
]

export const FAIR_USE_SECTIONS: LegalSection[] = [
  {
    title: 'Individual Subscription',
    blocks: [
      'An Individual subscription is intended for one registered user.',
      [
        'Access is limited to one individual account holder.',
        'Account credentials must not be shared with other individuals.',
        'The subscriber may conduct unlimited energy assessments using the available platform tools.',
        'PDF reports may be generated and downloaded without per-report charges.',
        'The subscription must not be used to provide unauthorised shared access to other users.',
      ],
    ],
  },
  {
    title: 'Company Subscription',
    blocks: [
      'A Company subscription is intended for organisations using VoltSage within their business operations.',
      [
        `Each company subscription supports a maximum of ${COMPANY_USERS} authorised users.`,
        'Each authorised user must have an individual login.',
        'The company account administrator is responsible for managing user access.',
        'User access may be reassigned when employees or authorised representatives leave the organisation.',
        'All authorised users receive access to the available assessment tools, Advanced Mode and unlimited PDF report downloads.',
        'A subscription must not be shared between separate, unrelated organisations.',
      ],
      `Organisations requiring more than ${COMPANY_USERS} users may contact VoltSage for an extended access arrangement.`,
    ],
  },
  {
    title: 'Fair Use of Platform Resources',
    blocks: [
      'VoltSage allows unlimited assessments and PDF report downloads within the scope of an active subscription. However, subscribers must use the platform responsibly.',
      'The following activities are not permitted:',
      [
        'Automated access, scraping, bots or scripts that place excessive demands on platform resources without written authorisation.',
        'Attempts to bypass subscription controls, access restrictions or security mechanisms.',
        'Sharing login credentials or distributing account access beyond the permitted subscription users.',
        'Reselling, sublicensing or redistributing access to the platform without written authorisation from VoltSage.',
        'Using the platform in a manner that disrupts service availability or negatively affects other users.',
      ],
    ],
  },
  {
    title: 'Account Security and Access Management',
    blocks: [
      'Subscribers are responsible for maintaining the confidentiality of their login credentials and notifying VoltSage of suspected unauthorised access.',
      'VoltSage reserves the right to investigate unusual account activity, suspected credential sharing or misuse of platform resources.',
    ],
  },
  {
    title: 'Fair Use Enforcement',
    blocks: [
      'Where suspected misuse is identified, VoltSage may contact the subscriber to clarify the activity and request corrective action.',
      'Depending on the nature and severity of the violation, VoltSage may temporarily restrict access or suspend an account while the matter is investigated.',
      'Where possible, subscribers will be notified and given an opportunity to resolve the issue before access is suspended, except where immediate action is necessary to protect platform security or service availability.',
    ],
  },
  {
    title: 'Policy Updates',
    blocks: [
      'VoltSage may periodically review and update this policy as platform usage, infrastructure requirements and subscription offerings evolve. Subscribers will be notified of material changes.',
    ],
  },
]
