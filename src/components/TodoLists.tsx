import { useEffect, useMemo, useState } from "react";
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
  const [recordDataLen, setRecordDataLen] = useState<number>(0);

  const dataArrLen = useMemo(() => dataArr.length, [dataArr]);

  const winWidth = useWindowWidth();

  const { navHeight, footerHeight, setCompHeight } = useAuth();

  useEffect(() => {
    // Set shared global component height based on window width and data length
    if ((!showDataTable && winWidth >= 768 && dataArrLen > 3) || (showDataTable && winWidth >= 768 && recordDataLen > 1)) {
      setCompHeight("auto");
    } else if ((!showDataTable && winWidth < 768 && dataArrLen < 3) || (showDataTable && winWidth < 768 && recordDataLen < 2)) {
      setCompHeight("100vh");
    } else if ((!showDataTable && winWidth >= 1440 && dataArrLen < 3) || (showDataTable && winWidth >= 1440 && recordDataLen < 2)) {
      const heightValue = `calc(100vh - ${navHeight + footerHeight}px)`;
      setCompHeight(heightValue);
    } else {
      setCompHeight("100vh");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataArrLen, recordDataLen, setCompHeight, winWidth, showDataTable]);

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
    <div className="relative">{loading ? <LoadingData /> : errorMsg ? <ShowErrMsg errMsg={errorMsg} /> : !showDataTable ? <ShowDataCards dataArray={dataArr} showTableDataSetter={setShowDataTable} setTitle={setTitle} /> : <ShowDataLists date={selectedDate} title={title} showTableDataSetter={setShowDataTable} setTitle={setTitle} titleFromEditSetter={setTitleFromEdit} setRecordDataLen={setRecordDataLen} />}</div>
  )
}

export default TodoLists;