function ShowErrMsg({ errMsg }: { errMsg: string }) {
  return (
    <p className="text-white text-center text-2xl my-12">{errMsg}</p>
  )
}

export default ShowErrMsg;