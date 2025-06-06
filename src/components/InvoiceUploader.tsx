
import { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, X, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const InvoiceUploader = ({ onInvoiceProcessed }) => {
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const generateMockInvoiceData = (fileName) => {
    const mockData = [
      {
        invoiceNumber: "INV-2024-001",
        vendor: "TechCorp Solutions",
        amount: 12500.00,
        taxAmount: 2250.00,
        date: "2024-01-15",
        dueDate: "2024-02-15",
        currency: "USD",
        category: "Software Services"
      },
      {
        invoiceNumber: "INV-2024-002",
        vendor: "Office Supplies Inc",
        amount: 850.75,
        taxAmount: 153.14,
        date: "2024-01-16",
        dueDate: "2024-02-16",
        currency: "USD",
        category: "Office Supplies"
      },
      {
        invoiceNumber: "INV-2024-003",
        vendor: "Marketing Agency Pro",
        amount: 5000.00,
        taxAmount: 900.00,
        date: "2024-01-17",
        dueDate: "2024-02-17",
        currency: "USD",
        category: "Marketing Services"
      }
    ];

    const randomData = mockData[Math.floor(Math.random() * mockData.length)];
    return {
      ...randomData,
      fileName,
      id: Math.random().toString(36).substr(2, 9),
      processedAt: new Date().toISOString(),
      status: Math.random() > 0.1 ? "processed" : "error",
      confidence: (95 + Math.random() * 4).toFixed(1)
    };
  };

  const handleFileUpload = useCallback((uploadedFiles) => {
    const newFiles = Array.from(uploadedFiles).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      status: "pending"
    }));

    setFiles(prev => [...prev, ...newFiles]);
    
    toast({
      title: "Files uploaded successfully",
      description: `${newFiles.length} file(s) ready for processing`,
    });
  }, [toast]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const droppedFiles = e.dataTransfer.files;
    handleFileUpload(droppedFiles);
  }, [handleFileUpload]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const removeFile = (fileId) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const processFiles = async () => {
    if (files.length === 0) {
      toast({
        title: "No files to process",
        description: "Please upload some invoices first",
        variant: "destructive"
      });
      return;
    }

    setProcessing(true);
    setProgress(0);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Simulate OCR processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const invoiceData = generateMockInvoiceData(file.name);
      onInvoiceProcessed(invoiceData);
      
      setProgress(((i + 1) / files.length) * 100);
      
      // Update file status
      setFiles(prev => prev.map(f => 
        f.id === file.id 
          ? { ...f, status: invoiceData.status }
          : f
      ));
    }

    setProcessing(false);
    
    toast({
      title: "Processing complete!",
      description: `Successfully processed ${files.filter(f => f.status === "processed").length} invoices`,
    });

    // Clear files after processing
    setTimeout(() => setFiles([]), 2000);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="h-5 w-5" />
            <span>Upload Invoices</span>
          </CardTitle>
          <CardDescription>
            Drag and drop your invoice files or click to browse. Supports PDF, JPG, PNG formats.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer"
          >
            <input
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => handleFileUpload(e.target.files)}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">
                Drop invoices here or click to upload
              </p>
              <p className="text-sm text-gray-500">
                PDF, JPG, PNG files up to 10MB each
              </p>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* File List */}
      {files.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Files ({files.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {files.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-sm">{file.name}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {file.status === "pending" && (
                      <Badge variant="secondary">Pending</Badge>
                    )}
                    {file.status === "processed" && (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Processed
                      </Badge>
                    )}
                    {file.status === "error" && (
                      <Badge variant="destructive">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Error
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(file.id)}
                      disabled={processing}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Processing Controls */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          <Button
            onClick={processFiles}
            disabled={processing || files.length === 0}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {processing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <FileText className="h-4 w-4 mr-2" />
                Process Invoices
              </>
            )}
          </Button>
          
          <Button variant="outline" disabled={processing}>
            Bulk Upload ZIP
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      {processing && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Processing invoices...</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InvoiceUploader;
