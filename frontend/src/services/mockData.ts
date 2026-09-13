import {
    User,
    Resident,
    Complaint,
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
    SocietyStats
} from '../types';

export const CURRENT_USER_RESIDENT: User = {
    id: 'usr_res_1',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@horizon.com',
    phone: '+91 98765 43210',
    role: 'resident',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    flatNumber: 'B-402',
    wing: 'B Wing',
};

export const CURRENT_USER_STAFF: User = {
    id: 'usr_stf_1',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@horizon.com',
    phone: '+91 98123 45678',
    role: 'staff',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    specialization: 'Plumbing',
    department: 'Maintenance & Repairs',
    designation: 'Senior Maintenance Engineer',
};

export const CURRENT_USER_ADMIN: User = {
    id: 'usr_adm_1',
    name: 'Priya Mukherjee',
    email: 'priya.admin@horizon.com',
    phone: '+91 99887 76655',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    designation: 'Society Management Secretary',
};

export const INITIAL_COMPLAINTS: Complaint[] = [
    {
        id: 'cmp_101',
        ticketNumber: 'CMP-2026-089',
        title: 'Water Leakage under Kitchen Sink',
        category: 'Plumbing',
        description: 'There is a persistent water leakage coming from the main drain pipe beneath the kitchen sink. Water pool is accumulating rapidly.',
        priority: 'high',
        status: 'in_progress',
        location: 'Kitchen Sink Area',
        flatNumber: 'B-402',
        residentName: 'Aarav Sharma',
        residentPhone: '+91 98765 43210',
        assignedWorkerId: 'usr_stf_1',
        assignedWorkerName: 'Rajesh Kumar',
        assignedWorkerPhone: '+91 98123 45678',
        assignedWorkerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        createdAt: '2026-09-02T10:15:00Z',
        updatedAt: '2026-09-03T14:30:00Z',
        photoUrl: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=600&auto=format&fit=crop&q=80',
        workNotes: 'Replaced the main PVC coupling joint and sealed with waterproof Teflon tape. Testing pressure.',
        timeline: [
            { status: 'raised', label: 'Complaint Raised', timestamp: '2026-09-02T10:15:00Z', updatedBy: 'Aarav Sharma' },
            { status: 'acknowledged', label: 'Acknowledged by Helpdesk', timestamp: '2026-09-02T10:45:00Z', updatedBy: 'Admin Desk' },
            { status: 'assigned', label: 'Assigned to Rajesh Kumar', timestamp: '2026-09-02T11:30:00Z', updatedBy: 'Admin Desk' },
            { status: 'accepted', label: 'Accepted by Technician', timestamp: '2026-09-02T12:00:00Z', updatedBy: 'Rajesh Kumar' },
            { status: 'in_progress', label: 'Work Started on Site', timestamp: '2026-09-03T14:30:00Z', updatedBy: 'Rajesh Kumar', note: 'Procured sealant pipe fitting' }
        ],
        comments: [
            {
                id: 'cmt_1',
                authorName: 'Rajesh Kumar',
                authorRole: 'staff',
                authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
                text: 'I will visit your flat around 2:30 PM today after finishing the tower A line repair.',
                timestamp: '2026-09-03T11:00:00Z'
            },
            {
                id: 'cmt_2',
                authorName: 'Aarav Sharma',
                authorRole: 'resident',
                authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
                text: 'Sounds good, someone will be at home to grant entry.',
                timestamp: '2026-09-03T11:20:00Z'
            }
        ],
        requiredMaterials: [
            { itemId: 'inv_1', name: 'PVC Pipe Joint 2-inch', quantity: 1 },
            { itemId: 'inv_2', name: 'Teflon Waterproof Tape', quantity: 2 }
        ]
    },
    {
        id: 'cmp_102',
        ticketNumber: 'CMP-2026-092',
        title: 'Main Bedroom Ceiling Light Sparking',
        category: 'Electrical',
        description: 'The main ceiling light fixture flickers and emits a buzzing sound when switched on. Potential loose wiring.',
        priority: 'urgent',
        status: 'assigned',
        location: 'Master Bedroom',
        flatNumber: 'B-402',
        residentName: 'Aarav Sharma',
        residentPhone: '+91 98765 43210',
        assignedWorkerId: 'usr_stf_2',
        assignedWorkerName: 'Suresh Patil',
        assignedWorkerPhone: '+91 98333 22110',
        assignedWorkerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        createdAt: '2026-09-04T08:30:00Z',
        updatedAt: '2026-09-04T09:15:00Z',
        timeline: [
            { status: 'raised', label: 'Complaint Raised', timestamp: '2026-09-04T08:30:00Z', updatedBy: 'Aarav Sharma' },
            { status: 'acknowledged', label: 'Acknowledged', timestamp: '2026-09-04T08:45:00Z', updatedBy: 'System Auto' },
            { status: 'assigned', label: 'Assigned to Suresh Patil', timestamp: '2026-09-04T09:15:00Z', updatedBy: 'Priya Mukherjee' }
        ],
        comments: []
    },
    {
        id: 'cmp_103',
        ticketNumber: 'CMP-2026-078',
        title: 'Elevator B-Wing Making Vibration Sound',
        category: 'Elevator',
        description: 'Elevator #2 in Wing B vibrates significantly while moving between 3rd and 5th floors.',
        priority: 'high',
        status: 'resolved',
        location: 'B-Wing Lift Lobby',
        flatNumber: 'Public Area',
        residentName: 'Vikram Mehta',
        residentPhone: '+91 98222 11000',
        assignedWorkerId: 'usr_stf_3',
        assignedWorkerName: 'Elevator Tech Services',
        assignedWorkerPhone: '+91 1800 200 9999',
        createdAt: '2026-08-28T14:00:00Z',
        updatedAt: '2026-08-29T17:00:00Z',
        workNotes: 'Replaced wear-and-tear guide shoe pads on lift car rail. Rebalanced weights.',
        feedbackRating: 5,
        feedbackComment: 'Prompt fix! Smooth ride restored.',
        timeline: [
            { status: 'raised', label: 'Raised', timestamp: '2026-08-28T14:00:00Z', updatedBy: 'Vikram Mehta' },
            { status: 'resolved', label: 'Resolved & Tested', timestamp: '2026-08-29T17:00:00Z', updatedBy: 'Elevator Tech Services' },
            { status: 'closed', label: 'Verified & Closed', timestamp: '2026-08-30T09:00:00Z', updatedBy: 'Vikram Mehta' }
        ],
        comments: []
    },
    {
        id: 'cmp_104',
        ticketNumber: 'CMP-2026-095',
        title: 'Garbage Chute Clog on 4th Floor',
        category: 'Cleaning & Sanitation',
        description: 'The garbage chute door is jammed with a large cardboard box causing odor in hallway.',
        priority: 'medium',
        status: 'raised',
        location: '4th Floor Corridor B-Wing',
        flatNumber: 'B-402',
        residentName: 'Aarav Sharma',
        residentPhone: '+91 98765 43210',
        createdAt: '2026-09-04T11:00:00Z',
        updatedAt: '2026-09-04T11:00:00Z',
        timeline: [
            { status: 'raised', label: 'Complaint Raised', timestamp: '2026-09-04T11:00:00Z', updatedBy: 'Aarav Sharma' }
        ],
        comments: []
    }
];

