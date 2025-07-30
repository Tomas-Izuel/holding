import { Holding, TypeInvestment } from "@prisma/client";
import HoldingView from "./holding-view";

interface GroupHoldingsViewProps {
  holdings: Holding[];
  typeInvestment: TypeInvestment;
}

const GroupHoldingsView = ({
  holdings,
  typeInvestment,
}: GroupHoldingsViewProps) => {
  return (
    <section>
      <h2>Holdings</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {holdings.map((holding) => (
          <HoldingView
            key={holding.id}
            holding={holding}
            typeInvestment={typeInvestment}
          />
        ))}
      </div>
    </section>
  );
};

export default GroupHoldingsView;
