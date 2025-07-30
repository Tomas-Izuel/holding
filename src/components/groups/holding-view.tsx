import type { Holding, TypeInvestment } from "@prisma/client";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import Link from "next/link";

interface HoldingViewProps {
  holding: Holding;
  typeInvestment: TypeInvestment;
}

const HoldingView = ({ holding, typeInvestment }: HoldingViewProps) => {
  const isPositive = holding.earnings && holding.earnings > 0;
  const earningsPercentage = holding.earnings
    ? `${holding.earnings > 0 ? "+" : ""}${holding.earnings.toFixed(2)}%`
    : "-";
  const formattedPrice = holding.lastPrice
    ? `$${holding.lastPrice.toFixed(2)} ${typeInvestment.currency}`
    : "-";

  const formattedTotal = holding.lastPrice
    ? `$${(holding.lastPrice * holding.quantity).toFixed(2)} ${
        typeInvestment.currency
      }`
    : "-";

  return (
    <Link href={`/groups/${holding.groupId}/holding/${holding.id}`}>
      <Card className="bg-gray-900 border-gray-700 text-white p-6 rounded-2xl relative overflow-hidden hover:bg-gray-800 transition-colors">
        <div className="flex justify-between items-start relative z-10">
          <div className="flex-1">
            <CardHeader className="p-0 space-y-1">
              <CardDescription className="text-gray-400 text-sm">
                {holding.name}
              </CardDescription>
              <CardTitle className="text-white text-lg font-medium">
                {holding.code}
              </CardTitle>
              <CardDescription className="text-gray-400 text-sm">
                {holding.quantity} holdings
              </CardDescription>
            </CardHeader>
          </div>

          <div className="hidden lg:flex flex-col items-end space-y-2">
            <div className="text-right">
              <div
                className={`text-lg font-semibold ${
                  isPositive ? "text-green-400" : "text-red-400"
                }`}
              >
                {earningsPercentage}
              </div>
              <div className="text-white text-sm font-medium">
                <span className="text-gray-400 text-sm">Total:</span>{" "}
                {formattedTotal}
              </div>
              <div className="text-white text-xs mt-1">
                <span className="text-gray-400">Precio:</span> {formattedPrice}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default HoldingView;
