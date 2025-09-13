// Test QR functionality after permission fixes
const test = {
  baseUrl: 'http://localhost:3004',
  
  // Test QR session creation
  async testQRSessionCreation() {
    console.log('🧪 Testing QR Session Creation...');
    
    const testData = {
      courseId: 'TEST-COURSE-001',
      teacherId: 'teacher-test-123',
      teacherName: 'Test Teacher',
      durationMinutes: 30
    };

    try {
      const response = await fetch(`${this.baseUrl}/api/qr/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData)
      });

      const result = await response.json();
      console.log('QR Session Creation Status:', response.status);
      
      if (response.ok) {
        console.log('✅ QR Session created successfully');
        console.log('Session ID:', result.sessionId);
        console.log('QR Code length:', result.qrCode?.length || 0);
        return result.sessionId;
      } else {
        console.log('❌ QR Session creation failed:', result.error);
        return null;
      }
    } catch (error) {
      console.log('❌ Network error:', error.message);
      return null;
    }
  },

  // Test attendance marking
  async testAttendanceMarking(sessionId) {
    if (!sessionId) {
      console.log('⏭️ Skipping attendance test - no session ID');
      return;
    }

    console.log('🧪 Testing Attendance Marking...');
    
    const testData = {
      sessionId: sessionId,
      studentId: 's1', // From seed data
      studentName: 'Michael Johnson'
    };

    try {
      const response = await fetch(`${this.baseUrl}/api/attendance/mark`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData)
      });

      const result = await response.json();
      console.log('Attendance Marking Status:', response.status);
      
      if (response.ok) {
        console.log('✅ Attendance marked successfully');
        console.log('Record ID:', result.id);
      } else {
        console.log('❌ Attendance marking failed:', result.error);
      }
    } catch (error) {
      console.log('❌ Network error:', error.message);
    }
  },

  // Run all tests
  async runAllTests() {
    console.log('🚀 Starting QR Functionality Tests\n');
    
    const sessionId = await this.testQRSessionCreation();
    console.log('');
    await this.testAttendanceMarking(sessionId);
    
    console.log('\n🏁 QR Functionality Tests Complete');
  }
};

// Auto-run tests after a delay to let server start
setTimeout(() => {
  test.runAllTests();
}, 3000);

console.log('⏰ Waiting for server to start...');