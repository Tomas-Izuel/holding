import { getHoldingById } from "@/server/services/holding.service";
import HoldingSnapshotsView from "@/components/groups/holding-snapshots-view";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingDown } from "lucide-react";

const HoldingPage = async ({ params }: { params: { holdingId: string } }) => {
  const { holdingId } = await params;
  const holding = await getHoldingById(holdingId);

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{holding?.asset.code}</h1>
        </div>
      </div>

      {/* Resumen de análisis */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5" />
            Vistazo rápido (Moneda: {holding?.asset.type.currency})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(
                  holding?.asset.lastPrice || 0,
                  holding?.asset.type.currency || ""
                )}
              </div>
              <div className="text-sm text-muted-foreground">Precio Actual</div>
            </div>

            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {holding?.quantity.toLocaleString("es-AR", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 4,
                })}
              </div>
              <div className="text-sm text-muted-foreground">
                Cantidad Actual
              </div>
            </div>

            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(
                  (holding?.asset.lastPrice || 0) * (holding?.quantity || 0),
                  holding?.asset.type.currency || ""
                )}
              </div>
              <div className="text-sm text-muted-foreground">
                Valor Total Actual
              </div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className={"text-2xl font-bold relative"}>
                <span
                  className={`${
                    holding?.earnings && holding?.earnings > 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {holding?.earnings || 0}%
                </span>
                <span
                  className={`text-xs ${
                    holding?.relativeEarnings && holding?.relativeEarnings > 0
                      ? "text-green-200/70"
                      : "text-red-200/70"
                  }`}
                >
                  {holding?.relativeEarnings
                    ? `${holding?.relativeEarnings}%`
                    : "0%"}
                </span>
              </div>
              <div className="text-sm text-muted-foreground">Ganancias</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <section>{holding && <HoldingSnapshotsView holding={holding} />}</section>
    </>
  );
};

export default HoldingPage;
