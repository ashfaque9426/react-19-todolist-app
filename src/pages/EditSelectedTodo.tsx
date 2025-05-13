function EditSelectedTodo() {
  return (
    <div className={`h-[calc(100vh-48px)] w-full bg-no-repeat bg-cover bg-center relative 
      bg-[url('../assets/images/background/todo-edit-bg-mobile.webp')] 
      md:bg-[url('../assets/images/background/todo-edit-bg-tablet.webp')] 
      lg:bg-[url('../assets/images/background/todo-edit-bg-desktop.webp')] 
      px-2 md:px-3.5 lg:px-5 flex flex-col justify-center text-white`}>
      <h1 id='main-component' className='text-2xl text-center font-bold my-3.5'>Edit Task</h1>
      <form action="">

      </form>
    </div>
  )
}

export default EditSelectedTodo;