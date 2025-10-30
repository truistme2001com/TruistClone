import { Card } from "@/components/ui/card";
import { CreditCard } from "lucide-react";

interface BankCardProps {
  type: "debit" | "credit";
  cardholderName: string;
  businessName: string;
  accountNumber: string;
  expiryDate?: string;
  cvv?: string;
}

export function BankCard({ 
  type, 
  cardholderName, 
  businessName,
  accountNumber, 
  expiryDate = "12/28",
  cvv = "***"
}: BankCardProps) {
  const cardNumber = accountNumber.padStart(16, "4");
  const formattedCardNumber = cardNumber.match(/.{1,4}/g)?.join(" ") || cardNumber;
  
  return (
    <Card className={`
      relative overflow-hidden w-full max-w-md h-56 p-6 
      ${type === "debit" 
        ? "bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800" 
        : "bg-gradient-to-br from-slate-800 via-slate-900 to-black"
      }
      text-white shadow-2xl border-0
    `}>
      <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16"></div>
      
      <div className="relative z-10 h-full flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <CreditCard className="h-8 w-8 text-white/90" />
              <span className="text-xs font-semibold uppercase tracking-wider text-white/80">
                {type === "debit" ? "Debit Card" : "Credit Card"}
              </span>
            </div>
            <p className="text-xl font-bold tracking-wide">TRUIST</p>
          </div>
          <div className={`
            px-3 py-1 rounded-md text-xs font-bold tracking-wider
            ${type === "debit" 
              ? "bg-white/20 text-white" 
              : "bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-900"
            }
          `}>
            {type === "debit" ? "BUSINESS" : "PLATINUM"}
          </div>
        </div>

        <div className="space-y-1">
          <div className="h-10 bg-gradient-to-r from-amber-400/20 to-transparent rounded-sm flex items-center px-2">
            <div className="w-12 h-8 bg-gradient-to-br from-amber-200 to-amber-400 rounded-sm"></div>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-xs text-white/60 uppercase tracking-wider mb-1">Card Number</p>
            <p className="text-lg font-mono font-semibold tracking-wider">{formattedCardNumber}</p>
          </div>

          <div className="flex justify-between items-end">
            <div className="flex-1">
              <p className="text-xs text-white/60 uppercase tracking-wider mb-1">Cardholder</p>
              <p className="text-sm font-semibold uppercase tracking-wide truncate pr-4">
                {cardholderName}
              </p>
              <p className="text-xs text-white/70 uppercase tracking-wide truncate pr-4 mt-0.5">
                {businessName}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-white/60 uppercase tracking-wider mb-1">Expires</p>
              <p className="text-sm font-mono font-semibold">{expiryDate}</p>
            </div>
          </div>
        </div>

        <div className="absolute bottom-4 right-6">
          <div className="flex items-center gap-1">
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30"></div>
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 -ml-4"></div>
          </div>
        </div>
      </div>
    </Card>
  );
}
