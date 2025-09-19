export const MosqueIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 2C13.5 2 14.5 3 14.5 4.5V5.5H16.5C17 5.5 17.5 6 17.5 6.5V7.5H18.5C19 7.5 19.5 8 19.5 8.5V19C19.5 19.5 19 20 18.5 20H5.5C5 20 4.5 19.5 4.5 19V8.5C4.5 8 5 7.5 5.5 7.5H6.5V6.5C6.5 6 7 5.5 7.5 5.5H9.5V4.5C9.5 3 10.5 2 12 2Z"
      fill="currentColor"
    />
    <rect x="11" y="1" width="2" height="6" fill="currentColor" rx="1" />
    <circle cx="12" cy="0.5" r="0.5" fill="currentColor" />
  </svg>
)

export const PrayerIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L13.5 8.5H20L15 12.5L16.5 19L12 15L7.5 19L9 12.5L4 8.5H10.5L12 2Z" fill="currentColor" />
    <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" />
  </svg>
)

export const CommunityIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="9" cy="7" r="3" fill="currentColor" />
    <circle cx="15" cy="7" r="3" fill="currentColor" />
    <path d="M12 14C8 14 5 16 5 19V21H19V19C19 16 16 14 12 14Z" fill="currentColor" />
    <path d="M12 10C10 10 8 11 8 13V14H16V13C16 11 14 10 12 10Z" fill="currentColor" opacity="0.7" />
  </svg>
)

export const QiblaIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
    <path d="M12 2L14 10H22L16 14L18 22L12 18L6 22L8 14L2 10H10L12 2Z" fill="currentColor" />
    <circle cx="12" cy="12" r="2" fill="currentColor" />
  </svg>
)

export const NotificationBellIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 2C13.1 2 14 2.9 14 4C16.3 4.9 18 7.2 18 10V16L20 18V19H4V18L6 16V10C6 7.2 7.7 4.9 10 4C10 2.9 10.9 2 12 2Z"
      fill="currentColor"
    />
    <path d="M10 21C10 22.1 10.9 23 12 23C13.1 23 14 22.1 14 21" fill="currentColor" />
    <circle cx="18" cy="6" r="3" fill="#ef4444" className="animate-pulse" />
  </svg>
)
