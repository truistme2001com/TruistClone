import { Card } from "@/components/ui/card";
import { CreditCard } from "lucide-react";

interface BankCardProps {
  type: "debit" | "credit";
  cardholderName: string;
  businessName: string;
  cardNumber: string;
  cardType: string;
  expiryDate: string;
  cvv: string;
  onClick?: () => void;
}

export function BankCard({ 
  type, 
  cardholderName, 
  businessName,
  cardNumber,
  cardType,
  expiryDate,
  cvv,
  onClick
}: BankCardProps) {
  return (
    <Card 
      className={`
        relative overflow-hidden w-full max-w-md h-60 p-6 
        ${type === "debit" 
          ? "bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800" 
          : "bg-gradient-to-br from-slate-800 via-slate-900 to-black"
        }
        text-white shadow-2xl border-0 cursor-pointer transition-all hover:scale-105 hover:shadow-3xl
      `} 
      data-testid={`card-${type}`}
      onClick={onClick}
    >
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

        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-xs text-white/60 uppercase tracking-wider mb-1">Card Number</p>
              <p className="text-lg font-mono font-semibold tracking-wider" data-testid={`card-number-${type}`}>{cardNumber}</p>
            </div>
            <div className="flex items-center gap-1">
              {cardType === "Visa" ? (
                <div className="flex items-center justify-center w-16 h-10 rounded bg-white/90">
                  <span className="text-blue-900 font-bold italic text-lg">VISA</span>
                </div>
              ) : (
                <div className="flex items-center gap-0">
                  <div className="w-7 h-7 rounded-full bg-red-500/90 backdrop-blur-sm"></div>
                  <div className="w-7 h-7 rounded-full bg-yellow-500/90 backdrop-blur-sm -ml-3"></div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-between items-start">
            <div className="flex-1 pr-4">
              <p className="text-xs text-white/60 uppercase tracking-wider mb-1">Cardholder</p>
              <p className="text-sm font-semibold uppercase tracking-wide" data-testid={`cardholder-${type}`}>
                {cardholderName}
              </p>
              <p className="text-xs text-white/70 uppercase tracking-wide mt-0.5">
                {businessName}
              </p>
            </div>
            <div className="flex gap-8 shrink-0">
              <div className="text-right">
                <p className="text-xs text-white/60 uppercase tracking-wider mb-1.5">Expires</p>
                <p className="text-base font-mono font-bold" data-testid={`expiry-${type}`}>{expiryDate}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-white/60 uppercase tracking-wider mb-1.5">CVV</p>
                <p className="text-base font-mono font-bold" data-testid={`cvv-${type}`}>{cvv}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
