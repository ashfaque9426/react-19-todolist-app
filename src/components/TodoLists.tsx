import { useEffect, useState } from "react";
import useAxiosSecure from "../hooks/useAxiosSecure";
import useAuth from "../hooks/useAuth";
import { errorHandler } from "../services/utils";
import LoadingData from "./LoadingData";
import ShowErrMsg from "./ShowErrMsg";
import ShowDataCards from "./ShowDataCards";
import ShowDataLists from "./ShowDataLIsts";

function TodoLists({ selectedDate, date, title, setTitle }: { selectedDate: string, date: string, title: string, setTitle: (title: string) => void }) {
  const { user } = useAuth();
  const [axiosSecure] = useAxiosSecure();
  const [loading, setLoading] = useState<boolean>(true);
  const [showDataTable, setShowDataTable] = useState<boolean>(false);
  const [dataArr, setDataArr] = useState([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      if(!selectedDate || !user.userId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setErrorMsg(null);
      try {
        const { cardDataArr, errMsg } = (await axiosSecure.get(`/api/get-todo-lists-by-date?userId=${user.userId}&date=${selectedDate}`)).data;

        if (errMsg) {
          setErrorMsg(errMsg);
        }
        else if (cardDataArr) {
          setDataArr(cardDataArr);
        }
      } catch (err) {
        const { setErrMsgStr } = errorHandler(err, true);
        setErrorMsg(setErrMsgStr);
      }
      setLoading(false);
    };
    fetchData();
  }, [axiosSecure, selectedDate, user, errorMsg]);

  return (
    <div className="relative">{loading ? <LoadingData /> : errorMsg ? <ShowErrMsg errMsg={errorMsg} /> : !showDataTable ? <ShowDataCards dataArray={dataArr} showTableDataSetter={setShowDataTable} setTitle={setTitle} /> : <ShowDataLists date={date} title={title} showTableDataSetter={setShowDataTable} setTitle={setTitle} />}</div>
  )
}

export default TodoLists;