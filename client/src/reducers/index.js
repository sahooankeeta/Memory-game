import * as actionType from "../helpers/constants"
const initialState={
  error:null,
  users:[],
  cards:[],
  level:3,
  reveals:[],
  match:[],
  points:{},
  loading:false,
  authData:localStorage.getItem('profile')?JSON.parse(localStorage.getItem('profile'))?.user:null
}
export const reducers =(state = initialState, {type,payload}) => {
    switch (type) {
      case actionType.SET_LOADING:
          return {...state,loading:payload}
      case actionType.SET_ERROR:
          return {...state,error:payload}
      case actionType.AUTH:
        localStorage.setItem('profile', JSON.stringify({ ...payload }));
        return { ...state, authData: payload.user,error:null };
      case actionType.LOGOUT:
        localStorage.clear();
        return { ...state, authData: null};
      case actionType.SET_CARDS:
        let resetPoints=state.users.map(i=>{return {...i,points:0}})
        localStorage.setItem('cards', JSON.stringify(payload))
        localStorage.setItem('reveals', JSON.stringify([]))
        localStorage.setItem('match', JSON.stringify([]))
        return {...state,cards:payload,users:resetPoints,reveals:[],match:[]}
      case actionType.SET_LEVEL:
        localStorage.setItem('level',JSON.stringify(payload))
        return {...state,level:payload}
      case actionType.SET_REVEALS:
        localStorage.setItem('reveals', JSON.stringify(payload))
        return {...state,reveals:payload}
      case actionType.SET_MATCH:
          localStorage.setItem('match', JSON.stringify(payload))
          return {...state,match:payload}
      case actionType.INITIAL_PONTS:
        let players=payload.map(i=>{return {...i,points:0}})
        localStorage.setItem('users', JSON.stringify(players))
        return {...state,users:players}
      case actionType.SET_PONTS:
        let updatedUsers=state.users.map(i=>i.userId===payload.userId?{...i,points:i.points+20}:i)
        localStorage.setItem('users', JSON.stringify(updatedUsers))
        return {...state,users:updatedUsers}
      case actionType.CLEAR_GAME:
        localStorage.removeItem('cards')
        localStorage.removeItem('reveals')
        localStorage.removeItem('match')
        localStorage.removeItem('users')
        return {...state,cards:[],reveals:[],match:[],users:[],level:3}
      default:
        return {...state,
          authData:localStorage.getItem('profile')?JSON.parse(localStorage.getItem('profile'))?.user:null,
          cards:localStorage.getItem('cards')?JSON.parse(localStorage.getItem('cards')):[],
          level:localStorage.getItem('level')?JSON.parse(localStorage.getItem('level')):3,
          reveals:localStorage.getItem('reveals')?JSON.parse(localStorage.getItem('reveals')):[],
          match:localStorage.getItem('match')?JSON.parse(localStorage.getItem('match')):[],
          users:localStorage.getItem('users')?JSON.parse(localStorage.getItem('users')):[],
        };
    }
  };