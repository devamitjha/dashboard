import Link from "next/link";
import { 
  LayoutDashboard, 
  MapPin, 
  Store, 
  Video, 
  Camera, 
  Coins, 
  Bell,
  ExternalLink,
  Users,
  LogIn,
  UserPlus,
  ShoppingCart,
  CreditCard,
  RefreshCw
} from "lucide-react";

const DASHBOARD_ITEMS = [
  {
    title: "User Activity",
    description: "Track successful logins, registrations, and active session completions.",
    href: "/dashboard/user-activity",
    icon: Users,
    color: "bg-emerald-50 text-emerald-600 border-emerald-100",
    isTracking: true
  },
  {
    title: "Website Orders",
    description: "View and track confirmed payments and orders placed through the website.",
    href: "/dashboard/payments",
    icon: CreditCard,
    color: "bg-emerald-50 text-emerald-600 border-emerald-100"
  },
  {
    title: "Abandoned Carts",
    description: "Real-time view of customer shopping carts across the store.",
    href: "/dashboard/carts",
    icon: ShoppingCart,
    color: "bg-zinc-50 text-zinc-600 border-zinc-100"
  },
  {
    title: "Gold Coin Offer",
    description: "Manage the automated free gold coin promotion and thresholds.",
    href: "/dashboard/gold-coin-offer",
    icon: Coins,
    color: "bg-amber-50 text-amber-600 border-amber-100"
  },
  {
    title: "Topbar Offers",
    description: "Update announcements and promotional messages in the header.",
    href: "/dashboard/topbar-offers",
    icon: Bell,
    color: "bg-blue-50 text-blue-600 border-blue-100"
  },
  {
    title: "Pincode Management",
    description: "Manage serviceable pincodes, delivery times, and locations.",
    href: "/dashboard/pincodes",
    icon: MapPin,
    color: "bg-emerald-50 text-emerald-600 border-emerald-100"
  },
  {
    title: "Store Management",
    description: "Update physical store locations, contact details, and images.",
    href: "/dashboard/stores",
    icon: Store,
    color: "bg-purple-50 text-purple-600 border-purple-100"
  },
  {
    title: "Curated Looks",
    description: "Manage shop-the-look sets and matching product collections.",
    href: "/dashboard/curated-looks",
    icon: Camera,
    color: "bg-rose-50 text-rose-600 border-rose-100"
  },
  {
    title: "Styled Videos",
    description: "Update the shoppable video gallery and product tagging.",
    href: "/dashboard/styled-videos",
    icon: Video,
    color: "bg-indigo-50 text-indigo-600 border-indigo-100"
  },
  {
    title: "Clear Cache",
    description: "Clear Vercel cache for any page to instantly apply updates.",
    href: "/dashboard/revalidate",
    icon: RefreshCw,
    color: "bg-teal-50 text-teal-600 border-teal-100"
  },
  {
    title: "Hero Banners",
    description: "Manage homepage hero slider images, videos, and links.",
    href: "/dashboard/hero-banners",
    icon: Camera, // Reusing Camera since it's already imported
    color: "bg-orange-50 text-orange-600 border-orange-100"
  }
];

export default function Dashboard() {
  return (
    <div className="container-main py-10 px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-abhaya flex items-center gap-3">
            <LayoutDashboard className="text-primary" />
            Lucira Unified Backend
          </h1>
          <p className="text-gray-500 mt-2">Manage all custom services and promotional content from this unified interface.</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          Connected to MongoDB Atlas
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {DASHBOARD_ITEMS.map((item) => (
          <Link 
            key={item.title} 
            href={item.href}
            prefetch={false}
            className={`group block bg-white border border-gray-100 rounded-xl p-6 transition-all hover:shadow-md hover:border-primary/20 ${item.isTracking ? 'ring-2 ring-emerald-500/5 ring-offset-2' : ''}`}
          >
            <div className={`w-12 h-12 rounded-lg border ${item.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
              <item.icon size={24} />
            </div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                {item.title}
                {item.isTracking && <span className="bg-emerald-500 w-1.5 h-1.5 rounded-full animate-pulse"></span>}
              </h3>
              <ExternalLink size={16} className="text-gray-300 group-hover:text-primary transition-colors" />
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              {item.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
