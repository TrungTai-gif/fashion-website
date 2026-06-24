import RevenueChart from "./RevenueChart";
import NewUsersChart from "./NewUsersChart";
import LowStockList from "./LowStockList";
import StatsCard from "./StatsCard";

const OverView = () => {
  return (
    <div className="min-h-screen mb-20 bg-gray-100 ">
      <div className="max-w-7xl ">
        <div className="space-y-8">
          <StatsCard />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <RevenueChart />
              <div className="mt-6">
                <NewUsersChart />
              </div>
            </div>
            <div>
              <LowStockList />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverView;
