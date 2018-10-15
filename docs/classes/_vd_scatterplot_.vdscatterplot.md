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

*Defined in [vd-scatterplot.ts:90](https://github.com/dbvis-ukon/vd-scatterplot/blob/74ab5b9/src/scatterplot/vd-scatterplot.ts#L90)*

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

*Defined in [vd-scatterplot.ts:259](https://github.com/dbvis-ukon/vd-scatterplot/blob/74ab5b9/src/scatterplot/vd-scatterplot.ts#L259)*

This function is intended to adjust the scatterplot to given target data in the following sense: when having plots of data items with same id but of different projections, the x- and y-axes of the scatterplot at hand are flipped if this leads to a smaller (euclidean) distance between the data items. For example, this will cause scatterplots of a pca and mds to have the same shape which makes them better comparable.

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| targetData | [DataItem](../interfaces/_data_item_.dataitem.md)[] |   |

**Returns:** `void`

___
<a id="observehoverbrush"></a>

###  observeHoverBrush

▸ **observeHoverBrush**(): `Observable`<[VdScatterplotEvent](../interfaces/_vd_scatterplot_event_.vdscatterplotevent.md)>

*Defined in [vd-scatterplot.ts:146](https://github.com/dbvis-ukon/vd-scatterplot/blob/74ab5b9/src/scatterplot/vd-scatterplot.ts#L146)*

Get observation of hovering a data item.

**Returns:** `Observable`<[VdScatterplotEvent](../interfaces/_vd_scatterplot_event_.vdscatterplotevent.md)>

___
<a id="observeselectionbrush"></a>

###  observeSelectionBrush

▸ **observeSelectionBrush**(): `Observable`<[VdScatterplotEvent](../interfaces/_vd_scatterplot_event_.vdscatterplotevent.md)>

*Defined in [vd-scatterplot.ts:130](https://github.com/dbvis-ukon/vd-scatterplot/blob/74ab5b9/src/scatterplot/vd-scatterplot.ts#L130)*

Get observation of selecting a group of data items.

**Returns:** `Observable`<[VdScatterplotEvent](../interfaces/_vd_scatterplot_event_.vdscatterplotevent.md)>

___
<a id="resize"></a>

###  resize

▸ **resize**(newWidth: *`number`*, newHeight: *`number`*): `void`

*Defined in [vd-scatterplot.ts:247](https://github.com/dbvis-ukon/vd-scatterplot/blob/74ab5b9/src/scatterplot/vd-scatterplot.ts#L247)*

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

*Defined in [vd-scatterplot.ts:138](https://github.com/dbvis-ukon/vd-scatterplot/blob/74ab5b9/src/scatterplot/vd-scatterplot.ts#L138)*

Send the data item that was hovered to observers.

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| scatterplotEvent | [VdScatterplotEvent](../interfaces/_vd_scatterplot_event_.vdscatterplotevent.md) |   |

**Returns:** `void`

___
<a id="sendselection"></a>

###  sendSelection

▸ **sendSelection**(scatterplotEvent: *[VdScatterplotEvent](../interfaces/_vd_scatterplot_event_.vdscatterplotevent.md)*): `void`

*Defined in [vd-scatterplot.ts:122](https://github.com/dbvis-ukon/vd-scatterplot/blob/74ab5b9/src/scatterplot/vd-scatterplot.ts#L122)*

Send selection of a group of dataitems to observers.

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| scatterplotEvent | [VdScatterplotEvent](../interfaces/_vd_scatterplot_event_.vdscatterplotevent.md) |   |

**Returns:** `void`

___
<a id="setcluster"></a>

###  setCluster

▸ **setCluster**(cluster: *[ClusterItem](../interfaces/_cluster_item_.clusteritem.md)[]*): `void`

*Defined in [vd-scatterplot.ts:168](https://github.com/dbvis-ukon/vd-scatterplot/blob/74ab5b9/src/scatterplot/vd-scatterplot.ts#L168)*

Set the cluster for the scatterplot. All item ids related to a cluster have to be contained in the data of the scatterplot.

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| cluster | [ClusterItem](../interfaces/_cluster_item_.clusteritem.md)[] |   |

**Returns:** `void`

___
<a id="setdata"></a>

###  setData

▸ **setData**(data: *[DataItem](../interfaces/_data_item_.dataitem.md)[]*): `void`

*Defined in [vd-scatterplot.ts:154](https://github.com/dbvis-ukon/vd-scatterplot/blob/74ab5b9/src/scatterplot/vd-scatterplot.ts#L154)*

Set data for the scatterplot.

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| data | [DataItem](../interfaces/_data_item_.dataitem.md)[] |   |

**Returns:** `void`

___
<a id="setoptions"></a>

###  setOptions

▸ **setOptions**(options: *[VdScatterplotOptions](../interfaces/_vd_scatterplot_options_.vdscatterplotoptions.md)*): `void`

*Defined in [vd-scatterplot.ts:199](https://github.com/dbvis-ukon/vd-scatterplot/blob/74ab5b9/src/scatterplot/vd-scatterplot.ts#L199)*

Set/Change options externally from constructor. NOTE: If voronoi cells are activated, there is no brush/group selection possible.

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| options | [VdScatterplotOptions](../interfaces/_vd_scatterplot_options_.vdscatterplotoptions.md) |   |

**Returns:** `void`

___
<a id="updatetitle"></a>

###  updateTitle

▸ **updateTitle**(title: *`string`*): `void`

*Defined in [vd-scatterplot.ts:299](https://github.com/dbvis-ukon/vd-scatterplot/blob/74ab5b9/src/scatterplot/vd-scatterplot.ts#L299)*

Add a title to the scatterplot below the diagram.

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| title | `string` |   |

**Returns:** `void`

___

