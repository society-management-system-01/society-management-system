import React, { useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Card } from '../../components/common/Cards';
import { Input } from '../../components/common/FormFields';
import {
    User,
    Building,
    Phone,
    Mail,
    Car,
    Shield,
    Plus,
    Trash2,
    MapPin,
    CheckCircle2,
    ParkingSquare,
    Home,
    Edit3,
    CircleUserRound,
    BadgeCheck,
    Camera,
    Upload,
    X,
} from 'lucide-react';

export const ResidentProfile: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
    const { currentUser } = useAuth();
    const toast = useToast();

    const [name, setName] = useState(currentUser.name);
    const [email, setEmail] = useState(currentUser.email);
    const [phone, setPhone] = useState(currentUser.phone);

    const [vehicles, setVehicles] = useState([
        { type: 'Car', number: 'MH 02 CD 4820', slot: 'P2-402' },
        { type: 'Two-Wheeler', number: 'MH 02 AB 9102', slot: 'S-12' }
    ]);

    const [newVehicleNo, setNewVehicleNo] = useState('');
    const [newVehicleType, setNewVehicleType] = useState('Car');

    // Profile image state
    const [profileImage, setProfileImage] = useState<string>(currentUser.avatar || '');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleAddVehicle = (e: React.FormEvent) => {
        e.preventDefault();

        if (!newVehicleNo.trim()) return;

        setVehicles([
            ...vehicles,
            {
                type: newVehicleType,
                number: newVehicleNo.toUpperCase(),
                slot: 'P-Unassigned'
            }
        ]);

        setNewVehicleNo('');

        toast.success(
            'Vehicle Registered',
            'Added to security gate database.'
        );
    };

    const handleRemoveVehicle = (idx: number) => {
        setVehicles(vehicles.filter((_, i) => i !== idx));
        toast.info('Vehicle Removed');
    };

    const handleSaveProfile = (e: React.FormEvent) => {
        e.preventDefault();

        toast.success(
            'Profile Saved',
            'Personal details updated.'
        );
    };

    // Profile image upload
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) return;

        // Check file type
        if (!file.type.startsWith('image/')) {
            toast.info('Invalid File', 'Please select an image file.');
            return;
        }

        // Check file size - maximum 5MB
        if (file.size > 5 * 1024 * 1024) {
            toast.info(
                'Image Too Large',
                'Please select an image smaller than 5MB.'
            );
            return;
        }

        const imageUrl = URL.createObjectURL(file);
        setProfileImage(imageUrl);

        toast.success(
            'Photo Updated',
            'Your new profile photo has been selected.'
        );

        // Allow selecting the same file again
        e.target.value = '';
    };

    const handleRemoveProfileImage = () => {
        setProfileImage(currentUser.avatar || '');

        toast.info(
            'Photo Removed',
            'Your profile photo has been reset.'
        );
    };

    const handleChangePhoto = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="relative space-y-6 pb-8">

            {/* Ambient Background */}
            <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute -top-32 -right-32 h-80 w-80 rounded-full bg-emerald-200/20 blur-3xl dark:bg-emerald-900/10" />
                <div className="absolute top-1/2 -left-40 h-80 w-80 rounded-full bg-sky-200/20 blur-3xl dark:bg-sky-900/10" />
            </div>

            {/* Page Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <div className="mb-2 flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                            <CircleUserRound className="h-4 w-4" />
                        </div>

                        <span className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">
                            Resident Account
                        </span>
                    </div>

                    <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                        My Profile
                    </h1>

                    <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500 dark:text-slate-400 sm:text-sm">
                        Manage your personal information, residence details and registered vehicles.
                    </p>
                </div>

                <div className="flex items-center gap-2 self-start rounded-2xl border border-emerald-100 bg-white/80 px-3 py-2 shadow-sm backdrop-blur dark:border-emerald-900/40 dark:bg-slate-900/70 sm:self-auto">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/50">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    </span>

                    <div>
                        <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                            Account Status
                        </p>

                        <p className="text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400">
                            Active & Verified
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Profile Layout */}
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

                {/* LEFT PROFILE PANEL */}
                <div className="xl:col-span-1">
                    <div className="relative overflow-hidden rounded-[2rem] border border-slate-200/70 bg-white shadow-[0_18px_50px_-25px_rgba(15,23,42,0.35)] dark:border-slate-800 dark:bg-slate-900">

                        {/* Cover */}
                        <div className="relative h-28 overflow-hidden bg-gradient-to-br from-emerald-700 via-teal-700 to-sky-800">

                            <div className="absolute inset-0 opacity-20">
                                <div className="absolute -right-10 -top-16 h-40 w-40 rounded-full border-[18px] border-white/30" />
                                <div className="absolute -left-8 bottom-[-60px] h-40 w-40 rounded-full border-[14px] border-white/20" />
                            </div>

                            {/* Cover label */}
                            <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-black/15 px-3 py-1.5 backdrop-blur-md">
                                <Shield className="h-3 w-3 text-white" />

                                <span className="text-[9px] font-bold uppercase tracking-wider text-white">
                                    Verified Resident
                                </span>
                            </div>
                        </div>

                        {/* Profile Content */}
                        <div className="px-5 pb-5">

                            {/* Avatar + Photo Controls */}
                            <div className="relative -mt-12 flex items-end justify-between">

                                <div className="relative">

                                    {/* Profile Image */}
                                    <div className="relative h-24 w-24">
                                        {profileImage ? (
                                            <img
                                                src={profileImage}
                                                alt={currentUser.name}
                                                className="h-24 w-24 rounded-[1.6rem] border-4 border-white object-cover shadow-xl dark:border-slate-900"
                                            />
                                        ) : (
                                            <div className="flex h-24 w-24 items-center justify-center rounded-[1.6rem] border-4 border-white bg-emerald-100 shadow-xl dark:border-slate-900 dark:bg-emerald-950">
                                                <User className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
                                            </div>
                                        )}

                                        {/* Verified Icon */}
                                        <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-4 border-white bg-emerald-500 dark:border-slate-900">
                                            <BadgeCheck className="h-3.5 w-3.5 text-white" />
                                        </div>
                                    </div>

                                </div>

                                {/* Photo Button */}
                                <button
                                    type="button"
                                    onClick={handleChangePhoto}
                                    className="mb-1 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-[10px] font-black text-slate-600 shadow-sm transition-all hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-emerald-950/30 dark:hover:text-emerald-400"
                                >
                                    <Camera className="h-3.5 w-3.5" />
                                    Change Photo
                                </button>

                            </div>

                            {/* Hidden File Input */}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                            />

                            {/* Photo Actions */}
                            <div className="mt-3 flex items-center gap-2">

                                <button
                                    type="button"
                                    onClick={handleChangePhoto}
                                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-[10px] font-black text-emerald-700 transition-all hover:bg-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:hover:bg-emerald-950/50"
                                >
                                    <Upload className="h-3.5 w-3.5" />
                                    Upload New Photo
                                </button>

                                {profileImage && profileImage !== currentUser.avatar && (
                                    <button
                                        type="button"
                                        onClick={handleRemoveProfileImage}
                                        className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 text-slate-400 transition-all hover:border-rose-200 hover:bg-rose-50 hover:text-rose-500 dark:border-slate-700 dark:hover:bg-rose-950/30"
                                        title="Remove photo"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}

                            </div>

                            {/* Photo Hint */}
                            <p className="mt-2 text-center text-[9px] text-slate-400">
                                JPG, PNG or WEBP · Maximum 5MB
                            </p>

                            {/* Name + Flat */}
                            <div className="mt-5">
                                <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                                    {currentUser.name}
                                </h2>

                                <div className="mt-1 flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                    <Home className="h-3.5 w-3.5" />
                                    Flat {currentUser.flatNumber} · {currentUser.wing}
                                </div>
                            </div>

                            {/* Resident Type */}
                            <div className="mt-4 flex items-center justify-between rounded-2xl border border-emerald-100 bg-emerald-50/70 px-3.5 py-3 dark:border-emerald-900/40 dark:bg-emerald-950/20">
                                <div className="flex items-center gap-3">

                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm dark:bg-slate-900">
                                        <Building className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                    </div>

                                    <div>
                                        <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                                            Resident Type
                                        </p>

                                        <p className="text-xs font-black text-slate-800 dark:text-slate-200">
                                            Primary Owner
                                        </p>
                                    </div>
                                </div>

                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                            </div>

                            {/* Residence Details */}
                            <div className="mt-4 grid grid-cols-2 gap-2">

                                <div className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-800/50">
                                    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                                        Occupancy
                                    </p>

                                    <p className="mt-1 text-xs font-black text-slate-800 dark:text-slate-200">
                                        Owner Residing
                                    </p>
                                </div>

                                <div className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-800/50">
                                    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                                        Member ID
                                    </p>

                                    <p className="mt-1 font-mono text-xs font-black text-slate-800 dark:text-slate-200">
                                        GHH-8842
                                    </p>
                                </div>

                            </div>

                            {/* Society */}
                            <div className="mt-2 flex items-center gap-2 rounded-2xl border border-slate-100 bg-white px-3 py-2.5 dark:border-slate-800 dark:bg-slate-900">
                                <MapPin className="h-4 w-4 shrink-0 text-slate-400" />

                                <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                                    Horizon Heights Residential Society
                                </span>
                            </div>

                        </div>
                    </div>
                </div>

                {/* RIGHT CONTENT */}
                <div className="space-y-6 xl:col-span-2">

                    {/* Personal Information */}
                    <Card
                        title="Personal Information"
                        subtitle="Keep your contact details updated for society communication."
                    >
                        <form onSubmit={handleSaveProfile} className="space-y-5">

                            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/30">

                                <div className="mb-3 flex items-center gap-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white shadow-sm dark:bg-slate-900">
                                        <User className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                    </div>

                                    <div>
                                        <p className="text-xs font-black text-slate-800 dark:text-slate-200">
                                            Basic Details
                                        </p>

                                        <p className="text-[9px] text-slate-400">
                                            Your primary resident information
                                        </p>
                                    </div>
                                </div>

                                <Input
                                    label="Full Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    icon={<User className="h-4 w-4" />}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                                <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-800/20">
                                    <Input
                                        label="Email Address"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        icon={<Mail className="h-4 w-4" />}
                                        required
                                    />
                                </div>

                                <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-800/20">
                                    <Input
                                        label="Primary Phone Number"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        icon={<Phone className="h-4 w-4" />}
                                        required
                                    />
                                </div>

                            </div>

                            <div className="flex flex-col gap-3 border-t border-slate-100 pt-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">

                                <div className="flex items-center gap-2">
                                    <Shield className="h-4 w-4 text-emerald-500" />

                                    <p className="text-[10px] font-semibold text-slate-400">
                                        Your contact information is used for society alerts.
                                    </p>
                                </div>

                                <button
                                    type="submit"
                                    className="group flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-black text-white shadow-lg shadow-slate-900/10 transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-600 hover:shadow-emerald-600/20 dark:bg-white dark:text-slate-900 dark:hover:bg-emerald-400"
                                >
                                    <CheckCircle2 className="h-4 w-4 transition-transform group-hover:scale-110" />
                                    Save Profile Changes
                                </button>

                            </div>
                        </form>
                    </Card>

                    {/* Vehicles */}
                    <Card
                        title="Registered Parking Vehicles"
                        subtitle="Vehicles linked with your society security and parking records."
                    >
                        <div className="space-y-4">

                            {/* Vehicle Count Header */}
                            <div className="flex flex-col gap-3 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 p-4 text-white dark:from-slate-800 dark:to-slate-900 sm:flex-row sm:items-center sm:justify-between">

                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                                        <ParkingSquare className="h-5 w-5 text-emerald-300" />
                                    </div>

                                    <div>
                                        <p className="text-xs font-black">
                                            Parking & Gate Access
                                        </p>

                                        <p className="mt-0.5 text-[9px] text-slate-400">
                                            {vehicles.length} vehicle{vehicles.length !== 1 ? 's' : ''} registered
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1.5 self-start rounded-full bg-emerald-400/10 px-3 py-1.5 sm:self-auto">
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

                                    <span className="text-[9px] font-bold text-emerald-300">
                                        Gate Access Active
                                    </span>
                                </div>

                            </div>

                            {/* Vehicle List */}
                            <div className="space-y-3">
                                {vehicles.map((v, idx) => (
                                    <div
                                        key={idx}
                                        className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-lg hover:shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-900"
                                    >
                                        <div className="flex items-center justify-between gap-3">

                                            <div className="flex min-w-0 items-center gap-3">
                                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                                                    <Car className="h-6 w-6" />
                                                </div>

                                                <div className="min-w-0">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <h5 className="font-mono text-sm font-black tracking-wide text-slate-900 dark:text-white">
                                                            {v.number}
                                                        </h5>

                                                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[8px] font-black uppercase tracking-wider text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                                                            Active
                                                        </span>
                                                    </div>

                                                    <p className="mt-1 text-[10px] font-medium text-slate-500 dark:text-slate-400">
                                                        {v.type}
                                                    </p>
                                                </div>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => handleRemoveVehicle(idx)}
                                                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-400 transition-all hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-950/30"
                                                title="Remove vehicle"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>

                                        </div>

                                        <div className="mt-3 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">

                                            <div className="flex items-center gap-2">
                                                <ParkingSquare className="h-3.5 w-3.5 text-slate-400" />

                                                <div>
                                                    <p className="text-[8px] font-bold uppercase tracking-wider text-slate-400">
                                                        Parking Bay
                                                    </p>

                                                    <p className="text-[10px] font-black text-slate-700 dark:text-slate-300">
                                                        {v.slot}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Shield className="h-3.5 w-3.5 text-slate-400" />

                                                <div>
                                                    <p className="text-[8px] font-bold uppercase tracking-wider text-slate-400">
                                                        Gate Access
                                                    </p>

                                                    <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-400">
                                                        Enabled
                                                    </p>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Add Vehicle */}
                            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 p-4 dark:border-slate-700 dark:bg-slate-800/20">

                                <div className="mb-4 flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm dark:bg-slate-900">
                                        <Plus className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                    </div>

                                    <div>
                                        <p className="text-xs font-black text-slate-800 dark:text-slate-200">
                                            Register Another Vehicle
                                        </p>

                                        <p className="text-[9px] text-slate-400">
                                            Add a vehicle to your society gate records.
                                        </p>
                                    </div>
                                </div>

                                <form
                                    onSubmit={handleAddVehicle}
                                    className="flex flex-col gap-3 sm:flex-row"
                                >
                                    <div className="flex-1">
                                        <input
                                            type="text"
                                            value={newVehicleNo}
                                            onChange={(e) => setNewVehicleNo(e.target.value)}
                                            placeholder="Vehicle registration number"
                                            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                                        />
                                    </div>

                                    <select
                                        value={newVehicleType}
                                        onChange={(e) => setNewVehicleType(e.target.value)}
                                        className="h-11 rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-bold text-slate-700 outline-none transition-all focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                                    >
                                        <option value="Car">Car</option>
                                        <option value="Two-Wheeler">Two-Wheeler</option>
                                    </select>

                                    <button
                                        type="submit"
                                        className="flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 text-xs font-black text-white shadow-md shadow-emerald-600/20 transition-all hover:-translate-y-0.5 hover:bg-emerald-500"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Register Vehicle
                                    </button>
                                </form>

                            </div>

                        </div>
                    </Card>

                </div>
            </div>
        </div>
    );
};