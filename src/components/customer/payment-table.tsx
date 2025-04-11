import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CreditCard, Download } from "lucide-react"

// Mock data
const payments = [
  {
    id: "PAY-8752",
    date: "Jun 12, 2023",
    amount: "$156.99",
    method: "Visa •••• 4242",
    status: "Completed",
  },
  {
    id: "PAY-8523",
    date: "May 27, 2023",
    amount: "$49.99",
    method: "Visa •••• 4242",
    status: "Completed",
  },
  {
    id: "PAY-8231",
    date: "Apr 18, 2023",
    amount: "$212.50",
    method: "PayPal",
    status: "Completed",
  },
  {
    id: "PAY-7984",
    date: "Mar 02, 2023",
    amount: "$89.99",
    method: "Visa •••• 4242",
    status: "Completed",
  },
  {
    id: "PAY-7521",
    date: "Feb 14, 2023",
    amount: "$175.95",
    method: "Visa •••• 4242",
    status: "Completed",
  },
]

export default function PaymentsTable() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Payment History</h3>
        <Button variant="outline" size="sm">
          View All Payments
        </Button>
      </div>

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Payment ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Receipt</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell className="font-medium">{payment.id}</TableCell>
                <TableCell>{payment.date}</TableCell>
                <TableCell>{payment.amount}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-gray-400" />
                    <span>{payment.method}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      payment.status === "Completed"
                        ? "text-green-600 bg-green-50"
                        : payment.status === "Pending"
                          ? "text-yellow-600 bg-yellow-50"
                          : "text-red-600 bg-red-50"
                    }
                  >
                    {payment.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Receipt
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

