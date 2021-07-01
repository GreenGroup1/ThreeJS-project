import { ButtonPannel, ModelView } from "components"
import { atoms, auth } from "misc"
import { useRecoilState } from "recoil"
import { Loader } from 'components'
import { Alert, Button, Snackbar, TextField, Typography } from "@material-ui/core"
import { useEffect, useState } from "react"
import { ReactComponent as Google } from 'assets/icons/google.svg'
import { Facebook } from "@material-ui/icons"
import { useApolloClient } from "@apollo/client"
import { useUserLazyQuery } from "generated"
import { useHistory } from "react-router-dom"

export default function App () {
  const [ loading, setLoading ] = useRecoilState(atoms.loading)
  const [ user, setUser ] = useRecoilState(atoms.user)
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
      </>:
      <LogIn/>
    }

  </>
}

function LogIn(){
  const [credentials, setCredentials] = useState({email:'', password:''})
  const [error, setError] = useState<any>()

  useEffect(()=>{error&&console.log(error)},[error])

  return (
    <div style={{ color:'black', position:'absolute', top:0, bottom:0, left:0, right:0, backgroundColor:'#373740', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ backgroundColor:'#59596b', width: 380, height: 250, borderRadius:'0.5rem', boxShadow:'-5px 5px black', padding: '1.5rem', boxSizing:'border-box' }}>
        <Typography variant="h6" style={{marginTop:'0.25rem'}}>Please login or register</Typography>
        <TextField required value={credentials.email} onChange={(e)=>setCredentials({...credentials, email:e.target.value})} id="email" label="Email" variant="outlined" style={{margin:'0.5rem 0', width:'100%'}} InputProps={{style:{maxHeight:'3rem'}}}/>
        <TextField required value={credentials.password} onChange={(e)=>setCredentials({...credentials, password:e.target.value})} id="password" label="Password" variant="outlined" type="password" style={{marginBottom:'0.5rem', width:'100%'}} InputProps={{style:{maxHeight:'3rem'}}} />
        <div style={{display:'flex', flexDirection:'row', width:'100%'}}>
          <Button onClick={()=>auth.login(credentials).catch((err)=>setError(err))} variant="outlined" style={{boxShadow:'-2px 2px black', width:'7rem', color:'black'}}>
            Login
          </Button>
          <Button onClick={()=>auth.register(credentials).catch((err)=>setError(err))} variant="outlined" style={{marginLeft:'0.5rem', width:'7rem', color:'black', boxShadow:'-2px 2px black'}}>
            Register
          </Button>
          <Button onClick={()=>auth.login({ provider: 'facebook' })} variant="outlined" style={{marginLeft:'0.5rem', width:'3rem', boxShadow:'-2px 2px black'}}>
            <Facebook style={{color:'black'}}/>
          </Button>
          <Button onClick={()=>auth.login({ provider: 'google' })} variant="outlined" style={{marginLeft:'0.5rem', width:'3rem', boxShadow:'-2px 2px black'}}>
            <Google />
          </Button>
        </div>
      </div>

      <Snackbar open={error} autoHideDuration={6000} onClose={()=>setError(undefined)}>
        <Alert onClose={()=>setError(undefined)} severity="error" sx={{ width: '100%' }}>
          {error?.message||JSON.stringify(error)}
        </Alert>
      </Snackbar>
    </div>
  )
}
