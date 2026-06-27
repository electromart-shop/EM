// Utility module for Anti-Spam Security & Bot Protection

export interface MathChallenge {
  num1: number;
  num2: number;
  operator: string;
  expectedAnswer: number;
}

export function generateMathChallenge(): MathChallenge {
  const num1 = Math.floor(Math.random() * 10) + 1; // 1 to 10
  const num2 = Math.floor(Math.random() * 9) + 1;  // 1 to 9
  return {
    num1,
    num2,
    operator: "+",
    expectedAnswer: num1 + num2,
  };
}

const SPAM_KEYWORDS = [
  "http://",
  "https://",
  "[url=",
  "[link=",
  "casino",
  "crypto",
  "poker",
  "viagra",
  "seo service",
  "backlinks",
  "telegram.me",
  "t.me/",
  "wa.me/",
];

export interface SpamCheckParams {
  honeypotValue?: string;
  formStartTime?: number; // timestamp ms
  userAnswer?: string | number;
  expectedAnswer?: number;
  textFieldsToScan?: string[];
  storageKey?: string;
  cooldownSeconds?: number;
}

export interface SpamCheckResult {
  isSpam: boolean;
  reason?: string;
}

/**
 * Validates form submission against multiple anti-spam signals
 */
export function checkSpamSubmission(params: SpamCheckParams): SpamCheckResult {
  const {
    honeypotValue,
    formStartTime,
    userAnswer,
    expectedAnswer,
    textFieldsToScan = [],
    storageKey = "last_order_timestamp",
    cooldownSeconds = 60,
  } = params;

  // 1. Honeypot check (Bots fill out hidden fields automatically)
  if (honeypotValue && honeypotValue.trim().length > 0) {
    return { isSpam: true, reason: "Automated bot activity detected." };
  }

  // 2. Minimum Time-on-Form check (Form submitted faster than humanly possible, e.g. < 2.5 seconds)
  if (formStartTime) {
    const duration = Date.now() - formStartTime;
    if (duration < 2500) {
      return { isSpam: true, reason: "Form submitted too quickly. Please take a moment to review your details." };
    }
  }

  // 3. Math Challenge verification (if specified)
  if (expectedAnswer !== undefined && userAnswer !== undefined) {
    const numericUserAnswer = parseInt(String(userAnswer).trim(), 10);
    if (isNaN(numericUserAnswer) || numericUserAnswer !== expectedAnswer) {
      return { isSpam: true, reason: "Incorrect security verification answer. Please check your math answer." };
    }
  }

  // 4. Rate limiting / Cooldown check via localStorage
  if (typeof window !== "undefined" && storageKey) {
    try {
      const lastSubmit = localStorage.getItem(storageKey);
      if (lastSubmit) {
        const elapsedSeconds = (Date.now() - parseInt(lastSubmit, 10)) / 1000;
        if (elapsedSeconds < cooldownSeconds) {
          const remaining = Math.ceil(cooldownSeconds - elapsedSeconds);
          return {
            isSpam: true,
            reason: `Please wait ${remaining} second${remaining > 1 ? "s" : ""} before submitting another request.`,
          };
        }
      }
    } catch (e) {
      // Ignore localStorage errors in private browsing modes
    }
  }

  // 5. Spam Keyword / Link content scanning
  for (const text of textFieldsToScan) {
    if (!text) continue;
    const lower = text.toLowerCase();
    for (const kw of SPAM_KEYWORDS) {
      if (lower.includes(kw)) {
        return { isSpam: true, reason: "Submission contains prohibited link patterns or spam keywords." };
      }
    }
  }

  return { isSpam: false };
}

/**
 * Records the current submission timestamp to enforce cooldown rate limiting
 */
export function recordSubmission(storageKey: string = "last_order_timestamp") {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(storageKey, String(Date.now()));
    } catch (e) {
      // Ignore localStorage errors
    }
  }
}
