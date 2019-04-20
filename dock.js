import React from 'react'
import { observable, action, computed } from 'mobx'
import { observer } from 'mobx-react'
import { DockView, OpenFolder, OutlineInfo, SearchInfo } from './dock-view'

export class Dock {
  @observable.ref _widget = null

  @observable.ref pages = {}

  @observable currentPage = null

  paneSizes = {
    explorer: [],
    search: []
  }


  // для каждой страницы для каждого раздела страницы сохраняются размеры
  paneSizes = {}


  constructor({ workspace, project } = {}) {
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
    const pages = { ...this.pages }
    pages[page].panes[index].elapsed = !pages[page].panes[index].elapsed
    this.pages = pages

    // удаляем ранее сохраненные размеры!!!
    this.paneSizes[page] = []
  }

  @action.bound
  showPage(pageId) {
    if (pageId in this.pages) {
      this.currentPage = pageId
    }
  }

  @action.bound
  addPage(pageId, description) {
    this.pages = { ...this.pages, [pageId]: description }
  }

  @action.bound
  removePage(pageId) {
    delete this.pages[pageId]
  }


  @action.bound
  addPane(pageId, description) {
    const page = this.pages[pageId]
    if (page) {
      this.paneSizes[pageId] = []
      page.panes = [...page.panes, description]
      this.pages = { ...this.pages }
    }
  }

  @action.bound
  insertPane(pageId, index, description) {

  }

  @action.bound
  removePane(pageId, index) {
    const page = this.pages[pageId]
    if (page && page.panes.length > index) {
      this.paneSizes[pageId] = []
      page.panes = [...page.panes.slice(0, index), ...page.panes.slice(index + 1)]
      this.pages = { ...this.pages }
    }
  }

  @computed get widget() {
    return this._widget
  }
}
