import { getWeekRange } from "../../utils/time";
import styles from "./Dashboard.module.css";

const Dashboard = () => {
  // Find the start and end of the current week
  const { start, end } = getWeekRange();


  return (
    <div className={styles.container}>
      Week of {""}
      {start.toLocaleDateString(undefined, {
        month: "numeric",
        day: "numeric"
      })}
    </div>
  );
};

export default Dashboard;
