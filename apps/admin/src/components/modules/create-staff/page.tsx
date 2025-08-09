"use client";

import {
  type CreateStaffFormData,
  createStaff,
} from "@/lib/actions/create-staff";
import { zodResolver } from "@hookform/resolvers/zod";
import { Badge } from "@platter/ui/components/badge";
import { Button } from "@platter/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@platter/ui/components/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@platter/ui/components/command";
import { Input } from "@platter/ui/components/input";
import { Label } from "@platter/ui/components/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@platter/ui/components/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@platter/ui/components/select";
import { toast } from "@platter/ui/components/sonner";
import { Switch } from "@platter/ui/components/switch";
import { cn } from "@platter/ui/lib/utils";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const staffSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Valid email is required" }),
  phone: z.string().optional(),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  position: z.string().optional(),
  assignedTableIds: z.array(z.string()).optional(),
  assignedServicePointId: z.string().optional(),
  canManageMenu: z.boolean().default(false),
  canManageOrders: z.boolean().default(false),
  canManageTables: z.boolean().default(false),
  canViewReports: z.boolean().default(false),
  staffRole: z.enum(["STAFF", "ADMIN", "MANAGER", "OPERATOR"]).default("STAFF"),
});

type FormData = z.infer<typeof staffSchema>;

interface Table {
  id: string;
  number: string;
  capacity: number;
  isAvailable: boolean;
}

interface ServicePoint {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
}

