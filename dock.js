import React from 'react'
import { observable, action } from 'mobx'
import { observer } from 'mobx-react'
import { DockView, OpenFolder, OutlineInfo, SearchInfo } from './dock-view'

export class Dock {
  @observable.ref _widget = null

  @observable.ref pages = {}

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
        header: "EXPLORER",
        panes: [
          { title: 'NO FOLDER OPENED', component: <OpenFolder workspace={workspace} /> },
          { title: 'OUTLINE', component: <OutlineInfo /> }
        ]
      },
      search: {
        header: "SEARCH",
        panes: [
          { component: <SearchInfo /> }
        ]
      }

    }

    this.currentPage = 'search'

    this._widget = <DockView currentPage={this.currentPage} pages={this.pages} />
  }

  get widget() {
    return this._widget
  }
}
