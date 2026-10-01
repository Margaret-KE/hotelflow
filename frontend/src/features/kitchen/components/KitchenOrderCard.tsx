import type { KitchenOrderItem } from "../types/kitchen.types";

interface KitchenOrderCardProps {
  item: KitchenOrderItem;
  onStartPreparing: (itemId: string) => void;
  onMarkReady: (itemId: string) => void;
  onMarkServed: (itemId: string) => void;
  actionLoading: boolean;
}

function formatTime(value: string) {
  return new Date(value).toLocaleTimeString("en-KE", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-KE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function KitchenOrderCard({
  item,
  onStartPreparing,
  onMarkReady,
  onMarkServed,
  actionLoading,
}: KitchenOrderCardProps) {
  const guest = item.order.guest;

  const guestName = guest
    ? `${guest.firstName} ${guest.lastName}`
    : "Walk-in Guest";

  let statusLabel = "Pending";
  let statusClass = "bg-amber-100 text-amber-700";

  if (item.status === "PREPARING") {
    statusLabel = "Preparing";
    statusClass = "bg-blue-100 text-blue-700";
  }

  if (item.status === "READY") {
    statusLabel = "Ready";
    statusClass = "bg-green-100 text-green-700";
  }

  function handlePrint() {
    const printWindow = window.open("", "_blank", "width=500,height=700");

    if (!printWindow) {
      return;
    }

    const kitchenNote = item.notes
      ? `
        <div class="note">
          <div class="note-title">Kitchen Note</div>
          <div>${item.notes}</div>
        </div>
      `
      : "";

    const orderNote = item.order.notes
      ? `
        <div class="note order-note">
          <div class="note-title">Order Note</div>
          <div>${item.order.notes}</div>
        </div>
      `
      : "";

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Kitchen Order ${item.order.orderNumber}</title>
          <style>
            @page {
              size: 80mm auto;
              margin: 5mm;
            }

            * {
              box-sizing: border-box;
            }

            body {
              margin: 0;
              padding: 0;
              width: 100%;
              font-family: Arial, Helvetica, sans-serif;
              color: #000;
              background: #fff;
              font-size: 13px;
            }

            .ticket {
              width: 100%;
            }

            .center {
              text-align: center;
            }

            .hotel-name {
              font-size: 18px;
              font-weight: 700;
              margin-bottom: 4px;
            }

            .ticket-title {
              font-size: 15px;
              font-weight: 700;
              margin-bottom: 10px;
            }

            .divider {
              border-top: 1px dashed #000;
              margin: 10px 0;
            }

            .details {
              font-size: 12px;
              line-height: 1.5;
            }

            .detail-row {
              display: flex;
              justify-content: space-between;
              gap: 10px;
            }

            .detail-label {
              font-weight: 700;
            }

            .item {
              margin: 12px 0;
            }

            .item-row {
              display: flex;
              align-items: flex-start;
              gap: 10px;
            }

            .quantity {
              font-size: 18px;
              font-weight: 700;
              min-width: 35px;
            }

            .item-name {
              font-size: 17px;
              font-weight: 700;
              line-height: 1.25;
            }

            .item-description {
              margin-top: 3px;
              font-size: 11px;
              color: #333;
            }

            .note {
              margin-top: 10px;
              padding: 7px;
              border: 1px solid #000;
              font-size: 12px;
              line-height: 1.4;
            }

            .note-title {
              font-weight: 700;
              text-transform: uppercase;
              margin-bottom: 3px;
            }

            .footer {
              margin-top: 12px;
              text-align: center;
              font-size: 10px;
            }
          </style>
        </head>

        <body>
          <div class="ticket">
            <div class="center">
              <div class="hotel-name">Greenwood Hotel</div>
              <div class="ticket-title">KITCHEN ORDER</div>
            </div>

            <div class="divider"></div>

            <div class="details">
              <div class="detail-row">
                <span class="detail-label">Order:</span>
                <span>${item.order.orderNumber}</span>
              </div>

              <div class="detail-row">
                <span class="detail-label">Date:</span>
                <span>${formatDate(item.createdAt)}</span>
              </div>

              <div class="detail-row">
                <span class="detail-label">Time:</span>
                <span>${formatTime(item.createdAt)}</span>
              </div>

              <div class="detail-row">
                <span class="detail-label">Guest:</span>
                <span>${guestName}</span>
              </div>
            </div>

            <div class="divider"></div>

            <div class="item">
              <div class="item-row">
                <div class="quantity">×${item.quantity}</div>

                <div>
                  <div class="item-name">${item.menuItem.name}</div>

                  ${
                    item.menuItem.description
                      ? `<div class="item-description">${item.menuItem.description}</div>`
                      : ""
                  }
                </div>
              </div>
            </div>

            ${kitchenNote}
            ${orderNote}

            <div class="divider"></div>

            <div class="footer">
              Kitchen Ticket
            </div>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();

    printWindow.focus();

    printWindow.onafterprint = () => {
      printWindow.close();
    };

    printWindow.print();
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-start justify-between gap-4 border-b border-slate-200 bg-slate-50 px-5 py-4">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-base font-bold text-slate-900">
              {item.order.orderNumber}
            </h3>

            <span
              className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusClass}`}
            >
              {statusLabel}
            </span>
          </div>

          <p className="mt-1 text-xs text-slate-500">{guestName}</p>
        </div>

        <div className="text-right">
          <p className="text-xs font-medium text-slate-500">Ordered</p>

          <p className="mt-1 text-sm font-semibold text-slate-900">
            {formatTime(item.createdAt)}
          </p>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h4 className="text-lg font-semibold text-slate-900">
              {item.menuItem.name}
            </h4>

            {item.menuItem.description && (
              <p className="mt-1 text-sm text-slate-500">
                {item.menuItem.description}
              </p>
            )}
          </div>

          <div className="flex h-10 min-w-10 items-center justify-center rounded-lg bg-slate-900 px-3 text-lg font-bold text-white">
            ×{item.quantity}
          </div>
        </div>

        {item.notes && (
          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">
              Kitchen Note
            </p>

            <p className="mt-1 text-sm text-amber-900">{item.notes}</p>
          </div>
        )}

        {item.order.notes && (
          <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Order Note
            </p>

            <p className="mt-1 text-sm text-slate-700">
              {item.order.notes}
            </p>
          </div>
        )}

        <div className="mt-5 flex flex-wrap gap-3">
          {item.status === "PENDING" && (
            <button
              type="button"
              onClick={() => onStartPreparing(item.id)}
              disabled={actionLoading}
              className="rounded-lg bg-amber-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {actionLoading ? "Updating..." : "Start Preparing"}
            </button>
          )}

          {item.status === "PREPARING" && (
            <button
              type="button"
              onClick={() => onMarkReady(item.id)}
              disabled={actionLoading}
              className="rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {actionLoading ? "Updating..." : "Mark Ready"}
            </button>
          )}

          {item.status === "READY" && (
            <button
              type="button"
              onClick={() => onMarkServed(item.id)}
              disabled={actionLoading}
              className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {actionLoading ? "Updating..." : "Mark Served"}
            </button>
          )}

          <button
            type="button"
            onClick={handlePrint}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Print Order
          </button>
        </div>
      </div>
    </div>
  );
}