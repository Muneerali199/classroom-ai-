import { NextRequest, NextResponse } from 'next/server'
import { getSupabase, getSupabaseAdmin } from '@/lib/supabase'
import { logger } from '@/lib/logger'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: teacherId } = await params
    const body = await request.json()
    const { newPassword } = body

    if (!newPassword) {
      return NextResponse.json(
        { success: false, error: 'New password is required' },
        { status: 400 }
      )
    }

    // Get the authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json(
        { success: false, error: 'Authorization header required' },
        { status: 401 }
      )
    }

    // Use admin client for server-side operations
    const supabaseAdmin = getSupabaseAdmin()
    
    // Extract and verify the JWT token
    const token = authHeader.replace('Bearer ', '')
    
    // Get user from JWT token
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token)
    if (userError || !user) {
      return NextResponse.json(
        { success: false, error: 'Must be authenticated to reset password' },
        { status: 401 }
      )
    }

    // Verify user is dean
    const userRole = user.user_metadata?.role
    if (userRole !== 'dean') {
      return NextResponse.json(
        { success: false, error: 'Only deans can reset teacher passwords' },
        { status: 403 }
      )
    }

    // Get the teacher to find the auth_user_id
    const { data: teacher, error: getError } = await supabaseAdmin
      .from('teachers')
      .select('*')
      .eq('id', teacherId)
      .single()

    if (getError) {
      if (getError.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Teacher not found' },
          { status: 404 }
        )
      }
      logger.error('Error fetching teacher:', getError)
      return NextResponse.json(
        { success: false, error: `Failed to fetch teacher: ${getError.message}` },
        { status: 500 }
      )
    }

    if (!teacher.auth_user_id) {
      return NextResponse.json(
        { success: false, error: 'Teacher not linked to auth account' },
        { status: 400 }
      )
    }

    // Use admin client to update password
    const { error } = await supabaseAdmin.auth.admin.updateUserById(teacher.auth_user_id, {
      password: newPassword
    })

    if (error) {
      logger.error('Error resetting teacher password:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to reset password' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    logger.error('API password reset failed:', error)
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    )
  }
}