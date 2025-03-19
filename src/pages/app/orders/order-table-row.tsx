import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowRight, Search, X } from "lucide-react";
import { useState } from "react";

import { approveOrder } from "@/api/approve-order";
import { cancelOrder } from "@/api/cancel-order";
import { deliverOrder } from "@/api/deliver-order";
import { dispatchOrder } from "@/api/dispatch.order";
import { GetOrdersResponse } from "@/api/get-orders";
import { OrderStatus } from "@/components/order-status";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { TableCell, TableRow } from "@/components/ui/table";

import { OrderDetails } from "./order-details";
import { getOrdersQuantity } from "@/api/get-order-quantity";
export interface OrderTableRowProps {
  order: {
    orderId: string;
    createdAt: string;
    status: "pending" | "canceled" | "processing" | "delivering" | "delivered";
    quantity: number;
    total: number;
  };
}
export function OrderTableRow({ order }: OrderTableRowProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const orderId = order.orderId;
  const queryClient = useQueryClient();
  const { data: orderQuantity } = useQuery({
    queryKey: ["orderQuantity", order.orderId],
    queryFn: () => getOrdersQuantity({ orderId }),
  });
  function updateOrderStatusOnCache(orderId: string, status: OrderStatus) {
    const ordersListCache = queryClient.getQueriesData<GetOrdersResponse>({
      queryKey: ["orders"],
    });

    ordersListCache.forEach(([cacheKey, cacheData]) => {
      if (!cacheData) {
        return;
      }
      queryClient.setQueryData<GetOrdersResponse>(cacheKey, {
        ...cacheData,
        orders: cacheData.orders.map((order) => {
          if (order.orderId === orderId) {
            return {
              ...order,
              status,
            };
          }
          return order;
        }),
      });
    });
  }
  const { mutateAsync: cancelOrderFn, isPending: isCancellingOrder } =
    useMutation({
      mutationFn: cancelOrder,
      async onSuccess(_, { orderId }) {
        updateOrderStatusOnCache(orderId, "canceled");
      },
    });

  const { mutateAsync: approveOrderFn, isPending: isApprovingOrder } =
    useMutation({
      mutationFn: approveOrder,
      async onSuccess(_, { orderId }) {
        updateOrderStatusOnCache(orderId, "processing");
      },
    });

  const { mutateAsync: dispatchOrderFn, isPending: isDispatchingOrder } =
    useMutation({
      mutationFn: dispatchOrder,
      async onSuccess(_, { orderId }) {
        updateOrderStatusOnCache(orderId, "delivering");
      },
    });

  const { mutateAsync: deliverOrderFn, isPending: isDeliveringOrder } =
    useMutation({
      mutationFn: deliverOrder,
      async onSuccess(_, { orderId }) {
        updateOrderStatusOnCache(orderId, "delivered");
      },
    });
  return (
    <>
      {/* DESKTOP */}
      <TableRow className="hidden md:table-row">
        <TableCell>
          <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="xs">
                <Search className="h-3 w-3" />
                <span className="sr-only">Detalhes do pedido</span>
              </Button>
            </DialogTrigger>
            <OrderDetails open={isDetailsOpen} orderId={order.orderId} />
          </Dialog>
        </TableCell>
        <TableCell className="font-mono text-xs font-medium">
          {order.orderId}
        </TableCell>
        <TableCell className="text-muted-foreground">
          {formatDistanceToNow(new Date(order.createdAt), {
            locale: ptBR,
            addSuffix: true,
          })}
        </TableCell>
        <TableCell>
          <OrderStatus status={order.status} />
        </TableCell>
        <TableCell className="font-medium">
          {orderQuantity?.orderItems.map((items) => items.product.name)}
        </TableCell>
        <TableCell className="font-medium">
          {orderQuantity?.orderItems.map((items) => items.quantity)}
        </TableCell>
        <TableCell className="font-medium">
          {(order.total / 100).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </TableCell>
        <TableCell>
          {order.status === "pending" && (
            <Button
              variant="outline"
              size="xs"
              onClick={() => approveOrderFn({ orderId: order.orderId })}
              disabled={isApprovingOrder}
            >
              <ArrowRight className="mr-2 h-3 w-3" />
              Aprovar
            </Button>
          )}

          {order.status === "processing" && (
            <Button
              variant="outline"
              size="xs"
              onClick={() => dispatchOrderFn({ orderId: order.orderId })}
              disabled={isDispatchingOrder}
            >
              <ArrowRight className="mr-2 h-3 w-3" />
              Em entrega
            </Button>
          )}

          {order.status === "delivering" && (
            <Button
              variant="outline"
              size="xs"
              onClick={() => deliverOrderFn({ orderId: order.orderId })}
              disabled={isDeliveringOrder}
            >
              <ArrowRight className="mr-2 h-3 w-3" />
              Entregue
            </Button>
          )}
        </TableCell>
        <TableCell>
          <Button
            disabled={
              !["pending", "processing"].includes(order.status) ||
              isCancellingOrder
            }
            onClick={() => cancelOrderFn({ orderId: order.orderId })}
            variant="ghost"
            size="xs"
          >
            <X className="mr-2 h-3 w-3" />
            Cancelar
          </Button>
        </TableCell>
      </TableRow>

      {/* MOBILE */}
      <div className="flex flex-col gap-2 rounded-md border p-4 md:hidden">
        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(order.createdAt), {
              locale: ptBR,
              addSuffix: true,
            })}
          </div>
          <OrderStatus status={order.status} />
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">
            {orderQuantity?.orderItems.map((items) => items.product.name)}
          </div>
          <div className="text-sm font-medium">
            {orderQuantity?.orderItems.map((items) => items.quantity)}
          </div>
          <div className="text-sm font-medium">
            {(order.total / 100).toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="xs">
                <Search className="h-3 w-3" />
              </Button>
            </DialogTrigger>
            <OrderDetails open={isDetailsOpen} orderId={order.orderId} />
          </Dialog>

          {order.status === "pending" && (
            <>
              <Button
                variant="outline"
                size="xs"
                onClick={() => approveOrderFn({ orderId: order.orderId })}
                disabled={isApprovingOrder}
              >
                <ArrowRight className="mr-2 h-3 w-3" />
                Aprovar
              </Button>

              <Button
                variant="ghost"
                size="xs"
                disabled={
                  !["pending", "processing"].includes(order.status) ||
                  isCancellingOrder
                }
                onClick={() => cancelOrderFn({ orderId: order.orderId })}
              >
                <X className="mr-2 h-3 w-3" />
                Cancelar
              </Button>
            </>
          )}

          {order.status === "processing" && (
            <Button
              variant="outline"
              size="xs"
              onClick={() => dispatchOrderFn({ orderId: order.orderId })}
              disabled={isDispatchingOrder}
            >
              <ArrowRight className="mr-2 h-3 w-3" />
              Em entrega
            </Button>
          )}

          {order.status === "delivering" && (
            <Button
              variant="outline"
              size="xs"
              onClick={() => deliverOrderFn({ orderId: order.orderId })}
              disabled={isDeliveringOrder}
            >
              <ArrowRight className="mr-2 h-3 w-3" />
              Entregue
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
