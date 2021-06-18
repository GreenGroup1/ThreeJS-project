import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { RecoilRoot } from 'recoil'
import reportWebVitals from './reportWebVitals'
import Context from 'context'
import { unstable_createMuiStrictModeTheme, ThemeProvider } from '@material-ui/core'

const theme = unstable_createMuiStrictModeTheme({
  palette:{
    primary:{
      main: '#24242c'
    },
    secondary:{
      main:  '#2f2f38'
    }
  },
  overrides:{
    MuiButton:{
      root:{
        minWidth:'2rem'
      },
      label:{
        padding: 0,
        margin:0
      }
    }
  }
})

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider  {...{theme}}>
      <RecoilRoot>
        <Context>
          <App />
        </Context>
      </RecoilRoot>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
