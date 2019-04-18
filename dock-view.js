import React from 'react'
import styled, { withTheme } from 'styled-components'
// import Split from 'react-split'
import SplitPane, { Pane } from './react-split'

import { Scrollbars } from 'react-custom-scrollbars'
import { observer } from 'mobx-react'
import { Button, Intent } from '@blueprintjs/core'

/**
 * Контейнер дока
 */
const DockStyle = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%; /*!!header ? 'calc(100% - 35px)' : '100%',*/
  background-color: #2c2c2c;
  overflow: auto;
`

/**
 * Заголовок страницы дока
 */
const DockHeaderStyle = styled.div`
  -webkit-app-region: no-drag;
  -webkit-touch-callout: none;
  user-select: none;
  pointer-events: none;

  overflow: hidden;

  position: relative;
  top: 0px;
  left: 0px;
  height: 35px;
  min-height: 35px;
  width: 100%;

  padding-left: 20px;

  display: flex;
  justify-content: flex-start; /*space-between; */
  align-items: center;

  background-color: #1c1c1c;
  font-size: 11px;
  font-family: 'Open Sans', sans-serif;
  letter-spacing: 0px;
  color: #c3c3c3;
`

/**
 * Заголовок секции страницы дока
 */
const DockPaneHeaderStyle = styled.div`
  user-select: none;

  overflow: hidden;

  position: relative;
  top: 0px;
  left: 0px;
  height: 22px;
  min-height: 22px;
  width: 100%;

  display: flex;
  justify-content: flex-start; /*space-between; */
  align-items: center;

  background-color: #393939;
  font-size: 11px;
  font-weight: bold;
  font-family: 'Open Sans', sans-serif;
  letter-spacing: 0px;
  color: #c3c3c3;
`

/**
 * Стрелка раскрытия секции страницы дока
 */
const DockHeaderArrowStyle = styled.span`
  color: ${({ theme: { type } }) => (type === 'dark' ? 'white' : 'black')};
  margin-right: 7px;
  margin-left: 7px;
  display: inline-block;
  transform: ${({ elapsed }) => (elapsed ? 'rotate(-45deg)' : 'rotate(-90deg)')};
  transition: transform 200ms cubic-bezier(0.4, 1, 0.75, 0.9);

  ::after {
    content: '▾';
  }
`

/**
 * Секция страницы дока
 */
const DockPaneStyle = styled.div`
  display: flex;
  flex-direction: column;
  height: ${({ elapsed }) => (elapsed ? '100%' : '22px')};
  width: 100%;
  overflow: ${({ elapsed }) => (elapsed ? 'auto' : 'hidden')};
`

const DockPane = props => (
  <DockPaneStyle className="bp3-dark" elapsed={props.elapsed}>
    <DockPaneHeaderStyle onClick={props.onHeaderClick}>
      <DockHeaderArrowStyle elapsed={props.elapsed} />
      {props.title}
    </DockPaneHeaderStyle>
    {props.children}
  </DockPaneStyle>
)

const withScrollBars = WrappedComponent => props => (
  <Scrollbars
    style={{
      width: '100%',
      height: '100%',
      background: '#1c1c1c',
      overflow: 'hidden'
    }}
    autoHide={true}
    autoHideTimeout={1000}
    autoHideDuration={200}
    thumbMinSize={30}
    renderThumbHorizontal={({ style, ...props }) => (
      <div
        {...props}
        style={{
          ...style,
          backgroundColor: '#424341',
          borderRadius: '4px'
        }}
      />
    )}
    renderThumbVertical={({ style, ...props }) => (
      <div
        {...props}
        style={{
          ...style,
          backgroundColor: '#424341',
          borderRadius: '4px'
        }}
      />
    )}
  >
    {WrappedComponent}
  </Scrollbars>
)

const renderDockPane = (title, component, elapsed, offset = 0, handlePaneHeaderClick) => {
  const ComponentWithScrollBars = withScrollBars(component)

  if (!title) {
    return (
      <div key={'no_key'} style={{ height: `calc(100% - ${offset}px)`, width: '100%', overflow: 'hidden' }}>
        <ComponentWithScrollBars />
      </div>
    )
  }

  if (elapsed === false) {
    return <DockPane key={title} title={title} elapsed={false} onHeaderClick={handlePaneHeaderClick} />
  }

  return (
    <div key={title} style={{ height: `calc(100% - ${offset}px)`, width: '100%', overflow: 'hidden' }}>
      <DockPane title={title} elapsed={true} onHeaderClick={handlePaneHeaderClick}>
        <ComponentWithScrollBars />
      </DockPane>
    </div>
  )
}

export const DockView = observer(({ pages, currentPage, onPaneHeaderClick, onResizeEnd, paneSizes }) => {
  const page = pages[currentPage]
  if (!page) {
    console.error(`Dock page ${currentPage} not found`)
    return null
  }

  const { header, panes } = page

  const count = panes.length

  const sizes = []
  const minSize = []

  const handlePaneHeaderClick = index => () => {
    onPaneHeaderClick(currentPage, index)
  }

  if (count >= 2) {
    const sizes = paneSizes[currentPage]

    const elapsedPanesCount = panes.reduce((accum, { elapsed }) => (elapsed ? accum + 1 : accum), 0)

    if (elapsedPanesCount >= 2) {
      return (
        <DockStyle>
          {!!header && <DockHeaderStyle>{header}</DockHeaderStyle>}
          <SplitPane
            split="horizontal"
            allowResize={true}
            resizerSize={1}
            onResizeEnd={data => onResizeEnd(currentPage, data.map(item => parseFloat(item) / 100))}
          >
            {panes.map(({ title, component, elapsed }, i) => {
              if (elapsed === false) {
                return renderDockPane(title, component, elapsed, 0, handlePaneHeaderClick(i))
              }

              const initialSize = sizes[i] == null ? '144px' : sizes[i]

              return (
                <Pane key={title} initialSize={initialSize} minSize="144px" maxSize="100%">
                  {renderDockPane(title, component, elapsed, 0, handlePaneHeaderClick(i))}
                </Pane>
              )
            })}
          </SplitPane>
        </DockStyle>
      )
    } else {
      return (
        <DockStyle>
          {!!header && <DockHeaderStyle>{header}</DockHeaderStyle>}
          {panes.map(({ title, component, elapsed }, i) =>
            renderDockPane(title, component, elapsed, 0, handlePaneHeaderClick(i))
          )}
        </DockStyle>
      )
    }
  }

  if (count === 1) {
    const [{ title, component, elapsed }] = panes

    return (
      <DockStyle>
        {!!header && <DockHeaderStyle>{header}</DockHeaderStyle>}
        {renderDockPane(title, component, elapsed, 35 /*offset*/, handlePaneHeaderClick(0))}
      </DockStyle>
    )
  }

  return <DockStyle>{!!header && <DockHeaderStyle>{header}</DockHeaderStyle>}</DockStyle>
})

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

export const OpenFolder = ({ workspace }) => (
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
)

export const OutlineInfo = () => (
  <ContainerStyle>
    <TextStyle className="bp3-ui-text bp3-text-small bp3-text-muted">
      There are no editors open that can provide outline information.
    </TextStyle>
  </ContainerStyle>
)

export const SearchInfo = () => (
  <ContainerStyle>
    <TextStyle className="bp3-ui-text bp3-text-small bp3-text-muted">FAKE SEARCH INFO!!!</TextStyle>
  </ContainerStyle>
)
