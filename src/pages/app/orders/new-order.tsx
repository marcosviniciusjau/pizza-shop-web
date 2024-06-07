import { useQuery } from '@tanstack/react-query'
import { TrashIcon } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'sonner'

import { createOrder, OrderItems } from '@/api/create-order'
import { getCustomers } from '@/api/get-customers'
import { GetOrdersResponse } from '@/api/get-orders'
import { getProducts, GetProductsResponse } from '@/api/get-products'
import { registerCustomer } from '@/api/register-customer'
import { Button } from '@/components/ui/button'
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export function NewOrder() {
  const { data: products } = useQuery({
    queryKey: ['get-products'],
    queryFn: getProducts,
  })

  const { data: customers } = useQuery({
    queryKey: ['get-customers'],
    queryFn: getCustomers,
  })

  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [customerPhone, setCustomerPhone] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedClient, setSelectedClient] = useState(null)
  const [orderItems, setOrderItems] = useState([]) || [
    { productId: '', quantity: 1, category: '', price: 100, subtotal: 100 },
  ]

  const handleSelectChange = (index, value, category) => {
    const selectedProduct = products?.find((product) => product.name === value)
    const newOrderItems = [...orderItems]
    newOrderItems[index] = {
      ...newOrderItems[index],
      productId: selectedProduct.id,
      price: selectedProduct.price,
      subtotal: selectedProduct.price * newOrderItems[index].quantity,
      category,
    }
    setOrderItems(newOrderItems)
  }

  const handleQuantityChange = (index, quantity) => {
    const newOrderItems = [...orderItems]
    newOrderItems[index] = {
      ...newOrderItems[index],
      quantity,
      subtotal: newOrderItems[index].price * quantity,
    }
    setOrderItems(newOrderItems)
  }

  const handleAddRow = (category) => {
    if (category === null) {
      category = 'pastries'
    }
    setOrderItems([
      ...orderItems,
      { productId: '', quantity: 1, category, price: 0, subtotal: 0 },
    ])
  }

  const handleRemoveRow = (index) => {
    const newOrderItems = orderItems.filter((_, i) => i !== index)
    setOrderItems(newOrderItems)
  }

  const getAvailableProducts = (index, category) => {
    const selectedProductIds = orderItems.map((item) => item.productId)
    return products?.filter(
      (product) =>
        (product.category === category &&
          !selectedProductIds.includes(product.id)) ||
        orderItems[index].productId === product.id,
    )
  }

  const filteredClients =
    customers?.filter((client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()),
    ) || []
  const hasCustomer = filteredClients.includes(selectedClient)

  const handleClientSelectChange = (value) => {
    const client = customers?.find((client) => client.id === value)
    setSearchTerm(client?.name)
    setCustomerPhone(client?.phone)
    setSelectedClient(client)
    setIsDropdownOpen(false)
  }

  async function handleCreateOrder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    try {
      let customerId = selectedClient ? selectedClient.id : null

      // If the customer does not exist, register the customer
      if (!hasCustomer) {
        customerId = searchTerm
      }

      await createOrder({
        customerId,
        customerName: searchTerm,
        items: orderItems.map((item: OrderItems) => ({
          productId: item.productId,
          quantity: item.quantity,
          category: item.category,
        })),
      })

      toast.success('Pedido criado com sucesso')
    } catch (error) {
      toast.error('Erro ao criar pedido')
    }
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Pedido:</DialogTitle>
        <DialogDescription>Detalhes do pedido</DialogDescription>
      </DialogHeader>

      <div className="space-y-6">
        <form onSubmit={handleCreateOrder}>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="text-muted-foreground">Cliente</TableCell>
                <TableCell className="flex justify-end">
                  <div className="relative w-full">
                    <Input
                      type="text"
                      placeholder="Pesquisar cliente..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value)
                        setIsDropdownOpen(true)
                      }}
                      required
                    />
                    {isDropdownOpen && filteredClients.length > 0 && (
                      <div className="absolute z-10 max-h-60 w-full overflow-y-auto rounded-md border border-gray-300 bg-white shadow-lg">
                        {filteredClients.map((client) => (
                          <div
                            key={client.id}
                            onClick={() => handleClientSelectChange(client.id)}
                            className="cursor-pointer p-2 hover:bg-gray-100"
                          >
                            {client.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-muted-foreground">
                  Telefone
                </TableCell>
                <TableCell className="flex justify-end">
                  <Input
                    type="text"
                    placeholder="Telefone do Cliente"
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    value={customerPhone}
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produtos</TableHead>
                <TableHead className="text-right">Preço</TableHead>
                <TableHead className="text-right">Qtd</TableHead>
                <TableHead className="text-right">Subtotal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orderItems.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="text-right">
                    <Select
                      onValueChange={(value) =>
                        handleSelectChange(index, value, item.category)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione um item" />
                      </SelectTrigger>
                      <SelectContent>
                        {getAvailableProducts(index, item.category)?.map(
                          (product) => (
                            <SelectItem key={product.id} value={product.name}>
                              {product.name}
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    <Input
                      readOnly
                      className="w-20"
                      value={(item.price / 100).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <Input
                      type="number"
                      className="w-20"
                      placeholder="Quantidade"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(index, Number(e.target.value))
                      }
                      required
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <Label>
                      {(item.subtotal / 100).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })}
                    </Label>
                  </TableCell>
                  <TableCell className="pl-0.5">
                    <Button
                      type="button"
                      onClick={() => handleRemoveRow(index)}
                      className="w-10 justify-center"
                    >
                      <TrashIcon />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="mt-4 flex justify-center gap-4">
            <Button
              type="button"
              onClick={() => handleAddRow('pastries')}
              className="w-32 justify-center gap-4"
            >
              Adicionar Produto
            </Button>

            <Button
              type="button"
              onClick={() => handleAddRow('beverages')}
              className="w-32 justify-center gap-4"
              variant="outline"
            >
              Adicionar Bebida
            </Button>
          </div>

          <div className="mt-4 flex justify-center">
            <Button type="submit" className="w-32 justify-center">
              Finalizar
            </Button>
          </div>
        </form>
      </div>
    </DialogContent>
  )
}
