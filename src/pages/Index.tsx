
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, FileText, CheckCircle, AlertCircle, BarChart3, Download, Zap, Shield, Clock, Users } from "lucide-react";
import InvoiceUploader from "@/components/InvoiceUploader";
import ProcessingDashboard from "@/components/ProcessingDashboard";
import InvoiceHistory from "@/components/InvoiceHistory";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";

const Index = () => {
  const [activeTab, setActiveTab] = useState("upload");
  const [processedInvoices, setProcessedInvoices] = useState([]);

  const features = [
    {
      icon: <FileText className="h-8 w-8 text-blue-600" />,
      title: "OCR Data Extraction",
      description: "Extract data from PDF, JPG, PNG invoices with 99.5% accuracy"
    },
    {
      icon: <Upload className="h-8 w-8 text-blue-600" />,
      title: "Bulk Upload",
      description: "Process multiple invoices at once with ZIP file support"
    },
    {
      icon: <CheckCircle className="h-8 w-8 text-blue-600" />,
      title: "Auto-Categorization",
      description: "Automatically categorize invoice fields and detect errors"
    },
    {
      icon: <Download className="h-8 w-8 text-blue-600" />,
      title: "ERP Integration",
      description: "Export to CSV or integrate with your existing ERP system"
    }
  ];

  const stats = [
    { number: "80%", label: "Faster Processing" },
    { number: "99.5%", label: "Accuracy Rate" },
    { number: "500+", label: "Companies Trust Us" },
    { number: "1M+", label: "Invoices Processed" }
  ];

  const handleInvoiceProcessed = (invoice) => {
    setProcessedInvoices(prev => [invoice, ...prev]);
    setActiveTab("dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">InvoiceAI Pro</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <Zap className="h-3 w-3 mr-1" />
                Live Demo
              </Badge>
              <Button variant="outline">Contact Sales</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            AI-Powered Invoice Processing
            <span className="text-blue-600"> Made Simple</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Transform your manual invoice processing with our smart OCR technology. 
            Extract, validate, and export invoice data 80% faster with 99.5% accuracy.
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto mb-4">{feature.icon}</div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Main Application */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <Card className="shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
            <CardTitle className="text-2xl flex items-center">
              <Shield className="h-6 w-6 mr-2" />
              Invoice Processing Platform
            </CardTitle>
            <CardDescription className="text-blue-100">
              Upload, process, and manage your invoices with enterprise-grade AI
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="upload" className="flex items-center space-x-2">
                  <Upload className="h-4 w-4" />
                  <span>Upload</span>
                </TabsTrigger>
                <TabsTrigger value="dashboard" className="flex items-center space-x-2">
                  <BarChart3 className="h-4 w-4" />
                  <span>Dashboard</span>
                </TabsTrigger>
                <TabsTrigger value="history" className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>History</span>
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>Analytics</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upload">
                <InvoiceUploader onInvoiceProcessed={handleInvoiceProcessed} />
              </TabsContent>

              <TabsContent value="dashboard">
                <ProcessingDashboard invoices={processedInvoices} />
              </TabsContent>

              <TabsContent value="history">
                <InvoiceHistory invoices={processedInvoices} />
              </TabsContent>

              <TabsContent value="analytics">
                <AnalyticsDashboard invoices={processedInvoices} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Invoice Processing?</h3>
          <p className="text-gray-300 mb-6">Join 500+ companies already using InvoiceAI Pro</p>
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
            Start Free Trial
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default Index;
