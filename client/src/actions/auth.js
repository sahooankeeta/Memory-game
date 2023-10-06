import * as API from "../api"
import * as actionType from "../helpers/constants"
import notify from "../helpers/notify"
export const login = (formData) => async (dispatch) => {
    try {
      dispatch({type:actionType.SET_LOADING,payload:true})
      const { success,data,message } = await API.signIn(formData);
      if(success)
    {
        dispatch({ type: actionType.AUTH, payload:data });
        notify("success",message)
        
    }else{
        console.log("error",message)
        dispatch({ type: actionType.SET_ERROR, payload:message });
    }
    } catch (error) {
      //console.log(error);
      console.log("error",error.message)
    }
    dispatch({type:actionType.SET_LOADING,payload:false})
};
  
export const signup = (formData) => async (dispatch) => {
    try {
      dispatch({type:actionType.SET_LOADING,payload:true})
      const { success,data,message } = await API.signUp(formData);
     if(success)
     {
      
      dispatch({ type: actionType.AUTH, payload:data });
     }else{
        console.log("error",message)
        dispatch({ type: actionType.SET_ERROR, payload:message });
     }
      
  
    } catch (error) {
      //console.log(error);
      console.log("error",error.message)
    }
    dispatch({type:actionType.SET_LOADING,payload:false})
};
export const resetPassword = (formData) => async (dispatch) => {
  try {
    dispatch({type:actionType.SET_LOADING,payload:true})
    const { success,data,message } = await API.resetPassword(formData);
   if(success)
   {
    dispatch({ type: actionType.AUTH, payload:data });
   }else{
    console.log("error",message)
    dispatch({ type: actionType.SET_ERROR, payload:message });
   }
    

  } catch (error) {
    //console.log(error);
    console.log("error",error.message)
  }
  dispatch({type:actionType.SET_LOADING,payload:false})
};
export const logout=(navigate)=>(dispatch)=>{
  dispatch({type:actionType.LOGOUT})
  notify("success","Successfully logged out")
  navigate("/")
}
export const setCards=(data)=>(dispatch)=>{
  dispatch({type:actionType.SET_CARDS,payload:data})
}
export const setLevel=(data)=>(dispatch)=>{
  dispatch({type:actionType.SET_LEVEL,payload:data})
}
export const setReveals=(data)=>(dispatch)=>{
  dispatch({type:actionType.SET_REVEALS,payload:data})
}
export const setMatch=(data)=>(dispatch)=>{
  dispatch({type:actionType.SET_MATCH,payload:data})
}
export const clearGame=()=>(dispatch)=>{
  dispatch({type:actionType.CLEAR_GAME})
}
export const initialPoints=(data)=>(dispatch)=>{
  dispatch({type:actionType.INITIAL_PONTS,payload:data})
}
export const setPoints=(data)=>(dispatch)=>{
  dispatch({type:actionType.SET_PONTS,payload:data})
}
export const updatePoints=(data)=>(dispatch)=>{
  dispatch({type:actionType.SET_PONTS,payload:data})
}