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
} from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

const Orders = () => {
  const [activeTab, setActiveTab] = useState("current");

  const currentOrders = [
    {
      id: "ORD-2024-001",
      status: "preparing",
      juices: [
        { name: "Tropical Mango Energy Blast", quantity: 2, price: 12.99 },
        { name: "Dragon Fruit Detox Smoothie", quantity: 1, price: 14.99 },
      ],
      total: 40.97,
      orderDate: "2024-01-20",
      estimatedDelivery: "2024-01-22",
      deliveryAddress: "123 Tropical Ave, Miami, FL 33101",
    },
    {
      id: "ORD-2024-002",
      status: "shipped",
      juices: [
        { name: "Kiwi Passion Fruit Smoothie", quantity: 3, price: 11.99 },
        { name: "Pineapple Ginger Energy Boost", quantity: 1, price: 13.99 },
      ],
      total: 49.96,
      orderDate: "2024-01-18",
      estimatedDelivery: "2024-01-21",
      deliveryAddress: "456 Sunset Blvd, Los Angeles, CA 90028",
    },
  ];

  const pastOrders = [
    {
      id: "ORD-2024-003",
      status: "delivered",
      juices: [
        { name: "Papaya Coconut Cleanse", quantity: 2, price: 13.99 },
        { name: "Mixed Berry Tropical Blend", quantity: 2, price: 12.99 },
      ],
      total: 53.96,
      orderDate: "2024-01-15",
      deliveredDate: "2024-01-17",
      rating: 5,
    },
    {
      id: "ORD-2024-004",
      status: "delivered",
      juices: [
        { name: "Guava Mint Refresher", quantity: 1, price: 11.99 },
        { name: "Dragon Fruit Power Smoothie", quantity: 1, price: 14.99 },
      ],
      total: 26.98,
      orderDate: "2024-01-10",
      deliveredDate: "2024-01-12",
      rating: 4,
    },
  ];

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

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-lg ${
          i < rating ? "text-yellow-400" : "text-gray-300"
        }`}
      >
        ⭐
      </span>
    ));
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
        {/* Order Management Introduction Section */}
        <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-background/90 to-secondary/30" />
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
            <Button
              size="lg"
              className="gradient-tropical text-foreground font-bold text-lg px-8 py-6 hover:scale-105 transition-bounce shadow-tropical"
            >
              <ShoppingCart className="w-6 h-6 mr-2" />
              Create New Order
            </Button>
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
            <div className="space-y-6">
              {activeTab === "current" ? (
                currentOrders.length > 0 ? (
                  currentOrders.map((order) => (
                    <Card key={order.id} className="shadow-tropical border-0">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-xl mb-2">
                              Order {order.id}
                            </CardTitle>
                            <CardDescription className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              Ordered on{" "}
                              {new Date(order.orderDate).toLocaleDateString()}
                            </CardDescription>
                          </div>
                          <Badge
                            className={`flex items-center gap-1 ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {getStatusIcon(order.status)}
                            {order.status.charAt(0).toUpperCase() +
                              order.status.slice(1)}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {/* Juice Items */}
                          <div className="space-y-2">
                            {order.juices.map((juice, index) => (
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
                                  ${juice.price.toFixed(2)}
                                </div>
                              </div>
                            ))}
                          </div>

                          <Separator />

                          {/* Order Summary */}
                          <div className="flex justify-between items-center font-bold text-lg">
                            <span>Total</span>
                            <span className="text-primary">
                              ${order.total.toFixed(2)}
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
                              <div>
                                Expected:{" "}
                                {new Date(
                                  order.estimatedDelivery
                                ).toLocaleDateString()}
                              </div>
                              <div>{order.deliveryAddress}</div>
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
                  ))
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
                pastOrders.map((order) => (
                  <Card key={order.id} className="shadow-tropical border-0">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl mb-2">
                            Order {order.id}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Delivered on{" "}
                            {new Date(
                              order.deliveredDate!
                            ).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <Badge
                          className={`flex items-center gap-1 ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {getStatusIcon(order.status)}
                          Delivered
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Juice Items */}
                        <div className="space-y-2">
                          {order.juices.map((juice, index) => (
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
                                ${juice.price.toFixed(2)}
                              </div>
                            </div>
                          ))}
                        </div>

                        <Separator />

                        <div className="flex justify-between items-center">
                          <div className="font-bold text-lg">
                            Total:{" "}
                            <span className="text-primary">
                              ${order.total.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-foreground/70">
                              Your Rating:
                            </span>
                            <div className="flex">
                              {renderStars(order.rating!)}
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
                ))
              )}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default Orders;
