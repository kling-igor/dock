import './app.css'

import React, { Component } from "react";
import { createGlobalStyle, ThemeProvider } from 'styled-components'
import { observable } from 'mobx'
import { observer, Provider } from 'mobx-react'
import Split from 'react-split'

import dark from './dark'

import { Dock } from './dock'

const elementStyle = (dimension, size, gutterSize) => {
  return {
    'flex-basis': 'calc(' + size + '% - ' + gutterSize + 'px)',
    // float: "right",
    width: size
  }
}

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


  /* разделитель */
  .split {
    overflow-y: auto;
    overflow-x: hidden;
    display: flex;
    flex-direction: row;
  }

  .gutter {
      background-color: #414339; /*#ddd*/
      background-repeat: no-repeat;
      background-position: 50%;
  }

  .gutter.gutter-vertical {
    /* background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAEAQMAAACEHZz0AAAABlBMVEUAAADMzMzIT8AyAAAAAXRSTlMAQObYZgAAAAFiS0dEAIgFHUgAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfjAhsTCQ6JxssVAAAAEUlEQVQI12NgYGA4cwaEGBgAEywDMZ7GenYAAAAASUVORK5CYII='); */
    cursor: row-resize;
  }
  
  .gutter.gutter-horizontal {
    /* background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAOAQMAAAAypC9bAAAABlBMVEUAAADMzMzIT8AyAAAAAXRSTlMAQObYZgAAAAFiS0dEAIgFHUgAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfjAhsTCTE/oOYoAAAAEElEQVQI12NIYEhgAAEsNAAqHAMBffS2jgAAAABJRU5ErkJggg=='); */
    cursor: col-resize;
  }
`

const workspace = {
  openProject: () => { }
}

const dock = new Dock({ workspace })

@observer
export default class App extends Component {

  render() {

    const Dock = dock.widget

    return (
      <>
        <GlobalStyle />
        <ThemeProvider theme={dark}>
          <Split
            style={{
              width: "100%",
              height: "100%",
              display: 'flex'
            }}
            sizes={[25, 75]}
            minSize={[150, 500]}
            snapOffset={0}
            direction="horizontal"
            elementStyle={elementStyle}
            gutterSize={2}
          >
            {/* <div style={{ height: '100%', backgroundColor: 'green' }}>

            </div> */}
            <Dock />
            <div style={{ height: '100%', backgroundColor: 'magenta' }}>
              <button onClick={() => dock.showPage('explorer')}>EXPOLORER</button>
              <button onClick={() => dock.showPage('search')}>SEARCH</button>
            </div>
          </Split>
        </ThemeProvider>
      </>
    )
  }
}  