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
      <ul className="space-y-4">
        {holdings.map((holding) => (
          <HoldingView
            key={holding.id}
            holding={holding}
            typeInvestment={typeInvestment}
          />
        ))}
      </ul>
    </section>
  );
};

export default GroupHoldingsView;