export const INITIAL_FACILITIES: Facility[] = [
    {
        id: 'fac_1',
        name: 'Clubhouse Banquet Hall',
        category: 'Event Venue',
        description: 'Air-conditioned luxury hall with stage, sound system, and catering kitchen setup. Ideal for birthday parties, family functions, and society get-togethers.',
        image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&auto=format&fit=crop&q=80',
        capacity: 150,
        hourlyRate: 1500,
        timing: '09:00 AM - 11:00 PM',
        rules: [
            'No loud music post 10:00 PM as per municipal guidelines.',
            'Decoration using tape only; no nails on walls.',
            'Catering cleanup must be completed within 1 hour post event.'
        ],
        isAvailable: true
    },
    {
        id: 'fac_2',
        name: 'Olympic Style Swimming Pool',
        category: 'Sports & Wellness',
        description: 'Temperature-controlled outdoor pool with dedicated kid splash area, sun loungers, and certified lifeguard on duty.',
        image: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=600&auto=format&fit=crop&q=80',
        capacity: 30,
        hourlyRate: 0,
        timing: '06:00 AM - 09:00 PM',
        rules: [
            'Proper swimming attire is compulsory.',
            'Shower before entering the pool.',
            'Children below 10 must be accompanied by an adult.'
        ],
        isAvailable: true
    },
    {
        id: 'fac_3',
        name: 'Synthetic Tennis Court',
        category: 'Sports',
        description: 'Floodlit professional hard court with high-grade synthetic turf and net facility.',
        image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=600&auto=format&fit=crop&q=80',
        capacity: 4,
        hourlyRate: 300,
        timing: '06:00 AM - 10:00 PM',
        rules: [
            'Non-marking sports shoes mandatory.',
            'Maximum 1 hour booking slot per flat per day.'
        ],
        isAvailable: true
    },
    {
        id: 'fac_4',
        name: 'Modern Fitness Gym',
        category: 'Fitness',
        description: 'Fully equipped gym featuring Matrix cardio treadmills, cross trainers, free weights, and multi-gym stations.',
        image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80',
        capacity: 25,
        hourlyRate: 0,
        timing: '05:30 AM - 10:30 PM',
        rules: [
            'Wipe down equipment after use.',
            'Re-rack weights after usage.'
        ],
        isAvailable: true
    }
];

