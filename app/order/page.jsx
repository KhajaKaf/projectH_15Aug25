// app/order/page.jsx
import OrderClient from "./OrderClient";

export const dynamic = "force-dynamic"; // optional but safe

export default function OrderLanding() {
  // No params on /order, so do NOT read params here.
  return <OrderClient initialTableId={null} />;
}