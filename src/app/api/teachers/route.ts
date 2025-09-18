import { NextRequest, NextResponse } from 'next/server'
import { getSupabase, getSupabaseAdmin } from '@/lib/supabase'
import { logger } from '@/lib/logger'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { teacherData } = body

    if (!teacherData) {
      return NextResponse.json(
        { success: false, error: 'Teacher data is required' },
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
        { success: false, error: 'Must be authenticated to create teacher' },
        { status: 401 }
      )
    }

    // Verify user is dean
    const userRole = user.user_metadata?.role
    if (userRole !== 'dean') {
      return NextResponse.json(
        { success: false, error: 'Only deans can create teacher accounts' },
        { status: 403 }
      )
    }

    // Create auth user directly using admin client
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: teacherData.email,
      password: teacherData.password,
      email_confirm: true,
      user_metadata: {
        role: 'teacher',
        displayName: teacherData.name,
        full_name: teacherData.name
      }
    })

    if (authError || !authUser.user) {
      logger.error('Error creating teacher auth user:', authError)
      return NextResponse.json(
        { success: false, error: authError?.message || 'Failed to create teacher auth account' },
        { status: 500 }
      )
    }

    // Create teacher record in teachers table
    const teacherId = authUser.user.id
    
    const { data: teacherRecord, error: teacherError } = await supabaseAdmin
      .from('teachers')
      .insert({
        id: teacherId,
        name: teacherData.name,
        email: teacherData.email,
        auth_user_id: authUser.user.id,
        created_by: user.id,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (teacherError) {
      // Clean up auth user if teacher record creation fails
      await supabaseAdmin.auth.admin.deleteUser(authUser.user.id)
      logger.error('Error creating teacher record:', teacherError)
      return NextResponse.json(
        { success: false, error: 'Failed to create teacher record' },
        { status: 500 }
      )
    }

    // Update the teacher record with additional details
    const updateData: any = {
      teacher_id: teacherData.teacher_id,
      department: teacherData.department,
      subject: teacherData.subject,
      phone_number: teacherData.phone_number,
      address: teacherData.address,
      date_of_birth: teacherData.date_of_birth,
      hire_date: teacherData.hire_date,
      employment_status: teacherData.employment_status,
      emergency_contact_name: teacherData.emergency_contact_name,
      emergency_contact_phone: teacherData.emergency_contact_phone,
      qualifications: teacherData.qualifications,
      notes: teacherData.notes,
    }

    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key]
      }
    })

    if (Object.keys(updateData).length > 0) {
      const { data: updatedTeacher, error: updateError } = await supabaseAdmin
        .from('teachers')
        .update(updateData)
        .eq('id', teacherId)
        .select()
        .single()

      if (updateError) {
        logger.error('Error updating teacher details:', updateError)
        return NextResponse.json(
          { success: false, error: 'Teacher created but failed to update details' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        teacher: { ...updatedTeacher, attendance: [] }
      })
    }

    // Get the created teacher
    const { data: teacher, error: getError } = await supabaseAdmin
      .from('teachers')
      .select('*')
      .eq('id', teacherId)
      .single()

    if (getError) {
      logger.error('Error fetching created teacher:', getError)
      return NextResponse.json(
        { success: false, error: 'Teacher created but failed to fetch details' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      teacher: { ...teacher, attendance: [] }
    })

  } catch (error) {
    logger.error('API teacher creation failed:', error)
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { teacherId, updates } = body

    if (!teacherId) {
      return NextResponse.json(
        { success: false, error: 'Teacher ID is required' },
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
        { success: false, error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    // Verify user is dean
    const userRole = user.user_metadata?.role
    if (userRole !== 'dean') {
      return NextResponse.json(
        { success: false, error: 'Only deans can update teacher profiles' },
        { status: 403 }
      )
    }

    const updatedData = {
      ...updates,
      updated_at: new Date().toISOString(),
    }

    // Remove undefined values
    Object.keys(updatedData).forEach(key => {
      if (updatedData[key] === undefined) {
        delete updatedData[key]
      }
    })

    const { data: teacher, error } = await supabaseAdmin
      .from('teachers')
      .update(updatedData)
      .eq('id', teacherId)
      .select()
      .single()

    if (error) {
      logger.error('Error updating teacher:', error)
      return NextResponse.json(
        { success: false, error: `Failed to update teacher: ${error.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      teacher: { ...teacher, attendance: [] }
    })

  } catch (error) {
    logger.error('API teacher update failed:', error)
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const teacherId = url.searchParams.get('id')

    if (!teacherId) {
      return NextResponse.json(
        { success: false, error: 'Teacher ID is required' },
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
        { success: false, error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    // Verify user is dean
    const userRole = user.user_metadata?.role
    if (userRole !== 'dean') {
      return NextResponse.json(
        { success: false, error: 'Only deans can delete teachers' },
        { status: 403 }
      )
    }

    // First get the teacher to find the auth_user_id
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

    // Delete the auth user (this will cascade delete the teacher record)
    if (teacher.auth_user_id) {
      const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(teacher.auth_user_id)

      if (authError) {
        logger.error('Error deleting teacher auth account:', authError)
        return NextResponse.json(
          { success: false, error: 'Failed to delete teacher account' },
          { status: 500 }
        )
      }
    } else {
      // Fallback: delete teacher record directly if no auth_user_id
      const { error } = await supabaseAdmin
        .from('teachers')
        .delete()
        .eq('id', teacherId)

      if (error) {
        logger.error('Error deleting teacher:', error)
        return NextResponse.json(
          { success: false, error: `Failed to delete teacher: ${error.message}` },
          { status: 500 }
        )
      }
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    logger.error('API teacher deletion failed:', error)
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
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
        { success: false, error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    // Get teachers using admin client
    const { data: teachers, error } = await supabaseAdmin
      .from('teachers')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      logger.error('Error fetching teachers:', error)
      return NextResponse.json(
        { success: false, error: `Failed to fetch teachers: ${error.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      teachers: teachers?.map(teacher => ({
        ...teacher,
        attendance: []
      })) || []
    })

  } catch (error) {
    logger.error('API teacher fetch failed:', error)
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    )
  }
}