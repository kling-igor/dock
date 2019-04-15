import React from 'react'
import { observable, action } from 'mobx'
import { observer } from 'mobx-react'
import { DockView, OpenFolder, OutlineInfo } from './dock-view'

export class Dock {
  @observable.ref panels = []

  @action.bound addToTopPanel({ title, component }) {
    this.panels = [{ title, component }, ...this.panels]
  }

  @action.bound addToBottomPanel({ title, component }) {
    this.panels = [...this.panels, { title, component }]
  }

  @action.bound removePanelWithName(name) {
    this.panels = this.panels.filter(({ title }) => title !== name)
    // TODO: если нет панели OUTLINE то добавить снизу дефолтную 'OUTLINE'

    // если только одна панель OUTLINE то добавить сверху дефолтную 'NO FOLDER OPENED'
  }

  constructor({ workspace, project }) {
    this.panels = [
      // { title: 'NO FOLDER OPENED', component: <OpenFolder workspace={workspace} /> },
      // { title: 'OUTLINE', component: <OutlineInfo /> }
    ]
    this._widget = observer(() => <DockView header="EXPLORER" panels={this.panels} />)
  }

  get widget() {
    return this._widget
  }
}
