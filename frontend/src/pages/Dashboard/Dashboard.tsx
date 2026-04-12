import { useEffect, useState } from "react";
import styles from "./Dashboard.module.css";
import { getWeekRange } from "@/utils/time";

const Dashboard = () => {
  const { start } = getWeekRange(new Date());
  const [todos, setTodos] = useState([]);

  // TODO: Multi-week views
  useEffect(() => {
    const fetchCurrentWeek = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/todos`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          },
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setTodos(data);

        console.log("Fetched data for current week:", data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchCurrentWeek();
  }, []);

  return (
    <>
      <div className={styles.container}>
        Week of {""}
        {start.toLocaleDateString(undefined, {
          month: "numeric",
          day: "numeric",
        })}
      </div>
      <ul>
        {todos.map((todo: { id: number; task: string }) => (
          <li key={todo.id}>{todo.task}</li>
        ))}
      </ul>
    </>
  );
};

export default Dashboard;
