import { Alert, Button, Snackbar, TextField, Typography } from "@material-ui/core"
import { useEffect, useState } from "react"
import { useHistory } from 'react-router-dom'

export default function Forgot(){
  const [credentials, setCredentials] = useState({email:''})
  const [error, setError] = useState<any>()
  const  history = useHistory()
  useEffect(()=>{error&&console.log(error)},[error])

  return (
    <div style={{ color:'black', position:'absolute', top:0, bottom:0, left:0, right:0, backgroundColor:'#373740', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ backgroundColor:'white', width: 420, borderRadius:'0.2rem', boxShadow:'-2px 2px 2px rgba(0,0,0,0.2)', boxSizing:'border-box' }}>
        <div style={{display:'flex', padding:'1.5rem 2rem', justifyContent: 'space-between', alignItems: 'center'}}>
          <Typography variant="h6" >
            Forgot Your Password?
          </Typography>
          <Typography onClick={()=>history.push('/login')} variant="subtitle2" component='a' style={{textDecoration: 'underline', cursor:'pointer'}}>
            Sign In
          </Typography>
        </div>
        <hr style={{border:'none', margin:'0', padding:'0', borderBottom:'solid 0.5px rgba(0,0,0,0.2)' }}/>
        <div style={{padding:'2rem'}}>
          <Typography variant="body2" >
            In order to retrieve your password, 
            please input your email address which you used to create the account.
            We will send you email with confirmation to retrieve your password.
          </Typography>
          
          <Typography variant="subtitle2" style={{marginTop:'1rem'}}>
            Email  Address*
          </Typography>
          <TextField 
            required 
            value={credentials.email} 
            onChange={(e)=>setCredentials({...credentials, email:e.target.value})} 
            id="email" 
            label="Email Address" 
            variant="filled" 
            style={{width:'100%', marginTop:'1rem'}} 
          />
  
          <div style={{width:'100%'}}>
            <Button 
              onClick={()=>{}} 
              style={{width:'100%', height:'3.2rem', marginTop:'1rem', color:'white', backgroundColor: '#23abd5'}}>
              Send Email
            </Button>
          </div>

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
