
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, DollarSign, Clock, Percent } from "lucide-react";

const AnalyticsDashboard = ({ invoices }) => {
  if (invoices.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No analytics data</h3>
            <p className="text-gray-500">Process some invoices to see analytics</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Prepare data for charts
  const monthlyData = invoices.reduce((acc, invoice) => {
    const month = new Date(invoice.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    if (!acc[month]) {
      acc[month] = { month, count: 0, amount: 0 };
    }
    acc[month].count += 1;
    acc[month].amount += invoice.amount;
    return acc;
  }, {});

  const monthlyChartData = Object.values(monthlyData);

  const categoryData = invoices.reduce((acc, invoice) => {
    if (!acc[invoice.category]) {
      acc[invoice.category] = { name: invoice.category, value: 0, count: 0 };
    }
    acc[invoice.category].value += invoice.amount;
    acc[invoice.category].count += 1;
    return acc;
  }, {});

  const categoryChartData = Object.values(categoryData);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact'
    }).format(value);
  };

  const totalAmount = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const avgAmount = totalAmount / invoices.length;
  const avgConfidence = invoices.reduce((sum, inv) => sum + parseFloat(inv.confidence), 0) / invoices.length;
  const successRate = (invoices.filter(inv => inv.status === "processed").length / invoices.length) * 100;

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{formatCurrency(totalAmount)}</p>
                <p className="text-sm text-gray-600">Total Value</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{formatCurrency(avgAmount)}</p>
                <p className="text-sm text-gray-600">Avg Amount</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Percent className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{avgConfidence.toFixed(1)}%</p>
                <p className="text-sm text-gray-600">Avg Confidence</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{successRate.toFixed(1)}%</p>
                <p className="text-sm text-gray-600">Success Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Invoice Volume</CardTitle>
            <CardDescription>Number of invoices processed per month</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly Amount Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Amount Trends</CardTitle>
            <CardDescription>Total invoice amounts per month</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Line type="monotone" dataKey="amount" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Category Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Category Distribution</CardTitle>
          <CardDescription>Invoice amounts by category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>

            <div className="space-y-4">
              <h4 className="font-medium">Category Breakdown</h4>
              {categoryChartData.map((category, index) => (
                <div key={category.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <span className="font-medium">{category.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(category.value)}</p>
                    <p className="text-sm text-gray-500">{category.count} invoices</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;
