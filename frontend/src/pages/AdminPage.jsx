import React, { useState, useEffect } from 'react';
import {
  Package,
  Calendar,
  Plus,
  Search,
  Save,
  Users,
  DollarSign,
  TrendingUp,
  MapPin,
  Clock,
  AlertCircle,
} from 'lucide-react';

// Mock axios instance for demo
const axiosInstance = {
  post: async (url, data) => {
    console.log('POST request to:', url, data);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            event: {
              _id: Date.now().toString(),
              name: data.name,
              description: data.description,
              image: data.image,
              date: data.date,
              registrationLink: data.registrationLink,
              createdBy: 'admin-id',
              registered: 0,
              capacity: 100,
              status: 'upcoming'
            }
          }
        });
      }, 500);
    });
  },
  get: async (url) => {
    console.log('GET request to:', url);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            events: [
              {
                _id: '1',
                name: 'Annual Stamp Exhibition',
                description: 'Join us for the biggest stamp exhibition of the year featuring rare collections from around the world.',
                date: '2024-03-15T09:00:00Z',
                registrationLink: 'Convention Center, New York',
                image: 'https://via.placeholder.com/400x200/4f46e5/ffffff?text=Stamp+Exhibition',
                registered: 245,
                capacity: 500,
                status: 'upcoming'
              },
              {
                _id: '2',
                name: 'Coin Collectors Meetup',
                description: 'Monthly meetup for coin collectors and enthusiasts to share knowledge and trade items.',
                date: '2024-02-20T18:00:00Z',
                registrationLink: 'Community Hall, Boston',
                image: 'https://via.placeholder.com/400x200/059669/ffffff?text=Coin+Meetup',
                registered: 78,
                capacity: 100,
                status: 'upcoming'
              },
              {
                _id: '3',
                name: 'Vintage Postcard Show',
                description: 'Discover and collect vintage postcards from the early 1900s to modern era.',
                date: '2024-01-10T10:00:00Z',
                registrationLink: 'Heritage Museum, Chicago',
                image: 'https://via.placeholder.com/400x200/dc2626/ffffff?text=Postcard+Show',
                registered: 156,
                capacity: 200,
                status: 'completed'
              }
            ]
          }
        });
      }, 300);
    });
  },
  put: async (url, data) => {
    console.log('PUT request to:', url, data);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            event: { ...data, _id: url.split('/').pop() }
          }
        });
      }, 500);
    });
  },
  delete: async (url) => {
    console.log('DELETE request to:', url);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: { message: 'Event deleted successfully' } });
      }, 300);
    });
  }
};

// Enhanced API functions that match your backend
const fetchEvents = async () => {
  try {
    const response = await axiosInstance.get('/events');
    return response.data.events;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

const createEvent = async (formData) => {
  try {
    const payload = {
      name: formData.title,
      description: formData.description,
      image: formData.imageUrl,
      date: formData.date,
      registrationLink: formData.location
    };
    
    const response = await axiosInstance.post('/events/setup', payload);
    return response.data.event;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};

// UI Components
const Button = ({ children, onClick, variant = 'default', size = 'default', type = 'button', className = '', disabled = false }) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variants = {
    default: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500',
    destructive: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500'
  };
  const sizes = {
    default: 'h-10 px-4 py-2',
    sm: 'h-8 px-3 py-1 text-sm',
    lg: 'h-12 px-6 py-3 text-lg'
  };
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  );
};

const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children, className = '' }) => (
  <div className={`px-6 py-4 border-b border-gray-200 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>
    {children}
  </h3>
);

const CardContent = ({ children, className = '' }) => (
  <div className={`px-6 py-4 ${className}`}>
    {children}
  </div>
);

const Input = ({ type = 'text', placeholder, value, onChange, className = '', required = false, id }) => (
  <input
    type={type}
    id={id}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    required={required}
    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
  />
);

const Textarea = ({ placeholder, value, onChange, rows = 3, className = '', required = false, id }) => (
  <textarea
    id={id}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    rows={rows}
    required={required}
    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${className}`}
  />
);

const Label = ({ htmlFor, children, className = '' }) => (
  <label htmlFor={htmlFor} className={`block text-sm font-medium text-gray-700 mb-1 ${className}`}>
    {children}
  </label>
);

const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-blue-100 text-blue-800',
    secondary: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    destructive: 'bg-red-100 text-red-800'
  };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

const Dialog = ({ open, onOpenChange, children }) => {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => onOpenChange(false)} />
      <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

const DialogHeader = ({ children }) => (
  <div className="px-6 py-4 border-b border-gray-200">
    {children}
  </div>
);

const DialogTitle = ({ children }) => (
  <h2 className="text-lg font-semibold text-gray-900">
    {children}
  </h2>
);

