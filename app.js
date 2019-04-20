import './app.css'

import React, { Component } from 'react'
import styled, { withTheme, createGlobalStyle, ThemeProvider } from 'styled-components'
import { observable } from 'mobx'
import { observer, Provider } from 'mobx-react'
import { Button, Intent } from '@blueprintjs/core'
import SplitPane, { Pane } from './react-split'

import dark from './dark'
import light from './light'

import { Dock } from './dock'

const TextStyle = styled.p`
  color: '#c3c3c3';
  user-select: none;
  pointer-events: none;
`

const ContainerStyle = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  margin-left: 8px;
  margin-right: 8px;
  margin-top: 16px;
`

export const OpenFolder = withTheme(({ workspace }) => (
  <ContainerStyle>
    <TextStyle className="bp3-ui-text bp3-text-small bp3-text-muted">You have not yet opened a folder</TextStyle>
    <Button
      small
      intent={Intent.PRIMARY}
      onClick={workspace.openProject}
      style={{ borderRadius: '0px', width: '100%' }}
    >
      Open Folder
    </Button>
  </ContainerStyle>
))

export const OutlineInfo = withTheme(() => (
  <ContainerStyle>
    <TextStyle className="bp3-ui-text bp3-text-small bp3-text-muted">
      There are no editors open that can provide outline information.
    </TextStyle>
  </ContainerStyle>
))

export const SearchInfo = withTheme(() => (
  <ContainerStyle>
    <TextStyle className="bp3-ui-text bp3-text-small bp3-text-muted">FAKE SEARCH INFO!!!</TextStyle>
  </ContainerStyle>
))


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

const workspace = {
  openProject: () => { }
}

const dock = new Dock({ workspace })

@observer
export default class App extends Component {

  state = { dockInited: false }

  initDock = () => {

    dock.addPage('explorer', {
      pageTitle: 'EXPLORER',
      pageHeaderButtons: [
        // {
        //   icon: './assets/ui/collapse_all.svg',
        //   onClick: () => {
        //     console.log('COLLAPSE ALL')
        //   },
        //   tooltip: 'Collapse All'
        // }
      ],
      panes: [
        {
          title: 'NO FOLDER OPENED',
          elapsed: true,
          component: <OpenFolder workspace={workspace} />,
          paneHeaderButtons: [
            {
              icon: './assets/ui/add_file.svg',
              onClick: () => {
                console.log('ADD NEW FILE')
              },
              tooltip: 'New File'
            },
            {
              icon: './assets/ui/collapse_all.svg',
              onClick: () => {
                console.log('COLLAPSE ALL')
              },
              tooltip: 'Collapse All'
            }
          ]
        }
      ]
    })

    dock.addPage('search', {
      pageTitle: 'SEARCH',
      pageHeaderButtons: [
        {
          icon: './assets/ui/refresh.svg',
          onClick: () => {
            console.log('REFRESH')
          },
          tooltip: 'Refresh'
        },
        {
          icon: './assets/ui/clear.svg',
          onClick: () => {
            console.log('CLEAR SEARCH RESULT')
          },
          tooltip: 'Clear Search Results'
        },
        {
          icon: './assets/ui/collapse_all.svg',
          onClick: () => {
            console.log('COLLAPSE ALL')
          },
          tooltip: 'Collapse All'
        }
      ],
      panes: [
        {
          // title: 'NO FOLDER OPENED',
          // elapsed: true,
          component: <SearchInfo />,
          // paneHeaderButtons: [
          // ]
        }
      ]
    })

    dock.showPage('explorer')


    this.setState(({ dockInited }) => {
      return { dockInited: true }
    })
  }


  addPane = () => {
    dock.addPane('explorer', {
      title: 'NO FOLDER OPENED 2',
      elapsed: true,
      component: <OpenFolder workspace={workspace} />,
      paneHeaderButtons: []
    })
  }

  removePane = () => {
    dock.removePane('explorer', 1)
  }

  render() {
    const Dock = dock.widget

    const ControlPage = () => <div style={{ height: '100%', width: '100%', backgroundColor: '#343434' }}>
      {!this.state.dockInited && <button onClick={this.initDock}>Init Dock Panes</button>}
      {this.state.dockInited && <button onClick={() => dock.showPage('explorer')}>EXPOLORER</button>}
      {this.state.dockInited && <button onClick={() => dock.showPage('search')}>SEARCH</button>}
      {this.state.dockInited && <button onClick={this.addPane}>Add Pane Add Index 1</button>}
      {this.state.dockInited && <button onClick={this.removePane}>Remove Pane Add Index 1</button>}
    </div>

    return (
      <ThemeProvider theme={light}>
        <>
          <GlobalStyle />
          {this.state.dockInited ? (
            <SplitPane split="vertical" allowResize={true}>
              <Pane initialSize="10%" minSize="200px" maxSize="350px">
                <Dock />
              </Pane>
              <Pane initialSize="90%" minSize="50%" maxSize="100%">
                <ControlPage />
              </Pane>
            </SplitPane>
          ) : <ControlPage />}
        </>
      </ThemeProvider>
    )
  }
}