export const INITIAL_BOOKINGS: AmenityBooking[] = [
    {
        id: 'bk_1',
        facilityId: 'fac_1',
        facilityName: 'Clubhouse Banquet Hall',
        facilityImage: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&auto=format&fit=crop&q=80',
        residentId: 'usr_res_1',
        residentName: 'Aarav Sharma',
        flatNumber: 'B-402',
        date: '2026-09-12',
        startTime: '17:00',
        endTime: '21:00',
        guestsCount: 45,
        totalAmount: 6000,
        status: 'confirmed',
        createdAt: '2026-09-01T15:00:00Z'
    },
    {
        id: 'bk_2',
        facilityId: 'fac_3',
        facilityName: 'Synthetic Tennis Court',
        facilityImage: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=600&auto=format&fit=crop&q=80',
        residentId: 'usr_res_1',
        residentName: 'Aarav Sharma',
        flatNumber: 'B-402',
        date: '2026-09-05',
        startTime: '07:00',
        endTime: '08:00',
        guestsCount: 2,
        totalAmount: 300,
        status: 'confirmed',
        createdAt: '2026-09-03T18:30:00Z'
    }
];

export const INITIAL_BILLS: Bill[] = [
    {
        id: 'bill_901',
        billNumber: 'INV-2026-SEP-B402',
        flatNumber: 'B-402',
        residentName: 'Aarav Sharma',
        monthYear: 'September 2026',
        issueDate: '2026-09-01',
        dueDate: '2026-09-15',
        amount: 4850,
        lateFee: 250,
        status: 'pending',
        breakdown: [
            { description: 'Society Maintenance Charge', amount: 3500 },
            { description: 'Water & Sewage Charge', amount: 650 },
            { description: 'Clubhouse & Gym Access', amount: 400 },
            { description: 'Sinking Fund Reserve', amount: 300 }
        ]
    },
    {
        id: 'bill_801',
        billNumber: 'INV-2026-AUG-B402',
        flatNumber: 'B-402',
        residentName: 'Aarav Sharma',
        monthYear: 'August 2026',
        issueDate: '2026-08-01',
        dueDate: '2026-08-15',
        amount: 4850,
        lateFee: 0,
        status: 'paid',
        paymentDate: '2026-08-10T11:24:00Z',
        paymentMethod: 'UPI / HDFC Bank',
        transactionRef: 'PAY-UPI-982103984',
        breakdown: [
            { description: 'Society Maintenance Charge', amount: 3500 },
            { description: 'Water & Sewage Charge', amount: 650 },
            { description: 'Clubhouse & Gym Access', amount: 400 },
            { description: 'Sinking Fund Reserve', amount: 300 }
        ]
    },
    {
        id: 'bill_701',
        billNumber: 'INV-2026-JUL-B402',
        flatNumber: 'B-402',
        residentName: 'Aarav Sharma',
        monthYear: 'July 2026',
        issueDate: '2026-07-01',
        dueDate: '2026-07-15',
        amount: 4700,
        lateFee: 0,
        status: 'paid',
        paymentDate: '2026-07-08T14:15:00Z',
        paymentMethod: 'Credit Card',
        transactionRef: 'PAY-CC-771829304',
        breakdown: [
            { description: 'Society Maintenance Charge', amount: 3500 },
            { description: 'Water & Sewage Charge', amount: 500 },
            { description: 'Clubhouse & Gym Access', amount: 400 },
            { description: 'Sinking Fund Reserve', amount: 300 }
        ]
    }
];

