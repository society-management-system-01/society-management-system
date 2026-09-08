import {
    Complaint,
    ComplaintStatus,
    Facility,
    AmenityBooking,
    Bill,
    Visitor,
    Delivery,
    StaffMember,
    InventoryItem,
    MaterialRequest,
    Announcement,
    NotificationItem,
    SocietyStats,
    Priority
} from '../types';

import {
    INITIAL_COMPLAINTS,
    INITIAL_FACILITIES,
    INITIAL_BOOKINGS,
    INITIAL_BILLS,
    INITIAL_VISITORS,
    INITIAL_DELIVERIES,
    INITIAL_STAFF,
    INITIAL_INVENTORY,
    INITIAL_MATERIAL_REQUESTS,
    INITIAL_ANNOUNCEMENTS,
    INITIAL_NOTIFICATIONS,
    INITIAL_SOCIETY_STATS
} from './mockData';

// Helper for simulated network delay
const delay = (ms: number = 300) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper to load or initialize localStorage
function loadInitialState<T>(key: string, defaultData: T): T {
    try {
        const saved = localStorage.getItem(`society_app_${key}`);
        return saved ? JSON.parse(saved) : defaultData;
    } catch (e) {
        console.warn(`Failed loading ${key} from localStorage`, e);
        return defaultData;
    }
}

function saveState<T>(key: string, data: T): void {
    try {
        localStorage.setItem(`society_app_${key}`, JSON.stringify(data));
    } catch (e) {
        console.warn(`Failed saving ${key} to localStorage`, e);
    }
}

// In-Memory & LocalStorage State
let complaints = loadInitialState<Complaint[]>('complaints', INITIAL_COMPLAINTS);
let facilities = loadInitialState<Facility[]>('facilities', INITIAL_FACILITIES);
let bookings = loadInitialState<AmenityBooking[]>('bookings', INITIAL_BOOKINGS);
let bills = loadInitialState<Bill[]>('bills', INITIAL_BILLS);
let visitors = loadInitialState<Visitor[]>('visitors', INITIAL_VISITORS);
let deliveries = loadInitialState<Delivery[]>('deliveries', INITIAL_DELIVERIES);
let staff = loadInitialState<StaffMember[]>('staff', INITIAL_STAFF);
let inventory = loadInitialState<InventoryItem[]>('inventory', INITIAL_INVENTORY);
let materialRequests = loadInitialState<MaterialRequest[]>('materialRequests', INITIAL_MATERIAL_REQUESTS);
let announcements = loadInitialState<Announcement[]>('announcements', INITIAL_ANNOUNCEMENTS);
let notifications = loadInitialState<NotificationItem[]>('notifications', INITIAL_NOTIFICATIONS);

