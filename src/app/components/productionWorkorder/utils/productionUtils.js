import RowStatus from "../subComponents/rowState";
import ImageGallery from "app/components/imageGallery/imageGallery";

import { YMDDateFormat, getKeyFromVal } from "app/utils/utils";
import { RemakeRowStates, BackorderRowStates, ProductionRowStates, GlassRowStates } from "app/utils/constants";

export const getTableColumns = (table, data, onChange, isRowStateEditable) => {
  let result = [];

  switch (table) {
    case "windows":
    case "patioDoors":
    case "vinylDoors":
    case "exteriorDoors":
      result = [
        {
          title: 'Item',
          dataIndex: 'item',
          align: "center"
        },
        {
          title: 'Size',
          dataIndex: 'size',
          align: "center"
        },
        {
          title: 'Qty',
          dataIndex: 'quantity',
          align: "center"
        },
        {
          title: 'SubQty',
          dataIndex: 'subQty',
          align: "center"
        },
        {
          title: 'System',
          dataIndex: 'system',
          align: "center"
        },
        {
          title: 'Description',
          dataIndex: 'description',
          align: "center"
        },
        {
          title: 'Location',
          dataIndex: 'location',
          align: "center"
        },
        {
          title: 'Status',
          dataIndex: 'status',
          align: "center",
          render: (_, record) =>
            data?.length >= 1 ? (
              <div style={{width: "100%", justifyContent: "center", display: "flex"}}>
                <RowStatus
                  id={record.detailRecordId}
                  table={table}
                  statusKey={getKeyFromVal(ProductionRowStates, record.status)}
                  onChange={onChange}
                  style={{ margin: "0 0.5rem 0 0.5rem" }}
                  rowStates={ProductionRowStates}
                  isEditable={isRowStateEditable}
                />
              </div>
            ) : null,
        },
      ];
      break;
    case "remakeWindows":
    case "remakePatioDoors":
    case "remakeVinylDoors":
    case "remakeExteriorDoors":
      result = [
        {
          title: 'Item',
          dataIndex: 'itemNo',
          align: "center"
        },
        {
          title: 'SubQty',
          dataIndex: 'subQty',
          align: "center"
        },
        {
          title: 'Description',
          dataIndex: 'description',
          align: "center"
        },
        {
          title: 'Requested By',
          dataIndex: 'requestedBy',
          align: "center"
        },
        {
          title: 'Notes',
          dataIndex: 'notes',
          align: "center"
        },
        {
          title: 'Product',
          dataIndex: 'product',
          align: "center"
        },
        {
          title: 'Scheduled Date',
          dataIndex: 'scheduleDate',
          align: "center"
        },
        {
          title: 'Status',
          dataIndex: 'status',
          render: (_, record) =>
            data?.length >= 1 ? (
              <div style={{ width: "100%", justifyContent: "center", display: "flex" }}>
                <RowStatus
                  id={record.detailRecordId}
                  table={table}
                  statusKey={getKeyFromVal(RemakeRowStates, record.status)}
                  onChange={() => { }}
                  style={{ margin: "0 0.5rem 0 0.5rem" }}
                  rowStates={RemakeRowStates}
                />
              </div>
            ) : null,
        },
        {
          title: 'Attachments',
          dataIndex: '',
          render: (_, record) =>
            data?.length >= 1 ? (
              <ImageGallery
                files={record?.remakeFiles}
                imageHeight={70}
                cols={3}
                onDiscard={() => { }}
                onUpload={() => { }}
                isReadOnly={true}
                style={{ maxWidth: "15rem" }}
              />
            ) : null,
        }
      ];
      break;
    case "backorderWindows":
    case "backorderPatioDoors":
    case "backorderVinylDoors":
    case "backorderExteriorDoors":
      result = [
        {
          title: 'Item',
          dataIndex: 'itemNo',
          align: "center"
        },
        {
          title: 'SubQty',
          dataIndex: 'subQty',
          align: "center"
        },
        {
          title: 'Description',
          dataIndex: 'description',
          align: "center"
        },
        {
          title: 'Requested By',
          dataIndex: 'requestedBy',
          align: "center"
        },
        {
          title: 'Notes',
          dataIndex: 'notes',
          align: "center"
        },
        {
          title: 'Original Shipment Date',
          dataIndex: 'originalShipmentDate',
          align: "center"
        },
        {
          title: 'Estimated Shipment Date',
          dataIndex: 'estimatedShipmentDate',
          align: "center"
        },
        {
          title: 'Status',
          dataIndex: 'status',
          render: (_, record) =>
            data?.length >= 1 ? (
              <RowStatus
                id={record.detailRecordId}
                table={table}
                statusKey={getKeyFromVal(ProductionRowStates, record.status)}
                onChange={() => { }}
                style={{ margin: "0 0.5rem 0 0.5rem" }}
                rowStates={BackorderRowStates}
              />
            ) : null,
          align: "center"
        }
      ];
      break;
    case "glass":
      result = [
        {
          title: 'Received / Expected Qty',
          dataIndex: 'receivedExpected',
          align: "center"
        },
        {
          title: 'Item',
          dataIndex: 'item',
          align: "center"
        },
        {
          title: 'Description',
          dataIndex: 'description',
          align: "center"
        },
        {
          title: 'Order Date',
          dataIndex: 'orderDate',
          align: "center"
        },
        {
          title: 'Shipping Date',
          dataIndex: 'shipDate',
          align: "center"
        },
        {
          title: 'Size',
          dataIndex: 'size',
          align: "center"
        },
        {
          title: 'Position',
          dataIndex: 'position',
          align: "center"
        },
        {
          title: 'Status',
          dataIndex: 'status',
          align: "center",
          render: (_, record) =>
            data?.length >= 1 ? (
              <div style={{ width: "100%", justifyContent: "center", display: "flex" }}>
                <RowStatus
                  id={record.detailRecordId}
                  table={table}
                  statusKey={getKeyFromVal(GlassRowStates, record.status)}
                  onChange={() => { }}
                  style={{ margin: "0 0.5rem 0 0.5rem" }}
                  rowStates={GlassRowStates}
                />
              </div>
            ) : null,
        }
      ];
      break;
    case "productionVertical":
      result = [
        {
          title: '',
          dataIndex: 'item',
          render: (_, record) => {
            return (
              <div>
                <div>
                  <div className="flex flex-row"><div style={{ width: "8rem" }} className="font-semibold">Item</div><div className="truncate text-blue-500 font-bold">{record.item}</div></div>
                  <div className="flex flex-row"><div style={{ width: "8rem" }} className="font-semibold">Size</div><div className="truncate">{record.size}</div></div>
                  <div className="flex flex-row"><div style={{ width: "8rem" }} className="font-semibold">Quantity</div><div className="truncate">{record.quantity}</div></div>
                  <div className="flex flex-row"><div style={{ width: "8rem" }} className="font-semibold">Sub Quantity</div><div className="truncate">{record.subQty}</div></div>
                </div>
                <div>
                  <div className="flex flex-row"><div style={{ width: "8rem" }} className="font-semibold">System</div><div className="truncate">{record.system}</div></div>
                  <div className="flex flex-row"><div style={{ width: "8rem" }} className="font-semibold">Description</div><div className="truncate">{record.description}</div></div>
                  <div className="flex flex-row"><div style={{ width: "8rem" }} className="font-semibold">location</div><div className="truncate">{record.location}</div></div>
                  <div className="flex flex-row"><div style={{ width: "8rem" }} className="font-semibold">Status</div><div className="truncate">{record.status}</div></div>
                </div>
              </div>
            )
          }
        }
      ];
      break;
    case "remakeVertical":
      result = [
        {
          title: '',
          dataIndex: 'item',
          render: (_, record) => {
            return (
              <div>
                <div>
                  <div className="flex flex-row"><div style={{ width: "8rem" }} className="font-semibold">Item</div><div className="truncate text-blue-500 font-bold">{record.itemNo}</div></div>
                  <div className="flex flex-row"><div style={{ width: "8rem" }} className="font-semibold">SubQty</div><div className="truncate">{record.subQty}</div></div>
                  <div className="flex flex-row"><div style={{ width: "8rem" }} className="font-semibold">Description</div><div className="truncate">{record.description}</div></div>
                  <div className="flex flex-row"><div style={{ width: "8rem" }} className="font-semibold">Requested By</div><div className="truncate">{record.requestedBy}</div></div>
                </div>
                <div>
                  <div className="flex flex-row"><div style={{ width: "8rem" }} className="font-semibold">Notes</div><div className="truncate">{record.notes}</div></div>
                  <div className="flex flex-row"><div style={{ width: "8rem" }} className="font-semibold">Product</div><div className="truncate">{record.product}</div></div>
                  <div className="flex flex-row"><div style={{ width: "8rem" }} className="font-semibold">Scheduled Date</div><div className="truncate">{record.scheduleDate}</div></div>
                  <div className="flex flex-row"><div style={{ width: "8rem" }} className="font-semibold">Status</div><div className="truncate">{record.status}</div></div>
                </div>
                <div>
                  <ImageGallery
                    files={record?.remakeFiles}
                    imageHeight={70}
                    cols={2}
                    onDiscard={() => { }}
                    onUpload={() => { }}
                    isReadOnly={true}
                    style={{ maxWidth: "10rem" }}
                  />
                </div>
              </div>
            )
          }
        }
      ];
      break;
    case "backorderVertical":
      result = [
        {
          title: '',
          dataIndex: 'item',
          render: (_, record) => {
            return (
              <div>
                <div>
                  <div className="flex flex-row"><div style={{ width: "12rem" }} className="font-semibold">Item</div><div className="truncate text-blue-500 font-bold">{record.itemNo}</div></div>
                  <div className="flex flex-row"><div style={{ width: "12rem" }} className="font-semibold">SubQty</div><div className="truncate">{record.subQty}</div></div>
                  <div className="flex flex-row"><div style={{ width: "12rem" }} className="font-semibold">Description</div><div className="truncate">{record.description}</div></div>
                  <div className="flex flex-row"><div style={{ width: "12rem" }} className="font-semibold">Requested By</div><div className="truncate">{record.requestedBy}</div></div>
                </div>
                <div>
                  <div className="flex flex-row"><div style={{ width: "12rem" }} className="font-semibold">Notes</div><div className="truncate">{record.notes}</div></div>
                  <div className="flex flex-row"><div style={{ width: "12rem" }} className="font-semibold">Original Shipping Date</div><div className="truncate">{YMDDateFormat(record.originalShipmentDate)}</div></div>
                  <div className="flex flex-row"><div style={{ width: "12rem" }} className="font-semibold">Estimated Shipping Date</div><div className="truncate">{YMDDateFormat(record.estimatedShipmentDate)}</div></div>
                  <div className="flex flex-row"><div style={{ width: "12rem" }} className="font-semibold">Status</div><div className="truncate">{record.status}</div></div>
                </div>
                <div>
                  <ImageGallery
                    files={record?.remakeFiles}
                    imageHeight={70}
                    cols={2}
                    onDiscard={() => { }}
                    onUpload={() => { }}
                    isReadOnly={true}
                    style={{ maxWidth: "10rem" }}
                  />
                </div>
              </div>
            )
          }
        }
      ];
      break;
    case "glassVertical":
      result = [
        {
          title: '',
          dataIndex: 'item',
          render: (_, record) => {
            return (
              <div>
                <div>
                  <div className="flex flex-row"><div style={{ width: "12rem" }} className="font-semibold">Received / Expected Qty</div><div className="truncate">{`${record.receivedExpected}`}</div></div>
                  <div className="flex flex-row"><div style={{ width: "12rem" }} className="font-semibold">Item</div><div className="truncate">{record.item}</div></div>
                  <div className="flex flex-row"><div style={{ width: "12rem" }} className="font-semibold">Description</div><div className="truncate">{record.glassDescription}</div></div>
                  <div className="flex flex-row"><div style={{ width: "12rem" }} className="font-semibold">Order Date</div><div className="truncate">{record.orderDate}</div></div>
                </div>
                <div>
                  <div className="flex flex-row"><div style={{ width: "12rem" }} className="font-semibold">Shipping Date</div><div className="truncate">{record.shipDate}</div></div>
                  <div className="flex flex-row"><div style={{ width: "12rem" }} className="font-semibold">Size</div><div className="truncate">{record.size}</div></div>
                  <div className="flex flex-row"><div style={{ width: "12rem" }} className="font-semibold">Position</div><div className="truncate">{record.position}</div></div>
                  <div className="flex flex-row"><div style={{ width: "12rem" }} className="font-semibold">Status</div>
                    <RowStatus
                      id={record.detailRecordId}
                      table={table}
                      statusKey={getKeyFromVal(GlassRowStates, record.status)}
                      onChange={() => { }}
                      style={{ margin: "0 0.5rem 0 0.5rem" }}
                      rowStates={GlassRowStates}
                    /></div>
                </div>
                <div>
                  <ImageGallery
                    files={record?.remakeFiles}
                    imageHeight={70}
                    cols={2}
                    onDiscard={() => { }}
                    onUpload={() => { }}
                    isReadOnly={true}
                    style={{ maxWidth: "10rem" }}
                  />
                </div>
              </div>
            )
          }
        }
      ];
      break;
    default:
      break;
  }

  return result;
}