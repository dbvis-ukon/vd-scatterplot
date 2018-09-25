import { Scatterplot } from '../scatterplot'

describe('Scatterplot', () => {
  it('should initialize class', () => {
    const scatterplot = new Scatterplot(document.body, {})
    expect(scatterplot).toBeInstanceOf(Scatterplot)
  })
})
