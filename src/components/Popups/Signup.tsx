import { auth } from "misc"
import { Alert, Button, Snackbar, TextField, Typography, InputAdornment, IconButton } from "@material-ui/core"
import { Visibility, VisibilityOff } from  '@material-ui/icons'
import { useEffect, useState } from "react"
import { Person } from '@material-ui/icons'
import { useHistory } from 'react-router-dom'

export default function Signup(){
  const [credentials, setCredentials] = useState({name:'', email:'', password:'',  cpassword:''})
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [cpasswordVisible, setCpasswordVisible] = useState(false)
  const [error, setError] = useState<any>()
  const  history = useHistory()

  useEffect(()=>{error&&console.log(error)},[error])

  return (
    <div style={{ color:'black', position:'absolute', top:0, bottom:0, left:0, right:0, backgroundColor:'#373740', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ backgroundColor:'white', width: 420, borderRadius:'0.2rem', boxShadow:'-2px 2px 2px rgba(0,0,0,0.2)', boxSizing:'border-box' }}>
        <div style={{display:'flex', padding:'1.5rem 2rem', justifyContent: 'space-between', alignItems: 'center'}}>
          <Typography variant="h6" >
            Sign Up
          </Typography>
          <Typography onClick={()=>history.push('/login')} variant="subtitle2" component='a' style={{textDecoration: 'underline', cursor:'pointer'}}>
            Have an account already?
          </Typography>
        </div>
        <hr style={{border:'none', margin:'0', padding:'0', borderBottom:'solid 0.5px rgba(0,0,0,0.2)' }}/>
        <div style={{padding:'2rem'}}>
          <Typography variant="subtitle2" >
            Full Name*
          </Typography>
          <TextField 
            required 
            value={credentials.name} 
            onChange={(e)=>setCredentials({...credentials, name:e.target.value})} 
            id="name" 
            label="Full name" 
            variant="filled" 
            style={{width:'100%', marginTop:'1rem'}} 
          />
          <Typography variant="subtitle2" style={{marginTop:'1rem'}}>
            Email  Address*
          </Typography>
          <TextField 
            required 
            value={credentials.email} 
            onChange={(e)=>setCredentials({...credentials, email:e.target.value})} 
            id="email" 
            label="Email" 
            variant="filled" 
            style={{width:'100%', marginTop:'1rem'}} 
          />
          <Typography variant="subtitle2" style={{marginTop:'1rem'}}>
            Password*
          </Typography>
          <TextField 
            required 
            value={credentials.password} 
            onChange={(e)=>setCredentials({...credentials, password:e.target.value})} 
            id="password" 
            label="Password" 
            variant="filled" 
            type={passwordVisible?"text":"password" }
            style={{width: '100%', marginTop: '1rem', border:'none'}} 
            InputProps={{
              style:{border:'none', width:'100%'},
              endAdornment: 
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={()=>setPasswordVisible(!passwordVisible)}
                    onMouseDown={(e:any)=>e.preventDefault()}
                    edge="end"
                    component='div'
                  >
                    <>{passwordVisible ? <Visibility /> : <VisibilityOff />}</>
                  </IconButton>
                </InputAdornment>,
            }} 
          />
          <Typography variant="subtitle2" style={{marginTop:'1rem'}}>
            Confirm Password*
          </Typography>
          <TextField 
            required 
            value={credentials.cpassword} 
            onChange={(e)=>setCredentials({...credentials, cpassword:e.target.value})} 
            id="cpassword" 
            label="Confirm Password" 
            variant="filled" 
            type={cpasswordVisible?"text":"password" }
            style={{width: '100%', marginTop: '1rem', border:'none'}} 
            InputProps={{
              style:{border:'none', width:'100%'},
              endAdornment: 
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={()=>setCpasswordVisible(!cpasswordVisible)}
                    onMouseDown={(e:any)=>e.preventDefault()}
                    edge="end"
                    component='div'
                  >
                    <>{cpasswordVisible ? <Visibility /> : <VisibilityOff />}</>
                  </IconButton>
                </InputAdornment>,
            }} 
          />
  
          <Typography variant="subtitle2" style={{marginTop:'1rem', marginBottom:'.5rem'}}>
            Profile Image
          </Typography>
          <div style={{height:'6rem',cursor:'pointer', width:'100%', boxSizing:'border-box', backgroundColor:'#dcdcdc', padding:' 1rem', borderRadius:'0.2rem', display:'flex'}}>
            <div style={{backgroundColor:'#bbb', flex:'0 0 4rem', marginRight:'1rem', width: '4rem', height:'4rem',  display: 'flex',  justifyContent:'center',  alignItems:'center', borderRadius: '0.2rem'}}>
              <Person fontSize='large' style={{width:'3rem',  color:'grey', height:'3rem'}}/>
            </div>
            <div style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
              <Typography variant='body2' style={{color:'grey'}}>
                Drag  and drop image  here or  upload  it from the  computer
              </Typography>
            </div>
          </div>
          <div style={{width:'100%'}}>
            <Button 
              onClick={()=>auth.register(credentials).catch((err)=>setError(err))} 
              style={{width:'100%', height:'3.2rem', marginTop:'1rem', color:'white', backgroundColor: '#23abd5'}}>
              Register
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