export default function CreateStaffPage({
  params,
}: { params: { restaurantId: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [tables, setTables] = useState<Table[]>([]);
  const [servicePoints, setServicePoints] = useState<ServicePoint[]>([]);
  const [selectedTables, setSelectedTables] = useState<string[]>([]);
  const [selectedServicePoint, setSelectedServicePoint] = useState<string>("");
  const [tablePopoverOpen, setTablePopoverOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      position: "",
      assignedTableIds: [],
      assignedServicePointId: "",
      canManageMenu: false,
      canManageOrders: false,
      canManageTables: false,
      canViewReports: false,
      staffRole: "STAFF",
    },
  });

  const watchStaffRole = watch("staffRole");

  // Fetch tables and service points on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tablesResponse, servicePointsResponse] = await Promise.all([
          fetch(`/api/tables?userId=${params.restaurantId}`),
          fetch(`/api/service-points?userId=${params.restaurantId}`),
        ]);

        if (tablesResponse.ok) {
          const tablesData = await tablesResponse.json();
          setTables(tablesData);
        }

        if (servicePointsResponse.ok) {
          const servicePointsData = await servicePointsResponse.json();
          setServicePoints(servicePointsData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load tables and service points");
      }
    };

    fetchData();
  }, [params.restaurantId]);

  // Auto-set permissions based on role selection
  const handleRoleChange = (value: string) => {
    setValue("staffRole", value as "STAFF" | "ADMIN" | "MANAGER" | "OPERATOR");

    if (value === "ADMIN") {
      setValue("canManageMenu", true);
      setValue("canManageOrders", true);
      setValue("canManageTables", true);
      setValue("canViewReports", true);
    } else if (value === "MANAGER") {
      setValue("canManageMenu", true);
      setValue("canManageOrders", true);
      setValue("canManageTables", true);
      setValue("canViewReports", true);
    } else if (value === "OPERATOR") {
      setValue("canManageOrders", true);
      setValue("canManageMenu", false);
      setValue("canManageTables", false);
      setValue("canViewReports", false);
    } else {
      // For regular staff, don't auto-assign permissions
      setValue("canManageMenu", false);
      setValue("canManageOrders", false);
      setValue("canManageTables", false);
      setValue("canViewReports", false);
    }
  };

  // Handle table selection
  const handleTableSelect = (tableId: string) => {
    const newSelectedTables = selectedTables.includes(tableId)
      ? selectedTables.filter((id) => id !== tableId)
      : [...selectedTables, tableId];

    setSelectedTables(newSelectedTables);
    setValue("assignedTableIds", newSelectedTables);
  };

  // Handle table removal
  const handleTableRemove = (tableId: string) => {
    const newSelectedTables = selectedTables.filter((id) => id !== tableId);
    setSelectedTables(newSelectedTables);
    setValue("assignedTableIds", newSelectedTables);
  };

  // Handle service point selection
  const handleServicePointSelect = (servicePointId: string) => {
    setSelectedServicePoint(servicePointId);
    setValue("assignedServicePointId", servicePointId);
  };

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);

      const result = await createStaff(
        params.restaurantId,
        data as CreateStaffFormData,
      );

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Staff member created successfully");
      router.push("/manage-staff");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Get selected table names for display
  const selectedTableNames = selectedTables
    .map((tableId) => tables.find((t) => t.id === tableId)?.number)
    .filter(Boolean)
    .join(", ");

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Create Staff Member</CardTitle>
          <CardDescription>
            Add a new staff member with login credentials and role assignment
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" {...register("name")} />
                  {errors.name && (
                    <p className="text-sm text-red-500">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" {...register("email")} />
                  {errors.email && (
                    <p className="text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone (Optional)</Label>
                  <Input id="phone" {...register("phone")} />
                  {errors.phone && (
                    <p className="text-sm text-red-500">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">Position (Optional)</Label>
                  <Input
                    id="position"
                    {...register("position")}
                    placeholder="e.g., Head Chef, Server, Cashier"
                  />
                  {errors.position && (
                    <p className="text-sm text-red-500">
                      {errors.position.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="staffRole">Role</Label>
                <Select
                  onValueChange={handleRoleChange}
                  defaultValue={watchStaffRole}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="STAFF">Staff</SelectItem>
                    <SelectItem value="MANAGER">Manager</SelectItem>
                    <SelectItem value="OPERATOR">Operator</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Table Assignment Section */}
              <div className="space-y-2">
                <Label>Assign Tables (Optional)</Label>
                <Popover
                  open={tablePopoverOpen}
                  onOpenChange={setTablePopoverOpen}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={tablePopoverOpen}
                      className="w-full justify-between"
                    >
                      {selectedTables.length > 0
                        ? `${selectedTables.length} table(s) selected`
                        : "Select tables..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    <Command {...({} as any)}>
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      <CommandInput
                        placeholder="Search tables..."
                        {...({} as any)}
                      />
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      <CommandList {...({} as any)}>
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        <CommandEmpty {...({} as any)}>
                          No tables found.
                        </CommandEmpty>
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        <CommandGroup {...({} as any)}>
                          {tables.map((table) => (
                            <CommandItem
                              key={table.id}
                              value={`table ${table.number}`}
                              onSelect={() => handleTableSelect(table.id)}
                              {...({} as any)}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedTables.includes(table.id)
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                              Table {table.number} (Capacity: {table.capacity})
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

                {/* Selected Tables Display */}
                {selectedTables.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedTables.map((tableId) => {
                      const table = tables.find((t) => t.id === tableId);
                      return (
                        <Badge
                          key={tableId}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          Table {table?.number}
                          <button
                            type="button"
                            onClick={() => handleTableRemove(tableId)}
                            className="ml-1 hover:text-red-600"
                          >
                            <X size={12} />
                          </button>
                        </Badge>
                      );
                    })}
                  </div>
                )}

                {selectedTables.length > 0 && (
                  <p className="text-sm text-gray-600">
                    Selected: {selectedTableNames}
                  </p>
                )}
              </div>

              {/* Service Point Assignment for Operators */}
              {watchStaffRole === "OPERATOR" && (
                <div className="space-y-2">
                  <Label>Assign Service Point</Label>
                  <Select
                    onValueChange={handleServicePointSelect}
                    value={selectedServicePoint}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a service point" />
                    </SelectTrigger>
                    <SelectContent>
                      {servicePoints.map((servicePoint) => (
                        <SelectItem
                          key={servicePoint.id}
                          value={servicePoint.id}
                        >
                          {servicePoint.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedServicePoint && (
                    <p className="text-sm text-gray-600">
                      Selected:{" "}
                      {
                        servicePoints.find(
                          (sp) => sp.id === selectedServicePoint,
                        )?.name
                      }
                    </p>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-base">Permissions</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="canManageMenu"
                      checked={watch("canManageMenu")}
                      onCheckedChange={(checked) =>
                        setValue("canManageMenu", checked)
                      }
                    />
                    <Label htmlFor="canManageMenu">Manage Menu</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="canManageOrders"
                      checked={watch("canManageOrders")}
                      onCheckedChange={(checked) =>
                        setValue("canManageOrders", checked)
                      }
                    />
                    <Label htmlFor="canManageOrders">Manage Orders</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="canManageTables"
                      checked={watch("canManageTables")}
                      onCheckedChange={(checked) =>
                        setValue("canManageTables", checked)
                      }
                    />
                    <Label htmlFor="canManageTables">Manage Tables</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="canViewReports"
                      checked={watch("canViewReports")}
                      onCheckedChange={(checked) =>
                        setValue("canViewReports", checked)
                      }
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
              onClick={() => router.push("/manage-staff")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Staff Member"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
