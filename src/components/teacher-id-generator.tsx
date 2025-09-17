'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge, CreditCard, Download, Eye, Users } from 'lucide-react';
import type { Teacher } from '@/lib/types';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { logger } from '@/lib/logger';

interface TeacherIdGeneratorProps {
  teachers: Teacher[];
}

interface TeacherIdCardProps {
  teacher: Teacher;
  schoolName?: string;
  schoolLogo?: string;
}

const TeacherIdCard = ({ teacher, schoolName = "Your Institution" }: TeacherIdCardProps) => {
  return (
    <div className="w-[350px] h-[220px] bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg p-4 text-white shadow-lg relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12"></div>
      </div>
      
      {/* Header */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs font-medium opacity-90">{schoolName}</div>
          <Badge className="bg-white text-purple-800 text-xs">FACULTY</Badge>
        </div>
        
        {/* Teacher Photo Placeholder */}
        <div className="flex items-start gap-3">
          <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center text-2xl font-bold">
            {teacher.name.charAt(0).toUpperCase()}
          </div>
          
          {/* Teacher Info */}
          <div className="flex-1">
            <h3 className="font-bold text-lg leading-tight">{teacher.name}</h3>
            <p className="text-sm opacity-90">ID: {teacher.teacher_id || teacher.id}</p>
            <p className="text-xs opacity-90">{teacher.department}</p>
            {teacher.subject && <p className="text-xs opacity-75">{teacher.subject}</p>}
            <p className="text-xs opacity-75 mt-1">Valid: {new Date().getFullYear()}-{new Date().getFullYear() + 1}</p>
          </div>
        </div>
        
        {/* Footer */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center justify-between text-xs opacity-75">
            <span>Emergency: (555) 123-4567</span>
            <CreditCard className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default function TeacherIdGenerator({ teachers }: TeacherIdGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = async (teacher: Teacher) => {
    setIsGenerating(true);
    try {
      // Create a temporary container for the ID card
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '-9999px';
      document.body.appendChild(tempContainer);

      // Render the card in the temporary container
      const { createRoot } = await import('react-dom/client');
      const root = createRoot(tempContainer);
      
      await new Promise<void>((resolve) => {
        root.render(
          <div style={{ padding: '20px', backgroundColor: 'white' }}>
            <TeacherIdCard teacher={teacher} />
          </div>
        );
        setTimeout(resolve, 500); // Give time for rendering
      });

      // Capture the card as canvas
      const canvas = await html2canvas(tempContainer.firstChild as HTMLElement, {
        backgroundColor: 'white',
        scale: 2,
        useCORS: true,
      });

      // Create PDF
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [85.6, 53.98], // Standard credit card size
      });

      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, 0, 85.6, 53.98);
      
      // Download the PDF
      pdf.save(`${teacher.name.replace(/\s+/g, '_')}_Faculty_ID.pdf`);

      // Cleanup
      root.unmount();
      document.body.removeChild(tempContainer);
    } catch (error) {
      logger.error('Error generating PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateAllPDFs = async () => {
    setIsGenerating(true);
    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      for (let i = 0; i < teachers.length; i++) {
        const teacher = teachers[i];
        
        // Create temporary container for each card
        const tempContainer = document.createElement('div');
        tempContainer.style.position = 'absolute';
        tempContainer.style.left = '-9999px';
        tempContainer.style.top = '-9999px';
        document.body.appendChild(tempContainer);

        const { createRoot } = await import('react-dom/client');
        const root = createRoot(tempContainer);
        
        await new Promise<void>((resolve) => {
          root.render(
            <div style={{ padding: '20px', backgroundColor: 'white' }}>
              <TeacherIdCard teacher={teacher} />
            </div>
          );
          setTimeout(resolve, 500);
        });

        const canvas = await html2canvas(tempContainer.firstChild as HTMLElement, {
          backgroundColor: 'white',
          scale: 2,
          useCORS: true,
        });

        if (i > 0) pdf.addPage();
        
        const imgData = canvas.toDataURL('image/png');
        // Center the card on A4 page
        const cardWidth = 85.6;
        const cardHeight = 53.98;
        const pageWidth = 210;
        const pageHeight = 297;
        const x = (pageWidth - cardWidth) / 2;
        const y = (pageHeight - cardHeight) / 2;
        
        pdf.addImage(imgData, 'PNG', x, y, cardWidth, cardHeight);

        // Cleanup
        root.unmount();
        document.body.removeChild(tempContainer);
      }

      pdf.save('All_Faculty_ID_Cards.pdf');
    } catch (error) {
      logger.error('Error generating all PDFs:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Teacher ID Pass Generator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Generate professional faculty ID passes for your teaching staff. Create individual cards or batch generate all at once.
          </p>

          {teachers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No teachers found. Add teachers first to generate ID passes.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Batch Actions */}
              <div className="flex gap-2">
                <Button 
                  onClick={generateAllPDFs} 
                  disabled={isGenerating}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  {isGenerating ? 'Generating...' : `Download All (${teachers.length} cards)`}
                </Button>
              </div>

              {/* Individual Teacher Cards */}
              <div className="grid gap-2">
                <h4 className="font-medium">Individual Faculty Cards:</h4>
                {teachers.map((teacher) => (
                  <div key={teacher.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{teacher.name}</p>
                      <p className="text-sm text-muted-foreground">
                        ID: {teacher.teacher_id || teacher.id} • {teacher.department} • {teacher.employment_status}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            Preview
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>Faculty ID Preview - {teacher.name}</DialogTitle>
                          </DialogHeader>
                          <div className="flex justify-center p-4">
                            <TeacherIdCard teacher={teacher} />
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button 
                        size="sm" 
                        onClick={() => generatePDF(teacher)}
                        disabled={isGenerating}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download PDF
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}