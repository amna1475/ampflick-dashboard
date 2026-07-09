import Papa from 'papaparse'

/**
 * Downloads the given orders as a CSV file.
 * Returns true if a file was downloaded, false if there was nothing to export.
 */
export function exportOrdersToCsv(orders, filename = 'ampflick-orders.csv') {
  if (!orders || orders.length === 0) return false

  const csv = Papa.unparse(
    orders.map((o) => ({
      OrderID: o.id,
      Customer: o.customer,
      Email: o.email,
      City: o.city,
      Product: o.product,
      Amount: o.amount,
      Courier: o.courier,
      Status: o.status,
      Payment: o.payment,
      Method: o.method,
      Tracking: o.tracking,
    }))
  )

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
  return true
}