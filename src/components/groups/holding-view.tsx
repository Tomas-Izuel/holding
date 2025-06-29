import type { Holding } from "@prisma/client";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";

interface HoldingViewProps {
  holding: Holding;
}

const HoldingView = ({ holding }: HoldingViewProps) => {
  const isPositive = holding.earnings && holding.earnings > 0;
  const earningsPercentage = holding.earnings
    ? `${holding.earnings > 0 ? "+" : ""}${holding.earnings.toFixed(2)}%`
    : "-";
  const formattedPrice = holding.lastPrice
    ? `$${holding.lastPrice.toFixed(2)} USD`
    : "-";

  return (
    <Card className="bg-gray-900 border-gray-700 text-white p-6 rounded-2xl relative overflow-hidden">
      <div className="flex justify-between items-start relative z-10">
        <div className="flex-1">
          <CardHeader className="p-0 space-y-1">
            <CardDescription className="text-gray-400 text-sm">
              {holding.name}
            </CardDescription>
            <CardTitle className="text-white text-lg font-medium">
              {holding.code} - {holding.quantity} holdings
            </CardTitle>
          </CardHeader>
        </div>

        <div className="hidden lg:flex flex-col items-end space-y-2">
          {/* Trading line visualization with gradient fill */}
          <div
            className={
              `absolute inset-0 overflow-hidden rounded-2xl opacity-60 ` +
              (isPositive
                ? "translate-y-4/5 -rotate-1 translate-x-1/12"
                : "-translate-y-7 rotate-6 translate-x-0")
            }
          >
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 600 140"
              className="absolute inset-0 -z-10"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient
                  id={`gradient-${holding.id}`}
                  x1="0%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                >
                  <stop
                    offset="0%"
                    stopColor={isPositive ? "#10b981" : "#ef4444"}
                    stopOpacity="0.3"
                  />
                  <stop
                    offset="100%"
                    stopColor={isPositive ? "#10b981" : "#ef4444"}
                    stopOpacity="0.05"
                  />
                </linearGradient>
              </defs>

              {/* Gradient fill area below the line */}
              <path
                d={
                  isPositive
                    ? // Área bajo la curva positiva
                      "M120,100 L170,90 Q190,80 210,95 Q230,110 250,80 Q270,60 300,70 Q340,90 370,60 Q400,50 430,80 Q460,110 500,70 Q540,40 600,30 L600,120 L120,120 Z"
                    : // Área bajo la curva negativa (más centrada y visible)
                      "M120,80 L170,90 Q190,100 210,95 Q230,110 250,120 Q270,130 300,120 Q340,110 370,120 Q400,130 430,120 Q460,110 500,120 Q540,130 600,140 L600,120 L120,120 Z"
                }
                fill={`url(#gradient-${holding.id})`}
              />

              {/* Trading line path */}
              <path
                d={
                  isPositive
                    ? // Gráfica positiva: subidas y bajadas ascendentes
                      "M120,100 L170,90 Q190,80 210,95 Q230,110 250,80 Q270,60 300,70 Q340,90 370,60 Q400,50 430,80 Q460,110 500,70 Q540,40 600,30"
                    : // Gráfica negativa: subidas y bajadas más centradas
                      "M120,80 L170,90 Q190,100 210,95 Q230,110 250,120 Q270,130 300,120 Q340,110 370,120 Q400,130 430,120 Q460,110 500,120 Q540,130 600,140"
                }
                stroke={isPositive ? "#10b981" : "#ef4444"}
                strokeWidth="3"
                fill="none"
                className="drop-shadow-sm"
              />
            </svg>
          </div>

          <div className="text-right">
            <div
              className={`text-lg font-semibold ${
                isPositive ? "text-green-400" : "text-red-400"
              }`}
            >
              {earningsPercentage}
            </div>
            <div className="text-white text-sm font-medium">
              {formattedPrice}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default HoldingView;
