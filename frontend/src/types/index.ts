export type UserRole = 'resident' | 'staff' | 'admin';

export interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: UserRole;
    avatar: string;
    flatNumber?: string;
    wing?: string;
    specialization?: string;
    department?: string;
    designation?: string;
}

export type ComplaintStatus =
    | 'raised'
    | 'acknowledged'
    | 'assigned'
    | 'accepted'
    | 'in_progress'
    | 'on_hold'
    | 'resolved'
    | 'closed';

export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type ComplaintCategory =
    | 'Plumbing'
    | 'Electrical'
    | 'Elevator'
    | 'Carpentry'
    | 'Cleaning & Sanitation'
    | 'Security'
    | 'Civil Works'
    | 'Internet / DTH'
    | 'Others';

export interface TimelineStep {
    status: ComplaintStatus;
    label: string;
    timestamp: string;
    updatedBy: string;
    note?: string;
}

export interface ComplaintComment {
    id: string;
    authorName: string;
    authorRole: UserRole;
    authorAvatar: string;
    text: string;
    timestamp: string;
    attachmentUrl?: string;
}

export interface Complaint {
    id: string;
    ticketNumber: string;
    title: string;
    category: ComplaintCategory;
    description: string;
    priority: Priority;
    status: ComplaintStatus;
    location: string;
    flatNumber: string;
    residentName: string;
    residentPhone: string;
    assignedWorkerId?: string;
    assignedWorkerName?: string;
    assignedWorkerPhone?: string;
    assignedWorkerAvatar?: string;
    createdAt: string;
    updatedAt: string;
    photoUrl?: string;
    resolutionPhotoUrl?: string;
    workNotes?: string;
    feedbackRating?: number;
    feedbackComment?: string;
    timeline: TimelineStep[];
    comments: ComplaintComment[];
    requiredMaterials?: { itemId: string; name: string; quantity: number }[];
}

export interface Facility {
    id: string;
    name: string;
    category: string;
    description: string;
    image: string;
    capacity: number;
    hourlyRate: number;
    timing: string;
    rules: string[];
    isAvailable: boolean;
    status?: 'available' | 'maintenance';
}

export type BookingStatus = 'confirmed' | 'pending' | 'cancelled' | 'completed';

export interface AmenityBooking {
    id: string;
    facilityId: string;
    facilityName: string;
    amenityName?: string;
    facilityImage: string;
    residentId: string;
    residentName: string;
    flatNumber: string;
    date: string;
    bookingDate?: string;
    startTime: string;
    endTime: string;
    slotTime?: string;
    guestsCount: number;
    totalAmount: number;
    status: BookingStatus;
    createdAt: string;
}

export type BillStatus = 'paid' | 'pending' | 'overdue';

export interface BillBreakdownItem {
    description: string;
    amount: number;
    maintenance?: number;
    sinkingFund?: number;
    waterCharges?: number;
    parkingCharges?: number;
}

export interface Bill {
    id: string;
    billNumber: string;
    invoiceNumber?: string;
    flatNumber: string;
    residentName: string;
    monthYear: string;
    month?: string;
    issueDate: string;
    dueDate: string;
    amount: number;
    lateFee: number;
    status: BillStatus;
    paymentDate?: string;
    paidAt?: string;
    paymentMethod?: string;
    transactionRef?: string;
    transactionId?: string;
    breakdown: any;
}

export type VisitorStatus = 'pre_registered' | 'approved' | 'denied' | 'checked_in' | 'checked_out' | 'pending';
export type VisitorType = 'Guest' | 'Delivery' | 'Service Technician' | 'Cab' | 'Other';

export interface Visitor {
    id: string;
    visitorName: string;
    phone: string;
    visitorType: VisitorType;
    flatNumber: string;
    residentName: string;
    expectedDate: string;
    expectedTime: string;
    entryCode: string;
    vehicleNumber?: string;
    status: VisitorStatus;
    checkInTime?: string;
    checkOutTime?: string;
    purpose?: string;
}

export type DeliveryStatus = 'pending_collection' | 'collected' | 'received_at_gate';

export interface Delivery {
    id: string;
    trackingNumber: string;
    courierCompany: string;
    flatNumber: string;
    residentName: string;
    packageCount: number;
    deliveredAt: string;
    receivedAt?: string;
    status: DeliveryStatus;
    collectedAt?: string;
    otp?: string;
    pickupCode?: string;
}

export interface StaffMember {
    id: string;
    name: string;
    phone: string;
    email: string;
    avatar: string;
    specialization?: ComplaintCategory;
    designation?: string;
    skills?: string[];
    role?: string;
    shift?: string;
    currentWorkload?: number;
    activeTaskCount?: number;
    rating?: number;
    status: 'Available' | 'On Task' | 'Off Duty' | 'active' | 'inactive';
    completedTasksCount?: number;
    joinedDate?: string;
}

export interface InventoryItem {
    id: string;
    name: string;
    category: string;
    quantity: number;
    unit: string;
    minThreshold: number;
    unitPrice: number;
    location: string;
    lastRestocked: string;
    supplier?: string;
}

export type MaterialRequestStatus = 'pending' | 'approved' | 'rejected';

export interface MaterialRequest {
    id: string;
    staffId?: string;
    staffName?: string;
    requestedBy?: string;
    complaintId?: string;
    itemName: string;
    quantityRequested?: number;
    quantity?: number;
    unit: string;
    reason: string;
    priority?: Priority;
    urgency?: string;
    status: MaterialRequestStatus;
    requestedAt: string;
}

export type AnnouncementTarget = 'all' | 'residents' | 'staff';
export type AnnouncementStatus = 'published' | 'draft';

export interface Announcement {
    id: string;
    title: string;
    content: string;
    category: 'General' | 'Maintenance' | 'Event' | 'Emergency' | 'Billing';
    authorName: string;
    authorRole?: string;
    targetAudience: AnnouncementTarget;
    status?: AnnouncementStatus;
    isPinned: boolean;
    publishedAt: string;
    readByCount?: number;
}

export interface NotificationItem {
    id: string;
    title: string;
    message: string;
    timestamp: string;
    isRead: boolean;
    category: 'complaint' | 'bill' | 'visitor' | 'amenity' | 'announcement' | 'system';
    linkRoute?: string;
}

export interface Resident {
    id: string;
    name: string;
    email: string;
    phone: string;
    flatNumber: string;
    wing: string;
    ownershipType?: 'Owner' | 'Tenant';
    occupancyStatus?: string;
    occupantsCount?: number;
    familyMembersCount?: number;
    avatar?: string;
    vehicles?: { type: 'Car' | 'Bike'; number: string; slot?: string }[];
    status?: 'Active' | 'Inactive';
}

export type PriorityLevel = Priority;
export type Amenity = Facility;
export type FacilityBooking = AmenityBooking;
export type DeliveryPackage = Delivery;

export interface SocietyStats {
    totalResidents: number;
    openComplaints: number;
    overdueTasks: number;
    activeStaff: number;
    todayBookings: number;
    outstandingDues: number;
    lowInventoryItems: number;
    activeVisitors: number;
}


