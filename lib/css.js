// CSS generation
export class Css {
  constructor () {
    this.css = ''
    this.tabs = 0
    this.tab = '\t'
  }

  /**
    * @param {string} line The line to add
    * @returns {void}
  */
  addLine (line) {
    if (!line) {
      this.css += '\n'
      return
    }
    if (!typeof line === 'string') {
      throw new Error('The line must be a string')
    }
    if (line.trim().endsWith('}')) {
      this.tabs--
    }
    this.css += `${this.tab.repeat(this.tabs)}${line}\n`
    if (line.trim().endsWith('{')) {
      this.tabs++
    }
  }
}
