function ShowErrMsg({ errMsg }: { errMsg: string }) {
  return (
    <p className="text-red-500 text-center">{errMsg}</p>
  )
}

export default ShowErrMsg;