'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@platter/ui/components/card'
import { Button } from '@platter/ui/components/button'
import { Input } from '@platter/ui/components/input'
import { Label } from '@platter/ui/components/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@platter/ui/components/select'
import { Switch } from '@platter/ui/components/switch'
import { toast } from '@platter/ui/components/sonner'
import { createStaff, CreateStaffFormData } from '@/lib/actions/create-staff'

const staffSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Valid email is required" }),
  phone: z.string().optional(),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string().min(6, { message: "Please confirm password" }),
  canManageMenu: z.boolean().default(false),
  canManageOrders: z.boolean().default(false),
  canManageTables: z.boolean().default(false),
  canViewReports: z.boolean().default(false),
  role: z.enum(['STAFF', 'MANAGER', 'ADMIN']).default('STAFF'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof staffSchema>;

export default function CreateStaffPage({ params }: { params: { restaurantId: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      canManageMenu: false,
      canManageOrders: false,
      canManageTables: false,
      canViewReports: false,
      role: 'STAFF',
    }
  })

  const watchRole = watch('role')

  // Auto-set permissions based on role selection
  const handleRoleChange = (value: string) => {
    setValue('role', value as 'STAFF' | 'MANAGER' | 'ADMIN')
    
    if (value === 'ADMIN') {
      setValue('canManageMenu', true)
      setValue('canManageOrders', true)
      setValue('canManageTables', true)
      setValue('canViewReports', true)
    } else if (value === 'MANAGER') {
      setValue('canManageMenu', true)
      setValue('canManageOrders', true)
      setValue('canManageTables', true)
      setValue('canViewReports', true)
    } else {
      // For regular staff, don't auto-assign permissions
      setValue('canManageMenu', false)
      setValue('canManageOrders', false)
      setValue('canManageTables', false)
      setValue('canViewReports', false)
    }
  }

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true)
      
      // Remove confirmPassword before sending to server action
      const { confirmPassword, ...staffData } = data
      
      const result = await createStaff(params.restaurantId, staffData as CreateStaffFormData)
      
      if (result.error) {
        toast.error(result.error)
        return
      }
      
      toast.success('Staff member created successfully')
      router.push('/manage-staff')
      router.refresh()
    } catch (error) {
      console.error(error)
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Create Staff Member</CardTitle>
          <CardDescription>
            Add a new staff member with login credentials
          </CardDescription>
        </CardHeader>
        {/* <form */}
        <form  onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" {...register('name')} />
                  {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" {...register('email')} />
                  {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone (Optional)</Label>
                  <Input id="phone" {...register('phone')} />
                  {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
                </div>              
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" {...register('password')} />
                  {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input id="confirmPassword" type="password" {...register('confirmPassword')} />
                  {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select 
                  onValueChange={handleRoleChange} 
                  defaultValue={watchRole}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="STAFF">Staff</SelectItem>
                    <SelectItem value="MANAGER">Manager</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-base">Permissions</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="canManageMenu"
                      checked={watch('canManageMenu')}
                      onCheckedChange={(checked) => setValue('canManageMenu', checked)}
                    />
                    <Label htmlFor="canManageMenu">Manage Menu</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="canManageOrders"
                      checked={watch('canManageOrders')}
                      onCheckedChange={(checked) => setValue('canManageOrders', checked)}
                    />
                    <Label htmlFor="canManageOrders">Manage Orders</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="canManageTables"
                      checked={watch('canManageTables')}
                      onCheckedChange={(checked) => setValue('canManageTables', checked)}
                    />
                    <Label htmlFor="canManageTables">Manage Tables</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="canViewReports"
                      checked={watch('canViewReports')}
                      onCheckedChange={(checked) => setValue('canViewReports', checked)}
                    />
                    <Label htmlFor="canViewReports">View Reports</Label>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => router.push('/dashboard/staff')}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Staff Member'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}