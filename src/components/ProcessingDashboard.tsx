
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, AlertCircle, Download, FileText, DollarSign, Calendar, Building } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ProcessingDashboard = ({ invoices }) => {
  const { toast } = useToast();

  const processedInvoices = invoices.filter(inv => inv.status === "processed");
  const errorInvoices = invoices.filter(inv => inv.status === "error");
  const totalAmount = processedInvoices.reduce((sum, inv) => sum + inv.amount, 0);

  const exportToCSV = () => {
    if (processedInvoices.length === 0) {
      toast({
        title: "No data to export",
        description: "Process some invoices first",
        variant: "destructive"
      });
      return;
    }

    const headers = ["Invoice Number", "Vendor", "Amount", "Tax Amount", "Date", "Due Date", "Currency", "Category", "Confidence"];
    const csvContent = [
      headers.join(","),
      ...processedInvoices.map(inv => [
        inv.invoiceNumber,
        `"${inv.vendor}"`,
        inv.amount,
        inv.taxAmount,
        inv.date,
        inv.dueDate,
        inv.currency,
        `"${inv.category}"`,
        inv.confidence + "%"
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `invoice_data_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export successful",
      description: `Exported ${processedInvoices.length} invoices to CSV`,
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (invoices.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No invoices processed yet</h3>
            <p className="text-gray-500">Upload and process some invoices to see them here</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{invoices.length}</p>
                <p className="text-sm text-gray-600">Total Invoices</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-green-600">{processedInvoices.length}</p>
                <p className="text-sm text-gray-600">Processed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-2xl font-bold text-red-600">{errorInvoices.length}</p>
                <p className="text-sm text-gray-600">Errors</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{formatCurrency(totalAmount)}</p>
                <p className="text-sm text-gray-600">Total Value</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Export & Integration</CardTitle>
          <CardDescription>
            Export processed data or integrate with your ERP system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button onClick={exportToCSV} disabled={processedInvoices.length === 0}>
              <Download className="h-4 w-4 mr-2" />
              Export to CSV
            </Button>
            <Button variant="outline">
              <Building className="h-4 w-4 mr-2" />
              Export to ERP
            </Button>
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Invoice Table */}
      <Card>
        <CardHeader>
          <CardTitle>Processed Invoices</CardTitle>
          <CardDescription>
            Detailed view of all processed invoice data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Tax</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Confidence</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                    <TableCell>{invoice.vendor}</TableCell>
                    <TableCell>{formatCurrency(invoice.amount)}</TableCell>
                    <TableCell>{formatCurrency(invoice.taxAmount)}</TableCell>
                    <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{invoice.category}</Badge>
                    </TableCell>
                    <TableCell>{invoice.confidence}%</TableCell>
                    <TableCell>
                      {invoice.status === "processed" ? (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Processed
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Error
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProcessingDashboard;
