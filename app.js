import React, { Component } from "react";
import { createGlobalStyle } from 'styled-components'
import { observable } from 'mobx'
import { observer, Provider } from 'mobx-react'

const GlobalStyle = createGlobalStyle`

html {
    height: 100%;
    margin: 0;
  }

  body {
    /* @import "~@blueprintjs/core/lib/css/blueprint.css"; */
    padding: 0;
    margin: 0;
    font-family: Roboto, sans-serif;
    overflow: hidden;
    background-color: white;
    height: 100%;
    margin: 0;
    overflow: hidden !important;
  }

  #app {
    /* background: #272822; */
    min-height: 100%;
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;

    padding: 8px;
  }
`


export default class App extends Component {

  render() {
    return (
      <>
        <GlobalStyle />
        <div>HELLO WORLD</div>
      </>
    )
  }
}  