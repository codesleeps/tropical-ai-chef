import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface SavedCalculation {
  id: string;
  daily_users: number;
  recipes_per_user: number;
  monthly_recipes: number;
  openai_monthly_cost: number;
  huggingface_monthly_cost: number;
  scenario_name: string;
  created_at: string;
}

export function useCostCalculations() {
  const [calculations, setCalculations] = useState<SavedCalculation[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCalculations = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("cost_calculations")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      setCalculations(data ?? []);
    } catch {
      // If table doesn't exist, use localStorage fallback
      const stored = localStorage.getItem("cost_calculations");
      if (stored) {
        setCalculations(JSON.parse(stored));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCalculations();
  }, [fetchCalculations]);

  const saveCalculation = useCallback(async (
    scenario: Omit<SavedCalculation, "id" | "created_at">
  ) => {
    try {
      const { data, error } = await supabase
        .from("cost_calculations")
        .insert(scenario)
        .select()
        .single();

      if (error) throw error;

      setCalculations((prev) => [data, ...prev.slice(0, 9)]);
      toast.success("Calculation saved to cloud! ☁️");
      return data;
    } catch {
      // Fallback to localStorage
      const stored = localStorage.getItem("cost_calculations");
      const existing: SavedCalculation[] = stored ? JSON.parse(stored) : [];
      const newCalc: SavedCalculation = {
        ...scenario,
        id: `local-${Date.now()}`,
        created_at: new Date().toISOString(),
      };
      const updated = [newCalc, ...existing].slice(0, 10);
      localStorage.setItem("cost_calculations", JSON.stringify(updated));
      setCalculations(updated);
      toast.success("Calculation saved locally! 💾");
      return newCalc;
    }
  }, []);

  const deleteCalculation = useCallback(async (id: string) => {
    try {
      await supabase.from("cost_calculations").delete().eq("id", id);
    } catch {
      // Ignore - will be removed from local list anyway
    }
    setCalculations((prev) => prev.filter((c) => c.id !== id));
    toast.info("Calculation removed");
  }, []);

  return {
    calculations,
    loading,
    fetchCalculations,
    saveCalculation,
    deleteCalculation,
  };
}
