"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Database,
  Plus,
  BarChart3,
  Key,
  Clock,
  Trash2,
  Settings,
  Search,
  RefreshCw,
  Activity,
  HardDrive,
  Zap,
  TrendingUp,
  LogOut,
  User,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatBytes, formatDuration, getHitRate } from "@/lib/utils";

// Demo data
const demoStores = [
  { id: "1", name: "user-sessions", keys: 1243, hits: 45678, misses: 2341, memoryBytes: 5242880, maxMemoryMB: 50 },
  { id: "2", name: "api-responses", keys: 892, hits: 123456, misses: 8901, memoryBytes: 15728640, maxMemoryMB: 100 },
  { id: "3", name: "product-catalog", keys: 3456, hits: 789012, misses: 12345, memoryBytes: 31457280, maxMemoryMB: 200 },
];

const demoKeys = [
  { id: "1", key: "user:1234:profile", value: '{"name":"John","email":"john@example.com"}', ttlSeconds: 3600, hits: 156, sizeBytes: 256, expiresAt: new Date(Date.now() + 1800000) },
  { id: "2", key: "user:1234:preferences", value: '{"theme":"dark","notifications":true}', ttlSeconds: 7200, hits: 89, sizeBytes: 128, expiresAt: new Date(Date.now() + 3600000) },
  { id: "3", key: "session:abc123", value: '{"userId":"1234","token":"xyz"}', ttlSeconds: 1800, hits: 423, sizeBytes: 192, expiresAt: new Date(Date.now() + 900000) },
  { id: "4", key: "api:weather:nyc", value: '{"temp":72,"conditions":"sunny"}', ttlSeconds: 300, hits: 1567, sizeBytes: 512, expiresAt: new Date(Date.now() + 120000) },
  { id: "5", key: "product:sku:12345", value: '{"name":"Widget","price":29.99}', ttlSeconds: null, hits: 2890, sizeBytes: 384, expiresAt: null },
];

const analyticsData = [
  { time: "00:00", hits: 1200, misses: 45 },
  { time: "04:00", hits: 800, misses: 32 },
  { time: "08:00", hits: 3400, misses: 120 },
  { time: "12:00", hits: 5600, misses: 230 },
  { time: "16:00", hits: 4800, misses: 180 },
  { time: "20:00", hits: 3200, misses: 95 },
];

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [selectedStore, setSelectedStore] = useState(demoStores[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredKeys, setFilteredKeys] = useState(demoKeys);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/dashboard");
    }
  }, [status, router]);

  useEffect(() => {
    if (searchQuery) {
      setFilteredKeys(demoKeys.filter((k) => k.key.toLowerCase().includes(searchQuery.toLowerCase())));
    } else {
      setFilteredKeys(demoKeys);
    }
  }, [searchQuery]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  const totalHits = demoStores.reduce((acc, s) => acc + s.hits, 0);
  const totalMisses = demoStores.reduce((acc, s) => acc + s.misses, 0);
  const totalKeys = demoStores.reduce((acc, s) => acc + s.keys, 0);
  const totalMemory = demoStores.reduce((acc, s) => acc + s.memoryBytes, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 border-r border-border bg-card p-4">
        <Link href="/" className="flex items-center gap-2 mb-8">
          <Database className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold">Craig-O-Cache</span>
        </Link>

        <nav className="space-y-2">
          <Button variant="secondary" className="w-full justify-start gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2">
            <Key className="h-4 w-4" />
            Key Browser
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2">
            <Activity className="h-4 w-4" />
            Analytics
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </Button>
        </nav>

        <div className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-muted-foreground">Cache Stores</span>
            <Button size="icon" variant="ghost" className="h-6 w-6">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-1">
            {demoStores.map((store) => (
              <button
                key={store.id}
                onClick={() => setSelectedStore(store)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition ${
                  selectedStore.id === store.id
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{store.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {store.keys}
                  </Badge>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* User Profile */}
        <div className="absolute bottom-4 left-4 right-4 space-y-2">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
            {session?.user?.image ? (
              <img
                src={session.user.image}
                alt={session.user.name || "User"}
                className="h-8 w-8 rounded-full"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-4 w-4 text-primary" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{session?.user?.name || "User"}</p>
              <p className="text-xs text-muted-foreground truncate">{session?.user?.email}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full gap-2 text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {session?.user?.name?.split(" ")[0] || "there"}! Monitor and manage your cache.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              New Key
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <Key className="h-4 w-4" />
                Total Keys
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalKeys.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">across {demoStores.length} stores</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Hit Rate
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-500">
                {getHitRate(totalHits, totalMisses)}%
              </div>
              <p className="text-xs text-muted-foreground">
                {totalHits.toLocaleString()} hits / {totalMisses.toLocaleString()} misses
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <HardDrive className="h-4 w-4" />
                Memory Used
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{formatBytes(totalMemory)}</div>
              <div className="mt-2 h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${(totalMemory / (350 * 1024 * 1024)) * 100}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Requests/min
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">4,892</div>
              <p className="text-xs text-green-500">↑ 12% from last hour</p>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Chart */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Cache Performance</CardTitle>
            <CardDescription>Hits vs Misses over the last 24 hours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end gap-4">
              {analyticsData.map((data, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex flex-col gap-1">
                    <div
                      className="w-full bg-primary rounded-t"
                      style={{ height: `${(data.hits / 6000) * 200}px` }}
                    />
                    <div
                      className="w-full bg-red-500 rounded-b"
                      style={{ height: `${(data.misses / 6000) * 200}px` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">{data.time}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-6 mt-4 justify-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-primary rounded" />
                <span className="text-sm text-muted-foreground">Hits</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded" />
                <span className="text-sm text-muted-foreground">Misses</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Browser */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Key Browser</CardTitle>
                <CardDescription>Browse and manage cache keys in {selectedStore.name}</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search keys..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 w-64"
                  />
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                  <Trash2 className="h-4 w-4" />
                  Invalidate Pattern
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-secondary/50">
                  <tr>
                    <th className="text-left px-4 py-3 text-sm font-medium">Key</th>
                    <th className="text-left px-4 py-3 text-sm font-medium">Value</th>
                    <th className="text-left px-4 py-3 text-sm font-medium">TTL</th>
                    <th className="text-left px-4 py-3 text-sm font-medium">Size</th>
                    <th className="text-left px-4 py-3 text-sm font-medium">Hits</th>
                    <th className="text-left px-4 py-3 text-sm font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredKeys.map((item) => (
                    <tr key={item.id} className="hover:bg-secondary/30 transition">
                      <td className="px-4 py-3">
                        <code className="text-sm bg-secondary px-2 py-1 rounded">{item.key}</code>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-muted-foreground max-w-xs truncate block">
                          {item.value.substring(0, 40)}...
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {item.ttlSeconds ? (
                          <Badge variant={item.expiresAt && item.expiresAt < new Date(Date.now() + 600000) ? "destructive" : "secondary"}>
                            <Clock className="h-3 w-3 mr-1" />
                            {formatDuration(item.ttlSeconds)}
                          </Badge>
                        ) : (
                          <Badge variant="outline">No TTL</Badge>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm">{formatBytes(item.sizeBytes)}</td>
                      <td className="px-4 py-3 text-sm">{item.hits.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
