import { CreateProjectFormValues } from "@/lib/create-project/validations";

export class LocalStorageHelper {
  private static prefix = "create_project_";

  static saveDraft(formData: Partial<CreateProjectFormValues>): void {
    try {
      const key = `${this.prefix}draft_${Date.now()}`;
      localStorage.setItem(
        key,
        JSON.stringify({
          data: formData,
          timestamp: Date.now(),
          version: "1.0",
        })
      );
    } catch (error) {
      console.warn("Failed to save draft to local storage:", error);
    }
  }

  static saveProgress(
    formData: Partial<CreateProjectFormValues>,
    step: string
  ): void {
    try {
      const key = `${this.prefix}progress`;
      localStorage.setItem(
        key,
        JSON.stringify({
          data: formData,
          currentStep: step,
          timestamp: Date.now(),
          version: "1.0",
        })
      );
    } catch (error) {
      console.warn("Failed to save progress to local storage:", error);
    }
  }

  static getProgress(): {
    data: Partial<CreateProjectFormValues>;
    currentStep: string;
  } | null {
    try {
      const key = `${this.prefix}progress`;
      const stored = localStorage.getItem(key);
      if (!stored) return null;

      const parsed = JSON.parse(stored);

      // Check if data is less than 24 hours old
      const hoursDiff = (Date.now() - parsed.timestamp) / (1000 * 60 * 60);
      if (hoursDiff > 24) {
        this.clearProgress();
        return null;
      }

      return {
        data: parsed.data,
        currentStep: parsed.currentStep,
      };
    } catch (error) {
      console.warn("Failed to get progress from local storage:", error);
      return null;
    }
  }

  static clearProgress(): void {
    try {
      const key = `${this.prefix}progress`;
      localStorage.removeItem(key);
    } catch (error) {
      console.warn("Failed to clear progress from local storage:", error);
    }
  }

  static getDrafts(): Array<{
    key: string;
    data: Partial<CreateProjectFormValues>;
    timestamp: number;
  }> {
    try {
      const drafts = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(`${this.prefix}draft_`)) {
          const stored = localStorage.getItem(key);
          if (stored) {
            const parsed = JSON.parse(stored);
            drafts.push({
              key,
              data: parsed.data,
              timestamp: parsed.timestamp,
            });
          }
        }
      }

      // Sort by timestamp, newest first
      return drafts.sort((a, b) => b.timestamp - a.timestamp);
    } catch (error) {
      console.warn("Failed to get drafts from local storage:", error);
      return [];
    }
  }

  static deleteDraft(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn("Failed to delete draft from local storage:", error);
    }
  }
}
