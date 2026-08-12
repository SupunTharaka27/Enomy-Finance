/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Client, DataDictionaryEntry, FeedbackItem, TestCase } from './types';

export const MOCK_CLIENTS: Client[] = [
  {
    id: 'C-1001',
    name: 'Sarah Jenkins',
    email: 'sarah.j@example.com',
    phone: '07700 900077',
    status: 'Active',
    annualIncome: 55000,
    creditScore: 780,
    savingsBalance: 12500,
    investmentBalance: 45000,
    riskProfile: 'Medium',
    joinedDate: '2025-03-12',
  },
  {
    id: 'C-1002',
    name: 'David Chen',
    email: 'david.chen@example.com',
    phone: '07700 900154',
    status: 'Pending Approval',
    annualIncome: 82000,
    creditScore: 640,
    savingsBalance: 42000,
    investmentBalance: 0,
    riskProfile: 'Low',
    joinedDate: '2026-02-18',
  },
  {
    id: 'C-1003',
    name: 'Emma Watson',
    email: 'emma.w@example.com',
    phone: '07700 900231',
    status: 'Active',
    annualIncome: 120000,
    creditScore: 810,
    savingsBalance: 15000,
    investmentBalance: 185000,
    riskProfile: 'High',
    joinedDate: '2024-09-05',
  },
  {
    id: 'C-1004',
    name: 'Marcus Rashford',
    email: 'marcus.rash@example.com',
    phone: '07700 900412',
    status: 'Review Required',
    annualIncome: 32000,
    creditScore: 590,
    savingsBalance: 2500,
    investmentBalance: 4000,
    riskProfile: 'Unassessed',
    joinedDate: '2026-05-30',
  },
  {
    id: 'C-1005',
    name: 'Elena Rostova',
    email: 'elena.rost@example.com',
    phone: '07700 900599',
    status: 'Active',
    annualIncome: 68000,
    creditScore: 720,
    savingsBalance: 28500,
    investmentBalance: 15000,
    riskProfile: 'Medium',
    joinedDate: '2025-11-20',
  },
];

