import React from 'react'
import { observable, action, computed } from 'mobx'
import { observer } from 'mobx-react'
import { DockView, OpenFolder, OutlineInfo, SearchInfo } from './dock-view'

export class Dock {
  @observable.ref _widget = null

  @observable.ref pages = {}

  @observable currentPage = null

  // для каждой страницы для каждого раздела страницы сохраняются размеры
  paneSizes = {}

  // @action.bound addToTopPanel({ title, component }) {
  //   this.panels = [{ title, component }, ...this.panels]
  // }

  // @action.bound addToBottomPanel({ title, component }) {
  //   this.panels = [...this.panels, { title, component }]
  // }

  // @action.bound removePanelWithName(name) {
  //   this.panels = this.panels.filter(({ title }) => title !== name)
  //   // TODO: если нет панели OUTLINE то добавить снизу дефолтную 'OUTLINE'

  //   // если только одна панель OUTLINE то добавить сверху дефолтную 'NO FOLDER OPENED'
  // }

  constructor({ workspace, project } = {}) {
    this.pages = {
      explorer: {
        header: 'EXPLORER',
        panes: [
          { title: 'NO FOLDER OPENED', elapsed: true, component: <OpenFolder workspace={workspace} /> },
          { title: 'OUTLINE', elapsed: true, component: <OutlineInfo /> }
        ]
      },
      search: {
        header: 'SEARCH',
        panes: [{ component: <SearchInfo /> }]
      }
    }

    this.paneSizes = {
      explorer: [],
      search: []
    }

    this.currentPage = 'search'

    this._widget = observer(() => (
      <DockView
        currentPage={this.currentPage}
        pages={this.pages}
        paneSizes={this.paneSizes}
        onPaneHeaderClick={this.onPaneHeaderClick}
        onResizeEnd={this.onResizeEnd}
      />
    ))
  }

  onResizeEnd = (pageId, sizes) => {
    this.paneSizes[pageId] = sizes
  }

  @action.bound
  onPaneHeaderClick(page, index) {
    console.log(`colapse/elapse '${page}' pane:`, index)
    const pages = { ...this.pages }
    pages[page].panes[index].elapsed = !pages[page].panes[index].elapsed
    this.pages = pages
  }

  @action.bound
  showPage(pageId) {
    if (pageId in this.pages) {
      this.currentPage = pageId
    }
  }

  @computed get widget() {
    return this._widget
  }
}