export const INITIAL_VISITORS: Visitor[] = [
    {
        id: 'vis_1',
        visitorName: 'Rohan Deshmukh',
        phone: '+91 97111 22334',
        visitorType: 'Guest',
        flatNumber: 'B-402',
        residentName: 'Aarav Sharma',
        expectedDate: '2026-09-04',
        expectedTime: '18:00',
        entryCode: 'HZ-8921',
        vehicleNumber: 'MH-12-AB-4567',
        status: 'approved',
        purpose: 'Dinner Invitation'
    },
    {
        id: 'vis_2',
        visitorName: 'Amazon Logistics (Vikas)',
        phone: '+91 98990 01122',
        visitorType: 'Delivery',
        flatNumber: 'B-402',
        residentName: 'Aarav Sharma',
        expectedDate: '2026-09-04',
        expectedTime: '14:30',
        entryCode: 'HZ-3104',
        status: 'checked_in',
        checkInTime: '2026-09-04T14:25:00Z',
        purpose: 'Package Delivery'
    },
    {
        id: 'vis_3',
        visitorName: 'Urban Company AC Service',
        phone: '+91 99000 88776',
        visitorType: 'Service Technician',
        flatNumber: 'B-402',
        residentName: 'Aarav Sharma',
        expectedDate: '2026-09-01',
        expectedTime: '11:00',
        entryCode: 'HZ-1049',
        status: 'checked_out',
        checkInTime: '2026-09-01T11:05:00Z',
        checkOutTime: '2026-09-01T12:40:00Z',
        purpose: 'AC Cleaning & Filter Replacement'
    }
];

export const INITIAL_DELIVERIES: Delivery[] = [
    {
        id: 'del_101',
        trackingNumber: 'AZ-98127391',
        courierCompany: 'Amazon',
        flatNumber: 'B-402',
        residentName: 'Aarav Sharma',
        packageCount: 2,
        deliveredAt: '2026-09-04T14:28:00Z',
        status: 'pending_collection',
        otp: '4829'
    },
    {
        id: 'del_102',
        trackingNumber: 'FK-77162940',
        courierCompany: 'Flipkart',
        flatNumber: 'B-402',
        residentName: 'Aarav Sharma',
        packageCount: 1,
        deliveredAt: '2026-09-02T16:10:00Z',
        status: 'collected',
        collectedAt: '2026-09-02T19:45:00Z',
        otp: '9102'
    }
];