export const DATA_DICTIONARY: DataDictionaryEntry[] = [
  // Client Table
  {
    tableName: 'tbl_client',
    fieldName: 'client_id',
    dataType: 'VARCHAR',
    length: '20',
    keyType: 'PK',
    isRequired: true,
    description: 'Unique identifier for each client of Enomy-Finances.',
    constraints: 'Must start with "C-" followed by 4 digits.',
    sampleValue: 'C-1001',
  },
  {
    tableName: 'tbl_client',
    fieldName: 'client_name',
    dataType: 'VARCHAR',
    length: '100',
    keyType: 'None',
    isRequired: true,
    description: 'Full legal name of the client.',
    constraints: 'Alphabetical characters and standard spaces only.',
    sampleValue: 'Sarah Jenkins',
  },
  {
    tableName: 'tbl_client',
    fieldName: 'client_email',
    dataType: 'VARCHAR',
    length: '150',
    keyType: 'None',
    isRequired: true,
    description: 'E-mail address for system communication and notification.',
    constraints: 'Must be a valid RFC 5322 e-mail address format.',
    sampleValue: 'sarah.j@example.com',
  },
  {
    tableName: 'tbl_client',
    fieldName: 'credit_score',
    dataType: 'INT',
    length: '4',
    keyType: 'None',
    isRequired: true,
    description: 'Calculated credit score to assess financial viability.',
    constraints: 'Value must be between 300 and 850.',
    sampleValue: '780',
  },
  {
    tableName: 'tbl_client',
    fieldName: 'annual_income',
    dataType: 'DECIMAL',
    length: '12,2',
    keyType: 'None',
    isRequired: true,
    description: 'Self-reported annual gross income verified by documentation.',
    constraints: 'Must be a non-negative value.',
    sampleValue: '55000.00',
  },
  // Mortgage Product Table
  {
    tableName: 'tbl_mortgage_product',
    fieldName: 'product_id',
    dataType: 'VARCHAR',
    length: '20',
    keyType: 'PK',
    isRequired: true,
    description: 'Unique identifier for mortgage products offered.',
    constraints: 'Starts with "M-" followed by 4 digits.',
    sampleValue: 'M-201',
  },
  {
    tableName: 'tbl_mortgage_product',
    fieldName: 'product_type',
    dataType: 'VARCHAR',
    length: '50',
    keyType: 'None',
    isRequired: true,
    description: 'Category of mortgage loan.',
    constraints: 'In ("Fixed-Rate", "Variable-Tracker", "Help-to-Buy", "Buy-to-Let")',
    sampleValue: 'Fixed-Rate',
  },
  {
    tableName: 'tbl_mortgage_product',
    fieldName: 'interest_rate',
    dataType: 'DECIMAL',
    length: '4,2',
    keyType: 'None',
    isRequired: true,
    description: 'Annual nominal interest rate of the mortgage.',
    constraints: 'Must be between 0.01 and 15.00.',
    sampleValue: '3.29',
  },
  // Savings Account Table
  {
    tableName: 'tbl_savings_account',
    fieldName: 'account_no',
    dataType: 'VARCHAR',
    length: '12',
    keyType: 'PK',
    isRequired: true,
    description: 'Unique bank account number for savings deposit.',
    constraints: '10 digits with optional hyphens.',
    sampleValue: '8820412354',
  },
  {
    tableName: 'tbl_savings_account',
    fieldName: 'client_id',
    dataType: 'VARCHAR',
    length: '20',
    keyType: 'FK',
    isRequired: true,
    description: 'Foreign key mapping back to tbl_client.',
    constraints: 'Must reference a valid client_id in tbl_client.',
    sampleValue: 'C-1001',
  },
  {
    tableName: 'tbl_savings_account',
    fieldName: 'interest_rate',
    dataType: 'DECIMAL',
    length: '4,2',
    keyType: 'None',
    isRequired: true,
    description: 'Interest rate credited per annum.',
    constraints: 'Must be greater than 0.00.',
    sampleValue: '3.50',
  },
  // Investment Portfolio Table
  {
    tableName: 'tbl_investment_portfolio',
    fieldName: 'portfolio_id',
    dataType: 'VARCHAR',
    length: '20',
    keyType: 'PK',
    isRequired: true,
    description: 'Unique reference to a client\'s investment profile.',
    constraints: 'Starts with "I-" followed by 4 digits.',
    sampleValue: 'I-3001',
  },
  {
    tableName: 'tbl_investment_portfolio',
    fieldName: 'risk_profile',
    dataType: 'VARCHAR',
    length: '15',
    keyType: 'None',
    isRequired: true,
    description: 'The classified risk level determining asset split.',
    constraints: 'In ("Low", "Medium", "High")',
    sampleValue: 'Medium',
  },
];

export const FEEDBACK_ITEMS: FeedbackItem[] = [
  {
    id: 'FB-01',
    reviewer: 'Robert Hargreaves',
    role: 'Senior Software Architect, PDS',
    feedback: 'The initial algorithmic designs for the mortgage interest calculations used simple annual splitting which does not accurately capture monthly compounded amortization. Recommend replacing it with the standard banking amortization formula.',
    actionTaken: 'Implemented the complete monthly amortization compound formula in both the interactive portal and revised pseudocode, ensuring exact penny-matching with standard mortgage tables.',
    date: '2026-06-15',
    status: 'Approved',
  },
  {
    id: 'FB-02',
    reviewer: 'Marcus Sterling',
    role: 'Enomy-Finances Chief Technical Officer (Client)',
    feedback: 'We need to make sure that our Help-to-Buy and Buy-to-Let products are separated under the mortgage logical states, because Help-to-Buy has government-backed loan parameters that affect debt calculation and credit ratio guards.',
    actionTaken: 'Refined the Finite State Machine and Extended FSM diagram nodes to include explicit branch pathways and guard variables (`creditScore >= 600`, `depositPercent >= 5` for Help-to-Buy, and `depositPercent >= 25` for Buy-to-Let).',
    date: '2026-07-02',
    status: 'Approved',
  },
  {
    id: 'FB-03',
    reviewer: 'Sarah G.',
    role: 'Lead QA Engineer, PDS',
    feedback: 'Our stress testing team noted that if clients enter very large amounts into the savings compound calculator, it could trigger float overflows. We need constraint rules or validation boundaries in the data designs.',
    actionTaken: 'Updated the Data Dictionary with strict boundaries (e.g. `maximum property value of $10,000,000` and `maximum savings balance of $5,000,000`) and implemented UI-level guards that cap values and trigger elegant form errors.',
    date: '2026-07-10',
    status: 'Resolved',
  },
];

