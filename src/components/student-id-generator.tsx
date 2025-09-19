'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge, CreditCard, Download, Eye, Users } from 'lucide-react';
import type { Student } from '@/lib/types';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { motion } from 'framer-motion';

interface StudentIdGeneratorProps {
  students: Student[];
}

interface StudentIdCardProps {
  student: Student;
  schoolName?: string;
  schoolLogo?: string;
}

const getNeumorphicStyle = (pressed = false, inset = false, size = 'normal') => {
  const shadowSize = size === 'large' ? '12px' : size === 'small' ? '4px' : '8px';
  const shadowBlur = size === 'large' ? '24px' : size === 'small' ? '8px' : '16px';
  
  return {
    background: pressed || inset ? 
      'linear-gradient(145deg, #d0d0d0, #f0f0f0)' : 
      'linear-gradient(145deg, #f0f0f0, #d0d0d0)',
    boxShadow: pressed || inset ?
      `inset ${shadowSize} ${shadowSize} ${shadowBlur} #bebebe, inset -${shadowSize} -${shadowSize} ${shadowBlur} #ffffff` :
      `${shadowSize} ${shadowSize} ${shadowBlur} #bebebe, -${shadowSize} -${shadowSize} ${shadowBlur} #ffffff`
  };
};

const StudentIdCard = ({ student, schoolName = "Your School Name", schoolLogo }: StudentIdCardProps) => {
  return (
    <div className="w-[350px] h-[220px] rounded-xl p-4 text-white shadow-lg relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #4a6fa5 0%, #2c5282 50%, #1e40af 100%)',
        boxShadow: '8px 8px 16px #bebebe, -8px -8px 16px #ffffff'
      }}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12"></div>
      </div>
      
      {/* Header */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs font-medium opacity-90">{schoolName}</div>
          <div 
            className="px-2 py-1 rounded text-xs font-medium"
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)'
            }}
          >
            STUDENT
          </div>
        </div>
        
        {/* Student Photo Placeholder */}
        <div className="flex items-start gap-3">
          <div 
            className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-bold"
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)'
            }}
          >
            {student.name.charAt(0).toUpperCase()}
          </div>
          
          {/* Student Info */}
          <div className="flex-1">
            <h3 className="font-bold text-lg leading-tight">{student.name}</h3>
            <p className="text-sm opacity-90">ID: {student.id}</p>
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

export default function StudentIdGenerator({ students }: StudentIdGeneratorProps) {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const generatePDF = async (student: Student) => {
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
            <StudentIdCard student={student} />
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
      pdf.save(`${student.name.replace(/\s+/g, '_')}_ID_Card.pdf`);

      // Cleanup
      root.unmount();
      document.body.removeChild(tempContainer);
    } catch (error) {
      console.error('Error generating PDF:', error);
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

      for (let i = 0; i < students.length; i++) {
        const student = students[i];
        
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
              <StudentIdCard student={student} />
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

      pdf.save('All_Student_ID_Cards.pdf');
    } catch (error) {
      console.error('Error generating all PDFs:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div 
      className="rounded-2xl p-6"
      style={getNeumorphicStyle()}
    >
      <div className="flex items-center gap-3 mb-6">
        <div
          className="p-3 rounded-xl"
          style={getNeumorphicStyle(false, true, 'small')}
        >
          <CreditCard className="w-6 h-6 text-gray-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-700">Student ID Pass Generator</h3>
      </div>
      
      <div className="space-y-4">
        <div
          className="p-3 rounded-xl mb-4"
          style={getNeumorphicStyle(false, true, 'small')}
        >
          <p className="text-sm text-gray-600">
            Generate professional ID passes for your students. You can create individual cards or batch generate all at once.
          </p>
        </div>

        {students.length === 0 ? (
          <div className="text-center py-8 text-gray-600">
            <div className="p-4 rounded-xl inline-block mb-4" style={getNeumorphicStyle(false, true)}>
              <Users className="h-12 w-12 mx-auto opacity-50" />
            </div>
            <p>No students found. Add students first to generate ID passes.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Batch Actions */}
            <div className="flex gap-3">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  onClick={generateAllPDFs} 
                  disabled={isGenerating}
                  className="flex items-center gap-2 border-none"
                  style={getNeumorphicStyle()}
                >
                  <Download className="h-4 w-4" />
                  {isGenerating ? 'Generating...' : `Download All (${students.length} cards)`}
                </Button>
              </motion.div>
            </div>

            {/* Individual Student Cards */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-700">Individual Student Cards:</h4>
              {students.map((student) => (
                <motion.div 
                  key={student.id} 
                  className="flex items-center justify-between p-4 rounded-xl"
                  style={getNeumorphicStyle(false, true)}
                  whileHover={{ scale: 1.01 }}
                >
                  <div>
                    <p className="font-medium text-gray-700">{student.name}</p>
                    <p className="text-sm text-gray-600">ID: {student.id}</p>
                  </div>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="border-none"
                            style={getNeumorphicStyle()}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Preview
                          </Button>
                        </motion.div>
                      </DialogTrigger>
                      <DialogContent 
                        className="max-w-md p-0 border-none"
                        style={getNeumorphicStyle(false, false, 'large')}
                      >
                        <div className="rounded-3xl p-6">
                          <DialogHeader className="mb-6">
                            <DialogTitle 
                              className="text-xl font-bold"
                              style={{
                                background: 'linear-gradient(145deg, #666666, #888888)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text'
                              }}
                            >
                              ID Card Preview - {student.name}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="flex justify-center p-4">
                            <StudentIdCard student={student} />
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button 
                        size="sm" 
                        onClick={() => generatePDF(student)}
                        disabled={isGenerating}
                        className="border-none"
                        style={getNeumorphicStyle()}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download PDF
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}