export const INITIAL_STAFF: StaffMember[] = [
    {
        id: 'usr_stf_1',
        name: 'Rajesh Kumar',
        phone: '+91 98123 45678',
        email: 'rajesh.kumar@horizon.com',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        specialization: 'Plumbing',
        shift: '09:00 AM - 06:00 PM',
        currentWorkload: 3,
        rating: 4.8,
        status: 'On Task',
        completedTasksCount: 142,
        joinedDate: '2024-03-15'
    },
    {
        id: 'usr_stf_2',
        name: 'Suresh Patil',
        phone: '+91 98333 22110',
        email: 'suresh.patil@horizon.com',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        specialization: 'Electrical',
        shift: '08:00 AM - 05:00 PM',
        currentWorkload: 2,
        rating: 4.9,
        status: 'On Task',
        completedTasksCount: 198,
        joinedDate: '2023-11-01'
    },
    {
        id: 'usr_stf_3',
        name: 'Manish Verma',
        phone: '+91 97666 55443',
        email: 'manish.v@horizon.com',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
        specialization: 'Cleaning & Sanitation',
        shift: '07:00 AM - 04:00 PM',
        currentWorkload: 1,
        rating: 4.7,
        status: 'Available',
        completedTasksCount: 220,
        joinedDate: '2023-08-10'
    },
    {
        id: 'usr_stf_4',
        name: 'Deepak Thorat',
        phone: '+91 98999 11223',
        email: 'deepak.t@horizon.com',
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
        specialization: 'Carpentry',
        shift: '09:00 AM - 06:00 PM',
        currentWorkload: 0,
        rating: 4.6,
        status: 'Available',
        completedTasksCount: 95,
        joinedDate: '2024-05-20'
    }
];

export const INITIAL_INVENTORY: InventoryItem[] = [
    {
        id: 'inv_1',
        name: 'PVC Pipe Joint 2-inch',
        category: 'Plumbing',
        quantity: 8,
        unit: 'pcs',
        minThreshold: 15,
        unitPrice: 120,
        location: 'Shelf B-2 (Plumbing Bay)',
        lastRestocked: '2026-08-20'
    },
    {
        id: 'inv_2',
        name: 'Teflon Waterproof Tape',
        category: 'Plumbing',
        quantity: 45,
        unit: 'rolls',
        minThreshold: 20,
        unitPrice: 35,
        location: 'Drawer A-4',
        lastRestocked: '2026-08-25'
    },
    {
        id: 'inv_3',
        name: 'LED Tube Light 20W',
        category: 'Electrical',
        quantity: 4,
        unit: 'pcs',
        minThreshold: 10,
        unitPrice: 320,
        location: 'Rack C-1',
        lastRestocked: '2026-07-15'
    },
    {
        id: 'inv_4',
        name: 'MCB Circuit Breaker 16A',
        category: 'Electrical',
        quantity: 12,
        unit: 'pcs',
        minThreshold: 8,
        unitPrice: 450,
        location: 'Rack C-3',
        lastRestocked: '2026-08-10'
    },
    {
        id: 'inv_5',
        name: 'Floor Cleaning Sanitizer Liquid',
        category: 'Cleaning',
        quantity: 30,
        unit: 'liters',
        minThreshold: 25,
        unitPrice: 180,
        location: 'Store Room 2',
        lastRestocked: '2026-09-01'
    }
];

