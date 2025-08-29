// Analytics configuration and management
export const ANALYTICS_CONFIG = {
  customEvents: {
    recipeGenerated: "recipe_generated",
    costCalculated: "cost_calculated",
    userEngagement: "user_engagement",
    errorOccurred: "error_occurred",
    pageView: "page_view",
  },
  enabledServices: {
    localAnalytics: true,
    googleAnalytics: false, // Disabled for privacy
  },
};

// Privacy-first analytics manager
export class AnalyticsManager {
  private static initialized = false;
  private static events: Array<{ name: string; data: any; timestamp: number }> =
    [];
  private static maxEvents = 100;

  static initialize() {
    if (this.initialized) return;

    // Check for user consent
    if (!ConsentManager.hasAnalyticsConsent()) {
      console.log("Analytics disabled - no user consent");
      return;
    }

    this.initialized = true;
    console.log("Analytics initialized (privacy-first mode)");
  }

  static trackEvent(eventName: string, parameters: Record<string, any> = {}) {
    if (!this.initialized || !ConsentManager.hasAnalyticsConsent()) return;

    const event = {
      name: eventName,
      data: parameters,
      timestamp: Date.now(),
    };

    this.events.push(event);

    // Keep only recent events
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents);
    }

    console.log("Analytics Event:", event);
  }

  static trackPageView(path: string, title: string) {
    this.trackEvent(ANALYTICS_CONFIG.customEvents.pageView, {
      page_path: path,
      page_title: title,
    });
  }

  static trackRecipeGeneration(data: {
    fruit: string;
    style: string;
    service: string;
    success: boolean;
    duration?: number;
  }) {
    this.trackEvent(ANALYTICS_CONFIG.customEvents.recipeGenerated, data);
  }

  static trackCostCalculation(data: {
    users: number;
    recipesPerUser: number;
    totalCost: number;
  }) {
    this.trackEvent(ANALYTICS_CONFIG.customEvents.costCalculated, data);
  }

  static trackUserEngagement(
    action: string,
    details: Record<string, any> = {}
  ) {
    this.trackEvent(ANALYTICS_CONFIG.customEvents.userEngagement, {
      action,
      ...details,
    });
  }

  static getAnalyticsData() {
    return {
      events: this.events,
      initialized: this.initialized,
      eventCount: this.events.length,
    };
  }

  static disable() {
    this.initialized = false;
    this.clearEvents();
  }

  static getEvents() {
    return this.events;
  }

  static clearEvents() {
    this.events = [];
  }
}

// Consent management for GDPR compliance
export class ConsentManager {
  private static consentKey = "tropical_ai_chef_analytics_consent";
  private static consentGranted = false;

  static hasConsent(): boolean {
    return this.hasAnalyticsConsent();
  }

  static hasAnalyticsConsent(): boolean {
    if (this.consentGranted) return true;

    try {
      const stored = localStorage.getItem(this.consentKey);
      this.consentGranted = stored === "granted";
      return this.consentGranted;
    } catch {
      return false; // If localStorage is not available
    }
  }

  static giveConsent() {
    this.grantConsent();
  }

  static grantConsent() {
    this.consentGranted = true;
    try {
      localStorage.setItem(this.consentKey, "granted");
    } catch {
      // Handle localStorage errors gracefully
    }
    AnalyticsManager.initialize();
  }

  static revokeConsent() {
    this.consentGranted = false;
    try {
      localStorage.removeItem(this.consentKey);
    } catch {
      // Handle localStorage errors gracefully
    }
    AnalyticsManager.clearEvents();
  }

  static getConsentStatus() {
    return {
      granted: this.hasAnalyticsConsent(),
      timestamp: Date.now(),
    };
  }
}

export default AnalyticsManager;
