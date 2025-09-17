import '@testing-library/jest-dom';

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  ArrowLeft: () => <span data-testid="arrow-left-icon">ArrowLeft</span>,
  Shield: () => <span data-testid="shield-icon">Shield</span>,
  FileText: () => <span data-testid="file-text-icon">FileText</span>,
  Users: () => <span data-testid="users-icon">Users</span>,
  AlertTriangle: () => <span data-testid="alert-triangle-icon">AlertTriangle</span>,
  Scale: () => <span data-testid="scale-icon">Scale</span>,
  Eye: () => <span data-testid="eye-icon">Eye</span>,
  Lock: () => <span data-testid="lock-icon">Lock</span>,
  Database: () => <span data-testid="database-icon">Database</span>,
  Mail: () => <span data-testid="mail-icon">Mail</span>,
}));

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    };
  },
  useSearchParams() {
    return new URLSearchParams();
  },
  usePathname() {
    return '/';
  },
}));

// Mock Supabase - conditional mock
try {
  require.resolve('../src/lib/supabase');
  jest.mock('../src/lib/supabase', () => ({
    getSupabase: jest.fn(() => ({
      auth: {
        getSession: jest.fn(),
        onAuthStateChange: jest.fn(),
        signInWithPassword: jest.fn(),
        signOut: jest.fn(),
      },
      from: jest.fn(() => ({
        select: jest.fn().mockReturnThis(),
        insert: jest.fn().mockReturnThis(),
        update: jest.fn().mockReturnThis(),
        delete: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn(),
      })),
    })),
    supabaseAdmin: {
      auth: {
        getSession: jest.fn(),
      },
    },
  }));
} catch (e) {
  // Supabase module doesn't exist, skip mocking
}

// Mock environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';