const DialogContent = ({ children }) => (
  <div className="px-6 py-4">
    {children}
  </div>
);

const AlertDialog = ({ open, onOpenChange, children }) => {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => onOpenChange(false)} />
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {children}
      </div>
    </div>
  );
};

const Tabs = ({ defaultValue, children, className = '' }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);
  
  return (
    <div className={className}>
      {React.Children.map(children, child => 
        React.cloneElement(child, { activeTab, setActiveTab })
      )}
    </div>
  );
};

const TabsList = ({ children, activeTab, setActiveTab }) => (
  <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
    {React.Children.map(children, child => 
      React.cloneElement(child, { activeTab, setActiveTab })
    )}
  </div>
);

const TabsTrigger = ({ value, children, activeTab, setActiveTab }) => (
  <button
    onClick={() => setActiveTab(value)}
    className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
      activeTab === value
        ? 'bg-white text-blue-600 shadow-sm'
        : 'text-gray-600 hover:text-gray-900'
    }`}
  >
    {children}
  </button>
);

const TabsContent = ({ value, children, activeTab }) => {
  if (activeTab !== value) return null;
  return <div>{children}</div>;
};

// Events Management Component
const EventsManagement = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    capacity: '',
    imageUrl: ''
  });

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await fetchEvents();
      setEvents(data);
    } catch (error) {
      setError('Failed to load events. Please try again.');
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const eventData = {
        ...formData,
        capacity: parseInt(formData.capacity) || 100,
      };

      const newEvent = await createEvent(eventData);
      setEvents([newEvent, ...events]);

      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      setError('Failed to create event. Please try again.');
      console.error('Error creating event:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      date: '',
      location: '',
      capacity: '',
      imageUrl: ''
    });
    setError('');
  };

  const filteredEvents = events.filter(event =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.registrationLink.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    if (!dateString) return 'Date not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'upcoming': return 'default';
      case 'completed': return 'secondary';
      case 'cancelled': return 'destructive';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Events Management</h2>
          <p className="text-gray-600">Manage your events and monitor registrations</p>
        </div>
        <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          Add Event
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-center">
          <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search events by name or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading events...</p>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">
            {searchTerm ? 'No events found matching your search.' : 'No events created yet.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <Card key={event._id} className="overflow-hidden">
              <div className="aspect-video bg-gray-100 flex items-center justify-center">
                {event.image ? (
                  <img
                    src={event.image}
                    alt={event.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Calendar className="w-12 h-12 text-gray-400" />
                )}
              </div>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">
                      {event.name}
                    </h3>
                    <Badge variant={getStatusVariant(event.status)}>
                      {event.status}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {event.description}
                  </p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{event.registrationLink}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Users className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span>{event.registered || 0} / {event.capacity || 100} registered</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2 pt-2">
                    <Badge variant="success" className="text-xs">
                      {event.registered || 0} registered
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Event Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogHeader>
          <DialogTitle>
            Add New Event
          </DialogTitle>
        </DialogHeader>
        <DialogContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Event Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter event title"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter event description"
                rows={3}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Date & Time *</Label>
                <Input
                  id="date"
                  type="datetime-local"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  placeholder="100"
                  min="1"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Enter event location"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Create Event
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Mock StampsManagement component
const StampsManagement = ({ setStats }) => {
  const [items] = useState([
    { id: 1, name: 'Vintage Stamp Collection', price: 299.99, category: 'Stamps', stock: 12 },
    { id: 2, name: 'Rare Coin Set', price: 499.99, category: 'Coins', stock: 8 },
    { id: 3, name: 'Antique Postcards', price: 89.99, category: 'Postcards', stock: 25 }
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Items Management</h2>
          <p className="text-gray-600">Manage your stamp and coin inventory</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Item
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-4">
              <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                <Package className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
              <p className="text-gray-600 mb-2">{item.category}</p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-green-600">${item.price}</span>
                <span className="text-sm text-gray-500">Stock: {item.stock}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Main Admin Dashboard Component
const AdminPage = () => {
  const [stats, setStats] = useState({
    totalItems: 156,
    totalEvents: 12,
    totalOrders: 89,
    revenue: 45320
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your collectibles store and events</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Items</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalItems}</p>
                </div>
                <Package className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Events</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalEvents}</p>
                </div>
                <Calendar className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Revenue</p>
                                    <p className="text-2xl font-bold text-gray-900">${stats.revenue.toLocaleString()}</p>
                </div>
                <DollarSign className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for Managing Events and Items */}
        <Tabs defaultValue="events">
          <TabsList>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="items">Items</TabsTrigger>
          </TabsList>

          <TabsContent value="events">
            <EventsManagement />
          </TabsContent>
          <TabsContent value="items">
            <StampsManagement setStats={setStats} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPage;
