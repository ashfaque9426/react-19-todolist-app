import { useEffect, useState } from "react";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { errorHandler } from "../services/utils";
import LoadingData from "./LoadingData";
import ShowErrMsg from "./ShowErrMsg";
import ShowDataCards from "./ShowDataCards";
import ShowDataLists from "./ShowDataLists";
import useWindowWidth from "../hooks/useWindowWidth";
import useAuth from "../hooks/useAuth";

function TodoLists({ userId, selectedDate, title, showDataTable, setShowDataTable, setTitle, setTitleFromEdit }: { userId: number, selectedDate: string, title: string, showDataTable: boolean, setShowDataTable: (status: boolean) => void, setTitle: (title: string) => void, setTitleFromEdit: (title: string) => void }) {
  const [axiosSecure] = useAxiosSecure();
  const [loading, setLoading] = useState<boolean>(true);
  const [dataArr, setDataArr] = useState([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const winWidth = useWindowWidth();

  const { navHeight, footerHeight, setCompHeight } = useAuth();

  useEffect(() => {
    if (navHeight === 0 || footerHeight === 0) return;
    if ((winWidth >= 768 && dataArr.length > 4) || (winWidth > 1279 && dataArr.length > 6)) {
      setCompHeight("auto");
    }
  }, [dataArr.length, setCompHeight, navHeight, footerHeight, winWidth]);

  useEffect(() => {
    const fetchData = async () => {
      if (!userId || !axiosSecure || !selectedDate) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setErrorMsg(null);

      try {
        const { cardDataArr, errMsg } = (
          await axiosSecure.get(`/api/get-todo-lists-by-date?userId=${userId}&date=${selectedDate}`)
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
  }, [axiosSecure, selectedDate, userId]);


  return (
    <div className="relative">{loading ? <LoadingData /> : errorMsg ? <ShowErrMsg errMsg={errorMsg} /> : !showDataTable ? <ShowDataCards dataArray={dataArr} showTableDataSetter={setShowDataTable} setTitle={setTitle} /> : <ShowDataLists date={selectedDate} title={title} showTableDataSetter={setShowDataTable} setTitle={setTitle} titleFromEditSetter={setTitleFromEdit} />}</div>
  )
}

export default TodoLists;