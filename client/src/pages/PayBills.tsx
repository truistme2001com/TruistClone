import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocation, Link } from "wouter";
import { queryClient } from "@/lib/queryClient";
import truistLogo from "@/../../attached_assets/stock_images/truist_bank_logo_pur_b67575c5.jpg";
import { ArrowLeft, CreditCard, Zap, Droplets, Wifi, Phone, LogOut, User, Settings, Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const billCategories = [
  { id: "utilities", name: "Utilities", icon: Zap, color: "text-orange-600" },
  { id: "water", name: "Water", icon: Droplets, color: "text-blue-600" },
  { id: "internet", name: "Internet/Cable", icon: Wifi, color: "text-indigo-600" },
  { id: "phone", name: "Phone", icon: Phone, color: "text-green-600" },
  { id: "credit_card", name: "Credit Card", icon: CreditCard, color: "text-purple-600" },
];

export default function PayBills() {
  const [, setLocation] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState("");
  const { toast } = useToast();

  const { data: userData } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const response = await fetch("/api/me", { credentials: "include" });
      if (!response.ok) {
        if (response.status === 403 || response.status === 401) {
          setLocation("/");
        }
        throw new Error("Not authenticated");
      }
      return response.json();
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await fetch("/api/logout", { method: "POST", credentials: "include" });
    },
    onSuccess: () => {
      setLocation("/");
    },
  });

  const payBillMutation = useMutation({
    mutationFn: async (data: { amount: string; payee: string; accountNumber: string; category: string }) => {
      const account = userData?.user?.accounts?.[0];
      if (!account) throw new Error("No account found");

      const response = await fetch("/api/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromAccountId: account.id,
          toAccountNumber: "99999999999999", // Dummy external account
          amount: data.amount,
          description: `Bill payment to ${data.payee} (${data.category}) - Account: ${data.accountNumber}`,
        }),
        credentials: "include",
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      toast({
        title: "Bill Payment Successful",
        description: "Your payment has been processed successfully.",
      });
      setSelectedCategory("");
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Payment Failed",
        description: error.message || "An error occurred while processing your payment",
      });
    },
  });

  const handlePayBill = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    payBillMutation.mutate({
      amount: formData.get("amount") as string,
      payee: formData.get("payee") as string,
      accountNumber: formData.get("accountNumber") as string,
      category: selectedCategory,
    });
    
    e.currentTarget.reset();
  };

  const user = userData?.user;
  const account = user?.accounts?.[0];

  const formatCurrency = (amount: string | number) => {
    return parseFloat(amount.toString()).toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/40 to-indigo-50/30 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-200/20 rounded-full blur-3xl -mr-64 -mt-64"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-200/20 rounded-full blur-3xl -ml-48 -mb-48"></div>
      
      <div className="relative z-10">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-8">
                <Link href="/dashboard">
                  <img src={truistLogo} alt="Truist Bank" className="h-10 cursor-pointer" />
                </Link>
                <nav className="hidden md:flex gap-6">
                  <Link href="/dashboard" className="text-gray-600 hover:text-purple-600 transition-colors pb-4 pt-4">
                    Accounts
                  </Link>
                  <Link href="/transfer" className="text-gray-600 hover:text-purple-600 transition-colors pb-4 pt-4">
                    Transfer
                  </Link>
                  <Link href="/pay-bills" className="text-purple-600 font-semibold border-b-2 border-purple-600 pb-4 pt-4">
                    Pay Bills
                  </Link>
                  <Link href="/services" className="text-gray-600 hover:text-purple-600 transition-colors pb-4 pt-4">
                    Services
                  </Link>
                </nav>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" className="text-gray-600 hover:text-purple-600" data-testid="button-notifications">
                  <Bell className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-gray-600 hover:text-purple-600" data-testid="button-settings">
                  <Settings className="h-5 w-5" />
                </Button>
                <div className="hidden sm:flex items-center gap-3 ml-2 pl-3 border-l border-gray-300">
                  <div className="flex items-center gap-2">
                    <div className="bg-purple-100 p-2 rounded-full">
                      <User className="h-4 w-4 text-purple-600" />
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{user?.fullName}</span>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-purple-300 text-purple-600 hover:bg-purple-50 hover:text-purple-700 gap-2"
                  onClick={() => logoutMutation.mutate()}
                  data-testid="button-signout"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Link href="/dashboard">
              <Button variant="ghost" className="gap-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 -ml-2" data-testid="button-back">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
          </div>

          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Pay Bills</h1>
            <p className="text-gray-600">Make payments to your utility and service providers</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3 mb-6">
            <Card className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white border-0 shadow-lg">
              <CardContent className="pt-6">
                <p className="text-purple-100 text-sm mb-1">Available Balance</p>
                <p className="text-2xl font-bold">${account?.balance ? formatCurrency(account.balance) : "0.00"}</p>
                <p className="text-purple-200 text-xs mt-2">Account #{account?.accountNumber}</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Bill Categories</CardTitle>
                <CardDescription>Select the type of bill you want to pay</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {billCategories.map((category) => {
                    const Icon = category.icon;
                    return (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                          selectedCategory === category.id
                            ? "border-purple-600 bg-purple-50"
                            : "border-gray-200 hover:border-purple-300"
                        }`}
                        data-testid={`button-category-${category.id}`}
                      >
                        <Icon className={`h-8 w-8 ${category.color} mb-2`} />
                        <p className="text-sm font-semibold text-gray-900">{category.name}</p>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
                <CardDescription>
                  {selectedCategory 
                    ? `Enter your ${billCategories.find(c => c.id === selectedCategory)?.name.toLowerCase()} bill details`
                    : "Select a bill category to continue"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedCategory ? (
                  <form onSubmit={handlePayBill} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="payee">Payee Name</Label>
                      <Input
                        id="payee"
                        name="payee"
                        placeholder="e.g., Electric Company"
                        required
                        data-testid="input-payee"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="accountNumber">Account Number</Label>
                      <Input
                        id="accountNumber"
                        name="accountNumber"
                        placeholder="Your account number with the payee"
                        required
                        data-testid="input-account-number"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount (USD)</Label>
                      <Input
                        id="amount"
                        name="amount"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        required
                        data-testid="input-payment-amount"
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-purple-600 hover:bg-purple-700"
                      disabled={payBillMutation.isPending}
                      data-testid="button-pay-bill"
                    >
                      {payBillMutation.isPending ? "Processing..." : "Pay Bill"}
                    </Button>
                  </form>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <CreditCard className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>Select a bill category to get started</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
