import { useEffect, useState } from "react";
import useAxiosSecure from "../hooks/useAxiosSecure";
import useAuth from "../hooks/useAuth";
import { errorHandler } from "../services/utils";
import LoadingData from "./LoadingData";
import ShowErrMsg from "./ShowErrMsg";
import ShowDataCards from "./ShowDataCards";

function TodoLists({ selectedDate }: { selectedDate: string }) {
  const { user } = useAuth();
  const [axiosSecure] = useAxiosSecure();
  const [loading, setLoading] = useState<boolean>(true);
  const [showLists, setShowLists] = useState<boolean>(false);
  const [dataArr, setDataArr] = useState([]);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      try {
        const { dataArr, errMsg } = (await axiosSecure.get(`/api/get-todo-lists-by-date?userId=${user.userId}&date=${selectedDate}`)).data;

        if (errMsg) {
          setErrMsg(errMsg);
        }
        else if (dataArr) {
          setDataArr(dataArr);
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
    <div className="relative">{loading ? <LoadingData /> : errMsg ? <ShowErrMsg errMsg={errMsg} /> : showLists ? <ShowDataCards  dataArray={dataArr} showListsSetter={setShowLists} /> : ""}</div>
  )
}

export default TodoLists;