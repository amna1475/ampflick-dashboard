// Demo users — stand-ins until a real backend/auth system is connected.
// NOTE: storing plain-text passwords like this is only OK for local demo data.
// A real backend must hash passwords and never send them to the frontend.

export const mockUsers = [
  {
    id: 'u1',
    name: 'Alex Thompson',
    email: 'alex@ampflick.com',
    password: 'admin123',
    role: 'Admin',
    status: 'Active',
  },
  {
    id: 'u2',
    name: 'Sara Malik',
    email: 'sara@ampflick.com',
    password: 'manager123',
    role: 'Manager',
    status: 'Active',
  },
  {
    id: 'u3',
    name: 'Bilal Khan',
    email: 'bilal@ampflick.com',
    password: 'viewer123',
    role: 'Viewer',
    status: 'Active',
  },
]

export const roleOptions = ['Admin', 'Manager', 'Viewer']