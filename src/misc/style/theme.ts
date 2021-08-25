import { createTheme, adaptV4Theme } from '@material-ui/core/styles'
import { grey, amber } from '@material-ui/core/colors'

export const theme = createTheme({
  palette: {
    primary: {
      // light: '#ffffff',
      main: '#24242c'
      // dark: grey[800],
      // contrastText: '#fff',
    },
    secondary: {
      // light: '#ff7961',
      main:  '#2f2f38',
      // dark: '#ba000d',
      // contrastText: '#000',
    },
  },
  components:{
    MuiOutlinedInput: {
      styleOverrides:{
        input: {
          '&:-webkit-autofill': {
            WebkitBoxShadow: '0 0 0 100px #fff inset',
            WebkitTextFillColor: '#000',
            WebkitHeight: '3rem',
            borderRadius: 'unset'
          },
        }
      }
    },
    MuiButton:{
      styleOverrides:{      
        root:{
          minWidth:'2rem',
        },
        // label:{
        //   padding: 0,
        //   margin:0
        // }
      },
    }
  }
})