export const INITIAL_TEST_CASES: TestCase[] = [
  {
    id: 'TC-01',
    category: 'Mortgage',
    description: 'Validate standard fixed-rate mortgage repayment calculation for standard inputs.',
    inputs: 'Loan: $200,000, Term: 25 years, Interest Rate: 3.50%',
    expectedResult: 'Monthly repayment is $1,001.25. Total repayment is $300,375.01. Total interest is $100,375.01.',
    actualResult: '',
    status: 'Untested',
  },
  {
    id: 'TC-02',
    category: 'Mortgage',
    description: 'Ensure system rejects Help-to-Buy mortgages if the deposit is less than 5%.',
    inputs: 'Property Value: $300,000, Deposit: $10,000 (3.33%), Mortgage Type: Help-to-Buy',
    expectedResult: 'System returns validation error: "Help-to-Buy requires a minimum deposit of 5%." Prompting the user to adjust deposits.',
    actualResult: '',
    status: 'Untested',
  },
  {
    id: 'TC-03',
    category: 'Savings',
    description: 'Validate easy-access savings compounding calculator with monthly contributions.',
    inputs: 'Initial: $1,000, Monthly Deposit: $100, Rate: 1.50%, Years: 5',
    expectedResult: 'Total principal contributed: $7,000. Final accumulated balance: $7,281.82 (Interest earned: $281.82).',
    actualResult: '',
    status: 'Untested',
  },
  {
    id: 'TC-04',
    category: 'Investments',
    description: 'Verify risk profiler score maps correctly to the "High Risk" (Aggressive) portfolio allocation.',
    inputs: 'Age: 28, Goal: Long-term wealth, Response to 20% drop: "Buy more", Horizon: > 10 years',
    expectedResult: 'Score: 16+ points. Mapped to "High Risk" (Aggressive Portfolio). Asset allocation: Stocks 80%, Bonds 15%, Cash 5%.',
    actualResult: '',
    status: 'Untested',
  },
  {
    id: 'TC-05',
    category: 'System',
    description: 'Ensure staff cannot authorize a client loan that exceeds 4.5x their verified annual income (Debt-to-Income Constraint).',
    inputs: 'Annual Income: $30,000, Attempted Loan: $150,000 (Ratio: 5.0x)',
    expectedResult: 'Staff dashboard displays caution indicator and blocks registration with "Loan amount exceeds maximum debt-to-income threshold (4.5x)."',
    actualResult: '',
    status: 'Untested',
  },
  {
    id: 'TC-06',
    category: 'Forex',
    description: 'Verify currency exchange conversion and buy/sell fee cost calculation across EUR, BRL, JPY, and TRY.',
    inputs: 'Trade: Buy 1,000 EUR using BRL, Bank Spread: 0.75%, Fixed Fee: $5',
    expectedResult: 'Calculates exact spot exchange rate, applies bank buy spread markup, computes total cost in BRL and displays transparent fee breakdown.',
    actualResult: '',
    status: 'Untested',
  },
];

