'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AuthService } from '@/lib/auth';
import { useAuth } from '@/hooks/use-auth';
import { Loader2, TestTube, CheckCircle, XCircle } from 'lucide-react';

interface TestResult {
  test: string;
  status: 'pending' | 'success' | 'error';
  message: string;
}

export default function UserManagementTest() {
  const { user } = useAuth();
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);

  const updateResult = (test: string, status: 'success' | 'error', message: string) => {
    setResults(prev => {
      const newResults = prev.filter(r => r.test !== test);
      return [...newResults, { test, status, message }];
    });
  };

  const runTests = async () => {
    if (!user) {
      alert('Please log in to run tests');
      return;
    }

    setIsRunning(true);
    setResults([]);

    const tests = [
      { name: 'Role-based Student Creation', role: 'student' },
      { name: 'Role-based Teacher Creation', role: 'teacher' },
      { name: 'Role-based Dean Creation', role: 'dean' }
    ];

    for (const test of tests) {
      try {
        updateResult(test.name, 'pending', 'Testing...');
        
        const result = await AuthService.createUser({
          email: `test-${test.role}-${Date.now()}@example.com`,
          password: 'TestPass123!',
          displayName: `Test ${test.role}`,
          role: test.role as 'teacher' | 'dean' | 'student'
        });

        if (result.success) {
          updateResult(test.name, 'success', `✅ ${test.role} creation allowed`);
        } else {
          const expectedError = (user.role === 'teacher' && test.role !== 'student');
          if (expectedError && result.error?.includes('can only create student')) {
            updateResult(test.name, 'success', `✅ Correctly blocked: ${result.error}`);
          } else {
            updateResult(test.name, 'error', `❌ ${result.error}`);
          }
        }
      } catch (error: any) {
        updateResult(test.name, 'error', `❌ Error: ${error.message}`);
      }

      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setIsRunning(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TestTube className="h-5 w-5" />
          User Management Access Control Tests
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertTitle>Current User</AlertTitle>
          <AlertDescription>
            Role: <strong>{user?.role || 'Unknown'}</strong> | 
            Email: <strong>{user?.email || 'Unknown'}</strong>
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <h4 className="font-semibold">Expected Behavior:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• <strong>Dean:</strong> Can create teachers, students, and deans</li>
            <li>• <strong>Teacher:</strong> Can create students only</li>
            <li>• <strong>Student:</strong> Cannot create any accounts</li>
          </ul>
        </div>

        <Button 
          onClick={runTests} 
          disabled={isRunning || !user}
          className="w-full"
        >
          {isRunning ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Running Tests...
            </>
          ) : (
            <>
              <TestTube className="mr-2 h-4 w-4" />
              Run Access Control Tests
            </>
          )}
        </Button>

        {results.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold">Test Results:</h4>
            {results.map((result, index) => (
              <div key={index} className="flex items-center gap-2 p-2 rounded bg-muted/50">
                {getStatusIcon(result.status)}
                <span className="font-medium">{result.test}:</span>
                <span className="text-sm">{result.message}</span>
              </div>
            ))}
          </div>
        )}

        <Alert>
          <AlertTitle>Note</AlertTitle>
          <AlertDescription>
            These tests will create actual user accounts. Run in a development environment only.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}