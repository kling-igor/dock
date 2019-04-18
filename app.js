import './app.css'

import React, { Component } from 'react'
import { createGlobalStyle, ThemeProvider } from 'styled-components'
import { observable } from 'mobx'
import { observer, Provider } from 'mobx-react'
import SplitPane, { Pane } from './react-split'

import dark from './dark'

import { Dock } from './dock'

// const elementStyle = (dimension, size, gutterSize) => {
//   return {
//     'flex-basis': 'calc(' + size + '% - ' + gutterSize + 'px)',
//     // float: "right",
//     width: size
//   }
// }

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


  /* разделитель
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
  } */
`

const workspace = {
  openProject: () => {}
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
          <SplitPane split="vertical" allowResize={true} resizerSize={1}>
            <Pane initialSize="10%" minSize="200px" maxSize="350px">
              <Dock />
            </Pane>
            <Pane initialSize="90%" minSize="50%" maxSize="100%">
              <div style={{ height: '100%', width: '100%', backgroundColor: '#343434' }}>
                <button onClick={() => dock.showPage('explorer')}>EXPOLORER</button>
                <button onClick={() => dock.showPage('search')}>SEARCH</button>
              </div>
            </Pane>
          </SplitPane>
        </ThemeProvider>
      </>
    )
  }
}