export const METHODOLOGY_DETAILS = {
  selectedMethodology: 'Waterfall (Structured Lifecycle)',
  justification: [
    'Upfront Requirement Engineering: Standardizing complex banking calculations, loan compliance caps, and exact mortgage amortization formulas upfront eliminates mid-cycle design discrepancies.',
    'Deterministic Quality & Security Assurance: Since we handle high-value asset valuations and critical financial data, a complete validation phase ensures flawless compliance with international lending rules before deployment.',
    'Structured Milestone Progress: A step-by-step sequential progression from comprehensive database schema layouts (tbl_client, tbl_mortgage_product) to complete validation algorithms prevents architectural regression.',
    'Predictable Scope and Budget Control: Establishing fixed specifications provides Enomy-Finances stakeholders with precise structural transparency, deterministic timelines, and predictable deliverables.'
  ],
  investigation: {
    scope: 'Designing and building a secure, responsive, full-stack client-and-staff web application containing advanced calculation calculators for mortgages, goal-oriented savings, risk profiling for investments, a client account portal, and an advisor console.',
    requirements: [
      'Interactive calculation engines for Mortgages (Fixed-Rate, variable, Buy-to-Let, Help-to-Buy) utilizing banking amortization mathematical equations.',
      'A savings calculator supporting monthly compounds, goal validation, and product yield comparisons.',
      'A multi-question risk assessment profiling system that allocates diversified asset portfolios based on risk parameters.',
      'Staff workstation providing data set loading, client profiles filtering, credit risk audits, and automated advisory report compilation.',
      'High-contrast visual design, accessible colors, and desktop-first responsive interface.'
    ],
    constraints: [
      'No HMR during active development. Application must compile securely on production nodes.',
      'Maximum LTV (Loan-to-Value) boundaries and Debt-to-Income (DTI) caps for financial safety compliance.',
      'All user-authored calculations must have validation guards against mathematical floating overflow errors.',
      'Must work inside sandboxed iFrame environments securely with no heavy dependency on external state servers.'
    ],
    processes: [
      { name: 'P1: Mortgage Repayment Calculation', description: 'Retrieves principal, deposit, interest rate, and term. Validates LTV and DTI, compiles monthly payment, and creates amortization schedule.' },
      { name: 'P2: Savings Goal Projections', description: 'Applies monthly compounding calculations to a series of inputs over a designated term, projecting future savings balances against goals.' },
      { name: 'P3: Risk Profiling & Portfolio Recommendation', description: 'Scores questionnaires, classifies risk, maps asset splits, and simulates 10-year growth trajectories based on historical performance indices.' },
      { name: 'P4: Client Risk Auditing', description: 'Compares active client loan applications against credit score and income ratios, alerting staff of compliance anomalies.' }
    ]
  }
};