export const INITIAL_MATERIAL_REQUESTS: MaterialRequest[] = [
    {
        id: 'mat_req_101',
        staffId: 'usr_stf_1',
        staffName: 'Rajesh Kumar',
        complaintId: 'cmp_101',
        itemName: 'PVC Pipe Joint 2-inch',
        quantityRequested: 10,
        unit: 'pcs',
        reason: 'Stock running below threshold for emergency plumbing fixes across B Wing',
        priority: 'high',
        status: 'pending',
        requestedAt: '2026-09-03T15:00:00Z'
    }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
    {
        id: 'ann_1',
        title: 'Scheduled Water Supply Tank Cleaning (B Wing)',
        content: 'Please be informed that the overhead water tank of B-Wing will undergo annual deep cleaning and chlorination on Saturday, 6th September from 10:00 AM to 02:00 PM. Water pressure will be temporarily affected. Please store adequate water in advance.',
        category: 'Maintenance',
        authorName: 'Priya Mukherjee',
        authorRole: 'Society Management Secretary',
        targetAudience: 'all',
        status: 'published',
        isPinned: true,
        publishedAt: '2026-09-03T09:00:00Z',
        readByCount: 142
    },
    {
        id: 'ann_2',
        title: 'Ganesh Chaturthi Cultural Night Registration Open',
        content: 'Grand Horizon Heights Society is organizing a 3-day Ganesh Festival celebration in the Central Lawn starting 15th September. Resident performances and stalls registration is now open at the Secretary office.',
        category: 'Event',
        authorName: 'Cultural Committee',
        authorRole: 'Event Coordinator',
        targetAudience: 'residents',
        status: 'published',
        isPinned: false,
        publishedAt: '2026-09-02T14:30:00Z',
        readByCount: 215
    },
    {
        id: 'ann_3',
        title: 'Updated Visitor Gate Pass Protocol',
        content: 'Security Guards at Gate #1 and Gate #2 have been equipped with biometric handheld scanners. All pre-registered visitors must show their 6-digit entry code for instant check-in.',
        category: 'General',
        authorName: 'Priya Mukherjee',
        authorRole: 'Secretary',
        targetAudience: 'all',
        status: 'published',
        isPinned: false,
        publishedAt: '2026-08-30T10:00:00Z',
        readByCount: 310
    }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
    {
        id: 'notif_1',
        title: 'Complaint Update',
        message: 'Rajesh Kumar started working on your ticket #CMP-2026-089 (Water Leakage).',
        timestamp: '10 mins ago',
        isRead: false,
        category: 'complaint',
        linkRoute: '/complaints/cmp_101'
    },
    {
        id: 'notif_2',
        title: 'Delivery Arrived',
        message: 'Amazon courier dropped 2 packages at Main Gate Guard Desk.',
        timestamp: '1 hour ago',
        isRead: false,
        category: 'visitor',
        linkRoute: '/deliveries'
    },
    {
        id: 'notif_3',
        title: 'Maintenance Bill Generated',
        message: 'September 2026 Maintenance Bill of ₹4,850 is due on 15th Sep.',
        timestamp: '2 days ago',
        isRead: true,
        category: 'bill',
        linkRoute: '/bills'
    },
    {
        id: 'notif_4',
        title: 'Amenity Booking Confirmed',
        message: 'Banquet Hall reserved for Sep 12, 5:00 PM.',
        timestamp: '3 days ago',
        isRead: true,
        category: 'amenity',
        linkRoute: '/amenities'
    }
];

export const INITIAL_SOCIETY_STATS: SocietyStats = {
    totalResidents: 348,
    openComplaints: 12,
    overdueTasks: 2,
    activeStaff: 14,
    todayBookings: 3,
    outstandingDues: 84500,
    lowInventoryItems: 2,
    activeVisitors: 5
};

export const INITIAL_RESIDENTS: Resident[] = [
    {
        id: 'res_1',
        name: 'Aarav Sharma',
        email: 'aarav.sharma@horizon.com',
        phone: '+91 98765 43210',
        flatNumber: 'B-402',
        wing: 'Wing B',
        occupancyStatus: 'Owner',
        familyMembersCount: 4,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        vehicles: [
            { type: 'Car', number: 'MH 04 AB 1234' },
            { type: 'Bike', number: 'MH 04 CD 5678' }
        ]
    },
    {
        id: 'res_2',
        name: 'Ananya Deshmukh',
        email: 'ananya.d@gmail.com',
        phone: '+91 98920 67890',
        flatNumber: 'B-701',
        wing: 'Wing B',
        occupancyStatus: 'Tenant',
        familyMembersCount: 2,
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
        vehicles: [{ type: 'Car', number: 'MH 02 EF 9012' }]
    },
    {
        id: 'res_3',
        name: 'Vikramaditya Verma',
        email: 'vikram.v@horizon.com',
        phone: '+91 98201 12345',
        flatNumber: 'A-402',
        wing: 'Wing A',
        occupancyStatus: 'Owner',
        familyMembersCount: 5,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        vehicles: [{ type: 'Bike', number: 'MH 04 XY 7890' }]
    }
];
