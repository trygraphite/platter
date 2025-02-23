"use client";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@platter/ui/components/card";
import { Input } from "@platter/ui/components/input";
import { Button } from "@platter/ui/components/button";
import {
  requestToJoinLocation,
  leaveLocation,
  getLocations,
} from "@/lib/actions/location-actions";
import { toast } from "@platter/ui/components/sonner";
import { Badge } from "@platter/ui/components/badge";
import { getCurrentUserDetails } from "@/lib/actions/get-user";

export interface Location {
  id: string;
  name: string;
  address: string;
  joinRequests?: Array<{
    userId: string;
    status: string;
  }>;
}

export function LocationUser({
  initialLocations,
}: { initialLocations: Location[] }) {
  const [search, setSearch] = useState("");
  const [locations, setLocations] = useState(initialLocations);
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    locationId?: string | null;
  } | null>(null);

  // Fetch current user data
  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getCurrentUserDetails();
      setCurrentUser(userData);
    };
    fetchUser();
  }, []); // Empty dependency array = run once on mount

  const handleJoinRequest = async (locationId: string) => {
    if (!currentUser) {
      toast.error("Authentication required!");
      return;
    }

    if (currentUser.locationId) {
      toast.error("You must leave your current location first");
      return;
    }

    const result = await requestToJoinLocation(locationId);
    if (result.success) {
      toast.success(result.success);
      // Refresh user and locations
      const [userData, locationsData] = await Promise.all([
        getCurrentUserDetails(),
        getLocations(),
      ]);
      setCurrentUser(userData);
      setLocations(locationsData);
    } else if (result.error) {
      toast.error(result.error);
    }
  };

  const handleLeaveLocation = async () => {
    if (!currentUser?.locationId) return;

    const result = await leaveLocation();
    if (result.success) {
      toast.success(result.success);
      // Refresh user and locations
      const [userData, locationsData] = await Promise.all([
        getCurrentUserDetails(),
        getLocations(),
      ]);
      setCurrentUser(userData);
      setLocations(locationsData);
    } else if (result.error) {
      toast.error(result.error);
    }
  };

  const filteredLocations = locations.filter(
    (location) =>
      location.name.toLowerCase().includes(search.toLowerCase()) ||
      location.address.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Available Locations</CardTitle>
        <div className="w-full max-w-md">
          <Input
            placeholder="Search locations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLocations.map((location) => {
          const isCurrentLocation = currentUser?.locationId === location.id;
          const hasPendingRequest = location.joinRequests?.some(
            (request: any) =>
              request.userId === currentUser?.id &&
              request.status === "PENDING",
          );

          return (
            <div key={location.id} className="border p-4 rounded-lg space-y-2">
              <h3 className="font-semibold">{location.name}</h3>
              <p className="text-sm text-muted-foreground">
                {location.address}
              </p>

              {isCurrentLocation ? (
                <div className="space-y-2">
                  <Badge className="w-full bg-blue-100 text-blue-800">
                    Joined!
                  </Badge>
                  <Button
                    variant="outline"
                    className="w-full text-red-600 hover:text-red-800"
                    onClick={handleLeaveLocation}
                  >
                    Leave Location
                  </Button>
                </div>
              ) : hasPendingRequest ? (
                <Badge className="w-full bg-yellow-100 text-yellow-800">
                  Request Pending
                </Badge>
              ) : (
                <Button
                  onClick={() => handleJoinRequest(location.id)}
                  className="w-full mt-2"
                  disabled={!!currentUser?.locationId}
                >
                  {currentUser?.locationId
                    ? "Leave Current Location First"
                    : "Request to Join"}
                </Button>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}