export const PSEUDOCODE_MORTGAGE = `// ==========================================
// Process 1: Monthly Mortgage Amortization Calculator
// Input: propertyValue, depositAmount, termYears, nominalAnnualRate, mortgageType
// Output: monthlyPayment, totalInterest, totalPaid, amortizationSchedule
// ==========================================

FUNCTION CalculateMortgageRepayment(propertyValue, depositAmount, termYears, nominalAnnualRate, mortgageType)
    // 1. Initial validations and constraints
    IF depositAmount < 0 OR propertyValue <= 0 THEN
        RETURN ERROR "Invalid monetary parameters"
    END IF
    
    LET principal = propertyValue - depositAmount
    IF principal <= 0 THEN
        RETURN ERROR "Deposit cannot exceed property value"
    END IF
    
    LET loanToValue = (principal / propertyValue) * 100
    
    // 2. Product-specific constraints (Security and Compliance guards)
    IF mortgageType IS "Help-to-Buy" AND loanToValue > 95 THEN
        RETURN ERROR "Help-to-Buy requires a minimum of 5% deposit (Max 95% LTV)"
    ELSE IF mortgageType IS "Buy-to-Let" AND loanToValue > 75 THEN
        RETURN ERROR "Buy-to-Let requires a minimum of 25% deposit (Max 75% LTV)"
    END IF
    
    // 3. Compounding Calculations
    LET monthlyRate = nominalAnnualRate / 100 / 12
    LET totalMonths = termYears * 12
    
    LET monthlyPayment = 0.0
    
    IF monthlyRate == 0 THEN
        monthlyPayment = principal / totalMonths
    ELSE
        // Apply standard banking amortization equation: M = P * [r(1+r)^n] / [(1+r)^n - 1]
        LET compoundingFactor = (1 + monthlyRate) ^ totalMonths
        monthlyPayment = principal * (monthlyRate * compoundingFactor) / (compoundingFactor - 1)
    END IF
    
    LET totalPaid = monthlyPayment * totalMonths
    LET totalInterest = totalPaid - principal
    
    // 4. Compile detailed schedule
    LET remainingBalance = principal
    LET schedule = NEW ARRAY
    
    FOR month = 1 TO totalMonths
        LET interestPayment = remainingBalance * monthlyRate
        LET principalPayment = monthlyPayment - interestPayment
        remainingBalance = remainingBalance - principalPayment
        
        // Ensure balance does not drop below zero due to float precision
        IF remainingBalance < 0 THEN remainingBalance = 0
        
        schedule.PUSH({
            monthIndex: month,
            principalPaid: principalPayment,
            interestPaid: interestPayment,
            balanceRemaining: remainingBalance
        })
    END FOR
    
    RETURN {
        monthlyPayment: ROUND(monthlyPayment, 2),
        totalInterestPaid: ROUND(totalInterest, 2),
        totalAmountPaid: ROUND(totalPaid, 2),
        loanToValueRatio: ROUND(loanToValue, 2),
        schedule: schedule
    }
END FUNCTION`;

export const PSEUDOCODE_SAVINGS = `// ==========================================
// Process 2: Savings Goal Compound Calculator
// Input: initialSum, monthlyDeposit, yearsTerm, annualNominalRate
// Output: totalPrincipal, totalInterest, finalValue, annualMilestones
// ==========================================

FUNCTION CalculateCompoundSavings(initialSum, monthlyDeposit, yearsTerm, annualNominalRate)
    LET monthlyRate = annualNominalRate / 100 / 12
    LET totalMonths = yearsTerm * 12
    
    LET currentValue = initialSum
    LET totalPrincipal = initialSum
    LET milestones = NEW ARRAY
    
    FOR month = 1 TO totalMonths
        // 1. Accrue monthly interest on current balance
        LET interestEarned = currentValue * monthlyRate
        currentValue = currentValue + interestEarned
        
        // 2. Add monthly contributions
        currentValue = currentValue + monthlyDeposit
        totalPrincipal = totalPrincipal + monthlyDeposit
        
        // 3. Record annual milestones
        IF month % 12 == 0 THEN
            LET currentYear = month / 12
            milestones.PUSH({
                year: currentYear,
                principalContributed: totalPrincipal,
                totalBalance: currentValue,
                cumulativeInterest: currentValue - totalPrincipal
            })
        END IF
    END FOR
    
    RETURN {
        totalPrincipal: ROUND(totalPrincipal, 2),
        totalInterest: ROUND(currentValue - totalPrincipal, 2),
        totalValue: ROUND(currentValue, 2),
        milestones: milestones
    }
END FUNCTION`;

