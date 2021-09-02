import { ButtonPannel, EmbossPopup, SolidifyPopup, ModelView } from "components"
import { atoms, auth } from "misc"
import { useRecoilState } from "recoil"
import { Loader, LogIn } from 'components'
import { useEffect } from "react"
import { useApolloClient } from "@apollo/client"
import { useUserLazyQuery } from "generated"
import { Redirect, Route, Switch, useHistory } from "react-router-dom"
import Signup from "components/Popups/Signup"
import Forgot from "components/Popups/Forgot"
import { ExportPopup } from "components/Popups/Export"

export default function App () {
  const [ loading ] = useRecoilState(atoms.loading)
  const [ user, setUser ] = useRecoilState(atoms.user)
  const [ popups ] = useRecoilState(atoms.popups)

  const [ getUser, { data: userData } ] = useUserLazyQuery()
  const client = useApolloClient()
  const history = useHistory()

  useEffect(()=>{
    if(userData){
      setUser(userData?.users_by_pk)
      history.push('/')
    }
  },[userData])

  useEffect(()=>{
    auth.onAuthStateChanged((loggedIn:any) => {
      if(loggedIn){
        const userId = auth.getClaim("x-hasura-user-id");
        getUser({variables:{user_id: userId}})
        setUser({id: userId, created_at: new Date()})
      }else if(loggedIn===false){
        setUser(null)
      }else{
        setUser(null)
        client.resetStore()
      }
    });
  
  },[])

  return <>
    {user?
      <>
        <ModelView />
        {loading && <Loader/>}
        <ButtonPannel />
        {
          popups==='emboss'? <EmbossPopup/>:
          popups==='solidify'? <SolidifyPopup/>:
          popups==='export'? <ExportPopup/>:
          null
        }
      </>:
      <>
        <Switch>
          <Route path='/' exact>
            <Redirect to='/login'/>
          </Route>
          <Route path='/login'>
            <LogIn/>
          </Route>
          <Route path='/signup'>
            <Signup/>
          </Route>
          <Route path='/forgot-password'>
            <Forgot/>
          </Route>
          <Redirect to='/'/>
        </Switch>
      </>
    }

  </>
}

