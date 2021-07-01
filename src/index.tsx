import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { RecoilRoot } from 'recoil'
import reportWebVitals from './reportWebVitals'
import Context from 'context'
import { auth, theme } from 'misc'
import { ThemeProvider } from '@material-ui/core'
import { onError } from '@apollo/client/link/error'
import { setContext } from '@apollo/client/link/context';
import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache } from '@apollo/client'
import { BrowserRouter as Router } from "react-router-dom";

const logoutLink = onError(({ networkError }) => {
  if ( 
     networkError &&
     'statusCode' in networkError &&
     networkError.statusCode === 401
   ) { auth.logout() };
 })
 
 const httpLink = createHttpLink({
   uri: 'https://api.dentalmodelmaker.com/hasura/v1/graphql',
 });
 
 const authLink = setContext((_, { headers }) => {
   const jwtToken = auth.getJWTToken();
   if (jwtToken) {
       return {
           headers: {
               ...headers,
               Authorization: `Bearer ${jwtToken}`
           }
       }
   }
   return headers
 });
 
 export const client = new ApolloClient({
   link: logoutLink.concat(authLink.concat(httpLink)),
   cache: new InMemoryCache({
     addTypename: false
   }),
 });

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <ThemeProvider  {...{theme}}>
        <RecoilRoot>
          <Context>
            <ApolloProvider client={client}>
              <App />
            </ApolloProvider>
          </Context>
        </RecoilRoot>
      </ThemeProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
