import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tables, TablesInsert } from "@/integrations/supabase/types";
import { toast } from "sonner";

export type Order = Tables<"orders">;
export type OrderInsert = TablesInsert<"orders">;

export interface JuiceItem {
  name: string;
  quantity: number;
  price: number;
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;
      setOrders(data ?? []);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to load orders";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const createOrder = useCallback(async (orderData: Omit<OrderInsert, "user_id">) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please sign in to place an order");
        return null;
      }

      const { data, error: insertError } = await supabase
        .from("orders")
        .insert({ ...orderData, user_id: user.id })
        .select()
        .single();

      if (insertError) throw insertError;

      setOrders((prev) => [data, ...prev]);
      toast.success("Order placed successfully! 🎉");
      return data;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to create order";
      toast.error(message);
      return null;
    }
  }, []);

  const updateOrderRating = useCallback(async (orderId: string, rating: number) => {
    try {
      const { error: updateError } = await supabase
        .from("orders")
        .update({ rating })
        .eq("id", orderId);

      if (updateError) throw updateError;

      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, rating } : o))
      );
      toast.success("Rating saved! ⭐");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to update rating";
      toast.error(message);
    }
  }, []);

  const currentOrders = orders.filter((o) =>
    ["pending", "preparing", "shipped"].includes(o.status)
  );
  const pastOrders = orders.filter((o) =>
    ["delivered", "cancelled"].includes(o.status)
  );

  return {
    orders,
    currentOrders,
    pastOrders,
    loading,
    error,
    fetchOrders,
    createOrder,
    updateOrderRating,
  };
}