export const mockApi = {
    // COMPLAINTS
    async getComplaints(): Promise<Complaint[]> {
        await delay();
        return [...complaints];
    },

    async getComplaintById(id: string): Promise<Complaint | null> {
        await delay();
        return complaints.find((c) => c.id === id) || null;
    },

    async createComplaint(data: Omit<Complaint, 'id' | 'ticketNumber' | 'createdAt' | 'updatedAt' | 'timeline' | 'comments'>): Promise<Complaint> {
        await delay(500);
        const newId = `cmp_${Date.now()}`;
        const ticketNum = `CMP-2026-${Math.floor(100 + Math.random() * 900)}`;
        const now = new Date().toISOString();

        const newComplaint: Complaint = {
            ...data,
            id: newId,
            ticketNumber: ticketNum,
            createdAt: now,
            updatedAt: now,
            timeline: [
                {
                    status: 'raised',
                    label: 'Complaint Raised',
                    timestamp: now,
                    updatedBy: data.residentName
                }
            ],
            comments: []
        };

        complaints = [newComplaint, ...complaints];
        saveState('complaints', complaints);

        // Auto trigger notification
        this.addNotification({
            title: 'New Complaint Raised',
            message: `${data.residentName} (${data.flatNumber}) logged: ${data.title}`,
            category: 'complaint',
            linkRoute: `/complaints/${newId}`
        });

        return newComplaint;
    },

    async updateComplaintStatus(
        id: string,
        newStatus: ComplaintStatus,
        updatedBy: string,
        note?: string,
        resolutionPhotoUrl?: string,
        workerInfo?: { workerId: string; workerName: string; workerPhone: string; avatar: string }
    ): Promise<Complaint | null> {
        await delay(400);
        const index = complaints.findIndex((c) => c.id === id);
        if (index === -1) return null;

        const current = complaints[index];
        const now = new Date().toISOString();

        const updatedTimeline = [
            ...current.timeline,
            {
                status: newStatus,
                label: `Status changed to ${newStatus.replace('_', ' ').toUpperCase()}`,
                timestamp: now,
                updatedBy,
                note
            }
        ];

        const updated: Complaint = {
            ...current,
            status: newStatus,
            updatedAt: now,
            timeline: updatedTimeline,
            ...(workerInfo && {
                assignedWorkerId: workerInfo.workerId,
                assignedWorkerName: workerInfo.workerName,
                assignedWorkerPhone: workerInfo.workerPhone,
                assignedWorkerAvatar: workerInfo.avatar
            }),
            ...(resolutionPhotoUrl && { resolutionPhotoUrl })
        };

        complaints[index] = updated;
        saveState('complaints', complaints);

        this.addNotification({
            title: `Ticket ${current.ticketNumber} Update`,
            message: `Status updated to ${newStatus.replace('_', ' ')} by ${updatedBy}`,
            category: 'complaint',
            linkRoute: `/complaints/${id}`
        });

        return updated;
    },

    async addComplaintComment(complaintId: string, authorName: string, authorRole: any, authorAvatar: string, text: string): Promise<Complaint | null> {
        await delay(300);
        const index = complaints.findIndex((c) => c.id === complaintId);
        if (index === -1) return null;

        const newComment = {
            id: `cmt_${Date.now()}`,
            authorName,
            authorRole,
            authorAvatar,
            text,
            timestamp: new Date().toISOString()
        };

        complaints[index] = {
            ...complaints[index],
            comments: [...complaints[index].comments, newComment],
            updatedAt: new Date().toISOString()
        };

        saveState('complaints', complaints);
        return complaints[index];
    },

    async reopenComplaint(complaintId: string, reason: string, residentName: string): Promise<Complaint | null> {
        await delay(400);
        return this.updateComplaintStatus(complaintId, 'in_progress', residentName, `Reopened: ${reason}`);
    },

    // FACILITIES & BOOKINGS
    async getFacilities(): Promise<Facility[]> {
        await delay();
        return [...facilities];
    },

    async getBookings(): Promise<AmenityBooking[]> {
        await delay();
        return [...bookings];
    },

    async createBooking(booking: Omit<AmenityBooking, 'id' | 'createdAt' | 'status'>): Promise<AmenityBooking> {
        await delay(400);
        const newBooking: AmenityBooking = {
            ...booking,
            id: `bk_${Date.now()}`,
            status: 'confirmed',
            createdAt: new Date().toISOString()
        };

        bookings = [newBooking, ...bookings];
        saveState('bookings', bookings);

        this.addNotification({
            title: 'Facility Booking Confirmed',
            message: `${booking.facilityName} booked for ${booking.date} (${booking.startTime}-${booking.endTime})`,
            category: 'amenity'
        });

        return newBooking;
    },

    async cancelBooking(bookingId: string): Promise<boolean> {
        await delay(300);
        const index = bookings.findIndex((b) => b.id === bookingId);
        if (index !== -1) {
            bookings[index].status = 'cancelled';
            saveState('bookings', bookings);
            return true;
        }
        return false;
    },

    // BILLS & PAYMENTS
    async getBills(): Promise<Bill[]> {
        await delay();
        return [...bills];
    },

    async payBill(billId: string, paymentMethod: string): Promise<Bill | null> {
        await delay(600);
        const index = bills.findIndex((b) => b.id === billId);
        if (index === -1) return null;

        const now = new Date().toISOString();
        const updated: Bill = {
            ...bills[index],
            status: 'paid',
            paymentDate: now,
            paymentMethod,
            transactionRef: `PAY-TXN-${Math.floor(10000000 + Math.random() * 90000000)}`
        };

        bills[index] = updated;
        saveState('bills', bills);

        this.addNotification({
            title: 'Payment Received',
            message: `Receipt generated for ${updated.monthYear} bill ₹${updated.amount}`,
            category: 'bill'
        });

        return updated;
    },

    async createBill(newBill: Omit<Bill, 'id' | 'status'>): Promise<Bill> {
        await delay(400);
        const created: Bill = {
            ...newBill,
            id: `bill_${Date.now()}`,
            status: 'pending'
        };
        bills = [created, ...bills];
        saveState('bills', bills);
        return created;
    },

    // VISITORS
    async getVisitors(): Promise<Visitor[]> {
        await delay();
        return [...visitors];
    },

    async createVisitor(visitor: Omit<Visitor, 'id' | 'entryCode' | 'status'>): Promise<Visitor> {
        await delay(400);
        const newVisitor: Visitor = {
            ...visitor,
            id: `vis_${Date.now()}`,
            entryCode: `HZ-${Math.floor(1000 + Math.random() * 9000)}`,
            status: 'approved'
        };

        visitors = [newVisitor, ...visitors];
        saveState('visitors', visitors);

        this.addNotification({
            title: 'Visitor Pass Generated',
            message: `Entry Code ${newVisitor.entryCode} generated for ${newVisitor.visitorName}`,
            category: 'visitor'
        });

        return newVisitor;
    },

    async preRegisterVisitor(visitor: Omit<Visitor, 'id' | 'entryCode' | 'status'> & { status?: Visitor['status'] }): Promise<Visitor> {
        return this.createVisitor(visitor);
    },

    async updateVisitorStatus(visitorId: string, status: Visitor['status']): Promise<boolean> {
        await delay(300);
        const index = visitors.findIndex((v) => v.id === visitorId);
        if (index !== -1) {
            const now = new Date().toISOString();
            visitors[index].status = status;
            if (status === 'checked_in') visitors[index].checkInTime = now;
            if (status === 'checked_out') visitors[index].checkOutTime = now;
            saveState('visitors', visitors);
            return true;
        }
        return false;
    },

    // DELIVERIES
    async getDeliveries(): Promise<Delivery[]> {
        await delay();
        return [...deliveries];
    },

    async markDeliveryCollected(deliveryId: string): Promise<boolean> {
        await delay(300);
        const index = deliveries.findIndex((d) => d.id === deliveryId);
        if (index !== -1) {
            deliveries[index].status = 'collected';
            deliveries[index].collectedAt = new Date().toISOString();
            saveState('deliveries', deliveries);
            return true;
        }
        return false;
    },

    // STAFF
    async getStaff(): Promise<StaffMember[]> {
        await delay();
        return [...staff];
    },

    async createStaff(newStaff: Omit<StaffMember, 'id' | 'completedTasksCount' | 'joinedDate'>): Promise<StaffMember> {
        await delay(400);
        const created: StaffMember = {
            ...newStaff,
            id: `usr_stf_${Date.now()}`,
            completedTasksCount: 0,
            joinedDate: new Date().toISOString().split('T')[0]
        };
        staff = [created, ...staff];
        saveState('staff', staff);
        return created;
    },

    // INVENTORY & MATERIAL REQUESTS
    async getInventory(): Promise<InventoryItem[]> {
        await delay();
        return [...inventory];
    },

    async updateInventoryStock(id: string, delta: number): Promise<InventoryItem | null> {
        await delay(300);
        const index = inventory.findIndex((item) => item.id === id);
        if (index === -1) return null;

        inventory[index].quantity = Math.max(0, inventory[index].quantity + delta);
        inventory[index].lastRestocked = new Date().toISOString().split('T')[0];
        saveState('inventory', inventory);
        return inventory[index];
    },

    async addInventoryItem(item: Omit<InventoryItem, 'id' | 'lastRestocked'>): Promise<InventoryItem> {
        await delay(400);
        const created: InventoryItem = {
            ...item,
            id: `inv_${Date.now()}`,
            lastRestocked: new Date().toISOString().split('T')[0]
        };
        inventory = [created, ...inventory];
        saveState('inventory', inventory);
        return created;
    },

    async getMaterialRequests(): Promise<MaterialRequest[]> {
        await delay();
        return [...materialRequests];
    },

    async createMaterialRequest(request: Partial<MaterialRequest> & { itemName: string; unit: string; reason: string }): Promise<MaterialRequest> {
        await delay(400);
        const qty = request.quantityRequested || request.quantity || 1;
        const staffNameVal = request.staffName || request.requestedBy || 'Staff Member';
        const created: MaterialRequest = {
            id: `mat_req_${Date.now()}`,
            staffId: request.staffId || 'stf_1',
            staffName: staffNameVal,
            requestedBy: staffNameVal,
            itemName: request.itemName,
            quantityRequested: qty,
            quantity: qty,
            unit: request.unit,
            reason: request.reason,
            priority: request.priority || 'medium',
            urgency: request.urgency || 'medium',
            status: 'pending',
            requestedAt: new Date().toISOString().split('T')[0]
        };
        materialRequests = [created, ...materialRequests];
        saveState('materialRequests', materialRequests);

        this.addNotification({
            title: 'New Material Request',
            message: `${staffNameVal} requested ${qty} ${request.unit} of ${request.itemName}`,
            category: 'system'
        });

        return created;
    },

    async updateMaterialRequestStatus(id: string, status: MaterialRequest['status']): Promise<boolean> {
        await delay(300);
        const index = materialRequests.findIndex((r) => r.id === id);
        if (index !== -1) {
            materialRequests[index].status = status;
            saveState('materialRequests', materialRequests);
            return true;
        }
        return false;
    },

    // ANNOUNCEMENTS
    async getAnnouncements(): Promise<Announcement[]> {
        await delay();
        return [...announcements];
    },

    async createAnnouncement(announcement: Omit<Announcement, 'id' | 'readByCount'> & { publishedAt?: string }): Promise<Announcement> {
        await delay(400);
        const created: Announcement = {
            ...announcement,
            id: `ann_${Date.now()}`,
            publishedAt: new Date().toISOString(),
            readByCount: 0
        };
        announcements = [created, ...announcements];
        saveState('announcements', announcements);

        this.addNotification({
            title: 'New Announcement',
            message: created.title,
            category: 'announcement',
            linkRoute: '/announcements'
        });

        return created;
    },

    // NOTIFICATIONS
    async getNotifications(): Promise<NotificationItem[]> {
        await delay();
        return [...notifications];
    },

    async markNotificationRead(id: string): Promise<void> {
        const index = notifications.findIndex((n) => n.id === id);
        if (index !== -1) {
            notifications[index].isRead = true;
            saveState('notifications', notifications);
        }
    },

    async markAllNotificationsRead(): Promise<void> {
        notifications = notifications.map((n) => ({ ...n, isRead: true }));
        saveState('notifications', notifications);
    },

    addNotification(item: Omit<NotificationItem, 'id' | 'timestamp' | 'isRead'>): void {
        const created: NotificationItem = {
            ...item,
            id: `notif_${Date.now()}`,
            timestamp: 'Just now',
            isRead: false
        };
        notifications = [created, ...notifications];
        saveState('notifications', notifications);
    },

    // RESIDENTS
    async getResidents(): Promise<any[]> {
        await delay();
        return [
            {
                id: 'res_1',
                name: 'Vikramaditya Sharma',
                email: 'vikram.s@horizon.com',
                phone: '+91 98201 12345',
                flatNumber: 'A-402',
                wing: 'A Wing',
                ownershipType: 'Owner',
                occupancyStatus: 'Owner Occupied',
                occupantsCount: 4,
                status: 'Active',
                avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
                vehicles: [
                    { type: 'Car', number: 'MH 04 AB 1234', slot: 'P-12' },
                    { type: 'Bike', number: 'MH 04 CD 5678', slot: 'B-04' }
                ]
            },
            {
                id: 'res_2',
                name: 'Ananya Deshmukh',
                email: 'ananya.d@gmail.com',
                phone: '+91 98920 67890',
                flatNumber: 'B-701',
                wing: 'B Wing',
                ownershipType: 'Tenant',
                occupancyStatus: 'Tenant Rented',
                occupantsCount: 2,
                status: 'Active',
                avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
                vehicles: [{ type: 'Car', number: 'MH 02 EF 9012', slot: 'P-45' }]
            },
            {
                id: 'res_3',
                name: 'Rajesh Mehta',
                email: 'rajesh.m@horizon.com',
                phone: '+91 98333 44556',
                flatNumber: 'C-104',
                wing: 'C Wing',
                ownershipType: 'Owner',
                occupancyStatus: 'Owner Occupied',
                occupantsCount: 5,
                status: 'Active',
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
                vehicles: [{ type: 'Bike', number: 'MH 04 XY 7890', slot: 'B-19' }]
            }
        ];
    },

    async addResident(data: any): Promise<any> {
        await delay(400);
        return { id: `res_${Date.now()}`, ...data };
    },

    // ASSIGN WORKER
    async assignWorker(complaintId: string, workerId: string, workerName: string, designation: string): Promise<Complaint | null> {
        return this.updateComplaintStatus(complaintId, 'assigned', 'Admin', `Assigned to ${workerName} (${designation})`, undefined, {
            workerId,
            workerName,
            workerPhone: '+91 98765 43210',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
        });
    },

    // AMENITIES / FACILITIES
    async getAmenities(): Promise<any[]> {
        const facs = await this.getFacilities();
        return facs.map((f) => ({
            ...f,
            status: f.isAvailable ? 'available' : 'maintenance',
            hourlyRate: f.hourlyRate
        }));
    },

    async addAmenity(data: any): Promise<any> {
        return this.createBooking(data as any);
    },

    async updateAmenityStatus(id: string, status: 'available' | 'maintenance'): Promise<boolean> {
        await delay(300);
        const index = facilities.findIndex((f) => f.id === id);
        if (index !== -1) {
            facilities[index].isAvailable = status === 'available';
            saveState('facilities', facilities);
            return true;
        }
        return true;
    },

    // ALIASED HELPER METHODS
    async addStaffMember(data: any): Promise<StaffMember> {
        return this.createStaff(data);
    },

    async deleteAnnouncement(id: string): Promise<boolean> {
        await delay(300);
        announcements = announcements.filter((a) => a.id !== id);
        saveState('announcements', announcements);
        return true;
    },

    // STATS
    async getStats(): Promise<SocietyStats> {
        await delay();
        const openCmpl = complaints.filter((c) => c.status !== 'closed' && c.status !== 'resolved').length;
        const lowInv = inventory.filter((i) => i.quantity <= i.minThreshold).length;
        const todayBk = bookings.filter((b) => b.status === 'confirmed').length;

        return {
            ...INITIAL_SOCIETY_STATS,
            openComplaints: openCmpl,
            lowInventoryItems: lowInv,
            todayBookings: todayBk
        };
    }
};

