import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation, Link } from "wouter";
import truistLogo from "@/../../attached_assets/stock_images/truist_bank_logo_pur_b67575c5.jpg";
import { ArrowLeft, Download, FileText, HelpCircle, Shield, CreditCard, Users, LogOut, User, Settings, Bell, CheckCircle } from "lucide-react";

const services = [
  {
    id: "statements",
    title: "Account Statements",
    description: "Download your monthly account statements and transaction history",
    icon: FileText,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    action: "Download Statements",
  },
  {
    id: "security",
    title: "Security Center",
    description: "Update security settings, change password, and manage two-factor authentication",
    icon: Shield,
    color: "text-green-600",
    bgColor: "bg-green-50",
    action: "Manage Security",
  },
  {
    id: "cards",
    title: "Card Services",
    description: "Order new cards, report lost or stolen cards, and manage card limits",
    icon: CreditCard,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    action: "Manage Cards",
  },
  {
    id: "support",
    title: "Customer Support",
    description: "Get help with your account, report issues, and contact our support team",
    icon: HelpCircle,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    action: "Contact Support",
  },
  {
    id: "beneficiaries",
    title: "Manage Beneficiaries",
    description: "Add, edit, or remove beneficiaries for quick and easy transfers",
    icon: Users,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
    action: "Manage Beneficiaries",
  },
  {
    id: "verification",
    title: "Account Verification",
    description: "Verify your identity and complete account verification steps",
    icon: CheckCircle,
    color: "text-teal-600",
    bgColor: "bg-teal-50",
    action: "Verify Account",
  },
];

export default function Services() {
  const [, setLocation] = useLocation();

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
                  <Link href="/pay-bills" className="text-gray-600 hover:text-purple-600 transition-colors pb-4 pt-4">
                    Pay Bills
                  </Link>
                  <Link href="/services" className="text-purple-600 font-semibold border-b-2 border-purple-600 pb-4 pt-4">
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

        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Link href="/dashboard">
              <Button variant="ghost" className="gap-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 -ml-2" data-testid="button-back">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Banking Services</h1>
            <p className="text-gray-600">Manage your account and access banking services</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
            <Card className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white border-0 shadow-lg md:col-span-2 lg:col-span-3">
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-purple-100 text-sm mb-1">Available Balance</p>
                    <p className="text-3xl font-bold mb-2">${account?.balance ? formatCurrency(account.balance) : "0.00"}</p>
                    <p className="text-purple-200 text-sm">Account #{account?.accountNumber}</p>
                  </div>
                  <div className="flex items-center justify-end">
                    <div className="text-right">
                      <p className="text-purple-100 text-sm mb-1">Account Holder</p>
                      <p className="text-xl font-semibold">{user?.fullName}</p>
                      <p className="text-purple-200 text-sm mt-1">{user?.email}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <Card 
                  key={service.id} 
                  className="border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer group"
                  data-testid={`card-service-${service.id}`}
                >
                  <CardHeader>
                    <div className={`${service.bgColor} w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className={`h-7 w-7 ${service.color}`} />
                    </div>
                    <CardTitle className="text-lg">{service.title}</CardTitle>
                    <CardDescription className="text-sm">{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      variant="outline" 
                      className="w-full border-purple-300 text-purple-600 hover:bg-purple-50 hover:text-purple-700"
                      data-testid={`button-${service.id}`}
                    >
                      {service.action}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
