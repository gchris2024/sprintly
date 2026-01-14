import { getWeekStart } from "../../utils/time";

const Dashboard = () => {
  const weekStart = getWeekStart();
  
  console.log(weekStart);
  return <div>The Dashboard</div>;
};

export default Dashboard;
