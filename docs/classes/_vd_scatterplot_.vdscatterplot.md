[@dbvis/vd-scatterplot](../README.md) > ["vd-scatterplot"](../modules/_vd_scatterplot_.md) > [VdScatterplot](../classes/_vd_scatterplot_.vdscatterplot.md)

# Class: VdScatterplot

## Hierarchy

**VdScatterplot**

## Index

### Constructors

* [constructor](_vd_scatterplot_.vdscatterplot.md#constructor)

### Methods

* [alignData](_vd_scatterplot_.vdscatterplot.md#aligndata)
* [observeHoverBrush](_vd_scatterplot_.vdscatterplot.md#observehoverbrush)
* [observeSelectionBrush](_vd_scatterplot_.vdscatterplot.md#observeselectionbrush)
* [resize](_vd_scatterplot_.vdscatterplot.md#resize)
* [sendHover](_vd_scatterplot_.vdscatterplot.md#sendhover)
* [sendSelection](_vd_scatterplot_.vdscatterplot.md#sendselection)
* [setCluster](_vd_scatterplot_.vdscatterplot.md#setcluster)
* [setData](_vd_scatterplot_.vdscatterplot.md#setdata)
* [setOptions](_vd_scatterplot_.vdscatterplot.md#setoptions)
* [updateTitle](_vd_scatterplot_.vdscatterplot.md#updatetitle)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new VdScatterplot**(rootElement: *`HTMLElement`*, options: *[VdScatterplotOptions](../interfaces/_vd_scatterplot_options_.vdscatterplotoptions.md)*): [VdScatterplot](_vd_scatterplot_.vdscatterplot.md)

*Defined in [vd-scatterplot.ts:91](https://github.com/dbvis-ukon/vd-scatterplot/blob/5784617/src/scatterplot/vd-scatterplot.ts#L91)*

Constructor of a VdScatterplot element.

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| rootElement | `HTMLElement` |  - |
| options | [VdScatterplotOptions](../interfaces/_vd_scatterplot_options_.vdscatterplotoptions.md) |   |

**Returns:** [VdScatterplot](_vd_scatterplot_.vdscatterplot.md)

___

## Methods

<a id="aligndata"></a>

###  alignData

▸ **alignData**(targetData: *[DataItem](../interfaces/_data_item_.dataitem.md)[]*): `void`

*Defined in [vd-scatterplot.ts:239](https://github.com/dbvis-ukon/vd-scatterplot/blob/5784617/src/scatterplot/vd-scatterplot.ts#L239)*

Align the scatterplot data towards given target data by checking if mirroring the x- and/or y-axis leads to a smaller (euclidean) distance between the data. The comparisons take place by elements of the arrays.

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| targetData | [DataItem](../interfaces/_data_item_.dataitem.md)[] |   |

**Returns:** `void`

___
<a id="observehoverbrush"></a>

###  observeHoverBrush

▸ **observeHoverBrush**(): `Observable`<[VdScatterplotEvent](../interfaces/_vd_scatterplot_event_.vdscatterplotevent.md)>

*Defined in [vd-scatterplot.ts:131](https://github.com/dbvis-ukon/vd-scatterplot/blob/5784617/src/scatterplot/vd-scatterplot.ts#L131)*

**Returns:** `Observable`<[VdScatterplotEvent](../interfaces/_vd_scatterplot_event_.vdscatterplotevent.md)>

___
<a id="observeselectionbrush"></a>

###  observeSelectionBrush

▸ **observeSelectionBrush**(): `Observable`<[VdScatterplotEvent](../interfaces/_vd_scatterplot_event_.vdscatterplotevent.md)>

*Defined in [vd-scatterplot.ts:123](https://github.com/dbvis-ukon/vd-scatterplot/blob/5784617/src/scatterplot/vd-scatterplot.ts#L123)*

**Returns:** `Observable`<[VdScatterplotEvent](../interfaces/_vd_scatterplot_event_.vdscatterplotevent.md)>

___
<a id="resize"></a>

###  resize

▸ **resize**(newWidth: *`number`*, newHeight: *`number`*): `void`

*Defined in [vd-scatterplot.ts:230](https://github.com/dbvis-ukon/vd-scatterplot/blob/5784617/src/scatterplot/vd-scatterplot.ts#L230)*

Resizes the height and width of plot.

**Parameters:**

| Param | Type |
| ------ | ------ |
| newWidth | `number` |
| newHeight | `number` |

**Returns:** `void`

___
<a id="sendhover"></a>

###  sendHover

▸ **sendHover**(scatterplotEvent: *[VdScatterplotEvent](../interfaces/_vd_scatterplot_event_.vdscatterplotevent.md)*): `void`

*Defined in [vd-scatterplot.ts:127](https://github.com/dbvis-ukon/vd-scatterplot/blob/5784617/src/scatterplot/vd-scatterplot.ts#L127)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| scatterplotEvent | [VdScatterplotEvent](../interfaces/_vd_scatterplot_event_.vdscatterplotevent.md) |

**Returns:** `void`

___
<a id="sendselection"></a>

###  sendSelection

▸ **sendSelection**(scatterplotEvent: *[VdScatterplotEvent](../interfaces/_vd_scatterplot_event_.vdscatterplotevent.md)*): `void`

*Defined in [vd-scatterplot.ts:119](https://github.com/dbvis-ukon/vd-scatterplot/blob/5784617/src/scatterplot/vd-scatterplot.ts#L119)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| scatterplotEvent | [VdScatterplotEvent](../interfaces/_vd_scatterplot_event_.vdscatterplotevent.md) |

**Returns:** `void`

___
<a id="setcluster"></a>

###  setCluster

▸ **setCluster**(cluster: *[ClusterItem](../interfaces/_cluster_item_.clusteritem.md)[]*): `void`

*Defined in [vd-scatterplot.ts:152](https://github.com/dbvis-ukon/vd-scatterplot/blob/5784617/src/scatterplot/vd-scatterplot.ts#L152)*

Set the cluster - if available - for the scatterplot.

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| cluster | [ClusterItem](../interfaces/_cluster_item_.clusteritem.md)[] |   |

**Returns:** `void`

___
<a id="setdata"></a>

###  setData

▸ **setData**(data: *[DataItem](../interfaces/_data_item_.dataitem.md)[]*): `void`

*Defined in [vd-scatterplot.ts:139](https://github.com/dbvis-ukon/vd-scatterplot/blob/5784617/src/scatterplot/vd-scatterplot.ts#L139)*

Set the data for the scatterplot.

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| data | [DataItem](../interfaces/_data_item_.dataitem.md)[] |   |

**Returns:** `void`

___
<a id="setoptions"></a>

###  setOptions

▸ **setOptions**(options: *[VdScatterplotOptions](../interfaces/_vd_scatterplot_options_.vdscatterplotoptions.md)*): `void`

*Defined in [vd-scatterplot.ts:182](https://github.com/dbvis-ukon/vd-scatterplot/blob/5784617/src/scatterplot/vd-scatterplot.ts#L182)*

Set/Change options externally from constructor

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| options | [VdScatterplotOptions](../interfaces/_vd_scatterplot_options_.vdscatterplotoptions.md) |   |

**Returns:** `void`

___
<a id="updatetitle"></a>

###  updateTitle

▸ **updateTitle**(title: *`string`*): `void`

*Defined in [vd-scatterplot.ts:279](https://github.com/dbvis-ukon/vd-scatterplot/blob/5784617/src/scatterplot/vd-scatterplot.ts#L279)*

Add a title to the scatterplot below the diagram.

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| title | `string` |   |

**Returns:** `void`

___

