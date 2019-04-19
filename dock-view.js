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
  background-color: ${({
    theme: {
      sideBar: { background }
    }
  }) => (background ? background : '#f0f')};
  overflow: auto;
  border-right-color: ${({
    theme: {
      sideBar: { border, background }
    }
  }) => (border ? border : background)};
  border-right-style: ${({
    theme: {
      sideBar: { border }
    }
  }) => (border ? 'solid' : 'none')};
  border-right-width: ${({
    theme: {
      sideBar: { border }
    }
  }) => (border ? '1px' : '0px')};
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

  background-color: ${({
    theme: {
      sideBar: { background }
    }
  }) => (background ? background : '#f00')};
  font-size: 11px;
  font-family: 'Open Sans', sans-serif;
  letter-spacing: 0px;
  color: ${({
    theme: {
      sideBarTitle: { foreground }
    }
  }) => foreground || '#ffff00'};
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

  background-color: ${({
    theme: {
      sideBarSectionHeader: { background }
    }
  }) => background || '#ff00ff'};
  font-size: 11px;
  font-weight: bold;
  font-family: 'Open Sans', sans-serif;
  letter-spacing: 0px;
  color: ${({
    theme: {
      sideBarSectionHeader: { foreground }
    }
  }) => foreground || '#ffff00'};
`

/**
 * Стрелка раскрытия секции страницы дока
 */
const DockHeaderArrowStyle = styled.span`
  color: ${({
    theme: {
      sideBar: { foreground }
    }
  }) => foreground || '#00ffff'};
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

const DockPane = ({ theme, elapsed, onHeaderClick, title, children }) => (
  <DockPaneStyle className={theme.type === 'dark' ? 'bp3-dark' : ''} elapsed={elapsed}>
    <DockPaneHeaderStyle onClick={onHeaderClick}>
      <DockHeaderArrowStyle elapsed={elapsed} theme={theme} />
      {title}
    </DockPaneHeaderStyle>
    {children}
  </DockPaneStyle>
)

const ContainerWithScrollbarsStyle = styled(Scrollbars)`
  width: 100%;
  height: 100%;
  background: ${({
    theme: {
      sideBar: { background }
    }
  }) => background};
  overflow: hidden;
`

const ScrollBarThumbStyle = styled.div`
  background-color: #424341;
  border-radius: 4px;
`

const withScrollBars = WrappedComponent =>
  withTheme(props => (
    <ContainerWithScrollbarsStyle
      autoHide={true}
      autoHideTimeout={1000}
      autoHideDuration={200}
      thumbMinSize={30}
      renderThumbHorizontal={({ style, ...props }) => <ScrollBarThumbStyle />}
      renderThumbVertical={({ style, ...props }) => <ScrollBarThumbStyle />}
    >
      {WrappedComponent}
    </ContainerWithScrollbarsStyle>
  ))

const renderDockPane = (title, component, elapsed, offset = 0, handlePaneHeaderClick, theme) => {
  const ComponentWithScrollBars = withScrollBars(component)

  if (!title) {
    return (
      <div key={'no_key'} style={{ height: `calc(100% - ${offset}px)`, width: '100%', overflow: 'hidden' }}>
        <ComponentWithScrollBars />
      </div>
    )
  }

  if (elapsed === false) {
    return <DockPane key={title} title={title} elapsed={false} onHeaderClick={handlePaneHeaderClick} theme={theme} />
  }

  return (
    <div key={title} style={{ height: `calc(100% - ${offset}px)`, width: '100%', overflow: 'hidden' }}>
      <DockPane title={title} elapsed={true} onHeaderClick={handlePaneHeaderClick} theme={theme}>
        <ComponentWithScrollBars />
      </DockPane>
    </div>
  )
}

export const DockView = withTheme(
  observer(({ pages, currentPage, onPaneHeaderClick, onResizeEnd, paneSizes, theme }) => {
    const page = pages[currentPage]
    if (!page) {
      console.error(`Dock page ${currentPage} not found`)
      return null
    }

    const { header, panes } = page

    const panesCount = panes.length

    const makePaneHeaderClickHandler = index => () => {
      onPaneHeaderClick(currentPage, index)
    }

    const handleResizeEnd = data => {
      onResizeEnd(currentPage, data.map(item => parseFloat(item) / 100))
    }

    if (panesCount >= 2) {
      // если меняется состав открытых\закрытых панелей, то сохраненные значения могут быть нерелевантны
      // как минимум стоит их тоже занулить если открывается/закрывается какая-то панель!!!

      const elapsedPanesCount = panes.reduce((accum, { elapsed }) => (elapsed ? accum + 1 : accum), 0)

      if (elapsedPanesCount >= 2) {
        let sizes = paneSizes[currentPage].slice()

        // если размеры не определены
        if (sizes.length === 0) {
          let firstFoundElapsedPaneIndex = -1

          // формируем дефолтные
          sizes = panes.map(({ elapsed }, i) => {
            if (elapsed && firstFoundElapsedPaneIndex === -1) {
              firstFoundElapsedPaneIndex = i
            }

            if (elapsed) return '144px'

            return '22px'
          })

          // для первой открытой панели выставляем 100%
          if (firstFoundElapsedPaneIndex !== -1) {
            sizes[firstFoundElapsedPaneIndex] = '100%'
          }
        }

        return (
          <DockStyle>
            {!!header && <DockHeaderStyle>{header}</DockHeaderStyle>}
            <SplitPane split="horizontal" allowResize={true} resizerSize={1} onResizeEnd={handleResizeEnd}>
              {panes.map(({ title, component, elapsed }, i) => {
                if (elapsed === false) {
                  // return renderDockPane(title, component, elapsed, 0, makePaneHeaderClickHandler(i))
                  return (
                    <Pane key={title} initialSize="22px" minSize="22px" maxSize="22px">
                      {renderDockPane(title, component, elapsed, 0, makePaneHeaderClickHandler(i), theme)}
                    </Pane>
                  )
                }

                // const initialSize = sizes[i] == null ? '144px' : sizes[i]

                return (
                  <Pane key={title} initialSize={sizes[i]} minSize="144px" maxSize="100%">
                    {renderDockPane(title, component, elapsed, 0, makePaneHeaderClickHandler(i), theme)}
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
              renderDockPane(title, component, elapsed, 0, makePaneHeaderClickHandler(i), theme)
            )}
          </DockStyle>
        )
      }
    }

    if (panesCount === 1) {
      const [{ title, component, elapsed }] = panes

      return (
        <DockStyle>
          {!!header && <DockHeaderStyle>{header}</DockHeaderStyle>}
          {renderDockPane(title, component, elapsed, 35 /*offset*/, makePaneHeaderClickHandler(0), theme)}
        </DockStyle>
      )
    }

    return <DockStyle>{!!header && <DockHeaderStyle>{header}</DockHeaderStyle>}</DockStyle>
  })
)

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