export const USER_MANUAL_SECTIONS = [
  {
    title: 'Navigating the Portal & Global Currency Selector',
    content: 'The Enomy-Finances System Portal is divided into three primary operational workspaces: Client Advisory Workspace (customer-facing financial tools), Advisor Workstation (staff CRM & risk audit tools), and Help Guidance | QA Test Hub (quality assurance test suite and operational documentation). Use the global currency dropdown in the top header bar to seamlessly switch baseline display currency across GBP (£), USD ($), EUR (€), BRL (R$), JPY (¥), and TRY (₺).',
  },
  {
    title: 'Foreign Currency FX & Conversion Calculator',
    content: 'Select the "FX & Currency Calculator" tab in the Client Advisory Workspace to calculate buying and selling costs across Euro (EUR), Brazilian Real (BRL), Japanese Yen (JPY), Turkish Lira (TRY), US Dollar (USD), and Pound Sterling (GBP). The module enforces official Appendix 1 transaction limits of 300 (minimum) to 5,000 (maximum) source currency units. It applies Enomy-Finances tiered transaction fee schedules: Up to 500 (3.5%), Over 500 to 1,500 (2.7%), Over 1,500 to 2,500 (2.0%), and Over 2,500 to 5,000 (1.5%). Switch between Buy, Sell, and Mid-Market Spot modes, and view live net conversion breakdowns alongside a 6-currency cross-rate matrix.',
  },
  {
    title: 'Savings & Investment Quote Generator',
    content: 'Select the "Savings & Investment Quotes" tab in the Client Advisory Workspace to generate official personalised quotes under RBSX Group Investment Terms. Choose between Option 1 – Basic Savings Plan (Max £20k/yr, 1.2%-2.4% return, 0% tax, 0.25%/mo fee), Option 2 – Savings Plan Plus (Max £30k/yr, Min £300 lump sum, 3.0%-5.5% return, 10% tax above £12k profit, 0.30%/mo fee), and Option 3 – Managed Stock Investments (Unlimited annual cap, Min £1,000 lump sum, 4.0%-23.0% return, 10% tax above £12k / 20% above £40k profit, 1.30%/mo fee). The calculator displays 1, 5, and 10-year horizon projections with formatted currency values to 2 decimal places, net profits, total fees, and estimated tax deductions.',
  },
  {
    title: 'Fault Tolerance, Caching & System Diagnostics',
    content: 'In accordance with Appendix 1 resilient architecture requirements, all client quote parameters and calculated state vectors are automatically cached to local browser storage upon input. In the event of system errors or network interruptions, user data is preserved immediately. Click "Simulate Diagnostics Log" in the Quote Generator to observe real-time diagnostic telemetry logs recorded for audit compliance.',
  },
  {
    title: 'Using the Mortgage & LTV Advisor',
    content: 'Select the "Mortgages Advisor" tab in the Client Advisory Workspace. Input property valuation, deposit amount, product type (Fixed, Variable, Tracker), and repayment term (5 to 35 years). The engine computes Loan-to-Value (LTV) ratios and monthly repayments while generating a dynamic principal vs interest amortization curve over the lifetime of the mortgage.',
  },
  {
    title: 'Performing Investment Risk Profiling',
    content: 'Select the "Investments Assessor" tab to complete a 5-question risk assessment survey. Upon submission, the engine evaluates responses to assign a risk tier (Low, Medium, High Risk) and recommends a tailored asset allocation (stocks, bonds, cash, alternatives) with 10-year growth projection curves.',
  },
  {
    title: 'Advisor Workstation & Client CRM Operations',
    content: 'Switch to the "Advisor Workstation" tab for staff operations. Search and filter client database records, perform Debt-to-Income (DTI) ratio audits, flag high-risk accounts exceeding 4.5x DTI limits, update client profiles, and compile formal client advisory reports.',
  },
];

export const TECHNICAL_MANUAL_SECTIONS = [
  {
    title: 'Architectural Framework & Port',
    content: 'The application is engineered as a Single Page Application (SPA) using React 18, Vite, and Tailwind CSS v4. Standard port binding rules apply: the system runs exclusively on port 3000 behind an nginx reverse proxy node with HMR disabled to ensure atomic agent deployments and CPU optimization.',
  },
  {
    title: 'Financial Algorithms & Calculations',
    content: 'Core logic functions are decoupled from UI components inside clean helper functions. The mortgage repayment math implements standard compounding amortization rules, preventing floating-point precision leakage by using rounding limits. Risk calculations translate multi-variant answers into bounded score indices.',
  },
  {
    title: 'State Management & Storage',
    content: 'The core client database state is loaded from pre-populated datasets in tbl_client and maintained reactively via standard React local states, permitting direct editing, searching, and filtering on the Staff Workstation. No external unsecured cloud integrations are initialized to respect enterprise compliance requirements.',
  },
];
