import { useEffect, useState } from "react";
import useAxiosSecure from "../hooks/useAxiosSecure";
import useAuth from "../hooks/useAuth";

function TodoLists({ selectedDate }: { selectedDate: string }) {
  const { user } = useAuth();
  const [axiosSecure] = useAxiosSecure();
  const [loading, setLoading] = useState<boolean>(true);
  const [userData, setUserData] = useState(null);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      try {
        const { dataArr, errMsg } = (await axiosSecure.get(`/api/get-todo-records?userId=${user.userId}&date=${selectedDate}`)).data;

        if (errMsg) {
          setErrMsg(errMsg);
        }
        else if (dataArr) {
          setUserData(dataArr);
        }
      } catch (err) {
        if (err && typeof err === "object" && "response" in err) {
          const axiosError = err as { response: { data: { dataArr?: null; errMsg?: string } } };
          // The request was made, and the server responded with a status code outside the 2xx range
          const { errMsg } = axiosError.response.data;
          setErrMsg(errMsg || "An error occurred while fetching data.");
        } else if (err && typeof err === "object" && "request" in err) {
          // The request was made, but no response was received
          console.error('No response received:', (err as { request?: unknown }).request);
        } else {
          // Something happened in setting up the request
          console.error('Error', (err as Error).message);
        }
      }
      setLoading(false);
    };
    fetchData();
  }, [axiosSecure, selectedDate, user]);

  return (
    <div>{loading ? "Data Loading..." : errMsg ? errMsg : JSON.stringify(userData)}</div>
  )
}

export default TodoLists;