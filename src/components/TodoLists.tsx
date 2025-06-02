import { useEffect, useState } from "react";
import useAxiosSecure from "../hooks/useAxiosSecure";
import useAuth from "../hooks/useAuth";
import { errorHandler } from "../services/utils";

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
        const { setErrMsgStr } = errorHandler(err, true);
        setErrMsg(setErrMsgStr);
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