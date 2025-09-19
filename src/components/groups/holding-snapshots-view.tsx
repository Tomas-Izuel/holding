"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HoldingType } from "@/types/holding.type";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ArrowUp, ArrowDown, Minus, TrendingUp } from "lucide-react";

interface HoldingSnapshotsViewProps {
  holding: HoldingType;
}

export default function HoldingSnapshotsView({
  holding,
}: HoldingSnapshotsViewProps) {
  // Ordenar snapshots por fecha (más reciente primero)
  const sortedSnapshots = [...holding.snapshots].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const formatPercentage = (percentage: number) => {
    return `${percentage > 0 ? "+" : ""}${percentage.toFixed(2)}%`;
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <ArrowUp className="h-4 w-4 text-green-600" />;
    if (change < 0) return <ArrowDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-gray-500" />;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return "text-green-600";
    if (change < 0) return "text-red-600";
    return "text-gray-500";
  };

  if (sortedSnapshots.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Historial de Snapshots
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No hay snapshots disponibles para este holding.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Historial de Snapshots
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-semibold">Fecha</th>
                  <th className="text-right p-4 font-semibold">
                    Precio/Unidad
                  </th>
                  <th className="text-right p-4 font-semibold">Cantidad</th>
                  <th className="text-right p-4 font-semibold">Valor Total</th>
                  <th className="text-right p-4 font-semibold">
                    Cambio Precio
                  </th>
                  <th className="text-right p-4 font-semibold">
                    Cambio Cantidad
                  </th>
                  <th className="text-right p-4 font-semibold">Cambio Total</th>
                </tr>
              </thead>
              <tbody>
                {sortedSnapshots.map((snapshot, index) => {
                  const previousSnapshot = sortedSnapshots[index + 1];
                  const totalValue = snapshot.price * snapshot.quantity;

                  // Calcular cambios
                  const priceChange = previousSnapshot
                    ? ((snapshot.price - previousSnapshot.price) /
                        previousSnapshot.price) *
                      100
                    : 0;

                  const quantityChange = previousSnapshot
                    ? snapshot.quantity - previousSnapshot.quantity
                    : 0;

                  const totalChange = previousSnapshot
                    ? totalValue -
                      previousSnapshot.price * previousSnapshot.quantity
                    : 0;

                  const totalChangePercentage = previousSnapshot
                    ? (totalChange /
                        (previousSnapshot.price * previousSnapshot.quantity)) *
                      100
                    : 0;

                  return (
                    <tr
                      key={snapshot.id}
                      className="border-b hover:bg-muted/50"
                    >
                      <td className="p-4">
                        <div>
                          <div className="font-medium">
                            {format(
                              new Date(snapshot.createdAt),
                              "dd/MM/yyyy",
                              { locale: es }
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {format(new Date(snapshot.createdAt), "HH:mm", {
                              locale: es,
                            })}
                          </div>
                        </div>
                      </td>

                      <td className="p-4 text-right">
                        <div className="font-medium">
                          {formatCurrency(
                            snapshot.price,
                            holding.asset.type.currency
                          )}
                        </div>
                      </td>

                      <td className="p-4 text-right">
                        <div className="font-medium">
                          {snapshot.quantity.toLocaleString("es-AR", {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 4,
                          })}
                        </div>
                      </td>

                      <td className="p-4 text-right">
                        <div className="font-medium">
                          {formatCurrency(
                            totalValue,
                            holding.asset.type.currency
                          )}
                        </div>
                      </td>

                      <td className="p-4 text-right">
                        {previousSnapshot ? (
                          <div
                            className={`flex items-center justify-end gap-1 ${getChangeColor(
                              priceChange
                            )}`}
                          >
                            {getChangeIcon(priceChange)}
                            <span className="text-sm font-medium">
                              {formatPercentage(priceChange)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            -
                          </span>
                        )}
                      </td>

                      <td className="p-4 text-right">
                        {previousSnapshot ? (
                          <div
                            className={`flex items-center justify-end gap-1 ${getChangeColor(
                              quantityChange
                            )}`}
                          >
                            {getChangeIcon(quantityChange)}
                            <span className="text-sm font-medium">
                              {quantityChange > 0 ? "+" : ""}
                              {quantityChange.toLocaleString("es-AR", {
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 4,
                              })}
                            </span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            -
                          </span>
                        )}
                      </td>

                      <td className="p-4 text-right">
                        {previousSnapshot ? (
                          <div className="space-y-1">
                            <div
                              className={`flex items-center justify-end gap-1 ${getChangeColor(
                                totalChange
                              )}`}
                            >
                              {getChangeIcon(totalChange)}
                              <span className="text-sm font-medium">
                                {formatCurrency(
                                  Math.abs(totalChange),
                                  holding.asset.type.currency
                                )}
                              </span>
                            </div>
                            <div
                              className={`text-xs ${getChangeColor(
                                totalChangePercentage
                              )}`}
                            >
                              {formatPercentage(totalChangePercentage)}
                            </div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            -
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
