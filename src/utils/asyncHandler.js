const asyncHandler = (requestHandler) => {
  (req, res, next) => {
    Promise.resolve(requestHandler(req,res,next)).catch((err) => next(err));
  }
}


export {syncHandler}



  // const asyncHandler = () => {}
  // const asyncHandler = (func) => () => {}
  // const asyncHandler = (func) => async () => {}


  // const asyncHandler = (fn) => async (req, res, next) => {
  //   try{
  //     c
  //   }catch(error){
  //     res.status(error.code || 500).json({
  //       success: false,
  //       message: error.message
  //     })
  //   }
  // }