import React, {useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

export const Support = () => {
  const user = useSelector((state) => state.user.userInfo);

  const userId = user?.id;
  const userName = user?.name || "User";

  const [tickets, setTickets] = useState([]);
  const [activeFaq, setActiveFaq] = useState(null);
  const [chatMode, setChatMode] = useState(false);
  const [currentTicket, setCurrentTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [formData, setFormData] = useState({
    subject: '',
    file: null,
  });

  const faqs = [
    {
      question: "How to book a designer?",
      answer: "You can book a designer by visiting our booking page and filling out the form."
    },
    {
      question: "How can I edit my floor plan?",
      answer: "Log into your account, go to 'My Projects', and click 'Edit' next to your floor plan."
    },
    {
      question: "What is your refund policy?",
      answer: "Refunds are applicable within 7 days of booking, subject to our refund policy terms."
    }
  ];

  // Fetch all tickets on mount
  useEffect(() => {
    if (userId) {
      axios.get(`${import.meta.env.VITE_BASE_URL}tickets/user/${userId}`)
        .then(res => setTickets(res.data.data))
        .catch(err => console.error("Error fetching tickets", err));
    }
  }, [userId]);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const handleChange = (e) => {
    const { name, files, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let filePath = "";

    // 1. Upload file first if selected
    if (formData.file) {
      const filePayload = new FormData();
      filePayload.append("file", formData.file);

      try {
        const fileRes = await axios.post(`${import.meta.env.VITE_BASE_URL}tickets/upload-image`, filePayload);
        filePath = fileRes.data.file_path;
      } catch (error) {
        console.error("File upload failed", error);
        return;
      }
    }

    // 2. Create ticket with uploaded file path
    const payload = {
      user_id: userId,
      subject: formData.subject,
      file: filePath, // use uploaded file path here
    };

    try {
      const res = await axios.post(`${import.meta.env.VITE_BASE_URL}tickets/create`, payload);
      const newTicket = res.data.data;
      setTickets([newTicket, ...tickets]);
      openTicketChat(newTicket.id);
      setFormData({ subject: '', file: null }); // Clear form
    } catch (error) {
      console.error("Ticket creation failed", error);
    }
  };


  const openTicketChat = async (ticketId) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}tickets/ticket/${ticketId}`);
      // console.log(res.data.data);

      setCurrentTicket(res.data.data.ticket);
      setMessages(res.data.data.messages);
      setChatMode(true);
    } catch (err) {
      console.error("Failed to load ticket chat", err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const payload = {
      user_id: userId,
      ticket_id: currentTicket.id,
      message: newMessage,
      sender_id: userId,
      created_by: userName,
    };

    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}tickets/add-message`, payload);
      setMessages(prev => [...prev, {
        ...payload,
        created_at: new Date().toISOString()
      }]);
      setNewMessage("");
    } catch (error) {
      console.error("Sending message failed", error);
    }
  };

  const handleStatusUpdate = async (ticketId, newStatus) => {
    if (!newStatus || newStatus === currentTicket.status) return;

    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}tickets/update-status/${ticketId}`, {
        status: newStatus
      });

      // Update UI state
      setCurrentTicket(prev => ({ ...prev, status: newStatus }));
      setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: newStatus } : t));
    } catch (error) {
      console.error("Status update failed", error);
    }
  };


  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-4">
      {/* Left Column - Contact & Ticket List */}
      <div>
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
          <p><strong>Phone:</strong> <a href="tel:18005703133" className="text-blue-600">18005703133</a></p>
          <p><strong>Email:</strong> <a href="mailto:info@seeb.com" className="text-blue-600">info@seeb.com</a></p>
        </div>

        <div className="bg-white rounded-xl shadow p-6 mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Your Previous Tickets</h2>
            <button
              onClick={() => {
                setChatMode(false); // show form
                setCurrentTicket(null); // reset selected ticket
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-base rounded"
            >
              Raise an Issue
            </button>
          </div>
          {tickets.length === 0 ? (
            <p className="text-gray-500">No previous tickets found.</p>
          ) : (
            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              {tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  onClick={() => openTicketChat(ticket.id)}
                  className="border p-4 rounded-lg cursor-pointer hover:bg-gray-100"
                >
                  <h3 className="font-semibold">{ticket.subject}</h3>
                  <p className="text-gray-600 capitalize"> {ticket.status.replace(/_/g, " ")}</p>
                  <p className="text-sm text-gray-500">{ticket.created_at?.split(" ")[0]}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Column - FAQs and Chat / Form */}
      <div>
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
          {faqs.map((faq, index) => (
            <div key={index} className="border-b">
              <button
                onClick={() => toggleFaq(index)}
                className="flex justify-between w-full py-3 text-left"
              >
                <span>{faq.question}</span>
                <span>{activeFaq === index ? "-" : "+"}</span>
              </button>
              {activeFaq === index && (
                <p className="py-2 text-gray-600">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow p-6 mt-8">
          {!chatMode ? (
            <>
              <h2 className="text-2xl font-bold mb-4">Raise a Ticket</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Subject"
                  className="w-full border p-2 rounded"
                  required
                />
                <input
                  type="file"
                  name="file"
                  onChange={handleChange}
                  className="w-full"
                />
                <button type="submit" className="bg-blue-600 text-white py-2 px-6 rounded">
                  Submit
                </button>
              </form>
            </>
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">{currentTicket.subject}</h2>
                <select
                  defaultValue=""
                  onChange={(e) => handleStatusUpdate(currentTicket.id, e.target.value)}
                  className="border px-3 py-2 rounded-md text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm capitalize"
                >
                  <option value="" disabled hidden>
                    Update Status
                  </option>
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="closed">Closed</option>
                </select>

              </div>

              <div className="bg-gray-100 h-80 overflow-y-auto p-4 space-y-4 rounded-lg">
                {/* Show ticket image if exists */}
                {currentTicket?.file && (
                          <div className="flex justify-end">
                            <img
                              src={`${import.meta.env.VITE_BASE_URL}${currentTicket.file}`}
                              alt="ticket attachment"
                              className="rounded max-w-xs max-h-48 object-cover border"
                            />
                          </div>
                        )}
                {messages.map((msg, idx) => {
                  const isUser = msg.user_id === String(userId);
                  return (
                    <div key={idx} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                      <div className={`${isUser ? "bg-blue-500 text-white" : "bg-gray-300 text-black"} p-3 rounded-lg max-w-xs`}>
                        
                        <div>{msg.message}</div>
                        <div className="text-xs opacity-70 mt-1 text-right">
                          {new Date(msg.created_at).toLocaleDateString()} •{" "}
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <form onSubmit={handleSendMessage} className="flex gap-2 mt-4">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 border p-2 rounded"
                  placeholder="Type your message..."
                />
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                  Send
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
