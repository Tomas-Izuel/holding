import { Holding } from "@prisma/client";
import HoldingView from "./holding-view";

interface GroupHoldingsViewProps {
  holdings: Holding[];
}

const GroupHoldingsView = ({ holdings }: GroupHoldingsViewProps) => {
  return (
    <section>
      <h2>Holdings</h2>
      <ul className="space-y-4">
        {holdings.map((holding) => (
          <HoldingView key={holding.id} holding={holding} />
        ))}
      </ul>
    </section>
  );
};

export default GroupHoldingsView;
