// app/order/[tableId]/page.js
import OrderClient from "../OrderClient";

export const dynamic = "force-dynamic"; // fine to keep

export default function Page({ params }) {
  // Here, params.tableId is defined (e.g. T01)
  return <OrderClient initialTableId={params.tableId} />;
}