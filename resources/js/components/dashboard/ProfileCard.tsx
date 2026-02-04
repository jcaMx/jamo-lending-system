import { Mail, Phone, MapPin, Calendar, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CustomerProfile } from "@/data/dummyData";

interface ProfileCardProps {
  customer: CustomerProfile;
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export function ProfileCard({ customer }: ProfileCardProps) {
  const initials = customer.name
    .split(" ")
    .map((n: string) => n[0])
    .join("");

  return (
    <Card className="overflow-hidden rounded-2xl shadow-sm ring-1 ring-gray-200/70">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 px-6 py-8">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-4 border-white/20">
            <AvatarFallback className="bg-white text-slate-900 text-xl font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-bold text-white">{customer.name}</h2>
            <p className="text-sm text-slate-300">Customer ID: {customer.id}</p>
          </div>
        </div>
      </div>
      <CardContent className="grid gap-4 p-6 sm:grid-cols-2">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
            <Mail className="h-5 w-5" style={{ color: "#D97706" }} />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Email</p>
            <p className="text-sm font-medium text-foreground">{customer.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
            <Phone className="h-5 w-5" style={{ color: "#D97706" }} />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Contact</p>
            <p className="text-sm font-medium text-foreground">{customer.contact}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
            <MapPin className="h-5 w-5" style={{ color: "#D97706" }} />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Address</p>
            <p className="text-sm font-medium text-foreground">{customer.address}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
            <Calendar className="h-5 w-5" style={{ color: "#D97706" }} />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Member Since</p>
            <p className="text-sm font-medium text-foreground">{formatDate(customer.joinDate)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
