import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from 'react-hot-toast';
import { FaHospital, FaMapMarkerAlt, FaTint, FaSync } from "react-icons/fa";
import { Badge } from "../Components/ui/Badge";
import { Tabs, TabList, Tab, TabPanel } from "../Components/ui/Tabs";

const HospitalDashboard = () => {
  const [inventory, setInventory] = useState({
    aPositive: 0,
    aNegative: 0,
    bPositive: 0,
    bNegative: 0,
    abPositive: 0,
    abNegative: 0,
    oPositive: 0,
    oNegative: 0
  });
  const [loading, setLoading] = useState(true);
  const [updateStatus, setUpdateStatus] = useState({ message: '', error: false });
  const [hospital, setHospital] = useState(null);
  const [requests, setRequests] = useState({ pending: [], approved: [] });

  useEffect(() => {
    toast.success('Hospital logged in successfully!', {
      duration: 3000,
      position: 'top-right',
    });

    fetchProfile();
    fetchRequests();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('http://localhost:5000/api/hospitals/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to fetch profile');
      }

      const data = await response.json();
      console.log('Hospital Data:', data);
      setInventory(data.inventory || {});
      setHospital(data);
    } catch (err) {
      console.error('Profile fetch error:', err);
      toast.error(err.message || 'Failed to load hospital profile');
      // Redirect to login if unauthorized
      if (err.message.includes('unauthorized') || err.message.includes('token')) {
        window.location.href = '/login';
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('http://localhost:5000/api/hospitals/requests', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to fetch requests');
      }

      const data = await response.json();
      if (!data.pendingRequests || !data.approvedRequests) {
        throw new Error('Invalid response format');
      }

      setRequests({
        pending: data.pendingRequests || [],
        approved: data.approvedRequests || []
      });
    } catch (err) {
      console.error('Error fetching requests:', err);
      toast.error(err.message || 'Failed to load blood requests');
    }
  };

  const handleUpdateInventory = async () => {
    try {
      setUpdateStatus({ message: 'Updating...', error: false });
      
      const response = await fetch('http://localhost:5000/api/hospitals/inventory', {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(inventory)
      });

      if (!response.ok) {
        throw new Error('Failed to update inventory');
      }

      const data = await response.json();
      
      if (data.inventory) {
        setInventory(data.inventory);
        toast.success('Inventory updated successfully');
      }
      
      setUpdateStatus({ message: 'Inventory updated successfully!', error: false });
      
      setTimeout(() => {
        setUpdateStatus({ message: '', error: false });
      }, 3000);

    } catch (err) {
      console.error('Update error:', err);
      setUpdateStatus({ 
        message: err.message || 'Failed to update inventory', 
        error: true 
      });
      toast.error('Failed to update inventory');
    }
  };

  const handleRequestUpdate = async (requestId, status, notes) => {
    try {
      await axios.put(
        `http://localhost:5000/api/hospitals/requests/${requestId}`,
        { status, notes },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      fetchRequests(); // Refresh requests
      toast.success('Request updated successfully');
    } catch (err) {
      toast.error('Failed to update request');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-20 px-6 pb-6"> {/* Added pt-20 for navbar */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <FaHospital className="text-3xl text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-800">
              {hospital?.hospitalName || 'Hospital Dashboard'}
            </h1>
          </div>
          
          <div className="flex items-center text-gray-700 mb-4">
            <FaMapMarkerAlt className="text-xl text-blue-600 mr-2" />
            <p className="text-lg">
              {hospital?.location?.city || 'City'}, {hospital?.location?.state || 'State'}
            </p>
          </div>
        </div>

        {updateStatus.message && (
          <div className={`mb-4 p-4 rounded-lg ${
            updateStatus.error ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}>
            {updateStatus.message}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(inventory).map(([type, quantity]) => (
            <div key={type} className="bg-white p-6 rounded-lg shadow-md transform hover:scale-105 transition-transform">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <FaTint className="text-red-500 mr-3 text-xl" />
                  <label className="block text-lg font-semibold text-gray-700">
                    {type.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                </div>
                <span className="text-sm font-medium text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                  Units: {quantity}
                </span>
              </div>
              <input
                type="number"
                min="0"
                value={quantity}
                onChange={(e) => setInventory({ 
                  ...inventory, 
                  [type]: parseInt(e.target.value) || 0 
                })}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          ))}
        </div>

        <button
          onClick={handleUpdateInventory}
          className="mt-8 w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <FaSync className={updateStatus.message === 'Updating...' ? 'animate-spin' : ''} />
          Update Inventory
        </button>
      </div>

      <div className="max-w-4xl mx-auto mt-8">
        <Tabs defaultValue="pending">
          <TabList>
            <Tab value="pending">
              Pending Requests
              <Badge variant="danger" className="ml-2">
                {requests.pending.length}
              </Badge>
            </Tab>
            <Tab value="approved">
              Approved Requests
              <Badge variant="success" className="ml-2">
                {requests.approved.length}
              </Badge>
            </Tab>
          </TabList>

          <TabPanel value="pending">
            <div className="space-y-4">
              {requests.pending.map((request) => (
                <RequestCard
                  key={request._id}
                  request={request}
                  onUpdate={handleRequestUpdate}
                  type="pending"
                />
              ))}
            </div>
          </TabPanel>

          <TabPanel value="approved">
            <div className="space-y-4">
              {requests.approved.map((request) => (
                <RequestCard
                  key={request._id}
                  request={request}
                  type="approved"
                />
              ))}
            </div>
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
};

const RequestCard = ({ request, onUpdate, type }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg">
            Patient: {request.patientName}
          </h3>
          <p className="text-gray-600">Blood Group: {request.bloodGroup}</p>
          <p className="text-gray-600">Units Required: {request.unitsRequired}</p>
          <p className="text-gray-600">
            Requested by: {request.user.name} ({request.user.phone})
          </p>
          <p className="text-gray-600">
            Date: {new Date(request.requestDate).toLocaleDateString()}
          </p>
        </div>
        
        {type === 'pending' && (
          <div className="space-x-2">
            <button
              onClick={() => onUpdate(request._id, 'APPROVED')}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Approve
            </button>
            <button
              onClick={() => onUpdate(request._id, 'REJECTED')}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Reject
            </button>
          </div>
        )}
        
        {type === 'approved' && (
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
            Approved
          </span>
        )}
      </div>
    </div>
  );
};

export default HospitalDashboard;
