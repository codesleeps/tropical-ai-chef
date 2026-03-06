import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ShoppingCart,
  Clock,
  CheckCircle,
  Package,
  Truck,
  Calendar,
  RefreshCw,
} from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useOrders, type JuiceItem } from "@/hooks/useOrders";
import heroImage from "@/assets/tropical-hero.jpg";

const Orders = () => {
  const [activeTab, setActiveTab] = useState("current");
  const { currentOrders, pastOrders, loading, error, fetchOrders, updateOrderRating } = useOrders();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "preparing":
        return <Clock className="w-4 h-4" />;
      case "shipped":
        return <Truck className="w-4 h-4" />;
      case "delivered":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "preparing":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "shipped":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "delivered":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const renderStars = (rating: number, orderId: string) => {
    return Array.from({ length: 5 }, (_, i) => (
      <button
        key={i}
        onClick={() => updateOrderRating(orderId, i + 1)}
        className={`text-lg hover:scale-110 transition-transform ${
          i < rating ? "text-yellow-400" : "text-gray-300"
        }`}
        aria-label={`Rate ${i + 1} star${i + 1 !== 1 ? "s" : ""}`}
      >
        ⭐
      </button>
    ));
  };

  const getJuices = (juices: unknown): JuiceItem[] => {
    if (Array.isArray(juices)) return juices as JuiceItem[];
    return [];
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
        {/* Order Management Introduction Section */}
        <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${heroImage})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-background/90 to-secondary/30" />
          </div>
          <div className="relative z-10 container mx-auto max-w-4xl text-center px-6">
            <div className="flex justify-center mb-6">
              <div className="flex items-center gap-4 text-6xl">📦🚚✨</div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-sunset bg-clip-text text-transparent leading-tight">
              Your
              <br />
              Orders
            </h1>
            <p className="text-xl md:text-2xl text-foreground/80 mb-8 max-w-3xl mx-auto leading-relaxed">
              Track your tropical juice deliveries and explore your order
              history.
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                size="lg"
                className="gradient-tropical text-foreground font-bold text-lg px-8 py-6 hover:scale-105 transition-bounce shadow-tropical"
              >
                <ShoppingCart className="w-6 h-6 mr-2" />
                Create New Order
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={fetchOrders}
                disabled={loading}
                className="font-bold text-lg px-8 py-6"
              >
                <RefreshCw className={`w-5 h-5 mr-2 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>
          </div>
        </section>

        {/* Order Management */}
        <section className="px-6 pb-8">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2 text-secondary">Orders</h2>
              <p className="text-sm text-muted-foreground">
                Switch between current orders and order history
              </p>
            </div>
            <div className="flex justify-center mb-8">
              <div className="flex bg-muted rounded-lg p-1">
                <Button
                  variant={activeTab === "current" ? "default" : "ghost"}
                  onClick={() => setActiveTab("current")}
                  className={
                    activeTab === "current"
                      ? "gradient-tropical text-foreground"
                      : ""
                  }
                >
                  Current Orders
                </Button>
                <Button
                  variant={activeTab === "past" ? "default" : "ghost"}
                  onClick={() => setActiveTab("past")}
                  className={
                    activeTab === "past"
                      ? "gradient-tropical text-foreground"
                      : ""
                  }
                >
                  Order History
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Order List */}
        <section className="px-6 pb-16">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2 text-secondary">
                {activeTab === "current" ? "Current Orders" : "Order History"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {activeTab === "current"
                  ? "Track your active orders and delivery status"
                  : "Review your past orders and reorder favorites"}
              </p>
            </div>
            {loading && (
              <div className="text-center py-12 text-muted-foreground">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
                <p>Loading your orders...</p>
              </div>
            )}
            {error && (
              <Card className="shadow-tropical border-0 text-center p-8 bg-red-50 dark:bg-red-950">
                <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
                <Button variant="outline" onClick={fetchOrders}>Try Again</Button>
              </Card>
            )}
            {!loading && !error && (
            <div className="space-y-6">
              {activeTab === "current" ? (
                currentOrders.length > 0 ? (
                  currentOrders.map((order) => {
                    const juices = getJuices(order.juices);
                    return (
                    <Card key={order.id} className="shadow-tropical border-0">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-xl mb-2">
                              Order #{order.id.slice(0, 8).toUpperCase()}
                            </CardTitle>
                            <CardDescription className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              Ordered on{" "}
                              {new Date(order.created_at).toLocaleDateString()}
                            </CardDescription>
                          </div>
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {getStatusIcon(order.status)}
                            {order.status.charAt(0).toUpperCase() +
                              order.status.slice(1)}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {/* Juice Items */}
                          <div className="space-y-2">
                            {juices.map((juice, index) => (
                              <div
                                key={index}
                                className="flex justify-between items-center"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="text-2xl">🥤</div>
                                  <div>
                                    <div className="font-medium">
                                      {juice.name}
                                    </div>
                                    <div className="text-sm text-foreground/70">
                                      Qty: {juice.quantity}
                                    </div>
                                  </div>
                                </div>
                                <div className="font-bold">
                                  ${Number(juice.price).toFixed(2)}
                                </div>
                              </div>
                            ))}
                          </div>

                          <Separator />

                          {/* Order Summary */}
                          <div className="flex justify-between items-center font-bold text-lg">
                            <span>Total</span>
                            <span className="text-primary">
                              ${Number(order.total).toFixed(2)}
                            </span>
                          </div>

                          {/* Delivery Info */}
                          <div className="bg-muted/50 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Truck className="w-4 h-4 text-secondary" />
                              <span className="font-medium">
                                Delivery Information
                              </span>
                            </div>
                            <div className="text-sm text-foreground/70 space-y-1">
                              {order.estimated_delivery && (
                                <div>
                                  Expected:{" "}
                                  {new Date(order.estimated_delivery).toLocaleDateString()}
                                </div>
                              )}
                              {order.delivery_address && <div>{order.delivery_address}</div>}
                            </div>
                          </div>

                          <div className="flex gap-3">
                            <Button variant="outline" className="flex-1">
                              Track Order
                            </Button>
                            <Button variant="outline" className="flex-1">
                              Contact Support
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    );
                  })
                ) : (
                  <Card className="shadow-tropical border-0 text-center p-12">
                    <div className="text-6xl mb-4">🛒</div>
                    <h3 className="text-xl font-bold mb-2">
                      No Current Orders
                    </h3>
                    <p className="text-foreground/70 mb-6">
                      You don't have any active orders right now.
                    </p>
                    <Button className="gradient-tropical text-foreground">
                      Start Shopping
                    </Button>
                  </Card>
                )
              ) : (
                pastOrders.length > 0 ? pastOrders.map((order) => {
                  const juices = getJuices(order.juices);
                  return (
                  <Card key={order.id} className="shadow-tropical border-0">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl mb-2">
                            Order #{order.id.slice(0, 8).toUpperCase()}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {order.delivered_date
                              ? `Delivered on ${new Date(order.delivered_date).toLocaleDateString()}`
                              : `Ordered on ${new Date(order.created_at).toLocaleDateString()}`}
                          </CardDescription>
                        </div>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {getStatusIcon(order.status)}
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Juice Items */}
                        <div className="space-y-2">
                          {juices.map((juice, index) => (
                            <div
                              key={index}
                              className="flex justify-between items-center"
                            >
                              <div className="flex items-center gap-3">
                                <div className="text-2xl">🥤</div>
                                <div>
                                  <div className="font-medium">
                                    {juice.name}
                                  </div>
                                  <div className="text-sm text-foreground/70">
                                    Qty: {juice.quantity}
                                  </div>
                                </div>
                              </div>
                              <div className="font-bold">
                                ${Number(juice.price).toFixed(2)}
                              </div>
                            </div>
                          ))}
                        </div>

                        <Separator />

                        <div className="flex justify-between items-center">
                          <div className="font-bold text-lg">
                            Total:{" "}
                            <span className="text-primary">
                              ${Number(order.total).toFixed(2)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-foreground/70">
                              Your Rating:
                            </span>
                            <div className="flex">
                              {renderStars(order.rating ?? 0, order.id)}
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <Button variant="outline" className="flex-1">
                            Reorder
                          </Button>
                          <Button variant="outline" className="flex-1">
                            Write Review
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  );
                }) : (
                  <Card className="shadow-tropical border-0 text-center p-12">
                    <div className="text-6xl mb-4">📋</div>
                    <h3 className="text-xl font-bold mb-2">No Past Orders</h3>
                    <p className="text-foreground/70">Your order history will appear here.</p>
                  </Card>
                )
              )}
            </div>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default Orders;
