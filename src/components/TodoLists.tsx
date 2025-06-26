import { useEffect, useState } from "react";
import useAxiosSecure from "../hooks/useAxiosSecure";
import useAuth from "../hooks/useAuth";
import { errorHandler } from "../services/utils";
import LoadingData from "./LoadingData";
import ShowErrMsg from "./ShowErrMsg";
import ShowDataCards from "./ShowDataCards";
import ShowDataLists from "./ShowDataLists";

function TodoLists({ selectedDate, title, setTitle }: { selectedDate: string, title: string, setTitle: (title: string) => void }) {
  const { user, titleFromEdit, setTitleFromEdit } = useAuth();
  const [axiosSecure] = useAxiosSecure();
  const [loading, setLoading] = useState<boolean>(true);
  const [showDataTable, setShowDataTable] = useState<boolean>(false);
  const [dataArr, setDataArr] = useState([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (titleFromEdit) {
      setShowDataTable(true);
    }
  }, [titleFromEdit]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !axiosSecure || !selectedDate) {
        setLoading(false);
        return;
      }
  
      setLoading(true);
      setErrorMsg(null);
  
      try {
        const { cardDataArr, errMsg } = (
          await axiosSecure.get(`/api/get-todo-lists-by-date?userId=${user.userId}&date=${selectedDate}`)
        ).data;
  
        if (errMsg) {
          setErrorMsg(errMsg);
          return;
        } 

        setDataArr(cardDataArr);
      } catch (err) {
        const { setErrMsgStr } = errorHandler(err, true);
        setErrorMsg(setErrMsgStr);
      }
      setLoading(false);
    };
  
    fetchData();
  }, [axiosSecure, selectedDate, user]);
  

  return (
    <div className="relative">{loading ? <LoadingData /> : errorMsg ? <ShowErrMsg errMsg={errorMsg} /> : !showDataTable ? <ShowDataCards dataArray={dataArr} showTableDataSetter={setShowDataTable} setTitle={setTitle} /> : <ShowDataLists date={titleFromEdit ?  new Date().toISOString().split("T")[0] : selectedDate} title={titleFromEdit ? titleFromEdit : title} showTableDataSetter={setShowDataTable} setTitle={setTitle} titleFromEditSetter={setTitleFromEdit} />}</div>
  )
}

export default TodoLists;