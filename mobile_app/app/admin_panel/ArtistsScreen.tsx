import React, { useState, useMemo } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Avatar from "../../components/admin/Avatar";
import StatusBadge from "../../components/admin/StatusBadge";
import SectionHeader from "../../components/admin/SectionHeader";
import SearchFilterBar from "../../components/admin/SearchFilterBar";
import KPICard from "../../components/admin/KPICard";
import { toast } from "../../utils/toast";

const ARTISTS = [
    { id: "1", name: "Meena K.", email: "meena@artistapp.com", city: "Hyderabad", experience: 8, basePrice: "₹12,600", bio: "Bridal & party makeup specialist", bookings: 12, rating: 4.9, approved: true },
    { id: "2", name: "Sai Veeranna", email: "sai.v@hashagile.com", city: "Bangalore", experience: 5, basePrice: "₹8,400", bio: "Fashion & editorial makeup", bookings: 8, rating: 4.7, approved: true },
    { id: "3", name: "Aishwarya", email: "a@gmail.com", city: "Chennai", experience: 3, basePrice: "₹6,700", bio: "Natural & everyday looks", bookings: 4, rating: 4.5, approved: true },
    { id: "4", name: "Priya M.", email: "priya.m@beauty.com", city: "Mumbai", experience: 10, basePrice: "₹16,800", bio: "Celebrity makeup artist", bookings: 20, rating: 4.8, approved: false },
    { id: "5", name: "Kavitha N.", email: "kavitha@mail.com", city: "Hyderabad", experience: 2, basePrice: "₹5,000", bio: "New artist specializing in hair", bookings: 1, rating: 4.0, approved: false },
];

const STATUS_FILTERS = ["All", "Approved", "Pending"];

export default function ArtistsScreen() {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    const filtered = useMemo(() => {
        return ARTISTS.filter((a) => {
            const s = search.toLowerCase();
            const matchSearch = !s || a.name.toLowerCase().includes(s) || a.city.toLowerCase().includes(s);
            const matchStatus = statusFilter === "All" ||
                (statusFilter === "Approved" && a.approved) ||
                (statusFilter === "Pending" && !a.approved);
            return matchSearch && matchStatus;
        });
    }, [search, statusFilter]);

    return (
        <ScrollView className="flex-1 bg-dark-900" contentContainerStyle={{ padding: 20 }}>
            <View className="flex-row items-center gap-x-2 mb-4">
                <Text className="text-slate-500 text-xs">Admin</Text>
                <Ionicons name="chevron-forward" size={14} color="#64748b" />
                <Text className="text-slate-400 text-xs font-medium">Artists</Text>
            </View>

            <SectionHeader title="Artist Management" subtitle="Manage makeup artists on the platform"
                actionLabel="Add Artist" onAction={() => toast.success("Opening Add Artist form...")} />

            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6 -mx-5" contentContainerStyle={{ paddingHorizontal: 20 }}>
                <KPICard title="Total Artists" value={ARTISTS.length}
                    icon={<Ionicons name="brush" size={18} color="#a855f7" />} />
                <KPICard title="Approved" value={ARTISTS.filter(a => a.approved).length}
                    icon={<Ionicons name="checkmark-circle" size={18} color="#22c55e" />} />
                <KPICard title="Pending" value={ARTISTS.filter(a => !a.approved).length}
                    icon={<Ionicons name="hourglass" size={18} color="#f59e0b" />} />
                <KPICard title="Avg Rating"
                    value={(ARTISTS.reduce((s, a) => s + a.rating, 0) / ARTISTS.length).toFixed(1)}
                    icon={<Ionicons name="star" size={18} color="#ef4444" />} />
            </ScrollView>

            <SearchFilterBar searchValue={search} onSearchChange={setSearch}
                placeholder="Search artists or city..."
                statusOptions={STATUS_FILTERS} selectedStatus={statusFilter} onStatusChange={setStatusFilter} />

            {filtered.map((artist) => (
                <View key={artist.id} className="bg-dark-700 rounded-2xl p-4 mb-3 border border-white/5">
                    {/* Top row */}
                    <View className="flex-row items-start gap-x-3 mb-4">
                        <Avatar name={artist.name} size={44} />
                        <View className="flex-1">
                            <Text className="text-white text-base font-semibold">{artist.name}</Text>
                            <Text className="text-slate-400 text-xs mt-0.5">{artist.bio}</Text>
                            <View className="flex-row items-center gap-x-1 mt-1.5">
                                <Ionicons name="location-outline" size={12} color="#64748b" />
                                <Text className="text-slate-500 text-[10px]">{artist.city}</Text>
                                <Text className="text-slate-500 text-[10px]"> · </Text>
                                <Ionicons name="time-outline" size={12} color="#64748b" />
                                <Text className="text-slate-500 text-[10px]">{artist.experience} yrs</Text>
                            </View>
                        </View>
                        <StatusBadge status={artist.approved ? "Active" : "Pending"} />
                    </View>

                    {/* Stats row */}
                    <View className="flex-row bg-dark-800 rounded-xl p-3 mb-3">
                        <View className="flex-1 items-center">
                            <Text className="text-white text-base font-bold">{artist.bookings}</Text>
                            <Text className="text-slate-500 text-[10px] mt-0.5">Bookings</Text>
                        </View>
                        <View className="w-px bg-white/5 my-1" />
                        <View className="flex-1 items-center">
                            <Text className="text-white text-base font-bold">★ {artist.rating}</Text>
                            <Text className="text-slate-500 text-[10px] mt-0.5">Rating</Text>
                        </View>
                        <View className="w-px bg-white/5 my-1" />
                        <View className="flex-1 items-center">
                            <Text className="text-white text-base font-bold">{artist.basePrice}</Text>
                            <Text className="text-slate-500 text-[10px] mt-0.5">Base Price</Text>
                        </View>
                    </View>

                    {/* Footer */}
                    <View className="flex-row justify-between items-center border-t border-white/5 pt-3">
                        <Text className="text-slate-500 text-[10px] flex-1">
                            <Ionicons name="mail-outline" size={10} color="#64748b" /> {artist.email}
                        </Text>
                        <View className="flex-row gap-x-2">
                            <TouchableOpacity className="w-[34] h-[34] rounded-md bg-dark-800 items-center justify-center border border-white/5"
                                onPress={() => toast.info(`Viewing ${artist.name}`)}>
                                <Ionicons name="eye-outline" size={16} color="#94a3b8" />
                            </TouchableOpacity>
                            <TouchableOpacity className="w-[34] h-[34] rounded-md bg-dark-800 items-center justify-center border border-white/5"
                                onPress={() => toast.info(`Editing ${artist.name}`)}>
                                <Ionicons name="create-outline" size={16} color="#3b82f6" />
                            </TouchableOpacity>
                            {!artist.approved && (
                                <TouchableOpacity className="w-[34] h-[34] rounded-md bg-success/10 items-center justify-center border border-success/20"
                                    onPress={() => toast.success(`${artist.name} approved!`)}>
                                    <Ionicons name="checkmark" size={16} color="#22c55e" />
                                </TouchableOpacity>
                            )}
                            <TouchableOpacity className="w-[34] h-[34] rounded-md bg-danger/10 items-center justify-center border border-danger/20"
                                onPress={() => toast.error(`${artist.name} deleted`)}>
                                <Ionicons name="trash-outline" size={16} color="#ef4444" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            ))}

            <View className="h-10" />
        </ScrollView>
    );
}
