import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export function RecentOrders() {
  const orders = [
    {
      id: "ORD-001",
      customer: {
        name: "John Doe",
        email: "john@example.com",
        avatar: "/placeholder-user.jpg",
      },
      status: "completed",
      amount: "$250.00",
      date: "2023-06-01",
    },
    {
      id: "ORD-002",
      customer: {
        name: "Jane Smith",
        email: "jane@example.com",
        avatar: "/placeholder-user.jpg",
      },
      status: "processing",
      amount: "$150.00",
      date: "2023-06-02",
    },
    {
      id: "ORD-003",
      customer: {
        name: "Bob Johnson",
        email: "bob@example.com",
        avatar: "/placeholder-user.jpg",
      },
      status: "pending",
      amount: "$350.00",
      date: "2023-06-03",
    },
    {
      id: "ORD-004",
      customer: {
        name: "Alice Brown",
        email: "alice@example.com",
        avatar: "/placeholder-user.jpg",
      },
      status: "completed",
      amount: "$450.00",
      date: "2023-06-04",
    },
    {
      id: "ORD-005",
      customer: {
        name: "Charlie Wilson",
        email: "charlie@example.com",
        avatar: "/placeholder-user.jpg",
      },
      status: "cancelled",
      amount: "$550.00",
      date: "2023-06-05",
    },
  ]

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order.id} className="flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-8 w-8">
              <AvatarImage src={order.customer.avatar} alt={order.customer.name} />
              <AvatarFallback>
                {order.customer.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium leading-none">{order.customer.name}</p>
              <p className="text-sm text-muted-foreground">{order.id}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Badge
              variant="outline"
              className={
                order.status === "completed"
                  ? "border-green-500 text-green-500"
                  : order.status === "processing"
                    ? "border-blue-500 text-blue-500"
                    : order.status === "pending"
                      ? "border-yellow-500 text-yellow-500"
                      : "border-red-500 text-red-500"
              }
            >
              {order.status}
            </Badge>
            <div className="text-sm font-medium">{order.amount}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

