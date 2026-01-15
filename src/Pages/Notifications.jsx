import { useNotifications } from "../context/NotificationContext";
import { Bell, Check, Clock, Inbox } from "lucide-react"; 
import { motion, AnimatePresence } from "framer-motion"; 


export default function Notifications() {
  const { notifications, markAsRead } = useNotifications();

  if (!notifications.length) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center pt-32 px-4">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
          <Inbox className="text-gray-300 w-8 h-8" />
        </div>
        <h2 className="text-lg font-serif italic text-gray-900">Your Archive is Empty</h2>
        <p className="text-gray-400 text-sm mt-1 uppercase tracking-widest font-bold text-[10px]">
          No current updates from TimeSync
        </p>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 max-w-2xl mx-auto px-6">
      {/* Header Section */}
      <div className="flex items-end justify-between mb-10 border-b border-gray-100 pb-6">
        <div>
          <h1 className="text-3xl font-serif text-gray-900 tracking-tight">
            Updates <span className="italic text-gray-400 font-light">& Alerts</span>
          </h1>
          <p className="text-[10px] uppercase tracking-[0.3em] text-blue-600 font-bold mt-2">
            TimeSync Client Notifications
          </p>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            {notifications.filter(n => !n.is_read).length} New
          </span>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        <AnimatePresence>
          {notifications.map((n) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={n.id}
              onClick={() => !n.is_read && markAsRead(n.id)}
              className={`relative overflow-hidden group cursor-pointer border transition-all duration-300 rounded-xl p-5 ${
                n.is_read 
                  ? "bg-white border-gray-100 opacity-60 shadow-sm" 
                  : "bg-white border-blue-100 shadow-md ring-1 ring-blue-50"
              }`}
            >
              {/* Mark as Read Indicator Bar */}
              {!n.is_read && (
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-600" />
              )}

              <div className="flex items-start gap-4">
                {/* Icon Container */}
                <div className={`shrink-0 p-2 rounded-lg ${n.is_read ? 'bg-gray-50' : 'bg-blue-50'}`}>
                  <Bell className={`w-4 h-4 ${n.is_read ? 'text-gray-400' : 'text-blue-600'}`} />
                </div>

                {/* Content Container */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    {/* Title and Message aligned vertically */}
                    <div className="flex flex-col gap-1 w-full pr-4">
                      <h3 className={`text-sm font-bold uppercase tracking-tight ${n.is_read ? "text-gray-500" : "text-gray-900"}`}>
                        {n.title}
                      </h3>
                      <p className={`text-sm leading-relaxed ${n.is_read ? "text-gray-400" : "text-gray-600"}`}>
                        {n.message}
                      </p>
                    </div>
                    
                    {/* Floating Action Button */}
                    {!n.is_read && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(n.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-blue-100 rounded-full shrink-0"
                        title="Mark as read"
                      >
                        <Check className="w-4 h-4 text-blue-600" />
                      </button>
                    )}
                  </div>

                  {/* Metadata */}
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-3">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(n.created_at).toLocaleDateString()} • {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="mt-12 text-center">
        <p className="text-[9px] text-gray-300 font-bold uppercase tracking-[0.5em]">
          End of Notifications
        </p>
      </div>
    </div>
  );
}